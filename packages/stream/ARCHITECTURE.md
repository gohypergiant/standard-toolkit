# Architecture Overview

<!-- Part of monorepo: see [../../ARCHITECTURE.md](../../ARCHITECTURE.md) for system-wide architecture -->

> **Tech Stack:** See [../../openspec/config.yaml](../../openspec/config.yaml) for detailed stack facts, coding patterns, and domain concepts.

This document serves as a critical, living reference designed to equip agents and engineers with a rapid and comprehensive understanding of the `@accelint/stream` package architecture. Update this document as the codebase evolves.

## 1. Project Structure

```text
packages/stream/
├── src/                           # Package source root for stream cache, transports, observers, and React hooks
│   ├── react/                    # Provider and React hook integration for stream consumption
│   ├── stream-client.ts          # Top-level stream cache owner and imperative API
│   ├── stream-cache.ts           # Shared stream cache keyed by stream identity
│   ├── stream.ts                 # Core stream state and lifecycle runtime
│   ├── stream-observer.ts        # Single-stream observer logic
│   ├── streams-observer.ts       # Multi-stream observer logic
│   ├── transport.ts              # SSE and WebSocket transport implementations
│   ├── constants.ts              # Shared defaults and runtime constants
│   ├── types.ts                  # Shared package types
│   ├── __tests__/                # Package-local test suites
│   └── test/                     # Shared stream test setup and transport mocks
├── README.md                     # Package overview and architecture guidance
├── CHANGELOG.md                  # Release history
├── catalog-info.yaml             # Constellation/Backstage ownership metadata
├── package.json                  # Published package metadata and root/react export surface
├── tsconfig.json                 # TypeScript library configuration
├── tsdown.config.ts              # ESM build configuration
├── vitest.config.js              # jsdom-based test configuration
└── ARCHITECTURE.md               # This document
```

## 2. High-Level System Diagram

> Complete stack facts and coding patterns are in [../../openspec/config.yaml](../../openspec/config.yaml). This section provides deployment and runtime context.

```text
 Network stream source (SSE/WebSocket)
                 │
                 ▼
          @accelint/stream
                 │
   ┌─────────────┼──────────────┬───────────────┐
   ▼             ▼              ▼               ▼
transport     Stream/Cache    observers       React hooks
layer         runtime         + lifecycle     + provider
                 │
                 ▼
  Shared keyed stream state for consumers
```

This package has no server, database, or hosted runtime of its own. It is a published browser-oriented stream cache library for shared SSE and WebSocket consumption.

## 3. Core Components

### 3.1. Frontend

**Name:** Stream consumer integration layer

**Description:** Consumer applications import `@accelint/stream` to share keyed SSE and WebSocket connections, observe stream state, and optionally consume the cache through React hooks.

**Technologies:** TypeScript, ESM, browser EventSource and WebSocket APIs, optional React integration

**Deployment:** Bundled into consumer applications; published to npm as a library

### 3.2. Backend Services

#### 3.2.1. Stream Cache Runtime

**Name:** Stream cache runtime

**Description:** Owns stream identity, connection lifecycle, shared cache state, observer coordination, message history, and reconnect behavior for transport-backed streams.

**Technologies:** TypeScript, `@tanstack/query-core` concepts, in-memory cache and observer modules

**Deployment:** Runs inside the consumer application’s browser/client runtime

#### 3.2.2. React Integration Layer

**Name:** React integration layer

**Description:** Provides a provider and hooks so React consumers can bind to stream state declaratively while reusing the shared core runtime.

**Technologies:** React hooks, provider context, TypeScript

**Deployment:** Imported through `@accelint/stream/react`

## 4. Data Stores

### 4.1. Stream Cache State

**Name:** Shared stream cache

**Type:** In-memory `Map` and runtime stream objects

**Purpose:** Deduplicate connections and share stream state across consumers that reference the same stream key.

**Key Schemas / Collections:** stream hash map, stream state, observer lists, reconnect state

### 4.2. Message and Transport State

**Name:** Stream payload and transport state

**Type:** In-memory messages, status objects, and optional message history buffers

**Purpose:** Track incoming stream messages, status transitions, and transport-backed lifecycle details.

**Key Schemas / Collections:** decoded message data, status transitions, message history, transport configuration

## 5. External Integrations / APIs

| Service | Purpose | Integration Method |
|---------|---------|-------------------|
| EventSource API | SSE transport support | Native platform API |
| WebSocket API | WebSocket transport support | Native platform API |
| `@tanstack/query-core` | Shared cache/observer design foundation | Runtime dependency |
| React | Optional hooks and provider layer | Peer dependency |

## 6. Deployment & Infrastructure

**Cloud Provider:** None. This package is a published library, not a hosted service.

**Key Services Used:** npm registry for package distribution; GitHub Actions for CI/release automation; Constellation/Backstage metadata via `catalog-info.yaml`

**CI/CD Pipeline:** GitHub Actions runs repo-wide build, test, lint, and format checks. Release workflows use Changesets to publish the package.

**Monitoring & Logging:** Not applicable as a hosted service. The package exposes diagnostics-oriented runtime state for consumers but does not host an operational monitoring stack.

## 7. Security Considerations

**Authentication:** Not applicable. This package does not implement a built-in authentication layer for streams.

**Authorization:** Not applicable. Stream access control is delegated to the underlying transport endpoints and host application.

**Data Encryption:** Delegated to the host transport and browser platform. The package manages in-memory stream state and transport payloads.

**Key Security Tools / Practices:** Shared keyed stream isolation, guarded decode paths that handle parser errors, state consistency checks across stream identity and URI usage, repo-wide CI verification, and GitHub Actions security scanning.

## 8. Development & Testing Environment

> Testing patterns and standards are defined in [../../openspec/config.yaml](../../openspec/config.yaml); this section covers local setup and commands.

**Local Setup:** Use Node.js 22+ and pnpm 10+. Install from the repo root. React is optional for core-only use, and local development includes package-local test flows with mocked EventSource and WebSocket behavior.

**Testing Frameworks:** Vitest with jsdom, React Testing Library for hook/provider flows, and shared transport mocks installed by package-local test setup.

**Code Quality Tools:** Biome, publint, Turbo, tsdown, and repo-wide formatting/lint automation.

## 9. Future Considerations / Roadmap

- No package-specific roadmap items were provided at review time.
- No package-specific architectural technical debt was provided at review time.

## 10. Project Identification

**Project Name:** `@accelint/stream`

**Repository URL:** https://github.com/gohypergiant/standard-toolkit

**Primary Contact / Team:** `group:default/pathfinder`

**Date of Last Update:** 2026-09-10

## 11. Glossary / Acronyms

| Term | Definition |
|------|-----------|
| Stream key | Logical identity used to deduplicate and share a stream connection |
| SSE | Server-Sent Events transport supported by the package |
| Observer | Runtime subscriber that reacts to stream state and message updates |
| Message history | Optional retained buffer of past messages for inspection or devtools |
