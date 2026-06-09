const http = require("node:http");
const fs = require("node:fs");
const fsp = require("node:fs/promises");
const path = require("node:path");
const { spawn } = require("node:child_process");

const ROOT = path.resolve(__dirname, "..");
const EDITOR_DIR = __dirname;
const PORT = Number(process.env.PORT || 8177);

const AUDIO_FILE = "अहं ब्रह्मास्मि.wav";
const FRAME_DIR = "build_frames/lineup_unique_art2/frames_1080p_jpg";
const KEYFRAME_DIR = "build_frames/mahavisphot_timestamped/keyframes";
const RUBAB_FRAME = "build_frames/lineup_unique_art2/frames_1080p_jpg/frame_0004.jpg";
const GENERATED_TIMELINES = [
  {
    id: "first-generated",
    name: "First Generated Timeline",
    timelinePath: "build_frames/mahavisphot_timestamped/timeline_scaled.tsv",
    metadataPath: "build_frames/mahavisphot_timestamped/timeline_scaled.json",
  },
  {
    id: "prior-board-137-shots",
    name: "Prior Boards 137-Shot Sequence",
    timelinePath: "build_frames/lineup_unique_art2/prior_board_137_shot_timeline.tsv",
    metadataPath: "build_frames/lineup_unique_art2/prior_board_137_shot_timeline.json",
    frameManifestPath: "build_frames/lineup_unique_art2/named_frames_1080p_jpg/named_frames_manifest.json",
  },
];

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".tsv": "text/tab-separated-values; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".mp4": "video/mp4",
  ".wav": "audio/wav",
  ".pdf": "application/pdf",
};

function send(res, status, body, headers = {}) {
  res.writeHead(status, headers);
  res.end(body);
}

function sendJson(res, status, body) {
  send(res, status, JSON.stringify(body, null, 2), {
    "Content-Type": "application/json; charset=utf-8",
  });
}

function safeJoin(base, target) {
  const resolved = path.resolve(base, target);
  if (!resolved.startsWith(base + path.sep) && resolved !== base) {
    throw new Error("Path escapes workspace");
  }
  return resolved;
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
}

function parseTsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines.shift().split("\t");
  return lines.map((line) => {
    const cells = line.split("\t");
    return Object.fromEntries(headers.map((h, i) => [h, cells[i] || ""]));
  });
}

function fileUrl(relPath) {
  return `/assets/${relPath.split(path.sep).join("/")}`;
}

function sceneKeyframePath(row) {
  const frame = String(row.frame).padStart(2, "0");
  const slugMap = {
    1: "01_long_road",
    2: "02_sanskrit_blast",
    3: "03_aggressive_delivery",
    4: "04_structural_shift",
    5: "05_unyielding_stance",
    6: "06_dust_fracture",
    7: "07_pakhtoon_warrior",
    8: "08_shared_tear",
    9: "09_shapit_granth",
    10: "10_ganga_tulsi",
    11: "11_oneness",
    12: "12_brahman_smirk",
    13: "13_empty_space",
    14: "14_vibration_echo",
    15: "15_sanskrit_chant",
    16: "16_final_silence",
  };
  const slug = slugMap[Number(row.frame)] || "";
  const candidate = path.join(KEYFRAME_DIR, `keyframe_${frame}_${slug}.jpg`);
  if (fs.existsSync(path.join(ROOT, candidate))) {
    return candidate;
  }
  return null;
}

async function readTimelineMetadata(timelineConfig) {
  try {
    return JSON.parse(await fsp.readFile(path.join(ROOT, timelineConfig.metadataPath), "utf8"));
  } catch {
    return {};
  }
}

function timelineConfigById(id) {
  return GENERATED_TIMELINES.find((timeline) => timeline.id === id) || GENERATED_TIMELINES[0];
}

async function getProject(timelineId = "first-generated") {
  const timelineConfig = timelineConfigById(timelineId);
  const timelinePath = path.join(ROOT, timelineConfig.timelinePath);
  const indexPath = path.join(ROOT, "build_sheets/mahavisphot_production/sheet_index.tsv");
  const manifestPath = path.join(ROOT, timelineConfig.frameManifestPath || "build_frames/lineup_unique_art2/manifest.json");

  const timeline = parseTsv(await fsp.readFile(timelinePath, "utf8"));
  const timelineMetadata = await readTimelineMetadata(timelineConfig);
  const sheetIndex = parseTsv(await fsp.readFile(indexPath, "utf8"));
  const manifest = JSON.parse(await fsp.readFile(manifestPath, "utf8"));

  const frames = manifest.frames.map((frame) => {
    const framePath = frame.frame_1080p || frame.new_file || frame.old_file;
    return {
      index: frame.index,
      source: frame.source || frame.old_file || "",
      row: frame.row || "",
      col: frame.col || "",
      title: frame.title || "",
      note: frame.description || "",
      image: fileUrl(framePath),
      path: framePath,
    };
  });

  const references = sheetIndex.map((item) => ({
    sheet: item.sheet,
    slot: Number(item.slot),
    frameIndex: Number(item.frame_index),
    title: item.title,
    note: item.note,
    image: fileUrl(item.source_image),
    path: item.source_image,
  }));

  const defaultOverlayScenes = new Set([3, 7, 10, 16]);
  const scenes = timeline.map((row) => {
    const source = row.source;
    const frameIndex = Number(source);
    const keyframePath = sceneKeyframePath(row);
    const imagePath = row.image_path || keyframePath || `${FRAME_DIR}/frame_${String(frameIndex).padStart(4, "0")}.jpg`;
    const explicitOverlay = String(row.rubab_overlay || "").toLowerCase();
    const rubabOverlay = explicitOverlay
      ? ["yes", "true", "1", "on"].includes(explicitOverlay)
      : defaultOverlayScenes.has(Number(row.frame));
    const effects = String(row.effects || "")
      .split(",")
      .map((effect) => effect.trim())
      .filter(Boolean);
    return {
      id: Number(row.frame),
      start: Number(row.start),
      end: Number(row.end),
      duration: Number(row.duration),
      titleHi: row.title_hi,
      titleEn: row.title_en,
      source,
      frameIndex: Number.isFinite(frameIndex) ? frameIndex : null,
      imagePath,
      image: fileUrl(imagePath),
      rubabOverlay,
      note: row.note || "",
      effects: effects.length
        ? {
          grain: effects.includes("grain"),
          vignette: effects.includes("vignette"),
          dust: effects.includes("dust"),
          sonic: effects.includes("sonic"),
        }
        : undefined,
    };
  });

  return {
    timeline: {
      id: timelineConfig.id,
      name: timelineConfig.name,
      path: timelineConfig.timelinePath,
      metadataPath: timelineConfig.metadataPath,
      note: timelineMetadata.note || "",
      scaleFactor: timelineMetadata.scale_factor_for_frames_1_to_15 || null,
      shotCount: timelineMetadata.shot_count || scenes.length,
    },
    duration: timelineMetadata.audio_duration_seconds || 201.84,
    audio: {
      path: AUDIO_FILE,
      url: fileUrl(AUDIO_FILE),
      duration: 201.84,
    },
    rubab: {
      path: RUBAB_FRAME,
      url: fileUrl(RUBAB_FRAME),
    },
    frames,
    references,
    scenes,
    exportsUrl: "/assets/exports",
  };
}

function coerceScene(scene, fallbackIndex) {
  const start = Number(scene.start);
  const end = Number(scene.end);
  const frameIndex = scene.frameIndex == null ? null : Number(scene.frameIndex);
  const imagePath = String(scene.imagePath || "").trim();
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
    throw new Error(`Invalid scene timing at scene ${fallbackIndex + 1}`);
  }
  if (!imagePath) {
    throw new Error(`Missing image path at scene ${fallbackIndex + 1}`);
  }
  return {
    id: Number(scene.id || fallbackIndex + 1),
    start,
    end,
    duration: end - start,
    titleHi: String(scene.titleHi || ""),
    titleEn: String(scene.titleEn || ""),
    frameIndex: Number.isFinite(frameIndex) ? frameIndex : null,
    imagePath,
    rubabOverlay: Boolean(scene.rubabOverlay),
    note: String(scene.note || ""),
    transition: {
      type: String(scene.transition?.type || "cut"),
      duration: Number(scene.transition?.duration || 0),
    },
  };
}

async function createConcatFile(exportDir, scenes) {
  const concatPath = path.join(exportDir, "timeline.concat.txt");
  const lines = [];
  for (const scene of scenes) {
    const imagePath = safeJoin(ROOT, scene.imagePath);
    await fsp.access(imagePath, fs.constants.R_OK);
    lines.push(`file '${imagePath.replace(/'/g, "'\\''")}'`);
    lines.push(`duration ${scene.duration.toFixed(9)}`);
  }
  const lastImage = safeJoin(ROOT, scenes[scenes.length - 1].imagePath);
  lines.push(`file '${lastImage.replace(/'/g, "'\\''")}'`);
  await fsp.writeFile(concatPath, `${lines.join("\n")}\n`, "utf8");
  return concatPath;
}

function ffmpegArgs({ concatPath, audioPath, outputPath, duration, overlayWindows, rubabPath }) {
  const args = [
    "-y",
    "-hide_banner",
    "-f",
    "concat",
    "-safe",
    "0",
    "-i",
    concatPath,
    "-i",
    audioPath,
  ];

  if (overlayWindows.length) {
    const enable = overlayWindows
      .map((window) => `between(t,${window.start.toFixed(3)},${window.end.toFixed(3)})`)
      .join("+");
    args.push("-loop", "1", "-framerate", "24", "-t", duration.toFixed(3), "-i", rubabPath);
    args.push(
      "-filter_complex",
      `[2:v]scale=720:405,format=rgba,colorchannelmixer=aa=0.93,drawbox=x=0:y=0:w=iw:h=ih:color=white@0.70:t=4[rubab];[0:v][rubab]overlay=x=W-w-54:y=H-h-54:enable='${enable}',fps=24,format=yuv420p[v]`,
      "-map",
      "[v]",
      "-map",
      "1:a:0"
    );
  } else {
    args.push("-map", "0:v:0", "-map", "1:a:0", "-vf", "fps=24,format=yuv420p");
  }

  args.push(
    "-t",
    duration.toFixed(3),
    "-shortest",
    "-c:v",
    "libx264",
    "-preset",
    "medium",
    "-crf",
    "18",
    "-c:a",
    "aac",
    "-b:a",
    "192k",
    "-movflags",
    "+faststart",
    outputPath
  );
  return args;
}

function runFfmpeg(args) {
  return new Promise((resolve, reject) => {
    const child = spawn("ffmpeg", args, { cwd: ROOT });
    let stderr = "";
    child.stderr.on("data", (data) => {
      stderr += data.toString();
      if (stderr.length > 24000) stderr = stderr.slice(-24000);
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve(stderr);
      else reject(new Error(stderr || `ffmpeg exited with code ${code}`));
    });
  });
}

async function handleExport(req, res) {
  try {
    const raw = await readBody(req);
    const payload = JSON.parse(raw || "{}");
    const scenes = (payload.scenes || []).map(coerceScene).sort((a, b) => a.start - b.start);
    if (!scenes.length) throw new Error("No scenes to export");

    const duration = Number(payload.duration || Math.max(...scenes.map((scene) => scene.end)));
    if (!Number.isFinite(duration) || duration <= 0) throw new Error("Invalid export duration");

    const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\..+/, "");
    const exportName = `editor_export_${stamp}`;
    const exportRelDir = path.join("exports", exportName);
    const exportDir = path.join(ROOT, exportRelDir);
    await fsp.mkdir(exportDir, { recursive: true });

    const concatPath = await createConcatFile(exportDir, scenes);
    const audioPath = safeJoin(ROOT, String(payload.audioPath || AUDIO_FILE));
    const rubabPath = safeJoin(ROOT, String(payload.rubabPath || RUBAB_FRAME));
    const outputPath = path.join(exportDir, "mahavisphot_editor_export.mp4");
    const projectPath = path.join(exportDir, "project.json");

    const overlayWindows = scenes
      .filter((scene) => scene.rubabOverlay)
      .map((scene) => ({ start: scene.start, end: scene.end }));

    const project = {
      createdAt: new Date().toISOString(),
      duration,
      audioPath: path.relative(ROOT, audioPath),
      rubabPath: path.relative(ROOT, rubabPath),
      scenes,
      overlayWindows,
    };
    await fsp.writeFile(projectPath, JSON.stringify(project, null, 2), "utf8");

    const args = ffmpegArgs({
      concatPath,
      audioPath,
      outputPath,
      duration,
      overlayWindows,
      rubabPath,
    });
    await runFfmpeg(args);

    sendJson(res, 200, {
      ok: true,
      exportName,
      video: fileUrl(path.relative(ROOT, outputPath)),
      project: fileUrl(path.relative(ROOT, projectPath)),
      concat: fileUrl(path.relative(ROOT, concatPath)),
      overlayWindows,
    });
  } catch (error) {
    sendJson(res, 500, {
      ok: false,
      error: error.message || String(error),
    });
  }
}

async function serveStatic(req, res) {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    let filePath;
    if (url.pathname === "/" || url.pathname === "/editor") {
      filePath = path.join(EDITOR_DIR, "index.html");
    } else if (url.pathname.startsWith("/assets/")) {
      filePath = safeJoin(ROOT, decodeURIComponent(url.pathname.slice("/assets/".length)));
    } else {
      filePath = safeJoin(EDITOR_DIR, decodeURIComponent(url.pathname.slice(1)));
    }

    const stat = await fsp.stat(filePath);
    if (stat.isDirectory()) {
      const listing = await fsp.readdir(filePath);
      sendJson(res, 200, listing);
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      "Content-Type": mimeTypes[ext] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    fs.createReadStream(filePath).pipe(res);
  } catch (error) {
    send(res, 404, "Not found", { "Content-Type": "text/plain; charset=utf-8" });
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (req.method === "GET" && url.pathname === "/api/timelines") {
    sendJson(res, 200, {
      timelines: GENERATED_TIMELINES.map((timeline, index) => ({
        id: timeline.id,
        name: timeline.name,
        path: timeline.timelinePath,
        metadataPath: timeline.metadataPath,
        rank: index + 1,
      })),
    });
    return;
  }
  if (req.method === "GET" && url.pathname === "/api/project") {
    try {
      sendJson(res, 200, await getProject(url.searchParams.get("timeline") || "first-generated"));
    } catch (error) {
      sendJson(res, 500, { ok: false, error: error.message || String(error) });
    }
    return;
  }
  if (req.method === "POST" && url.pathname === "/api/export") {
    await handleExport(req, res);
    return;
  }
  await serveStatic(req, res);
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Mahavisphot editor: http://127.0.0.1:${PORT}`);
});
