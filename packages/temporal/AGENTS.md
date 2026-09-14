<!-- Inherits from: ../../AGENTS.md -->
<!-- Only package-specific overrides and additions are defined here. -->

# Agent Behavior for @accelint/temporal

Follow the root [AGENTS.md](../../AGENTS.md). This file adds package-specific rules only.

- Read `./ARCHITECTURE.md` and `./README.md` before changing this package.
- Preserve next-second alignment, drift correction, and cleanup or cancellation semantics; do not simplify these helpers into plain timer wrappers.
- Keep timer surface boundaries intentional; treat entrypoint moves as API work, not incidental refactor.
- When scheduling behavior changes, update fake-timer tests and README examples in the same change.
