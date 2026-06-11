"use strict";
/**
 * Mahavisphot — AI runtime adapter layer (Step 8 scaffold).
 *
 * HONEST SCOPE: this wires real adapter *interfaces*, a job lifecycle, schema
 * validation, privacy-tier routing, and a privacy-preserving audit trail. It
 * does NOT claim working trained-model inference.
 *
 *   - local / cloud / hybrid modes are gated: they report `ready:false` until a
 *     real model runtime / provider credentials are configured, and jobs to them
 *     return status `blocked` with the reason. No fabricated inference.
 *   - the `reference` mode is an explicitly labelled DETERMINISTIC stub: it emits
 *     reproducible parameters derived from a hash of the input (engine
 *     "deterministic-reference"). It exists to test routing, validation, the job
 *     lifecycle, and determinism — not to mimic a real model.
 */
const crypto = require("node:crypto");
const fs = require("node:fs");

// ---- capability registry (mirrors the studio AI panels) ----
const CAPABILITIES = {
  face_swap: { required: ["sourceFrame", "targetIdentity"], description: "Map a target identity onto a performer." },
  motion_track: { required: ["clipId"], description: "Solve 2D camera / point tracks for a clip." },
  upscale: { required: ["assetId", "scale"], description: "Super-resolution upscale of an asset." },
  frame_gen: { required: ["prompt"], description: "Generate frames from a text prompt." },
  depth_estimate: { required: ["assetId"], description: "Monocular depth map for an asset." },
  particle_sim: { required: ["beat"], description: "Beat-bound particle field synthesis." },
};
const MODES = ["local", "cloud", "hybrid", "reference"];
const PRIVACY_TIERS = ["local-only", "shareable"];

class AiRuntimeError extends Error {
  constructor(code, message, details) {
    super(message);
    this.name = "AiRuntimeError";
    this.code = code;
    if (details) this.details = details;
  }
}

function stableStringify(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  return `{${Object.keys(value).sort().map((k) => `${JSON.stringify(k)}:${stableStringify(value[k])}`).join(",")}}`;
}
function digest(value) {
  return crypto.createHash("sha256").update(stableStringify(value)).digest("hex");
}

// ---- adapter interface ----
class AiAdapter {
  constructor({ id, mode, engine, capabilities }) {
    this.id = id;
    this.mode = mode;
    this.engine = engine;
    this.capabilities = capabilities || Object.keys(CAPABILITIES);
  }
  supports(capability) { return this.capabilities.includes(capability); }
  isReady() { return { ready: false, reason: "abstract adapter" }; }
  describe() {
    const r = this.isReady();
    return { id: this.id, mode: this.mode, engine: this.engine, capabilities: this.capabilities, ready: r.ready, reason: r.reason || null };
  }
  // eslint-disable-next-line no-unused-vars
  async infer(job) { throw new AiRuntimeError("ai_not_implemented", `${this.id} has no inference implementation`); }
}

// Deterministic, reproducible stub — NOT a trained model. Used by the harness.
class DeterministicReferenceAdapter extends AiAdapter {
  constructor() {
    super({ id: "reference-deterministic", mode: "reference", engine: "deterministic-reference" });
  }
  isReady() { return { ready: true }; }
  async infer(job) {
    const seed = job.seed === undefined ? 0 : Number(job.seed) || 0;
    const inputDigest = digest({ capability: job.capability, input: job.input, seed });
    // derive reproducible numeric parameters from the digest bytes
    const bytes = Buffer.from(inputDigest, "hex");
    const params = Array.from({ length: 6 }, (_, i) => +((bytes[i] / 255).toFixed(4)));
    return {
      executed: true,
      inferenceKind: "deterministic-stub",
      engine: this.engine,
      capability: job.capability,
      inputDigest,
      outputDigest: digest({ inputDigest, params }),
      parameters: params,
      note: "Reference adapter output is a deterministic hash transform, not trained-model inference.",
    };
  }
}

// Real local model runtime — gated until a populated model directory exists.
class LocalModelAdapter extends AiAdapter {
  constructor(modelDir) {
    super({ id: "local-model", mode: "local", engine: "local-model-runtime" });
    this.modelDir = modelDir || process.env.MAHAVISPHOT_MODEL_DIR || "";
  }
  isReady() {
    try {
      if (this.modelDir && fs.existsSync(this.modelDir) && fs.readdirSync(this.modelDir).length > 0) return { ready: true };
    } catch { /* fall through */ }
    return { ready: false, reason: "no local model runtime configured (set MAHAVISPHOT_MODEL_DIR to a populated model directory)" };
  }
  async infer() {
    throw new AiRuntimeError("ai_runtime_blocked", this.isReady().reason || "local runtime unavailable");
  }
}

// Cloud provider — gated until credentials exist. Never performs network calls here.
class CloudProviderAdapter extends AiAdapter {
  constructor(apiKey) {
    super({ id: "cloud-provider", mode: "cloud", engine: "cloud-provider-adapter" });
    this.apiKey = apiKey || process.env.MAHAVISPHOT_CLOUD_API_KEY || process.env.MAHAVISPHOT_PROVIDER_KEY || "";
  }
  isReady() {
    return this.apiKey ? { ready: true } : { ready: false, reason: "no provider credentials (set MAHAVISPHOT_CLOUD_API_KEY)" };
  }
  async infer() {
    throw new AiRuntimeError("ai_runtime_blocked", this.isReady().reason || "cloud runtime unavailable");
  }
}

// Hybrid planner — splits between local and cloud and enforces the privacy tier.
class HybridPlanner extends AiAdapter {
  constructor(local, cloud) {
    super({ id: "hybrid-planner", mode: "hybrid", engine: "hybrid-orchestrator" });
    this.local = local;
    this.cloud = cloud;
  }
  isReady() {
    const l = this.local.isReady();
    const c = this.cloud.isReady();
    if (l.ready || c.ready) return { ready: true };
    return { ready: false, reason: "hybrid needs at least one ready leg; both local and cloud are unconfigured" };
  }
  // Returns { leg, adapter } or { blocked, reason } — privacy tier enforced.
  plan(privacyTier) {
    const localReady = this.local.isReady().ready;
    const cloudReady = this.cloud.isReady().ready;
    if (privacyTier === "local-only") {
      if (localReady) return { leg: "local", adapter: this.local };
      return { blocked: true, reason: "privacy tier 'local-only' requires a ready local runtime; refusing cloud fallback" };
    }
    if (localReady) return { leg: "local", adapter: this.local };
    if (cloudReady) return { leg: "cloud", adapter: this.cloud };
    return { blocked: true, reason: "no ready hybrid leg (local + cloud both unconfigured)" };
  }
}

class AiRuntime {
  constructor({ adapters } = {}) {
    this.adapters = new Map();
    this._audit = [];
    (adapters || []).forEach((a) => this.registerAdapter(a));
  }
  registerAdapter(adapter) { this.adapters.set(adapter.mode, adapter); return this; }
  adapterFor(mode) { return this.adapters.get(mode) || null; }

  capabilities() {
    return {
      capabilities: Object.entries(CAPABILITIES).map(([id, def]) => ({ id, ...def })),
      modes: MODES.filter((m) => this.adapters.has(m)),
      adapters: [...this.adapters.values()].map((a) => a.describe()),
      privacyTiers: PRIVACY_TIERS,
    };
  }

  validateJob(job) {
    const errors = [];
    if (!job || typeof job !== "object") return { ok: false, errors: ["job must be an object"] };
    if (!CAPABILITIES[job.capability]) errors.push(`unknown capability: ${job.capability}`);
    if (!MODES.includes(job.mode)) errors.push(`unknown mode: ${job.mode}`);
    if (job.privacyTier !== undefined && !PRIVACY_TIERS.includes(job.privacyTier)) errors.push(`unknown privacyTier: ${job.privacyTier}`);
    if (job.input === undefined || job.input === null || typeof job.input !== "object" || Array.isArray(job.input)) {
      errors.push("input must be an object");
    } else if (CAPABILITIES[job.capability]) {
      for (const field of CAPABILITIES[job.capability].required) {
        if (job.input[field] === undefined || job.input[field] === null || job.input[field] === "") {
          errors.push(`missing required input '${field}' for capability ${job.capability}`);
        }
      }
    }
    return { ok: errors.length === 0, errors };
  }

  _route(job) {
    const mode = job.mode;
    const adapter = this.adapterFor(mode);
    if (!adapter) return { blocked: true, reason: `mode '${mode}' is not registered` };
    if (!adapter.supports(job.capability)) return { blocked: true, reason: `adapter '${adapter.id}' does not support ${job.capability}` };
    if (mode === "hybrid") {
      const plan = adapter.plan(job.privacyTier || "shareable");
      if (plan.blocked) return { blocked: true, reason: plan.reason, planner: adapter.id };
      return { adapter: plan.adapter, leg: plan.leg, planner: adapter.id };
    }
    return { adapter };
  }

  async submit(job, context = {}) {
    const id = `aijob_${crypto.randomUUID()}`;
    const at = new Date().toISOString();
    const privacyTier = job && job.privacyTier ? job.privacyTier : "shareable";
    const base = { id, at, userId: context.userId || null, mode: job && job.mode, capability: job && job.capability, privacyTier };

    const validation = this.validateJob(job);
    if (!validation.ok) {
      const entry = { ...base, status: "rejected", reason: "validation failed", errors: validation.errors };
      this._audit.push(entry);
      throw new AiRuntimeError("ai_validation_failed", "AI job validation failed", validation.errors);
    }

    const inputDigest = digest(job.input); // privacy-preserving: audit stores the digest, never raw input
    const routed = this._route(job);
    if (routed.blocked) {
      const entry = { ...base, status: "blocked", adapter: routed.planner || null, leg: null, inputDigest, reason: routed.reason };
      this._audit.push(entry);
      return { id, status: "blocked", reason: routed.reason, routedTo: routed.planner || null };
    }

    const readiness = routed.adapter.isReady();
    if (!readiness.ready) {
      const entry = { ...base, status: "blocked", adapter: routed.adapter.id, leg: routed.leg || null, inputDigest, reason: readiness.reason };
      this._audit.push(entry);
      return { id, status: "blocked", reason: readiness.reason, routedTo: routed.adapter.id, leg: routed.leg || null };
    }

    let result;
    try {
      result = await routed.adapter.infer(job);
    } catch (err) {
      // A "ready" adapter whose execution is not implemented (real local/cloud
      // engines in this scaffold) resolves to an honest blocked outcome rather
      // than a thrown error or any fabricated result.
      const reason = err && err.message ? err.message : "inference failed";
      const blockedEntry = { ...base, status: "blocked", adapter: routed.adapter.id, leg: routed.leg || null, inputDigest, reason };
      this._audit.push(blockedEntry);
      return { id, status: "blocked", reason, routedTo: routed.adapter.id, leg: routed.leg || null };
    }
    const entry = {
      ...base, status: "completed", adapter: routed.adapter.id, leg: routed.leg || null,
      engine: routed.adapter.engine, inputDigest, outputDigest: result.outputDigest || null,
      inferenceKind: result.inferenceKind || null,
    };
    this._audit.push(entry);
    return { id, status: "completed", routedTo: routed.adapter.id, leg: routed.leg || null, result };
  }

  audit(filter = {}) {
    let entries = this._audit;
    if (filter.userId) entries = entries.filter((e) => e.userId === filter.userId);
    if (filter.id) entries = entries.filter((e) => e.id === filter.id);
    return entries.slice();
  }
}

// Production wiring: real modes gated, reference mode available for harness/dry-run.
function createDefaultRuntime() {
  const local = new LocalModelAdapter();
  const cloud = new CloudProviderAdapter();
  return new AiRuntime({ adapters: [local, cloud, new HybridPlanner(local, cloud), new DeterministicReferenceAdapter()] });
}

module.exports = {
  CAPABILITIES, MODES, PRIVACY_TIERS,
  AiRuntimeError, AiAdapter,
  DeterministicReferenceAdapter, LocalModelAdapter, CloudProviderAdapter, HybridPlanner,
  AiRuntime, createDefaultRuntime,
  digest, stableStringify,
};
