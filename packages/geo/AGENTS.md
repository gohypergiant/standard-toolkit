<!-- Inherits from: ../../AGENTS.md -->
<!-- Only package-specific overrides and additions are defined here. -->

# Agent Behavior for @accelint/geo

Follow the root [AGENTS.md](../../AGENTS.md). This file adds package-specific rules only.

- Read `./ARCHITECTURE.md` and `./README.md` before changing this package.
- Preserve coordinate-order and input-shape contracts; do not add "smart" inference that silently flips formats or tuple semantics.
- Keep parsing conservative; prefer validation or errors over permissive heuristics for ambiguous coordinates.
- Benchmark parser or formatter hot-path changes instead of guessing about performance.
