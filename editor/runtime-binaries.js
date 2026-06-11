"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { execFileSync, spawn, spawnSync } = require("node:child_process");

const cache = new Map();
const filterCache = new Map();

function envKeys(name) {
  const upper = String(name).toUpperCase();
  return [`MAHAVISPHOT_${upper}_PATH`, `${upper}_PATH`];
}

function cellarCandidates(name) {
  const out = [];
  for (const root of ["/opt/homebrew/Cellar/ffmpeg", "/usr/local/Cellar/ffmpeg"]) {
    try {
      for (const version of fs.readdirSync(root).sort().reverse()) {
        out.push(path.join(root, version, "bin", name));
      }
    } catch {
      /* optional Homebrew layout */
    }
  }
  return out;
}

function candidates(name) {
  const values = [];
  for (const key of envKeys(name)) {
    if (process.env[key]) values.push(process.env[key]);
  }
  values.push(
    name,
    `/opt/homebrew/bin/${name}`,
    `/usr/local/bin/${name}`,
    `/usr/bin/${name}`,
    ...cellarCandidates(name)
  );
  return values;
}

function canExecute(command, args = ["-version"]) {
  try {
    execFileSync(command, args, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function resolveBinary(name) {
  if (cache.has(name)) return cache.get(name);
  for (const candidate of candidates(name)) {
    if (candidate === name || fs.existsSync(candidate)) {
      if (canExecute(candidate)) {
        cache.set(name, candidate);
        return candidate;
      }
    }
  }
  cache.set(name, null);
  return null;
}

function requireBinary(name) {
  const resolved = resolveBinary(name);
  if (!resolved) {
    const err = new Error(`${name} not found on PATH or known Homebrew locations`);
    err.code = "runtime_binary_missing";
    err.binary = name;
    throw err;
  }
  return resolved;
}

function hasBinary(name) {
  return Boolean(resolveBinary(name));
}

function execFile(name, args, options = {}) {
  return execFileSync(requireBinary(name), args, options);
}

function spawnFile(name, args, options = {}) {
  return spawn(requireBinary(name), args, options);
}

function spawnFileSync(name, args, options = {}) {
  return spawnSync(requireBinary(name), args, options);
}

function ffmpegFilterAvailable(filterName) {
  const key = String(filterName || "").trim();
  if (!key) return false;
  if (filterCache.has(key)) return filterCache.get(key);
  let ok = false;
  try {
    const output = execFile("ffmpeg", ["-hide_banner", "-filters"], { encoding: "utf8", maxBuffer: 4 * 1024 * 1024 });
    ok = new RegExp(`\\b${key}\\b`).test(output);
  } catch {
    ok = false;
  }
  filterCache.set(key, ok);
  return ok;
}

module.exports = {
  execFile,
  ffmpegFilterAvailable,
  hasBinary,
  requireBinary,
  resolveBinary,
  spawnFile,
  spawnFileSync,
};
