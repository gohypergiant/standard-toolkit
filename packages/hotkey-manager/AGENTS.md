<!-- Inherits from: ../../AGENTS.md -->
<!-- Only package-specific overrides and additions are defined here. -->

# Agent Behavior for @accelint/hotkey-manager

Follow the root [AGENTS.md](../../AGENTS.md). This file adds package-specific rules only.

- Read `./ARCHITECTURE.md` and `./README.md` before changing this package.
- Keep global listener binding explicit and SSR-safe; do not hide global binding inside random component internals.
- Preserve `useHotkey()` lifecycle behavior, including shared-instance binding and unbinding semantics.
- Preserve documented platform and key-held or key-up behavior when changing action semantics.
