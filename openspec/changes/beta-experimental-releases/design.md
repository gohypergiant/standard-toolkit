# Design: Beta and Experimental Release Workflows

## Context

Standard-toolkit is a monorepo with 20+ packages under the `@accelint/*` scope. Currently, only stable releases are supported through the main branch using changesets + GitHub Actions. The bikeshed repository contains a proven implementation of beta and experimental release workflows that needs adaptation for the monorepo context.

**Current Release Infrastructure:**
- Changesets for version management
- Turbo for build orchestration across packages
- constellation-tracker for dependency tracking (only runs for stable releases)
- GitHub Actions workflow (`release.yml`) publishes on main branch
- Each package has independent version in stable releases

**Key Constraint:** constellation-tracker should NOT run for beta or experimental releases (both are pre-releases, only stable releases should update the catalog).

**Bikeshed Reference Implementation:**
- Single package (simpler than monorepo)
- Beta scripts: `beta:start`, `beta:exit`, `beta:status`
- Three workflows: `release-beta.yml`, `publish-experimental.yml`, `experimental-age-tracker.yml`
- Proven patterns for branch naming, versioning, and age tracking

## Goals / Non-Goals

**Goals:**
- Enable beta release workflow for pre-stable validation in production-like environments
- Enable experimental release workflow for time-boxed (1-month) API exploration
- Adapt bikeshed workflows for monorepo context (multiple packages)
- Maintain existing stable release workflow unchanged
- Provide Core controls for beta lifecycle (start/exit)
- Automate age tracking for experimental branches

**Non-Goals:**
- Changing the stable release process or main branch workflow
- Supporting multiple concurrent beta series (only one at a time)
- Allowing experimental branches to merge to main (must reimplement)
- Creating new package management or build tooling (use existing turbo + changesets)
- Independent beta versions for each package based on changes

## Decisions

### Decision 1: Adapt Bikeshed Workflows with Monorepo-Specific Changes

**Choice:** Use bikeshed's three workflows as templates, modify for monorepo.

**Rationale:**
- Bikeshed implementation is proven and documented
- Workflows already handle changesets, age tracking, PR comments
- Adaptation points are clear: turbo cache, multiple package handling, `@accelint/*` scope

**Alternatives Considered:**
- Build from scratch: Higher risk, more time, reinventing solved problems
- Use external tool (e.g., Lerna prerelease): Doesn't fit our changesets setup

**Trade-off:** Some bikeshed patterns need adjustment (single package → multiple packages), but saves significant development time.

**Monorepo Adaptations Required:**
- Add turbo cache strategy to workflows (already in main release workflow)
- Quality checks use `pnpm run build` (runs turbo across all packages)
- PR comments list ALL published packages with install instructions
- Parse changeset output to capture which packages were published

### Decision 2: Branch-Based Workflow for Beta

**Choice:** Beta releases run on long-lived `beta/v<major>.<minor>` branches, not tags or changesets alone.

**Rationale:**
- Isolates beta work from main (allows parallel stable development)
- Makes promotion explicit (merge beta → main)
- Industry standard pattern (React and Next.js use similar branch-based approaches)
- Enables direct PRs for beta-specific fixes

**Alternatives Considered:**
- Tags only: No isolation, harder to iterate on beta
- Changesets prerelease mode on main: Pollutes main branch, risky

**Trade-off:** Requires branch management and eventual merge coordination, but provides safety and clarity.

**Implementation:** `beta/v1.0`, `beta/v2.0` pattern (major.minor, patch handled by beta.N iterations).

### Decision 3: Independent Package Versioning in Beta

**Choice:** Each package maintains its own version number in beta. Changesets determines which packages need beta versions based on changes.

**Rationale:**
- Matches stable release strategy (each package has independent version)
- Only changed packages get new beta versions
- Consumers can upgrade specific packages independently
- Reduces noise for packages that haven't changed

**Alternatives Considered:**
- Unified versioning (force all packages to same version): Doesn't match current workflow, creates unnecessary version bumps
- Manual version coordination: Error-prone, defeats purpose of changesets

**Trade-off:** Dependencies between beta packages need careful testing, but changesets handles this automatically.

**Example:**
- design-toolkit at `2.3.0` → `2.3.0-beta.1` (if changed)
- map-toolkit at `5.1.0` → `5.1.0-beta.1` (if changed)  
- core at `1.2.5` → stays at `1.2.5` (if unchanged)

**Branch naming:** `beta/vX.Y` is organizational (e.g., "Q2 2026 release cycle"), not prescriptive of version numbers.

### Decision 4: Experimental Branches Never Merge

**Choice:** Experimental branches use snapshot publishing (`changeset version --snapshot`) and are NEVER merged to main. Successful experiments are reimplemented with full quality bar.

**Rationale:**
- Prevents low-quality code from entering main
- Experimental is for API exploration, not production code
- Allows fast iteration without tests/docs/review burden
- 1-month time-box creates forcing function for decision

**Alternatives Considered:**
- Allow merge with lower quality bar: Pollutes main, reduces trust
- Require full quality bar for experimental: Defeats purpose (fast feedback)

**Trade-off:** Duplicate work if experiment succeeds, but this is intentional—experiments are sketches.

**Implementation:** Draft PR for tracking only, closed without merge. Fresh PR with full review if promoted.

### Decision 5: Manual Publish for Experimental

**Choice:** Experimental uses `workflow_dispatch` (manual trigger), not automatic publish on push.

**Rationale:**
- Reduces npm registry noise (contributors iterate before publishing)
- Gives control over when to publish (after basic testing)
- Prevents accidental publishes during rapid iteration

**Alternatives Considered:**
- Auto-publish on push: Too noisy, wastes npm resources
- Require PR approval first: Too heavyweight for experiments

**Trade-off:** Extra step for developers (must click "Run workflow"), but acceptable given experimental nature.

### Decision 6: constellation-tracker Integration

**Choice:** constellation-tracker does NOT run for beta or experimental releases.

**Rationale:**
- Both beta and experimental are pre-releases, not stable/production
- Catalog should only track stable releases that users should depend on
- Prevents pre-release noise in dependency tracking
- Simpler workflow - same approach for both channels

**Implementation:**
- Beta workflow: Call `changeset version` and `changeset publish` directly (skip the `changeset:version` script)
- Experimental workflow: Already uses `changeset version --snapshot` (bypasses script)

**Trade-off:** constellation-tracker won't see beta releases, but this is acceptable since they're not production-ready.

### Decision 7: npm Scripts for Beta Lifecycle

**Choice:** Add three convenience scripts to root package.json: `beta:start`, `beta:exit`, `beta:status`.

**Rationale:**
- Simplifies Core workflow (clear commands)
- Documents the beta process in code
- Matches bikeshed pattern (proven)
- Reduces risk of manual errors (e.g., wrong prerelease mode)

**Implementation:**
```json
"beta:start": "pnpm changeset pre enter beta",
"beta:exit": "pnpm changeset pre exit",
"beta:status": "test -f .changeset/pre.json && cat .changeset/pre.json || echo 'Not in prerelease mode'"
```

### Decision 8: Age Tracking via Daily Cron

**Choice:** `experimental-age-tracker.yml` runs daily (9 AM UTC) to check experimental PR age and update status comments.

**Rationale:**
- Prevents abandoned experiments from lingering
- Creates visibility and urgency (warnings at 14/21/28+ days)
- Automates governance (no manual tracking needed)

**Alternatives Considered:**
- Weekly tracking: Too infrequent, experiments linger too long
- Webhook-based (on push): Doesn't track inactivity

**Trade-off:** Requires cron maintenance, but very low overhead once configured.

**Implementation:** Parse publish date from PR comment, calculate age, update status comment with warning level.

## Workflow Details

### Beta Workflow (`release-beta.yml`)

**Trigger:** Push to `beta/**` branches

**Steps:**
1. Verify `.changeset/pre.json` exists and mode is "beta" (fail fast if not)
2. Setup: pnpm, Node, turbo cache
3. Install dependencies
4. Run quality checks: `pnpm run build` (turbo builds all packages)
5. Use changesets action with `changeset:version` and `changeset:release`
6. Publish with `@beta` tag

**Key Adaptations from bikeshed:**
- Add turbo cache step (from main release workflow)
- Use `pnpm run build` for monorepo (not `tsc`)
- Final step notes which packages were published (changesets determines this)
- Each package gets its own version number with `-beta.N` suffix

### Experimental Workflow (`publish-experimental.yml`)

**Trigger:** Manual `workflow_dispatch`

**Branch Restriction:** Only runs on `experimental/*` branches

**Steps:**
1. Extract feature name from branch (e.g., `experimental/dark-mode` → `dark-mode`)
2. Run quality checks: `pnpm run build` (fail fast if broken)
3. Version snapshot: `pnpm changeset version --snapshot <feature>`
4. Publish snapshot: `pnpm changeset publish --tag <feature>`
5. Find associated draft PR
6. Create/update PR comment with install instructions for ALL published packages

**Key Adaptations from bikeshed:**
- Capture multiple package versions (not just one)
- PR comment lists all `@accelint/*` packages published
- Install instructions show per-package commands

### Age Tracker Workflow (`experimental-age-tracker.yml`)

**Trigger:** Daily cron (9 AM UTC) + manual dispatch

**Steps:**
1. Find all open PRs from `experimental/*` branches
2. For each PR:
   - Read publish date from bot comment
   - Calculate age in days
   - Determine warning level (info/warning/urgent/overdue)
   - Create/update status comment

**Warning Levels:**
- Days 0-13: ℹ️ Active
- Days 14-20: ⏰ Approaching deadline
- Days 21-27: ⚠️ Urgent
- Days 28+: 🚨 Overdue - decide now

**Reusable from bikeshed** with package name updates (`@switzerb/bikeshed` → `@accelint/*`).

## Files to Create

### Workflows
1. `.github/workflows/release-beta.yml` - Beta release automation
2. `.github/workflows/publish-experimental.yml` - Experimental publish automation
3. `.github/workflows/experimental-age-tracker.yml` - Age tracking automation

### Documentation
4. `docs/BETA_RELEASE.md` - Beta workflow guide
5. `docs/EXPERIMENTAL_RELEASE.md` - Experimental workflow guide

### Optional
6. `.github/PULL_REQUEST_TEMPLATE/experimental.md` - Template for experimental PRs

### Scripts (modify)
7. Root `package.json` - Add `beta:start`, `beta:exit`, `beta:status` scripts

## Risks / Trade-offs

### Risk: Prerelease Mode Errors Hard to Recover

Changesets prerelease mode is stateful (`.changeset/pre.json`). Mistakes are hard to fix.

**Mitigation:**
- Beta runs on separate branch (main protected)
- Document recovery: delete beta branch and restart
- Verify prerelease mode in workflow (fail fast)
- Core controls start/exit (not automated)

### Risk: Multiple Packages Complicate Experimental Snapshots

Single experimental branch may publish 5-10 packages, overwhelming users.

**Mitigation:**
- Document guidance: experiments should be focused (1-3 packages max)
- PR comment clearly lists ALL affected packages
- Encourage small, targeted experiments

### Risk: Beta Branch Diverges from Main

Long-running beta branches accumulate merge conflicts.

**Mitigation:**
- Target beta duration: 1-2 weeks (time-boxed)
- Regular syncs from main to beta (developer responsibility)
- Core oversees beta progress and release
- Merge conflicts resolved during beta exit

### Risk: Age Tracker Date Parsing Failures

If comment format changes, age calculation breaks.

**Mitigation:**
- Use ISO date format consistently
- Test tracker with manually created comments first
- Graceful fallback if date unparseable (skip that PR)

### Risk: Consumer Confusion with Multiple Channels

Users might not understand beta vs experimental distinction.

**Mitigation:**
- Clear documentation with decision tree
- Different branch naming (`beta/` vs `experimental/`)
- Different version formats (`X.Y.Z-beta.N` vs `X.Y.Z-experimental-feature-timestamp`)
- Experimental draft PR template explains purpose

## Beta Exit and Promotion to Stable

**Sequence:**
1. On beta branch: `pnpm beta:exit` (exits prerelease mode, removes `-beta.N` suffix)
2. Commit `.changeset/pre.json` changes and push
3. Merge beta branch to main via PR
4. Main branch's existing `release.yml` workflow handles stable publish to npm with `@latest` tag

**Key principle:** Beta branch only publishes beta versions. Stable versions are ALWAYS published from main branch using the existing release workflow.

**Rationale:**
- Clear separation: beta branch = beta releases, main = stable releases
- Reuses existing stable release workflow (no duplication)
- Familiar process for team (main branch always has stable versions)

## Migration Plan

**Phase 1: Beta Implementation**
1. Create `release-beta.yml` workflow
2. Add beta scripts to root `package.json`
3. Create `docs/BETA_RELEASE.md`
4. Test on feature branch: create `beta/v10.0`, run through full cycle
5. Verify npm publish, version PR creation, beta exit and merge to main

**Phase 2: Experimental Implementation**
1. Create `publish-experimental.yml` workflow
2. Create `experimental-age-tracker.yml` workflow
3. Create `docs/EXPERIMENTAL_RELEASE.md`
4. Test on feature branch: create `experimental/test`, publish, verify age tracker
5. Verify PR comments, age warnings, cleanup

**Phase 3: Documentation & Rollout**
1. Update CONTRIBUTING.md with release channel overview
2. Update README.md with installation instructions
3. Core training session on beta lifecycle
4. Team training on experimental workflow

**Rollback Strategy:**
- Workflows have no destructive side effects (can be deleted safely)
- Beta branches can be deleted without affecting main
- Experimental branches never merge (no rollback needed)
- Published npm versions stay on registry (but tagged, not default)

## Additional Principles

### Beta Branch PRs

**Decision:** Beta branches accept direct PRs for beta-specific fixes.

**Rationale:** Provides flexibility for urgent fixes discovered during beta testing without requiring changes to land on main first. Main-first development is still encouraged for features, but beta-specific bug fixes can be committed directly to the beta branch.

### npm Dist-Tags

**Decision:** Use `@beta` tag for beta releases, `@<feature-name>` tag for experimental releases.

**Examples:**
- Beta: `npm install @accelint/design-toolkit@beta`
- Experimental: `npm install @accelint/design-toolkit@dark-mode`

**Rationale:** Clear naming that matches user expectations and industry conventions.

### Experimental Branch Requirements

**Decision:** No issue or RFC required to start an experimental branch.

**Rationale:** Keep barrier low to encourage exploration. Larger experiments should document intent for team visibility, but this is encouraged, not required.

### Concurrent Experimental Limits

**Decision:** No hard limit on concurrent experimental branches.

**Rationale:** Trust team judgment and use social coordination. If more than 5 experiments are active simultaneously, team should discuss priorities, but no enforcement mechanism needed. Experimental branches are expected to be rare.

---

**Design Status:** Ready for implementation. All key decisions documented with rationale.
