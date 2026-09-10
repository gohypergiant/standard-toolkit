# Architecture Overview

<!-- Part of monorepo: see [../../ARCHITECTURE.md](../../ARCHITECTURE.md) for system-wide architecture -->

> **Tech Stack:** See [../../openspec/config.yaml](../../openspec/config.yaml) for detailed stack facts, coding patterns, and domain concepts.

This document serves as a critical, living reference designed to equip agents and engineers with a rapid and comprehensive understanding of the `@accelint/dataset` package architecture. Update this document as the codebase evolves.

## 1. Project Structure

```text
packages/dataset/
├── src/                    # Package source root for dataset config modeling
│   ├── lenses.ts           # Immutable accessors over dataset configuration objects
│   ├── validation.ts       # Runtime schema validation and error formatting
│   ├── validation.test.ts  # Validation behavior tests
│   ├── lenses.test.ts      # Lens behavior tests
│   ├── types/              # Dataset and service type model definitions
│   └── index.ts            # Generated root barrel exporting public package API
├── README.md               # Package overview, config model, and usage guidance
├── CHANGELOG.md            # Release history
├── catalog-info.yaml       # Constellation/Backstage ownership metadata
├── package.json            # Published package metadata and subpath exports
├── tsconfig.json           # TypeScript library configuration
├── tsdown.config.ts        # ESM build configuration
├── typedoc.mjs             # API documentation generator config
├── vitest.config.js        # Shared Vitest configuration entry
└── ARCHITECTURE.md         # This document
```

## 2. High-Level System Diagram

> Complete stack facts and coding patterns are in [../../openspec/config.yaml](../../openspec/config.yaml). This section provides deployment and runtime context.

```text
Consumer application or package
            │
            ▼
       @accelint/dataset
            │
   ┌────────┼───────────────┐
   ▼        ▼               ▼
 dataset   lenses        validation
 config    accessors     schemas/errors
            │
            ▼
  Typed + validated dataset objects
```

This package has no server, database, or hosted runtime. It is a published library for modeling, reading, and validating dataset configuration objects used by geospatial consumers.

## 3. Core Components

### 3.1. Frontend

**Name:** Consumer integration layer

**Description:** Consumer applications and libraries import `@accelint/dataset` to define, validate, and access geospatial dataset configurations without re-implementing schema logic.

**Technologies:** TypeScript, ESM, Zod-backed validation

**Deployment:** Bundled into consumer applications or libraries; published to npm as a library

### 3.2. Backend Services

#### 3.2.1. Dataset Model Runtime

**Name:** Dataset model runtime

**Description:** Owns the package’s type model for dataset definitions, including service type, data type, metadata, and structural relationships across configuration objects.

**Technologies:** TypeScript type definitions, ESM exports

**Deployment:** Runs inline in the importing JavaScript runtime

#### 3.2.2. Validation and Lens Modules

**Name:** Validation and lens modules

**Description:** Provides runtime validation through schemas and immutable access paths through lens helpers so callers can safely read and verify dataset objects.

**Technologies:** Zod, `@accelint/core` lens helpers, TypeScript utility modules

**Deployment:** Imported through root or focused subpath exports such as `@accelint/dataset/validation`

## 4. Data Stores

### 4.1. Dataset Configuration Objects

**Name:** Dataset configuration payloads

**Type:** In-memory JavaScript objects

**Purpose:** Represent geospatial dataset definitions spanning service endpoints, metadata, field mappings, geometry properties, and backend-specific options.

**Key Schemas / Collections:** serviceType, dataType, metadata, serviceUrls, fields, geometryProperty

### 4.2. Validation and Access State

**Name:** Validation and lens runtime state

**Type:** Stateless runtime helpers over caller-provided objects

**Purpose:** Validate and read dataset objects without persisting or owning long-lived package state.

**Key Schemas / Collections:** schema definitions, lens accessors

## 5. External Integrations / APIs

| Service | Purpose | Integration Method |
|---------|---------|-------------------|
| `zod` | Runtime validation of dataset configuration objects | Peer dependency |
| `@accelint/core` | Lens helpers and shared functional primitives | Peer dependency |

## 6. Deployment & Infrastructure

**Cloud Provider:** None. This package is a published library, not a hosted service.

**Key Services Used:** npm registry for package distribution; GitHub Actions for CI/release automation; Constellation/Backstage metadata via `catalog-info.yaml`

**CI/CD Pipeline:** GitHub Actions runs repo-wide build, test, lint, and format checks. Release workflows use Changesets to publish the package. Local package builds use `tsdown`.

**Monitoring & Logging:** Not applicable. The package has no hosted runtime.

## 7. Security Considerations

**Authentication:** Not applicable. This package does not implement authentication.

**Authorization:** Not applicable. This package validates configuration objects but does not enforce access control.

**Data Encryption:** Not applicable. The package does not persist or transmit data on its own.

**Key Security Tools / Practices:** Runtime schema validation through Zod, path-aware validation errors for incorrect input, repo-wide CI verification, and GitHub Actions security scanning.

## 8. Development & Testing Environment

> Testing patterns and standards are defined in [../../openspec/config.yaml](../../openspec/config.yaml); this section covers local setup and commands.

**Local Setup:** Use Node.js 22+ and pnpm 10+. Install from the repo root, then run repo-wide verification or package-local scripts from `packages/dataset`.

**Testing Frameworks:** Vitest with the shared no-DOM base config. Tests focus on schema behavior, validation failures, and dataset accessor behavior.

**Code Quality Tools:** Biome, publint, Turbo, tsdown, and repo-wide formatting/lint automation.

## 9. Future Considerations / Roadmap

- No package-specific roadmap items were provided at review time.
- No package-specific architectural technical debt was provided at review time.

## 10. Project Identification

**Project Name:** `@accelint/dataset`

**Repository URL:** https://github.com/gohypergiant/standard-toolkit

**Primary Contact / Team:** `group:default/pathfinder`

**Date of Last Update:** 2026-09-10

## 11. Glossary / Acronyms

| Term | Definition |
|------|-----------|
| Dataset config | Structured object describing how a geospatial dataset should be located, typed, and interpreted |
| Lens | Functional accessor/update pattern used to read nested configuration values immutably |
| Service type | Dataset source family such as WMS, WFS, VTS, or FS |
| Data type | Payload shape such as GeoJSON or Arrow |
