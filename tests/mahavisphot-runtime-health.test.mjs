import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const collectors = require("../editor/runtime-collectors.js");

test("collectAll reports all seven runtimes", () => {
  const r = collectors.collectAll();
  assert.equal(r.runtimes.length, 7);
  const names = r.runtimes.map((x) => x.runtime).sort();
  assert.deepEqual(names, ["audio", "cloud_ai", "editor", "hybrid_ai", "local_ai", "media", "render"]);
});

test("every runtime has a valid status and structured checks", () => {
  const r = collectors.collectAll();
  for (const rt of r.runtimes) {
    assert.ok(["ready", "degraded", "blocked", "unknown"].includes(rt.status), `${rt.runtime}: ${rt.status}`);
    assert.ok(Array.isArray(rt.checks) && rt.checks.length > 0);
    for (const c of rt.checks) assert.equal(typeof c.ok, "boolean");
  }
});

test("editor runtime is ready (crud loads, persistence writable)", () => {
  assert.equal(collectors.editorRuntime().status, "ready");
});

test("local/cloud/hybrid AI are blocked without config (honest gating)", () => {
  // ensure no creds leak in from the env this runs in
  delete process.env.MAHAVISPHOT_MODEL_DIR;
  delete process.env.MAHAVISPHOT_CLOUD_API_KEY;
  delete process.env.MAHAVISPHOT_PROVIDER_KEY;
  assert.equal(collectors.localAiRuntime().status, "blocked");
  assert.equal(collectors.cloudAiRuntime().status, "blocked");
  assert.equal(collectors.hybridAiRuntime("blocked", "blocked").status, "blocked");
});

test("productionReady is false while any runtime is not ready", () => {
  const r = collectors.collectAll();
  if (r.blockers.length > 0) assert.equal(r.productionReady, false);
  else assert.equal(r.productionReady, true);
  // blockers and productionReady must agree
  assert.equal(r.productionReady, r.blockers.length === 0);
});
