const fs = require("node:fs");
const path = require("node:path");

const workspaceRoot = path.join(__dirname, "..");

const manualPath = path.join(workspaceRoot, "docs", "mahavisphot", "USER_MANUAL.md");
const evidenceDir = path.join(workspaceRoot, "docs", "mahavisphot", "evidence");
const verdictPath = path.join(evidenceDir, "release-gate-verdict.json");
const assetsAbsDir = path.join(workspaceRoot, "docs", "mahavisphot", "manual", "assets");
const captureMetadataPath = path.join(assetsAbsDir, "capture-metadata.json");

function readJson(filePath, fallback = null) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    return fallback;
  }
}

function assetMarkdown(filename, alt) {
  const filePath = path.join(assetsAbsDir, filename);
  if (!fs.existsSync(filePath)) {
    return `Capture pending: \`${filename}\` has not been generated yet.`;
  }
  return `![${alt}](manual/assets/${filename})`;
}

function formatLoudness(verdict) {
  const loudness = verdict?.telemetry?.loudness;
  if (!loudness) return "No loudness telemetry found in the release-gate verdict.";
  return [
    `Integrated loudness: ${loudness.integratedLUFS ?? "unavailable"} LUFS`,
    `True peak: ${loudness.truePeakDbtp ?? "unavailable"} dBTP`,
    `Over ceiling: ${String(loudness.overCeiling ?? "unavailable")}`,
    `Conforms: ${String(loudness.conforms ?? "unavailable")}`,
  ].join(" | ");
}

function formatRuntime(verdict) {
  const runtimes = verdict?.runtimeHealth?.runtimes;
  if (!Array.isArray(runtimes)) return "Runtime status unavailable.";
  return runtimes.map((runtime) => `- ${runtime.runtime}: ${runtime.status}`).join("\n");
}

function formatBlockers(verdict) {
  const blockers = verdict?.runtimeHealth?.blockers;
  if (!Array.isArray(blockers) || blockers.length === 0) return "- No runtime blockers listed.";
  return blockers.map((blocker) => `- ${blocker.runtime}: ${blocker.summary}`).join("\n");
}

function screenshotTable(metadata) {
  const rows = [
    ["01_studio_landing.png", "Root studio landing"],
    ["02_nle_timeline_workspace.png", "NLE timeline workspace after coordinate-driven UI input"],
    ["03_telemetry_hud_active.png", "Real render telemetry HUD during compile attempt"],
    ["04_render_compile_terminal_state.png", "Actual terminal compile state"],
  ];
  return [
    "| Asset | Capture intent | Present |",
    "| --- | --- | --- |",
    ...rows.map(([file, intent]) => `| \`${file}\` | ${intent} | ${fs.existsSync(path.join(assetsAbsDir, file)) ? "yes" : "no"} |`),
    "",
    `Motion matrix samples: ${metadata?.motionMatrix?.samples ?? 0}`,
    `Video status: ${metadata?.video?.status || "not captured"}`,
    metadata?.video?.webmPath ? `Walkthrough WebM: \`${path.relative(workspaceRoot, metadata.video.webmPath)}\`` : "",
    metadata?.video?.mp4Path ? `Walkthrough MP4: \`${path.relative(workspaceRoot, metadata.video.mp4Path)}\`` : "",
  ].filter(Boolean).join("\n");
}

function compileManual() {
  fs.mkdirSync(path.dirname(manualPath), { recursive: true });

  const verdict = readJson(verdictPath, {});
  const captureMetadata = readJson(captureMetadataPath, {});
  const verdictLabel = verdict?.status?.PHKD_VERDICT || "NO_RELEASE_GATE_VERDICT_FOUND";
  const productionReady = verdict?.status?.PRODUCTION_READY ?? verdict?.runtimeHealth?.productionReady ?? false;
  const compileStatus = captureMetadata?.compile?.status || "not captured";
  const compileStatusText = captureMetadata?.compile?.statusText || "No Playwright capture metadata found yet.";
  const generatedAt = new Date().toISOString();

  const manual = `# Mahavisphot Compositor Pro v3.5 User Manual

Document version: 2026.06.11.v3
Generated: ${generatedAt}
Verification state: ${verdictLabel}
Production ready: ${String(productionReady)}

This manual is compiled from local capture assets and release-gate evidence. It does not invent browser states, telemetry, render success, or runtime readiness. If the capture pipeline cannot prove a state, the state is listed as pending or blocked.

## 1. Studio Routing

The root route \`/\` opens the Mahavisphot Studio landing gateway. The live editor route \`/editor\` opens the NLE workspace with timeline, viewer, inspector, tracks, schema export, telemetry, and render compile controls.

${assetMarkdown("01_studio_landing.png", "Mahavisphot Studio landing route")}

## 2. Timeline Workspace Operations

The capture suite enters the editor through the visible route button, adds a video layer through coordinate-derived mouse input, opens the project CRUD panel, and inserts a walkthrough project name into the live text field without saving local project data.

${assetMarkdown("02_nle_timeline_workspace.png", "NLE timeline workspace")}

Core operator actions:

- Ingest media through the editor's safe media roots and project API.
- Add video or audio layers with the layer controls.
- Jog the playhead, trim clips, add markers, and switch timeline modes.
- Export schema manifests or request a schema-native render compile.

## 3. Playhead Motion Matrix

The visual capture suite samples the jog slider and playhead geometry at multiple 1920x1080 viewport coordinates. The raw matrix is stored at \`docs/mahavisphot/manual/assets/playhead-motion-matrix.json\`.

${screenshotTable(captureMetadata)}

## 4. Real Telemetry HUD

The editor creates \`#renderTelemetryHud\` from the actual compile flow. The suite captures the HUD only after the app starts polling \`/api/v1/telemetry\`; it does not append a synthetic diagnostic layer.

${assetMarkdown("03_telemetry_hud_active.png", "Real render telemetry HUD")}

Release-gate loudness evidence:

\`${formatLoudness(verdict)}\`

## 5. Compile And Export Gate

The compile button dispatches the schema-native render path. The final capture records the actual terminal state, whether compiled, failed, or timed out.

Compile capture status: \`${compileStatus}\`

Compile status text: \`${compileStatusText}\`

${assetMarkdown("04_render_compile_terminal_state.png", "Actual render compile terminal state")}

## 6. Runtime Readiness

Current runtime status from the release-gate verdict:

${formatRuntime(verdict)}

Known blockers:

${formatBlockers(verdict)}

## 7. Local Artifacts

- Screenshots: \`docs/mahavisphot/manual/assets/\`
- Capture metadata: \`docs/mahavisphot/manual/assets/capture-metadata.json\`
- Motion matrix: \`docs/mahavisphot/manual/assets/playhead-motion-matrix.json\`
- Walkthrough recording: \`exports/automation/workspace_walkthrough.webm\`
- MP4 recording: generated at \`exports/automation/workspace_walkthrough.mp4\` when ffmpeg is available.
`;

  fs.writeFileSync(manualPath, manual);
  console.log(`[mahavisphot manual] wrote ${manualPath}`);
}

compileManual();
