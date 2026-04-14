## 1. Update Token Generation Script

- [ ] 1.1 Add `generateLightDarkSemantics()` function that walks light and dark theme objects in parallel and merges tokens using `light-dark()` syntax
- [ ] 1.2 Update `generateThemes()` to call `generateLightDarkSemantics()` instead of separate `generateSemantics()` calls for dark and light
- [ ] 1.3 Remove the `generateEmptyTokens()` call and empty `@theme static` block generation
- [ ] 1.4 Update variant block generation to output only `color-scheme: dark/light` instead of full token definitions
- [ ] 1.5 Ensure fallback values are preserved in the `light-dark()` output format

## 2. Update Theme Provider

- [ ] 2.1 Modify the `useEffect` in `ThemeProvider` to set `documentElement.style.colorScheme = mode` instead of toggling CSS classes
- [ ] 2.2 Remove the `classList.remove('dark', 'light')` and `classList.add(mode)` calls
- [ ] 2.3 Verify the `useTheme()` hook API remains unchanged (still returns `mode`, `tokens`, `toggleMode`)

## 3. Regenerate Tokens

- [ ] 3.1 Run `pnpm gen:tokens` to regenerate `themes.css` with new structure
- [ ] 3.2 Verify the generated CSS contains `light-dark()` declarations in `:root`
- [ ] 3.3 Verify the `@variant` blocks only contain `color-scheme` property
- [ ] 3.4 Confirm no `@theme static` block with empty declarations is present

## 4. Testing & Verification

- [ ] 4.1 Run Storybook and visually verify all components render correctly in dark mode
- [ ] 4.2 Test theme toggling works correctly (switches between light and dark)
- [ ] 4.3 Verify all interactive states (hover, pressed, disabled) display correct colors
- [ ] 4.4 Measure and document the bundle size reduction of `themes.css`
- [ ] 4.5 Run the verification gate: `pnpm build && pnpm test && pnpm lint && pnpm format`