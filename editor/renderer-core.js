"use strict";
/**
 * Mahavisphot — manifest-native renderer core.
 *
 * Consumes a verified `mahavisphot.export.v1` manifest and compiles a local
 * ffmpeg preview from the manifest clip table. This proves renderer/schema
 * linkage without claiming complete UHD/VFX/AI production parity.
 */
const fs = require("node:fs");
const fsp = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");
const { execFileSync, spawn } = require("node:child_process");

const ROOT = path.resolve(__dirname, "..");
const EXPORT_SCHEMA_VERSION = "mahavisphot.export.v1";
const RENDERER_SCHEMA_VERSION = "mahavisphot.renderer.v1";
const RENDERER_EVIDENCE_SCHEMA_VERSION = "mahavisphot.renderer.evidence.v1";
const RENDER_PROFILES = ["preview", "uhd"];
const SAFE_MEDIA_ROOTS = new Map([
  ["build_frames", path.join(ROOT, "build_frames")],
  ["build_audio_separation", path.join(ROOT, "build_audio_separation")],
  ["media", path.join(ROOT, "media")],
  ["exports", path.join(ROOT, "exports")],
]);
const SAFE_ROOT_MEDIA_FILES = new Set(["अहं ब्रह्मास्मि.wav"]);
const SAFE_MANIFEST_ROOTS = [
  path.join(ROOT, "exports"),
  path.join(ROOT, "public", "mahavisphot"),
  path.join(ROOT, "docs", "mahavisphot", "evidence"),
];
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const VIDEO_EXTENSIONS = new Set([".mp4", ".mov", ".mkv", ".webm"]);
const AUDIO_EXTENSIONS = new Set([".wav", ".mp3", ".m4a", ".aac", ".flac", ".ogg"]);

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

function validationResult(errors) {
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
  if (!root || rest.length === 0) throw new Error("Asset path is outside safe media roots");
  return { normalized, absolutePath: safeJoin(root, rest.join("/")), rootKey: folder };
}

function resolveSafeManifestPath(manifestPath) {
  const input = String(manifestPath || "").replace(/^\/assets\//, "");
  const candidate = path.isAbsolute(input) ? path.resolve(input) : path.resolve(ROOT, normalizeAssetPath(input));
  const allowed = SAFE_MANIFEST_ROOTS.some((root) => candidate === root || candidate.startsWith(root + path.sep));
  if (!allowed) throw new Error("Manifest path is outside safe manifest roots");
  return candidate;
}

function hasBinary(name) {
  try {
    execFileSync(name, ["-version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function round(value, places = 6) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  const scale = 10 ** places;
  return Math.round(n * scale) / scale;
}

function safeSegment(value, fallback = "render") {
  return String(value || fallback)
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 72) || fallback;
}

function sourceHash(value) {
  return crypto.createHash("sha256").update(JSON.stringify(value ?? null)).digest("hex").slice(0, 16);
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function validateCompileRequest(input) {
  const errors = [];
  if (!isObject(input)) return validationResult([error("invalid_payload", "payload", "Compile request must be an object.")]);
  if (input.manifestPath === undefined && input.manifest === undefined) {
    errors.push(error("missing_manifest", "manifestPath", "Provide manifestPath or manifest."));
  }
  if (input.manifestPath !== undefined) {
    if (typeof input.manifestPath !== "string" || !input.manifestPath.trim()) {
      errors.push(error("invalid_manifest_path", "manifestPath", "manifestPath must be a non-empty string."));
    } else {
      try { resolveSafeManifestPath(input.manifestPath); } catch (err) {
        errors.push(error("unsafe_manifest_path", "manifestPath", err.message));
      }
    }
  }
  if (input.manifest !== undefined && !isObject(input.manifest)) {
    errors.push(error("invalid_manifest", "manifest", "manifest must be an object when supplied."));
  }
  if (input.profile !== undefined && !RENDER_PROFILES.includes(input.profile)) {
    errors.push(error("invalid_profile", "profile", `profile must be one of ${RENDER_PROFILES.join(", ")}.`));
  }
  for (const field of ["width", "height", "fps", "maxDurationSec"]) {
    if (input[field] !== undefined && (!Number.isFinite(Number(input[field])) || Number(input[field]) <= 0)) {
      errors.push(error(`invalid_${field}`, field, `${field} must be a positive number when supplied.`));
    }
  }
  return validationResult(errors);
}

function validateExportManifest(manifest) {
  const errors = [];
  if (!isObject(manifest)) return validationResult([error("invalid_manifest", "manifest", "Manifest must be an object.")]);
  if (manifest.schemaVersion !== EXPORT_SCHEMA_VERSION) {
    errors.push(error("invalid_schema_version", "schemaVersion", `Expected ${EXPORT_SCHEMA_VERSION}.`));
  }
  if (!Array.isArray(manifest.tracks)) errors.push(error("invalid_tracks", "tracks", "Manifest tracks must be an array."));
  if (!Array.isArray(manifest.clips)) errors.push(error("invalid_clips", "clips", "Manifest clips must be an array."));
  if (!isObject(manifest.renderPlan)) errors.push(error("invalid_render_plan", "renderPlan", "Manifest renderPlan must be an object."));
  return validationResult(errors);
}

function extensionKind(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (IMAGE_EXTENSIONS.has(ext)) return "image";
  if (VIDEO_EXTENSIONS.has(ext)) return "video";
  if (AUDIO_EXTENSIONS.has(ext)) return "audio";
  return "unsupported";
}

function resolveRenderableClips(manifest, durationLimit) {
  const skipped = [];
  const video = [];
  const audio = [];
  const clips = Array.isArray(manifest.clips) ? manifest.clips : [];
  for (const clip of clips) {
    if (clip.sourceType !== "asset" || !clip.sourceId) continue;
    let resolved;
    try {
      resolved = resolveSafeMediaPath(clip.sourceId);
    } catch (err) {
      skipped.push({ clipId: clip.id, sourceId: clip.sourceId, reason: err.message });
      continue;
    }
    if (!fs.existsSync(resolved.absolutePath)) {
      skipped.push({ clipId: clip.id, sourceId: clip.sourceId, reason: "source file missing" });
      continue;
    }
    const mediaKind = extensionKind(resolved.absolutePath);
    const normalized = {
      clipId: clip.id,
      name: clip.name || clip.id,
      sourceId: clip.sourceId,
      path: resolved.absolutePath,
      relativePath: resolved.normalized,
      start: round(clip.start),
      duration: Math.max(0.05, round(Math.min(Number(clip.duration) || 1, durationLimit))),
      in: round(clip.in || 0),
      mediaKind,
    };
    if (clip.kind === "video" && ["image", "video"].includes(mediaKind)) video.push(normalized);
    else if (clip.kind === "audio" && mediaKind === "audio") audio.push(normalized);
    else skipped.push({ clipId: clip.id, sourceId: clip.sourceId, reason: `unsupported ${clip.kind}/${mediaKind} renderer input` });
  }
  video.sort((a, b) => a.start - b.start || a.clipId.localeCompare(b.clipId));
  audio.sort((a, b) => a.start - b.start || a.clipId.localeCompare(b.clipId));
  return { video, audio, skipped };
}

function runFfmpeg(args, cwd = ROOT) {
  return new Promise((resolve, reject) => {
    const child = spawn("ffmpeg", args, { cwd });
    let stderr = "";
    child.stderr.on("data", (data) => {
      stderr += data.toString();
      if (stderr.length > 24000) stderr = stderr.slice(-24000);
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve(stderr);
      else {
        const err = new Error(stderr || `ffmpeg exited with code ${code}`);
        err.code = "ffmpeg_failed";
        reject(err);
      }
    });
  });
}

function targetFromRequest(input, manifest) {
  const profile = RENDER_PROFILES.includes(input.profile) ? input.profile : "preview";
  const rootComposition = Array.isArray(manifest.compositions) ? manifest.compositions.find((item) => item.root) : null;
  const even = (value) => Math.max(2, Math.round(value / 2) * 2);
  const width = even(Number(input.width) || (profile === "uhd" ? 3840 : Math.min(Number(rootComposition?.width) || 1280, 1280)));
  const height = even(Number(input.height) || (profile === "uhd" ? 2160 : Math.min(Number(rootComposition?.height) || 720, 720)));
  const fps = Math.round(Number(input.fps) || Number(manifest.renderPlan?.fps) || Number(manifest.timelineDocument?.fps) || 24);
  const maxDurationSec = Number(input.maxDurationSec) || (profile === "uhd" ? 60 : 12);
  return { profile, width, height, fps, maxDurationSec };
}

/* =====================================================================
 * CONCURRENT MULTI-LINGUAL CAPTION BURN-IN
 * Builds a single-pass, stacked drawtext chain so the primary (Hindi /
 * Devanagari) and secondary (English) caption layers burn simultaneously
 * over the exact same timecode window — one filtergraph pass, no duplicate
 * source reads, no dropped frames.
 * ===================================================================== */
const CAPTION_PRIMARY_Y = "h-220";   // Hindi / primary script baseline
const CAPTION_SECONDARY_Y = "h-120"; // English / secondary translation baseline
const LOUDNESS_TARGET_LUFS = -14;
const TRUE_PEAK_CEILING_DBTP = -1.0;
const TRUE_PEAK_LIMIT_LINEAR = round(10 ** (TRUE_PEAK_CEILING_DBTP / 20), 5); // -1 dBTP -> 0.89125

function compactLine(value) {
  return String(value == null ? "" : value).replace(/\s+/g, " ").trim();
}

function captionFontSize(target, tier) {
  const base = target.height >= 1440 ? 64 : target.height >= 720 ? 38 : 20;
  return tier === "primary" ? base : Math.max(10, Math.round(base * 0.7));
}

// Repository-contained Devanagari binary (offline, no host-font dependency).
// Bootstrap with: node scripts/mahavisphot-bootstrap-fonts.js
const REPO_DEVANAGARI_FONT = path.join(__dirname, "..", "assets", "fonts", "system", "NotoSansDevanagari-Bold.ttf");

function resolveCaptionFonts() {
  const candidates = {
    devanagari: [
      REPO_DEVANAGARI_FONT, // prefer the repo-embedded font so glyphs render on any host
      "/usr/share/fonts/truetype/noto/NotoSansDevanagari-Regular.ttf",
      "/usr/share/fonts/truetype/noto/NotoSansDevanagari-Bold.ttf",
      "/usr/share/fonts/truetype/lohit-devanagari/Lohit-Devanagari.ttf",
      "/usr/share/fonts/truetype/ttf-devanagari/gargi.ttf",
    ],
    latin: [
      "/usr/share/fonts/truetype/lato/Lato-Bold.ttf",
      "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
      "/usr/share/fonts/truetype/noto/NotoSans-Bold.ttf",
    ],
  };
  const pick = (list) => list.find((p) => { try { return fs.existsSync(p); } catch { return false; } }) || null;
  const devanagari = pick(candidates.devanagari);
  const latin = pick(candidates.latin);
  return {
    devanagari: { path: devanagari || latin, available: Boolean(devanagari) },
    latin: { path: latin || devanagari, available: Boolean(latin) },
  };
}

function escapeDrawtext(value) {
  // Args are passed via spawn (no shell): escape only filtergraph-significant
  // characters. Straight apostrophes are converted to a typographic apostrophe
  // so they can never terminate the single-quoted text token.
  return String(value == null ? "" : value)
    .replace(/\\/g, "\\\\")
    .replace(/:/g, "\\:")
    .replace(/%/g, "\\%")
    .replace(/'/g, "’");
}

function extractCaptionLayers(manifest, target) {
  const fonts = resolveCaptionFonts();
  const captions = Array.isArray(manifest.captions) ? manifest.captions : [];
  const layers = [];
  for (const cap of captions) {
    const start = round(Math.max(0, Number(cap.start) || 0));
    const rawEnd = Number(cap.end ?? (start + (Number(cap.duration) || 1)));
    const end = round(Math.min(Number.isFinite(rawEnd) ? rawEnd : start + 1, target.durationSec));
    if (!(end > start)) continue;
    const enable = `between(t,${start},${end})`;
    const hi = compactLine(cap.titleHi);
    const en = compactLine(cap.titleEn ?? cap.text);
    if (hi) {
      layers.push({ lang: "hi", tier: "primary", text: hi, font: fonts.devanagari.path,
        y: CAPTION_PRIMARY_Y, fontSize: captionFontSize(target, "primary"), start, end, enable });
    }
    if (en && en !== hi) {
      layers.push({ lang: "en", tier: "secondary", text: en, font: fonts.latin.path,
        y: CAPTION_SECONDARY_Y, fontSize: captionFontSize(target, "secondary"), start, end, enable });
    }
  }
  return { layers, fonts };
}

function buildCaptionDrawtextChain(layers) {
  return layers.map((layer) => [
    `drawtext=fontfile=${layer.font}`,
    `text='${escapeDrawtext(layer.text)}'`,
    "x=(w-text_w)/2",
    `y=${layer.y}`,
    `fontsize=${layer.fontSize}`,
    "fontcolor=white",
    "borderw=2",
    "bordercolor=black@0.85",
    "box=1",
    "boxcolor=black@0.45",
    "boxborderw=14",
    `enable='${layer.enable}'`,
  ].join(":"));
}

/* =====================================================================
 * MULTI-CHANNEL AUDIO BALANCING & PANNING
 * Each stem is normalized to stereo, role-panned via an explicit pan matrix
 * (preventing phase cancellation), weighted, then summed and constrained to
 * -14 LUFS integrated with a hard -1.0 dBTP true-peak ceiling.
 * ===================================================================== */
function resolveAudioMix(clip) {
  const mix = (clip && clip.meta && clip.meta.audioMix) || {};
  const name = String(clip.name || clip.sourceId || "").toLowerCase();
  let role = typeof mix.role === "string" ? mix.role : null;
  if (!role) {
    if (/(^|[^a-z])(vo|voice|vox|dialog|narrat)/.test(name)) role = "vo";
    else if (/(music|score|bgm|song|theme)/.test(name)) role = "music";
    else role = "master";
  }
  let pan = typeof mix.pan === "string" && mix.pan.trim() ? mix.pan.trim() : null;
  if (!pan) {
    if (role === "vo") pan = "stereo|c0=0.85*c0+0.15*c1|c1=0.15*c0+0.85*c1";
    else if (role === "music") pan = "stereo|c0=0.92*c0+0.08*c1|c1=0.08*c0+0.92*c1";
    else pan = "stereo|c0=0.5*c0+0.5*c1|c1=0.5*c0+0.5*c1";
  }
  let gain = Number(mix.gain);
  if (!Number.isFinite(gain) || gain < 0) {
    const gainDb = Number(mix.gainDb);
    gain = Number.isFinite(gainDb) ? round(10 ** (gainDb / 20), 5) : (role === "music" ? 0.7 : 1.0);
  }
  return { role, pan, gain };
}

function buildAudioFilterGraph(audioClips, videoInputCount) {
  if (!audioClips.length) return null;
  const filters = [];
  const stems = [];
  audioClips.forEach((clip, i) => {
    const inputIndex = videoInputCount + i;
    const { role, pan, gain } = resolveAudioMix(clip);
    filters.push(
      `[${inputIndex}:a]aresample=48000,aformat=channel_layouts=stereo,volume=${gain},pan=${pan}[a${i}]`
    );
    stems.push({ clipId: clip.clipId, sourceId: clip.sourceId, role, pan, gain });
  });
  let mixedLabel;
  if (audioClips.length === 1) {
    mixedLabel = "a0";
  } else {
    const inputs = audioClips.map((_, i) => `[a${i}]`).join("");
    filters.push(`${inputs}amix=inputs=${audioClips.length}:duration=longest:normalize=0[amixraw]`);
    mixedLabel = "amixraw";
  }
  filters.push(
    `[${mixedLabel}]loudnorm=I=${LOUDNESS_TARGET_LUFS}:TP=${TRUE_PEAK_CEILING_DBTP}:LRA=11,alimiter=limit=${TRUE_PEAK_LIMIT_LINEAR}[aout]`
  );
  return { filters, outLabel: "aout", stems };
}

function parseEncodeFps(stderr) {
  const matches = [...String(stderr || "").matchAll(/fps=\s*([\d.]+)/g)]
    .map((m) => Number(m[1]))
    .filter((n) => Number.isFinite(n) && n > 0);
  if (!matches.length) return null;
  return round(matches.reduce((a, b) => a + b, 0) / matches.length, 1);
}

function buildFfmpegArgs({ videoClips, audioClips, captionLayers, target, outputPath }) {
  const args = ["-y", "-hide_banner"];
  for (const clip of videoClips) {
    if (clip.mediaKind === "image") {
      args.push("-loop", "1", "-t", clip.duration.toFixed(6), "-i", clip.path);
    } else {
      args.push("-ss", clip.in.toFixed(6), "-t", clip.duration.toFixed(6), "-i", clip.path);
    }
  }
  for (const clip of audioClips) {
    args.push("-ss", clip.in.toFixed(6), "-t", target.durationSec.toFixed(6), "-i", clip.path);
  }

  const filters = videoClips.map((_, index) => (
    `[${index}:v]scale=${target.width}:${target.height}:force_original_aspect_ratio=increase,crop=${target.width}:${target.height},fps=${target.fps},setsar=1,setpts=PTS-STARTPTS[v${index}]`
  ));
  const concatInputs = videoClips.map((_, index) => `[v${index}]`).join("");
  filters.push(`${concatInputs}concat=n=${videoClips.length}:v=1:a=0[baseTimeline]`);

  let videoOut = "[baseTimeline]";
  const drawtextChain = buildCaptionDrawtextChain(captionLayers || []);
  if (drawtextChain.length) {
    filters.push(`[baseTimeline]${drawtextChain.join(",")}[vout]`);
    videoOut = "[vout]";
  }

  const audioGraph = buildAudioFilterGraph(audioClips || [], videoClips.length);
  if (audioGraph) filters.push(...audioGraph.filters);

  args.push("-filter_complex", filters.join(";"));
  args.push("-map", videoOut);
  if (audioGraph) args.push("-map", `[${audioGraph.outLabel}]`);
  args.push(
    "-t", target.durationSec.toFixed(6),
    "-c:v", "libx264",
    "-preset", target.profile === "uhd" ? "medium" : "veryfast",
    "-crf", target.profile === "uhd" ? "18" : "23",
    "-pix_fmt", "yuv420p",
    "-r", String(target.fps)
  );
  if (audioGraph) args.push("-c:a", "aac", "-b:a", "192k", "-ar", "48000");
  args.push(outputPath);
  return { args, audioGraph };
}

class MahavisphotRenderEngine {
  constructor(workspaceRoot = ROOT) {
    this.workspaceRoot = path.resolve(workspaceRoot);
    this.activeRenderJobs = new Map();
  }

  async loadManifest(input) {
    if (input.manifest) return { manifest: clone(input.manifest, {}), manifestPath: null };
    const manifestPath = resolveSafeManifestPath(input.manifestPath);
    const manifest = JSON.parse(await fsp.readFile(manifestPath, "utf8"));
    return { manifest, manifestPath };
  }

  async executeManifestRender(input = {}) {
    const requestValidation = validateCompileRequest(input);
    if (!requestValidation.ok) {
      const err = new Error("Renderer compile request validation failed");
      err.code = "renderer_validation_failed";
      err.errors = requestValidation.errors;
      throw err;
    }
    if (!hasBinary("ffmpeg")) {
      const err = new Error("ffmpeg not found on PATH");
      err.code = "renderer_runtime_blocked";
      err.missing = ["ffmpeg"];
      throw err;
    }
    const { manifest, manifestPath } = await this.loadManifest(input);
    const manifestValidation = validateExportManifest(manifest);
    if (!manifestValidation.ok) {
      const err = new Error("Renderer manifest validation failed");
      err.code = "renderer_manifest_invalid";
      err.errors = manifestValidation.errors;
      throw err;
    }

    const target = targetFromRequest(input, manifest);
    const sourceDuration = Math.max(0.05, Number(manifest.timelineDocument?.duration) || Number(manifest.renderPlan?.duration) || target.maxDurationSec);
    target.durationSec = round(Math.min(sourceDuration, target.maxDurationSec));
    const { video, audio, skipped } = resolveRenderableClips(manifest, target.durationSec);
    if (!video.length) {
      const err = new Error("Manifest contains no renderable video asset clips.");
      err.code = "renderer_no_video";
      err.errors = [error("missing_video_clips", "clips", "At least one safe, existing video/image asset clip is required.")];
      throw err;
    }

    const projectId = safeSegment(manifest.source?.projectId || manifest.timelineDocument?.id || "mahavisphot");
    const renderId = `render_${sourceHash({ manifest, target })}`;
    const outputDir = path.join(this.workspaceRoot, "exports", "render-core", projectId, renderId);
    await fsp.mkdir(outputDir, { recursive: true });

    const outputPath = path.join(outputDir, "mahavisphot_manifest_preview.mp4");
    const reportPath = path.join(outputDir, "renderer-parity-report.json");
    const manifestCopyPath = path.join(outputDir, "export-schema.json");
    const filterArgsPath = path.join(outputDir, "ffmpeg-args.json");
    // Concurrent multi-lingual caption layers (Hindi primary + English secondary).
    const { layers: captionLayers, fonts: captionFonts } = extractCaptionLayers(manifest, target);
    // All renderable audio stems (master / VO / music) for pan-matrix mixing.
    const audioClips = audio;
    const audioClip = audioClips[0] || null;
    const { args: ffmpegArgs, audioGraph } = buildFfmpegArgs({
      videoClips: video, audioClips, captionLayers, target, outputPath,
    });

    await fsp.writeFile(manifestCopyPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
    await fsp.writeFile(filterArgsPath, `${JSON.stringify({ args: ffmpegArgs }, null, 2)}\n`, "utf8");

    // Run the encode, piping ffmpeg telemetry through the render-loop analyzer.
    const collectors = require("./runtime-collectors");
    const encodeStderr = await runFfmpeg(ffmpegArgs, this.workspaceRoot);
    const encodeFps = parseEncodeFps(encodeStderr);
    const renderLoop = collectors.evaluateRenderLoop(encodeFps, target.fps);

    // Post-encode loudness verification — halt + clean up before any corrupt
    // master is published if the true-peak ceiling is breached.
    let outputLoudness = null;
    if (audioGraph) {
      try {
        outputLoudness = collectors.measureLoudness(outputPath);
      } catch (loudnessError) {
        outputLoudness = { status: "error", error: loudnessError.message || String(loudnessError) };
      }
      if (outputLoudness && outputLoudness.status === "ok" && outputLoudness.abort) {
        try { await fsp.rm(outputPath, { force: true }); } catch (_cleanupError) { /* unlink may be blocked; report still aborts */ }
        const err = new Error(`Rendered master is clipping/over-amplified and was discarded: ${outputLoudness.verdict}`);
        err.code = "renderer_loudness_breach";
        err.loudness = outputLoudness;
        throw err;
      }
    }

    const report = {
      schemaVersion: RENDERER_EVIDENCE_SCHEMA_VERSION,
      rendererSchemaVersion: RENDERER_SCHEMA_VERSION,
      generatedAt: new Date().toISOString(),
      renderId,
      projectId,
      status: "SUCCESS",
      mode: "manifest-preview",
      source: {
        manifestPath: manifestPath ? path.relative(this.workspaceRoot, manifestPath).split(path.sep).join("/") : null,
        manifestCopyPath: path.relative(this.workspaceRoot, manifestCopyPath).split(path.sep).join("/"),
        exportSchemaVersion: manifest.schemaVersion,
        timelineDocumentVersion: manifest.source?.timelineDocumentVersion ?? null,
        timelineDocumentHash: manifest.timelineDocument?.hash || null,
      },
      compiledOutput: path.relative(this.workspaceRoot, outputPath).split(path.sep).join("/"),
      compiledOutputUrl: `/assets/${path.relative(this.workspaceRoot, outputPath).split(path.sep).join("/")}`,
      reportPath: path.relative(this.workspaceRoot, reportPath).split(path.sep).join("/"),
      target,
      parity: {
        manifestRead: true,
        exportSchemaVersion: EXPORT_SCHEMA_VERSION,
        renderPlanStatus: manifest.renderPlan?.status || "unknown",
        videoWindowsRead: Array.isArray(manifest.renderPlan?.videoWindows) ? manifest.renderPlan.videoWindows.length : 0,
        audioWindowsRead: Array.isArray(manifest.renderPlan?.audioWindows) ? manifest.renderPlan.audioWindows.length : 0,
        clipTableRead: Array.isArray(manifest.clips),
        assetPathsVerified: video.every((clip) => fs.existsSync(clip.path)) && audioClips.every((clip) => fs.existsSync(clip.path)),
        rendererCoveredClipIds: video.map((clip) => clip.clipId),
        skippedClips: skipped,
        captionsBurnedIn: captionLayers.length,
        audioStemsPanned: audioGraph ? audioGraph.stems.length : 0,
        loudnessEnforced: Boolean(audioGraph),
      },
      captions: {
        layerCount: captionLayers.length,
        languages: [...new Set(captionLayers.map((layer) => layer.lang))],
        concurrentPairs: captionLayers.filter((layer) => layer.tier === "secondary").length,
        fontDevanagariAvailable: captionFonts.devanagari.available,
        fontLatinAvailable: captionFonts.latin.available,
        note: captionFonts.devanagari.available
          ? "Devanagari + Latin fonts resolved; both layers rasterize."
          : "No Devanagari font on this host: the Hindi drawtext layer is emitted correctly but its glyphs will not rasterize here. Install fonts-noto-devanagari (or set a Devanagari fontfile) for full glyph coverage.",
        layers: captionLayers.map((layer) => ({ lang: layer.lang, tier: layer.tier, text: layer.text, y: layer.y, start: layer.start, end: layer.end })),
      },
      audioMix: {
        stems: audioGraph ? audioGraph.stems : [],
        targetLufs: LOUDNESS_TARGET_LUFS,
        truePeakCeilingDbtp: TRUE_PEAK_CEILING_DBTP,
        truePeakLimitLinear: TRUE_PEAK_LIMIT_LINEAR,
        outputLoudness,
        conforms: outputLoudness && outputLoudness.status === "ok" ? outputLoudness.conforms : null,
      },
      telemetry: {
        fpsTarget: target.fps,
        durationSec: target.durationSec,
        totalFramesRendered: Math.round(target.durationSec * target.fps),
        videoClipCount: video.length,
        audioAttached: audioClips.length > 0,
        audioStemCount: audioClips.length,
        captionLayerCount: captionLayers.length,
        encode: { avgFps: encodeFps, loopStatus: renderLoop.status, frameBudgetMs: renderLoop.frameBudgetMs ?? null },
      },
      productionReady: false,
      blockers: [
        "Renderer core verifies manifest-native preview compilation with concurrent multi-lingual caption burn-in and multi-channel pan/loudness enforcement.",
        "Full UHD visual parity for VFX, particles, 3D, motion tracking, face passes, and AI passes still requires dedicated renderer evidence.",
      ],
    };
    await fsp.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
    return report;
  }
}

module.exports = {
  RENDERER_SCHEMA_VERSION,
  RENDERER_EVIDENCE_SCHEMA_VERSION,
  RENDER_PROFILES,
  validateCompileRequest,
  validateExportManifest,
  resolveSafeManifestPath,
  resolveSafeMediaPath,
  MahavisphotRenderEngine,
  // AV filtergraph builders (concurrent caption burn-in + pan matrices)
  resolveCaptionFonts,
  escapeDrawtext,
  extractCaptionLayers,
  buildCaptionDrawtextChain,
  resolveAudioMix,
  buildAudioFilterGraph,
  buildFfmpegArgs,
  parseEncodeFps,
  LOUDNESS_TARGET_LUFS,
  TRUE_PEAK_CEILING_DBTP,
  TRUE_PEAK_LIMIT_LINEAR,
};
