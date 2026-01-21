@AGENTS.md

# Development Toolkit (DevTK) - Quick Reference

**Accelint's standard library for web applications.** Monorepo containing utility packages, design systems, and toolkits.

## Essential Commands

```bash
# Development
pnpm build                 # Build all packages
pnpm test                  # Run all tests
pnpm lint                  # Lint all code
pnpm format                # Format all code
pnpm index                 # Generate main entry exports

# Cleaning (use when things break)
pnpm clean                 # Clean everything recursively (nuclear option)
pnpm clean:deps            # Remove node_modules recursively
pnpm clean:dist            # Clean tsdown build directories recursively
pnpm clean:turbo           # Clean turborepo cache directories recursively

# Version management (changesets)
pnpm changeset             # Create a new changeset
pnpm changeset:version     # Version packages from changesets
pnpm changeset:release     # Build and publish to npm

# Linting
pnpm run lint              # Lint code
pnpm run lint:deps         # Lint dependencies with syncpack
pnpm run lint:fs           # Lint file system with ls-lint
pnpm run lint:package.     # Lint package.json with syncpack
pnpm run lint:rac          # Lint react-aria-components and @react-aria/* package versions
```

## Repository Structure

The repository has two primary workspaces: `packages` and `tooling`. 

```
packages/
├── design-toolkit/       # Design system
├── map-toolkit/          # Mapping system
├── core/                 # Core utilities
├── constants/            # Shared constants
├── converters/           # Unit converters
├── formatters/           # Value formatters
├── geo/                  # Geospatial utilities
├── math/                 # Math utilities
├── predicates/           # Type guards/predicates
├── temporal/             # Date/time utilities
├── logger/               # Logging utilities
├── hotkey-manager/       # Keyboard shortcut management
├── bus/                  # Event bus
├── dataset/              # Data management
├── websocket/            # WebSocket utilities
└── web-worker/           # Web Worker utilities
tooling/
├── biome-config/          # Configurations for biome
├── eslint-config/         # Configurations for eslint
├── prettier-config/       # Configurations for prettier
├── smeegl/               # Spritesheet and atlas generator
├── turbo-filter/          # Script to filter turborepo commands
├── typescript-config/     # Configurations for TypeScript
└── vitest-config/         # Configurations for vitest
```

## Tech Stack

- **Package Manager**: pnpm@10+ (required)
- **Node**: >=22 (required)
- **Build Tool**: Turbo (monorepo orchestration)
- **Linter/Formatter**: Biome
- **Testing**: Vitest
- **Versioning**: Changesets
- **Language**: TypeScript (strict mode)
- **Frameworks**: React, Next.js
