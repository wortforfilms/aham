import { access, mkdir, stat, writeFile } from "node:fs/promises";
import { constants as fsConstants } from "node:fs";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const execFileAsync = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const boardDir = path.join(root, "public", "mahavisphot", "boards");
const evidenceDir = path.join(root, "docs", "mahavisphot", "evidence");
const boardSvgPath = path.join(boardDir, "mahavisphot-all-frames-board.svg");
const boardHtmlPath = path.join(boardDir, "mahavisphot-all-frames-board.html");
const boardPngPath = path.join(boardDir, "mahavisphot-all-frames-board.png");
const evidencePath = path.join(evidenceDir, "latest-all-frames-board-evidence.json");
const docsPath = path.join(root, "docs", "mahavisphot", "ALL_FRAMES_BOARD.md");
const expectedFrameCount = 24;
const width = 3840;
const height = 2560;
const footerText = "MAHAVISPHOT Studio • 400 UX Views • Local AI • Cloud AI • Hybrid AI • VFX • Animation • Render OS • PHKD: Production NO-GO until verified runtime evidence";

const statusPalette = {
  VERIFIED: { stroke: "#24f2d1", fill: "#0c3b3d", text: "#bffef4" },
  PREVIEW: { stroke: "#9a7bff", fill: "#2b2551", text: "#ded4ff" },
  BLOCKED: { stroke: "#ffb44c", fill: "#3f2a0f", text: "#ffe0a3" },
  PLANNED: { stroke: "#38d47d", fill: "#123721", text: "#c8f9d8" },
};

const frames = [
  ["Landing Page", "VERIFIED", "evidence", "landing"],
  ["Launch Studio", "VERIFIED", "evidence", "launch"],
  ["Studio Dashboard", "PREVIEW", "schema", "dashboard"],
  ["Project OS", "VERIFIED", "evidence", "project"],
  ["Timeline Editor", "PREVIEW", "schema", "timeline"],
  ["Compositor", "PREVIEW", "schema", "compositor"],
  ["VFX Studio", "BLOCKED", "runtime", "vfx"],
  ["Motion Tracking", "BLOCKED", "runtime", "tracking"],
  ["Face Studio", "PLANNED", "schema", "face"],
  ["Digital Makeup", "PLANNED", "schema", "makeup"],
  ["Costume Studio", "PLANNED", "schema", "costume"],
  ["Props Studio", "PLANNED", "schema", "props"],
  ["Particle Studio", "PREVIEW", "schema", "particles"],
  ["3D Studio", "PREVIEW", "schema", "three"],
  ["Toon Designer", "PREVIEW", "schema", "toon"],
  ["Cel Animation", "PREVIEW", "schema", "cel"],
  ["Comic Studio", "PLANNED", "schema", "comic"],
  ["Audio Studio", "PREVIEW", "schema", "audio"],
  ["Color Studio", "PREVIEW", "schema", "color"],
  ["XR Studio", "PLANNED", "schema", "xr"],
  ["Local AI Mode", "BLOCKED", "runtime", "local-ai"],
  ["Cloud AI Mode", "BLOCKED", "runtime", "cloud-ai"],
  ["Hybrid AI Mode", "BLOCKED", "runtime", "hybrid-ai"],
  ["Render Observatory", "VERIFIED", "evidence", "render"],
].map(([title, status, badge, kind], index) => ({
  index: index + 1,
  title,
  status,
  badge,
  kind,
}));

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function rect(x, y, w, h, fill, stroke = "#2b3448", attrs = "") {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${fill}" stroke="${stroke}" ${attrs}/>`;
}

function line(x1, y1, x2, y2, stroke = "#24d7ff", attrs = "") {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" ${attrs}/>`;
}

function text(x, y, value, cls = "micro", attrs = "") {
  return `<text x="${x}" y="${y}" class="${cls}" ${attrs}>${escapeXml(value)}</text>`;
}

function chip(x, y, value, palette) {
  return `<g>${rect(x, y, 112, 28, palette.fill, palette.stroke, `stroke-width="1.4"`)}${text(x + 56, y + 19, value, "chip-text", `text-anchor="middle" fill="${palette.text}"`)}</g>`;
}

function badge(x, y, value) {
  const label = value === "evidence" ? "EVIDENCE" : value === "runtime" ? "RUNTIME GATE" : "SCHEMA v1";
  const color = value === "evidence" ? "#24f2d1" : value === "runtime" ? "#ffb44c" : "#9a7bff";
  return `<g>${rect(x, y, 122, 28, "#111928", color, `stroke-width="1"`)}${text(x + 61, y + 19, label, "chip-text", `text-anchor="middle" fill="${color}"`)}</g>`;
}

function rails(x, y, w, count, color) {
  const gap = w / count;
  return Array.from({ length: count + 1 }, (_, index) => line(x + index * gap, y, x + index * gap, y + 54, color, `stroke-width=".8" opacity=".32"`)).join("");
}

function timeline(x, y, w, labels = ["V1", "V2", "A1"]) {
  const rows = labels.map((label, index) => {
    const ry = y + index * 32;
    const c1 = index % 2 ? "#9a7bff" : "#24d7ff";
    const c2 = index === 2 ? "#38d47d" : "#ffb44c";
    return `<g>${text(x, ry + 22, label, "micro-dim")}${rect(x + 34, ry, w - 34, 24, "#0c111d", "#253049", `stroke-width="1"`)}${rect(x + 48 + index * 12, ry + 4, 98, 16, c1, c1, `opacity=".58"`)}${rect(x + 176 + index * 18, ry + 4, 130, 16, c2, c2, `opacity=".45"`)}${index === 2 ? waveform(x + 52, ry + 7, 260, 10, "#38d47d") : ""}</g>`;
  }).join("");
  return `<g>${rows}${line(x + 154, y - 6, x + 154, y + labels.length * 32, "#ff4f8b", `stroke-width="4"`)}${rails(x + 34, y - 8, w - 34, 8, "#5e6984")}</g>`;
}

function waveform(x, y, w, h, color) {
  return Array.from({ length: 22 }, (_, index) => {
    const bw = 4;
    const bh = 3 + ((index * 7) % 11);
    return `<rect x="${x + index * (w / 22)}" y="${y + h - bh}" width="${bw}" height="${bh}" rx="2" fill="${color}" opacity=".82"/>`;
  }).join("");
}

function nodeGraph(x, y, compact = false) {
  const nodes = [
    [x, y + 26, 92, 50, "Plate", "#24d7ff"],
    [x + 130, y, 110, 62, "Grade", "#9a7bff"],
    [x + 286, y + 34, 120, 56, "Composite", "#ffb44c"],
    [x + 152, y + 96, 114, 50, compact ? "Mask" : "Tracker", "#38d47d"],
  ];
  const body = nodes.map(([nx, ny, nw, nh, label, color]) => `<g>${rect(nx, ny, nw, nh, "#101723", color, `stroke-width="1.6"`)}${text(nx + 12, ny + 22, label, "micro", `fill="${color}"`)}${line(nx + 12, ny + nh - 14, nx + nw - 14, ny + nh - 14, color, `stroke-width="3" opacity=".48"`)}</g>`).join("");
  const links = [
    line(x + 92, y + 50, x + 130, y + 32, "#8792aa", `stroke-width="2"`),
    line(x + 240, y + 32, x + 286, y + 58, "#8792aa", `stroke-width="2"`),
    line(x + 266, y + 120, x + 286, y + 70, "#8792aa", `stroke-width="2"`),
  ].join("");
  return `<g>${links}${body}</g>`;
}

function inspector(x, y, title = "Inspector") {
  const sliders = Array.from({ length: 4 }, (_, index) => {
    const sy = y + 52 + index * 32;
    return `<g>${text(x + 18, sy + 5, ["Scale", "Blend", "Seed", "Gain"][index], "micro-dim")}${line(x + 96, sy, x + 224, sy, "#2f3b53", `stroke-width="7"`)}${line(x + 96, sy, x + 140 + index * 21, sy, "#24d7ff", `stroke-width="7"`)}<circle cx="${140 + index * 21}" cy="${sy}" r="8" fill="#24d7ff"/></g>`;
  }).join("");
  return `<g>${rect(x, y, 258, 188, "#0e1420", "#2e3a54")}${text(x + 18, y + 26, title, "panel-title")}${sliders}</g>`;
}

function cardStack(x, y, count = 4, color = "#24d7ff") {
  return Array.from({ length: count }, (_, index) => {
    const cx = x + (index % 2) * 128;
    const cy = y + Math.floor(index / 2) * 82;
    return `<g>${rect(cx, cy, 112, 66, "#101723", color, `stroke-width="1.3"`)}${rect(cx + 12, cy + 12, 30, 24, color, color, `opacity=".38"`)}${line(cx + 52, cy + 18, cx + 96, cy + 18, "#a8b2c7", `stroke-width="3"`)}${line(cx + 52, cy + 34, cx + 88, cy + 34, "#5e6984", `stroke-width="3"`)}${line(cx + 12, cy + 52, cx + 96, cy + 52, color, `stroke-width="2" opacity=".55"`)}</g>`;
  }).join("");
}

function telemetry(x, y) {
  const bars = Array.from({ length: 32 }, (_, index) => {
    const bh = 10 + ((index * 13) % 68);
    const color = index < 11 ? "#24d7ff" : index < 22 ? "#38d47d" : "#ffb44c";
    return `<rect x="${x + index * 8}" y="${y + 84 - bh}" width="5" height="${bh}" fill="${color}" opacity=".74"/>`;
  }).join("");
  return `<g>${rect(x - 14, y - 18, 300, 124, "#0d1320", "#2e3a54")}${bars}${line(x, y + 84, x + 254, y + 84, "#5e6984", `stroke-width="1"`)}${text(x, y + 108, "GPU 62%  RAM 4.1GB  LUFS -14", "micro-dim")}</g>`;
}

function aiPanel(x, y, mode) {
  const color = mode === "local" ? "#38d47d" : mode === "cloud" ? "#24d7ff" : "#9a7bff";
  const nodes = Array.from({ length: 9 }, (_, index) => {
    const nx = x + 36 + (index % 3) * 70;
    const ny = y + 34 + Math.floor(index / 3) * 48;
    return `<circle cx="${nx}" cy="${ny}" r="14" fill="#101723" stroke="${color}" stroke-width="3"/>`;
  }).join("");
  const links = [
    line(x + 36, y + 34, x + 106, y + 82, color, `stroke-width="1.4" opacity=".6"`),
    line(x + 106, y + 34, x + 176, y + 82, color, `stroke-width="1.4" opacity=".6"`),
    line(x + 36, y + 130, x + 176, y + 34, color, `stroke-width="1.4" opacity=".6"`),
    line(x + 106, y + 130, x + 176, y + 82, color, `stroke-width="1.4" opacity=".6"`),
  ].join("");
  return `<g>${rect(x, y, 252, 184, "#0e1420", color, `stroke-width="1.5"`)}${links}${nodes}${text(x + 22, y + 164, `${mode.toUpperCase()} ADAPTER`, "micro", `fill="${color}"`)}</g>`;
}

function drawModule(kind, x, y) {
  switch (kind) {
    case "landing":
      return `<g>${rect(x, y, 402, 190, "#0b1220", "#24d7ff")}${text(x + 26, y + 54, "Hero", "module-head")}${line(x + 26, y + 80, x + 260, y + 80, "#24d7ff", `stroke-width="8"`)}${cardStack(x + 24, y + 110, 3, "#9a7bff")}</g>`;
    case "launch":
      return `<g>${cardStack(x, y, 6, "#24d7ff")}${telemetry(x + 274, y + 38)}</g>`;
    case "dashboard":
      return `<g>${telemetry(x, y)}${cardStack(x + 316, y, 4, "#38d47d")}</g>`;
    case "project":
      return `<g>${cardStack(x, y, 4, "#ffb44c")}${inspector(x + 286, y, "Project")}</g>`;
    case "timeline":
      return timeline(x, y + 30, 470, ["V3", "V2", "V1", "A1", "A2"]);
    case "compositor":
      return `<g>${timeline(x, y + 152, 468, ["Plate", "FX", "Matte"])}${nodeGraph(x + 8, y + 8, true)}</g>`;
    case "vfx":
      return `<g>${nodeGraph(x, y + 10)}${inspector(x + 298, y + 78, "VFX")}</g>`;
    case "tracking":
      return `<g>${rect(x, y, 470, 210, "#0d1420", "#24d7ff")}${Array.from({ length: 4 }, (_, i) => `<g>${line(x + 90 + i * 86, y + 56, x + 90 + i * 86, y + 148, "#24d7ff", `stroke-width="3"`)}${line(x + 64 + i * 86, y + 88, x + 116 + i * 86, y + 88, "#24d7ff", `stroke-width="3"`)}<circle cx="${90 + i * 86 + x}" cy="${48 + y}" r="15" fill="none" stroke="#ffb44c" stroke-width="3"/></g>`).join("")}${text(x + 24, y + 190, "skeletal vectors • markerless pass", "micro-dim")}</g>`;
    case "face":
      return `<g>${rect(x, y, 210, 210, "#0d1420", "#9a7bff")}${Array.from({ length: 11 }, (_, i) => `<circle cx="${x + 62 + (i % 4) * 28}" cy="${y + 58 + Math.floor(i / 4) * 35}" r="5" fill="#24d7ff"/>`).join("")}${line(x + 62, y + 94, x + 146, y + 94, "#24d7ff", `stroke-width="2"`)}${inspector(x + 244, y + 14, "Topology")}</g>`;
    case "makeup":
      return `<g>${rect(x, y, 222, 210, "#151020", "#ff6fa3")}${text(x + 24, y + 44, "Face layers", "module-head", `fill="#ff9bc0"`)}${cardStack(x + 248, y + 8, 4, "#ff6fa3")}${waveform(x + 30, y + 146, 164, 42, "#ff6fa3")}</g>`;
    case "costume":
      return `<g>${cardStack(x, y, 4, "#ffb44c")}${rect(x + 284, y, 176, 210, "#101723", "#ffb44c")}${text(x + 306, y + 44, "Wardrobe", "module-head", `fill="#ffcf7b"`)}${["fabric", "palette", "scene", "continuity"].map((v, i) => text(x + 306, y + 82 + i * 28, v, "micro-dim")).join("")}</g>`;
    case "props":
      return `<g>${cardStack(x, y, 6, "#38d47d")}${inspector(x + 286, y + 8, "Prop State")}</g>`;
    case "particles":
      return `<g>${rect(x, y, 470, 210, "#0b1220", "#24d7ff")}${Array.from({ length: 70 }, (_, i) => `<circle cx="${x + 32 + ((i * 59) % 410)}" cy="${y + 28 + ((i * 37) % 150)}" r="${2 + (i % 4)}" fill="${i % 3 === 0 ? "#ffb44c" : i % 3 === 1 ? "#24d7ff" : "#9a7bff"}" opacity=".72"/>`).join("")}${line(x + 34, y + 182, x + 438, y + 182, "#38d47d", `stroke-width="5"`)}${text(x + 34, y + 202, "field operators • turbulence • lifetime", "micro-dim")}</g>`;
    case "three":
      return `<g>${rect(x, y, 470, 210, "#0b1220", "#9a7bff")}${line(x + 235, y + 120, x + 334, y + 70, "#ff4f8b", `stroke-width="5"`)}${line(x + 235, y + 120, x + 138, y + 72, "#24d7ff", `stroke-width="5"`)}${line(x + 235, y + 120, x + 235, y + 30, "#38d47d", `stroke-width="5"`)}${rect(x + 178, y + 88, 116, 78, "#151b2b", "#ffb44c")}${text(x + 26, y + 192, "scene graph • cameras • meshes", "micro-dim")}</g>`;
    case "toon":
      return `<g>${cardStack(x, y, 4, "#9a7bff")}${rect(x + 286, y + 10, 178, 196, "#101723", "#24d7ff")}${text(x + 310, y + 44, "Pose Sheet", "module-head")}${Array.from({ length: 5 }, (_, i) => `<circle cx="${x + 324 + i * 28}" cy="${y + 92 + (i % 2) * 32}" r="12" fill="none" stroke="#24d7ff" stroke-width="3"/>`).join("")}</g>`;
    case "cel":
      return `<g>${timeline(x, y + 20, 470, ["X-Sheet", "Ink", "Paint", "Camera"])}${rect(x + 340, y + 154, 116, 58, "#101723", "#ffb44c")}${text(x + 356, y + 188, "Onion", "micro", `fill="#ffb44c"`)}</g>`;
    case "comic":
      return `<g>${rect(x, y, 470, 210, "#0d1420", "#38d47d")}${[0, 1, 2, 3, 4, 5].map((i) => rect(x + 22 + (i % 3) * 142, y + 22 + Math.floor(i / 3) * 82, 120, 62, "#101723", i % 2 ? "#9a7bff" : "#ffb44c")).join("")}${text(x + 28, y + 198, "panels • balloons • gutters", "micro-dim")}</g>`;
    case "audio":
      return `<g>${rect(x, y, 470, 210, "#0b1220", "#38d47d")}${waveform(x + 24, y + 66, 410, 74, "#38d47d")}${timeline(x + 18, y + 154, 424, ["VO", "MUSIC"])}${text(x + 24, y + 42, "LUFS -14 • stems • rubab cues", "micro", `fill="#38d47d"`)}</g>`;
    case "color":
      return `<g>${telemetry(x, y + 18)}${rect(x + 322, y + 20, 132, 132, "#101723", "#9a7bff")}${circleScope(x + 388, y + 86)}${text(x + 324, y + 190, "waveform • vector • LUT", "micro-dim")}</g>`;
    case "xr":
      return `<g>${rect(x, y, 470, 210, "#0b1220", "#9a7bff")}${rect(x + 44, y + 46, 160, 92, "#101723", "#24d7ff")}${rect(x + 258, y + 46, 160, 92, "#101723", "#24d7ff")}${line(x + 204, y + 92, x + 258, y + 92, "#9a7bff", `stroke-width="5"`)}${text(x + 80, y + 178, "headset review • spatial audio", "micro-dim")}</g>`;
    case "local-ai":
      return aiPanel(x + 70, y + 12, "local");
    case "cloud-ai":
      return `<g>${aiPanel(x + 70, y + 12, "cloud")}${line(x + 130, y + 30, x + 316, y + 30, "#24d7ff", `stroke-width="3" stroke-dasharray="8 8"`)}</g>`;
    case "hybrid-ai":
      return `<g>${aiPanel(x + 70, y + 12, "hybrid")}${line(x + 80, y + 160, x + 320, y + 58, "#9a7bff", `stroke-width="4"`)}${line(x + 80, y + 58, x + 320, y + 160, "#38d47d", `stroke-width="4"`)} </g>`;
    case "render":
      return `<g>${telemetry(x, y)}${rect(x + 318, y + 8, 142, 192, "#101723", "#ffb44c")}${["queue", "frames", "proof", "NO-GO"].map((v, i) => text(x + 338, y + 48 + i * 36, v, i === 3 ? "micro-alert" : "micro")).join("")}</g>`;
    default:
      return cardStack(x, y, 4, "#24d7ff");
  }
}

function circleScope(cx, cy) {
  const spokes = Array.from({ length: 8 }, (_, i) => {
    const a = (Math.PI * 2 * i) / 8;
    return line(cx, cy, cx + Math.cos(a) * 52, cy + Math.sin(a) * 52, "#38445f", `stroke-width="1"`);
  }).join("");
  return `<g><circle cx="${cx}" cy="${cy}" r="58" fill="none" stroke="#5e6984" stroke-width="2"/>${spokes}<path d="M ${cx - 22} ${cy + 18} C ${cx - 8} ${cy - 38}, ${cx + 24} ${cy - 34}, ${cx + 38} ${cy + 28}" fill="none" stroke="#ffb44c" stroke-width="4"/></g>`;
}

function frameSvg(frame, x, y, w, h) {
  const palette = statusPalette[frame.status];
  return `<g class="board-frame" data-frame-index="${frame.index}" data-frame-title="${escapeXml(frame.title)}" transform="translate(${x} ${y})">
  ${rect(0, 0, w, h, "#0c1019", palette.stroke, `stroke-width="2.2"`)}
  <rect x="0" y="0" width="${w}" height="54" rx="10" fill="#121827" stroke="${palette.stroke}" stroke-width="1.2"/>
  ${text(20, 35, `${String(frame.index).padStart(2, "0")} · ${frame.title}`, "frame-title")}
  ${chip(w - 138, 13, frame.status, palette)}
  ${badge(18, h - 48, frame.badge)}
  ${drawModule(frame.kind, 52, 96)}
  <rect x="${w - 190}" y="${h - 48}" width="168" height="28" rx="8" fill="#0a0f18" stroke="#2f3b53"/>
  ${text(w - 106, h - 29, "nodes • cards • graph", "chip-text", `text-anchor="middle" fill="#8792aa"`)}
</g>`;
}

function generateSvg() {
  const marginX = 70;
  const gridY = 206;
  const gapX = 26;
  const gapY = 28;
  const cellW = 595;
  const cellH = 488;
  const frameMarkup = frames.map((frame, index) => {
    const col = index % 6;
    const row = Math.floor(index / 6);
    return frameSvg(frame, marginX + col * (cellW + gapX), gridY + row * (cellH + gapY), cellW, cellH);
  }).join("\n");

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="Mahavisphot all frames product board">
<defs>
  <linearGradient id="boardBack" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#06070b"/>
    <stop offset=".44" stop-color="#101424"/>
    <stop offset="1" stop-color="#070a10"/>
  </linearGradient>
  <radialGradient id="haloCyan" cx=".22" cy=".14" r=".52">
    <stop offset="0" stop-color="#124b61" stop-opacity=".88"/>
    <stop offset="1" stop-color="#06070b" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="haloViolet" cx=".8" cy=".18" r=".6">
    <stop offset="0" stop-color="#311d68" stop-opacity=".82"/>
    <stop offset="1" stop-color="#06070b" stop-opacity="0"/>
  </radialGradient>
</defs>
<style>
  svg { background: #06070b; }
  text { font-family: Arial, Helvetica, sans-serif; letter-spacing: 0; }
  .kicker { font-size: 32px; font-weight: 700; fill: #24d7ff; }
  .title { font-size: 78px; font-weight: 800; fill: #f8fbff; }
  .subtitle { font-size: 31px; fill: #a8b2c7; }
  .frame-title { font-size: 25px; font-weight: 800; fill: #f8fbff; }
  .chip-text { font-size: 13px; font-weight: 800; }
  .panel-title { font-size: 19px; font-weight: 800; fill: #f8fbff; }
  .module-head { font-size: 32px; font-weight: 800; fill: #f8fbff; }
  .micro { font-size: 16px; font-weight: 700; fill: #d9e4f2; }
  .micro-dim { font-size: 15px; font-weight: 700; fill: #8792aa; }
  .micro-alert { font-size: 16px; font-weight: 800; fill: #ffb44c; }
  .footer { font-size: 24px; font-weight: 800; fill: #f6d78b; }
</style>
<rect width="${width}" height="${height}" fill="url(#boardBack)"/>
<rect width="${width}" height="${height}" fill="url(#haloCyan)"/>
<rect width="${width}" height="${height}" fill="url(#haloViolet)"/>
<path d="M80 156 H3760" stroke="#24d7ff" stroke-width="2" opacity=".55"/>
<path d="M80 2390 H3760" stroke="#ffb44c" stroke-width="2" opacity=".55"/>
${text(80, 70, "SOVEREIGN AI/VFX/FILM PRODUCTION SUITE", "kicker")}
${text(78, 142, "MAHAVISPHOT ALL-FRAMES PRODUCT BOARD", "title")}
${text(80, 186, "24 major product frames · deterministic SVG/HTML · local PNG render · runtime evidence remains honest", "subtitle")}
${frameMarkup}
${text(width / 2, 2472, footerText, "footer", `text-anchor="middle"`)}
</svg>
`;
}

function generateHtml() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>MAHAVISPHOT All-Frames Board</title>
    <style>
      :root {
        color-scheme: dark;
        --bg: #06070b;
        --panel: #101424;
        --line: #29354d;
        --text: #f8fbff;
        --muted: #a8b2c7;
        --cyan: #24d7ff;
        --amber: #ffb44c;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        min-height: 100vh;
        font-family: Arial, Helvetica, sans-serif;
        background: var(--bg);
        color: var(--text);
      }
      header, footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        padding: 16px 22px;
        border-bottom: 1px solid var(--line);
        background: var(--panel);
      }
      footer {
        border-top: 1px solid var(--line);
        border-bottom: 0;
        color: var(--muted);
      }
      a { color: var(--cyan); text-decoration: none; font-weight: 700; }
      main { padding: 18px; }
      img {
        display: block;
        width: 100%;
        height: auto;
        border: 1px solid var(--line);
        background: #06070b;
      }
      .badge {
        color: var(--amber);
        border: 1px solid var(--amber);
        border-radius: 6px;
        padding: 8px 10px;
        font-size: 12px;
        font-weight: 800;
      }
    </style>
  </head>
  <body>
    <header>
      <strong>MAHAVISPHOT All-Frames Board</strong>
      <span class="badge">PRODUCTION_READY=false</span>
      <a href="./mahavisphot-all-frames-board.png">PNG</a>
    </header>
    <main>
      <img src="./mahavisphot-all-frames-board.svg" alt="MAHAVISPHOT Studio all-frames product board" />
    </main>
    <footer>${escapeXml(footerText)}</footer>
  </body>
</html>
`;
}

function generateDocs() {
  const frameLines = frames.map((frame) => `${frame.index}. ${frame.title} — ${frame.status}`).join("\n");
  return `# MAHAVISPHOT All-Frames Board

## Purpose

This board is a deterministic high-resolution product design image for MAHAVISPHOT Studio. It presents the 24 major product frames as crisp UI miniatures in one 6x4 cinematic interface board.

## File List

- \`public/mahavisphot/boards/mahavisphot-all-frames-board.html\`
- \`public/mahavisphot/boards/mahavisphot-all-frames-board.svg\`
- \`public/mahavisphot/boards/mahavisphot-all-frames-board.png\`
- \`docs/mahavisphot/evidence/latest-all-frames-board-evidence.json\`
- \`scripts/mahavisphot-all-frames-board.mjs\`
- \`tests/mahavisphot-all-frames-board.test.mjs\`

## Frame List

${frameLines}

## Generation Command

\`\`\`bash
npm run mahavisphot:board
\`\`\`

## Evidence Path

\`docs/mahavisphot/evidence/latest-all-frames-board-evidence.json\`

## Honest Status

The board asset is generated locally from deterministic SVG/HTML. Production readiness remains blocked until runtime evidence verifies the full MAHAVISPHOT render, AI, security, and export systems.

PRODUCTION_READY=false
PHKD_VERDICT=BOARD_GENERATED_RUNTIME_STILL_BLOCKED
`;
}

async function commandAvailable(command) {
  try {
    await execFileAsync(command, ["--version"], { timeout: 5000 });
    return true;
  } catch {
    return false;
  }
}

async function firstAvailableRenderer() {
  const candidates = [
    "rsvg-convert",
    "/opt/anaconda3/bin/rsvg-convert",
    "/opt/homebrew/bin/rsvg-convert",
    "/usr/local/bin/rsvg-convert",
  ];
  for (const command of candidates) {
    if (await commandAvailable(command)) {
      return { name: "rsvg-convert", command };
    }
  }
  return null;
}

async function renderPng(renderer) {
  if (!renderer) {
    return { pngGenerated: false, pngBlockedReason: "No local SVG to PNG renderer found. Install rsvg-convert, ImageMagick, or another local renderer and rerun npm run mahavisphot:board." };
  }
  try {
    await execFileAsync(renderer.command, [boardSvgPath, "-o", boardPngPath, "-w", String(width), "-h", String(height)], { timeout: 30000 });
    await access(boardPngPath, fsConstants.R_OK);
    const pngStat = await stat(boardPngPath);
    return {
      pngGenerated: pngStat.isFile() && pngStat.size > 0,
      pngBlockedReason: "",
      renderer: renderer.name,
      pngSizeBytes: pngStat.size,
    };
  } catch (error) {
    return {
      pngGenerated: false,
      pngBlockedReason: `Local PNG renderer failed: ${error.message}`,
      renderer: renderer.name,
    };
  }
}

async function main() {
  await mkdir(boardDir, { recursive: true });
  await mkdir(evidenceDir, { recursive: true });
  const svg = generateSvg();
  const html = generateHtml();
  await writeFile(boardSvgPath, svg, "utf8");
  await writeFile(boardHtmlPath, html, "utf8");
  await writeFile(docsPath, generateDocs(), "utf8");

  const renderer = await firstAvailableRenderer();
  const png = await renderPng(renderer);
  const evidence = {
    generatedAt: new Date().toISOString(),
    boardSvgPath: path.relative(root, boardSvgPath),
    boardHtmlPath: path.relative(root, boardHtmlPath),
    boardPngPath: path.relative(root, boardPngPath),
    frameCount: frames.length,
    expectedFrameCount,
    pngGenerated: png.pngGenerated,
    pngBlockedReason: png.pngGenerated ? "" : png.pngBlockedReason,
    renderer: png.renderer || null,
    pngSizeBytes: png.pngSizeBytes || 0,
    productionReady: false,
  };
  await writeFile(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
  console.log(JSON.stringify({
    ok: frames.length === expectedFrameCount,
    frameCount: frames.length,
    svg: evidence.boardSvgPath,
    html: evidence.boardHtmlPath,
    png: evidence.boardPngPath,
    pngGenerated: evidence.pngGenerated,
    pngBlockedReason: evidence.pngBlockedReason,
    evidence: path.relative(root, evidencePath),
    productionReady: evidence.productionReady,
  }, null, 2));
}

await main();
