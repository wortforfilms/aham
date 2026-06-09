# Electron vs Tauri for Mahavisphot Compositor

## Recommendation

Use Electron for the first standalone desktop milestone. The current compositor is already a static HTML/CSS/JS editor backed by a Node local server for project loading and FFmpeg export, so Electron can wrap the existing runtime with the least rewrite.

Use Tauri when the app needs a smaller signed production binary, tighter native permission boundaries, and a Rust command layer for export, filesystem, model, and GPU-adjacent operations.

## Comparison

| Area | Electron | Tauri |
| --- | --- | --- |
| Current fit | Direct fit for the existing Node server and web UI. | Requires Rust shell and command bridge work. |
| Package size | Larger because Chromium and Node are bundled. | Smaller because it uses the platform WebView. |
| Export pipeline | Can keep the existing Node/FFmpeg server path. | Can expose FFmpeg through Rust commands and allowlists. |
| Security posture | Must keep context isolation, no Node integration in renderer, and local-only server. | Stronger default command allowlisting and native isolation. |
| Delivery speed | Fastest path to a testable desktop build. | Better long-term if native performance and small installers dominate. |

## Prepared Electron Surface

- `package.json` with `npm run electron` / `npm run desktop`
- `electron/main.cjs` boots the editor server and opens the compositor window
- `electron/preload.cjs` exposes a tiny runtime marker with context isolation enabled
- `editor/server.js` can now be imported by Electron or launched directly with Node
