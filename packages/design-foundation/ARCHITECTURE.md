# Architecture Overview

<!-- Part of monorepo: see [../../ARCHITECTURE.md](../../ARCHITECTURE.md) for system-wide architecture -->

> **Tech Stack:** See [../../openspec/config.yaml](../../openspec/config.yaml) for detailed stack facts, coding patterns, and domain concepts.

This document serves as a critical, living reference designed to equip agents and engineers with a rapid and comprehensive understanding of the `@accelint/design-foundation` package architecture. Update this document as the codebase evolves.

## 1. Project Structure

```text
packages/design-foundation/
├── src/                       # Package source root for tokens, styles, helpers, and generated artifacts
│   ├── tokens/                # Primitive and semantic token definitions, generated themes, and token types
│   ├── variants/              # Generated variant definitions and Tailwind-oriented CSS
│   ├── lib/                   # CSS helper utilities and deprecated Vite/Webpack integration helpers
│   ├── documentation/         # Package-local styling and Tailwind guidance
│   └── index.css              # Published stylesheet entrypoint
├── scripts/                   # Token and variant generation scripts
├── README.md                  # Package overview and usage guidance
├── CHANGELOG.md               # Release history
├── catalog-info.yaml          # Constellation/Backstage ownership metadata
├── package.json               # Published package metadata and subpath exports
├── tsconfig.json              # Solution-style TypeScript config
├── tsconfig.dist.json         # Source build TypeScript config
├── tsdown.config.ts           # ESM build configuration
├── vite.config.ts             # Package-local Vite support
└── ARCHITECTURE.md            # This document
```

## 2. High-Level System Diagram

> Complete stack facts and coding patterns are in [../../openspec/config.yaml](../../openspec/config.yaml). This section provides deployment and runtime context.

```text
Design token sources and variant definitions
                    │
                    ▼
      @accelint/design-foundation package
                    │
      ┌─────────────┼─────────────┬──────────────┐
      ▼             ▼             ▼              ▼
   tokens        themes.css    variants      CSS helpers
                    │
                    ▼
     Tailwind/CSS variables and styling primitives
                    │
                    ▼
     Consumed by design-toolkit and downstream apps
```

This package has no server, database, or hosted runtime. It is a published styling foundation library that generates and exports design tokens, CSS themes, and supporting helpers.

## 3. Core Components

### 3.1. Frontend

**Name:** Styling foundation integration layer

**Description:** Consumer applications and packages such as `@accelint/design-toolkit` import this package to obtain shared design tokens, CSS variables, theme files, and styling helpers.

**Technologies:** TypeScript, Tailwind CSS v4, CSS, ESM

**Deployment:** Bundled into consumer applications or libraries; published to npm as a library

### 3.2. Backend Services

#### 3.2.1. Token and Theme Runtime

**Name:** Token and theme runtime

**Description:** Owns the generated design token surface, published theme CSS, and token-derived values used across the Accelint UI ecosystem.

**Technologies:** TypeScript token objects, generated CSS, Tailwind integration

**Deployment:** Imported through stylesheet and token subpaths such as `@accelint/design-foundation/styles` and `@accelint/design-foundation/tokens`

#### 3.2.2. Variant and Helper Modules

**Name:** Variant and helper modules

**Description:** Provides generated variants and helper utilities that support CSS Modules, Tailwind usage, and package integration patterns.

**Technologies:** TypeScript helper modules, generated CSS, optional Vite/Webpack helpers

**Deployment:** Consumed by downstream packages and app build pipelines

## 4. Data Stores

### 4.1. Token Definitions

**Name:** Design token data

**Type:** Static TypeScript objects and generated CSS variables

**Purpose:** Represent semantic and primitive design values such as colors, spacing, typography, and theme state.

**Key Schemas / Collections:** token trees, theme CSS variables, deck.gl RGBA token values

### 4.2. Variant Definitions

**Name:** Variant configuration

**Type:** Static variant definitions and generated CSS

**Purpose:** Represent styling variants that are compiled into package-local CSS and Tailwind-oriented outputs.

**Key Schemas / Collections:** variant rules, generated variant CSS

## 5. External Integrations / APIs

| Service | Purpose | Integration Method |
|---------|---------|-------------------|
| Tailwind CSS | Theme and utility generation | Peer dependency |
| `@accelint/constants` | Shared constants used in foundation helpers and token generation | Runtime dependency |
| `@accelint/converters` | Supporting conversion helpers for token/style tooling | Runtime dependency |
| `@accelint/predicates` | Supporting validation helpers for styling/tooling flows | Runtime dependency |

## 6. Deployment & Infrastructure

**Cloud Provider:** None. This package is a published library, not a hosted service.

**Key Services Used:** npm registry for package distribution; GitHub Actions for CI/release automation; Constellation/Backstage metadata via `catalog-info.yaml`

**CI/CD Pipeline:** GitHub Actions runs repo-wide build, test, lint, and format checks. Release workflows use Changesets to publish the package. Package changes also participate in visual regression and MemLab-oriented workflows when the UI ecosystem is exercised.

**Monitoring & Logging:** Not applicable. The package has no hosted runtime or service-level observability stack.

## 7. Security Considerations

**Authentication:** Not applicable. This package does not implement authentication.

**Authorization:** Not applicable. This package provides styling primitives rather than access control.

**Data Encryption:** Not applicable. The package does not persist or transmit data.

**Key Security Tools / Practices:** Static token/theme generation reduces runtime statefulness, repo-wide CI verification protects published artifacts, and GitHub Actions security scanning applies at the monorepo level.

## 8. Development & Testing Environment

> Testing patterns and standards are defined in [../../openspec/config.yaml](../../openspec/config.yaml); this section covers local setup and commands.

**Local Setup:** Use Node.js 22+ and pnpm 10+. Install from the repo root. The package includes generation scripts for tokens and variants, and README guidance points to Design Toolkit preview flows plus editor configuration for Tailwind/Biome support.

**Testing Frameworks:** Vitest with the shared no-DOM base config. Tests are focused on CSS/token helper behavior rather than component rendering.

**Code Quality Tools:** Biome, Prettier for CSS-oriented formatting, publint, Turbo, tsdown, and repo-wide formatting/lint automation.

## 9. Future Considerations / Roadmap

- No package-specific roadmap items were provided at review time.
- No package-specific architectural technical debt was provided at review time.

## 10. Project Identification

**Project Name:** `@accelint/design-foundation`

**Repository URL:** https://github.com/gohypergiant/standard-toolkit

**Primary Contact / Team:** `group:default/pathfinder`

**Date of Last Update:** 2026-09-10

## 11. Glossary / Acronyms

| Term | Definition |
|------|-----------|
| Design token | Canonical design value such as a color, spacing size, or typography setting |
| Theme CSS variable | Generated CSS variable that represents a token value in a given theme |
| Variant | Reusable styling condition compiled into CSS/Tailwind-oriented outputs |
| Tailwind helper | Utility that adapts design-foundation values into consuming build pipelines |
