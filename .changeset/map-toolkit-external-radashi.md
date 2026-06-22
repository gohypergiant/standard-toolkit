---
'@accelint/map-toolkit': patch
---

Mark `radashi` as external in the build instead of bundling it. With `unbundle` on, the optional `radashi` dependency was inlined and its import rewritten to a `node_modules/.pnpm/radashi@…/…` store path. Bundlers that reject pnpm store paths (e.g. Turbopack) failed to resolve every `@accelint/map-toolkit` subpath with an "Invalid symlink" error in consuming apps. `radashi` is already an `optionalDependency`, so emitting a bare `radashi` specifier resolves cleanly from the consumer's `node_modules`.
