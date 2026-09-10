# Architecture Overview

<!-- Part of monorepo: see [../../ARCHITECTURE.md](../../ARCHITECTURE.md) for system-wide architecture -->

> **Tech Stack:** See [../../openspec/config.yaml](../../openspec/config.yaml) for detailed stack facts, coding patterns, and domain concepts.

This document serves as a critical, living reference designed to equip agents and engineers with a rapid and comprehensive understanding of the `@accelint/stream-devtools` package architecture. Update this document as the codebase evolves.

## 1. Project Structure

```text
packages/stream-devtools/
├── src/                         # Package source root for devtools core, UI, and React adapters
│   ├── components/             # Devtools panel UI pieces such as panes, rows, and badges
│   ├── react/                  # React host adapter and plugin entrypoints
│   ├── styles/                 # Token and style helpers
│   ├── core.ts                 # Devtools core integration
│   ├── store.ts                # Devtools state store and snapshot generation
│   ├── production.ts           # Production-safe noop entrypoint
│   ├── index.ts                # Dev-only main entrypoint
│   └── __tests__/              # Core and production behavior tests
├── README.md                   # Package overview and host integration guidance
├── CHANGELOG.md                # Release history
├── catalog-info.yaml           # Constellation/Backstage ownership metadata
├── package.json                # Published package metadata and dev/prod/react entrypoints
├── tsconfig.json               # TypeScript library configuration
├── tsdown.config.ts            # ESM build configuration
├── vitest.config.js            # Mixed Solid/React test configuration
└── ARCHITECTURE.md             # This document
```

## 2. High-Level System Diagram

> Complete stack facts and coding patterns are in [../../openspec/config.yaml](../../openspec/config.yaml). This section provides deployment and runtime context.

```text
      @accelint/stream runtime
                 │
                 ▼
      @accelint/stream-devtools
                 │
   ┌─────────────┼───────────────┬──────────────┐
   ▼             ▼               ▼              ▼
 core         store/snapshots   panel UI      React plugin
                 │
                 ▼
   TanStack Devtools host integration
```

This package has no server, database, or hosted runtime of its own. It is a published client-side diagnostics package for inspecting `@accelint/stream` behavior during development.

## 3. Core Components

### 3.1. Frontend

**Name:** Devtools integration layer

**Description:** Consumer applications import `@accelint/stream-devtools` to attach an inspection panel and plugin surface for `@accelint/stream` within development-focused UI environments.

**Technologies:** TypeScript, ESM, TanStack Devtools integration, optional React host adapter

**Deployment:** Bundled into consumer applications in development-oriented flows; published to npm as a library

### 3.2. Backend Services

#### 3.2.1. Devtools Core Runtime

**Name:** Devtools core runtime

**Description:** Owns stream inspection wiring, stream-state snapshot generation, lifecycle timeline capture, and integration with the host devtools shell.

**Technologies:** TypeScript, TanStack Devtools internals, package-local store modules

**Deployment:** Runs inside the consumer application’s browser/client runtime during development

#### 3.2.2. Panel and React Adapter Layer

**Name:** Panel and React adapter layer

**Description:** Provides the visual inspection panel plus a React-facing plugin entrypoint so host applications can mount the devtools surface in familiar integration patterns.

**Technologies:** React host adapter, bundled Solid-based internals, package-local UI components

**Deployment:** Imported through root, production, and React entrypoints depending on environment

## 4. Data Stores

### 4.1. Devtools Snapshot Store

**Name:** Devtools snapshot state

**Type:** In-memory Maps, Sets, and derived snapshots

**Purpose:** Track stream timelines, statuses, listeners, and inspection state for rendering in the devtools UI.

**Key Schemas / Collections:** timelines, lastStatuses, listeners, snapshots

### 4.2. Stream Inspection Payloads

**Name:** Inspected stream payloads

**Type:** In-memory stream snapshots and message-history data

**Purpose:** Represent the transient stream state and message data surfaced to developers in the panel.

**Key Schemas / Collections:** stream snapshots, status history, message history, action logs

## 5. External Integrations / APIs

| Service | Purpose | Integration Method |
|---------|---------|-------------------|
| `@accelint/stream` | Source of stream cache and lifecycle data | Peer dependency |
| TanStack Devtools packages | Host shell, UI plumbing, and integration utilities | Peer/runtime integration |
| React | Optional host adapter surface | Peer dependency |

## 6. Deployment & Infrastructure

**Cloud Provider:** None. This package is a published library, not a hosted service.

**Key Services Used:** npm registry for package distribution; GitHub Actions for CI/release automation; Constellation/Backstage metadata via `catalog-info.yaml`

**CI/CD Pipeline:** GitHub Actions runs repo-wide build, test, lint, and format checks. Release workflows use Changesets to publish the package.

**Monitoring & Logging:** This package is itself a diagnostics surface for `@accelint/stream`. It does not host an operational monitoring stack, but it exposes stream status, history, and lifecycle information to developers.

## 7. Security Considerations

**Authentication:** Not applicable. This package does not implement authentication.

**Authorization:** Not applicable. This package is a diagnostics UI rather than an access-control mechanism.

**Data Encryption:** Delegated to the host application and browser platform. The package reads and displays in-memory stream diagnostics only.

**Key Security Tools / Practices:** Dev-only and no-op entry behavior outside intended environments, direct in-process inspection rather than cross-tab clobber-prone event broadcasting, repo-wide CI verification, and GitHub Actions security scanning.

## 8. Development & Testing Environment

> Testing patterns and standards are defined in [../../openspec/config.yaml](../../openspec/config.yaml); this section covers local setup and commands.

**Local Setup:** Use Node.js 22+ and pnpm 10+. Install from the repo root, then run repo-wide verification or package-local scripts from `packages/stream-devtools`.

**Testing Frameworks:** Vitest with a mixed configuration: core tests use the shared no-DOM base plus Solid tooling, while some React-facing tests opt into jsdom where needed.

**Code Quality Tools:** Biome, publint, Turbo, tsdown, and repo-wide formatting/lint automation.

## 9. Future Considerations / Roadmap

- No package-specific roadmap items were provided at review time.
- No package-specific architectural technical debt was provided at review time.

## 10. Project Identification

**Project Name:** `@accelint/stream-devtools`

**Repository URL:** https://github.com/gohypergiant/standard-toolkit

**Primary Contact / Team:** `group:default/pathfinder`

**Date of Last Update:** 2026-09-10

## 11. Glossary / Acronyms

| Term | Definition |
|------|-----------|
| Devtools snapshot | Captured view of stream state rendered in the diagnostics panel |
| Production noop entry | Entry point that avoids enabling the devtools runtime in production-oriented use |
| Timeline log | Ordered sequence of stream lifecycle events surfaced for debugging |
| In-process inspection | Diagnostics approach that reads the local runtime directly rather than coordinating through cross-tab messaging |
