# Mahavisphot Export Schema Parity

## Purpose

Step 6 implements export schema parity on top of the verified timeline-runtime v2 document model. The export adapter converts editor payloads and saved timeline documents into one deterministic manifest, `mahavisphot.export.v1`, so renderers and package writers read the same tracks, clips, nested compositions, captions, VFX windows, audio, markers, and asset references.

This is schema parity evidence, not a claim that every visual effect is rendered in final UHD output.

## Runtime Files

- `editor/export-schema.js`
- `scripts/mahavisphot-export-parity.mjs`
- `tests/mahavisphot-export-schema.test.mjs`
- `public/mahavisphot/export-schema-parity.json`
- `docs/mahavisphot/evidence/latest-export-schema-parity.json`

## Implemented Endpoint

`POST /api/export/schema`

The endpoint validates the request, builds a timeline-runtime v2 document when needed, writes `exports/<schema_export_id>/export-schema.json`, writes `exports/<schema_export_id>/export-parity-evidence.json`, and returns both URLs.

`POST /api/export` now writes the same `export-schema.json` beside preview MP4 exports. The preview MP4 renderer remains a scene montage renderer and is not final visual parity for every VFX, particle, 3D, AI, or UHD pass.

## Manifest Coverage

- Timeline document version and hash
- Track list with composition ownership
- Clip list with source type, source id, time window, and renderability
- Dynamic video/audio layer counts and clip counts
- Nested composition graph and child clip counts
- Caption windows
- VFX windows and unsupported preview VFX list
- Audio tracks, audio clips, and mix keys
- Marker windows
- Asset reference catalog
- Render plan and parity report

## Generation Command

```sh
npm run mahavisphot:export-parity
```

## Honest Status

- Export schema parity: implemented and verified
- Preview MP4 schema manifest: implemented
- Full visual renderer parity: blocked until renderer integration evidence
- Production readiness: false

`PRODUCTION_READY=false`
