# Architecture Overview

<!-- Part of monorepo: see [../../ARCHITECTURE.md](../../ARCHITECTURE.md) for system-wide architecture -->

> **Tech Stack:** See [../../openspec/config.yaml](../../openspec/config.yaml) for detailed stack facts, coding patterns, and domain concepts.

This document serves as a critical, living reference designed to equip agents and engineers with a rapid and comprehensive understanding of the `@accelint/logger` package architecture. Update this document as the codebase evolves.

## 1. Project Structure

```text
packages/logger/
├── src/                        # Package source root for logger bootstrap and transport modules
│   ├── default/               # Default logger creation and bootstrap helpers
│   ├── plugins/               # Callsite and environment plugins
│   ├── transports/            # Pretty and structured transport implementations
│   ├── definitions.ts         # Shared logging types and constants
│   └── index.ts               # Generated root barrel exporting public package API
├── README.md                  # Package overview and configuration examples
├── CHANGELOG.md               # Release history
├── catalog-info.yaml          # Constellation/Backstage ownership metadata
├── package.json               # Published package metadata and subpath exports
├── tsconfig.json              # TypeScript library configuration
├── tsdown.config.ts           # ESM build configuration
├── typedoc.mjs                # API documentation generator config
├── vitest.config.js           # jsdom-based test configuration
└── ARCHITECTURE.md            # This document
```

## 2. High-Level System Diagram

> Complete stack facts and coding patterns are in [../../openspec/config.yaml](../../openspec/config.yaml). This section provides deployment and runtime context.

```text
Application log call
        │
        ▼
   @accelint/logger
        │
   ┌────┼───────────────┬──────────────┐
   ▼    ▼               ▼              ▼
bootstrap plugins     transports     definitions
        │
        ▼
 LogLayer-based logger instance
        │
        ▼
 pretty terminal / structured output / custom transport
```

This package has no server, database, or hosted runtime. It is a published logging library that standardizes logger setup and transport behavior for consumer applications.

## 3. Core Components

### 3.1. Frontend

**Name:** Consumer logging integration layer

**Description:** Consumer applications and packages import `@accelint/logger` to create standardized logger instances, apply common plugins, and emit human-readable or structured log output.

**Technologies:** TypeScript, ESM, LogLayer ecosystem

**Deployment:** Bundled into consumer applications or libraries; published to npm as a library

### 3.2. Backend Services

#### 3.2.1. Logger Bootstrap Runtime

**Name:** Logger bootstrap runtime

**Description:** Owns default logger creation, plugin composition, error serialization, and transport wiring for downstream consumers.

**Technologies:** TypeScript, LogLayer, plugin composition

**Deployment:** Runs inline in the importing JavaScript runtime

#### 3.2.2. Plugin and Transport Modules

**Name:** Plugin and transport modules

**Description:** Separates environment-aware behavior and output formatting into focused plugin and transport modules so consumers can customize logging behavior.

**Technologies:** TypeScript subpath exports, transport modules, plugin modules

**Deployment:** Imported through root and subpath entries such as `@accelint/logger/transports/structured`

## 4. Data Stores

### 4.1. Logger Instance State

**Name:** Logger bootstrap state

**Type:** In-memory singleton and logger configuration objects

**Purpose:** Hold the active logger instance and associated plugin/transport configuration for the current runtime.

**Key Schemas / Collections:** default logger instance, transport configuration, plugin list

### 4.2. Log Event Payloads

**Name:** Log event data

**Type:** In-memory event objects and serialized errors

**Purpose:** Represent the transient payloads being normalized and routed through transports.

**Key Schemas / Collections:** log messages, metadata objects, serialized errors

## 5. External Integrations / APIs

| Service | Purpose | Integration Method |
|---------|---------|-------------------|
| `loglayer` | Core logger abstraction | Peer dependency |
| `@loglayer/*` packages | Plugin, log-level, and transport support | Runtime dependencies |
| `serialize-error` | Error normalization for output | Runtime dependency |
| `callsites` | Callsite metadata enrichment | Runtime dependency |

## 6. Deployment & Infrastructure

**Cloud Provider:** None. This package is a published library, not a hosted service.

**Key Services Used:** npm registry for package distribution; GitHub Actions for CI/release automation; Constellation/Backstage metadata via `catalog-info.yaml`

**CI/CD Pipeline:** GitHub Actions runs repo-wide build, test, lint, and format checks. Release workflows use Changesets to publish the package. Local package builds use `tsdown`.

**Monitoring & Logging:** This package is itself part of the logging stack for consuming applications. It supports pretty terminal output, structured output, and custom transport integration, but it does not host its own operational monitoring service.

## 7. Security Considerations

**Authentication:** Not applicable. This package does not implement authentication.

**Authorization:** Not applicable. This package standardizes logging rather than access control.

**Data Encryption:** Delegated to consumer transports and surrounding infrastructure. This package only structures in-memory log payloads before handing them to transports.

**Key Security Tools / Practices:** Consistent error serialization, structured transport support for downstream observability pipelines, repo-wide CI verification, and GitHub Actions security scanning. Sensitive data redaction remains the responsibility of the calling application and configured transports.

## 8. Development & Testing Environment

> Testing patterns and standards are defined in [../../openspec/config.yaml](../../openspec/config.yaml); this section covers local setup and commands.

**Local Setup:** Use Node.js 22+ and pnpm 10+. Install from the repo root, then run repo-wide verification or package-local scripts from `packages/logger`.

**Testing Frameworks:** Vitest with jsdom and shared jest-dom setup. Tests use mocks extensively to isolate transport and plugin behavior.

**Code Quality Tools:** Biome, publint, Turbo, tsdown, and repo-wide formatting/lint automation.

## 9. Future Considerations / Roadmap

- No package-specific roadmap items were provided at review time.
- No package-specific architectural technical debt was provided at review time.

## 10. Project Identification

**Project Name:** `@accelint/logger`

**Repository URL:** https://github.com/gohypergiant/standard-toolkit

**Primary Contact / Team:** `group:default/pathfinder`

**Date of Last Update:** 2026-09-10

## 11. Glossary / Acronyms

| Term | Definition |
|------|-----------|
| LogLayer | The underlying logging abstraction this package builds on |
| Structured transport | Output path that emits machine-friendly log records |
| Callsite plugin | Logger plugin that enriches messages with source-location metadata |
| Pretty transport | Human-readable logging output intended for local or terminal use |
