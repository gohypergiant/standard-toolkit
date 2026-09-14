<!-- Inherits from: ../../AGENTS.md -->
<!-- Only package-specific overrides and additions are defined here. -->

# Agent Behavior for @accelint/postcss-tailwind-css-modules

Follow the root [AGENTS.md](../../AGENTS.md). This file adds package-specific rules only.

- Read `./ARCHITECTURE.md` before changing this package.
- Preserve the package root as the public API and keep both ESM and CommonJS entrypoints working.
- Keep transformations scoped to `.module.css` and targeted `group/` and `peer/` selector rewrites only.
- Update transformation snapshots or tests whenever selector semantics change.
