# Standard Toolkit (DevTK) - Quickstart

## Overview

**Standard Toolkit** (DevTK) is Accelint/Hypergiant's internal "standard library" for web applications in the Accelint family of systems. This monorepo provides production-ready React components, geospatial visualization tools, and utility packages built on modern standards with accessibility, TypeScript, and testing as core principles.

**Status:** Internal use within Accelint. Contributions welcome, but the project is optimized for Accelint's needs.

**Primary Maintainers:** Technical Steering Committee (TSC)
- Ray Knight, Bryan Kizer, Brenna Switzer, Jacob Foster, Brandon Pierce

## Repository Structure

```
standard-toolkit/
├── apps/
│   ├── next/         # Next.js test bed for validation
│   └── docs/         # Documentation site
├── packages/
│   ├── design-toolkit/   # React component library (50+ components)
│   ├── map-toolkit/      # Geospatial visualization (deck.gl, maplibre)
│   ├── geo/              # Coordinate systems and geo utilities
│   ├── core/             # Utility functions (array, object, composition)
│   ├── formatters/       # Data formatting utilities
│   ├── converters/       # Data conversion utilities
│   ├── temporal/         # Date/time utilities
│   └── [15 more packages]
├── tooling/
│   ├── constellation-tracker/  # Backstage catalog automation
│   ├── biome-config/          # Linting/formatting config
│   ├── typescript-config/     # Shared TS config
│   └── vitest-config/         # Test config
└── documentation/       # Process docs (workflows, ADRs)
```

## Getting Started

### Prerequisites

- **Node.js:** ≥22
- **pnpm:** ≥10 (package manager)

### Initial Setup

From the repository root:

```bash
# Install all workspace dependencies
pnpm install

# Build all packages (required before first dev run)
pnpm build

# Start development mode
pnpm dev
```

### Development Workflow

1. **Create a feature branch:**
   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **Make changes and test locally:**
   ```bash
   # Test specific package
   pnpm --filter=@accelint/design-toolkit test -- --watch
   
   # Test all packages
   pnpm test
   ```

3. **Create a changeset** (required for source/config changes):
   ```bash
   pnpm changeset
   ```
   Follow prompts to describe the change and select affected packages.

4. **Push and open a PR:**
   - All quality gates must pass (lint, test, type-check)
   - Requires peer review and approval
   - Author merges when ready

See [Workflows](./workflows.md) for detailed development process.

## Key Commands

### Build & Development

```bash
pnpm build                      # Build all packages
pnpm dev                        # Start dev mode for all packages
pnpm dev:filter                 # Interactive package filter for dev
pnpm clean                      # Clean all build artifacts
```

### Testing

```bash
pnpm test                       # Run all tests
pnpm --filter=<pkg> test        # Test specific package
pnpm bench                      # Run benchmarks
```

### Code Quality

```bash
pnpm lint                       # Lint all packages
pnpm lint:deps                  # Check dependency version consistency
pnpm lint:fs                    # Check filesystem naming conventions
pnpm format                     # Format code
pnpm format:check               # Check formatting without changes
```

### Package Management

```bash
pnpm changeset                  # Create version changeset
pnpm changeset:version          # Apply changesets and bump versions
pnpm changeset:release          # Build and publish to npm
```

## Major Packages

### Design Toolkit

50+ accessible React components built on react-aria-components with Tailwind CSS modules.

**Key Features:**
- Full ARIA support and keyboard navigation
- Dark mode and theming
- Classification banner support (government/military UX)
- Form fields, data displays, navigation, notifications

**Storybook:** https://design-toolkit.accelint.io/

**Common Components:**
- Form inputs (text-field, select-field, combobox-field, date-field, time-field, coordinate-field)
- Data display (table, tree, gantt, kanban, details-list)
- Navigation (sidenav, breadcrumbs, tabs, menu)
- Feedback (notice, dialog, drawer, tooltip, status-indicator)

### Map Toolkit

Geospatial visualization toolkit integrating deck.gl and maplibre.

**Key Features:**
- Camera controls (2D/2.5D modes, GPU-accelerated transitions)
- Shape editing (polygons, lines, points with transform modes)
- Symbol layers and milsymbol support
- Cursor coordinate display (lat/lon in multiple formats)
- Integration with @accelint/geo for coordinate systems

**Storybook:** https://map-toolkit.accelint.io/

### Utility Packages

- **geo:** Coordinate parsing/formatting (DD, DDM, DMS, MGRS, GARS)
- **core:** Functional utilities (array, object, composition, curry/pipe)
- **formatters:** Date, number, and string formatting
- **converters:** Unit conversions and data transformation
- **temporal:** Date/time utilities and operations
- **predicates:** Type guards and validation predicates
- **bus:** Event bus for cross-component communication
- **hotkey-manager:** Keyboard shortcut management
- **logger:** Structured logging utilities

See [Packages](./packages.md) for complete inventory.

## Testing

The monorepo uses multiple testing strategies:

- **Unit/Integration:** Vitest with jsdom for component and utility testing
- **Visual Regression:** Playwright screenshots compared to baselines (Linux CI)
- **Memory Leaks:** MemLab integration for detached DOM detection
- **E2E/Integration:** Playwright for map and complex component scenarios

See [Operations](./operations.md) for testing details.

## Build System

- **Workspace:** pnpm workspaces with turbo for orchestration
- **Bundler:** tsdown (esbuild-based) for unbundled ESM with .d.ts generation
- **Style:** CSS modules with Tailwind v4
- **Versioning:** Changesets for independent package versioning

## Recent Activity

Recent development (last 2 months) focused on:
- Map camera controls (2.5D mouse interactions, GPU transitions)
- Component enhancements (notice metadata callbacks, status indicator variants)
- Visual regression and memory leak testing infrastructure
- Bug fixes (drawer animations, sidenav collapsed state, input height consistency)

## Documentation

- **[Architecture](./architecture.md)** - Monorepo structure, dependencies, design patterns
- **[Workflows](./workflows.md)** - Development process, releases, CI/CD
- **[Packages](./packages.md)** - Complete package inventory and APIs
- **[Operations](./operations.md)** - Building, testing, troubleshooting

## External Resources

- **GitHub:** https://github.com/gohypergiant/standard-toolkit
- **npm Registry:** https://www.npmjs.com/search?q=%40accelint
- **Design Toolkit Storybook:** https://design-toolkit.accelint.io/
- **Map Toolkit Storybook:** https://map-toolkit.accelint.io/
- **License:** Apache 2.0

## Support

- **Issues:** https://github.com/gohypergiant/standard-toolkit/issues
- **Internal Contributors:** Use private team communication channels
- **External Contributors:** Comment in GitHub issues or open PRs

---

**Next Steps:**
1. Run `pnpm install && pnpm build` to set up your workspace
2. Explore [Workflows](./workflows.md) for the development process
3. Review [Architecture](./architecture.md) to understand the system design
4. Browse component Storybooks to see what's available
