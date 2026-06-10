#!/usr/bin/env node
/**
 * Step 2 — build a global search index over every navigable surface:
 *   UX routes, API contracts, DB tables, CRUD entities, workflows, runtimes.
 * Each item carries a status badge (preview | scaffold | planned | blocked | ready)
 * so blocked/gated surfaces stay visible but clearly marked.
 *
 * Outputs:
 *   public/mahavisphot/search-index.json   (served / fetched)
 *   public/mahavisphot/search-index.js     (window.MVP_SEARCH — for offline studio palette)
 */
import { createRequire } from "node:module";
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const load = (p) => JSON.parse(readFileSync(join(ROOT, p), "utf8"));

const pages = load("src/mahavisphot/data/mahavisphot-pages.json");
const api = load("src/mahavisphot/data/mahavisphot-api.json");
const tables = load("src/mahavisphot/data/mahavisphot-tables.json");
const schema = load("src/mahavisphot/data/mahavisphot-schema.json");
const crud = require(join(ROOT, "editor/crud.js"));

const items = [];
const push = (it) => items.push(it);

// --- UX routes ---
for (const p of pages) {
  push({
    kind: "route",
    id: p.id,
    title: p.title,
    path: p.route,
    module: p.moduleId,
    status: p.status || "scaffold",
    runtimeModes: p.runtimeModes || [],
    keywords: [p.title, p.id, p.route, p.moduleId, p.description].filter(Boolean).join(" ").toLowerCase(),
  });
}

// --- API contracts ---
for (const e of api) {
  push({
    kind: "api",
    id: e.id,
    title: `${e.method} ${e.path}`,
    path: e.path,
    module: e.moduleId,
    status: e.status || "scaffold",
    keywords: [e.id, e.method, e.path, e.moduleId, e.description].filter(Boolean).join(" ").toLowerCase(),
  });
}

// --- DB tables ---
for (const t of tables) {
  push({
    kind: "table",
    id: t.name,
    title: t.name,
    module: t.moduleId,
    status: t.status || "scaffold",
    keywords: [t.name, t.moduleId, t.description].filter(Boolean).join(" ").toLowerCase(),
  });
}

// --- Live CRUD surfaces (Step 3 — implemented + persisted) ---
for (const entity of crud.ENTITIES) {
  push({
    kind: "crud",
    id: `crud.${entity}`,
    title: `CRUD: ${entity}`,
    path: `/api/v1/${entity}`,
    module: "crud",
    status: "preview", // real, persisted, schema-validated
    keywords: `crud ${entity} create read update delete persistence /api/v1/${entity}`.toLowerCase(),
  });
}

// --- Workflows (module-level) ---
const modules = schema.modules || [];
for (const m of modules) {
  const id = typeof m === "string" ? m : m.id || m.name;
  const title = typeof m === "string" ? m : m.title || m.name || id;
  push({
    kind: "workflow",
    id: `workflow.${id}`,
    title: `Workflow: ${title}`,
    module: id,
    status: "scaffold",
    keywords: `workflow ${id} ${title}`.toLowerCase(),
  });
}

// --- Runtimes (blocked but visible) ---
const runtimeModes = schema.runtimeModes || ["local", "cloud", "hybrid"];
for (const rm of runtimeModes) {
  const id = typeof rm === "string" ? rm : rm.id || rm.mode;
  push({
    kind: "runtime",
    id: `runtime.${id}`,
    title: `Runtime: ${id}`,
    module: "runtime",
    status: "blocked", // gated until runtime evidence (Step 7/8)
    keywords: `runtime ${id} ai inference blocked gated`.toLowerCase(),
  });
}

const byKind = items.reduce((acc, it) => ((acc[it.kind] = (acc[it.kind] || 0) + 1), acc), {});
const byStatus = items.reduce((acc, it) => ((acc[it.status] = (acc[it.status] || 0) + 1), acc), {});
const index = { generatedAt: new Date().toISOString(), total: items.length, byKind, byStatus, items };

const outDir = join(ROOT, "public/mahavisphot");
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "search-index.json"), JSON.stringify(index, null, 2));
writeFileSync(join(outDir, "search-index.js"), `window.MVP_SEARCH = ${JSON.stringify(index)};\n`);

console.log(`search index: ${index.total} items`);
console.log(`  by kind:   ${JSON.stringify(byKind)}`);
console.log(`  by status: ${JSON.stringify(byStatus)}`);
