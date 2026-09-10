<!-- Inherits from: ../../AGENTS.md -->
<!-- Only package-specific overrides and additions are defined here. -->

# Agent Behavior for @accelint/dataset

Follow the root [AGENTS.md](../../AGENTS.md). This file adds package-specific rules only.

- Read `./ARCHITECTURE.md` and `./README.md` before changing this package.
- Keep TypeScript types, Zod validation, and exported entrypoints in sync; changes must land in both compile-time and runtime layers.
- Prefer extending lens-based access patterns instead of adding ad hoc property helpers or mutation-oriented utilities.
- Preserve path-aware validation behavior when editing validation code.
