---
"@accelint/design-toolkit": patch
"@accelint/map-toolkit": patch
---

- Fix type errors in shipped source surfaced by `tsc -p tsconfig.dist.json` (not caught by `pnpm build`, which does not type-check these packages).
- `@accelint/design-toolkit`: the `Video` and `FullscreenButton` media-store selectors now accept `Partial<MediaState>`, matching the `useMediaSelector` signature in `media-chrome` 4.17. `BadgeProps.placement` no longer imports `Axis` from `@react-types/overlays` (never a dependency); the union is defined locally and is unchanged. `RadioContext` is now typed `ContextValue<Partial<RadioProps>, HTMLLabelElement>` so `RadioGroup` can provide `labelPosition` defaults without a `value`; providers are unaffected, direct readers of the context see optional fields.
- `@accelint/map-toolkit`: remove `'projection'` from `LOCKED_MAP_LIBRE_OPTION_KEYS`, since `maplibre-gl` 5.24 no longer exposes it on `MapOptions`. `LockedMapLibreOptionKey` no longer includes `'projection'`; `MapLibreOptions` is unchanged in practice because the omitted key no longer existed. Projection is still driven by camera state via `map.setProjection()`.
