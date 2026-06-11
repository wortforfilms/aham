#!/usr/bin/env node
/**
 * Mahavisphot — headless multi-profile render benchmark.
 *
 * Drives editor/renderer-core.js across three stress tiers and records real
 * throughput (wall time, encode fps, realtime factor), loudness conformance,
 * and caption/pan coverage. Fully headless — no browser required.
 *
 *   node scripts/mahavisphot-render-benchmark.mjs [--profile light|uhd|stress|all] [--quick]
 *
 * Writes docs/mahavisphot/evidence/latest-render-benchmark.json.
 */
import { createRequire } from "node:module";
import { readdirSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";
import os from "node:os";

const require = createRequire(import.meta.url);
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const renderer = require(join(ROOT, "editor/renderer-core.js"));
const exportSchema = require(join(ROOT, "editor/export-schema.js"));

const VARG_AUDIO = "media/varg_ka_khel/varg_ka_khel.mp3";
const MUSIC_AUDIO = "अहं ब्रह्मास्मि.wav";

// ---- profile definitions ----
const PROFILES = {
  light: { label: "Light 1080p", width: 1920, height: 1080, fps: 24, clips: 3, clipDur: 1.0, profile: "preview", stems: 1 },
  uhd: { label: "Standard UHD 4K", width: 3840, height: 2160, fps: 24, clips: 12, clipDur: 0.5, profile: "uhd", stems: 2 },
  stress: { label: "Stress Matrix 1080p", width: 1920, height: 1080, fps: 24, clips: 50, clipDur: 0.3, profile: "preview", stems: 2 },
};

const HI_TITLES = ["द लॉन्ग रोड", "संस्कृत नाद", "वैचारिक प्रहार", "धरातल का बदलाव", "पदचाप की धमक", "वज्र प्रहार"];
const EN_TITLES = ["The Long Road", "Sanskrit Blast", "Aggressive Delivery", "Structural Shift", "Unyielding Stance", "Dust Fracture"];

function framePool() {
  const pool = [];
  const dirs = [
    ["media/varg_ka_khel/frames", "media/varg_ka_khel/frames"],
    ["build_frames/lineup_unique_art2/named_frames_1080p_jpg", "build_frames/lineup_unique_art2/named_frames_1080p_jpg"],
  ];
  for (const [rel, base] of dirs) {
    const abs = join(ROOT, rel);
    if (!existsSync(abs)) continue;
    for (const f of readdirSync(abs)) if (/\.(jpg|jpeg|png)$/i.test(f)) pool.push(`${base}/${f}`);
  }
  return pool;
}

function buildProfilePayload(spec, quick) {
  const clips = quick ? Math.min(spec.clips, 3) : spec.clips;
  const clipDur = spec.clipDur;
  const pool = framePool();
  if (pool.length === 0) throw new Error("no frame assets available for benchmark");
  const scenes = [];
  for (let i = 0; i < clips; i++) {
    const start = +(i * clipDur).toFixed(3);
    const end = +((i + 1) * clipDur).toFixed(3);
    scenes.push({
      id: i + 1, start, end,
      titleHi: HI_TITLES[i % HI_TITLES.length],
      titleEn: EN_TITLES[i % EN_TITLES.length],
      imagePath: pool[i % pool.length],
      captions: EN_TITLES[i % EN_TITLES.length],
    });
  }
  const duration = clips * clipDur;
  const built = exportSchema.buildExportManifest({
    projectId: `bench-${spec.profile}`, exportMode: "manifest",
    fps: spec.fps, width: spec.width, height: spec.height, duration,
    audioPath: VARG_AUDIO, scenes, audioMix: { loudnessTarget: -14 },
  }, { mode: "manifest" });
  if (!built.ok) throw new Error(`manifest build failed: ${JSON.stringify(built.errors)}`);
  const manifest = built.manifest;

  // Multi-channel stems: relabel master as VO and add a panned Music stem so the
  // benchmark genuinely exercises the multi-stem pan matrix + amix path.
  if (spec.stems >= 2 && existsSync(join(ROOT, MUSIC_AUDIO))) {
    const audioClips = manifest.clips.filter((c) => c.kind === "audio");
    if (audioClips[0]) {
      audioClips[0].name = "Audio: VO Stems";
      audioClips[0].meta = { ...(audioClips[0].meta || {}), audioMix: { role: "vo" } };
    }
    const ref = audioClips[0] || {};
    manifest.clips.push({
      id: "clip_music_stem", trackId: ref.trackId || "track_master_audio",
      compositionId: ref.compositionId || (manifest.compositions?.find((c) => c.root)?.id) || "comp_main",
      kind: "audio", name: "Audio: Music", start: 0, end: duration, duration, in: 0, out: duration,
      sourceType: "asset", sourceId: MUSIC_AUDIO, renderable: true,
      meta: { audioMix: { role: "music", gainDb: -6 } },
    });
    if (Array.isArray(manifest.audio?.clips)) manifest.audio.clips = manifest.clips.filter((c) => c.kind === "audio");
  }

  return { manifest, duration, clips, request: { profile: spec.profile, width: spec.width, height: spec.height, fps: spec.fps, maxDurationSec: duration + 0.5 } };
}

function classifyThroughput(realtimeFactor) {
  if (realtimeFactor >= 1) return "realtime+";
  if (realtimeFactor >= 0.5) return "below-realtime";
  return "heavy";
}

async function runProfile(name, quick) {
  const spec = PROFILES[name];
  if (!spec) throw new Error(`unknown profile ${name}`);
  const { manifest, duration, clips, request } = buildProfilePayload(spec, quick);
  const engine = new renderer.MahavisphotRenderEngine(ROOT);
  const startedAt = Date.now();
  try {
    const report = await engine.executeManifestRender({ manifest, ...request });
    const wallSec = +((Date.now() - startedAt) / 1000).toFixed(2);
    const frames = report.telemetry.totalFramesRendered;
    const realtimeFactor = +(report.target.durationSec / wallSec).toFixed(3);
    const effectiveFps = +(frames / wallSec).toFixed(1);
    const loud = report.audioMix.outputLoudness || {};
    return {
      profile: name, label: spec.label, status: "ok",
      resolution: `${report.target.width}x${report.target.height}`, fps: report.target.fps,
      clips, captionLayers: report.captions.layerCount, audioStems: report.parity.audioStemsPanned,
      durationSec: report.target.durationSec, framesRendered: frames,
      wallSec, effectiveEncodeFps: effectiveFps, reportedEncodeFps: report.telemetry.encode.avgFps,
      realtimeFactor, throughput: classifyThroughput(realtimeFactor),
      loudness: { integratedLUFS: loud.integratedLUFS ?? null, conforms: loud.conforms ?? null, abort: loud.abort ?? null },
      compiledOutput: report.compiledOutput,
    };
  } catch (error) {
    return {
      profile: name, label: spec.label, status: "error",
      error: error.message || String(error), code: error.code || null,
      wallSec: +((Date.now() - startedAt) / 1000).toFixed(2),
    };
  }
}

async function main() {
  const args = process.argv.slice(2);
  const quick = args.includes("--quick");
  const pIdx = args.indexOf("--profile");
  const selected = pIdx >= 0 ? args[pIdx + 1] : "all";
  const names = selected === "all" || !selected ? Object.keys(PROFILES) : [selected];

  const results = [];
  for (const name of names) {
    process.stdout.write(`[benchmark] running ${name}${quick ? " (quick)" : ""}…\n`);
    const r = await runProfile(name, quick);
    results.push(r);
    if (r.status === "ok") {
      process.stdout.write(
        `  ${r.label.padEnd(20)} ${r.resolution.padEnd(10)} clips=${String(r.clips).padStart(2)} ` +
        `frames=${String(r.framesRendered).padStart(4)} wall=${String(r.wallSec).padStart(6)}s ` +
        `encFps=${String(r.effectiveEncodeFps).padStart(5)} rt=${String(r.realtimeFactor).padStart(5)} ` +
        `[${r.throughput}] cap=${r.captionLayers} stems=${r.audioStems} ${r.loudness.integratedLUFS}LUFS\n`
      );
    } else {
      process.stdout.write(`  ${r.label}: ERROR ${r.error}\n`);
    }
  }

  const ok = results.filter((r) => r.status === "ok");
  const deltas = {};
  if (ok.length >= 2) {
    for (let i = 1; i < ok.length; i++) {
      deltas[`${ok[i - 1].profile}->${ok[i].profile}`] = {
        wallSecDelta: +(ok[i].wallSec - ok[i - 1].wallSec).toFixed(2),
        encodeFpsDelta: +(ok[i].effectiveEncodeFps - ok[i - 1].effectiveEncodeFps).toFixed(1),
      };
    }
  }
  const slowest = ok.slice().sort((a, b) => a.realtimeFactor - b.realtimeFactor)[0] || null;

  const out = {
    schemaVersion: "mahavisphot.benchmark.v1",
    generatedAt: new Date().toISOString(),
    host: { cpus: os.cpus().length, cpuModel: (os.cpus()[0] || {}).model || "unknown", memTotalMB: Math.round(os.totalmem() / 1048576), platform: `${os.platform()} ${os.arch()}`, node: process.version },
    quick,
    profiles: results,
    deltas,
    bottleneck: slowest ? { profile: slowest.profile, realtimeFactor: slowest.realtimeFactor, throughput: slowest.throughput } : null,
  };
  const outDir = join(ROOT, "docs/mahavisphot/evidence");
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "latest-render-benchmark.json"), JSON.stringify(out, null, 2));
  process.stdout.write(`[benchmark] wrote docs/mahavisphot/evidence/latest-render-benchmark.json\n`);
  if (out.bottleneck) process.stdout.write(`[benchmark] tightest tier: ${out.bottleneck.profile} (rt ${out.bottleneck.realtimeFactor} · ${out.bottleneck.throughput})\n`);

  if (results.some((r) => r.status === "error")) process.exitCode = 1;
}

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  main().catch((error) => { console.error(`[benchmark] fatal: ${error.message}`); process.exit(1); });
}

export { PROFILES, buildProfilePayload, classifyThroughput, runProfile };
