# @accelint/typescript-config

Shared [TypeScript](https://www.typescriptlang.org/) configurations used across Accelint projects. Provides strict, production-ready TypeScript settings for various project types and build targets.

## Features

- **Multiple Project Types**: Configurations for apps, libraries, and monorepo packages
- **DOM/No-DOM Variants**: Separate configs for browser and non-browser environments
- **Build Tool Support**: Optimized settings for both TSC and bundlers (Vite, Webpack, etc.)
- **Strict Mode**: All configurations use strict TypeScript settings
- **Modular Design**: Mix and match configurations based on your needs

## Installation

```bash
# Using pnpm (recommended)
pnpm add -D @accelint/typescript-config

# Using npm
npm install --save-dev @accelint/typescript-config

# Using yarn
yarn add -D @accelint/typescript-config
```

## Available Configurations

### TSC (TypeScript Compiler)

For projects using `tsc` directly:

#### DOM Environments (Browser)

- `@accelint/typescript-config/tsc/dom/app` - Web applications
- `@accelint/typescript-config/tsc/dom/library` - Standalone libraries
- `@accelint/typescript-config/tsc/dom/library-monorepo` - Libraries in monorepos

#### No-DOM Environments (Node.js, etc.)

- `@accelint/typescript-config/tsc/no-dom/app` - Node.js applications
- `@accelint/typescript-config/tsc/no-dom/library` - Node.js libraries
- `@accelint/typescript-config/tsc/no-dom/library-monorepo` - Node.js libraries in monorepos

### Bundler (Vite, Webpack, etc.)

For projects using bundlers:

#### DOM Environments

- `@accelint/typescript-config/bundler/dom` - Web applications with bundlers
- `@accelint/typescript-config/bundler/dom/app` - Same as above
- `@accelint/typescript-config/bundler/dom/library` - Libraries with bundlers
- `@accelint/typescript-config/bundler/dom/library-monorepo` - Monorepo libraries with bundlers

#### No-DOM Environments

- `@accelint/typescript-config/bundler/no-dom` - Node.js with bundlers
- `@accelint/typescript-config/bundler/no-dom/app` - Same as above
- `@accelint/typescript-config/bundler/no-dom/library` - Node.js libraries with bundlers
- `@accelint/typescript-config/bundler/no-dom/library-monorepo` - Monorepo Node.js libraries with bundlers

## Usage

### Web Application (React, Vue, etc.)

For a web app using a bundler like Vite:

```json
{
  "extends": "@accelint/typescript-config/bundler/dom/app",
  "compilerOptions": {
    "outDir": "./dist"
  },
  "include": ["src"]
}
```

### Node.js Application

For a Node.js app using `tsc`:

```json
{
  "extends": "@accelint/typescript-config/tsc/no-dom/app",
  "compilerOptions": {
    "outDir": "./dist"
  },
  "include": ["src"]
}
```

### Library Package

For a standalone library:

```json
{
  "extends": "@accelint/typescript-config/tsc/dom/library",
  "compilerOptions": {
    "outDir": "./dist",
    "declarationDir": "./dist/types"
  },
  "include": ["src"]
}
```

### Monorepo Package

For a package within a monorepo:

```json
{
  "extends": "@accelint/typescript-config/tsc/dom/library-monorepo",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"]
}
```

## Configuration Differences

### TSC vs Bundler

**TSC configurations** are for projects that:

- Use `tsc` for compilation
- Need full type checking and declaration generation
- Output JavaScript files directly

**Bundler configurations** are for projects that:

- Use Vite, Webpack, or similar bundlers
- Only need type checking (bundler handles compilation)
- Have more relaxed module resolution

### DOM vs No-DOM

**DOM configurations** include:

- Browser-specific type definitions
- DOM libraries (`DOM`, `DOM.Iterable`)
- Web API types

**No-DOM configurations** are for:

- Node.js applications
- Server-side code
- CLI tools
- Libraries without browser dependencies

### App vs Library vs Library-Monorepo

**App configurations** are optimized for:

- Applications (not meant to be published)
- Relaxed declaration generation
- Fast compilation

**Library configurations** are for:

- Publishable packages
- Strict declaration generation
- Type safety for consumers

**Library-Monorepo configurations** are for:

- Packages within a monorepo
- Composite project support
- Incremental builds

## Common Overrides

### Custom Path Aliases

```json
{
  "extends": "@accelint/typescript-config/bundler/dom/app",
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"]
    }
  }
}
```

### Different Module System

```json
{
  "extends": "@accelint/typescript-config/tsc/no-dom/app",
  "compilerOptions": {
    "module": "CommonJS"
  }
}
```

### JSX Runtime

For React 17+ with automatic JSX runtime:

```json
{
  "extends": "@accelint/typescript-config/bundler/dom/app",
  "compilerOptions": {
    "jsx": "react-jsx"
  }
}
```

## Best Practices

1. **Choose the right configuration**: Match your build tool (tsc vs bundler) and environment (DOM vs no-DOM)
2. **Minimize overrides**: The base configurations are production-tested
3. **Use composite for monorepos**: Enable `composite: true` for better build performance
4. **Keep includes specific**: Only include source directories you need to compile

## Troubleshooting

### Module Resolution Issues

If you encounter module resolution errors:

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "resolveJsonModule": true
  }
}
```

### Type Declaration Issues

For libraries, ensure declarations are generated:

```json
{
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true,
    "emitDeclarationOnly": false
  }
}
```

## License

Apache-2.0
