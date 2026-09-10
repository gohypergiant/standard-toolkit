# Architecture Overview

<!-- Part of monorepo: see [../../ARCHITECTURE.md](../../ARCHITECTURE.md) for system-wide architecture -->

> **Tech Stack:** See [../../openspec/config.yaml](../../openspec/config.yaml) for detailed stack facts, coding patterns, and domain concepts.

This document serves as a critical, living reference designed to equip agents and engineers with a rapid and comprehensive understanding of the `@accelint/ntds` package architecture. Update this document as the codebase evolves.

## 1. Project Structure

```text
packages/ntds/
├── src/                       # Package source root for generated symbol components and spritesheet outputs
│   ├── core/                 # Generated React SVG symbol components
│   ├── spritesheets/         # Masked spritesheet assets and metadata exports
│   ├── constants.ts          # Shared NTDS color constants
│   └── index.ts              # Generated root barrel exporting public package API
├── icons/                     # Source SVG assets used to generate components and spritesheets
│   ├── core/                 # Source icon set for React component generation
│   └── masked/               # Source icon set for spritesheet generation
├── assets/                    # Supporting visual/documentation assets
├── README.md                  # Package overview and usage examples
├── CHANGELOG.md               # Release history
├── catalog-info.yaml          # Constellation/Backstage ownership metadata
├── package.json               # Published package metadata and asset/component exports
├── tsconfig.json              # TypeScript library configuration
├── tsdown.config.ts           # ESM build configuration
└── ARCHITECTURE.md            # This document
```

## 2. High-Level System Diagram

> Complete stack facts and coding patterns are in [../../openspec/config.yaml](../../openspec/config.yaml). This section provides deployment and runtime context.

```text
Source NTDS SVG assets
         │
         ▼
      @accelint/ntds
         │
 ┌───────┼───────────────┬──────────────┐
 ▼       ▼               ▼              ▼
core   masked         constants     asset exports
icons  spritesheet    affiliation   PNG/JSON/TS
      generation      colors
         │
         ▼
React symbols and map-friendly spritesheet outputs
```

This package has no server, database, or hosted runtime. It is a published tactical symbology library that exposes React SVG components and spritesheet assets.

## 3. Core Components

### 3.1. Frontend

**Name:** Tactical symbology integration layer

**Description:** Consumer applications and packages import `@accelint/ntds` to render NTDS-aligned tactical symbols either as React components or as spritesheet-backed assets for map layers.

**Technologies:** React, TypeScript, SVG, generated spritesheet assets

**Deployment:** Bundled into consumer applications; published to npm as a library

### 3.2. Backend Services

#### 3.2.1. Symbol Component Runtime

**Name:** Symbol component runtime

**Description:** Owns the React component surface generated from NTDS source icons, including affiliation-aware symbol variants and related exports.

**Technologies:** React SVG components, TypeScript typings

**Deployment:** Runs inside the consumer application’s browser/client runtime

#### 3.2.2. Spritesheet Generation Surface

**Name:** Spritesheet generation surface

**Description:** Provides deck.gl-friendly masked spritesheet outputs and metadata so consumers can render tactical icons efficiently in map contexts.

**Technologies:** spritesheet generation tooling, asset exports, TypeScript metadata modules

**Deployment:** Consumed as static assets and metadata through published package exports

## 4. Data Stores

### 4.1. Source Symbol Assets

**Name:** NTDS source icon assets

**Type:** Static SVG files

**Purpose:** Represent the authoritative tactical symbology source inputs used to generate package outputs.

**Key Schemas / Collections:** core icon SVGs, masked icon SVGs

### 4.2. Generated Symbol Outputs

**Name:** Published symbol outputs

**Type:** Static React component files, JSON metadata, and PNG spritesheet assets

**Purpose:** Represent the consumable tactical symbol surface used by React UIs and map-rendering layers.

**Key Schemas / Collections:** React symbol components, masked spritesheet metadata, spritesheet images

## 5. External Integrations / APIs

| Service | Purpose | Integration Method |
|---------|---------|-------------------|
| React | Runtime rendering of symbol components | Peer dependency |
| `smeegl` | Spritesheet generation during build workflows | Build tooling |
| deck.gl icon-layer style consumers | Primary downstream use case for spritesheet outputs | Static asset integration |

## 6. Deployment & Infrastructure

**Cloud Provider:** None. This package is a published library, not a hosted service.

**Key Services Used:** npm registry for package distribution; GitHub Actions for CI/release automation; Constellation/Backstage metadata via `catalog-info.yaml`

**CI/CD Pipeline:** GitHub Actions runs repo-wide build, lint, and release automation. Package build flows include icon/spritesheet generation plus `tsdown` packaging.

**Monitoring & Logging:** Not applicable. The package has no hosted runtime.

## 7. Security Considerations

**Authentication:** Not applicable. This package does not implement authentication.

**Authorization:** Not applicable. This package provides tactical symbol assets rather than access control.

**Data Encryption:** Not applicable. The package does not persist or transmit data.

**Key Security Tools / Practices:** Static generated asset surface, repo-wide CI verification, and GitHub Actions security scanning.

## 8. Development & Testing Environment

> Testing patterns and standards are defined in [../../openspec/config.yaml](../../openspec/config.yaml); this section covers local setup and commands.

**Local Setup:** Use Node.js 22+ and pnpm 10+. Install from the repo root, then use package or repo build flows to regenerate and package symbol outputs.

**Testing Frameworks:** This package does not expose a notable package-local runtime test suite. Validation is primarily through generation, build, and downstream consumption.

**Code Quality Tools:** Biome, publint, Turbo, spritesheet generation tooling, tsdown, and repo-wide formatting/lint automation.

## 9. Future Considerations / Roadmap

- No package-specific roadmap items were provided at review time.
- No package-specific architectural technical debt was provided at review time.

## 10. Project Identification

**Project Name:** `@accelint/ntds`

**Repository URL:** https://github.com/gohypergiant/standard-toolkit

**Primary Contact / Team:** `group:default/pathfinder`

**Date of Last Update:** 2026-09-10

## 11. Glossary / Acronyms

| Term | Definition |
|------|-----------|
| NTDS | Naval Tactical Data System symbology family used by the package |
| Spritesheet | Packed image atlas plus metadata used for efficient symbol rendering |
| Masked icon | Source symbol variant intended for spritesheet-oriented rendering |
| Affiliation color | Color token representing tactical affiliation such as friendly or hostile |
