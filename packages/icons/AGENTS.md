<!-- Inherits from: ../../AGENTS.md -->
<!-- Only package-specific overrides and additions are defined here. -->

# Agent Behavior for @accelint/icons

Follow the root [AGENTS.md](../../AGENTS.md). This file adds package-specific rules only.

- Read `./ARCHITECTURE.md` and `./README.md` before changing this package.
- Prefer per-icon subpath imports and preserve the existing kebab-case file and export naming conventions.
- Treat `src/svg` as source of truth; regenerate React icon outputs instead of hand-editing generated icon files.
- Preserve the icon contract around sizing, `currentColor`, and accessible SVG title props.
