---
"@accelint/map-toolkit": minor
---

Add an `iconBaseColorGlsl` constructor option to `CoffinCornerExtension`. Custom IconLayers that re-color the sampled texel (e.g. replacing a match color with a per-instance fill) can now pass GLSL statements that assign `baseColor` so the same transform is applied beneath the brackets, instead of re-implementing the whole bracket shader. The statements are spliced inside the fragment `main`, so they can reference any uniform or varying the host layer declares. When unset, the extension samples `iconsTexture` as before, so existing behavior is unchanged.
