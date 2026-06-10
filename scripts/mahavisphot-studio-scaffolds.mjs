import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataRoot = path.join(repoRoot, "src", "mahavisphot", "data");
const publicRoot = path.join(repoRoot, "public", "mahavisphot", "scaffolds");
const docsRoot = path.join(repoRoot, "docs", "mahavisphot");
const evidenceRoot = path.join(docsRoot, "evidence");
const jsonPath = path.join(publicRoot, "mahavisphot-studio-scaffolds.json");
const jsPath = path.join(publicRoot, "mahavisphot-studio-scaffolds.js");
const docPath = path.join(docsRoot, "STUDIO_SCAFFOLDS.md");
const evidencePath = path.join(evidenceRoot, "latest-studio-scaffolds-evidence.json");
const generatedAt = "2026-06-10T00:00:00.000Z";

function readJson(fileName) {
  return JSON.parse(fs.readFileSync(path.join(dataRoot, fileName), "utf8"));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

const pages = readJson("mahavisphot-pages.json");
const apiEndpoints = readJson("mahavisphot-api.json");
const databaseTables = readJson("mahavisphot-tables.json");
const schema = readJson("mahavisphot-schema.json");

const runtimeScaffolds = [
  {
    id: "local",
    title: "Local AI Runtime",
    status: "blocked",
    scope: "On-device model inventory, local inference adapter, hardware profile, privacy boundary, and deterministic inference tests.",
    evidenceRequired: [
      "Local model runtime adapter",
      "Hardware capability profile",
      "Validated media input bridge",
      "Deterministic local inference test",
    ],
    workflows: ["runtime-health", "model-inventory", "local-inference", "privacy-review", "evidence-capture"],
    crudSurfaces: ["runtime-profile", "ai-model", "model-cache", "evidence-artifact"],
  },
  {
    id: "cloud",
    title: "Cloud AI Runtime",
    status: "blocked",
    scope: "Provider adapters, credential gates, job routing, cloud policy, audit logs, and cost controls.",
    evidenceRequired: [
      "Provider credential adapter",
      "Signed job request schema",
      "Cloud execution proof",
      "Audit and billing evidence",
    ],
    workflows: ["credential-check", "cloud-job-route", "cloud-render-handoff", "cost-policy", "evidence-capture"],
    crudSurfaces: ["provider-account", "cloud-job", "runtime-profile", "evidence-artifact"],
  },
  {
    id: "hybrid",
    title: "Hybrid AI Runtime",
    status: "blocked",
    scope: "Local/cloud split execution, fallback routing, privacy tiers, synchronization, and recovery controls.",
    evidenceRequired: [
      "Hybrid orchestration adapter",
      "Fallback execution test",
      "Privacy tier enforcement",
      "Cross-runtime synchronization proof",
    ],
    workflows: ["hybrid-planner", "fallback-route", "privacy-tier", "sync-check", "evidence-capture"],
    crudSurfaces: ["runtime-profile", "hybrid-plan", "cloud-job", "ai-model", "evidence-artifact"],
  },
];

const workflowScaffolds = [
  ["project-lifecycle", "Project Lifecycle", "create-open-save-duplicate-delete", "verified", "Project creation, open, save, duplicate, delete, and local session ownership."],
  ["auth-session-license", "Auth Session License", "identity", "verified", "Local user, session, license, and plan state with schema validation."],
  ["subscription-plan", "Subscription Plan", "billing", "verified", "Plan states free, trial, pro, studio, and enterprise surfaced without payment claims."],
  ["asset-ingestion", "Asset Ingestion", "media", "scaffold", "Safe media-only asset import, validation, references, and frame lineage."],
  ["reference-frame-extraction", "Reference Frame Extraction", "media", "verified", "Deterministic extraction of visible UI/reference frames with manifest and evidence."],
  ["storyboard-build", "Storyboard Build", "story", "scaffold", "Storyline, boards, captions, frame notes, and shot structure."],
  ["timeline-edit", "Timeline Edit", "editorial", "preview", "Dynamic tracks, clips, markers, ripple/cascade/static delete controls, and layer CRUD."],
  ["composition-nesting", "Composition Nesting", "editorial", "scaffold", "Single or multiple clips grouped into compositions that open as nested timelines."],
  ["video-layer-routing", "Video Layer Routing", "editorial", "preview", "Scene plates, overlays, VFX buses, captions, picture-in-picture, and track visibility."],
  ["audio-layer-routing", "Audio Layer Routing", "audio", "preview", "Music, rubab, voice, foley, master audio, meters, and stem-focused widgets."],
  ["vfx-node-routing", "VFX Node Routing", "vfx", "scaffold", "Node graph, color pass, texture fixture, multi-pass grain, glow, and composite output."],
  ["particle-field-design", "Particle Field Design", "vfx", "preview", "Preset gallery, vector fields, wind, turbulence, particle sizing, and preview state."],
  ["motion-tracking", "Motion Tracking", "tracking", "blocked", "Markerless skeletal tracking remains blocked until model runtime evidence."],
  ["face-makeup-review", "Face Makeup Review", "character", "blocked", "Face topology, depth swapping, digital makeup, and protected evidence gates."],
  ["costume-prop-continuity", "Costume Prop Continuity", "character", "planned", "Costume sheets, prop sheets, continuity state, and shot use metadata."],
  ["toon-cel-comic", "Toon Cel Comic", "animation", "planned", "Toon designer, cel animation, comic boards, exposure sheets, and page panels."],
  ["three-d-scene", "3D Scene", "spatial", "scaffold", "Scene graph, transforms, shader editor, UV editor, mesh and camera planning."],
  ["xr-review", "XR Review", "spatial", "planned", "Spatial preview, headset-safe layout, review camera, and accessibility overlays."],
  ["audio-mix", "Audio Mix", "audio", "preview", "Mixer, track inserts, loudness target, spectrogram, and broadcast-safe review."],
  ["color-grade", "Color Grade", "color", "preview", "Waveform, vector, grade gallery, exposure controls, and shot match intent."],
  ["render-queue", "Render Queue", "delivery", "scaffold", "Queue rows, progress state, cache planning, and blocked UHD renderer gate."],
  ["export-package", "Export Package", "delivery", "blocked", "Full parity export remains blocked until renderer integration proves schema parity."],
  ["observatory-evidence", "Observatory Evidence", "operations", "scaffold", "Runtime evidence, telemetry, blockers, GPU/memory scopes, and readiness state."],
  ["admin-ops", "Admin Ops", "operations", "planned", "Users, plans, licenses, workspaces, policy state, and audit trails."],
  ["support-recovery", "Support Recovery", "operations", "planned", "Support ticket, recovery mode, diagnostics package, and issue handoff."],
  ["developer-platform", "Developer Platform", "developer", "scaffold", "Typed registries, API contracts, database map, routes, and extension surfaces."],
  ["security-hardening", "Security Hardening", "security", "planned", "Path policies, auth boundaries, threat review, and release gate hardening."],
].map(([id, title, group, status, description], order) => ({
  id,
  title,
  group,
  status,
  description,
  order: order + 1,
}));

const crudScaffolds = [
  ["user", "User", ["create", "read", "update", "delete"], "verified", ["project:admin", "admin:read"]],
  ["session", "Session", ["create", "read", "delete"], "verified", ["project:read"]],
  ["license", "License", ["create", "read", "update"], "verified", ["billing:read", "billing:write"]],
  ["subscription", "Subscription", ["read", "update"], "verified", ["billing:read", "billing:write"]],
  ["project", "Project", ["create", "list", "open", "save", "duplicate", "delete"], "verified", ["project:read", "project:write"]],
  ["template", "Template", ["create", "read", "update", "delete", "apply"], "scaffold", ["project:read", "project:write"]],
  ["scene", "Scene", ["create", "read", "update", "delete", "reorder"], "scaffold", ["timeline:read", "timeline:write"]],
  ["shot", "Shot", ["create", "read", "update", "delete", "duplicate"], "scaffold", ["timeline:read", "timeline:write"]],
  ["asset", "Asset", ["create", "read", "update", "delete", "ingest"], "scaffold", ["media:read", "media:write"]],
  ["media-file", "Media File", ["read", "ingest", "validate", "delete"], "scaffold", ["media:read", "media:write"]],
  ["timeline", "Timeline", ["create", "read", "update", "delete", "open"], "preview", ["timeline:read", "timeline:write"]],
  ["track", "Track", ["create", "read", "update", "delete", "reorder"], "preview", ["timeline:read", "timeline:write"]],
  ["clip", "Clip", ["create", "read", "update", "delete", "trim", "group"], "preview", ["timeline:read", "timeline:write"]],
  ["composition", "Composition", ["create", "read", "update", "delete", "open"], "scaffold", ["timeline:read", "timeline:write"]],
  ["marker", "Marker", ["create", "read", "update", "delete", "drag"], "preview", ["timeline:read", "timeline:write"]],
  ["caption", "Caption", ["create", "read", "update", "delete", "export"], "scaffold", ["timeline:read", "timeline:write"]],
  ["note", "Note", ["create", "read", "update", "delete"], "preview", ["project:read", "project:write"]],
  ["vfx-node", "VFX Node", ["create", "read", "update", "delete", "connect"], "scaffold", ["timeline:read", "timeline:write"]],
  ["particle-preset", "Particle Preset", ["create", "read", "update", "delete", "apply"], "preview", ["timeline:read", "timeline:write"]],
  ["face-track", "Face Track", ["create", "read", "update", "delete"], "blocked", ["ai:local", "ai:cloud"]],
  ["makeup-pass", "Makeup Pass", ["create", "read", "update", "delete"], "blocked", ["ai:local", "ai:cloud"]],
  ["costume-sheet", "Costume Sheet", ["create", "read", "update", "delete"], "planned", ["project:read", "project:write"]],
  ["prop-sheet", "Prop Sheet", ["create", "read", "update", "delete"], "planned", ["project:read", "project:write"]],
  ["scene-graph", "Scene Graph", ["create", "read", "update", "delete", "toggle"], "scaffold", ["timeline:read", "timeline:write"]],
  ["audio-stem", "Audio Stem", ["create", "read", "update", "delete", "route"], "preview", ["media:read", "media:write"]],
  ["color-grade", "Color Grade", ["create", "read", "update", "delete", "apply"], "preview", ["timeline:read", "timeline:write"]],
  ["render-job", "Render Job", ["create", "read", "update", "delete", "retry"], "scaffold", ["render:read", "render:write"]],
  ["export-package", "Export Package", ["create", "read", "delete", "download"], "blocked", ["render:read", "render:write"]],
  ["runtime-profile", "Runtime Profile", ["create", "read", "update", "delete"], "blocked", ["security:read", "security:write"]],
  ["ai-model", "AI Model", ["read", "register", "validate", "delete"], "blocked", ["ai:local", "ai:cloud", "ai:hybrid"]],
  ["evidence-artifact", "Evidence Artifact", ["create", "read", "update", "delete"], "scaffold", ["project:read", "security:read"]],
  ["support-ticket", "Support Ticket", ["create", "read", "update", "delete"], "planned", ["support:read", "support:write"]],
  ["security-policy", "Security Policy", ["read", "update", "audit"], "planned", ["security:read", "security:write"]],
].map(([id, title, operations, status, permissions], order) => ({
  id,
  title,
  operations,
  status,
  permissions,
  order: order + 1,
}));

const uxSurfaces = pages.map((page) => ({
  id: page.id,
  title: page.title,
  route: page.route,
  moduleId: page.moduleId,
  group: page.navigationGroup,
  status: page.status,
  runtimeModes: page.runtimeModes,
  permissions: page.permissions,
  plans: page.planAvailability,
  order: page.order,
}));

const workflowGroups = [...new Set(workflowScaffolds.map((workflow) => workflow.group))].sort();
const crudStatuses = [...new Set(crudScaffolds.map((crud) => crud.status))].sort();
const uxGroups = [...new Set(uxSurfaces.map((surface) => surface.group))].sort();

const scaffoldMap = {
  generatedAt,
  schemaVersion: schema.schemaVersion,
  productionReady: false,
  phkdVerdict: "SCAFFOLDS_VISIBLE_RUNTIME_STILL_BLOCKED",
  counts: {
    modules: schema.modules.length,
    uxSurfaces: uxSurfaces.length,
    apiEndpoints: apiEndpoints.length,
    databaseTables: databaseTables.length,
    runtimeModes: runtimeScaffolds.length,
    workflows: workflowScaffolds.length,
    crudSurfaces: crudScaffolds.length,
  },
  runtimeModes: runtimeScaffolds,
  workflows: workflowScaffolds,
  crudSurfaces: crudScaffolds,
  uxSurfaces,
  workflowGroups,
  crudStatuses,
  uxGroups,
  modules: schema.modules.map((module) => ({
    id: module.id,
    name: module.name,
    category: module.category,
    status: module.status,
    routeBase: module.routeBase,
    runtimeModes: module.runtimeModes,
    permissions: module.permissions,
    planAvailability: module.planAvailability,
  })),
  apiSummary: apiEndpoints.map((endpoint) => ({
    id: endpoint.id,
    method: endpoint.method,
    path: endpoint.path,
    moduleId: endpoint.moduleId,
    status: endpoint.status,
  })),
  tableSummary: databaseTables.map((table) => ({
    name: table.name,
    moduleId: table.moduleId,
    status: table.status,
    primaryKey: table.primaryKey,
  })),
};

writeJson(jsonPath, scaffoldMap);
fs.writeFileSync(
  jsPath,
  `window.MAHAVISPHOT_STUDIO_SCAFFOLDS = ${JSON.stringify(scaffoldMap, null, 2)};\n`,
);

const doc = `# Mahavisphot Studio Scaffolds

## Purpose

This generated map exposes the Mahavisphot Studio scaffold inventory for local route inspection. It is a public static scaffold map, not a production runtime claim.

## Counts

- Modules: ${scaffoldMap.counts.modules}
- UX surfaces: ${scaffoldMap.counts.uxSurfaces}
- API endpoints: ${scaffoldMap.counts.apiEndpoints}
- Database tables: ${scaffoldMap.counts.databaseTables}
- Runtime modes: ${scaffoldMap.counts.runtimeModes}
- Workflows: ${scaffoldMap.counts.workflows}
- CRUD surfaces: ${scaffoldMap.counts.crudSurfaces}

## Runtime Modes

${runtimeScaffolds.map((runtime) => `- ${runtime.id}: ${runtime.status} - ${runtime.scope}`).join("\n")}

## Workflow Groups

${workflowGroups.map((group) => `- ${group}`).join("\n")}

## Files

- \`public/mahavisphot/scaffolds/mahavisphot-studio-scaffolds.json\`
- \`public/mahavisphot/scaffolds/mahavisphot-studio-scaffolds.js\`
- \`docs/mahavisphot/evidence/latest-studio-scaffolds-evidence.json\`

## Honest Status

The scaffold map is implemented. Production readiness remains false until renderer, AI runtime, export parity, and hardening evidence are verified.
`;
fs.mkdirSync(docsRoot, { recursive: true });
fs.writeFileSync(docPath, doc);

writeJson(evidencePath, {
  generatedAt,
  scaffoldJsonPath: jsonPath,
  scaffoldJsPath: jsPath,
  documentationPath: docPath,
  counts: scaffoldMap.counts,
  runtimeModesPresent: runtimeScaffolds.map((runtime) => runtime.id),
  productionReady: false,
  phkdVerdict: scaffoldMap.phkdVerdict,
});

console.log(`Generated Mahavisphot studio scaffolds: ${jsonPath}`);
console.log(`UX surfaces: ${scaffoldMap.counts.uxSurfaces}`);
console.log(`Workflows: ${scaffoldMap.counts.workflows}`);
console.log(`CRUD surfaces: ${scaffoldMap.counts.crudSurfaces}`);
