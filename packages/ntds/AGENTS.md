<!-- Inherits from: ../../AGENTS.md -->
<!-- Only package-specific overrides and additions are defined here. -->

# Agent Behavior for @accelint/ntds

Follow the root [AGENTS.md](../../AGENTS.md). This file adds package-specific rules only.

- Read `./ARCHITECTURE.md` and `./README.md` before changing this package.
- Treat `/icons` as source of truth and regenerate `/src/core` and spritesheet outputs instead of hand-editing generated artifacts.
- Validate both consumer modes when symbols, colors, or exports change: React component consumers and spritesheet or map consumers.
- Treat names, color tokens, spritesheet IDs, and published subpaths as compatibility surface.
