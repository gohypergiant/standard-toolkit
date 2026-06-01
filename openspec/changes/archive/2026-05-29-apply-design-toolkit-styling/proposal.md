## Why

The documentation website uses fumadocs-ui components but needs to match the design-toolkit aesthetic to maintain brand consistency across all Hypergiant products. Phase 1 (CSS variable bridge for purple brand color) is complete. Phase 2 styling is needed now to replace fumadocs' default borders, spacing, and typography with design-toolkit's outline-based, technically clean visual language before the docs site launches.

## What Changes

- Replace fumadocs borders with design-toolkit outlines for all interactive elements
- Apply design-toolkit semantic spacing tokens (xs, s, m, l, xl, xxl) throughout the UI
- Apply design-toolkit typography scale to all text elements (headings, body, code)
- Override fumadocs sidebar active states to use outlines instead of background fills
- Ensure focus states meet accessibility standards using design-toolkit focus rings
- Maintain fumadocs responsive grid layout and functionality

## Capabilities

### New Capabilities

- `docs-styling`: Visual styling system for the documentation website that applies design-toolkit aesthetic (outlines, spacing, typography) to fumadocs UI components via CSS overrides

### Modified Capabilities

None - this change adds styling without modifying existing documentation functionality requirements.

## Impact

**Files Modified**:
- `apps/docs/app/globals.css` - Add CSS overrides in `@layer components.l3`

**Systems Affected**:
- Documentation website visual appearance across all pages
- Sidebar navigation styling
- Main content typography
- Interactive element styling (buttons, links, inputs)

**Dependencies**:
- Relies on existing design-foundation CSS variables and tokens
- Maintains compatibility with fumadocs-ui v16.9.2 component structure
- No new dependencies required

**User Impact**:
- Improved visual consistency with design-toolkit
- Better accessibility through proper focus states
- No functional changes to documentation navigation or content
