# Architecture Overview

<!-- Part of monorepo: see [../../ARCHITECTURE.md](../../ARCHITECTURE.md) for system-wide architecture -->

> **Tech Stack:** See [../../openspec/config.yaml](../../openspec/config.yaml) for detailed stack facts, coding patterns, and domain concepts.

This document serves as a critical, living reference designed to equip agents and engineers with a rapid and comprehensive understanding of the `@accelint/postcss-tailwind-css-modules` package architecture. Update this document as the codebase evolves.

## 1. Project Structure

```text
packages/postcss-tailwind-css-modules/
├── src/                   # Package source root for the PostCSS plugin
│   ├── index.ts          # Plugin implementation
│   └── index.test.ts     # CSS transformation tests
├── readme.md              # Package overview and setup guidance
├── CHANGELOG.md           # Release history
├── catalog-info.yaml      # Constellation/Backstage ownership metadata
├── package.json           # Published package metadata and dual-format exports
├── tsconfig.json          # TypeScript library configuration
├── tsdown.config.ts       # Dual ESM/CJS build configuration
├── vitest.config.js       # Shared Vitest configuration entry
└── ARCHITECTURE.md        # This document
```

## 2. High-Level System Diagram

> Complete stack facts and coding patterns are in [../../openspec/config.yaml](../../openspec/config.yaml). This section provides deployment and runtime context.

```text
CSS Modules source
        │
        ▼
 @accelint/postcss-tailwind-css-modules
        │
        ▼
Selector rewrite for Tailwind group/peer classes
        │
        ▼
Processed CSS Modules output
        │
        ▼
Consumer app build pipeline
```

This package has no server, database, or hosted runtime. It is a published build-time PostCSS plugin used during application and library compilation.

## 3. Core Components

### 3.1. Frontend

**Name:** Build-pipeline integration layer

**Description:** Consumer applications and packages include this plugin in their PostCSS pipeline so Tailwind group/peer selectors continue to work correctly with CSS Modules.

**Technologies:** TypeScript, PostCSS, selector parsing, dual ESM/CJS packaging

**Deployment:** Loaded into consumer build pipelines; published to npm as a library

### 3.2. Backend Services

#### 3.2.1. PostCSS Plugin Runtime

**Name:** PostCSS plugin runtime

**Description:** Owns the selector transformation logic that rewrites Tailwind-oriented group and peer classes into CSS Modules-compatible selectors.

**Technologies:** PostCSS plugin API, `postcss-selector-parser`

**Deployment:** Runs during CSS build processing, not as a hosted service

#### 3.2.2. Transformation Test Surface

**Name:** Transformation verification surface

**Description:** Provides snapshot-oriented test coverage so expected selector rewrites remain stable across plugin changes.

**Technologies:** Vitest, inline CSS transformation tests

**Deployment:** Runs in local and CI test flows only

## 4. Data Stores

### 4.1. CSS Input and Output

**Name:** CSS transformation payloads

**Type:** In-memory CSS AST and selector strings

**Purpose:** Represent the CSS Module source content and rewritten selectors being transformed during build time.

**Key Schemas / Collections:** selector strings, PostCSS rule nodes

### 4.2. Transformation Markers

**Name:** Internal processed markers

**Type:** In-memory symbol tagging

**Purpose:** Prevent duplicate transformation of already-processed rules during a plugin pass.

**Key Schemas / Collections:** per-rule processing markers

## 5. External Integrations / APIs

| Service | Purpose | Integration Method |
|---------|---------|-------------------|
| PostCSS | Plugin host runtime | Peer dependency |
| `postcss-selector-parser` | Selector AST rewriting | Peer dependency |
| Tailwind CSS build flows | Primary consumer use case for selector rewriting | Optional integration |

## 6. Deployment & Infrastructure

**Cloud Provider:** None. This package is a published library, not a hosted service.

**Key Services Used:** npm registry for package distribution; GitHub Actions for CI/release automation; Constellation/Backstage metadata via `catalog-info.yaml`

**CI/CD Pipeline:** GitHub Actions runs repo-wide build, test, lint, and format checks. Release workflows use Changesets to publish the package. Local package builds emit both ESM and CommonJS outputs.

**Monitoring & Logging:** Not applicable. The package has no hosted runtime.

## 7. Security Considerations

**Authentication:** Not applicable. This package does not implement authentication.

**Authorization:** Not applicable. This package performs CSS transformation only.

**Data Encryption:** Not applicable. The package does not persist or transmit data.

**Key Security Tools / Practices:** Scoped transformation to `.module.css` flows, duplicate-processing guards, inline snapshot coverage for selector rewrites, repo-wide CI verification, and GitHub Actions security scanning.

## 8. Development & Testing Environment

> Testing patterns and standards are defined in [../../openspec/config.yaml](../../openspec/config.yaml); this section covers local setup and commands.

**Local Setup:** Use Node.js 22+ and pnpm 10+. Install from the repo root, then run repo-wide verification or package-local scripts from `packages/postcss-tailwind-css-modules`.

**Testing Frameworks:** Vitest with the shared no-DOM base config. Tests execute the plugin through PostCSS and verify selector transformations with inline snapshots.

**Code Quality Tools:** Biome, publint, Turbo, tsdown, and repo-wide formatting/lint automation.

## 9. Future Considerations / Roadmap

- No package-specific roadmap items were provided at review time.
- No package-specific architectural technical debt was provided at review time.

## 10. Project Identification

**Project Name:** `@accelint/postcss-tailwind-css-modules`

**Repository URL:** https://github.com/gohypergiant/standard-toolkit

**Primary Contact / Team:** `group:default/pathfinder`

**Date of Last Update:** 2026-09-10

## 11. Glossary / Acronyms

| Term | Definition |
|------|-----------|
| CSS Modules | Scoped CSS system that rewrites class names to avoid collisions |
| group/peer selector | Tailwind stateful selector pattern that references parent or sibling state |
| PostCSS AST | Parsed CSS node tree used for programmatic transformation |
| Dual-format package | Package emitted in both ESM and CommonJS formats |
