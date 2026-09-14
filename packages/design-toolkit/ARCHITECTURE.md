# Architecture Overview

<!-- Part of monorepo: see [../../ARCHITECTURE.md](../../ARCHITECTURE.md) for system-wide architecture -->

> **Tech Stack:** See [../../openspec/config.yaml](../../openspec/config.yaml) for detailed stack facts, coding patterns, and domain concepts.

This document serves as a critical, living reference designed to equip agents and engineers with a rapid and comprehensive understanding of the `@accelint/design-toolkit` package architecture. Update this document as the codebase evolves.

## 1. Project Structure

```text
packages/design-toolkit/
├── src/                         # Package source root for components, hooks, providers, docs, and shared utilities
│   ├── components/             # Component families such as forms, navigation, overlays, data display, media, and advanced widgets
│   ├── hooks/                  # Reusable UI hooks
│   ├── providers/              # Theme and portal providers
│   ├── foundation/             # Foundation-related examples and docs
│   ├── icons/                  # Icon usage support and stories
│   ├── documentation/          # Package-local docs and guides
│   ├── lib/                    # Shared types and support modules
│   ├── utils/                  # Shared utility helpers
│   └── index.ts                # Generated root barrel exporting the public package API
├── .storybook/                 # Package-local Storybook configuration
├── README.md                   # Package overview, usage, and local development notes
├── CHANGELOG.md                # Release history
├── catalog-info.yaml           # Constellation/Backstage ownership metadata
├── package.json                # Published package metadata and extensive export surface
├── tsconfig.json               # Solution-style TypeScript config
├── tsconfig.dist.json          # Source build TypeScript config
├── tsconfig.dev.json           # Tests and stories TypeScript config
├── vitest.config.ts            # jsdom test configuration
└── ARCHITECTURE.md             # This document
```

## 2. High-Level System Diagram

> Complete stack facts and coding patterns are in [../../openspec/config.yaml](../../openspec/config.yaml). This section provides deployment and runtime context.

```text
           Consumer React application
                     │
                     ▼
          @accelint/design-toolkit
                     │
   ┌─────────────────┼──────────────────┬─────────────────┐
   ▼                 ▼                  ▼                 ▼
components         hooks            providers         styling layer
(forms, nav,     UI behavior        theme/portal      design-foundation
 overlays,         helpers           context          + CSS Modules
 widgets)
                     │
                     ▼
        React Aria / React component composition
```

This package has no server, database, or hosted runtime of its own. It is a published React component library consumed inside browser-based applications.

## 3. Core Components

### 3.1. Frontend

**Name:** React component surface

**Description:** `@accelint/design-toolkit` is the main shared UI component library for Accelint applications. It exposes a broad set of components, hooks, and providers spanning forms, navigation, data display, overlays, media, and more specialized widgets.

**Technologies:** React 19, TypeScript, React Aria, CSS Modules, Tailwind CSS integration

**Deployment:** Bundled into consumer applications; published to npm as a library

### 3.2. Backend Services

#### 3.2.1. Component Runtime

**Name:** Component runtime

**Description:** Owns the interactive React component surface, including reusable primitives, higher-level composed widgets, accessibility-focused wrappers, and stateful UI building blocks.

**Technologies:** React, TypeScript, react-aria-components, react-aria, react-stately

**Deployment:** Runs inside the consumer application’s browser/client runtime

#### 3.2.2. Hooks and Provider Layer

**Name:** Hooks and provider layer

**Description:** Provides reusable UI hooks and provider modules such as theming and portal support, enabling package-wide composition patterns and shared runtime coordination.

**Technologies:** React hooks, provider context, design-foundation integration

**Deployment:** Imported through root and granular exports such as `@accelint/design-toolkit/providers/*`

## 4. Data Stores

### 4.1. Component and Widget State

**Name:** In-memory UI state

**Type:** React state, context state, and package-local stores

**Purpose:** Manage transient component behavior such as notices, drawers, media state, kanban structure, gantt state, theme preferences, and advanced widget state.

**Key Schemas / Collections:** notice queues, gantt layout state, kanban card maps, theme state

### 4.2. Event-Driven and Provider State

**Name:** Shared integration state

**Type:** In-memory bus-driven state and provider-managed context

**Purpose:** Coordinate cross-component interactions and application-facing behaviors such as drawer/view-stack control and theme propagation.

**Key Schemas / Collections:** bus events, provider context values, theme token overrides

## 5. External Integrations / APIs

| Service | Purpose | Integration Method |
|---------|---------|-------------------|
| `@accelint/design-foundation` | Shared tokens, styles, and theme primitives | Peer dependency |
| `@accelint/icons` | Icon surface used by components | Peer dependency |
| `@accelint/bus` | Cross-component event-driven coordination in some component families | Peer dependency |
| React Aria ecosystem | Accessibility-focused component primitives and state handling | Peer dependencies |
| `@tanstack/react-table` / `react-querybuilder` / `zod` / `zustand` | Feature-specific table, query-builder, validation, and store support | Peer dependencies |

## 6. Deployment & Infrastructure

**Cloud Provider:** None. This package is a published library, not a hosted service.

**Key Services Used:** npm registry for package distribution; GitHub Actions for CI/release automation; Constellation/Backstage metadata via `catalog-info.yaml`; Storybook for interactive package documentation

**CI/CD Pipeline:** GitHub Actions runs repo-wide build, test, lint, and format checks. Release workflows use Changesets to publish the package. UI-focused workflows such as visual regression and MemLab are relevant to this package’s component surface.

**Monitoring & Logging:** Not applicable as a hosted service. Some components depend on shared logging or event-bus packages, but the package itself does not run an operational monitoring stack.

## 7. Security Considerations

**Authentication:** Not applicable. This package does not implement an application authentication system.

**Authorization:** Not applicable. This package provides UI components rather than an authorization model.

**Data Encryption:** Delegated to the host application and browser platform. This package mainly manages in-memory UI state.

**Key Security Tools / Practices:** Accessibility-oriented and defensive component patterns, provider-scoped state rather than persistent storage, repo-wide CI verification, visual regression and memory checks for UI reliability, and GitHub Actions security scanning.

## 8. Development & Testing Environment

> Testing patterns and standards are defined in [../../openspec/config.yaml](../../openspec/config.yaml); this section covers local setup and commands.

**Local Setup:** Use Node.js 22+ and pnpm 10+. Install from the repo root. Local development includes Storybook preview flows, package-local build/test/typecheck scripts, and editor guidance for Tailwind and Biome support.

**Testing Frameworks:** Vitest with jsdom, React Testing Library, `@testing-library/user-event`, and `@testing-library/jest-dom`. Storybook is used for interactive review, and UI ecosystem workflows include visual regression and MemLab checks.

**Code Quality Tools:** Biome, Prettier for CSS/Tailwind formatting, TypeScript type-checking, publint, Turbo, and repo-wide formatting/lint automation.

## 9. Future Considerations / Roadmap

- No package-specific roadmap items were provided at review time.
- No package-specific architectural technical debt was provided at review time.

## 10. Project Identification

**Project Name:** `@accelint/design-toolkit`

**Repository URL:** https://github.com/gohypergiant/standard-toolkit

**Primary Contact / Team:** `group:default/pathfinder`

**Date of Last Update:** 2026-09-10

## 11. Glossary / Acronyms

| Term | Definition |
|------|-----------|
| React Aria | Accessibility-focused React primitives and state patterns used throughout the package |
| Provider | React context wrapper that distributes shared runtime behavior such as theme state |
| Storybook | Interactive documentation and preview environment for component development |
| Gantt / Kanban / Query Builder | Higher-level widget families included in the package’s advanced component surface |
