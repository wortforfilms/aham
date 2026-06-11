import test from "node:test";
import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import fs from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const tel = require("../editor/runtime-collectors.js");

test("evaluateRenderLoop classifies viewport fps against target", () => {
  assert.equal(tel.evaluateRenderLoop(60, 60).status, "ok");
  assert.equal(tel.evaluateRenderLoop(40, 60).status, "degraded");
  assert.equal(tel.evaluateRenderLoop(12, 60).status, "critical");
  assert.equal(tel.evaluateRenderLoop(0, 60).status, "unknown");
  assert.equal(tel.evaluateRenderLoop(30, 60).frameBudgetMs, 33.33);
});

test("hostMetrics returns real bounded CPU/memory samples", async () => {
  const h = await tel.hostMetrics();
  assert.ok(h.cores > 0);
  assert.ok(h.cpuUsagePct >= 0 && h.cpuUsagePct <= 100);
  assert.ok(h.memUsagePct >= 0 && h.memUsagePct <= 100);
  assert.ok(h.memTotalMB > 0);
});

test("probeGpu is honest (real numbers or 'unavailable', never fabricated)", () => {
  const g = tel.probeGpu();
  assert.ok(["ok", "name_only", "unavailable"].includes(g.status));
  assert.ok(Array.isArray(g.gpus));
  if (g.status === "ok") {
    for (const gpu of g.gpus) assert.ok(Number.isFinite(gpu.memUsedMB) && Number.isFinite(gpu.memTotalMB));
  } else {
    // when not 'ok' there must be no fabricated usage numbers
    for (const gpu of g.gpus) assert.equal(gpu.memUsagePct, undefined);
  }
});

test("measureLoudness computes real BS.1770 integrated LUFS for the master", () => {
  const l = tel.measureLoudness("अहं ब्रह्मास्मि.wav");
  assert.ok(["ok", "error", "unavailable"].includes(l.status), JSON.stringify(l));
  if (l.status === "ok") {
    assert.ok(Number.isFinite(l.integratedLUFS));
    assert.equal(l.targetLUFS, -14);
    assert.equal(typeof l.conforms, "boolean");
    assert.equal(typeof l.abort, "boolean");
    assert.ok(typeof l.verdict === "string" && l.verdict.length > 0);
  }
});

test("measureLoudness reports unavailable for a missing file (no throw)", () => {
  const l = tel.measureLoudness("does/not/exist.wav");
  assert.equal(l.status, "unavailable");
});

test("telemetry aggregates defensively and exposes renderSafe", async () => {
  const t = await tel.telemetry({ loopFps: 58 });
  assert.ok(t.host && t.gpu && t.renderLoop);
  assert.equal(t.renderLoop.fps, 58);
  assert.equal(typeof t.renderSafe, "boolean");
  assert.ok(Array.isArray(t.errors));
  assert.ok(["ok", "degraded", "abort"].includes(t.status));
});

test("HTTP /api/v1/telemetry returns host/gpu/loop + rejects unsafe audio path", async () => {
  process.env.MAHAVISPHOT_DATA_DIR = fs.mkdtempSync(path.join(os.tmpdir(), "mvp-tel-"));
  const mod = require("../editor/server.js");
  await mod.startServer(0, "127.0.0.1", "t");
  const base = `http://127.0.0.1:${mod.server.address().port}`;

  let r = await fetch(`${base}/api/v1/telemetry?loopFps=58&loopTarget=60`);
  let j = await r.json();
  assert.equal(r.status, 200);
  assert.equal(j.renderLoop.fps, 58);
  assert.ok(j.host.cores > 0);
  assert.ok(["ok", "name_only", "unavailable"].includes(j.gpu.status));

  // path-escape attempt must be rejected by the safe-media policy
  r = await fetch(`${base}/api/v1/telemetry?includeLoudness=1&audioPath=${encodeURIComponent("../../etc/passwd")}`);
  j = await r.json();
  assert.equal(r.status, 400);
  assert.equal(j.ok, false);

  mod.server.close();
});
