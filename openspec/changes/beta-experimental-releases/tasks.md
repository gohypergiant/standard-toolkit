# Implementation Tasks: Beta and Experimental Releases

## 1. Beta Workflow - Core Setup

**Deliverable:** Beta scripts functional, can enter/exit prerelease mode locally

- [ ] 1.1 Add beta lifecycle scripts to root package.json (`beta:start`, `beta:exit`, `beta:status`)
- [ ] 1.2 Test `pnpm beta:start` creates `.changeset/pre.json` with mode "beta"
- [ ] 1.3 Test `pnpm beta:status` outputs prerelease JSON when in beta mode
- [ ] 1.4 Test `pnpm beta:exit` removes prerelease mode
- [ ] 1.5 Test `pnpm beta:status` outputs "Not in prerelease mode" when not in beta

**Test:** Manually run full beta lifecycle locally (start → status → exit) and verify output

## 2. Beta Workflow - GitHub Actions

**Deliverable:** Beta workflow publishes packages with @beta tag when pushed to beta branches

- [ ] 2.1 Create `.github/workflows/release-beta.yml` based on bikeshed template
- [ ] 2.2 Configure workflow trigger on `beta/**` branch pattern
- [ ] 2.3 Add turbo cache strategy step (copy from existing release.yml)
- [ ] 2.4 Add prerelease mode verification step (check `.changeset/pre.json` exists and mode is "beta")
- [ ] 2.5 Configure quality checks to run `pnpm run build`
- [ ] 2.6 Configure changesets action to call `changeset version` directly (NOT npm script to skip constellation-tracker)
- [ ] 2.7 Configure changesets action to call `changeset publish` with `@beta` tag
- [ ] 2.8 Add final step showing which packages were published

**Test:** Create test beta branch `beta/v10.0`, run `pnpm beta:start`, push, verify workflow runs and creates version PR

## 3. Beta Workflow - End-to-End Validation

**Deliverable:** Complete beta cycle works from start to stable promotion

- [ ] 3.1 Create test beta branch and enter prerelease mode
- [ ] 3.2 Make changes to 1-2 test packages
- [ ] 3.3 Push to trigger workflow and verify version PR created with beta versions
- [ ] 3.4 Merge version PR and verify packages published to npm with `@beta` tag
- [ ] 3.5 Verify `npm install @accelint/<package>@beta` installs beta version
- [ ] 3.6 Make additional changes and verify beta.2 versions created
- [ ] 3.7 Run `pnpm beta:exit` and verify prerelease mode removed
- [ ] 3.8 Merge beta branch to main and verify stable versions published by main workflow
- [ ] 3.9 Delete test beta branch

**Test:** Full beta cycle from creation to stable promotion verified on npm registry

## 4. Experimental Workflow - Publish Automation

**Deliverable:** Manual trigger publishes experimental snapshots with feature-specific tags

- [ ] 4.1 Create `.github/workflows/publish-experimental.yml` based on bikeshed template
- [ ] 4.2 Configure workflow with `workflow_dispatch` trigger (manual only)
- [ ] 4.3 Add branch restriction to only run on `experimental/*` branches
- [ ] 4.4 Add feature name extraction step (from `experimental/<feature>` → `<feature>`)
- [ ] 4.5 Add quality checks step running `pnpm run build`
- [ ] 4.6 Add snapshot version step: `changeset version --snapshot <feature>`
- [ ] 4.7 Add snapshot publish step: `changeset publish --tag <feature>`
- [ ] 4.8 Capture which packages were published (parse changeset output)

**Test:** Create test experimental branch, manually trigger workflow, verify snapshot version generated

## 5. Experimental Workflow - PR Comments

**Deliverable:** Workflow creates/updates PR comments with install instructions for all published packages

- [ ] 5.1 Add PR discovery step (find open PR for current experimental branch)
- [ ] 5.2 Add step to check for existing "🧪 Experimental Snapshot Published" comment
- [ ] 5.3 Generate comment body with: package names, versions, publish date, install instructions
- [ ] 5.4 List ALL published packages in comment (handle monorepo multi-package case)
- [ ] 5.5 Add experimental warning text to comment
- [ ] 5.6 Create new comment if none exists, update existing if found
- [ ] 5.7 Include "Last published" timestamp in comment

**Test:** Trigger experimental publish, verify PR comment created with correct format and all packages listed

## 6. Experimental Workflow - End-to-End Validation

**Deliverable:** Complete experimental flow works from publish to installation

- [ ] 6.1 Create test experimental branch `experimental/test-feature`
- [ ] 6.2 Make changes to 1-2 test packages
- [ ] 6.3 Open draft PR against main
- [ ] 6.4 Manually trigger publish workflow from GitHub Actions UI
- [ ] 6.5 Verify workflow completes and packages published with feature tag
- [ ] 6.6 Verify PR comment created with install instructions
- [ ] 6.7 Verify `npm install @accelint/<package>@test-feature` installs experimental version
- [ ] 6.8 Make additional changes, republish, verify comment updated with new version
- [ ] 6.9 Close PR and delete experimental branch

**Test:** Full experimental cycle verified including npm installation with feature tag

## 7. Age Tracking - Automation Setup

**Deliverable:** Daily cron workflow tracks experimental PR age and creates status comments

- [ ] 7.1 Create `.github/workflows/experimental-age-tracker.yml` based on bikeshed template
- [ ] 7.2 Configure cron trigger for daily 9 AM UTC
- [ ] 7.3 Add manual `workflow_dispatch` trigger for testing
- [ ] 7.4 Add step to find all open PRs from `experimental/*` branches
- [ ] 7.5 Add logic to find "🧪 Experimental Snapshot Published" comment
- [ ] 7.6 Add date parsing to extract publish date from comment
- [ ] 7.7 Add age calculation logic (current date - publish date in days)
- [ ] 7.8 Add warning level assignment (0-13: Active, 14-20: Approaching, 21-27: Urgent, 28+: Overdue)
- [ ] 7.9 Add deadline calculation (publish date + 28 days)

**Test:** Manually trigger age tracker, verify it finds experimental PRs

## 8. Age Tracking - Status Comments

**Deliverable:** Age tracker creates/updates status comments with escalating warnings

- [ ] 8.1 Add logic to check for existing "📊 Experiment Status" comment
- [ ] 8.2 Generate status comment body with: emoji, status, started date, age, deadline
- [ ] 8.3 Add "Next Steps" section with guidance based on warning level
- [ ] 8.4 Add different next steps for active (days remaining) vs overdue (must decide)
- [ ] 8.5 Add "Last updated" timestamp to comment footer
- [ ] 8.6 Create new status comment if none exists
- [ ] 8.7 Update existing status comment if found
- [ ] 8.8 Handle errors gracefully (skip PR if date unparseable, continue to next)

**Test:** Manually create test experimental PR with backdated publish comment, trigger age tracker, verify status comment created with correct warning level

## 9. Age Tracking - End-to-End Validation

**Deliverable:** Age tracking works across full lifecycle with escalating warnings

- [ ] 9.1 Create experimental PR with publish comment dated 10 days ago
- [ ] 9.2 Manually trigger age tracker, verify "ℹ️ Active" status
- [ ] 9.3 Update publish date to 16 days ago, trigger tracker, verify "⏰ Approaching deadline"
- [ ] 9.4 Update publish date to 24 days ago, trigger tracker, verify "⚠️ Urgent"
- [ ] 9.5 Update publish date to 30 days ago, trigger tracker, verify "🚨 Overdue"
- [ ] 9.6 Verify status comment updates (not creates new) on subsequent runs
- [ ] 9.7 Test with PR missing publish comment, verify tracker skips gracefully
- [ ] 9.8 Clean up test PRs

**Test:** Age tracker correctly escalates warnings and handles edge cases

## 10. Documentation

**Deliverable:** Complete documentation for both workflows and TSC runbooks

- [ ] 10.1 Create `docs/BETA_RELEASE.md` adapted from bikeshed proposal
- [ ] 10.2 Update BETA_RELEASE.md with monorepo-specific examples (@accelint/* packages)
- [ ] 10.3 Add TSC runbook section to BETA_RELEASE.md (start, iterate, exit procedures)
- [ ] 10.4 Add beta exit sequence documentation (exit on branch, merge to main, main publishes stable)
- [ ] 10.5 Create `docs/EXPERIMENTAL_RELEASE.md` adapted from bikeshed proposal
- [ ] 10.6 Update EXPERIMENTAL_RELEASE.md with 1-month time-box and warning schedule
- [ ] 10.7 Add guidance for focused experiments (1-3 packages max)
- [ ] 10.8 Document npm dist-tags (@beta and @<feature-name>)
- [ ] 10.9 Optionally create `.github/PULL_REQUEST_TEMPLATE/experimental.md` template
- [ ] 10.10 Update CONTRIBUTING.md to reference new release channels (optional)

**Test:** Documentation reviewed for accuracy and completeness

## 11. Final Validation

**Deliverable:** Both workflows tested end-to-end, main release workflow unaffected

- [ ] 11.1 Run full beta cycle on clean test branch
- [ ] 11.2 Run full experimental cycle on clean test branch
- [ ] 11.3 Verify constellation-tracker does NOT run for beta or experimental
- [ ] 11.4 Verify main branch stable release workflow still works unchanged
- [ ] 11.5 Test beta direct PR workflow (make fix on beta branch, merge)
- [ ] 11.6 Verify independent package versioning works (only changed packages get beta versions)
- [ ] 11.7 Test age tracker cron runs automatically (wait 24 hours or check logs)
- [ ] 11.8 Verify npm registry shows correct tags (@beta, @feature-name, @latest)
- [ ] 11.9 Document any issues or edge cases discovered
- [ ] 11.10 Clean up all test branches and tags

**Test:** All acceptance criteria from GitLab issue #111 verified

## Parallelization Strategy

**Phase 1 (Sequential):** Complete tasks 1-3 first
- Beta core setup and workflow must work before moving to experimental
- Establishes foundation and verifies changesets prerelease mode

**Phase 2 (Parallel):** Tasks 4-6 and 7-9 can run in parallel
- **Track A:** Experimental publish workflow (4-6)
- **Track B:** Age tracking automation (7-9)
- These are independent - experimental publish doesn't depend on age tracking
- Can be implemented by different people simultaneously

**Phase 3 (Sequential):** Tasks 10-11 after Phase 2 complete
- Documentation requires understanding both workflows
- Final validation requires all features implemented

**Dependencies:**
- Task 1 → Task 2 → Task 3 (beta must work end-to-end first)
- Task 4 → Task 5 → Task 6 (experimental publish, then comments, then validate)
- Task 7 → Task 8 → Task 9 (age tracking core, then comments, then validate)
- Tasks 4-6 and 7-9 independent of each other
- Task 10 requires 3, 6, 9 complete (docs need working features)
- Task 11 requires all previous tasks (final validation)
