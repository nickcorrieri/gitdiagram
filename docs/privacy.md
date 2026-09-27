# Privacy

GitDiagram Local is designed to keep imported reports in your browser. The server serves static application files and receives no report upload. Importing a report uses the browser's `File.text()` API; rendering and exports happen locally.

The application does not request GitHub tokens or AI API keys. It has no cloud generation, application telemetry, analytics recorder, presence WebSocket, advertising or video service. Next.js telemetry is disabled with `NEXT_TELEMETRY_DISABLED=1` during development and builds.

## Optional browser storage

Saving a report is an explicit opt-in. It stores report data in localStorage under this application's origin. That data persists across browser restarts and is available to scripts running on the same origin and people with access to that browser profile. Use the application's clear-saved-report control or clear site data in your browser to remove it.

Without browser saving, the report remains in memory for the open page. Downloaded reports and image exports are files you control; removing browser data does not delete those downloads.

## Outside this application

Your chosen report generator may read or transmit repository code. Review its settings and provider policies separately. This viewer cannot control that tool.

A hosting server or reverse proxy can see ordinary static-file requests and may log visitor addresses. Browser extensions, browser synchronization, operating-system backups and shared browser profiles can affect confidentiality. Use an operator-managed TLS/authentication proxy for private LAN hosting when needed; there is no built-in login.

Dependencies and compiled output still require review. The stated design is not a claim that every dependency or a particular deployed build has passed runtime egress testing.

Report unexpected transmissions or leaks using [SECURITY.md](../SECURITY.md). Never include private code or secrets in a reproduction.
