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

## Existing Caddy server

Caddy can serve the production build directly, alongside PHP sites. PHP and the Node static server are not needed for this site; Node is still used to build it.

After `npm run build`, copy the site block from [deploy/Caddyfile](../deploy/Caddyfile) into your existing Caddy configuration. Set its `root` to this checkout's absolute `out/` path. Validate the combined configuration with `caddy validate --config /path/to/Caddyfile`, then apply it with `caddy reload --config /path/to/Caddyfile`.

The supplied block serves `http://gitdiagram.localhost`, accepts only loopback clients and GET/HEAD requests, disables directory listings, rejects hidden paths, and preserves the production security headers, including `connect-src 'none'`. It does not enable access logs. Keep the document root limited to generated static files; do not add report files, secrets or symlinks to `out/`. Caddy follows filesystem symlinks.

For private-network hosting, change the hostname and explicitly replace the loopback client restriction with the permitted network range. Use your existing TLS and access controls where needed. Imported reports stay in the visitor's browser.

## Data and verification

No backend report endpoint, AI key or GitHub token is needed. Import a sample report first, then verify export and optional browser persistence before handling sensitive material.

`NEXT_TELEMETRY_DISABLED=1` disables Next.js telemetry during development/build. Browser and server network checks should be performed against the exact dependency set and production build. Package installation may contact registries and execute package scripts; review that separately from application use. No runtime egress verification is asserted by these instructions.
