import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const downloadsRoot = path.join(os.homedir(), "Downloads");
const outputRoot = path.join(repoRoot, "public", "mahavisphot", "extracted", "reference-views");
const framesRoot = path.join(outputRoot, "frames");
const docsRoot = path.join(repoRoot, "docs", "mahavisphot");
const evidenceRoot = path.join(docsRoot, "evidence");
const manifestPath = path.join(outputRoot, "manifest.json");
const tsvPath = path.join(outputRoot, "manifest.tsv");
const htmlPath = path.join(outputRoot, "index.html");
const docPath = path.join(docsRoot, "EXTRACTED_REFERENCE_VIEWS.md");
const evidencePath = path.join(evidenceRoot, "latest-reference-extraction-evidence.json");
const cropPlanPath = path.join(outputRoot, "crop-plan.json");
const expectedFrameCount = 56;

const sourceImages = [
  {
    id: "view-modules-gallery",
    title: "Total View Modules Gallery",
    path: path.join(downloadsRoot, "Gemini_Generated_Image_uvoo0yuvoo0yuvoo.png"),
    width: 2492,
    height: 1696,
  },
  {
    id: "compositor-pro-v3",
    title: "Compositor Pro v3 Interface",
    path: path.join(downloadsRoot, "Gemini_Generated_Image_pj4kq4pj4kq4pj4k (1).png"),
    width: 2492,
    height: 1696,
  },
  {
    id: "compositor-pro-gen2",
    title: "Compositor Pro Gen 2 Interface",
    path: path.join(downloadsRoot, "Gemini_Generated_Image_71d6b571d6b571d6.png"),
    width: 2492,
    height: 1696,
  },
];

const rawFrames = [
  ["view-modules-gallery", "Source Monitor", "editor", [40, 95, 380, 415]],
  ["view-modules-gallery", "Program Monitor", "editor", [435, 100, 395, 410]],
  ["view-modules-gallery", "Scene List", "editor", [840, 115, 150, 390]],
  ["view-modules-gallery", "Advanced Timeline", "editor", [1000, 120, 415, 390]],
  ["view-modules-gallery", "Hierarchy Scene Graph", "3d", [1458, 110, 222, 400]],
  ["view-modules-gallery", "3D Transform Inspector", "3d", [1685, 105, 240, 405]],
  ["view-modules-gallery", "Three.js Shader Editor", "3d", [1930, 105, 225, 405]],
  ["view-modules-gallery", "UV Texture Editor", "3d", [2160, 105, 285, 405]],
  ["view-modules-gallery", "Neural Motion Tracker", "ai-tracking", [40, 625, 230, 305]],
  ["view-modules-gallery", "Topology Map", "ai-tracking", [285, 625, 220, 305]],
  ["view-modules-gallery", "Anisotropic Depth Map Viewer", "ai-tracking", [520, 620, 360, 310]],
  ["view-modules-gallery", "Particles Gallery", "particles", [1640, 640, 285, 290]],
  ["view-modules-gallery", "Particle Node Graph", "particles", [1940, 640, 250, 290]],
  ["view-modules-gallery", "Parametric Fields", "particles", [2210, 630, 240, 300]],
  ["view-modules-gallery", "Node Graph Composer", "vfx", [40, 1025, 390, 295]],
  ["view-modules-gallery", "Grade Gallery", "vfx", [450, 1030, 380, 290]],
  ["view-modules-gallery", "Particle Graph Processor", "vfx", [860, 1030, 370, 290]],
  ["view-modules-gallery", "Color Wheel Curves View", "color", [1245, 1025, 370, 295]],
  ["view-modules-gallery", "Master Mixer", "audio", [1640, 1030, 248, 290]],
  ["view-modules-gallery", "Audio Track Mixer", "audio", [1905, 1030, 260, 290]],
  ["view-modules-gallery", "Spectrogram Analyzer", "audio", [2185, 1025, 265, 295]],
  ["view-modules-gallery", "Master Mixer Expanded", "audio", [40, 1350, 325, 290]],
  ["view-modules-gallery", "Particle Volume Mixer View", "particles", [385, 1350, 500, 290]],
  ["view-modules-gallery", "Multi View Color Curves", "color", [925, 1350, 313, 290]],
  ["view-modules-gallery", "Multi View Scopes", "color", [1250, 1350, 320, 290]],
  ["view-modules-gallery", "Render Queue", "output", [1640, 1350, 255, 290]],
  ["view-modules-gallery", "Export Settings", "output", [1908, 1350, 277, 290]],
  ["view-modules-gallery", "Telemetry Dashboard", "output", [2200, 1350, 260, 290]],
  ["compositor-pro-v3", "Top Toolbar v3", "layout", [0, 0, 2492, 75]],
  ["compositor-pro-v3", "Scenes Panel v3", "layout", [0, 80, 450, 1075]],
  ["compositor-pro-v3", "Layer Stack v3", "layout", [0, 1160, 452, 465]],
  ["compositor-pro-v3", "Toolbelt v3", "layout", [470, 80, 810, 65]],
  ["compositor-pro-v3", "Scene Graph Floating Panel", "3d", [480, 145, 320, 500]],
  ["compositor-pro-v3", "Viewer Tracking Overlay", "viewer", [805, 145, 1080, 500]],
  ["compositor-pro-v3", "Particles Gallery Floating Panel", "particles", [1288, 480, 587, 675]],
  ["compositor-pro-v3", "Right Inspector Tabs", "inspector", [1925, 80, 561, 160]],
  ["compositor-pro-v3", "Face Replacer Panel", "ai-tracking", [1925, 250, 545, 565]],
  ["compositor-pro-v3", "Texture Fixture Engine", "vfx", [1925, 835, 550, 260]],
  ["compositor-pro-v3", "RGB Waveform Scope", "color", [1925, 1115, 550, 233]],
  ["compositor-pro-v3", "Loudness And Vectorscope Panels", "audio", [1925, 1365, 550, 250]],
  ["compositor-pro-v3", "Timeline Stack v3", "timeline", [465, 735, 1420, 880]],
  ["compositor-pro-v3", "Node Graph Floating Panel", "vfx", [750, 1140, 898, 405]],
  ["compositor-pro-v3", "Bottom Telemetry Bar v3", "telemetry", [465, 1620, 2010, 76]],
  ["compositor-pro-gen2", "Top Toolbar Gen 2", "layout", [0, 0, 2492, 70]],
  ["compositor-pro-gen2", "Scenes Panel Gen 2", "layout", [0, 80, 455, 1085]],
  ["compositor-pro-gen2", "Layer Stack Gen 2", "layout", [0, 1165, 455, 455]],
  ["compositor-pro-gen2", "Program Monitor Gen 2", "viewer", [480, 130, 1405, 520]],
  ["compositor-pro-gen2", "Inspector Pro Rubab Optimizer", "inspector", [1925, 150, 553, 660]],
  ["compositor-pro-gen2", "Secondary Monitor Tracking View", "viewer", [1925, 830, 553, 280]],
  ["compositor-pro-gen2", "RGB Waveform Scope Gen 2", "color", [1925, 1125, 553, 230]],
  ["compositor-pro-gen2", "Loudness Vector Telemetry Gen 2", "audio", [1925, 1370, 553, 255]],
  ["compositor-pro-gen2", "Transport Bar Gen 2", "timeline", [480, 655, 1405, 70]],
  ["compositor-pro-gen2", "Timeline Controls Gen 2", "timeline", [465, 735, 1420, 145]],
  ["compositor-pro-gen2", "Timeline Stack Gen 2", "timeline", [465, 885, 1420, 740]],
  ["compositor-pro-gen2", "Node Graph Composer Floating Gen 2", "vfx", [750, 1140, 898, 408]],
  ["compositor-pro-gen2", "Bottom Telemetry Bar Gen 2", "telemetry", [465, 1620, 2013, 76]],
];

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/three\.js/g, "threejs")
    .replace(/3d/g, "3d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function htmlEscape(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function tsvCell(value) {
  return String(value).replace(/\t/g, " ").replace(/\r?\n/g, " ");
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function sourceById(sourceId) {
  const source = sourceImages.find((candidate) => candidate.id === sourceId);
  if (!source) {
    throw new Error(`Unknown source id: ${sourceId}`);
  }
  return source;
}

function buildFrameEntries() {
  return rawFrames.map(([sourceId, title, category, box], index) => {
    const [x, y, width, height] = box;
    const source = sourceById(sourceId);
    if (x < 0 || y < 0 || width <= 0 || height <= 0 || x + width > source.width || y + height > source.height) {
      throw new Error(`Invalid crop box for ${title}: ${box.join(",")}`);
    }
    const frameNumber = String(index + 1).padStart(3, "0");
    const slug = slugify(title);
    const outputFileName = `frame_${frameNumber}_${slug}.png`;
    return {
      id: `mahavisphot-ref-${frameNumber}-${slug}`,
      index: index + 1,
      title,
      slug,
      category,
      status: "extracted",
      sourceId,
      sourceTitle: source.title,
      sourcePath: source.path,
      sourceImageFileName: path.basename(source.path),
      bbox: { x, y, width, height },
      outputPath: path.join(framesRoot, outputFileName),
      publicPath: `/mahavisphot/extracted/reference-views/frames/${outputFileName}`,
      relativePath: `frames/${outputFileName}`,
    };
  });
}

function assertPlan(frames) {
  if (frames.length !== expectedFrameCount) {
    throw new Error(`Expected ${expectedFrameCount} frames, received ${frames.length}`);
  }
  const ids = new Set(frames.map((frame) => frame.id));
  const outputs = new Set(frames.map((frame) => frame.outputPath));
  if (ids.size !== frames.length) {
    throw new Error("Frame ids are not unique");
  }
  if (outputs.size !== frames.length) {
    throw new Error("Frame output paths are not unique");
  }
}

function writeBlockedEvidence(reason, extra = {}) {
  writeJson(evidencePath, {
    generatedAt: new Date().toISOString(),
    sourceImages: sourceImages.map((source) => ({
      id: source.id,
      path: source.path,
      exists: fs.existsSync(source.path),
      expectedWidth: source.width,
      expectedHeight: source.height,
    })),
    outputRoot,
    manifestPath,
    htmlPath,
    frameCount: 0,
    expectedFrameCount,
    extractionSucceeded: false,
    extractionBlockedReason: reason,
    productionReady: false,
    ...extra,
  });
}

function verifyPythonPillow() {
  const probe = spawnSync(
    "python3",
    ["-c", "from PIL import Image; print('PIL_OK')"],
    { encoding: "utf8" },
  );
  return {
    ok: probe.status === 0 && probe.stdout.includes("PIL_OK"),
    stdout: probe.stdout.trim(),
    stderr: probe.stderr.trim(),
    status: probe.status,
  };
}

function cropFramesWithPython(frames) {
  const pythonProgram = `
import json
import sys
from pathlib import Path
from PIL import Image

plan_path = Path(sys.argv[1])
plan = json.loads(plan_path.read_text(encoding="utf-8"))
images = {}

for source in plan["sourceImages"]:
    source_path = Path(source["path"])
    if not source_path.exists():
        raise SystemExit(f"Missing source image: {source_path}")
    image = Image.open(source_path).convert("RGBA")
    if image.size != (int(source["width"]), int(source["height"])):
        raise SystemExit(f"Unexpected source dimensions for {source_path}: {image.size}")
    images[source["id"]] = image

for frame in plan["frames"]:
    box = frame["bbox"]
    x = int(box["x"])
    y = int(box["y"])
    width = int(box["width"])
    height = int(box["height"])
    out_path = Path(frame["outputPath"])
    out_path.parent.mkdir(parents=True, exist_ok=True)
    cropped = images[frame["sourceId"]].crop((x, y, x + width, y + height))
    cropped.save(out_path, "PNG")
`;

  const crop = spawnSync("python3", ["-c", pythonProgram, cropPlanPath], {
    encoding: "utf8",
    maxBuffer: 1024 * 1024,
  });

  if (crop.status !== 0) {
    throw new Error(`Python crop failed: ${crop.stderr.trim() || crop.stdout.trim()}`);
  }
}

function writeManifest(frames) {
  const manifest = {
    generatedAt: new Date().toISOString(),
    title: "MAHAVISPHOT Reference View Extraction",
    purpose: "Deterministic extraction of visible product and compositor UI panels from supplied reference boards.",
    frameCount: frames.length,
    expectedFrameCount,
    sourceImages: sourceImages.map((source) => ({
      id: source.id,
      title: source.title,
      fileName: path.basename(source.path),
      path: source.path,
      width: source.width,
      height: source.height,
    })),
    frames: frames.map((frame) => ({
      id: frame.id,
      index: frame.index,
      title: frame.title,
      slug: frame.slug,
      category: frame.category,
      status: frame.status,
      sourceId: frame.sourceId,
      sourceTitle: frame.sourceTitle,
      sourceImageFileName: frame.sourceImageFileName,
      bbox: frame.bbox,
      relativePath: frame.relativePath,
      publicPath: frame.publicPath,
    })),
    productionReady: false,
  };

  writeJson(manifestPath, manifest);

  const tsvRows = [
    ["index", "id", "title", "category", "sourceId", "x", "y", "width", "height", "relativePath"],
    ...manifest.frames.map((frame) => [
      frame.index,
      frame.id,
      frame.title,
      frame.category,
      frame.sourceId,
      frame.bbox.x,
      frame.bbox.y,
      frame.bbox.width,
      frame.bbox.height,
      frame.relativePath,
    ]),
  ];
  fs.writeFileSync(tsvPath, `${tsvRows.map((row) => row.map(tsvCell).join("\t")).join("\n")}\n`);

  return manifest;
}

function writeHtml(manifest) {
  const cards = manifest.frames.map((frame) => `
        <article class="frame-card">
          <div class="frame-meta">
            <span>${String(frame.index).padStart(2, "0")}</span>
            <span>${htmlEscape(frame.category)}</span>
          </div>
          <img src="${htmlEscape(frame.relativePath)}" alt="${htmlEscape(frame.title)}">
          <h2>${htmlEscape(frame.title)}</h2>
          <p>${htmlEscape(frame.sourceTitle)} - ${frame.bbox.width}x${frame.bbox.height}</p>
        </article>`).join("");

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>MAHAVISPHOT Extracted Reference Views</title>
    <style>
      :root {
        color-scheme: dark;
        --bg: #090b10;
        --panel: #141822;
        --panel-2: #1d2230;
        --line: #30384d;
        --cyan: #20d7ee;
        --violet: #a873ff;
        --amber: #f2bd58;
        --emerald: #49e08f;
        --text: #e6edf7;
        --muted: #96a1b7;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        background: radial-gradient(circle at 50% 0%, #182233 0%, var(--bg) 52%, #05060a 100%);
        color: var(--text);
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
      }
      header {
        padding: 28px 32px 18px;
        border-bottom: 1px solid var(--line);
        background: linear-gradient(90deg, rgba(32, 215, 238, .14), rgba(168, 115, 255, .10), rgba(73, 224, 143, .08));
      }
      h1 {
        margin: 0 0 8px;
        font-size: 26px;
        letter-spacing: 0;
      }
      .badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 6px 10px;
        border: 1px solid rgba(32, 215, 238, .65);
        border-radius: 4px;
        color: var(--cyan);
        background: rgba(32, 215, 238, .08);
        font-size: 12px;
      }
      main {
        padding: 24px 32px 40px;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
        gap: 16px;
      }
      .frame-card {
        min-width: 0;
        border: 1px solid var(--line);
        background: linear-gradient(180deg, rgba(29, 34, 48, .96), rgba(13, 16, 25, .96));
        border-radius: 6px;
        padding: 10px;
        box-shadow: 0 14px 36px rgba(0, 0, 0, .32);
      }
      .frame-meta {
        display: flex;
        justify-content: space-between;
        gap: 8px;
        color: var(--emerald);
        font-size: 10px;
        text-transform: uppercase;
      }
      img {
        width: 100%;
        height: 160px;
        object-fit: contain;
        display: block;
        margin: 8px 0;
        border: 1px solid rgba(32, 215, 238, .22);
        background: #05060a;
      }
      h2 {
        margin: 0;
        font-size: 13px;
        letter-spacing: 0;
      }
      p {
        margin: 6px 0 0;
        color: var(--muted);
        font-size: 10px;
      }
      footer {
        padding: 16px 32px 28px;
        color: var(--amber);
        border-top: 1px solid var(--line);
        font-size: 11px;
      }
    </style>
  </head>
  <body>
    <header>
      <h1>MAHAVISPHOT Extracted Reference Views</h1>
      <div class="badge">${manifest.frameCount} deterministic panel crops - productionReady=false</div>
    </header>
    <main>
      <section class="grid">
${cards}
      </section>
    </main>
    <footer>MAHAVISPHOT Studio - extracted boards for compositor ingest - PHKD: Production NO-GO until verified runtime evidence</footer>
  </body>
</html>
`;
  fs.writeFileSync(htmlPath, html);
}

function writeDocs(manifest) {
  const sourceList = manifest.sourceImages
    .map((source) => `- ${source.id}: ${source.fileName} (${source.width}x${source.height})`)
    .join("\n");
  const frameList = manifest.frames
    .map((frame) => `${frame.index}. ${frame.title} - ${frame.category} - ${frame.relativePath}`)
    .join("\n");

  const markdown = `# MAHAVISPHOT Extracted Reference Views

## Purpose

This artifact extracts every major visible product panel from the three supplied MAHAVISPHOT reference images into deterministic frame crops for compositor ingest, UI review, and timeline assembly.

## Source Images

${sourceList}

## Generated Files

- \`public/mahavisphot/extracted/reference-views/manifest.json\`
- \`public/mahavisphot/extracted/reference-views/manifest.tsv\`
- \`public/mahavisphot/extracted/reference-views/index.html\`
- \`public/mahavisphot/extracted/reference-views/frames/*.png\`
- \`docs/mahavisphot/evidence/latest-reference-extraction-evidence.json\`

## Frame List

${frameList}

## Generation Command

\`\`\`bash
npm run mahavisphot:extract-refs
\`\`\`

## Honest Status

Extraction completed as deterministic frame crops. Production readiness remains false because this is asset extraction evidence, not runtime renderer, export parity, or AI execution evidence.
`;
  fs.writeFileSync(docPath, markdown);
}

function writeEvidence(manifest) {
  const missingOutputs = manifest.frames
    .map((frame) => path.join(framesRoot, path.basename(frame.relativePath)))
    .filter((filePath) => !fs.existsSync(filePath));

  writeJson(evidencePath, {
    generatedAt: manifest.generatedAt,
    sourceImages: sourceImages.map((source) => ({
      id: source.id,
      path: source.path,
      exists: fs.existsSync(source.path),
      expectedWidth: source.width,
      expectedHeight: source.height,
    })),
    outputRoot,
    framesRoot,
    manifestPath,
    tsvPath,
    htmlPath,
    documentationPath: docPath,
    frameCount: manifest.frameCount,
    expectedFrameCount,
    missingOutputCount: missingOutputs.length,
    extractionSucceeded: missingOutputs.length === 0 && manifest.frameCount === expectedFrameCount,
    extractionBlockedReason: missingOutputs.length === 0 ? null : "One or more crop outputs were not written.",
    productionReady: false,
  });
}

function main() {
  fs.mkdirSync(framesRoot, { recursive: true });
  fs.mkdirSync(evidenceRoot, { recursive: true });

  const missingSources = sourceImages.filter((source) => !fs.existsSync(source.path));
  if (missingSources.length > 0) {
    const reason = `Missing source images: ${missingSources.map((source) => source.path).join(", ")}`;
    writeBlockedEvidence(reason, { missingSourceCount: missingSources.length });
    throw new Error(reason);
  }

  const pillow = verifyPythonPillow();
  if (!pillow.ok) {
    const reason = `Python Pillow is unavailable. stdout=${pillow.stdout} stderr=${pillow.stderr}`;
    writeBlockedEvidence(reason, { pillowProbeStatus: pillow.status });
    throw new Error(reason);
  }

  const frames = buildFrameEntries();
  assertPlan(frames);

  writeJson(cropPlanPath, {
    sourceImages,
    frames,
  });

  cropFramesWithPython(frames);
  const manifest = writeManifest(frames);
  writeHtml(manifest);
  writeDocs(manifest);
  writeEvidence(manifest);

  console.log(`Extracted ${manifest.frameCount} MAHAVISPHOT reference frames`);
  console.log(`Manifest: ${manifestPath}`);
  console.log(`Contact sheet: ${htmlPath}`);
  console.log(`Evidence: ${evidencePath}`);
}

main();
