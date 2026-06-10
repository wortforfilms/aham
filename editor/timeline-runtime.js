"use strict";
/**
 * Mahavisphot — headless editor/timeline runtime (Step 4).
 *
 * A pure, DOM-free timeline document engine so it is fully unit-testable.
 * Implements: nested compositions, drag/drop (moveClip), ripple/cascade/static
 * delete, undo/redo history, keyboard-shortcut resolution, serialize/load
 * round-trip parity, and versioned project-schema migration.
 *
 * Document (schemaVersion 2):
 *   { schemaVersion, id, name, fps, duration,
 *     compositions:[{id,name,parentId,width,height,root}],
 *     tracks:[{id,compositionId,kind,name,index,locked,muted}],
 *     clips:[{id,trackId,source:{type:'asset'|'composition',id},name,start,duration,in,out}] }
 */
const crypto = require("node:crypto");

const CURRENT_VERSION = 2;
const TRACK_KINDS = ["video", "audio", "caption", "vfx", "marker"];
const DELETE_MODES = ["static", "ripple", "cascade"];

const uid = (p) => `${p}_${crypto.randomUUID()}`;
const clone = (x) => structuredClone(x);

function newDoc(opts = {}) {
  const rootId = uid("comp");
  return {
    schemaVersion: CURRENT_VERSION,
    id: opts.id || uid("proj"),
    name: opts.name || "Untitled",
    fps: opts.fps || 30,
    duration: opts.duration || 0,
    compositions: [
      { id: rootId, name: "Main", parentId: null, width: opts.width || 1920, height: opts.height || 1080, root: true },
    ],
    tracks: [],
    clips: [],
  };
}

// ---- migration (v1 -> v2), idempotent ----
function migrate(input) {
  const doc = clone(input || {});
  let v = Number(doc.schemaVersion) || 1;

  if (v < 2) {
    // ensure a root composition exists
    if (!Array.isArray(doc.compositions) || doc.compositions.length === 0) {
      doc.compositions = [{ id: uid("comp"), name: "Main", parentId: null, width: doc.width || 1920, height: doc.height || 1080, root: true }];
    }
    const root = doc.compositions.find((c) => c.root) || doc.compositions[0];
    root.root = true;
    if (root.parentId === undefined) root.parentId = null;

    // tracks: ensure ids + compositionId
    doc.tracks = (doc.tracks || []).map((t, i) => ({
      id: t.id || uid("track"),
      compositionId: t.compositionId || root.id,
      kind: TRACK_KINDS.includes(t.kind) ? t.kind : "video",
      name: t.name || `Track ${i + 1}`,
      index: t.index ?? i,
      locked: !!t.locked,
      muted: !!t.muted,
    }));

    // clips: rename v1 *Sec fields, normalize source
    doc.clips = (doc.clips || []).map((c) => {
      const start = c.start ?? c.startSec ?? 0;
      const duration = c.duration ?? c.durationSec ?? 0;
      const inP = c.in ?? c.inSec;
      const outP = c.out ?? c.outSec;
      let source = c.source;
      if (!source) source = c.compositionId ? { type: "composition", id: c.compositionId } : { type: "asset", id: c.assetId || null };
      const clip = { id: c.id || uid("clip"), trackId: c.trackId, source, name: c.name || "clip", start, duration };
      if (inP !== undefined) clip.in = inP;
      if (outP !== undefined) clip.out = outP;
      return clip;
    });

    delete doc.width; delete doc.height;
    doc.fps = doc.fps || 30;
    doc.duration = doc.duration || 0;
    doc.id = doc.id || uid("proj");
    doc.name = doc.name || "Untitled";
    v = 2;
  }
  doc.schemaVersion = CURRENT_VERSION;
  return doc;
}

// ---- referential validation ----
function validate(doc) {
  const errors = [];
  if (!doc || typeof doc !== "object") return ["document must be an object"];
  const compIds = new Set((doc.compositions || []).map((c) => c.id));
  const trackIds = new Set((doc.tracks || []).map((t) => t.id));
  if (!(doc.compositions || []).some((c) => c.root)) errors.push("no root composition");
  for (const t of doc.tracks || []) {
    if (!compIds.has(t.compositionId)) errors.push(`track ${t.id} references missing composition ${t.compositionId}`);
    if (!TRACK_KINDS.includes(t.kind)) errors.push(`track ${t.id} has invalid kind ${t.kind}`);
  }
  for (const c of doc.clips || []) {
    if (!trackIds.has(c.trackId)) errors.push(`clip ${c.id} references missing track ${c.trackId}`);
    if (typeof c.start !== "number" || typeof c.duration !== "number") errors.push(`clip ${c.id} missing numeric start/duration`);
    if (c.source && c.source.type === "composition" && !compIds.has(c.source.id)) errors.push(`clip ${c.id} nests missing composition ${c.source.id}`);
  }
  return errors;
}

class EditorRuntime {
  constructor(doc) {
    this.state = migrate(doc || newDoc());
    this._undo = [];
    this._redo = [];
    this._cap = 200;
  }

  // ---- history ----
  _commit(mutate) {
    this._undo.push(clone(this.state));
    if (this._undo.length > this._cap) this._undo.shift();
    this._redo = [];
    const result = mutate();
    return result;
  }
  canUndo() { return this._undo.length > 0; }
  canRedo() { return this._redo.length > 0; }
  undo() { if (!this._undo.length) return false; this._redo.push(clone(this.state)); this.state = this._undo.pop(); return true; }
  redo() { if (!this._redo.length) return false; this._undo.push(clone(this.state)); this.state = this._redo.pop(); return true; }

  // ---- lookups ----
  rootComp() { return this.state.compositions.find((c) => c.root); }
  track(id) { return this.state.tracks.find((t) => t.id === id) || null; }
  clip(id) { return this.state.clips.find((c) => c.id === id) || null; }

  // ---- compositions (nesting) ----
  addComposition({ name = "Comp", parentId = null, width = 1920, height = 1080 } = {}) {
    const comp = { id: uid("comp"), name, parentId, width, height, root: false };
    this._commit(() => this.state.compositions.push(comp));
    return comp;
  }
  // would nesting `nestedCompId` inside `containerCompId` create a cycle?
  _wouldCycle(containerCompId, nestedCompId) {
    if (containerCompId === nestedCompId) return true;
    // does nestedComp (transitively) already contain containerComp?
    const compClips = (compId) => {
      const trackIds = this.state.tracks.filter((t) => t.compositionId === compId).map((t) => t.id);
      return this.state.clips.filter((c) => trackIds.includes(c.trackId));
    };
    const seen = new Set();
    const stack = [nestedCompId];
    while (stack.length) {
      const cur = stack.pop();
      if (cur === containerCompId) return true;
      if (seen.has(cur)) continue;
      seen.add(cur);
      for (const c of compClips(cur)) {
        if (c.source && c.source.type === "composition") stack.push(c.source.id);
      }
    }
    return false;
  }
  nestComposition(clipId, compositionId) {
    const clip = this.clip(clipId);
    if (!clip) throw new Error(`unknown clip ${clipId}`);
    const track = this.track(clip.trackId);
    if (!this.state.compositions.some((c) => c.id === compositionId)) throw new Error(`unknown composition ${compositionId}`);
    if (this._wouldCycle(track.compositionId, compositionId)) throw new Error("nesting would create a composition cycle");
    this._commit(() => { clip.source = { type: "composition", id: compositionId }; });
    return clip;
  }

  // ---- tracks ----
  addTrack({ compositionId, kind = "video", name, index, locked = false, muted = false } = {}) {
    const compId = compositionId || this.rootComp().id;
    if (!this.state.compositions.some((c) => c.id === compId)) throw new Error(`unknown composition ${compId}`);
    if (!TRACK_KINDS.includes(kind)) throw new Error(`invalid track kind ${kind}`);
    const inComp = this.state.tracks.filter((t) => t.compositionId === compId);
    const track = {
      id: uid("track"), compositionId: compId, kind,
      name: name || `${kind[0].toUpperCase()}${inComp.length + 1}`,
      index: index ?? inComp.length, locked, muted,
    };
    this._commit(() => this.state.tracks.push(track));
    return track;
  }
  setTrack(trackId, props = {}) {
    const t = this.track(trackId);
    if (!t) throw new Error(`unknown track ${trackId}`);
    const allowed = ["name", "index", "locked", "muted", "kind"];
    this._commit(() => { for (const k of allowed) if (k in props) t[k] = props[k]; });
    return t;
  }
  removeTrack(trackId) {
    if (!this.track(trackId)) return false;
    this._commit(() => {
      this.state.clips = this.state.clips.filter((c) => c.trackId !== trackId);
      this.state.tracks = this.state.tracks.filter((t) => t.id !== trackId);
    });
    return true;
  }

  // ---- clips ----
  addClip({ trackId, assetId = null, source, name = "clip", start = 0, duration = 1, in: inP, out: outP } = {}) {
    if (!this.track(trackId)) throw new Error(`unknown track ${trackId}`);
    if (typeof start !== "number" || typeof duration !== "number" || duration <= 0) throw new Error("clip needs numeric start and positive duration");
    const clip = { id: uid("clip"), trackId, source: source || { type: "asset", id: assetId }, name, start, duration };
    if (inP !== undefined) clip.in = inP;
    if (outP !== undefined) clip.out = outP;
    this._commit(() => this.state.clips.push(clip));
    return clip;
  }
  // drag/drop: move a clip to another track and/or new start position
  moveClip(clipId, { trackId, start } = {}) {
    const clip = this.clip(clipId);
    if (!clip) throw new Error(`unknown clip ${clipId}`);
    if (trackId !== undefined && !this.track(trackId)) throw new Error(`unknown target track ${trackId}`);
    this._commit(() => {
      if (trackId !== undefined) clip.trackId = trackId;
      if (start !== undefined) clip.start = Math.max(0, start);
    });
    return clip;
  }
  // delete with ripple semantics
  removeClip(clipId, mode = "static") {
    if (!DELETE_MODES.includes(mode)) throw new Error(`invalid delete mode ${mode}`);
    const clip = this.clip(clipId);
    if (!clip) return false;
    const { trackId, start, duration } = clip;
    this._commit(() => {
      this.state.clips = this.state.clips.filter((c) => c.id !== clipId);
      if (mode === "ripple") {
        for (const c of this.state.clips) {
          if (c.trackId === trackId && c.start >= start) c.start = Math.max(0, c.start - duration);
        }
      } else if (mode === "cascade") {
        for (const c of this.state.clips) {
          if (c.start >= start) c.start = Math.max(0, c.start - duration);
        }
      }
    });
    return true;
  }
  rename(name) { this._commit(() => { this.state.name = String(name); }); return this.state.name; }

  // ---- persistence ----
  serialize() { return JSON.stringify(this.state); }
  validate() { return validate(this.state); }
  static fromJSON(json) { return new EditorRuntime(typeof json === "string" ? JSON.parse(json) : json); }
}

// ---- keyboard shortcuts (data + resolver) ----
const SHORTCUTS = {
  "mod+z": "undo",
  "mod+shift+z": "redo",
  "mod+y": "redo",
  "delete": "rippleDelete",
  "backspace": "rippleDelete",
  "shift+delete": "cascadeDelete",
  "alt+delete": "staticDelete",
  "mod+s": "save",
  "mod+c": "copy",
  "mod+x": "cut",
  "mod+v": "paste",
  "mod+d": "duplicate",
  "mod+a": "selectAll",
  "space": "playPause",
  "[": "trimIn",
  "]": "trimOut",
  "=": "zoomIn",
  "-": "zoomOut",
};
function resolveShortcut(ev = {}) {
  const parts = [];
  if (ev.meta || ev.ctrl || ev.metaKey || ev.ctrlKey) parts.push("mod");
  if (ev.alt || ev.altKey) parts.push("alt");
  if (ev.shift || ev.shiftKey) parts.push("shift");
  const key = String(ev.key || "").toLowerCase();
  if (key && !["control", "meta", "shift", "alt"].includes(key)) parts.push(key === " " ? "space" : key);
  return SHORTCUTS[parts.join("+")] || null;
}

module.exports = {
  CURRENT_VERSION, TRACK_KINDS, DELETE_MODES, SHORTCUTS,
  newDoc, migrate, validate, resolveShortcut, EditorRuntime,
};
