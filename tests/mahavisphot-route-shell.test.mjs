import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const shellPath = path.join(repoRoot, "public", "mahavisphot", "index.html");
const shell = fs.readFileSync(shellPath, "utf8");

const expectedRoutes = [
  "/mahavisphot",
  "/mahavisphot/compositor",
  "/mahavisphot/editor",
  "/mahavisphot/launchpad",
  "/mahavisphot/freeze-current-scaffold",
  "/mahavisphot/scaffolds",
  "/mahavisphot/runtimes",
  "/mahavisphot/workflows",
  "/mahavisphot/crud",
  "/mahavisphot/ux-surfaces",
  "/mahavisphot/vfx-studio/overview",
  "/mahavisphot/particle-studio/overview",
  "/mahavisphot/color-studio/overview",
  "/mahavisphot/digital-makeup-studio/overview",
  "/mahavisphot/face-studio/overview",
  "/mahavisphot/3d-studio/overview",
  "/mahavisphot/xr-studio/overview",
  "/mahavisphot/props-studio/overview",
  "/mahavisphot/costume-studio/overview",
  "/mahavisphot/toon-designer-studio/overview",
  "/mahavisphot/cel-animation-studio/overview",
  "/mahavisphot/comic-studio/overview",
  "/mahavisphot/audio-studio/overview",
  "/mahavisphot/render-center/overview",
  "/mahavisphot/export-center/overview",
  "/mahavisphot/observatory/overview",
  "/mahavisphot/local-ai-mode/overview",
  "/mahavisphot/cloud-ai-mode/overview",
  "/mahavisphot/hybrid-ai-mode/overview",
  "/mahavisphot/developer-platform/overview",
];

test("Mahavisphot route shell contains all declared studio routes", () => {
  for (const route of expectedRoutes) {
    assert.equal(shell.includes(`path: "${route}"`) || shell.includes(`"${route}"`), true, `missing route: ${route}`);
  }
});

test("Mahavisphot route shell includes required landing and compositor copy", () => {
  assert.equal(shell.includes("Mahavisphot Studio"), true);
  assert.equal(shell.includes("AI-powered cinematic production, VFX, animation, toon, cel, audio, XR, and render operating system."), true);
  assert.equal(shell.includes("Layered editorial, node compositing, timeline assembly"), true);
  assert.equal(shell.includes("Architecture scaffold - production readiness requires verified runtime evidence."), true);
});

test("Mahavisphot route shell references local extracted assets only", () => {
  assert.equal(shell.includes("http://"), false);
  assert.equal(shell.includes("https://"), false);
  assert.equal(shell.includes("//cdn"), false);
  assert.equal(shell.includes("/mahavisphot/extracted/reference-views/frames/"), true);
  assert.equal(shell.includes("/mahavisphot/boards/mahavisphot-all-frames-board.png"), true);
});

test("Mahavisphot route statuses remain evidence honest", () => {
  assert.equal(shell.includes('status: "blocked"'), true);
  assert.equal(shell.includes('status: "planned"'), true);
  assert.equal(shell.includes('status: "scaffold"'), true);
  assert.equal(shell.includes('status: "production"'), false);
  assert.equal(shell.includes("PRODUCTION</span><strong>NO-GO</strong>"), true);
});

test("Mahavisphot route shell includes functional widget surfaces", () => {
  [
    "Particle Field Operator",
    "Functional Timeline",
    "Stem Mixer",
    "Live Scope Controls",
    "Spatial Viewport",
    "Face Mesh Preview",
    "Render Queue",
    "Runtime Gate",
    "UX Surfaces",
    "CRUD Surfaces",
    "API And Table Contracts",
    "Freeze Current Scaffold Preview",
    "Preflight Commands",
  ].forEach((label) => {
    assert.equal(shell.includes(label), true, `missing widget label: ${label}`);
  });
  assert.equal(shell.includes("hydrateParticles"), true);
  assert.equal(shell.includes("hydrateTimeline"), true);
  assert.equal(shell.includes("data-particle-control"), true);
  assert.equal(shell.includes("data-add-track"), true);
  assert.equal(shell.includes("data-meter-toggle"), true);
  assert.equal(shell.includes("MAHAVISPHOT_STUDIO_SCAFFOLDS"), true);
  assert.equal(shell.includes("hydrateInventory"), true);
});

test("Mahavisphot route shell completes dynamic route details", () => {
  [
    "dynamicRouteForPath",
    "runtime-detail",
    "workflow-detail",
    "crud-detail",
    "ux-detail",
    "/mahavisphot/runtimes/",
    "/mahavisphot/workflows/",
    "/mahavisphot/crud/",
    "400 UX page registry",
  ].forEach((token) => {
    assert.equal(shell.includes(token), true, `missing dynamic route token: ${token}`);
  });
});
