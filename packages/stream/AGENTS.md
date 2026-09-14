<!-- Inherits from: ../../AGENTS.md -->
<!-- Only package-specific overrides and additions are defined here. -->

# Agent Behavior for @accelint/stream

Follow the root [AGENTS.md](../../AGENTS.md). This file adds package-specific rules only.

- Read `./ARCHITECTURE.md` and `./README.md` before changing this package.
- Keep the core package framework-agnostic and isolate React-specific behavior to the published React entrypoints.
- Preserve provider or client wiring and the documented `streamKey` identity contract.
- Preserve connection lifecycle and cache or cleanup semantics when editing subscription behavior.
