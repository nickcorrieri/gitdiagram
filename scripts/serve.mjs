import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { realpath, stat } from "node:fs/promises";
import { extname, isAbsolute, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { pipeline } from "node:stream/promises";
import { browserHeaders } from "./http-policy.mjs";

const types = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png",
  ".ico": "image/x-icon", ".woff2": "font/woff2",
};
function isInside(root, path) {
  const subpath = relative(root, path);
  return subpath !== ".." && !subpath.startsWith(`..${sep}`) && !isAbsolute(subpath);
}
export async function createStaticServer(directory) {
  const root = await realpath(directory);
  return createServer(async (request, response) => {
    for (const { key, value } of browserHeaders()) response.setHeader(key, value);
    if (request.method !== "GET" && request.method !== "HEAD") {
      response.writeHead(405, { Allow: "GET, HEAD" });
      response.end("This viewer does not accept uploads or API requests.");
      return;
    }
    try {
      // Check the raw path before URL normalization can hide ../ traversal.
      // Queries are not logged or used, and no request body is accepted.
      const path = decodeURIComponent((request.url ?? "/").split("?")[0]);
      if (!path.startsWith("/") || path.includes("\\") || path.includes("\0") ||
          path.split("/").some((part) => part === ".." || part === "." || part.startsWith("."))) {
        response.writeHead(400); response.end("Invalid path."); return;
      }
      let file = resolve(root, `.${path}`);
      if (!isInside(root, file)) throw new Error("Outside static directory");
      if ((await stat(file)).isDirectory()) file = resolve(file, "index.html");
      file = await realpath(file);
      if (!isInside(root, file)) throw new Error("Symlink outside static directory");
      const info = await stat(file);
      if (!info.isFile()) throw new Error("Not a file");
      response.writeHead(200, {
        "Content-Type": types[extname(file)] ?? "application/octet-stream",
        "Content-Length": info.size,
      });
      if (request.method === "HEAD") response.end();
      else await pipeline(createReadStream(file), response);
    } catch {
      if (!response.headersSent) { response.writeHead(404); response.end("Not found."); }
      else response.destroy();
    }
  });
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const directory = fileURLToPath(new URL("../out/", import.meta.url));
  const host = process.env.HOST || "127.0.0.1";
  const port = Number(process.env.PORT || "3000");
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("Invalid PORT");
  const server = await createStaticServer(directory);
  server.on("error", (error) => { console.error(error.message); process.exitCode = 1; });
  server.listen(port, host, () => console.log(`GitDiagram Local listening on ${host}:${port}`));
  for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => server.close());
}
