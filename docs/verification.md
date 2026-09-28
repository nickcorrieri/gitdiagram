# Local fork verification

Verified on 2026-09-27 using the locked dependencies, Node 22.23.2 and the static production export. Dependencies were installed only after operator approval, with lifecycle scripts disabled.

## Completed checks

- `npm run check`: lint, TypeScript, 66 tests across seven test files, three static-server tests, and the local source boundary scan passed.
- `npm run build`: Next.js produced the static export successfully. It reports a non-failing metadata warning because the original social images default to localhost.
- `npm audit --package-lock-only`: zero known advisories in this resolved tree.
- The original author's README body and MIT license remain preserved.

## Browser evidence

A temporary copy of the static export received an inline probe before application scripts. The probe recorded fetch, XMLHttpRequest, WebSocket, EventSource and sendBeacon calls, browser resource entries, CSP violations, console-level errors, and browser-generated download blobs. This probe was used only for verification and is not included in the production app.

The tested flows included sample rendering, all eight prompt/template/schema/sample/report/Mermaid/SVG/PNG downloads, explicit browser saving, reload followed by explicit restoration, clearing the saved copy, and importing a synthetic JSON report through the browser's file picker.

The final probe observed no calls to the monitored network APIs, no external resource URLs, no CSP violations and no errors. All eight export actions generated nonempty local blobs; SVG and PNG rendering completed. File import rendered successfully, and clearing prevented saved-report restoration.

The first probe caught Zod checking whether dynamic `Function` generation was allowed for its validator optimization. Production CSP blocked it. The fork now sets `jitless: true`, and the final probe observed no dynamic-code violation.

## Limits

This is evidence for the listed workflows and exact locked build, not a whole-machine packet capture, complete dependency source/binary audit, or verification of every possible input. Build-time network behavior and arbitrary operator proxies/extensions were not measured. The production policy denies browser network connections and external resources; operators must preserve those headers when using a different static host.

## Caddy hosting

On 2026-09-28, the supplied Caddy site block and the combined local server configuration passed `caddy validate`. The local server was reloaded to serve the existing static export at `http://gitdiagram.localhost`. Terminal HTTP checks confirmed the page and a JavaScript asset return 200, all six production security headers match `scripts/http-policy.mjs`, HEAD works, POST returns 405, and requests for source files, hidden files, an API path and parent traversal return 404. The existing `mt.localhost` site still returned 200. The exported tree contained no symlinks. No browser interaction was used for these hosting checks; rejection of remote clients was configured but not tested from another machine.
