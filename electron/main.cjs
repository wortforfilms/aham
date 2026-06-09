const { app, BrowserWindow, shell } = require("electron");
const path = require("node:path");
const http = require("node:http");
const crypto = require("node:crypto");
const { startServer } = require("../editor/server.js");

const HOST = "127.0.0.1";
const PORT = Number(process.env.MAHAVISPHOT_PORT || process.env.PORT || 8177);
const APP_URL = `http://${HOST}:${PORT}/`;
const HEALTH_TOKEN = crypto.randomBytes(32).toString("hex");

let mainWindow = null;

function waitForEditor(url, attempts = 80) {
  return new Promise((resolve, reject) => {
    let count = 0;
    const probe = () => {
      count += 1;
      const request = http.get(new URL("/api/health", url), {
        headers: {
          "x-mahavisphot-health-token": HEALTH_TOKEN,
        },
      }, (response) => {
        let body = "";
        response.setEncoding("utf8");
        response.on("data", (chunk) => {
          body += chunk;
        });
        response.on("end", () => {
          try {
            const health = JSON.parse(body || "{}");
            if (response.statusCode === 200 && health.ok && health.app === "mahavisphot-compositor" && health.owned) {
              resolve();
              return;
            }
            retry();
          } catch {
            retry();
          }
        });
      });
      request.on("error", retry);
    };
    const retry = () => {
      if (count >= attempts) {
        reject(new Error(`Editor server did not respond at ${url}`));
        return;
      }
      setTimeout(probe, 150);
    };
    probe();
  });
}

async function bootEditorServer() {
  try {
    await startServer(PORT, HOST, HEALTH_TOKEN);
  } catch (error) {
    if (!String(error?.message || "").includes("EADDRINUSE")) throw error;
  }
  await waitForEditor(APP_URL);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    title: "Mahavisphot Compositor Pro",
    width: 1440,
    height: 940,
    minWidth: 1100,
    minHeight: 760,
    backgroundColor: "#0a0a0f",
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  mainWindow.loadURL(APP_URL);
  mainWindow.once("ready-to-show", () => mainWindow.show());
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });
}

app.whenReady().then(async () => {
  await bootEditorServer();
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
