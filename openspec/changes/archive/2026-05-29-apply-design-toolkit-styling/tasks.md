## 1. Setup and Preparation

- [x] 1.1 Open apps/docs/app/globals.css in editor
- [x] 1.2 Start dev server (pnpm --filter=@apps/docs run dev)
- [x] 1.3 Open browser to http://localhost:3000 for visual testing

## 2. Sidebar Link Styling

- [x] 2.1 Add @layer components.l3 block after existing @layer theme block
- [x] 2.2 Add CSS rule for active link outline: `[grid-area:sidebar] a[data-active="true"]` with 2px outline using `--outline-accent-primary-bold`
- [x] 2.3 Add CSS rule to hide fumadocs active indicator: `[grid-area:sidebar] a[data-active="true"]::before { display: none; }`
- [x] 2.4 Add CSS rule to set transparent background on active links: `background: transparent;`
- [x] 2.5 Add hover state for sidebar links using `--bg-surface-hovered`
- [x] 2.6 Test sidebar navigation in browser - verify active links show outline without background

## 3. Typography Overrides

- [x] 3.1 Add CSS rules for h1 in main content: font-family, font-size, line-height using design-toolkit tokens
- [x] 3.2 Add CSS rules for h2-h6 in main content using design-toolkit header tokens
- [x] 3.3 Add CSS rule for prose content: set font-family to `var(--font-family-body)`
- [x] 3.4 Add CSS rule for paragraph elements: font-size and line-height using body tokens
- [x] 3.5 Add margin-block rules for headings using spacing tokens (l, m)
- [x] 3.6 Test typography on multiple doc pages - verify all text uses design-toolkit scale

## 4. Spacing Adjustments

- [x] 4.1 Add CSS rule for sidebar gap: target container elements and apply `var(--spacing-m)`
- [x] 4.2 Add CSS rule for main content padding: apply `var(--spacing-xl)` horizontal and `var(--spacing-l)` vertical
- [x] 4.3 Add CSS rule for button spacing: padding with `var(--spacing-s)` and `var(--spacing-m)`
- [x] 4.4 Add CSS rule for button gaps (icon + text): use `var(--spacing-xs)`
- [x] 4.5 Test spacing visually - compare with design-toolkit spacing scale

## 5. Border to Outline Conversion

- [x] 5.1 Add CSS rule to remove borders from all elements with border classes in sidebar
- [x] 5.2 Add CSS rule to remove borders from all elements with border classes in main content
- [x] 5.3 Add outline using `var(--outline-default)` for removed borders
- [x] 5.4 Add hover state outline rule using `var(--outline-hovered)`
- [x] 5.5 Test interactive elements (buttons, inputs, cards) - verify outlines appear correctly

## 6. Focus State Implementation

- [x] 6.1 Add CSS rule for focus states: 2px solid outline using `var(--outline-focused)`
- [x] 6.2 Add outline-offset: 2px for focus states
- [x] 6.3 Test keyboard navigation - verify focus indicators are clearly visible
- [x] 6.4 Test focus contrast ratio with color contrast checker (must be 3:1 minimum)

## 7. Responsive and Dark Mode Testing

- [x] 7.1 Test mobile breakpoint (< 768px) - verify header visible and sidebar overlay works
- [x] 7.2 Test tablet breakpoint (768px - 1279px) - verify sidebar visible, TOC in popover
- [x] 7.3 Test desktop breakpoint (≥ 1280px) - verify sidebar and TOC both visible
- [x] 7.4 Toggle dark mode - verify all overrides respect dark mode color tokens
- [x] 7.5 Test sidebar collapse functionality - verify animation and state work correctly
- [x] 7.6 Test TOC popover on mobile/tablet - verify opens and closes correctly

## 8. Verification and QA

- [x] 8.1 Navigate through all documentation pages to check for visual regressions
- [x] 8.2 Verify no fumadocs default styles are showing through overrides
- [x] 8.3 Check browser console for CSS errors or warnings
- [x] 8.4 Run accessibility audit (Chrome DevTools Lighthouse) - verify no new issues
- [x] 8.5 Compare with design-toolkit reference - verify visual consistency
- [x] 8.6 Test with screen reader - verify focus states are announced correctly

## 9. Build Verification

- [x] 9.1 Stop dev server
- [x] 9.2 Run build command: pnpm run build
- [x] 9.3 Verify build completes without errors
- [x] 9.4 Check for any Tailwind or CSS compilation warnings
- [x] 9.5 Run production build locally and spot-check styling

## 10. Documentation and Cleanup

- [x] 10.1 Add comments in globals.css to document each override section
- [x] 10.2 Update apps/docs/current-state.md to reflect Phase 2 completion
- [x] 10.3 Take screenshots of before/after for reference (optional)
- [x] 10.4 Verify all changes are in apps/docs/app/globals.css only
- [x] 10.5 Run linter: pnpm run lint
- [x] 10.6 Run formatter: pnpm run format
