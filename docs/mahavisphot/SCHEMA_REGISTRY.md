# Mahavisphot Schema Registry

- Schema version: `mahavisphot.schema.v1`
- Modules: 25
- UX pages: 400
- API endpoints: 150
- Database tables: 75
- Schema entities: 28

| Entity | Kind | Status | Fields |
| --- | --- | --- | --- |
| mahavisphot.project | project | scaffold | id, name, schemaVersion, runtimeMode, plan, modules, tracks, compositions, evidence |
| mahavisphot.runtime-mode | runtime | blocked | mode, provider, adapter, evidenceReference, health |
| mahavisphot.capability-gate | security | scaffold | id, moduleId, plans, permissions, runtimeModes, status, evidenceRequired |
| mahavisphot.module.editor | module | scaffold | id, moduleId, status, payload, permissions, planAvailability, runtimeModes |
| mahavisphot.module.compositor | module | scaffold | id, moduleId, status, payload, permissions, planAvailability, runtimeModes |
| mahavisphot.module.vfx-studio | module | scaffold | id, moduleId, status, payload, permissions, planAvailability, runtimeModes |
| mahavisphot.module.particle-studio | module | scaffold | id, moduleId, status, payload, permissions, planAvailability, runtimeModes |
| mahavisphot.module.digital-makeup-studio | module | scaffold | id, moduleId, status, payload, permissions, planAvailability, runtimeModes |
| mahavisphot.module.costume-studio | module | scaffold | id, moduleId, status, payload, permissions, planAvailability, runtimeModes |
| mahavisphot.module.props-studio | module | scaffold | id, moduleId, status, payload, permissions, planAvailability, runtimeModes |
| mahavisphot.module.toon-designer-studio | module | scaffold | id, moduleId, status, payload, permissions, planAvailability, runtimeModes |
| mahavisphot.module.cel-animation-studio | module | scaffold | id, moduleId, status, payload, permissions, planAvailability, runtimeModes |
| mahavisphot.module.comic-studio | module | scaffold | id, moduleId, status, payload, permissions, planAvailability, runtimeModes |
| mahavisphot.module.face-studio | module | scaffold | id, moduleId, status, payload, permissions, planAvailability, runtimeModes |
| mahavisphot.module.three-d-studio | module | scaffold | id, moduleId, status, payload, permissions, planAvailability, runtimeModes |
| mahavisphot.module.xr-studio | module | scaffold | id, moduleId, status, payload, permissions, planAvailability, runtimeModes |
| mahavisphot.module.audio-studio | module | scaffold | id, moduleId, status, payload, permissions, planAvailability, runtimeModes |
| mahavisphot.module.color-studio | module | scaffold | id, moduleId, status, payload, permissions, planAvailability, runtimeModes |
| mahavisphot.module.render-center | module | blocked | id, moduleId, status, payload, permissions, planAvailability, runtimeModes |
| mahavisphot.module.export-center | module | scaffold | id, moduleId, status, payload, permissions, planAvailability, runtimeModes |
| mahavisphot.module.observatory | module | scaffold | id, moduleId, status, payload, permissions, planAvailability, runtimeModes |
| mahavisphot.module.local-ai-mode | module | blocked | id, moduleId, status, payload, permissions, planAvailability, runtimeModes |
| mahavisphot.module.cloud-ai-mode | module | blocked | id, moduleId, status, payload, permissions, planAvailability, runtimeModes |
| mahavisphot.module.hybrid-ai-mode | module | blocked | id, moduleId, status, payload, permissions, planAvailability, runtimeModes |
| mahavisphot.module.admin | module | planned | id, moduleId, status, payload, permissions, planAvailability, runtimeModes |
| mahavisphot.module.support | module | planned | id, moduleId, status, payload, permissions, planAvailability, runtimeModes |
| mahavisphot.module.developer-platform | module | planned | id, moduleId, status, payload, permissions, planAvailability, runtimeModes |
| mahavisphot.module.security-recovery | module | planned | id, moduleId, status, payload, permissions, planAvailability, runtimeModes |
