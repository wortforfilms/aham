# Mahavisphot Renderer Core

## Purpose

The renderer core bridges Step 6 export schema parity into an actual local preview render. It consumes the verified `mahavisphot.export.v1` manifest, reads the manifest clip table, resolves only safe local media paths, compiles a deterministic ffmpeg preview, and writes a renderer parity report.

## Implemented Surfaces

- Runtime module: `editor/renderer-core.js`
- API endpoint: `POST /api/v1/render/compile`
- Evidence generator: `scripts/mahavisphot-renderer-parity.mjs`
- Test suite: `tests/mahavisphot-renderer.test.mjs`
- Evidence JSON: `docs/mahavisphot/evidence/latest-renderer-core-evidence.json`
- Public evidence JSON: `public/mahavisphot/renderer-core-evidence.json`

## Verified Flow

1. Build or receive a `mahavisphot.export.v1` manifest.
2. Validate manifest schema, tracks, clips, and render plan.
3. Resolve source assets through safe media roots only.
4. Compile renderable video/image clips from the manifest clip table.
5. Attach the first safe audio clip when present.
6. Write `mahavisphot_manifest_preview.mp4`.
7. Write `renderer-parity-report.json` with manifest read, asset verification, clip coverage, frame count, and blockers.

## Generation Command

```bash
npm run mahavisphot:renderer
```

The command writes a short renderer fixture manifest, compiles a local preview, writes evidence, and runs the renderer test suite.

## Honest Status

Manifest-native preview compilation is implemented and verified. Full UHD visual parity is still not production-ready because advanced VFX, particle, 3D, motion tracking, face replacement, and AI pass renderers require separate execution evidence.
