import test from "node:test";
import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import fs from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");

function loadIndex() {
  const p = path.join(ROOT, "public/mahavisphot/search-index.json");
  assert.ok(fs.existsSync(p), "search-index.json missing — run npm run mahavisphot:search-index");
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

test("index covers every surface category", () => {
  const idx = loadIndex();
  assert.equal(idx.byKind.route, 400);
  assert.equal(idx.byKind.api, 150);
  assert.equal(idx.byKind.table, 75);
  assert.equal(idx.byKind.crud, 13);
  assert.equal(idx.byKind.live_endpoint, 6);
  assert.equal(idx.byKind.runtime, 3);
  assert.ok(idx.byKind.workflow >= 1);
  assert.equal(idx.total, idx.items.length);
});

test("every item carries a known status badge", () => {
  const idx = loadIndex();
  const allowed = new Set(["preview", "scaffold", "planned", "blocked", "ready"]);
  for (const it of idx.items) {
    assert.ok(allowed.has(it.status), `bad status ${it.status} on ${it.id}`);
    assert.ok(it.title && it.kind && it.id);
  }
});

test("blocked runtimes stay visible but gated", () => {
  const idx = loadIndex();
  const runtimes = idx.items.filter((it) => it.kind === "runtime");
  assert.equal(runtimes.length, 3);
  assert.ok(runtimes.every((r) => r.status === "blocked"));
});

test("live CRUD surfaces are present and marked preview", () => {
  const idx = loadIndex();
  const crud = require("../editor/crud.js");
  const surfaces = idx.items.filter((it) => it.kind === "crud");
  assert.equal(surfaces.length, crud.ENTITIES.length);
  assert.ok(surfaces.every((s) => s.status === "preview" && s.path.startsWith("/api/v1/")));
});

test("implemented runtime endpoints are searchable", () => {
  const idx = loadIndex();
  const live = idx.items.filter((it) => it.kind === "live_endpoint");
  assert.equal(live.length, 6);
  assert.ok(live.some((item) => item.path === "/api/v1/render/compile"));
  assert.ok(live.some((item) => item.path === "/api/v1/media/ingest"));
  assert.ok(live.every((item) => item.status === "preview"));
});

test("HTTP /api/v1/search filters by query, kind, and status", async () => {
  process.env.MAHAVISPHOT_DATA_DIR = fs.mkdtempSync(path.join(os.tmpdir(), "mvp-search-"));
  const mod = require("../editor/server.js");
  await mod.startServer(0, "127.0.0.1", "t");
  const base = `http://127.0.0.1:${mod.server.address().port}`;

  let r = await fetch(`${base}/api/v1/search?q=editor`);
  let j = await r.json();
  assert.equal(r.status, 200);
  assert.ok(j.total > 0);

  r = await fetch(`${base}/api/v1/search?kind=runtime`);
  j = await r.json();
  assert.equal(j.total, 3);
  assert.ok(j.items.every((it) => it.status === "blocked"));

  r = await fetch(`${base}/api/v1/search?kind=crud&status=preview`);
  j = await r.json();
  assert.ok(j.total >= 13);

  // runtime health endpoint
  r = await fetch(`${base}/api/v1/health/runtimes`);
  j = await r.json();
  assert.equal(j.runtimes.length, 7);
  assert.equal(typeof j.productionReady, "boolean");

  mod.server.close();
});
