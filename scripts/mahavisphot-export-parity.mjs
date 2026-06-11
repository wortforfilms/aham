#!/usr/bin/env node
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const exportSchema = require("../editor/export-schema.js");

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const EVIDENCE_DIR = join(ROOT, "docs", "mahavisphot", "evidence");
const PUBLIC_DIR = join(ROOT, "public", "mahavisphot");
const EVIDENCE_PATH = join(EVIDENCE_DIR, "latest-export-schema-parity.json");
const SAMPLE_SCHEMA_PATH = join(PUBLIC_DIR, "export-schema-parity.json");

const fixture = {
  projectId: "mahavisphot-step-6-export-parity",
  title: "Mahavisphot Step 6 Export Parity Fixture",
  schemaVersion: "mahavisphot.editor.project.v3",
  exportMode: "manifest",
  fps: 24,
  width: 1920,
  height: 1080,
  duration: 18,
  audioPath: "media/varg_ka_khel/varg_ka_khel.mp3",
  sourceTimeline: { id: "verified-timeline-doc", type: "timeline-runtime-v2" },
  scenes: [
    {
      id: 1,
      start: 0,
      end: 6,
      titleHi: "द लॉन्ग रोड",
      titleEn: "The Long Road",
      imagePath: "build_frames/lineup_unique_art2/frames_1080p_jpg/frame_0001.jpg",
      rubabOverlay: true,
      captions: "द लॉन्ग रोड\nThe Long Road",
      effects: { grain: true, vignette: true, dust: false, sonic: false },
    },
    {
      id: 2,
      start: 6,
      end: 12,
      titleHi: "संस्कृत नाद",
      titleEn: "Sanskrit Blast",
      imagePath: "build_frames/lineup_unique_art2/frames_1080p_jpg/frame_0002.jpg",
      captions: "संस्कृत नाद\nSanskrit Blast",
      effects: { grain: true, vignette: false, dust: true, sonic: true },
    },
  ],
  markers: [
    { id: "m-intro", time: 0, label: "Intro" },
    { id: "m-drop", time: 6, label: "Beat Drop" },
  ],
  dynamicTracks: [
    {
      id: "V3",
      kind: "video",
      label: "V3",
      title: "Rubab Picture-in-Picture",
      clips: [
        {
          id: "rubab-pip-1",
          sourceType: "asset",
          title: "Rubab Solo Window",
          start: 3,
          end: 9,
          path: "build_frames/lineup_unique_art2/frames_1080p_jpg/frame_0004.jpg",
        },
      ],
    },
    {
      id: "A2",
      kind: "audio",
      label: "A2",
      title: "Rubab Stem",
      clips: [
        {
          id: "rubab-audio-1",
          sourceType: "audio",
          title: "Rubab Solo Stem",
          start: 6,
          end: 12,
          path: "build_audio_separation/rubab.wav",
        },
      ],
    },
  ],
  compositions: [
    {
      id: "comp-intro",
      name: "Intro Nested Comp",
      start: 0,
      end: 12,
      duration: 12,
      clips: [
        {
          id: "comp-scene-1",
          mediaKind: "video",
          sourceType: "scene",
          sceneId: 1,
          title: "The Long Road Nested",
          start: 0,
          end: 6,
          relativeStart: 0,
          relativeEnd: 6,
          imagePath: "build_frames/lineup_unique_art2/frames_1080p_jpg/frame_0001.jpg",
        },
        {
          id: "comp-audio-1",
          mediaKind: "audio",
          sourceType: "master-audio",
          title: "Master Audio Nested",
          start: 0,
          end: 12,
          relativeStart: 0,
          relativeEnd: 12,
          path: "media/varg_ka_khel/varg_ka_khel.mp3",
        },
      ],
    },
  ],
  audioMix: { loudnessTarget: -14, limiter: true, masterGain: 1 },
};

const result = exportSchema.buildExportManifest(fixture, {
  mode: "manifest",
  generatedAt: "2026-06-10T00:00:00.000Z",
});

if (!result.ok) {
  console.error(JSON.stringify({ ok: false, errors: result.errors }, null, 2));
  process.exit(1);
}

const evidence = {
  schemaVersion: exportSchema.EXPORT_SCHEMA_EVIDENCE_VERSION,
  generatedAt: new Date().toISOString(),
  sampleSchemaPath: "public/mahavisphot/export-schema-parity.json",
  timelineDocumentVersion: result.manifest.source.timelineDocumentVersion,
  exportSchemaVersion: result.manifest.schemaVersion,
  dynamicTrackCount: result.manifest.parity.dynamicTracks.count,
  dynamicClipCount: result.manifest.parity.dynamicTracks.clipCount,
  compositionCount: result.manifest.parity.compositions.count,
  captionCount: result.manifest.parity.captions.count,
  vfxNodeCount: result.manifest.parity.vfx.nodeCount,
  audioClipCount: result.manifest.parity.audio.clipCount,
  fullSchemaRead: result.manifest.parity.fullSchemaRead,
  schemaParity: result.manifest.parity.render.schemaParity,
  renderStatus: result.manifest.renderPlan.status,
  productionReady: false,
  blockers: [
    "Production readiness still requires full renderer integration evidence beyond manifest schema parity.",
    "Local, cloud, and hybrid AI runtimes remain blocked until model and credential evidence exists.",
  ],
};

mkdirSync(EVIDENCE_DIR, { recursive: true });
mkdirSync(PUBLIC_DIR, { recursive: true });
writeFileSync(SAMPLE_SCHEMA_PATH, `${JSON.stringify(result.manifest, null, 2)}\n`, "utf8");
writeFileSync(EVIDENCE_PATH, `${JSON.stringify(evidence, null, 2)}\n`, "utf8");

console.log(`export schema parity: ${result.manifest.clips.length} clips, ${result.manifest.tracks.length} tracks`);
console.log(`evidence: ${EVIDENCE_PATH}`);
