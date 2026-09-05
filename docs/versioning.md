# Versioning

This project uses **Semantic Versioning** (`vMAJOR.MINOR.PATCH`) with a
single project version tracked at the repository root (`package.json` →
`version`) and recorded in `CHANGELOG.md`.

## Version meaning

| Segment | Increment when... | Examples |
| --- | --- | --- |
| `MAJOR` | A change breaks existing behavior (API contract, auth model, database schema, page/route removal). | `1.2.0` → `2.0.0` |
| `MINOR` | A new, backward-compatible feature is added. | `1.2.0` → `1.3.0` |
| `PATCH` | A backward-compatible bug fix lands. | `1.2.0` → `1.2.1` |

Pre-release labels (e.g. `1.3.0-beta.1`) are optional and only needed when
sharing unstable builds.

## Rules of thumb

- `0.x.y` = unstable/development API surface. Any "small" change can bump the
  minor. Stabilize by releasing `1.0.0` when the product is feature-complete
  and stable.
- Never reset a version. Always go forward.
- Tag every release: `git tag v0.2.0`.
- Merge to the main/default branch before tagging a release.

## Commit message convention

Use **Conventional Commits** so the next version and changelog entries are
derivable from history:

```
<type>(<scope>): <subject>

[body]

BREAKING CHANGE: <description>   # only when breaking
```

Types used in this repo (see `.gitignore`-free git log):

| Type | Meaning | Bump |
| --- | --- | --- |
| `feat` | New feature | MINOR |
| `fix` | Bug fix | PATCH |
| `perf`, `refactor` | No user-visible behavior change | PATCH (or none) |
| `docs`, `build`, `ci`, `chore` | Meta changes | none |
| `feat!`, `fix!`, or `BREAKING CHANGE:` | Breaking | MAJOR |

Examples:

```
feat(admin): add hospital analytics export
fix(api): retry MongoDB connection on idle disconnect
feat!(api): replace token format (BREAKING)
```

## Everyday workflow (while developing)

1. Implement the change.
2. Add one or more lines under the relevant `[Unreleased]` section in
   `CHANGELOG.md` (Added / Changed / Deprecated / Removed / Fixed / Security).
3. Commit with a Conventional Commit message.
4. Do NOT bump the version for every feature — accumulate under `Unreleased`.

## Release workflow (when shipping)

1. Confirm `CHANGELOG.md` `[Unreleased]` captures everything for this release.
2. Decide the new version by SemVer (see table above).
3. Move the `[Unreleased]` content into a dated section `## [X.Y.Z] - YYYY-MM-DD`
   and reset `[Unreleased]` to empty.
4. Bump `"version": "X.Y.Z"` in the root `package.json`:
   ```bash
   npm version X.Y.Z --no-git-tag-version
   npm install   # syncs package-lock.json
   ```
5. Create the tag and push:
   ```bash
   git add CHANGELOG.md package.json package-lock.json
   git commit -m "chore(release): vX.Y.Z"
   git tag vX.Y.Z
   git push origin main --tags
   ```
6. Create a GitHub Release with the `vX.Y.Z` tag; copy that version's
   changelog entries as the description.

## Automation paths (optional upgrades)

The manual flow above works for this project today. When it grows, adopt one
of the standard tools that read Conventional Commits and maintain
`CHANGELOG.md` + tags automatically:

- **Changesets** — recommended for Turborepo/npm-workspaces monorepos. Add a
  small `changeset/` file per PR; a "Version Packages" PR is auto-generated
  on merge to the default branch.
- **Release Please** (Google) — CI creates a release PR that bumps versions,
  updates `CHANGELOG.md`, and opens a GitHub Release from commit history.
- **semantic-release** — fully automated publish/tag/release on merge; best
  for packages published to npm.

Switching later only requires deleting the manual `Unreleased` maintenance and
letting the tool own the changelog, so the current setup is a safe starting
point.

## Per-package versioning (if needed later)

Because every app here is `private` (nothing is published to npm), a single
project version is used. If any internal package is ever published, give it
its own `version` + `CHANGELOG.md` and adopt Changesets, which supports
independent per-package versioning in monorepos.