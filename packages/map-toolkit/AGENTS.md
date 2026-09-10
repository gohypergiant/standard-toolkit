<!-- Inherits from: ../../AGENTS.md -->
<!-- Only package-specific overrides and additions are defined here. -->

# Agent Behavior for @accelint/map-toolkit

Follow the root [AGENTS.md](../../AGENTS.md). This file adds package-specific rules only.

- Read `./ARCHITECTURE.md`, `./README.md`, and relevant local stories or docs before changing visible behavior.
- Keep the API feature-scoped and subpath-first; preserve optional peer and runtime boundaries instead of collapsing everything into shared imports.
- Preserve per-map instance state and serialized event payload patterns; avoid introducing cross-map singleton state.
- Profile rendering-heavy changes before claiming optimizations, and update stories, tests, and docs when UI behavior changes.
