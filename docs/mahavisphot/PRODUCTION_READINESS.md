# Mahavisphot Compositor — Production Readiness Directive

**Document ID:** `docs/mahavisphot/PRODUCTION_READINESS.md`
**Current global status:** `PRODUCTION_READY=false` (gated, clean)
**Verdict source:** `docs/mahavisphot/evidence/release-gate-verdict.json` — regenerate with `npm run mahavisphot:release-gate`

---

## 1. Architectural baseline — what is actually built and green

Every structural layer is implemented, integrated, and verified by the automated gate. As of the last sweep:

- `npm run check` passes (syntax/lint across all modules and scripts).
- **100/100 tests pass across 18 auto-discovered suites.**
- Runtime health: `editor`, `media`, `render`, `audio` report **ready**; `local_ai`, `cloud_ai`, `hybrid_ai` report **blocked**.
- Electron launch evidence: **14/14** boot-contract checks pass (server start, fixed-port ownership, health-token gating, file routes, project save/load round-trip).
- Audio delivery: the master measures **−13.8 LUFS / −3.4 dBTP true peak**, with the report's `overCeiling` flag clean (`false`) across all benchmark tiers via two-pass `loudnorm` + 4× oversampled true-peak brickwall.
- Concurrent dual-script (Hindi + English) caption burn-in is backed by a repository-embedded OFL Devanagari font (`fontDevanagariAvailable: true`).

The codebase is structurally sound. What remains is not scaffolding — it is the set of **external resources and real engines** the honest gates refuse to fake.

## 2. What "gate green" means vs. what `PRODUCTION_READY=true` requires

The release gate separates two distinct claims, on purpose:

- **Gate green** = the code is healthy: `check` passes and every test suite passes. This is what should gate CI, and it is currently true.
- **`PRODUCTION_READY`** = gate green **and** every runtime reports ready. It is currently `false` because the three AI runtimes are honestly blocked.

`PRODUCTION_READY=true` is therefore not a switch inside this repository. It is the *consequence* of providing real external capabilities below.

## 3. The prerequisites matrix

| Gate vector | Current | Env var the code reads | The real success bar (not just env presence) |
| --- | --- | --- | --- |
| `local_ai` | blocked | `MAHAVISPHOT_MODEL_DIR` | A populated model dir **and** `LocalModelAdapter.infer()` implemented against a real local engine, proven by an inference smoke test. |
| `cloud_ai` | blocked | `MAHAVISPHOT_CLOUD_API_KEY` (or `MAHAVISPHOT_PROVIDER_KEY`) | Credentials **and** `CloudProviderAdapter.infer()` implemented against the real provider over HTTPS, with audit + a smoke test. |
| `hybrid_ai` | blocked | (both of the above) | At least one leg genuinely executing; the privacy-tier router already enforces `local-only` ≠ cloud. |
| Advanced VFX / 3D / particles | text + audio composite only | — | `renderer-core.js` synthesizing particle/track/3D passes headlessly into the encoded frames, matching `mahavisphot.export.v1`. |

## 4. ⚠️ Important caveat — env presence is necessary but **not sufficient**

Be aware of a deliberate limitation before you trust a green `--strict-production` run.

The readiness signal used by `runtime-collectors.js` (and by each adapter's `isReady()`) is **shallow**: it reports `ready: true` when `MAHAVISPHOT_MODEL_DIR` merely points at a non-empty directory, or when a credential string is merely present. It does **not** confirm that real inference can occur. Meanwhile, `LocalModelAdapter.infer()` and `CloudProviderAdapter.infer()` still throw (no engine is implemented), so submitted jobs continue to resolve to `blocked`.

Consequence: exporting the env vars to any populated directory / any string would flip the health collector to "ready" and could make `--strict-production` report `PRODUCTION_READY=true` **while no model actually runs**. That would be a false positive — exactly the kind of unearned green this project has avoided.

**Do not treat env presence as proof of working inference.** Before relying on `PRODUCTION_READY=true`, close this gap by (a) implementing at least one adapter's `infer()` against a real engine, and (b) adding an **inference smoke test** to the gate so readiness means "a real job produced a real output," not "a directory exists." (Happy to implement that smoke-test/gate hardening on request.)

## 5. A. Local model runtime (`local_ai`)

1. Create a model directory and extract real checkpoints into it (face-mesh topology, frame-generation weights, etc.):
   ```bash
   mkdir -p /var/lib/mahavisphot/models
   # extract your real checkpoints into /var/lib/mahavisphot/models
   ```
2. Point the runtime at it in your shell init (`~/.bashrc` / `~/.zshrc`):
   ```bash
   export MAHAVISPHOT_MODEL_DIR="/var/lib/mahavisphot/models"
   ```
3. Implement `LocalModelAdapter.infer()` in `editor/ai-runtime.js` to load those weights and run tensor calculations (replacing the throw). Keep the existing job validation, privacy-tier routing, and digest-only audit — they already hold.

**Real success metric:** a `face_swap` / `frame_gen` job submitted to `mode: "local"` returns `status: "completed"` with a genuine output (and a smoke test asserts it), not the deterministic reference stub.

## 6. B. Cloud provider runtime (`cloud_ai`)

1. Provision credentials from your provider.
2. Bind the **correct** variable (the code reads `MAHAVISPHOT_CLOUD_API_KEY`, falling back to `MAHAVISPHOT_PROVIDER_KEY`):
   ```bash
   export MAHAVISPHOT_CLOUD_API_KEY="your_real_provider_key"
   ```
3. Implement `CloudProviderAdapter.infer()` to submit jobs to the provider over HTTPS and record the result. Note: the privacy router will still refuse to route `privacyTier: "local-only"` jobs to this adapter — that enforcement is intentional and must stay.

**Real success metric:** a `mode: "cloud"` job round-trips to the provider and returns a verifiable result; the audit records digests only (never raw input).

## 7. C. Advanced visual parity (VFX / 3D / particles)

Today `renderer-core.js` composites real frames, concurrent dual-script captions, Ken-Burns motion, cinematic grade, and a true-peak-accurate multi-stem audio master — but **not** synthesized particle fields, motion-tracking overlays, or 3D assets. Those are honestly flagged as renderer blockers.

To close this:

1. Extend `renderer-core.js` to parse the VFX/particle/3D node properties from the incoming `mahavisphot.export.v1` manifest (e.g., a `Sufi Ash Drift` particle node).
2. Add headless frame synthesis for those passes (offscreen canvas/WebGL via a headless GL binding, or a native compositor) that draws into the frame sequence **before** the encode pass.
3. Extend the renderer parity test + benchmark to cover the new passes.

**Real success metric:** the headless export reproduces full-resolution imagery containing the synthesized particle/track/3D elements, matching the manifest — verified by a parity test, not asserted by hand.

## 8. The strict release gate

```bash
npm run mahavisphot:release-gate -- --strict-production
```

This re-runs the full sweep — `npm run check`, all 18 suites, live runtime health + telemetry, code-derived constraints, and the Electron launch evidence — and exits non-zero unless `PRODUCTION_READY` is true.

Read §4 first: with only env vars set, `--strict-production` can report ready before real inference exists. Treat a green strict run as authoritative **only after** an adapter `infer()` is implemented and an inference smoke test is part of the gate. Until then, the honest verdict remains:

```
PRODUCTION_READY=false
PHKD_VERDICT=GATE_GREEN__AI_RUNTIMES_HONESTLY_GATED__NOT_PRODUCTION_READY
```

## 9. Summary

The structural product is complete and self-auditing. Reaching `PRODUCTION_READY=true` requires three external, substantive inputs — real local model weights, real cloud credentials *with* a real provider call, and a headless advanced-visual renderer — each paired with an execution-level test so readiness is earned, not signalled. The gate already tells the truth about where the line is.
