## Why

Modernize the theme system to use the CSS `light-dark()` function, reducing bundle size by ~50% and leveraging native browser theming via the `color-scheme` property. This eliminates duplicate variable definitions across dark/light variants while improving system integration.

## What Changes

- Refactor `generate-tokens.mjs` to output tokens using `light-dark(light-value, dark-value)` syntax
- Update `ThemeProvider` to set `style.colorScheme` instead of toggling `dark`/`light` CSS classes
- Remove the `@theme static` empty declarations block (no longer needed)
- Consolidate separate `@variant dark` and `@variant light` blocks into a single `:root` definition with simplified variants that only set `color-scheme`

## Capabilities

### New Capabilities

- `css-light-dark-tokens`: Generate CSS design tokens using the `light-dark()` function to define theme-aware values in a single declaration

### Modified Capabilities

None - this is a refactoring of the theming implementation without changing external APIs or capabilities.

## Impact

**Files affected:**
- `packages/design-foundation/scripts/generate-tokens.mjs` - Token generation logic
- `packages/design-foundation/src/tokens/themes.css` - Generated output (50% smaller)
- `packages/design-toolkit/src/providers/theme-provider.tsx` - Theme switching mechanism

**Browser requirements:**
- Chrome 123+ (March 2024)
- Firefox 120+ (November 2023)  
- Safari 17.5+ (May 2024)

**Breaking change:** Theme switching mechanism changes from CSS classes to `color-scheme` property.