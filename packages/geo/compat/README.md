# Compatibility Layer Structure

This document explains the organization of compatibility fixes for third-party dependencies in the @accelint/geo package.

## Directory Structure

```
packages/geo/
├── compat/                   # Compatibility fixes for third-party packages
│   └── ngageoint/            # Fixes for @ngageoint packages
├── .storybook/
│   └── main.ts              # Uses compat/ngageoint/vite-plugin
└── tsup.config.ts           # Uses compat/ngageoint/esbuild-plugin
```

## Why `compat/`?

The `compat/` directory houses **compatibility layers** for third-party dependencies that need fixes to work in modern browser/ESM environments.

### Benefits:
- **Clear separation**: Vendor fixes are separate from your core code
- **Organized by vendor**: Each problematic dependency gets its own subdirectory
- **Single source of truth**: Transformation logic is centralized
- **Build-agnostic**: Plugins for different build tools share the same transformations
- **Scalable**: Easy to add more vendor fixes if needed
- **Well-documented**: Each fix has its own README explaining the problem

## Adding New Compatibility Layers

If you need to fix another problematic dependency:

1. Create a new directory: `compat/vendor-name/`
2. Add the core transformation logic: `transform.ts`
3. Create build-specific plugins: `vite-plugin.ts`, `esbuild-plugin.ts`, etc.
4. Document the problem and solution: `README.md`
5. Export from `index.ts` for convenient imports
