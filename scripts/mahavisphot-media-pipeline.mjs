#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const mediaPipeline = require("../editor/media-pipeline.js");
const exportSchema = require("../editor/export-schema.js");
const timeline = require("../editor/timeline-runtime.js");

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const EVIDENCE_DIR = join(ROOT, "docs", "mahavisphot", "evidence");
const PUBLIC_DIR = join(ROOT, "public", "mahavisphot");
const DERIVATIVE_ROOT = "exports/media-pipeline-step5";
const CONTACT_SHEET_PATH = join(PUBLIC_DIR, "media-pipeline-contact-sheet.jpg");
const PUBLIC_MANIFEST_PATH = join(PUBLIC_DIR, "media-pipeline-manifest.json");
const EVIDENCE_PATH = join(EVIDENCE_DIR, "latest-media-pipeline-evidence.json");

const PROJECT_ID = "mahavisphot-step-5-media-pipeline";
const FIXED_EXPORT_GENERATED_AT = "2026-06-10T00:00:00.000Z";
const SAMPLE_ASSETS = [
  {
    label: "Varg Ka Khel Master Audio",
    path: "media/varg_ka_khel/varg_ka_khel.mp3",
    timelineStart: 0,
  },
  {
    label: "Varg Ka Khel Frame 0001",
    path: "media/varg_ka_khel/frames/frame_0001.jpg",
    timelineStart: 0,
    durationSec: 5,
  },
];

function readJson(relativePath) {
  return JSON.parse(readFileSync(join(ROOT, relativePath), "utf8"));
}

function fileExists(relativePath) {
  try {
    readFileSync(join(ROOT, relativePath));
    return true;
  } catch {
    return false;
  }
}

async function main() {
  mkdirSync(EVIDENCE_DIR, { recursive: true });
  mkdirSync(PUBLIC_DIR, { recursive: true });

  const ingests = [];
  let doc = timeline.newDoc({
    id: PROJECT_ID,
    name: "Mahavisphot Step 5 Media Pipeline",
    fps: 24,
    duration: 0,
    width: 1920,
    height: 1080,
  });

  for (const sample of SAMPLE_ASSETS) {
    const ingest = await mediaPipeline.ingestMedia({
      path: sample.path,
      projectId: PROJECT_ID,
      timelineStart: sample.timelineStart,
      durationSec: sample.durationSec,
      linkTimeline: true,
    }, { derivativeRoot: DERIVATIVE_ROOT, projectId: PROJECT_ID });
    if (!ingest.ok) {
      console.error(JSON.stringify({ ok: false, sample: sample.path, errors: ingest.errors }, null, 2));
      process.exit(1);
    }
    const linked = mediaPipeline.linkAssetToTimelineDoc(doc, ingest, {
      projectId: PROJECT_ID,
      start: sample.timelineStart,
      durationSec: sample.durationSec,
    });
    doc = linked.doc;
    ingests.push({ sample, ingest, linked });
  }

  const contactSheet = await mediaPipeline.createContactSheet(ingests.map((item) => item.ingest), CONTACT_SHEET_PATH);
  const exportResult = exportSchema.buildExportManifest({
    projectId: PROJECT_ID,
    title: "Mahavisphot Step 5 Media Pipeline",
    timelineDoc: doc,
    audioMix: { loudnessTarget: -14, limiter: true, mediaPipelineVerified: true },
  }, {
    mode: "manifest",
    generatedAt: FIXED_EXPORT_GENERATED_AT,
  });
  if (!exportResult.ok) {
    console.error(JSON.stringify({ ok: false, errors: exportResult.errors }, null, 2));
    process.exit(1);
  }

  const assets = ingests.map(({ sample, ingest, linked }) => {
    const derivatives = ingest.asset.derivatives;
    const waveform = derivatives.waveformPath ? readJson(derivatives.waveformPath) : null;
    return {
      label: sample.label,
      sourcePath: ingest.asset.sourcePath,
      assetId: ingest.asset.id,
      kind: ingest.asset.metadata.kind,
      metadata: ingest.asset.metadata,
      derivatives,
      derivativeFilesVerified: {
        thumbnail: fileExists(derivatives.thumbnailPath),
        proxy: fileExists(derivatives.proxyPath),
        waveform: derivatives.waveformPath ? fileExists(derivatives.waveformPath) : null,
        spectrogram: derivatives.spectrogramPath ? fileExists(derivatives.spectrogramPath) : null,
      },
      waveformBuckets: waveform?.buckets ?? 0,
      timelineLink: {
        trackId: linked.track.id,
        clipId: linked.clip.id,
        start: linked.clip.start,
        duration: linked.clip.duration,
      },
    };
  });

  const manifest = {
    schemaVersion: mediaPipeline.MEDIA_EVIDENCE_SCHEMA_VERSION,
    generatedAt: new Date().toISOString(),
    projectId: PROJECT_ID,
    mediaSchemaVersion: mediaPipeline.MEDIA_SCHEMA_VERSION,
    timelineDocumentVersion: doc.schemaVersion,
    exportSchemaVersion: exportResult.manifest.schemaVersion,
    derivativeRoot: DERIVATIVE_ROOT,
    contactSheet,
    assets,
    timeline: {
      id: doc.id,
      name: doc.name,
      fps: doc.fps,
      duration: doc.duration,
      trackCount: doc.tracks.length,
      clipCount: doc.clips.length,
      clips: doc.clips.map((clip) => ({
        id: clip.id,
        trackId: clip.trackId,
        sourceType: clip.source?.type || null,
        sourceId: clip.source?.id || null,
        start: clip.start,
        duration: clip.duration,
      })),
    },
    exportParity: {
      fullSchemaRead: exportResult.manifest.parity.fullSchemaRead,
      schemaParity: exportResult.manifest.parity.render.schemaParity,
      assetReferenceCount: exportResult.manifest.assets.length,
      renderStatus: exportResult.manifest.renderPlan.status,
    },
    productionReady: false,
    blockers: [
      "Step 5 verifies ingest, metadata, proxies, waveforms, contact sheet, and timeline/export linkage only.",
      "Production visual renderer parity remains blocked until full renderer integration evidence exists.",
      "Local, cloud, and hybrid AI runtimes remain blocked until model/runtime/credential evidence exists.",
    ],
  };

  writeFileSync(PUBLIC_MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  writeFileSync(EVIDENCE_PATH, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

  console.log(`media pipeline: ${assets.length} assets, ${doc.clips.length} linked timeline clips`);
  console.log(`contact sheet: ${contactSheet.path}`);
  console.log(`evidence: ${EVIDENCE_PATH}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
