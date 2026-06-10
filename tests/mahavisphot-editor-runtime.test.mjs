import test from "node:test";
import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import fs from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const rt = require("../editor/timeline-runtime.js");

test("migrates a v1 document to v2 (fields, compositions, idempotent)", () => {
  const v1 = {
    schemaVersion: 1, name: "Old",
    tracks: [{ id: "t1", kind: "video", name: "V1" }],
    clips: [{ id: "c1", trackId: "t1", assetId: "a1", startSec: 2, durationSec: 3, inSec: 0.5 }],
  };
  const m = rt.migrate(v1);
  assert.equal(m.schemaVersion, 2);
  assert.ok(m.compositions.some((c) => c.root));
  assert.equal(m.tracks[0].compositionId, m.compositions.find((c) => c.root).id);
  assert.equal(m.clips[0].start, 2);
  assert.equal(m.clips[0].duration, 3);
  assert.equal(m.clips[0].in, 0.5);
  assert.equal(m.clips[0].source.type, "asset");
  // idempotent
  assert.deepEqual(rt.migrate(m), m);
});

test("nested compositions + cycle guard", () => {
  const e = new rt.EditorRuntime();
  const root = e.rootComp();
  const tr = e.addTrack({ compositionId: root.id, kind: "video", name: "V1" });
  const sub = e.addComposition({ name: "Sub" });
  const clip = e.addClip({ trackId: tr.id, start: 0, duration: 4 });
  e.nestComposition(clip.id, sub.id);
  assert.equal(e.clip(clip.id).source.type, "composition");
  assert.equal(e.clip(clip.id).source.id, sub.id);

  // self-nest (root into a clip living in root) must throw
  const clip2 = e.addClip({ trackId: tr.id, start: 5, duration: 4 });
  assert.throws(() => e.nestComposition(clip2.id, root.id), /cycle/);

  // transitive cycle: put a track+clip inside `sub`, nest root-container into it
  const subTrack = e.addTrack({ compositionId: sub.id, kind: "video", name: "S1" });
  const subClip = e.addClip({ trackId: subTrack.id, start: 0, duration: 2 });
  assert.throws(() => e.nestComposition(subClip.id, root.id), /cycle/);
});

test("moveClip implements drag/drop across tracks + reposition", () => {
  const e = new rt.EditorRuntime();
  const a = e.addTrack({ kind: "video", name: "V1" });
  const b = e.addTrack({ kind: "video", name: "V2" });
  const c = e.addClip({ trackId: a.id, start: 1, duration: 3 });
  e.moveClip(c.id, { trackId: b.id, start: 7 });
  assert.equal(e.clip(c.id).trackId, b.id);
  assert.equal(e.clip(c.id).start, 7);
  assert.throws(() => e.moveClip(c.id, { trackId: "nope" }), /unknown target track/);
});

test("ripple / cascade / static delete semantics", () => {
  function setup() {
    const e = new rt.EditorRuntime();
    const t1 = e.addTrack({ kind: "video", name: "V1" });
    const t2 = e.addTrack({ kind: "video", name: "V2" });
    const c0 = e.addClip({ trackId: t1.id, start: 0, duration: 5 });
    const cMid = e.addClip({ trackId: t1.id, start: 5, duration: 5 });
    const cEnd = e.addClip({ trackId: t1.id, start: 10, duration: 5 });
    const cOther = e.addClip({ trackId: t2.id, start: 8, duration: 5 });
    return { e, c0, cMid, cEnd, cOther };
  }
  // static: gap left, nothing shifts
  let { e, cMid, cEnd, cOther } = setup();
  e.removeClip(cMid.id, "static");
  assert.equal(e.clip(cEnd.id).start, 10);
  assert.equal(e.clip(cOther.id).start, 8);

  // ripple: same-track clips after the gap shift left by duration
  ({ e, cMid, cEnd, cOther } = setup());
  e.removeClip(cMid.id, "ripple");
  assert.equal(e.clip(cEnd.id).start, 5);
  assert.equal(e.clip(cOther.id).start, 8); // other track untouched

  // cascade: all tracks shift
  ({ e, cMid, cEnd, cOther } = setup());
  e.removeClip(cMid.id, "cascade");
  assert.equal(e.clip(cEnd.id).start, 5);
  assert.equal(e.clip(cOther.id).start, 3);
});

test("undo/redo stack restores and reapplies state", () => {
  const e = new rt.EditorRuntime();
  const t = e.addTrack({ kind: "video", name: "V1" });
  assert.equal(e.canUndo(), true);
  const c = e.addClip({ trackId: t.id, start: 0, duration: 4 });
  assert.equal(e.state.clips.length, 1);
  e.undo(); // undo addClip
  assert.equal(e.state.clips.length, 0);
  assert.equal(e.canRedo(), true);
  e.redo(); // redo addClip
  assert.equal(e.state.clips.length, 1);
  assert.equal(e.clip(c.id) ? true : false, true);
  // a fresh commit clears redo
  e.addTrack({ kind: "audio", name: "A1" });
  assert.equal(e.canRedo(), false);
});

test("keyboard shortcut resolver maps events to actions", () => {
  assert.equal(rt.resolveShortcut({ key: "z", metaKey: true }), "undo");
  assert.equal(rt.resolveShortcut({ key: "z", ctrlKey: true, shiftKey: true }), "redo");
  assert.equal(rt.resolveShortcut({ key: "Delete" }), "rippleDelete");
  assert.equal(rt.resolveShortcut({ key: "Delete", shiftKey: true }), "cascadeDelete");
  assert.equal(rt.resolveShortcut({ key: "Delete", altKey: true }), "staticDelete");
  assert.equal(rt.resolveShortcut({ key: " " }), "playPause");
  assert.equal(rt.resolveShortcut({ key: "[" }), "trimIn");
  assert.equal(rt.resolveShortcut({ key: "q" }), null);
});

test("serialize/load round-trip parity", () => {
  const e = new rt.EditorRuntime();
  const t = e.addTrack({ kind: "video", name: "V1" });
  e.addClip({ trackId: t.id, start: 0, duration: 4 });
  e.addClip({ trackId: t.id, start: 4, duration: 4 });
  const s1 = e.serialize();
  const reloaded = rt.EditorRuntime.fromJSON(s1);
  const s2 = reloaded.serialize();
  assert.equal(s1, s2);
  assert.deepEqual(reloaded.state, e.state);
  assert.deepEqual(rt.validate(reloaded.state), []);
});

test("validate catches dangling references", () => {
  const bad = {
    schemaVersion: 2,
    compositions: [{ id: "r", name: "Main", parentId: null, root: true }],
    tracks: [],
    clips: [{ id: "c", trackId: "nope", start: 0, duration: 1, source: { type: "asset", id: null } }],
  };
  const errors = rt.validate(bad);
  assert.ok(errors.some((e) => /missing track/.test(e)));
});

test("HTTP: editor doc save/load parity + migration + validation", async () => {
  process.env.MAHAVISPHOT_DATA_DIR = fs.mkdtempSync(path.join(os.tmpdir(), "mvp-edit-"));
  const mod = require("../editor/server.js");
  await mod.startServer(0, "127.0.0.1", "t");
  const base = `http://127.0.0.1:${mod.server.address().port}`;

  let r = await fetch(`${base}/api/auth/register`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: "edit@test.co", password: "password123" }),
  });
  assert.equal(r.status, 201, await r.text());
  const cookie = r.headers.getSetCookie().map((c) => c.split(";")[0]).join("; ");
  const H = { "content-type": "application/json", cookie };

  // PUT a v1 doc -> migrated + persisted
  const v1 = {
    schemaVersion: 1, name: "Aham Cut",
    tracks: [{ id: "t1", kind: "video", name: "V1" }],
    clips: [{ id: "c1", trackId: "t1", assetId: "a1", startSec: 1, durationSec: 2 }],
  };
  r = await fetch(`${base}/api/v1/editor/doc`, { method: "PUT", headers: H, body: JSON.stringify({ projectId: "aham", doc: v1 }) });
  let j = await r.json();
  assert.equal(r.status, 200, JSON.stringify(j));
  assert.equal(j.doc.schemaVersion, 2);
  assert.equal(j.doc.clips[0].duration, 2);

  // GET back -> save/load parity
  r = await fetch(`${base}/api/v1/editor/doc?projectId=aham`, { headers: H });
  j = await r.json();
  assert.equal(j.migrated, true);
  assert.equal(j.doc.clips[0].start, 1);
  assert.deepEqual(rt.validate(j.doc), []);

  // invalid doc -> 422
  r = await fetch(`${base}/api/v1/editor/doc`, { method: "PUT", headers: H,
    body: JSON.stringify({ projectId: "bad", doc: { schemaVersion: 2, compositions: [{ id: "r", root: true, parentId: null }], tracks: [], clips: [{ id: "c", trackId: "nope", start: 0, duration: 1 }] } }) });
  assert.equal(r.status, 422);

  mod.server.close();
});
