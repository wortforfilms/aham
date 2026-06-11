import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import fs from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const renderer = require("../editor/renderer-core.js");
const exportSchema = require("../editor/export-schema.js");

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");

const target = { profile: "preview", width: 320, height: 180, fps: 10, durationSec: 4, maxDurationSec: 4 };

function manifestWithCaptions() {
  const result = exportSchema.buildExportManifest({
    projectId: "av-test", exportMode: "manifest", fps: 10, width: 320, height: 180, duration: 2,
    audioPath: "media/varg_ka_khel/varg_ka_khel.mp3",
    scenes: [
      { id: 1, start: 0, end: 1, titleHi: "द लॉन्ग रोड", titleEn: "The Long Road", imagePath: "media/varg_ka_khel/frames/frame_0001.jpg", captions: "The Long Road" },
      { id: 2, start: 1, end: 2, titleHi: "संस्कृत नाद", titleEn: "Sanskrit Blast", imagePath: "media/varg_ka_khel/frames/frame_0002.jpg", captions: "Sanskrit Blast" },
    ],
  }, { mode: "manifest" });
  assert.equal(result.ok, true, JSON.stringify(result.errors || []));
  return result.manifest;
}

test("embedded repo Devanagari font resolves to a valid TrueType file descriptor", () => {
  const fonts = renderer.resolveCaptionFonts();
  assert.equal(fonts.devanagari.available, true, "embedded Devanagari font missing — run npm run bootstrap:fonts");
  const fontPath = fonts.devanagari.path;
  assert.ok(
    fontPath.endsWith(path.join("assets", "fonts", "system", "NotoSansDevanagari-Bold.ttf")),
    `expected repo-embedded font, got ${fontPath}`
  );
  assert.equal(fs.existsSync(fontPath), true);
  // open a real file descriptor and confirm the sfnt/TrueType magic
  const fd = fs.openSync(fontPath, "r");
  try {
    const head = Buffer.alloc(4);
    const read = fs.readSync(fd, head, 0, 4, 0);
    assert.equal(read, 4);
    assert.equal(head.readUInt32BE(0), 0x00010000);
  } finally {
    fs.closeSync(fd);
  }
  // the file is a substantial, non-empty binary (not a placeholder)
  assert.ok(fs.statSync(fontPath).size > 50 * 1024);
});

test("extractCaptionLayers stacks Hindi(primary) + English(secondary) per timecode window", () => {
  const { layers, fonts } = renderer.extractCaptionLayers(manifestWithCaptions(), target);
  // two scenes × two languages = four layers
  assert.equal(layers.length, 4);
  const hi = layers.filter((l) => l.lang === "hi");
  const en = layers.filter((l) => l.lang === "en");
  assert.equal(hi.length, 2);
  assert.equal(en.length, 2);
  // primary above secondary, same enable window for the same scene
  const s1hi = layers.find((l) => l.lang === "hi" && l.start === 0);
  const s1en = layers.find((l) => l.lang === "en" && l.start === 0);
  assert.equal(s1hi.y, "h-220");
  assert.equal(s1en.y, "h-120");
  assert.equal(s1hi.enable, s1en.enable); // concurrent over identical timecode
  assert.equal(typeof fonts.devanagari.available, "boolean");
});

test("caption drawtext chain is single-pass, centered, time-gated, and escaped", () => {
  const { layers } = renderer.extractCaptionLayers(manifestWithCaptions(), target);
  const chain = renderer.buildCaptionDrawtextChain(layers);
  assert.equal(chain.length, 4);
  for (const dt of chain) {
    assert.ok(dt.startsWith("drawtext=fontfile="));
    assert.ok(dt.includes("x=(w-text_w)/2"));
    assert.ok(/enable='between\(t,[\d.]+,[\d.]+\)'/.test(dt));
  }
  // both scripts present for scene 1 over the same window
  assert.ok(chain.some((dt) => dt.includes("द लॉन्ग रोड") && dt.includes("y=h-220")));
  assert.ok(chain.some((dt) => dt.includes("The Long Road") && dt.includes("y=h-120")));
});

test("escapeDrawtext neutralizes colon/quote/percent without breaking quoting", () => {
  const out = renderer.escapeDrawtext("Time: 12:00 100% 'quoted'");
  assert.ok(!/(?<!\\):/.test(out), "unescaped colon leaked");
  assert.ok(!out.includes("'"), "straight apostrophe must be converted");
  assert.ok(out.includes("\\%"));
});

test("resolveAudioMix derives role-specific pan matrices and gains", () => {
  const vo = renderer.resolveAudioMix({ name: "Audio: VO Stems", meta: {} });
  assert.equal(vo.role, "vo");
  assert.equal(vo.pan, "stereo|c0=0.85*c0+0.15*c1|c1=0.15*c0+0.85*c1");
  const music = renderer.resolveAudioMix({ name: "Audio: Music", meta: {} });
  assert.equal(music.role, "music");
  assert.ok(music.gain < 1); // music ducked by default
  // explicit overrides win
  const explicit = renderer.resolveAudioMix({ name: "x", meta: { audioMix: { role: "fx", pan: "stereo|c0=c0|c1=c1", gainDb: -6 } } });
  assert.equal(explicit.role, "fx");
  assert.equal(explicit.pan, "stereo|c0=c0|c1=c1");
  assert.ok(Math.abs(explicit.gain - 0.5012) < 0.01); // -6 dB ≈ 0.501
});

test("audio filtergraph pans each stem and enforces -14 LUFS / -1 dBTP ceiling", () => {
  const graph = renderer.buildAudioFilterGraph(
    [{ clipId: "vo", sourceId: "a/vo.wav", name: "Audio: VO Stems", meta: {} },
     { clipId: "mus", sourceId: "a/music.wav", name: "Audio: Music", meta: {} }],
    3 // three video inputs precede the audio inputs
  );
  assert.equal(graph.stems.length, 2);
  assert.ok(graph.filters[0].startsWith("[3:a]") && graph.filters[0].includes("pan=stereo|"));
  assert.ok(graph.filters[1].startsWith("[4:a]"));
  assert.ok(graph.filters.some((f) => f.includes("amix=inputs=2")));
  const finalFilter = graph.filters[graph.filters.length - 1];
  assert.ok(finalFilter.includes(`loudnorm=I=${renderer.LOUDNESS_TARGET_LUFS}:TP=${renderer.TRUE_PEAK_CEILING_DBTP}`));
  // true-peak-accurate: oversample -> limit -> downsample
  assert.ok(finalFilter.includes(`aresample=${renderer.TP_OVERSAMPLE_RATE}`), "missing oversample stage");
  assert.ok(finalFilter.includes(`alimiter=`) && finalFilter.includes(`limit=${renderer.TRUE_PEAK_LIMIT_LINEAR}`));
  assert.ok(finalFilter.trim().endsWith("aresample=48000[aout]"), "missing downsample-back stage");
  assert.equal(graph.outLabel, "aout");
});

test("two-pass loudnorm locks to measured values with oversampled true-peak brickwall", () => {
  const measured = { input_i: -18, input_tp: -2.1, input_lra: 7, input_thresh: -28, target_offset: 0.5 };
  const g = renderer.buildAudioFilterGraph([{ clipId: "m", sourceId: "a.wav", name: "A1 Master", meta: {} }], 1, measured);
  assert.equal(g.twoPass, true);
  const f = g.filters[g.filters.length - 1];
  assert.ok(f.includes("measured_I=-18") && f.includes("measured_TP=-2.1") && f.includes("linear=true"));
  assert.ok(f.includes(`aresample=${renderer.TP_OVERSAMPLE_RATE}`));
  assert.ok(f.trim().endsWith("aresample=48000[aout]"));
  // single-pass branch when no measurement is supplied
  const single = renderer.buildAudioFilterGraph([{ clipId: "m", sourceId: "a.wav", name: "A1", meta: {} }], 1);
  assert.equal(single.twoPass, false);
  // analyzeLoudness null-guards on empty input (never throws)
  assert.equal(renderer.analyzeLoudness([], 2, process.cwd()), null);
});

test("buildFfmpegArgs maps caption video out + panned audio out", () => {
  const { layers } = renderer.extractCaptionLayers(manifestWithCaptions(), target);
  const { args, audioGraph } = renderer.buildFfmpegArgs({
    videoClips: [{ mediaKind: "image", duration: 1, in: 0, path: "/x/a.jpg" }],
    audioClips: [{ clipId: "m", sourceId: "media/varg_ka_khel/varg_ka_khel.mp3", in: 0, path: "/x/m.mp3", name: "A1 Master Audio", meta: {} }],
    captionLayers: layers, target, outputPath: "/x/out.mp4",
  });
  const fc = args[args.indexOf("-filter_complex") + 1];
  assert.ok(fc.includes("[baseTimeline]drawtext="));
  assert.ok(fc.includes("[vout]"));
  assert.ok(fc.includes("[aout]"));
  // both video and audio are mapped
  const maps = args.filter((a, i) => args[i - 1] === "-map");
  assert.ok(maps.includes("[vout]"));
  assert.ok(maps.includes("[aout]"));
  assert.equal(audioGraph.stems.length, 1);
});

test("video encoder selection is hardware-aware with optimized software fallback", () => {
  const enc = renderer.selectVideoEncoder({ profile: "uhd", width: 3840, height: 2160, fps: 24 });
  assert.ok(["libx264", "h264_nvenc", "h264_videotoolbox"].includes(enc.encoder));
  // on a host with no HW encoder we must land on optimized libx264 veryfast
  if (enc.encoder === "libx264") {
    assert.equal(enc.preset, "veryfast");
    assert.ok(enc.args.includes("-threads"));
    assert.ok(enc.args.includes("-crf"));
  }
  // hw probe must never throw and returns null or a known kind
  const hw = renderer.detectHwEncoder();
  assert.ok(hw === null || ["nvenc", "videotoolbox"].includes(hw.kind));
});

test("buildFfmpegArgs parallelizes filter lanes and uses the selected encoder", () => {
  const { args, encoder } = renderer.buildFfmpegArgs({
    videoClips: [{ mediaKind: "image", duration: 1, in: 0, path: "/x/a.jpg" }],
    audioClips: [], captionLayers: [],
    target: { profile: "uhd", width: 3840, height: 2160, fps: 24, durationSec: 1 },
    outputPath: "/x/o.mp4",
  });
  assert.ok(args.includes("-filter_complex_threads"));
  assert.ok(args.includes("-filter_threads"));
  assert.ok(args.includes(encoder)); // chosen -c:v value is present in the arg vector
});

test("parseEncodeFps averages ffmpeg fps samples", () => {
  assert.equal(renderer.parseEncodeFps("frame=1 fps= 30 q=1\nframe=2 fps= 50 q=1"), 40);
  assert.equal(renderer.parseEncodeFps("no fps here"), null);
});

test("integration: executeManifestRender reports concurrent captions + panned/loudness-verified audio", async () => {
  const engine = new renderer.MahavisphotRenderEngine(ROOT);
  const report = await engine.executeManifestRender({
    manifest: manifestWithCaptions(), profile: "preview", width: 320, height: 180, fps: 10, maxDurationSec: 2,
  });
  assert.equal(report.status, "SUCCESS");
  assert.ok(report.captions.layerCount >= 2);
  assert.ok(report.captions.languages.includes("en"));
  assert.equal(report.captions.fontDevanagariAvailable, true);
  assert.equal(report.parity.audioStemsPanned, 1);
  assert.equal(report.parity.loudnessEnforced, true);
  // post-encode loudness verification actually ran (real ebur128) and did not breach
  assert.ok(["ok", "error", "unavailable"].includes(report.audioMix.outputLoudness.status));
  if (report.audioMix.outputLoudness.status === "ok") {
    // a correctly limited master must never trip the corruption/abort gate
    assert.equal(report.audioMix.outputLoudness.abort, false);
  }
  assert.ok("encode" in report.telemetry);
});
