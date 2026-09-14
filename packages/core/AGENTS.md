<!-- Inherits from: ../../AGENTS.md -->
<!-- Only package-specific overrides and additions are defined here. -->

# Agent Behavior for @accelint/core

Follow the root [AGENTS.md](../../AGENTS.md). This file adds package-specific rules only.

- Read `./ARCHITECTURE.md` and `./README.md` before changing this package.
- Treat this package as foundational shared surface; prefer additive changes and ask before export reshuffles or semantic breaks.
- Preserve the package's pure, composable functional style; avoid hidden state or mutation-heavy rewrites.
- If higher-order utility semantics change, update focused tests with the code change.
