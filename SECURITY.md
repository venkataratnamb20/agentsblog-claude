# Security policy

## Supported versions

Only the latest release on `main` receives security fixes; until the first release, the current `develop` branch is the supported version.

## Reporting a vulnerability

Please report privately and do not open a public issue with details.

- Use GitHub private vulnerability reporting: open the repository's **Security** tab and choose **Report a vulnerability**.
- If that option is not available, open an issue that says only that you need to report a security problem, with no details, and the project owner will arrange a private channel.

Reports are handled by the project owner (Venkat) with the Security Engineer agent. There is no guaranteed response time yet.

## Secrets

Never commit a credential. If you find one in the repository, treat it as leaked and report it privately. How secrets are stored, scanned and rotated: `docs/guidelines/secrets-and-access.md`.
