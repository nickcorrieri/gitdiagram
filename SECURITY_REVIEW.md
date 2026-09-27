# GitDiagram outbound-data and backdoor review

> Historical review of the upstream commit named below. It describes source paths and behavior removed from this local fork; see [README.local.md](README.local.md) and [docs/privacy.md](docs/privacy.md) for the fork's current design. The fork has not yet had an installed-dependency or runtime egress review.

Reviewed 2026-09-27 at commit `abe0620f1ff33c1d962e5e8cc6dc74e66c8090cf`.

Static review by the primary reviewer and three GPT-6 Sol subagents. No packages installed, application started, repository scripts executed, credentials supplied, or external services contacted. This report is the only added file.

## Verdict

This is not an offline repository inspector. Normal diagram generation sends repository material to an external AI provider, and results are stored in external cloud infrastructure. Optional analytics and presence features create additional privacy exposures, including private repository names and potentially rendered architecture details. The tracking implementation explicitly attempts to reduce adblock interference.

No concealed source uploader, hardcoded master login, reverse shell, or custom obfuscated execution loader was identified in the reviewed repository-owned code. This does not establish the safety of uninstalled dependencies or downloaded binaries, or that the public hosted service runs this exact commit.

Severity below describes relevance to protecting confidential code and credentials; intentional functionality is distinguished from exploitable defects.

## Findings

### 1. High privacy impact: repository code is sent to external AI services

Diagram generation builds a model prompt containing file tree, README and source excerpts, including for authorized private repositories. The source selection limit is 12 files / 48,000 characters; this is actual source text, not just filenames. OpenAI is the default provider; OpenRouter is selectable and forwards requests to the selected model service.

- [Prompt payload](https://github.com/ahmedkhaleel2004/gitdiagram/blob/abe0620f1ff33c1d962e5e8cc6dc74e66c8090cf/src/app/api/generate/stream/route.ts#L642)
- [External provider clients](https://github.com/ahmedkhaleel2004/gitdiagram/blob/abe0620f1ff33c1d962e5e8cc6dc74e66c8090cf/src/server/generate/openai.ts#L48)
- [Source selection limits and filters](https://github.com/ahmedkhaleel2004/gitdiagram/blob/abe0620f1ff33c1d962e5e8cc6dc74e66c8090cf/src/server/generate/repository-context.ts#L4)
- [Verbatim source formatting](https://github.com/ahmedkhaleel2004/gitdiagram/blob/abe0620f1ff33c1d962e5e8cc6dc74e66c8090cf/src/server/generate/source-context.ts#L243)

Obvious sensitive filenames are excluded from source bodies, but embedded secrets in an eligible source file or README are not content-redacted. Filename exclusions also do not remove every sensitive path from the tree prompt. This is intended functionality, not evidence of a hidden backdoor. Self-hosting does not prevent these model transmissions.

Diagram Responses payloads omit an explicit `store: false`; video requests explicitly set it. This review does not assert a provider retention duration or policy.

- [Diagram request](https://github.com/ahmedkhaleel2004/gitdiagram/blob/abe0620f1ff33c1d962e5e8cc6dc74e66c8090cf/src/server/generate/openai.ts#L221)
- [Video request](https://github.com/ahmedkhaleel2004/gitdiagram/blob/abe0620f1ff33c1d962e5e8cc6dc74e66c8090cf/src/server/explainer/director.ts#L245)

### 2. High privacy impact when enabled: session replay and deliberate adblock avoidance

Setting `NEXT_PUBLIC_POSTHOG_KEY` enables PostHog. Session recording is not disabled; clicks, submissions, heatmaps, exceptions and page departures are also configured for collection. The recorder is bundled specifically so its filenames cannot be blocked independently. The unusual first-party `/phx9a` path explicitly reduces adblock filter hits and forwards to PostHog's US endpoints.

- [Recorder bundling and proxy selection](https://github.com/ahmedkhaleel2004/gitdiagram/blob/abe0620f1ff33c1d962e5e8cc6dc74e66c8090cf/src/lib/analytics-client.ts#L42)
- [Recording configuration](https://github.com/ahmedkhaleel2004/gitdiagram/blob/abe0620f1ff33c1d962e5e8cc6dc74e66c8090cf/src/lib/analytics-client.ts#L78)
- [External proxy destinations](https://github.com/ahmedkhaleel2004/gitdiagram/blob/abe0620f1ff33c1d962e5e8cc6dc74e66c8090cf/next.config.js#L117)

Inputs are masked, credential inputs have an exclusion class, and network bodies/headers are excluded. However, rendered diagrams and architecture notes have no replay exclusion found in the reviewed tree. Their displayed content can potentially enter DOM recordings. Actual recording selection also depends on the remote PostHog settings, which were not inspected.

Pageview events explicitly include the complete page URL with query parameters. Private repository names in paths, or secrets accidentally placed in query strings, can be transmitted independently of replay network masking.

- [Full URL capture](https://github.com/ahmedkhaleel2004/gitdiagram/blob/abe0620f1ff33c1d962e5e8cc6dc74e66c8090cf/src/app/providers.tsx#L19)
- [Unblocked rendered architecture text](https://github.com/ahmedkhaleel2004/gitdiagram/blob/abe0620f1ff33c1d962e5e8cc6dc74e66c8090cf/src/components/generation/architecture-notes.tsx#L58)

This feature is off in the supplied environment template because its key is blank.

### 3. High privacy impact when enabled: external WebSocket exposes private repository names

When `NEXT_PUBLIC_PRESENCE_URL` is configured, a visible tab opens a persistent WebSocket after approximately 15 seconds. It sends page path, visibility, persistent random browser ID, device category, referrer origin and timezone. The source explicitly acknowledges that private repository names are sent and shown on the operator dashboard. Cloudflare's worker adds IP-derived country, region, city and coordinates to visitor state.

- [Explicit private-name disclosure](https://github.com/ahmedkhaleel2004/gitdiagram/blob/abe0620f1ff33c1d962e5e8cc6dc74e66c8090cf/src/components/live-presence.tsx#L28)
- [WebSocket payload and connection](https://github.com/ahmedkhaleel2004/gitdiagram/blob/abe0620f1ff33c1d962e5e8cc6dc74e66c8090cf/src/components/live-presence.tsx#L155)
- [Worker geolocation fields](https://github.com/ahmedkhaleel2004/gitdiagram/blob/abe0620f1ff33c1d962e5e8cc6dc74e66c8090cf/workers/presence/src/index.ts#L663)

This is a monitoring channel, not a discovered remote-command channel. It is off with the supplied blank presence URL. Separately, server generation events can be sent to the same worker; private diagram names are redacted in that server-event path, which does not fix the browser-path exposure.

### 4. High credential impact if the worker is deployed unchanged: author-site default receives your secret

The bundled worker defaults `SITE_ORIGIN` to `https://gitdiagram.com`. Its `drainSite()` function posts to that origin's `/api/admin/presence-feed` with `Authorization: Bearer <PRESENCE_SECRET>`. Deploying this worker with your own secret but retaining the upstream site default can disclose your shared secret to the author's site, even if that site rejects the request.

- [Author-site default](https://github.com/ahmedkhaleel2004/gitdiagram/blob/abe0620f1ff33c1d962e5e8cc6dc74e66c8090cf/workers/presence/wrangler.jsonc#L12)
- [Secret-bearing outbound request](https://github.com/ahmedkhaleel2004/gitdiagram/blob/abe0620f1ff33c1d962e5e8cc6dc74e66c8090cf/workers/presence/src/index.ts#L400)

This requires deploying the optional worker and configuring a secret. It does not run merely because the repository was cloned. The disclosed secret is used to authenticate worker events and derive dashboard tokens; it is not the separate video admin token.

### 5. Medium privacy impact: cloud persistence and server access to credentials

Generated diagrams, explanations, graphs, repository identities and session summaries are uploaded to configured Cloudflare R2 storage. Private output uses a private bucket with a PAT-derived HMAC namespace. This isolates cache namespaces but does not encrypt the artifact against the app operator or cloud storage access. Redis coordination/state is sent to the configured Upstash-compatible REST endpoint.

- [Stored artifact and upload](https://github.com/ahmedkhaleel2004/gitdiagram/blob/abe0620f1ff33c1d962e5e8cc6dc74e66c8090cf/src/server/storage/artifact-store.ts#L256)
- [R2 endpoint](https://github.com/ahmedkhaleel2004/gitdiagram/blob/abe0620f1ff33c1d962e5e8cc6dc74e66c8090cf/src/server/storage/r2.ts#L49)
- [Private storage namespace](https://github.com/ahmedkhaleel2004/gitdiagram/blob/abe0620f1ff33c1d962e5e8cc6dc74e66c8090cf/src/server/storage/cache-key.ts#L56)
- [Redis outbound request](https://github.com/ahmedkhaleel2004/gitdiagram/blob/abe0620f1ff33c1d962e5e8cc6dc74e66c8090cf/src/server/storage/upstash.ts#L25)

User-supplied GitHub PATs and OpenAI keys are posted to the app's server and stored as raw values in 30-day HttpOnly, SameSite=Strict cookies scoped to `/api`. These controls limit browser-script access and CSRF; they do not hide credentials from the server operator. No additional credential database persistence or intentional credential logging was found in the inspected path. In self-hosted use, that server is yours; in hosted use, it belongs to the service operator.

- [Credential submission](https://github.com/ahmedkhaleel2004/gitdiagram/blob/abe0620f1ff33c1d962e5e8cc6dc74e66c8090cf/src/features/credentials/api.ts#L129)
- [Cookie options](https://github.com/ahmedkhaleel2004/gitdiagram/blob/abe0620f1ff33c1d962e5e8cc6dc74e66c8090cf/src/server/http/request-credentials.ts#L37)
- [Raw credential storage](https://github.com/ahmedkhaleel2004/gitdiagram/blob/abe0620f1ff33c1d962e5e8cc6dc74e66c8090cf/src/server/http/request-credentials.ts#L72)

### 6. Medium authentication concern: revoked admin sessions may survive Redis failures

Admin access requires an operator-configured token and signed session cookie. However, when the Redis revocation generation is unknown, a correctly signed, unexpired cookie is accepted. A previously revoked or stolen cookie may therefore work on an instance unable to read revocation state. A stale cached generation during an outage can have a similar effect. This is an explicit availability tradeoff, not a secret password or arbitrary anonymous login. Rotating the operator token invalidates the signatures.

- [Documented outage behavior](https://github.com/ahmedkhaleel2004/gitdiagram/blob/abe0620f1ff33c1d962e5e8cc6dc74e66c8090cf/src/server/admin/operator.ts#L13)
- [Revocation check](https://github.com/ahmedkhaleel2004/gitdiagram/blob/abe0620f1ff33c1d962e5e8cc6dc74e66c8090cf/src/server/admin/operator.ts#L136)

### 7. Install and runtime execution surfaces

`prepare` changes this clone's Git hook configuration to `.githooks`. The reviewed pre-push hook runs formatting, lint, typechecking and dependency checks; no hidden uploader was found there. `ffmpeg-static` is explicitly trusted to run dependency install scripts. Its package implementation is absent locally, so its installer, downloads and binaries were not verified.

- [Install hook configuration](https://github.com/ahmedkhaleel2004/gitdiagram/blob/abe0620f1ff33c1d962e5e8cc6dc74e66c8090cf/package.json#L24)
- [Trusted dependency installer](https://github.com/ahmedkhaleel2004/gitdiagram/blob/abe0620f1ff33c1d962e5e8cc6dc74e66c8090cf/package.json#L115)
- [Git hook](https://github.com/ahmedkhaleel2004/gitdiagram/blob/abe0620f1ff33c1d962e5e8cc6dc74e66c8090cf/.githooks/pre-push#L8)

Video rendering launches Chromium and ffmpeg with executable/argument arrays. The Docker recipe runs Chromium without its sandbox. Development video callers intentionally bypass budget restrictions; this does not bypass dashboard authentication. Keep development servers local if used.

- [Chromium container flags](https://github.com/ahmedkhaleel2004/gitdiagram/blob/abe0620f1ff33c1d962e5e8cc6dc74e66c8090cf/Dockerfile#L60)
- [Development budget bypass](https://github.com/ahmedkhaleel2004/gitdiagram/blob/abe0620f1ff33c1d962e5e8cc6dc74e66c8090cf/src/server/explainer/limits.ts#L101)

## Other outbound surfaces

- GitHub API and raw-content hosts: metadata, tree, README and source reads; private source uses the API with the supplied PAT. Public raw-content requests contain no token. Source reads disable redirects and verify blob hashes.
- Videos, off by default: public repository context/images go to Anthropic/OpenAI; narration goes to OpenRouter and generated audio to OpenAI transcription. Current video ingestion requires public repositories.
- README images for videos: requests can reach arbitrary public HTTPS image servers mentioned by a repository. Connection-time DNS checks reject private/local addresses and redirect hops are checked. An image server still sees the request and server IP.
- Sponsor events go to PostHog when its key is configured; sponsor clicks redirect to the campaign destination.
- Author-repository star counts are fetched from GitHub even without generating a diagram. These calls name the author's repository, not the inspected private repository.
- The presence worker and Redis URLs are deployment configuration trust boundaries: use only endpoints you control or intend to trust.

## Negative findings and limits

Reviewed application/client/server source, API/auth flows, scripts, hooks, worker, manifests, lockfiles, dependency patch, workflows, Docker configuration and experiment network/process surfaces. No local-repository crawler or home-directory harvesting path was identified in the normal application pipeline: it reads repositories from GitHub. No custom `eval()` / `new Function()` loader, reverse shell or hardcoded master credential was identified. The minified vendor script identifies itself as GSAP; minification alone is not evidence of a backdoor, and its authenticity was not independently verified.

No dynamic exploit validation, traffic capture, dependency source audit, binary inspection or hosted-service verification was performed. Static evidence confirms the transmission paths and configuration risks above; it does not prove all runtime behavior safe.

## Decision for confidential code

Do not use the current application for a requirement that code remain entirely local. Blank PostHog/presence configuration prevents those optional channels, but does not prevent AI-provider transmission or cloud storage. Confidential use would require deliberate changes to model execution and persistence, removal or hard disabling of recording/presence, and separate verification of install dependencies. Do not deploy the presence worker with the upstream `SITE_ORIGIN` default and your own secret.
