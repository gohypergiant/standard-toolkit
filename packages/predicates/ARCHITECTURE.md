# Architecture Overview

<!-- Part of monorepo: see [../../ARCHITECTURE.md](../../ARCHITECTURE.md) for system-wide architecture -->

> **Tech Stack:** See [../../openspec/config.yaml](../../openspec/config.yaml) for detailed stack facts, coding patterns, and domain concepts.

This document serves as a critical, living reference designed to equip agents and engineers with a rapid and comprehensive understanding of the `@accelint/predicates` package architecture. Update this document as the codebase evolves.

## 1. Project Structure

```text
packages/predicates/
├── src/                     # Package source root for predicate families
│   ├── does-*/              # String-oriented positive and negative predicates
│   ├── is-*/                # Type, numeric, color, geospatial, and worker predicates
│   ├── test.setup.ts        # Shared test configuration, including fast-check tuning
│   └── index.ts             # Generated root barrel exporting public package API
├── README.md                # Package overview and categorized predicate examples
├── CHANGELOG.md             # Release history
├── catalog-info.yaml        # Constellation/Backstage ownership metadata
├── package.json             # Published package metadata and subpath exports
├── tsconfig.json            # TypeScript library configuration
├── tsdown.config.ts         # ESM build configuration
├── typedoc.mjs              # API documentation generator config
├── vitest.config.js         # Shared Vitest configuration entry
└── ARCHITECTURE.md          # This document
```

## 2. High-Level System Diagram

> Complete stack facts and coding patterns are in [../../openspec/config.yaml](../../openspec/config.yaml). This section provides deployment and runtime context.

```text
Consumer application or package
            │
            ▼
      @accelint/predicates
            │
 ┌──────────┼──────────────┬──────────────┬─────────────┐
 ▼          ▼              ▼              ▼             ▼
type     numeric       string        geospatial      color/worker
checks   checks        checks        validation      validation
            │
            ▼
      Boolean predicate results
```

This package has no server, database, or hosted runtime. It is a published utility library for reusable validation and boolean decision helpers.

## 3. Core Components

### 3.1. Frontend

**Name:** Consumer integration layer

**Description:** Consumer applications and libraries import `@accelint/predicates` to validate inputs, build expressive conditional logic, and share reusable checks across UI and utility packages.

**Technologies:** TypeScript, ESM, fast-check-backed testing

**Deployment:** Bundled into consumer applications or libraries; published to npm as a library

### 3.2. Backend Services

#### 3.2.1. Predicate Runtime

**Name:** Predicate runtime

**Description:** Owns the package’s reusable boolean-returning helpers spanning types, ranges, strings, colors, geospatial values, and worker-related checks.

**Technologies:** TypeScript, ESM utility functions

**Deployment:** Runs inline in the importing JavaScript runtime

#### 3.2.2. Predicate Families

**Name:** Predicate family modules

**Description:** Organizes the package into many narrowly scoped predicate modules so consumers can import specific checks instead of the entire surface.

**Technologies:** TypeScript subpath exports

**Deployment:** Imported through root and granular entries such as `@accelint/predicates/is-number`

## 4. Data Stores

### 4.1. Runtime State

**Name:** None

**Type:** No persistent or shared store

**Purpose:** Predicates are stateless and operate on caller-provided inputs.

**Key Schemas / Collections:** N/A

### 4.2. Validation Inputs

**Name:** Caller-provided values

**Type:** In-memory primitives, objects, strings, tuples, and browser/worker values

**Purpose:** Represent the transient inputs evaluated by predicate functions.

**Key Schemas / Collections:** numbers, strings, color strings, coordinate values, worker objects

## 5. External Integrations / APIs

| Service | Purpose | Integration Method |
|---------|---------|-------------------|
| `@accelint/core` | Shared functional helpers and type support | Peer dependency |
| `@accelint/constants` | Optional shared constants for some predicate families | Optional dependency |

## 6. Deployment & Infrastructure

**Cloud Provider:** None. This package is a published library, not a hosted service.

**Key Services Used:** npm registry for package distribution; GitHub Actions for CI/release automation; Constellation/Backstage metadata via `catalog-info.yaml`

**CI/CD Pipeline:** GitHub Actions runs repo-wide build, test, lint, and format checks. Release workflows use Changesets to publish the package. Local package builds use `tsdown`.

**Monitoring & Logging:** Not applicable. The package has no hosted runtime.

## 7. Security Considerations

**Authentication:** Not applicable. This package does not implement authentication.

**Authorization:** Not applicable. This package provides validation and boolean helpers rather than access control.

**Data Encryption:** Not applicable. The package does not persist or transmit data.

**Key Security Tools / Practices:** Validation helpers for coordinates, colors, worker values, and type checks; property-based testing via fast-check; repo-wide CI verification; and GitHub Actions security scanning.

## 8. Development & Testing Environment

> Testing patterns and standards are defined in [../../openspec/config.yaml](../../openspec/config.yaml); this section covers local setup and commands.

**Local Setup:** Use Node.js 22+ and pnpm 10+. Install from the repo root, then run repo-wide verification or package-local scripts from `packages/predicates`.

**Testing Frameworks:** Vitest with the shared no-DOM base config, fast-check for property-oriented coverage, and worker-oriented tests where relevant.

**Code Quality Tools:** Biome, publint, Turbo, tsdown, and repo-wide formatting/lint automation.

## 9. Future Considerations / Roadmap

- No package-specific roadmap items were provided at review time.
- No package-specific architectural technical debt was provided at review time.

## 10. Project Identification

**Project Name:** `@accelint/predicates`

**Repository URL:** https://github.com/gohypergiant/standard-toolkit

**Primary Contact / Team:** `group:default/pathfinder`

**Date of Last Update:** 2026-09-10

## 11. Glossary / Acronyms

| Term | Definition |
|------|-----------|
| Predicate | Function that returns a boolean result about a supplied value |
| fast-check | Property-based testing library used to exercise predicate behavior across many generated inputs |
| Worker predicate | Validation helper that checks worker-like browser/runtime objects |
| Geospatial predicate | Validation helper for coordinate or bounding-box-like values |
