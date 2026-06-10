import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const svgPath = "public/mahavisphot/boards/mahavisphot-all-frames-board.svg";
const htmlPath = "public/mahavisphot/boards/mahavisphot-all-frames-board.html";
const pngPath = "public/mahavisphot/boards/mahavisphot-all-frames-board.png";
const evidencePath = "docs/mahavisphot/evidence/latest-all-frames-board-evidence.json";

const expectedTitles = [
  "Landing Page",
  "Launch Studio",
  "Studio Dashboard",
  "Project OS",
  "Timeline Editor",
  "Compositor",
  "VFX Studio",
  "Motion Tracking",
  "Face Studio",
  "Digital Makeup",
  "Costume Studio",
  "Props Studio",
  "Particle Studio",
  "3D Studio",
  "Toon Designer",
  "Cel Animation",
  "Comic Studio",
  "Audio Studio",
  "Color Studio",
  "XR Studio",
  "Local AI Mode",
  "Cloud AI Mode",
  "Hybrid AI Mode",
  "Render Observatory",
];

assert.equal(existsSync(svgPath), true, "SVG exists");
assert.equal(existsSync(htmlPath), true, "HTML exists");
assert.equal(existsSync(evidencePath), true, "evidence JSON exists");

const svg = readFileSync(svgPath, "utf8");
const html = readFileSync(htmlPath, "utf8");
const evidence = JSON.parse(readFileSync(evidencePath, "utf8"));
const frameTitles = [...svg.matchAll(/data-frame-title="([^"]+)"/g)].map((match) => match[1]);

assert.deepEqual(frameTitles, expectedTitles, "exactly 24 expected frame titles exist in order");
assert.equal(frameTitles.length, 24, "exactly 24 frame titles exist");
assert.equal(new Set(frameTitles).size, 24, "frame titles are unique");
assert.ok(svg.includes("PHKD: Production NO-GO until verified runtime evidence"), "SVG footer includes PHKD production NO-GO statement");
assert.ok(html.includes("PHKD: Production NO-GO until verified runtime evidence"), "HTML footer includes PHKD production NO-GO statement");
assert.doesNotMatch(svg, /(?:https?:)?\/\//i, "SVG has no external URLs");
assert.doesNotMatch(html, /(?:https?:)?\/\//i, "HTML has no external URLs");
assert.equal(evidence.frameCount, 24, "evidence frameCount equals 24");
assert.equal(evidence.expectedFrameCount, 24, "evidence expectedFrameCount equals 24");
assert.equal(evidence.productionReady, false, "evidence productionReady is false");

if (evidence.pngGenerated) {
  assert.equal(existsSync(pngPath), true, "PNG exists when evidence says it was generated");
  assert.ok(evidence.pngSizeBytes > 0, "PNG size recorded");
} else {
  assert.ok(evidence.pngBlockedReason, "blocked PNG render has explicit reason");
}

console.log(JSON.stringify({
  ok: true,
  frameTitles: frameTitles.length,
  pngGenerated: evidence.pngGenerated,
  productionReady: evidence.productionReady,
}, null, 2));
