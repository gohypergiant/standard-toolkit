# Architecture Overview

<!-- Part of monorepo: see [../../ARCHITECTURE.md](../../ARCHITECTURE.md) for system-wide architecture -->

> **Tech Stack:** See [../../openspec/config.yaml](../../openspec/config.yaml) for detailed stack facts, coding patterns, and domain concepts.

This document serves as a critical, living reference designed to equip agents and engineers with a rapid and comprehensive understanding of the `@accelint/constants` package architecture. Update this document as the codebase evolves.

## 1. Project Structure

```text
packages/constants/
├── src/                  # Package source root for shared constant modules
│   ├── color/            # Color regexes and related constant values
│   ├── coordinates/      # Coordinate defaults and shared coordinate constants
│   ├── units/            # Unit symbols and unit mapping constants
│   └── index.ts          # Generated root barrel exporting public package API
├── README.md             # Package overview and usage examples
├── CHANGELOG.md          # Release history
├── catalog-info.yaml     # Constellation/Backstage ownership metadata
├── package.json          # Published package metadata and subpath exports
├── tsconfig.json         # TypeScript library configuration
├── tsdown.config.ts      # ESM build configuration
├── typedoc.mjs           # API documentation generator config
├── vitest.config.js      # Shared Vitest configuration entry
└── ARCHITECTURE.md       # This document
```

## 2. High-Level System Diagram

> Complete stack facts and coding patterns are in [../../openspec/config.yaml](../../openspec/config.yaml). This section provides deployment and runtime context.

```text
Consumer application or library
            │
            ▼
   @accelint/constants
            │
   ┌────────┼────────┐
   ▼        ▼        ▼
 color   coordinates  units
 regexes   defaults   symbols/maps
            │
            ▼
   Static exported values only
```

This package has no server, database, or hosted runtime. It is a published utility library that provides static values to other packages and applications.

## 3. Core Components

### 3.1. Frontend

**Name:** Consumer integration layer

**Description:** Consumer applications and other `@accelint/*` packages import `@accelint/constants` to share canonical values such as regexes, coordinate defaults, and unit symbols without re-declaring them.

**Technologies:** TypeScript, ESM

**Deployment:** Bundled into consumer applications or libraries; published to npm as a library

### 3.2. Backend Services

#### 3.2.1. Static Constants Runtime

**Name:** Static constants runtime

**Description:** Owns the public constant surface for colors, coordinates, and units. The package provides importable values only and does not execute long-lived runtime behavior.

**Technologies:** TypeScript, generated ESM exports

**Deployment:** Runs wherever the importing JavaScript module graph is evaluated

#### 3.2.2. Domain Constant Modules

**Name:** Domain constant modules

**Description:** Separates constant concerns into focused modules for color validation, coordinate defaults, and unit names/symbols so consumers can import narrowly scoped values.

**Technologies:** TypeScript subpath exports

**Deployment:** Imported by consumers through root or subpath exports such as `@accelint/constants/color`

## 4. Data Stores

### 4.1. Static Constant Tables

**Name:** Static constant exports

**Type:** In-memory module constants

**Purpose:** Provide canonical shared values without mutable runtime state.

**Key Schemas / Collections:** color regexes, unit symbol maps

### 4.2. Default Coordinate Values

**Name:** Coordinate defaults

**Type:** Static object literals

**Purpose:** Provide shared coordinate baseline values and coordinate-related constants across packages.

**Key Schemas / Collections:** default coordinate object

## 5. External Integrations / APIs

| Service | Purpose | Integration Method |
|---------|---------|-------------------|
| None | The package is self-contained and exports static values only | N/A |

## 6. Deployment & Infrastructure

**Cloud Provider:** None. This package is a published library, not a hosted service.

**Key Services Used:** npm registry for package distribution; GitHub Actions for CI/release automation; Constellation/Backstage metadata via `catalog-info.yaml`

**CI/CD Pipeline:** GitHub Actions runs repo-wide build, test, lint, and format checks. Release workflows use Changesets to version and publish public npm packages. Package builds use `tsdown` and emit ESM output plus declaration files.

**Monitoring & Logging:** Not applicable. The package has no hosted runtime or operational monitoring stack.

## 7. Security Considerations

**Authentication:** Not applicable. This package does not implement authentication.

**Authorization:** Not applicable. This package exports static constants only.

**Data Encryption:** Not applicable. The package does not persist or transmit data.

**Key Security Tools / Practices:** Shared validation-oriented constants such as regexes, GitHub Actions security scanning, and standard CI verification through build, test, lint, and format.

## 8. Development & Testing Environment

> Testing patterns and standards are defined in [../../openspec/config.yaml](../../openspec/config.yaml); this section covers local setup and commands.

**Local Setup:** Use Node.js 22+ and pnpm 10+. Install dependencies from the repo root with `pnpm install`, then use the repo verification gate or run package-local commands from `packages/constants`.

**Testing Frameworks:** Vitest configuration is present through the shared DOM base config. This package is primarily static exports and currently has little or no package-local runtime test surface.

**Code Quality Tools:** Biome, publint, Turbo, tsdown, and repo-wide formatting/lint automation.

## 9. Future Considerations / Roadmap

- No package-specific roadmap items were provided at review time.
- No package-specific architectural technical debt was provided at review time.

## 10. Project Identification

**Project Name:** `@accelint/constants`

**Repository URL:** https://github.com/gohypergiant/standard-toolkit

**Primary Contact / Team:** `group:default/pathfinder`

**Date of Last Update:** 2026-09-10

## 11. Glossary / Acronyms

| Term | Definition |
|------|-----------|
| HEX_REGEX | Shared regular expression constant for validating hex color strings |
| DEFAULT_COORDINATE | Shared default coordinate value reused across geospatial packages |
| Unit symbol map | Constant mapping between unit identifiers and their human-readable symbols |
