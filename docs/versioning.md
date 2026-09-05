# Versioning

This project uses **Semantic Versioning** (`vMAJOR.MINOR.PATCH`) with a single
project version tracked at the repository root (`package.json` → `version`).
Versioning and `CHANGELOG.md` are maintained automatically by **Release
Please** (Google) via the `release-please.yml` workflow in `.github/workflows/`.

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
- Merge to the main/default branch before tagging a release.

## Commit message convention

**Conventional Commits** are the single source of truth — Release Please derives
both the next version and every changelog entry from them:

```
<type>(<scope>): <subject>

[body]

BREAKING CHANGE: <description>   # only when breaking
```

| Type | Meaning | Version bump |
| --- | --- | --- |
| `feat` | New feature | MINOR |
| `fix` | Bug fix | PATCH |
| `perf`, `refactor` | No user-visible behavior change | PATCH (or none) |
| `docs`, `build`, `ci`, `chore`, `style`, `test` | Meta changes | none |
| `feat!`, `fix!`, or `BREAKING CHANGE:` | Breaking | MAJOR |

Examples:

```
feat(admin): add hospital analytics export
fix(api): retry MongoDB connection on idle disconnect
feat!(api): replace token format (BREAKING)
```

## Everyday workflow (while developing)

1. Implement the change.
2. Commit with a Conventional Commit message.
3. **Do not** edit `CHANGELOG.md` directly — Release Please owns it.
4. **Do not** bump the version manually unless you must ship immediately
   (see *Manual fallback* below).

## Automated release workflow (Release Please)

A GitHub Action watches `main`. Here is how a release happens:

1. Every merged Conventional Commit is classified by type (`feat`, `fix`,
   etc.) and accumulates into a pending release PR.
2. Release Please keeps the pending PR updated as you keep merging. The PR
   bump-minors until a MAJOR (breaking) change forces a major bump.
3. When you press "Merge" on that release PR:
   - the version in the root `package.json` is bumped,
   - `CHANGELOG.md` sections are generated from the collected commits,
   - a `vX.Y.Z` tag is created and pushed,
   - a GitHub Release is created automatically.
4. Pushing the `vX.Y.Z` tag to `origin` resets the baseline, so the next cycle
   only counts commits merged after that release.

Because releases happen on `main`, releases must be merged from a working
branch (e.g. `dev` → `main` first, then press merge on the release PR).

Initial baseline: the config at `release-please-config.json` + manifest
`.release-please-manifest.json` record `".": "0.2.0"`. The `v0.2.0` tag must be
pushed to `origin` so Release Please filters out everything released before it.

### First-time setup notes

- The manifest says the project is at `0.2.0` — push the existing `v0.2.0` tag
  to `origin/main` before the workflow's first run.
- Keep `bump-minor-pre-major: true` while below `1.0.0` so `feat` commits bump
  the minor (per SemVer `0.x.y` rules).
- `permissions: contents: write` + `pull-requests: write` are required because
  the action pushes version bumps and opens/updates the release PR.

## Manual fallback (only when automation is down)

1. Move the relevant `[Unreleased]` content into a dated section
   `## [X.Y.Z] - YYYY-MM-DD` in `CHANGELOG.md`.
2. Bump the root version:
   ```bash
   npm version X.Y.Z --no-git-tag-version
   npm install   # syncs package-lock.json
   ```
3. Commit and tag:
   ```bash
   git commit -am "chore(release): vX.Y.Z"
   git tag vX.Y.Z
   git push origin main --tags
   ```
4. Create a GitHub Release for the `vX.Y.Z` tag and copy the changelog entries
   in as the description.

## Per-package versioning (if needed later)

Because every app here is `private` (nothing is published to npm), a single
project version is used. If any internal package is ever published, give it
its own `version` + `CHANGELOG.md` (or switch to **Changesets**, which
supports independent per-package versioning in Turborepo/npm-workspaces
monorepos).