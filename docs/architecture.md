# Architecture

GitDiagram Local separates repository inspection from viewing. The owner chooses an external model or tool and controls what it can read. This app supplies a downloadable prompt, JSON schema and sample report, then displays the resulting report.

## Browser pipeline

1. The user selects a local JSON file.
2. `File.text()` reads that file in the browser.
3. Validation checks the report structure before rendering.
4. A validated graph becomes a local Mermaid diagram.
5. Report JSON, Mermaid source, SVG and PNG are generated for browser downloads.

Report data stays in page memory unless the user explicitly enables browser saving. That option uses localStorage for the current browser origin. It is not a server database or synchronization service.

## Hosting boundary

Next.js produces a static export in `out/`. The production Node server serves those files; it has no report upload or repository inspection API. Docker hosts the same static application. Development tooling is separate from the exported production application.

The fork has no application integration with GitHub, AI providers, cloud storage, telemetry, presence WebSockets, advertising or video generation. Browser assets are served locally. Next.js telemetry is disabled during development and builds.

## Trust boundaries

Imported reports are untrusted data. Schema validation and diagram sanitization constrain rendering, but do not prove that report contents are accurate or safe to share. External report generators, browser extensions, dependency packages, hosting configuration and exported files each require their own review.

Source design alone does not establish runtime network behavior. Dependency inspection and egress verification must cover the exact installed versions and generated output.
