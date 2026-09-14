# Architecture Overview

<!-- Part of monorepo: see [../../ARCHITECTURE.md](../../ARCHITECTURE.md) for system-wide architecture -->

> **Tech Stack:** See [../../openspec/config.yaml](../../openspec/config.yaml) for detailed stack facts, coding patterns, and domain concepts.

This document serves as a critical, living reference designed to equip agents and engineers with a rapid and comprehensive understanding of the `@accelint/icons` package architecture. Update this document as the codebase evolves.

## 1. Project Structure

```text
packages/icons/
├── src/                      # Package source root for source SVGs and generated React components
│   ├── svg/                  # Raw SVG source assets
│   ├── icons/                # Generated React icon component files and exports
│   ├── template.js           # Generation template for component output
│   └── index.ts              # Root package entry
├── README.md                 # Package overview and icon usage guidance
├── CHANGELOG.md              # Release history
├── catalog-info.yaml         # Constellation/Backstage ownership metadata
├── package.json              # Published package metadata and per-icon subpath exports
├── svgr.config.mjs           # SVG-to-React generation configuration
├── tsconfig.json             # TypeScript library configuration
├── tsdown.config.ts          # ESM build configuration
└── ARCHITECTURE.md           # This document
```

## 2. High-Level System Diagram

> Complete stack facts and coding patterns are in [../../openspec/config.yaml](../../openspec/config.yaml). This section provides deployment and runtime context.

```text
Raw SVG assets
      │
      ▼
 @accelint/icons generation pipeline
      │
      ├── SVGR config
      ├── component template
      ▼
Generated React icon components
      │
      ▼
Consumer React applications and libraries
```

This package has no server, database, or hosted runtime. It is a published React icon library built from source SVG assets.

## 3. Core Components

### 3.1. Frontend

**Name:** React icon surface

**Description:** Consumer applications and libraries import `@accelint/icons` to render standardized SVG-based React icon components throughout the UI.

**Technologies:** React, TypeScript, SVG, SVGR-generated components

**Deployment:** Bundled into consumer applications; published to npm as a library

### 3.2. Backend Services

#### 3.2.1. Icon Component Runtime

**Name:** Icon component runtime

**Description:** Owns the published React component surface generated from raw SVG assets, exposing icon components for downstream rendering.

**Technologies:** React components, TypeScript typings, generated ESM exports

**Deployment:** Runs inside the consumer application’s browser/client runtime

#### 3.2.2. Icon Generation Pipeline

**Name:** Icon generation pipeline

**Description:** Converts raw SVG assets into typed React component files using package-local generation configuration and templates.

**Technologies:** SVGR, template-based code generation

**Deployment:** Runs during build and maintenance workflows, not as a hosted service

## 4. Data Stores

### 4.1. Source Icon Assets

**Name:** Raw icon assets

**Type:** Static SVG files

**Purpose:** Represent the authoritative source artwork used to generate published icon components.

**Key Schemas / Collections:** SVG files

### 4.2. Generated Icon Components

**Name:** Generated component outputs

**Type:** Static TypeScript/React component files

**Purpose:** Represent the consumable React icon surface emitted from the SVG source set.

**Key Schemas / Collections:** generated icon component files, per-icon exports

## 5. External Integrations / APIs

| Service | Purpose | Integration Method |
|---------|---------|-------------------|
| React | Runtime rendering of generated icon components | Peer dependency |
| SVGR | Build-time conversion of SVG assets into React components | Build dependency |

## 6. Deployment & Infrastructure

**Cloud Provider:** None. This package is a published library, not a hosted service.

**Key Services Used:** npm registry for package distribution; GitHub Actions for CI/release automation; Constellation/Backstage metadata via `catalog-info.yaml`

**CI/CD Pipeline:** GitHub Actions runs repo-wide build, lint, and format flows. Release workflows use Changesets to publish the package. Package build steps include SVG-to-component generation and `tsdown` packaging.

**Monitoring & Logging:** Not applicable. The package has no hosted runtime.

## 7. Security Considerations

**Authentication:** Not applicable. This package does not implement authentication.

**Authorization:** Not applicable. This package provides icon components only.

**Data Encryption:** Not applicable. The package does not persist or transmit data.

**Key Security Tools / Practices:** Static generated asset surface, accessibility-oriented icon props such as title support, repo-wide CI verification, and GitHub Actions security scanning.

## 8. Development & Testing Environment

> Testing patterns and standards are defined in [../../openspec/config.yaml](../../openspec/config.yaml); this section covers local setup and commands.

**Local Setup:** Use Node.js 22+ and pnpm 10+. Install from the repo root, then run package or repo build/format flows to regenerate and package icons as needed.

**Testing Frameworks:** This package does not expose a notable package-local runtime test suite. Validation is primarily through generation, build, lint, and published component consumption.

**Code Quality Tools:** Biome, publint, Turbo, SVGR-based generation, tsdown, and repo-wide formatting/lint automation.

## 9. Future Considerations / Roadmap

- No package-specific roadmap items were provided at review time.
- No package-specific architectural technical debt was provided at review time.

## 10. Project Identification

**Project Name:** `@accelint/icons`

**Repository URL:** https://github.com/gohypergiant/standard-toolkit

**Primary Contact / Team:** `group:default/pathfinder`

**Date of Last Update:** 2026-09-10

## 11. Glossary / Acronyms

| Term | Definition |
|------|-----------|
| SVG | Scalable Vector Graphics format used as the source for icon assets |
| SVGR | Toolchain that converts SVG files into React component modules |
| Per-icon subpath | Narrow export such as an individual icon module rather than the whole package |
| currentColor | SVG styling approach that lets icons inherit text color from their parent context |
