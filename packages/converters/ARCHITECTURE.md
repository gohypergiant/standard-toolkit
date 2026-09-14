# Architecture Overview

<!-- Part of monorepo: see [../../ARCHITECTURE.md](../../ARCHITECTURE.md) for system-wide architecture -->

> **Tech Stack:** See [../../openspec/config.yaml](../../openspec/config.yaml) for detailed stack facts, coding patterns, and domain concepts.

This document serves as a critical, living reference designed to equip agents and engineers with a rapid and comprehensive understanding of the `@accelint/converters` package architecture. Update this document as the codebase evolves.

## 1. Project Structure

```text
packages/converters/
├── src/                      # Package source root for focused conversion utilities
│   ├── boolean-to-number/    # Boolean-to-numeric conversion
│   ├── to-boolean/           # Boolean-like value parsing
│   ├── css-rgba/             # CSS RGBA string/object conversion
│   ├── glsl/                 # GLSL-friendly color conversion helpers
│   ├── hex/                  # Hex color conversion helpers
│   ├── zxy-to-bbox/          # Slippy-tile to bbox conversion
│   ├── azimuth-to-cardinal/  # Azimuth label conversion
│   └── index.ts              # Generated root barrel for primary exports
├── README.md                 # Package overview and dependency notes
├── CHANGELOG.md              # Release history
├── catalog-info.yaml         # Constellation/Backstage ownership metadata
├── package.json              # Published package metadata and subpath exports
├── tsconfig.json             # TypeScript library configuration
├── tsdown.config.ts          # ESM build configuration
├── typedoc.mjs               # API documentation generator config
├── vitest.config.js          # Shared Vitest configuration entry
└── ARCHITECTURE.md           # This document
```

## 2. High-Level System Diagram

> Complete stack facts and coding patterns are in [../../openspec/config.yaml](../../openspec/config.yaml). This section provides deployment and runtime context.

```text
Consumer application or package
            │
            ▼
   @accelint/converters
            │
   ┌────────┼───────────────┬──────────────┐
   ▼        ▼               ▼              ▼
 booleans  colors         geospatial     labels
 parsing   conversions    tile/bbox      azimuth/cardinal
            │
            ▼
   Pure conversion outputs
```

This package has no server, database, or hosted runtime. It is a published utility library that transforms caller-provided values between representations.

## 3. Core Components

### 3.1. Frontend

**Name:** Consumer integration layer

**Description:** Consumer applications and other `@accelint/*` packages call these converters to normalize booleans, colors, and geospatial values for rendering, validation, or display.

**Technologies:** TypeScript, ESM

**Deployment:** Bundled into consumer applications or libraries; published to npm as a library

### 3.2. Backend Services

#### 3.2.1. Conversion Runtime

**Name:** Conversion runtime

**Description:** Owns the pure conversion functions that map values from one representation to another, such as hex to RGBA, boolean-like values to booleans, or tile coordinates to bounding boxes.

**Technologies:** TypeScript, ESM utility functions

**Deployment:** Runs inline in the importing JavaScript runtime

#### 3.2.2. Specialized Conversion Modules

**Name:** Specialized conversion modules

**Description:** Splits the package into narrowly focused modules so consumers can import only the needed converter families, including color, boolean, and geospatial conversions.

**Technologies:** TypeScript subpath exports

**Deployment:** Imported through root and subpath entries such as `@accelint/converters/hex`

## 4. Data Stores

### 4.1. Runtime State

**Name:** None

**Type:** No persistent or shared store

**Purpose:** Conversion functions are stateless and operate on caller-provided inputs.

**Key Schemas / Collections:** N/A

### 4.2. Conversion Payloads

**Name:** Caller-provided values

**Type:** In-memory strings, numbers, booleans, tuples, and color objects

**Purpose:** Represent the transient values being converted between formats.

**Key Schemas / Collections:** boolean-like values, RGBA values, hex strings, z/x/y tile coordinates

## 5. External Integrations / APIs

| Service | Purpose | Integration Method |
|---------|---------|-------------------|
| `@accelint/constants` | Optional shared constants for some converter families | Optional workspace dependency |
| `@accelint/predicates` | Optional validation helpers for some converter families | Optional workspace dependency |
| `@accelint/math` | Optional numeric helpers for GLSL/color conversions | Optional workspace dependency |

## 6. Deployment & Infrastructure

**Cloud Provider:** None. This package is a published library, not a hosted service.

**Key Services Used:** npm registry for package distribution; GitHub Actions for CI/release automation; Constellation/Backstage metadata via `catalog-info.yaml`

**CI/CD Pipeline:** GitHub Actions runs repo-wide build, test, lint, and format checks. Release workflows use Changesets to publish the package. Local package builds use `tsdown`.

**Monitoring & Logging:** Not applicable. The package has no hosted runtime.

## 7. Security Considerations

**Authentication:** Not applicable. This package does not implement authentication.

**Authorization:** Not applicable. This package performs local value conversion only.

**Data Encryption:** Not applicable. The package does not persist or transmit data.

**Key Security Tools / Practices:** Validation-friendly conversion boundaries, optional predicate/constants integration for safer normalization, GitHub Actions security scanning, and standard CI verification.

## 8. Development & Testing Environment

> Testing patterns and standards are defined in [../../openspec/config.yaml](../../openspec/config.yaml); this section covers local setup and commands.

**Local Setup:** Use Node.js 22+ and pnpm 10+. Install from the repo root. Some converter families document optional companion dependencies such as `@accelint/constants`, `@accelint/predicates`, and `@accelint/math`.

**Testing Frameworks:** Vitest with the shared no-DOM base config. Tests use parameterized tables to cover conversion matrices and edge cases.

**Code Quality Tools:** Biome, publint, Turbo, tsdown, and repo-wide formatting/lint automation.

## 9. Future Considerations / Roadmap

- No package-specific roadmap items were provided at review time.
- No package-specific architectural technical debt was provided at review time.

## 10. Project Identification

**Project Name:** `@accelint/converters`

**Repository URL:** https://github.com/gohypergiant/standard-toolkit

**Primary Contact / Team:** `group:default/pathfinder`

**Date of Last Update:** 2026-09-10

## 11. Glossary / Acronyms

| Term | Definition |
|------|-----------|
| CSS RGBA | CSS color representation such as `rgba(255, 0, 0, 1)` |
| GLSL color | Color data normalized for shader-oriented usage |
| Z/X/Y tile | Slippy-map tile coordinate triplet used to derive a bounding box |
| Cardinal azimuth label | Human-readable direction derived from an azimuth value |
