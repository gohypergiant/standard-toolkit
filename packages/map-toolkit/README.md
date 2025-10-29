# @accelint/map-toolkit

A collection of components and utilities to simplify visualizing and working with geospatial data. This toolkit provides ready-to-use map components and layers for deck.gl and MapLibre, making it easier to build interactive mapping applications.

## What is Map Toolkit?

Map Toolkit is a comprehensive library that provides:

- **Deck.gl Components**: Pre-configured layers and components for rendering geospatial data, including symbol layers for military symbology (MIL-STD-2525)
- **MapLibre Integration**: Components and utilities for working with MapLibre GL JS
- **React Support**: React-friendly components with hooks and utilities via `@deckgl-fiber-renderer`
- **Geospatial Utilities**: Helper functions and decorators for common mapping tasks

The package is organized by technology (e.g., `deckgl/`, `maplibre/`) with feature-specific exports, allowing you to import only what you need.

## Installation

```sh
npm install @accelint/map-toolkit
```

### Optional Dependencies

To minimize bundle size, Map Toolkit uses optional dependencies. Install only the technologies you need:

```sh
# For deck.gl features
pnpm i --save-optional @deck.gl/core @deck.gl/layers @deck.gl/extensions

# For React/deck.gl features
pnpm i --save-optional react @deckgl-fiber-renderer/dom

# For MapLibre features
pnpm i --save-optional maplibre-gl

# For military symbology
pnpm i --save-optional milsymbol
```

## Usage

Import components from their technology-specific paths:

```ts
// Deck.gl components
import { SymbolLayer } from '@accelint/map-toolkit/deckgl';

// MapLibre components
import { /* components */ } from '@accelint/map-toolkit/maplibre';

// React/Fiber components
import { /* components */ } from '@accelint/map-toolkit/deckgl/fiber';
```

For detailed examples and interactive demos, see the [Storybook documentation](https://map-toolkit.accelint.io/?path=/docs/deckgl-symbol-layer--docs).

## Running Locally

To work on Map Toolkit locally:

```bash
# Install dependencies
pnpm i

# Run Storybook development server
pnpm --filter=@accelint/map-toolkit preview

# Build the package
pnpm --filter=@accelint/map-toolkit build
```

If you encounter errors, try running `pnpm build` after installing dependencies, then run the preview command again.

## Testing

Run the test suite:

```bash
# Run tests once
pnpm --filter=@accelint/map-toolkit test

# Run tests in watch mode
pnpm --filter=@accelint/map-toolkit test:watch

# Run benchmarks
pnpm --filter=@accelint/map-toolkit bench
```

## Documentation

- **[Storybook](https://map-toolkit.accelint.io/?path=/docs/deckgl-symbol-layer--docs)** - Interactive component documentation and examples
- **[Changelog](./CHANGELOG.md)** - Release notes and version history

## Package Structure

```
packages/map-toolkit/
  src/
    deckgl/           # Deck.gl layers and components
    maplibre/         # MapLibre utilities and components
    decorators/       # Shared decorators and utilities
```

Each technology folder exports its components via barrel files, and individual features are also exported via `package.json` for granular imports.

## License

Apache-2.0
