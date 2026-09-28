# Resolved dependency inventory

Generated from `package-lock.json`. The approved dependencies were installed locally with npm lifecycle scripts disabled (558 packages on this platform). The lockfile also lists platform-optional packages that were not installed.

- Direct packages: 22 (6 application, 16 development/build).
- Resolved lockfile package entries: 665, including platform-optional packages.
- Registry host in resolved URLs: `registry.npmjs.org` only.
- Locked install-script metadata: `unrs-resolver@1.12.2` and optional `fsevents@2.3.3`; neither script ran.
- Security advisory scan (`npm audit --package-lock-only`): 0 known vulnerabilities at verification time. This is not a source or binary audit.
- Runtime serves built static files with Node. Build/test packages are not copied into the runtime Docker image.
- Mermaid 11.17.2 and the `lodash-es` 4.18.1 override passed rendering, tests and the static build.
- All required test peers are now declared directly. See [verification](docs/verification.md) for test and browser evidence.

## Privacy and local-use risk

- `next`, `react`, `react-dom`, `mermaid`, `dompurify`, and `zod` are application dependencies. Mermaid renders imported graph data in the browser; DOMPurify sanitizes its SVG. A dependency defect could still affect rendering or privacy. The production server serves static files with a policy that denies browser network connections, external images, frames, and form submissions. The sample/import/export/browser-storage workflows passed a temporary browser probe; see docs/verification.md for the scope and limits.
- The other 16 direct packages and their indirect dependencies run only for builds, CSS compilation, linting, type checking, formatting, or tests. Build tools can read the project and may have network access while they run. `NEXT_TELEMETRY_DISABLED=1` disables the known Next.js telemetry path; it is not a blanket audit of every package. Do not build with access to secrets you would not trust these tools to read.
- npm package resolution and installation contact the registry. The installs disabled package lifecycle scripts. The lock declares install scripts for `unrs-resolver` and platform-optional `fsevents`; neither script ran. Native/platform-optional packages account for some of the 665 entries.
- Next.js and its build chain are the largest source of dependency weight. They are retained to preserve the original app structure and styling, as requested. The runtime Docker image copies only the generated `out/` files and a small Node static server.

## Direct packages

The original Geist typography is restored using a local copy of the Latin font already bundled with the approved Next.js package. No font package was installed and no remote font service is used. The font and its SIL Open Font License are preserved in `public/fonts/`; see [NOTICE](NOTICE).

| Package                     | Version range | Why included                                               |
| --------------------------- | ------------- | ---------------------------------------------------------- |
| `@tailwindcss/postcss`      | `4.3.3`       | Compile original Tailwind CSS at build time                |
| `@testing-library/dom`      | `^10.4.2`     | DOM queries and events for local UI tests                  |
| `@testing-library/jest-dom` | `7.0.1`       | DOM test assertions                                        |
| `@testing-library/react`    | `16.3.3`      | UI behavior tests                                          |
| `@types/node`               | `^26.6.2`     | Type declarations                                          |
| `@types/react`              | `^19.3.0`     | Type declarations                                          |
| `@types/react-dom`          | `^19.3.0`     | Type declarations                                          |
| `dompurify`                 | `^3.4.16`     | SVG sanitization                                           |
| `eslint`                    | `^10.11.0`    | Source lint checks                                         |
| `eslint-config-next`        | `^16.3.6`     | Next-specific lint rules                                   |
| `jsdom`                     | `30.1.1`      | Browser simulation for tests                               |
| `mermaid`                   | `11.17.2`     | Architecture diagram layout and SVG                        |
| `next`                      | `^16.3.6`     | Existing React application build; static export only       |
| `postcss`                   | `^8.5.28`     | CSS processing at build time                               |
| `prettier`                  | `^3.9.9`      | Formatting only                                            |
| `react`                     | `^19.3.0`     | Interactive browser interface                              |
| `react-dom`                 | `^19.3.0`     | DOM rendering                                              |
| `tailwindcss`               | `^4.3.3`      | Original visual styling at build time                      |
| `typescript`                | `^6.0.3`      | Static type checks                                         |
| `vite`                      | `^8.3.1`      | Local Vitest test harness; excluded from production server |
| `vitest`                    | `5.0.1`       | Unit tests                                                 |
| `zod`                       | `^4.6.5`      | Strict imported report validation                          |

## Complete resolved tree

These packages are pulled by the direct packages above. The lockfile pins exact versions and integrity hashes. Names alone do not prove their source code is harmless.

| Package path                                                                        | Version        | Scope      | Optional | Install script metadata |
| ----------------------------------------------------------------------------------- | -------------- | ---------- | -------- | ----------------------- |
| `node_modules/@adobe/css-tools`                                                     | `4.5.0`        | Build/test | no       | no                      |
| `node_modules/@alloc/quick-lru`                                                     | `5.3.0`        | Build/test | no       | no                      |
| `node_modules/@antfu/install-pkg`                                                   | `2.1.0`        | App build  | no       | no                      |
| `node_modules/@asamuzakjp/css-color`                                                | `7.1.2`        | Build/test | no       | no                      |
| `node_modules/@asamuzakjp/css-color/node_modules/lru-cache`                         | `11.5.3`       | Build/test | no       | no                      |
| `node_modules/@asamuzakjp/dom-selector`                                             | `9.2.2`        | Build/test | no       | no                      |
| `node_modules/@asamuzakjp/dom-selector/node_modules/lru-cache`                      | `11.5.3`       | Build/test | no       | no                      |
| `node_modules/@babel/code-frame`                                                    | `7.29.7`       | Build/test | no       | no                      |
| `node_modules/@babel/compat-data`                                                   | `7.29.7`       | Build/test | no       | no                      |
| `node_modules/@babel/core`                                                          | `7.29.7`       | Build/test | no       | no                      |
| `node_modules/@babel/generator`                                                     | `7.29.8`       | Build/test | no       | no                      |
| `node_modules/@babel/helper-compilation-targets`                                    | `7.29.7`       | Build/test | no       | no                      |
| `node_modules/@babel/helper-globals`                                                | `7.29.7`       | Build/test | no       | no                      |
| `node_modules/@babel/helper-module-imports`                                         | `7.29.7`       | Build/test | no       | no                      |
| `node_modules/@babel/helper-module-transforms`                                      | `7.29.7`       | Build/test | no       | no                      |
| `node_modules/@babel/helper-string-parser`                                          | `7.29.7`       | Build/test | no       | no                      |
| `node_modules/@babel/helper-validator-identifier`                                   | `7.29.7`       | Build/test | no       | no                      |
| `node_modules/@babel/helper-validator-option`                                       | `7.29.7`       | Build/test | no       | no                      |
| `node_modules/@babel/helpers`                                                       | `7.29.7`       | Build/test | no       | no                      |
| `node_modules/@babel/parser`                                                        | `7.29.9`       | Build/test | no       | no                      |
| `node_modules/@babel/runtime`                                                       | `7.29.7`       | Build/test | no       | no                      |
| `node_modules/@babel/template`                                                      | `7.29.7`       | Build/test | no       | no                      |
| `node_modules/@babel/traverse`                                                      | `7.29.8`       | Build/test | no       | no                      |
| `node_modules/@babel/types`                                                         | `7.29.8`       | Build/test | no       | no                      |
| `node_modules/@braintree/sanitize-url`                                              | `7.1.2`        | App build  | no       | no                      |
| `node_modules/@bramus/specificity`                                                  | `2.4.2`        | Build/test | no       | no                      |
| `node_modules/@cacheable/memory`                                                    | `2.2.0`        | Build/test | no       | no                      |
| `node_modules/@cacheable/utils`                                                     | `2.5.0`        | Build/test | no       | no                      |
| `node_modules/@chevrotain/types`                                                    | `11.1.2`       | App build  | no       | no                      |
| `node_modules/@csstools/color-helpers`                                              | `6.1.2`        | Build/test | no       | no                      |
| `node_modules/@csstools/css-calc`                                                   | `3.4.1`        | Build/test | no       | no                      |
| `node_modules/@csstools/css-color-parser`                                           | `4.2.4`        | Build/test | no       | no                      |
| `node_modules/@csstools/css-parser-algorithms`                                      | `4.0.1`        | Build/test | no       | no                      |
| `node_modules/@csstools/css-syntax-patches-for-csstree`                             | `1.1.14`       | Build/test | no       | no                      |
| `node_modules/@csstools/css-tokenizer`                                              | `4.0.2`        | Build/test | no       | no                      |
| `node_modules/@emnapi/core`                                                         | `1.10.0`       | Build/test | yes      | no                      |
| `node_modules/@emnapi/runtime`                                                      | `1.11.3`       | App build  | yes      | no                      |
| `node_modules/@emnapi/wasi-threads`                                                 | `1.2.1`        | Build/test | yes      | no                      |
| `node_modules/@eslint-community/eslint-utils`                                       | `4.10.1`       | Build/test | no       | no                      |
| `node_modules/@eslint-community/eslint-utils/node_modules/eslint-visitor-keys`      | `3.4.3`        | Build/test | no       | no                      |
| `node_modules/@eslint-community/regexpp`                                            | `4.12.2`       | Build/test | no       | no                      |
| `node_modules/@eslint/config-array`                                                 | `0.23.5`       | Build/test | no       | no                      |
| `node_modules/@eslint/config-helpers`                                               | `0.7.0`        | Build/test | no       | no                      |
| `node_modules/@eslint/core`                                                         | `1.2.1`        | Build/test | no       | no                      |
| `node_modules/@eslint/object-schema`                                                | `3.0.5`        | Build/test | no       | no                      |
| `node_modules/@eslint/plugin-kit`                                                   | `0.7.3`        | Build/test | no       | no                      |
| `node_modules/@exodus/bytes`                                                        | `1.16.0`       | Build/test | no       | no                      |
| `node_modules/@humanfs/core`                                                        | `0.19.2`       | Build/test | no       | no                      |
| `node_modules/@humanfs/node`                                                        | `0.16.8`       | Build/test | no       | no                      |
| `node_modules/@humanfs/types`                                                       | `0.15.0`       | Build/test | no       | no                      |
| `node_modules/@humanwhocodes/module-importer`                                       | `1.0.1`        | Build/test | no       | no                      |
| `node_modules/@humanwhocodes/retry`                                                 | `0.4.3`        | Build/test | no       | no                      |
| `node_modules/@iconify/types`                                                       | `2.0.0`        | App build  | no       | no                      |
| `node_modules/@iconify/utils`                                                       | `3.1.7`        | App build  | no       | no                      |
| `node_modules/@img/colour`                                                          | `1.1.0`        | App build  | yes      | no                      |
| `node_modules/@img/sharp-darwin-arm64`                                              | `0.35.5`       | App build  | yes      | no                      |
| `node_modules/@img/sharp-darwin-x64`                                                | `0.35.5`       | App build  | yes      | no                      |
| `node_modules/@img/sharp-freebsd-wasm32`                                            | `0.35.5`       | App build  | yes      | no                      |
| `node_modules/@img/sharp-libvips-darwin-arm64`                                      | `1.3.4`        | App build  | yes      | no                      |
| `node_modules/@img/sharp-libvips-darwin-x64`                                        | `1.3.4`        | App build  | yes      | no                      |
| `node_modules/@img/sharp-libvips-linux-arm`                                         | `1.3.4`        | App build  | yes      | no                      |
| `node_modules/@img/sharp-libvips-linux-arm64`                                       | `1.3.4`        | App build  | yes      | no                      |
| `node_modules/@img/sharp-libvips-linux-ppc64`                                       | `1.3.4`        | App build  | yes      | no                      |
| `node_modules/@img/sharp-libvips-linux-riscv64`                                     | `1.3.4`        | App build  | yes      | no                      |
| `node_modules/@img/sharp-libvips-linux-s390x`                                       | `1.3.4`        | App build  | yes      | no                      |
| `node_modules/@img/sharp-libvips-linux-x64`                                         | `1.3.4`        | App build  | yes      | no                      |
| `node_modules/@img/sharp-libvips-linuxmusl-arm64`                                   | `1.3.4`        | App build  | yes      | no                      |
| `node_modules/@img/sharp-libvips-linuxmusl-x64`                                     | `1.3.4`        | App build  | yes      | no                      |
| `node_modules/@img/sharp-linux-arm`                                                 | `0.35.5`       | App build  | yes      | no                      |
| `node_modules/@img/sharp-linux-arm64`                                               | `0.35.5`       | App build  | yes      | no                      |
| `node_modules/@img/sharp-linux-ppc64`                                               | `0.35.5`       | App build  | yes      | no                      |
| `node_modules/@img/sharp-linux-riscv64`                                             | `0.35.5`       | App build  | yes      | no                      |
| `node_modules/@img/sharp-linux-s390x`                                               | `0.35.5`       | App build  | yes      | no                      |
| `node_modules/@img/sharp-linux-x64`                                                 | `0.35.5`       | App build  | yes      | no                      |
| `node_modules/@img/sharp-linuxmusl-arm64`                                           | `0.35.5`       | App build  | yes      | no                      |
| `node_modules/@img/sharp-linuxmusl-x64`                                             | `0.35.5`       | App build  | yes      | no                      |
| `node_modules/@img/sharp-wasm32`                                                    | `0.35.5`       | App build  | yes      | no                      |
| `node_modules/@img/sharp-webcontainers-wasm32`                                      | `0.35.5`       | App build  | yes      | no                      |
| `node_modules/@img/sharp-win32-arm64`                                               | `0.35.5`       | App build  | yes      | no                      |
| `node_modules/@img/sharp-win32-ia32`                                                | `0.35.5`       | App build  | yes      | no                      |
| `node_modules/@img/sharp-win32-x64`                                                 | `0.35.5`       | App build  | yes      | no                      |
| `node_modules/@jridgewell/gen-mapping`                                              | `0.3.13`       | Build/test | no       | no                      |
| `node_modules/@jridgewell/remapping`                                                | `2.3.5`        | Build/test | no       | no                      |
| `node_modules/@jridgewell/resolve-uri`                                              | `3.1.2`        | Build/test | no       | no                      |
| `node_modules/@jridgewell/sourcemap-codec`                                          | `1.6.0`        | Build/test | no       | no                      |
| `node_modules/@jridgewell/trace-mapping`                                            | `0.3.31`       | Build/test | no       | no                      |
| `node_modules/@keyv/bigmap`                                                         | `1.3.1`        | Build/test | no       | no                      |
| `node_modules/@keyv/serialize`                                                      | `1.1.1`        | Build/test | no       | no                      |
| `node_modules/@mermaid-js/parser`                                                   | `1.2.1`        | App build  | no       | no                      |
| `node_modules/@napi-rs/wasm-runtime`                                                | `1.2.4`        | Build/test | yes      | no                      |
| `node_modules/@next/env`                                                            | `16.3.6`       | App build  | no       | no                      |
| `node_modules/@next/eslint-plugin-next`                                             | `16.3.6`       | Build/test | no       | no                      |
| `node_modules/@next/eslint-plugin-next/node_modules/@eslint-community/eslint-utils` | `4.9.1`        | Build/test | no       | no                      |
| `node_modules/@next/eslint-plugin-next/node_modules/eslint-visitor-keys`            | `3.4.3`        | Build/test | no       | no                      |
| `node_modules/@next/swc-darwin-arm64`                                               | `16.3.6`       | App build  | yes      | no                      |
| `node_modules/@next/swc-darwin-x64`                                                 | `16.3.6`       | App build  | yes      | no                      |
| `node_modules/@next/swc-linux-arm64-gnu`                                            | `16.3.6`       | App build  | yes      | no                      |
| `node_modules/@next/swc-linux-arm64-musl`                                           | `16.3.6`       | App build  | yes      | no                      |
| `node_modules/@next/swc-linux-x64-gnu`                                              | `16.3.6`       | App build  | yes      | no                      |
| `node_modules/@next/swc-linux-x64-musl`                                             | `16.3.6`       | App build  | yes      | no                      |
| `node_modules/@next/swc-win32-arm64-msvc`                                           | `16.3.6`       | App build  | yes      | no                      |
| `node_modules/@next/swc-win32-x64-msvc`                                             | `16.3.6`       | App build  | yes      | no                      |
| `node_modules/@nodelib/fs.scandir`                                                  | `2.1.5`        | Build/test | no       | no                      |
| `node_modules/@nodelib/fs.stat`                                                     | `2.0.5`        | Build/test | no       | no                      |
| `node_modules/@nodelib/fs.walk`                                                     | `1.2.8`        | Build/test | no       | no                      |
| `node_modules/@nolyfill/is-core-module`                                             | `1.0.39`       | Build/test | no       | no                      |
| `node_modules/@oxc-project/types`                                                   | `0.151.0`      | Build/test | no       | no                      |
| `node_modules/@rolldown/binding-android-arm-eabi`                                   | `1.2.11`       | Build/test | yes      | no                      |
| `node_modules/@rolldown/binding-android-arm64`                                      | `1.2.11`       | Build/test | yes      | no                      |
| `node_modules/@rolldown/binding-darwin-arm64`                                       | `1.2.11`       | Build/test | yes      | no                      |
| `node_modules/@rolldown/binding-darwin-x64`                                         | `1.2.11`       | Build/test | yes      | no                      |
| `node_modules/@rolldown/binding-freebsd-x64`                                        | `1.2.11`       | Build/test | yes      | no                      |
| `node_modules/@rolldown/binding-linux-arm-gnueabihf`                                | `1.2.11`       | Build/test | yes      | no                      |
| `node_modules/@rolldown/binding-linux-arm64-gnu`                                    | `1.2.11`       | Build/test | yes      | no                      |
| `node_modules/@rolldown/binding-linux-arm64-musl`                                   | `1.2.11`       | Build/test | yes      | no                      |
| `node_modules/@rolldown/binding-linux-ppc64-gnu`                                    | `1.2.11`       | Build/test | yes      | no                      |
| `node_modules/@rolldown/binding-linux-s390x-gnu`                                    | `1.2.11`       | Build/test | yes      | no                      |
| `node_modules/@rolldown/binding-linux-x64-gnu`                                      | `1.2.11`       | Build/test | yes      | no                      |
| `node_modules/@rolldown/binding-linux-x64-musl`                                     | `1.2.11`       | Build/test | yes      | no                      |
| `node_modules/@rolldown/binding-openharmony-arm64`                                  | `1.2.11`       | Build/test | yes      | no                      |
| `node_modules/@rolldown/binding-win32-arm64-msvc`                                   | `1.2.11`       | Build/test | yes      | no                      |
| `node_modules/@rolldown/binding-win32-x64-msvc`                                     | `1.2.11`       | Build/test | yes      | no                      |
| `node_modules/@rolldown/pluginutils`                                                | `1.0.1`        | Build/test | no       | no                      |
| `node_modules/@rtsao/scc`                                                           | `1.1.0`        | Build/test | no       | no                      |
| `node_modules/@swc/helpers`                                                         | `0.5.23`       | App build  | no       | no                      |
| `node_modules/@tailwindcss/node`                                                    | `4.3.3`        | Build/test | no       | no                      |
| `node_modules/@tailwindcss/oxide`                                                   | `4.3.3`        | Build/test | no       | no                      |
| `node_modules/@tailwindcss/oxide-android-arm64`                                     | `4.3.3`        | Build/test | yes      | no                      |
| `node_modules/@tailwindcss/oxide-darwin-arm64`                                      | `4.3.3`        | Build/test | yes      | no                      |
| `node_modules/@tailwindcss/oxide-darwin-x64`                                        | `4.3.3`        | Build/test | yes      | no                      |
| `node_modules/@tailwindcss/oxide-freebsd-x64`                                       | `4.3.3`        | Build/test | yes      | no                      |
| `node_modules/@tailwindcss/oxide-linux-arm-gnueabihf`                               | `4.3.3`        | Build/test | yes      | no                      |
| `node_modules/@tailwindcss/oxide-linux-arm64-gnu`                                   | `4.3.3`        | Build/test | yes      | no                      |
| `node_modules/@tailwindcss/oxide-linux-arm64-musl`                                  | `4.3.3`        | Build/test | yes      | no                      |
| `node_modules/@tailwindcss/oxide-linux-x64-gnu`                                     | `4.3.3`        | Build/test | yes      | no                      |
| `node_modules/@tailwindcss/oxide-linux-x64-musl`                                    | `4.3.3`        | Build/test | yes      | no                      |
| `node_modules/@tailwindcss/oxide-wasm32-wasi`                                       | `4.3.3`        | Build/test | yes      | no                      |
| `node_modules/@tailwindcss/oxide-wasm32-wasi/node_modules/@emnapi/core`             | `1.11.1`       | Build/test | yes      | no                      |
| `node_modules/@tailwindcss/oxide-wasm32-wasi/node_modules/@emnapi/runtime`          | `1.11.1`       | Build/test | yes      | no                      |
| `node_modules/@tailwindcss/oxide-wasm32-wasi/node_modules/@emnapi/wasi-threads`     | `1.2.2`        | Build/test | yes      | no                      |
| `node_modules/@tailwindcss/oxide-wasm32-wasi/node_modules/@napi-rs/wasm-runtime`    | `1.1.4`        | Build/test | yes      | no                      |
| `node_modules/@tailwindcss/oxide-wasm32-wasi/node_modules/@tybys/wasm-util`         | `0.10.2`       | Build/test | yes      | no                      |
| `node_modules/@tailwindcss/oxide-wasm32-wasi/node_modules/tslib`                    | `2.8.1`        | Build/test | yes      | no                      |
| `node_modules/@tailwindcss/oxide-win32-arm64-msvc`                                  | `4.3.3`        | Build/test | yes      | no                      |
| `node_modules/@tailwindcss/oxide-win32-x64-msvc`                                    | `4.3.3`        | Build/test | yes      | no                      |
| `node_modules/@tailwindcss/postcss`                                                 | `4.3.3`        | Build/test | no       | no                      |
| `node_modules/@testing-library/dom`                                                 | `10.4.2`       | Build/test | no       | no                      |
| `node_modules/@testing-library/dom/node_modules/aria-query`                         | `5.3.0`        | Build/test | no       | no                      |
| `node_modules/@testing-library/dom/node_modules/dom-accessibility-api`              | `0.5.16`       | Build/test | no       | no                      |
| `node_modules/@testing-library/jest-dom`                                            | `7.0.1`        | Build/test | no       | no                      |
| `node_modules/@testing-library/react`                                               | `16.3.3`       | Build/test | no       | no                      |
| `node_modules/@tybys/wasm-util`                                                     | `0.10.4`       | Build/test | yes      | no                      |
| `node_modules/@types/aria-query`                                                    | `5.0.4`        | Build/test | no       | no                      |
| `node_modules/@types/chai`                                                          | `5.2.3`        | Build/test | no       | no                      |
| `node_modules/@types/d3`                                                            | `7.4.3`        | App build  | no       | no                      |
| `node_modules/@types/d3-array`                                                      | `3.2.2`        | App build  | no       | no                      |
| `node_modules/@types/d3-axis`                                                       | `3.0.6`        | App build  | no       | no                      |
| `node_modules/@types/d3-brush`                                                      | `3.0.6`        | App build  | no       | no                      |
| `node_modules/@types/d3-chord`                                                      | `3.0.6`        | App build  | no       | no                      |
| `node_modules/@types/d3-color`                                                      | `3.1.3`        | App build  | no       | no                      |
| `node_modules/@types/d3-contour`                                                    | `3.0.6`        | App build  | no       | no                      |
| `node_modules/@types/d3-delaunay`                                                   | `6.0.4`        | App build  | no       | no                      |
| `node_modules/@types/d3-dispatch`                                                   | `3.0.7`        | App build  | no       | no                      |
| `node_modules/@types/d3-drag`                                                       | `3.0.7`        | App build  | no       | no                      |
| `node_modules/@types/d3-dsv`                                                        | `3.0.7`        | App build  | no       | no                      |
| `node_modules/@types/d3-ease`                                                       | `3.0.2`        | App build  | no       | no                      |
| `node_modules/@types/d3-fetch`                                                      | `3.0.7`        | App build  | no       | no                      |
| `node_modules/@types/d3-force`                                                      | `3.0.10`       | App build  | no       | no                      |
| `node_modules/@types/d3-format`                                                     | `3.0.4`        | App build  | no       | no                      |
| `node_modules/@types/d3-geo`                                                        | `3.1.1`        | App build  | no       | no                      |
| `node_modules/@types/d3-hierarchy`                                                  | `3.1.7`        | App build  | no       | no                      |
| `node_modules/@types/d3-interpolate`                                                | `3.0.4`        | App build  | no       | no                      |
| `node_modules/@types/d3-path`                                                       | `3.1.1`        | App build  | no       | no                      |
| `node_modules/@types/d3-polygon`                                                    | `3.0.2`        | App build  | no       | no                      |
| `node_modules/@types/d3-quadtree`                                                   | `3.0.6`        | App build  | no       | no                      |
| `node_modules/@types/d3-random`                                                     | `3.0.4`        | App build  | no       | no                      |
| `node_modules/@types/d3-scale`                                                      | `4.0.9`        | App build  | no       | no                      |
| `node_modules/@types/d3-scale-chromatic`                                            | `3.1.0`        | App build  | no       | no                      |
| `node_modules/@types/d3-selection`                                                  | `3.0.12`       | App build  | no       | no                      |
| `node_modules/@types/d3-shape`                                                      | `3.2.0`        | App build  | no       | no                      |
| `node_modules/@types/d3-time`                                                       | `3.0.4`        | App build  | no       | no                      |
| `node_modules/@types/d3-time-format`                                                | `4.0.3`        | App build  | no       | no                      |
| `node_modules/@types/d3-timer`                                                      | `3.0.2`        | App build  | no       | no                      |
| `node_modules/@types/d3-transition`                                                 | `3.0.9`        | App build  | no       | no                      |
| `node_modules/@types/d3-zoom`                                                       | `3.0.8`        | App build  | no       | no                      |
| `node_modules/@types/deep-eql`                                                      | `4.0.2`        | Build/test | no       | no                      |
| `node_modules/@types/esrecurse`                                                     | `4.3.1`        | Build/test | no       | no                      |
| `node_modules/@types/estree`                                                        | `1.0.9`        | Build/test | no       | no                      |
| `node_modules/@types/geojson`                                                       | `7946.0.16`    | App build  | no       | no                      |
| `node_modules/@types/json-schema`                                                   | `7.0.15`       | Build/test | no       | no                      |
| `node_modules/@types/json5`                                                         | `0.0.29`       | Build/test | no       | no                      |
| `node_modules/@types/node`                                                          | `26.6.3`       | Build/test | no       | no                      |
| `node_modules/@types/react`                                                         | `19.3.0`       | Build/test | no       | no                      |
| `node_modules/@types/react-dom`                                                     | `19.3.0`       | Build/test | no       | no                      |
| `node_modules/@types/trusted-types`                                                 | `2.0.7`        | App build  | yes      | no                      |
| `node_modules/@typescript-eslint/eslint-plugin`                                     | `8.70.1`       | Build/test | no       | no                      |
| `node_modules/@typescript-eslint/eslint-plugin/node_modules/ignore`                 | `7.0.10`       | Build/test | no       | no                      |
| `node_modules/@typescript-eslint/parser`                                            | `8.70.1`       | Build/test | no       | no                      |
| `node_modules/@typescript-eslint/project-service`                                   | `8.70.1`       | Build/test | no       | no                      |
| `node_modules/@typescript-eslint/scope-manager`                                     | `8.70.1`       | Build/test | no       | no                      |
| `node_modules/@typescript-eslint/tsconfig-utils`                                    | `8.70.1`       | Build/test | no       | no                      |
| `node_modules/@typescript-eslint/type-utils`                                        | `8.70.1`       | Build/test | no       | no                      |
| `node_modules/@typescript-eslint/types`                                             | `8.70.1`       | Build/test | no       | no                      |
| `node_modules/@typescript-eslint/typescript-estree`                                 | `8.70.1`       | Build/test | no       | no                      |
| `node_modules/@typescript-eslint/typescript-estree/node_modules/semver`             | `7.8.5`        | Build/test | no       | no                      |
| `node_modules/@typescript-eslint/utils`                                             | `8.70.1`       | Build/test | no       | no                      |
| `node_modules/@typescript-eslint/visitor-keys`                                      | `8.70.1`       | Build/test | no       | no                      |
| `node_modules/@unrs/resolver-binding-android-arm-eabi`                              | `1.12.2`       | Build/test | yes      | no                      |
| `node_modules/@unrs/resolver-binding-android-arm64`                                 | `1.12.2`       | Build/test | yes      | no                      |
| `node_modules/@unrs/resolver-binding-darwin-arm64`                                  | `1.12.2`       | Build/test | yes      | no                      |
| `node_modules/@unrs/resolver-binding-darwin-x64`                                    | `1.12.2`       | Build/test | yes      | no                      |
| `node_modules/@unrs/resolver-binding-freebsd-x64`                                   | `1.12.2`       | Build/test | yes      | no                      |
| `node_modules/@unrs/resolver-binding-linux-arm-gnueabihf`                           | `1.12.2`       | Build/test | yes      | no                      |
| `node_modules/@unrs/resolver-binding-linux-arm-musleabihf`                          | `1.12.2`       | Build/test | yes      | no                      |
| `node_modules/@unrs/resolver-binding-linux-arm64-gnu`                               | `1.12.2`       | Build/test | yes      | no                      |
| `node_modules/@unrs/resolver-binding-linux-arm64-musl`                              | `1.12.2`       | Build/test | yes      | no                      |
| `node_modules/@unrs/resolver-binding-linux-loong64-gnu`                             | `1.12.2`       | Build/test | yes      | no                      |
| `node_modules/@unrs/resolver-binding-linux-loong64-musl`                            | `1.12.2`       | Build/test | yes      | no                      |
| `node_modules/@unrs/resolver-binding-linux-ppc64-gnu`                               | `1.12.2`       | Build/test | yes      | no                      |
| `node_modules/@unrs/resolver-binding-linux-riscv64-gnu`                             | `1.12.2`       | Build/test | yes      | no                      |
| `node_modules/@unrs/resolver-binding-linux-riscv64-musl`                            | `1.12.2`       | Build/test | yes      | no                      |
| `node_modules/@unrs/resolver-binding-linux-s390x-gnu`                               | `1.12.2`       | Build/test | yes      | no                      |
| `node_modules/@unrs/resolver-binding-linux-x64-gnu`                                 | `1.12.2`       | Build/test | yes      | no                      |
| `node_modules/@unrs/resolver-binding-linux-x64-musl`                                | `1.12.2`       | Build/test | yes      | no                      |
| `node_modules/@unrs/resolver-binding-openharmony-arm64`                             | `1.12.2`       | Build/test | yes      | no                      |
| `node_modules/@unrs/resolver-binding-wasm32-wasi`                                   | `1.12.2`       | Build/test | yes      | no                      |
| `node_modules/@unrs/resolver-binding-wasm32-wasi/node_modules/@emnapi/runtime`      | `1.10.0`       | Build/test | yes      | no                      |
| `node_modules/@unrs/resolver-binding-win32-arm64-msvc`                              | `1.12.2`       | Build/test | yes      | no                      |
| `node_modules/@unrs/resolver-binding-win32-ia32-msvc`                               | `1.12.2`       | Build/test | yes      | no                      |
| `node_modules/@unrs/resolver-binding-win32-x64-msvc`                                | `1.12.2`       | Build/test | yes      | no                      |
| `node_modules/@upsetjs/venn.js`                                                     | `2.0.0`        | App build  | no       | no                      |
| `node_modules/@vitest/mocker`                                                       | `5.0.1`        | Build/test | no       | no                      |
| `node_modules/@vitest/mocker/node_modules/magic-string`                             | `1.4.2`        | Build/test | no       | no                      |
| `node_modules/@vitest/spy`                                                          | `5.0.1`        | Build/test | no       | no                      |
| `node_modules/acorn`                                                                | `8.18.0`       | Build/test | no       | no                      |
| `node_modules/acorn-jsx`                                                            | `5.3.2`        | Build/test | no       | no                      |
| `node_modules/ajv`                                                                  | `6.15.0`       | Build/test | no       | no                      |
| `node_modules/ansi-regex`                                                           | `5.0.1`        | Build/test | no       | no                      |
| `node_modules/ansi-styles`                                                          | `5.2.0`        | Build/test | no       | no                      |
| `node_modules/aria-query`                                                           | `5.3.2`        | Build/test | no       | no                      |
| `node_modules/array-buffer-byte-length`                                             | `1.0.2`        | Build/test | no       | no                      |
| `node_modules/array-includes`                                                       | `3.2.0`        | Build/test | no       | no                      |
| `node_modules/array.prototype.findlast`                                             | `1.2.5`        | Build/test | no       | no                      |
| `node_modules/array.prototype.findlastindex`                                        | `1.2.6`        | Build/test | no       | no                      |
| `node_modules/array.prototype.flat`                                                 | `1.3.3`        | Build/test | no       | no                      |
| `node_modules/array.prototype.flatmap`                                              | `1.3.3`        | Build/test | no       | no                      |
| `node_modules/array.prototype.tosorted`                                             | `1.1.4`        | Build/test | no       | no                      |
| `node_modules/arraybuffer.prototype.slice`                                          | `1.0.4`        | Build/test | no       | no                      |
| `node_modules/assertion-error`                                                      | `2.0.1`        | Build/test | no       | no                      |
| `node_modules/ast-types-flow`                                                       | `0.0.8`        | Build/test | no       | no                      |
| `node_modules/async-function`                                                       | `1.0.0`        | Build/test | no       | no                      |
| `node_modules/available-typed-arrays`                                               | `1.0.7`        | Build/test | no       | no                      |
| `node_modules/axe-core`                                                             | `4.13.0`       | Build/test | no       | no                      |
| `node_modules/axobject-query`                                                       | `4.1.0`        | Build/test | no       | no                      |
| `node_modules/balanced-match`                                                       | `4.0.4`        | Build/test | no       | no                      |
| `node_modules/baseline-browser-mapping`                                             | `2.11.26`      | App build  | no       | no                      |
| `node_modules/bidi-js`                                                              | `1.1.0`        | Build/test | no       | no                      |
| `node_modules/brace-expansion`                                                      | `5.0.12`       | Build/test | no       | no                      |
| `node_modules/braces`                                                               | `3.0.3`        | Build/test | no       | no                      |
| `node_modules/browserslist`                                                         | `4.29.1`       | Build/test | no       | no                      |
| `node_modules/cacheable`                                                            | `2.5.0`        | Build/test | no       | no                      |
| `node_modules/call-bind`                                                            | `1.0.9`        | Build/test | no       | no                      |
| `node_modules/call-bind-apply-helpers`                                              | `1.0.2`        | Build/test | no       | no                      |
| `node_modules/call-bound`                                                           | `1.0.4`        | Build/test | no       | no                      |
| `node_modules/caniuse-lite`                                                         | `1.0.30001812` | App build  | no       | no                      |
| `node_modules/chai`                                                                 | `6.2.2`        | Build/test | no       | no                      |
| `node_modules/client-only`                                                          | `0.0.1`        | App build  | no       | no                      |
| `node_modules/commander`                                                            | `7.2.0`        | App build  | no       | no                      |
| `node_modules/concat-map`                                                           | `0.0.1`        | Build/test | no       | no                      |
| `node_modules/convert-source-map`                                                   | `2.0.0`        | Build/test | no       | no                      |
| `node_modules/cose-base`                                                            | `1.0.3`        | App build  | no       | no                      |
| `node_modules/cross-spawn`                                                          | `7.0.6`        | Build/test | no       | no                      |
| `node_modules/css-tree`                                                             | `3.2.1`        | Build/test | no       | no                      |
| `node_modules/css.escape`                                                           | `1.5.1`        | Build/test | no       | no                      |
| `node_modules/csstype`                                                              | `3.2.3`        | Build/test | no       | no                      |
| `node_modules/cytoscape`                                                            | `3.34.3`       | App build  | no       | no                      |
| `node_modules/cytoscape-cose-bilkent`                                               | `4.1.0`        | App build  | no       | no                      |
| `node_modules/cytoscape-fcose`                                                      | `2.2.0`        | App build  | no       | no                      |
| `node_modules/cytoscape-fcose/node_modules/cose-base`                               | `2.2.0`        | App build  | no       | no                      |
| `node_modules/cytoscape-fcose/node_modules/layout-base`                             | `2.0.1`        | App build  | no       | no                      |
| `node_modules/d3`                                                                   | `7.9.0`        | App build  | no       | no                      |
| `node_modules/d3-array`                                                             | `3.2.4`        | App build  | no       | no                      |
| `node_modules/d3-axis`                                                              | `3.0.0`        | App build  | no       | no                      |
| `node_modules/d3-brush`                                                             | `3.0.0`        | App build  | no       | no                      |
| `node_modules/d3-chord`                                                             | `3.0.1`        | App build  | no       | no                      |
| `node_modules/d3-color`                                                             | `3.1.0`        | App build  | no       | no                      |
| `node_modules/d3-contour`                                                           | `4.0.2`        | App build  | no       | no                      |
| `node_modules/d3-delaunay`                                                          | `6.0.4`        | App build  | no       | no                      |
| `node_modules/d3-dispatch`                                                          | `3.0.1`        | App build  | no       | no                      |
| `node_modules/d3-drag`                                                              | `3.0.0`        | App build  | no       | no                      |
| `node_modules/d3-dsv`                                                               | `3.0.1`        | App build  | no       | no                      |
| `node_modules/d3-ease`                                                              | `3.0.1`        | App build  | no       | no                      |
| `node_modules/d3-fetch`                                                             | `3.0.1`        | App build  | no       | no                      |
| `node_modules/d3-force`                                                             | `3.0.0`        | App build  | no       | no                      |
| `node_modules/d3-format`                                                            | `3.1.2`        | App build  | no       | no                      |
| `node_modules/d3-geo`                                                               | `3.1.1`        | App build  | no       | no                      |
| `node_modules/d3-hierarchy`                                                         | `3.1.2`        | App build  | no       | no                      |
| `node_modules/d3-interpolate`                                                       | `3.0.1`        | App build  | no       | no                      |
| `node_modules/d3-path`                                                              | `3.1.0`        | App build  | no       | no                      |
| `node_modules/d3-polygon`                                                           | `3.0.1`        | App build  | no       | no                      |
| `node_modules/d3-quadtree`                                                          | `3.0.1`        | App build  | no       | no                      |
| `node_modules/d3-random`                                                            | `3.0.1`        | App build  | no       | no                      |
| `node_modules/d3-sankey`                                                            | `0.12.3`       | App build  | no       | no                      |
| `node_modules/d3-sankey/node_modules/d3-array`                                      | `2.12.1`       | App build  | no       | no                      |
| `node_modules/d3-sankey/node_modules/d3-path`                                       | `1.0.9`        | App build  | no       | no                      |
| `node_modules/d3-sankey/node_modules/d3-shape`                                      | `1.3.7`        | App build  | no       | no                      |
| `node_modules/d3-sankey/node_modules/internmap`                                     | `1.0.1`        | App build  | no       | no                      |
| `node_modules/d3-scale`                                                             | `4.0.2`        | App build  | no       | no                      |
| `node_modules/d3-scale-chromatic`                                                   | `3.1.0`        | App build  | no       | no                      |
| `node_modules/d3-selection`                                                         | `3.0.0`        | App build  | no       | no                      |
| `node_modules/d3-shape`                                                             | `3.2.0`        | App build  | no       | no                      |
| `node_modules/d3-time`                                                              | `3.1.0`        | App build  | no       | no                      |
| `node_modules/d3-time-format`                                                       | `4.1.0`        | App build  | no       | no                      |
| `node_modules/d3-timer`                                                             | `3.0.1`        | App build  | no       | no                      |
| `node_modules/d3-transition`                                                        | `3.0.1`        | App build  | no       | no                      |
| `node_modules/d3-zoom`                                                              | `3.0.0`        | App build  | no       | no                      |
| `node_modules/dagre-d3-es`                                                          | `7.0.14`       | App build  | no       | no                      |
| `node_modules/damerau-levenshtein`                                                  | `1.0.8`        | Build/test | no       | no                      |
| `node_modules/data-urls`                                                            | `7.0.0`        | Build/test | no       | no                      |
| `node_modules/data-urls/node_modules/whatwg-url`                                    | `16.0.1`       | Build/test | no       | no                      |
| `node_modules/data-view-buffer`                                                     | `1.0.2`        | Build/test | no       | no                      |
| `node_modules/data-view-byte-length`                                                | `1.0.2`        | Build/test | no       | no                      |
| `node_modules/data-view-byte-offset`                                                | `1.0.1`        | Build/test | no       | no                      |
| `node_modules/dayjs`                                                                | `1.11.23`      | App build  | no       | no                      |
| `node_modules/debug`                                                                | `4.4.3`        | Build/test | no       | no                      |
| `node_modules/decimal.js`                                                           | `10.6.0`       | Build/test | no       | no                      |
| `node_modules/deep-is`                                                              | `0.1.4`        | Build/test | no       | no                      |
| `node_modules/define-data-property`                                                 | `1.1.4`        | Build/test | no       | no                      |
| `node_modules/define-properties`                                                    | `1.2.1`        | Build/test | no       | no                      |
| `node_modules/delaunator`                                                           | `5.1.0`        | App build  | no       | no                      |
| `node_modules/dequal`                                                               | `2.0.3`        | Build/test | no       | no                      |
| `node_modules/detect-libc`                                                          | `2.1.2`        | App build  | no       | no                      |
| `node_modules/doctrine`                                                             | `2.1.0`        | Build/test | no       | no                      |
| `node_modules/dom-accessibility-api`                                                | `0.6.3`        | Build/test | no       | no                      |
| `node_modules/dompurify`                                                            | `3.4.16`       | App build  | no       | no                      |
| `node_modules/dunder-proto`                                                         | `1.0.1`        | Build/test | no       | no                      |
| `node_modules/electron-to-chromium`                                                 | `1.5.439`      | Build/test | no       | no                      |
| `node_modules/emoji-regex`                                                          | `9.2.2`        | Build/test | no       | no                      |
| `node_modules/enhanced-resolve`                                                     | `5.25.1`       | Build/test | no       | no                      |
| `node_modules/entities`                                                             | `8.1.0`        | Build/test | no       | no                      |
| `node_modules/es-abstract`                                                          | `1.24.2`       | Build/test | no       | no                      |
| `node_modules/es-abstract-get`                                                      | `1.0.0`        | Build/test | no       | no                      |
| `node_modules/es-define-property`                                                   | `1.0.1`        | Build/test | no       | no                      |
| `node_modules/es-errors`                                                            | `1.3.0`        | Build/test | no       | no                      |
| `node_modules/es-iterator-helpers`                                                  | `1.4.0`        | Build/test | no       | no                      |
| `node_modules/es-module-lexer`                                                      | `2.3.2`        | Build/test | no       | no                      |
| `node_modules/es-object-atoms`                                                      | `1.1.2`        | Build/test | no       | no                      |
| `node_modules/es-set-tostringtag`                                                   | `2.1.0`        | Build/test | no       | no                      |
| `node_modules/es-shim-unscopables`                                                  | `1.1.0`        | Build/test | no       | no                      |
| `node_modules/es-to-primitive`                                                      | `1.3.4`        | Build/test | no       | no                      |
| `node_modules/es-toolkit`                                                           | `1.52.0`       | App build  | no       | no                      |
| `node_modules/escalade`                                                             | `3.2.0`        | Build/test | no       | no                      |
| `node_modules/escape-string-regexp`                                                 | `4.0.0`        | Build/test | no       | no                      |
| `node_modules/eslint`                                                               | `10.11.0`      | Build/test | no       | no                      |
| `node_modules/eslint-config-next`                                                   | `16.3.6`       | Build/test | no       | no                      |
| `node_modules/eslint-import-resolver-node`                                          | `0.3.10`       | Build/test | no       | no                      |
| `node_modules/eslint-import-resolver-node/node_modules/debug`                       | `3.2.7`        | Build/test | no       | no                      |
| `node_modules/eslint-import-resolver-typescript`                                    | `3.10.1`       | Build/test | no       | no                      |
| `node_modules/eslint-module-utils`                                                  | `2.14.0`       | Build/test | no       | no                      |
| `node_modules/eslint-module-utils/node_modules/debug`                               | `3.2.7`        | Build/test | no       | no                      |
| `node_modules/eslint-plugin-import`                                                 | `2.32.0`       | Build/test | no       | no                      |
| `node_modules/eslint-plugin-import/node_modules/balanced-match`                     | `1.0.2`        | Build/test | no       | no                      |
| `node_modules/eslint-plugin-import/node_modules/brace-expansion`                    | `1.1.21`       | Build/test | no       | no                      |
| `node_modules/eslint-plugin-import/node_modules/debug`                              | `3.2.7`        | Build/test | no       | no                      |
| `node_modules/eslint-plugin-import/node_modules/minimatch`                          | `3.1.5`        | Build/test | no       | no                      |
| `node_modules/eslint-plugin-jsx-a11y`                                               | `6.10.2`       | Build/test | no       | no                      |
| `node_modules/eslint-plugin-jsx-a11y/node_modules/balanced-match`                   | `1.0.2`        | Build/test | no       | no                      |
| `node_modules/eslint-plugin-jsx-a11y/node_modules/brace-expansion`                  | `1.1.21`       | Build/test | no       | no                      |
| `node_modules/eslint-plugin-jsx-a11y/node_modules/minimatch`                        | `3.1.5`        | Build/test | no       | no                      |
| `node_modules/eslint-plugin-react`                                                  | `7.37.5`       | Build/test | no       | no                      |
| `node_modules/eslint-plugin-react-hooks`                                            | `7.1.1`        | Build/test | no       | no                      |
| `node_modules/eslint-plugin-react/node_modules/balanced-match`                      | `1.0.2`        | Build/test | no       | no                      |
| `node_modules/eslint-plugin-react/node_modules/brace-expansion`                     | `1.1.21`       | Build/test | no       | no                      |
| `node_modules/eslint-plugin-react/node_modules/minimatch`                           | `3.1.5`        | Build/test | no       | no                      |
| `node_modules/eslint-scope`                                                         | `9.1.2`        | Build/test | no       | no                      |
| `node_modules/eslint-visitor-keys`                                                  | `5.0.1`        | Build/test | no       | no                      |
| `node_modules/espree`                                                               | `11.2.0`       | Build/test | no       | no                      |
| `node_modules/esquery`                                                              | `1.7.0`        | Build/test | no       | no                      |
| `node_modules/esrecurse`                                                            | `4.3.0`        | Build/test | no       | no                      |
| `node_modules/estraverse`                                                           | `5.3.0`        | Build/test | no       | no                      |
| `node_modules/estree-walker`                                                        | `3.0.3`        | Build/test | no       | no                      |
| `node_modules/esutils`                                                              | `2.0.3`        | Build/test | no       | no                      |
| `node_modules/expect-type`                                                          | `1.4.0`        | Build/test | no       | no                      |
| `node_modules/fast-deep-equal`                                                      | `3.1.3`        | Build/test | no       | no                      |
| `node_modules/fast-glob`                                                            | `3.3.1`        | Build/test | no       | no                      |
| `node_modules/fast-glob/node_modules/glob-parent`                                   | `5.1.2`        | Build/test | no       | no                      |
| `node_modules/fast-json-stable-stringify`                                           | `2.1.0`        | Build/test | no       | no                      |
| `node_modules/fast-levenshtein`                                                     | `2.0.6`        | Build/test | no       | no                      |
| `node_modules/fastdom`                                                              | `1.0.12`       | App build  | no       | no                      |
| `node_modules/fastq`                                                                | `1.20.3`       | Build/test | no       | no                      |
| `node_modules/fdir`                                                                 | `6.5.0`        | Build/test | no       | no                      |
| `node_modules/file-entry-cache`                                                     | `11.1.5`       | Build/test | no       | no                      |
| `node_modules/fill-range`                                                           | `7.1.1`        | Build/test | no       | no                      |
| `node_modules/find-up`                                                              | `5.0.0`        | Build/test | no       | no                      |
| `node_modules/flat-cache`                                                           | `6.1.23`       | Build/test | no       | no                      |
| `node_modules/flatted`                                                              | `3.4.4`        | Build/test | no       | no                      |
| `node_modules/for-each`                                                             | `0.3.5`        | Build/test | no       | no                      |
| `node_modules/fsevents`                                                             | `2.3.3`        | Build/test | yes      | yes                     |
| `node_modules/function-bind`                                                        | `1.1.2`        | Build/test | no       | no                      |
| `node_modules/function.prototype.name`                                              | `1.2.0`        | Build/test | no       | no                      |
| `node_modules/functions-have-names`                                                 | `1.2.3`        | Build/test | no       | no                      |
| `node_modules/generator-function`                                                   | `2.0.1`        | Build/test | no       | no                      |
| `node_modules/gensync`                                                              | `1.0.0-beta.2` | Build/test | no       | no                      |
| `node_modules/get-intrinsic`                                                        | `1.3.0`        | Build/test | no       | no                      |
| `node_modules/get-proto`                                                            | `1.0.1`        | Build/test | no       | no                      |
| `node_modules/get-symbol-description`                                               | `1.1.0`        | Build/test | no       | no                      |
| `node_modules/get-tsconfig`                                                         | `4.14.3`       | Build/test | no       | no                      |
| `node_modules/glob-parent`                                                          | `6.0.2`        | Build/test | no       | no                      |
| `node_modules/globals`                                                              | `16.4.0`       | Build/test | no       | no                      |
| `node_modules/globalthis`                                                           | `1.0.4`        | Build/test | no       | no                      |
| `node_modules/gopd`                                                                 | `1.2.0`        | Build/test | no       | no                      |
| `node_modules/graceful-fs`                                                          | `4.2.11`       | Build/test | no       | no                      |
| `node_modules/hachure-fill`                                                         | `0.5.2`        | App build  | no       | no                      |
| `node_modules/has-bigints`                                                          | `1.1.0`        | Build/test | no       | no                      |
| `node_modules/has-property-descriptors`                                             | `1.0.2`        | Build/test | no       | no                      |
| `node_modules/has-proto`                                                            | `1.2.0`        | Build/test | no       | no                      |
| `node_modules/has-symbols`                                                          | `1.1.0`        | Build/test | no       | no                      |
| `node_modules/has-tostringtag`                                                      | `1.0.2`        | Build/test | no       | no                      |
| `node_modules/hashery`                                                              | `1.5.1`        | Build/test | no       | no                      |
| `node_modules/hasown`                                                               | `2.0.4`        | Build/test | no       | no                      |
| `node_modules/hermes-estree`                                                        | `0.25.1`       | Build/test | no       | no                      |
| `node_modules/hermes-parser`                                                        | `0.25.1`       | Build/test | no       | no                      |
| `node_modules/hookified`                                                            | `1.15.1`       | Build/test | no       | no                      |
| `node_modules/html-encoding-sniffer`                                                | `7.0.0`        | Build/test | no       | no                      |
| `node_modules/iconv-lite`                                                           | `0.6.3`        | App build  | no       | no                      |
| `node_modules/ignore`                                                               | `5.3.2`        | Build/test | no       | no                      |
| `node_modules/import-meta-resolve`                                                  | `4.2.0`        | App build  | no       | no                      |
| `node_modules/imurmurhash`                                                          | `0.1.4`        | Build/test | no       | no                      |
| `node_modules/indent-string`                                                        | `4.0.0`        | Build/test | no       | no                      |
| `node_modules/internal-slot`                                                        | `1.1.0`        | Build/test | no       | no                      |
| `node_modules/internmap`                                                            | `2.0.3`        | App build  | no       | no                      |
| `node_modules/is-array-buffer`                                                      | `3.0.5`        | Build/test | no       | no                      |
| `node_modules/is-async-function`                                                    | `2.1.1`        | Build/test | no       | no                      |
| `node_modules/is-bigint`                                                            | `1.1.0`        | Build/test | no       | no                      |
| `node_modules/is-boolean-object`                                                    | `1.2.2`        | Build/test | no       | no                      |
| `node_modules/is-bun-module`                                                        | `2.0.0`        | Build/test | no       | no                      |
| `node_modules/is-bun-module/node_modules/semver`                                    | `7.8.5`        | Build/test | no       | no                      |
| `node_modules/is-callable`                                                          | `1.2.7`        | Build/test | no       | no                      |
| `node_modules/is-core-module`                                                       | `2.17.0`       | Build/test | no       | no                      |
| `node_modules/is-data-view`                                                         | `1.0.2`        | Build/test | no       | no                      |
| `node_modules/is-date-object`                                                       | `1.1.0`        | Build/test | no       | no                      |
| `node_modules/is-document.all`                                                      | `1.0.0`        | Build/test | no       | no                      |
| `node_modules/is-extglob`                                                           | `2.1.1`        | Build/test | no       | no                      |
| `node_modules/is-finalizationregistry`                                              | `1.1.1`        | Build/test | no       | no                      |
| `node_modules/is-generator-function`                                                | `1.1.2`        | Build/test | no       | no                      |
| `node_modules/is-glob`                                                              | `4.0.3`        | Build/test | no       | no                      |
| `node_modules/is-map`                                                               | `2.0.3`        | Build/test | no       | no                      |
| `node_modules/is-negative-zero`                                                     | `2.0.3`        | Build/test | no       | no                      |
| `node_modules/is-number`                                                            | `7.0.0`        | Build/test | no       | no                      |
| `node_modules/is-number-object`                                                     | `1.1.1`        | Build/test | no       | no                      |
| `node_modules/is-potential-custom-element-name`                                     | `1.0.1`        | Build/test | no       | no                      |
| `node_modules/is-regex`                                                             | `1.2.1`        | Build/test | no       | no                      |
| `node_modules/is-set`                                                               | `2.0.3`        | Build/test | no       | no                      |
| `node_modules/is-shared-array-buffer`                                               | `1.0.4`        | Build/test | no       | no                      |
| `node_modules/is-string`                                                            | `1.1.1`        | Build/test | no       | no                      |
| `node_modules/is-symbol`                                                            | `1.1.1`        | Build/test | no       | no                      |
| `node_modules/is-typed-array`                                                       | `1.1.15`       | Build/test | no       | no                      |
| `node_modules/is-weakmap`                                                           | `2.0.2`        | Build/test | no       | no                      |
| `node_modules/is-weakref`                                                           | `1.1.1`        | Build/test | no       | no                      |
| `node_modules/is-weakset`                                                           | `2.0.4`        | Build/test | no       | no                      |
| `node_modules/isarray`                                                              | `2.0.5`        | Build/test | no       | no                      |
| `node_modules/isexe`                                                                | `2.0.0`        | Build/test | no       | no                      |
| `node_modules/iterator.prototype`                                                   | `1.1.5`        | Build/test | no       | no                      |
| `node_modules/jiti`                                                                 | `2.7.0`        | Build/test | no       | no                      |
| `node_modules/js-tokens`                                                            | `4.0.0`        | Build/test | no       | no                      |
| `node_modules/jsdom`                                                                | `30.1.1`       | Build/test | no       | no                      |
| `node_modules/jsdom/node_modules/lru-cache`                                         | `11.5.3`       | Build/test | no       | no                      |
| `node_modules/jsesc`                                                                | `3.1.0`        | Build/test | no       | no                      |
| `node_modules/json-schema-traverse`                                                 | `0.4.1`        | Build/test | no       | no                      |
| `node_modules/json-stable-stringify-without-jsonify`                                | `1.0.1`        | Build/test | no       | no                      |
| `node_modules/json5`                                                                | `2.2.3`        | Build/test | no       | no                      |
| `node_modules/jsx-ast-utils`                                                        | `3.3.5`        | Build/test | no       | no                      |
| `node_modules/katex`                                                                | `0.16.47`      | App build  | no       | no                      |
| `node_modules/katex/node_modules/commander`                                         | `8.3.0`        | App build  | no       | no                      |
| `node_modules/keyv`                                                                 | `5.6.0`        | Build/test | no       | no                      |
| `node_modules/khroma`                                                               | `2.1.0`        | App build  | no       | no                      |
| `node_modules/language-subtag-registry`                                             | `0.3.23`       | Build/test | no       | no                      |
| `node_modules/language-tags`                                                        | `1.0.9`        | Build/test | no       | no                      |
| `node_modules/layout-base`                                                          | `1.0.2`        | App build  | no       | no                      |
| `node_modules/levn`                                                                 | `0.4.1`        | Build/test | no       | no                      |
| `node_modules/lightningcss`                                                         | `1.32.0`       | Build/test | no       | no                      |
| `node_modules/lightningcss-android-arm64`                                           | `1.32.0`       | Build/test | yes      | no                      |
| `node_modules/lightningcss-darwin-arm64`                                            | `1.32.0`       | Build/test | yes      | no                      |
| `node_modules/lightningcss-darwin-x64`                                              | `1.32.0`       | Build/test | yes      | no                      |
| `node_modules/lightningcss-freebsd-x64`                                             | `1.32.0`       | Build/test | yes      | no                      |
| `node_modules/lightningcss-linux-arm-gnueabihf`                                     | `1.32.0`       | Build/test | yes      | no                      |
| `node_modules/lightningcss-linux-arm64-gnu`                                         | `1.32.0`       | Build/test | yes      | no                      |
| `node_modules/lightningcss-linux-arm64-musl`                                        | `1.32.0`       | Build/test | yes      | no                      |
| `node_modules/lightningcss-linux-x64-gnu`                                           | `1.32.0`       | Build/test | yes      | no                      |
| `node_modules/lightningcss-linux-x64-musl`                                          | `1.32.0`       | Build/test | yes      | no                      |
| `node_modules/lightningcss-win32-arm64-msvc`                                        | `1.32.0`       | Build/test | yes      | no                      |
| `node_modules/lightningcss-win32-x64-msvc`                                          | `1.32.0`       | Build/test | yes      | no                      |
| `node_modules/locate-path`                                                          | `6.0.0`        | Build/test | no       | no                      |
| `node_modules/lodash-es`                                                            | `4.18.1`       | App build  | no       | no                      |
| `node_modules/loose-envify`                                                         | `1.4.0`        | Build/test | no       | no                      |
| `node_modules/lru-cache`                                                            | `5.1.1`        | Build/test | no       | no                      |
| `node_modules/lz-string`                                                            | `1.5.0`        | Build/test | no       | no                      |
| `node_modules/magic-string`                                                         | `0.30.21`      | Build/test | no       | no                      |
| `node_modules/marked`                                                               | `16.4.2`       | App build  | no       | no                      |
| `node_modules/math-intrinsics`                                                      | `1.1.0`        | Build/test | no       | no                      |
| `node_modules/mdn-data`                                                             | `2.27.1`       | Build/test | no       | no                      |
| `node_modules/merge2`                                                               | `1.4.1`        | Build/test | no       | no                      |
| `node_modules/mermaid`                                                              | `11.17.2`      | App build  | no       | no                      |
| `node_modules/micromatch`                                                           | `4.0.8`        | Build/test | no       | no                      |
| `node_modules/min-indent`                                                           | `1.0.1`        | Build/test | no       | no                      |
| `node_modules/minimatch`                                                            | `10.2.6`       | Build/test | no       | no                      |
| `node_modules/minimist`                                                             | `1.2.8`        | Build/test | no       | no                      |
| `node_modules/ms`                                                                   | `2.1.3`        | Build/test | no       | no                      |
| `node_modules/nanoid`                                                               | `3.3.19`       | App build  | no       | no                      |
| `node_modules/napi-postinstall`                                                     | `0.3.4`        | Build/test | no       | no                      |
| `node_modules/natural-compare`                                                      | `1.4.0`        | Build/test | no       | no                      |
| `node_modules/next`                                                                 | `16.3.6`       | App build  | no       | no                      |
| `node_modules/next/node_modules/postcss`                                            | `8.5.23`       | App build  | no       | no                      |
| `node_modules/node-exports-info`                                                    | `1.6.2`        | Build/test | no       | no                      |
| `node_modules/node-releases`                                                        | `2.0.57`       | Build/test | no       | no                      |
| `node_modules/object-assign`                                                        | `4.1.1`        | Build/test | no       | no                      |
| `node_modules/object-inspect`                                                       | `1.13.4`       | Build/test | no       | no                      |
| `node_modules/object-keys`                                                          | `1.1.1`        | Build/test | no       | no                      |
| `node_modules/object.assign`                                                        | `4.1.7`        | Build/test | no       | no                      |
| `node_modules/object.entries`                                                       | `1.1.9`        | Build/test | no       | no                      |
| `node_modules/object.fromentries`                                                   | `2.0.8`        | Build/test | no       | no                      |
| `node_modules/object.groupby`                                                       | `1.0.3`        | Build/test | no       | no                      |
| `node_modules/object.values`                                                        | `1.2.1`        | Build/test | no       | no                      |
| `node_modules/obug`                                                                 | `2.2.1`        | Build/test | no       | no                      |
| `node_modules/optionator`                                                           | `0.9.4`        | Build/test | no       | no                      |
| `node_modules/own-keys`                                                             | `1.0.2`        | Build/test | no       | no                      |
| `node_modules/p-limit`                                                              | `3.1.0`        | Build/test | no       | no                      |
| `node_modules/p-locate`                                                             | `5.0.0`        | Build/test | no       | no                      |
| `node_modules/package-manager-detector`                                             | `1.8.0`        | App build  | no       | no                      |
| `node_modules/parse5`                                                               | `8.0.1`        | Build/test | no       | no                      |
| `node_modules/path-data-parser`                                                     | `0.1.0`        | App build  | no       | no                      |
| `node_modules/path-exists`                                                          | `4.0.0`        | Build/test | no       | no                      |
| `node_modules/path-key`                                                             | `3.1.1`        | Build/test | no       | no                      |
| `node_modules/path-parse`                                                           | `1.0.7`        | Build/test | no       | no                      |
| `node_modules/picocolors`                                                           | `1.1.1`        | App build  | no       | no                      |
| `node_modules/picomatch`                                                            | `2.3.2`        | Build/test | no       | no                      |
| `node_modules/points-on-curve`                                                      | `0.2.0`        | App build  | no       | no                      |
| `node_modules/points-on-path`                                                       | `0.2.1`        | App build  | no       | no                      |
| `node_modules/possible-typed-array-names`                                           | `1.1.0`        | Build/test | no       | no                      |
| `node_modules/postcss`                                                              | `8.5.28`       | Build/test | no       | no                      |
| `node_modules/prelude-ls`                                                           | `1.2.1`        | Build/test | no       | no                      |
| `node_modules/prettier`                                                             | `3.9.9`        | Build/test | no       | no                      |
| `node_modules/pretty-format`                                                        | `27.5.1`       | Build/test | no       | no                      |
| `node_modules/pretty-format/node_modules/react-is`                                  | `17.0.2`       | Build/test | no       | no                      |
| `node_modules/prop-types`                                                           | `15.8.1`       | Build/test | no       | no                      |
| `node_modules/punycode`                                                             | `2.3.1`        | Build/test | no       | no                      |
| `node_modules/qified`                                                               | `0.10.1`       | Build/test | no       | no                      |
| `node_modules/qified/node_modules/hookified`                                        | `2.2.0`        | Build/test | no       | no                      |
| `node_modules/queue-microtask`                                                      | `1.2.3`        | Build/test | no       | no                      |
| `node_modules/react`                                                                | `19.3.0`       | App build  | no       | no                      |
| `node_modules/react-dom`                                                            | `19.3.0`       | App build  | no       | no                      |
| `node_modules/react-is`                                                             | `16.13.1`      | Build/test | no       | no                      |
| `node_modules/redent`                                                               | `3.0.0`        | Build/test | no       | no                      |
| `node_modules/reflect.getprototypeof`                                               | `1.0.10`       | Build/test | no       | no                      |
| `node_modules/regexp.prototype.flags`                                               | `1.5.4`        | Build/test | no       | no                      |
| `node_modules/require-from-string`                                                  | `2.0.2`        | Build/test | no       | no                      |
| `node_modules/resolve`                                                              | `2.0.0-next.7` | Build/test | no       | no                      |
| `node_modules/resolve-pkg-maps`                                                     | `1.0.0`        | Build/test | no       | no                      |
| `node_modules/reusify`                                                              | `1.1.0`        | Build/test | no       | no                      |
| `node_modules/robust-predicates`                                                    | `3.0.3`        | App build  | no       | no                      |
| `node_modules/rolldown`                                                             | `1.2.11`       | Build/test | no       | no                      |
| `node_modules/roughjs`                                                              | `4.6.6`        | App build  | no       | no                      |
| `node_modules/run-parallel`                                                         | `1.2.0`        | Build/test | no       | no                      |
| `node_modules/rw`                                                                   | `1.3.3`        | App build  | no       | no                      |
| `node_modules/safe-array-concat`                                                    | `1.1.4`        | Build/test | no       | no                      |
| `node_modules/safe-push-apply`                                                      | `1.0.0`        | Build/test | no       | no                      |
| `node_modules/safe-regex-test`                                                      | `1.1.0`        | Build/test | no       | no                      |
| `node_modules/safer-buffer`                                                         | `2.1.2`        | App build  | no       | no                      |
| `node_modules/saxes`                                                                | `6.0.0`        | Build/test | no       | no                      |
| `node_modules/scheduler`                                                            | `0.28.0`       | App build  | no       | no                      |
| `node_modules/semver`                                                               | `6.3.1`        | Build/test | no       | no                      |
| `node_modules/set-function-length`                                                  | `1.2.2`        | Build/test | no       | no                      |
| `node_modules/set-function-name`                                                    | `2.0.2`        | Build/test | no       | no                      |
| `node_modules/set-proto`                                                            | `1.0.0`        | Build/test | no       | no                      |
| `node_modules/sharp`                                                                | `0.35.5`       | App build  | yes      | no                      |
| `node_modules/sharp/node_modules/semver`                                            | `7.8.5`        | App build  | yes      | no                      |
| `node_modules/shebang-command`                                                      | `2.0.0`        | Build/test | no       | no                      |
| `node_modules/shebang-regex`                                                        | `3.0.0`        | Build/test | no       | no                      |
| `node_modules/side-channel`                                                         | `1.1.1`        | Build/test | no       | no                      |
| `node_modules/side-channel-list`                                                    | `1.0.1`        | Build/test | no       | no                      |
| `node_modules/side-channel-map`                                                     | `1.0.1`        | Build/test | no       | no                      |
| `node_modules/side-channel-weakmap`                                                 | `1.0.2`        | Build/test | no       | no                      |
| `node_modules/siginfo`                                                              | `2.0.0`        | Build/test | no       | no                      |
| `node_modules/source-map-js`                                                        | `1.2.1`        | App build  | no       | no                      |
| `node_modules/stable-hash`                                                          | `0.0.5`        | Build/test | no       | no                      |
| `node_modules/stackback`                                                            | `0.0.2`        | Build/test | no       | no                      |
| `node_modules/std-env`                                                              | `4.2.0`        | Build/test | no       | no                      |
| `node_modules/stop-iteration-iterator`                                              | `1.1.0`        | Build/test | no       | no                      |
| `node_modules/strictdom`                                                            | `1.0.1`        | App build  | no       | no                      |
| `node_modules/string.prototype.includes`                                            | `2.0.1`        | Build/test | no       | no                      |
| `node_modules/string.prototype.matchall`                                            | `4.1.0`        | Build/test | no       | no                      |
| `node_modules/string.prototype.repeat`                                              | `1.0.0`        | Build/test | no       | no                      |
| `node_modules/string.prototype.trim`                                                | `1.2.11`       | Build/test | no       | no                      |
| `node_modules/string.prototype.trimend`                                             | `1.0.10`       | Build/test | no       | no                      |
| `node_modules/string.prototype.trimstart`                                           | `1.0.8`        | Build/test | no       | no                      |
| `node_modules/strip-bom`                                                            | `3.0.0`        | Build/test | no       | no                      |
| `node_modules/strip-indent`                                                         | `3.0.0`        | Build/test | no       | no                      |
| `node_modules/styled-jsx`                                                           | `5.1.6`        | App build  | no       | no                      |
| `node_modules/stylis`                                                               | `4.4.0`        | App build  | no       | no                      |
| `node_modules/supports-preserve-symlinks-flag`                                      | `1.0.0`        | Build/test | no       | no                      |
| `node_modules/tailwindcss`                                                          | `4.3.3`        | Build/test | no       | no                      |
| `node_modules/tapable`                                                              | `2.3.3`        | Build/test | no       | no                      |
| `node_modules/tinybench`                                                            | `6.1.4`        | Build/test | no       | no                      |
| `node_modules/tinyexec`                                                             | `1.3.1`        | App build  | no       | no                      |
| `node_modules/tinyglobby`                                                           | `0.2.17`       | Build/test | no       | no                      |
| `node_modules/tinyglobby/node_modules/picomatch`                                    | `4.0.7`        | Build/test | no       | no                      |
| `node_modules/tldts`                                                                | `7.4.16`       | Build/test | no       | no                      |
| `node_modules/tldts-core`                                                           | `7.4.16`       | Build/test | no       | no                      |
| `node_modules/to-regex-range`                                                       | `5.0.1`        | Build/test | no       | no                      |
| `node_modules/tough-cookie`                                                         | `6.0.2`        | Build/test | no       | no                      |
| `node_modules/tr46`                                                                 | `6.0.0`        | Build/test | no       | no                      |
| `node_modules/ts-api-utils`                                                         | `2.5.0`        | Build/test | no       | no                      |
| `node_modules/ts-dedent`                                                            | `2.3.0`        | App build  | no       | no                      |
| `node_modules/tsconfig-paths`                                                       | `3.15.0`       | Build/test | no       | no                      |
| `node_modules/tsconfig-paths/node_modules/json5`                                    | `1.0.2`        | Build/test | no       | no                      |
| `node_modules/tslib`                                                                | `2.8.1`        | App build  | no       | no                      |
| `node_modules/type-check`                                                           | `0.4.0`        | Build/test | no       | no                      |
| `node_modules/typed-array-buffer`                                                   | `1.0.3`        | Build/test | no       | no                      |
| `node_modules/typed-array-byte-length`                                              | `1.0.3`        | Build/test | no       | no                      |
| `node_modules/typed-array-byte-offset`                                              | `1.0.5`        | Build/test | no       | no                      |
| `node_modules/typed-array-length`                                                   | `1.0.8`        | Build/test | no       | no                      |
| `node_modules/typescript`                                                           | `6.0.3`        | Build/test | no       | no                      |
| `node_modules/typescript-eslint`                                                    | `8.70.1`       | Build/test | no       | no                      |
| `node_modules/unbox-primitive`                                                      | `1.1.0`        | Build/test | no       | no                      |
| `node_modules/undici`                                                               | `8.11.2`       | Build/test | no       | no                      |
| `node_modules/undici-types`                                                         | `8.9.0`        | Build/test | no       | no                      |
| `node_modules/unrs-resolver`                                                        | `1.12.2`       | Build/test | no       | yes                     |
| `node_modules/update-browserslist-db`                                               | `1.3.3`        | Build/test | no       | no                      |
| `node_modules/uri-js`                                                               | `4.4.1`        | Build/test | no       | no                      |
| `node_modules/uuid`                                                                 | `14.0.2`       | App build  | no       | no                      |
| `node_modules/vite`                                                                 | `8.3.1`        | Build/test | no       | no                      |
| `node_modules/vite/node_modules/lightningcss`                                       | `1.33.0`       | Build/test | no       | no                      |
| `node_modules/vite/node_modules/lightningcss-android-arm64`                         | `1.33.0`       | Build/test | yes      | no                      |
| `node_modules/vite/node_modules/lightningcss-darwin-arm64`                          | `1.33.0`       | Build/test | yes      | no                      |
| `node_modules/vite/node_modules/lightningcss-darwin-x64`                            | `1.33.0`       | Build/test | yes      | no                      |
| `node_modules/vite/node_modules/lightningcss-freebsd-x64`                           | `1.33.0`       | Build/test | yes      | no                      |
| `node_modules/vite/node_modules/lightningcss-linux-arm-gnueabihf`                   | `1.33.0`       | Build/test | yes      | no                      |
| `node_modules/vite/node_modules/lightningcss-linux-arm64-gnu`                       | `1.33.0`       | Build/test | yes      | no                      |
| `node_modules/vite/node_modules/lightningcss-linux-arm64-musl`                      | `1.33.0`       | Build/test | yes      | no                      |
| `node_modules/vite/node_modules/lightningcss-linux-x64-gnu`                         | `1.33.0`       | Build/test | yes      | no                      |
| `node_modules/vite/node_modules/lightningcss-linux-x64-musl`                        | `1.33.0`       | Build/test | yes      | no                      |
| `node_modules/vite/node_modules/lightningcss-win32-arm64-msvc`                      | `1.33.0`       | Build/test | yes      | no                      |
| `node_modules/vite/node_modules/lightningcss-win32-x64-msvc`                        | `1.33.0`       | Build/test | yes      | no                      |
| `node_modules/vite/node_modules/picomatch`                                          | `4.0.7`        | Build/test | no       | no                      |
| `node_modules/vitest`                                                               | `5.0.1`        | Build/test | no       | no                      |
| `node_modules/vitest/node_modules/magic-string`                                     | `1.4.2`        | Build/test | no       | no                      |
| `node_modules/vitest/node_modules/picomatch`                                        | `4.0.7`        | Build/test | no       | no                      |
| `node_modules/vitest/node_modules/tinyexec`                                         | `1.3.0`        | Build/test | no       | no                      |
| `node_modules/w3c-xmlserializer`                                                    | `6.0.0`        | Build/test | no       | no                      |
| `node_modules/webidl-conversions`                                                   | `8.0.1`        | Build/test | no       | no                      |
| `node_modules/whatwg-mimetype`                                                      | `5.0.0`        | Build/test | no       | no                      |
| `node_modules/whatwg-url`                                                           | `17.1.2`       | Build/test | no       | no                      |
| `node_modules/which`                                                                | `2.0.2`        | Build/test | no       | no                      |
| `node_modules/which-boxed-primitive`                                                | `1.1.1`        | Build/test | no       | no                      |
| `node_modules/which-builtin-type`                                                   | `1.2.1`        | Build/test | no       | no                      |
| `node_modules/which-collection`                                                     | `1.0.2`        | Build/test | no       | no                      |
| `node_modules/which-typed-array`                                                    | `1.1.24`       | Build/test | no       | no                      |
| `node_modules/why-is-node-running`                                                  | `2.3.0`        | Build/test | no       | no                      |
| `node_modules/word-wrap`                                                            | `1.2.5`        | Build/test | no       | no                      |
| `node_modules/xml-name-validator`                                                   | `5.0.0`        | Build/test | no       | no                      |
| `node_modules/xmlchars`                                                             | `2.2.0`        | Build/test | no       | no                      |
| `node_modules/yallist`                                                              | `3.1.1`        | Build/test | no       | no                      |
| `node_modules/yocto-queue`                                                          | `0.1.0`        | Build/test | no       | no                      |
| `node_modules/zod`                                                                  | `4.6.5`        | App build  | no       | no                      |
| `node_modules/zod-validation-error`                                                 | `4.0.2`        | Build/test | no       | no                      |
