import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { GET, dynamic } from "../app/api/config/route.ts";
import { GET as getRuntimeConfig, dynamic as runtimeDynamic } from "../app/api/runtime-config/route.ts";

const originalBaseURL = process.env.BASE_URL;
const originalApiURL = process.env.API_URL;

afterEach(() => {
  if (originalBaseURL === undefined) {
    delete process.env.BASE_URL;
  } else {
    process.env.BASE_URL = originalBaseURL;
  }
  if (originalApiURL === undefined) {
    delete process.env.API_URL;
  } else {
    process.env.API_URL = originalApiURL;
  }
});

test("configuration is evaluated dynamically", () => {
  assert.equal(dynamic, "force-dynamic");
  assert.equal(runtimeDynamic, "force-dynamic");
});

test("runtime configuration supports BASE_URL when API_URL is unset", async () => {
  delete process.env.API_URL;
  process.env.BASE_URL = " http://localhost:8080/api ";
  const response = getRuntimeConfig();
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  assert.deepEqual(await response.json(), { apiUrl: "http://localhost:8080/api" });
});

test("runtime configuration prefers API_URL and reads changes dynamically", async () => {
  process.env.BASE_URL = "http://localhost:8080/api";
  for (const apiUrl of ["https://api.example.test/api", "http://api.example.test/api"]) {
    process.env.API_URL = ` ${apiUrl} `;
    const response = getRuntimeConfig();
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("Cache-Control"), "no-store");
    assert.deepEqual(await response.json(), { apiUrl });
  }
});

test("invalid API_URL is rejected rather than falling back to BASE_URL", async () => {
  process.env.BASE_URL = "http://localhost:8080/api";
  for (const apiUrl of ["", "   ", "not-a-url", "ftp://api.example.test", "http://user:pass@api.example.test"]) {
    process.env.API_URL = apiUrl;
    const response = getRuntimeConfig();
    assert.equal(response.status, 500);
    assert.equal(response.headers.get("Cache-Control"), "no-store");
    const body = await response.json();
    assert.equal(typeof body.error, "string");
    assert.equal(body.apiUrl, undefined);
  }
});

test("runtime configuration rejects missing API_URL and BASE_URL", async () => {
  delete process.env.API_URL;
  delete process.env.BASE_URL;
  assert.equal(getRuntimeConfig().status, 500);
});

for (const baseURL of [undefined, "", "   ", "not-a-url", "ftp://api.example.test", "https://user:password@api.example.test"]) {
  test(`rejects missing or invalid configuration: ${baseURL}`, async () => {
    if (baseURL === undefined) {
      delete process.env.BASE_URL;
    } else {
      process.env.BASE_URL = baseURL;
    }
    const response = GET();
    assert.equal(response.status, 503);
    assert.equal(response.headers.get("Cache-Control"), "no-store");
    const body = await response.json();
    assert.equal(typeof body.error, "string");
    assert.equal(body.baseURL, undefined);
  });
}

test("returns only the current API address, without caching or rebuilding", async () => {
  for (const baseURL of ["http://localhost:8080/api", "https://api.example.test/api"]) {
    process.env.BASE_URL = ` ${baseURL} `;
    const response = GET();
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("Cache-Control"), "no-store");
    assert.deepEqual(await response.json(), { baseURL });
  }
});
