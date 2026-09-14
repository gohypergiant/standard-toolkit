<!-- Inherits from: ../../AGENTS.md -->
<!-- Only package-specific overrides and additions are defined here. -->

# Agent Behavior for @accelint/design-foundation

Follow the root [AGENTS.md](../../AGENTS.md). This file adds package-specific rules only.

- Read `./ARCHITECTURE.md` and `./README.md` before changing this package.
- Use only published subpath imports; do not assume a root `@accelint/design-foundation` entrypoint exists.
- Treat token and variant JSON files as source of truth; regenerate emitted artifacts instead of hand-editing generated outputs.
- Preserve variant ordering and validate consumer-facing styling changes through downstream consumers.
