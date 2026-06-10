#!/usr/bin/env node
/**
 * Step 7 CLI — collect runtime health, write evidence, optionally gate.
 *   node scripts/mahavisphot-runtime-health.mjs [--gate]
 * With --gate, exits non-zero unless every runtime is 'ready'.
 */
import { createRequire } from "node:module";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const collectors = require(join(ROOT, "editor/runtime-collectors.js"));

const report = collectors.collectAll();
const outDir = join(ROOT, "docs/mahavisphot/evidence");
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "latest-runtime-health.json"), JSON.stringify(report, null, 2));

const ICON = { ready: "✓", degraded: "~", blocked: "✗", unknown: "?" };
console.log(`Mahavisphot runtime health @ ${report.generatedAt}`);
for (const r of report.runtimes) console.log(`  [${ICON[r.status] || "?"}] ${r.runtime.padEnd(10)} ${r.status.padEnd(9)} ${r.summary}`);
console.log(`\nPRODUCTION_READY=${report.productionReady}`);
if (report.blockers.length) console.log(`blockers: ${report.blockers.map((b) => `${b.runtime}(${b.status})`).join(", ")}`);

if (process.argv.includes("--gate") && !report.productionReady) {
  console.error("\nGATE FAILED: one or more runtimes are not ready.");
  process.exit(1);
}
