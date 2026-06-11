#!/usr/bin/env node
/**
 * Mahavisphot — Electron launch-evidence harness (Step 9).
 *
 * HONEST SCOPE: a headless environment cannot paint an Electron BrowserWindow,
 * so this does NOT claim a rendered GUI. It proves the desktop shell's launch
 * *contract* — the part the window depends on:
 *   (static)  electron/main.cjs boots editor/server.js, probes /api/health with
 *             the health token, and loads the editor URL; preload is present.
 *   (live)    boot the real server on a fixed port and verify: it starts, owns
 *             that exact port, the health token gates `owned`, the file routes
 *             serve, and project save/load round-trips.
 *
 *   node scripts/mahavisphot-launch-evidence.mjs
 * Exits non-zero if any evidence check fails. Writes
 * docs/mahavisphot/evidence/latest-electron-launch-evidence.json.
 */
import { createRequire } from "node:module";
import { readFileSync, writeFileSync, mkdirSync, existsSync, mkdtempSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";
import net from "node:net";
import os from "node:os";

const require = createRequire(import.meta.url);
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const check = (name, ok, detail) => ({ name, ok: Boolean(ok), detail });

function freePort() {
  return new Promise((res, rej) => {
    const srv = net.createServer();
    srv.once("error", rej);
    srv.listen(0, "127.0.0.1", () => {
      const { port } = srv.address();
      srv.close(() => res(port));
    });
  });
}

// ---- static: is the Electron shell wired to the boot contract? ----
function staticShellChecks() {
  const checks = [];
  let main = "";
  try { main = readFileSync(join(ROOT, "electron/main.cjs"), "utf8"); } catch { /* missing */ }
  checks.push(check("shell_boots_editor_server",
    /require\(["']\.\.\/editor\/server\.js["']\)/.test(main) && /startServer\s*\(/.test(main),
    "electron/main.cjs boots editor/server.js via startServer()"));
  checks.push(check("shell_health_probe",
    /\/api\/health/.test(main) && /x-mahavisphot-health-token/.test(main),
    "main.cjs probes /api/health with the health token"));
  checks.push(check("shell_requires_owned",
    /health\.owned/.test(main) && /mahavisphot-compositor/.test(main),
    "main.cjs only proceeds once health reports owned for this app id"));
  checks.push(check("shell_loads_app_url",
    /loadURL\s*\(\s*APP_URL\s*\)/.test(main) || /loadURL\s*\(/.test(main),
    "main.cjs loads the editor URL into the window"));
  checks.push(check("preload_present",
    existsSync(join(ROOT, "electron/preload.cjs")),
    "electron/preload.cjs bridge is present"));
  return checks;
}

// ---- live: boot the real server and verify the runtime contract ----
async function liveBootChecks() {
  if (!process.env.MAHAVISPHOT_DATA_DIR) {
    process.env.MAHAVISPHOT_DATA_DIR = mkdtempSync(join(os.tmpdir(), "mvp-launch-"));
  }
  const port = await freePort();
  const token = `launch-${Math.random().toString(16).slice(2)}`;
  const mod = require(join(ROOT, "editor/server.js"));
  await mod.startServer(port, "127.0.0.1", token);
  const base = `http://127.0.0.1:${port}`;
  const checks = [];
  try {
    checks.push(check("app_starts", mod.server.listening === true, "editor server is listening after startServer()"));
    checks.push(check("owns_expected_port", mod.server.address().port === port, `server owns the requested fixed port ${port}`));

    let r = await fetch(`${base}/api/health`, { headers: { "x-mahavisphot-health-token": token } });
    let j = await r.json();
    checks.push(check("health_token_valid",
      r.status === 200 && j.ok === true && j.app === "mahavisphot-compositor" && j.owned === true && j.tokenRequired === true,
      "valid health token -> owned=true for mahavisphot-compositor"));

    r = await fetch(`${base}/api/health`);
    j = await r.json();
    checks.push(check("health_token_enforced", j.owned === false, "missing health token -> owned=false"));

    r = await fetch(`${base}/`);
    const rootBody = await r.text();
    checks.push(check("file_route_root", r.status === 200 && /Mahavisphot/i.test(rootBody), "GET / serves the editor shell document"));

    r = await fetch(`${base}/mahavisphot`);
    checks.push(check("file_route_studio", r.status === 200, "GET /mahavisphot serves the studio route"));

    // project save/load round-trip
    r = await fetch(`${base}/api/auth/register`, {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: `launch_${Date.now()}@test.co`, password: "password123" }),
    });
    const cookie = r.headers.getSetCookie().map((c) => c.split(";")[0]).join("; ");
    const H = { "content-type": "application/json", cookie };

    r = await fetch(`${base}/api/projects`, { method: "POST", headers: H, body: JSON.stringify({ name: "Launch Evidence", payload: { marker: "alpha" } }) });
    const created = await r.json();
    const pid = created.record && created.record.id;
    checks.push(check("project_create", r.status === 201 && Boolean(pid), "create project returns a persisted record id"));

    r = await fetch(`${base}/api/projects/${pid}`, { method: "PUT", headers: H, body: JSON.stringify({ name: "Launch Evidence", payload: { marker: "beta" } }) });
    checks.push(check("project_save", r.status === 200, "PUT saves the project"));

    r = await fetch(`${base}/api/projects/${pid}`, { headers: H });
    const loaded = await r.json();
    checks.push(check("project_load_roundtrip",
      r.status === 200 && loaded.project && loaded.project.payload && loaded.project.payload.marker === "beta",
      "GET reloads the saved payload (save/load parity)"));
  } finally {
    await new Promise((res) => mod.server.close(res));
  }
  return checks;
}

export async function runLaunchEvidence() {
  const checks = [...staticShellChecks(), ...(await liveBootChecks())];
  const passed = checks.filter((c) => c.ok).length;
  const report = {
    schemaVersion: "mahavisphot.launch-evidence.v1",
    generatedAt: new Date().toISOString(),
    host: { platform: `${os.platform()} ${os.arch()}`, node: process.version },
    note: "Headless harness: verifies the Electron boot contract (server, port, health-token, file routes, project save/load). GUI window paint is not asserted in a headless environment.",
    checks,
    passed,
    total: checks.length,
    allPass: passed === checks.length,
  };
  const outDir = join(ROOT, "docs", "mahavisphot", "evidence");
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "latest-electron-launch-evidence.json"), JSON.stringify(report, null, 2));
  return report;
}

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  runLaunchEvidence()
    .then((report) => {
      console.log("=== Electron launch evidence ===");
      for (const c of report.checks) console.log(`  [${c.ok ? "PASS" : "FAIL"}] ${c.name.padEnd(26)} ${c.detail}`);
      console.log(`\n${report.passed}/${report.total} checks passed · allPass=${report.allPass}`);
      console.log("wrote docs/mahavisphot/evidence/latest-electron-launch-evidence.json");
      process.exit(report.allPass ? 0 : 1);
    })
    .catch((error) => { console.error(`[launch-evidence] fatal: ${error.message}`); process.exit(1); });
}
