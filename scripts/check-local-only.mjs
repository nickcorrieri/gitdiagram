import { readdir, readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { browserHeaders } from "./http-policy.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const failures = [];
async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await walk(path);
    else if (/\.(?:tsx?|css)$/.test(path) && !/\.test\./.test(path)) {
      const text = await readFile(path, "utf8");
      // This is a narrow source regression guard, not a dependency audit.
      for (const [name, pattern] of [
        [
          "outbound browser API",
          /\b(?:fetch|WebSocket|EventSource|XMLHttpRequest)\s*\(|\bsendBeacon\s*\(/,
        ],
        [
          "external module/script/font source",
          /(?:from\s*|import\s*\(|(?:src|href)\s*=\s*)["'](?:https?:)?\/\//,
        ],
        [
          "external CSS resource",
          /(?:@import\s*|url\(\s*)["']?(?:https?:)?\/\//,
        ],
        [
          "removed cloud SDK",
          /["'](?:posthog-js|openai|@anthropic-ai\/sdk|@aws-sdk\/[^"']+)["']/,
        ],
      ])
        if (pattern.test(text)) failures.push(`${path}: ${name}`);
    }
  }
}
await walk(join(root, "src"));
for (const removed of [
  "src/app/api",
  "src/server",
  "workers",
  "experiments",
  "public/video-engine",
]) {
  if (
    await stat(join(root, removed)).then(
      () => true,
      () => false,
    )
  )
    failures.push(`${removed}: upstream service directory returned`);
}
const pkg = JSON.parse(await readFile(join(root, "package.json"), "utf8"));
for (const name of Object.keys({
  ...pkg.dependencies,
  ...pkg.devDependencies,
})) {
  if (
    /posthog|openai|anthropic|aws-sdk|redis|ffmpeg|chromium|puppeteer|wrangler/i.test(
      name,
    )
  )
    failures.push(`Removed service package: ${name}`);
}
if (pkg.scripts.prepare || pkg.scripts.postinstall || pkg.scripts.preinstall)
  failures.push("Automatic package hook present");
const policy = browserHeaders().find(
  (header) => header.key === "Content-Security-Policy",
)?.value;
if (
  !policy?.includes("connect-src 'none'") ||
  !policy.includes("form-action 'none'")
)
  failures.push("Production network/form policy missing");
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else
  console.log(
    "Local source boundaries passed; dependency and browser traffic verification are separate checks.",
  );
