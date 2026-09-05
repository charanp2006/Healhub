# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Releases are tagged as `vX.Y.Z` on git. See `docs/versioning.md` for how to
maintain this file and release a new version.

## [Unreleased]

### Added

- (new features go here)

### Changed

- (behavior changes go here)

### Deprecated

- (soon-to-be removed features go here)

### Removed

- (removed features go here)

### Fixed

- (bug fixes go here)

### Security

- (security fixes go here)

## [0.2.0] - 2026-09-05

### Added

- Doctor tools: availability management, blog publishing, dashboard, and
  profile pages across the hospital portal (`814c95e`).
- Mobile app UX: `MobileAppBar`, role-aware `MobileTabBar`, and mobile-ready
  layouts for the web, admin, and hospital portals (`95002ce`).
- Shared skeleton loading components replacing "Loading..." and blank states
  across web, admin, and hospital (cards, lists, dashboards, articles,
  counts).
- Login rate limiting: in-memory sliding window — 5 failed attempts / 15 min
  per account, 40 attempts / 15 min per IP (`dc629c7`).
- MongoDB connection troubleshooting doc under `docs/`.

### Changed

- Turbopack enabled for all apps via the shared monorepo config (`7b0c00c`).
- Self-hosted Outfit font; brand color `#179E8D`.
- Lint cleanup: 106 warnings to 0 across web/admin/hospital/api.
- Login error responses no longer leak exception details; "User not found" now
  returns "Invalid credentials" (enumeration-safe).

### Fixed

- Vercel builds failing with `Can't resolve '@healhub/ui'` by declaring
  `@healhub/ui` / `@healhub/config` as dependencies in the consuming apps
  (`7d73e8d`).
- React key and stale/unused import cleanup across all apps.

### Security

- Added security headers: `X-Content-Type-Options`, `X-Frame-Options`,
  `Referrer-Policy`, `Permissions-Policy`.

## [0.1.0] - 2026-09-03

### Added

- Initial release: migrated the MERN application into a Next.js (App Router)
  Turborepo monorepo with `web`, `admin`, `hospital`, and `api` workspaces
  (`008b110`).

[Unreleased]: https://github.com/charanp2006/healhub/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/charanp2006/healhub/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/charanp2006/healhub/releases/tag/v0.1.0