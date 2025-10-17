# Storybook for @accelint/geo

This directory contains the Storybook configuration for testing the `@accelint/geo` package in a browser environment.

## Quick Start

```bash
# From the geo package directory
pnpm preview

# Or from the root
pnpm --filter @accelint/geo preview
```

This will start Storybook at [http://localhost:6006](http://localhost:6006).

## Purpose

Storybook provides an interactive development environment where you can:
- Test coordinate parsing functions in the browser
- Verify that `@ngageoint` packages work correctly
- Debug edge cases with real-world coordinates
- View component behavior in isolation

## Configuration

### Main Configuration (`.storybook/main.ts`)

The Storybook is configured as a React + Vite project:

```typescript
export default {
  stories: ['../src/**/*.stories.tsx'],
  framework: '@storybook/react-vite',
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-storysource',
  ],
};
```

Key features:
- **TypeScript support** with path aliases (via `vite-tsconfig-paths`)
- **MDX support** for documentation
- **Source code viewing** via `addon-storysource`
- **Compatibility fixes** for `@ngageoint` packages (see [compat layer docs](../compat/ngageoint/README.md))

### TypeScript Configuration (`.storybook/tsconfig.json`)

Extends the package's base TypeScript configuration with React JSX support:

```json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "jsx": "react-jsx"
  }
}
```

## Why Storybook?

1. **Browser testing** - The `@ngageoint` packages need to be tested in an actual browser environment, not just Node.js
2. **Interactive debugging** - Easy to test edge cases and verify transformations work
3. **Visual feedback** - See coordinate parsing results in real-time
4. **Documentation** - Stories serve as examples of how to use the API
