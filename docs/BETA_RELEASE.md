# Beta Release Workflow

## Overview

Beta releases are **pre-stable release candidates** on the path to becoming stable versions. They represent feature-complete code that needs production validation before being promoted to `@latest`.

**Quality Bar:** Full (tests, docs, review, verification gates)  
**Version Format:** `X.Y.Z-beta.N` (e.g., `9.11.0-beta.1`)  
**npm Dist-Tag:** `@beta`  
**Branch Pattern:** `beta/v<major>.<minor>`

## When to Use Beta

Use beta releases when:
- You need to validate a release candidate in production-like environments
- Features are complete but need real-world testing before stable release
- You want early adopters to test breaking changes
- You need a coordinated pre-release across multiple packages in the monorepo

**Do NOT use beta for:**
- API exploration or experiments (use experimental releases instead)
- Incomplete features or work-in-progress
- Code without full test coverage and documentation

## TSC Runbook

### Starting a Beta Series

**Prerequisites:**
- Features are complete on `main` branch
- All tests pass, documentation complete
- TSC approval obtained

**Steps:**

1. **Create beta branch from main:**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b beta/v10.0
   ```

2. **Enter prerelease mode:**
   ```bash
   pnpm beta:start
   ```
   This creates `.changeset/pre.json` with mode "beta".

3. **Verify prerelease mode:**
   ```bash
   pnpm beta:status
   ```
   Should show `"mode": "pre"` and `"tag": "beta"`.

4. **Commit and push:**
   ```bash
   git add .changeset/pre.json
   git commit -m "chore: enter beta prerelease mode"
   git push origin beta/v10.0
   ```

5. **GitHub Actions automatically:**
   - Verifies prerelease mode
   - Runs quality checks (`pnpm run build`)
   - Creates version PR with beta versions
   - Publishes to npm with `@beta` tag after PR merge

### Iterating on Beta

**Making Changes:**

Beta branches accept direct PRs for beta-specific fixes, though main-first development is encouraged for features.

```bash
# On beta branch
git checkout beta/v10.0
# Make changes
git add .
git commit -m "fix: beta-specific issue"
git push origin beta/v10.0
```

The workflow automatically:
- Increments beta suffix (e.g., `9.11.0-beta.1` → `9.11.0-beta.2`)
- Only versions changed packages (independent versioning)
- Publishes updated packages with `@beta` tag

**Syncing from Main:**

If main branch has critical fixes, merge them into beta:

```bash
git checkout beta/v10.0
git merge main
git push origin beta/v10.0
```

### Exiting Beta and Promoting to Stable

**When to Exit:**
- Beta validation complete
- No critical issues remain
- Ready for stable release
- TSC approval obtained

**Exit Sequence:**

1. **On beta branch, exit prerelease mode:**
   ```bash
   git checkout beta/v10.0
   pnpm beta:exit
   ```
   This sets `.changeset/pre.json` mode to "exit".

2. **Commit the exit:**
   ```bash
   git add .changeset/pre.json
   git commit -m "chore: exit beta prerelease mode"
   git push origin beta/v10.0
   ```

3. **Wait for version PR to be created and merged:**
   The beta workflow will create a final version PR that removes `-beta.N` suffixes.

4. **After the version PR merges, merge beta branch to main:**
   ```bash
   git checkout main
   git pull origin main
   git merge beta/v10.0
   git push origin main
   ```

5. **Main branch's release workflow publishes stable versions:**
   The existing `.github/workflows/release.yml` automatically publishes packages with `@latest` tag.

6. **Clean up:**
   ```bash
   git branch -d beta/v10.0
   git push origin --delete beta/v10.0
   ```

**IMPORTANT:** Stable versions are ALWAYS published from the `main` branch. Beta branch only publishes beta versions.

## Version Behavior

### Independent Package Versioning

Each package maintains its own version. Only changed packages get beta versions.

**Example:**
- Before: `@accelint/design-toolkit@9.11.0`, `@accelint/core@0.6.0`
- Change design-toolkit only
- After: `@accelint/design-toolkit@9.11.0-beta.1`, `@accelint/core@0.6.0` (unchanged)

### Version Increments

Changesets determines the bump type (major/minor/patch) based on changeset files:

```bash
# Create a changeset on beta branch
pnpm changeset
# Follow prompts to document changes
```

Beta iterations increment the beta suffix:
- `9.11.0-beta.1` → `9.11.0-beta.2` → `9.11.0-beta.3`

On beta exit, the `-beta.N` suffix is removed:
- `9.11.0-beta.3` → `9.11.0` (when merged to main)

## Installation

**Install latest beta version:**
```bash
npm install @accelint/design-toolkit@beta
```

**Install specific beta version:**
```bash
npm install @accelint/design-toolkit@9.11.0-beta.2
```

**Check available beta versions:**
```bash
npm view @accelint/design-toolkit versions --tag beta
```

## Dependencies

Changesets automatically handles internal dependencies:
- If package A depends on package B
- Both get beta versions when B changes
- Version ranges updated automatically

No manual coordination needed.

## Beta Direct PRs

Beta branches can receive direct pull requests for fixes discovered during beta testing:

```bash
# Create fix branch from beta
git checkout beta/v10.0
git checkout -b fix-beta-issue
# Make changes
git push origin fix-beta-issue
# Open PR against beta/v10.0 (not main)
```

Main-first development is still encouraged for features, but urgent beta fixes can land directly on the beta branch.

## Workflow Details

### GitHub Workflow: `.github/workflows/release-beta.yml`

**Trigger:** Push to `beta/**` branches

**Steps:**
1. Verify `.changeset/pre.json` exists with mode "beta"
2. Run quality checks: `pnpm run build`
3. Version packages: `pnpm changeset version` (direct call, skips constellation-tracker)
4. Publish packages: `pnpm changeset publish --tag beta`

**Fails if:**
- `.changeset/pre.json` missing (run `pnpm beta:start`)
- Prerelease mode is not "beta"
- Build fails
- Tests fail

### constellation-tracker Integration

**Beta releases do NOT trigger constellation-tracker** because:
- Beta is a pre-release, not production-ready
- Catalog should only track stable `@latest` versions
- Prevents pre-release noise in dependency tracking

The beta workflow calls `changeset version` directly instead of using the `changeset:version` npm script (which includes constellation-tracker).

## Troubleshooting

### "Error: .changeset/pre.json not found"

Run `pnpm beta:start` on your beta branch to enter prerelease mode.

### "Prerelease mode is 'exit', expected 'pre'"

You've already exited beta mode. Either:
- Merge beta to main to complete promotion
- Re-enter beta mode with `pnpm beta:start` for more iterations

### Beta versions not incrementing

Ensure you have changeset files documenting changes:
```bash
pnpm changeset
```

### Wrong packages getting versioned

Changesets only versions packages with:
- Changeset files describing changes
- Or dependencies on changed packages (automatic)

Review your changeset files in `.changeset/`.

## npm Dist-Tags

Beta packages use the `@beta` dist-tag:

```bash
# List all tags for a package
npm dist-tag ls @accelint/design-toolkit

# Example output:
# latest: 9.10.0
# beta: 9.11.0-beta.2
```

The `@latest` tag always points to the most recent stable version.

## Best Practices

1. **Time-box beta cycles:** Target 1-2 weeks for validation
2. **Communicate clearly:** Announce beta releases to early adopters
3. **Document changes:** Use changeset files to explain what changed and why
4. **Monitor feedback:** Track issues and PRs against beta branch
5. **Test thoroughly:** Beta is the last gate before stable - validate in production-like environments
6. **Sync regularly:** Merge main into beta to stay current with critical fixes
7. **Exit decisively:** When validation complete, exit and merge to main promptly

## See Also

- [Experimental Release Workflow](./EXPERIMENTAL_RELEASE.md) - For API exploration
- [Changesets Documentation](https://github.com/changesets/changesets) - Version management
- [npm Dist-Tags](https://docs.npmjs.com/cli/v9/commands/npm-dist-tag) - Tag management
