# Development and hosting

Use Node.js 22.23 or newer and the existing npm supplied with Node. Obtain operator approval before installing dependencies or any missing runtime. Commands below assume dependencies are already installed.

```sh
npm run dev
```

Development binds to loopback. Open `http://127.0.0.1:3000` locally. `gitdiagram.localhost` works only if your browser and local DNS/hosts configuration resolve it to this machine; the app does not configure DNS.

## Static production build

```sh
npm run build
npm run start
```

The build exports static files to `out/`. `npm run start` uses the Node static server in `scripts/serve.mjs`. Defaults are `HOST=127.0.0.1` and `PORT=3000`.

To expose it intentionally to your LAN:

```sh
HOST=0.0.0.0 PORT=3000 npm run start
```

Other machines use the host machine's LAN address and port. Binding to all interfaces expands access to anyone who can reach that port. There is no built-in login. Configure firewall rules, TLS and authentication at an operator-managed reverse proxy when required. Static hosting or the supplied Docker image serves the same exported files; report imports remain in each visitor's browser.

## Data and verification

No backend report endpoint, AI key or GitHub token is needed. Import a sample report first, then verify export and optional browser persistence before handling sensitive material.

`NEXT_TELEMETRY_DISABLED=1` disables Next.js telemetry during development/build. Browser and server network checks should be performed against the exact dependency set and production build. Package installation may contact registries and execute package scripts; review that separately from application use. No runtime egress verification is asserted by these instructions.
