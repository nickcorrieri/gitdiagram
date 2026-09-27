# GitDiagram Local

A self-hosted, browser-only viewer for repository architecture reports. Prepare a report with a model or tool you choose, then import the JSON file here to inspect its graph locally.

The app does not read your repository, call an AI provider, accept GitHub credentials, or upload reports. Its server serves static files. Cloud generation, telemetry, presence WebSockets, advertising and videos from the original application are removed in this fork.

## Use

1. Download the prompt, report schema and sample from the app.
2. Use your chosen tool outside this app to inspect your repository and produce a report. Review that tool's data handling before sharing private code.
3. Import the report JSON. The browser reads it with `File.text()`, validates it and renders the graph locally.
4. Export the report, Mermaid source, SVG or PNG. Saving a report in this browser is an explicit opt-in; otherwise it stays in memory for the open page.

## Run locally

Use Node.js 22.23 or newer and the existing npm supplied with Node. Installing dependencies requires the operator's approval; no package installation is implied by these instructions.

With dependencies already installed:

```sh
npm run dev
```

For a static production build:

```sh
npm run build
npm run start
```

The production server runs `scripts/serve.mjs`, serving `out/` on `127.0.0.1:3000` by default. See [setup](docs/dev-setup.md) for LAN access and hosting details.

Next.js build/development telemetry is disabled through `NEXT_TELEMETRY_DISABLED=1`. Application source intends no outbound data communication. Dependency behavior and runtime egress must still be verified for the exact build you use; this README is not a claim that that verification has already passed.

See [architecture](docs/architecture.md), [privacy](docs/privacy.md) and [security reporting](SECURITY.md).

## Contributions and attribution

If you find unexpected outbound communication or a data leak, open a pull request against this fork with a minimal reproduction and proposed fix. Do not include secrets or private repository code.

This fork derives from [GitDiagram by Ahmed Khaleel](https://github.com/ahmedkhaleel2004/gitdiagram). The original MIT license and copyright notice are preserved in [LICENSE](LICENSE). See [NOTICE](NOTICE). Dependency packages retain their own licenses; this attribution does not imply endorsement by the original author.
