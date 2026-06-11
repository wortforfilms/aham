import test from "node:test";
import assert from "node:assert/strict";
import * as bench from "../scripts/mahavisphot-render-benchmark.mjs";

test("classifyThroughput buckets the realtime factor", () => {
  assert.equal(bench.classifyThroughput(2.5), "realtime+");
  assert.equal(bench.classifyThroughput(1.0), "realtime+");
  assert.equal(bench.classifyThroughput(0.7), "below-realtime");
  assert.equal(bench.classifyThroughput(0.3), "heavy");
});

test("buildProfilePayload yields a valid export.v1 manifest with multi-stem audio", () => {
  const { manifest, clips } = bench.buildProfilePayload(bench.PROFILES.uhd, true); // quick caps clips to 3
  assert.equal(manifest.schemaVersion, "mahavisphot.export.v1");
  assert.ok(manifest.captions.length >= clips);
  // uhd tier injects a second (Music) stem alongside the VO master
  const audioClips = manifest.clips.filter((c) => c.kind === "audio");
  assert.ok(audioClips.length >= 2, `expected >=2 audio stems, got ${audioClips.length}`);
  assert.ok(audioClips.some((c) => /vo/i.test(c.name)) && audioClips.some((c) => /music/i.test(c.name)));
});

test("runProfile(light, quick) produces real throughput metrics", async () => {
  const r = await bench.runProfile("light", true);
  assert.equal(r.status, "ok", r.error);
  assert.ok(r.framesRendered > 0);
  assert.ok(r.wallSec > 0);
  assert.ok(r.realtimeFactor > 0);
  assert.ok(r.captionLayers >= 2);
  assert.ok(["realtime+", "below-realtime", "heavy"].includes(r.throughput));
  assert.ok(r.loudness);
  assert.ok(r.loudness.abort === false || r.loudness.abort === null);
});
