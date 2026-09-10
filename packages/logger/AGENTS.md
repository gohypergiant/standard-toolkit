<!-- Inherits from: ../../AGENTS.md -->
<!-- Only package-specific overrides and additions are defined here. -->

# Agent Behavior for @accelint/logger

Follow the root [AGENTS.md](../../AGENTS.md). This file adds package-specific rules only.

- Read `./ARCHITECTURE.md` and `./README.md` before changing this package.
- Preserve the distinction between `getLogger()` singleton setup and `bootstrap()` as the explicit escape hatch.
- Preserve explicit transport replacement behavior; do not quietly change how custom transports interact with console output.
- Do not present this package as a sanitizer or redaction layer unless that capability is explicitly added and documented.
