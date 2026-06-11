#!/usr/bin/env node
/**
 * Sovereign engine telemetry CLI — host/GPU/loop + real BS.1770 LUFS.
 *   node scripts/mahavisphot-telemetry.mjs [--loop 60] [--loudness] [--gate]
 * Writes docs/mahavisphot/evidence/latest-telemetry.json.
 * With --gate, exits non-zero if the signal breaches the loudness ceiling
 * (renderSafe=false) so a CI/render pipeline aborts before corrupting output.
 */
import { createRequire } from "node:module";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const collectors = require(join(ROOT, "editor/runtime-collectors.js"));

const args = process.argv.slice(2);
const loopIdx = args.indexOf("--loop");
const loopFps = loopIdx >= 0 ? Number(args[loopIdx + 1]) : undefined;
const includeLoudness = args.includes("--loudness");

const report = await collectors.telemetry({ loopFps, includeLoudness });
const outDir = join(ROOT, "docs/mahavisphot/evidence");
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "latest-telemetry.json"), JSON.stringify(report, null, 2));

const h = report.host;
console.log(`Telemetry @ ${report.generatedAt}`);
console.log(`  host    cpu ${h.cpuUsagePct}% · mem ${h.memUsagePct}% (${h.memUsedMB}/${h.memTotalMB} MB) · ${h.cores} cores`);
console.log(`  gpu     ${report.gpu.status}${report.gpu.gpus?.[0]?.name ? " · " + report.gpu.gpus[0].name : ""}`);
console.log(`  loop    ${report.renderLoop.status} (${report.renderLoop.fps ?? "n/a"} fps)`);
if (report.loudness.status === "ok") console.log(`  loudness ${report.loudness.integratedLUFS} LUFS — ${report.loudness.verdict}`);
console.log(`  renderSafe=${report.renderSafe}  status=${report.status}`);
if (report.errors.length) console.log(`  errors: ${report.errors.join(" | ")}`);

if (args.includes("--gate") && !report.renderSafe) {
  console.error("\nTELEMETRY GATE FAILED: signal breaches loudness ceiling / critical loop — aborting render.");
  process.exit(1);
}
