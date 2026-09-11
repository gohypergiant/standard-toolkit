<!-- Inherits from: ../../AGENTS.md -->
<!-- Only package-specific overrides and additions are defined here. -->

# Agent Behavior for @accelint/predicates

Follow the root [AGENTS.md](../../AGENTS.md). This file adds package-specific rules only.

- Read `./ARCHITECTURE.md` and `./README.md` before changing this package.
- Preserve the curried, composable, boolean-returning API style; do not redesign predicates into exception-driven or non-curried utilities.
- Treat documented predicate semantics as contract.
- When predicate behavior changes, keep strong coverage for edge cases and composition behavior.
