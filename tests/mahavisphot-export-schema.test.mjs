import test from "node:test";
import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import fs from "node:fs";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const exportSchema = require("../editor/export-schema.js");

function fixturePayload() {
  return {
    projectId: "test-export-parity",
    title: "Export Parity Test",
    schemaVersion: "mahavisphot.editor.project.v3",
    exportMode: "preview-mp4",
    fps: 24,
    width: 1920,
    height: 1080,
    duration: 20,
    audioPath: "media/varg_ka_khel/varg_ka_khel.mp3",
    sourceTimeline: { id: "unit-fixture" },
    scenes: [
      {
        id: 1,
        start: 0,
        end: 5,
        titleHi: "एक",
        titleEn: "One",
        imagePath: "build_frames/lineup_unique_art2/frames_1080p_jpg/frame_0001.jpg",
        rubabOverlay: true,
        captions: "एक\nOne",
        effects: { grain: true, vignette: true },
      },
      {
        id: 2,
        start: 5,
        end: 11,
        titleHi: "दो",
        titleEn: "Two",
        imagePath: "build_frames/lineup_unique_art2/frames_1080p_jpg/frame_0002.jpg",
        captions: "दो\nTwo",
        effects: { dust: true, sonic: true },
      },
    ],
    markers: [{ id: "m1", time: 5, label: "Drop" }],
    dynamicTracks: [
      {
        id: "V3",
        kind: "video",
        label: "V3",
        title: "PiP Video",
        clips: [{ id: "pip", title: "PiP", start: 2, end: 8, path: "build_frames/lineup_unique_art2/frames_1080p_jpg/frame_0004.jpg" }],
      },
      {
        id: "A2",
        kind: "audio",
        label: "A2",
        title: "Rubab Audio",
        clips: [{ id: "rubab", title: "Rubab", start: 5, end: 11, path: "build_audio_separation/rubab.wav" }],
      },
    ],
    compositions: [
      {
        id: "nested",
        name: "Nested Comp",
        start: 0,
        end: 11,
        duration: 11,
        clips: [
          { id: "nested-video", mediaKind: "video", sourceType: "scene", sceneId: 1, title: "Nested One", relativeStart: 0, relativeEnd: 5, imagePath: "build_frames/lineup_unique_art2/frames_1080p_jpg/frame_0001.jpg" },
          { id: "nested-audio", mediaKind: "audio", sourceType: "master-audio", title: "Nested Audio", relativeStart: 0, relativeEnd: 11, path: "media/varg_ka_khel/varg_ka_khel.mp3" },
        ],
      },
    ],
    audioMix: { loudnessTarget: -14, limiter: true },
  };
}

test("buildExportManifest reads timeline doc, dynamic tracks, compositions, captions, VFX, and audio", () => {
  const result = exportSchema.buildExportManifest(fixturePayload(), {
    mode: "preview-mp4",
    generatedAt: "2026-06-10T00:00:00.000Z",
  });
  assert.equal(result.ok, true, JSON.stringify(result.errors));
  const manifest = result.manifest;
  assert.equal(manifest.schemaVersion, exportSchema.EXPORT_SCHEMA_VERSION);
  assert.equal(manifest.timelineDocument.valid, true);
  assert.equal(manifest.parity.fullSchemaRead, true);
  assert.equal(manifest.parity.timelineDocument.schemaVersion, 2);
  assert.equal(manifest.parity.dynamicTracks.count, 2);
  assert.equal(manifest.parity.dynamicTracks.clipCount, 2);
  assert.equal(manifest.parity.compositions.count, 2);
  assert.ok(manifest.parity.compositions.clipCount >= 7);
  assert.equal(manifest.parity.captions.count, 2);
  assert.equal(manifest.parity.vfx.nodeCount, 2);
  assert.ok(manifest.parity.audio.clipCount >= 2);
  assert.equal(manifest.parity.render.schemaParity, true);
  assert.equal(manifest.renderPlan.status, "degraded");
  assert.deepEqual(manifest.renderPlan.unsupportedPreviewVfx.sort(), ["dust", "grain", "sonic"].sort());
});

test("timelineDocFromPayload creates a valid timeline-runtime v2 document", () => {
  const doc = exportSchema.timelineDocFromPayload(fixturePayload());
  assert.equal(doc.schemaVersion, 2);
  assert.ok(doc.compositions.some((composition) => composition.root));
  assert.ok(doc.tracks.some((track) => track.kind === "caption"));
  assert.ok(doc.tracks.some((track) => track.kind === "vfx"));
  assert.ok(doc.clips.some((clip) => clip.source.type === "composition"));
});

test("validation rejects invalid export input and dangling timeline documents", () => {
  const invalid = exportSchema.buildExportManifest({ scenes: [{ start: 5, end: 2 }] });
  assert.equal(invalid.ok, false);
  assert.ok(invalid.errors.some((item) => item.code === "invalid_scene_range"));

  const badDoc = exportSchema.buildExportManifest({
    timelineDoc: {
      schemaVersion: 2,
      compositions: [{ id: "main", name: "Main", parentId: null, root: true }],
      tracks: [],
      clips: [{ id: "bad", trackId: "missing", source: { type: "asset", id: "x" }, start: 0, duration: 1 }],
    },
  });
  assert.equal(badDoc.ok, false);
  assert.ok(badDoc.errors.some((item) => item.code === "invalid_timeline_document"));
});

test("HTTP /api/export/schema writes manifest and evidence without rendering", async () => {
  process.env.MAHAVISPHOT_DATA_DIR = fs.mkdtempSync(path.join(os.tmpdir(), "mvp-export-"));
  const mod = require("../editor/server.js");
  await mod.startServer(0, "127.0.0.1", "t");
  const base = `http://127.0.0.1:${mod.server.address().port}`;
  try {
    const response = await fetch(`${base}/api/export/schema`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(fixturePayload()),
    });
    const json = await response.json();
    assert.equal(response.status, 200, JSON.stringify(json));
    assert.equal(json.ok, true);
    assert.equal(json.schema.schemaVersion, exportSchema.EXPORT_SCHEMA_VERSION);
    assert.equal(json.parity.dynamicTracks.count, 2);
    assert.equal(json.parity.render.schemaParity, true);

    const schemaPath = json.schemaUrl.replace("/assets/", "");
    const evidencePath = json.evidenceUrl.replace("/assets/", "");
    const schemaOnDisk = JSON.parse(readFileSync(path.join(process.cwd(), schemaPath), "utf8"));
    const evidenceOnDisk = JSON.parse(readFileSync(path.join(process.cwd(), evidencePath), "utf8"));
    assert.equal(schemaOnDisk.parity.fullSchemaRead, true);
    assert.equal(evidenceOnDisk.productionReady, false);
  } finally {
    mod.server.close();
  }
});
