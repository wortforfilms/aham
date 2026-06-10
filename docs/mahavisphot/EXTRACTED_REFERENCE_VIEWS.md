# MAHAVISPHOT Extracted Reference Views

## Purpose

This artifact extracts every major visible product panel from the three supplied MAHAVISPHOT reference images into deterministic frame crops for compositor ingest, UI review, and timeline assembly.

## Source Images

- view-modules-gallery: Gemini_Generated_Image_uvoo0yuvoo0yuvoo.png (2492x1696)
- compositor-pro-v3: Gemini_Generated_Image_pj4kq4pj4kq4pj4k (1).png (2492x1696)
- compositor-pro-gen2: Gemini_Generated_Image_71d6b571d6b571d6.png (2492x1696)

## Generated Files

- `public/mahavisphot/extracted/reference-views/manifest.json`
- `public/mahavisphot/extracted/reference-views/manifest.tsv`
- `public/mahavisphot/extracted/reference-views/index.html`
- `public/mahavisphot/extracted/reference-views/frames/*.png`
- `docs/mahavisphot/evidence/latest-reference-extraction-evidence.json`

## Frame List

1. Source Monitor - editor - frames/frame_001_source-monitor.png
2. Program Monitor - editor - frames/frame_002_program-monitor.png
3. Scene List - editor - frames/frame_003_scene-list.png
4. Advanced Timeline - editor - frames/frame_004_advanced-timeline.png
5. Hierarchy Scene Graph - 3d - frames/frame_005_hierarchy-scene-graph.png
6. 3D Transform Inspector - 3d - frames/frame_006_3d-transform-inspector.png
7. Three.js Shader Editor - 3d - frames/frame_007_threejs-shader-editor.png
8. UV Texture Editor - 3d - frames/frame_008_uv-texture-editor.png
9. Neural Motion Tracker - ai-tracking - frames/frame_009_neural-motion-tracker.png
10. Topology Map - ai-tracking - frames/frame_010_topology-map.png
11. Anisotropic Depth Map Viewer - ai-tracking - frames/frame_011_anisotropic-depth-map-viewer.png
12. Particles Gallery - particles - frames/frame_012_particles-gallery.png
13. Particle Node Graph - particles - frames/frame_013_particle-node-graph.png
14. Parametric Fields - particles - frames/frame_014_parametric-fields.png
15. Node Graph Composer - vfx - frames/frame_015_node-graph-composer.png
16. Grade Gallery - vfx - frames/frame_016_grade-gallery.png
17. Particle Graph Processor - vfx - frames/frame_017_particle-graph-processor.png
18. Color Wheel Curves View - color - frames/frame_018_color-wheel-curves-view.png
19. Master Mixer - audio - frames/frame_019_master-mixer.png
20. Audio Track Mixer - audio - frames/frame_020_audio-track-mixer.png
21. Spectrogram Analyzer - audio - frames/frame_021_spectrogram-analyzer.png
22. Master Mixer Expanded - audio - frames/frame_022_master-mixer-expanded.png
23. Particle Volume Mixer View - particles - frames/frame_023_particle-volume-mixer-view.png
24. Multi View Color Curves - color - frames/frame_024_multi-view-color-curves.png
25. Multi View Scopes - color - frames/frame_025_multi-view-scopes.png
26. Render Queue - output - frames/frame_026_render-queue.png
27. Export Settings - output - frames/frame_027_export-settings.png
28. Telemetry Dashboard - output - frames/frame_028_telemetry-dashboard.png
29. Top Toolbar v3 - layout - frames/frame_029_top-toolbar-v3.png
30. Scenes Panel v3 - layout - frames/frame_030_scenes-panel-v3.png
31. Layer Stack v3 - layout - frames/frame_031_layer-stack-v3.png
32. Toolbelt v3 - layout - frames/frame_032_toolbelt-v3.png
33. Scene Graph Floating Panel - 3d - frames/frame_033_scene-graph-floating-panel.png
34. Viewer Tracking Overlay - viewer - frames/frame_034_viewer-tracking-overlay.png
35. Particles Gallery Floating Panel - particles - frames/frame_035_particles-gallery-floating-panel.png
36. Right Inspector Tabs - inspector - frames/frame_036_right-inspector-tabs.png
37. Face Replacer Panel - ai-tracking - frames/frame_037_face-replacer-panel.png
38. Texture Fixture Engine - vfx - frames/frame_038_texture-fixture-engine.png
39. RGB Waveform Scope - color - frames/frame_039_rgb-waveform-scope.png
40. Loudness And Vectorscope Panels - audio - frames/frame_040_loudness-and-vectorscope-panels.png
41. Timeline Stack v3 - timeline - frames/frame_041_timeline-stack-v3.png
42. Node Graph Floating Panel - vfx - frames/frame_042_node-graph-floating-panel.png
43. Bottom Telemetry Bar v3 - telemetry - frames/frame_043_bottom-telemetry-bar-v3.png
44. Top Toolbar Gen 2 - layout - frames/frame_044_top-toolbar-gen-2.png
45. Scenes Panel Gen 2 - layout - frames/frame_045_scenes-panel-gen-2.png
46. Layer Stack Gen 2 - layout - frames/frame_046_layer-stack-gen-2.png
47. Program Monitor Gen 2 - viewer - frames/frame_047_program-monitor-gen-2.png
48. Inspector Pro Rubab Optimizer - inspector - frames/frame_048_inspector-pro-rubab-optimizer.png
49. Secondary Monitor Tracking View - viewer - frames/frame_049_secondary-monitor-tracking-view.png
50. RGB Waveform Scope Gen 2 - color - frames/frame_050_rgb-waveform-scope-gen-2.png
51. Loudness Vector Telemetry Gen 2 - audio - frames/frame_051_loudness-vector-telemetry-gen-2.png
52. Transport Bar Gen 2 - timeline - frames/frame_052_transport-bar-gen-2.png
53. Timeline Controls Gen 2 - timeline - frames/frame_053_timeline-controls-gen-2.png
54. Timeline Stack Gen 2 - timeline - frames/frame_054_timeline-stack-gen-2.png
55. Node Graph Composer Floating Gen 2 - vfx - frames/frame_055_node-graph-composer-floating-gen-2.png
56. Bottom Telemetry Bar Gen 2 - telemetry - frames/frame_056_bottom-telemetry-bar-gen-2.png

## Generation Command

```bash
npm run mahavisphot:extract-refs
```

## Honest Status

Extraction completed as deterministic frame crops. Production readiness remains false because this is asset extraction evidence, not runtime renderer, export parity, or AI execution evidence.
