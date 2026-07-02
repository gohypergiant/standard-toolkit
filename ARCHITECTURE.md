# Architecture Overview

> **Tech Stack:** See [openspec/config.yaml](./openspec/config.yaml) for detailed stack facts, coding patterns, and domain concepts.

This document serves as a critical, living reference designed to equip agents and engineers with a rapid and comprehensive understanding of the codebase's architecture. Update this document as the codebase evolves.

## 1. Project Structure

```
standard-toolkit/
├── apps/
│   └── next/                    # Next.js 16 demo/testbed app (React Compiler); hosts Playwright integration + MemLab memory tests
├── packages/                    # 20 published @accelint/* libraries
│   ├── design-foundation/       # Design tokens + Tailwind CSS v4 theme (base of the UX ecosystem)
│   ├── design-toolkit/          # React component library built on react-aria-components, styled with CSS Modules
│   ├── map-toolkit/             # Geospatial map components: deck.gl layers, MapLibre, camera/viewport/map-mode features
│   ├── icons/                   # General-purpose SVG icon library
│   ├── ntds/                    # NTDS-compliant tactical symbol SVG components + COP spritesheet
│   ├── geo/                     # Coordinate parsing/formatting (DD, DDM, DMS, MGRS)
│   ├── dataset/                 # Type-safe geospatial dataset configuration (lenses + runtime validation)
│   ├── bus/                     # Typed event bus over BroadcastChannel (app-wide decoupling mechanism)
│   ├── core/                    # Function composition and array/object/logic utilities
│   ├── constants/               # Shared constant values
│   ├── converters/              # Value conversions (colors, booleans, numbers, coordinates, tile coords)
│   ├── formatters/              # Formatting functions for readability/consistency
│   ├── predicates/              # Predicate functions (property-tested with fast-check)
│   ├── math/                    # Basic math functions
│   ├── temporal/                # Date/time parsing, formatting, timers
│   ├── logger/                  # Logging with callsite tracking
│   ├── web-worker/              # Web Worker helpers (@accelint/worker)
│   ├── websocket/               # WebSocket helpers
│   ├── hotkey-manager/          # Keyboard shortcut management
│   └── postcss-tailwind-css-modules/  # PostCSS plugin fixing Tailwind + CSS Modules interop
├── tooling/                     # 8 shared config/tooling packages
│   ├── typescript-config/       # Shared tsconfig presets (tsc/bundler × dom/no-dom × app/library)
│   ├── biome-config/            # Shared Biome lint/format config
│   ├── vitest-config/           # Shared Vitest config + BroadcastChannel mock
│   ├── eslint-config/           # Legacy shared ESLint config
│   ├── prettier-config/         # Legacy shared Prettier config
│   ├── constellation-tracker/   # Keeps catalog-info.yaml current for the Constellation catalog
│   ├── smeegl/                  # Spreet-based spritesheet/texture packager for deck.gl
│   └── turbo-filter/            # Turborepo task filtering utility
├── .agents/                     # AI assistant guides (outline.md → ecosystem.md, react.md, components.md)
├── .github/workflows/           # CI/CD (see Section 6)
├── documentation/               # ADRs, getting-started, beta/experimental release guides
├── openspec/                    # OpenSpec config + spec-driven change artifacts
├── scripts/                     # Repo maintenance (barrel indexer, license header injector)
├── AGENTS.md                    # Agent behavior rules and verification gate (CLAUDE.md points here)
├── README.md                    # Project overview
└── ARCHITECTURE.md              # This document
```

## 2. High-Level System Diagram

> Complete stack facts and coding patterns are in [openspec/config.yaml](./openspec/config.yaml). This section provides deployment and runtime context.

```
                ┌─────────────────────────────────────────────┐
                │  Consumer applications (Accelint C2 family) │
                └────────▲───────────────────────▲────────────┘
                         │ npm install           │ browse docs
              ┌──────────┴──────────┐   ┌────────┴─────────────────┐
              │ public npm registry │   │ Storybook sites          │
              │ (@accelint scope)   │   │ design-/map-toolkit      │
              └──────────▲──────────┘   │ .accelint.io             │
                         │ changesets    └────────▲────────────────┘
                         │ release CI             │ PaaS auto-deploy
┌────────────────────────┴────────────────────────┴────────────────┐
│ standard-toolkit monorepo (pnpm workspaces + Turbo)              │
│                                                                  │
│  UI:          design-foundation ──▶ design-toolkit    icons/ntds │
│               map-toolkit (deck.gl + MapLibre)                   │
│  Geospatial:  geo · dataset · converters · formatters            │
│  Infra utils: bus (BroadcastChannel) · worker · websocket ·      │
│               logger · hotkey-manager · temporal                 │
│  Foundation:  core · constants · math · predicates               │
│  Tooling:     shared ts/biome/vitest configs · smeegl · trackers │
│                                                                  │
│  apps/next: demo + integration/memory test harness               │
└──────────────────────────────────────────────────────────────────┘
```

There is no server, database, or hosted runtime: the product of this repository is the set of published npm packages. Cross-package decoupling at runtime (inside consumer apps) happens via the `@accelint/bus` event bus with namespaced events (`"map-mode:change:request"`).

## 3. Core Components

### 3.1. Published Packages (`packages/*`)

**UI ecosystem** — `design-foundation` (tokens + Tailwind v4 theme) → `design-toolkit` (react-aria-components-based components, CSS Modules styling) and `icons`/`ntds` (SVG icon sets, including NTDS tactical symbols keyed by platform × affiliation).

**Geospatial ecosystem** — `map-toolkit` (deck.gl ~9.2 + maplibre-gl ^5.7 layers/hooks, feature-organized: deckgl/, camera/, map-mode/, viewport/, cursor-coordinates/), `geo` (DD/DDM/DMS/MGRS coordinate parsing via composable RegExp), `dataset` (type-safe geospatial config), plus `converters`/`formatters` for per-frame hot-path utilities.

**Infrastructure utilities** — `bus` (typed BroadcastChannel singleton with `useOn`/`useEmit` React hooks), `worker`, `websocket`, `logger`, `hotkey-manager`, `temporal`.

**Foundation utilities** — `core`, `constants`, `math`, `predicates`.

**Technologies:** TypeScript strict (ESM-only, `"type": "module"`), React 19, built with tsdown (unbundled, tree-shakeable, dts).

**Deployment:** Published to the public npm registry under `@accelint` via Changesets.

### 3.2. Demo / Test Application (`apps/next`)

**Description:** Next.js 16 app (React Compiler enabled) consuming the packages; the harness for Playwright integration tests, visual regression, and MemLab memory-leak tests. Not deployed as a product.

### 3.3. Documentation Sites

**Description:** Storybooks for design-toolkit and map-toolkit, published at design-toolkit.accelint.io and map-toolkit.accelint.io.

**Deployment:** PaaS auto-deploy (Vercel/Netlify-style, connected to the repo outside GitHub Actions).

### 3.4. Shared Tooling (`tooling/*`)

Internal-facing packages standardizing the toolchain across Accelint projects: `typescript-config`, `biome-config`, `vitest-config`, `eslint-config`, `prettier-config`, `constellation-tracker`, `smeegl`, `turbo-filter`.

## 4. Data Stores

None. This is a library monorepo with no databases, caches, or queues. Data handled by the libraries is in-memory geospatial data: coordinates (DD/DDM/DMS/MGRS), GeoJSON (via turf), and map tile coordinates. The `bus` package uses the browser `BroadcastChannel` API for cross-context messaging inside consumer apps.

## 5. External Integrations / APIs

| Service | Purpose | Integration Method |
|---------|---------|-------------------|
| npm registry (public) | Package publishing under `@accelint` | Changesets release via GitHub Actions |
| Vercel/Netlify-style PaaS | Storybook hosting (design-/map-toolkit.accelint.io) | Repo-connected auto-deploy |
| Constellation (catalog) | Service catalog registration | `catalog-info.yaml` maintained by `constellation-tracker` on version |
| TruffleHog | Secret scanning | `security.yml` GitHub Actions workflow |

## 6. Deployment & Infrastructure

**Cloud Provider:** None owned by this repo — deliverables are npm packages; Storybooks on a repo-connected PaaS.

**CI/CD Pipeline:** GitHub Actions (`.github/workflows/`):

- `ci.yml` — build, format, lint, test on PRs
- `release.yml` — Changesets action → npm publish (baseBranch `main`)
- `release-beta.yml` / `publish-experimental.yml` / `experimental-age-tracker.yml` — beta and experimental release channels
- `visual-regression.yml` / `visual-regression-update.yml` — Playwright/Chromium visual tests
- `memlab.yml` — memory-leak detection against apps/next
- `coverage-comment.yml` — PR coverage reporting
- `security.yml` — TruffleHog secret scanning

**Build orchestration:** Turbo (`turbo.json`); `build` depends on `^index` (generated barrels) and `^build`. Pre-commit via lefthook runs format + license headers + index.

**Monitoring & Logging:** Not applicable (no hosted runtime).

## 7. Security Considerations

**Authentication / Authorization:** Not applicable — no hosted services or user auth in this repo.

**Supply-chain / repo security:** TruffleHog secret scanning in CI; syncpack dependency-consistency linting; publint package.json validation; Apache-2.0 license headers enforced on every source file (turbo `license` task); packages published with public access under the `@accelint` scope.

## 8. Development & Testing Environment

> Testing patterns and standards are defined in [openspec/config.yaml](./openspec/config.yaml); this section covers local setup and commands.

**Local Setup:** Node ≥22 + pnpm 10.25 (see `packageManager`); `pnpm install`, then `pnpm build`. See [CONTRIBUTING.md](./CONTRIBUTING.md) and [documentation/getting-started.md](./documentation/getting-started.md).

**Verification Gate (run after every change):** `pnpm run build` → `pnpm run test` → `pnpm run lint` → `pnpm run format`.

**Testing Frameworks:** Vitest 4 (shared `@accelint/vitest-config`, istanbul coverage), @testing-library/react + user-event + jest-dom, fast-check (property-based, predicates), Playwright (integration + visual regression), MemLab (memory), vitest bench.

**Code Quality Tools:** Biome 2 (shared config), ls-lint (kebab-case filenames), syncpack, publint, lefthook pre-commit hooks.

**Type-checking caveat:** `design-toolkit` and `map-toolkit` use solution-style tsconfigs — run `tsc` against `tsconfig.dist.json`/`tsconfig.dev.json`, never `tsconfig.json`; `pnpm run build` is authoritative.

## 9. Future Considerations / Roadmap

- <!-- TODO: planned architectural changes or known technical debt -->

## 10. Project Identification

**Project Name:** Development Toolkit (DevTK) — `@accelint/developer-toolkit` / standard-toolkit

**Repository URL:** https://github.com/gohypergiant/standard-toolkit

**Primary Contact / Team:** Accelint / Hypergiant

**Date of Last Update:** 2026-07-02

## 11. Glossary / Acronyms

| Term | Definition |
|------|-----------|
| DevTK | Development Toolkit — this repository's product name |
| NTDS | Naval Tactical Data System — the tactical symbology standard implemented by `@accelint/ntds` |
| COP | Common Operating Picture — the shared tactical map display NTDS spritesheets target |
| C2 | Command and Control — the class of defense applications these packages serve |
| RAC | react-aria-components — the accessibility-first primitive library design-toolkit wraps |
| Bearing (in `packages/geo`) | The hemisphere letter (N/S/E/W) of a coordinate — **not** azimuth; elsewhere "bearing/range" means compass direction + distance |
| DD / DDM / DMS / MGRS | Coordinate formats: Decimal Degrees, Degrees-Decimal-Minutes, Degrees-Minutes-Seconds, Military Grid Reference System |
| Constellation | Accelint's service catalog (Backstage-style), fed by `catalog-info.yaml` |
| Bus | `@accelint/bus` — typed BroadcastChannel event bus with `namespace:action` events |
| Barrel index | Generated `src/index.ts` export files (`pnpm index`) — never hand-edited |
