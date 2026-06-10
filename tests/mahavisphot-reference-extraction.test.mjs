import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = path.join(repoRoot, "public", "mahavisphot", "extracted", "reference-views");
const manifestPath = path.join(outputRoot, "manifest.json");
const htmlPath = path.join(outputRoot, "index.html");
const tsvPath = path.join(outputRoot, "manifest.tsv");
const evidencePath = path.join(repoRoot, "docs", "mahavisphot", "evidence", "latest-reference-extraction-evidence.json");
const expectedFrameCount = 56;

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

test("reference extraction outputs exist", () => {
  assert.equal(fs.existsSync(manifestPath), true);
  assert.equal(fs.existsSync(htmlPath), true);
  assert.equal(fs.existsSync(tsvPath), true);
  assert.equal(fs.existsSync(evidencePath), true);
});

test("manifest contains the complete deterministic extraction set", () => {
  const manifest = readJson(manifestPath);
  assert.equal(manifest.frameCount, expectedFrameCount);
  assert.equal(manifest.frames.length, expectedFrameCount);
  assert.equal(manifest.sourceImages.length, 3);

  const ids = new Set(manifest.frames.map((frame) => frame.id));
  const paths = new Set(manifest.frames.map((frame) => frame.relativePath));
  assert.equal(ids.size, expectedFrameCount);
  assert.equal(paths.size, expectedFrameCount);

  const titles = new Set(manifest.frames.map((frame) => frame.title));
  [
    "Source Monitor",
    "Program Monitor",
    "Particles Gallery",
    "Face Replacer Panel",
    "Inspector Pro Rubab Optimizer",
    "Node Graph Composer Floating Gen 2",
  ].forEach((title) => {
    assert.equal(titles.has(title), true, `missing frame title: ${title}`);
  });
});

test("all extracted frame files are present and bounded", () => {
  const manifest = readJson(manifestPath);
  for (const frame of manifest.frames) {
    assert.match(frame.relativePath, /^frames\/frame_\d{3}_[a-z0-9-]+\.png$/);
    assert.equal(frame.status, "extracted");
    assert.ok(frame.bbox.x >= 0);
    assert.ok(frame.bbox.y >= 0);
    assert.ok(frame.bbox.width > 0);
    assert.ok(frame.bbox.height > 0);
    assert.equal(fs.existsSync(path.join(outputRoot, frame.relativePath)), true, `missing crop: ${frame.relativePath}`);
  }
});

test("evidence remains honest about production readiness", () => {
  const evidence = readJson(evidencePath);
  assert.equal(evidence.frameCount, expectedFrameCount);
  assert.equal(evidence.expectedFrameCount, expectedFrameCount);
  assert.equal(evidence.extractionSucceeded, true);
  assert.equal(evidence.productionReady, false);
});

test("contact sheet uses local assets only", () => {
  const html = fs.readFileSync(htmlPath, "utf8");
  assert.equal(html.includes("http://"), false);
  assert.equal(html.includes("https://"), false);
  assert.equal(html.includes("//cdn"), false);
  assert.equal(html.includes("PHKD: Production NO-GO until verified runtime evidence"), true);
});
