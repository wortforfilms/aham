import type {
  MahavisphotCapabilityGate,
  MahavisphotFeatureStatus,
  MahavisphotPermission,
  MahavisphotPlan,
  MahavisphotRuntimeMode,
  MahavisphotSchemaEntity,
  MahavisphotSchemaRegistry,
} from "../types/mahavisphot-types";
import { MAHAVISPHOT_MODULES } from "./mahavisphot-modules.ts";

export const MAHAVISPHOT_SCHEMA_VERSION = "mahavisphot.schema.v1" as const;
export const MAHAVISPHOT_RUNTIME_MODES = [
  "local",
  "cloud",
  "hybrid"
] as const satisfies ReadonlyArray<MahavisphotRuntimeMode>;
export const MAHAVISPHOT_FEATURE_STATUSES = [
  "production",
  "preview",
  "scaffold",
  "planned",
  "blocked"
] as const satisfies ReadonlyArray<MahavisphotFeatureStatus>;
export const MAHAVISPHOT_PLANS = [
  "free",
  "trial",
  "pro",
  "studio",
  "enterprise"
] as const satisfies ReadonlyArray<MahavisphotPlan>;
export const MAHAVISPHOT_PERMISSIONS = [
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
export const MAHAVISPHOT_CAPABILITY_GATES = [
  {
    "id": "editor:access",
    "moduleId": "editor",
    "title": "Editor access",
    "status": "scaffold",
    "plans": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "permissions": [
      "project:read",
      "project:write",
      "media:read",
      "media:write",
      "timeline:read",
      "timeline:write"
    ],
    "evidenceRequired": false
  },
  {
    "id": "editor:write",
    "moduleId": "editor",
    "title": "Editor write controls",
    "status": "scaffold",
    "plans": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "permissions": [
      "project:write",
      "media:write",
      "timeline:write"
    ],
    "evidenceRequired": false
  },
  {
    "id": "editor:evidence",
    "moduleId": "editor",
    "title": "Editor evidence gate",
    "status": "scaffold",
    "plans": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "permissions": [
      "project:read"
    ],
    "evidenceRequired": true
  },
  {
    "id": "compositor:access",
    "moduleId": "compositor",
    "title": "Compositor access",
    "status": "scaffold",
    "plans": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "permissions": [
      "project:read",
      "project:write",
      "media:read",
      "media:write",
      "timeline:read",
      "timeline:write"
    ],
    "evidenceRequired": false
  },
  {
    "id": "compositor:write",
    "moduleId": "compositor",
    "title": "Compositor write controls",
    "status": "scaffold",
    "plans": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "permissions": [
      "project:write",
      "media:write",
      "timeline:write"
    ],
    "evidenceRequired": false
  },
  {
    "id": "compositor:evidence",
    "moduleId": "compositor",
    "title": "Compositor evidence gate",
    "status": "scaffold",
    "plans": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "permissions": [
      "project:read"
    ],
    "evidenceRequired": true
  },
  {
    "id": "vfx-studio:access",
    "moduleId": "vfx-studio",
    "title": "VFX Studio access",
    "status": "scaffold",
    "plans": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "permissions": [
      "project:read",
      "project:write",
      "media:read",
      "media:write",
      "timeline:read",
      "timeline:write"
    ],
    "evidenceRequired": false
  },
  {
    "id": "vfx-studio:write",
    "moduleId": "vfx-studio",
    "title": "VFX Studio write controls",
    "status": "scaffold",
    "plans": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "permissions": [
      "project:write",
      "media:write",
      "timeline:write"
    ],
    "evidenceRequired": false
  },
  {
    "id": "vfx-studio:evidence",
    "moduleId": "vfx-studio",
    "title": "VFX Studio evidence gate",
    "status": "scaffold",
    "plans": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "permissions": [
      "project:read"
    ],
    "evidenceRequired": true
  },
  {
    "id": "particle-studio:access",
    "moduleId": "particle-studio",
    "title": "Particle Studio access",
    "status": "scaffold",
    "plans": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "permissions": [
      "project:read",
      "project:write",
      "media:read",
      "media:write",
      "timeline:read",
      "timeline:write"
    ],
    "evidenceRequired": false
  },
  {
    "id": "particle-studio:write",
    "moduleId": "particle-studio",
    "title": "Particle Studio write controls",
    "status": "scaffold",
    "plans": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "permissions": [
      "project:write",
      "media:write",
      "timeline:write"
    ],
    "evidenceRequired": false
  },
  {
    "id": "particle-studio:evidence",
    "moduleId": "particle-studio",
    "title": "Particle Studio evidence gate",
    "status": "scaffold",
    "plans": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "permissions": [
      "project:read"
    ],
    "evidenceRequired": true
  },
  {
    "id": "digital-makeup-studio:access",
    "moduleId": "digital-makeup-studio",
    "title": "Digital Makeup Studio access",
    "status": "scaffold",
    "plans": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "permissions": [
      "project:read",
      "project:write",
      "media:read",
      "media:write",
      "timeline:read",
      "timeline:write"
    ],
    "evidenceRequired": false
  },
  {
    "id": "digital-makeup-studio:write",
    "moduleId": "digital-makeup-studio",
    "title": "Digital Makeup Studio write controls",
    "status": "scaffold",
    "plans": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "permissions": [
      "project:write",
      "media:write",
      "timeline:write"
    ],
    "evidenceRequired": false
  },
  {
    "id": "digital-makeup-studio:evidence",
    "moduleId": "digital-makeup-studio",
    "title": "Digital Makeup Studio evidence gate",
    "status": "scaffold",
    "plans": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "permissions": [
      "project:read"
    ],
    "evidenceRequired": true
  },
  {
    "id": "costume-studio:access",
    "moduleId": "costume-studio",
    "title": "Costume Studio access",
    "status": "scaffold",
    "plans": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "permissions": [
      "project:read",
      "project:write",
      "media:read",
      "media:write",
      "timeline:read",
      "timeline:write"
    ],
    "evidenceRequired": false
  },
  {
    "id": "costume-studio:write",
    "moduleId": "costume-studio",
    "title": "Costume Studio write controls",
    "status": "scaffold",
    "plans": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "permissions": [
      "project:write",
      "media:write",
      "timeline:write"
    ],
    "evidenceRequired": false
  },
  {
    "id": "costume-studio:evidence",
    "moduleId": "costume-studio",
    "title": "Costume Studio evidence gate",
    "status": "scaffold",
    "plans": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "permissions": [
      "project:read"
    ],
    "evidenceRequired": true
  },
  {
    "id": "props-studio:access",
    "moduleId": "props-studio",
    "title": "Props Studio access",
    "status": "scaffold",
    "plans": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "permissions": [
      "project:read",
      "project:write",
      "media:read",
      "media:write",
      "timeline:read",
      "timeline:write"
    ],
    "evidenceRequired": false
  },
  {
    "id": "props-studio:write",
    "moduleId": "props-studio",
    "title": "Props Studio write controls",
    "status": "scaffold",
    "plans": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "permissions": [
      "project:write",
      "media:write",
      "timeline:write"
    ],
    "evidenceRequired": false
  },
  {
    "id": "props-studio:evidence",
    "moduleId": "props-studio",
    "title": "Props Studio evidence gate",
    "status": "scaffold",
    "plans": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "permissions": [
      "project:read"
    ],
    "evidenceRequired": true
  },
  {
    "id": "toon-designer-studio:access",
    "moduleId": "toon-designer-studio",
    "title": "Toon Designer Studio access",
    "status": "scaffold",
    "plans": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "permissions": [
      "project:read",
      "project:write",
      "media:read",
      "media:write",
      "timeline:read",
      "timeline:write"
    ],
    "evidenceRequired": false
  },
  {
    "id": "toon-designer-studio:write",
    "moduleId": "toon-designer-studio",
    "title": "Toon Designer Studio write controls",
    "status": "scaffold",
    "plans": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "permissions": [
      "project:write",
      "media:write",
      "timeline:write"
    ],
    "evidenceRequired": false
  },
  {
    "id": "toon-designer-studio:evidence",
    "moduleId": "toon-designer-studio",
    "title": "Toon Designer Studio evidence gate",
    "status": "scaffold",
    "plans": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "permissions": [
      "project:read"
    ],
    "evidenceRequired": true
  },
  {
    "id": "cel-animation-studio:access",
    "moduleId": "cel-animation-studio",
    "title": "Cel Animation Studio access",
    "status": "scaffold",
    "plans": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "permissions": [
      "project:read",
      "project:write",
      "media:read",
      "media:write",
      "timeline:read",
      "timeline:write"
    ],
    "evidenceRequired": false
  },
  {
    "id": "cel-animation-studio:write",
    "moduleId": "cel-animation-studio",
    "title": "Cel Animation Studio write controls",
    "status": "scaffold",
    "plans": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "permissions": [
      "project:write",
      "media:write",
      "timeline:write"
    ],
    "evidenceRequired": false
  },
  {
    "id": "cel-animation-studio:evidence",
    "moduleId": "cel-animation-studio",
    "title": "Cel Animation Studio evidence gate",
    "status": "scaffold",
    "plans": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "permissions": [
      "project:read"
    ],
    "evidenceRequired": true
  },
  {
    "id": "comic-studio:access",
    "moduleId": "comic-studio",
    "title": "Comic Studio access",
    "status": "scaffold",
    "plans": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "permissions": [
      "project:read",
      "project:write",
      "media:read",
      "media:write",
      "timeline:read",
      "timeline:write"
    ],
    "evidenceRequired": false
  },
  {
    "id": "comic-studio:write",
    "moduleId": "comic-studio",
    "title": "Comic Studio write controls",
    "status": "scaffold",
    "plans": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "permissions": [
      "project:write",
      "media:write",
      "timeline:write"
    ],
    "evidenceRequired": false
  },
  {
    "id": "comic-studio:evidence",
    "moduleId": "comic-studio",
    "title": "Comic Studio evidence gate",
    "status": "scaffold",
    "plans": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "permissions": [
      "project:read"
    ],
    "evidenceRequired": true
  },
  {
    "id": "face-studio:access",
    "moduleId": "face-studio",
    "title": "Face Studio access",
    "status": "scaffold",
    "plans": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "permissions": [
      "project:read",
      "project:write",
      "media:read",
      "media:write",
      "timeline:read",
      "timeline:write"
    ],
    "evidenceRequired": false
  },
  {
    "id": "face-studio:write",
    "moduleId": "face-studio",
    "title": "Face Studio write controls",
    "status": "scaffold",
    "plans": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "permissions": [
      "project:write",
      "media:write",
      "timeline:write"
    ],
    "evidenceRequired": false
  },
  {
    "id": "face-studio:evidence",
    "moduleId": "face-studio",
    "title": "Face Studio evidence gate",
    "status": "scaffold",
    "plans": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "permissions": [
      "project:read"
    ],
    "evidenceRequired": true
  },
  {
    "id": "three-d-studio:access",
    "moduleId": "three-d-studio",
    "title": "3D Studio access",
    "status": "scaffold",
    "plans": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "permissions": [
      "project:read",
      "project:write",
      "media:read",
      "media:write",
      "timeline:read",
      "timeline:write"
    ],
    "evidenceRequired": false
  },
  {
    "id": "three-d-studio:write",
    "moduleId": "three-d-studio",
    "title": "3D Studio write controls",
    "status": "scaffold",
    "plans": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "permissions": [
      "project:write",
      "media:write",
      "timeline:write"
    ],
    "evidenceRequired": false
  },
  {
    "id": "three-d-studio:evidence",
    "moduleId": "three-d-studio",
    "title": "3D Studio evidence gate",
    "status": "scaffold",
    "plans": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "permissions": [
      "project:read"
    ],
    "evidenceRequired": true
  },
  {
    "id": "xr-studio:access",
    "moduleId": "xr-studio",
    "title": "XR Studio access",
    "status": "scaffold",
    "plans": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "permissions": [
      "project:read",
      "project:write",
      "media:read",
      "media:write",
      "timeline:read",
      "timeline:write"
    ],
    "evidenceRequired": false
  },
  {
    "id": "xr-studio:write",
    "moduleId": "xr-studio",
    "title": "XR Studio write controls",
    "status": "scaffold",
    "plans": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "permissions": [
      "project:write",
      "media:write",
      "timeline:write"
    ],
    "evidenceRequired": false
  },
  {
    "id": "xr-studio:evidence",
    "moduleId": "xr-studio",
    "title": "XR Studio evidence gate",
    "status": "scaffold",
    "plans": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "permissions": [
      "project:read"
    ],
    "evidenceRequired": true
  },
  {
    "id": "audio-studio:access",
    "moduleId": "audio-studio",
    "title": "Audio Studio access",
    "status": "scaffold",
    "plans": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "permissions": [
      "project:read",
      "project:write",
      "media:read",
      "media:write",
      "timeline:read",
      "timeline:write"
    ],
    "evidenceRequired": false
  },
  {
    "id": "audio-studio:write",
    "moduleId": "audio-studio",
    "title": "Audio Studio write controls",
    "status": "scaffold",
    "plans": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "permissions": [
      "project:write",
      "media:write",
      "timeline:write"
    ],
    "evidenceRequired": false
  },
  {
    "id": "audio-studio:evidence",
    "moduleId": "audio-studio",
    "title": "Audio Studio evidence gate",
    "status": "scaffold",
    "plans": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "permissions": [
      "project:read"
    ],
    "evidenceRequired": true
  },
  {
    "id": "color-studio:access",
    "moduleId": "color-studio",
    "title": "Color Studio access",
    "status": "scaffold",
    "plans": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "permissions": [
      "project:read",
      "project:write",
      "media:read",
      "media:write",
      "timeline:read",
      "timeline:write"
    ],
    "evidenceRequired": false
  },
  {
    "id": "color-studio:write",
    "moduleId": "color-studio",
    "title": "Color Studio write controls",
    "status": "scaffold",
    "plans": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "permissions": [
      "project:write",
      "media:write",
      "timeline:write"
    ],
    "evidenceRequired": false
  },
  {
    "id": "color-studio:evidence",
    "moduleId": "color-studio",
    "title": "Color Studio evidence gate",
    "status": "scaffold",
    "plans": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "permissions": [
      "project:read"
    ],
    "evidenceRequired": true
  },
  {
    "id": "render-center:access",
    "moduleId": "render-center",
    "title": "Render Center access",
    "status": "blocked",
    "plans": [
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "permissions": [
      "project:read",
      "media:read",
      "render:read",
      "render:write"
    ],
    "evidenceRequired": true
  },
  {
    "id": "render-center:write",
    "moduleId": "render-center",
    "title": "Render Center write controls",
    "status": "blocked",
    "plans": [
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "permissions": [
      "render:write"
    ],
    "evidenceRequired": true
  },
  {
    "id": "render-center:evidence",
    "moduleId": "render-center",
    "title": "Render Center evidence gate",
    "status": "blocked",
    "plans": [
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "permissions": [
      "project:read"
    ],
    "evidenceRequired": true
  },
  {
    "id": "export-center:access",
    "moduleId": "export-center",
    "title": "Export Center access",
    "status": "scaffold",
    "plans": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "permissions": [
      "project:read",
      "media:read",
      "render:read",
      "render:write"
    ],
    "evidenceRequired": false
  },
  {
    "id": "export-center:write",
    "moduleId": "export-center",
    "title": "Export Center write controls",
    "status": "scaffold",
    "plans": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "permissions": [
      "render:write"
    ],
    "evidenceRequired": false
  },
  {
    "id": "export-center:evidence",
    "moduleId": "export-center",
    "title": "Export Center evidence gate",
    "status": "scaffold",
    "plans": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "permissions": [
      "project:read"
    ],
    "evidenceRequired": true
  },
  {
    "id": "observatory:access",
    "moduleId": "observatory",
    "title": "Observatory access",
    "status": "scaffold",
    "plans": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "permissions": [
      "project:read",
      "project:write",
      "media:read",
      "media:write",
      "timeline:read",
      "timeline:write"
    ],
    "evidenceRequired": false
  },
  {
    "id": "observatory:write",
    "moduleId": "observatory",
    "title": "Observatory write controls",
    "status": "scaffold",
    "plans": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "permissions": [
      "project:write",
      "media:write",
      "timeline:write"
    ],
    "evidenceRequired": false
  },
  {
    "id": "observatory:evidence",
    "moduleId": "observatory",
    "title": "Observatory evidence gate",
    "status": "scaffold",
    "plans": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "permissions": [
      "project:read"
    ],
    "evidenceRequired": true
  },
  {
    "id": "local-ai-mode:access",
    "moduleId": "local-ai-mode",
    "title": "Local AI Mode access",
    "status": "blocked",
    "plans": [
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local"
    ],
    "permissions": [
      "project:read",
      "media:read",
      "ai:local"
    ],
    "evidenceRequired": true
  },
  {
    "id": "local-ai-mode:write",
    "moduleId": "local-ai-mode",
    "title": "Local AI Mode write controls",
    "status": "blocked",
    "plans": [
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local"
    ],
    "permissions": [
      "ai:local"
    ],
    "evidenceRequired": true
  },
  {
    "id": "local-ai-mode:evidence",
    "moduleId": "local-ai-mode",
    "title": "Local AI Mode evidence gate",
    "status": "blocked",
    "plans": [
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local"
    ],
    "permissions": [
      "project:read"
    ],
    "evidenceRequired": true
  },
  {
    "id": "cloud-ai-mode:access",
    "moduleId": "cloud-ai-mode",
    "title": "Cloud AI Mode access",
    "status": "blocked",
    "plans": [
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "cloud"
    ],
    "permissions": [
      "project:read",
      "media:read",
      "ai:cloud"
    ],
    "evidenceRequired": true
  },
  {
    "id": "cloud-ai-mode:write",
    "moduleId": "cloud-ai-mode",
    "title": "Cloud AI Mode write controls",
    "status": "blocked",
    "plans": [
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "cloud"
    ],
    "permissions": [
      "ai:cloud"
    ],
    "evidenceRequired": true
  },
  {
    "id": "cloud-ai-mode:evidence",
    "moduleId": "cloud-ai-mode",
    "title": "Cloud AI Mode evidence gate",
    "status": "blocked",
    "plans": [
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "cloud"
    ],
    "permissions": [
      "project:read"
    ],
    "evidenceRequired": true
  },
  {
    "id": "hybrid-ai-mode:access",
    "moduleId": "hybrid-ai-mode",
    "title": "Hybrid AI Mode access",
    "status": "blocked",
    "plans": [
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "hybrid",
      "local",
      "cloud"
    ],
    "permissions": [
      "project:read",
      "media:read",
      "ai:hybrid",
      "ai:local",
      "ai:cloud"
    ],
    "evidenceRequired": true
  },
  {
    "id": "hybrid-ai-mode:write",
    "moduleId": "hybrid-ai-mode",
    "title": "Hybrid AI Mode write controls",
    "status": "blocked",
    "plans": [
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "hybrid",
      "local",
      "cloud"
    ],
    "permissions": [
      "ai:hybrid",
      "ai:local",
      "ai:cloud"
    ],
    "evidenceRequired": true
  },
  {
    "id": "hybrid-ai-mode:evidence",
    "moduleId": "hybrid-ai-mode",
    "title": "Hybrid AI Mode evidence gate",
    "status": "blocked",
    "plans": [
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "hybrid",
      "local",
      "cloud"
    ],
    "permissions": [
      "project:read"
    ],
    "evidenceRequired": true
  },
  {
    "id": "admin:access",
    "moduleId": "admin",
    "title": "Admin access",
    "status": "planned",
    "plans": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "permissions": [
      "project:admin",
      "admin:read",
      "admin:write",
      "billing:read",
      "billing:write",
      "security:read"
    ],
    "evidenceRequired": false
  },
  {
    "id": "admin:write",
    "moduleId": "admin",
    "title": "Admin write controls",
    "status": "planned",
    "plans": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "permissions": [
      "admin:write",
      "billing:write"
    ],
    "evidenceRequired": false
  },
  {
    "id": "admin:evidence",
    "moduleId": "admin",
    "title": "Admin evidence gate",
    "status": "scaffold",
    "plans": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "permissions": [
      "project:read"
    ],
    "evidenceRequired": true
  },
  {
    "id": "support:access",
    "moduleId": "support",
    "title": "Support access",
    "status": "planned",
    "plans": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "permissions": [
      "support:read",
      "support:write",
      "project:read",
      "security:read"
    ],
    "evidenceRequired": false
  },
  {
    "id": "support:write",
    "moduleId": "support",
    "title": "Support write controls",
    "status": "planned",
    "plans": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "permissions": [
      "support:write"
    ],
    "evidenceRequired": false
  },
  {
    "id": "support:evidence",
    "moduleId": "support",
    "title": "Support evidence gate",
    "status": "scaffold",
    "plans": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "permissions": [
      "project:read"
    ],
    "evidenceRequired": true
  },
  {
    "id": "developer-platform:access",
    "moduleId": "developer-platform",
    "title": "Developer Platform access",
    "status": "planned",
    "plans": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "permissions": [
      "developer:read",
      "developer:write",
      "project:read"
    ],
    "evidenceRequired": false
  },
  {
    "id": "developer-platform:write",
    "moduleId": "developer-platform",
    "title": "Developer Platform write controls",
    "status": "planned",
    "plans": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "permissions": [
      "developer:write"
    ],
    "evidenceRequired": false
  },
  {
    "id": "developer-platform:evidence",
    "moduleId": "developer-platform",
    "title": "Developer Platform evidence gate",
    "status": "scaffold",
    "plans": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "permissions": [
      "project:read"
    ],
    "evidenceRequired": true
  },
  {
    "id": "security-recovery:access",
    "moduleId": "security-recovery",
    "title": "Security Recovery access",
    "status": "planned",
    "plans": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "permissions": [
      "security:read",
      "security:write",
      "project:admin"
    ],
    "evidenceRequired": false
  },
  {
    "id": "security-recovery:write",
    "moduleId": "security-recovery",
    "title": "Security Recovery write controls",
    "status": "planned",
    "plans": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "permissions": [
      "security:write"
    ],
    "evidenceRequired": false
  },
  {
    "id": "security-recovery:evidence",
    "moduleId": "security-recovery",
    "title": "Security Recovery evidence gate",
    "status": "scaffold",
    "plans": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "permissions": [
      "project:read"
    ],
    "evidenceRequired": true
  }
] as const satisfies ReadonlyArray<MahavisphotCapabilityGate>;
export const MAHAVISPHOT_SCHEMA_ENTITIES = [
  {
    "id": "mahavisphot.project",
    "name": "Mahavisphot Project",
    "kind": "project",
    "description": "Root project envelope for scenes, tracks, compositions, captions, VFX, audio, render, and evidence references.",
    "status": "scaffold",
    "schemaVersion": "mahavisphot.schema.v1",
    "fields": [
      "id",
      "name",
      "schemaVersion",
      "runtimeMode",
      "plan",
      "modules",
      "tracks",
      "compositions",
      "evidence"
    ]
  },
  {
    "id": "mahavisphot.runtime-mode",
    "name": "Runtime Mode",
    "kind": "runtime",
    "description": "Validated local, cloud, or hybrid AI runtime selection.",
    "status": "blocked",
    "schemaVersion": "mahavisphot.schema.v1",
    "fields": [
      "mode",
      "provider",
      "adapter",
      "evidenceReference",
      "health"
    ]
  },
  {
    "id": "mahavisphot.capability-gate",
    "name": "Capability Gate",
    "kind": "security",
    "description": "Plan, permission, runtime, and evidence policy for a studio capability.",
    "status": "scaffold",
    "schemaVersion": "mahavisphot.schema.v1",
    "fields": [
      "id",
      "moduleId",
      "plans",
      "permissions",
      "runtimeModes",
      "status",
      "evidenceRequired"
    ]
  },
  {
    "id": "mahavisphot.module.editor",
    "name": "Editor Entity",
    "kind": "module",
    "description": "Cinematic timeline editing, clip decisions, trims, markers, captions, and composition entry points.",
    "status": "scaffold",
    "schemaVersion": "mahavisphot.schema.v1",
    "fields": [
      "id",
      "moduleId",
      "status",
      "payload",
      "permissions",
      "planAvailability",
      "runtimeModes"
    ]
  },
  {
    "id": "mahavisphot.module.compositor",
    "name": "Compositor Entity",
    "kind": "module",
    "description": "Layered image, video, VFX, caption, alpha, and nested-composition assembly.",
    "status": "scaffold",
    "schemaVersion": "mahavisphot.schema.v1",
    "fields": [
      "id",
      "moduleId",
      "status",
      "payload",
      "permissions",
      "planAvailability",
      "runtimeModes"
    ]
  },
  {
    "id": "mahavisphot.module.vfx-studio",
    "name": "VFX Studio Entity",
    "kind": "module",
    "description": "Shot effect stacks, node passes, masks, mattes, glow, grain, and delivery-safe VFX planning.",
    "status": "scaffold",
    "schemaVersion": "mahavisphot.schema.v1",
    "fields": [
      "id",
      "moduleId",
      "status",
      "payload",
      "permissions",
      "planAvailability",
      "runtimeModes"
    ]
  },
  {
    "id": "mahavisphot.module.particle-studio",
    "name": "Particle Studio Entity",
    "kind": "module",
    "description": "GPU particle presets, fields, turbulence, ash, sparks, dust, embers, and atmosphere controls.",
    "status": "scaffold",
    "schemaVersion": "mahavisphot.schema.v1",
    "fields": [
      "id",
      "moduleId",
      "status",
      "payload",
      "permissions",
      "planAvailability",
      "runtimeModes"
    ]
  },
  {
    "id": "mahavisphot.module.digital-makeup-studio",
    "name": "Digital Makeup Studio Entity",
    "kind": "module",
    "description": "Face-safe beauty, prosthetic, continuity, cleanup, and stylized digital makeup planning.",
    "status": "scaffold",
    "schemaVersion": "mahavisphot.schema.v1",
    "fields": [
      "id",
      "moduleId",
      "status",
      "payload",
      "permissions",
      "planAvailability",
      "runtimeModes"
    ]
  },
  {
    "id": "mahavisphot.module.costume-studio",
    "name": "Costume Studio Entity",
    "kind": "module",
    "description": "Wardrobe continuity, fabric references, silhouette planning, palette, and scene costume state.",
    "status": "scaffold",
    "schemaVersion": "mahavisphot.schema.v1",
    "fields": [
      "id",
      "moduleId",
      "status",
      "payload",
      "permissions",
      "planAvailability",
      "runtimeModes"
    ]
  },
  {
    "id": "mahavisphot.module.props-studio",
    "name": "Props Studio Entity",
    "kind": "module",
    "description": "Hero prop registry, tracking, condition state, shot use, continuity, and fabrication notes.",
    "status": "scaffold",
    "schemaVersion": "mahavisphot.schema.v1",
    "fields": [
      "id",
      "moduleId",
      "status",
      "payload",
      "permissions",
      "planAvailability",
      "runtimeModes"
    ]
  },
  {
    "id": "mahavisphot.module.toon-designer-studio",
    "name": "Toon Designer Studio Entity",
    "kind": "module",
    "description": "Character model sheets, toon look controls, pose sets, expression banks, and style locks.",
    "status": "scaffold",
    "schemaVersion": "mahavisphot.schema.v1",
    "fields": [
      "id",
      "moduleId",
      "status",
      "payload",
      "permissions",
      "planAvailability",
      "runtimeModes"
    ]
  },
  {
    "id": "mahavisphot.module.cel-animation-studio",
    "name": "Cel Animation Studio Entity",
    "kind": "module",
    "description": "Frame drawings, exposure sheets, onion skin views, in-between queues, and cleanup passes.",
    "status": "scaffold",
    "schemaVersion": "mahavisphot.schema.v1",
    "fields": [
      "id",
      "moduleId",
      "status",
      "payload",
      "permissions",
      "planAvailability",
      "runtimeModes"
    ]
  },
  {
    "id": "mahavisphot.module.comic-studio",
    "name": "Comic Studio Entity",
    "kind": "module",
    "description": "Panel layouts, speech layers, lettering, gutters, boards, page turns, and print export planning.",
    "status": "scaffold",
    "schemaVersion": "mahavisphot.schema.v1",
    "fields": [
      "id",
      "moduleId",
      "status",
      "payload",
      "permissions",
      "planAvailability",
      "runtimeModes"
    ]
  },
  {
    "id": "mahavisphot.module.face-studio",
    "name": "Face Studio Entity",
    "kind": "module",
    "description": "Face topology, tracking references, replacement planning, landmarks, and actor continuity gates.",
    "status": "scaffold",
    "schemaVersion": "mahavisphot.schema.v1",
    "fields": [
      "id",
      "moduleId",
      "status",
      "payload",
      "permissions",
      "planAvailability",
      "runtimeModes"
    ]
  },
  {
    "id": "mahavisphot.module.three-d-studio",
    "name": "3D Studio Entity",
    "kind": "module",
    "description": "Scene graph, cameras, lights, meshes, transform gizmos, material previews, and spatial passes.",
    "status": "scaffold",
    "schemaVersion": "mahavisphot.schema.v1",
    "fields": [
      "id",
      "moduleId",
      "status",
      "payload",
      "permissions",
      "planAvailability",
      "runtimeModes"
    ]
  },
  {
    "id": "mahavisphot.module.xr-studio",
    "name": "XR Studio Entity",
    "kind": "module",
    "description": "Immersive review, headset-safe layout, spatial audio notes, and extended reality launch planning.",
    "status": "scaffold",
    "schemaVersion": "mahavisphot.schema.v1",
    "fields": [
      "id",
      "moduleId",
      "status",
      "payload",
      "permissions",
      "planAvailability",
      "runtimeModes"
    ]
  },
  {
    "id": "mahavisphot.module.audio-studio",
    "name": "Audio Studio Entity",
    "kind": "module",
    "description": "Dialogue, music, stems, rubab cues, loudness, waveform review, and broadcast-safe mix planning.",
    "status": "scaffold",
    "schemaVersion": "mahavisphot.schema.v1",
    "fields": [
      "id",
      "moduleId",
      "status",
      "payload",
      "permissions",
      "planAvailability",
      "runtimeModes"
    ]
  },
  {
    "id": "mahavisphot.module.color-studio",
    "name": "Color Studio Entity",
    "kind": "module",
    "description": "Look development, grade intent, LUT registry, scopes, shot matching, and delivery transforms.",
    "status": "scaffold",
    "schemaVersion": "mahavisphot.schema.v1",
    "fields": [
      "id",
      "moduleId",
      "status",
      "payload",
      "permissions",
      "planAvailability",
      "runtimeModes"
    ]
  },
  {
    "id": "mahavisphot.module.render-center",
    "name": "Render Center Entity",
    "kind": "module",
    "description": "Render job planning, hardware checks, queue state, media validation, and blocked runtime evidence.",
    "status": "blocked",
    "schemaVersion": "mahavisphot.schema.v1",
    "fields": [
      "id",
      "moduleId",
      "status",
      "payload",
      "permissions",
      "planAvailability",
      "runtimeModes"
    ]
  },
  {
    "id": "mahavisphot.module.export-center",
    "name": "Export Center Entity",
    "kind": "module",
    "description": "JSON, TSV, board PNG, MP4, captions, schemas, manifests, and final package planning.",
    "status": "scaffold",
    "schemaVersion": "mahavisphot.schema.v1",
    "fields": [
      "id",
      "moduleId",
      "status",
      "payload",
      "permissions",
      "planAvailability",
      "runtimeModes"
    ]
  },
  {
    "id": "mahavisphot.module.observatory",
    "name": "Observatory Entity",
    "kind": "module",
    "description": "Telemetry, health, scope monitors, logs, verification evidence, and readiness dashboards.",
    "status": "scaffold",
    "schemaVersion": "mahavisphot.schema.v1",
    "fields": [
      "id",
      "moduleId",
      "status",
      "payload",
      "permissions",
      "planAvailability",
      "runtimeModes"
    ]
  },
  {
    "id": "mahavisphot.module.local-ai-mode",
    "name": "Local AI Mode Entity",
    "kind": "module",
    "description": "On-device model selection, local inference constraints, privacy gates, and blocked runtime adapters.",
    "status": "blocked",
    "schemaVersion": "mahavisphot.schema.v1",
    "fields": [
      "id",
      "moduleId",
      "status",
      "payload",
      "permissions",
      "planAvailability",
      "runtimeModes"
    ]
  },
  {
    "id": "mahavisphot.module.cloud-ai-mode",
    "name": "Cloud AI Mode Entity",
    "kind": "module",
    "description": "Provider adapter planning, credentials gates, cloud policy, and blocked external execution.",
    "status": "blocked",
    "schemaVersion": "mahavisphot.schema.v1",
    "fields": [
      "id",
      "moduleId",
      "status",
      "payload",
      "permissions",
      "planAvailability",
      "runtimeModes"
    ]
  },
  {
    "id": "mahavisphot.module.hybrid-ai-mode",
    "name": "Hybrid AI Mode Entity",
    "kind": "module",
    "description": "Split local/cloud execution planning, fallback paths, synchronization, and review gates.",
    "status": "blocked",
    "schemaVersion": "mahavisphot.schema.v1",
    "fields": [
      "id",
      "moduleId",
      "status",
      "payload",
      "permissions",
      "planAvailability",
      "runtimeModes"
    ]
  },
  {
    "id": "mahavisphot.module.admin",
    "name": "Admin Entity",
    "kind": "module",
    "description": "Users, plans, license policy, audit trails, workspace controls, and protected operations.",
    "status": "planned",
    "schemaVersion": "mahavisphot.schema.v1",
    "fields": [
      "id",
      "moduleId",
      "status",
      "payload",
      "permissions",
      "planAvailability",
      "runtimeModes"
    ]
  },
  {
    "id": "mahavisphot.module.support",
    "name": "Support Entity",
    "kind": "module",
    "description": "Recovery guides, diagnostics packages, operator notes, issue intake, and support handoff.",
    "status": "planned",
    "schemaVersion": "mahavisphot.schema.v1",
    "fields": [
      "id",
      "moduleId",
      "status",
      "payload",
      "permissions",
      "planAvailability",
      "runtimeModes"
    ]
  },
  {
    "id": "mahavisphot.module.developer-platform",
    "name": "Developer Platform Entity",
    "kind": "module",
    "description": "Schema exports, API contracts, plugin surfaces, SDK planning, and integration keys.",
    "status": "planned",
    "schemaVersion": "mahavisphot.schema.v1",
    "fields": [
      "id",
      "moduleId",
      "status",
      "payload",
      "permissions",
      "planAvailability",
      "runtimeModes"
    ]
  },
  {
    "id": "mahavisphot.module.security-recovery",
    "name": "Security Recovery Entity",
    "kind": "module",
    "description": "Safe mode, session recovery, path policy, threat review, and incident response planning.",
    "status": "planned",
    "schemaVersion": "mahavisphot.schema.v1",
    "fields": [
      "id",
      "moduleId",
      "status",
      "payload",
      "permissions",
      "planAvailability",
      "runtimeModes"
    ]
  }
] as const satisfies ReadonlyArray<MahavisphotSchemaEntity>;

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
  counts: {
  "modules": 25,
  "pages": 400,
  "apiEndpoints": 150,
  "databaseTables": 75,
  "schemaEntities": 28
},
} as const satisfies MahavisphotSchemaRegistry;
