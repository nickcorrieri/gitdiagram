# Security reporting

Unexpected outbound communication, report uploads, credential collection, unsafe imported-report rendering and unintended browser persistence are relevant security issues for this fork.

Open a pull request against this fork with a minimal reproduction and proposed fix. Include the affected revision, environment, destination or request observed, and expected behavior. Use the sample report or synthetic data. Do not include secrets, API keys, private repository code or confidential reports.

If reproduction would disclose sensitive details, use a private reporting channel offered by this fork's hosting platform or maintainer before publishing them. No private contact address is specified here.

The application has no built-in login. Operators control network exposure, TLS, reverse-proxy authentication and static-server logs. Dependency installation and external report generation have separate trust boundaries. Design claims must be checked against the exact build; dependency behavior and runtime egress verification are not asserted as complete by this document.
