"use strict";
/**
 * Mahavisphot — verified media ingest pipeline (Step 5).
 *
 * Local-only media pipeline for safe-root assets. It validates media paths,
 * extracts metadata with ffprobe, generates deterministic derivatives with
 * ffmpeg, builds CRUD-compatible asset records, and links ingested media into
 * the verified timeline-runtime v2 document model.
 */
const fs = require("node:fs");
const fsp = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");
const timeline = require("./timeline-runtime");
const runtimeBinaries = require("./runtime-binaries");

const ROOT = path.resolve(__dirname, "..");
const MEDIA_SCHEMA_VERSION = "mahavisphot.media.v1";
const MEDIA_EVIDENCE_SCHEMA_VERSION = "mahavisphot.media.evidence.v1";
const DEFAULT_DERIVATIVE_ROOT = "exports/media-pipeline";
const SAFE_MEDIA_ROOTS = new Map([
  ["build_frames", path.join(ROOT, "build_frames")],
  ["media", path.join(ROOT, "media")],
  ["exports", path.join(ROOT, "exports")],
]);
const SAFE_ROOT_MEDIA_FILES = new Set(["अहं ब्रह्मास्मि.wav"]);
const EXTENSIONS = {
  image: new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]),
  audio: new Set([".wav", ".mp3", ".m4a", ".aac", ".flac", ".ogg"]),
  video: new Set([".mp4", ".mov", ".mkv", ".webm", ".avi"]),
};
const ALLOWED_KINDS = ["image", "audio", "video", "frame"];

function clone(value, fallback = null) {
  try {
    return value == null ? fallback : JSON.parse(JSON.stringify(value));
  } catch {
    return fallback;
  }
}

function error(code, field, message) {
  return { code, field, message };
}

function result(errors) {
  return { ok: errors.length === 0, errors };
}

function normalizeAssetPath(assetPath) {
  const normalized = String(assetPath || "").replace(/\\/g, "/").replace(/^\/+/, "");
  const parts = normalized.split("/");
  if (!normalized || normalized.includes("\0") || parts.some((part) => part === "" || part === "." || part === "..")) {
    throw new Error("Invalid media asset path");
  }
  return normalized;
}

function safeJoin(base, target) {
  const resolved = path.resolve(base, target);
  if (!resolved.startsWith(base + path.sep) && resolved !== base) {
    throw new Error("Path escapes workspace");
  }
  return resolved;
}

function resolveSafeMediaPath(assetPath) {
  const normalized = normalizeAssetPath(assetPath);
  if (SAFE_ROOT_MEDIA_FILES.has(normalized)) return { normalized, absolutePath: path.join(ROOT, normalized), rootKey: "root" };
  const [folder, ...rest] = normalized.split("/");
  const root = SAFE_MEDIA_ROOTS.get(folder);
  if (!root || rest.length === 0) {
    throw new Error("Asset path is outside the safe media-only folders");
  }
  return { normalized, absolutePath: safeJoin(root, rest.join("/")), rootKey: folder };
}

function classifyMedia(assetPath) {
  const ext = path.extname(String(assetPath || "")).toLowerCase();
  if (EXTENSIONS.image.has(ext)) return ext === ".gif" ? "image" : "image";
  if (EXTENSIONS.audio.has(ext)) return "audio";
  if (EXTENSIONS.video.has(ext)) return "video";
  return "unknown";
}

function hasBinary(name) {
  return runtimeBinaries.hasBinary(name);
}

function runFfprobe(filePath) {
  const raw = runtimeBinaries.execFile("ffprobe", [
    "-v", "error",
    "-print_format", "json",
    "-show_format",
    "-show_streams",
    filePath,
  ], { encoding: "utf8", maxBuffer: 8 * 1024 * 1024 });
  return JSON.parse(raw);
}

function parseFps(value) {
  const text = String(value || "");
  if (!text || text === "0/0") return null;
  const [a, b] = text.split("/").map(Number);
  if (Number.isFinite(a) && Number.isFinite(b) && b > 0) return Math.round((a / b) * 1000) / 1000;
  const n = Number(text);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function round(value, places = 6) {
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  const scale = 10 ** places;
  return Math.round(n * scale) / scale;
}

function metadataFromProbe(probe, stat, normalizedPath, requestedKind) {
  const streams = Array.isArray(probe.streams) ? probe.streams : [];
  const video = streams.find((stream) => stream.codec_type === "video") || null;
  const audio = streams.find((stream) => stream.codec_type === "audio") || null;
  const imageLike = requestedKind === "image" || (video && Number(video.nb_frames || 1) <= 1 && !audio);
  const kind = requestedKind === "frame" ? "frame" : requestedKind === "image" && imageLike ? "image" : requestedKind;
  return {
    schemaVersion: MEDIA_SCHEMA_VERSION,
    path: normalizedPath,
    kind,
    sizeBytes: stat.size,
    mtimeMs: Math.trunc(stat.mtimeMs),
    formatName: probe.format?.format_name || null,
    durationSec: round(probe.format?.duration),
    bitrate: probe.format?.bit_rate ? Number(probe.format.bit_rate) : null,
    video: video ? {
      codec: video.codec_name || null,
      width: video.width || null,
      height: video.height || null,
      fps: parseFps(video.avg_frame_rate || video.r_frame_rate),
      pixelFormat: video.pix_fmt || null,
    } : null,
    audio: audio ? {
      codec: audio.codec_name || null,
      channels: audio.channels || null,
      channelLayout: audio.channel_layout || null,
      sampleRate: audio.sample_rate ? Number(audio.sample_rate) : null,
    } : null,
  };
}

function stableAssetId(normalizedPath, stat) {
  const digest = crypto.createHash("sha256")
    .update(`${normalizedPath}:${stat.size}:${Math.trunc(stat.mtimeMs)}`)
    .digest("hex")
    .slice(0, 16);
  return `asset_${digest}`;
}

function derivativeSlug(assetId, normalizedPath) {
  const stem = path.basename(normalizedPath, path.extname(normalizedPath))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 42) || "media";
  return `${assetId}_${stem}`;
}

function validateIngestRequest(input) {
  const errors = [];
  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    return result([error("invalid_payload", "payload", "Ingest request must be an object.")]);
  }
  if (typeof input.path !== "string" || !input.path.trim()) {
    errors.push(error("invalid_path", "path", "Media path is required and must be a string."));
  } else {
    try {
      const resolved = resolveSafeMediaPath(input.path);
      const kind = classifyMedia(resolved.normalized);
      if (kind === "unknown") {
        errors.push(error("unsupported_media_type", "path", "Media extension is not supported for ingest."));
      }
    } catch (err) {
      errors.push(error("unsafe_media_path", "path", err.message));
    }
  }
  if (input.projectId !== undefined && typeof input.projectId !== "string") {
    errors.push(error("invalid_project_id", "projectId", "Project id must be a string when supplied."));
  }
  if (input.timelineStart !== undefined && !Number.isFinite(Number(input.timelineStart))) {
    errors.push(error("invalid_timeline_start", "timelineStart", "Timeline start must be numeric when supplied."));
  }
  if (input.durationSec !== undefined && (!Number.isFinite(Number(input.durationSec)) || Number(input.durationSec) <= 0)) {
    errors.push(error("invalid_duration", "durationSec", "Duration override must be a positive number when supplied."));
  }
  if (input.linkTimeline !== undefined && typeof input.linkTimeline !== "boolean") {
    errors.push(error("invalid_link_timeline", "linkTimeline", "linkTimeline must be boolean when supplied."));
  }
  return result(errors);
}

function ensureBinaries() {
  const missing = [];
  if (!hasBinary("ffprobe")) missing.push("ffprobe");
  if (!hasBinary("ffmpeg")) missing.push("ffmpeg");
  if (missing.length) {
    const err = new Error(`Missing media runtime binaries: ${missing.join(", ")}`);
    err.code = "media_runtime_blocked";
    err.missing = missing;
    throw err;
  }
}

function runFfmpeg(args, label) {
  const r = runtimeBinaries.spawnFileSync("ffmpeg", args, { encoding: "utf8" });
  if (r.status !== 0) {
    const stderr = String(r.stderr || "").split("\n").slice(-12).join("\n");
    const err = new Error(`${label} failed: ${stderr}`);
    err.code = "ffmpeg_failed";
    throw err;
  }
}

async function writeJson(filePath, data) {
  await fsp.mkdir(path.dirname(filePath), { recursive: true });
  await fsp.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function toRelative(filePath) {
  return path.relative(ROOT, filePath).split(path.sep).join("/");
}

async function generateWaveformJson(filePath, outPath, durationSec) {
  const seconds = Math.max(1, Math.min(30, Number(durationSec) || 30));
  const sampleRate = 8000;
  const args = [
    "-v", "error",
    "-i", filePath,
    "-t", String(seconds),
    "-ac", "1",
    "-ar", String(sampleRate),
    "-f", "s16le",
    "pipe:1",
  ];
  const r = runtimeBinaries.spawnFileSync("ffmpeg", args, { encoding: null, maxBuffer: 64 * 1024 * 1024 });
  if (r.status !== 0) {
    const stderr = String(r.stderr || "").split("\n").slice(-12).join("\n");
    throw new Error(`waveform extraction failed: ${stderr}`);
  }
  const buffer = r.stdout || Buffer.alloc(0);
  const sampleCount = Math.floor(buffer.length / 2);
  const bucketCount = 128;
  const samplesPerBucket = Math.max(1, Math.floor(sampleCount / bucketCount));
  const peaks = [];
  for (let b = 0; b < bucketCount; b += 1) {
    let max = 0;
    const start = b * samplesPerBucket;
    const end = Math.min(sampleCount, start + samplesPerBucket);
    for (let i = start; i < end; i += 1) {
      const amp = Math.abs(buffer.readInt16LE(i * 2)) / 32768;
      if (amp > max) max = amp;
    }
    peaks.push(Math.round(max * 10000) / 10000);
  }
  const waveform = {
    schemaVersion: MEDIA_SCHEMA_VERSION,
    sampleRate,
    sourceDurationSec: round(durationSec),
    analyzedDurationSec: seconds,
    buckets: peaks.length,
    peaks,
  };
  await writeJson(outPath, waveform);
  return waveform;
}

async function generateImageDerivatives(filePath, outDir, slug) {
  const thumbnail = path.join(outDir, `${slug}_thumbnail.jpg`);
  const proxy = path.join(outDir, `${slug}_proxy.jpg`);
  runFfmpeg(["-y", "-v", "error", "-i", filePath, "-frames:v", "1", "-vf", "scale=320:-2", "-q:v", "4", thumbnail], "image thumbnail");
  runFfmpeg(["-y", "-v", "error", "-i", filePath, "-frames:v", "1", "-vf", "scale=960:-2", "-q:v", "5", proxy], "image proxy");
  return {
    thumbnailPath: toRelative(thumbnail),
    proxyPath: toRelative(proxy),
    waveformPath: null,
    spectrogramPath: null,
  };
}

async function generateAudioDerivatives(filePath, outDir, slug, metadata) {
  const thumbnail = path.join(outDir, `${slug}_waveform.png`);
  const proxy = path.join(outDir, `${slug}_proxy.m4a`);
  const waveformPath = path.join(outDir, `${slug}_waveform.json`);
  const spectrogram = path.join(outDir, `${slug}_spectrogram.png`);
  runFfmpeg(["-y", "-v", "error", "-i", filePath, "-filter_complex", "showwavespic=s=640x180:colors=38d47d", "-frames:v", "1", thumbnail], "audio waveform thumbnail");
  runFfmpeg(["-y", "-v", "error", "-i", filePath, "-t", "30", "-vn", "-ac", "1", "-ar", "24000", "-c:a", "aac", "-b:a", "96k", proxy], "audio proxy");
  runFfmpeg(["-y", "-v", "error", "-i", filePath, "-lavfi", "showspectrumpic=s=640x240:legend=disabled", "-frames:v", "1", spectrogram], "audio spectrogram");
  await generateWaveformJson(filePath, waveformPath, metadata.durationSec);
  return {
    thumbnailPath: toRelative(thumbnail),
    proxyPath: toRelative(proxy),
    waveformPath: toRelative(waveformPath),
    spectrogramPath: toRelative(spectrogram),
  };
}

async function generateVideoDerivatives(filePath, outDir, slug, metadata) {
  const thumbnail = path.join(outDir, `${slug}_thumbnail.jpg`);
  const proxy = path.join(outDir, `${slug}_proxy.mp4`);
  const waveformPath = metadata.audio ? path.join(outDir, `${slug}_waveform.json`) : null;
  const spectrogram = metadata.audio ? path.join(outDir, `${slug}_spectrogram.png`) : null;
  runFfmpeg(["-y", "-v", "error", "-ss", "0", "-i", filePath, "-frames:v", "1", "-vf", "scale=480:-2", "-q:v", "4", thumbnail], "video thumbnail");
  runFfmpeg(["-y", "-v", "error", "-i", filePath, "-t", "30", "-vf", "scale=960:-2", "-c:v", "libx264", "-preset", "veryfast", "-crf", "28", "-an", proxy], "video proxy");
  if (waveformPath) {
    await generateWaveformJson(filePath, waveformPath, metadata.durationSec);
    runFfmpeg(["-y", "-v", "error", "-i", filePath, "-lavfi", "showspectrumpic=s=640x240:legend=disabled", "-frames:v", "1", spectrogram], "video spectrogram");
  }
  return {
    thumbnailPath: toRelative(thumbnail),
    proxyPath: toRelative(proxy),
    waveformPath: waveformPath ? toRelative(waveformPath) : null,
    spectrogramPath: spectrogram ? toRelative(spectrogram) : null,
  };
}

async function generateDerivatives({ absolutePath, normalized, assetId, metadata, derivativeRoot = DEFAULT_DERIVATIVE_ROOT }) {
  const outDir = path.join(ROOT, derivativeRoot, assetId);
  await fsp.mkdir(outDir, { recursive: true });
  const slug = derivativeSlug(assetId, normalized);
  let derivatives;
  if (metadata.kind === "audio") derivatives = await generateAudioDerivatives(absolutePath, outDir, slug, metadata);
  else if (metadata.kind === "video") derivatives = await generateVideoDerivatives(absolutePath, outDir, slug, metadata);
  else derivatives = await generateImageDerivatives(absolutePath, outDir, slug);
  const manifest = {
    schemaVersion: MEDIA_SCHEMA_VERSION,
    assetId,
    sourcePath: normalized,
    derivativeRoot: toRelative(outDir),
    ...derivatives,
  };
  const manifestPath = path.join(outDir, `${slug}_derivatives.json`);
  await writeJson(manifestPath, manifest);
  return { ...manifest, manifestPath: toRelative(manifestPath) };
}

async function ingestMedia(input, options = {}) {
  const validation = validateIngestRequest(input);
  if (!validation.ok) return { ok: false, errors: validation.errors };
  ensureBinaries();
  const { normalized, absolutePath, rootKey } = resolveSafeMediaPath(input.path);
  const stat = await fsp.stat(absolutePath);
  if (!stat.isFile()) return { ok: false, errors: [error("not_a_file", "path", "Media path must resolve to a file.")] };
  const kind = classifyMedia(normalized);
  if (!ALLOWED_KINDS.includes(kind)) {
    return { ok: false, errors: [error("unsupported_media_type", "path", "Unsupported media type.")] };
  }
  const probe = runFfprobe(absolutePath);
  const assetId = stableAssetId(normalized, stat);
  const metadata = metadataFromProbe(probe, stat, normalized, kind);
  const derivatives = await generateDerivatives({
    absolutePath,
    normalized,
    assetId,
    metadata,
    derivativeRoot: options.derivativeRoot || DEFAULT_DERIVATIVE_ROOT,
  });
  const record = assetRecordFromIngest({ assetId, metadata, derivatives, projectId: input.projectId || options.projectId || "" });
  return {
    ok: true,
    asset: {
      id: assetId,
      rootKey,
      sourcePath: normalized,
      absolutePath,
      metadata,
      derivatives,
      record,
    },
  };
}

function assetRecordFromIngest({ assetId, metadata, derivatives, projectId = "" }) {
  const name = path.basename(metadata.path);
  const kind = metadata.kind === "image" ? "image" : metadata.kind;
  const record = {
    projectId,
    name,
    kind,
    path: metadata.path,
    durationSec: metadata.durationSec || undefined,
    width: metadata.video?.width || undefined,
    height: metadata.video?.height || undefined,
    fps: metadata.video?.fps || undefined,
    meta: {
      mediaSchemaVersion: MEDIA_SCHEMA_VERSION,
      assetId,
      sizeBytes: metadata.sizeBytes,
      formatName: metadata.formatName,
      audio: metadata.audio,
      derivatives: clone(derivatives, {}),
    },
  };
  for (const key of ["durationSec", "width", "height", "fps"]) {
    if (record[key] === undefined || record[key] === null) delete record[key];
  }
  return record;
}

async function registerAssetRecord(store, userId, ingestResult, projectId = "") {
  if (!ingestResult?.ok) throw new Error("Cannot register failed ingest result.");
  const record = {
    ...ingestResult.asset.record,
    projectId,
  };
  return store.create(userId, "assets", record);
}

function ensureTrack(doc, kind, name) {
  const root = doc.compositions.find((composition) => composition.root) || doc.compositions[0];
  const existing = doc.tracks.find((track) => track.compositionId === root.id && track.kind === kind && track.name === name);
  if (existing) return existing;
  const index = doc.tracks.filter((track) => track.compositionId === root.id).length;
  const track = {
    id: `track_${kind}_${crypto.createHash("sha1").update(name).digest("hex").slice(0, 8)}`,
    compositionId: root.id,
    kind,
    name,
    index,
    locked: false,
    muted: false,
  };
  doc.tracks.push(track);
  return track;
}

function linkAssetToTimelineDoc(docInput, ingestResult, options = {}) {
  if (!ingestResult?.ok) throw new Error("Cannot link failed ingest result.");
  const doc = timeline.migrate(docInput || timeline.newDoc({ name: options.projectId || "Media Pipeline" }));
  const asset = ingestResult.asset;
  const kind = asset.metadata.kind === "audio" ? "audio" : "video";
  const track = ensureTrack(doc, kind, kind === "audio" ? "A Media Ingest" : "V Media Ingest");
  const start = Number.isFinite(Number(options.start)) ? Number(options.start) : 0;
  const duration = Number(options.durationSec)
    || asset.metadata.durationSec
    || (kind === "audio" ? 5 : 4);
  const clip = {
    id: `clip_${asset.id}`,
    trackId: track.id,
    source: { type: "asset", id: asset.sourcePath },
    name: path.basename(asset.sourcePath),
    start,
    duration,
    in: 0,
    out: duration,
    meta: {
      mediaPipelineAssetId: asset.id,
      derivatives: clone(asset.derivatives, {}),
    },
  };
  doc.clips = doc.clips.filter((item) => item.id !== clip.id);
  doc.clips.push(clip);
  doc.duration = Math.max(Number(doc.duration) || 0, start + duration);
  const errors = timeline.validate(doc);
  if (errors.length) {
    const err = new Error(`Linked timeline document is invalid: ${errors.join("; ")}`);
    err.code = "invalid_timeline_link";
    err.errors = errors;
    throw err;
  }
  return { doc, clip, track };
}

async function createContactSheet(ingestResults, outputPath) {
  const assets = ingestResults.filter((item) => item?.ok && item.asset?.derivatives?.thumbnailPath);
  if (!assets.length) throw new Error("No thumbnails available for contact sheet.");
  await fsp.mkdir(path.dirname(outputPath), { recursive: true });
  const args = ["-y", "-v", "error"];
  for (const item of assets) {
    args.push("-i", path.join(ROOT, item.asset.derivatives.thumbnailPath));
  }
  const labels = assets.map((item, index) => `${index + 1}. ${path.basename(item.asset.sourcePath)}`);
  const filters = assets.map((_, index) => (
    `[${index}:v]scale=320:180:force_original_aspect_ratio=decrease,pad=320:180:(ow-iw)/2:(oh-ih)/2,setsar=1[v${index}]`
  ));
  const stackInputs = assets.map((_, index) => `[v${index}]`).join("");
  const stack = assets.length === 1
    ? `${filters[0]}[out]`
    : `${filters.join(";")};${stackInputs}hstack=inputs=${assets.length}[out]`;
  args.push("-filter_complex", stack, "-map", "[out]", "-frames:v", "1", outputPath);
  runFfmpeg(args, "contact sheet");
  return {
    path: toRelative(outputPath),
    count: assets.length,
    labels,
  };
}

module.exports = {
  MEDIA_SCHEMA_VERSION,
  MEDIA_EVIDENCE_SCHEMA_VERSION,
  DEFAULT_DERIVATIVE_ROOT,
  SAFE_MEDIA_ROOTS,
  SAFE_ROOT_MEDIA_FILES,
  validateIngestRequest,
  normalizeAssetPath,
  resolveSafeMediaPath,
  classifyMedia,
  ingestMedia,
  assetRecordFromIngest,
  registerAssetRecord,
  linkAssetToTimelineDoc,
  createContactSheet,
};
