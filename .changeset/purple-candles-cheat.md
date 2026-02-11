---
"@accelint/design-foundation": major
"@accelint/design-toolkit": patch
---

BREAKING CHANGE: Restructured tokens and utilities to better utilize Tailwind patterns

The vast majority of changes are non-breaking: All of the same utility classes for color, typography and spacing exist and should work without change

However, in order to support the simplification of utilities, the structure of typography tokens had to be inverted. This means that if you were directly referencing a typography CSS var or TS token, the name / pathing has changed. Examples of how to migrate:

`--typography-header-xxl-size` -> `--typography-size-header-xxl`
`tokens.typography.header.xxl.size` -> `tokens.typography.size.header.xxl`

Additionally, all `classification` and `roe` colors have been structured under the `domain` key

NEW FEATURES: The color and spacing utilities have become more flexible

The color utilities `bg`, `fg`, `icon` & `outline` now support more colors as well as alpha overrides.

- `bg-` can now access `bg-*`, `domain-*`, `primitive-*` colors
- `fg-` can now access `fg-*`, `domain-*`, `primitive-*` colors
- `icon-` can now access `fg-*`, `domain-*`, `primitive-*` colors
- `outline-` can now access `outline-*`, `domain-*`, `primitive-*` colors

And all of these utilities support the Tailwind alpha override pattern, which makes `bg-surface-default/50` possible

The spacing utilities are now able to implement values outside of the labeled scale of `xxs` -> `oversized`. If needed, it is now possible to use `p-10` which would implement padding of `10px`

CAVEAT!

While we strive to enable easier use of our design system, we expect that the use of non-semantic color values and spacing values outside of the labeled scale should only be used during rapid prototyping / experimentation or in extreme edge cases where a style has gone beyond the prescribed design system approach

Please continue to use the semantic tokens and labeled spacing tokens for the overwhelming majority of implementation to avoid stylistic drift
