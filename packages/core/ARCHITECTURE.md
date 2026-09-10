# Architecture Overview

<!-- Part of monorepo: see [../../ARCHITECTURE.md](../../ARCHITECTURE.md) for system-wide architecture -->

> **Tech Stack:** See [../../openspec/config.yaml](../../openspec/config.yaml) for detailed stack facts, coding patterns, and domain concepts.

This document serves as a critical, living reference designed to equip agents and engineers with a rapid and comprehensive understanding of the `@accelint/core` package architecture. Update this document as the codebase evolves.

## 1. Project Structure

```text
packages/core/
├── src/                  # Package source root for functional utility families
│   ├── array/            # Array helper functions
│   ├── combinators/      # Functional combinators
│   ├── composition/      # Compose, curry, and pipe helpers
│   ├── iterable/         # Iterable creation and range helpers
│   ├── logical/          # Boolean and comparison helpers
│   ├── object/           # Associate, lens, and property utilities
│   ├── safe-enum/        # Safe enum patterns and helpers
│   ├── utility/          # Generic helpers such as lookup, once, tap, uuid
│   ├── types.ts          # Shared package types
│   └── index.ts          # Generated root barrel exporting public package API
├── README.md             # Package overview and usage categories
├── CHANGELOG.md          # Release history
├── catalog-info.yaml     # Constellation/Backstage ownership metadata
├── package.json          # Published package metadata and extensive subpath exports
├── tsconfig.json         # TypeScript library configuration
├── tsdown.config.ts      # ESM build configuration
├── typedoc.mjs           # API documentation generator config
├── vitest.config.js      # Shared Vitest configuration entry
└── ARCHITECTURE.md       # This document
```

## 2. High-Level System Diagram

> Complete stack facts and coding patterns are in [../../openspec/config.yaml](../../openspec/config.yaml). This section provides deployment and runtime context.

```text
Consumer application or package
            │
            ▼
       @accelint/core
            │
 ┌──────────┼──────────┬──────────┬──────────┐
 ▼          ▼          ▼          ▼          ▼
array   composition   object    logical   utility
helpers    / curry    / lens    helpers   helpers
            │
            ▼
   Reusable pure functions
```

This package has no server, database, or hosted runtime. It is a foundational utility library shared across the monorepo and consumer applications.

## 3. Core Components

### 3.1. Frontend

**Name:** Consumer integration layer

**Description:** Other packages and applications import `@accelint/core` for foundational functional helpers, composition utilities, object/lens operations, and UUID-related helpers.

**Technologies:** TypeScript, ESM

**Deployment:** Bundled into consumer applications or libraries; published to npm as a library

### 3.2. Backend Services

#### 3.2.1. Functional Utility Runtime

**Name:** Functional utility runtime

**Description:** Owns the shared pure-function surface for arrays, composition, iterables, objects, logic, and general-purpose helpers.

**Technologies:** TypeScript, ESM utility functions

**Deployment:** Runs inline in any JavaScript runtime that imports the package

#### 3.2.2. Safe Enum and UUID Support

**Name:** Type-safe helper modules

**Description:** Provides higher-level helpers for safe-enum patterns and UUID-oriented workflows used by other packages such as `@accelint/bus`.

**Technologies:** TypeScript utility modules, `uuid` peer integration

**Deployment:** Imported through root or granular subpath exports

## 4. Data Stores

### 4.1. Runtime State

**Name:** None

**Type:** No persistent or shared store

**Purpose:** The package is primarily a collection of pure functions.

**Key Schemas / Collections:** N/A

### 4.2. Caller Data Structures

**Name:** Consumer data inputs

**Type:** In-memory arrays, objects, iterables, enum-like records, and primitive values

**Purpose:** Represent the transient values transformed by the package’s helper functions.

**Key Schemas / Collections:** arrays, objects, iterable ranges, enum-like structures

## 5. External Integrations / APIs

| Service | Purpose | Integration Method |
|---------|---------|-------------------|
| `uuid` | UUID generation and related helper support | Peer dependency |

## 6. Deployment & Infrastructure

**Cloud Provider:** None. This package is a published library, not a hosted service.

**Key Services Used:** npm registry for package distribution; GitHub Actions for CI/release automation; Constellation/Backstage metadata via `catalog-info.yaml`

**CI/CD Pipeline:** GitHub Actions runs repo-wide build, test, lint, and format checks. Release workflows use Changesets to version and publish the package. Local package builds use `tsdown`.

**Monitoring & Logging:** Not applicable. The package has no hosted runtime.

## 7. Security Considerations

**Authentication:** Not applicable. This package does not implement authentication.

**Authorization:** Not applicable. This package is a utility library.

**Data Encryption:** Not applicable. The package does not persist or transmit data.

**Key Security Tools / Practices:** Pure-function design minimizes stateful attack surface; shared CI verification and GitHub Actions security scanning protect the published package pipeline.

## 8. Development & Testing Environment

> Testing patterns and standards are defined in [../../openspec/config.yaml](../../openspec/config.yaml); this section covers local setup and commands.

**Local Setup:** Use Node.js 22+ and pnpm 10+. Install from the repo root, then use the repo verification gate or package-local scripts inside `packages/core`.

**Testing Frameworks:** Vitest with the shared no-DOM base config. Tests are predominantly small pure-function unit tests, with focused law-style coverage for helpers such as lenses.

**Code Quality Tools:** Biome, publint, Turbo, tsdown, and repo-wide formatting/lint automation.

## 9. Future Considerations / Roadmap

- No package-specific roadmap items were provided at review time.
- No package-specific architectural technical debt was provided at review time.

## 10. Project Identification

**Project Name:** `@accelint/core`

**Repository URL:** https://github.com/gohypergiant/standard-toolkit

**Primary Contact / Team:** `group:default/pathfinder`

**Date of Last Update:** 2026-09-10

## 11. Glossary / Acronyms

| Term | Definition |
|------|-----------|
| Lens | Functional accessor/update pattern for nested immutable data |
| Safe enum | Pattern for enum-like values without using TypeScript `enum` |
| Curry | Function transformation that turns multi-argument functions into chained single-argument calls |
| Compose / pipe | Functional patterns for chaining operations |
