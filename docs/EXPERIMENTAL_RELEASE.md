# Experimental Release Workflow

## Overview

Experimental releases are **time-boxed API sketches** for rapid feedback and iteration. They are NOT part of the version lineage and NEVER merge to main.

**Quality Bar:** Minimal (build + types + lint only)  
**Version Format:** `X.Y.Z-experimental-<feature>-<timestamp>`  
**npm Dist-Tag:** `@<feature-name>`  
**Branch Pattern:** `experimental/<feature-name>`  
**Time-Box:** 1 month maximum

## When to Use Experimental

Use experimental releases when:
- Exploring new API designs or patterns
- Need rapid feedback without full implementation
- Want to validate concepts before investing in full quality bar
- Testing breaking changes or radical redesigns

**Do NOT use experimental for:**
- Pre-stable release candidates (use beta instead)
- Production-ready code (target main directly)
- Long-term feature development (use feature branches + main)

## Experimental Workflow

### 1. Create Experimental Branch

```bash
git checkout main
git pull origin main
git checkout -b experimental/dark-mode
```

Branch naming: `experimental/<feature-name>` (lowercase, hyphens)

### 2. Implement Minimal API Sketch

Focus on:
- ✅ Core API surface (types, interfaces, key functions)
- ✅ Enough implementation to be testable
- ❌ **NOT required:** Tests, documentation, full implementation

**Quality Gates (must pass):**
- Build succeeds (`pnpm run build`)
- Types pass (no TypeScript errors)
- Lint passes (`pnpm run lint`)

**Not Required:**
- Test coverage
- Documentation
- Code review

### 3. Open Draft PR

Open a draft PR against `main` for tracking only:

```bash
git push origin experimental/dark-mode
# Open draft PR on GitHub
```

**IMPORTANT:** This PR will NEVER merge. It's for tracking and discussion only.

### 4. Publish Experimental Snapshot

**Manual trigger via GitHub Actions UI:**

1. Go to Actions → "Publish Experimental Snapshot"
2. Click "Run workflow"
3. Select your `experimental/<feature>` branch
4. Click "Run workflow"

The workflow will:
- Extract feature name from branch (`experimental/dark-mode` → `dark-mode`)
- Run quality checks (build + types + lint)
- Version packages with snapshot: `9.11.0-experimental-dark-mode-<timestamp>`
- Publish to npm with `@dark-mode` tag
- Create/update PR comment with install instructions

**PR Comment Example:**

```markdown
## 🧪 Experimental Snapshot Published

**Feature:** `dark-mode`
**Published:** 2026-05-07

### Published Packages
- `@accelint/design-toolkit@9.11.0-experimental-dark-mode-20260507120000`
- `@accelint/design-foundation@3.2.0-experimental-dark-mode-20260507120000`

### Installation
npm install @accelint/design-toolkit@dark-mode
npm install @accelint/design-foundation@dark-mode

### ⚠️ Experimental Warning
This is an experimental build for testing and feedback only...
```

### 5. Gather Feedback

Share the `@<feature-name>` tag with stakeholders:

```bash
npm install @accelint/design-toolkit@dark-mode
```

**Age Tracking:** Automated workflow runs daily to track experiment age:
- Days 0-13: ℹ️ **Active** - Continue testing
- Days 14-20: ⏰ **Approaching deadline** - Begin decision process
- Days 21-27: ⚠️ **Urgent** - Make decision soon
- Days 28+: 🚨 **Overdue** - Must decide now

### 6. Decision Time

After validation (max 1 month), choose one:

#### Option A: Promote (Experiment Succeeded)

**DO NOT merge the experimental PR.** Instead:

1. Close the experimental PR
2. Delete experimental branch
3. Reimplement with full quality bar on a fresh branch:
   ```bash
   git checkout main
   git checkout -b feat/dark-mode
   # Reimplement with tests + docs + review
   ```
4. Open fresh PR to main with full code review

**Why reimplement?** Experimental code lacks tests, docs, and review. Production code requires all of these.

#### Option B: Abandon (Experiment Failed)

1. Close the experimental PR
2. Delete experimental branch
3. Document lessons learned in PR comments or team notes

```bash
git branch -D experimental/dark-mode
git push origin --delete experimental/dark-mode
```

## Key Principles

### Never Merge to Main

Experimental branches NEVER merge to main. Successful experiments are reimplemented with full quality bar.

**Why?**
- Maintains high standards for production code
- Prevents low-quality code from entering main
- Forces intentional decision about what to keep
- Allows fast iteration without review burden

### Time-Box: 1 Month Maximum

Experiments must conclude within 28 days:
- Forces decision-making
- Prevents abandoned experiments from lingering
- Maintains repository hygiene
- Creates urgency for feedback

Automated age tracker warns at 2, 3, and 4 weeks.

### No Changesets Required

Experimental publishes use snapshot versioning (`changeset version --snapshot`):
- No `.changeset/*.md` files needed
- Version based on current main + timestamp
- Not part of package version history

### Focused Experiments (1-3 Packages)

Keep experiments focused:
- ✅ **Good:** `experimental/dark-mode` affecting 2-3 UI packages
- ❌ **Bad:** `experimental/rewrite-everything` affecting 15 packages

Large-scale changes should target main directly with proper planning.

## Installation

**Install latest experimental version:**
```bash
npm install @accelint/design-toolkit@dark-mode
```

**Check available experimental versions:**
```bash
npm view @accelint/design-toolkit versions | grep experimental-dark-mode
```

## Version Format

```
<base-version>-experimental-<feature>-<timestamp>

Example: 9.11.0-experimental-dark-mode-20260507120000
```

- `base-version`: Current main branch version
- `feature`: Extracted from branch name
- `timestamp`: Publication time (YYYYMMDDHHmmss)

Each publish gets a unique timestamp, allowing multiple iterations.

## npm Dist-Tags

Experimental packages use feature-specific tags:

```bash
# List all tags
npm dist-tag ls @accelint/design-toolkit

# Example output:
# latest: 9.11.0
# beta: 9.11.0-beta.2
# dark-mode: 9.11.0-experimental-dark-mode-20260507120000
```

## Age Tracker Details

**Workflow:** `.github/workflows/experimental-age-tracker.yml`

**Schedule:** Daily at 9 AM UTC (also manual dispatch)

**Process:**
1. Finds all open PRs from `experimental/*` branches
2. Extracts publish date from bot comment
3. Calculates age in days
4. Determines warning level
5. Creates/updates "📊 Experiment Status" comment

**Status Comment Example:**

```markdown
## 📊 Experiment Status

**Status:** ⏰ Approaching deadline
**Started:** 2026-05-07
**Age:** 17 days
**Deadline:** 2026-06-04

### Next Steps
Deadline approaching in 11 days.

- Begin decision process: promote or abandon?
- If promoting, plan full implementation with tests and docs
- If abandoning, document lessons learned

---
*Last updated: Wed, 24 May 2026 09:00:00 GMT*
```

## No RFC Required

Experimental branches don't require issues or RFCs:
- Lightweight process for exploration
- Document intent in PR description (encouraged but not required)
- Larger experiments should explain goals for team visibility

## No Concurrent Limits

No hard limit on active experimental branches:
- Trust team judgment
- If >5 active, discuss priorities
- Expected to be rare (most work targets main)

## Workflow Details

### GitHub Workflow: `.github/workflows/publish-experimental.yml`

**Trigger:** Manual workflow dispatch only

**Branch Restriction:** Only runs on `experimental/*` branches

**Steps:**
1. Verify branch matches `experimental/*` pattern
2. Extract feature name from branch
3. Run quality checks: `pnpm run build`
4. Version snapshot: `pnpm changeset version --snapshot <feature>`
5. Publish snapshot: `pnpm changeset publish --tag <feature>`
6. Parse published packages from changeset output
7. Find associated draft PR
8. Create/update PR comment with install instructions

### constellation-tracker Integration

Experimental releases do NOT trigger constellation-tracker:
- Experiments are temporary, not production-ready
- Catalog should only track stable versions
- Prevents noise from short-lived experiments

## Troubleshooting

### "Error: This workflow only runs on experimental/* branches"

Ensure your branch name starts with `experimental/`:
```bash
git checkout -b experimental/my-feature
```

### "Build failed" during publish

Fix the build errors first. Experimental still requires:
- Successful build
- No TypeScript errors
- Lint passing

Tests and docs are optional, but the code must compile.

### PR comment not appearing

Check that:
- You opened a PR from the experimental branch
- The PR is open (not closed)
- GitHub Actions has PR write permissions

Trigger the workflow manually to retry.

### Cannot install experimental version

Verify the tag exists:
```bash
npm dist-tag ls @accelint/design-toolkit
```

If missing, republish via GitHub Actions workflow.

## Best Practices

1. **Start small:** Focus on 1-3 packages for targeted feedback
2. **Document intent:** Explain what you're exploring in PR description
3. **Gather feedback early:** Publish within first week, don't wait
4. **Decide within time-box:** 1 month maximum, don't let it linger
5. **Communicate status:** Update PR with findings as you learn
6. **Close decisively:** Promote with full quality bar or abandon and document why
7. **No merge temptation:** Experimental branches never merge - resist shortcuts

## Example Timeline

**Week 1:** Create branch, implement minimal API, publish snapshot
**Week 2:** Gather feedback, iterate based on findings
**Week 3:** Decision checkpoint - trending toward success or abandon?
**Week 4:** Final decision - promote (reimplement) or abandon (document)

## See Also

- [Beta Release Workflow](./BETA_RELEASE.md) - For pre-stable release candidates
- [Changesets Snapshot Versioning](https://github.com/changesets/changesets/blob/main/docs/snapshot-releases.md)
- [npm Dist-Tags](https://docs.npmjs.com/cli/v9/commands/npm-dist-tag)
