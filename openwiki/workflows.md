# Workflows

This page describes the development and release workflows for Standard Toolkit, including branching strategy, quality gates, versioning, and CI/CD processes.

## Development Workflow

### Branching Strategy

**Main Branch:** `main`
- All feature work branches from `main`
- Changes are NEVER committed directly to `main`
- All changes require peer review and approval

**Branch Naming:**
- `feat/<description>` - New features
- `fix/<description>` - Bug fixes
- `chore/<description>` - Maintenance, tooling, dependencies
- `docs/<description>` - Documentation changes

**Beta Branches:** `beta/v<major>.<minor>`
- Pre-release candidates for validation before stable release
- Only one active beta branch at a time
- Accepts direct PRs for beta-specific fixes

**Example:**
```bash
git checkout main
git pull origin main
git checkout -b feat/add-tooltip-delay
```

### Pull Request Process

1. **Create Branch:**
   - Branch from `main` (or beta branch if targeting pre-release)
   - Use descriptive kebab-case branch name

2. **Develop and Test:**
   - Make changes and commit incrementally
   - Run tests locally: `pnpm --filter=<package> test -- --watch`
   - Ensure quality gates pass: lint, type-check, test, build

3. **Create Changeset:**
   - Required for changes to `src/*` files or config affecting artifact output
   - Run `pnpm changeset` and follow prompts
   - Select affected packages and describe the change
   - Choose version bump type: major (breaking), minor (feature), patch (fix)

   ```bash
   pnpm changeset
   # Follow prompts to create .changeset/<random-name>.md
   ```

4. **Commit and Push:**
   - Follow [Conventional Commits](https://www.conventionalcommits.org/) for final commit message
   - Examples:
     - `feat: add tooltip delay prop`
     - `fix: correct button hover state`
     - `chore: update dependency versions`
   - Push branch to GitHub

5. **Open Pull Request:**
   - Open PR to `gohypergiant/standard-toolkit`
   - Link to related issue if applicable
   - Add `closes #<issue>` to PR description to auto-close issue on merge
   - Keep branch current by clicking "Update Branch" in GitHub UI

6. **Review and Approval:**
   - Wait for CI quality gates to pass
   - Address reviewer feedback
   - Obtain required approvals (author cannot approve own PR)
   - Some areas have CODEOWNERS requiring specific reviewers

7. **Merge:**
   - **Author merges** when all gates pass and approvals are obtained
   - Use "Squash and merge" or "Create a merge commit" (not "Rebase and merge")

### Quality Gates

All PRs must pass quality gates before merge:

**Linting:**
```bash
pnpm lint          # Biome linting
pnpm lint:fs       # Filesystem naming conventions (ls-lint)
pnpm lint:deps     # Dependency version consistency (syncpack)
pnpm lint:package  # Package.json validation (publint)
```

**Type Checking:**
```bash
pnpm build         # TypeScript compilation across all packages
```

**Testing:**
```bash
pnpm test          # All unit/integration tests (vitest)
# Coverage thresholds: 80% branches, functions, lines, statements
```

**Formatting:**
```bash
pnpm format:check  # Verify code formatting (Biome)
```

### Local Testing

Test only what you're working on for fast feedback:

```bash
# Watch mode for specific package
pnpm --filter=@accelint/design-toolkit test -- --watch

# Run tests for all packages
pnpm test

# Filter turbo commands interactively
pnpm dev:filter    # Select packages to dev
pnpm preview:filter  # Select packages to preview
```

At milestones, test broadly to catch side effects:

```bash
pnpm build         # Build entire workspace
pnpm test          # Test entire workspace
```

## Versioning

Standard Toolkit follows [Semantic Versioning](https://semver.org/) (semver) and uses [Changesets](https://github.com/changesets/changesets) for independent package versioning.

### Semver Version Types

Given version `MAJOR.MINOR.PATCH` (e.g., `9.12.0`):

**MAJOR (Breaking Change):**
- Incompatible API changes requiring consumer updates
- Examples: Removing props, changing function signatures, renaming exports
- Increments: `9.12.0` → `10.0.0`

**MINOR (Feature):**
- Backward-compatible new functionality
- Examples: Adding props, new components, new utilities
- Increments: `9.12.0` → `9.13.0`

**PATCH (Fix):**
- Backward-compatible bug fixes
- Examples: Fixing incorrect behavior, style bugs, type errors
- Increments: `9.12.0` → `9.12.1`

### Changesets Workflow

**Creating a Changeset:**

When you change source code or config affecting package artifacts:

```bash
pnpm changeset
```

Prompts:
1. **Select packages:** Choose which packages are affected
2. **Version bump:** Select major, minor, or patch for each package
3. **Summary:** Describe the change (appears in CHANGELOG.md)

Output: Creates `.changeset/<random-name>.md` file

**Example Changeset:**
```markdown
---
"@accelint/design-toolkit": minor
---

Add delay prop to Tooltip component
```

**Committing Changesets:**

Commit the changeset file with your changes:

```bash
git add .changeset/random-name.md
git commit -m "feat: add tooltip delay prop"
```

**Versioning and Release:**

When changesets are merged to `main`, a bot creates a "Version Packages" PR:
- Applies all changesets
- Bumps package versions
- Updates CHANGELOG.md files
- Deletes applied changeset files

Merging the Version Packages PR triggers automated release to npm.

## Release Workflows

Standard Toolkit supports three release channels:

### 1. Stable Release (Default)

**Target Branch:** `main`  
**npm Tag:** `@latest`  
**Version Format:** `X.Y.Z` (e.g., `9.12.0`)

**Process:**
1. PRs with changesets merge to `main`
2. GitHub Actions creates "Version Packages" PR
3. TSC reviews and merges Version Packages PR
4. GitHub Actions builds and publishes to npm with `@latest` tag

**Quality Bar:** Full (tests, docs, review, verification gates)

**Workflow:** `/.github/workflows/release.yml`

### 2. Beta Release

**Target Branch:** `beta/v<major>.<minor>`  
**npm Tag:** `@beta`  
**Version Format:** `X.Y.Z-beta.N` (e.g., `9.11.0-beta.1`)

**Purpose:**
- Pre-stable release candidates
- Production validation before promoting to `@latest`
- Early adopter testing for breaking changes

**When to Use:**
- Features are complete and need real-world testing
- Coordinated pre-release across multiple packages
- Testing breaking changes before stable release

**Starting Beta:**

```bash
# Create beta branch
git checkout main
git pull origin main
git checkout -b beta/v10.0

# Enter prerelease mode
pnpm beta:start

# Verify prerelease mode
pnpm beta:status
# Should show: "mode": "pre", "tag": "beta"

# Commit and push
git add .changeset/pre.json
git commit -m "chore: enter beta prerelease mode"
git push origin beta/v10.0
```

GitHub Actions automatically:
- Creates version PR with beta versions (e.g., `9.11.0-beta.1`)
- Publishes to npm with `@beta` tag after PR merge

**Iterating on Beta:**

Make changes directly to beta branch or merge from `main`:

```bash
# Direct changes
git checkout beta/v10.0
# Make changes
git commit -m "fix: beta-specific issue"
git push origin beta/v10.0

# Merge from main
git checkout beta/v10.0
git merge main
git push origin beta/v10.0
```

Each merge increments the beta suffix: `9.11.0-beta.1` → `9.11.0-beta.2`

**Promoting to Stable:**

Merge beta branch back to `main`:

```bash
git checkout main
git merge beta/v10.0
pnpm beta:exit             # Exit prerelease mode
git add .changeset/pre.json
git commit -m "chore: exit beta prerelease mode"
git push origin main
```

Next Version Packages PR will promote to stable (e.g., `9.11.0-beta.2` → `9.11.0`).

**Workflow:** `/.github/workflows/release-beta.yml`

**Documentation:** `/documentation/BETA_RELEASE.md`

### 3. Experimental Release

**Target Branch:** Any feature branch  
**npm Tag:** `@experimental`  
**Version Format:** `0.0.0-experimental-<hash>-<timestamp>` (e.g., `0.0.0-experimental-abc123-20250101120000`)

**Purpose:**
- API exploration and rapid iteration
- Test changes in consuming apps without formal versioning
- Incomplete features or work-in-progress

**When to Use:**
- Experimenting with new APIs
- Dogfooding features before beta/stable
- Prototyping breaking changes

**Process:**
1. Push changes to any branch
2. Comment `/release experimental` in PR
3. GitHub Actions publishes with experimental tag
4. Install: `npm install @accelint/package@experimental`

**Quality Bar:** Minimal (no tests, docs, or review required)

**Lifecycle:** Experimental releases are automatically cleaned up after 30 days.

**Workflow:** `/.github/workflows/publish-experimental.yml`

**Documentation:** `/documentation/EXPERIMENTAL_RELEASE.md`

## CI/CD Pipelines

### Core Pipelines

**ci.yml** - Quality Gates
- Runs on all PRs
- Executes: lint, type-check, test, build
- Blocks merge if any gate fails

**release.yml** - Stable Release
- Triggered on merge to `main` with changesets
- Creates Version Packages PR
- Publishes to npm with `@latest` tag after Version PR merge

**release-beta.yml** - Beta Release
- Triggered on push to `beta/*` branches
- Increments beta version
- Publishes to npm with `@beta` tag

**publish-experimental.yml** - Experimental Release
- Triggered by `/release experimental` comment in PR
- Publishes to npm with `@experimental` tag
- No versioning or changelog updates

### Testing Pipelines

**visual-regression.yml**
- Captures Playwright screenshots on Linux
- Compares to baseline images
- Fails if visual differences exceed threshold
- Manual approval workflow for updating baselines

**visual-regression-update.yml**
- Triggered manually to update visual baselines
- Captures new screenshots and commits to repo

**memlab.yml**
- Runs MemLab memory leak detection
- Analyzes heap snapshots
- Reports detached DOM nodes and memory regressions

**coverage-comment.yml**
- Posts test coverage reports to PRs
- Shows coverage diff from `main`

### Security & Maintenance

**security.yml**
- Runs security scans (e.g., detect-secrets)
- Checks for leaked credentials or sensitive data

**experimental-age-tracker.yml**
- Tracks experimental release age
- Auto-deletes releases older than 30 days

## Code Owners

Some directories require review from specific team members:

**Configuration:** `/.github/CODEOWNERS.md`

When you modify files in code-owned areas, those owners must approve the PR.

## Approvals

Reviewers should focus on:

1. **Business Logic** (Doing the right things)
   - Does the change address the stated need?
   - Are the requirements satisfied?

2. **Established Patterns** (Doing things correctly)
   - Does it follow existing conventions?
   - Are common modules and patterns used?

3. **Performance** (Doing things efficiently)
   - Does it maintain or improve performance?
   - Are there obvious optimization opportunities?

**Note:** Subjective style differences should not block approval if the change is functionally correct.

## Backstage Catalog Integration

### Constellation Tracker

Standard Toolkit integrates with Constellation (Backstage) for service discovery.

**Purpose:**
- Each package has a `catalog-info.yaml` file
- Constellation Tracker auto-updates these files based on workspace dependencies
- Enables dependency visualization in Backstage

**Running Manually:**

```bash
pnpm constellation-tracker
```

**Automated Execution:**
- Runs in CI on PR merge
- Runs via lefthook on pre-commit (optional)

**Configuration:**

Each package's `catalog-info.yaml` describes:
- Component name and type
- Package description
- Dependency relationships
- Owner team

**Source:** `/tooling/constellation-tracker/`

## Scripts and Automation

### License Headers

Automatically adds Apache 2.0 license headers to source files:

```bash
pnpm license
```

**Source:** `/scripts/license.mjs`

### Index Generation

Auto-generates package `src/index.ts` files:

```bash
pnpm indexer
```

**Source:** `/scripts/indexer.mjs`, `/scripts/indexer-v2.mjs`

### Dependency Version Management

**syncpack** - Enforce consistent versions:

```bash
pnpm lint:deps        # Check consistency
pnpm format:deps      # Auto-fix versions
```

**taze** - Bulk dependency updates:

```bash
pnpm deps:version-minor   # Update minor versions
pnpm deps:version-patch   # Update patch versions
pnpm deps:version-major   # Update major versions
```

### Auditing

**Docblock Audit:**

Ensures TypeScript files have proper documentation:

```bash
pnpm audit:docblocks
```

**Source:** `/scripts/audit-docblocks.mjs`

**react-aria-components Audit:**

Validates RAC dependency versions:

```bash
pnpm lint:rac
```

**Source:** `/scripts/rac-deps.mjs`

## Common Workflows

### Adding a New Component

1. Create component directory: `packages/design-toolkit/src/components/new-component/`
2. Add component files:
   - `index.tsx` - Main component
   - `types.ts` - TypeScript types
   - `styles.module.css` - Component styles
   - `new-component.stories.tsx` - Storybook stories
   - `new-component.test.tsx` - Unit tests
   - `new-component.docs.mdx` - Documentation

3. Run indexer to update package exports:
   ```bash
   pnpm --filter=@accelint/design-toolkit run index
   ```

4. Add subpath export to `package.json`:
   ```json
   "exports": {
     "./components/new-component": "./dist/components/new-component/index.js"
   }
   ```

5. Create changeset:
   ```bash
   pnpm changeset
   # Select @accelint/design-toolkit
   # Choose "minor" (new feature)
   # Describe: "Add NewComponent for <purpose>"
   ```

6. Commit and open PR

### Fixing a Bug

1. Create fix branch: `git checkout -b fix/button-hover-state`
2. Make changes and add tests
3. Run tests: `pnpm --filter=@accelint/design-toolkit test`
4. Create changeset:
   ```bash
   pnpm changeset
   # Select affected package
   # Choose "patch" (bug fix)
   # Describe the fix
   ```
5. Commit and open PR

### Updating Dependencies

1. Check for updates: `pnpm taze`
2. Update dependencies: `pnpm deps:version-minor` (or patch/major)
3. Test: `pnpm build && pnpm test`
4. Create changeset if updating dependency affects published packages
5. Commit and open PR

---

**Related:**
- [Quickstart](./quickstart.md) - Getting started
- [Architecture](./architecture.md) - System design
- [Packages](./packages.md) - Package details
- [Operations](./operations.md) - Building and testing
