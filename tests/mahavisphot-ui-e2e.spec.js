/**
 * Mahavisphot Studio visual capture and walkthrough pipeline.
 *
 * This suite treats the browser as a 1920x1080 recording surface: it uses DOM
 * locators only to derive coordinates, then drives the UI through the mouse,
 * keyboard, screenshots, Playwright video, and an explicit playhead matrix.
 */
const { test, expect } = require("@playwright/test");
const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const targetHost = process.env.MAHAVISPHOT_CAPTURE_BASE_URL || "http://127.0.0.1:8177";
const assetsDir = path.join(repoRoot, "docs", "mahavisphot", "manual", "assets");
const automationDir = path.join(repoRoot, "exports", "automation");
const failureDir = path.join(automationDir, "failures");
const metadataPath = path.join(assetsDir, "capture-metadata.json");
const motionMatrixPath = path.join(assetsDir, "playhead-motion-matrix.json");

function ensureDirectories() {
  fs.mkdirSync(assetsDir, { recursive: true });
  fs.mkdirSync(failureDir, { recursive: true });
}

async function centerOf(locator, label) {
  const box = await locator.boundingBox();
  if (!box) throw new Error(`Unable to resolve coordinate box for ${label}`);
  return {
    x: Math.round(box.x + box.width / 2),
    y: Math.round(box.y + box.height / 2),
    box,
  };
}

async function clickCenter(page, locator, label) {
  const point = await centerOf(locator, label);
  await page.mouse.click(point.x, point.y);
  return point;
}

async function typeIntoField(page, locator, label, text) {
  const point = await clickCenter(page, locator, label);
  await page.keyboard.press(process.platform === "darwin" ? "Meta+A" : "Control+A");
  await page.keyboard.type(text);
  return point;
}

async function capture(page, name) {
  const screenshotPath = path.join(assetsDir, name);
  await page.screenshot({
    path: screenshotPath,
    fullPage: false,
    animations: "disabled",
  });
  return screenshotPath;
}

async function readUiState(page) {
  return page.evaluate(() => {
    const text = (selector) => document.querySelector(selector)?.textContent?.trim() || "";
    const rect = (selector) => {
      const node = document.querySelector(selector);
      if (!node) return null;
      const box = node.getBoundingClientRect();
      return {
        x: Number(box.x.toFixed(2)),
        y: Number(box.y.toFixed(2)),
        width: Number(box.width.toFixed(2)),
        height: Number(box.height.toFixed(2)),
      };
    };
    return {
      url: window.location.href,
      title: document.title,
      status: text("#statusText"),
      hud: text("#renderTelemetryHud"),
      playerClock: text("#playerClock"),
      playhead: rect("#playhead"),
      timelineViewport: rect("#timelineViewport"),
      dynamicTracks: document.querySelectorAll("[data-dynamic-track-id]").length,
    };
  });
}

async function streamPlayheadMotion(page) {
  const slider = page.locator("#jogSlider");
  const playhead = page.locator("#playhead");
  await expect(slider).toBeVisible();
  await expect(playhead).toBeVisible();

  const { box } = await centerOf(slider, "timeline jog slider");
  const samples = [];
  for (const ratio of [0.05, 0.18, 0.32, 0.48, 0.66, 0.82]) {
    const x = Math.round(box.x + box.width * ratio);
    const y = Math.round(box.y + box.height / 2);
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x, y, { steps: 4 });
    await page.mouse.up();
    await page.waitForTimeout(120);
    samples.push({
      ratio,
      input: { x, y },
      state: await readUiState(page),
    });
  }
  fs.writeFileSync(motionMatrixPath, JSON.stringify({ schemaVersion: "mahavisphot.playhead-motion.v1", samples }, null, 2));
  return { path: motionMatrixPath, samples: samples.length };
}

function resolveExecutable(name, extraCandidates = []) {
  for (const candidate of extraCandidates) {
    if (candidate && fs.existsSync(candidate)) return candidate;
  }
  const probe = childProcess.spawnSync(name, ["-version"], { stdio: "ignore" });
  return probe.status === 0 ? name : "";
}

function resolveFfmpeg() {
  const candidates = [
    process.env.FFMPEG_PATH,
    "/opt/homebrew/bin/ffmpeg",
    "/usr/local/bin/ffmpeg",
  ];
  const cellar = "/opt/homebrew/Cellar/ffmpeg";
  try {
    for (const version of fs.readdirSync(cellar).sort().reverse()) {
      candidates.push(path.join(cellar, version, "bin", "ffmpeg"));
    }
  } catch (error) {
    /* Homebrew Cellar is optional. */
  }
  return resolveExecutable("ffmpeg", candidates);
}

function convertVideoToMp4(webmPath) {
  const ffmpeg = resolveFfmpeg();
  if (!ffmpeg || !webmPath || !fs.existsSync(webmPath)) {
    return { ok: false, reason: "ffmpeg unavailable or source video missing" };
  }
  const mp4Path = path.join(automationDir, "workspace_walkthrough.mp4");
  const result = childProcess.spawnSync(ffmpeg, [
    "-y",
    "-i",
    webmPath,
    "-c:v",
    "libx264",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    mp4Path,
  ], { encoding: "utf8" });
  if (result.status !== 0) {
    return { ok: false, reason: String(result.stderr || result.stdout || "ffmpeg conversion failed").trim() };
  }
  return { ok: true, path: mp4Path };
}

test.describe("Mahavisphot Studio - visual capture protocol", () => {
  test.beforeAll(() => {
    ensureDirectories();
  });

  test("records landing to NLE walkthrough, screenshots, telemetry state, and playhead matrix", async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      deviceScaleFactor: 1,
      recordVideo: {
        dir: automationDir,
        size: { width: 1920, height: 1080 },
      },
    });
    const page = await context.newPage();
    const pageErrors = [];
    const consoleErrors = [];
    const metadata = {
      schemaVersion: "mahavisphot.ui-capture.v1",
      targetHost,
      startedAt: new Date().toISOString(),
      screenshots: [],
      interactionCoordinates: [],
      pageErrors,
      consoleErrors,
      compile: { status: "not_started" },
      video: { status: "pending" },
    };

    page.on("pageerror", async (exception) => {
      pageErrors.push(exception.message);
      const errPath = path.join(failureDir, `crit_exception_${Date.now()}.png`);
      await page.screenshot({ path: errPath, fullPage: true }).catch(() => {});
    });
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });

    let capturedFailure = false;
    try {
      await page.goto(`${targetHost}/`, { waitUntil: "networkidle" });
      await expect(page).toHaveTitle(/Mahavisphot Studio/);
      metadata.screenshots.push(await capture(page, "01_studio_landing.png"));

      metadata.interactionCoordinates.push({
        label: "open editor",
        ...(await clickCenter(page, page.locator('a[href="/editor"]').first(), "Open Editor link")),
      });
      await page.waitForURL(`${targetHost}/editor`, { timeout: 10000 });
      await page.waitForSelector("#timelineViewport", { timeout: 10000 });
      await page.waitForTimeout(500);

      metadata.interactionCoordinates.push({
        label: "add video layer",
        ...(await clickCenter(page, page.locator("#addVideoLayerBtn"), "add video layer button")),
      });
      await page.waitForTimeout(250);
      metadata.interactionCoordinates.push({
        label: "open projects panel",
        ...(await clickCenter(page, page.locator("#projectPanelTopBtn"), "projects panel button")),
      });
      await page.waitForSelector("#projectNameInput", { timeout: 4000 });
      metadata.interactionCoordinates.push({
        label: "type project name",
        ...(await typeIntoField(page, page.locator("#projectNameInput"), "project name field", "Visual capture walkthrough")),
      });
      metadata.screenshots.push(await capture(page, "02_nle_timeline_workspace.png"));

      metadata.motionMatrix = await streamPlayheadMotion(page);

      metadata.interactionCoordinates.push({
        label: "compile render",
        ...(await clickCenter(page, page.locator("#compileRenderBtn"), "compile render button")),
      });
      metadata.compile.status = "started";
      await expect(page.locator("#renderTelemetryHud")).toBeVisible({ timeout: 5000 });
      await page.waitForTimeout(1100);
      metadata.screenshots.push(await capture(page, "03_telemetry_hud_active.png"));

      await page.waitForFunction(() => {
        const status = document.querySelector("#statusText")?.textContent || "";
        const compileButton = document.querySelector("#compileRenderBtn")?.textContent?.trim() || "";
        return /Renderer compiled|Renderer compile failed/i.test(status) && compileButton === "Compile";
      }, { timeout: 30000 }).catch(() => {});
      await page.waitForTimeout(250);
      metadata.terminalState = await readUiState(page);
      metadata.compile.status = /Renderer compiled/i.test(metadata.terminalState.status) ? "compiled" : "failed_or_timed_out";
      metadata.compile.statusText = metadata.terminalState.status;
      metadata.screenshots.push(await capture(page, "04_render_compile_terminal_state.png"));
    } catch (error) {
      capturedFailure = true;
      metadata.failure = error.message;
      const failSnapshot = path.join(failureDir, `automation_failure_state_${Date.now()}.png`);
      await page.screenshot({ path: failSnapshot, fullPage: true }).catch(() => {});
      metadata.failureSnapshot = failSnapshot;
      throw error;
    } finally {
      const video = page.video();
      await context.close();
      if (video) {
        const recordedVideoFile = await video.path().catch(() => "");
        if (recordedVideoFile) {
          const webmTarget = path.join(automationDir, "workspace_walkthrough.webm");
          fs.mkdirSync(path.dirname(webmTarget), { recursive: true });
          fs.copyFileSync(recordedVideoFile, webmTarget);
          const mp4 = convertVideoToMp4(webmTarget);
          metadata.video = {
            status: mp4.ok ? "webm_and_mp4" : "webm_only",
            webmPath: webmTarget,
            mp4Path: mp4.ok ? mp4.path : null,
            conversionReason: mp4.ok ? null : mp4.reason,
          };
        }
      }
      metadata.completedAt = new Date().toISOString();
      metadata.capturedFailure = capturedFailure;
      fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    }

    expect(metadata.screenshots).toHaveLength(4);
    expect(metadata.pageErrors, metadata.pageErrors.join("\n")).toEqual([]);
  });
});
