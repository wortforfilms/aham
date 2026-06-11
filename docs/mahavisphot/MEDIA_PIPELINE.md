# Mahavisphot Media Pipeline

## Purpose

Step 5 verifies local media ingest against safe media roots, extracts real metadata with `ffprobe`, generates deterministic local derivatives with `ffmpeg`, stores CRUD-compatible asset records, links media into the verified timeline-runtime v2 document, and proves that Step 6 export schema parity can read the resulting asset references.

## Implemented Surfaces

- Runtime module: `editor/media-pipeline.js`
- Auth-gated endpoint: `POST /api/v1/media/ingest`
- Evidence generator: `scripts/mahavisphot-media-pipeline.mjs`
- Test suite: `tests/mahavisphot-media-pipeline.test.mjs`
- Public manifest: `public/mahavisphot/media-pipeline-manifest.json`
- Contact sheet: `public/mahavisphot/media-pipeline-contact-sheet.jpg`
- Evidence JSON: `docs/mahavisphot/evidence/latest-media-pipeline-evidence.json`

## Verified Flow

1. Validate requested asset path against safe media roots.
2. Reject traversal and unsupported extensions.
3. Probe source metadata with `ffprobe`.
4. Generate local derivatives:
   - Audio: waveform PNG, proxy M4A, waveform JSON, spectrogram PNG.
   - Image/frame: thumbnail JPG and proxy JPG.
   - Video: thumbnail JPG, proxy MP4, and audio waveform/spectrogram when an audio stream exists.
5. Produce a CRUD-compatible `assets` record.
6. Link the asset into `timeline-runtime` v2 as an audio or video clip.
7. Build `mahavisphot.export.v1` from the linked timeline document and verify the ingested assets are visible to render/export schema parity.

## Sample Assets

| Label | Source |
| --- | --- |
| Varg Ka Khel Master Audio | `media/varg_ka_khel/varg_ka_khel.mp3` |
| Varg Ka Khel Frame 0001 | `media/varg_ka_khel/frames/frame_0001.jpg` |

## Generation Command

```bash
npm run mahavisphot:media
```

The command writes fresh derivatives under `exports/media-pipeline-step5`, writes public/evidence manifests, and runs the media-pipeline test suite.

## Honest Status

Media ingest, metadata extraction, proxy generation, waveform generation, contact-sheet generation, timeline linkage, CRUD asset shape, authenticated HTTP ingest, and export-schema asset visibility are implemented and verified.

Production readiness is still `false` because this does not prove full visual renderer parity, AI runtime execution, Electron packaging, or the final release gate.
