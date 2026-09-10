<!-- Inherits from: ../../AGENTS.md -->
<!-- Only package-specific overrides and additions are defined here. -->

# Agent Behavior for @accelint/stream-devtools

Follow the root [AGENTS.md](../../AGENTS.md). This file adds package-specific rules only.

- Read `./ARCHITECTURE.md` and `./README.md` before changing this package.
- Preserve the entrypoint split between root, `/react`, `/production`, and `/react/production`; do not blur dev-only and live-production paths.
- For React hosts, keep panel wiring inside the provider and context model instead of introducing hidden globals.
- Treat live panel controls and injected messages as real side-effecting traffic when reviewing changes.
