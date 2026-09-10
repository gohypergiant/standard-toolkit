# Architecture Overview

<!-- Part of monorepo: see [../../ARCHITECTURE.md](../../ARCHITECTURE.md) for system-wide architecture -->

> **Tech Stack:** See [../../openspec/config.yaml](../../openspec/config.yaml) for detailed stack facts, coding patterns, and domain concepts.

This document serves as a critical, living reference designed to equip agents and engineers with a rapid and comprehensive understanding of the `@accelint/map-toolkit` package architecture. Update this document as the codebase evolves.

## 1. Project Structure

```text
packages/map-toolkit/
├── src/                         # Package source root for map features, layers, and shared runtime state
│   ├── deckgl/                 # deck.gl layers, overlays, shapes, widgets, extensions, and saved viewports
│   ├── maplibre/               # MapLibre integration helpers and runtime hooks
│   ├── camera/                 # Camera state, events, and store logic
│   ├── viewport/               # Viewport sizing and viewport state helpers
│   ├── map-mode/               # Interaction mode state and ownership flow
│   ├── map-cursor/             # Cursor state management
│   ├── cursor-coordinates/     # Cursor coordinate readout state and formatting
│   ├── shared/                 # Shared store helpers, logger access, constants, and common utilities
│   └── index.ts                # Generated root barrel where applicable
├── .storybook/                 # Package-local Storybook configuration
├── README.md                   # Package overview, setup, and usage examples
├── CHANGELOG.md                # Release history
├── catalog-info.yaml           # Constellation/Backstage ownership metadata
├── package.json                # Published package metadata and large subpath export surface
├── tsconfig.json               # Solution-style TypeScript config
├── tsconfig.dist.json          # Source build TypeScript config
├── tsconfig.dev.json           # Test and Storybook TypeScript config
├── vitest.config.js            # jsdom-based test configuration
└── ARCHITECTURE.md             # This document
```

## 2. High-Level System Diagram

> Complete stack facts and coding patterns are in [../../openspec/config.yaml](../../openspec/config.yaml). This section provides deployment and runtime context.

```text
       Consumer React/map application
                   │
                   ▼
          @accelint/map-toolkit
                   │
 ┌─────────────────┼──────────────────┬─────────────────┐
 ▼                 ▼                  ▼                 ▼
deck.gl layer    MapLibre hooks     map state         shared runtime
surface          and adapters       stores/events     helpers
(shapes, grid,                      (camera, mode,    (bus, logger,
symbols, overlays)                  cursor, viewport) utilities)
                   │
                   ▼
      Browser mapping runtime + geospatial data
```

This package has no server, database, or hosted runtime of its own. It is a published browser-oriented geospatial UI toolkit consumed inside map-enabled applications.

## 3. Core Components

### 3.1. Frontend

**Name:** Geospatial UI integration layer

**Description:** `@accelint/map-toolkit` provides the shared map-facing React and rendering surface for Accelint applications, including map views, grid layers, symbols, shape editing, camera control, viewport state, and coordinate readouts.

**Technologies:** React 19, TypeScript, deck.gl, MapLibre, browser geospatial libraries

**Deployment:** Bundled into consumer applications; published to npm as a library

### 3.2. Backend Services

#### 3.2.1. Mapping Runtime

**Name:** Mapping runtime

**Description:** Owns the main rendering and interaction modules for deck.gl layers, MapLibre integration, shape workflows, viewports, symbols, overlays, and other map features.

**Technologies:** deck.gl ecosystem, MapLibre, TypeScript, React integration

**Deployment:** Runs inside the consumer application’s browser/client runtime

#### 3.2.2. Shared State and Event Layer

**Name:** Shared state and event layer

**Description:** Coordinates map state through per-map stores and event-driven flows for camera changes, interaction modes, cursor state, and viewport updates, often using the shared event bus and package-local store helpers.

**Technologies:** TypeScript stores, `@accelint/bus`, shared utility modules

**Deployment:** Runs inside the consumer application runtime and is consumed through focused subpath exports

## 4. Data Stores

### 4.1. Per-Map Runtime Stores

**Name:** Per-map state stores

**Type:** In-memory Maps and package-local store state

**Purpose:** Track per-map viewport, camera, cursor, and interaction state without persisting it to an external backend.

**Key Schemas / Collections:** map instance IDs, camera state, map mode ownership, cursor state, viewport state

### 4.2. Saved Viewport and Geospatial Payloads

**Name:** Saved viewport and layer payload data

**Type:** In-memory layer/config objects plus browser `localStorage` for saved viewports

**Purpose:** Represent geospatial layer inputs and persist user-saved viewport snapshots where supported.

**Key Schemas / Collections:** saved viewports, shape/layer inputs, symbol data, grid settings

## 5. External Integrations / APIs

| Service | Purpose | Integration Method |
|---------|---------|-------------------|
| deck.gl ecosystem | Layer rendering, overlays, editing, and interaction support | Optional peer/runtime integration |
| MapLibre | Base map and map event integration | Optional peer/runtime integration |
| `@accelint/bus` | Event-driven state coordination across map features | Peer dependency |
| `@accelint/logger` | Logging and diagnostics for shared runtime behavior | Peer dependency |
| Turf / milsymbol / NGA grid libs | Geospatial computation, symbology, and grid support | Optional integration |

## 6. Deployment & Infrastructure

**Cloud Provider:** None. This package is a published library, not a hosted service.

**Key Services Used:** npm registry for package distribution; GitHub Actions for CI/release automation; Constellation/Backstage metadata via `catalog-info.yaml`; Storybook for interactive package documentation

**CI/CD Pipeline:** GitHub Actions runs repo-wide build, test, lint, and format checks. Release workflows use Changesets to publish the package. Package development also participates in UI ecosystem workflows and uses local Storybook preview/test flows.

**Monitoring & Logging:** Not applicable as a hosted service. The package uses shared logging and event coordination internally, but it does not host an operational monitoring stack.

## 7. Security Considerations

**Authentication:** Not applicable. This package does not implement an application authentication system.

**Authorization:** Not applicable. The package provides geospatial UI behavior rather than an authorization model.

**Data Encryption:** Delegated to the host application and browser platform. The package mainly manages in-memory map state and optional local viewport persistence.

**Key Security Tools / Practices:** Per-map event filtering before state mutation, guarded localStorage parsing for saved viewports, repo-wide CI verification, and GitHub Actions security scanning.

## 8. Development & Testing Environment

> Testing patterns and standards are defined in [../../openspec/config.yaml](../../openspec/config.yaml); this section covers local setup and commands.

**Local Setup:** Use Node.js 22+ and pnpm 10+. Install from the repo root. Some geospatial dependencies are optional by feature, and local development includes Storybook preview plus package-local build/test flows.

**Testing Frameworks:** Vitest with jsdom, React Testing Library where relevant, shared test setup, and integration-style tests for map layers, state flows, and event-driven behavior.

**Code Quality Tools:** Biome, publint, Turbo, tsdown, TypeScript type-checking through the package’s split configs, and repo-wide formatting/lint automation.

## 9. Future Considerations / Roadmap

- No package-specific roadmap items were provided at review time.
- No package-specific architectural technical debt was provided at review time.

## 10. Project Identification

**Project Name:** `@accelint/map-toolkit`

**Repository URL:** https://github.com/gohypergiant/standard-toolkit

**Primary Contact / Team:** `group:default/pathfinder`

**Date of Last Update:** 2026-09-10

## 11. Glossary / Acronyms

| Term | Definition |
|------|-----------|
| deck.gl layer | Rendering module used to draw map data, symbols, grids, or overlays |
| Map mode | Interaction state that controls how the map responds to input |
| Saved viewport | Persisted map camera/viewport snapshot reused by a user |
| Milsymbol | Military symbology rendering library used in the tactical map surface |
