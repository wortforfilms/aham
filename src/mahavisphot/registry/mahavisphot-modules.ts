import type { MahavisphotModule } from "../types/mahavisphot-types";

export const MAHAVISPHOT_MODULES = [
  {
    "id": "editor",
    "name": "Editor",
    "description": "Cinematic timeline editing, clip decisions, trims, markers, captions, and composition entry points.",
    "category": "production",
    "status": "scaffold",
    "routeBase": "/mahavisphot/editor",
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "planAvailability": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "permissions": [
      "project:read",
      "project:write",
      "media:read",
      "media:write",
      "timeline:read",
      "timeline:write"
    ],
    "capabilityGates": [
      "editor:access",
      "editor:write",
      "editor:evidence"
    ],
    "order": 1
  },
  {
    "id": "compositor",
    "name": "Compositor",
    "description": "Layered image, video, VFX, caption, alpha, and nested-composition assembly.",
    "category": "production",
    "status": "scaffold",
    "routeBase": "/mahavisphot/compositor",
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "planAvailability": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "permissions": [
      "project:read",
      "project:write",
      "media:read",
      "media:write",
      "timeline:read",
      "timeline:write"
    ],
    "capabilityGates": [
      "compositor:access",
      "compositor:write",
      "compositor:evidence"
    ],
    "order": 2
  },
  {
    "id": "vfx-studio",
    "name": "VFX Studio",
    "description": "Shot effect stacks, node passes, masks, mattes, glow, grain, and delivery-safe VFX planning.",
    "category": "visual",
    "status": "scaffold",
    "routeBase": "/mahavisphot/vfx-studio",
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "planAvailability": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "permissions": [
      "project:read",
      "project:write",
      "media:read",
      "media:write",
      "timeline:read",
      "timeline:write"
    ],
    "capabilityGates": [
      "vfx-studio:access",
      "vfx-studio:write",
      "vfx-studio:evidence"
    ],
    "order": 3
  },
  {
    "id": "particle-studio",
    "name": "Particle Studio",
    "description": "GPU particle presets, fields, turbulence, ash, sparks, dust, embers, and atmosphere controls.",
    "category": "visual",
    "status": "scaffold",
    "routeBase": "/mahavisphot/particle-studio",
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "planAvailability": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "permissions": [
      "project:read",
      "project:write",
      "media:read",
      "media:write",
      "timeline:read",
      "timeline:write"
    ],
    "capabilityGates": [
      "particle-studio:access",
      "particle-studio:write",
      "particle-studio:evidence"
    ],
    "order": 4
  },
  {
    "id": "digital-makeup-studio",
    "name": "Digital Makeup Studio",
    "description": "Face-safe beauty, prosthetic, continuity, cleanup, and stylized digital makeup planning.",
    "category": "character",
    "status": "scaffold",
    "routeBase": "/mahavisphot/digital-makeup-studio",
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "planAvailability": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "permissions": [
      "project:read",
      "project:write",
      "media:read",
      "media:write",
      "timeline:read",
      "timeline:write"
    ],
    "capabilityGates": [
      "digital-makeup-studio:access",
      "digital-makeup-studio:write",
      "digital-makeup-studio:evidence"
    ],
    "order": 5
  },
  {
    "id": "costume-studio",
    "name": "Costume Studio",
    "description": "Wardrobe continuity, fabric references, silhouette planning, palette, and scene costume state.",
    "category": "character",
    "status": "scaffold",
    "routeBase": "/mahavisphot/costume-studio",
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "planAvailability": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "permissions": [
      "project:read",
      "project:write",
      "media:read",
      "media:write",
      "timeline:read",
      "timeline:write"
    ],
    "capabilityGates": [
      "costume-studio:access",
      "costume-studio:write",
      "costume-studio:evidence"
    ],
    "order": 6
  },
  {
    "id": "props-studio",
    "name": "Props Studio",
    "description": "Hero prop registry, tracking, condition state, shot use, continuity, and fabrication notes.",
    "category": "character",
    "status": "scaffold",
    "routeBase": "/mahavisphot/props-studio",
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "planAvailability": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "permissions": [
      "project:read",
      "project:write",
      "media:read",
      "media:write",
      "timeline:read",
      "timeline:write"
    ],
    "capabilityGates": [
      "props-studio:access",
      "props-studio:write",
      "props-studio:evidence"
    ],
    "order": 7
  },
  {
    "id": "toon-designer-studio",
    "name": "Toon Designer Studio",
    "description": "Character model sheets, toon look controls, pose sets, expression banks, and style locks.",
    "category": "animation",
    "status": "scaffold",
    "routeBase": "/mahavisphot/toon-designer-studio",
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "planAvailability": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "permissions": [
      "project:read",
      "project:write",
      "media:read",
      "media:write",
      "timeline:read",
      "timeline:write"
    ],
    "capabilityGates": [
      "toon-designer-studio:access",
      "toon-designer-studio:write",
      "toon-designer-studio:evidence"
    ],
    "order": 8
  },
  {
    "id": "cel-animation-studio",
    "name": "Cel Animation Studio",
    "description": "Frame drawings, exposure sheets, onion skin views, in-between queues, and cleanup passes.",
    "category": "animation",
    "status": "scaffold",
    "routeBase": "/mahavisphot/cel-animation-studio",
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "planAvailability": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "permissions": [
      "project:read",
      "project:write",
      "media:read",
      "media:write",
      "timeline:read",
      "timeline:write"
    ],
    "capabilityGates": [
      "cel-animation-studio:access",
      "cel-animation-studio:write",
      "cel-animation-studio:evidence"
    ],
    "order": 9
  },
  {
    "id": "comic-studio",
    "name": "Comic Studio",
    "description": "Panel layouts, speech layers, lettering, gutters, boards, page turns, and print export planning.",
    "category": "animation",
    "status": "scaffold",
    "routeBase": "/mahavisphot/comic-studio",
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "planAvailability": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "permissions": [
      "project:read",
      "project:write",
      "media:read",
      "media:write",
      "timeline:read",
      "timeline:write"
    ],
    "capabilityGates": [
      "comic-studio:access",
      "comic-studio:write",
      "comic-studio:evidence"
    ],
    "order": 10
  },
  {
    "id": "face-studio",
    "name": "Face Studio",
    "description": "Face topology, tracking references, replacement planning, landmarks, and actor continuity gates.",
    "category": "character",
    "status": "scaffold",
    "routeBase": "/mahavisphot/face-studio",
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "planAvailability": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "permissions": [
      "project:read",
      "project:write",
      "media:read",
      "media:write",
      "timeline:read",
      "timeline:write"
    ],
    "capabilityGates": [
      "face-studio:access",
      "face-studio:write",
      "face-studio:evidence"
    ],
    "order": 11
  },
  {
    "id": "three-d-studio",
    "name": "3D Studio",
    "description": "Scene graph, cameras, lights, meshes, transform gizmos, material previews, and spatial passes.",
    "category": "spatial",
    "status": "scaffold",
    "routeBase": "/mahavisphot/three-d-studio",
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "planAvailability": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "permissions": [
      "project:read",
      "project:write",
      "media:read",
      "media:write",
      "timeline:read",
      "timeline:write"
    ],
    "capabilityGates": [
      "three-d-studio:access",
      "three-d-studio:write",
      "three-d-studio:evidence"
    ],
    "order": 12
  },
  {
    "id": "xr-studio",
    "name": "XR Studio",
    "description": "Immersive review, headset-safe layout, spatial audio notes, and extended reality launch planning.",
    "category": "spatial",
    "status": "scaffold",
    "routeBase": "/mahavisphot/xr-studio",
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "planAvailability": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "permissions": [
      "project:read",
      "project:write",
      "media:read",
      "media:write",
      "timeline:read",
      "timeline:write"
    ],
    "capabilityGates": [
      "xr-studio:access",
      "xr-studio:write",
      "xr-studio:evidence"
    ],
    "order": 13
  },
  {
    "id": "audio-studio",
    "name": "Audio Studio",
    "description": "Dialogue, music, stems, rubab cues, loudness, waveform review, and broadcast-safe mix planning.",
    "category": "audio",
    "status": "scaffold",
    "routeBase": "/mahavisphot/audio-studio",
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "planAvailability": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "permissions": [
      "project:read",
      "project:write",
      "media:read",
      "media:write",
      "timeline:read",
      "timeline:write"
    ],
    "capabilityGates": [
      "audio-studio:access",
      "audio-studio:write",
      "audio-studio:evidence"
    ],
    "order": 14
  },
  {
    "id": "color-studio",
    "name": "Color Studio",
    "description": "Look development, grade intent, LUT registry, scopes, shot matching, and delivery transforms.",
    "category": "visual",
    "status": "scaffold",
    "routeBase": "/mahavisphot/color-studio",
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "planAvailability": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "permissions": [
      "project:read",
      "project:write",
      "media:read",
      "media:write",
      "timeline:read",
      "timeline:write"
    ],
    "capabilityGates": [
      "color-studio:access",
      "color-studio:write",
      "color-studio:evidence"
    ],
    "order": 15
  },
  {
    "id": "render-center",
    "name": "Render Center",
    "description": "Render job planning, hardware checks, queue state, media validation, and blocked runtime evidence.",
    "category": "delivery",
    "status": "blocked",
    "routeBase": "/mahavisphot/render-center",
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "planAvailability": [
      "pro",
      "studio",
      "enterprise"
    ],
    "permissions": [
      "project:read",
      "media:read",
      "render:read",
      "render:write"
    ],
    "capabilityGates": [
      "render-center:access",
      "render-center:write",
      "render-center:evidence"
    ],
    "order": 16
  },
  {
    "id": "export-center",
    "name": "Export Center",
    "description": "JSON, TSV, board PNG, MP4, captions, schemas, manifests, and final package planning.",
    "category": "delivery",
    "status": "scaffold",
    "routeBase": "/mahavisphot/export-center",
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "planAvailability": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "permissions": [
      "project:read",
      "media:read",
      "render:read",
      "render:write"
    ],
    "capabilityGates": [
      "export-center:access",
      "export-center:write",
      "export-center:evidence"
    ],
    "order": 17
  },
  {
    "id": "observatory",
    "name": "Observatory",
    "description": "Telemetry, health, scope monitors, logs, verification evidence, and readiness dashboards.",
    "category": "operations",
    "status": "scaffold",
    "routeBase": "/mahavisphot/observatory",
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "planAvailability": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "permissions": [
      "project:read",
      "project:write",
      "media:read",
      "media:write",
      "timeline:read",
      "timeline:write"
    ],
    "capabilityGates": [
      "observatory:access",
      "observatory:write",
      "observatory:evidence"
    ],
    "order": 18
  },
  {
    "id": "local-ai-mode",
    "name": "Local AI Mode",
    "description": "On-device model selection, local inference constraints, privacy gates, and blocked runtime adapters.",
    "category": "ai",
    "status": "blocked",
    "routeBase": "/mahavisphot/local-ai-mode",
    "runtimeModes": [
      "local"
    ],
    "planAvailability": [
      "pro",
      "studio",
      "enterprise"
    ],
    "permissions": [
      "project:read",
      "media:read",
      "ai:local"
    ],
    "capabilityGates": [
      "local-ai-mode:access",
      "local-ai-mode:write",
      "local-ai-mode:evidence"
    ],
    "order": 19
  },
  {
    "id": "cloud-ai-mode",
    "name": "Cloud AI Mode",
    "description": "Provider adapter planning, credentials gates, cloud policy, and blocked external execution.",
    "category": "ai",
    "status": "blocked",
    "routeBase": "/mahavisphot/cloud-ai-mode",
    "runtimeModes": [
      "cloud"
    ],
    "planAvailability": [
      "pro",
      "studio",
      "enterprise"
    ],
    "permissions": [
      "project:read",
      "media:read",
      "ai:cloud"
    ],
    "capabilityGates": [
      "cloud-ai-mode:access",
      "cloud-ai-mode:write",
      "cloud-ai-mode:evidence"
    ],
    "order": 20
  },
  {
    "id": "hybrid-ai-mode",
    "name": "Hybrid AI Mode",
    "description": "Split local/cloud execution planning, fallback paths, synchronization, and review gates.",
    "category": "ai",
    "status": "blocked",
    "routeBase": "/mahavisphot/hybrid-ai-mode",
    "runtimeModes": [
      "hybrid",
      "local",
      "cloud"
    ],
    "planAvailability": [
      "pro",
      "studio",
      "enterprise"
    ],
    "permissions": [
      "project:read",
      "media:read",
      "ai:hybrid",
      "ai:local",
      "ai:cloud"
    ],
    "capabilityGates": [
      "hybrid-ai-mode:access",
      "hybrid-ai-mode:write",
      "hybrid-ai-mode:evidence"
    ],
    "order": 21
  },
  {
    "id": "admin",
    "name": "Admin",
    "description": "Users, plans, license policy, audit trails, workspace controls, and protected operations.",
    "category": "operations",
    "status": "planned",
    "routeBase": "/mahavisphot/admin",
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "planAvailability": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "permissions": [
      "project:admin",
      "admin:read",
      "admin:write",
      "billing:read",
      "billing:write",
      "security:read"
    ],
    "capabilityGates": [
      "admin:access",
      "admin:write",
      "admin:evidence"
    ],
    "order": 22
  },
  {
    "id": "support",
    "name": "Support",
    "description": "Recovery guides, diagnostics packages, operator notes, issue intake, and support handoff.",
    "category": "operations",
    "status": "planned",
    "routeBase": "/mahavisphot/support",
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "planAvailability": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "permissions": [
      "support:read",
      "support:write",
      "project:read",
      "security:read"
    ],
    "capabilityGates": [
      "support:access",
      "support:write",
      "support:evidence"
    ],
    "order": 23
  },
  {
    "id": "developer-platform",
    "name": "Developer Platform",
    "description": "Schema exports, API contracts, plugin surfaces, SDK planning, and integration keys.",
    "category": "operations",
    "status": "planned",
    "routeBase": "/mahavisphot/developer-platform",
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "planAvailability": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "permissions": [
      "developer:read",
      "developer:write",
      "project:read"
    ],
    "capabilityGates": [
      "developer-platform:access",
      "developer-platform:write",
      "developer-platform:evidence"
    ],
    "order": 24
  },
  {
    "id": "security-recovery",
    "name": "Security Recovery",
    "description": "Safe mode, session recovery, path policy, threat review, and incident response planning.",
    "category": "operations",
    "status": "planned",
    "routeBase": "/mahavisphot/security-recovery",
    "runtimeModes": [
      "local",
      "cloud",
      "hybrid"
    ],
    "planAvailability": [
      "free",
      "trial",
      "pro",
      "studio",
      "enterprise"
    ],
    "permissions": [
      "security:read",
      "security:write",
      "project:admin"
    ],
    "capabilityGates": [
      "security-recovery:access",
      "security-recovery:write",
      "security-recovery:evidence"
    ],
    "order": 25
  }
] as const satisfies ReadonlyArray<MahavisphotModule>;
