# Architecture Overview

<!-- Part of monorepo: see [../../ARCHITECTURE.md](../../ARCHITECTURE.md) for system-wide architecture -->

> **Tech Stack:** See [../../openspec/config.yaml](../../openspec/config.yaml) for detailed stack facts, coding patterns, and domain concepts.

This document serves as a critical, living reference designed to equip agents and engineers with a rapid and comprehensive understanding of the `@accelint/worker` package architecture. Update this document as the codebase evolves.

## 1. Project Structure

```text
packages/web-worker/
├── src/                     # Package source root for worker communication helpers
│   ├── worker/             # Core create/expose implementation
│   └── index.ts            # Generated root barrel exporting public package API
├── README.md               # Package overview and usage examples
├── CHANGELOG.md            # Release history
├── catalog-info.yaml       # Constellation/Backstage ownership metadata
├── package.json            # Published package metadata and root/worker exports
├── tsconfig.json           # TypeScript library configuration
├── tsdown.config.ts        # ESM build configuration
├── typedoc.mjs             # API documentation generator config
├── vitest.config.js        # Shared Vitest configuration entry
└── ARCHITECTURE.md         # This document
```

## 2. High-Level System Diagram

> Complete stack facts and coding patterns are in [../../openspec/config.yaml](../../openspec/config.yaml). This section provides deployment and runtime context.

```text
Main thread code
      │
      ▼
  @accelint/worker create()
      │
      ├── postMessage request
      ▼
 Worker or SharedWorker
      │
      ▼
  expose() action handlers
      │
      ▼
 Typed response / transferable data back to caller
```

This package has no server, database, or hosted runtime. It is a published browser-worker helper library for typed request/response communication.

## 3. Core Components

### 3.1. Frontend

**Name:** Worker integration layer

**Description:** Consumer applications import `@accelint/worker` to wrap `Worker` and `SharedWorker` communication in a typed request/response API rather than managing raw message channels directly.

**Technologies:** TypeScript, ESM, Worker and SharedWorker browser APIs

**Deployment:** Bundled into consumer applications; published to npm as a library

### 3.2. Backend Services

#### 3.2.1. Main-Thread Runtime

**Name:** Main-thread worker runtime

**Description:** Owns request creation, response correlation, and promise-based invocation of worker actions from the main thread.

**Technologies:** TypeScript, `mitt`, browser messaging APIs

**Deployment:** Runs inside the consumer application’s browser/client runtime

#### 3.2.2. Worker Exposure Layer

**Name:** Worker exposure layer

**Description:** Provides worker-side helpers so action maps can be exposed over message channels with typed request and response contracts.

**Technologies:** TypeScript utility modules, message event handling

**Deployment:** Runs inside worker or shared-worker contexts

## 4. Data Stores

### 4.1. Request Correlation State

**Name:** Pending request state

**Type:** In-memory event emitter and request ID mapping

**Purpose:** Correlate asynchronous worker replies back to the originating caller request.

**Key Schemas / Collections:** request IDs, pending response listeners

### 4.2. Message Payloads

**Name:** Worker request and response payloads

**Type:** In-memory structured message objects

**Purpose:** Represent action names, parameters, return values, and transferable objects moving between caller and worker contexts.

**Key Schemas / Collections:** action tuples, message payloads, transferables

## 5. External Integrations / APIs

| Service | Purpose | Integration Method |
|---------|---------|-------------------|
| Worker / SharedWorker APIs | Underlying worker execution and messaging | Native platform API |
| `mitt` | Lightweight in-memory event coordination for request/response tracking | Runtime dependency |

## 6. Deployment & Infrastructure

**Cloud Provider:** None. This package is a published library, not a hosted service.

**Key Services Used:** npm registry for package distribution; GitHub Actions for CI/release automation; Constellation/Backstage metadata via `catalog-info.yaml`

**CI/CD Pipeline:** GitHub Actions runs repo-wide build, test, lint, and format checks. Release workflows use Changesets to publish the package. Local package builds use `tsdown`.

**Monitoring & Logging:** Not applicable. The package has no hosted runtime.

## 7. Security Considerations

**Authentication:** Not applicable. This package does not implement authentication.

**Authorization:** Not applicable. This package provides worker messaging helpers rather than access control.

**Data Encryption:** Delegated to the host environment. This package only manages in-memory worker message payloads.

**Key Security Tools / Practices:** Typed action contracts, request ID correlation for safer reply matching, support for explicit transferable handling, repo-wide CI verification, and GitHub Actions security scanning.

## 8. Development & Testing Environment

> Testing patterns and standards are defined in [../../openspec/config.yaml](../../openspec/config.yaml); this section covers local setup and commands.

**Local Setup:** Use Node.js 22+ and pnpm 10+. Install from the repo root, then run repo-wide verification or package-local scripts from `packages/web-worker`.

**Testing Frameworks:** Vitest configuration is present through the shared DOM base config. The package currently relies more on build/package validation than a large visible runtime test surface.

**Code Quality Tools:** Biome, publint, Turbo, tsdown, and repo-wide formatting/lint automation.

## 9. Future Considerations / Roadmap

- No package-specific roadmap items were provided at review time.
- No package-specific architectural technical debt was provided at review time.

## 10. Project Identification

**Project Name:** `@accelint/worker`

**Repository URL:** https://github.com/gohypergiant/standard-toolkit

**Primary Contact / Team:** `group:default/pathfinder`

**Date of Last Update:** 2026-09-10

## 11. Glossary / Acronyms

| Term | Definition |
|------|-----------|
| Worker | Browser background execution context used for off-main-thread computation |
| SharedWorker | Worker variant shared across multiple browsing contexts |
| Transferable | Value transferred rather than cloned across worker boundaries |
| expose() | Helper that publishes typed worker actions over the message channel |
