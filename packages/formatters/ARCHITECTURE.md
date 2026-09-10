# Architecture Overview

<!-- Part of monorepo: see [../../ARCHITECTURE.md](../../ARCHITECTURE.md) for system-wide architecture -->

> **Tech Stack:** See [../../openspec/config.yaml](../../openspec/config.yaml) for detailed stack facts, coding patterns, and domain concepts.

This document serves as a critical, living reference designed to equip agents and engineers with a rapid and comprehensive understanding of the `@accelint/formatters` package architecture. Update this document as the codebase evolves.

## 1. Project Structure

```text
packages/formatters/
├── src/                  # Package source root for formatting helpers
│   ├── iff/             # Implemented IFF/transponder formatting functions
│   ├── altitude/        # Altitude formatter subpath surface
│   ├── azimuth/         # Azimuth formatter subpath surface
│   ├── bearing/         # Bearing formatter subpath surface
│   └── index.ts         # Generated root barrel for public package API
├── README.md            # Package overview and formatter examples
├── CHANGELOG.md         # Release history
├── catalog-info.yaml    # Constellation/Backstage ownership metadata
├── package.json         # Published package metadata and subpath exports
├── tsconfig.json        # TypeScript library configuration
├── tsdown.config.ts     # ESM build configuration
├── typedoc.mjs          # API documentation generator config
├── vitest.config.js     # Shared Vitest configuration entry
└── ARCHITECTURE.md      # This document
```

## 2. High-Level System Diagram

> Complete stack facts and coding patterns are in [../../openspec/config.yaml](../../openspec/config.yaml). This section provides deployment and runtime context.

```text
Consumer application or package
            │
            ▼
     @accelint/formatters
            │
   ┌────────┼──────────────┐
   ▼        ▼              ▼
  IFF    directional    altitude
format   labels/text    formatting
            │
            ▼
   Human-readable strings
```

This package has no server, database, or hosted runtime. It is a published utility library for converting raw values into display-oriented strings.

## 3. Core Components

### 3.1. Frontend

**Name:** Consumer integration layer

**Description:** Applications and libraries import formatting helpers to convert low-level values into display-ready strings, especially for IFF/transponder-oriented outputs.

**Technologies:** TypeScript, ESM

**Deployment:** Bundled into consumer applications or libraries; published to npm as a library

### 3.2. Backend Services

#### 3.2.1. Formatting Runtime

**Name:** Formatting runtime

**Description:** Owns the package’s display-focused formatting functions, primarily around IFF/transponder formatting today.

**Technologies:** TypeScript, ESM utility functions

**Deployment:** Runs inline in the importing JavaScript runtime

#### 3.2.2. Subpath Formatter Modules

**Name:** Subpath formatter modules

**Description:** Exposes formatter families through focused subpaths for future expansion while keeping the current root export surface small.

**Technologies:** TypeScript subpath exports

**Deployment:** Imported via root and formatter-specific subpaths

## 4. Data Stores

### 4.1. Runtime State

**Name:** None

**Type:** No persistent or shared store

**Purpose:** Formatting functions are stateless and operate on caller-provided inputs.

**Key Schemas / Collections:** N/A

### 4.2. Formatting Inputs

**Name:** Caller-provided values

**Type:** In-memory numbers and strings

**Purpose:** Represent transient values that need to be normalized for display.

**Key Schemas / Collections:** IFF/transponder values, direction-like values, altitude-like values

## 5. External Integrations / APIs

| Service | Purpose | Integration Method |
|---------|---------|-------------------|
| None | The package is self-contained and formats local values only | N/A |

## 6. Deployment & Infrastructure

**Cloud Provider:** None. This package is a published library, not a hosted service.

**Key Services Used:** npm registry for package distribution; GitHub Actions for CI/release automation; Constellation/Backstage metadata via `catalog-info.yaml`

**CI/CD Pipeline:** GitHub Actions runs repo-wide build, test, lint, and format checks. Release workflows use Changesets to version and publish the package.

**Monitoring & Logging:** Not applicable. The package has no hosted runtime.

## 7. Security Considerations

**Authentication:** Not applicable. This package does not implement authentication.

**Authorization:** Not applicable. This package is a formatting utility.

**Data Encryption:** Not applicable. The package does not persist or transmit data.

**Key Security Tools / Practices:** Stateless formatting functions, repo-wide CI verification, and GitHub Actions security scanning.

## 8. Development & Testing Environment

> Testing patterns and standards are defined in [../../openspec/config.yaml](../../openspec/config.yaml); this section covers local setup and commands.

**Local Setup:** Use Node.js 22+ and pnpm 10+. Install from the repo root, then use repo or package-local scripts.

**Testing Frameworks:** Vitest with the shared no-DOM base config. Existing tests focus on positive, negative, and edge-case formatter outputs.

**Code Quality Tools:** Biome, publint, Turbo, tsdown, and repo-wide formatting/lint automation.

## 9. Future Considerations / Roadmap

- No package-specific roadmap items were provided at review time.
- No package-specific architectural technical debt was provided at review time.

## 10. Project Identification

**Project Name:** `@accelint/formatters`

**Repository URL:** https://github.com/gohypergiant/standard-toolkit

**Primary Contact / Team:** `group:default/pathfinder`

**Date of Last Update:** 2026-09-10

## 11. Glossary / Acronyms

| Term | Definition |
|------|-----------|
| IFF | Identification Friend or Foe; a tactical/aviation identification concept reflected in current formatter coverage |
| Formatter | Function that converts raw values into human-readable display strings |
| Subpath export | Package entry such as `@accelint/formatters/iff` for narrower imports |
