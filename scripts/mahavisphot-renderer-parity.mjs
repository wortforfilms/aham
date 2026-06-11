#!/usr/bin/env node
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const exportSchema = require("../editor/export-schema.js");
const renderer = require("../editor/renderer-core.js");

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const EVIDENCE_DIR = join(ROOT, "docs", "mahavisphot", "evidence");
const PUBLIC_DIR = join(ROOT, "public", "mahavisphot");
const FIXTURE_DIR = join(ROOT, "exports", "render-core-fixture");
const FIXTURE_MANIFEST_PATH = join(FIXTURE_DIR, "export-schema.json");
const EVIDENCE_PATH = join(EVIDENCE_DIR, "latest-renderer-core-evidence.json");
const PUBLIC_EVIDENCE_PATH = join(PUBLIC_DIR, "renderer-core-evidence.json");

const fixture = {
  projectId: "mahavisphot-renderer-core-fixture",
  title: "Mahavisphot Renderer Core Fixture",
  schemaVersion: "mahavisphot.editor.project.v3",
  exportMode: "manifest",
  fps: 12,
  width: 640,
  height: 360,
  duration: 4,
  audioPath: "media/varg_ka_khel/varg_ka_khel.mp3",
  scenes: [
    {
      id: 1,
      start: 0,
      end: 2,
      titleHi: "एक",
      titleEn: "Renderer One",
      imagePath: "media/varg_ka_khel/frames/frame_0001.jpg",
      captions: "Renderer One",
      effects: { vignette: true },
    },
    {
      id: 2,
      start: 2,
      end: 4,
      titleHi: "दो",
      titleEn: "Renderer Two",
      imagePath: "media/varg_ka_khel/frames/frame_0002.jpg",
      captions: "Renderer Two",
      effects: { vignette: true },
    },
  ],
  audioMix: { loudnessTarget: -14, limiter: true, rendererFixture: true },
};

mkdirSync(FIXTURE_DIR, { recursive: true });
mkdirSync(EVIDENCE_DIR, { recursive: true });
mkdirSync(PUBLIC_DIR, { recursive: true });

const manifestResult = exportSchema.buildExportManifest(fixture, {
  mode: "manifest",
  generatedAt: "2026-06-10T00:00:00.000Z",
});
if (!manifestResult.ok) {
  console.error(JSON.stringify({ ok: false, errors: manifestResult.errors }, null, 2));
  process.exit(1);
}

writeFileSync(FIXTURE_MANIFEST_PATH, `${JSON.stringify(manifestResult.manifest, null, 2)}\n`, "utf8");

const engine = new renderer.MahavisphotRenderEngine(ROOT);
const report = await engine.executeManifestRender({
  manifestPath: "exports/render-core-fixture/export-schema.json",
  profile: "preview",
  width: 640,
  height: 360,
  fps: 12,
  maxDurationSec: 4,
});

const evidence = {
  ...report,
  evidencePath: "docs/mahavisphot/evidence/latest-renderer-core-evidence.json",
  publicEvidencePath: "public/mahavisphot/renderer-core-evidence.json",
};
writeFileSync(EVIDENCE_PATH, `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
writeFileSync(PUBLIC_EVIDENCE_PATH, `${JSON.stringify(evidence, null, 2)}\n`, "utf8");

console.log(`renderer core: ${report.telemetry.videoClipCount} clips, ${report.telemetry.totalFramesRendered} frames`);
console.log(`output: ${report.compiledOutput}`);
console.log(`evidence: ${EVIDENCE_PATH}`);
