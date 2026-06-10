"use strict";
/**
 * Mahavisphot — local, schema-validated CRUD store.
 *
 * Standalone (no HTTP dependency) so it is unit-testable. The server mounts it
 * under /api/v1/<entity>. Every write is schema-validated; unknown fields,
 * missing required fields, bad enums, and wrong types are rejected.
 *
 * Persistence: one JSON file per (user, entity) under <baseDir>/<userId>/<entity>.json,
 * written atomically (temp + rename), mirroring the server's existing pattern.
 */
const fsp = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");

// ---- shared optional fields every entity carries ----
const COMMON = {
  projectId: { type: "string" },
};

// ---- entity schemas (Step 3: 13 CRUD domains) ----
const SCHEMAS = {
  assets: {
    name: { type: "string", required: true },
    kind: { type: "enum", values: ["video", "audio", "image", "frame", "proxy"], required: true },
    path: { type: "string", required: true },
    durationSec: { type: "number" },
    width: { type: "number" },
    height: { type: "number" },
    fps: { type: "number" },
    meta: { type: "object" },
  },
  scenes: {
    title: { type: "string", required: true },
    index: { type: "number" },
    description: { type: "string" },
    beat: { type: "number" },
  },
  shots: {
    sceneId: { type: "string" },
    title: { type: "string", required: true },
    startSec: { type: "number" },
    endSec: { type: "number" },
    cameraNote: { type: "string" },
  },
  timelines: {
    name: { type: "string", required: true },
    fps: { type: "number", default: 30 },
    durationSec: { type: "number" },
    resolution: { type: "string" },
  },
  tracks: {
    timelineId: { type: "string", required: true },
    kind: { type: "enum", values: ["video", "audio", "caption", "vfx", "marker"], required: true },
    name: { type: "string", required: true },
    index: { type: "number", default: 0 },
    locked: { type: "boolean", default: false },
    muted: { type: "boolean", default: false },
  },
  clips: {
    trackId: { type: "string", required: true },
    assetId: { type: "string" },
    name: { type: "string" },
    startSec: { type: "number", required: true },
    durationSec: { type: "number", required: true },
    inSec: { type: "number" },
    outSec: { type: "number" },
  },
  compositions: {
    name: { type: "string", required: true },
    parentId: { type: "string" },
    timelineId: { type: "string" },
    width: { type: "number" },
    height: { type: "number" },
  },
  captions: {
    timelineId: { type: "string" },
    startSec: { type: "number", required: true },
    endSec: { type: "number", required: true },
    textHi: { type: "string" },
    textEn: { type: "string" },
    style: { type: "object" },
  },
  markers: {
    timelineId: { type: "string" },
    atSec: { type: "number", required: true },
    label: { type: "string", required: true },
    color: { type: "string" },
  },
  notes: {
    targetType: { type: "string" },
    targetId: { type: "string" },
    body: { type: "string", required: true },
    author: { type: "string" },
  },
  vfx_nodes: {
    clipId: { type: "string" },
    type: {
      type: "enum",
      values: ["red_sonic", "eclipse", "vignette", "grain", "chromatic", "letterbox", "transition"],
      required: true,
    },
    params: { type: "object" },
    enabled: { type: "boolean", default: true },
  },
  render_jobs: {
    timelineId: { type: "string" },
    status: {
      type: "enum",
      values: ["queued", "running", "done", "failed", "blocked"],
      default: "queued",
    },
    preset: { type: "string" },
    output: { type: "string" },
    intensity: { type: "number" },
    captions: { type: "boolean" },
  },
  evidence_artifacts: {
    kind: {
      type: "enum",
      values: ["preview_mp4", "board_png", "json", "tsv", "caption_burn", "vfx_window", "failure"],
      required: true,
    },
    path: { type: "string" },
    runtime: { type: "string" },
    status: { type: "string" },
    meta: { type: "object" },
  },
};

const ENTITIES = Object.keys(SCHEMAS);

class ValidationError extends Error {
  constructor(errors) {
    super("Validation failed");
    this.name = "ValidationError";
    this.errors = errors;
  }
}

function typeOk(spec, value) {
  switch (spec.type) {
    case "string":
      return typeof value === "string";
    case "number":
      return typeof value === "number" && Number.isFinite(value);
    case "boolean":
      return typeof value === "boolean";
    case "object":
      return value !== null && typeof value === "object" && !Array.isArray(value);
    case "enum":
      return spec.values.includes(value);
    default:
      return false;
  }
}

/**
 * Validate input against an entity schema.
 * @returns {{ok:boolean, value:object, errors:string[]}}
 */
function validate(entity, input, options = {}) {
  const partial = !!options.partial;
  const schema = SCHEMAS[entity];
  if (!schema) return { ok: false, value: {}, errors: [`unknown entity: ${entity}`] };
  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, value: {}, errors: ["body must be an object"] };
  }
  const full = { ...COMMON, ...schema };
  const errors = [];
  const value = {};

  for (const key of Object.keys(input)) {
    if (!(key in full)) errors.push(`unknown field: ${key}`);
  }
  for (const [field, spec] of Object.entries(full)) {
    const has = Object.prototype.hasOwnProperty.call(input, field);
    if (has) {
      if (!typeOk(spec, input[field])) {
        const expected = spec.type === "enum" ? `one of [${spec.values.join(", ")}]` : spec.type;
        errors.push(`field '${field}' must be ${expected}`);
      } else {
        value[field] = input[field];
      }
    } else if (!partial) {
      if (spec.default !== undefined) value[field] = spec.default;
      else if (spec.required) errors.push(`missing required field: ${field}`);
    }
  }
  return { ok: errors.length === 0, value, errors };
}

function safeSegment(s) {
  return String(s || "anon").replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 80) || "anon";
}

async function readCollection(filePath) {
  try {
    const parsed = JSON.parse(await fsp.readFile(filePath, "utf8"));
    return Array.isArray(parsed.records) ? parsed : { records: [] };
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    return { records: [] };
  }
}

async function writeCollection(filePath, data) {
  await fsp.mkdir(path.dirname(filePath), { recursive: true });
  const tempPath = `${filePath}.${process.pid}.${Date.now()}.${Math.random().toString(16).slice(2)}.tmp`;
  await fsp.writeFile(tempPath, JSON.stringify(data, null, 2), "utf8");
  await fsp.rename(tempPath, filePath);
}

/**
 * Create a store rooted at baseDir. All methods are async.
 */
function createStore(baseDir) {
  const fileFor = (userId, entity) => path.join(baseDir, safeSegment(userId), `${entity}.json`);

  async function list(userId, entity, filter = {}) {
    if (!SCHEMAS[entity]) throw new Error(`unknown entity: ${entity}`);
    const { records } = await readCollection(fileFor(userId, entity));
    if (filter.projectId) return records.filter((r) => r.projectId === filter.projectId);
    return records;
  }

  async function get(userId, entity, id) {
    if (!SCHEMAS[entity]) throw new Error(`unknown entity: ${entity}`);
    const { records } = await readCollection(fileFor(userId, entity));
    return records.find((r) => r.id === id) || null;
  }

  async function create(userId, entity, input) {
    const result = validate(entity, input, { partial: false });
    if (!result.ok) throw new ValidationError(result.errors);
    const filePath = fileFor(userId, entity);
    const coll = await readCollection(filePath);
    const now = new Date().toISOString();
    const record = {
      id: `${entity}_${crypto.randomUUID()}`,
      entity,
      ...result.value,
      createdAt: now,
      updatedAt: now,
    };
    coll.records.push(record);
    await writeCollection(filePath, coll);
    return record;
  }

  async function update(userId, entity, id, patch) {
    const result = validate(entity, patch, { partial: true });
    if (!result.ok) throw new ValidationError(result.errors);
    const filePath = fileFor(userId, entity);
    const coll = await readCollection(filePath);
    const idx = coll.records.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    coll.records[idx] = {
      ...coll.records[idx],
      ...result.value,
      id: coll.records[idx].id,
      entity,
      createdAt: coll.records[idx].createdAt,
      updatedAt: new Date().toISOString(),
    };
    await writeCollection(filePath, coll);
    return coll.records[idx];
  }

  async function remove(userId, entity, id) {
    if (!SCHEMAS[entity]) throw new Error(`unknown entity: ${entity}`);
    const filePath = fileFor(userId, entity);
    const coll = await readCollection(filePath);
    const before = coll.records.length;
    coll.records = coll.records.filter((r) => r.id !== id);
    if (coll.records.length === before) return false;
    await writeCollection(filePath, coll);
    return true;
  }

  return { list, get, create, update, remove, fileFor };
}

module.exports = { SCHEMAS, ENTITIES, COMMON, validate, createStore, ValidationError };
