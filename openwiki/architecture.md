# Architecture

This page describes the technical architecture of Standard Toolkit, including monorepo organization, build system, testing strategy, and key design patterns.

## Monorepo Organization

Standard Toolkit is a pnpm workspace managed by Turborepo. The workspace is divided into three top-level directories:

### apps/

Application workspaces that consume the toolkit packages:

- **next/**: Next.js test bed for validating library features in a production-like environment
  - Purpose: Dev iteration, SSR validation, integration tests
  - Tests: Vitest unit/integration, Playwright e2e, visual regression, memlab memory leak detection
  - Source: `/apps/next/`

- **docs/**: Documentation site (structure TBD)

### packages/

Published library packages organized by domain:

**UI Components:**
- **design-toolkit**: 50+ accessible React components (forms, data displays, navigation, feedback)
- **design-foundation**: Design tokens and CSS utilities shared across design-toolkit

**Geospatial:**
- **map-toolkit**: Deck.gl and maplibre integration (camera, shapes, layers, cursor coords)
- **geo**: Coordinate system parsers/formatters (DD, DDM, DMS, MGRS, GARS)

**Utilities:**
- **core**: Functional utilities (array, object, logic, curry/pipe composition)
- **formatters**: Date, number, string formatting
- **converters**: Unit conversions and data transformation
- **temporal**: Date/time operations
- **predicates**: Type guards and validation
- **math**: Mathematical utilities
- **constants**: Shared constants

**Infrastructure:**
- **bus**: Event bus for cross-component communication
- **hotkey-manager**: Keyboard shortcut management
- **logger**: Structured logging
- **web-worker**: Web worker utilities
- **websocket**: WebSocket client utilities
- **dataset**: Data structure utilities

**Assets:**
- **icons**: SVG icon library
- **ntds**: NATO Tactical Data Standard components

### tooling/

Internal development tooling (not published to npm):

- **constellation-tracker**: CLI to maintain Backstage `catalog-info.yaml` files
- **biome-config**: Shared Biome linting/formatting config
- **typescript-config**: Base TypeScript configuration
- **vitest-config**: Base Vitest test configuration
- **prettier-config**: Prettier configuration
- **eslint-config**: ESLint configuration (legacy, transitioning to Biome)
- **smeegl**: Custom tooling utilities
- **turbo-filter**: Interactive package filter for turbo

## Build System

### Turborepo

Orchestrates build, test, lint, and dev tasks across the workspace with intelligent caching.

**Configuration:** `/turbo.json`

**Key Tasks:**
- `build`: Builds packages with dependency graph awareness
- `test`: Runs tests with coverage
- `dev`: Starts dev mode with watch and hot reload
- `lint`, `format`: Code quality checks
- `index`: Auto-generates package index files

**Dependency Graph:**
- Packages declare workspace dependencies via `workspace:*` protocol
- Turbo builds upstream dependencies before downstream consumers
- Incremental builds skip unchanged packages

### tsdown

Package bundler used by most packages for building distributable output.

**Configuration:** `tsdown.config.ts` in each package

**Key Features:**
- **Unbundled ESM:** Each source file → separate output file
- **TypeScript Declaration Files:** `.d.ts` files for full type support
- **Source Maps:** For debugging published packages
- **Tree Shaking:** Dead code elimination
- **CSS Handling:** design-toolkit copies CSS modules alongside JS

**Example Config:** `/packages/design-toolkit/tsdown.config.ts`

```typescript
export default defineConfig({
  entry: ['src/**/*.{ts,tsx}', '!**/*.{stories,test}.{ts,tsx}'],
  format: 'esm',
  dts: true,
  sourcemap: true,
  unbundle: true,
  treeshake: true,
  platform: 'neutral',
  exports: true,
});
```

### Package Exports

Packages use fine-grained subpath exports for tree-shaking optimization:

```json
{
  "exports": {
    ".": "./dist/index.js",
    "./components/button": "./dist/components/button/index.js",
    "./camera": "./dist/camera/index.js"
  }
}
```

Consumers import specific modules instead of the entire package:

```typescript
import { Button } from '@accelint/design-toolkit/components/button';
import { useCamera } from '@accelint/map-toolkit/camera';
```

## Testing Strategy

### Vitest (Unit & Integration)

Primary test runner for packages and the Next.js app.

**Configuration:** `/tooling/vitest-config/` (shared base config)

**Coverage:** Istanbul coverage with thresholds enforced
- Branches: 80%
- Functions: 80%
- Lines: 80%
- Statements: 80%

**Running Tests:**
```bash
pnpm test                              # All packages
pnpm --filter=@accelint/design-toolkit test -- --watch  # Specific package
```

### Playwright (E2E & Visual Regression)

Used in `/apps/next` for integration tests requiring browser automation.

**Use Cases:**
- Map interaction testing (camera controls, shape editing)
- Visual regression (screenshot comparison against baselines)
- Complex component flows

**Configuration:** `/apps/next/playwright.config.ts`

**Running Tests:**
```bash
pnpm --filter=@apps/next run test:integration
```

### Visual Regression

Playwright captures component screenshots and compares against baseline images.

**Location:** `/apps/next/src/visual-regression/`
- Baselines captured on Linux in CI for consistency
- Tests run in CI only (not locally due to OS rendering differences)
- Update baselines via GitHub Actions workflow

**Process:**
1. Write visual test in `.visual.tsx` file
2. CI captures screenshots and compares to baselines
3. Approve or reject changes via workflow

See `/apps/next/src/visual-regression/README.md` for details.

### MemLab (Memory Leak Detection)

Detects detached DOM nodes and memory leaks by repeatedly mounting/unmounting components.

**Location:** `/apps/next/src/memlab/`
- Playwright drives mount/unmount cycles
- MemLab analyzes heap snapshots
- Baselines track expected memory usage
- Alerts on regressions

**Running Tests:**
```bash
pnpm --filter=@apps/next run memlab
```

See `/apps/next/src/memlab/README.md` for details.

## Design System Architecture

### Component Foundation: react-aria-components

Design Toolkit components are built on Adobe's **react-aria-components** (RAC):

- **Accessibility:** Full ARIA support, keyboard navigation, screen reader optimization
- **Unstyled Primitives:** RAC provides behavior, design-toolkit provides styling
- **Composability:** Components compose via contexts and slots
- **Hooks API:** Low-level hooks available for custom component authoring

**Key Dependencies:**
- `react-aria`: Hooks for accessible interactions
- `react-stately`: State management for complex components
- `react-aria-components`: Composable component primitives

### Styling: Tailwind CSS Modules

Design Toolkit uses **Tailwind v4** with **CSS modules** for scoped styling:

- **Scoped Styles:** CSS modules prevent style leakage across components
- **Utility Classes:** Tailwind utilities via `@apply` in CSS modules
- **Theme Tokens:** Design foundation provides tokens (colors, spacing, typography)
- **Dark Mode:** Automatic dark mode support via CSS custom properties

**Custom Plugin:** `@accelint/postcss-tailwind-css-modules` integrates CSS modules with Tailwind.

**Example Pattern:**
```tsx
// component/styles.module.css
.button {
  @apply rounded-md px-4 py-2 font-medium;
}

// component/index.tsx
import styles from './styles.module.css';
export function Button() {
  return <button className={styles.button}>Click</button>;
}
```

### Classification Banners

Government/military UX feature for displaying data classification levels:

- **classification-banner**: Site-wide banner (TOP SECRET, SECRET, etc.)
- **classification-badge**: Inline classification indicator

## Map Toolkit Architecture

### Rendering: deck.gl + maplibre

Map Toolkit provides a declarative React API over deck.gl and maplibre:

- **deck.gl**: WebGL-based 2D/3D layer rendering (shapes, symbols, heatmaps)
- **maplibre**: Base map tiles and vector rendering
- **@deckgl-fiber-renderer**: React reconciler for deck.gl (experimental)

**Key Components:**
- `BaseMap`: Core map component with camera and interaction controls
- Layers: `DisplayShapeLayer`, `EditShapeLayer`, `SymbolLayer`
- Stores: Zustand stores for camera, cursor coordinates, and map mode state

### Camera System

Camera controls support 2D and 2.5D (pitched) views:

**Features:**
- Pan, zoom, rotate, and tilt (2.5D)
- GPU-accelerated transitions (recent addition, commit `5f1207f2`)
- Gesture handling: mouse, touch, keyboard
- Programmatic control via `useCamera` hook

**Store:** `/packages/map-toolkit/src/camera/store.ts`

**Recent Work:**
- Custom tilt gesture for 2.5D mouse interactions (commit `fdea8e2d`)
- Transition animation improvements

### Shape Editing

Editable geospatial shapes (polygons, lines, points) with transform modes:

**Modes:**
- Draw mode: Create new shapes
- Modify mode: Edit vertices
- Transform mode: Move, rotate, scale shapes
- Locked transform: Constrained transformations (e.g., locked aspect ratio)

**Layer:** `/packages/map-toolkit/src/deckgl/shapes/edit-shape-layer/`

**Recent Fixes:**
- Wagon wheel bounding box calculation (commit `149d975f`)

### Coordinate Display

Real-time cursor coordinate display in multiple formats:

**Supported Formats (via @accelint/geo):**
- Decimal Degrees (DD)
- Degrees Decimal Minutes (DDM)
- Degrees Minutes Seconds (DMS)
- MGRS (Military Grid Reference System)
- GARS (Global Area Reference System)

**Store:** `/packages/map-toolkit/src/cursor-coordinates/store.ts`

## Dependency Patterns

### External Dependencies

**Core React Ecosystem:**
- React 19 (latest)
- react-aria / react-aria-components ~3.48 / ~1.17
- react-stately ~3.46

**Utilities:**
- radashi: Modern lodash alternative (tree-shakeable)
- zod: Runtime schema validation
- uuid: UUID generation
- type-fest: Advanced TypeScript types

**Geospatial:**
- @deck.gl: 9.2
- maplibre-gl: 5.7
- @turf/turf: Geospatial calculations
- geodesy: Coordinate system conversions

**Build/Test:**
- typescript: 5.9
- vitest: 4.0
- playwright: 1.61
- tsdown: 0.18

### Internal Dependencies

Packages depend on each other via `workspace:*` protocol:

**Common Dependency Chain:**
```
design-toolkit
  → design-foundation (tokens, CSS utilities)
  → core (functional utilities)
  → predicates (type guards)
  → logger (logging)
  → bus (event communication)

map-toolkit
  → design-toolkit (UI components)
  → geo (coordinate systems)
  → core (utilities)
  → hotkey-manager (keyboard shortcuts)
```

### Dependency Management

**syncpack**: Enforces version consistency across workspace packages.

```bash
pnpm lint:deps        # Check for version mismatches
pnpm format:deps      # Auto-fix version mismatches
```

**taze**: Bulk dependency updates.

```bash
pnpm deps:version-minor   # Update minor versions
pnpm deps:version-patch   # Update patch versions
```

## Code Quality

### Biome (Linting & Formatting)

Transitioning from ESLint/Prettier to Biome for faster linting and formatting.

**Configuration:** `/biome.json` and `/tooling/biome-config/`

**Commands:**
```bash
pnpm lint           # Lint all packages
pnpm format         # Format code
pnpm format:check   # Check formatting without changes
```

### ls-lint (Filesystem Naming)

Enforces consistent file naming conventions.

**Configuration:** `/.ls-lint.yml`

```bash
pnpm lint:fs
```

### publint

Validates package.json exports for published packages.

```bash
pnpm lint:package
```

## CI/CD Pipelines

**Location:** `/.github/workflows/`

**Key Workflows:**
- **ci.yml**: Quality gates (lint, type-check, test, build)
- **release.yml**: Stable release to npm with `@latest` tag
- **release-beta.yml**: Beta release to npm with `@beta` tag
- **publish-experimental.yml**: Experimental release with `@experimental` tag
- **visual-regression.yml**: Screenshot comparison for UI changes
- **memlab.yml**: Memory leak detection
- **coverage-comment.yml**: Posts coverage reports to PRs

See [Workflows](./workflows.md) for release process details.

## Change Management

### Constellation Tracker

Automatically maintains Backstage `catalog-info.yaml` files for service discovery:

**Purpose:**
- Scans workspace dependencies
- Updates catalog metadata
- Tracks component relationships

**Integration:** Runs in CI and via lefthook on commit.

**Source:** `/tooling/constellation-tracker/`

### Indexer Scripts

Auto-generates package `src/index.ts` files to export all modules:

**Scripts:**
- `/scripts/indexer.mjs`: Original indexer
- `/scripts/indexer-v2.mjs`: V2 implementation

**Task:** `pnpm indexer` (turbo task)

## Source File Conventions

### Directory Structure

```
package/
  src/
    component-name/
      index.tsx               # Main component export
      context.tsx             # React context (if needed)
      types.ts                # TypeScript types
      styles.module.css       # Component styles
      component-name.stories.tsx   # Storybook stories
      component-name.test.tsx      # Unit tests
      component-name.docs.mdx      # Storybook documentation
```

### File Naming

- **Components:** kebab-case directories, PascalCase exports
- **Utilities:** kebab-case files and directories
- **Tests:** `*.test.ts(x)` for vitest
- **Stories:** `*.stories.tsx` for Storybook
- **Docs:** `*.docs.mdx` for Storybook documentation

### Import/Export Patterns

**Explicit Exports:**
```typescript
// src/component/index.tsx
export { Component, type ComponentProps } from './component';
```

**Package Index (auto-generated):**
```typescript
// src/index.ts
export * from './component-a';
export * from './component-b';
export * from './utils';
```

## Performance Considerations

### Tree Shaking

Fine-grained subpath exports enable consumers to import only what they need:

```typescript
// ✅ Tree-shakeable
import { Button } from '@accelint/design-toolkit/components/button';

// ❌ Imports entire package
import { Button } from '@accelint/design-toolkit';
```

### Unbundled Builds

tsdown outputs unbundled ESM (one source file → one dist file):
- Better tree shaking for consumers
- Faster incremental builds
- Clearer source map debugging

### CSS Modules

CSS modules are scoped and only loaded when components are imported:
- No global CSS pollution
- Automatic dead CSS elimination
- Better code splitting in consuming apps

---

**Related:**
- [Quickstart](./quickstart.md) - Getting started
- [Workflows](./workflows.md) - Development process
- [Packages](./packages.md) - Package details
- [Operations](./operations.md) - Building and testing
