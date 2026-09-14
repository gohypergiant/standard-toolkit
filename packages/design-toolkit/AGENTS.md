<!-- Inherits from: ../../AGENTS.md -->
<!-- Only package-specific overrides and additions are defined here. -->

# Agent Behavior for @accelint/design-toolkit

Follow the root [AGENTS.md](../../AGENTS.md). This file adds package-specific rules only.

- Read `./ARCHITECTURE.md`, `./README.md`, and the relevant local stories/docs before changing component behavior or props.
- Follow published entrypoint families from `package.json`; do not introduce or rely on deep `src/*` imports as public API.
- Use icons from `@accelint/icons` only.
- Preserve React Aria accessibility semantics and the CSS Modules/Tailwind pipeline when changing components or styling.
