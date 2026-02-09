---
"@accelint/design-foundation": major
---

**BREAKING CHANGE:** Convert design-foundation TypeScript color tokens to deck.gl RGBA format.

## What Changed

**TypeScript token exports** (`@accelint/design-foundation/tokens`) now use deck.gl's RGBA format where all channels are 0-255:

- **Before:** `[R, G, B, A]` where A is 0-1 (e.g., `[21, 21, 23, 1]`)
- **After:** `[R, G, B, A]` where A is 0-255 (e.g., `[21, 21, 23, 255]`)

**CSS variables are NOT affected** - `tokens.css` and `themes.css` continue to use standard CSS color formats (hex, rgba with alpha 0-1).

## Why This Change

This aligns TypeScript tokens with deck.gl's expected color format, eliminating runtime alpha conversion overhead when using tokens with deck.gl layers.

## Migration Guide

### If you use tokens with deck.gl or WebGL:
✅ **Action required:** Remove any conversion logic that was converting alpha from 0-1 to 0-255. Colors now work directly with deck.gl!

### If you use TypeScript tokens in CSS/DOM contexts:
❌ **Breaking:** Direct usage like `rgba(${color.join(', ')})` will produce invalid CSS

✅ **Recommended:** Use CSS variables via Tailwind classes instead:
```tsx
<Button className="bg-surface-default text-fg-primary-bold" />
```

✅ **Alternative:** Convert using `rgba255TupleToCssRgbaString()` from `@accelint/converters`:
```ts
import { rgba255TupleToCssRgbaString } from '@accelint/converters';
const cssColor = rgba255TupleToCssRgbaString(color); // "rgba(21, 21, 23, 1)"
```

### If you only use CSS variables:
✅ **No changes needed** - CSS variables are unchanged.
