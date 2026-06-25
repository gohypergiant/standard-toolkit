# Proposal: Beta and Experimental Release Workflows

## Overview

Introduce formal release workflows for beta (pre-stable release candidates) and experimental (time-boxed API sketches) packages in the standard-toolkit monorepo. This creates two parallel release tracks alongside stable releases, each with distinct quality bars, versioning schemes, and workflows.

## Motivation

Currently, standard-toolkit only supports stable releases through the main branch. This creates friction for:

- **Beta releases**: Teams need to validate release candidates in production before promoting to stable, but have no formal workflow for versioning, publishing, and tracking beta builds.
- **API exploration**: New features require full quality bar (tests, docs, reviews) before merging to main, slowing down experimentation and making it costly to abandon ideas that don't work out.
- **Monorepo coordination**: All 20+ packages in the @accelint scope must be versioned together, but there's no mechanism for coordinated pre-releases.

Other successful monorepos (React, Next.js) provide experimental builds for early feedback and beta channels for stabilization. Standard-toolkit needs the same.

## Requirements

### Beta Releases

**Definition**: Release Candidate builds on the path to stable. Part of the version lineage (v1.0.0-beta.1 → v1.0.0).

**Quality Bar**:
- Full test coverage
- Complete documentation
- TSC review and approval
- All verification gates pass (build, test, lint, format)

**Versioning**:
- Format: `X.Y.Z-beta.N` (e.g., `2.3.0-beta.1`, `5.1.0-beta.2`)
- Only one active beta series at a time (e.g., beta/v1.0)
- Each package maintains its own version (only changed packages get new beta versions)

**Workflow**:
1. TSC approves starting a beta series
2. Create `beta/vX.Y` branch from main
3. Automated workflow versions and publishes beta builds on push
4. Team validates in production, files issues/PRs against beta branch
5. When stable, TSC approves exit: run `pnpm beta:exit` on beta branch
6. Merge beta branch to main via PR
7. Main branch's existing release workflow publishes stable versions to npm

**Lifecycle**:
- Branch naming: `beta/v<major>.<minor>` (e.g., `beta/v1.0`)
- Status tracking: `beta:status` command shows if in prerelease mode
- Merge strategy: Fast-forward merge to main when promoting to stable

### Experimental Releases

**Definition**: Time-boxed (1 month) API sketch builds. NOT part of version lineage. Never merges to main.

**Quality Bar**:
- Build succeeds
- Types pass
- Lint passes
- No tests, docs, or review required

**Versioning**:
- Format: `X.Y.Z-experimental-<feature>-<timestamp>` (e.g., `9.12.0-experimental-new-api-20260507`)
- Version signals "not production ready"
- Feature name embedded in version tag

**Workflow**:
1. Create `experimental/<feature>` branch from main
2. Implement minimal API sketch
3. Manual publish via workflow dispatch
4. Create draft PR for tracking (never merged)
5. Automated workflow tracks age daily, warns at 2 weeks, escalates to urgent at 3 weeks, overdue at 1 month
6. If successful, reimplement properly on main with full quality bar
7. Branch deleted after reimplement or abandonment

**Lifecycle**:
- Branch naming: `experimental/<feature>` (e.g., `experimental/new-api`)
- Age tracking: Daily cron job checks branch age, warnings at 14/21/28+ days
- Cleanup: Manual deletion after reimplement or abandon decision

## User-Facing API

### Beta Workflow Commands

```bash
# Start a beta series (TSC only)
pnpm beta:start v1.0

# Check beta status
pnpm beta:status
# Output (if in prerelease mode):
# {
#   "mode": "pre",
#   "tag": "beta",
#   "initialVersions": { ... },
#   "changesets": [ ... ]
# }
# Or: "Not in prerelease mode"

# Exit beta and promote to stable (TSC only)
pnpm beta:exit
```

### Experimental Workflow

```bash
# Create experimental branch (any contributor)
git checkout -b experimental/new-feature

# Publish experimental build (manual dispatch via GitHub Actions UI)
# Workflow: publish-experimental.yml

# Check age warnings (automated daily cron)
# Workflow: experimental-age-tracker.yml
```

### GitHub Workflows

**New workflows**:
- `.github/workflows/release-beta.yml`: Triggered on push to `beta/**` branches
- `.github/workflows/publish-experimental.yml`: Manual dispatch for experimental publishes
- `.github/workflows/experimental-age-tracker.yml`: Daily cron to check experimental branch age

**Existing workflows**:
- `.github/workflows/changeset-release.yml`: Unchanged (stable releases only)

## Architecture

### Key Design Decisions

**Decision 1: Independent versioning for beta**

Each package maintains its own version number in beta. Changesets determines which packages need new beta versions based on changes.

**Why**: Matches stable release strategy (independent versions), only changed packages get new versions, reduces noise.

**Trade-off**: Consumers need to know which packages changed, but this matches the current workflow and provides clearer upgrade signals.

**Decision 2: Branch-based workflow for beta**

Beta builds live on long-lived `beta/vX.Y` branches rather than using changesets alone.

**Why**: Isolates beta work from main, allows parallel stable development, makes promotion explicit (merge to main), matches industry patterns (React, Next.js).

**Trade-off**: Requires branch management and merge coordination, but this is acceptable for the quality bar.

**Decision 3: No merge for experimental**

Experimental branches never merge to main. Successful experiments are reimplemented with full quality bar.

**Why**: Prevents low-quality code from entering main, allows faster iteration, maintains high standards for production code.

**Trade-off**: Duplicate work if experiment succeeds, but this is intentional (experiments are sketches, not production code).

**Decision 4: Automated age tracking for experimental**

Daily cron job checks experimental branch age with escalating warnings: starts at 2 weeks (approaching deadline), urgent at 3 weeks, overdue at 1 month.

**Why**: Prevents abandoned experiments from lingering, maintains repository hygiene, creates forcing function for decision-making. Early warnings give teams time to plan next steps.

**Trade-off**: Requires automation setup, but low maintenance once configured.

**Decision 5: Manual publish for experimental**

Experimental builds use manual workflow dispatch rather than automatic publish on push.

**Why**: Reduces npm noise, gives control over when to publish, prevents accidental publishes during iteration.

**Trade-off**: Extra step for developers, but acceptable given experimental nature.

## Integration with Existing Systems

### Changesets

**Beta releases**:
- Beta branches use changesets normally
- Workflow calls `changeset version` directly (not npm script)
- constellation-tracker does NOT run (beta is pre-release)
- Pre-release mode enabled: versions become `X.Y.Z-beta.N`

**Experimental releases**:
- No changesets required
- Version based on current main version: `X.Y.Z-experimental-<feature>-<timestamp>`
- constellation-tracker does NOT run (experimental is temporary)

### Turbo

- All verification gates (build, test, lint, format) run for both beta and experimental
- Beta requires all gates to pass
- Experimental only requires build, lint (tests optional)

### GitHub Actions

**New automation**:
- Beta publish workflow (on push to beta branches)
- Experimental publish workflow (manual dispatch)
- Experimental age tracker (daily cron)

**Secrets required**:
- `NPM_TOKEN`: For publishing to npm (already exists)
- `GITHUB_TOKEN`: For PR operations (provided by GitHub)

## Success Criteria

### Functional Requirements

- Beta workflow creates and publishes versioned pre-release builds
- Experimental workflow publishes tagged builds without changesets
- Age tracking warns about stale experimental branches
- Beta status command shows current beta state
- Beta exit merges to main and publishes stable versions

### Non-Functional Requirements

- Beta workflow completes within 5 minutes
- Experimental workflow completes within 3 minutes
- Age tracker runs daily without manual intervention
- No breaking changes to existing stable release workflow
- Documentation covers both workflows with examples

### User Experience

- Clear distinction between beta (high quality, pre-stable) and experimental (low quality, time-boxed)
- TSC controls beta lifecycle (start, exit)
- Any contributor can create experimental branches
- Automated warnings prevent abandoned experiments
- Version numbers clearly signal stability level

## Risks & Mitigations

### Risk: Confusion between beta and experimental

Users might not understand the difference or use the wrong workflow.

**Mitigation**:
- Clear documentation with decision tree (when to use which)
- Different branch naming conventions (`beta/` vs `experimental/`)
- Different version formats (`X.Y.Z-beta.N` vs `X.Y.Z-experimental-feature-timestamp`)
- Draft PR template for experimental branches explains purpose

### Risk: Beta branches diverge from main

Long-running beta branches could accumulate merge conflicts with main.

**Mitigation**:
- Beta series are time-sensitive (target: no more than 2-4 weeks ideally)
- Regular merges from main to beta branch (developer responsibility)
- Beta exit includes merge conflict resolution

### Risk: Experimental branches pile up

Contributors might create many experimental branches and forget to clean them up.

**Mitigation**:
- Automated age tracking with warnings
- Monthly review of open experimental branches
- Clear documentation on cleanup expectations
- Branch protection rules prevent accidental merges

### Risk: npm registry pollution

Publishing many beta and experimental versions could clutter the npm registry.

**Mitigation**:
- Beta versions use standard pre-release tags (filtered by default in npm)
- Experimental versions use `-experimental-` prefix (clearly not production)
- Consider npm dist-tags for better organization
- Documentation on how to install specific versions

### Risk: Breaking changes in beta

Beta builds might introduce breaking changes that affect early adopters.

**Mitigation**:
- Beta is still pre-1.0 or pre-next-major (semver allows breaking changes)
- Clear documentation that beta is "use at own risk"
- Changelog documents all changes between beta versions
- TSC reviews breaking changes before beta exit

## Governance

### Beta Branch Management

- **Beta PRs:** Beta branches accept direct PRs for beta-specific fixes. Main-first development encouraged for features, but urgent beta fixes can be committed directly.
- **Dependencies:** Changesets automatically handles internal dependency updates when packages have interdependencies.
- **TSC Controls:** TSC approves beta start (`pnpm beta:start`) and beta exit (`pnpm beta:exit`).

### Experimental Branch Management

- **No RFC Required:** Experimental branches don't require issues or RFCs. Encouraged for larger experiments but not mandatory.
- **No Hard Limits:** No limit on concurrent experimental branches. Team should discuss if >5 active, but no enforcement.
- **Expected Rarity:** Experimental branches are expected to be rare - most work should target main directly.

### npm Dist-Tags

- **Beta:** Published with `@beta` tag (e.g., `npm install @accelint/design-toolkit@beta`)
- **Experimental:** Published with feature-specific tags (e.g., `npm install @accelint/design-toolkit@dark-mode`)

## Next Steps

1. Create detailed design document with implementation decisions
2. Write specifications for each workflow component
3. Break down implementation into tasks
4. Implement beta workflow first (higher priority)
5. Implement experimental workflow second
6. Document workflows with examples
7. Train team on new processes

---

**Estimated complexity:** Medium-High
**Estimated effort:** 5-7 days
**Priority:** High (unblocks beta releases for production validation)
