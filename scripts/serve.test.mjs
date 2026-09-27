import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { mkdtemp, mkdir, writeFile, symlink, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { request as httpRequest } from "node:http";
import { createStaticServer } from "./serve.mjs";

let directory, server, port;
before(async () => {
  directory = await mkdtemp(join(tmpdir(), "gitdiagram-server-"));
  await mkdir(join(directory, "out"));
  await writeFile(join(directory, "out/index.html"), "local viewer");
  await writeFile(join(directory, "secret"), "private");
  await symlink(join(directory, "secret"), join(directory, "out/leak"));
  server = await createStaticServer(join(directory, "out"));
  await new Promise((done) => server.listen(0, "127.0.0.1", done));
  port = server.address().port;
});
after(async () => {
  await new Promise((done) => server.close(done));
  await rm(directory, { recursive: true, force: true });
});
function get(path, method = "GET") {
  return new Promise((done, fail) => {
    const request = httpRequest({ host: "127.0.0.1", port, path, method }, (response) => {
      let body = "";
      response.setEncoding("utf8");
      response.on("data", (part) => { body += part; });
      response.on("end", () => done({ status: response.statusCode, headers: response.headers, body }));
    });
    request.on("error", fail); request.end();
  });
}
test("serves static files with network-denying browser policy", async () => {
  const result = await get("/");
  assert.equal(result.status, 200); assert.equal(result.body, "local viewer");
  assert.match(result.headers["content-security-policy"], /connect-src 'none'/);
  assert.match(result.headers["content-security-policy"], /form-action 'none'/);
  assert.equal(result.headers["referrer-policy"], "no-referrer");
});
test("rejects uploads, API mutations, traversal and external symlinks", async () => {
  assert.equal((await get("/api/report", "POST")).status, 405);
  assert.equal((await get("/api/report")).status, 404);
  for (const path of ["/../secret", "/%2e%2e/secret", "/.env", "/%00", "/%5csecret", "/%ZZ"]) {
    assert.equal((await get(path)).status, path === "/%ZZ" ? 404 : 400);
  }
  assert.equal((await get("/leak")).status, 404);
});
test("HEAD does not return content", async () => {
  const result = await get("/", "HEAD");
  assert.equal(result.status, 200); assert.equal(result.body, "");
});
