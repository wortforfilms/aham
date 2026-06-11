const http = require("node:http");
const fs = require("node:fs");
const fsp = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");
const { spawn } = require("node:child_process");
const crud = require("./crud");
const timeline = require("./timeline-runtime");
const aiRuntimeMod = require("./ai-runtime");
const aiRuntime = aiRuntimeMod.createDefaultRuntime();
const exportSchema = require("./export-schema");
const mediaPipeline = require("./media-pipeline");
const rendererCore = require("./renderer-core");

const ROOT = path.resolve(__dirname, "..");
const EDITOR_DIR = __dirname;
const PUBLIC_DIR = path.join(ROOT, "public");
const PORT = Number(process.env.PORT || 8177);
const DATA_DIR = path.resolve(process.env.MAHAVISPHOT_DATA_DIR || path.join(ROOT, "data"));
const AUTH_FILE = path.join(DATA_DIR, "auth.json");
const PROJECTS_DIR = path.join(DATA_DIR, "projects");
const CRUD_DIR = path.join(DATA_DIR, "crud");
const crudStore = crud.createStore(CRUD_DIR);
const renderEngine = new rendererCore.MahavisphotRenderEngine(ROOT);
const EDITOR_DOCS_DIR = path.join(DATA_DIR, "editor");
const SESSION_COOKIE = "mahavisphot_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 14;
const PASSWORD_ITERATIONS = 120000;
const APP_HEALTH_ID = "mahavisphot-compositor";
let activeHealthToken = process.env.MAHAVISPHOT_HEALTH_TOKEN || "";
let activePort = PORT;

const AUDIO_FILE = "अहं ब्रह्मास्मि.wav";
const FRAME_DIR = "build_frames/lineup_unique_art2/frames_1080p_jpg";
const KEYFRAME_DIR = "build_frames/mahavisphot_timestamped/keyframes";
const RUBAB_FRAME = "build_frames/lineup_unique_art2/frames_1080p_jpg/frame_0004.jpg";
const SAFE_MEDIA_ROOTS = new Map([
  ["build_frames", path.join(ROOT, "build_frames")],
  ["build_audio_separation", path.join(ROOT, "build_audio_separation")],
  ["exports", path.join(ROOT, "exports")],
  ["media", path.join(ROOT, "media")],
]);
const SAFE_ROOT_MEDIA_FILES = new Set([AUDIO_FILE]);
const PLAN_DEFINITIONS = {
  free: {
    label: "Free",
    projectLimit: 3,
    exportTier: "preview",
    seats: 1,
    features: ["local_auth", "project_crud", "json_export"],
  },
  trial: {
    label: "Trial",
    projectLimit: 12,
    exportTier: "mp4-preview",
    seats: 1,
    features: ["local_auth", "project_crud", "mp4_export", "schema_manifest"],
  },
  pro: {
    label: "Pro",
    projectLimit: 60,
    exportTier: "mp4",
    seats: 1,
    features: ["local_auth", "project_crud", "mp4_export", "captions", "vfx_manifest", "compositions"],
  },
  studio: {
    label: "Studio",
    projectLimit: 500,
    exportTier: "uhd-ready",
    seats: 5,
    features: ["local_auth", "project_crud", "mp4_export", "captions", "vfx_manifest", "compositions", "studio_review"],
  },
};
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
  {
    id: "varg-ka-khel",
    name: "Varg Ka Khel Song Edit",
    timelinePath: "media/varg_ka_khel/timeline.tsv",
    metadataPath: "media/varg_ka_khel/timeline.json",
    frameManifestPath: "media/varg_ka_khel/manifest.json",
    audioPath: "media/varg_ka_khel/varg_ka_khel.mp3",
    rubabPath: "media/varg_ka_khel/frames/frame_0001.jpg",
    skipReferences: true,
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
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".mov": "video/quicktime",
  ".wav": "audio/wav",
  ".mp3": "audio/mpeg",
  ".m4a": "audio/mp4",
  ".aac": "audio/aac",
  ".pdf": "application/pdf",
};

function send(res, status, body, headers = {}) {
  res.writeHead(status, headers);
  res.end(body);
}

function sendJson(res, status, body, headers = {}) {
  send(res, status, JSON.stringify(body, null, 2), {
    "Content-Type": "application/json; charset=utf-8",
    ...headers,
  });
}

function safeJoin(base, target) {
  const resolved = path.resolve(base, target);
  if (!resolved.startsWith(base + path.sep) && resolved !== base) {
    throw new Error("Path escapes workspace");
  }
  return resolved;
}

function normalizeAssetPath(assetPath) {
  const normalized = String(assetPath || "").replace(/\\/g, "/").replace(/^\/+/, "");
  const parts = normalized.split("/");
  if (!normalized || normalized.includes("\0") || parts.some((part) => part === "" || part === "." || part === "..")) {
    throw new Error("Invalid media asset path");
  }
  return normalized;
}

function safeMediaAssetPath(assetPath) {
  const normalized = normalizeAssetPath(assetPath);
  if (SAFE_ROOT_MEDIA_FILES.has(normalized)) return path.join(ROOT, normalized);
  const [folder, ...rest] = normalized.split("/");
  const root = SAFE_MEDIA_ROOTS.get(folder);
  if (!root || !rest.length) {
    throw new Error("Asset path is outside the safe media-only folders");
  }
  return safeJoin(root, rest.join("/"));
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
}

async function readJsonFile(filePath, fallback) {
  try {
    return JSON.parse(await fsp.readFile(filePath, "utf8"));
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    return structuredClone(fallback);
  }
}

async function writeJsonFile(filePath, data) {
  await fsp.mkdir(path.dirname(filePath), { recursive: true });
  const tempPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  await fsp.writeFile(tempPath, JSON.stringify(data, null, 2), "utf8");
  await fsp.rename(tempPath, filePath);
}

function parseCookies(req) {
  return Object.fromEntries(
    String(req.headers.cookie || "")
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const index = part.indexOf("=");
        const key = index >= 0 ? part.slice(0, index) : part;
        const value = index >= 0 ? part.slice(index + 1) : "";
        return [key, decodeURIComponent(value)];
      })
  );
}

function sessionCookie(token, maxAge = SESSION_MAX_AGE_SECONDS) {
  return `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; Max-Age=${maxAge}; HttpOnly; SameSite=Lax`;
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function normalizePlan(plan) {
  const value = String(plan || "free").toLowerCase();
  if (value === "creator") return "pro";
  return PLAN_DEFINITIONS[value] ? value : "free";
}

function defaultSubscription(plan = "free") {
  const key = normalizePlan(plan);
  const selected = PLAN_DEFINITIONS[key];
  return {
    plan: key,
    state: key,
    status: key === "trial" ? "trialing" : "active",
    billingMode: "local",
    gateway: "not_connected",
    ...selected,
  };
}

function defaultLicense(plan = "free", userId = "local", issuedAt = null) {
  const key = normalizePlan(plan);
  const seed = `${userId}:${key}`;
  const digest = crypto.createHash("sha256").update(seed).digest("hex");
  const selected = PLAN_DEFINITIONS[key];
  return {
    id: `license_${digest.slice(0, 16)}`,
    key: `LOCAL-${key.toUpperCase()}-${digest.slice(0, 8).toUpperCase()}`,
    status: key === "trial" ? "trialing" : "active",
    tier: key,
    seats: selected.seats,
    exportTier: selected.exportTier,
    issuedAt: issuedAt || new Date().toISOString(),
    expiresAt: key === "trial" ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() : null,
    features: [...selected.features],
  };
}

function ensureUserCommercialState(user) {
  if (!user) return null;
  const plan = normalizePlan(user.subscription?.plan || "free");
  const state = normalizePlan(user.subscription?.state || user.subscription?.plan || plan);
  user.subscription = {
    ...(user.subscription || {}),
    ...defaultSubscription(plan),
    plan,
    state,
  };
  if (!PLAN_DEFINITIONS[user.subscription.state]) user.subscription.state = user.subscription.plan;
  user.license = {
    ...defaultLicense(user.subscription.plan, user.id, user.createdAt),
    ...(user.license || {}),
    tier: normalizePlan(user.license?.tier || user.subscription.plan),
  };
  if (user.license.tier !== user.subscription.plan) {
    user.license = defaultLicense(user.subscription.plan, user.id, new Date().toISOString());
  }
  return user;
}

function publicUser(user) {
  if (!user) return null;
  ensureUserCommercialState(user);
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
    subscription: user.subscription,
    license: user.license,
  };
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(String(password), salt, PASSWORD_ITERATIONS, 32, "sha256").toString("hex");
  return {
    salt,
    hash,
    iterations: PASSWORD_ITERATIONS,
    digest: "sha256",
  };
}

function verifyPassword(password, passwordHash) {
  if (!passwordHash?.salt || !passwordHash?.hash) return false;
  const iterations = Number(passwordHash.iterations) || PASSWORD_ITERATIONS;
  const digest = passwordHash.digest || "sha256";
  const attempt = crypto.pbkdf2Sync(String(password), passwordHash.salt, iterations, 32, digest);
  const expected = Buffer.from(passwordHash.hash, "hex");
  return expected.length === attempt.length && crypto.timingSafeEqual(expected, attempt);
}

async function readAuthStore() {
  const store = await readJsonFile(AUTH_FILE, { users: [], sessions: [] });
  store.users = Array.isArray(store.users) ? store.users : [];
  store.sessions = Array.isArray(store.sessions) ? store.sessions : [];
  return store;
}

async function saveAuthStore(store) {
  await writeJsonFile(AUTH_FILE, {
    users: store.users || [],
    sessions: store.sessions || [],
  });
}

function pruneSessions(store) {
  const now = Date.now();
  store.sessions = (store.sessions || []).filter((session) => Date.parse(session.expiresAt) > now);
}

function createSession(store, userId) {
  pruneSessions(store);
  const token = crypto.randomBytes(32).toString("hex");
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_MAX_AGE_SECONDS * 1000);
  store.sessions.push({
    token,
    userId,
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
  });
  return token;
}

async function currentUserFromRequest(req) {
  const token = parseCookies(req)[SESSION_COOKIE];
  if (!token) return { store: await readAuthStore(), user: null, session: null, token: null };
  const store = await readAuthStore();
  pruneSessions(store);
  const session = store.sessions.find((item) => item.token === token) || null;
  const user = session ? store.users.find((item) => item.id === session.userId) || null : null;
  return { store, user, session, token };
}

async function requireUser(req, res) {
  const auth = await currentUserFromRequest(req);
  if (!auth.user) {
    sendJson(res, 401, { ok: false, error: "Sign in required" });
    return null;
  }
  return auth;
}

async function parseJsonBody(req) {
  const raw = await readBody(req);
  try {
    return raw ? JSON.parse(raw) : {};
  } catch {
    throw new Error("Invalid JSON body");
  }
}

async function handleRegister(req, res) {
  const body = await parseJsonBody(req);
  const email = normalizeEmail(body.email);
  const password = String(body.password || "");
  const name = String(body.name || "").trim() || email.split("@")[0] || "Editor";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Valid email required");
  if (password.length < 8) throw new Error("Password must be at least 8 characters");

  const store = await readAuthStore();
  pruneSessions(store);
  if (store.users.some((user) => user.email === email)) {
    sendJson(res, 409, { ok: false, error: "Account already exists" });
    return;
  }

  const user = {
    id: `user_${crypto.randomUUID()}`,
    email,
    name,
    password: hashPassword(password),
    subscription: defaultSubscription("free"),
    license: null,
    createdAt: new Date().toISOString(),
  };
  user.license = defaultLicense(user.subscription.plan, user.id, user.createdAt);
  store.users.push(user);
  const token = createSession(store, user.id);
  await saveAuthStore(store);
  sendJson(res, 201, { ok: true, user: publicUser(user), subscription: user.subscription, license: user.license }, {
    "Set-Cookie": sessionCookie(token),
  });
}

async function handleLogin(req, res) {
  const body = await parseJsonBody(req);
  const email = normalizeEmail(body.email);
  const password = String(body.password || "");
  const store = await readAuthStore();
  pruneSessions(store);
  const user = store.users.find((item) => item.email === email);
  if (!user || !verifyPassword(password, user.password)) {
    sendJson(res, 401, { ok: false, error: "Invalid email or password" });
    return;
  }
  ensureUserCommercialState(user);
  const token = createSession(store, user.id);
  await saveAuthStore(store);
  sendJson(res, 200, { ok: true, user: publicUser(user), subscription: user.subscription, license: user.license }, {
    "Set-Cookie": sessionCookie(token),
  });
}

async function handleLogout(req, res) {
  const { store, token } = await currentUserFromRequest(req);
  store.sessions = store.sessions.filter((session) => session.token !== token);
  await saveAuthStore(store);
  sendJson(res, 200, { ok: true }, {
    "Set-Cookie": sessionCookie("", 0),
  });
}

async function handleMe(req, res) {
  const { store, user } = await currentUserFromRequest(req);
  if (user) {
    ensureUserCommercialState(user);
    await saveAuthStore(store);
  }
  sendJson(res, 200, {
    ok: true,
    user: publicUser(user),
    subscription: user?.subscription || null,
    license: user?.license || null,
  });
}

async function handleSubscription(req, res) {
  const auth = await requireUser(req, res);
  if (!auth) return;
  ensureUserCommercialState(auth.user);
  if (req.method === "GET") {
    sendJson(res, 200, { ok: true, subscription: auth.user.subscription, license: auth.user.license });
    return;
  }
  const body = await parseJsonBody(req);
  const plan = normalizePlan(body.plan || "free");
  if (!PLAN_DEFINITIONS[plan]) throw new Error("Unknown subscription plan");
  auth.user.subscription = {
    ...defaultSubscription(plan),
    activatedAt: new Date().toISOString(),
  };
  auth.user.license = defaultLicense(plan, auth.user.id, auth.user.subscription.activatedAt);
  await saveAuthStore(auth.store);
  sendJson(res, 200, { ok: true, user: publicUser(auth.user), subscription: auth.user.subscription, license: auth.user.license });
}

function sanitizeProjectId(id) {
  return String(id || "").replace(/[^a-zA-Z0-9_-]/g, "");
}

function userProjectDir(userId) {
  return path.join(PROJECTS_DIR, sanitizeProjectId(userId));
}

function projectPathFor(userId, projectId) {
  const cleanId = sanitizeProjectId(projectId);
  if (!cleanId) throw new Error("Invalid project id");
  return path.join(userProjectDir(userId), `${cleanId}.json`);
}

function projectSummary(project) {
  return {
    id: project.id,
    name: project.name,
    ownerId: project.ownerId,
    licenseId: project.licenseId || "",
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    sceneCount: project.sceneCount || 0,
    duration: project.duration || 0,
    schemaVersion: project.schemaVersion || "",
  };
}

async function readProjectList(userId) {
  const dir = userProjectDir(userId);
  try {
    const files = (await fsp.readdir(dir)).filter((file) => file.endsWith(".json"));
    const projects = [];
    for (const file of files) {
      try {
        const project = JSON.parse(await fsp.readFile(path.join(dir, file), "utf8"));
        projects.push(projectSummary(project));
      } catch {
        // Skip malformed local project files instead of blocking the library.
      }
    }
    return projects.sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

async function readProject(userId, projectId) {
  const project = await readJsonFile(projectPathFor(userId, projectId), null);
  if (!project || project.ownerId !== userId) return null;
  return project;
}

async function writeProject(userId, project) {
  await writeJsonFile(projectPathFor(userId, project.id), project);
}

async function assertProjectCapacity(auth, extra = 1) {
  ensureUserCommercialState(auth.user);
  const limit = Number(auth.user.subscription?.projectLimit || 0);
  if (!limit) return;
  const projects = await readProjectList(auth.user.id);
  if (projects.length + extra > limit) {
    throw new Error(`${auth.user.subscription.label} plan allows ${limit} saved projects`);
  }
}

function buildProjectRecord(userId, body, existing = null) {
  const payload = body.payload || existing?.payload || null;
  if (!payload || typeof payload !== "object") throw new Error("Project payload required");
  const edit = payload.edit || payload;
  const name = String(body.name || existing?.name || edit.title || "Untitled Project").trim().slice(0, 120);
  const now = new Date().toISOString();
  return {
    id: existing?.id || `project_${crypto.randomUUID()}`,
    ownerId: userId,
    name,
    licenseId: body.licenseId || existing?.licenseId || "",
    payload,
    schemaVersion: edit.schemaVersion || payload.schemaVersion || "",
    sceneCount: Array.isArray(edit.scenes) ? edit.scenes.length : 0,
    duration: Number(edit.duration || 0),
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };
}

async function handleProjects(req, res, url) {
  const auth = await requireUser(req, res);
  if (!auth) return;

  if (url.pathname === "/api/projects") {
    if (req.method === "GET") {
      sendJson(res, 200, { ok: true, projects: await readProjectList(auth.user.id) });
      return;
    }
    if (req.method === "POST") {
      const body = await parseJsonBody(req);
      await assertProjectCapacity(auth);
      const project = buildProjectRecord(auth.user.id, body);
      project.licenseId = auth.user.license?.id || "";
      await writeProject(auth.user.id, project);
      sendJson(res, 201, { ok: true, project: projectSummary(project), record: project });
      return;
    }
  }

  const duplicateMatch = url.pathname.match(/^\/api\/projects\/([^/]+)\/duplicate$/);
  if (duplicateMatch) {
    if (req.method !== "POST") {
      sendJson(res, 405, { ok: false, error: "Method not allowed" });
      return;
    }
    const sourceId = duplicateMatch[1];
    const source = await readProject(auth.user.id, sourceId);
    if (!source) {
      sendJson(res, 404, { ok: false, error: "Project not found" });
      return;
    }
    await assertProjectCapacity(auth);
    const body = await parseJsonBody(req);
    const duplicate = buildProjectRecord(auth.user.id, {
      name: body.name || `Copy of ${source.name || "Untitled Project"}`,
      payload: structuredClone(source.payload),
      licenseId: auth.user.license?.id || source.licenseId || "",
    });
    duplicate.duplicatedFrom = source.id;
    await writeProject(auth.user.id, duplicate);
    sendJson(res, 201, { ok: true, project: projectSummary(duplicate), record: duplicate });
    return;
  }

  const match = url.pathname.match(/^\/api\/projects\/([^/]+)$/);
  if (!match) {
    sendJson(res, 404, { ok: false, error: "Project route not found" });
    return;
  }
  const projectId = match[1];
  const project = await readProject(auth.user.id, projectId);
  if (!project) {
    sendJson(res, 404, { ok: false, error: "Project not found" });
    return;
  }

  if (req.method === "GET") {
    sendJson(res, 200, { ok: true, project });
    return;
  }
  if (req.method === "PUT") {
    const body = await parseJsonBody(req);
    const updated = buildProjectRecord(auth.user.id, body, project);
    await writeProject(auth.user.id, updated);
    sendJson(res, 200, { ok: true, project: projectSummary(updated), record: updated });
    return;
  }
  if (req.method === "DELETE") {
    await fsp.unlink(projectPathFor(auth.user.id, projectId));
    sendJson(res, 200, { ok: true, deletedId: projectId });
    return;
  }
  sendJson(res, 405, { ok: false, error: "Method not allowed" });
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
  const sheetIndex = timelineConfig.skipReferences ? [] : parseTsv(await fsp.readFile(indexPath, "utf8"));
  const manifest = JSON.parse(await fsp.readFile(manifestPath, "utf8"));
  const audioPath = timelineConfig.audioPath || AUDIO_FILE;
  const rubabPath = timelineConfig.rubabPath || RUBAB_FRAME;
  const audioDuration = Number(timelineMetadata.audio_duration_seconds || 201.84);

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

  const references = timelineConfig.skipReferences
    ? frames.slice(0, 16).map((frame) => ({
      sheet: timelineConfig.id,
      slot: frame.index,
      frameIndex: frame.index,
      title: frame.title,
      note: frame.note,
      image: frame.image,
      path: frame.path,
    }))
    : sheetIndex.map((item) => ({
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
    duration: audioDuration,
    audio: {
      path: audioPath,
      url: fileUrl(audioPath),
      duration: audioDuration,
    },
    rubab: {
      path: rubabPath,
      url: fileUrl(rubabPath),
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
    captions: String(scene.captions || [scene.titleHi, scene.titleEn].filter(Boolean).join("\n")),
    composite: cloneJson(scene.composite || {}),
    effects: {
      grain: Boolean(scene.effects?.grain),
      vignette: Boolean(scene.effects?.vignette),
      dust: Boolean(scene.effects?.dust),
      sonic: Boolean(scene.effects?.sonic),
    },
    transition: {
      type: String(scene.transition?.type || "cut"),
      duration: Number(scene.transition?.duration || 0),
    },
  };
}

function cloneJson(value, fallback = null) {
  try {
    return value == null ? fallback : JSON.parse(JSON.stringify(value));
  } catch {
    return fallback;
  }
}

function arrayPayload(value) {
  return Array.isArray(value) ? cloneJson(value, []) : [];
}

function objectPayload(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? cloneJson(value, {}) : {};
}

function exportSchemaPayload(payload, scenes) {
  const dynamicTracks = arrayPayload(payload.dynamicTracks);
  const compositions = arrayPayload(payload.compositions);
  const captions = scenes.filter((scene) => scene.captions.trim());
  const vfxScenes = scenes.filter((scene) => Object.values(scene.effects).some(Boolean));
  return {
    schemaVersion: String(payload.schemaVersion || ""),
    sourceTimeline: objectPayload(payload.sourceTimeline),
    markers: arrayPayload(payload.markers),
    keyframes: arrayPayload(payload.keyframes),
    dynamicTracks,
    compositions,
    activeCompositionId: payload.activeCompositionId || null,
    audioMix: objectPayload(payload.audioMix),
    accessibility: objectPayload(payload.accessibility),
    uxNotes: arrayPayload(payload.uxNotes),
    spatial: objectPayload(payload.spatial),
    layers: objectPayload(payload.layers),
    captions: captions.map((scene) => ({
      sceneId: scene.id,
      start: scene.start,
      end: scene.end,
      text: scene.captions,
    })),
    vfx: vfxScenes.map((scene) => ({
      sceneId: scene.id,
      start: scene.start,
      end: scene.end,
      effects: scene.effects,
    })),
  };
}

function exportParityReport(schema, scenes, render = {}) {
  const dynamicTrackClipCount = schema.dynamicTracks.reduce((total, track) => total + (Array.isArray(track.clips) ? track.clips.length : 0), 0);
  const compositionClipCount = schema.compositions.reduce((total, composition) => total + (Array.isArray(composition.clips) ? composition.clips.length : 0), 0);
  return {
    fullSchemaRead: true,
    sceneCount: scenes.length,
    dynamicTracks: {
      read: true,
      count: schema.dynamicTracks.length,
      clipCount: dynamicTrackClipCount,
    },
    compositions: {
      read: true,
      count: schema.compositions.length,
      clipCount: compositionClipCount,
      activeCompositionId: schema.activeCompositionId,
    },
    captions: {
      read: true,
      count: schema.captions.length,
      rendered: Boolean(render.captionsRendered),
    },
    vfx: {
      read: true,
      sceneCount: schema.vfx.length,
      manifestWritten: true,
      timelineWindowsRendered: Boolean(render.vfxWindowsRendered),
    },
    audioMix: {
      read: true,
      keys: Object.keys(schema.audioMix),
    },
    layers: {
      read: true,
      dynamicTrackMirror: Array.isArray(schema.layers.dynamic) ? schema.layers.dynamic.length : 0,
    },
  };
}

async function createConcatFile(exportDir, scenes) {
  const concatPath = path.join(exportDir, "timeline.concat.txt");
  const lines = [];
  for (const scene of scenes) {
    const imagePath = safeMediaAssetPath(scene.imagePath);
    await fsp.access(imagePath, fs.constants.R_OK);
    lines.push(`file '${imagePath.replace(/'/g, "'\\''")}'`);
    lines.push(`duration ${scene.duration.toFixed(9)}`);
  }
  const lastImage = safeMediaAssetPath(scenes[scenes.length - 1].imagePath);
  lines.push(`file '${lastImage.replace(/'/g, "'\\''")}'`);
  await fsp.writeFile(concatPath, `${lines.join("\n")}\n`, "utf8");
  return concatPath;
}

async function attachCaptionFiles(exportDir, scenes) {
  const captionScenes = scenes.filter((scene) => scene.captions.trim());
  for (const scene of captionScenes) {
    const captionPath = path.join(exportDir, `caption_${String(scene.id).padStart(3, "0")}.txt`);
    await fsp.writeFile(captionPath, scene.captions.trim(), "utf8");
    scene.captionPath = captionPath;
  }
  return captionScenes.length;
}

function escapeFilterPath(filePath) {
  return String(filePath).replace(/\\/g, "\\\\").replace(/'/g, "'\\''").replace(/:/g, "\\:");
}

function timelineEnable(windows) {
  return windows
    .map((window) => `between(t,${window.start.toFixed(3)},${window.end.toFixed(3)})`)
    .join("+");
}

function postVideoFilters(scenes) {
  const filters = [];
  for (const scene of scenes) {
    if (scene.captionPath) {
      filters.push(`drawtext=textfile='${escapeFilterPath(scene.captionPath)}':x=(w-text_w)/2:y=h-132:fontcolor=white:fontsize=34:box=1:boxcolor=black@0.48:boxborderw=16:enable='${timelineEnable([scene])}'`);
    }
  }
  const vignetteWindows = scenes.filter((scene) => scene.effects.vignette);
  if (vignetteWindows.length) {
    filters.push(`vignette=angle=PI/5:enable='${timelineEnable(vignetteWindows)}'`);
  }
  filters.push("fps=24", "format=yuv420p");
  return filters.join(",");
}

function ffmpegArgs({ concatPath, audioPath, outputPath, duration, overlayWindows, rubabPath, scenes, includeAdvancedFilters = true }) {
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
  const filters = includeAdvancedFilters ? postVideoFilters(scenes) : "fps=24,format=yuv420p";

  if (overlayWindows.length) {
    const enable = timelineEnable(overlayWindows);
    args.push("-loop", "1", "-framerate", "24", "-t", duration.toFixed(3), "-i", rubabPath);
    args.push(
      "-filter_complex",
      `[2:v]scale=720:405,format=rgba,colorchannelmixer=aa=0.93,drawbox=x=0:y=0:w=iw:h=ih:color=white@0.70:t=4[rubab];[0:v][rubab]overlay=x=W-w-54:y=H-h-54:enable='${enable}',${filters}[v]`,
      "-map",
      "[v]",
      "-map",
      "1:a:0"
    );
  } else {
    args.push("-filter_complex", `[0:v]${filters}[v]`, "-map", "[v]", "-map", "1:a:0");
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
    const manifestResult = exportSchema.buildExportManifest(payload, {
      mode: "preview-mp4",
    });
    if (!manifestResult.ok) {
      sendJson(res, 422, {
        ok: false,
        error: "Invalid export schema payload",
        details: manifestResult.errors,
      });
      return;
    }
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
    const audioPath = safeMediaAssetPath(String(payload.audioPath || AUDIO_FILE));
    const rubabPath = safeMediaAssetPath(String(payload.rubabPath || RUBAB_FRAME));
    const outputPath = path.join(exportDir, "mahavisphot_editor_export.mp4");
    const projectPath = path.join(exportDir, "project.json");
    const schemaPath = path.join(exportDir, "export-schema.json");
    const captionsRendered = await attachCaptionFiles(exportDir, scenes);

    const overlayWindows = scenes
      .filter((scene) => scene.rubabOverlay)
      .map((scene) => ({ start: scene.start, end: scene.end }));
    const schema = manifestResult.manifest;
    const vfxWindowsRendered = schema.vfx.some((scene) => scene.effects?.includes?.("vignette"));

    const project = {
      createdAt: new Date().toISOString(),
      duration,
      audioPath: path.relative(ROOT, audioPath),
      rubabPath: path.relative(ROOT, rubabPath),
      scenes,
      overlayWindows,
      schema,
      parity: {
        ...schema.parity,
        captionsRendered: captionsRendered === schema.captions.length,
        vfxWindowsRendered,
      },
    };
    await fsp.writeFile(schemaPath, JSON.stringify(schema, null, 2), "utf8");
    await fsp.writeFile(projectPath, JSON.stringify(project, null, 2), "utf8");

    let advancedFilters = true;
    const args = ffmpegArgs({
      concatPath,
      audioPath,
      outputPath,
      duration,
      overlayWindows,
      rubabPath,
      scenes,
    });
    try {
      await runFfmpeg(args);
    } catch (error) {
      advancedFilters = false;
      const fallbackArgs = ffmpegArgs({
        concatPath,
        audioPath,
        outputPath,
        duration,
        overlayWindows,
        rubabPath,
        scenes,
        includeAdvancedFilters: false,
      });
      await runFfmpeg(fallbackArgs);
      project.parity.captions.rendered = false;
      project.parity.vfx.timelineWindowsRendered = false;
      project.renderWarning = `Advanced caption/VFX render fallback used: ${error.message.slice(0, 400)}`;
      await fsp.writeFile(projectPath, JSON.stringify(project, null, 2), "utf8");
    }

    sendJson(res, 200, {
      ok: true,
      exportName,
      video: fileUrl(path.relative(ROOT, outputPath)),
      project: fileUrl(path.relative(ROOT, projectPath)),
      schemaUrl: fileUrl(path.relative(ROOT, schemaPath)),
      concat: fileUrl(path.relative(ROOT, concatPath)),
      overlayWindows,
      schema,
      parity: project.parity,
      advancedFilters,
    });
  } catch (error) {
    sendJson(res, 500, {
      ok: false,
      error: error.message || String(error),
    });
  }
}

async function handleExportSchema(req, res) {
  try {
    const payload = await parseJsonBody(req);
    const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\..+/, "");
    const exportName = `schema_export_${stamp}`;
    const exportRelDir = path.join("exports", exportName);
    const exportDir = path.join(ROOT, exportRelDir);
    await fsp.mkdir(exportDir, { recursive: true });
    const result = exportSchema.buildExportManifest(payload, {
      mode: payload.exportMode || "manifest",
    });
    if (!result.ok) {
      sendJson(res, 422, {
        ok: false,
        error: "Invalid export schema payload",
        details: result.errors,
      });
      return;
    }
    const schemaPath = path.join(exportDir, "export-schema.json");
    const evidencePath = path.join(exportDir, "export-parity-evidence.json");
    const evidence = {
      schemaVersion: exportSchema.EXPORT_SCHEMA_EVIDENCE_VERSION,
      generatedAt: new Date().toISOString(),
      exportName,
      schemaPath: path.relative(ROOT, schemaPath),
      frameModel: "timeline-runtime-v2",
      productionReady: false,
      parity: result.manifest.parity,
      renderStatus: result.manifest.renderPlan.status,
      blockers: result.manifest.renderPlan.unsupportedPreviewVfx.length
        ? [`preview renderer does not visually cover VFX: ${result.manifest.renderPlan.unsupportedPreviewVfx.join(", ")}`]
        : ["production render readiness still requires renderer integration evidence"],
    };
    await fsp.writeFile(schemaPath, JSON.stringify(result.manifest, null, 2), "utf8");
    await fsp.writeFile(evidencePath, JSON.stringify(evidence, null, 2), "utf8");
    sendJson(res, 200, {
      ok: true,
      exportName,
      schema: result.manifest,
      parity: result.manifest.parity,
      schemaUrl: fileUrl(path.relative(ROOT, schemaPath)),
      evidenceUrl: fileUrl(path.relative(ROOT, evidencePath)),
    });
  } catch (error) {
    sendJson(res, 400, { ok: false, error: error.message || String(error) });
  }
}

async function handleRenderCompile(req, res) {
  if (req.method !== "POST") {
    sendJson(res, 405, { ok: false, error: "Method not allowed" });
    return;
  }
  try {
    const payload = await parseJsonBody(req);
    const report = await renderEngine.executeManifestRender(payload);
    sendJson(res, 200, {
      ok: true,
      report,
      videoUrl: report.compiledOutputUrl,
      reportUrl: fileUrl(report.reportPath),
    });
  } catch (error) {
    if (error.code === "renderer_validation_failed" || error.code === "renderer_manifest_invalid" || error.code === "renderer_no_video") {
      sendJson(res, 422, { ok: false, error: error.message, details: error.errors || [] });
      return;
    }
    if (error.code === "renderer_runtime_blocked") {
      sendJson(res, 503, { ok: false, error: error.message, missing: error.missing || [] });
      return;
    }
    sendJson(res, 500, { ok: false, error: error.message || String(error) });
  }
}

async function serveStatic(req, res) {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    let filePath;
    if (url.pathname === "/") {
      filePath = path.join(PUBLIC_DIR, "mahavisphot", "index.html");
    } else if (url.pathname === "/editor") {
      filePath = path.join(EDITOR_DIR, "index.html");
    } else if (url.pathname === "/mahavisphot" || url.pathname === "/mahavisphot/") {
      filePath = path.join(PUBLIC_DIR, "mahavisphot", "index.html");
    } else if (url.pathname === "/mahavisphot/launch" || url.pathname === "/mahavisphot/launch/") {
      filePath = path.join(PUBLIC_DIR, "mahavisphot", "launch.html");
    } else if (url.pathname === "/mahavisphot/launch.html") {
      filePath = path.join(PUBLIC_DIR, "mahavisphot", "launch.html");
    } else if (url.pathname.startsWith("/mahavisphot/")) {
      const requestedPath = decodeURIComponent(url.pathname.slice("/mahavisphot/".length));
      const hasFileExtension = Boolean(path.extname(requestedPath));
      filePath = hasFileExtension
        ? safeJoin(path.join(PUBLIC_DIR, "mahavisphot"), requestedPath)
        : path.join(PUBLIC_DIR, "mahavisphot", "index.html");
    } else if (url.pathname.startsWith("/public/")) {
      filePath = safeJoin(PUBLIC_DIR, decodeURIComponent(url.pathname.slice("/public/".length)));
    } else if (url.pathname.startsWith("/assets/")) {
      filePath = safeMediaAssetPath(decodeURIComponent(url.pathname.slice("/assets/".length)));
    } else {
      filePath = safeJoin(EDITOR_DIR, decodeURIComponent(url.pathname.slice(1)));
    }

    const stat = await fsp.stat(filePath);
    if (stat.isDirectory()) {
      send(res, 403, "Directory listing disabled", { "Content-Type": "text/plain; charset=utf-8" });
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

function handleHealth(req, res, url) {
  const suppliedToken = String(req.headers["x-mahavishphot-health-token"] || req.headers["x-mahavisphot-health-token"] || url.searchParams.get("token") || "");
  const owned = activeHealthToken ? suppliedToken === activeHealthToken : !suppliedToken;
  sendJson(res, 200, {
    ok: true,
    app: APP_HEALTH_ID,
    owned,
    tokenRequired: Boolean(activeHealthToken),
    port: activePort,
  });
}

let SEARCH_INDEX_CACHE = null;
async function handleSearch(req, res, url) {
  if (!SEARCH_INDEX_CACHE) {
    SEARCH_INDEX_CACHE = await readJsonFile(path.join(PUBLIC_DIR, "mahavisphot", "search-index.json"), { items: [] });
  }
  const q = String(url.searchParams.get("q") || "").trim().toLowerCase();
  const kind = url.searchParams.get("kind") || "";
  const status = url.searchParams.get("status") || "";
  let items = SEARCH_INDEX_CACHE.items || [];
  if (kind) items = items.filter((it) => it.kind === kind);
  if (status) items = items.filter((it) => it.status === status);
  if (q) items = items.filter((it) => (it.keywords || "").includes(q) || String(it.title || "").toLowerCase().includes(q));
  sendJson(res, 200, { ok: true, query: q, total: items.length, items: items.slice(0, 100) });
}

async function handleRuntimeHealth(req, res) {
  const collectors = require("./runtime-collectors");
  sendJson(res, 200, { ok: true, ...collectors.collectAll() });
}

// GET /api/v1/telemetry?loopFps=NN&includeLoudness=1&audioPath=...
// Sovereign engine telemetry: host CPU/mem, honest GPU probe, viewport loop,
// and real BS.1770 LUFS. Defensive: never throws; surfaces errors + renderSafe.
async function handleTelemetry(req, res, url) {
  try {
    const collectors = require("./runtime-collectors");
    const includeLoudness = ["1", "true", "yes"].includes(String(url.searchParams.get("includeLoudness") || "").toLowerCase());
    let audioPath;
    if (url.searchParams.get("audioPath")) {
      // resolve through the safe-media policy so paths cannot escape the workspace
      audioPath = safeMediaAssetPath(String(url.searchParams.get("audioPath")));
    }
    const report = await collectors.telemetry({
      loopFps: url.searchParams.get("loopFps"),
      loopTarget: Number(url.searchParams.get("loopTarget")) || 60,
      includeLoudness,
      audioPath,
    });
    sendJson(res, report.status === "abort" ? 503 : 200, { ok: report.status !== "abort", ...report });
  } catch (error) {
    sendJson(res, 400, { ok: false, status: "error", error: error.message || String(error) });
  }
}

async function handleMediaIngest(req, res) {
  const auth = await requireUser(req, res);
  if (!auth) return;
  if (req.method !== "POST") {
    sendJson(res, 405, { ok: false, error: "Method not allowed" });
    return;
  }
  const body = await parseJsonBody(req);
  try {
    const ingest = await mediaPipeline.ingestMedia(body);
    if (!ingest.ok) {
      sendJson(res, 422, { ok: false, error: "Media ingest validation failed", details: ingest.errors });
      return;
    }
    const projectId = sanitizeProjectId(body.projectId || "default") || "default";
    const record = await mediaPipeline.registerAssetRecord(crudStore, auth.user.id, ingest, projectId);
    let timelineLink = null;
    if (body.linkTimeline === true) {
      const docPath = editorDocPath(auth.user.id, projectId);
      const existing = await readJsonFile(docPath, null);
      const linked = mediaPipeline.linkAssetToTimelineDoc(existing || timeline.newDoc({ name: projectId }), ingest, {
        projectId,
        start: Number(body.timelineStart || 0),
        durationSec: Number(body.durationSec) || undefined,
      });
      await writeJsonFile(docPath, linked.doc);
      timelineLink = {
        projectId,
        trackId: linked.track.id,
        clipId: linked.clip.id,
      };
    }
    sendJson(res, 201, {
      ok: true,
      asset: ingest.asset,
      record,
      timelineLink,
    });
  } catch (error) {
    if (error.code === "media_runtime_blocked") {
      sendJson(res, 503, { ok: false, error: error.message, missing: error.missing || [] });
      return;
    }
    sendJson(res, 400, { ok: false, error: error.message || String(error) });
  }
}

// AI runtime (Step 8): capabilities are public; job submission is auth-gated.
// Real local/cloud/hybrid modes return status "blocked" until configured; the
// reference mode runs a deterministic stub (not trained-model inference).
async function handleAi(req, res, url) {
  if (req.method === "GET" && url.pathname === "/api/v1/ai/capabilities") {
    sendJson(res, 200, { ok: true, ...aiRuntime.capabilities() });
    return;
  }
  const auth = await requireUser(req, res);
  if (!auth) return;
  const userId = auth.user.id;
  if (req.method === "POST" && url.pathname === "/api/v1/ai/jobs") {
    try {
      const job = await parseJsonBody(req);
      const outcome = await aiRuntime.submit(job, { userId });
      sendJson(res, outcome.status === "blocked" ? 200 : 201, { ok: outcome.status !== "rejected", ...outcome });
    } catch (error) {
      if (error instanceof aiRuntimeMod.AiRuntimeError && error.code === "ai_validation_failed") {
        sendJson(res, 422, { ok: false, error: error.message, details: error.details || [] });
        return;
      }
      sendJson(res, 400, { ok: false, error: error.message || String(error) });
    }
    return;
  }
  if (req.method === "GET" && url.pathname === "/api/v1/ai/audit") {
    sendJson(res, 200, { ok: true, entries: aiRuntime.audit({ userId }) });
    return;
  }
  const jobMatch = url.pathname.match(/^\/api\/v1\/ai\/jobs\/([^/]+)$/);
  if (req.method === "GET" && jobMatch) {
    const entries = aiRuntime.audit({ userId, id: jobMatch[1] });
    if (entries.length) sendJson(res, 200, { ok: true, entry: entries[0] });
    else sendJson(res, 404, { ok: false, error: "Job not found" });
    return;
  }
  sendJson(res, 404, { ok: false, error: "Unknown AI route" });
}

function editorDocPath(userId, projectId) {
  const u = String(userId).replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 80) || "anon";
  const p = sanitizeProjectId(projectId) || "default";
  return path.join(EDITOR_DOCS_DIR, u, `${p}.json`);
}
// GET  /api/v1/editor/doc?projectId=ID  -> migrated saved doc (or fresh default)
// PUT  /api/v1/editor/doc {projectId, doc} -> validate + persist (migrated), save/load parity
async function handleEditorDoc(req, res, url) {
  const auth = await requireUser(req, res);
  if (!auth) return;
  const userId = auth.user.id;
  if (req.method === "GET") {
    const projectId = url.searchParams.get("projectId") || "default";
    const saved = await readJsonFile(editorDocPath(userId, projectId), null);
    const doc = timeline.migrate(saved || timeline.newDoc({ name: projectId }));
    sendJson(res, 200, { ok: true, projectId, migrated: !!saved, doc });
    return;
  }
  if (req.method === "PUT" || req.method === "POST") {
    const body = await parseJsonBody(req);
    const projectId = body.projectId || "default";
    const doc = timeline.migrate(body.doc || {});
    const errors = timeline.validate(doc);
    if (errors.length) {
      sendJson(res, 422, { ok: false, error: "Invalid timeline document", details: errors });
      return;
    }
    await writeJsonFile(editorDocPath(userId, projectId), doc);
    sendJson(res, 200, { ok: true, projectId, doc });
    return;
  }
  sendJson(res, 405, { ok: false, error: "Method not allowed" });
}

async function handleCrud(req, res, url) {
  // /api/v1            -> entity + schema catalog (introspection)
  // /api/v1/<entity>   -> GET list, POST create
  // /api/v1/<entity>/<id> -> GET, PUT/PATCH update, DELETE
  if (url.pathname === "/api/v1" || url.pathname === "/api/v1/") {
    sendJson(res, 200, { ok: true, entities: crud.ENTITIES, schemas: crud.SCHEMAS, common: crud.COMMON });
    return;
  }
  const auth = await requireUser(req, res);
  if (!auth) return;
  const userId = auth.user.id;
  const parts = url.pathname.split("/").filter(Boolean); // ["api","v1",entity,id?]
  const entity = parts[2];
  const id = parts[3];
  if (!crud.ENTITIES.includes(entity)) {
    sendJson(res, 404, { ok: false, error: `Unknown entity: ${entity}` });
    return;
  }
  try {
    if (!id) {
      if (req.method === "GET") {
        const records = await crudStore.list(userId, entity, {
          projectId: url.searchParams.get("projectId") || undefined,
        });
        sendJson(res, 200, { ok: true, entity, count: records.length, records });
        return;
      }
      if (req.method === "POST") {
        const record = await crudStore.create(userId, entity, await parseJsonBody(req));
        sendJson(res, 201, { ok: true, entity, record });
        return;
      }
    } else {
      if (req.method === "GET") {
        const record = await crudStore.get(userId, entity, id);
        if (record) sendJson(res, 200, { ok: true, entity, record });
        else sendJson(res, 404, { ok: false, error: "Not found" });
        return;
      }
      if (req.method === "PUT" || req.method === "PATCH") {
        const record = await crudStore.update(userId, entity, id, await parseJsonBody(req));
        if (record) sendJson(res, 200, { ok: true, entity, record });
        else sendJson(res, 404, { ok: false, error: "Not found" });
        return;
      }
      if (req.method === "DELETE") {
        const removed = await crudStore.remove(userId, entity, id);
        sendJson(res, removed ? 200 : 404, { ok: removed, entity, id });
        return;
      }
    }
    sendJson(res, 405, { ok: false, error: "Method not allowed" });
  } catch (error) {
    if (error instanceof crud.ValidationError) {
      sendJson(res, 422, { ok: false, error: "Validation failed", details: error.errors });
      return;
    }
    sendJson(res, 400, { ok: false, error: error.message || String(error) });
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  try {
    if (req.method === "GET" && url.pathname === "/api/health") {
      handleHealth(req, res, url);
      return;
    }
    if (req.method === "GET" && url.pathname === "/api/auth/me") {
      await handleMe(req, res);
      return;
    }
    if (req.method === "POST" && url.pathname === "/api/auth/register") {
      await handleRegister(req, res);
      return;
    }
    if (req.method === "POST" && url.pathname === "/api/auth/login") {
      await handleLogin(req, res);
      return;
    }
    if (req.method === "POST" && url.pathname === "/api/auth/logout") {
      await handleLogout(req, res);
      return;
    }
    if ((req.method === "GET" || req.method === "POST") && url.pathname === "/api/subscription") {
      await handleSubscription(req, res);
      return;
    }
    if (url.pathname === "/api/projects" || url.pathname.startsWith("/api/projects/")) {
      await handleProjects(req, res, url);
      return;
    }
    if (req.method === "GET" && url.pathname === "/api/v1/search") {
      await handleSearch(req, res, url);
      return;
    }
    if (req.method === "GET" && url.pathname === "/api/v1/telemetry") {
      await handleTelemetry(req, res, url);
      return;
    }
    if (req.method === "GET" && url.pathname === "/api/v1/health/runtimes") {
      await handleRuntimeHealth(req, res);
      return;
    }
    if (url.pathname === "/api/v1/media/ingest") {
      await handleMediaIngest(req, res);
      return;
    }
    if (url.pathname === "/api/v1/render/compile") {
      await handleRenderCompile(req, res);
      return;
    }
    if (url.pathname === "/api/v1/editor/doc") {
      await handleEditorDoc(req, res, url);
      return;
    }
    if (url.pathname === "/api/v1/ai/capabilities" || url.pathname === "/api/v1/ai/jobs" ||
        url.pathname === "/api/v1/ai/audit" || url.pathname.startsWith("/api/v1/ai/jobs/")) {
      await handleAi(req, res, url);
      return;
    }
    if (url.pathname === "/api/v1" || url.pathname.startsWith("/api/v1/")) {
      await handleCrud(req, res, url);
      return;
    }
  } catch (error) {
    sendJson(res, 500, { ok: false, error: error.message || String(error) });
    return;
  }

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
  if (req.method === "POST" && url.pathname === "/api/export/schema") {
    await handleExportSchema(req, res);
    return;
  }
  if (req.method === "POST" && url.pathname === "/api/export") {
    await handleExport(req, res);
    return;
  }
  await serveStatic(req, res);
});

function setHealthToken(token) {
  activeHealthToken = String(token || process.env.MAHAVISPHOT_HEALTH_TOKEN || "");
}

function startServer(port = PORT, host = "127.0.0.1", healthToken = process.env.MAHAVISPHOT_HEALTH_TOKEN || "") {
  setHealthToken(healthToken);
  activePort = port;
  if (server.listening) return Promise.resolve(server);
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, host, () => {
      server.off("error", reject);
      const address = server.address();
      activePort = address && typeof address === "object" ? address.port : port;
      console.log(`Mahavisphot editor: http://${host}:${activePort}`);
      resolve(server);
    });
  });
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

module.exports = {
  startServer,
  setHealthToken,
  server,
  getProject,
};
