window.MAHAVISPHOT_STUDIO_SCAFFOLDS = {
  "generatedAt": "2026-06-10T00:00:00.000Z",
  "schemaVersion": "mahavisphot.schema.v1",
  "productionReady": false,
  "phkdVerdict": "SCAFFOLDS_VISIBLE_RUNTIME_STILL_BLOCKED",
  "counts": {
    "modules": 25,
    "uxSurfaces": 400,
    "apiEndpoints": 150,
    "databaseTables": 75,
    "runtimeModes": 3,
    "workflows": 27,
    "crudSurfaces": 33
  },
  "runtimeModes": [
    {
      "id": "local",
      "title": "Local AI Runtime",
      "status": "blocked",
      "scope": "On-device model inventory, local inference adapter, hardware profile, privacy boundary, and deterministic inference tests.",
      "evidenceRequired": [
        "Local model runtime adapter",
        "Hardware capability profile",
        "Validated media input bridge",
        "Deterministic local inference test"
      ],
      "workflows": [
        "runtime-health",
        "model-inventory",
        "local-inference",
        "privacy-review",
        "evidence-capture"
      ],
      "crudSurfaces": [
        "runtime-profile",
        "ai-model",
        "model-cache",
        "evidence-artifact"
      ]
    },
    {
      "id": "cloud",
      "title": "Cloud AI Runtime",
      "status": "blocked",
      "scope": "Provider adapters, credential gates, job routing, cloud policy, audit logs, and cost controls.",
      "evidenceRequired": [
        "Provider credential adapter",
        "Signed job request schema",
        "Cloud execution proof",
        "Audit and billing evidence"
      ],
      "workflows": [
        "credential-check",
        "cloud-job-route",
        "cloud-render-handoff",
        "cost-policy",
        "evidence-capture"
      ],
      "crudSurfaces": [
        "provider-account",
        "cloud-job",
        "runtime-profile",
        "evidence-artifact"
      ]
    },
    {
      "id": "hybrid",
      "title": "Hybrid AI Runtime",
      "status": "blocked",
      "scope": "Local/cloud split execution, fallback routing, privacy tiers, synchronization, and recovery controls.",
      "evidenceRequired": [
        "Hybrid orchestration adapter",
        "Fallback execution test",
        "Privacy tier enforcement",
        "Cross-runtime synchronization proof"
      ],
      "workflows": [
        "hybrid-planner",
        "fallback-route",
        "privacy-tier",
        "sync-check",
        "evidence-capture"
      ],
      "crudSurfaces": [
        "runtime-profile",
        "hybrid-plan",
        "cloud-job",
        "ai-model",
        "evidence-artifact"
      ]
    }
  ],
  "workflows": [
    {
      "id": "project-lifecycle",
      "title": "Project Lifecycle",
      "group": "create-open-save-duplicate-delete",
      "status": "verified",
      "description": "Project creation, open, save, duplicate, delete, and local session ownership.",
      "order": 1
    },
    {
      "id": "auth-session-license",
      "title": "Auth Session License",
      "group": "identity",
      "status": "verified",
      "description": "Local user, session, license, and plan state with schema validation.",
      "order": 2
    },
    {
      "id": "subscription-plan",
      "title": "Subscription Plan",
      "group": "billing",
      "status": "verified",
      "description": "Plan states free, trial, pro, studio, and enterprise surfaced without payment claims.",
      "order": 3
    },
    {
      "id": "asset-ingestion",
      "title": "Asset Ingestion",
      "group": "media",
      "status": "scaffold",
      "description": "Safe media-only asset import, validation, references, and frame lineage.",
      "order": 4
    },
    {
      "id": "reference-frame-extraction",
      "title": "Reference Frame Extraction",
      "group": "media",
      "status": "verified",
      "description": "Deterministic extraction of visible UI/reference frames with manifest and evidence.",
      "order": 5
    },
    {
      "id": "storyboard-build",
      "title": "Storyboard Build",
      "group": "story",
      "status": "scaffold",
      "description": "Storyline, boards, captions, frame notes, and shot structure.",
      "order": 6
    },
    {
      "id": "timeline-edit",
      "title": "Timeline Edit",
      "group": "editorial",
      "status": "preview",
      "description": "Dynamic tracks, clips, markers, ripple/cascade/static delete controls, and layer CRUD.",
      "order": 7
    },
    {
      "id": "composition-nesting",
      "title": "Composition Nesting",
      "group": "editorial",
      "status": "scaffold",
      "description": "Single or multiple clips grouped into compositions that open as nested timelines.",
      "order": 8
    },
    {
      "id": "video-layer-routing",
      "title": "Video Layer Routing",
      "group": "editorial",
      "status": "preview",
      "description": "Scene plates, overlays, VFX buses, captions, picture-in-picture, and track visibility.",
      "order": 9
    },
    {
      "id": "audio-layer-routing",
      "title": "Audio Layer Routing",
      "group": "audio",
      "status": "preview",
      "description": "Music, rubab, voice, foley, master audio, meters, and stem-focused widgets.",
      "order": 10
    },
    {
      "id": "vfx-node-routing",
      "title": "VFX Node Routing",
      "group": "vfx",
      "status": "scaffold",
      "description": "Node graph, color pass, texture fixture, multi-pass grain, glow, and composite output.",
      "order": 11
    },
    {
      "id": "particle-field-design",
      "title": "Particle Field Design",
      "group": "vfx",
      "status": "preview",
      "description": "Preset gallery, vector fields, wind, turbulence, particle sizing, and preview state.",
      "order": 12
    },
    {
      "id": "motion-tracking",
      "title": "Motion Tracking",
      "group": "tracking",
      "status": "blocked",
      "description": "Markerless skeletal tracking remains blocked until model runtime evidence.",
      "order": 13
    },
    {
      "id": "face-makeup-review",
      "title": "Face Makeup Review",
      "group": "character",
      "status": "blocked",
      "description": "Face topology, depth swapping, digital makeup, and protected evidence gates.",
      "order": 14
    },
    {
      "id": "costume-prop-continuity",
      "title": "Costume Prop Continuity",
      "group": "character",
      "status": "planned",
      "description": "Costume sheets, prop sheets, continuity state, and shot use metadata.",
      "order": 15
    },
    {
      "id": "toon-cel-comic",
      "title": "Toon Cel Comic",
      "group": "animation",
      "status": "planned",
      "description": "Toon designer, cel animation, comic boards, exposure sheets, and page panels.",
      "order": 16
    },
    {
      "id": "three-d-scene",
      "title": "3D Scene",
      "group": "spatial",
      "status": "scaffold",
      "description": "Scene graph, transforms, shader editor, UV editor, mesh and camera planning.",
      "order": 17
    },
    {
      "id": "xr-review",
      "title": "XR Review",
      "group": "spatial",
      "status": "planned",
      "description": "Spatial preview, headset-safe layout, review camera, and accessibility overlays.",
      "order": 18
    },
    {
      "id": "audio-mix",
      "title": "Audio Mix",
      "group": "audio",
      "status": "preview",
      "description": "Mixer, track inserts, loudness target, spectrogram, and broadcast-safe review.",
      "order": 19
    },
    {
      "id": "color-grade",
      "title": "Color Grade",
      "group": "color",
      "status": "preview",
      "description": "Waveform, vector, grade gallery, exposure controls, and shot match intent.",
      "order": 20
    },
    {
      "id": "render-queue",
      "title": "Render Queue",
      "group": "delivery",
      "status": "scaffold",
      "description": "Queue rows, progress state, cache planning, and blocked UHD renderer gate.",
      "order": 21
    },
    {
      "id": "export-package",
      "title": "Export Package",
      "group": "delivery",
      "status": "blocked",
      "description": "Full parity export remains blocked until renderer integration proves schema parity.",
      "order": 22
    },
    {
      "id": "observatory-evidence",
      "title": "Observatory Evidence",
      "group": "operations",
      "status": "scaffold",
      "description": "Runtime evidence, telemetry, blockers, GPU/memory scopes, and readiness state.",
      "order": 23
    },
    {
      "id": "admin-ops",
      "title": "Admin Ops",
      "group": "operations",
      "status": "planned",
      "description": "Users, plans, licenses, workspaces, policy state, and audit trails.",
      "order": 24
    },
    {
      "id": "support-recovery",
      "title": "Support Recovery",
      "group": "operations",
      "status": "planned",
      "description": "Support ticket, recovery mode, diagnostics package, and issue handoff.",
      "order": 25
    },
    {
      "id": "developer-platform",
      "title": "Developer Platform",
      "group": "developer",
      "status": "scaffold",
      "description": "Typed registries, API contracts, database map, routes, and extension surfaces.",
      "order": 26
    },
    {
      "id": "security-hardening",
      "title": "Security Hardening",
      "group": "security",
      "status": "planned",
      "description": "Path policies, auth boundaries, threat review, and release gate hardening.",
      "order": 27
    }
  ],
  "crudSurfaces": [
    {
      "id": "user",
      "title": "User",
      "operations": [
        "create",
        "read",
        "update",
        "delete"
      ],
      "status": "verified",
      "permissions": [
        "project:admin",
        "admin:read"
      ],
      "order": 1
    },
    {
      "id": "session",
      "title": "Session",
      "operations": [
        "create",
        "read",
        "delete"
      ],
      "status": "verified",
      "permissions": [
        "project:read"
      ],
      "order": 2
    },
    {
      "id": "license",
      "title": "License",
      "operations": [
        "create",
        "read",
        "update"
      ],
      "status": "verified",
      "permissions": [
        "billing:read",
        "billing:write"
      ],
      "order": 3
    },
    {
      "id": "subscription",
      "title": "Subscription",
      "operations": [
        "read",
        "update"
      ],
      "status": "verified",
      "permissions": [
        "billing:read",
        "billing:write"
      ],
      "order": 4
    },
    {
      "id": "project",
      "title": "Project",
      "operations": [
        "create",
        "list",
        "open",
        "save",
        "duplicate",
        "delete"
      ],
      "status": "verified",
      "permissions": [
        "project:read",
        "project:write"
      ],
      "order": 5
    },
    {
      "id": "template",
      "title": "Template",
      "operations": [
        "create",
        "read",
        "update",
        "delete",
        "apply"
      ],
      "status": "scaffold",
      "permissions": [
        "project:read",
        "project:write"
      ],
      "order": 6
    },
    {
      "id": "scene",
      "title": "Scene",
      "operations": [
        "create",
        "read",
        "update",
        "delete",
        "reorder"
      ],
      "status": "scaffold",
      "permissions": [
        "timeline:read",
        "timeline:write"
      ],
      "order": 7
    },
    {
      "id": "shot",
      "title": "Shot",
      "operations": [
        "create",
        "read",
        "update",
        "delete",
        "duplicate"
      ],
      "status": "scaffold",
      "permissions": [
        "timeline:read",
        "timeline:write"
      ],
      "order": 8
    },
    {
      "id": "asset",
      "title": "Asset",
      "operations": [
        "create",
        "read",
        "update",
        "delete",
        "ingest"
      ],
      "status": "scaffold",
      "permissions": [
        "media:read",
        "media:write"
      ],
      "order": 9
    },
    {
      "id": "media-file",
      "title": "Media File",
      "operations": [
        "read",
        "ingest",
        "validate",
        "delete"
      ],
      "status": "scaffold",
      "permissions": [
        "media:read",
        "media:write"
      ],
      "order": 10
    },
    {
      "id": "timeline",
      "title": "Timeline",
      "operations": [
        "create",
        "read",
        "update",
        "delete",
        "open"
      ],
      "status": "preview",
      "permissions": [
        "timeline:read",
        "timeline:write"
      ],
      "order": 11
    },
    {
      "id": "track",
      "title": "Track",
      "operations": [
        "create",
        "read",
        "update",
        "delete",
        "reorder"
      ],
      "status": "preview",
      "permissions": [
        "timeline:read",
        "timeline:write"
      ],
      "order": 12
    },
    {
      "id": "clip",
      "title": "Clip",
      "operations": [
        "create",
        "read",
        "update",
        "delete",
        "trim",
        "group"
      ],
      "status": "preview",
      "permissions": [
        "timeline:read",
        "timeline:write"
      ],
      "order": 13
    },
    {
      "id": "composition",
      "title": "Composition",
      "operations": [
        "create",
        "read",
        "update",
        "delete",
        "open"
      ],
      "status": "scaffold",
      "permissions": [
        "timeline:read",
        "timeline:write"
      ],
      "order": 14
    },
    {
      "id": "marker",
      "title": "Marker",
      "operations": [
        "create",
        "read",
        "update",
        "delete",
        "drag"
      ],
      "status": "preview",
      "permissions": [
        "timeline:read",
        "timeline:write"
      ],
      "order": 15
    },
    {
      "id": "caption",
      "title": "Caption",
      "operations": [
        "create",
        "read",
        "update",
        "delete",
        "export"
      ],
      "status": "scaffold",
      "permissions": [
        "timeline:read",
        "timeline:write"
      ],
      "order": 16
    },
    {
      "id": "note",
      "title": "Note",
      "operations": [
        "create",
        "read",
        "update",
        "delete"
      ],
      "status": "preview",
      "permissions": [
        "project:read",
        "project:write"
      ],
      "order": 17
    },
    {
      "id": "vfx-node",
      "title": "VFX Node",
      "operations": [
        "create",
        "read",
        "update",
        "delete",
        "connect"
      ],
      "status": "scaffold",
      "permissions": [
        "timeline:read",
        "timeline:write"
      ],
      "order": 18
    },
    {
      "id": "particle-preset",
      "title": "Particle Preset",
      "operations": [
        "create",
        "read",
        "update",
        "delete",
        "apply"
      ],
      "status": "preview",
      "permissions": [
        "timeline:read",
        "timeline:write"
      ],
      "order": 19
    },
    {
      "id": "face-track",
      "title": "Face Track",
      "operations": [
        "create",
        "read",
        "update",
        "delete"
      ],
      "status": "blocked",
      "permissions": [
        "ai:local",
        "ai:cloud"
      ],
      "order": 20
    },
    {
      "id": "makeup-pass",
      "title": "Makeup Pass",
      "operations": [
        "create",
        "read",
        "update",
        "delete"
      ],
      "status": "blocked",
      "permissions": [
        "ai:local",
        "ai:cloud"
      ],
      "order": 21
    },
    {
      "id": "costume-sheet",
      "title": "Costume Sheet",
      "operations": [
        "create",
        "read",
        "update",
        "delete"
      ],
      "status": "planned",
      "permissions": [
        "project:read",
        "project:write"
      ],
      "order": 22
    },
    {
      "id": "prop-sheet",
      "title": "Prop Sheet",
      "operations": [
        "create",
        "read",
        "update",
        "delete"
      ],
      "status": "planned",
      "permissions": [
        "project:read",
        "project:write"
      ],
      "order": 23
    },
    {
      "id": "scene-graph",
      "title": "Scene Graph",
      "operations": [
        "create",
        "read",
        "update",
        "delete",
        "toggle"
      ],
      "status": "scaffold",
      "permissions": [
        "timeline:read",
        "timeline:write"
      ],
      "order": 24
    },
    {
      "id": "audio-stem",
      "title": "Audio Stem",
      "operations": [
        "create",
        "read",
        "update",
        "delete",
        "route"
      ],
      "status": "preview",
      "permissions": [
        "media:read",
        "media:write"
      ],
      "order": 25
    },
    {
      "id": "color-grade",
      "title": "Color Grade",
      "operations": [
        "create",
        "read",
        "update",
        "delete",
        "apply"
      ],
      "status": "preview",
      "permissions": [
        "timeline:read",
        "timeline:write"
      ],
      "order": 26
    },
    {
      "id": "render-job",
      "title": "Render Job",
      "operations": [
        "create",
        "read",
        "update",
        "delete",
        "retry"
      ],
      "status": "scaffold",
      "permissions": [
        "render:read",
        "render:write"
      ],
      "order": 27
    },
    {
      "id": "export-package",
      "title": "Export Package",
      "operations": [
        "create",
        "read",
        "delete",
        "download"
      ],
      "status": "blocked",
      "permissions": [
        "render:read",
        "render:write"
      ],
      "order": 28
    },
    {
      "id": "runtime-profile",
      "title": "Runtime Profile",
      "operations": [
        "create",
        "read",
        "update",
        "delete"
      ],
      "status": "blocked",
      "permissions": [
        "security:read",
        "security:write"
      ],
      "order": 29
    },
    {
      "id": "ai-model",
      "title": "AI Model",
      "operations": [
        "read",
        "register",
        "validate",
        "delete"
      ],
      "status": "blocked",
      "permissions": [
        "ai:local",
        "ai:cloud",
        "ai:hybrid"
      ],
      "order": 30
    },
    {
      "id": "evidence-artifact",
      "title": "Evidence Artifact",
      "operations": [
        "create",
        "read",
        "update",
        "delete"
      ],
      "status": "scaffold",
      "permissions": [
        "project:read",
        "security:read"
      ],
      "order": 31
    },
    {
      "id": "support-ticket",
      "title": "Support Ticket",
      "operations": [
        "create",
        "read",
        "update",
        "delete"
      ],
      "status": "planned",
      "permissions": [
        "support:read",
        "support:write"
      ],
      "order": 32
    },
    {
      "id": "security-policy",
      "title": "Security Policy",
      "operations": [
        "read",
        "update",
        "audit"
      ],
      "status": "planned",
      "permissions": [
        "security:read",
        "security:write"
      ],
      "order": 33
    }
  ],
  "uxSurfaces": [
    {
      "id": "editor.overview",
      "title": "Editor Overview",
      "route": "/mahavisphot/editor/overview",
      "moduleId": "editor",
      "group": "command map",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1
    },
    {
      "id": "editor.launch",
      "title": "Editor Launch",
      "route": "/mahavisphot/editor/launch",
      "moduleId": "editor",
      "group": "project launch",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2
    },
    {
      "id": "editor.ingest",
      "title": "Editor Ingest",
      "route": "/mahavisphot/editor/ingest",
      "moduleId": "editor",
      "group": "media intake",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 3
    },
    {
      "id": "editor.storyboard",
      "title": "Editor Storyboard",
      "route": "/mahavisphot/editor/storyboard",
      "moduleId": "editor",
      "group": "story planning",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 4
    },
    {
      "id": "editor.timeline",
      "title": "Editor Timeline",
      "route": "/mahavisphot/editor/timeline",
      "moduleId": "editor",
      "group": "timeline",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 5
    },
    {
      "id": "editor.layers",
      "title": "Editor Layers",
      "route": "/mahavisphot/editor/layers",
      "moduleId": "editor",
      "group": "layer control",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 6
    },
    {
      "id": "editor.inspector",
      "title": "Editor Inspector",
      "route": "/mahavisphot/editor/inspector",
      "moduleId": "editor",
      "group": "inspection",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 7
    },
    {
      "id": "editor.node-graph",
      "title": "Editor Node Graph",
      "route": "/mahavisphot/editor/node-graph",
      "moduleId": "editor",
      "group": "node workspace",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 8
    },
    {
      "id": "editor.automation",
      "title": "Editor Automation",
      "route": "/mahavisphot/editor/automation",
      "moduleId": "editor",
      "group": "automation",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 9
    },
    {
      "id": "editor.review",
      "title": "Editor Review",
      "route": "/mahavisphot/editor/review",
      "moduleId": "editor",
      "group": "review",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 10
    },
    {
      "id": "editor.collaboration",
      "title": "Editor Collaboration",
      "route": "/mahavisphot/editor/collaboration",
      "moduleId": "editor",
      "group": "collaboration",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 11
    },
    {
      "id": "editor.settings",
      "title": "Editor Settings",
      "route": "/mahavisphot/editor/settings",
      "moduleId": "editor",
      "group": "settings",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 12
    },
    {
      "id": "editor.health",
      "title": "Editor Health",
      "route": "/mahavisphot/editor/health",
      "moduleId": "editor",
      "group": "runtime health",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 13
    },
    {
      "id": "editor.evidence",
      "title": "Editor Evidence",
      "route": "/mahavisphot/editor/evidence",
      "moduleId": "editor",
      "group": "evidence",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 14
    },
    {
      "id": "editor.export",
      "title": "Editor Export",
      "route": "/mahavisphot/editor/export",
      "moduleId": "editor",
      "group": "delivery",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 15
    },
    {
      "id": "editor.audit",
      "title": "Editor Audit",
      "route": "/mahavisphot/editor/audit",
      "moduleId": "editor",
      "group": "audit",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 16
    },
    {
      "id": "compositor.overview",
      "title": "Compositor Overview",
      "route": "/mahavisphot/compositor/overview",
      "moduleId": "compositor",
      "group": "command map",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 101
    },
    {
      "id": "compositor.launch",
      "title": "Compositor Launch",
      "route": "/mahavisphot/compositor/launch",
      "moduleId": "compositor",
      "group": "project launch",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 102
    },
    {
      "id": "compositor.ingest",
      "title": "Compositor Ingest",
      "route": "/mahavisphot/compositor/ingest",
      "moduleId": "compositor",
      "group": "media intake",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 103
    },
    {
      "id": "compositor.storyboard",
      "title": "Compositor Storyboard",
      "route": "/mahavisphot/compositor/storyboard",
      "moduleId": "compositor",
      "group": "story planning",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 104
    },
    {
      "id": "compositor.timeline",
      "title": "Compositor Timeline",
      "route": "/mahavisphot/compositor/timeline",
      "moduleId": "compositor",
      "group": "timeline",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 105
    },
    {
      "id": "compositor.layers",
      "title": "Compositor Layers",
      "route": "/mahavisphot/compositor/layers",
      "moduleId": "compositor",
      "group": "layer control",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 106
    },
    {
      "id": "compositor.inspector",
      "title": "Compositor Inspector",
      "route": "/mahavisphot/compositor/inspector",
      "moduleId": "compositor",
      "group": "inspection",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 107
    },
    {
      "id": "compositor.node-graph",
      "title": "Compositor Node Graph",
      "route": "/mahavisphot/compositor/node-graph",
      "moduleId": "compositor",
      "group": "node workspace",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 108
    },
    {
      "id": "compositor.automation",
      "title": "Compositor Automation",
      "route": "/mahavisphot/compositor/automation",
      "moduleId": "compositor",
      "group": "automation",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 109
    },
    {
      "id": "compositor.review",
      "title": "Compositor Review",
      "route": "/mahavisphot/compositor/review",
      "moduleId": "compositor",
      "group": "review",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 110
    },
    {
      "id": "compositor.collaboration",
      "title": "Compositor Collaboration",
      "route": "/mahavisphot/compositor/collaboration",
      "moduleId": "compositor",
      "group": "collaboration",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 111
    },
    {
      "id": "compositor.settings",
      "title": "Compositor Settings",
      "route": "/mahavisphot/compositor/settings",
      "moduleId": "compositor",
      "group": "settings",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 112
    },
    {
      "id": "compositor.health",
      "title": "Compositor Health",
      "route": "/mahavisphot/compositor/health",
      "moduleId": "compositor",
      "group": "runtime health",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 113
    },
    {
      "id": "compositor.evidence",
      "title": "Compositor Evidence",
      "route": "/mahavisphot/compositor/evidence",
      "moduleId": "compositor",
      "group": "evidence",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 114
    },
    {
      "id": "compositor.export",
      "title": "Compositor Export",
      "route": "/mahavisphot/compositor/export",
      "moduleId": "compositor",
      "group": "delivery",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 115
    },
    {
      "id": "compositor.audit",
      "title": "Compositor Audit",
      "route": "/mahavisphot/compositor/audit",
      "moduleId": "compositor",
      "group": "audit",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 116
    },
    {
      "id": "vfx-studio.overview",
      "title": "VFX Studio Overview",
      "route": "/mahavisphot/vfx-studio/overview",
      "moduleId": "vfx-studio",
      "group": "command map",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 201
    },
    {
      "id": "vfx-studio.launch",
      "title": "VFX Studio Launch",
      "route": "/mahavisphot/vfx-studio/launch",
      "moduleId": "vfx-studio",
      "group": "project launch",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 202
    },
    {
      "id": "vfx-studio.ingest",
      "title": "VFX Studio Ingest",
      "route": "/mahavisphot/vfx-studio/ingest",
      "moduleId": "vfx-studio",
      "group": "media intake",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 203
    },
    {
      "id": "vfx-studio.storyboard",
      "title": "VFX Studio Storyboard",
      "route": "/mahavisphot/vfx-studio/storyboard",
      "moduleId": "vfx-studio",
      "group": "story planning",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 204
    },
    {
      "id": "vfx-studio.timeline",
      "title": "VFX Studio Timeline",
      "route": "/mahavisphot/vfx-studio/timeline",
      "moduleId": "vfx-studio",
      "group": "timeline",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 205
    },
    {
      "id": "vfx-studio.layers",
      "title": "VFX Studio Layers",
      "route": "/mahavisphot/vfx-studio/layers",
      "moduleId": "vfx-studio",
      "group": "layer control",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 206
    },
    {
      "id": "vfx-studio.inspector",
      "title": "VFX Studio Inspector",
      "route": "/mahavisphot/vfx-studio/inspector",
      "moduleId": "vfx-studio",
      "group": "inspection",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 207
    },
    {
      "id": "vfx-studio.node-graph",
      "title": "VFX Studio Node Graph",
      "route": "/mahavisphot/vfx-studio/node-graph",
      "moduleId": "vfx-studio",
      "group": "node workspace",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 208
    },
    {
      "id": "vfx-studio.automation",
      "title": "VFX Studio Automation",
      "route": "/mahavisphot/vfx-studio/automation",
      "moduleId": "vfx-studio",
      "group": "automation",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 209
    },
    {
      "id": "vfx-studio.review",
      "title": "VFX Studio Review",
      "route": "/mahavisphot/vfx-studio/review",
      "moduleId": "vfx-studio",
      "group": "review",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 210
    },
    {
      "id": "vfx-studio.collaboration",
      "title": "VFX Studio Collaboration",
      "route": "/mahavisphot/vfx-studio/collaboration",
      "moduleId": "vfx-studio",
      "group": "collaboration",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 211
    },
    {
      "id": "vfx-studio.settings",
      "title": "VFX Studio Settings",
      "route": "/mahavisphot/vfx-studio/settings",
      "moduleId": "vfx-studio",
      "group": "settings",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 212
    },
    {
      "id": "vfx-studio.health",
      "title": "VFX Studio Health",
      "route": "/mahavisphot/vfx-studio/health",
      "moduleId": "vfx-studio",
      "group": "runtime health",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 213
    },
    {
      "id": "vfx-studio.evidence",
      "title": "VFX Studio Evidence",
      "route": "/mahavisphot/vfx-studio/evidence",
      "moduleId": "vfx-studio",
      "group": "evidence",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 214
    },
    {
      "id": "vfx-studio.export",
      "title": "VFX Studio Export",
      "route": "/mahavisphot/vfx-studio/export",
      "moduleId": "vfx-studio",
      "group": "delivery",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 215
    },
    {
      "id": "vfx-studio.audit",
      "title": "VFX Studio Audit",
      "route": "/mahavisphot/vfx-studio/audit",
      "moduleId": "vfx-studio",
      "group": "audit",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 216
    },
    {
      "id": "particle-studio.overview",
      "title": "Particle Studio Overview",
      "route": "/mahavisphot/particle-studio/overview",
      "moduleId": "particle-studio",
      "group": "command map",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 301
    },
    {
      "id": "particle-studio.launch",
      "title": "Particle Studio Launch",
      "route": "/mahavisphot/particle-studio/launch",
      "moduleId": "particle-studio",
      "group": "project launch",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 302
    },
    {
      "id": "particle-studio.ingest",
      "title": "Particle Studio Ingest",
      "route": "/mahavisphot/particle-studio/ingest",
      "moduleId": "particle-studio",
      "group": "media intake",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 303
    },
    {
      "id": "particle-studio.storyboard",
      "title": "Particle Studio Storyboard",
      "route": "/mahavisphot/particle-studio/storyboard",
      "moduleId": "particle-studio",
      "group": "story planning",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 304
    },
    {
      "id": "particle-studio.timeline",
      "title": "Particle Studio Timeline",
      "route": "/mahavisphot/particle-studio/timeline",
      "moduleId": "particle-studio",
      "group": "timeline",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 305
    },
    {
      "id": "particle-studio.layers",
      "title": "Particle Studio Layers",
      "route": "/mahavisphot/particle-studio/layers",
      "moduleId": "particle-studio",
      "group": "layer control",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 306
    },
    {
      "id": "particle-studio.inspector",
      "title": "Particle Studio Inspector",
      "route": "/mahavisphot/particle-studio/inspector",
      "moduleId": "particle-studio",
      "group": "inspection",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 307
    },
    {
      "id": "particle-studio.node-graph",
      "title": "Particle Studio Node Graph",
      "route": "/mahavisphot/particle-studio/node-graph",
      "moduleId": "particle-studio",
      "group": "node workspace",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 308
    },
    {
      "id": "particle-studio.automation",
      "title": "Particle Studio Automation",
      "route": "/mahavisphot/particle-studio/automation",
      "moduleId": "particle-studio",
      "group": "automation",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 309
    },
    {
      "id": "particle-studio.review",
      "title": "Particle Studio Review",
      "route": "/mahavisphot/particle-studio/review",
      "moduleId": "particle-studio",
      "group": "review",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 310
    },
    {
      "id": "particle-studio.collaboration",
      "title": "Particle Studio Collaboration",
      "route": "/mahavisphot/particle-studio/collaboration",
      "moduleId": "particle-studio",
      "group": "collaboration",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 311
    },
    {
      "id": "particle-studio.settings",
      "title": "Particle Studio Settings",
      "route": "/mahavisphot/particle-studio/settings",
      "moduleId": "particle-studio",
      "group": "settings",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 312
    },
    {
      "id": "particle-studio.health",
      "title": "Particle Studio Health",
      "route": "/mahavisphot/particle-studio/health",
      "moduleId": "particle-studio",
      "group": "runtime health",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 313
    },
    {
      "id": "particle-studio.evidence",
      "title": "Particle Studio Evidence",
      "route": "/mahavisphot/particle-studio/evidence",
      "moduleId": "particle-studio",
      "group": "evidence",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 314
    },
    {
      "id": "particle-studio.export",
      "title": "Particle Studio Export",
      "route": "/mahavisphot/particle-studio/export",
      "moduleId": "particle-studio",
      "group": "delivery",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 315
    },
    {
      "id": "particle-studio.audit",
      "title": "Particle Studio Audit",
      "route": "/mahavisphot/particle-studio/audit",
      "moduleId": "particle-studio",
      "group": "audit",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 316
    },
    {
      "id": "digital-makeup-studio.overview",
      "title": "Digital Makeup Studio Overview",
      "route": "/mahavisphot/digital-makeup-studio/overview",
      "moduleId": "digital-makeup-studio",
      "group": "command map",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 401
    },
    {
      "id": "digital-makeup-studio.launch",
      "title": "Digital Makeup Studio Launch",
      "route": "/mahavisphot/digital-makeup-studio/launch",
      "moduleId": "digital-makeup-studio",
      "group": "project launch",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 402
    },
    {
      "id": "digital-makeup-studio.ingest",
      "title": "Digital Makeup Studio Ingest",
      "route": "/mahavisphot/digital-makeup-studio/ingest",
      "moduleId": "digital-makeup-studio",
      "group": "media intake",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 403
    },
    {
      "id": "digital-makeup-studio.storyboard",
      "title": "Digital Makeup Studio Storyboard",
      "route": "/mahavisphot/digital-makeup-studio/storyboard",
      "moduleId": "digital-makeup-studio",
      "group": "story planning",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 404
    },
    {
      "id": "digital-makeup-studio.timeline",
      "title": "Digital Makeup Studio Timeline",
      "route": "/mahavisphot/digital-makeup-studio/timeline",
      "moduleId": "digital-makeup-studio",
      "group": "timeline",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 405
    },
    {
      "id": "digital-makeup-studio.layers",
      "title": "Digital Makeup Studio Layers",
      "route": "/mahavisphot/digital-makeup-studio/layers",
      "moduleId": "digital-makeup-studio",
      "group": "layer control",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 406
    },
    {
      "id": "digital-makeup-studio.inspector",
      "title": "Digital Makeup Studio Inspector",
      "route": "/mahavisphot/digital-makeup-studio/inspector",
      "moduleId": "digital-makeup-studio",
      "group": "inspection",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 407
    },
    {
      "id": "digital-makeup-studio.node-graph",
      "title": "Digital Makeup Studio Node Graph",
      "route": "/mahavisphot/digital-makeup-studio/node-graph",
      "moduleId": "digital-makeup-studio",
      "group": "node workspace",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 408
    },
    {
      "id": "digital-makeup-studio.automation",
      "title": "Digital Makeup Studio Automation",
      "route": "/mahavisphot/digital-makeup-studio/automation",
      "moduleId": "digital-makeup-studio",
      "group": "automation",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 409
    },
    {
      "id": "digital-makeup-studio.review",
      "title": "Digital Makeup Studio Review",
      "route": "/mahavisphot/digital-makeup-studio/review",
      "moduleId": "digital-makeup-studio",
      "group": "review",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 410
    },
    {
      "id": "digital-makeup-studio.collaboration",
      "title": "Digital Makeup Studio Collaboration",
      "route": "/mahavisphot/digital-makeup-studio/collaboration",
      "moduleId": "digital-makeup-studio",
      "group": "collaboration",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 411
    },
    {
      "id": "digital-makeup-studio.settings",
      "title": "Digital Makeup Studio Settings",
      "route": "/mahavisphot/digital-makeup-studio/settings",
      "moduleId": "digital-makeup-studio",
      "group": "settings",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 412
    },
    {
      "id": "digital-makeup-studio.health",
      "title": "Digital Makeup Studio Health",
      "route": "/mahavisphot/digital-makeup-studio/health",
      "moduleId": "digital-makeup-studio",
      "group": "runtime health",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 413
    },
    {
      "id": "digital-makeup-studio.evidence",
      "title": "Digital Makeup Studio Evidence",
      "route": "/mahavisphot/digital-makeup-studio/evidence",
      "moduleId": "digital-makeup-studio",
      "group": "evidence",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 414
    },
    {
      "id": "digital-makeup-studio.export",
      "title": "Digital Makeup Studio Export",
      "route": "/mahavisphot/digital-makeup-studio/export",
      "moduleId": "digital-makeup-studio",
      "group": "delivery",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 415
    },
    {
      "id": "digital-makeup-studio.audit",
      "title": "Digital Makeup Studio Audit",
      "route": "/mahavisphot/digital-makeup-studio/audit",
      "moduleId": "digital-makeup-studio",
      "group": "audit",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 416
    },
    {
      "id": "costume-studio.overview",
      "title": "Costume Studio Overview",
      "route": "/mahavisphot/costume-studio/overview",
      "moduleId": "costume-studio",
      "group": "command map",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 501
    },
    {
      "id": "costume-studio.launch",
      "title": "Costume Studio Launch",
      "route": "/mahavisphot/costume-studio/launch",
      "moduleId": "costume-studio",
      "group": "project launch",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 502
    },
    {
      "id": "costume-studio.ingest",
      "title": "Costume Studio Ingest",
      "route": "/mahavisphot/costume-studio/ingest",
      "moduleId": "costume-studio",
      "group": "media intake",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 503
    },
    {
      "id": "costume-studio.storyboard",
      "title": "Costume Studio Storyboard",
      "route": "/mahavisphot/costume-studio/storyboard",
      "moduleId": "costume-studio",
      "group": "story planning",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 504
    },
    {
      "id": "costume-studio.timeline",
      "title": "Costume Studio Timeline",
      "route": "/mahavisphot/costume-studio/timeline",
      "moduleId": "costume-studio",
      "group": "timeline",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 505
    },
    {
      "id": "costume-studio.layers",
      "title": "Costume Studio Layers",
      "route": "/mahavisphot/costume-studio/layers",
      "moduleId": "costume-studio",
      "group": "layer control",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 506
    },
    {
      "id": "costume-studio.inspector",
      "title": "Costume Studio Inspector",
      "route": "/mahavisphot/costume-studio/inspector",
      "moduleId": "costume-studio",
      "group": "inspection",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 507
    },
    {
      "id": "costume-studio.node-graph",
      "title": "Costume Studio Node Graph",
      "route": "/mahavisphot/costume-studio/node-graph",
      "moduleId": "costume-studio",
      "group": "node workspace",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 508
    },
    {
      "id": "costume-studio.automation",
      "title": "Costume Studio Automation",
      "route": "/mahavisphot/costume-studio/automation",
      "moduleId": "costume-studio",
      "group": "automation",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 509
    },
    {
      "id": "costume-studio.review",
      "title": "Costume Studio Review",
      "route": "/mahavisphot/costume-studio/review",
      "moduleId": "costume-studio",
      "group": "review",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 510
    },
    {
      "id": "costume-studio.collaboration",
      "title": "Costume Studio Collaboration",
      "route": "/mahavisphot/costume-studio/collaboration",
      "moduleId": "costume-studio",
      "group": "collaboration",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 511
    },
    {
      "id": "costume-studio.settings",
      "title": "Costume Studio Settings",
      "route": "/mahavisphot/costume-studio/settings",
      "moduleId": "costume-studio",
      "group": "settings",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 512
    },
    {
      "id": "costume-studio.health",
      "title": "Costume Studio Health",
      "route": "/mahavisphot/costume-studio/health",
      "moduleId": "costume-studio",
      "group": "runtime health",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 513
    },
    {
      "id": "costume-studio.evidence",
      "title": "Costume Studio Evidence",
      "route": "/mahavisphot/costume-studio/evidence",
      "moduleId": "costume-studio",
      "group": "evidence",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 514
    },
    {
      "id": "costume-studio.export",
      "title": "Costume Studio Export",
      "route": "/mahavisphot/costume-studio/export",
      "moduleId": "costume-studio",
      "group": "delivery",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 515
    },
    {
      "id": "costume-studio.audit",
      "title": "Costume Studio Audit",
      "route": "/mahavisphot/costume-studio/audit",
      "moduleId": "costume-studio",
      "group": "audit",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 516
    },
    {
      "id": "props-studio.overview",
      "title": "Props Studio Overview",
      "route": "/mahavisphot/props-studio/overview",
      "moduleId": "props-studio",
      "group": "command map",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 601
    },
    {
      "id": "props-studio.launch",
      "title": "Props Studio Launch",
      "route": "/mahavisphot/props-studio/launch",
      "moduleId": "props-studio",
      "group": "project launch",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 602
    },
    {
      "id": "props-studio.ingest",
      "title": "Props Studio Ingest",
      "route": "/mahavisphot/props-studio/ingest",
      "moduleId": "props-studio",
      "group": "media intake",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 603
    },
    {
      "id": "props-studio.storyboard",
      "title": "Props Studio Storyboard",
      "route": "/mahavisphot/props-studio/storyboard",
      "moduleId": "props-studio",
      "group": "story planning",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 604
    },
    {
      "id": "props-studio.timeline",
      "title": "Props Studio Timeline",
      "route": "/mahavisphot/props-studio/timeline",
      "moduleId": "props-studio",
      "group": "timeline",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 605
    },
    {
      "id": "props-studio.layers",
      "title": "Props Studio Layers",
      "route": "/mahavisphot/props-studio/layers",
      "moduleId": "props-studio",
      "group": "layer control",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 606
    },
    {
      "id": "props-studio.inspector",
      "title": "Props Studio Inspector",
      "route": "/mahavisphot/props-studio/inspector",
      "moduleId": "props-studio",
      "group": "inspection",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 607
    },
    {
      "id": "props-studio.node-graph",
      "title": "Props Studio Node Graph",
      "route": "/mahavisphot/props-studio/node-graph",
      "moduleId": "props-studio",
      "group": "node workspace",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 608
    },
    {
      "id": "props-studio.automation",
      "title": "Props Studio Automation",
      "route": "/mahavisphot/props-studio/automation",
      "moduleId": "props-studio",
      "group": "automation",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 609
    },
    {
      "id": "props-studio.review",
      "title": "Props Studio Review",
      "route": "/mahavisphot/props-studio/review",
      "moduleId": "props-studio",
      "group": "review",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 610
    },
    {
      "id": "props-studio.collaboration",
      "title": "Props Studio Collaboration",
      "route": "/mahavisphot/props-studio/collaboration",
      "moduleId": "props-studio",
      "group": "collaboration",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 611
    },
    {
      "id": "props-studio.settings",
      "title": "Props Studio Settings",
      "route": "/mahavisphot/props-studio/settings",
      "moduleId": "props-studio",
      "group": "settings",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 612
    },
    {
      "id": "props-studio.health",
      "title": "Props Studio Health",
      "route": "/mahavisphot/props-studio/health",
      "moduleId": "props-studio",
      "group": "runtime health",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 613
    },
    {
      "id": "props-studio.evidence",
      "title": "Props Studio Evidence",
      "route": "/mahavisphot/props-studio/evidence",
      "moduleId": "props-studio",
      "group": "evidence",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 614
    },
    {
      "id": "props-studio.export",
      "title": "Props Studio Export",
      "route": "/mahavisphot/props-studio/export",
      "moduleId": "props-studio",
      "group": "delivery",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 615
    },
    {
      "id": "props-studio.audit",
      "title": "Props Studio Audit",
      "route": "/mahavisphot/props-studio/audit",
      "moduleId": "props-studio",
      "group": "audit",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 616
    },
    {
      "id": "toon-designer-studio.overview",
      "title": "Toon Designer Studio Overview",
      "route": "/mahavisphot/toon-designer-studio/overview",
      "moduleId": "toon-designer-studio",
      "group": "command map",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 701
    },
    {
      "id": "toon-designer-studio.launch",
      "title": "Toon Designer Studio Launch",
      "route": "/mahavisphot/toon-designer-studio/launch",
      "moduleId": "toon-designer-studio",
      "group": "project launch",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 702
    },
    {
      "id": "toon-designer-studio.ingest",
      "title": "Toon Designer Studio Ingest",
      "route": "/mahavisphot/toon-designer-studio/ingest",
      "moduleId": "toon-designer-studio",
      "group": "media intake",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 703
    },
    {
      "id": "toon-designer-studio.storyboard",
      "title": "Toon Designer Studio Storyboard",
      "route": "/mahavisphot/toon-designer-studio/storyboard",
      "moduleId": "toon-designer-studio",
      "group": "story planning",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 704
    },
    {
      "id": "toon-designer-studio.timeline",
      "title": "Toon Designer Studio Timeline",
      "route": "/mahavisphot/toon-designer-studio/timeline",
      "moduleId": "toon-designer-studio",
      "group": "timeline",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 705
    },
    {
      "id": "toon-designer-studio.layers",
      "title": "Toon Designer Studio Layers",
      "route": "/mahavisphot/toon-designer-studio/layers",
      "moduleId": "toon-designer-studio",
      "group": "layer control",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 706
    },
    {
      "id": "toon-designer-studio.inspector",
      "title": "Toon Designer Studio Inspector",
      "route": "/mahavisphot/toon-designer-studio/inspector",
      "moduleId": "toon-designer-studio",
      "group": "inspection",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 707
    },
    {
      "id": "toon-designer-studio.node-graph",
      "title": "Toon Designer Studio Node Graph",
      "route": "/mahavisphot/toon-designer-studio/node-graph",
      "moduleId": "toon-designer-studio",
      "group": "node workspace",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 708
    },
    {
      "id": "toon-designer-studio.automation",
      "title": "Toon Designer Studio Automation",
      "route": "/mahavisphot/toon-designer-studio/automation",
      "moduleId": "toon-designer-studio",
      "group": "automation",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 709
    },
    {
      "id": "toon-designer-studio.review",
      "title": "Toon Designer Studio Review",
      "route": "/mahavisphot/toon-designer-studio/review",
      "moduleId": "toon-designer-studio",
      "group": "review",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 710
    },
    {
      "id": "toon-designer-studio.collaboration",
      "title": "Toon Designer Studio Collaboration",
      "route": "/mahavisphot/toon-designer-studio/collaboration",
      "moduleId": "toon-designer-studio",
      "group": "collaboration",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 711
    },
    {
      "id": "toon-designer-studio.settings",
      "title": "Toon Designer Studio Settings",
      "route": "/mahavisphot/toon-designer-studio/settings",
      "moduleId": "toon-designer-studio",
      "group": "settings",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 712
    },
    {
      "id": "toon-designer-studio.health",
      "title": "Toon Designer Studio Health",
      "route": "/mahavisphot/toon-designer-studio/health",
      "moduleId": "toon-designer-studio",
      "group": "runtime health",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 713
    },
    {
      "id": "toon-designer-studio.evidence",
      "title": "Toon Designer Studio Evidence",
      "route": "/mahavisphot/toon-designer-studio/evidence",
      "moduleId": "toon-designer-studio",
      "group": "evidence",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 714
    },
    {
      "id": "toon-designer-studio.export",
      "title": "Toon Designer Studio Export",
      "route": "/mahavisphot/toon-designer-studio/export",
      "moduleId": "toon-designer-studio",
      "group": "delivery",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 715
    },
    {
      "id": "toon-designer-studio.audit",
      "title": "Toon Designer Studio Audit",
      "route": "/mahavisphot/toon-designer-studio/audit",
      "moduleId": "toon-designer-studio",
      "group": "audit",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 716
    },
    {
      "id": "cel-animation-studio.overview",
      "title": "Cel Animation Studio Overview",
      "route": "/mahavisphot/cel-animation-studio/overview",
      "moduleId": "cel-animation-studio",
      "group": "command map",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 801
    },
    {
      "id": "cel-animation-studio.launch",
      "title": "Cel Animation Studio Launch",
      "route": "/mahavisphot/cel-animation-studio/launch",
      "moduleId": "cel-animation-studio",
      "group": "project launch",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 802
    },
    {
      "id": "cel-animation-studio.ingest",
      "title": "Cel Animation Studio Ingest",
      "route": "/mahavisphot/cel-animation-studio/ingest",
      "moduleId": "cel-animation-studio",
      "group": "media intake",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 803
    },
    {
      "id": "cel-animation-studio.storyboard",
      "title": "Cel Animation Studio Storyboard",
      "route": "/mahavisphot/cel-animation-studio/storyboard",
      "moduleId": "cel-animation-studio",
      "group": "story planning",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 804
    },
    {
      "id": "cel-animation-studio.timeline",
      "title": "Cel Animation Studio Timeline",
      "route": "/mahavisphot/cel-animation-studio/timeline",
      "moduleId": "cel-animation-studio",
      "group": "timeline",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 805
    },
    {
      "id": "cel-animation-studio.layers",
      "title": "Cel Animation Studio Layers",
      "route": "/mahavisphot/cel-animation-studio/layers",
      "moduleId": "cel-animation-studio",
      "group": "layer control",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 806
    },
    {
      "id": "cel-animation-studio.inspector",
      "title": "Cel Animation Studio Inspector",
      "route": "/mahavisphot/cel-animation-studio/inspector",
      "moduleId": "cel-animation-studio",
      "group": "inspection",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 807
    },
    {
      "id": "cel-animation-studio.node-graph",
      "title": "Cel Animation Studio Node Graph",
      "route": "/mahavisphot/cel-animation-studio/node-graph",
      "moduleId": "cel-animation-studio",
      "group": "node workspace",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 808
    },
    {
      "id": "cel-animation-studio.automation",
      "title": "Cel Animation Studio Automation",
      "route": "/mahavisphot/cel-animation-studio/automation",
      "moduleId": "cel-animation-studio",
      "group": "automation",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 809
    },
    {
      "id": "cel-animation-studio.review",
      "title": "Cel Animation Studio Review",
      "route": "/mahavisphot/cel-animation-studio/review",
      "moduleId": "cel-animation-studio",
      "group": "review",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 810
    },
    {
      "id": "cel-animation-studio.collaboration",
      "title": "Cel Animation Studio Collaboration",
      "route": "/mahavisphot/cel-animation-studio/collaboration",
      "moduleId": "cel-animation-studio",
      "group": "collaboration",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 811
    },
    {
      "id": "cel-animation-studio.settings",
      "title": "Cel Animation Studio Settings",
      "route": "/mahavisphot/cel-animation-studio/settings",
      "moduleId": "cel-animation-studio",
      "group": "settings",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 812
    },
    {
      "id": "cel-animation-studio.health",
      "title": "Cel Animation Studio Health",
      "route": "/mahavisphot/cel-animation-studio/health",
      "moduleId": "cel-animation-studio",
      "group": "runtime health",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 813
    },
    {
      "id": "cel-animation-studio.evidence",
      "title": "Cel Animation Studio Evidence",
      "route": "/mahavisphot/cel-animation-studio/evidence",
      "moduleId": "cel-animation-studio",
      "group": "evidence",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 814
    },
    {
      "id": "cel-animation-studio.export",
      "title": "Cel Animation Studio Export",
      "route": "/mahavisphot/cel-animation-studio/export",
      "moduleId": "cel-animation-studio",
      "group": "delivery",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 815
    },
    {
      "id": "cel-animation-studio.audit",
      "title": "Cel Animation Studio Audit",
      "route": "/mahavisphot/cel-animation-studio/audit",
      "moduleId": "cel-animation-studio",
      "group": "audit",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 816
    },
    {
      "id": "comic-studio.overview",
      "title": "Comic Studio Overview",
      "route": "/mahavisphot/comic-studio/overview",
      "moduleId": "comic-studio",
      "group": "command map",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 901
    },
    {
      "id": "comic-studio.launch",
      "title": "Comic Studio Launch",
      "route": "/mahavisphot/comic-studio/launch",
      "moduleId": "comic-studio",
      "group": "project launch",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 902
    },
    {
      "id": "comic-studio.ingest",
      "title": "Comic Studio Ingest",
      "route": "/mahavisphot/comic-studio/ingest",
      "moduleId": "comic-studio",
      "group": "media intake",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 903
    },
    {
      "id": "comic-studio.storyboard",
      "title": "Comic Studio Storyboard",
      "route": "/mahavisphot/comic-studio/storyboard",
      "moduleId": "comic-studio",
      "group": "story planning",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 904
    },
    {
      "id": "comic-studio.timeline",
      "title": "Comic Studio Timeline",
      "route": "/mahavisphot/comic-studio/timeline",
      "moduleId": "comic-studio",
      "group": "timeline",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 905
    },
    {
      "id": "comic-studio.layers",
      "title": "Comic Studio Layers",
      "route": "/mahavisphot/comic-studio/layers",
      "moduleId": "comic-studio",
      "group": "layer control",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 906
    },
    {
      "id": "comic-studio.inspector",
      "title": "Comic Studio Inspector",
      "route": "/mahavisphot/comic-studio/inspector",
      "moduleId": "comic-studio",
      "group": "inspection",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 907
    },
    {
      "id": "comic-studio.node-graph",
      "title": "Comic Studio Node Graph",
      "route": "/mahavisphot/comic-studio/node-graph",
      "moduleId": "comic-studio",
      "group": "node workspace",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 908
    },
    {
      "id": "comic-studio.automation",
      "title": "Comic Studio Automation",
      "route": "/mahavisphot/comic-studio/automation",
      "moduleId": "comic-studio",
      "group": "automation",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 909
    },
    {
      "id": "comic-studio.review",
      "title": "Comic Studio Review",
      "route": "/mahavisphot/comic-studio/review",
      "moduleId": "comic-studio",
      "group": "review",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 910
    },
    {
      "id": "comic-studio.collaboration",
      "title": "Comic Studio Collaboration",
      "route": "/mahavisphot/comic-studio/collaboration",
      "moduleId": "comic-studio",
      "group": "collaboration",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 911
    },
    {
      "id": "comic-studio.settings",
      "title": "Comic Studio Settings",
      "route": "/mahavisphot/comic-studio/settings",
      "moduleId": "comic-studio",
      "group": "settings",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 912
    },
    {
      "id": "comic-studio.health",
      "title": "Comic Studio Health",
      "route": "/mahavisphot/comic-studio/health",
      "moduleId": "comic-studio",
      "group": "runtime health",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 913
    },
    {
      "id": "comic-studio.evidence",
      "title": "Comic Studio Evidence",
      "route": "/mahavisphot/comic-studio/evidence",
      "moduleId": "comic-studio",
      "group": "evidence",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 914
    },
    {
      "id": "comic-studio.export",
      "title": "Comic Studio Export",
      "route": "/mahavisphot/comic-studio/export",
      "moduleId": "comic-studio",
      "group": "delivery",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 915
    },
    {
      "id": "comic-studio.audit",
      "title": "Comic Studio Audit",
      "route": "/mahavisphot/comic-studio/audit",
      "moduleId": "comic-studio",
      "group": "audit",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 916
    },
    {
      "id": "face-studio.overview",
      "title": "Face Studio Overview",
      "route": "/mahavisphot/face-studio/overview",
      "moduleId": "face-studio",
      "group": "command map",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1001
    },
    {
      "id": "face-studio.launch",
      "title": "Face Studio Launch",
      "route": "/mahavisphot/face-studio/launch",
      "moduleId": "face-studio",
      "group": "project launch",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1002
    },
    {
      "id": "face-studio.ingest",
      "title": "Face Studio Ingest",
      "route": "/mahavisphot/face-studio/ingest",
      "moduleId": "face-studio",
      "group": "media intake",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1003
    },
    {
      "id": "face-studio.storyboard",
      "title": "Face Studio Storyboard",
      "route": "/mahavisphot/face-studio/storyboard",
      "moduleId": "face-studio",
      "group": "story planning",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1004
    },
    {
      "id": "face-studio.timeline",
      "title": "Face Studio Timeline",
      "route": "/mahavisphot/face-studio/timeline",
      "moduleId": "face-studio",
      "group": "timeline",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1005
    },
    {
      "id": "face-studio.layers",
      "title": "Face Studio Layers",
      "route": "/mahavisphot/face-studio/layers",
      "moduleId": "face-studio",
      "group": "layer control",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1006
    },
    {
      "id": "face-studio.inspector",
      "title": "Face Studio Inspector",
      "route": "/mahavisphot/face-studio/inspector",
      "moduleId": "face-studio",
      "group": "inspection",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1007
    },
    {
      "id": "face-studio.node-graph",
      "title": "Face Studio Node Graph",
      "route": "/mahavisphot/face-studio/node-graph",
      "moduleId": "face-studio",
      "group": "node workspace",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1008
    },
    {
      "id": "face-studio.automation",
      "title": "Face Studio Automation",
      "route": "/mahavisphot/face-studio/automation",
      "moduleId": "face-studio",
      "group": "automation",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1009
    },
    {
      "id": "face-studio.review",
      "title": "Face Studio Review",
      "route": "/mahavisphot/face-studio/review",
      "moduleId": "face-studio",
      "group": "review",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1010
    },
    {
      "id": "face-studio.collaboration",
      "title": "Face Studio Collaboration",
      "route": "/mahavisphot/face-studio/collaboration",
      "moduleId": "face-studio",
      "group": "collaboration",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1011
    },
    {
      "id": "face-studio.settings",
      "title": "Face Studio Settings",
      "route": "/mahavisphot/face-studio/settings",
      "moduleId": "face-studio",
      "group": "settings",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1012
    },
    {
      "id": "face-studio.health",
      "title": "Face Studio Health",
      "route": "/mahavisphot/face-studio/health",
      "moduleId": "face-studio",
      "group": "runtime health",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1013
    },
    {
      "id": "face-studio.evidence",
      "title": "Face Studio Evidence",
      "route": "/mahavisphot/face-studio/evidence",
      "moduleId": "face-studio",
      "group": "evidence",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1014
    },
    {
      "id": "face-studio.export",
      "title": "Face Studio Export",
      "route": "/mahavisphot/face-studio/export",
      "moduleId": "face-studio",
      "group": "delivery",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1015
    },
    {
      "id": "face-studio.audit",
      "title": "Face Studio Audit",
      "route": "/mahavisphot/face-studio/audit",
      "moduleId": "face-studio",
      "group": "audit",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1016
    },
    {
      "id": "three-d-studio.overview",
      "title": "3D Studio Overview",
      "route": "/mahavisphot/three-d-studio/overview",
      "moduleId": "three-d-studio",
      "group": "command map",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1101
    },
    {
      "id": "three-d-studio.launch",
      "title": "3D Studio Launch",
      "route": "/mahavisphot/three-d-studio/launch",
      "moduleId": "three-d-studio",
      "group": "project launch",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1102
    },
    {
      "id": "three-d-studio.ingest",
      "title": "3D Studio Ingest",
      "route": "/mahavisphot/three-d-studio/ingest",
      "moduleId": "three-d-studio",
      "group": "media intake",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1103
    },
    {
      "id": "three-d-studio.storyboard",
      "title": "3D Studio Storyboard",
      "route": "/mahavisphot/three-d-studio/storyboard",
      "moduleId": "three-d-studio",
      "group": "story planning",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1104
    },
    {
      "id": "three-d-studio.timeline",
      "title": "3D Studio Timeline",
      "route": "/mahavisphot/three-d-studio/timeline",
      "moduleId": "three-d-studio",
      "group": "timeline",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1105
    },
    {
      "id": "three-d-studio.layers",
      "title": "3D Studio Layers",
      "route": "/mahavisphot/three-d-studio/layers",
      "moduleId": "three-d-studio",
      "group": "layer control",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1106
    },
    {
      "id": "three-d-studio.inspector",
      "title": "3D Studio Inspector",
      "route": "/mahavisphot/three-d-studio/inspector",
      "moduleId": "three-d-studio",
      "group": "inspection",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1107
    },
    {
      "id": "three-d-studio.node-graph",
      "title": "3D Studio Node Graph",
      "route": "/mahavisphot/three-d-studio/node-graph",
      "moduleId": "three-d-studio",
      "group": "node workspace",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1108
    },
    {
      "id": "three-d-studio.automation",
      "title": "3D Studio Automation",
      "route": "/mahavisphot/three-d-studio/automation",
      "moduleId": "three-d-studio",
      "group": "automation",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1109
    },
    {
      "id": "three-d-studio.review",
      "title": "3D Studio Review",
      "route": "/mahavisphot/three-d-studio/review",
      "moduleId": "three-d-studio",
      "group": "review",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1110
    },
    {
      "id": "three-d-studio.collaboration",
      "title": "3D Studio Collaboration",
      "route": "/mahavisphot/three-d-studio/collaboration",
      "moduleId": "three-d-studio",
      "group": "collaboration",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1111
    },
    {
      "id": "three-d-studio.settings",
      "title": "3D Studio Settings",
      "route": "/mahavisphot/three-d-studio/settings",
      "moduleId": "three-d-studio",
      "group": "settings",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1112
    },
    {
      "id": "three-d-studio.health",
      "title": "3D Studio Health",
      "route": "/mahavisphot/three-d-studio/health",
      "moduleId": "three-d-studio",
      "group": "runtime health",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1113
    },
    {
      "id": "three-d-studio.evidence",
      "title": "3D Studio Evidence",
      "route": "/mahavisphot/three-d-studio/evidence",
      "moduleId": "three-d-studio",
      "group": "evidence",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1114
    },
    {
      "id": "three-d-studio.export",
      "title": "3D Studio Export",
      "route": "/mahavisphot/three-d-studio/export",
      "moduleId": "three-d-studio",
      "group": "delivery",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1115
    },
    {
      "id": "three-d-studio.audit",
      "title": "3D Studio Audit",
      "route": "/mahavisphot/three-d-studio/audit",
      "moduleId": "three-d-studio",
      "group": "audit",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1116
    },
    {
      "id": "xr-studio.overview",
      "title": "XR Studio Overview",
      "route": "/mahavisphot/xr-studio/overview",
      "moduleId": "xr-studio",
      "group": "command map",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1201
    },
    {
      "id": "xr-studio.launch",
      "title": "XR Studio Launch",
      "route": "/mahavisphot/xr-studio/launch",
      "moduleId": "xr-studio",
      "group": "project launch",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1202
    },
    {
      "id": "xr-studio.ingest",
      "title": "XR Studio Ingest",
      "route": "/mahavisphot/xr-studio/ingest",
      "moduleId": "xr-studio",
      "group": "media intake",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1203
    },
    {
      "id": "xr-studio.storyboard",
      "title": "XR Studio Storyboard",
      "route": "/mahavisphot/xr-studio/storyboard",
      "moduleId": "xr-studio",
      "group": "story planning",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1204
    },
    {
      "id": "xr-studio.timeline",
      "title": "XR Studio Timeline",
      "route": "/mahavisphot/xr-studio/timeline",
      "moduleId": "xr-studio",
      "group": "timeline",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1205
    },
    {
      "id": "xr-studio.layers",
      "title": "XR Studio Layers",
      "route": "/mahavisphot/xr-studio/layers",
      "moduleId": "xr-studio",
      "group": "layer control",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1206
    },
    {
      "id": "xr-studio.inspector",
      "title": "XR Studio Inspector",
      "route": "/mahavisphot/xr-studio/inspector",
      "moduleId": "xr-studio",
      "group": "inspection",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1207
    },
    {
      "id": "xr-studio.node-graph",
      "title": "XR Studio Node Graph",
      "route": "/mahavisphot/xr-studio/node-graph",
      "moduleId": "xr-studio",
      "group": "node workspace",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1208
    },
    {
      "id": "xr-studio.automation",
      "title": "XR Studio Automation",
      "route": "/mahavisphot/xr-studio/automation",
      "moduleId": "xr-studio",
      "group": "automation",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1209
    },
    {
      "id": "xr-studio.review",
      "title": "XR Studio Review",
      "route": "/mahavisphot/xr-studio/review",
      "moduleId": "xr-studio",
      "group": "review",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1210
    },
    {
      "id": "xr-studio.collaboration",
      "title": "XR Studio Collaboration",
      "route": "/mahavisphot/xr-studio/collaboration",
      "moduleId": "xr-studio",
      "group": "collaboration",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1211
    },
    {
      "id": "xr-studio.settings",
      "title": "XR Studio Settings",
      "route": "/mahavisphot/xr-studio/settings",
      "moduleId": "xr-studio",
      "group": "settings",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1212
    },
    {
      "id": "xr-studio.health",
      "title": "XR Studio Health",
      "route": "/mahavisphot/xr-studio/health",
      "moduleId": "xr-studio",
      "group": "runtime health",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1213
    },
    {
      "id": "xr-studio.evidence",
      "title": "XR Studio Evidence",
      "route": "/mahavisphot/xr-studio/evidence",
      "moduleId": "xr-studio",
      "group": "evidence",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1214
    },
    {
      "id": "xr-studio.export",
      "title": "XR Studio Export",
      "route": "/mahavisphot/xr-studio/export",
      "moduleId": "xr-studio",
      "group": "delivery",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1215
    },
    {
      "id": "xr-studio.audit",
      "title": "XR Studio Audit",
      "route": "/mahavisphot/xr-studio/audit",
      "moduleId": "xr-studio",
      "group": "audit",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1216
    },
    {
      "id": "audio-studio.overview",
      "title": "Audio Studio Overview",
      "route": "/mahavisphot/audio-studio/overview",
      "moduleId": "audio-studio",
      "group": "command map",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1301
    },
    {
      "id": "audio-studio.launch",
      "title": "Audio Studio Launch",
      "route": "/mahavisphot/audio-studio/launch",
      "moduleId": "audio-studio",
      "group": "project launch",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1302
    },
    {
      "id": "audio-studio.ingest",
      "title": "Audio Studio Ingest",
      "route": "/mahavisphot/audio-studio/ingest",
      "moduleId": "audio-studio",
      "group": "media intake",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1303
    },
    {
      "id": "audio-studio.storyboard",
      "title": "Audio Studio Storyboard",
      "route": "/mahavisphot/audio-studio/storyboard",
      "moduleId": "audio-studio",
      "group": "story planning",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1304
    },
    {
      "id": "audio-studio.timeline",
      "title": "Audio Studio Timeline",
      "route": "/mahavisphot/audio-studio/timeline",
      "moduleId": "audio-studio",
      "group": "timeline",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1305
    },
    {
      "id": "audio-studio.layers",
      "title": "Audio Studio Layers",
      "route": "/mahavisphot/audio-studio/layers",
      "moduleId": "audio-studio",
      "group": "layer control",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1306
    },
    {
      "id": "audio-studio.inspector",
      "title": "Audio Studio Inspector",
      "route": "/mahavisphot/audio-studio/inspector",
      "moduleId": "audio-studio",
      "group": "inspection",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1307
    },
    {
      "id": "audio-studio.node-graph",
      "title": "Audio Studio Node Graph",
      "route": "/mahavisphot/audio-studio/node-graph",
      "moduleId": "audio-studio",
      "group": "node workspace",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1308
    },
    {
      "id": "audio-studio.automation",
      "title": "Audio Studio Automation",
      "route": "/mahavisphot/audio-studio/automation",
      "moduleId": "audio-studio",
      "group": "automation",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1309
    },
    {
      "id": "audio-studio.review",
      "title": "Audio Studio Review",
      "route": "/mahavisphot/audio-studio/review",
      "moduleId": "audio-studio",
      "group": "review",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1310
    },
    {
      "id": "audio-studio.collaboration",
      "title": "Audio Studio Collaboration",
      "route": "/mahavisphot/audio-studio/collaboration",
      "moduleId": "audio-studio",
      "group": "collaboration",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1311
    },
    {
      "id": "audio-studio.settings",
      "title": "Audio Studio Settings",
      "route": "/mahavisphot/audio-studio/settings",
      "moduleId": "audio-studio",
      "group": "settings",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1312
    },
    {
      "id": "audio-studio.health",
      "title": "Audio Studio Health",
      "route": "/mahavisphot/audio-studio/health",
      "moduleId": "audio-studio",
      "group": "runtime health",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1313
    },
    {
      "id": "audio-studio.evidence",
      "title": "Audio Studio Evidence",
      "route": "/mahavisphot/audio-studio/evidence",
      "moduleId": "audio-studio",
      "group": "evidence",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1314
    },
    {
      "id": "audio-studio.export",
      "title": "Audio Studio Export",
      "route": "/mahavisphot/audio-studio/export",
      "moduleId": "audio-studio",
      "group": "delivery",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1315
    },
    {
      "id": "audio-studio.audit",
      "title": "Audio Studio Audit",
      "route": "/mahavisphot/audio-studio/audit",
      "moduleId": "audio-studio",
      "group": "audit",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1316
    },
    {
      "id": "color-studio.overview",
      "title": "Color Studio Overview",
      "route": "/mahavisphot/color-studio/overview",
      "moduleId": "color-studio",
      "group": "command map",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1401
    },
    {
      "id": "color-studio.launch",
      "title": "Color Studio Launch",
      "route": "/mahavisphot/color-studio/launch",
      "moduleId": "color-studio",
      "group": "project launch",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1402
    },
    {
      "id": "color-studio.ingest",
      "title": "Color Studio Ingest",
      "route": "/mahavisphot/color-studio/ingest",
      "moduleId": "color-studio",
      "group": "media intake",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1403
    },
    {
      "id": "color-studio.storyboard",
      "title": "Color Studio Storyboard",
      "route": "/mahavisphot/color-studio/storyboard",
      "moduleId": "color-studio",
      "group": "story planning",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1404
    },
    {
      "id": "color-studio.timeline",
      "title": "Color Studio Timeline",
      "route": "/mahavisphot/color-studio/timeline",
      "moduleId": "color-studio",
      "group": "timeline",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1405
    },
    {
      "id": "color-studio.layers",
      "title": "Color Studio Layers",
      "route": "/mahavisphot/color-studio/layers",
      "moduleId": "color-studio",
      "group": "layer control",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1406
    },
    {
      "id": "color-studio.inspector",
      "title": "Color Studio Inspector",
      "route": "/mahavisphot/color-studio/inspector",
      "moduleId": "color-studio",
      "group": "inspection",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1407
    },
    {
      "id": "color-studio.node-graph",
      "title": "Color Studio Node Graph",
      "route": "/mahavisphot/color-studio/node-graph",
      "moduleId": "color-studio",
      "group": "node workspace",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1408
    },
    {
      "id": "color-studio.automation",
      "title": "Color Studio Automation",
      "route": "/mahavisphot/color-studio/automation",
      "moduleId": "color-studio",
      "group": "automation",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1409
    },
    {
      "id": "color-studio.review",
      "title": "Color Studio Review",
      "route": "/mahavisphot/color-studio/review",
      "moduleId": "color-studio",
      "group": "review",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1410
    },
    {
      "id": "color-studio.collaboration",
      "title": "Color Studio Collaboration",
      "route": "/mahavisphot/color-studio/collaboration",
      "moduleId": "color-studio",
      "group": "collaboration",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1411
    },
    {
      "id": "color-studio.settings",
      "title": "Color Studio Settings",
      "route": "/mahavisphot/color-studio/settings",
      "moduleId": "color-studio",
      "group": "settings",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1412
    },
    {
      "id": "color-studio.health",
      "title": "Color Studio Health",
      "route": "/mahavisphot/color-studio/health",
      "moduleId": "color-studio",
      "group": "runtime health",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1413
    },
    {
      "id": "color-studio.evidence",
      "title": "Color Studio Evidence",
      "route": "/mahavisphot/color-studio/evidence",
      "moduleId": "color-studio",
      "group": "evidence",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1414
    },
    {
      "id": "color-studio.export",
      "title": "Color Studio Export",
      "route": "/mahavisphot/color-studio/export",
      "moduleId": "color-studio",
      "group": "delivery",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1415
    },
    {
      "id": "color-studio.audit",
      "title": "Color Studio Audit",
      "route": "/mahavisphot/color-studio/audit",
      "moduleId": "color-studio",
      "group": "audit",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1416
    },
    {
      "id": "render-center.overview",
      "title": "Render Center Overview",
      "route": "/mahavisphot/render-center/overview",
      "moduleId": "render-center",
      "group": "command map",
      "status": "blocked",
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
      "plans": [
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1501
    },
    {
      "id": "render-center.launch",
      "title": "Render Center Launch",
      "route": "/mahavisphot/render-center/launch",
      "moduleId": "render-center",
      "group": "project launch",
      "status": "blocked",
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
      "plans": [
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1502
    },
    {
      "id": "render-center.ingest",
      "title": "Render Center Ingest",
      "route": "/mahavisphot/render-center/ingest",
      "moduleId": "render-center",
      "group": "media intake",
      "status": "blocked",
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
      "plans": [
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1503
    },
    {
      "id": "render-center.storyboard",
      "title": "Render Center Storyboard",
      "route": "/mahavisphot/render-center/storyboard",
      "moduleId": "render-center",
      "group": "story planning",
      "status": "blocked",
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
      "plans": [
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1504
    },
    {
      "id": "render-center.timeline",
      "title": "Render Center Timeline",
      "route": "/mahavisphot/render-center/timeline",
      "moduleId": "render-center",
      "group": "timeline",
      "status": "blocked",
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
      "plans": [
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1505
    },
    {
      "id": "render-center.layers",
      "title": "Render Center Layers",
      "route": "/mahavisphot/render-center/layers",
      "moduleId": "render-center",
      "group": "layer control",
      "status": "blocked",
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
      "plans": [
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1506
    },
    {
      "id": "render-center.inspector",
      "title": "Render Center Inspector",
      "route": "/mahavisphot/render-center/inspector",
      "moduleId": "render-center",
      "group": "inspection",
      "status": "blocked",
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
      "plans": [
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1507
    },
    {
      "id": "render-center.node-graph",
      "title": "Render Center Node Graph",
      "route": "/mahavisphot/render-center/node-graph",
      "moduleId": "render-center",
      "group": "node workspace",
      "status": "blocked",
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
      "plans": [
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1508
    },
    {
      "id": "render-center.automation",
      "title": "Render Center Automation",
      "route": "/mahavisphot/render-center/automation",
      "moduleId": "render-center",
      "group": "automation",
      "status": "blocked",
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
      "plans": [
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1509
    },
    {
      "id": "render-center.review",
      "title": "Render Center Review",
      "route": "/mahavisphot/render-center/review",
      "moduleId": "render-center",
      "group": "review",
      "status": "blocked",
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
      "plans": [
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1510
    },
    {
      "id": "render-center.collaboration",
      "title": "Render Center Collaboration",
      "route": "/mahavisphot/render-center/collaboration",
      "moduleId": "render-center",
      "group": "collaboration",
      "status": "blocked",
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
      "plans": [
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1511
    },
    {
      "id": "render-center.settings",
      "title": "Render Center Settings",
      "route": "/mahavisphot/render-center/settings",
      "moduleId": "render-center",
      "group": "settings",
      "status": "blocked",
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
      "plans": [
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1512
    },
    {
      "id": "render-center.health",
      "title": "Render Center Health",
      "route": "/mahavisphot/render-center/health",
      "moduleId": "render-center",
      "group": "runtime health",
      "status": "blocked",
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
      "plans": [
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1513
    },
    {
      "id": "render-center.evidence",
      "title": "Render Center Evidence",
      "route": "/mahavisphot/render-center/evidence",
      "moduleId": "render-center",
      "group": "evidence",
      "status": "blocked",
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
      "plans": [
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1514
    },
    {
      "id": "render-center.export",
      "title": "Render Center Export",
      "route": "/mahavisphot/render-center/export",
      "moduleId": "render-center",
      "group": "delivery",
      "status": "blocked",
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
      "plans": [
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1515
    },
    {
      "id": "render-center.audit",
      "title": "Render Center Audit",
      "route": "/mahavisphot/render-center/audit",
      "moduleId": "render-center",
      "group": "audit",
      "status": "blocked",
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
      "plans": [
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1516
    },
    {
      "id": "export-center.overview",
      "title": "Export Center Overview",
      "route": "/mahavisphot/export-center/overview",
      "moduleId": "export-center",
      "group": "command map",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1601
    },
    {
      "id": "export-center.launch",
      "title": "Export Center Launch",
      "route": "/mahavisphot/export-center/launch",
      "moduleId": "export-center",
      "group": "project launch",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1602
    },
    {
      "id": "export-center.ingest",
      "title": "Export Center Ingest",
      "route": "/mahavisphot/export-center/ingest",
      "moduleId": "export-center",
      "group": "media intake",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1603
    },
    {
      "id": "export-center.storyboard",
      "title": "Export Center Storyboard",
      "route": "/mahavisphot/export-center/storyboard",
      "moduleId": "export-center",
      "group": "story planning",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1604
    },
    {
      "id": "export-center.timeline",
      "title": "Export Center Timeline",
      "route": "/mahavisphot/export-center/timeline",
      "moduleId": "export-center",
      "group": "timeline",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1605
    },
    {
      "id": "export-center.layers",
      "title": "Export Center Layers",
      "route": "/mahavisphot/export-center/layers",
      "moduleId": "export-center",
      "group": "layer control",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1606
    },
    {
      "id": "export-center.inspector",
      "title": "Export Center Inspector",
      "route": "/mahavisphot/export-center/inspector",
      "moduleId": "export-center",
      "group": "inspection",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1607
    },
    {
      "id": "export-center.node-graph",
      "title": "Export Center Node Graph",
      "route": "/mahavisphot/export-center/node-graph",
      "moduleId": "export-center",
      "group": "node workspace",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1608
    },
    {
      "id": "export-center.automation",
      "title": "Export Center Automation",
      "route": "/mahavisphot/export-center/automation",
      "moduleId": "export-center",
      "group": "automation",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1609
    },
    {
      "id": "export-center.review",
      "title": "Export Center Review",
      "route": "/mahavisphot/export-center/review",
      "moduleId": "export-center",
      "group": "review",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1610
    },
    {
      "id": "export-center.collaboration",
      "title": "Export Center Collaboration",
      "route": "/mahavisphot/export-center/collaboration",
      "moduleId": "export-center",
      "group": "collaboration",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1611
    },
    {
      "id": "export-center.settings",
      "title": "Export Center Settings",
      "route": "/mahavisphot/export-center/settings",
      "moduleId": "export-center",
      "group": "settings",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1612
    },
    {
      "id": "export-center.health",
      "title": "Export Center Health",
      "route": "/mahavisphot/export-center/health",
      "moduleId": "export-center",
      "group": "runtime health",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1613
    },
    {
      "id": "export-center.evidence",
      "title": "Export Center Evidence",
      "route": "/mahavisphot/export-center/evidence",
      "moduleId": "export-center",
      "group": "evidence",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1614
    },
    {
      "id": "export-center.export",
      "title": "Export Center Export",
      "route": "/mahavisphot/export-center/export",
      "moduleId": "export-center",
      "group": "delivery",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1615
    },
    {
      "id": "export-center.audit",
      "title": "Export Center Audit",
      "route": "/mahavisphot/export-center/audit",
      "moduleId": "export-center",
      "group": "audit",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1616
    },
    {
      "id": "observatory.overview",
      "title": "Observatory Overview",
      "route": "/mahavisphot/observatory/overview",
      "moduleId": "observatory",
      "group": "command map",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1701
    },
    {
      "id": "observatory.launch",
      "title": "Observatory Launch",
      "route": "/mahavisphot/observatory/launch",
      "moduleId": "observatory",
      "group": "project launch",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1702
    },
    {
      "id": "observatory.ingest",
      "title": "Observatory Ingest",
      "route": "/mahavisphot/observatory/ingest",
      "moduleId": "observatory",
      "group": "media intake",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1703
    },
    {
      "id": "observatory.storyboard",
      "title": "Observatory Storyboard",
      "route": "/mahavisphot/observatory/storyboard",
      "moduleId": "observatory",
      "group": "story planning",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1704
    },
    {
      "id": "observatory.timeline",
      "title": "Observatory Timeline",
      "route": "/mahavisphot/observatory/timeline",
      "moduleId": "observatory",
      "group": "timeline",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1705
    },
    {
      "id": "observatory.layers",
      "title": "Observatory Layers",
      "route": "/mahavisphot/observatory/layers",
      "moduleId": "observatory",
      "group": "layer control",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1706
    },
    {
      "id": "observatory.inspector",
      "title": "Observatory Inspector",
      "route": "/mahavisphot/observatory/inspector",
      "moduleId": "observatory",
      "group": "inspection",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1707
    },
    {
      "id": "observatory.node-graph",
      "title": "Observatory Node Graph",
      "route": "/mahavisphot/observatory/node-graph",
      "moduleId": "observatory",
      "group": "node workspace",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1708
    },
    {
      "id": "observatory.automation",
      "title": "Observatory Automation",
      "route": "/mahavisphot/observatory/automation",
      "moduleId": "observatory",
      "group": "automation",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1709
    },
    {
      "id": "observatory.review",
      "title": "Observatory Review",
      "route": "/mahavisphot/observatory/review",
      "moduleId": "observatory",
      "group": "review",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1710
    },
    {
      "id": "observatory.collaboration",
      "title": "Observatory Collaboration",
      "route": "/mahavisphot/observatory/collaboration",
      "moduleId": "observatory",
      "group": "collaboration",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1711
    },
    {
      "id": "observatory.settings",
      "title": "Observatory Settings",
      "route": "/mahavisphot/observatory/settings",
      "moduleId": "observatory",
      "group": "settings",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1712
    },
    {
      "id": "observatory.health",
      "title": "Observatory Health",
      "route": "/mahavisphot/observatory/health",
      "moduleId": "observatory",
      "group": "runtime health",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1713
    },
    {
      "id": "observatory.evidence",
      "title": "Observatory Evidence",
      "route": "/mahavisphot/observatory/evidence",
      "moduleId": "observatory",
      "group": "evidence",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1714
    },
    {
      "id": "observatory.export",
      "title": "Observatory Export",
      "route": "/mahavisphot/observatory/export",
      "moduleId": "observatory",
      "group": "delivery",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1715
    },
    {
      "id": "observatory.audit",
      "title": "Observatory Audit",
      "route": "/mahavisphot/observatory/audit",
      "moduleId": "observatory",
      "group": "audit",
      "status": "scaffold",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1716
    },
    {
      "id": "local-ai-mode.overview",
      "title": "Local AI Mode Overview",
      "route": "/mahavisphot/local-ai-mode/overview",
      "moduleId": "local-ai-mode",
      "group": "command map",
      "status": "blocked",
      "runtimeModes": [
        "local"
      ],
      "permissions": [
        "project:read",
        "media:read",
        "ai:local"
      ],
      "plans": [
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1801
    },
    {
      "id": "local-ai-mode.launch",
      "title": "Local AI Mode Launch",
      "route": "/mahavisphot/local-ai-mode/launch",
      "moduleId": "local-ai-mode",
      "group": "project launch",
      "status": "blocked",
      "runtimeModes": [
        "local"
      ],
      "permissions": [
        "project:read",
        "media:read",
        "ai:local"
      ],
      "plans": [
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1802
    },
    {
      "id": "local-ai-mode.ingest",
      "title": "Local AI Mode Ingest",
      "route": "/mahavisphot/local-ai-mode/ingest",
      "moduleId": "local-ai-mode",
      "group": "media intake",
      "status": "blocked",
      "runtimeModes": [
        "local"
      ],
      "permissions": [
        "project:read",
        "media:read",
        "ai:local"
      ],
      "plans": [
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1803
    },
    {
      "id": "local-ai-mode.storyboard",
      "title": "Local AI Mode Storyboard",
      "route": "/mahavisphot/local-ai-mode/storyboard",
      "moduleId": "local-ai-mode",
      "group": "story planning",
      "status": "blocked",
      "runtimeModes": [
        "local"
      ],
      "permissions": [
        "project:read",
        "media:read",
        "ai:local"
      ],
      "plans": [
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1804
    },
    {
      "id": "local-ai-mode.timeline",
      "title": "Local AI Mode Timeline",
      "route": "/mahavisphot/local-ai-mode/timeline",
      "moduleId": "local-ai-mode",
      "group": "timeline",
      "status": "blocked",
      "runtimeModes": [
        "local"
      ],
      "permissions": [
        "project:read",
        "media:read",
        "ai:local"
      ],
      "plans": [
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1805
    },
    {
      "id": "local-ai-mode.layers",
      "title": "Local AI Mode Layers",
      "route": "/mahavisphot/local-ai-mode/layers",
      "moduleId": "local-ai-mode",
      "group": "layer control",
      "status": "blocked",
      "runtimeModes": [
        "local"
      ],
      "permissions": [
        "project:read",
        "media:read",
        "ai:local"
      ],
      "plans": [
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1806
    },
    {
      "id": "local-ai-mode.inspector",
      "title": "Local AI Mode Inspector",
      "route": "/mahavisphot/local-ai-mode/inspector",
      "moduleId": "local-ai-mode",
      "group": "inspection",
      "status": "blocked",
      "runtimeModes": [
        "local"
      ],
      "permissions": [
        "project:read",
        "media:read",
        "ai:local"
      ],
      "plans": [
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1807
    },
    {
      "id": "local-ai-mode.node-graph",
      "title": "Local AI Mode Node Graph",
      "route": "/mahavisphot/local-ai-mode/node-graph",
      "moduleId": "local-ai-mode",
      "group": "node workspace",
      "status": "blocked",
      "runtimeModes": [
        "local"
      ],
      "permissions": [
        "project:read",
        "media:read",
        "ai:local"
      ],
      "plans": [
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1808
    },
    {
      "id": "local-ai-mode.automation",
      "title": "Local AI Mode Automation",
      "route": "/mahavisphot/local-ai-mode/automation",
      "moduleId": "local-ai-mode",
      "group": "automation",
      "status": "blocked",
      "runtimeModes": [
        "local"
      ],
      "permissions": [
        "project:read",
        "media:read",
        "ai:local"
      ],
      "plans": [
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1809
    },
    {
      "id": "local-ai-mode.review",
      "title": "Local AI Mode Review",
      "route": "/mahavisphot/local-ai-mode/review",
      "moduleId": "local-ai-mode",
      "group": "review",
      "status": "blocked",
      "runtimeModes": [
        "local"
      ],
      "permissions": [
        "project:read",
        "media:read",
        "ai:local"
      ],
      "plans": [
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1810
    },
    {
      "id": "local-ai-mode.collaboration",
      "title": "Local AI Mode Collaboration",
      "route": "/mahavisphot/local-ai-mode/collaboration",
      "moduleId": "local-ai-mode",
      "group": "collaboration",
      "status": "blocked",
      "runtimeModes": [
        "local"
      ],
      "permissions": [
        "project:read",
        "media:read",
        "ai:local"
      ],
      "plans": [
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1811
    },
    {
      "id": "local-ai-mode.settings",
      "title": "Local AI Mode Settings",
      "route": "/mahavisphot/local-ai-mode/settings",
      "moduleId": "local-ai-mode",
      "group": "settings",
      "status": "blocked",
      "runtimeModes": [
        "local"
      ],
      "permissions": [
        "project:read",
        "media:read",
        "ai:local"
      ],
      "plans": [
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1812
    },
    {
      "id": "local-ai-mode.health",
      "title": "Local AI Mode Health",
      "route": "/mahavisphot/local-ai-mode/health",
      "moduleId": "local-ai-mode",
      "group": "runtime health",
      "status": "blocked",
      "runtimeModes": [
        "local"
      ],
      "permissions": [
        "project:read",
        "media:read",
        "ai:local"
      ],
      "plans": [
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1813
    },
    {
      "id": "local-ai-mode.evidence",
      "title": "Local AI Mode Evidence",
      "route": "/mahavisphot/local-ai-mode/evidence",
      "moduleId": "local-ai-mode",
      "group": "evidence",
      "status": "blocked",
      "runtimeModes": [
        "local"
      ],
      "permissions": [
        "project:read",
        "media:read",
        "ai:local"
      ],
      "plans": [
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1814
    },
    {
      "id": "local-ai-mode.export",
      "title": "Local AI Mode Export",
      "route": "/mahavisphot/local-ai-mode/export",
      "moduleId": "local-ai-mode",
      "group": "delivery",
      "status": "blocked",
      "runtimeModes": [
        "local"
      ],
      "permissions": [
        "project:read",
        "media:read",
        "ai:local"
      ],
      "plans": [
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1815
    },
    {
      "id": "local-ai-mode.audit",
      "title": "Local AI Mode Audit",
      "route": "/mahavisphot/local-ai-mode/audit",
      "moduleId": "local-ai-mode",
      "group": "audit",
      "status": "blocked",
      "runtimeModes": [
        "local"
      ],
      "permissions": [
        "project:read",
        "media:read",
        "ai:local"
      ],
      "plans": [
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1816
    },
    {
      "id": "cloud-ai-mode.overview",
      "title": "Cloud AI Mode Overview",
      "route": "/mahavisphot/cloud-ai-mode/overview",
      "moduleId": "cloud-ai-mode",
      "group": "command map",
      "status": "blocked",
      "runtimeModes": [
        "cloud"
      ],
      "permissions": [
        "project:read",
        "media:read",
        "ai:cloud"
      ],
      "plans": [
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1901
    },
    {
      "id": "cloud-ai-mode.launch",
      "title": "Cloud AI Mode Launch",
      "route": "/mahavisphot/cloud-ai-mode/launch",
      "moduleId": "cloud-ai-mode",
      "group": "project launch",
      "status": "blocked",
      "runtimeModes": [
        "cloud"
      ],
      "permissions": [
        "project:read",
        "media:read",
        "ai:cloud"
      ],
      "plans": [
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1902
    },
    {
      "id": "cloud-ai-mode.ingest",
      "title": "Cloud AI Mode Ingest",
      "route": "/mahavisphot/cloud-ai-mode/ingest",
      "moduleId": "cloud-ai-mode",
      "group": "media intake",
      "status": "blocked",
      "runtimeModes": [
        "cloud"
      ],
      "permissions": [
        "project:read",
        "media:read",
        "ai:cloud"
      ],
      "plans": [
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1903
    },
    {
      "id": "cloud-ai-mode.storyboard",
      "title": "Cloud AI Mode Storyboard",
      "route": "/mahavisphot/cloud-ai-mode/storyboard",
      "moduleId": "cloud-ai-mode",
      "group": "story planning",
      "status": "blocked",
      "runtimeModes": [
        "cloud"
      ],
      "permissions": [
        "project:read",
        "media:read",
        "ai:cloud"
      ],
      "plans": [
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1904
    },
    {
      "id": "cloud-ai-mode.timeline",
      "title": "Cloud AI Mode Timeline",
      "route": "/mahavisphot/cloud-ai-mode/timeline",
      "moduleId": "cloud-ai-mode",
      "group": "timeline",
      "status": "blocked",
      "runtimeModes": [
        "cloud"
      ],
      "permissions": [
        "project:read",
        "media:read",
        "ai:cloud"
      ],
      "plans": [
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1905
    },
    {
      "id": "cloud-ai-mode.layers",
      "title": "Cloud AI Mode Layers",
      "route": "/mahavisphot/cloud-ai-mode/layers",
      "moduleId": "cloud-ai-mode",
      "group": "layer control",
      "status": "blocked",
      "runtimeModes": [
        "cloud"
      ],
      "permissions": [
        "project:read",
        "media:read",
        "ai:cloud"
      ],
      "plans": [
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1906
    },
    {
      "id": "cloud-ai-mode.inspector",
      "title": "Cloud AI Mode Inspector",
      "route": "/mahavisphot/cloud-ai-mode/inspector",
      "moduleId": "cloud-ai-mode",
      "group": "inspection",
      "status": "blocked",
      "runtimeModes": [
        "cloud"
      ],
      "permissions": [
        "project:read",
        "media:read",
        "ai:cloud"
      ],
      "plans": [
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1907
    },
    {
      "id": "cloud-ai-mode.node-graph",
      "title": "Cloud AI Mode Node Graph",
      "route": "/mahavisphot/cloud-ai-mode/node-graph",
      "moduleId": "cloud-ai-mode",
      "group": "node workspace",
      "status": "blocked",
      "runtimeModes": [
        "cloud"
      ],
      "permissions": [
        "project:read",
        "media:read",
        "ai:cloud"
      ],
      "plans": [
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1908
    },
    {
      "id": "cloud-ai-mode.automation",
      "title": "Cloud AI Mode Automation",
      "route": "/mahavisphot/cloud-ai-mode/automation",
      "moduleId": "cloud-ai-mode",
      "group": "automation",
      "status": "blocked",
      "runtimeModes": [
        "cloud"
      ],
      "permissions": [
        "project:read",
        "media:read",
        "ai:cloud"
      ],
      "plans": [
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1909
    },
    {
      "id": "cloud-ai-mode.review",
      "title": "Cloud AI Mode Review",
      "route": "/mahavisphot/cloud-ai-mode/review",
      "moduleId": "cloud-ai-mode",
      "group": "review",
      "status": "blocked",
      "runtimeModes": [
        "cloud"
      ],
      "permissions": [
        "project:read",
        "media:read",
        "ai:cloud"
      ],
      "plans": [
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1910
    },
    {
      "id": "cloud-ai-mode.collaboration",
      "title": "Cloud AI Mode Collaboration",
      "route": "/mahavisphot/cloud-ai-mode/collaboration",
      "moduleId": "cloud-ai-mode",
      "group": "collaboration",
      "status": "blocked",
      "runtimeModes": [
        "cloud"
      ],
      "permissions": [
        "project:read",
        "media:read",
        "ai:cloud"
      ],
      "plans": [
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1911
    },
    {
      "id": "cloud-ai-mode.settings",
      "title": "Cloud AI Mode Settings",
      "route": "/mahavisphot/cloud-ai-mode/settings",
      "moduleId": "cloud-ai-mode",
      "group": "settings",
      "status": "blocked",
      "runtimeModes": [
        "cloud"
      ],
      "permissions": [
        "project:read",
        "media:read",
        "ai:cloud"
      ],
      "plans": [
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1912
    },
    {
      "id": "cloud-ai-mode.health",
      "title": "Cloud AI Mode Health",
      "route": "/mahavisphot/cloud-ai-mode/health",
      "moduleId": "cloud-ai-mode",
      "group": "runtime health",
      "status": "blocked",
      "runtimeModes": [
        "cloud"
      ],
      "permissions": [
        "project:read",
        "media:read",
        "ai:cloud"
      ],
      "plans": [
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1913
    },
    {
      "id": "cloud-ai-mode.evidence",
      "title": "Cloud AI Mode Evidence",
      "route": "/mahavisphot/cloud-ai-mode/evidence",
      "moduleId": "cloud-ai-mode",
      "group": "evidence",
      "status": "blocked",
      "runtimeModes": [
        "cloud"
      ],
      "permissions": [
        "project:read",
        "media:read",
        "ai:cloud"
      ],
      "plans": [
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1914
    },
    {
      "id": "cloud-ai-mode.export",
      "title": "Cloud AI Mode Export",
      "route": "/mahavisphot/cloud-ai-mode/export",
      "moduleId": "cloud-ai-mode",
      "group": "delivery",
      "status": "blocked",
      "runtimeModes": [
        "cloud"
      ],
      "permissions": [
        "project:read",
        "media:read",
        "ai:cloud"
      ],
      "plans": [
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1915
    },
    {
      "id": "cloud-ai-mode.audit",
      "title": "Cloud AI Mode Audit",
      "route": "/mahavisphot/cloud-ai-mode/audit",
      "moduleId": "cloud-ai-mode",
      "group": "audit",
      "status": "blocked",
      "runtimeModes": [
        "cloud"
      ],
      "permissions": [
        "project:read",
        "media:read",
        "ai:cloud"
      ],
      "plans": [
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 1916
    },
    {
      "id": "hybrid-ai-mode.overview",
      "title": "Hybrid AI Mode Overview",
      "route": "/mahavisphot/hybrid-ai-mode/overview",
      "moduleId": "hybrid-ai-mode",
      "group": "command map",
      "status": "blocked",
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
      "plans": [
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2001
    },
    {
      "id": "hybrid-ai-mode.launch",
      "title": "Hybrid AI Mode Launch",
      "route": "/mahavisphot/hybrid-ai-mode/launch",
      "moduleId": "hybrid-ai-mode",
      "group": "project launch",
      "status": "blocked",
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
      "plans": [
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2002
    },
    {
      "id": "hybrid-ai-mode.ingest",
      "title": "Hybrid AI Mode Ingest",
      "route": "/mahavisphot/hybrid-ai-mode/ingest",
      "moduleId": "hybrid-ai-mode",
      "group": "media intake",
      "status": "blocked",
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
      "plans": [
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2003
    },
    {
      "id": "hybrid-ai-mode.storyboard",
      "title": "Hybrid AI Mode Storyboard",
      "route": "/mahavisphot/hybrid-ai-mode/storyboard",
      "moduleId": "hybrid-ai-mode",
      "group": "story planning",
      "status": "blocked",
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
      "plans": [
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2004
    },
    {
      "id": "hybrid-ai-mode.timeline",
      "title": "Hybrid AI Mode Timeline",
      "route": "/mahavisphot/hybrid-ai-mode/timeline",
      "moduleId": "hybrid-ai-mode",
      "group": "timeline",
      "status": "blocked",
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
      "plans": [
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2005
    },
    {
      "id": "hybrid-ai-mode.layers",
      "title": "Hybrid AI Mode Layers",
      "route": "/mahavisphot/hybrid-ai-mode/layers",
      "moduleId": "hybrid-ai-mode",
      "group": "layer control",
      "status": "blocked",
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
      "plans": [
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2006
    },
    {
      "id": "hybrid-ai-mode.inspector",
      "title": "Hybrid AI Mode Inspector",
      "route": "/mahavisphot/hybrid-ai-mode/inspector",
      "moduleId": "hybrid-ai-mode",
      "group": "inspection",
      "status": "blocked",
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
      "plans": [
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2007
    },
    {
      "id": "hybrid-ai-mode.node-graph",
      "title": "Hybrid AI Mode Node Graph",
      "route": "/mahavisphot/hybrid-ai-mode/node-graph",
      "moduleId": "hybrid-ai-mode",
      "group": "node workspace",
      "status": "blocked",
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
      "plans": [
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2008
    },
    {
      "id": "hybrid-ai-mode.automation",
      "title": "Hybrid AI Mode Automation",
      "route": "/mahavisphot/hybrid-ai-mode/automation",
      "moduleId": "hybrid-ai-mode",
      "group": "automation",
      "status": "blocked",
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
      "plans": [
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2009
    },
    {
      "id": "hybrid-ai-mode.review",
      "title": "Hybrid AI Mode Review",
      "route": "/mahavisphot/hybrid-ai-mode/review",
      "moduleId": "hybrid-ai-mode",
      "group": "review",
      "status": "blocked",
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
      "plans": [
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2010
    },
    {
      "id": "hybrid-ai-mode.collaboration",
      "title": "Hybrid AI Mode Collaboration",
      "route": "/mahavisphot/hybrid-ai-mode/collaboration",
      "moduleId": "hybrid-ai-mode",
      "group": "collaboration",
      "status": "blocked",
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
      "plans": [
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2011
    },
    {
      "id": "hybrid-ai-mode.settings",
      "title": "Hybrid AI Mode Settings",
      "route": "/mahavisphot/hybrid-ai-mode/settings",
      "moduleId": "hybrid-ai-mode",
      "group": "settings",
      "status": "blocked",
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
      "plans": [
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2012
    },
    {
      "id": "hybrid-ai-mode.health",
      "title": "Hybrid AI Mode Health",
      "route": "/mahavisphot/hybrid-ai-mode/health",
      "moduleId": "hybrid-ai-mode",
      "group": "runtime health",
      "status": "blocked",
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
      "plans": [
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2013
    },
    {
      "id": "hybrid-ai-mode.evidence",
      "title": "Hybrid AI Mode Evidence",
      "route": "/mahavisphot/hybrid-ai-mode/evidence",
      "moduleId": "hybrid-ai-mode",
      "group": "evidence",
      "status": "blocked",
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
      "plans": [
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2014
    },
    {
      "id": "hybrid-ai-mode.export",
      "title": "Hybrid AI Mode Export",
      "route": "/mahavisphot/hybrid-ai-mode/export",
      "moduleId": "hybrid-ai-mode",
      "group": "delivery",
      "status": "blocked",
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
      "plans": [
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2015
    },
    {
      "id": "hybrid-ai-mode.audit",
      "title": "Hybrid AI Mode Audit",
      "route": "/mahavisphot/hybrid-ai-mode/audit",
      "moduleId": "hybrid-ai-mode",
      "group": "audit",
      "status": "blocked",
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
      "plans": [
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2016
    },
    {
      "id": "admin.overview",
      "title": "Admin Overview",
      "route": "/mahavisphot/admin/overview",
      "moduleId": "admin",
      "group": "command map",
      "status": "planned",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2101
    },
    {
      "id": "admin.launch",
      "title": "Admin Launch",
      "route": "/mahavisphot/admin/launch",
      "moduleId": "admin",
      "group": "project launch",
      "status": "planned",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2102
    },
    {
      "id": "admin.ingest",
      "title": "Admin Ingest",
      "route": "/mahavisphot/admin/ingest",
      "moduleId": "admin",
      "group": "media intake",
      "status": "planned",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2103
    },
    {
      "id": "admin.storyboard",
      "title": "Admin Storyboard",
      "route": "/mahavisphot/admin/storyboard",
      "moduleId": "admin",
      "group": "story planning",
      "status": "planned",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2104
    },
    {
      "id": "admin.timeline",
      "title": "Admin Timeline",
      "route": "/mahavisphot/admin/timeline",
      "moduleId": "admin",
      "group": "timeline",
      "status": "planned",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2105
    },
    {
      "id": "admin.layers",
      "title": "Admin Layers",
      "route": "/mahavisphot/admin/layers",
      "moduleId": "admin",
      "group": "layer control",
      "status": "planned",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2106
    },
    {
      "id": "admin.inspector",
      "title": "Admin Inspector",
      "route": "/mahavisphot/admin/inspector",
      "moduleId": "admin",
      "group": "inspection",
      "status": "planned",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2107
    },
    {
      "id": "admin.node-graph",
      "title": "Admin Node Graph",
      "route": "/mahavisphot/admin/node-graph",
      "moduleId": "admin",
      "group": "node workspace",
      "status": "planned",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2108
    },
    {
      "id": "admin.automation",
      "title": "Admin Automation",
      "route": "/mahavisphot/admin/automation",
      "moduleId": "admin",
      "group": "automation",
      "status": "planned",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2109
    },
    {
      "id": "admin.review",
      "title": "Admin Review",
      "route": "/mahavisphot/admin/review",
      "moduleId": "admin",
      "group": "review",
      "status": "planned",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2110
    },
    {
      "id": "admin.collaboration",
      "title": "Admin Collaboration",
      "route": "/mahavisphot/admin/collaboration",
      "moduleId": "admin",
      "group": "collaboration",
      "status": "planned",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2111
    },
    {
      "id": "admin.settings",
      "title": "Admin Settings",
      "route": "/mahavisphot/admin/settings",
      "moduleId": "admin",
      "group": "settings",
      "status": "planned",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2112
    },
    {
      "id": "admin.health",
      "title": "Admin Health",
      "route": "/mahavisphot/admin/health",
      "moduleId": "admin",
      "group": "runtime health",
      "status": "planned",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2113
    },
    {
      "id": "admin.evidence",
      "title": "Admin Evidence",
      "route": "/mahavisphot/admin/evidence",
      "moduleId": "admin",
      "group": "evidence",
      "status": "planned",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2114
    },
    {
      "id": "admin.export",
      "title": "Admin Export",
      "route": "/mahavisphot/admin/export",
      "moduleId": "admin",
      "group": "delivery",
      "status": "planned",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2115
    },
    {
      "id": "admin.audit",
      "title": "Admin Audit",
      "route": "/mahavisphot/admin/audit",
      "moduleId": "admin",
      "group": "audit",
      "status": "planned",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2116
    },
    {
      "id": "support.overview",
      "title": "Support Overview",
      "route": "/mahavisphot/support/overview",
      "moduleId": "support",
      "group": "command map",
      "status": "planned",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2201
    },
    {
      "id": "support.launch",
      "title": "Support Launch",
      "route": "/mahavisphot/support/launch",
      "moduleId": "support",
      "group": "project launch",
      "status": "planned",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2202
    },
    {
      "id": "support.ingest",
      "title": "Support Ingest",
      "route": "/mahavisphot/support/ingest",
      "moduleId": "support",
      "group": "media intake",
      "status": "planned",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2203
    },
    {
      "id": "support.storyboard",
      "title": "Support Storyboard",
      "route": "/mahavisphot/support/storyboard",
      "moduleId": "support",
      "group": "story planning",
      "status": "planned",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2204
    },
    {
      "id": "support.timeline",
      "title": "Support Timeline",
      "route": "/mahavisphot/support/timeline",
      "moduleId": "support",
      "group": "timeline",
      "status": "planned",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2205
    },
    {
      "id": "support.layers",
      "title": "Support Layers",
      "route": "/mahavisphot/support/layers",
      "moduleId": "support",
      "group": "layer control",
      "status": "planned",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2206
    },
    {
      "id": "support.inspector",
      "title": "Support Inspector",
      "route": "/mahavisphot/support/inspector",
      "moduleId": "support",
      "group": "inspection",
      "status": "planned",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2207
    },
    {
      "id": "support.node-graph",
      "title": "Support Node Graph",
      "route": "/mahavisphot/support/node-graph",
      "moduleId": "support",
      "group": "node workspace",
      "status": "planned",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2208
    },
    {
      "id": "support.automation",
      "title": "Support Automation",
      "route": "/mahavisphot/support/automation",
      "moduleId": "support",
      "group": "automation",
      "status": "planned",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2209
    },
    {
      "id": "support.review",
      "title": "Support Review",
      "route": "/mahavisphot/support/review",
      "moduleId": "support",
      "group": "review",
      "status": "planned",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2210
    },
    {
      "id": "support.collaboration",
      "title": "Support Collaboration",
      "route": "/mahavisphot/support/collaboration",
      "moduleId": "support",
      "group": "collaboration",
      "status": "planned",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2211
    },
    {
      "id": "support.settings",
      "title": "Support Settings",
      "route": "/mahavisphot/support/settings",
      "moduleId": "support",
      "group": "settings",
      "status": "planned",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2212
    },
    {
      "id": "support.health",
      "title": "Support Health",
      "route": "/mahavisphot/support/health",
      "moduleId": "support",
      "group": "runtime health",
      "status": "planned",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2213
    },
    {
      "id": "support.evidence",
      "title": "Support Evidence",
      "route": "/mahavisphot/support/evidence",
      "moduleId": "support",
      "group": "evidence",
      "status": "planned",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2214
    },
    {
      "id": "support.export",
      "title": "Support Export",
      "route": "/mahavisphot/support/export",
      "moduleId": "support",
      "group": "delivery",
      "status": "planned",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2215
    },
    {
      "id": "support.audit",
      "title": "Support Audit",
      "route": "/mahavisphot/support/audit",
      "moduleId": "support",
      "group": "audit",
      "status": "planned",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2216
    },
    {
      "id": "developer-platform.overview",
      "title": "Developer Platform Overview",
      "route": "/mahavisphot/developer-platform/overview",
      "moduleId": "developer-platform",
      "group": "command map",
      "status": "planned",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2301
    },
    {
      "id": "developer-platform.launch",
      "title": "Developer Platform Launch",
      "route": "/mahavisphot/developer-platform/launch",
      "moduleId": "developer-platform",
      "group": "project launch",
      "status": "planned",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2302
    },
    {
      "id": "developer-platform.ingest",
      "title": "Developer Platform Ingest",
      "route": "/mahavisphot/developer-platform/ingest",
      "moduleId": "developer-platform",
      "group": "media intake",
      "status": "planned",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2303
    },
    {
      "id": "developer-platform.storyboard",
      "title": "Developer Platform Storyboard",
      "route": "/mahavisphot/developer-platform/storyboard",
      "moduleId": "developer-platform",
      "group": "story planning",
      "status": "planned",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2304
    },
    {
      "id": "developer-platform.timeline",
      "title": "Developer Platform Timeline",
      "route": "/mahavisphot/developer-platform/timeline",
      "moduleId": "developer-platform",
      "group": "timeline",
      "status": "planned",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2305
    },
    {
      "id": "developer-platform.layers",
      "title": "Developer Platform Layers",
      "route": "/mahavisphot/developer-platform/layers",
      "moduleId": "developer-platform",
      "group": "layer control",
      "status": "planned",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2306
    },
    {
      "id": "developer-platform.inspector",
      "title": "Developer Platform Inspector",
      "route": "/mahavisphot/developer-platform/inspector",
      "moduleId": "developer-platform",
      "group": "inspection",
      "status": "planned",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2307
    },
    {
      "id": "developer-platform.node-graph",
      "title": "Developer Platform Node Graph",
      "route": "/mahavisphot/developer-platform/node-graph",
      "moduleId": "developer-platform",
      "group": "node workspace",
      "status": "planned",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2308
    },
    {
      "id": "developer-platform.automation",
      "title": "Developer Platform Automation",
      "route": "/mahavisphot/developer-platform/automation",
      "moduleId": "developer-platform",
      "group": "automation",
      "status": "planned",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2309
    },
    {
      "id": "developer-platform.review",
      "title": "Developer Platform Review",
      "route": "/mahavisphot/developer-platform/review",
      "moduleId": "developer-platform",
      "group": "review",
      "status": "planned",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2310
    },
    {
      "id": "developer-platform.collaboration",
      "title": "Developer Platform Collaboration",
      "route": "/mahavisphot/developer-platform/collaboration",
      "moduleId": "developer-platform",
      "group": "collaboration",
      "status": "planned",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2311
    },
    {
      "id": "developer-platform.settings",
      "title": "Developer Platform Settings",
      "route": "/mahavisphot/developer-platform/settings",
      "moduleId": "developer-platform",
      "group": "settings",
      "status": "planned",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2312
    },
    {
      "id": "developer-platform.health",
      "title": "Developer Platform Health",
      "route": "/mahavisphot/developer-platform/health",
      "moduleId": "developer-platform",
      "group": "runtime health",
      "status": "planned",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2313
    },
    {
      "id": "developer-platform.evidence",
      "title": "Developer Platform Evidence",
      "route": "/mahavisphot/developer-platform/evidence",
      "moduleId": "developer-platform",
      "group": "evidence",
      "status": "planned",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2314
    },
    {
      "id": "developer-platform.export",
      "title": "Developer Platform Export",
      "route": "/mahavisphot/developer-platform/export",
      "moduleId": "developer-platform",
      "group": "delivery",
      "status": "planned",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2315
    },
    {
      "id": "developer-platform.audit",
      "title": "Developer Platform Audit",
      "route": "/mahavisphot/developer-platform/audit",
      "moduleId": "developer-platform",
      "group": "audit",
      "status": "planned",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2316
    },
    {
      "id": "security-recovery.overview",
      "title": "Security Recovery Overview",
      "route": "/mahavisphot/security-recovery/overview",
      "moduleId": "security-recovery",
      "group": "command map",
      "status": "planned",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2401
    },
    {
      "id": "security-recovery.launch",
      "title": "Security Recovery Launch",
      "route": "/mahavisphot/security-recovery/launch",
      "moduleId": "security-recovery",
      "group": "project launch",
      "status": "planned",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2402
    },
    {
      "id": "security-recovery.ingest",
      "title": "Security Recovery Ingest",
      "route": "/mahavisphot/security-recovery/ingest",
      "moduleId": "security-recovery",
      "group": "media intake",
      "status": "planned",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2403
    },
    {
      "id": "security-recovery.storyboard",
      "title": "Security Recovery Storyboard",
      "route": "/mahavisphot/security-recovery/storyboard",
      "moduleId": "security-recovery",
      "group": "story planning",
      "status": "planned",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2404
    },
    {
      "id": "security-recovery.timeline",
      "title": "Security Recovery Timeline",
      "route": "/mahavisphot/security-recovery/timeline",
      "moduleId": "security-recovery",
      "group": "timeline",
      "status": "planned",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2405
    },
    {
      "id": "security-recovery.layers",
      "title": "Security Recovery Layers",
      "route": "/mahavisphot/security-recovery/layers",
      "moduleId": "security-recovery",
      "group": "layer control",
      "status": "planned",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2406
    },
    {
      "id": "security-recovery.inspector",
      "title": "Security Recovery Inspector",
      "route": "/mahavisphot/security-recovery/inspector",
      "moduleId": "security-recovery",
      "group": "inspection",
      "status": "planned",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2407
    },
    {
      "id": "security-recovery.node-graph",
      "title": "Security Recovery Node Graph",
      "route": "/mahavisphot/security-recovery/node-graph",
      "moduleId": "security-recovery",
      "group": "node workspace",
      "status": "planned",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2408
    },
    {
      "id": "security-recovery.automation",
      "title": "Security Recovery Automation",
      "route": "/mahavisphot/security-recovery/automation",
      "moduleId": "security-recovery",
      "group": "automation",
      "status": "planned",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2409
    },
    {
      "id": "security-recovery.review",
      "title": "Security Recovery Review",
      "route": "/mahavisphot/security-recovery/review",
      "moduleId": "security-recovery",
      "group": "review",
      "status": "planned",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2410
    },
    {
      "id": "security-recovery.collaboration",
      "title": "Security Recovery Collaboration",
      "route": "/mahavisphot/security-recovery/collaboration",
      "moduleId": "security-recovery",
      "group": "collaboration",
      "status": "planned",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2411
    },
    {
      "id": "security-recovery.settings",
      "title": "Security Recovery Settings",
      "route": "/mahavisphot/security-recovery/settings",
      "moduleId": "security-recovery",
      "group": "settings",
      "status": "planned",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2412
    },
    {
      "id": "security-recovery.health",
      "title": "Security Recovery Health",
      "route": "/mahavisphot/security-recovery/health",
      "moduleId": "security-recovery",
      "group": "runtime health",
      "status": "planned",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2413
    },
    {
      "id": "security-recovery.evidence",
      "title": "Security Recovery Evidence",
      "route": "/mahavisphot/security-recovery/evidence",
      "moduleId": "security-recovery",
      "group": "evidence",
      "status": "planned",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2414
    },
    {
      "id": "security-recovery.export",
      "title": "Security Recovery Export",
      "route": "/mahavisphot/security-recovery/export",
      "moduleId": "security-recovery",
      "group": "delivery",
      "status": "planned",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2415
    },
    {
      "id": "security-recovery.audit",
      "title": "Security Recovery Audit",
      "route": "/mahavisphot/security-recovery/audit",
      "moduleId": "security-recovery",
      "group": "audit",
      "status": "planned",
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
      "plans": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ],
      "order": 2416
    }
  ],
  "workflowGroups": [
    "animation",
    "audio",
    "billing",
    "character",
    "color",
    "create-open-save-duplicate-delete",
    "delivery",
    "developer",
    "editorial",
    "identity",
    "media",
    "operations",
    "security",
    "spatial",
    "story",
    "tracking",
    "vfx"
  ],
  "crudStatuses": [
    "blocked",
    "planned",
    "preview",
    "scaffold",
    "verified"
  ],
  "uxGroups": [
    "audit",
    "automation",
    "collaboration",
    "command map",
    "delivery",
    "evidence",
    "inspection",
    "layer control",
    "media intake",
    "node workspace",
    "project launch",
    "review",
    "runtime health",
    "settings",
    "story planning",
    "timeline"
  ],
  "modules": [
    {
      "id": "editor",
      "name": "Editor",
      "category": "production",
      "status": "scaffold",
      "routeBase": "/mahavisphot/editor",
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
      "planAvailability": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ]
    },
    {
      "id": "compositor",
      "name": "Compositor",
      "category": "production",
      "status": "scaffold",
      "routeBase": "/mahavisphot/compositor",
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
      "planAvailability": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ]
    },
    {
      "id": "vfx-studio",
      "name": "VFX Studio",
      "category": "visual",
      "status": "scaffold",
      "routeBase": "/mahavisphot/vfx-studio",
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
      "planAvailability": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ]
    },
    {
      "id": "particle-studio",
      "name": "Particle Studio",
      "category": "visual",
      "status": "scaffold",
      "routeBase": "/mahavisphot/particle-studio",
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
      "planAvailability": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ]
    },
    {
      "id": "digital-makeup-studio",
      "name": "Digital Makeup Studio",
      "category": "character",
      "status": "scaffold",
      "routeBase": "/mahavisphot/digital-makeup-studio",
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
      "planAvailability": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ]
    },
    {
      "id": "costume-studio",
      "name": "Costume Studio",
      "category": "character",
      "status": "scaffold",
      "routeBase": "/mahavisphot/costume-studio",
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
      "planAvailability": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ]
    },
    {
      "id": "props-studio",
      "name": "Props Studio",
      "category": "character",
      "status": "scaffold",
      "routeBase": "/mahavisphot/props-studio",
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
      "planAvailability": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ]
    },
    {
      "id": "toon-designer-studio",
      "name": "Toon Designer Studio",
      "category": "animation",
      "status": "scaffold",
      "routeBase": "/mahavisphot/toon-designer-studio",
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
      "planAvailability": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ]
    },
    {
      "id": "cel-animation-studio",
      "name": "Cel Animation Studio",
      "category": "animation",
      "status": "scaffold",
      "routeBase": "/mahavisphot/cel-animation-studio",
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
      "planAvailability": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ]
    },
    {
      "id": "comic-studio",
      "name": "Comic Studio",
      "category": "animation",
      "status": "scaffold",
      "routeBase": "/mahavisphot/comic-studio",
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
      "planAvailability": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ]
    },
    {
      "id": "face-studio",
      "name": "Face Studio",
      "category": "character",
      "status": "scaffold",
      "routeBase": "/mahavisphot/face-studio",
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
      "planAvailability": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ]
    },
    {
      "id": "three-d-studio",
      "name": "3D Studio",
      "category": "spatial",
      "status": "scaffold",
      "routeBase": "/mahavisphot/three-d-studio",
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
      "planAvailability": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ]
    },
    {
      "id": "xr-studio",
      "name": "XR Studio",
      "category": "spatial",
      "status": "scaffold",
      "routeBase": "/mahavisphot/xr-studio",
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
      "planAvailability": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ]
    },
    {
      "id": "audio-studio",
      "name": "Audio Studio",
      "category": "audio",
      "status": "scaffold",
      "routeBase": "/mahavisphot/audio-studio",
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
      "planAvailability": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ]
    },
    {
      "id": "color-studio",
      "name": "Color Studio",
      "category": "visual",
      "status": "scaffold",
      "routeBase": "/mahavisphot/color-studio",
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
      "planAvailability": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ]
    },
    {
      "id": "render-center",
      "name": "Render Center",
      "category": "delivery",
      "status": "blocked",
      "routeBase": "/mahavisphot/render-center",
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
      "planAvailability": [
        "pro",
        "studio",
        "enterprise"
      ]
    },
    {
      "id": "export-center",
      "name": "Export Center",
      "category": "delivery",
      "status": "scaffold",
      "routeBase": "/mahavisphot/export-center",
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
      "planAvailability": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ]
    },
    {
      "id": "observatory",
      "name": "Observatory",
      "category": "operations",
      "status": "scaffold",
      "routeBase": "/mahavisphot/observatory",
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
      "planAvailability": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ]
    },
    {
      "id": "local-ai-mode",
      "name": "Local AI Mode",
      "category": "ai",
      "status": "blocked",
      "routeBase": "/mahavisphot/local-ai-mode",
      "runtimeModes": [
        "local"
      ],
      "permissions": [
        "project:read",
        "media:read",
        "ai:local"
      ],
      "planAvailability": [
        "pro",
        "studio",
        "enterprise"
      ]
    },
    {
      "id": "cloud-ai-mode",
      "name": "Cloud AI Mode",
      "category": "ai",
      "status": "blocked",
      "routeBase": "/mahavisphot/cloud-ai-mode",
      "runtimeModes": [
        "cloud"
      ],
      "permissions": [
        "project:read",
        "media:read",
        "ai:cloud"
      ],
      "planAvailability": [
        "pro",
        "studio",
        "enterprise"
      ]
    },
    {
      "id": "hybrid-ai-mode",
      "name": "Hybrid AI Mode",
      "category": "ai",
      "status": "blocked",
      "routeBase": "/mahavisphot/hybrid-ai-mode",
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
      "planAvailability": [
        "pro",
        "studio",
        "enterprise"
      ]
    },
    {
      "id": "admin",
      "name": "Admin",
      "category": "operations",
      "status": "planned",
      "routeBase": "/mahavisphot/admin",
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
      "planAvailability": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ]
    },
    {
      "id": "support",
      "name": "Support",
      "category": "operations",
      "status": "planned",
      "routeBase": "/mahavisphot/support",
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
      "planAvailability": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ]
    },
    {
      "id": "developer-platform",
      "name": "Developer Platform",
      "category": "operations",
      "status": "planned",
      "routeBase": "/mahavisphot/developer-platform",
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
      "planAvailability": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ]
    },
    {
      "id": "security-recovery",
      "name": "Security Recovery",
      "category": "operations",
      "status": "planned",
      "routeBase": "/mahavisphot/security-recovery",
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
      "planAvailability": [
        "free",
        "trial",
        "pro",
        "studio",
        "enterprise"
      ]
    }
  ],
  "apiSummary": [
    {
      "id": "editor.list",
      "method": "GET",
      "path": "/api/v1/editor/records",
      "moduleId": "editor",
      "status": "scaffold"
    },
    {
      "id": "editor.create",
      "method": "POST",
      "path": "/api/v1/editor/records",
      "moduleId": "editor",
      "status": "scaffold"
    },
    {
      "id": "editor.read",
      "method": "GET",
      "path": "/api/v1/editor/records/{recordId}",
      "moduleId": "editor",
      "status": "scaffold"
    },
    {
      "id": "editor.update",
      "method": "PUT",
      "path": "/api/v1/editor/records/{recordId}",
      "moduleId": "editor",
      "status": "scaffold"
    },
    {
      "id": "editor.delete",
      "method": "DELETE",
      "path": "/api/v1/editor/records/{recordId}",
      "moduleId": "editor",
      "status": "scaffold"
    },
    {
      "id": "editor.health",
      "method": "GET",
      "path": "/api/v1/editor/health",
      "moduleId": "editor",
      "status": "scaffold"
    },
    {
      "id": "compositor.list",
      "method": "GET",
      "path": "/api/v1/compositor/records",
      "moduleId": "compositor",
      "status": "scaffold"
    },
    {
      "id": "compositor.create",
      "method": "POST",
      "path": "/api/v1/compositor/records",
      "moduleId": "compositor",
      "status": "scaffold"
    },
    {
      "id": "compositor.read",
      "method": "GET",
      "path": "/api/v1/compositor/records/{recordId}",
      "moduleId": "compositor",
      "status": "scaffold"
    },
    {
      "id": "compositor.update",
      "method": "PUT",
      "path": "/api/v1/compositor/records/{recordId}",
      "moduleId": "compositor",
      "status": "scaffold"
    },
    {
      "id": "compositor.delete",
      "method": "DELETE",
      "path": "/api/v1/compositor/records/{recordId}",
      "moduleId": "compositor",
      "status": "scaffold"
    },
    {
      "id": "compositor.health",
      "method": "GET",
      "path": "/api/v1/compositor/health",
      "moduleId": "compositor",
      "status": "scaffold"
    },
    {
      "id": "vfx-studio.list",
      "method": "GET",
      "path": "/api/v1/vfx-studio/records",
      "moduleId": "vfx-studio",
      "status": "scaffold"
    },
    {
      "id": "vfx-studio.create",
      "method": "POST",
      "path": "/api/v1/vfx-studio/records",
      "moduleId": "vfx-studio",
      "status": "scaffold"
    },
    {
      "id": "vfx-studio.read",
      "method": "GET",
      "path": "/api/v1/vfx-studio/records/{recordId}",
      "moduleId": "vfx-studio",
      "status": "scaffold"
    },
    {
      "id": "vfx-studio.update",
      "method": "PUT",
      "path": "/api/v1/vfx-studio/records/{recordId}",
      "moduleId": "vfx-studio",
      "status": "scaffold"
    },
    {
      "id": "vfx-studio.delete",
      "method": "DELETE",
      "path": "/api/v1/vfx-studio/records/{recordId}",
      "moduleId": "vfx-studio",
      "status": "scaffold"
    },
    {
      "id": "vfx-studio.health",
      "method": "GET",
      "path": "/api/v1/vfx-studio/health",
      "moduleId": "vfx-studio",
      "status": "scaffold"
    },
    {
      "id": "particle-studio.list",
      "method": "GET",
      "path": "/api/v1/particle-studio/records",
      "moduleId": "particle-studio",
      "status": "scaffold"
    },
    {
      "id": "particle-studio.create",
      "method": "POST",
      "path": "/api/v1/particle-studio/records",
      "moduleId": "particle-studio",
      "status": "scaffold"
    },
    {
      "id": "particle-studio.read",
      "method": "GET",
      "path": "/api/v1/particle-studio/records/{recordId}",
      "moduleId": "particle-studio",
      "status": "scaffold"
    },
    {
      "id": "particle-studio.update",
      "method": "PUT",
      "path": "/api/v1/particle-studio/records/{recordId}",
      "moduleId": "particle-studio",
      "status": "scaffold"
    },
    {
      "id": "particle-studio.delete",
      "method": "DELETE",
      "path": "/api/v1/particle-studio/records/{recordId}",
      "moduleId": "particle-studio",
      "status": "scaffold"
    },
    {
      "id": "particle-studio.health",
      "method": "GET",
      "path": "/api/v1/particle-studio/health",
      "moduleId": "particle-studio",
      "status": "scaffold"
    },
    {
      "id": "digital-makeup-studio.list",
      "method": "GET",
      "path": "/api/v1/digital-makeup-studio/records",
      "moduleId": "digital-makeup-studio",
      "status": "scaffold"
    },
    {
      "id": "digital-makeup-studio.create",
      "method": "POST",
      "path": "/api/v1/digital-makeup-studio/records",
      "moduleId": "digital-makeup-studio",
      "status": "scaffold"
    },
    {
      "id": "digital-makeup-studio.read",
      "method": "GET",
      "path": "/api/v1/digital-makeup-studio/records/{recordId}",
      "moduleId": "digital-makeup-studio",
      "status": "scaffold"
    },
    {
      "id": "digital-makeup-studio.update",
      "method": "PUT",
      "path": "/api/v1/digital-makeup-studio/records/{recordId}",
      "moduleId": "digital-makeup-studio",
      "status": "scaffold"
    },
    {
      "id": "digital-makeup-studio.delete",
      "method": "DELETE",
      "path": "/api/v1/digital-makeup-studio/records/{recordId}",
      "moduleId": "digital-makeup-studio",
      "status": "scaffold"
    },
    {
      "id": "digital-makeup-studio.health",
      "method": "GET",
      "path": "/api/v1/digital-makeup-studio/health",
      "moduleId": "digital-makeup-studio",
      "status": "scaffold"
    },
    {
      "id": "costume-studio.list",
      "method": "GET",
      "path": "/api/v1/costume-studio/records",
      "moduleId": "costume-studio",
      "status": "scaffold"
    },
    {
      "id": "costume-studio.create",
      "method": "POST",
      "path": "/api/v1/costume-studio/records",
      "moduleId": "costume-studio",
      "status": "scaffold"
    },
    {
      "id": "costume-studio.read",
      "method": "GET",
      "path": "/api/v1/costume-studio/records/{recordId}",
      "moduleId": "costume-studio",
      "status": "scaffold"
    },
    {
      "id": "costume-studio.update",
      "method": "PUT",
      "path": "/api/v1/costume-studio/records/{recordId}",
      "moduleId": "costume-studio",
      "status": "scaffold"
    },
    {
      "id": "costume-studio.delete",
      "method": "DELETE",
      "path": "/api/v1/costume-studio/records/{recordId}",
      "moduleId": "costume-studio",
      "status": "scaffold"
    },
    {
      "id": "costume-studio.health",
      "method": "GET",
      "path": "/api/v1/costume-studio/health",
      "moduleId": "costume-studio",
      "status": "scaffold"
    },
    {
      "id": "props-studio.list",
      "method": "GET",
      "path": "/api/v1/props-studio/records",
      "moduleId": "props-studio",
      "status": "scaffold"
    },
    {
      "id": "props-studio.create",
      "method": "POST",
      "path": "/api/v1/props-studio/records",
      "moduleId": "props-studio",
      "status": "scaffold"
    },
    {
      "id": "props-studio.read",
      "method": "GET",
      "path": "/api/v1/props-studio/records/{recordId}",
      "moduleId": "props-studio",
      "status": "scaffold"
    },
    {
      "id": "props-studio.update",
      "method": "PUT",
      "path": "/api/v1/props-studio/records/{recordId}",
      "moduleId": "props-studio",
      "status": "scaffold"
    },
    {
      "id": "props-studio.delete",
      "method": "DELETE",
      "path": "/api/v1/props-studio/records/{recordId}",
      "moduleId": "props-studio",
      "status": "scaffold"
    },
    {
      "id": "props-studio.health",
      "method": "GET",
      "path": "/api/v1/props-studio/health",
      "moduleId": "props-studio",
      "status": "scaffold"
    },
    {
      "id": "toon-designer-studio.list",
      "method": "GET",
      "path": "/api/v1/toon-designer-studio/records",
      "moduleId": "toon-designer-studio",
      "status": "scaffold"
    },
    {
      "id": "toon-designer-studio.create",
      "method": "POST",
      "path": "/api/v1/toon-designer-studio/records",
      "moduleId": "toon-designer-studio",
      "status": "scaffold"
    },
    {
      "id": "toon-designer-studio.read",
      "method": "GET",
      "path": "/api/v1/toon-designer-studio/records/{recordId}",
      "moduleId": "toon-designer-studio",
      "status": "scaffold"
    },
    {
      "id": "toon-designer-studio.update",
      "method": "PUT",
      "path": "/api/v1/toon-designer-studio/records/{recordId}",
      "moduleId": "toon-designer-studio",
      "status": "scaffold"
    },
    {
      "id": "toon-designer-studio.delete",
      "method": "DELETE",
      "path": "/api/v1/toon-designer-studio/records/{recordId}",
      "moduleId": "toon-designer-studio",
      "status": "scaffold"
    },
    {
      "id": "toon-designer-studio.health",
      "method": "GET",
      "path": "/api/v1/toon-designer-studio/health",
      "moduleId": "toon-designer-studio",
      "status": "scaffold"
    },
    {
      "id": "cel-animation-studio.list",
      "method": "GET",
      "path": "/api/v1/cel-animation-studio/records",
      "moduleId": "cel-animation-studio",
      "status": "scaffold"
    },
    {
      "id": "cel-animation-studio.create",
      "method": "POST",
      "path": "/api/v1/cel-animation-studio/records",
      "moduleId": "cel-animation-studio",
      "status": "scaffold"
    },
    {
      "id": "cel-animation-studio.read",
      "method": "GET",
      "path": "/api/v1/cel-animation-studio/records/{recordId}",
      "moduleId": "cel-animation-studio",
      "status": "scaffold"
    },
    {
      "id": "cel-animation-studio.update",
      "method": "PUT",
      "path": "/api/v1/cel-animation-studio/records/{recordId}",
      "moduleId": "cel-animation-studio",
      "status": "scaffold"
    },
    {
      "id": "cel-animation-studio.delete",
      "method": "DELETE",
      "path": "/api/v1/cel-animation-studio/records/{recordId}",
      "moduleId": "cel-animation-studio",
      "status": "scaffold"
    },
    {
      "id": "cel-animation-studio.health",
      "method": "GET",
      "path": "/api/v1/cel-animation-studio/health",
      "moduleId": "cel-animation-studio",
      "status": "scaffold"
    },
    {
      "id": "comic-studio.list",
      "method": "GET",
      "path": "/api/v1/comic-studio/records",
      "moduleId": "comic-studio",
      "status": "scaffold"
    },
    {
      "id": "comic-studio.create",
      "method": "POST",
      "path": "/api/v1/comic-studio/records",
      "moduleId": "comic-studio",
      "status": "scaffold"
    },
    {
      "id": "comic-studio.read",
      "method": "GET",
      "path": "/api/v1/comic-studio/records/{recordId}",
      "moduleId": "comic-studio",
      "status": "scaffold"
    },
    {
      "id": "comic-studio.update",
      "method": "PUT",
      "path": "/api/v1/comic-studio/records/{recordId}",
      "moduleId": "comic-studio",
      "status": "scaffold"
    },
    {
      "id": "comic-studio.delete",
      "method": "DELETE",
      "path": "/api/v1/comic-studio/records/{recordId}",
      "moduleId": "comic-studio",
      "status": "scaffold"
    },
    {
      "id": "comic-studio.health",
      "method": "GET",
      "path": "/api/v1/comic-studio/health",
      "moduleId": "comic-studio",
      "status": "scaffold"
    },
    {
      "id": "face-studio.list",
      "method": "GET",
      "path": "/api/v1/face-studio/records",
      "moduleId": "face-studio",
      "status": "scaffold"
    },
    {
      "id": "face-studio.create",
      "method": "POST",
      "path": "/api/v1/face-studio/records",
      "moduleId": "face-studio",
      "status": "scaffold"
    },
    {
      "id": "face-studio.read",
      "method": "GET",
      "path": "/api/v1/face-studio/records/{recordId}",
      "moduleId": "face-studio",
      "status": "scaffold"
    },
    {
      "id": "face-studio.update",
      "method": "PUT",
      "path": "/api/v1/face-studio/records/{recordId}",
      "moduleId": "face-studio",
      "status": "scaffold"
    },
    {
      "id": "face-studio.delete",
      "method": "DELETE",
      "path": "/api/v1/face-studio/records/{recordId}",
      "moduleId": "face-studio",
      "status": "scaffold"
    },
    {
      "id": "face-studio.health",
      "method": "GET",
      "path": "/api/v1/face-studio/health",
      "moduleId": "face-studio",
      "status": "scaffold"
    },
    {
      "id": "three-d-studio.list",
      "method": "GET",
      "path": "/api/v1/three-d-studio/records",
      "moduleId": "three-d-studio",
      "status": "scaffold"
    },
    {
      "id": "three-d-studio.create",
      "method": "POST",
      "path": "/api/v1/three-d-studio/records",
      "moduleId": "three-d-studio",
      "status": "scaffold"
    },
    {
      "id": "three-d-studio.read",
      "method": "GET",
      "path": "/api/v1/three-d-studio/records/{recordId}",
      "moduleId": "three-d-studio",
      "status": "scaffold"
    },
    {
      "id": "three-d-studio.update",
      "method": "PUT",
      "path": "/api/v1/three-d-studio/records/{recordId}",
      "moduleId": "three-d-studio",
      "status": "scaffold"
    },
    {
      "id": "three-d-studio.delete",
      "method": "DELETE",
      "path": "/api/v1/three-d-studio/records/{recordId}",
      "moduleId": "three-d-studio",
      "status": "scaffold"
    },
    {
      "id": "three-d-studio.health",
      "method": "GET",
      "path": "/api/v1/three-d-studio/health",
      "moduleId": "three-d-studio",
      "status": "scaffold"
    },
    {
      "id": "xr-studio.list",
      "method": "GET",
      "path": "/api/v1/xr-studio/records",
      "moduleId": "xr-studio",
      "status": "scaffold"
    },
    {
      "id": "xr-studio.create",
      "method": "POST",
      "path": "/api/v1/xr-studio/records",
      "moduleId": "xr-studio",
      "status": "scaffold"
    },
    {
      "id": "xr-studio.read",
      "method": "GET",
      "path": "/api/v1/xr-studio/records/{recordId}",
      "moduleId": "xr-studio",
      "status": "scaffold"
    },
    {
      "id": "xr-studio.update",
      "method": "PUT",
      "path": "/api/v1/xr-studio/records/{recordId}",
      "moduleId": "xr-studio",
      "status": "scaffold"
    },
    {
      "id": "xr-studio.delete",
      "method": "DELETE",
      "path": "/api/v1/xr-studio/records/{recordId}",
      "moduleId": "xr-studio",
      "status": "scaffold"
    },
    {
      "id": "xr-studio.health",
      "method": "GET",
      "path": "/api/v1/xr-studio/health",
      "moduleId": "xr-studio",
      "status": "scaffold"
    },
    {
      "id": "audio-studio.list",
      "method": "GET",
      "path": "/api/v1/audio-studio/records",
      "moduleId": "audio-studio",
      "status": "scaffold"
    },
    {
      "id": "audio-studio.create",
      "method": "POST",
      "path": "/api/v1/audio-studio/records",
      "moduleId": "audio-studio",
      "status": "scaffold"
    },
    {
      "id": "audio-studio.read",
      "method": "GET",
      "path": "/api/v1/audio-studio/records/{recordId}",
      "moduleId": "audio-studio",
      "status": "scaffold"
    },
    {
      "id": "audio-studio.update",
      "method": "PUT",
      "path": "/api/v1/audio-studio/records/{recordId}",
      "moduleId": "audio-studio",
      "status": "scaffold"
    },
    {
      "id": "audio-studio.delete",
      "method": "DELETE",
      "path": "/api/v1/audio-studio/records/{recordId}",
      "moduleId": "audio-studio",
      "status": "scaffold"
    },
    {
      "id": "audio-studio.health",
      "method": "GET",
      "path": "/api/v1/audio-studio/health",
      "moduleId": "audio-studio",
      "status": "scaffold"
    },
    {
      "id": "color-studio.list",
      "method": "GET",
      "path": "/api/v1/color-studio/records",
      "moduleId": "color-studio",
      "status": "scaffold"
    },
    {
      "id": "color-studio.create",
      "method": "POST",
      "path": "/api/v1/color-studio/records",
      "moduleId": "color-studio",
      "status": "scaffold"
    },
    {
      "id": "color-studio.read",
      "method": "GET",
      "path": "/api/v1/color-studio/records/{recordId}",
      "moduleId": "color-studio",
      "status": "scaffold"
    },
    {
      "id": "color-studio.update",
      "method": "PUT",
      "path": "/api/v1/color-studio/records/{recordId}",
      "moduleId": "color-studio",
      "status": "scaffold"
    },
    {
      "id": "color-studio.delete",
      "method": "DELETE",
      "path": "/api/v1/color-studio/records/{recordId}",
      "moduleId": "color-studio",
      "status": "scaffold"
    },
    {
      "id": "color-studio.health",
      "method": "GET",
      "path": "/api/v1/color-studio/health",
      "moduleId": "color-studio",
      "status": "scaffold"
    },
    {
      "id": "render-center.list",
      "method": "GET",
      "path": "/api/v1/render-center/records",
      "moduleId": "render-center",
      "status": "blocked"
    },
    {
      "id": "render-center.create",
      "method": "POST",
      "path": "/api/v1/render-center/records",
      "moduleId": "render-center",
      "status": "blocked"
    },
    {
      "id": "render-center.read",
      "method": "GET",
      "path": "/api/v1/render-center/records/{recordId}",
      "moduleId": "render-center",
      "status": "blocked"
    },
    {
      "id": "render-center.update",
      "method": "PUT",
      "path": "/api/v1/render-center/records/{recordId}",
      "moduleId": "render-center",
      "status": "blocked"
    },
    {
      "id": "render-center.delete",
      "method": "DELETE",
      "path": "/api/v1/render-center/records/{recordId}",
      "moduleId": "render-center",
      "status": "blocked"
    },
    {
      "id": "render-center.health",
      "method": "GET",
      "path": "/api/v1/render-center/health",
      "moduleId": "render-center",
      "status": "blocked"
    },
    {
      "id": "export-center.list",
      "method": "GET",
      "path": "/api/v1/export-center/records",
      "moduleId": "export-center",
      "status": "scaffold"
    },
    {
      "id": "export-center.create",
      "method": "POST",
      "path": "/api/v1/export-center/records",
      "moduleId": "export-center",
      "status": "scaffold"
    },
    {
      "id": "export-center.read",
      "method": "GET",
      "path": "/api/v1/export-center/records/{recordId}",
      "moduleId": "export-center",
      "status": "scaffold"
    },
    {
      "id": "export-center.update",
      "method": "PUT",
      "path": "/api/v1/export-center/records/{recordId}",
      "moduleId": "export-center",
      "status": "scaffold"
    },
    {
      "id": "export-center.delete",
      "method": "DELETE",
      "path": "/api/v1/export-center/records/{recordId}",
      "moduleId": "export-center",
      "status": "scaffold"
    },
    {
      "id": "export-center.health",
      "method": "GET",
      "path": "/api/v1/export-center/health",
      "moduleId": "export-center",
      "status": "scaffold"
    },
    {
      "id": "observatory.list",
      "method": "GET",
      "path": "/api/v1/observatory/records",
      "moduleId": "observatory",
      "status": "scaffold"
    },
    {
      "id": "observatory.create",
      "method": "POST",
      "path": "/api/v1/observatory/records",
      "moduleId": "observatory",
      "status": "scaffold"
    },
    {
      "id": "observatory.read",
      "method": "GET",
      "path": "/api/v1/observatory/records/{recordId}",
      "moduleId": "observatory",
      "status": "scaffold"
    },
    {
      "id": "observatory.update",
      "method": "PUT",
      "path": "/api/v1/observatory/records/{recordId}",
      "moduleId": "observatory",
      "status": "scaffold"
    },
    {
      "id": "observatory.delete",
      "method": "DELETE",
      "path": "/api/v1/observatory/records/{recordId}",
      "moduleId": "observatory",
      "status": "scaffold"
    },
    {
      "id": "observatory.health",
      "method": "GET",
      "path": "/api/v1/observatory/health",
      "moduleId": "observatory",
      "status": "scaffold"
    },
    {
      "id": "local-ai-mode.list",
      "method": "GET",
      "path": "/api/v1/local-ai-mode/records",
      "moduleId": "local-ai-mode",
      "status": "blocked"
    },
    {
      "id": "local-ai-mode.create",
      "method": "POST",
      "path": "/api/v1/local-ai-mode/records",
      "moduleId": "local-ai-mode",
      "status": "blocked"
    },
    {
      "id": "local-ai-mode.read",
      "method": "GET",
      "path": "/api/v1/local-ai-mode/records/{recordId}",
      "moduleId": "local-ai-mode",
      "status": "blocked"
    },
    {
      "id": "local-ai-mode.update",
      "method": "PUT",
      "path": "/api/v1/local-ai-mode/records/{recordId}",
      "moduleId": "local-ai-mode",
      "status": "blocked"
    },
    {
      "id": "local-ai-mode.delete",
      "method": "DELETE",
      "path": "/api/v1/local-ai-mode/records/{recordId}",
      "moduleId": "local-ai-mode",
      "status": "blocked"
    },
    {
      "id": "local-ai-mode.health",
      "method": "GET",
      "path": "/api/v1/local-ai-mode/health",
      "moduleId": "local-ai-mode",
      "status": "blocked"
    },
    {
      "id": "cloud-ai-mode.list",
      "method": "GET",
      "path": "/api/v1/cloud-ai-mode/records",
      "moduleId": "cloud-ai-mode",
      "status": "blocked"
    },
    {
      "id": "cloud-ai-mode.create",
      "method": "POST",
      "path": "/api/v1/cloud-ai-mode/records",
      "moduleId": "cloud-ai-mode",
      "status": "blocked"
    },
    {
      "id": "cloud-ai-mode.read",
      "method": "GET",
      "path": "/api/v1/cloud-ai-mode/records/{recordId}",
      "moduleId": "cloud-ai-mode",
      "status": "blocked"
    },
    {
      "id": "cloud-ai-mode.update",
      "method": "PUT",
      "path": "/api/v1/cloud-ai-mode/records/{recordId}",
      "moduleId": "cloud-ai-mode",
      "status": "blocked"
    },
    {
      "id": "cloud-ai-mode.delete",
      "method": "DELETE",
      "path": "/api/v1/cloud-ai-mode/records/{recordId}",
      "moduleId": "cloud-ai-mode",
      "status": "blocked"
    },
    {
      "id": "cloud-ai-mode.health",
      "method": "GET",
      "path": "/api/v1/cloud-ai-mode/health",
      "moduleId": "cloud-ai-mode",
      "status": "blocked"
    },
    {
      "id": "hybrid-ai-mode.list",
      "method": "GET",
      "path": "/api/v1/hybrid-ai-mode/records",
      "moduleId": "hybrid-ai-mode",
      "status": "blocked"
    },
    {
      "id": "hybrid-ai-mode.create",
      "method": "POST",
      "path": "/api/v1/hybrid-ai-mode/records",
      "moduleId": "hybrid-ai-mode",
      "status": "blocked"
    },
    {
      "id": "hybrid-ai-mode.read",
      "method": "GET",
      "path": "/api/v1/hybrid-ai-mode/records/{recordId}",
      "moduleId": "hybrid-ai-mode",
      "status": "blocked"
    },
    {
      "id": "hybrid-ai-mode.update",
      "method": "PUT",
      "path": "/api/v1/hybrid-ai-mode/records/{recordId}",
      "moduleId": "hybrid-ai-mode",
      "status": "blocked"
    },
    {
      "id": "hybrid-ai-mode.delete",
      "method": "DELETE",
      "path": "/api/v1/hybrid-ai-mode/records/{recordId}",
      "moduleId": "hybrid-ai-mode",
      "status": "blocked"
    },
    {
      "id": "hybrid-ai-mode.health",
      "method": "GET",
      "path": "/api/v1/hybrid-ai-mode/health",
      "moduleId": "hybrid-ai-mode",
      "status": "blocked"
    },
    {
      "id": "admin.list",
      "method": "GET",
      "path": "/api/v1/admin/records",
      "moduleId": "admin",
      "status": "scaffold"
    },
    {
      "id": "admin.create",
      "method": "POST",
      "path": "/api/v1/admin/records",
      "moduleId": "admin",
      "status": "scaffold"
    },
    {
      "id": "admin.read",
      "method": "GET",
      "path": "/api/v1/admin/records/{recordId}",
      "moduleId": "admin",
      "status": "scaffold"
    },
    {
      "id": "admin.update",
      "method": "PUT",
      "path": "/api/v1/admin/records/{recordId}",
      "moduleId": "admin",
      "status": "scaffold"
    },
    {
      "id": "admin.delete",
      "method": "DELETE",
      "path": "/api/v1/admin/records/{recordId}",
      "moduleId": "admin",
      "status": "scaffold"
    },
    {
      "id": "admin.health",
      "method": "GET",
      "path": "/api/v1/admin/health",
      "moduleId": "admin",
      "status": "scaffold"
    },
    {
      "id": "support.list",
      "method": "GET",
      "path": "/api/v1/support/records",
      "moduleId": "support",
      "status": "scaffold"
    },
    {
      "id": "support.create",
      "method": "POST",
      "path": "/api/v1/support/records",
      "moduleId": "support",
      "status": "scaffold"
    },
    {
      "id": "support.read",
      "method": "GET",
      "path": "/api/v1/support/records/{recordId}",
      "moduleId": "support",
      "status": "scaffold"
    },
    {
      "id": "support.update",
      "method": "PUT",
      "path": "/api/v1/support/records/{recordId}",
      "moduleId": "support",
      "status": "scaffold"
    },
    {
      "id": "support.delete",
      "method": "DELETE",
      "path": "/api/v1/support/records/{recordId}",
      "moduleId": "support",
      "status": "scaffold"
    },
    {
      "id": "support.health",
      "method": "GET",
      "path": "/api/v1/support/health",
      "moduleId": "support",
      "status": "scaffold"
    },
    {
      "id": "developer-platform.list",
      "method": "GET",
      "path": "/api/v1/developer-platform/records",
      "moduleId": "developer-platform",
      "status": "scaffold"
    },
    {
      "id": "developer-platform.create",
      "method": "POST",
      "path": "/api/v1/developer-platform/records",
      "moduleId": "developer-platform",
      "status": "scaffold"
    },
    {
      "id": "developer-platform.read",
      "method": "GET",
      "path": "/api/v1/developer-platform/records/{recordId}",
      "moduleId": "developer-platform",
      "status": "scaffold"
    },
    {
      "id": "developer-platform.update",
      "method": "PUT",
      "path": "/api/v1/developer-platform/records/{recordId}",
      "moduleId": "developer-platform",
      "status": "scaffold"
    },
    {
      "id": "developer-platform.delete",
      "method": "DELETE",
      "path": "/api/v1/developer-platform/records/{recordId}",
      "moduleId": "developer-platform",
      "status": "scaffold"
    },
    {
      "id": "developer-platform.health",
      "method": "GET",
      "path": "/api/v1/developer-platform/health",
      "moduleId": "developer-platform",
      "status": "scaffold"
    },
    {
      "id": "security-recovery.list",
      "method": "GET",
      "path": "/api/v1/security-recovery/records",
      "moduleId": "security-recovery",
      "status": "scaffold"
    },
    {
      "id": "security-recovery.create",
      "method": "POST",
      "path": "/api/v1/security-recovery/records",
      "moduleId": "security-recovery",
      "status": "scaffold"
    },
    {
      "id": "security-recovery.read",
      "method": "GET",
      "path": "/api/v1/security-recovery/records/{recordId}",
      "moduleId": "security-recovery",
      "status": "scaffold"
    },
    {
      "id": "security-recovery.update",
      "method": "PUT",
      "path": "/api/v1/security-recovery/records/{recordId}",
      "moduleId": "security-recovery",
      "status": "scaffold"
    },
    {
      "id": "security-recovery.delete",
      "method": "DELETE",
      "path": "/api/v1/security-recovery/records/{recordId}",
      "moduleId": "security-recovery",
      "status": "scaffold"
    },
    {
      "id": "security-recovery.health",
      "method": "GET",
      "path": "/api/v1/security-recovery/health",
      "moduleId": "security-recovery",
      "status": "scaffold"
    }
  ],
  "tableSummary": [
    {
      "name": "mahavisphot_editor_records",
      "moduleId": "editor",
      "status": "scaffold",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_editor_events",
      "moduleId": "editor",
      "status": "scaffold",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_editor_settings",
      "moduleId": "editor",
      "status": "scaffold",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_compositor_records",
      "moduleId": "compositor",
      "status": "scaffold",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_compositor_events",
      "moduleId": "compositor",
      "status": "scaffold",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_compositor_settings",
      "moduleId": "compositor",
      "status": "scaffold",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_vfx_studio_records",
      "moduleId": "vfx-studio",
      "status": "scaffold",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_vfx_studio_events",
      "moduleId": "vfx-studio",
      "status": "scaffold",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_vfx_studio_settings",
      "moduleId": "vfx-studio",
      "status": "scaffold",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_particle_studio_records",
      "moduleId": "particle-studio",
      "status": "scaffold",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_particle_studio_events",
      "moduleId": "particle-studio",
      "status": "scaffold",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_particle_studio_settings",
      "moduleId": "particle-studio",
      "status": "scaffold",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_digital_makeup_studio_records",
      "moduleId": "digital-makeup-studio",
      "status": "scaffold",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_digital_makeup_studio_events",
      "moduleId": "digital-makeup-studio",
      "status": "scaffold",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_digital_makeup_studio_settings",
      "moduleId": "digital-makeup-studio",
      "status": "scaffold",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_costume_studio_records",
      "moduleId": "costume-studio",
      "status": "scaffold",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_costume_studio_events",
      "moduleId": "costume-studio",
      "status": "scaffold",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_costume_studio_settings",
      "moduleId": "costume-studio",
      "status": "scaffold",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_props_studio_records",
      "moduleId": "props-studio",
      "status": "scaffold",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_props_studio_events",
      "moduleId": "props-studio",
      "status": "scaffold",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_props_studio_settings",
      "moduleId": "props-studio",
      "status": "scaffold",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_toon_designer_studio_records",
      "moduleId": "toon-designer-studio",
      "status": "scaffold",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_toon_designer_studio_events",
      "moduleId": "toon-designer-studio",
      "status": "scaffold",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_toon_designer_studio_settings",
      "moduleId": "toon-designer-studio",
      "status": "scaffold",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_cel_animation_studio_records",
      "moduleId": "cel-animation-studio",
      "status": "scaffold",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_cel_animation_studio_events",
      "moduleId": "cel-animation-studio",
      "status": "scaffold",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_cel_animation_studio_settings",
      "moduleId": "cel-animation-studio",
      "status": "scaffold",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_comic_studio_records",
      "moduleId": "comic-studio",
      "status": "scaffold",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_comic_studio_events",
      "moduleId": "comic-studio",
      "status": "scaffold",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_comic_studio_settings",
      "moduleId": "comic-studio",
      "status": "scaffold",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_face_studio_records",
      "moduleId": "face-studio",
      "status": "scaffold",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_face_studio_events",
      "moduleId": "face-studio",
      "status": "scaffold",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_face_studio_settings",
      "moduleId": "face-studio",
      "status": "scaffold",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_three_d_studio_records",
      "moduleId": "three-d-studio",
      "status": "scaffold",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_three_d_studio_events",
      "moduleId": "three-d-studio",
      "status": "scaffold",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_three_d_studio_settings",
      "moduleId": "three-d-studio",
      "status": "scaffold",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_xr_studio_records",
      "moduleId": "xr-studio",
      "status": "scaffold",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_xr_studio_events",
      "moduleId": "xr-studio",
      "status": "scaffold",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_xr_studio_settings",
      "moduleId": "xr-studio",
      "status": "scaffold",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_audio_studio_records",
      "moduleId": "audio-studio",
      "status": "scaffold",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_audio_studio_events",
      "moduleId": "audio-studio",
      "status": "scaffold",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_audio_studio_settings",
      "moduleId": "audio-studio",
      "status": "scaffold",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_color_studio_records",
      "moduleId": "color-studio",
      "status": "scaffold",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_color_studio_events",
      "moduleId": "color-studio",
      "status": "scaffold",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_color_studio_settings",
      "moduleId": "color-studio",
      "status": "scaffold",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_render_center_records",
      "moduleId": "render-center",
      "status": "blocked",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_render_center_events",
      "moduleId": "render-center",
      "status": "blocked",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_render_center_settings",
      "moduleId": "render-center",
      "status": "blocked",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_export_center_records",
      "moduleId": "export-center",
      "status": "scaffold",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_export_center_events",
      "moduleId": "export-center",
      "status": "scaffold",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_export_center_settings",
      "moduleId": "export-center",
      "status": "scaffold",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_observatory_records",
      "moduleId": "observatory",
      "status": "scaffold",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_observatory_events",
      "moduleId": "observatory",
      "status": "scaffold",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_observatory_settings",
      "moduleId": "observatory",
      "status": "scaffold",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_local_ai_mode_records",
      "moduleId": "local-ai-mode",
      "status": "blocked",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_local_ai_mode_events",
      "moduleId": "local-ai-mode",
      "status": "blocked",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_local_ai_mode_settings",
      "moduleId": "local-ai-mode",
      "status": "blocked",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_cloud_ai_mode_records",
      "moduleId": "cloud-ai-mode",
      "status": "blocked",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_cloud_ai_mode_events",
      "moduleId": "cloud-ai-mode",
      "status": "blocked",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_cloud_ai_mode_settings",
      "moduleId": "cloud-ai-mode",
      "status": "blocked",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_hybrid_ai_mode_records",
      "moduleId": "hybrid-ai-mode",
      "status": "blocked",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_hybrid_ai_mode_events",
      "moduleId": "hybrid-ai-mode",
      "status": "blocked",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_hybrid_ai_mode_settings",
      "moduleId": "hybrid-ai-mode",
      "status": "blocked",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_admin_records",
      "moduleId": "admin",
      "status": "scaffold",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_admin_events",
      "moduleId": "admin",
      "status": "scaffold",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_admin_settings",
      "moduleId": "admin",
      "status": "scaffold",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_support_records",
      "moduleId": "support",
      "status": "scaffold",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_support_events",
      "moduleId": "support",
      "status": "scaffold",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_support_settings",
      "moduleId": "support",
      "status": "scaffold",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_developer_platform_records",
      "moduleId": "developer-platform",
      "status": "scaffold",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_developer_platform_events",
      "moduleId": "developer-platform",
      "status": "scaffold",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_developer_platform_settings",
      "moduleId": "developer-platform",
      "status": "scaffold",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_security_recovery_records",
      "moduleId": "security-recovery",
      "status": "scaffold",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_security_recovery_events",
      "moduleId": "security-recovery",
      "status": "scaffold",
      "primaryKey": "id"
    },
    {
      "name": "mahavisphot_security_recovery_settings",
      "moduleId": "security-recovery",
      "status": "scaffold",
      "primaryKey": "id"
    }
  ]
};
