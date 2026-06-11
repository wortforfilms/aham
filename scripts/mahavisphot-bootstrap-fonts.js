#!/usr/bin/env node
"use strict";
/**
 * Mahavisphot — font bootstrap (sovereign / offline-capable).
 *
 * Ensures a local, repository-contained Devanagari TrueType binary exists at
 *   assets/fonts/system/NotoSansDevanagari-Bold.ttf
 * so the renderer's concurrent caption burn-in rasterizes Hindi glyphs without
 * relying on globally pre-installed host fonts.
 *
 * Behaviour:
 *   - Idempotent: if a valid font already exists on disk, it does nothing.
 *   - Uses only the native `https` + `fs` modules (no third-party deps).
 *   - Downloads to a temp file, validates the TrueType magic + minimum size,
 *     then atomically renames into place (never leaves a partial/corrupt file).
 *   - Defensive: any network/anomaly leaves the local offline fallback intact
 *     and exits 0 (so the gate is never broken just because the host is offline).
 *     Pass --strict to exit non-zero when acquisition fails.
 */
const fs = require("node:fs");
const path = require("node:path");
const https = require("node:https");

const ROOT = path.resolve(__dirname, "..");
const FONT_DIR = path.join(ROOT, "assets", "fonts", "system");
const FONT_NAME = "NotoSansDevanagari-Bold.ttf";
const FONT_PATH = path.join(FONT_DIR, FONT_NAME);
const MIN_BYTES = 50 * 1024; // a real Devanagari TTF is well over 50 KB
const MAX_REDIRECTS = 5;
const TIMEOUT_MS = 20000;

// Open-source (SIL OFL 1.1) Noto Sans Devanagari mirrors, tried in order.
const SOURCES = [
  "https://github.com/notofonts/notofonts.github.io/raw/main/fonts/NotoSansDevanagari/hinted/ttf/NotoSansDevanagari-Bold.ttf",
  "https://raw.githubusercontent.com/notofonts/notofonts.github.io/main/fonts/NotoSansDevanagari/hinted/ttf/NotoSansDevanagari-Bold.ttf",
  "https://raw.githubusercontent.com/google/fonts/main/ofl/notosansdevanagari/NotoSansDevanagari%5Bwdth%2Cwght%5D.ttf",
];

const STRICT = process.argv.includes("--strict");

function log(message) {
  process.stdout.write(`[bootstrap-fonts] ${message}\n`);
}

/** A valid sfnt/TrueType file starts with 0x00010000, 'true', 'ttcf', or 'OTTO'. */
function isTrueType(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length < 4) return false;
  const sig = buffer.readUInt32BE(0);
  const tag = buffer.toString("ascii", 0, 4);
  return sig === 0x00010000 || tag === "true" || tag === "ttcf" || tag === "OTTO";
}

function fontIsValidOnDisk() {
  try {
    if (!fs.existsSync(FONT_PATH)) return false;
    const stat = fs.statSync(FONT_PATH);
    if (!stat.isFile() || stat.size < MIN_BYTES) return false;
    const fd = fs.openSync(FONT_PATH, "r");
    try {
      const head = Buffer.alloc(4);
      fs.readSync(fd, head, 0, 4, 0);
      return isTrueType(head);
    } finally {
      fs.closeSync(fd);
    }
  } catch {
    return false;
  }
}

function download(url, redirectsLeft) {
  return new Promise((resolve, reject) => {
    let settled = false;
    const finish = (fn, value) => { if (!settled) { settled = true; fn(value); } };

    const request = https.get(url, { headers: { "User-Agent": "mahavisphot-bootstrap-fonts" } }, (response) => {
      const status = response.statusCode || 0;
      if ([301, 302, 303, 307, 308].includes(status) && response.headers.location) {
        response.resume();
        if (redirectsLeft <= 0) return finish(reject, new Error("too many redirects"));
        const next = new URL(response.headers.location, url).toString();
        return finish(resolve, download(next, redirectsLeft - 1));
      }
      if (status !== 200) {
        response.resume();
        return finish(reject, new Error(`HTTP ${status}`));
      }
      const chunks = [];
      let bytes = 0;
      response.on("data", (chunk) => {
        chunks.push(chunk);
        bytes += chunk.length;
        if (bytes > 8 * 1024 * 1024) { // 8 MB hard cap — a single static font is far smaller
          request.destroy();
          finish(reject, new Error("font exceeds size cap"));
        }
      });
      response.on("end", () => finish(resolve, Buffer.concat(chunks)));
      response.on("error", (err) => finish(reject, err));
    });

    request.setTimeout(TIMEOUT_MS, () => { request.destroy(new Error(`timeout after ${TIMEOUT_MS}ms`)); });
    request.on("error", (err) => finish(reject, err));
  });
}

async function acquire() {
  fs.mkdirSync(FONT_DIR, { recursive: true });
  let lastError = null;
  for (const url of SOURCES) {
    try {
      log(`fetching ${url}`);
      const buffer = await download(url, MAX_REDIRECTS);
      if (!isTrueType(buffer)) throw new Error("downloaded bytes are not a TrueType/OpenType font");
      if (buffer.length < MIN_BYTES) throw new Error(`downloaded font too small (${buffer.length} bytes)`);
      const tempPath = `${FONT_PATH}.${process.pid}.${Date.now()}.part`;
      fs.writeFileSync(tempPath, buffer);
      fs.renameSync(tempPath, FONT_PATH); // atomic publish
      log(`installed ${path.relative(ROOT, FONT_PATH)} (${buffer.length} bytes)`);
      return true;
    } catch (err) {
      lastError = err;
      log(`source failed: ${err.message}`);
    }
  }
  throw lastError || new Error("no font source succeeded");
}

(async () => {
  if (fontIsValidOnDisk()) {
    log(`already present: ${path.relative(ROOT, FONT_PATH)}`);
    process.exit(0);
  }
  try {
    await acquire();
    process.exit(0);
  } catch (err) {
    log(`acquisition failed: ${err.message}`);
    log("offline fallback remains in effect; renderer keeps fontDevanagariAvailable=false until a font is present.");
    process.exit(STRICT ? 1 : 0);
  }
})();
