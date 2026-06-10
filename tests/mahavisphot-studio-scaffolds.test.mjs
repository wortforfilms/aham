import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const jsonPath = path.join(repoRoot, "public", "mahavisphot", "scaffolds", "mahavisphot-studio-scaffolds.json");
const jsPath = path.join(repoRoot, "public", "mahavisphot", "scaffolds", "mahavisphot-studio-scaffolds.js");
const evidencePath = path.join(repoRoot, "docs", "mahavisphot", "evidence", "latest-studio-scaffolds-evidence.json");
const sourcePages = JSON.parse(fs.readFileSync(path.join(repoRoot, "src", "mahavisphot", "data", "mahavisphot-pages.json"), "utf8"));
const sourceApi = JSON.parse(fs.readFileSync(path.join(repoRoot, "src", "mahavisphot", "data", "mahavisphot-api.json"), "utf8"));
const sourceTables = JSON.parse(fs.readFileSync(path.join(repoRoot, "src", "mahavisphot", "data", "mahavisphot-tables.json"), "utf8"));

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

test("public studio scaffold files exist", () => {
  assert.equal(fs.existsSync(jsonPath), true);
  assert.equal(fs.existsSync(jsPath), true);
  assert.equal(fs.existsSync(evidencePath), true);
});

test("studio scaffold map exposes all registry-backed surfaces", () => {
  const map = readJson(jsonPath);
  assert.equal(map.counts.uxSurfaces, sourcePages.length);
  assert.equal(map.counts.apiEndpoints, sourceApi.length);
  assert.equal(map.counts.databaseTables, sourceTables.length);
  assert.equal(map.uxSurfaces.length, sourcePages.length);
  assert.equal(map.apiSummary.length, sourceApi.length);
  assert.equal(map.tableSummary.length, sourceTables.length);
});

test("studio scaffold map exposes all runtime modes", () => {
  const map = readJson(jsonPath);
  const modes = new Set(map.runtimeModes.map((runtime) => runtime.id));
  assert.deepEqual([...modes].sort(), ["cloud", "hybrid", "local"]);
  for (const runtime of map.runtimeModes) {
    assert.equal(runtime.status, "blocked");
    assert.ok(runtime.evidenceRequired.length >= 4);
  }
});

test("studio scaffold map exposes workflows and CRUD surfaces", () => {
  const map = readJson(jsonPath);
  assert.ok(map.workflows.length >= 25);
  assert.ok(map.crudSurfaces.length >= 30);
  assert.ok(map.workflows.some((workflow) => workflow.id === "timeline-edit"));
  assert.ok(map.workflows.some((workflow) => workflow.id === "export-package" && workflow.status === "blocked"));
  assert.ok(map.crudSurfaces.some((crud) => crud.id === "project" && crud.operations.includes("duplicate")));
  assert.ok(map.crudSurfaces.some((crud) => crud.id === "track" && crud.operations.includes("reorder")));
  assert.ok(map.crudSurfaces.some((crud) => crud.id === "ai-model" && crud.status === "blocked"));
});

test("studio scaffold evidence remains no-go", () => {
  const map = readJson(jsonPath);
  const evidence = readJson(evidencePath);
  assert.equal(map.productionReady, false);
  assert.equal(evidence.productionReady, false);
  assert.equal(evidence.phkdVerdict, "SCAFFOLDS_VISIBLE_RUNTIME_STILL_BLOCKED");
});
