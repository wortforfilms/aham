import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  VALID_MAHAVISPHOT_ENDPOINT_METHODS,
  VALID_MAHAVISPHOT_RUNTIME_MODES,
  VALID_MAHAVISPHOT_STATUSES,
  validateMahavisphotEndpointMethod,
  validateMahavisphotRoutePath,
  validateMahavisphotTableName,
} from "../src/mahavisphot/validation/mahavisphot-validation.ts";
import { MAHAVISPHOT_API_ENDPOINTS } from "../src/mahavisphot/registry/mahavisphot-api.ts";
import { MAHAVISPHOT_DATABASE_TABLES } from "../src/mahavisphot/registry/mahavisphot-tables.ts";
import { MAHAVISPHOT_PAGES } from "../src/mahavisphot/registry/mahavisphot-pages.ts";
import { MAHAVISPHOT_SCHEMA_REGISTRY } from "../src/mahavisphot/registry/mahavisphot-schema.ts";

const readJson = (relativePath) => JSON.parse(readFileSync(new URL(relativePath, import.meta.url), "utf8"));

const pages = readJson("../src/mahavisphot/data/mahavisphot-pages.json");
const apiEndpoints = readJson("../src/mahavisphot/data/mahavisphot-api.json");
const tables = readJson("../src/mahavisphot/data/mahavisphot-tables.json");
const schema = readJson("../src/mahavisphot/data/mahavisphot-schema.json");

test("Mahavisphot JSON registries match TypeScript registries", () => {
  assert.deepEqual(pages, JSON.parse(JSON.stringify(MAHAVISPHOT_PAGES)));
  assert.deepEqual(apiEndpoints, JSON.parse(JSON.stringify(MAHAVISPHOT_API_ENDPOINTS)));
  assert.deepEqual(tables, JSON.parse(JSON.stringify(MAHAVISPHOT_DATABASE_TABLES)));
  assert.deepEqual(schema, JSON.parse(JSON.stringify(MAHAVISPHOT_SCHEMA_REGISTRY)));
});

test("Mahavisphot page registry contains at least 400 unique pages and routes", () => {
  assert.ok(pages.length >= 400);
  assert.equal(new Set(pages.map((page) => page.id)).size, pages.length);
  assert.equal(new Set(pages.map((page) => page.route)).size, pages.length);
});

test("Mahavisphot API endpoints have valid methods and /api/v1 paths", () => {
  for (const endpoint of apiEndpoints) {
    assert.ok(VALID_MAHAVISPHOT_ENDPOINT_METHODS.includes(endpoint.method), endpoint.id);
    assert.ok(endpoint.path.startsWith("/api/v1"), endpoint.path);
  }
});

test("Mahavisphot table names are snake_case", () => {
  for (const table of tables) {
    assert.match(table.name, /^[a-z][a-z0-9]*(?:_[a-z0-9]+)*$/, table.name);
  }
});

test("Mahavisphot feature statuses are valid", () => {
  const statusValues = [
    ...schema.modules.map((module) => module.status),
    ...schema.capabilityGates.map((gate) => gate.status),
    ...schema.entities.map((entity) => entity.status),
    ...pages.map((page) => page.status),
    ...apiEndpoints.map((endpoint) => endpoint.status),
    ...tables.map((table) => table.status),
  ];
  for (const status of statusValues) {
    assert.ok(VALID_MAHAVISPHOT_STATUSES.includes(status), status);
  }
});

test("Mahavisphot AI runtime modes and required studios exist", () => {
  for (const mode of ["local", "cloud", "hybrid"]) {
    assert.ok(VALID_MAHAVISPHOT_RUNTIME_MODES.includes(mode), mode);
    assert.ok(schema.runtimeModes.includes(mode), mode);
  }
  const moduleNames = new Set(schema.modules.map((module) => module.name));
  assert.ok(moduleNames.has("Toon Designer Studio"));
  assert.ok(moduleNames.has("Cel Animation Studio"));
  assert.ok(moduleNames.has("Digital Makeup Studio"));
  assert.ok(moduleNames.has("Costume Studio"));
  assert.ok(moduleNames.has("Props Studio"));
});

test("No page is marked production without evidenceReference", () => {
  for (const page of pages) {
    if (page.status === "production") {
      assert.equal(typeof page.evidenceReference, "string", page.id);
      assert.notEqual(page.evidenceReference.trim(), "", page.id);
    }
  }
});

test("Mahavisphot validators reject invalid route, method, and table name", () => {
  assert.equal(validateMahavisphotRoutePath("mahavisphot/no-leading-slash").ok, false);
  assert.equal(validateMahavisphotEndpointMethod("TRACE").ok, false);
  assert.equal(validateMahavisphotTableName("Bad-Table-Name").ok, false);
});
