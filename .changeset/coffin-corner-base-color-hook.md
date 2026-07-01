---
"@accelint/map-toolkit": minor
---

Add an overridable `coffinCorner_iconBaseColor` GLSL hook to `CoffinCornerExtension`. IconLayer subclasses that re-color the sampled texel (e.g. replacing a match color with a per-instance fill) can now preserve that color under the brackets by defining `COFFIN_CORNER_HAS_CUSTOM_ICON_BASE_COLOR` and supplying their own `coffinCorner_iconBaseColor`, instead of re-implementing the whole bracket shader. The default still samples `iconsTexture`, so existing behavior is unchanged.
