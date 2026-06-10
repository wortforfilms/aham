export type MahavisphotFeatureStatus = "production" | "preview" | "scaffold" | "planned" | "blocked";

export type MahavisphotRuntimeMode = "local" | "cloud" | "hybrid";

export type MahavisphotPlan = "free" | "trial" | "pro" | "studio" | "enterprise";

export type MahavisphotPermission =
  | "project:read"
  | "project:write"
  | "project:admin"
  | "media:read"
  | "media:write"
  | "timeline:read"
  | "timeline:write"
  | "render:read"
  | "render:write"
  | "ai:local"
  | "ai:cloud"
  | "ai:hybrid"
  | "admin:read"
  | "admin:write"
  | "support:read"
  | "support:write"
  | "developer:read"
  | "developer:write"
  | "security:read"
  | "security:write"
  | "billing:read"
  | "billing:write";

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
