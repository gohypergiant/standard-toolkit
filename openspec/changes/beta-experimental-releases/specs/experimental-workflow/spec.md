# Spec: Experimental Release Workflow

## ADDED Requirements

### Requirement: Experimental branch creation
The system SHALL support creating experimental branches with the naming pattern `experimental/<feature-name>`.

#### Scenario: Contributor creates experimental branch
- **WHEN** contributor creates branch `experimental/dark-mode`
- **THEN** branch is valid for experimental workflow

#### Scenario: Invalid branch name
- **WHEN** contributor creates branch not matching `experimental/*` pattern
- **THEN** experimental publish workflow does not trigger

### Requirement: Manual publish trigger
The experimental workflow SHALL require manual workflow dispatch trigger.

#### Scenario: Manual publish initiation
- **WHEN** contributor triggers "Publish Experimental Snapshot" workflow from GitHub Actions UI
- **THEN** workflow runs only on `experimental/*` branches

#### Scenario: Automatic push blocked
- **WHEN** contributor pushes to experimental branch
- **THEN** workflow does NOT automatically publish (requires manual trigger)

### Requirement: Feature name extraction
The system SHALL extract feature name from experimental branch for versioning.

#### Scenario: Feature name from branch
- **WHEN** workflow runs on `experimental/dark-mode` branch
- **THEN** feature name is extracted as "dark-mode"

### Requirement: Experimental quality gates
The experimental workflow SHALL run minimal quality checks before publishing.

#### Scenario: Build verification
- **WHEN** experimental workflow runs
- **THEN** system executes `pnpm run build` and fails fast if build errors occur

#### Scenario: No test requirement
- **WHEN** experimental workflow runs
- **THEN** tests are NOT required to pass (optional quality gate)

### Requirement: Snapshot versioning
The system SHALL version experimental packages based on current main version with experimental prefix.

#### Scenario: Experimental version generation
- **WHEN** experimental workflow runs with feature "dark-mode" and main is at `9.12.0`
- **THEN** packages are versioned as `9.12.0-experimental-dark-mode-<timestamp>`

#### Scenario: Timestamp uniqueness
- **WHEN** experimental publish runs multiple times
- **THEN** each publish gets a unique timestamp in version

### Requirement: No changesets required
The experimental workflow SHALL NOT require changeset files.

#### Scenario: Publish without changesets
- **WHEN** experimental branch has no `.changeset/*.md` files
- **THEN** workflow successfully publishes using `changeset version --snapshot`

### Requirement: Feature-specific npm tags
The system SHALL publish experimental packages with feature-specific dist-tags.

#### Scenario: Experimental package publication
- **WHEN** experimental workflow completes versioning for feature "dark-mode"
- **THEN** changed packages are published to npm with tag `@dark-mode`

#### Scenario: Experimental installation
- **WHEN** user runs `npm install @accelint/design-toolkit@dark-mode`
- **THEN** npm installs the latest experimental version for that feature

### Requirement: Draft PR comment
The experimental workflow SHALL create or update a PR comment with install instructions.

#### Scenario: First publish comment
- **WHEN** experimental workflow publishes for the first time
- **THEN** bot creates comment on associated draft PR with install instructions for all published packages

#### Scenario: Subsequent publish update
- **WHEN** experimental workflow publishes again on same branch
- **THEN** bot updates existing comment with new version and timestamp

#### Scenario: Multiple packages published
- **WHEN** experimental publish affects 3 packages
- **THEN** PR comment lists install instructions for all 3 packages

### Requirement: Never merge to main
The experimental workflow SHALL enforce that experimental branches never merge to main.

#### Scenario: Experimental promotion
- **WHEN** experimental feature succeeds
- **THEN** contributor MUST close experimental PR and open fresh PR to main with full quality bar

#### Scenario: Experimental abandonment
- **WHEN** experimental feature fails validation
- **THEN** contributor closes draft PR and deletes experimental branch

### Requirement: constellation-tracker exclusion
The experimental workflow SHALL NOT run constellation-tracker during versioning.

#### Scenario: Experimental versioning without tracker
- **WHEN** experimental workflow calls `changeset version --snapshot`
- **THEN** constellation-tracker does NOT execute (catalog not updated)

### Requirement: Time-boxed lifecycle
The experimental workflow SHALL support 1-month time-box for experimental branches.

#### Scenario: Publish date tracking
- **WHEN** experimental workflow publishes
- **THEN** PR comment includes publish date for age calculation

#### Scenario: One-month limit
- **WHEN** experimental branch reaches 28 days from first publish
- **THEN** age tracker marks as overdue and requires decision
