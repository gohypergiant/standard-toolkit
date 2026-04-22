## Context

The current theming system generates duplicate CSS variable definitions for each theme mode:
- `@theme static` block with empty declarations (~110 lines)
- `@variant dark` block with all token definitions (~100+ lines)
- `@variant light` block with all token definitions (~100+ lines)

Theme switching is handled by toggling `dark`/`light` CSS classes on `<html>` via the ThemeProvider component. This results in a large generated CSS file and requires maintaining parallel definitions.

The CSS `light-dark()` function (supported in modern browsers since 2024) allows defining both theme values in a single declaration, reducing file size and leveraging native browser theming via the `color-scheme` property.

## Goals / Non-Goals

**Goals:**
- Reduce generated CSS bundle size by ~50%
- Use native browser theming with `color-scheme` property
- Simplify token generation logic by eliminating duplication
- Maintain all existing theme tokens and visual appearance

**Non-Goals:**
- Supporting browsers older than Chrome 123, Firefox 120, Safari 17.5 (pre-2024)
- Changing the structure of `semantic.json` or `primitive.json`
- Modifying the public API of `ThemeProvider` (still exports `mode` and `toggleMode`)
- Adding new theme modes beyond dark/light

## Decisions

### Decision 1: Use light-dark() function for all semantic tokens

**Rationale:** The `light-dark()` CSS function is now widely supported and automatically selects the correct value based on the element's `color-scheme`. This eliminates the need for duplicate variable definitions and reduces the generated CSS by approximately 50%.

**Alternative considered:** Keep current approach with separate `@variant` blocks.
- **Rejected because:** Maintains large bundle size and duplicates maintenance burden.

**Alternative considered:** Use CSS custom properties with `@media (prefers-color-scheme)`.
- **Rejected because:** Less flexible than `color-scheme` property (doesn't support programmatic theme switching as cleanly).

### Decision 2: Set color-scheme property alongside CSS class toggling

**Rationale:** The `light-dark()` function requires `color-scheme` to be set on an ancestor element. However, Storybook does not manage the `color-scheme` property reliably. CSS class toggling (`dark`/`light`) must be preserved for Tailwind variant compatibility (`@variant dark`) and backward compatibility with any code that reads those classes.

**Implementation:** ThemeProvider sets both:
```javascript
documentElement.style.colorScheme = mode;
documentElement.classList.remove('dark', 'light');
documentElement.classList.add(mode);
```

**Alternative considered:** Replace class toggling entirely with `color-scheme` property.
- **Rejected because:** Storybook doesn't manage `color-scheme` reliably, and Tailwind's `@variant dark` responds to the CSS class. Removing classes broke dark mode in Storybook.

### Decision 3: Remove @theme static empty declarations block

**Rationale:** With `light-dark()`, tokens are defined once in `:root` rather than being overridden in variants. The empty declarations served to "register" custom properties for Tailwind, but this is no longer necessary with the new structure.

**Alternative considered:** Keep the static block for IDE autocomplete.
- **Rejected because:** Modern IDEs can derive custom properties from the `:root` definitions. No measurable benefit observed.

### Decision 4: Static @variant blocks in index.css; @theme static in themes.css

**Rationale:** `themes.css` is a generated file — `@variant` blocks belong in the static `index.css` alongside other Tailwind layer configuration. The `@theme static` block (Tailwind v4 syntax for registering custom properties) is used in `themes.css` rather than `:root`, which is required for Tailwind to recognize the tokens. The `@variant` blocks are scoped to `*` to ensure `color-scheme` propagates to all elements.

**Structure in `index.css`:**
```css
@layer theme {
  * {
    @variant dark { color-scheme: dark; }
    @variant light { color-scheme: light; }
  }
}
```

**Structure in generated `themes.css`:**
```css
@theme static {
  --fg-primary: light-dark(var(--light-val), var(--dark-val));
  /* ...all other tokens */
}
```

### Decision 5: Keep semantic.json structure unchanged

**Rationale:** The parallel `light` and `dark` trees in `semantic.json` are clear and maintainable. Only the output format changes—the input structure remains the same.

**Alternative considered:** Merge light/dark into single JSON structure.
- **Rejected because:** Would require large changes to the source files and reduce clarity of theme definitions.

## Risks / Trade-offs

### Risk: Browser compatibility requirement increases
- **Mitigation:** Document the browser requirements clearly. Target audience (modern web apps) is unlikely to be affected by 2024+ browser requirements.

### Risk: Breaking change for code that manipulates theme classes directly
- **Mitigation:** Search codebase for direct usage of `dark`/`light` classes. Update documentation to specify `color-scheme` as the new mechanism. The ThemeProvider API remains unchanged, so most code will be unaffected.

### Risk: CSS specificity changes with new structure
- **Mitigation:** The generated CSS maintains the same `@layer theme` specificity. Test thoroughly in Storybook across all components to catch any visual regressions.

### Trade-off: Slightly more complex generation logic
- The script must now walk light and dark trees in parallel and merge them. This adds complexity to `generate-tokens.mjs`.
- **Accepted because:** The complexity is localized to one function and significantly reduces the output size and maintenance burden.

## Migration Plan

1. **Update generation script:**
   - Add `generateLightDarkSemantics()` function to merge light/dark trees
   - Modify `generateThemes()` to use new function and simplified variants
   - Remove `generateEmptyTokens()` call

2. **Update ThemeProvider:**
   - Change `useEffect` to set `style.colorScheme` instead of toggling classes
   - Verify all Storybook stories render correctly

3. **Testing:**
   - Run full Storybook build and visually verify all components
   - Test theme toggle in example apps
   - Verify generated CSS file size reduction

4. **Rollback strategy:**
   - Revert changes to `generate-tokens.mjs` and `theme-provider.tsx`
   - Regenerate tokens with old script
   - No data migrations required since this is build-time only

## Open Questions

None - all decisions finalized during exploration phase.