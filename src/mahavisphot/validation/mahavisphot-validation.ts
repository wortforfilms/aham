import type {
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

export const VALID_MAHAVISPHOT_STATUSES = [
  "production",
  "preview",
  "scaffold",
  "planned",
  "blocked"
] as const satisfies ReadonlyArray<MahavisphotFeatureStatus>;
export const VALID_MAHAVISPHOT_RUNTIME_MODES = [
  "local",
  "cloud",
  "hybrid"
] as const satisfies ReadonlyArray<MahavisphotRuntimeMode>;
export const VALID_MAHAVISPHOT_PLANS = [
  "free",
  "trial",
  "pro",
  "studio",
  "enterprise"
] as const satisfies ReadonlyArray<MahavisphotPlan>;
export const VALID_MAHAVISPHOT_PERMISSIONS = [
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
  "billing:write"
] as const satisfies ReadonlyArray<MahavisphotPermission>;
export const VALID_MAHAVISPHOT_ENDPOINT_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"] as const satisfies ReadonlyArray<MahavisphotApiMethod>;

const pageIdPattern = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*(?:\.[a-z][a-z0-9]*(?:-[a-z0-9]+)*)$/;
const moduleIdPattern = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
const routePathPattern = /^\/mahavisphot(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)+$/;
const endpointPathPattern = /^\/api\/v1(?:\/(?:[a-z0-9]+(?:-[a-z0-9]+)*|\{[a-z][A-Za-z0-9]*\}))+$/;
const tableNamePattern = /^[a-z][a-z0-9]*(?:_[a-z0-9]+)*$/;
const schemaVersionPattern = /^mahavisphot\.schema\.v[0-9]+$/;

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
