<!-- Inherits from: ../../AGENTS.md -->
<!-- Only package-specific overrides and additions are defined here. -->

# Agent Behavior for @accelint/worker

Follow the root [AGENTS.md](../../AGENTS.md). This file adds package-specific rules only.

- Read `./ARCHITECTURE.md` and `./README.md` before changing this package.
- Preserve the split between main-thread and worker-thread entrypoints; do not collapse them into one API surface.
- Preserve request and response envelope semantics, transferable handling, and worker-to-main-thread error propagation.
- Respect the lifecycle differences between regular workers and shared workers.
