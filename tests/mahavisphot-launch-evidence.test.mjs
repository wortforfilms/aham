import test from "node:test";
import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import fs from "node:fs";
import { runLaunchEvidence } from "../scripts/mahavisphot-launch-evidence.mjs";

test("Electron launch evidence: boot contract verified end-to-end", async () => {
  process.env.MAHAVISPHOT_DATA_DIR = fs.mkdtempSync(path.join(os.tmpdir(), "mvp-launch-test-"));
  const report = await runLaunchEvidence();

  // every check passes
  const failed = report.checks.filter((c) => !c.ok).map((c) => c.name);
  assert.deepEqual(failed, [], `failed checks: ${failed.join(", ")}`);
  assert.equal(report.allPass, true);
  assert.equal(report.schemaVersion, "mahavisphot.launch-evidence.v1");

  // the contract-critical checks are present by name (not just count)
  const names = new Set(report.checks.map((c) => c.name));
  for (const required of [
    "shell_boots_editor_server", "shell_health_probe", "app_starts",
    "owns_expected_port", "health_token_valid", "health_token_enforced",
    "file_route_root", "file_route_studio",
    "project_create", "project_save", "project_load_roundtrip",
  ]) {
    assert.ok(names.has(required), `missing evidence check: ${required}`);
  }
});
