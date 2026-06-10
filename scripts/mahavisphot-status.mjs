import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const statusPath = path.resolve(__dirname, "../docs/mahavisphot/IMPLEMENTATION_STATUS.md");
const evidencePath = path.resolve(__dirname, "../docs/mahavisphot/evidence/latest-runtime-evidence.json");
const status = await readFile(statusPath, "utf8");
console.log(status.trim());

try {
  const evidence = JSON.parse(await readFile(evidencePath, "utf8"));
  console.log("");
  console.log("## Latest Runtime Evidence");
  console.log("");
  console.log(`- Run ID: ${evidence.runId}`);
  console.log(`- Overall status: ${evidence.overallStatus}`);
  console.log(`- Passed checks: ${evidence.checks.filter((check) => check.status === "passed").length}/${evidence.checks.length}`);
  console.log(`- Blocked capabilities: ${evidence.blockedCapabilities.map((item) => item.capability).join(", ")}`);
  console.log(`- Evidence JSON: docs/mahavisphot/evidence/latest-runtime-evidence.json`);
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
