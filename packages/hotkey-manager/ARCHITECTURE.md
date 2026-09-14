# Architecture Overview

<!-- Part of monorepo: see [../../ARCHITECTURE.md](../../ARCHITECTURE.md) for system-wide architecture -->

> **Tech Stack:** See [../../openspec/config.yaml](../../openspec/config.yaml) for detailed stack facts, coding patterns, and domain concepts.

This document serves as a critical, living reference designed to equip agents and engineers with a rapid and comprehensive understanding of the `@accelint/hotkey-manager` package architecture. Update this document as the codebase evolves.

## 1. Project Structure

```text
packages/hotkey-manager/
├── src/                       # Package source root for keyboard lifecycle management
│   ├── actions/              # Register/bind/unbind and event handling actions
│   ├── stores/               # Hotkey and event state stores
│   ├── react/                # React hook integration
│   ├── lib/                  # Key normalization and environment helpers
│   ├── enums/                # Keycode enum surface
│   ├── types/                # Hotkey config and event typing
│   ├── test/                 # Shared test helpers and setup
│   ├── constants.ts          # Shared package constants
│   └── index.ts              # Generated root barrel exporting public package API
├── README.md                 # Package overview and lifecycle examples
├── CHANGELOG.md              # Release history
├── package.json              # Published package metadata and export surface
├── tsconfig.json             # TypeScript library configuration
├── tsdown.config.ts          # ESM build configuration
├── vitest.config.js          # happy-dom based test configuration
└── ARCHITECTURE.md           # This document
```

## 2. High-Level System Diagram

> Complete stack facts and coding patterns are in [../../openspec/config.yaml](../../openspec/config.yaml). This section provides deployment and runtime context.

```text
Browser keyboard events
          │
          ▼
 @accelint/hotkey-manager
          │
 ┌────────┼───────────────┬──────────────┐
 ▼        ▼               ▼              ▼
actions   stores         react         helpers
bind/     active key     useHotkey     key parsing,
unbind    state/maps     lifecycle     environment checks
          │
          ▼
   Registered hotkey callbacks
```

This package has no server, database, or hosted runtime. It is a published browser-oriented library for global hotkey registration and lifecycle coordination.

## 3. Core Components

### 3.1. Frontend

**Name:** Browser hotkey integration layer

**Description:** Consumer applications import `@accelint/hotkey-manager` to register shared keyboard shortcuts, prevent duplicate bindings, and coordinate hotkey activation in browser-based UIs.

**Technologies:** TypeScript, ESM, browser keyboard events, optional React integration

**Deployment:** Bundled into consumer applications; published to npm as a library

### 3.2. Backend Services

#### 3.2.1. Hotkey Runtime

**Name:** Hotkey runtime

**Description:** Owns the registration, activation, and global bind/unbind lifecycle for hotkeys, including conflict prevention and active combination tracking.

**Technologies:** TypeScript, zustand, immer, radashi

**Deployment:** Runs inside the consumer application’s browser/client runtime

#### 3.2.2. React Hook Layer

**Name:** React hook layer

**Description:** Provides React-oriented lifecycle helpers so applications can register and dispose hotkeys in component scope without manual event wiring.

**Technologies:** React hooks, TypeScript

**Deployment:** Imported through `@accelint/hotkey-manager/react`

## 4. Data Stores

### 4.1. Hotkey Store

**Name:** Hotkey registration state

**Type:** In-memory Maps and store state

**Purpose:** Tracks registered combinations, active combinations, and activation metadata across the application runtime.

**Key Schemas / Collections:** allHotkeys, registeredKeyCombinations, activeKeyCombinations, hotkeyActivations

### 4.2. Event Store

**Name:** Keyboard event lifecycle state

**Type:** In-memory store state, Maps, and Sets

**Purpose:** Tracks binding status and held-key timing behavior for repeat/hold scenarios.

**Key Schemas / Collections:** heldTimeouts, heldTriggered, bound flag

## 5. External Integrations / APIs

| Service | Purpose | Integration Method |
|---------|---------|-------------------|
| Browser keyboard events | Underlying keydown/keyup input source | Native platform API |
| `zustand` / `immer` | Internal hotkey state management | Runtime dependencies |
| `react` | Optional hook-based consumer integration | Optional dependency |
| `@accelint/core` | Shared functional helpers and types | Peer dependency |

## 6. Deployment & Infrastructure

**Cloud Provider:** None. This package is a published library, not a hosted service.

**Key Services Used:** npm registry for package distribution; GitHub Actions for CI/release automation

**CI/CD Pipeline:** GitHub Actions runs repo-wide build, test, lint, and format checks. Release workflows use Changesets to publish the package. Local package builds use `tsdown`.

**Monitoring & Logging:** Not applicable. The package has no hosted runtime.

## 7. Security Considerations

**Authentication:** Not applicable. This package does not implement authentication.

**Authorization:** Not applicable. This package coordinates keyboard behavior rather than access control.

**Data Encryption:** Not applicable. The package does not persist or transmit data.

**Key Security Tools / Practices:** Disables hotkey behavior while typing in input-like elements, performs environment checks for browser/client safety, uses conflict prevention to avoid accidental double-binding, and inherits repo-wide CI verification and GitHub Actions security scanning.

## 8. Development & Testing Environment

> Testing patterns and standards are defined in [../../openspec/config.yaml](../../openspec/config.yaml); this section covers local setup and commands.

**Local Setup:** Use Node.js 22+ and pnpm 10+. Install from the repo root, then run repo-wide verification or package-local scripts from `packages/hotkey-manager`.

**Testing Frameworks:** Vitest with `happy-dom`, React Testing Library where needed, and shared test helpers for registering hotkeys and resetting store state.

**Code Quality Tools:** Biome, publint, Turbo, tsdown, and repo-wide formatting/lint automation.

## 9. Future Considerations / Roadmap

- No package-specific roadmap items were provided at review time.
- No package-specific architectural technical debt was provided at review time.

## 10. Project Identification

**Project Name:** `@accelint/hotkey-manager`

**Repository URL:** https://github.com/gohypergiant/standard-toolkit

**Primary Contact / Team:** <!-- TODO: fill in -->

**Date of Last Update:** 2026-09-10

## 11. Glossary / Acronyms

| Term | Definition |
|------|-----------|
| Hotkey activation | The runtime record that a registered key combination has fired |
| Global bind | The package-level attachment of window keyboard listeners |
| Held key tracking | Logic for managing repeated or sustained keypress behavior |
| happy-dom | Lightweight DOM-like test environment used for package tests |
