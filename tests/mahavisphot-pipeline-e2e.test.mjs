import test from "node:test";
import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import fs from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

// Mirrors the payload shape that editor/app.js getProjectExportPayload() POSTs.
function clientPayload() {
  return {
    projectId: "e2e", title: "E2E Cut", exportMode: "manifest",
    fps: 12, width: 320, height: 180, duration: 2,
    audioPath: "media/varg_ka_khel/varg_ka_khel.mp3",
    scenes: [
      { id: 1, start: 0, end: 1, titleHi: "द लॉन्ग रोड", titleEn: "The Long Road", imagePath: "media/varg_ka_khel/frames/frame_0001.jpg", captions: "The Long Road" },
      { id: 2, start: 1, end: 2, titleHi: "संस्कृत नाद", titleEn: "Sanskrit Blast", imagePath: "media/varg_ka_khel/frames/frame_0002.jpg", captions: "Sanskrit Blast" },
    ],
    audioMix: { loudnessTarget: -14 },
  };
}

// Reproduces the exact three calls editor/app.js compileSchemaRender() + the
// telemetry HUD make, proving the frontend→backend compilation contract.
test("client pipeline contract: /api/export/schema -> /api/v1/render/compile -> /api/v1/telemetry", async () => {
  process.env.MAHAVISPHOT_DATA_DIR = fs.mkdtempSync(path.join(os.tmpdir(), "mvp-e2e-"));
  const mod = require("../editor/server.js");
  await mod.startServer(0, "127.0.0.1", "t");
  const base = `http://127.0.0.1:${mod.server.address().port}`;
  try {
    // 1. serialize state -> export schema manifest (mahavisphot.export.v1)
    let r = await fetch(`${base}/api/export/schema`, {
      method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(clientPayload()),
    });
    const schema = await r.json();
    assert.equal(r.status, 200, JSON.stringify(schema));
    assert.equal(schema.ok, true);
    assert.equal(schema.schema.schemaVersion, "mahavisphot.export.v1");
    assert.ok(schema.schemaUrl && schema.schemaUrl.startsWith("/assets/"));

    // 2. hand the manifest to the renderer compile endpoint
    r = await fetch(`${base}/api/v1/render/compile`, {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ manifest: schema.schema, profile: "preview", width: 320, height: 180, fps: 12, maxDurationSec: 2 }),
    });
    const compile = await r.json();
    assert.equal(r.status, 200, JSON.stringify(compile));
    assert.equal(compile.ok, true);
    assert.ok(compile.videoUrl && compile.videoUrl.startsWith("/assets/"));
    // backend resolved blockers: concurrent multilingual captions + panned, loudness-verified audio
    assert.ok(compile.report.captions.layerCount >= 2);
    assert.equal(compile.report.captions.fontDevanagariAvailable, true);
    assert.equal(compile.report.parity.loudnessEnforced, true);
    assert.ok(compile.report.parity.audioStemsPanned >= 1);
    assert.ok(["ok", "error", "unavailable"].includes(compile.report.audioMix.outputLoudness.status));

    // 3. telemetry HUD stream (host CPU/mem, honest GPU, viewport loop)
    r = await fetch(`${base}/api/v1/telemetry?loopFps=58&loopTarget=60`);
    const tel = await r.json();
    assert.equal(r.status, 200);
    assert.ok(tel.host.cores > 0);
    assert.equal(tel.renderLoop.fps, 58);
    assert.ok(["ok", "name_only", "unavailable"].includes(tel.gpu.status));
    assert.equal(typeof tel.renderSafe, "boolean");
  } finally {
    await new Promise((resolve) => mod.server.close(resolve));
  }
});
