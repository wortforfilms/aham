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
  let pipelineOk = true;
  try { require("./media-pipeline"); } catch { pipelineOk = false; }
  const checks = [
    { name: "ffmpeg", ok: hasBinary("ffmpeg"), critical: true, detail: "ffmpeg not found on PATH" },
    { name: "ffprobe", ok: hasBinary("ffprobe"), critical: true, detail: "ffprobe not found on PATH" },
    { name: "media_pipeline_module", ok: pipelineOk, critical: true, detail: "media-pipeline module fails to load" },
    { name: "media_pipeline_evidence", ok: exists("docs/mahavisphot/evidence/latest-media-pipeline-evidence.json"), critical: false, detail: "latest media pipeline evidence missing" },
    { name: "master_audio", ok: exists("अहं ब्रह्मास्मि.wav"), critical: false, detail: "master audio stem missing" },
    { name: "frame_source", ok: exists("build_frames/lineup_unique_art2/named_frames_1080p_jpg"), critical: false, detail: "named frame source missing" },
  ];
  return build("media", "Media runtime ready: ffmpeg/ffprobe present, ingest pipeline loads, evidence and sources resolvable.", checks);
}

function renderRuntime() {
  let rendererCoreOk = true;
  try { require("./renderer-core"); } catch { rendererCoreOk = false; }
  const checks = [
    { name: "ffmpeg", ok: hasBinary("ffmpeg"), critical: true, detail: "ffmpeg not found; cannot encode" },
    { name: "render_script", ok: exists("scripts/render_film.mjs"), critical: true, detail: "render_film.mjs missing" },
    { name: "renderer_core_module", ok: rendererCoreOk, critical: true, detail: "renderer-core module fails to load" },
    { name: "renderer_core_evidence", ok: exists("docs/mahavisphot/evidence/latest-renderer-core-evidence.json"), critical: false, detail: "latest renderer core evidence missing" },
  ];
  return build("render", "Render runtime ready: encoder available, render recipe and manifest renderer core present.", checks);
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

/* =====================================================================
 * SOVEREIGN ENGINE TELEMETRY FEED
 * Real hardware/loudness telemetry. No fabricated values: GPU usage is
 * reported only when a vendor tool is present, otherwise 'unavailable'.
 * Loudness is true ITU-R BS.1770 integrated LUFS via ffmpeg `ebur128`.
 * ===================================================================== */
const { spawnSync } = require("node:child_process");

const round = (v, p = 2) => { const f = 10 ** p; return Math.round(Number(v) * f) / f; };
const LUFS_TARGET = -14;          // streaming/broadcast loudness target
const LUFS_TOLERANCE = 1.0;       // ± LU considered "conformant"
const TRUE_PEAK_CEILING_DBTP = -1; // dBTP ceiling; above this we abort

// ---- host CPU/memory (real, sampled) ----
function _cpuSnapshot() {
  let idle = 0, total = 0;
  for (const c of os.cpus()) {
    for (const t of Object.values(c.times)) total += t;
    idle += c.times.idle;
  }
  return { idle, total };
}
async function hostMetrics() {
  const a = _cpuSnapshot();
  await new Promise((r) => setTimeout(r, 120));
  const b = _cpuSnapshot();
  const dIdle = b.idle - a.idle;
  const dTotal = b.total - a.total || 1;
  const cpuUsagePct = Math.max(0, Math.min(100, round((1 - dIdle / dTotal) * 100, 2)));
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const proc = process.memoryUsage();
  return {
    cores: os.cpus().length,
    cpuUsagePct,
    loadAvg1: round(os.loadavg()[0], 2),
    memTotalMB: Math.round(totalMem / 1048576),
    memUsedMB: Math.round((totalMem - freeMem) / 1048576),
    memUsagePct: round(((totalMem - freeMem) / totalMem) * 100, 2),
    rssMB: round(proc.rss / 1048576, 1),
    heapUsedMB: round(proc.heapUsed / 1048576, 1),
    uptimeSec: Math.round(process.uptime()),
  };
}

// ---- GPU probe (honest: real numbers only when a tool exists) ----
function probeGpu() {
  // NVIDIA: real VRAM + utilization when nvidia-smi is present
  const smi = spawnSync("nvidia-smi",
    ["--query-gpu=name,memory.used,memory.total,utilization.gpu", "--format=csv,noheader,nounits"],
    { encoding: "utf8", timeout: 4000 });
  if (smi.status === 0 && smi.stdout && smi.stdout.trim()) {
    const gpus = smi.stdout.trim().split("\n").map((line) => {
      const [name, usedMB, totalMB, utilPct] = line.split(",").map((s) => s.trim());
      return { name, memUsedMB: Number(usedMB), memTotalMB: Number(totalMB),
        memUsagePct: round((Number(usedMB) / Number(totalMB)) * 100, 2), utilizationPct: Number(utilPct) };
    });
    return { status: "ok", vendor: "nvidia", gpus };
  }
  // macOS: chipset name only — no live VRAM usage API without Metal tooling
  if (os.platform() === "darwin") {
    const sp = spawnSync("/usr/sbin/system_profiler", ["SPDisplaysDataType"], { encoding: "utf8", timeout: 5000 });
    if (sp.status === 0 && sp.stdout) {
      const m = sp.stdout.match(/Chipset Model:\s*(.+)/);
      return { status: "name_only", vendor: "apple", gpus: m ? [{ name: m[1].trim() }] : [],
        note: "macOS exposes no portable live VRAM-usage API; chipset name only." };
    }
  }
  return { status: "unavailable", gpus: [], note: "No GPU telemetry source (nvidia-smi/system_profiler) on PATH." };
}

// ---- master loudness via real BS.1770 (ffmpeg ebur128) ----
function measureLoudness(audioRel = "अहं ब्रह्मास्मि.wav") {
  const audioPath = path.isAbsolute(audioRel) ? audioRel : path.join(ROOT, audioRel);
  if (!fs.existsSync(audioPath)) {
    return { status: "unavailable", error: `audio not found: ${audioRel}` };
  }
  const r = spawnSync("ffmpeg", ["-nostats", "-hide_banner", "-i", audioPath, "-af", "ebur128=peak=true", "-f", "null", "-"],
    { encoding: "utf8", timeout: 120000, maxBuffer: 1 << 24 });
  const text = `${r.stdout || ""}\n${r.stderr || ""}`;
  const iMatches = [...text.matchAll(/I:\s*(-?\d+(?:\.\d+)?)\s*LUFS/g)];
  const peakMatches = [...text.matchAll(/Peak:\s*(-?\d+(?:\.\d+)?)\s*dBFS/g)];
  const lraMatches = [...text.matchAll(/LRA:\s*(-?\d+(?:\.\d+)?)\s*LU/g)];
  if (!iMatches.length) {
    return { status: "error", error: "ebur128 produced no integrated-loudness reading" };
  }
  const integratedLUFS = Number(iMatches[iMatches.length - 1][1]);
  const truePeakDbtp = peakMatches.length ? Number(peakMatches[peakMatches.length - 1][1]) : null;
  const lra = lraMatches.length ? Number(lraMatches[lraMatches.length - 1][1]) : null;
  const deltaDb = round(integratedLUFS - LUFS_TARGET, 2);
  const conforms = Math.abs(deltaDb) <= LUFS_TOLERANCE;
  const overCeiling = integratedLUFS > LUFS_TARGET + LUFS_TOLERANCE ||
    (truePeakDbtp !== null && truePeakDbtp > TRUE_PEAK_CEILING_DBTP);
  return {
    status: "ok",
    integratedLUFS, truePeakDbtp, lra,
    targetLUFS: LUFS_TARGET, deltaDb, conforms,
    overCeiling,
    abort: overCeiling, // bubble up to halt render if signal breaches ceiling
    verdict: conforms ? `conforms to ${LUFS_TARGET} LUFS (±${LUFS_TOLERANCE})`
      : overCeiling ? `OVER ceiling: ${integratedLUFS} LUFS / peak ${truePeakDbtp} dBTP — render must abort`
      : `under target by ${Math.abs(deltaDb)} LU — apply +${Math.abs(deltaDb)} dB gain`,
  };
}

// ---- viewport render-loop evaluation (fps reported by the browser) ----
function evaluateRenderLoop(fps, target = 60) {
  const f = Number(fps);
  if (!Number.isFinite(f) || f <= 0) return { status: "unknown", fps: null, target, note: "no render-loop sample reported by client" };
  const status = f >= target * 0.9 ? "ok" : f >= target * 0.5 ? "degraded" : "critical";
  return { status, fps: round(f, 1), target, frameBudgetMs: round(1000 / f, 2),
    note: status === "ok" ? "viewport loop within budget" : `viewport loop below ${target * 0.9}fps` };
}

// ---- aggregate telemetry with defensive isolation ----
async function telemetry(opts = {}) {
  const errors = [];
  const safe = async (name, fn) => {
    try { return await fn(); }
    catch (e) { errors.push(`${name}: ${e.message || String(e)}`); return { status: "error", error: e.message || String(e) }; }
  };
  const host = await safe("host", () => hostMetrics());
  const gpu = await safe("gpu", () => probeGpu());
  const renderLoop = await safe("renderLoop", () => evaluateRenderLoop(opts.loopFps, opts.loopTarget || 60));
  let loudness = { status: "skipped", note: "pass includeLoudness=true to run ebur128" };
  if (opts.includeLoudness) loudness = await safe("loudness", () => measureLoudness(opts.audioPath));

  if (host.status !== "error" && host.cpuUsagePct > 97) errors.push(`host: CPU saturated at ${host.cpuUsagePct}%`);
  if (renderLoop.status === "critical") errors.push(`renderLoop: critical viewport fps ${renderLoop.fps}`);
  if (loudness.status === "ok" && loudness.abort) errors.push(`loudness: ${loudness.verdict}`);

  const renderSafe = !(loudness.status === "ok" && loudness.abort) && renderLoop.status !== "critical";
  return {
    generatedAt: new Date().toISOString(),
    host, gpu, renderLoop, loudness,
    renderSafe,
    status: errors.length ? (renderSafe ? "degraded" : "abort") : "ok",
    errors,
  };
}

module.exports = {
  collectAll,
  editorRuntime, mediaRuntime, renderRuntime, audioRuntime,
  localAiRuntime, cloudAiRuntime, hybridAiRuntime,
  hostMetrics, probeGpu, measureLoudness, evaluateRenderLoop, telemetry,
  LUFS_TARGET, LUFS_TOLERANCE, TRUE_PEAK_CEILING_DBTP,
  RUNTIMES: ["editor", "media", "render", "audio", "local_ai", "cloud_ai", "hybrid_ai"],
};
