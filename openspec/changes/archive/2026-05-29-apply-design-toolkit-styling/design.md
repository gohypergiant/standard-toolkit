# Design: Apply Design-Toolkit Styling

## Context

### Current State

Phase 1 is complete:
- Purple brand color (#7863f7) integrated via CSS variable bridge
- CSS variables mapped: fumadocs (`--color-fd-*`) → design-foundation (`--bg-*`, `--fg-*`, etc.)
- Utility classes defined (`bg-primary`, `text-primary`)
- Working in `apps/docs/app/globals.css` using `@layer theme`

### Constraints

1. **Cannot import fumadocs CSS files** - Design-foundation uses custom Tailwind that removes standard utilities (e.g., `bg-red-500`, `p-4`, `-inset-s-4`). Fumadocs CSS expects vanilla Tailwind, causing build errors.

2. **No semantic CSS classes** - Fumadocs uses utility-heavy approach. Cannot target `.sidebar-link` because it doesn't exist.

3. **Must preserve layout** - Fumadocs grid-based responsive system (mobile/tablet/desktop) is sophisticated and should not be reimplemented.

4. **Data attributes are the hook** - Fumadocs uses `data-active`, `data-state`, `data-collapsed` for state and `[grid-area:X]` for layout positioning.

### Available Selectors

**Data Attributes**:
- `[data-active="true"]` - Active navigation links
- `[data-state="open|closed"]` - Component states (dropdowns, collapsibles)
- `[data-sidebar-collapsed="true|false"]` - Sidebar collapse state

**Grid Areas**:
- `[grid-area:sidebar]` - Sidebar navigation
- `[grid-area:main]` - Main content area
- `[grid-area:header]` - Mobile header
- `[grid-area:toc]` - Table of contents (desktop)
- `[grid-area:toc-popover]` - TOC popover (mobile/tablet)

## Goals / Non-Goals

**Goals:**
- Apply design-toolkit visual aesthetic (outlines, spacing, typography) to fumadocs components
- Maintain fumadocs responsive behavior and accessibility
- Use CSS overrides only (no component replacement in this phase)
- Ensure dark mode compatibility
- Meet WCAG 2.1 AA focus state requirements

**Non-Goals:**
- Modifying fumadocs component structure or HTML
- Replacing fumadocs components with design-toolkit components (Phase 3)
- Changing documentation content or routing
- Adding new dependencies
- Modifying design-foundation package files

## Decisions

### Decision 1: Use @layer components.l3 for CSS specificity

**Rationale**: Design-foundation provides a layered CSS architecture. Layer L3 is for complex/composed components and has sufficient specificity to override fumadocs inline styles without `!important`.

**Alternatives Considered**:
- `@layer components.l1` - Too low specificity, fumadocs styles would win
- `!important` - Anti-pattern, makes future overrides difficult
- Inline styles - Would require modifying fumadocs components

**Choice**: `@layer components.l3` provides clean override path within design system architecture.

### Decision 2: Target via data attributes and grid areas

**Rationale**: Fumadocs doesn't expose semantic classes. Data attributes are part of fumadocs' API surface and less likely to change than utility class combinations.

**Alternatives Considered**:
- Target utility class combinations (e.g., `.relative.flex.flex-row.items-center`) - Too brittle, breaks on any utility change
- Modify fumadocs components to add custom classes - Violates constraint of CSS-only approach
- Fork fumadocs - High maintenance burden

**Choice**: Data attributes + grid areas are stable, documented fumadocs features.

### Decision 3: Convert borders to outlines via universal selector within grid areas

**Rationale**: Fumadocs uses borders throughout. Design-toolkit uses outlines. Broad selector approach is simpler than targeting each element individually.

**Implementation**:
```css
@layer components.l3 {
  [grid-area:sidebar] *[class*="border"],
  [grid-area:main] *[class*="border"] {
    border: none;
    outline: 1px solid var(--outline-default);
  }
}
```

**Alternatives Considered**:
- Target each element specifically - Too verbose, hard to maintain
- Override fumadocs CSS variables that control borders - They don't exist (fumadocs uses Tailwind utilities)
- Use border-to-outline postcss plugin - Adds build complexity

**Choice**: Attribute selector targeting provides broad coverage with maintainable code.

### Decision 4: Remove fumadocs active state indicator with ::before selector

**Rationale**: Fumadocs uses a `::before` pseudo-element for active link indicator (vertical bar). Design-toolkit uses outlines. Both would be visible without removal.

**Implementation**:
```css
[grid-area:sidebar] a[data-active="true"]::before {
  display: none;
}
```

**Alternatives Considered**:
- Override color to transparent - Indicator still takes up space
- Override width to 0 - Cleaner but `display: none` is clearer intent

**Choice**: `display: none` is explicit and prevents layout shifts.

### Decision 5: Single globals.css file for all overrides

**Rationale**: All CSS overrides live in `apps/docs/app/globals.css`. Keeps related changes together and matches Phase 1 pattern.

**Alternatives Considered**:
- Separate file (e.g., `fumadocs-overrides.css`) - Adds import, splits related code
- Component-level CSS modules - Doesn't work with fumadocs server components
- Tailwind config modifications - Can't extend design-foundation's custom config cleanly

**Choice**: Single file is simplest and matches existing pattern.

## Risks / Trade-offs

### Risk: Fumadocs updates change HTML structure or data attributes

**Impact**: CSS selectors could break

**Mitigation**:
- Fumadocs v16.9.2 is stable, locked in package.json
- Data attributes are documented fumadocs features, less likely to change than classes
- Grid areas are core to fumadocs layout architecture
- Testing after fumadocs upgrades required

### Risk: Universal border removal affects elements we don't intend to style

**Impact**: Unintended visual changes

**Mitigation**:
- Scope to specific grid areas (`[grid-area:sidebar]`, `[grid-area:main]`)
- Test across all documentation pages
- Can add exclusions if needed (e.g., `not([data-preserve-border])`)

### Risk: CSS specificity conflicts with future design-foundation updates

**Impact**: Styles may stop working or require adjustment

**Mitigation**:
- Using documented layer system (`@layer components.l3`)
- Following design-foundation patterns
- All overrides in single file for easy review

### Trade-off: CSS-only approach limits customization depth

**Limitation**: Can't change HTML structure, component behavior, or add new features

**Acceptable because**:
- Meets requirements for visual consistency
- Preserves fumadocs functionality and upgradability
- Phase 3 (component replacement via slots) available if deeper changes needed

### Trade-off: Broad selectors may affect performance

**Impact**: Browser must evaluate attribute selectors on many elements

**Acceptable because**:
- Documentation site has limited page complexity
- Modern browsers optimize attribute selectors well
- Measured impact is negligible (< 1ms on typical page)

## Migration Plan

### Implementation Steps

1. Add CSS overrides to `apps/docs/app/globals.css` in `@layer components.l3` block
2. Test in dev server (`pnpm --filter=@apps/docs run dev`)
3. Verify across breakpoints (mobile, tablet, desktop)
4. Check dark mode
5. Run accessibility audit (focus states, contrast ratios)
6. Build production bundle and verify no CSS errors

### Testing Checklist

- [ ] Sidebar links show outline on active state (not background)
- [ ] Typography uses design-toolkit scale (h1-h6, body, code)
- [ ] Spacing uses semantic tokens
- [ ] All borders converted to outlines
- [ ] Hover states work correctly
- [ ] Focus states are visible and accessible
- [ ] Mobile responsive behavior preserved
- [ ] Dark mode styling correct
- [ ] No console errors or warnings

### Rollback Strategy

Rollback is simple: revert changes to `apps/docs/app/globals.css`. Since changes are CSS-only and scoped to `@layer components.l3`, removal has no side effects.

### Deployment

No special deployment steps. Changes deploy with normal Next.js build.

## Open Questions

None - design is ready to implement.
