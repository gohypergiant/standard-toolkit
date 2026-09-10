# Architecture Overview

<!-- Part of monorepo: see [../../ARCHITECTURE.md](../../ARCHITECTURE.md) for system-wide architecture -->

> **Tech Stack:** See [../../openspec/config.yaml](../../openspec/config.yaml) for detailed stack facts, coding patterns, and domain concepts.

This document serves as a critical, living reference designed to equip agents and engineers with a rapid and comprehensive understanding of the `@accelint/bus` package architecture. Update this document as the codebase evolves.

## 1. Project Structure

```text
packages/bus/
├── src/                  # Package source root and public API surface
│   ├── broadcast/        # Core BroadcastChannel-based bus runtime, types, constants, and connection lifecycle
│   ├── react/            # Optional React hooks adapter and useEffectEvent ponyfill
│   ├── test/             # Shared test bootstrap for package-local tests
│   └── index.ts          # Generated root barrel exporting public package API
├── README.md             # Package overview, usage, and targeting model
├── CHANGELOG.md          # Release history and behavior changes
├── catalog-info.yaml     # Backstage/Constellation metadata for ownership and lifecycle
├── package.json          # Published package metadata, scripts, and subpath exports
├── tsconfig.json         # TypeScript config for DOM-oriented library build
├── tsdown.config.ts      # ESM build configuration and externalization rules
├── typedoc.mjs           # API documentation generator config
├── vitest.config.js      # jsdom-based test configuration
└── ARCHITECTURE.md       # This document
```

## 2. High-Level System Diagram

> Complete stack facts and coding patterns are in [../../openspec/config.yaml](../../openspec/config.yaml). This section provides deployment and runtime context.

```text
                              Consumer application
                                      │
                     emits / listens to typed events
                                      │
                                      ▼
                        @accelint/bus package runtime
                ┌─────────────────────┴─────────────────────┐
                │                                           │
                ▼                                           ▼
     broadcast core (`src/broadcast`)             React adapter (`src/react`)
     - singleton bus instance                     - useBus / useEmit / useOn / useOnce
     - targeting: self / others / all / id        - stable callback support
     - connection tracking                         - optional React integration
                │
                ▼
       Browser / compatible runtime
         `BroadcastChannel` transport
                │
                ▼
      Other tabs / workers / app contexts
```

This package has no server, database, or hosted deployment of its own. It is a published client/runtime library used inside consumer applications.

## 3. Core Components

### 3.1. Frontend

**Name:** Consumer application integration layer

**Description:** `@accelint/bus` is consumed from browser-oriented or compatible JavaScript applications. Consumers use the core bus API directly or opt into the React hooks layer for event-driven UI coordination.

**Technologies:** TypeScript, ESM, BroadcastChannel-compatible runtime, optional React integration

**Deployment:** Bundled into consumer applications; published to npm as a library rather than deployed as a standalone frontend

### 3.2. Backend Services

#### 3.2.1. Package Runtime

**Name:** Broadcast runtime

**Description:** Owns typed event emission and subscription, delivery targeting (`self`, `others`, `all`, specific instance ID), connection lifecycle events, and connected-instance tracking for app contexts sharing the same channel.

**Technologies:** TypeScript, `BroadcastChannel`, `@accelint/core` UUID helpers, `type-fest` structured-cloneable typing

**Deployment:** Runs inside the consumer application's browser or compatible runtime context

#### 3.2.2. React Adapter

**Name:** React hooks adapter

**Description:** Provides `useBus`, `useEmit`, `useOn`, and `useOnce` hooks plus a `useEffectEvent` ponyfill so React components can integrate with the shared bus without stale closures or manual subscription cleanup.

**Technologies:** React, TypeScript, Testing Library-compatible hooks patterns

**Deployment:** Imported by React consumers through `@accelint/bus/react`

## 4. Data Stores

### 4.1. In-Memory Listener Registry

**Name:** Listener and emit-options state

**Type:** In-memory JavaScript objects and `Map`

**Purpose:** Stores registered listeners and global/per-event emit options for the current bus instance. This package does not persist state beyond the running application context.

**Key Schemas / Collections:** listeners, emitOptions

### 4.2. Connected Instance Registry

**Name:** Connected instance tracking

**Type:** In-memory `Set`

**Purpose:** Tracks discovered peer instance IDs responding on the active BroadcastChannel so consumers can inspect which tabs or contexts are currently connected.

**Key Schemas / Collections:** connected instance IDs

## 5. External Integrations / APIs

| Service | Purpose | Integration Method |
|---------|---------|-------------------|
| BroadcastChannel API | Cross-context event transport between tabs, workers, and app contexts | Native platform API |
| `@accelint/core` | UUID generation and validation for instance IDs and targeted delivery | Workspace peer dependency |
| React | Optional hooks-based integration surface | Optional dependency / subpath export |

## 6. Deployment & Infrastructure

**Cloud Provider:** None. This package is a published library, not a hosted service.

**Key Services Used:** npm registry for package distribution; GitHub Actions for CI/release automation; Constellation/Backstage metadata via `catalog-info.yaml`

**CI/CD Pipeline:** GitHub Actions runs repo-wide build, test, lint, and format checks. Release workflows use Changesets to version and publish public npm packages. Package builds use `tsdown` and emit ESM output plus declaration files.

**Monitoring & Logging:** Not applicable. The package has no hosted runtime or service-level observability stack.

## 7. Security Considerations

**Authentication:** Not applicable. This package does not implement user authentication.

**Authorization:** Not applicable. The package supports delivery targeting by instance ID, but this is routing scope rather than an authorization model.

**Data Encryption:** Delegated to the consumer runtime and platform transport. This package maintains only in-memory event payloads and does not manage storage encryption.

**Key Security Tools / Practices:** Structured-cloneable payload typing, UUID validation for specific-target emits, self-targeting as the default delivery mode, GitHub Actions security scanning (TruffleHog/Semgrep), and standard CI verification through build/test/lint/format.

## 8. Development & Testing Environment

> Testing patterns and standards are defined in [../../openspec/config.yaml](../../openspec/config.yaml); this section covers local setup and commands.

**Local Setup:** Use Node.js 22+ and pnpm 10+. Install dependencies from the repo root with `pnpm install`, then use the repo verification gate (`pnpm run build`, `pnpm run test`, `pnpm run lint`, `pnpm run format`) or package-local commands inside `packages/bus` such as `pnpm build` and `pnpm test`.

**Testing Frameworks:** Vitest with the shared `@accelint/vitest-config/dom` base, jsdom test environment, `@testing-library/react`, `@testing-library/dom`, and `@testing-library/jest-dom`.

**Code Quality Tools:** Biome, publint, Turbo, tsdown, syncpack, ls-lint, and lefthook-driven repo automation.

## 9. Future Considerations / Roadmap

- No package-specific roadmap items were provided at review time.
- No package-specific architectural technical debt was provided at review time.

## 10. Project Identification

**Project Name:** `@accelint/bus` (Accelint Bus)

**Repository URL:** https://github.com/gohypergiant/standard-toolkit

**Primary Contact / Team:** `group:default/pathfinder`

**Date of Last Update:** 2026-09-09

## 11. Glossary / Acronyms

| Term | Definition |
|------|-----------|
| BroadcastChannel | Browser/runtime API used to send messages across tabs, workers, or other same-origin contexts |
| Self-targeting | The package default where emitted events are delivered only within the current bus instance unless configured otherwise |
| Connected instance | Another active bus instance that has responded on the shared channel and whose UUID is tracked in memory |
| Ponyfill | A compatibility implementation that provides `useEffectEvent` behavior without requiring native React support |
| Emit target | Delivery scope for an event: `self`, `others`, `all`, or a specific instance UUID |
