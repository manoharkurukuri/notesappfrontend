import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { GET, dynamic } from "../app/api/config/route.ts";

const originalBaseURL = process.env.BASE_URL;

afterEach(() => {
  if (originalBaseURL === undefined) {
    delete process.env.BASE_URL;
  } else {
    process.env.BASE_URL = originalBaseURL;
  }
});

test("configuration is evaluated dynamically", () => {
  assert.equal(dynamic, "force-dynamic");
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
