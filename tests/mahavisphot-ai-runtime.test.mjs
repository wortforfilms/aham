import test from "node:test";
import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import fs from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const ai = require("../editor/ai-runtime.js");

function cleanEnv() {
  delete process.env.MAHAVISPHOT_MODEL_DIR;
  delete process.env.MAHAVISPHOT_CLOUD_API_KEY;
  delete process.env.MAHAVISPHOT_PROVIDER_KEY;
}

test("capability + mode registry is exposed and honest about readiness", () => {
  cleanEnv();
  const rt = ai.createDefaultRuntime();
  const caps = rt.capabilities();
  assert.ok(caps.capabilities.some((c) => c.id === "face_swap"));
  assert.deepEqual(caps.modes.sort(), ["cloud", "hybrid", "local", "reference"]);
  const byMode = Object.fromEntries(caps.adapters.map((a) => [a.mode, a]));
  // real modes are gated; reference is ready (deterministic stub)
  assert.equal(byMode.local.ready, false);
  assert.equal(byMode.cloud.ready, false);
  assert.equal(byMode.hybrid.ready, false);
  assert.equal(byMode.reference.ready, true);
  assert.equal(byMode.reference.engine, "deterministic-reference");
});

test("job validation rejects unknown capability / mode / missing inputs", () => {
  const rt = ai.createDefaultRuntime();
  assert.equal(rt.validateJob({ capability: "nope", mode: "reference", input: {} }).ok, false);
  assert.equal(rt.validateJob({ capability: "upscale", mode: "wat", input: { assetId: "a", scale: 2 } }).ok, false);
  const missing = rt.validateJob({ capability: "upscale", mode: "reference", input: { assetId: "a" } });
  assert.equal(missing.ok, false);
  assert.ok(missing.errors.some((e) => /scale/.test(e)));
  assert.equal(rt.validateJob({ capability: "upscale", mode: "reference", input: { assetId: "a", scale: 2 } }).ok, true);
});

test("reference adapter is DETERMINISTIC (same input -> same output digest)", async () => {
  const rt = ai.createDefaultRuntime();
  const job = { capability: "frame_gen", mode: "reference", input: { prompt: "द लॉन्ग रोड" }, seed: 7 };
  const a = await rt.submit(job, { userId: "u1" });
  const b = await rt.submit(job, { userId: "u1" });
  assert.equal(a.status, "completed");
  assert.equal(a.result.inferenceKind, "deterministic-stub");
  assert.equal(a.result.outputDigest, b.result.outputDigest);
  // different seed -> different output (still deterministic)
  const c = await rt.submit({ ...job, seed: 8 }, { userId: "u1" });
  assert.notEqual(a.result.outputDigest, c.result.outputDigest);
});

test("real local/cloud/hybrid modes return BLOCKED, not fake inference", async () => {
  cleanEnv();
  const rt = ai.createDefaultRuntime();
  const input = { sourceFrame: "f1", targetIdentity: "id1" };
  for (const mode of ["local", "cloud", "hybrid"]) {
    const r = await rt.submit({ capability: "face_swap", mode, input }, { userId: "u1" });
    assert.equal(r.status, "blocked", `${mode} should be blocked`);
    assert.ok(typeof r.reason === "string" && r.reason.length > 0);
    assert.equal(r.result, undefined);
  }
});

test("hybrid planner enforces privacy tier: local-only never routes to cloud", async () => {
  cleanEnv();
  // local blocked, cloud "ready" via credentials
  process.env.MAHAVISPHOT_CLOUD_API_KEY = "test-key";
  const rt = ai.createDefaultRuntime();
  const input = { clipId: "c1" };
  // shareable: may fall back to the ready cloud leg
  const shareable = await rt.submit({ capability: "motion_track", mode: "hybrid", input, privacyTier: "shareable" }, { userId: "u1" });
  assert.equal(shareable.status, "blocked"); // cloud adapter is "ready" but infer() is gated -> blocked, never fabricated
  // local-only: must refuse cloud fallback outright
  const localOnly = await rt.submit({ capability: "motion_track", mode: "hybrid", input, privacyTier: "local-only" }, { userId: "u1" });
  assert.equal(localOnly.status, "blocked");
  assert.match(localOnly.reason, /local-only/);
  assert.match(localOnly.reason, /refusing cloud/);
  cleanEnv();
});

test("audit trail is privacy-preserving (stores digests, never raw input)", async () => {
  const rt = ai.createDefaultRuntime();
  const secret = { prompt: "secret-prompt-text", clipId: "x" };
  await rt.submit({ capability: "frame_gen", mode: "reference", input: secret }, { userId: "u9" });
  const entries = rt.audit({ userId: "u9" });
  assert.equal(entries.length, 1);
  const serialized = JSON.stringify(entries[0]);
  assert.ok(!serialized.includes("secret-prompt-text"), "raw input leaked into audit");
  assert.ok(/^[0-9a-f]{64}$/.test(entries[0].inputDigest));
});

test("HTTP /api/v1/ai: capabilities open, jobs auth-gated, deterministic reference run", async () => {
  cleanEnv();
  process.env.MAHAVISPHOT_DATA_DIR = fs.mkdtempSync(path.join(os.tmpdir(), "mvp-ai-"));
  const mod = require("../editor/server.js");
  await mod.startServer(0, "127.0.0.1", "t");
  const base = `http://127.0.0.1:${mod.server.address().port}`;
  try {
    // capabilities public
    let r = await fetch(`${base}/api/v1/ai/capabilities`);
    let j = await r.json();
    assert.equal(r.status, 200);
    assert.ok(j.capabilities.length >= 5);

    // job submission requires auth
    r = await fetch(`${base}/api/v1/ai/jobs`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ capability: "frame_gen", mode: "reference", input: { prompt: "x" } }) });
    assert.equal(r.status, 401);

    // register -> cookie
    r = await fetch(`${base}/api/auth/register`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email: "ai@test.co", password: "password123" }) });
    assert.equal(r.status, 201, await r.text());
    const cookie = r.headers.getSetCookie().map((c) => c.split(";")[0]).join("; ");
    const H = { "content-type": "application/json", cookie };

    // reference job completes deterministically
    r = await fetch(`${base}/api/v1/ai/jobs`, { method: "POST", headers: H, body: JSON.stringify({ capability: "frame_gen", mode: "reference", input: { prompt: "x" }, seed: 1 }) });
    j = await r.json();
    assert.equal(r.status, 201, JSON.stringify(j));
    assert.equal(j.status, "completed");
    assert.equal(j.result.inferenceKind, "deterministic-stub");
    const jobId = j.id;

    // local mode blocked (honest)
    r = await fetch(`${base}/api/v1/ai/jobs`, { method: "POST", headers: H, body: JSON.stringify({ capability: "upscale", mode: "local", input: { assetId: "a", scale: 2 } }) });
    j = await r.json();
    assert.equal(j.status, "blocked");

    // invalid job -> 422
    r = await fetch(`${base}/api/v1/ai/jobs`, { method: "POST", headers: H, body: JSON.stringify({ capability: "upscale", mode: "reference", input: { assetId: "a" } }) });
    assert.equal(r.status, 422);

    // audit lookup by id
    r = await fetch(`${base}/api/v1/ai/jobs/${jobId}`, { headers: H });
    j = await r.json();
    assert.equal(r.status, 200);
    assert.equal(j.entry.status, "completed");
  } finally {
    await new Promise((resolve) => mod.server.close(resolve));
  }
});
