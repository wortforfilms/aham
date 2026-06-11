#!/usr/bin/env node
/**
 * Mahavisphot — master release-gate runner (Step 10).
 *
 * Runs the full verification sweep and emits an HONEST production verdict:
 *   - `npm run check` (syntax/lint gate)
 *   - every tests/mahavisphot-*.test.mjs suite (auto-discovered, run in series)
 *   - real runtime health via runtime-collectors.collectAll() + live telemetry
 *   - system constraints derived from the actual renderer code (not hardcoded)
 *
 * The "gate" (check + all tests green) gates CI. PRODUCTION_READY is reported
 * separately and is only true when the gate is green AND every runtime is ready
 * — so the honestly-blocked AI runtimes keep it false rather than faking a pass.
 *
 *   node scripts/mahavisphot-release-gate.mjs [--strict-production]
 * Default exit: 0 when the gate is green. With --strict-production, exits 0 only
 * when PRODUCTION_READY is true.
 */
import { execSync } from "node:child_process";
import { readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const STRICT = process.argv.includes("--strict-production");
const startedAt = Date.now();

function parseTap(output) {
  const pass = Number((output.match(/^# pass (\d+)/m) || [])[1] || 0);
  const fail = Number((output.match(/^# fail (\d+)/m) || [])[1] || 0);
  return { pass, fail };
}

function runCommand(cmd) {
  try {
    const output = execSync(cmd, { cwd: ROOT, stdio: "pipe", encoding: "utf8" });
    return { success: true, output };
  } catch (error) {
    return { success: false, output: `${error.stdout || ""}\n${error.stderr || ""}`, error: error.message };
  }
}

function runSuite(file) {
  const res = runCommand(`node --test ${file}`);
  const { pass, fail } = parseTap(res.output);
  // success requires: process exited 0, at least one test ran, zero failures
  const success = res.success && fail === 0 && pass > 0;
  return { file, pass, fail, success };
}

function systemConstraints() {
  try {
    const renderer = require(join(ROOT, "editor/renderer-core.js"));
    const fonts = renderer.resolveCaptionFonts();
    return {
      embeddedDevanagariFontFunctional: fonts.devanagari.available,
      integratedLoudnessTargetLufs: renderer.LOUDNESS_TARGET_LUFS,
      truePeakCeilingDbtp: renderer.TRUE_PEAK_CEILING_DBTP,
      oversampleRate: renderer.TP_OVERSAMPLE_RATE,
      truePeakLimiterActive: renderer.TP_OVERSAMPLE_RATE === 192000 && typeof renderer.TRUE_PEAK_LIMIT_LINEAR === "number",
      integratedLoudnessEnforced: renderer.LOUDNESS_TARGET_LUFS === -14,
    };
  } catch (error) {
    return { error: `constraint introspection failed: ${error.message}` };
  }
}

async function main() {
  console.log("=== MAHAVISPHOT RELEASE GATE — full verification sweep ===\n");

  // 1) syntax / lint gate
  console.log("[1/4] npm run check");
  const check = runCommand("npm run check");
  console.log(`      ${check.success ? "PASS" : "FAIL"}`);

  // 2) every test suite, in series (deterministic; avoids DATA_DIR races)
  console.log("\n[2/4] test suites");
  const suiteFiles = readdirSync(join(ROOT, "tests"))
    .filter((f) => /^mahavisphot-.*\.test\.mjs$/.test(f))
    .sort()
    .map((f) => `tests/${f}`);
  const suites = [];
  let totalPass = 0;
  let totalFail = 0;
  for (const file of suiteFiles) {
    const r = runSuite(file);
    suites.push(r);
    totalPass += r.pass;
    totalFail += r.fail;
    console.log(`      [${r.success ? "PASS" : "FAIL"}] ${file.replace("tests/", "").padEnd(42)} pass=${r.pass} fail=${r.fail}`);
  }
  console.log(`      ---> ${totalPass} passed / ${totalFail} failed across ${suites.length} suites`);

  // 3) real runtime health + live telemetry
  console.log("\n[3/4] runtime health + telemetry");
  const collectors = require(join(ROOT, "editor/runtime-collectors.js"));
  const health = collectors.collectAll();
  let telemetry = null;
  try { telemetry = await collectors.telemetry({ includeLoudness: true }); } catch (e) { telemetry = { status: "error", error: e.message }; }
  for (const rt of health.runtimes) console.log(`      ${rt.status === "ready" ? "✓" : "✗"} ${rt.runtime.padEnd(10)} ${rt.status}`);
  console.log(`      runtime productionReady=${health.productionReady} (blockers: ${health.blockers.map((b) => b.runtime).join(", ") || "none"})`);
  if (telemetry && telemetry.loudness && telemetry.loudness.status === "ok") {
    console.log(`      master loudness ${telemetry.loudness.integratedLUFS} LUFS / true peak ${telemetry.loudness.truePeakDbtp} dBTP (overCeiling=${telemetry.loudness.overCeiling})`);
  }

  // 4) constraints derived from the actual code
  console.log("\n[4/4] system constraints");
  const constraints = systemConstraints();
  console.log(`      font=${constraints.embeddedDevanagariFontFunctional} truePeakLimiter=${constraints.truePeakLimiterActive} loudness=${constraints.integratedLoudnessEnforced}`);

  // ---- verdict ----
  const gateGreen = check.success && suites.every((s) => s.success);
  const productionReady = gateGreen && health.productionReady; // AI runtimes gated -> false
  let verdict;
  if (!gateGreen) verdict = "BLOCKERS_PRESENT__GATE_RED";
  else if (!health.productionReady) verdict = "GATE_GREEN__AI_RUNTIMES_HONESTLY_GATED__NOT_PRODUCTION_READY";
  else verdict = "PRODUCTION_READY";

  const report = {
    schemaVersion: "mahavisphot.release-gate.v1",
    timestamp: new Date().toISOString(),
    elapsedMs: Date.now() - startedAt,
    gate: {
      green: gateGreen,
      check: check.success,
      suites: suites.map(({ file, pass, fail, success }) => ({ file, pass, fail, success })),
      totals: { pass: totalPass, fail: totalFail, suites: suites.length },
    },
    runtimeHealth: { productionReady: health.productionReady, runtimes: health.runtimes.map((r) => ({ runtime: r.runtime, status: r.status })), blockers: health.blockers },
    telemetry: telemetry && {
      host: telemetry.host, gpu: telemetry.gpu && { status: telemetry.gpu.status },
      loudness: telemetry.loudness && telemetry.loudness.status === "ok"
        ? { integratedLUFS: telemetry.loudness.integratedLUFS, truePeakDbtp: telemetry.loudness.truePeakDbtp, overCeiling: telemetry.loudness.overCeiling, conforms: telemetry.loudness.conforms }
        : telemetry.loudness,
    },
    systemConstraints: constraints,
    status: { PRODUCTION_READY: productionReady, PHKD_VERDICT: verdict },
  };

  const outDir = join(ROOT, "docs", "mahavisphot", "evidence");
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "release-gate-verdict.json"), JSON.stringify(report, null, 2));

  console.log(`\n=== VERDICT: ${verdict} ===`);
  console.log(`PRODUCTION_READY=${productionReady}`);
  console.log(`gate green=${gateGreen} · ${totalPass}/${totalPass + totalFail} tests · verdict written to docs/mahavisphot/evidence/release-gate-verdict.json`);

  const exitOk = STRICT ? productionReady : gateGreen;
  process.exit(exitOk ? 0 : 1);
}

main().catch((error) => { console.error(`[release-gate] fatal: ${error.message}`); process.exit(1); });
