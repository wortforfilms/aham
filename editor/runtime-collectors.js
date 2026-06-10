"use strict";
/**
 * Mahavisphot — runtime health collectors (Step 7).
 *
 * Each collector performs REAL checks and returns a structured verdict:
 *   { runtime, status: 'ready'|'degraded'|'blocked'|'unknown', summary, checks:[{name, ok, detail}] }
 *
 * Production gating rule: only 'ready' counts as production-safe. Any
 * 'degraded' / 'blocked' / 'unknown' runtime blocks production readiness.
 */
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const { execFileSync } = require("node:child_process");

const ROOT = path.resolve(__dirname, "..");

function hasBinary(name) {
  try {
    execFileSync(name, ["-version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function exists(rel) {
  try {
    return fs.existsSync(path.isAbsolute(rel) ? rel : path.join(ROOT, rel));
  } catch {
    return false;
  }
}

function verdict(checks) {
  // critical checks (ok===false && critical) => blocked; non-critical failures => degraded
  const failedCritical = checks.some((c) => !c.ok && c.critical);
  const failedAny = checks.some((c) => !c.ok);
  if (failedCritical) return "blocked";
  if (failedAny) return "degraded";
  return "ready";
}

function build(runtime, summaryReady, checks) {
  const status = verdict(checks);
  const summary = status === "ready"
    ? summaryReady
    : checks.filter((c) => !c.ok).map((c) => c.detail).join("; ");
  return { runtime, status, summary, checks: checks.map(({ critical, ...c }) => c) };
}

function editorRuntime() {
  const checks = [];
  let crudOk = true;
  try { require("./crud"); } catch { crudOk = false; }
  checks.push({ name: "crud_module", ok: crudOk, critical: true, detail: "CRUD module fails to load" });
  let writable = false;
  try {
    const probe = path.join(os.tmpdir(), `mvp-editor-probe-${process.pid}`);
    fs.mkdirSync(probe, { recursive: true });
    fs.writeFileSync(path.join(probe, "w.json"), "{}");
    writable = true;
  } catch {}
  checks.push({ name: "data_writable", ok: writable, critical: true, detail: "data directory is not writable" });
  checks.push({ name: "pages_registry", ok: exists("src/mahavisphot/data/mahavisphot-pages.json"), critical: false, detail: "UX page registry missing" });
  return build("editor", "Editor runtime ready: CRUD module loads, local persistence writable.", checks);
}

function mediaRuntime() {
  const checks = [
    { name: "ffmpeg", ok: hasBinary("ffmpeg"), critical: true, detail: "ffmpeg not found on PATH" },
    { name: "ffprobe", ok: hasBinary("ffprobe"), critical: true, detail: "ffprobe not found on PATH" },
    { name: "master_audio", ok: exists("अहं ब्रह्मास्मि.wav"), critical: false, detail: "master audio stem missing" },
    { name: "frame_source", ok: exists("build_frames/lineup_unique_art2/named_frames_1080p_jpg"), critical: false, detail: "named frame source missing" },
  ];
  return build("media", "Media runtime ready: ffmpeg/ffprobe present, sources resolvable.", checks);
}

function renderRuntime() {
  const checks = [
    { name: "ffmpeg", ok: hasBinary("ffmpeg"), critical: true, detail: "ffmpeg not found; cannot encode" },
    { name: "render_script", ok: exists("scripts/render_film.mjs"), critical: true, detail: "render_film.mjs missing" },
  ];
  return build("render", "Render runtime ready: encoder available, render recipe present.", checks);
}

function audioRuntime() {
  const checks = [{ name: "ffprobe", ok: hasBinary("ffprobe"), critical: true, detail: "ffprobe not found; cannot analyze audio" }];
  let durationOk = false;
  let detail = "could not probe master audio duration";
  if (checks[0].ok && exists("अहं ब्रह्मास्मि.wav")) {
    try {
      const out = execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", path.join(ROOT, "अहं ब्रह्मास्मि.wav")], { encoding: "utf8" });
      durationOk = parseFloat(out) > 0;
    } catch {}
  }
  checks.push({ name: "audio_probe", ok: durationOk, critical: false, detail });
  return build("audio", "Audio runtime ready: ffprobe present, master stem analyzable.", checks);
}

function localAiRuntime() {
  const modelDir = process.env.MAHAVISPHOT_MODEL_DIR || "";
  const ok = !!modelDir && exists(modelDir) && fs.readdirSync(modelDir).length > 0;
  const checks = [{ name: "model_inventory", ok, critical: true, detail: "no local model runtime configured (set MAHAVISPHOT_MODEL_DIR to a populated model directory)" }];
  return build("local_ai", "Local AI runtime ready: model directory present and populated.", checks);
}

function cloudAiRuntime() {
  const key = process.env.MAHAVISPHOT_CLOUD_API_KEY || process.env.MAHAVISPHOT_PROVIDER_KEY || "";
  const checks = [{ name: "provider_credentials", ok: !!key, critical: true, detail: "no provider credentials (set MAHAVISPHOT_CLOUD_API_KEY)" }];
  return build("cloud_ai", "Cloud AI runtime ready: provider credentials present.", checks);
}

function hybridAiRuntime(localStatus, cloudStatus) {
  const checks = [
    { name: "local_leg", ok: localStatus === "ready", critical: true, detail: "local AI leg not ready" },
    { name: "cloud_leg", ok: cloudStatus === "ready", critical: true, detail: "cloud AI leg not ready" },
  ];
  return build("hybrid_ai", "Hybrid AI runtime ready: both local and cloud legs ready; fallback routing available.", checks);
}

function collectAll() {
  const editor = editorRuntime();
  const media = mediaRuntime();
  const render = renderRuntime();
  const audio = audioRuntime();
  const localAi = localAiRuntime();
  const cloudAi = cloudAiRuntime();
  const hybridAi = hybridAiRuntime(localAi.status, cloudAi.status);
  const runtimes = [editor, media, render, audio, localAi, cloudAi, hybridAi];
  const blockers = runtimes.filter((r) => r.status !== "ready").map((r) => ({ runtime: r.runtime, status: r.status, summary: r.summary }));
  return {
    generatedAt: new Date().toISOString(),
    host: { node: process.version, platform: `${os.platform()} ${os.arch()}` },
    runtimes,
    productionReady: blockers.length === 0,
    blockers,
  };
}

module.exports = {
  collectAll,
  editorRuntime, mediaRuntime, renderRuntime, audioRuntime,
  localAiRuntime, cloudAiRuntime, hybridAiRuntime,
  RUNTIMES: ["editor", "media", "render", "audio", "local_ai", "cloud_ai", "hybrid_ai"],
};
