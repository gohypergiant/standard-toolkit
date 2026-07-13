# Operations

This page covers operational topics: building, testing, dependency management, troubleshooting, and maintenance tasks.

## Building

### Initial Build

From repository root:

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build
```

**Build Process:**
1. Turborepo resolves dependency graph
2. Upstream packages build first (e.g., `core` before `design-toolkit`)
3. tsdown compiles TypeScript to ESM with .d.ts files
4. CSS files copied alongside JS (design-toolkit)
5. Build artifacts written to `dist/` directories

**Build Time:** ~2-5 minutes for full workspace (incremental builds are faster)

### Incremental Builds

Turborepo caches build outputs. Only changed packages rebuild:

```bash
# Second build is fast (cached)
pnpm build

# Force rebuild (ignores cache)
pnpm build --force
```

### Package-Specific Builds

Build individual packages:

```bash
# Build design-toolkit and dependencies
pnpm build:design-toolkit

# Build map-toolkit and dependencies
pnpm build:map-toolkit

# Build specific package via filter
pnpm --filter=@accelint/geo build
```

### Clean Builds

Remove build artifacts:

```bash
# Clean all artifacts
pnpm clean

# Clean specific artifacts
pnpm clean:dist        # Remove dist/ directories
pnpm clean:buildinfo   # Remove tsconfig.tsbuildinfo files
pnpm clean:turbo       # Remove .turbo/ cache
pnpm clean:cov         # Remove coverage/ directories
pnpm clean:deps        # Remove node_modules/ (nuclear option)
```

### Development Mode

Start watch mode for fast iteration:

```bash
# Dev mode for all packages
pnpm dev

# Dev mode for specific package
pnpm --filter=@accelint/design-toolkit dev

# Interactive package selection
pnpm dev:filter
```

**Dev Mode Features:**
- File watching with hot reload
- Incremental compilation
- Fast rebuild on change

## Testing

### Unit and Integration Tests

**Run All Tests:**

```bash
pnpm test
```

**Package-Specific Tests:**

```bash
# Test specific package
pnpm --filter=@accelint/design-toolkit test

# Watch mode for fast feedback
pnpm --filter=@accelint/design-toolkit test -- --watch

# Run tests matching pattern
pnpm --filter=@accelint/design-toolkit test -- button
```

**Coverage:**

```bash
# Generate coverage report
pnpm test -- --coverage

# Coverage thresholds (enforced):
# - Branches: 80%
# - Functions: 80%
# - Lines: 80%
# - Statements: 80%
```

**Configuration:**
- Base config: `/tooling/vitest-config/`
- Package config: `vitest.config.js` in each package

### Playwright Integration Tests

Located in `/apps/next`, these tests validate components in real browser environments.

**Prerequisites:**

Install Playwright browsers (one-time setup):

```bash
pnpm --filter=@apps/next exec playwright install chromium
```

**Run Tests:**

```bash
# Run integration tests
pnpm --filter=@apps/next run test:integration

# Headed mode (watch browser)
pnpm --filter=@apps/next run test:integration:headed

# Specific test file
pnpm --filter=@apps/next exec playwright test src/features/map/map.integration.ts
```

**Configuration:** `/apps/next/playwright.config.ts`

**Test Locations:**
- Map tests: `/apps/next/src/features/map/*.integration.ts`
- General integration tests alongside feature code

### Visual Regression Tests

Capture and compare component screenshots to detect visual changes.

**Location:** `/apps/next/src/visual-regression/`

**Process:**
1. Tests run in CI (Linux for consistency)
2. Screenshots compared to baseline images in `__screenshots__/` directories
3. Diffs above threshold fail the test
4. Manual approval workflow to update baselines

**Updating Baselines:**

GitHub Actions workflow:
1. Go to **Actions** → **Visual Regression Update**
2. Click **Run workflow**
3. Select test file or pattern
4. Workflow commits new baseline screenshots

**Local Testing (Not Recommended):**

OS rendering differences cause false positives. Use CI for visual tests.

**Documentation:** `/apps/next/src/visual-regression/README.md`

### Memory Leak Tests (MemLab)

Detects memory leaks by analyzing heap snapshots during component mount/unmount cycles.

**Location:** `/apps/next/src/memlab/`

**Run Tests:**

```bash
# Run memlab tests
pnpm --filter=@apps/next run memlab

# Update baselines
pnpm --filter=@apps/next run memlab:baseline
```

**Process:**
1. Playwright repeatedly mounts/unmounts component
2. MemLab captures heap snapshots
3. Detached DOM nodes and leaked memory flagged
4. Baselines track expected memory usage

**Configuration:** `/apps/next/src/memlab/config/`

**Documentation:** `/apps/next/src/memlab/README.md`

## Storybook

Design Toolkit and Map Toolkit have Storybook instances for component development and documentation.

### Running Storybook Locally

```bash
# Design Toolkit Storybook
pnpm --filter=@accelint/design-toolkit run storybook

# Map Toolkit Storybook
pnpm --filter=@accelint/map-toolkit run storybook
```

**Ports:**
- Design Toolkit: http://localhost:6006
- Map Toolkit: http://localhost:6007 (if different)

### Building Storybook

```bash
# Build static Storybook site
pnpm --filter=@accelint/design-toolkit run build-storybook
```

Output: `storybook-static/` directory

### Storybook Files

- `*.stories.tsx` - Component stories (demos and examples)
- `*.docs.mdx` - MDX documentation pages
- `.storybook/` - Storybook configuration

**Writing Stories:**

```typescript
// component/component.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Component } from './index';

const meta: Meta<typeof Component> = {
  title: 'Components/Component',
  component: Component,
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    label: 'Click me',
  },
};
```

## Dependency Management

### Installing Dependencies

```bash
# Install all workspace dependencies
pnpm install

# Add dependency to specific package
pnpm --filter=@accelint/design-toolkit add react-aria

# Add dev dependency
pnpm --filter=@accelint/design-toolkit add -D vitest

# Add workspace dependency
pnpm --filter=@accelint/design-toolkit add @accelint/core@workspace:*
```

### Updating Dependencies

**Check for Updates:**

```bash
pnpm taze
```

**Update Dependencies:**

```bash
# Update patch versions
pnpm deps:version-patch

# Update minor versions
pnpm deps:version-minor

# Update major versions (use caution)
pnpm deps:version-major
```

**Version Consistency:**

Ensure consistent versions across packages:

```bash
# Check for inconsistencies
pnpm lint:deps

# Auto-fix inconsistencies
pnpm format:deps
```

**Configuration:** `/.syncpackrc`

### Workspace Protocol

Internal dependencies use `workspace:*` protocol:

```json
{
  "dependencies": {
    "@accelint/core": "workspace:*"
  }
}
```

This resolves to the local workspace version during development and the published version when consumed externally.

## Code Quality

### Linting

```bash
# Lint all packages
pnpm lint

# Lint specific package
pnpm --filter=@accelint/design-toolkit lint

# Auto-fix linting issues
pnpm lint -- --fix
```

**Configuration:** `/biome.json`

### Formatting

```bash
# Check formatting
pnpm format:check

# Format code
pnpm format
```

**Configuration:** `/biome.json` (Biome), transitioning from Prettier

### Filesystem Naming

Enforce consistent file naming conventions:

```bash
pnpm lint:fs
```

**Configuration:** `/.ls-lint.yml`

**Rules:**
- kebab-case for directories
- kebab-case for files (with extensions)
- PascalCase for component files allowed

### Package Validation

Validate package.json exports:

```bash
pnpm lint:package
```

Uses publint to check for common packaging issues.

### License Headers

Add Apache 2.0 license headers to source files:

```bash
pnpm license
```

**Configuration:** `/scripts/license.mjs`

### Auditing

**Docblock Audit:**

Ensure TypeScript files have proper documentation:

```bash
pnpm audit:docblocks
```

**react-aria-components Version Audit:**

Check RAC dependency versions:

```bash
pnpm lint:rac
```

## Turbo Filtering

Interactively select packages for turbo commands:

```bash
# Interactive dev mode
pnpm dev:filter

# Interactive preview mode
pnpm preview:filter
```

Uses `@accelint/turbo-filter` for package selection.

## Next.js Test Bed

The Next.js app in `/apps/next` is a test bed for validating library features.

### Setup

```bash
# Install and build workspace
pnpm install
pnpm build
```

### Running the App

```bash
# Dev mode
pnpm --filter=@apps/next run dev

# Build production
pnpm --filter=@apps/next run build

# Serve production build
pnpm --filter=@apps/next run start
```

**URL:** http://localhost:3000

### Integrating Library Changes

After changing a library package:

```bash
# Rebuild the changed package
pnpm --filter=@accelint/design-toolkit build

# Restart Next.js dev server
pnpm --filter=@apps/next run dev
```

The app consumes workspace packages via `workspace:*` dependencies, so changes are immediately available after rebuild.

### Test Pages

Component test pages are in `/apps/next/app/`:
- `/app/forms/page.tsx` - Form components
- `/app/map/symbol-layer/page.tsx` - Map symbol layer

Add new test pages as needed for feature validation.

### Documentation

See `/apps/next/README.md` for detailed app documentation.

## Troubleshooting

### Build Failures

**Issue:** TypeScript compilation errors

**Solution:**
1. Clean build artifacts: `pnpm clean:buildinfo`
2. Rebuild: `pnpm build`
3. Check for missing dependencies: `pnpm install`

**Issue:** tsdown "not found" errors

**Solution:**
- Ensure `tsdown` is installed: `pnpm install`
- Check package.json has `tsdown` in devDependencies

### Test Failures

**Issue:** Tests fail after dependency update

**Solution:**
1. Clear test cache: `pnpm test -- --clearCache`
2. Rebuild packages: `pnpm build`
3. Re-run tests: `pnpm test`

**Issue:** Coverage below threshold

**Solution:**
- Add missing test coverage for new code
- Thresholds: 80% for branches, functions, lines, statements

### Module Resolution Errors

**Issue:** Cannot find module '@accelint/package'

**Solution:**
1. Ensure package is built: `pnpm build`
2. Check package.json exports are correct
3. Verify workspace dependency: `"@accelint/package": "workspace:*"`

**Issue:** Type errors with workspace packages

**Solution:**
1. Rebuild packages to regenerate .d.ts files: `pnpm build`
2. Restart TypeScript server in IDE

### Storybook Issues

**Issue:** Storybook fails to start

**Solution:**
1. Clear cache: `rm -rf node_modules/.cache`
2. Rebuild packages: `pnpm build`
3. Reinstall dependencies: `pnpm install`

**Issue:** Component not rendering in Storybook

**Solution:**
- Check story file imports
- Verify component exports
- Check browser console for errors

### Performance Issues

**Issue:** Slow builds

**Solution:**
1. Use incremental builds: `pnpm build` (with cache)
2. Build specific packages: `pnpm --filter=<package> build`
3. Clean turbo cache if stale: `pnpm clean:turbo`

**Issue:** Slow tests

**Solution:**
- Run specific tests: `pnpm test -- <pattern>`
- Use watch mode for targeted testing
- Check for slow test setup/teardown

### Git Issues

**Issue:** Lefthook hooks not running

**Solution:**
1. Reinstall lefthook: `pnpm lefthook install`
2. Check configuration: `lefthook.yml`

**Issue:** Large uncommitted changes after install

**Solution:**
- Likely pnpm-lock.yaml changes
- Review and commit lock file updates

### Workspace Issues

**Issue:** Package not found in workspace

**Solution:**
1. Verify package is in `pnpm-workspace.yaml` patterns
2. Check package.json exists in package directory
3. Run `pnpm install` to refresh workspace

**Issue:** Version mismatch errors

**Solution:**
- Check dependency versions: `pnpm lint:deps`
- Fix mismatches: `pnpm format:deps`

## Maintenance Tasks

### Updating Node/pnpm

**Current Requirements:**
- Node.js: ≥22
- pnpm: ≥10

**Process:**
1. Update local Node.js: use nvm or installer
2. Update pnpm: `corepack enable && corepack prepare pnpm@latest --activate`
3. Update `.nvmrc`: echo "22" > .nvmrc
4. Update `package.json` engines field
5. Update CI workflows (`.github/workflows/*.yml`)

### Updating Turbo

```bash
# Check current version
pnpm turbo --version

# Update turbo
pnpm add -D turbo@latest

# Test build
pnpm build
```

### Updating React

React updates require coordination across the workspace:

1. Update React in all packages: `pnpm deps:version-minor` or manual update
2. Update react-aria-components and react-stately (check compatibility)
3. Test all components in Storybook
4. Run full test suite: `pnpm test`
5. Create changeset for breaking changes

### Regenerating Catalog Files

Update Backstage catalog metadata:

```bash
pnpm constellation-tracker --regenerate
```

Commits updated `catalog-info.yaml` files.

### Cleaning Stale Artifacts

Periodic cleanup:

```bash
# Clean all build artifacts
pnpm clean

# Remove node_modules and reinstall
pnpm clean:deps
pnpm install

# Clean turbo cache
pnpm clean:turbo
```

## CI/CD Monitoring

### Checking CI Status

Monitor CI pipelines in GitHub Actions:
- https://github.com/gohypergiant/standard-toolkit/actions

**Key Workflows:**
- ci.yml - Quality gates
- release.yml - Stable releases
- visual-regression.yml - Visual tests
- memlab.yml - Memory leak detection

### Failed CI Runs

**Quality Gate Failures:**
1. Check workflow logs in GitHub Actions
2. Reproduce locally: `pnpm lint && pnpm test && pnpm build`
3. Fix issues and push changes

**Visual Regression Failures:**
1. Review screenshot diffs in workflow artifacts
2. If intentional: Approve changes via workflow
3. If unintentional: Fix and re-run

**Memory Leak Failures:**
1. Review heap analysis in workflow artifacts
2. Check for detached DOM nodes
3. Fix component cleanup issues

## Performance Optimization

### Build Performance

**Strategies:**
- Use incremental builds (default with turbo cache)
- Build only changed packages: `pnpm build`
- Parallelize builds: turbo handles automatically
- Use fast hardware with SSD

### Test Performance

**Strategies:**
- Run targeted tests during development
- Use watch mode for fast feedback
- Parallelize tests: vitest runs tests in parallel by default
- Mock expensive operations (network, file system)

### Development Workflow Performance

**Strategies:**
- Use dev mode for hot reload: `pnpm dev`
- Filter commands to relevant packages: `pnpm dev:filter`
- Clear caches if experiencing issues

---

**Related:**
- [Quickstart](./quickstart.md) - Getting started
- [Architecture](./architecture.md) - System design
- [Workflows](./workflows.md) - Development process
- [Packages](./packages.md) - Package details
