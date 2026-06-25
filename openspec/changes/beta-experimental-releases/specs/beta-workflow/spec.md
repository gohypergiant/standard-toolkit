# Spec: Beta Release Workflow

## ADDED Requirements

### Requirement: Beta branch creation
The system SHALL support creating beta release branches with the naming pattern `beta/v<major>.<minor>`.

#### Scenario: TSC starts beta cycle
- **WHEN** TSC runs `pnpm beta:start` on main branch
- **THEN** system enters changesets prerelease mode with tag "beta"

#### Scenario: Beta branch pushed
- **WHEN** beta branch is pushed to origin
- **THEN** GitHub Actions workflow triggers on `beta/**` branch pattern

### Requirement: Beta prerelease mode verification
The beta release workflow SHALL verify that `.changeset/pre.json` exists and is in beta prerelease mode before publishing.

#### Scenario: Missing prerelease file
- **WHEN** beta workflow runs without `.changeset/pre.json`
- **THEN** workflow fails with error message "Error: .changeset/pre.json not found"

#### Scenario: Wrong prerelease mode
- **WHEN** beta workflow runs with prerelease mode != "beta"
- **THEN** workflow fails with error message "Error: Prerelease mode is '<mode>', expected 'beta'"

### Requirement: Independent package versioning
The system SHALL version only changed packages with beta suffix, maintaining each package's independent version.

#### Scenario: Selective beta versioning
- **WHEN** design-toolkit changes and map-toolkit does not
- **THEN** design-toolkit gets version `2.3.0-beta.1` and map-toolkit stays at `5.1.0`

#### Scenario: Beta version increment
- **WHEN** beta branch has changes and is pushed again
- **THEN** changed packages increment beta suffix (e.g., `2.3.0-beta.1` → `2.3.0-beta.2`)

### Requirement: Beta quality gates
The beta workflow SHALL run all verification gates before publishing.

#### Scenario: Build verification
- **WHEN** beta workflow runs
- **THEN** system executes `pnpm run build` and fails if build errors occur

#### Scenario: Quality gate failure
- **WHEN** any verification gate fails
- **THEN** workflow stops and does not publish packages

### Requirement: Beta npm publishing
The system SHALL publish beta packages with `@beta` dist-tag.

#### Scenario: Beta package publication
- **WHEN** beta workflow completes versioning
- **THEN** changed packages are published to npm with tag `@beta`

#### Scenario: Beta installation
- **WHEN** user runs `npm install @accelint/design-toolkit@beta`
- **THEN** npm installs the latest beta version of that package

### Requirement: Beta exit and promotion
The system SHALL support exiting beta prerelease mode and promoting to stable.

#### Scenario: TSC exits beta
- **WHEN** TSC runs `pnpm beta:exit` on beta branch
- **THEN** system exits prerelease mode and removes `-beta.N` suffix from package versions

#### Scenario: Beta merge to main
- **WHEN** beta branch is merged to main after exit
- **THEN** main branch's existing release workflow publishes stable versions with `@latest` tag

### Requirement: Beta status checking
The system SHALL provide a command to check current prerelease status.

#### Scenario: Check beta status in prerelease mode
- **WHEN** user runs `pnpm beta:status` while in prerelease mode
- **THEN** system outputs the contents of `.changeset/pre.json`

#### Scenario: Check beta status not in prerelease mode
- **WHEN** user runs `pnpm beta:status` while NOT in prerelease mode
- **THEN** system outputs "Not in prerelease mode"

### Requirement: Beta direct PRs
The beta workflow SHALL accept direct pull requests to beta branches for beta-specific fixes.

#### Scenario: Beta-specific fix
- **WHEN** contributor opens PR directly against beta branch
- **THEN** PR is allowed and can be merged without requiring changes on main first

### Requirement: constellation-tracker exclusion
The beta workflow SHALL NOT run constellation-tracker during versioning.

#### Scenario: Beta versioning without tracker
- **WHEN** beta workflow calls `changeset version`
- **THEN** constellation-tracker does NOT execute (catalog not updated)
