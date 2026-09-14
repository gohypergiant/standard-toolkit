# Architecture Overview

<!-- Part of monorepo: see [../../ARCHITECTURE.md](../../ARCHITECTURE.md) for system-wide architecture -->

> **Tech Stack:** See [../../openspec/config.yaml](../../openspec/config.yaml) for detailed stack facts, coding patterns, and domain concepts.

This document serves as a critical, living reference designed to equip agents and engineers with a rapid and comprehensive understanding of the `@accelint/geo` package architecture. Update this document as the codebase evolves.

## 1. Project Structure

```text
packages/geo/
├── src/                          # Package source root for coordinate systems and parsing
│   ├── coordinates/             # Coordinate factories, parsers, and formatters
│   │   ├── latlon/              # Decimal degrees, DDM, and DMS support
│   │   ├── mgrs/                # MGRS parsing and formatting
│   │   ├── utm/                 # UTM parsing and formatting
│   │   └── coordinate.ts        # Shared coordinate entrypoint and types
│   ├── cartesian.ts             # Cartesian helper functions
│   ├── patterning.ts            # Shared parsing/pattern-generation helpers
│   └── index.ts                 # Generated root barrel exporting public package API
├── README.md                    # Package overview and coordinate system examples
├── CHANGELOG.md                 # Release history
├── catalog-info.yaml            # Constellation/Backstage ownership metadata
├── package.json                 # Published package metadata and subpath exports
├── tsconfig.json                # TypeScript library configuration
├── tsdown.config.ts             # ESM build configuration
├── typedoc.mjs                  # API documentation generator config
├── vitest.config.js             # Shared Vitest configuration entry
└── ARCHITECTURE.md              # This document
```

## 2. High-Level System Diagram

> Complete stack facts and coding patterns are in [../../openspec/config.yaml](../../openspec/config.yaml). This section provides deployment and runtime context.

```text
Consumer application or package
            │
            ▼
         @accelint/geo
            │
   ┌────────┼───────────────┬──────────────┐
   ▼        ▼               ▼              ▼
 lat/lon   MGRS            UTM        cartesian/patterning
 parsing   parsing         parsing       helpers
            │
            ▼
 Normalized coordinate objects and strings
```

This package has no server, database, or hosted runtime. It is a published geospatial utility library for parsing, validating, and formatting coordinate data.

## 3. Core Components

### 3.1. Frontend

**Name:** Consumer integration layer

**Description:** Consumer applications and libraries import `@accelint/geo` to normalize coordinate inputs, format outputs for tactical or geospatial displays, and convert among supported coordinate systems.

**Technologies:** TypeScript, ESM, geodesy-backed coordinate support

**Deployment:** Bundled into consumer applications or libraries; published to npm as a library

### 3.2. Backend Services

#### 3.2.1. Coordinate Runtime

**Name:** Coordinate runtime

**Description:** Owns the package’s coordinate factories and parsing/formatting behavior for latitude/longitude, MGRS, and UTM coordinate systems.

**Technologies:** TypeScript, ESM utility modules, `geodesy`

**Deployment:** Runs inline in the importing JavaScript runtime

#### 3.2.2. Parsing and Formatting Modules

**Name:** Parsing and formatting modules

**Description:** Splits each coordinate family into focused helpers so consumers can import the exact system or formatter they need, while shared internals handle patterning and normalization.

**Technologies:** TypeScript subpath exports, composable parser helpers

**Deployment:** Imported through root and granular subpath entries such as `@accelint/geo/coordinates/mgrs`

## 4. Data Stores

### 4.1. Coordinate Payloads

**Name:** Coordinate inputs and outputs

**Type:** In-memory strings, tuples, and structured coordinate objects

**Purpose:** Represent transient coordinate data being parsed, normalized, formatted, or converted between systems.

**Key Schemas / Collections:** decimal degrees, DDM, DMS, MGRS, UTM, lat/lon tuples

### 4.2. Coordinate Formatting Cache

**Name:** Coordinate format cache

**Type:** In-memory cache objects

**Purpose:** Reuse normalized coordinate format state during formatting and conversion flows.

**Key Schemas / Collections:** formatted lat/lon cache objects

## 5. External Integrations / APIs

| Service | Purpose | Integration Method |
|---------|---------|-------------------|
| `geodesy` | Coordinate math and geodesic conversion support | Runtime dependency |

## 6. Deployment & Infrastructure

**Cloud Provider:** None. This package is a published library, not a hosted service.

**Key Services Used:** npm registry for package distribution; GitHub Actions for CI/release automation; Constellation/Backstage metadata via `catalog-info.yaml`

**CI/CD Pipeline:** GitHub Actions runs repo-wide build, test, lint, and format checks. Release workflows use Changesets to publish the package. Local package builds use `tsdown`.

**Monitoring & Logging:** Not applicable. The package has no hosted runtime.

## 7. Security Considerations

**Authentication:** Not applicable. This package does not implement authentication.

**Authorization:** Not applicable. This package is a coordinate parsing and formatting utility.

**Data Encryption:** Not applicable. The package does not persist or transmit data on its own.

**Key Security Tools / Practices:** Detailed input validation for coordinate parsing, explicit error reporting for invalid inputs, repo-wide CI verification, and GitHub Actions security scanning.

## 8. Development & Testing Environment

> Testing patterns and standards are defined in [../../openspec/config.yaml](../../openspec/config.yaml); this section covers local setup and commands.

**Local Setup:** Use Node.js 22+ and pnpm 10+. Install from the repo root, then run repo-wide verification or package-local scripts from `packages/geo`.

**Testing Frameworks:** Vitest with the shared no-DOM base config. Tests use large coordinate matrices and parameterized cases to verify parser and formatter behavior across supported systems.

**Code Quality Tools:** Biome, publint, Turbo, tsdown, and repo-wide formatting/lint automation.

## 9. Future Considerations / Roadmap

- No package-specific roadmap items were provided at review time.
- No package-specific architectural technical debt was provided at review time.

## 10. Project Identification

**Project Name:** `@accelint/geo`

**Repository URL:** https://github.com/gohypergiant/standard-toolkit

**Primary Contact / Team:** `group:default/pathfinder`

**Date of Last Update:** 2026-09-10

## 11. Glossary / Acronyms

| Term | Definition |
|------|-----------|
| DD | Decimal Degrees coordinate format |
| DDM | Degrees Decimal Minutes coordinate format |
| DMS | Degrees Minutes Seconds coordinate format |
| MGRS | Military Grid Reference System |
| UTM | Universal Transverse Mercator coordinate system |
