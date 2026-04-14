## 1. Update Token Generation Script

- [x] 1.1 Add `generateLightDarkSemantics()` function that walks light and dark theme objects in parallel and merges tokens using `light-dark()` syntax
- [x] 1.2 Update `generateThemes()` to call `generateLightDarkSemantics()` instead of separate `generateSemantics()` calls for dark and light
- [x] 1.3 Remove the `generateEmptyTokens()` call and empty `@theme static` block generation
- [x] 1.4 Update variant block generation to output only `color-scheme: dark/light` instead of full token definitions
- [x] 1.5 Ensure fallback values are preserved in the `light-dark()` output format

## 2. Update Theme Provider

- [x] 2.1 Modify the `useEffect` in `ThemeProvider` to set `documentElement.style.colorScheme = mode` instead of toggling CSS classes
- [x] 2.2 Remove the `classList.remove('dark', 'light')` and `classList.add(mode)` calls
- [x] 2.3 Verify the `useTheme()` hook API remains unchanged (still returns `mode`, `tokens`, `toggleMode`)

## 3. Regenerate Tokens

- [x] 3.1 Run `pnpm gen:tokens` to regenerate `themes.css` with new structure
- [x] 3.2 Verify the generated CSS contains `light-dark()` declarations in `:root`
- [x] 3.3 Verify the `@variant` blocks only contain `color-scheme` property
- [x] 3.4 Confirm no `@theme static` block with empty declarations is present

## 4. Testing & Verification

- [x] 4.1 Run Storybook and visually verify all components render correctly in dark mode
- [x] 4.2 Test theme toggling works correctly (switches between light and dark)
- [x] 4.3 Verify all interactive states (hover, pressed, disabled) display correct colors
- [x] 4.4 Measure and document the bundle size reduction of `themes.css` (16.6KB → 11.5KB = 30% reduction; 332 lines → 108 lines = 68% reduction)
- [x] 4.5 Run the verification gate: `pnpm build && pnpm test && pnpm lint && pnpm format` (passed for design-foundation and design-toolkit packages)