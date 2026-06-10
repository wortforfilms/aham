import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const schemaVersion = "mahavisphot.schema.v1";

const statuses = ["production", "preview", "scaffold", "planned", "blocked"];
const runtimeModes = ["local", "cloud", "hybrid"];
const plans = ["free", "trial", "pro", "studio", "enterprise"];
const permissions = [
  "project:read",
  "project:write",
  "project:admin",
  "media:read",
  "media:write",
  "timeline:read",
  "timeline:write",
  "render:read",
  "render:write",
  "ai:local",
  "ai:cloud",
  "ai:hybrid",
  "admin:read",
  "admin:write",
  "support:read",
  "support:write",
  "developer:read",
  "developer:write",
  "security:read",
  "security:write",
  "billing:read",
  "billing:write",
];

const moduleSeeds = [
  ["editor", "Editor", "Cinematic timeline editing, clip decisions, trims, markers, captions, and composition entry points.", "production"],
  ["compositor", "Compositor", "Layered image, video, VFX, caption, alpha, and nested-composition assembly.", "production"],
  ["vfx-studio", "VFX Studio", "Shot effect stacks, node passes, masks, mattes, glow, grain, and delivery-safe VFX planning.", "visual"],
  ["particle-studio", "Particle Studio", "GPU particle presets, fields, turbulence, ash, sparks, dust, embers, and atmosphere controls.", "visual"],
  ["digital-makeup-studio", "Digital Makeup Studio", "Face-safe beauty, prosthetic, continuity, cleanup, and stylized digital makeup planning.", "character"],
  ["costume-studio", "Costume Studio", "Wardrobe continuity, fabric references, silhouette planning, palette, and scene costume state.", "character"],
  ["props-studio", "Props Studio", "Hero prop registry, tracking, condition state, shot use, continuity, and fabrication notes.", "character"],
  ["toon-designer-studio", "Toon Designer Studio", "Character model sheets, toon look controls, pose sets, expression banks, and style locks.", "animation"],
  ["cel-animation-studio", "Cel Animation Studio", "Frame drawings, exposure sheets, onion skin views, in-between queues, and cleanup passes.", "animation"],
  ["comic-studio", "Comic Studio", "Panel layouts, speech layers, lettering, gutters, boards, page turns, and print export planning.", "animation"],
  ["face-studio", "Face Studio", "Face topology, tracking references, replacement planning, landmarks, and actor continuity gates.", "character"],
  ["three-d-studio", "3D Studio", "Scene graph, cameras, lights, meshes, transform gizmos, material previews, and spatial passes.", "spatial"],
  ["xr-studio", "XR Studio", "Immersive review, headset-safe layout, spatial audio notes, and extended reality launch planning.", "spatial"],
  ["audio-studio", "Audio Studio", "Dialogue, music, stems, rubab cues, loudness, waveform review, and broadcast-safe mix planning.", "audio"],
  ["color-studio", "Color Studio", "Look development, grade intent, LUT registry, scopes, shot matching, and delivery transforms.", "visual"],
  ["render-center", "Render Center", "Render job planning, hardware checks, queue state, media validation, and blocked runtime evidence.", "delivery"],
  ["export-center", "Export Center", "JSON, TSV, board PNG, MP4, captions, schemas, manifests, and final package planning.", "delivery"],
  ["observatory", "Observatory", "Telemetry, health, scope monitors, logs, verification evidence, and readiness dashboards.", "operations"],
  ["local-ai-mode", "Local AI Mode", "On-device model selection, local inference constraints, privacy gates, and blocked runtime adapters.", "ai"],
  ["cloud-ai-mode", "Cloud AI Mode", "Provider adapter planning, credentials gates, cloud policy, and blocked external execution.", "ai"],
  ["hybrid-ai-mode", "Hybrid AI Mode", "Split local/cloud execution planning, fallback paths, synchronization, and review gates.", "ai"],
  ["admin", "Admin", "Users, plans, license policy, audit trails, workspace controls, and protected operations.", "operations"],
  ["support", "Support", "Recovery guides, diagnostics packages, operator notes, issue intake, and support handoff.", "operations"],
  ["developer-platform", "Developer Platform", "Schema exports, API contracts, plugin surfaces, SDK planning, and integration keys.", "operations"],
  ["security-recovery", "Security Recovery", "Safe mode, session recovery, path policy, threat review, and incident response planning.", "operations"],
];

const blockedModules = new Set(["local-ai-mode", "cloud-ai-mode", "hybrid-ai-mode", "render-center"]);
const plannedModules = new Set(["admin", "support", "developer-platform", "security-recovery"]);

function slugToSnake(value) {
  return value.replace(/-/g, "_");
}

function titleCaseSlug(value) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function permissionsForModule(id) {
  if (id === "admin") return ["project:admin", "admin:read", "admin:write", "billing:read", "billing:write", "security:read"];
  if (id === "support") return ["support:read", "support:write", "project:read", "security:read"];
  if (id === "developer-platform") return ["developer:read", "developer:write", "project:read"];
  if (id === "security-recovery") return ["security:read", "security:write", "project:admin"];
  if (id === "local-ai-mode") return ["project:read", "media:read", "ai:local"];
  if (id === "cloud-ai-mode") return ["project:read", "media:read", "ai:cloud"];
  if (id === "hybrid-ai-mode") return ["project:read", "media:read", "ai:hybrid", "ai:local", "ai:cloud"];
  if (id.includes("render") || id.includes("export")) return ["project:read", "media:read", "render:read", "render:write"];
  if (id.includes("audio")) return ["project:read", "project:write", "media:read", "media:write", "timeline:read", "timeline:write"];
  return ["project:read", "project:write", "media:read", "media:write", "timeline:read", "timeline:write"];
}

function runtimeModesForModule(id) {
  if (id === "local-ai-mode") return ["local"];
  if (id === "cloud-ai-mode") return ["cloud"];
  if (id === "hybrid-ai-mode") return ["hybrid", "local", "cloud"];
  return ["local", "cloud", "hybrid"];
}

const modules = moduleSeeds.map(([id, name, description, category], index) => {
  const status = blockedModules.has(id) ? "blocked" : plannedModules.has(id) ? "planned" : "scaffold";
  return {
    id,
    name,
    description,
    category,
    status,
    routeBase: `/mahavisphot/${id}`,
    runtimeModes: runtimeModesForModule(id),
    planAvailability: id.includes("ai") || id.includes("render") ? ["pro", "studio", "enterprise"] : plans,
    permissions: permissionsForModule(id),
    capabilityGates: [`${id}:access`, `${id}:write`, `${id}:evidence`],
    order: index + 1,
  };
});

const viewTemplates = [
  ["overview", "Overview", "command map", "Overview, readiness, and navigation surface."],
  ["launch", "Launch", "project launch", "New, open, recovery, and project intent selection."],
  ["ingest", "Ingest", "media intake", "Media intake, source validation, and evidence collection."],
  ["storyboard", "Storyboard", "story planning", "Boards, frame descriptions, captions, and shot order."],
  ["timeline", "Timeline", "timeline", "Time-based assembly, tracks, clips, markers, and edits."],
  ["layers", "Layers", "layer control", "Layer routing, visibility, locking, and composition stack."],
  ["inspector", "Inspector", "inspection", "Selected item metadata, numeric controls, and status."],
  ["node-graph", "Node Graph", "node workspace", "Node pass planning, data flow, and render order."],
  ["automation", "Automation", "automation", "Repeatable operations, macro intent, and guarded actions."],
  ["review", "Review", "review", "Approval, compare, comments, and handoff checks."],
  ["collaboration", "Collaboration", "collaboration", "Shared context, roles, assignments, and notes."],
  ["settings", "Settings", "settings", "Module configuration, safety defaults, and preferences."],
  ["health", "Health", "runtime health", "Capability health, environment state, and blocked evidence."],
  ["evidence", "Evidence", "evidence", "Verification artifacts, logs, screenshots, and proof links."],
  ["export", "Export", "delivery", "Data, media, manifest, and delivery package preparation."],
  ["audit", "Audit", "audit", "Security, schema, access, and readiness review."],
];

const pages = modules.flatMap((module, moduleIndex) =>
  viewTemplates.map(([viewId, viewTitle, navigationGroup, description], viewIndex) => ({
    id: `${module.id}.${viewId}`,
    moduleId: module.id,
    title: `${module.name} ${viewTitle}`,
    route: `${module.routeBase}/${viewId}`,
    description: `${module.name}: ${description}`,
    status: module.status === "blocked" ? "blocked" : module.status === "planned" ? "planned" : "scaffold",
    planAvailability: module.planAvailability,
    runtimeModes: module.runtimeModes,
    permissions: module.permissions,
    navigationGroup,
    order: moduleIndex * 100 + viewIndex + 1,
  }))
);

const apiTemplates = [
  ["list", "GET", "records", "List records for the module."],
  ["create", "POST", "records", "Create a validated module record."],
  ["read", "GET", "records/{recordId}", "Read one module record by stable id."],
  ["update", "PUT", "records/{recordId}", "Replace a validated module record."],
  ["delete", "DELETE", "records/{recordId}", "Delete one module record through policy gates."],
  ["health", "GET", "health", "Read module readiness and evidence state."],
];

const apiEndpoints = modules.flatMap((module, moduleIndex) =>
  apiTemplates.map(([action, method, suffix, description], actionIndex) => {
    const apiSlug = module.id;
    return {
      id: `${module.id}.${action}`,
      moduleId: module.id,
      method,
      path: `/api/v1/${apiSlug}/${suffix}`,
      description: `${module.name}: ${description}`,
      status: module.status === "blocked" ? "blocked" : "scaffold",
      requestSchema: `${schemaVersion}.${module.id}.${action}.request`,
      responseSchema: `${schemaVersion}.${module.id}.${action}.response`,
      permissions: action === "list" || action === "read" || action === "health"
        ? module.permissions.filter((permission) => permission.endsWith(":read") || permission === "project:read" || permission === "media:read" || permission.startsWith("ai:"))
        : module.permissions,
      planAvailability: module.planAvailability,
      runtimeModes: module.runtimeModes,
      order: moduleIndex * 100 + actionIndex + 1,
    };
  })
);

const tableTemplates = [
  ["records", "Stable module records and serialized domain state."],
  ["events", "Append-only module events, decisions, and audit evidence references."],
  ["settings", "User, workspace, and project-scoped module settings."],
];

const tables = modules.flatMap((module, moduleIndex) =>
  tableTemplates.map(([suffix, description], tableIndex) => ({
    name: `mahavisphot_${slugToSnake(module.id)}_${suffix}`,
    moduleId: module.id,
    description: `${module.name}: ${description}`,
    status: module.status === "blocked" ? "blocked" : "scaffold",
    primaryKey: "id",
    columns: [
      { name: "id", type: "text", required: true, description: "Deterministic record identifier." },
      { name: "project_id", type: "text", required: true, description: "Owning project identifier." },
      { name: "schema_version", type: "text", required: true, description: "Registry schema version." },
      { name: "status", type: "text", required: true, description: "Feature or record status." },
      { name: "payload_json", type: "json", required: true, description: "Schema-validated payload." },
      { name: "created_at", type: "text", required: true, description: "ISO-8601 creation timestamp from storage layer." },
      { name: "updated_at", type: "text", required: true, description: "ISO-8601 update timestamp from storage layer." },
    ],
    indexes: [
      `idx_${slugToSnake(module.id)}_${suffix}_project_id`,
      `idx_${slugToSnake(module.id)}_${suffix}_status`,
    ],
    order: moduleIndex * 10 + tableIndex + 1,
  }))
);

const capabilityGates = modules.flatMap((module) => [
  {
    id: `${module.id}:access`,
    moduleId: module.id,
    title: `${module.name} access`,
    status: module.status,
    plans: module.planAvailability,
    runtimeModes: module.runtimeModes,
    permissions: module.permissions,
    evidenceRequired: module.status === "blocked",
  },
  {
    id: `${module.id}:write`,
    moduleId: module.id,
    title: `${module.name} write controls`,
    status: module.status === "planned" ? "planned" : module.status === "blocked" ? "blocked" : "scaffold",
    plans: module.planAvailability,
    runtimeModes: module.runtimeModes,
    permissions: module.permissions.filter((permission) => permission.endsWith(":write") || permission === "project:write" || permission.startsWith("ai:")),
    evidenceRequired: module.status === "blocked",
  },
  {
    id: `${module.id}:evidence`,
    moduleId: module.id,
    title: `${module.name} evidence gate`,
    status: module.status === "blocked" ? "blocked" : "scaffold",
    plans: module.planAvailability,
    runtimeModes: module.runtimeModes,
    permissions: ["project:read"],
    evidenceRequired: true,
  },
]);

const schemaEntities = [
  {
    id: "mahavisphot.project",
    name: "Mahavisphot Project",
    kind: "project",
    description: "Root project envelope for scenes, tracks, compositions, captions, VFX, audio, render, and evidence references.",
    status: "scaffold",
    schemaVersion,
    fields: ["id", "name", "schemaVersion", "runtimeMode", "plan", "modules", "tracks", "compositions", "evidence"],
  },
  {
    id: "mahavisphot.runtime-mode",
    name: "Runtime Mode",
    kind: "runtime",
    description: "Validated local, cloud, or hybrid AI runtime selection.",
    status: "blocked",
    schemaVersion,
    fields: ["mode", "provider", "adapter", "evidenceReference", "health"],
  },
  {
    id: "mahavisphot.capability-gate",
    name: "Capability Gate",
    kind: "security",
    description: "Plan, permission, runtime, and evidence policy for a studio capability.",
    status: "scaffold",
    schemaVersion,
    fields: ["id", "moduleId", "plans", "permissions", "runtimeModes", "status", "evidenceRequired"],
  },
  ...modules.map((module) => ({
    id: `mahavisphot.module.${module.id}`,
    name: `${module.name} Entity`,
    kind: "module",
    description: module.description,
    status: module.status,
    schemaVersion,
    fields: ["id", "moduleId", "status", "payload", "permissions", "planAvailability", "runtimeModes"],
  })),
];

const schemaRegistry = {
  schemaVersion,
  generatedBy: "scripts/generate-mahavisphot-scaffold.mjs",
  runtimeModes,
  statuses,
  plans,
  permissions,
  modules,
  capabilityGates,
  entities: schemaEntities,
  counts: {
    modules: modules.length,
    pages: pages.length,
    apiEndpoints: apiEndpoints.length,
    databaseTables: tables.length,
    schemaEntities: schemaEntities.length,
  },
};

function jsonBlock(value) {
  return JSON.stringify(value, null, 2);
}

function tsArrayFile(typeName, exportName, value) {
  return `import type { ${typeName} } from "../types/mahavisphot-types";

export const ${exportName} = ${jsonBlock(value)} as const satisfies ReadonlyArray<${typeName}>;
`;
}

function typesFile() {
  return `export type MahavisphotFeatureStatus = "production" | "preview" | "scaffold" | "planned" | "blocked";

export type MahavisphotRuntimeMode = "local" | "cloud" | "hybrid";

export type MahavisphotPlan = "free" | "trial" | "pro" | "studio" | "enterprise";

export type MahavisphotPermission =
${permissions.map((permission) => `  | "${permission}"`).join("\n")};

export type MahavisphotApiMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface MahavisphotCapabilityGate {
  readonly id: string;
  readonly moduleId: string;
  readonly title: string;
  readonly status: MahavisphotFeatureStatus;
  readonly plans: ReadonlyArray<MahavisphotPlan>;
  readonly runtimeModes: ReadonlyArray<MahavisphotRuntimeMode>;
  readonly permissions: ReadonlyArray<MahavisphotPermission>;
  readonly evidenceRequired: boolean;
  readonly evidenceReference?: string;
}

export interface MahavisphotModule {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: string;
  readonly status: MahavisphotFeatureStatus;
  readonly routeBase: string;
  readonly runtimeModes: ReadonlyArray<MahavisphotRuntimeMode>;
  readonly planAvailability: ReadonlyArray<MahavisphotPlan>;
  readonly permissions: ReadonlyArray<MahavisphotPermission>;
  readonly capabilityGates: ReadonlyArray<string>;
  readonly order: number;
  readonly evidenceReference?: string;
}

export interface MahavisphotPage {
  readonly id: string;
  readonly moduleId: string;
  readonly title: string;
  readonly route: string;
  readonly description: string;
  readonly status: MahavisphotFeatureStatus;
  readonly planAvailability: ReadonlyArray<MahavisphotPlan>;
  readonly runtimeModes: ReadonlyArray<MahavisphotRuntimeMode>;
  readonly permissions: ReadonlyArray<MahavisphotPermission>;
  readonly navigationGroup: string;
  readonly order: number;
  readonly evidenceReference?: string;
}

export interface MahavisphotApiEndpoint {
  readonly id: string;
  readonly moduleId: string;
  readonly method: MahavisphotApiMethod;
  readonly path: string;
  readonly description: string;
  readonly status: MahavisphotFeatureStatus;
  readonly requestSchema: string;
  readonly responseSchema: string;
  readonly permissions: ReadonlyArray<MahavisphotPermission>;
  readonly planAvailability: ReadonlyArray<MahavisphotPlan>;
  readonly runtimeModes: ReadonlyArray<MahavisphotRuntimeMode>;
  readonly order: number;
  readonly evidenceReference?: string;
}

export interface MahavisphotDatabaseColumn {
  readonly name: string;
  readonly type: "text" | "integer" | "real" | "boolean" | "json";
  readonly required: boolean;
  readonly description: string;
}

export interface MahavisphotDatabaseTable {
  readonly name: string;
  readonly moduleId: string;
  readonly description: string;
  readonly status: MahavisphotFeatureStatus;
  readonly primaryKey: string;
  readonly columns: ReadonlyArray<MahavisphotDatabaseColumn>;
  readonly indexes: ReadonlyArray<string>;
  readonly order: number;
  readonly evidenceReference?: string;
}

export interface MahavisphotSchemaEntity {
  readonly id: string;
  readonly name: string;
  readonly kind: "project" | "runtime" | "security" | "module" | "api" | "table" | "page";
  readonly description: string;
  readonly status: MahavisphotFeatureStatus;
  readonly schemaVersion: string;
  readonly fields: ReadonlyArray<string>;
  readonly evidenceReference?: string;
}

export interface MahavisphotSchemaRegistry {
  readonly schemaVersion: string;
  readonly generatedBy: string;
  readonly runtimeModes: ReadonlyArray<MahavisphotRuntimeMode>;
  readonly statuses: ReadonlyArray<MahavisphotFeatureStatus>;
  readonly plans: ReadonlyArray<MahavisphotPlan>;
  readonly permissions: ReadonlyArray<MahavisphotPermission>;
  readonly modules: ReadonlyArray<MahavisphotModule>;
  readonly capabilityGates: ReadonlyArray<MahavisphotCapabilityGate>;
  readonly entities: ReadonlyArray<MahavisphotSchemaEntity>;
  readonly counts: {
    readonly modules: number;
    readonly pages: number;
    readonly apiEndpoints: number;
    readonly databaseTables: number;
    readonly schemaEntities: number;
  };
}
`;
}

function validationFile() {
  return `import type {
  MahavisphotApiMethod,
  MahavisphotFeatureStatus,
  MahavisphotPermission,
  MahavisphotPlan,
  MahavisphotRuntimeMode,
} from "../types/mahavisphot-types";

export interface MahavisphotValidationError {
  readonly code: string;
  readonly field: string;
  readonly message: string;
}

export interface MahavisphotValidationResult {
  readonly ok: boolean;
  readonly errors: Array<MahavisphotValidationError>;
}

export const VALID_MAHAVISPHOT_STATUSES = ${jsonBlock(statuses)} as const satisfies ReadonlyArray<MahavisphotFeatureStatus>;
export const VALID_MAHAVISPHOT_RUNTIME_MODES = ${jsonBlock(runtimeModes)} as const satisfies ReadonlyArray<MahavisphotRuntimeMode>;
export const VALID_MAHAVISPHOT_PLANS = ${jsonBlock(plans)} as const satisfies ReadonlyArray<MahavisphotPlan>;
export const VALID_MAHAVISPHOT_PERMISSIONS = ${jsonBlock(permissions)} as const satisfies ReadonlyArray<MahavisphotPermission>;
export const VALID_MAHAVISPHOT_ENDPOINT_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"] as const satisfies ReadonlyArray<MahavisphotApiMethod>;

const pageIdPattern = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*(?:\\.[a-z][a-z0-9]*(?:-[a-z0-9]+)*)$/;
const moduleIdPattern = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
const routePathPattern = /^\\/mahavisphot(?:\\/[a-z0-9]+(?:-[a-z0-9]+)*)+$/;
const endpointPathPattern = /^\\/api\\/v1(?:\\/(?:[a-z0-9]+(?:-[a-z0-9]+)*|\\{[a-z][A-Za-z0-9]*\\}))+$/;
const tableNamePattern = /^[a-z][a-z0-9]*(?:_[a-z0-9]+)*$/;
const schemaVersionPattern = /^mahavisphot\\.schema\\.v[0-9]+$/;

function validationResult(errors: Array<MahavisphotValidationError>): MahavisphotValidationResult {
  return { ok: errors.length === 0, errors };
}

function singleError(code: string, field: string, message: string): MahavisphotValidationResult {
  return validationResult([{ code, field, message }]);
}

export function validateMahavisphotPageId(value: unknown): MahavisphotValidationResult {
  if (typeof value !== "string" || !pageIdPattern.test(value)) {
    return singleError("INVALID_PAGE_ID", "page.id", "Page id must be a deterministic module.view slug pair.");
  }
  return validationResult([]);
}

export function validateMahavisphotRoutePath(value: unknown): MahavisphotValidationResult {
  if (typeof value !== "string" || !routePathPattern.test(value) || value.includes("//") || value.endsWith("/")) {
    return singleError("INVALID_ROUTE_PATH", "page.route", "Route path must start with /mahavisphot and use lowercase slug segments.");
  }
  return validationResult([]);
}

export function validateMahavisphotModuleId(value: unknown): MahavisphotValidationResult {
  if (typeof value !== "string" || !moduleIdPattern.test(value)) {
    return singleError("INVALID_MODULE_ID", "module.id", "Module id must be a lowercase slug.");
  }
  return validationResult([]);
}

export function validateMahavisphotEndpointMethod(value: unknown): MahavisphotValidationResult {
  if (typeof value !== "string" || !VALID_MAHAVISPHOT_ENDPOINT_METHODS.includes(value as MahavisphotApiMethod)) {
    return singleError("INVALID_ENDPOINT_METHOD", "api.method", "Endpoint method must be GET, POST, PUT, PATCH, or DELETE.");
  }
  return validationResult([]);
}

export function validateMahavisphotEndpointPath(value: unknown): MahavisphotValidationResult {
  if (typeof value !== "string" || !endpointPathPattern.test(value) || value.includes("//")) {
    return singleError("INVALID_ENDPOINT_PATH", "api.path", "Endpoint path must start with /api/v1 and use slug or {paramName} segments.");
  }
  return validationResult([]);
}

export function validateMahavisphotTableName(value: unknown): MahavisphotValidationResult {
  if (typeof value !== "string" || !tableNamePattern.test(value)) {
    return singleError("INVALID_TABLE_NAME", "database.table.name", "Table name must be snake_case and start with a lowercase letter.");
  }
  return validationResult([]);
}

export function validateMahavisphotSchemaVersion(value: unknown): MahavisphotValidationResult {
  if (typeof value !== "string" || !schemaVersionPattern.test(value)) {
    return singleError("INVALID_SCHEMA_VERSION", "schema.version", "Schema version must match mahavisphot.schema.vN.");
  }
  return validationResult([]);
}

export function validateMahavisphotStatusValue(value: unknown): MahavisphotValidationResult {
  if (typeof value !== "string" || !VALID_MAHAVISPHOT_STATUSES.includes(value as MahavisphotFeatureStatus)) {
    return singleError("INVALID_STATUS", "status", "Status must be production, preview, scaffold, planned, or blocked.");
  }
  return validationResult([]);
}

export function validateMahavisphotPlanValue(value: unknown): MahavisphotValidationResult {
  if (typeof value !== "string" || !VALID_MAHAVISPHOT_PLANS.includes(value as MahavisphotPlan)) {
    return singleError("INVALID_PLAN", "plan", "Plan must be free, trial, pro, studio, or enterprise.");
  }
  return validationResult([]);
}

export function validateMahavisphotRuntimeModeValue(value: unknown): MahavisphotValidationResult {
  if (typeof value !== "string" || !VALID_MAHAVISPHOT_RUNTIME_MODES.includes(value as MahavisphotRuntimeMode)) {
    return singleError("INVALID_RUNTIME_MODE", "runtime.mode", "Runtime mode must be local, cloud, or hybrid.");
  }
  return validationResult([]);
}

export function validateMahavisphotPermissionValue(value: unknown): MahavisphotValidationResult {
  if (typeof value !== "string" || !VALID_MAHAVISPHOT_PERMISSIONS.includes(value as MahavisphotPermission)) {
    return singleError("INVALID_PERMISSION", "permission", "Permission must be one of the Mahavisphot permission registry values.");
  }
  return validationResult([]);
}
`;
}

function schemaTsFile() {
  return `import type {
  MahavisphotCapabilityGate,
  MahavisphotFeatureStatus,
  MahavisphotPermission,
  MahavisphotPlan,
  MahavisphotRuntimeMode,
  MahavisphotSchemaEntity,
  MahavisphotSchemaRegistry,
} from "../types/mahavisphot-types";
import { MAHAVISPHOT_MODULES } from "./mahavisphot-modules.ts";

export const MAHAVISPHOT_SCHEMA_VERSION = "${schemaVersion}" as const;
export const MAHAVISPHOT_RUNTIME_MODES = ${jsonBlock(runtimeModes)} as const satisfies ReadonlyArray<MahavisphotRuntimeMode>;
export const MAHAVISPHOT_FEATURE_STATUSES = ${jsonBlock(statuses)} as const satisfies ReadonlyArray<MahavisphotFeatureStatus>;
export const MAHAVISPHOT_PLANS = ${jsonBlock(plans)} as const satisfies ReadonlyArray<MahavisphotPlan>;
export const MAHAVISPHOT_PERMISSIONS = ${jsonBlock(permissions)} as const satisfies ReadonlyArray<MahavisphotPermission>;
export const MAHAVISPHOT_CAPABILITY_GATES = ${jsonBlock(capabilityGates)} as const satisfies ReadonlyArray<MahavisphotCapabilityGate>;
export const MAHAVISPHOT_SCHEMA_ENTITIES = ${jsonBlock(schemaEntities)} as const satisfies ReadonlyArray<MahavisphotSchemaEntity>;

export const MAHAVISPHOT_SCHEMA_REGISTRY = {
  schemaVersion: MAHAVISPHOT_SCHEMA_VERSION,
  generatedBy: "scripts/generate-mahavisphot-scaffold.mjs",
  runtimeModes: MAHAVISPHOT_RUNTIME_MODES,
  statuses: MAHAVISPHOT_FEATURE_STATUSES,
  plans: MAHAVISPHOT_PLANS,
  permissions: MAHAVISPHOT_PERMISSIONS,
  modules: MAHAVISPHOT_MODULES,
  capabilityGates: MAHAVISPHOT_CAPABILITY_GATES,
  entities: MAHAVISPHOT_SCHEMA_ENTITIES,
  counts: ${jsonBlock(schemaRegistry.counts)},
} as const satisfies MahavisphotSchemaRegistry;
`;
}

function markdownTable(headers, rows) {
  return [
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.map((cell) => String(cell).replace(/\|/g, "\\|")).join(" | ")} |`),
  ].join("\n");
}

function apiSchemaDoc() {
  return `# Mahavisphot API Schema

This document describes the deterministic scaffolded API contract registry. These contracts are not runtime claims; endpoint execution remains blocked until handlers, adapters, and evidence are implemented.

${markdownTable(
  ["ID", "Method", "Path", "Status", "Request Schema", "Response Schema"],
  apiEndpoints.map((endpoint) => [endpoint.id, endpoint.method, endpoint.path, endpoint.status, endpoint.requestSchema, endpoint.responseSchema])
)}
`;
}

function uxPagesDoc() {
  return `# Mahavisphot UX Pages

The registry contains ${pages.length} major UX pages/views across ${modules.length} studio modules. Page status is scaffold, planned, or blocked unless production evidence is attached in a future implementation.

${markdownTable(
  ["ID", "Module", "Route", "Status", "Navigation Group"],
  pages.map((page) => [page.id, page.moduleId, page.route, page.status, page.navigationGroup])
)}
`;
}

function databaseTablesDoc() {
  return `# Mahavisphot Database Tables

The table registry is a deterministic schema contract, not a claim that migrations have been applied. Runtime database integration remains blocked until migration and persistence evidence exists.

${markdownTable(
  ["Name", "Module", "Status", "Primary Key", "Indexes"],
  tables.map((table) => [table.name, table.moduleId, table.status, table.primaryKey, table.indexes.join(", ")])
)}
`;
}

function schemaRegistryDoc() {
  return `# Mahavisphot Schema Registry

- Schema version: \`${schemaVersion}\`
- Modules: ${modules.length}
- UX pages: ${pages.length}
- API endpoints: ${apiEndpoints.length}
- Database tables: ${tables.length}
- Schema entities: ${schemaEntities.length}

${markdownTable(
  ["Entity", "Kind", "Status", "Fields"],
  schemaEntities.map((entity) => [entity.id, entity.kind, entity.status, entity.fields.join(", ")])
)}
`;
}

function runtimeModesDoc() {
  return `# Mahavisphot Runtime Modes

| Runtime Mode | Status | Evidence Requirement |
| --- | --- | --- |
| local | blocked | Requires verified local model runtime, model inventory, hardware profile, and adapter tests. |
| cloud | blocked | Requires provider credentials, network adapter evidence, request validation, and audit logs. |
| hybrid | blocked | Requires local/cloud orchestration, fallback evidence, synchronization tests, and failure-mode review. |

No AI runtime mode is marked production in this scaffold.
`;
}

function implementationStatusDoc() {
  return `# Mahavisphot Implementation Status

| Capability | Status | Evidence |
| --- | --- | --- |
| UI registry scaffold | implemented | TypeScript registry and matching JSON data files are present. |
| API contract registry | implemented | Deterministic /api/v1 contract registry is present. |
| Database table registry | implemented | Deterministic table registry is present. |
| Runtime render engine | blocked until implementation evidence | No verified render runtime integration evidence in this scaffold. |
| Local AI execution | blocked until model runtime evidence | No verified local model runtime evidence in this scaffold. |
| Cloud AI execution | blocked until provider credentials and adapter evidence | No provider credential or adapter execution evidence in this scaffold. |
| Export parity | blocked until renderer integration evidence | Export contract exists, renderer parity is not proven by this scaffold. |
| Security hardening | planned | This registry does not prove hardened runtime enforcement. |

PRODUCTION_READY=false
PHKD_VERDICT=BLOCKED_UNTIL_RUNTIME_EVIDENCE
`;
}

function homePage() {
  const cards = [
    ["Editor", "/editor"],
    ["Compositor", "/editor"],
    ["VFX", "/mahavisphot/vfx-studio/overview"],
    ["Particle Studio", "/mahavisphot/particle-studio/overview"],
    ["Digital Makeup", "/mahavisphot/digital-makeup-studio/overview"],
    ["Costume Studio", "/mahavisphot/costume-studio/overview"],
    ["Props Studio", "/mahavisphot/props-studio/overview"],
    ["Toon Designer", "/mahavisphot/toon-designer-studio/overview"],
    ["Cel Animation", "/mahavisphot/cel-animation-studio/overview"],
    ["Local AI", "/mahavisphot/local-ai-mode/overview"],
    ["Cloud AI", "/mahavisphot/cloud-ai-mode/overview"],
    ["Hybrid AI", "/mahavisphot/hybrid-ai-mode/overview"],
    ["Render Center", "/mahavisphot/render-center/overview"],
    ["Observatory", "/mahavisphot/observatory/overview"],
  ];
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Mahavisphot Studio</title>
    <style>
      :root { color-scheme: dark; --bg: #090a0d; --panel: #151820; --line: #2a3040; --text: #f3f0e8; --muted: #9ba4b5; --cyan: #25d0df; --gold: #e2bd64; --rose: #df5b73; --green: #67c57a; }
      * { box-sizing: border-box; }
      body { margin: 0; min-height: 100vh; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: var(--bg); color: var(--text); }
      header { padding: 28px clamp(18px, 4vw, 56px) 12px; display: flex; align-items: center; justify-content: space-between; gap: 16px; border-bottom: 1px solid var(--line); }
      nav { display: flex; gap: 8px; flex-wrap: wrap; }
      a { color: inherit; text-decoration: none; }
      .nav-link, .primary { border: 1px solid var(--line); border-radius: 6px; padding: 9px 12px; font-size: 13px; background: #12151d; }
      .primary { border-color: var(--cyan); color: #061114; background: var(--cyan); font-weight: 700; }
      main { padding: clamp(28px, 5vw, 70px) clamp(18px, 5vw, 72px); }
      .hero { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(280px, .8fr); gap: 34px; align-items: end; }
      h1 { font-size: clamp(42px, 7vw, 92px); line-height: .92; margin: 0; letter-spacing: 0; }
      .subtitle { max-width: 820px; margin: 18px 0 0; font-size: clamp(16px, 2vw, 22px); color: var(--muted); line-height: 1.45; }
      .badge { border: 1px solid var(--gold); color: var(--gold); padding: 12px 14px; border-radius: 6px; background: rgba(226, 189, 100, .09); font-size: 13px; line-height: 1.45; }
      .cards { margin-top: 44px; display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 12px; }
      .card { min-height: 104px; border: 1px solid var(--line); border-radius: 8px; padding: 16px; background: var(--panel); display: flex; align-items: flex-end; justify-content: space-between; gap: 10px; }
      .card strong { font-size: 16px; }
      .card span { width: 9px; height: 9px; border-radius: 50%; background: var(--green); flex: 0 0 auto; }
      .card:nth-child(3n) span { background: var(--rose); }
      .card:nth-child(4n) span { background: var(--gold); }
      footer { padding: 18px clamp(18px, 5vw, 72px); color: var(--muted); font-size: 12px; border-top: 1px solid var(--line); }
      @media (max-width: 780px) { .hero { grid-template-columns: 1fr; } header { align-items: flex-start; flex-direction: column; } }
    </style>
  </head>
  <body>
    <header>
      <strong>MAHAVISPHOT STUDIO</strong>
      <nav aria-label="Studio navigation">
        <a class="nav-link" href="/editor">Editor</a>
        <a class="nav-link" href="/mahavisphot/launch">Launch</a>
        <a class="primary" href="/mahavisphot/observatory/overview">Observatory</a>
      </nav>
    </header>
    <main>
      <section class="hero" aria-labelledby="studio-title">
        <div>
          <h1 id="studio-title">Mahavisphot Studio</h1>
          <p class="subtitle">AI-powered cinematic production, VFX, animation, toon, cel, audio, XR, and render operating system.</p>
        </div>
        <div class="badge">Architecture scaffold — production readiness requires verified runtime evidence.</div>
      </section>
      <section class="cards" aria-label="Studio launch surfaces">
        ${cards.map(([label, href]) => `<a class="card" href="${href}"><strong>${label}</strong><span aria-hidden="true"></span></a>`).join("\n        ")}
      </section>
    </main>
    <footer>Schema ${schemaVersion} · production runtime claims are intentionally blocked until evidence exists.</footer>
  </body>
</html>
`;
}

function launchPage() {
  const actions = [
    ["New Project", "Create a validated project shell from the studio schema."],
    ["Open Project", "Open an existing local project record."],
    ["Recent Projects", "Review saved project entries when authenticated."],
    ["Templates", "Start from deterministic studio templates."],
    ["Hardware Check", "Read browser-reported hardware capability without claiming pass/fail."],
    ["Runtime Health", "Query the local app health endpoint and display the actual response."],
    ["Local AI Mode", "Blocked until local model runtime evidence is attached."],
    ["Cloud AI Mode", "Blocked until provider credentials and adapter evidence exist."],
    ["Hybrid AI Mode", "Blocked until orchestration evidence exists."],
    ["Recovery Mode", "Open safe launch posture for damaged or partial project state."],
  ];
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Mahavisphot Launch</title>
    <style>
      :root { color-scheme: dark; --bg: #0b0c10; --panel: #171a22; --line: #2c3242; --text: #f4f1ea; --muted: #9ca6b8; --cyan: #24c7d8; --gold: #d9b65f; --blocked: #e05b6f; }
      * { box-sizing: border-box; }
      body { margin: 0; min-height: 100vh; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: var(--bg); color: var(--text); }
      header { padding: 22px clamp(18px, 4vw, 52px); border-bottom: 1px solid var(--line); display: flex; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
      a, button { color: inherit; font: inherit; }
      a { text-decoration: none; }
      .link { border: 1px solid var(--line); border-radius: 6px; padding: 8px 11px; background: #12151c; }
      main { padding: clamp(24px, 4vw, 52px); display: grid; grid-template-columns: minmax(0, 1fr) minmax(280px, 380px); gap: 18px; align-items: start; }
      h1 { font-size: clamp(32px, 5vw, 58px); margin: 0 0 8px; letter-spacing: 0; }
      .muted { color: var(--muted); line-height: 1.45; }
      .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 12px; margin-top: 24px; }
      .action { min-height: 118px; text-align: left; border: 1px solid var(--line); border-radius: 8px; background: var(--panel); padding: 15px; cursor: pointer; }
      .action strong { display: block; margin-bottom: 9px; }
      .action p { margin: 0; color: var(--muted); font-size: 13px; line-height: 1.4; }
      .side { border: 1px solid var(--line); border-radius: 8px; background: var(--panel); padding: 16px; }
      .status { display: grid; gap: 10px; font-size: 13px; }
      .row { display: flex; justify-content: space-between; gap: 14px; border-bottom: 1px solid var(--line); padding-bottom: 8px; }
      .row:last-child { border-bottom: 0; padding-bottom: 0; }
      .blocked { color: var(--blocked); }
      .ready { color: var(--cyan); }
      @media (max-width: 900px) { main { grid-template-columns: 1fr; } }
    </style>
  </head>
  <body>
    <header>
      <strong>MAHAVISPHOT LAUNCH</strong>
      <nav aria-label="Launch navigation">
        <a class="link" href="/mahavisphot">Studio Home</a>
        <a class="link" href="/editor">Open Editor</a>
      </nav>
    </header>
    <main>
      <section>
        <h1>Launch Surface</h1>
        <p class="muted">Project creation, recovery, runtime mode selection, and health checks are surfaced here. Runtime-heavy capabilities remain blocked until verified evidence is connected.</p>
        <div class="grid" aria-label="Launch actions">
          ${actions.map(([label, description]) => `<button class="action" type="button"><strong>${label}</strong><p>${description}</p></button>`).join("\n          ")}
        </div>
      </section>
      <aside class="side" aria-label="Runtime health and hardware">
        <h2>Runtime Health</h2>
        <div class="status">
          <div class="row"><span>App Health</span><span id="appHealth" class="blocked">Checking</span></div>
          <div class="row"><span>Port Ownership</span><span id="portOwnership" class="blocked">Unverified</span></div>
          <div class="row"><span>CPU Threads</span><span id="cpuThreads">Unknown</span></div>
          <div class="row"><span>Device Memory</span><span id="deviceMemory">Unknown</span></div>
          <div class="row"><span>Local AI Mode</span><span class="blocked">Blocked</span></div>
          <div class="row"><span>Cloud AI Mode</span><span class="blocked">Blocked</span></div>
          <div class="row"><span>Hybrid AI Mode</span><span class="blocked">Blocked</span></div>
        </div>
      </aside>
    </main>
    <script>
      const cpuThreads = navigator.hardwareConcurrency ? String(navigator.hardwareConcurrency) : "Unavailable";
      const memory = navigator.deviceMemory ? navigator.deviceMemory + " GB" : "Unavailable";
      document.getElementById("cpuThreads").textContent = cpuThreads;
      document.getElementById("deviceMemory").textContent = memory;
      fetch("/api/health", { cache: "no-store" })
        .then((response) => response.json())
        .then((health) => {
          document.getElementById("appHealth").textContent = health.ok ? "Responding" : "Failed";
          document.getElementById("appHealth").className = health.ok ? "ready" : "blocked";
          document.getElementById("portOwnership").textContent = health.owned ? "Owned" : "Token required";
          document.getElementById("portOwnership").className = health.owned ? "ready" : "blocked";
        })
        .catch((error) => {
          document.getElementById("appHealth").textContent = "Unavailable";
          document.getElementById("portOwnership").textContent = error.message || "Unverified";
        });
    </script>
  </body>
</html>
`;
}

function statusScript() {
  return `import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const statusPath = path.resolve(__dirname, "../docs/mahavisphot/IMPLEMENTATION_STATUS.md");
const status = await readFile(statusPath, "utf8");
console.log(status.trim());
`;
}

function testFile() {
  return `import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  VALID_MAHAVISPHOT_ENDPOINT_METHODS,
  VALID_MAHAVISPHOT_RUNTIME_MODES,
  VALID_MAHAVISPHOT_STATUSES,
  validateMahavisphotEndpointMethod,
  validateMahavisphotRoutePath,
  validateMahavisphotTableName,
} from "../src/mahavisphot/validation/mahavisphot-validation.ts";
import { MAHAVISPHOT_API_ENDPOINTS } from "../src/mahavisphot/registry/mahavisphot-api.ts";
import { MAHAVISPHOT_DATABASE_TABLES } from "../src/mahavisphot/registry/mahavisphot-tables.ts";
import { MAHAVISPHOT_PAGES } from "../src/mahavisphot/registry/mahavisphot-pages.ts";
import { MAHAVISPHOT_SCHEMA_REGISTRY } from "../src/mahavisphot/registry/mahavisphot-schema.ts";

const readJson = (relativePath) => JSON.parse(readFileSync(new URL(relativePath, import.meta.url), "utf8"));

const pages = readJson("../src/mahavisphot/data/mahavisphot-pages.json");
const apiEndpoints = readJson("../src/mahavisphot/data/mahavisphot-api.json");
const tables = readJson("../src/mahavisphot/data/mahavisphot-tables.json");
const schema = readJson("../src/mahavisphot/data/mahavisphot-schema.json");

test("Mahavisphot JSON registries match TypeScript registries", () => {
  assert.deepEqual(pages, JSON.parse(JSON.stringify(MAHAVISPHOT_PAGES)));
  assert.deepEqual(apiEndpoints, JSON.parse(JSON.stringify(MAHAVISPHOT_API_ENDPOINTS)));
  assert.deepEqual(tables, JSON.parse(JSON.stringify(MAHAVISPHOT_DATABASE_TABLES)));
  assert.deepEqual(schema, JSON.parse(JSON.stringify(MAHAVISPHOT_SCHEMA_REGISTRY)));
});

test("Mahavisphot page registry contains at least 400 unique pages and routes", () => {
  assert.ok(pages.length >= 400);
  assert.equal(new Set(pages.map((page) => page.id)).size, pages.length);
  assert.equal(new Set(pages.map((page) => page.route)).size, pages.length);
});

test("Mahavisphot API endpoints have valid methods and /api/v1 paths", () => {
  for (const endpoint of apiEndpoints) {
    assert.ok(VALID_MAHAVISPHOT_ENDPOINT_METHODS.includes(endpoint.method), endpoint.id);
    assert.ok(endpoint.path.startsWith("/api/v1"), endpoint.path);
  }
});

test("Mahavisphot table names are snake_case", () => {
  for (const table of tables) {
    assert.match(table.name, /^[a-z][a-z0-9]*(?:_[a-z0-9]+)*$/, table.name);
  }
});

test("Mahavisphot feature statuses are valid", () => {
  const statusValues = [
    ...schema.modules.map((module) => module.status),
    ...schema.capabilityGates.map((gate) => gate.status),
    ...schema.entities.map((entity) => entity.status),
    ...pages.map((page) => page.status),
    ...apiEndpoints.map((endpoint) => endpoint.status),
    ...tables.map((table) => table.status),
  ];
  for (const status of statusValues) {
    assert.ok(VALID_MAHAVISPHOT_STATUSES.includes(status), status);
  }
});

test("Mahavisphot AI runtime modes and required studios exist", () => {
  for (const mode of ["local", "cloud", "hybrid"]) {
    assert.ok(VALID_MAHAVISPHOT_RUNTIME_MODES.includes(mode), mode);
    assert.ok(schema.runtimeModes.includes(mode), mode);
  }
  const moduleNames = new Set(schema.modules.map((module) => module.name));
  assert.ok(moduleNames.has("Toon Designer Studio"));
  assert.ok(moduleNames.has("Cel Animation Studio"));
  assert.ok(moduleNames.has("Digital Makeup Studio"));
  assert.ok(moduleNames.has("Costume Studio"));
  assert.ok(moduleNames.has("Props Studio"));
});

test("No page is marked production without evidenceReference", () => {
  for (const page of pages) {
    if (page.status === "production") {
      assert.equal(typeof page.evidenceReference, "string", page.id);
      assert.notEqual(page.evidenceReference.trim(), "", page.id);
    }
  }
});

test("Mahavisphot validators reject invalid route, method, and table name", () => {
  assert.equal(validateMahavisphotRoutePath("mahavisphot/no-leading-slash").ok, false);
  assert.equal(validateMahavisphotEndpointMethod("TRACE").ok, false);
  assert.equal(validateMahavisphotTableName("Bad-Table-Name").ok, false);
});
`;
}

const files = new Map([
  ["src/mahavisphot/types/mahavisphot-types.ts", typesFile()],
  ["src/mahavisphot/registry/mahavisphot-modules.ts", tsArrayFile("MahavisphotModule", "MAHAVISPHOT_MODULES", modules)],
  ["src/mahavisphot/registry/mahavisphot-pages.ts", tsArrayFile("MahavisphotPage", "MAHAVISPHOT_PAGES", pages)],
  ["src/mahavisphot/registry/mahavisphot-api.ts", tsArrayFile("MahavisphotApiEndpoint", "MAHAVISPHOT_API_ENDPOINTS", apiEndpoints)],
  ["src/mahavisphot/registry/mahavisphot-tables.ts", tsArrayFile("MahavisphotDatabaseTable", "MAHAVISPHOT_DATABASE_TABLES", tables)],
  ["src/mahavisphot/registry/mahavisphot-schema.ts", schemaTsFile()],
  ["src/mahavisphot/validation/mahavisphot-validation.ts", validationFile()],
  ["src/mahavisphot/data/mahavisphot-pages.json", `${jsonBlock(pages)}\n`],
  ["src/mahavisphot/data/mahavisphot-api.json", `${jsonBlock(apiEndpoints)}\n`],
  ["src/mahavisphot/data/mahavisphot-tables.json", `${jsonBlock(tables)}\n`],
  ["src/mahavisphot/data/mahavisphot-schema.json", `${jsonBlock(schemaRegistry)}\n`],
  ["public/mahavisphot/index.html", homePage()],
  ["public/mahavisphot/launch.html", launchPage()],
  ["docs/mahavisphot/API_SCHEMA.md", apiSchemaDoc()],
  ["docs/mahavisphot/UX_PAGES.md", uxPagesDoc()],
  ["docs/mahavisphot/DATABASE_TABLES.md", databaseTablesDoc()],
  ["docs/mahavisphot/SCHEMA_REGISTRY.md", schemaRegistryDoc()],
  ["docs/mahavisphot/RUNTIME_MODES.md", runtimeModesDoc()],
  ["docs/mahavisphot/IMPLEMENTATION_STATUS.md", implementationStatusDoc()],
  ["scripts/mahavisphot-status.mjs", statusScript()],
  ["tests/mahavisphot-registry.test.mjs", testFile()],
]);

for (const [relativePath, contents] of files) {
  const target = path.join(root, relativePath);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, contents, "utf8");
}

console.log(`Generated Mahavisphot scaffold: ${pages.length} pages, ${apiEndpoints.length} API endpoints, ${tables.length} tables.`);
