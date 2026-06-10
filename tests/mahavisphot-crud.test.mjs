import test from "node:test";
import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import fs from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const crud = require("../editor/crud.js");

const EXPECTED = [
  "assets", "scenes", "shots", "timelines", "tracks", "clips", "compositions",
  "captions", "markers", "notes", "vfx_nodes", "render_jobs", "evidence_artifacts",
];

const tmp = (p) => fs.mkdtempSync(path.join(os.tmpdir(), p));

test("registry exposes all 13 CRUD entities", () => {
  assert.equal(crud.ENTITIES.length, 13);
  for (const e of EXPECTED) assert.ok(crud.ENTITIES.includes(e), `missing entity ${e}`);
});

test("validate rejects missing required / bad enum / unknown field / wrong type", () => {
  assert.equal(crud.validate("assets", {}).ok, false);
  assert.equal(crud.validate("assets", { name: "a", kind: "bogus", path: "p" }).ok, false);
  assert.equal(crud.validate("assets", { name: "a", kind: "video", path: "p", nope: 1 }).ok, false);
  assert.equal(crud.validate("assets", { name: "a", kind: "video", path: 5 }).ok, false);
  assert.equal(crud.validate("assets", "not-an-object").ok, false);
  assert.equal(crud.validate("nonexistent", { a: 1 }).ok, false);
});

test("validate applies defaults and accepts valid input", () => {
  const r = crud.validate("tracks", { timelineId: "t1", kind: "video", name: "V1" });
  assert.ok(r.ok, JSON.stringify(r.errors));
  assert.equal(r.value.index, 0);
  assert.equal(r.value.locked, false);
  assert.equal(r.value.muted, false);
  const j = crud.validate("render_jobs", {});
  assert.ok(j.ok);
  assert.equal(j.value.status, "queued");
});

test("validate partial (update) allows missing required fields", () => {
  const r = crud.validate("assets", { name: "rename" }, { partial: true });
  assert.ok(r.ok);
  assert.deepEqual(r.value, { name: "rename" });
  // still rejects bad types in partial mode
  assert.equal(crud.validate("assets", { fps: "fast" }, { partial: true }).ok, false);
});

test("store create/get/list/update/remove round-trip persists to disk", async () => {
  const dir = tmp("mvp-crud-");
  const store = crud.createStore(dir);
  const u = "user_abc";

  const created = await store.create(u, "clips", { trackId: "tr1", startSec: 0, durationSec: 2.5, name: "c1" });
  assert.match(created.id, /^clips_/);
  assert.equal(created.entity, "clips");
  assert.ok(created.createdAt && created.updatedAt);

  // persisted to its own file
  assert.ok(fs.existsSync(store.fileFor(u, "clips")));

  assert.equal((await store.list(u, "clips")).length, 1);
  assert.equal((await store.get(u, "clips", created.id)).name, "c1");

  const upd = await store.update(u, "clips", created.id, { name: "c1-renamed" });
  assert.equal(upd.name, "c1-renamed");
  assert.equal(upd.createdAt, created.createdAt);
  assert.equal((await store.list(u, "clips")).length, 1);

  assert.equal(await store.remove(u, "clips", created.id), true);
  assert.equal(await store.remove(u, "clips", created.id), false);
  assert.equal((await store.list(u, "clips")).length, 0);
});

test("store.create throws ValidationError on invalid input", async () => {
  const store = crud.createStore(tmp("mvp-crud-"));
  await assert.rejects(() => store.create("u", "assets", { name: "x" }), (e) => {
    assert.equal(e.name, "ValidationError");
    assert.ok(Array.isArray(e.errors) && e.errors.length > 0);
    return true;
  });
});

test("list filters by projectId; users are isolated", async () => {
  const store = crud.createStore(tmp("mvp-crud-"));
  await store.create("u1", "notes", { body: "a", projectId: "p1" });
  await store.create("u1", "notes", { body: "b", projectId: "p2" });
  await store.create("u2", "notes", { body: "c", projectId: "p1" });
  assert.equal((await store.list("u1", "notes", { projectId: "p1" })).length, 1);
  assert.equal((await store.list("u1", "notes")).length, 2);
  assert.equal((await store.list("u2", "notes")).length, 1);
});

test("HTTP: /api/v1 introspection + auth-gated CRUD round-trip", async () => {
  process.env.MAHAVISPHOT_DATA_DIR = tmp("mvp-srv-");
  const mod = require("../editor/server.js");
  await mod.startServer(0, "127.0.0.1", "test-token");
  const base = `http://127.0.0.1:${mod.server.address().port}`;

  // introspection is open (no auth)
  let r = await fetch(`${base}/api/v1`);
  let j = await r.json();
  assert.equal(r.status, 200);
  assert.equal(j.entities.length, 13);

  // writes require auth
  r = await fetch(`${base}/api/v1/assets`, { method: "POST", headers: { "content-type": "application/json" }, body: "{}" });
  assert.equal(r.status, 401);

  // register -> session cookie
  r = await fetch(`${base}/api/auth/register`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: "crud@test.co", password: "password123" }),
  });
  assert.equal(r.status, 201, await r.text());
  const cookie = r.headers.getSetCookie().map((c) => c.split(";")[0]).join("; ");
  const H = { "content-type": "application/json", cookie };

  // create
  r = await fetch(`${base}/api/v1/assets`, { method: "POST", headers: H,
    body: JSON.stringify({ name: "Aham WAV", kind: "audio", path: "अहं ब्रह्मास्मि.wav", durationSec: 201.84 }) });
  j = await r.json();
  assert.equal(r.status, 201, JSON.stringify(j));
  assert.match(j.record.id, /^assets_/);
  const id = j.record.id;

  // list
  r = await fetch(`${base}/api/v1/assets`, { headers: H });
  j = await r.json();
  assert.equal(j.count, 1);

  // invalid create -> 422 with details
  r = await fetch(`${base}/api/v1/assets`, { method: "POST", headers: H, body: JSON.stringify({ name: "x" }) });
  j = await r.json();
  assert.equal(r.status, 422);
  assert.ok(Array.isArray(j.details));

  // update
  r = await fetch(`${base}/api/v1/assets/${id}`, { method: "PATCH", headers: H, body: JSON.stringify({ name: "renamed" }) });
  j = await r.json();
  assert.equal(j.record.name, "renamed");

  // delete + confirm gone
  r = await fetch(`${base}/api/v1/assets/${id}`, { method: "DELETE", headers: H });
  assert.equal(r.status, 200);
  r = await fetch(`${base}/api/v1/assets`, { headers: H });
  j = await r.json();
  assert.equal(j.count, 0);

  // unknown entity -> 404
  r = await fetch(`${base}/api/v1/bogus`, { headers: H });
  assert.equal(r.status, 404);

  mod.server.close();
});
