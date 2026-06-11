import test from "node:test";
import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import fs from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const exportSchema = require("../editor/export-schema.js");
const renderer = require("../editor/renderer-core.js");

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");

function fixturePayload() {
  return {
    projectId: "renderer-test",
    title: "Renderer Test",
    schemaVersion: "mahavisphot.editor.project.v3",
    exportMode: "manifest",
    fps: 10,
    width: 320,
    height: 180,
    duration: 2,
    audioPath: "media/varg_ka_khel/varg_ka_khel.mp3",
    scenes: [
      {
        id: 1,
        start: 0,
        end: 1,
        titleHi: "एक",
        titleEn: "Render One",
        imagePath: "media/varg_ka_khel/frames/frame_0001.jpg",
        captions: "Render One",
        effects: { vignette: true },
      },
      {
        id: 2,
        start: 1,
        end: 2,
        titleHi: "दो",
        titleEn: "Render Two",
        imagePath: "media/varg_ka_khel/frames/frame_0002.jpg",
        captions: "Render Two",
        effects: { vignette: true },
      },
    ],
    audioMix: { loudnessTarget: -14 },
  };
}

function fixtureManifest() {
  const result = exportSchema.buildExportManifest(fixturePayload(), {
    mode: "manifest",
    generatedAt: "2026-06-10T00:00:00.000Z",
  });
  assert.equal(result.ok, true, JSON.stringify(result.errors || []));
  return result.manifest;
}

function exists(relativePath) {
  return fs.existsSync(path.join(ROOT, relativePath));
}

test("renderer validation rejects unsafe manifest path and schema mismatch", () => {
  let r = renderer.validateCompileRequest({ manifestPath: "../package.json" });
  assert.equal(r.ok, false);
  assert.equal(r.errors[0].code, "unsafe_manifest_path");

  r = renderer.validateExportManifest({ schemaVersion: "wrong", tracks: [], clips: [], renderPlan: {} });
  assert.equal(r.ok, false);
  assert.ok(r.errors.some((item) => item.code === "invalid_schema_version"));
});

test("renderer resolves only safe media paths", () => {
  const ok = renderer.resolveSafeMediaPath("media/varg_ka_khel/frames/frame_0001.jpg");
  assert.equal(ok.normalized, "media/varg_ka_khel/frames/frame_0001.jpg");
  assert.throws(() => renderer.resolveSafeMediaPath("../package.json"), /Invalid media asset path/);
  assert.throws(() => renderer.resolveSafeMediaPath("package.json"), /outside safe media roots/);
});

test("executeManifestRender compiles a manifest-native preview and parity report", async () => {
  const engine = new renderer.MahavisphotRenderEngine(ROOT);
  const report = await engine.executeManifestRender({
    manifest: fixtureManifest(),
    profile: "preview",
    width: 320,
    height: 180,
    fps: 10,
    maxDurationSec: 2,
  });
  assert.equal(report.schemaVersion, renderer.RENDERER_EVIDENCE_SCHEMA_VERSION);
  assert.equal(report.status, "SUCCESS");
  assert.equal(report.productionReady, false);
  assert.equal(report.parity.manifestRead, true);
  assert.equal(report.parity.assetPathsVerified, true);
  assert.equal(report.telemetry.videoClipCount, 2);
  assert.ok(report.telemetry.totalFramesRendered >= 20);
  assert.ok(exists(report.compiledOutput), report.compiledOutput);
  assert.ok(exists(report.reportPath), report.reportPath);
});

test("renderer fails closed when manifest has no renderable video", async () => {
  const manifest = fixtureManifest();
  manifest.clips = manifest.clips.filter((clip) => clip.kind !== "video");
  const engine = new renderer.MahavisphotRenderEngine(ROOT);
  await assert.rejects(
    () => engine.executeManifestRender({ manifest, width: 320, height: 180, fps: 10, maxDurationSec: 1 }),
    /no renderable video/
  );
});

test("HTTP /api/v1/render/compile compiles a safe manifest path", async () => {
  process.env.MAHAVISPHOT_DATA_DIR = fs.mkdtempSync(path.join(os.tmpdir(), "mvp-renderer-http-"));
  const manifestDir = path.join(ROOT, "exports", `renderer-http-${process.pid}`);
  fs.mkdirSync(manifestDir, { recursive: true });
  const manifestPath = path.join(manifestDir, "export-schema.json");
  fs.writeFileSync(manifestPath, `${JSON.stringify(fixtureManifest(), null, 2)}\n`, "utf8");

  const mod = require("../editor/server.js");
  await mod.startServer(0, "127.0.0.1", "t");
  const base = `http://127.0.0.1:${mod.server.address().port}`;
  try {
    let response = await fetch(`${base}/api/v1/render/compile`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        manifestPath: path.relative(ROOT, manifestPath),
        profile: "preview",
        width: 320,
        height: 180,
        fps: 10,
        maxDurationSec: 2,
      }),
    });
    let json = await response.json();
    assert.equal(response.status, 200, JSON.stringify(json));
    assert.equal(json.ok, true);
    assert.equal(json.report.schemaVersion, renderer.RENDERER_EVIDENCE_SCHEMA_VERSION);
    assert.ok(exists(json.report.compiledOutput), json.report.compiledOutput);

    response = await fetch(`${base}/api/v1/render/compile`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ manifestPath: "../package.json" }),
    });
    json = await response.json();
    assert.equal(response.status, 422, JSON.stringify(json));
    assert.equal(json.ok, false);
  } finally {
    await new Promise((resolve) => mod.server.close(resolve));
  }
});
