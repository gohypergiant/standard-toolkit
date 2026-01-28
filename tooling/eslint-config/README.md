# @accelint/eslint-config

Shared ESLint configuration for Accelint projects.

## Status

This package is currently a placeholder. The standard-toolkit repository has migrated to [Biome](https://biomejs.dev/) for linting and formatting. See [@accelint/biome-config](../biome-config) for the active linting configuration.

## Migration to Biome

Accelint projects use Biome instead of ESLint for improved performance and integrated formatting. If you need ESLint configuration, consider:

1. Using [@accelint/biome-config](../biome-config) instead (recommended)
2. Creating your own ESLint configuration based on your project's needs

## Installation

```bash
# Using pnpm (recommended)
pnpm add -D @accelint/eslint-config

# Using npm
npm install --save-dev @accelint/eslint-config

# Using yarn
yarn add -D @accelint/eslint-config
```

## Future Plans

This package may be deprecated in a future release. For new projects, use [@accelint/biome-config](../biome-config).

## License

Apache-2.0
