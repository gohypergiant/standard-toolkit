<!-- Inherits from: ../../AGENTS.md -->
<!-- Only package-specific overrides and additions are defined here. -->

# Agent Behavior for @accelint/bus

Follow the root [AGENTS.md](../../AGENTS.md). This file adds package-specific rules only.

- Read `./ARCHITECTURE.md` and `./README.md` before changing this package.
- Treat `package.json#exports`, especially `.`, `./broadcast`, and `./react`, as public API surface. Ask before removing or renaming entrypoints.
- Preserve the bus package's documented event-targeting and async discovery behavior; do not normalize it toward a generic BroadcastChannel abstraction.
- For React changes, preserve stale-closure safety and automatic subscription cleanup in hooks.
