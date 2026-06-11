import test from "node:test";
import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import fs from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const mediaPipeline = require("../editor/media-pipeline.js");
const crud = require("../editor/crud.js");
const exportSchema = require("../editor/export-schema.js");
const timeline = require("../editor/timeline-runtime.js");

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const DERIVATIVE_ROOT = `exports/media-pipeline-tests-${process.pid}`;
const AUDIO_SAMPLE = "media/varg_ka_khel/varg_ka_khel.mp3";
const IMAGE_SAMPLE = "media/varg_ka_khel/frames/frame_0001.jpg";

function exists(relativePath) {
  return fs.existsSync(path.join(ROOT, relativePath));
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), "utf8"));
}

let audioIngestPromise;
let imageIngestPromise;

function audioIngest() {
  if (!audioIngestPromise) {
    audioIngestPromise = mediaPipeline.ingestMedia({
      path: AUDIO_SAMPLE,
      projectId: "media-test",
      linkTimeline: true,
    }, { derivativeRoot: DERIVATIVE_ROOT, projectId: "media-test" });
  }
  return audioIngestPromise;
}

function imageIngest() {
  if (!imageIngestPromise) {
    imageIngestPromise = mediaPipeline.ingestMedia({
      path: IMAGE_SAMPLE,
      projectId: "media-test",
      durationSec: 4,
      linkTimeline: true,
    }, { derivativeRoot: DERIVATIVE_ROOT, projectId: "media-test" });
  }
  return imageIngestPromise;
}

test("validation rejects unsafe paths and unsupported extensions", () => {
  let r = mediaPipeline.validateIngestRequest({ path: "../package.json" });
  assert.equal(r.ok, false);
  assert.equal(r.errors[0].code, "unsafe_media_path");

  r = mediaPipeline.validateIngestRequest({ path: "media/varg_ka_khel/timeline.tsv" });
  assert.equal(r.ok, false);
  assert.equal(r.errors[0].code, "unsupported_media_type");
});

test("audio ingest extracts metadata, proxy, waveform, and spectrogram", async () => {
  const ingest = await audioIngest();
  assert.equal(ingest.ok, true, JSON.stringify(ingest.errors || []));
  assert.equal(ingest.asset.metadata.kind, "audio");
  assert.ok(ingest.asset.metadata.durationSec > 0);
  assert.ok(ingest.asset.metadata.audio.sampleRate > 0);

  const d = ingest.asset.derivatives;
  assert.ok(exists(d.thumbnailPath), d.thumbnailPath);
  assert.ok(exists(d.proxyPath), d.proxyPath);
  assert.ok(exists(d.waveformPath), d.waveformPath);
  assert.ok(exists(d.spectrogramPath), d.spectrogramPath);
  assert.ok(exists(d.manifestPath), d.manifestPath);

  const waveform = readJson(d.waveformPath);
  assert.equal(waveform.buckets, 128);
  assert.equal(waveform.peaks.length, 128);
  assert.ok(waveform.peaks.some((peak) => peak > 0));
});

test("image ingest extracts frame metadata and visual proxy files", async () => {
  const ingest = await imageIngest();
  assert.equal(ingest.ok, true, JSON.stringify(ingest.errors || []));
  assert.equal(ingest.asset.metadata.kind, "image");
  assert.ok(ingest.asset.metadata.video.width > 0);
  assert.ok(ingest.asset.metadata.video.height > 0);

  const d = ingest.asset.derivatives;
  assert.ok(exists(d.thumbnailPath), d.thumbnailPath);
  assert.ok(exists(d.proxyPath), d.proxyPath);
  assert.ok(exists(d.manifestPath), d.manifestPath);
});

test("ingested assets produce CRUD-compatible asset records", async () => {
  for (const ingest of [await audioIngest(), await imageIngest()]) {
    const record = mediaPipeline.assetRecordFromIngest({
      assetId: ingest.asset.id,
      metadata: ingest.asset.metadata,
      derivatives: ingest.asset.derivatives,
      projectId: "media-test",
    });
    const validated = crud.validate("assets", record);
    assert.equal(validated.ok, true, JSON.stringify(validated.errors));
    assert.equal(validated.value.projectId, "media-test");
    assert.equal(validated.value.meta.mediaSchemaVersion, mediaPipeline.MEDIA_SCHEMA_VERSION);
  }
});

test("media assets link into a valid timeline document and export manifest", async () => {
  let doc = timeline.newDoc({ id: "media-test-doc", name: "Media Test", fps: 24 });
  const audio = await audioIngest();
  const image = await imageIngest();

  const audioLink = mediaPipeline.linkAssetToTimelineDoc(doc, audio, { start: 0 });
  doc = audioLink.doc;
  const imageLink = mediaPipeline.linkAssetToTimelineDoc(doc, image, { start: 0, durationSec: 4 });
  doc = imageLink.doc;

  assert.deepEqual(timeline.validate(doc), []);
  assert.equal(doc.clips.length, 2);
  assert.equal(doc.clips.some((clip) => clip.source.id === AUDIO_SAMPLE), true);
  assert.equal(doc.clips.some((clip) => clip.source.id === IMAGE_SAMPLE), true);

  const manifest = exportSchema.buildExportManifest({
    projectId: "media-test",
    title: "Media Test",
    timelineDoc: doc,
    audioMix: { loudnessTarget: -14 },
  }, { generatedAt: "2026-06-10T00:00:00.000Z" });
  assert.equal(manifest.ok, true, JSON.stringify(manifest.errors || []));
  assert.equal(manifest.manifest.assets.some((asset) => asset.id === AUDIO_SAMPLE), true);
  assert.equal(manifest.manifest.assets.some((asset) => asset.id === IMAGE_SAMPLE), true);
  assert.equal(manifest.manifest.parity.render.schemaParity, true);
});

test("contact sheet renders from ingested derivative thumbnails", async () => {
  const outputPath = path.join(ROOT, DERIVATIVE_ROOT, "test-contact-sheet.jpg");
  const sheet = await mediaPipeline.createContactSheet([await audioIngest(), await imageIngest()], outputPath);
  assert.equal(sheet.count, 2);
  assert.ok(exists(sheet.path), sheet.path);
});

test("HTTP ingest is auth-gated, creates CRUD asset, and links timeline clip", async () => {
  process.env.MAHAVISPHOT_DATA_DIR = fs.mkdtempSync(path.join(os.tmpdir(), "mvp-media-http-"));
  const mod = require("../editor/server.js");
  await mod.startServer(0, "127.0.0.1", "t");
  const base = `http://127.0.0.1:${mod.server.address().port}`;
  try {
    let r = await fetch(`${base}/api/v1/media/ingest`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ path: IMAGE_SAMPLE, projectId: "media-http", linkTimeline: true }),
    });
    assert.equal(r.status, 401);

    r = await fetch(`${base}/api/auth/register`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: "media@test.co", password: "password123" }),
    });
    assert.equal(r.status, 201, await r.text());
    const cookie = r.headers.getSetCookie().map((value) => value.split(";")[0]).join("; ");
    const H = { "content-type": "application/json", cookie };

    r = await fetch(`${base}/api/v1/media/ingest`, {
      method: "POST",
      headers: H,
      body: JSON.stringify({
        path: IMAGE_SAMPLE,
        projectId: "media-http",
        linkTimeline: true,
        timelineStart: 1,
        durationSec: 3,
      }),
    });
    const created = await r.json();
    assert.equal(r.status, 201, JSON.stringify(created));
    assert.equal(created.ok, true);
    assert.equal(created.record.entity, "assets");
    assert.equal(created.timelineLink.projectId, "media-http");
    assert.ok(created.timelineLink.clipId);

    r = await fetch(`${base}/api/v1/assets?projectId=media-http`, { headers: H });
    const assets = await r.json();
    assert.equal(r.status, 200, JSON.stringify(assets));
    assert.equal(assets.records.some((record) => record.path === IMAGE_SAMPLE), true);

    r = await fetch(`${base}/api/v1/editor/doc?projectId=media-http`, { headers: H });
    const savedDoc = await r.json();
    assert.equal(r.status, 200, JSON.stringify(savedDoc));
    assert.equal(savedDoc.doc.clips.some((clip) => clip.id === created.timelineLink.clipId), true);
    assert.deepEqual(timeline.validate(savedDoc.doc), []);
  } finally {
    await new Promise((resolve) => mod.server.close(resolve));
  }
});
