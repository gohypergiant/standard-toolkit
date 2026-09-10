<!-- Inherits from: ../../AGENTS.md -->
<!-- Only package-specific overrides and additions are defined here. -->

# Agent Behavior for @accelint/converters

Follow the root [AGENTS.md](../../AGENTS.md). This file adds package-specific rules only.

- Read `./ARCHITECTURE.md` and `./README.md` before changing this package.
- Keep converters pure representation-to-representation utilities; do not turn them into validators, stateful normalizers, or domain services.
- Avoid introducing unnecessary cross-package coupling between converter families.
- If conversion semantics change, update README examples and tests in the same change.
