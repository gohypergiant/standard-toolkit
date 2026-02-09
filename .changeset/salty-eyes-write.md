---
'@accelint/converters': major
'@accelint/predicates': minor
'@accelint/constants': minor
---

**Refactor color converters into tree-shakable submodules**

### @accelint/converters

Split color conversion functionality into three dedicated submodule exports for better tree-shaking and explicit dependency management:

**New exports:**
- `@accelint/converters/css-rgba` - CSS RGBA format conversions (requires `@accelint/constants`, `@accelint/predicates`)
  - `cssRgbaStringToRgba255Tuple()` - Parse CSS rgba/rgb strings to deck.gl format
  - `rgba255TupleToCssRgbaString()` - Convert deck.gl format to CSS string
  - `cssRgbaTupleToRgba255Tuple()` - Convert CSS tuples (alpha 0-1) to deck.gl
  - `rgba255TupleToCssRgbaTuple()` - Convert deck.gl to CSS tuples
  - `cssRgbaObjectToRgba255Tuple()` - Convert CSS objects to deck.gl
  - `rgba255TupleToCssRgbaObject()` - Convert deck.gl to CSS objects
  - Type: `CssRgbaTuple`

- `@accelint/converters/hex` - Hex color conversions (requires `@accelint/constants`, `@accelint/predicates`)
  - `hexToRgba255Tuple()` - Parse hex strings (#RGB, #RRGGBB, etc.) to deck.gl format
  - `rgba255TupleToHex()` - Convert deck.gl format to hex string

- `@accelint/converters/glsl` - GLSL shader format conversions (requires `@accelint/math`)
  - `glslToRgba255Tuple()` - Convert GLSL format (0-1) to deck.gl (0-255)
  - `rgba255TupleToGlsl()` - Convert deck.gl (0-255) to GLSL format (0-1)
  - Type: `GlslRgbaTuple`

All functions use explicit `Rgba255Tuple` naming to clarify the deck.gl format (all RGBA channels 0-255). The main package export re-exports all functions for convenience.

**BREAKING CHANGES:**

Removed the `/color` module and old function names. Functions are now organized into dedicated submodules:

**Migration Guide:**

```typescript
// Before
import { hexToColor, colorToHex } from '@accelint/converters/color';

// After - Option 1: Import from specific submodule
import { hexToRgba255Tuple, rgba255TupleToHex } from '@accelint/converters/hex';

// After - Option 2: Import from main package
import { hexToRgba255Tuple, rgba255TupleToHex } from '@accelint/converters';
```

**Function name mappings:**
- `hexToColor` → `hexToRgba255Tuple` (from `/hex`)
- `colorToHex` → `rgba255TupleToHex` (from `/hex`)
- `cssRgbaStringToColor` → `cssRgbaStringToRgba255Tuple` (from `/css-rgba`)
- `colorToCssRgbaString` → `rgba255TupleToCssRgbaString` (from `/css-rgba`)
- `cssRgbaObjectToColor` → `cssRgbaObjectToRgba255Tuple` (from `/css-rgba`)
- `colorToCssRgbaObject` → `rgba255TupleToCssRgbaObject` (from `/css-rgba`)
- `glslToColor` → `glslToRgba255Tuple` (from `/glsl`)
- `colorToGlsl` → `rgba255TupleToGlsl` (from `/glsl`)

**Type name changes:**
- `Color` → `Rgba255Tuple` (exported from `@accelint/predicates/is-rgba-255-tuple`)

**Type guards moved to predicates:**
- `isColor` → `isRgba255Tuple` from `@accelint/predicates/is-rgba-255-tuple`
- `isCssRgbaObject` → `isCssRgbaObject` from `@accelint/predicates/is-css-rgba-object`

### @accelint/predicates

Add color format validation type guards:

- `@accelint/predicates/is-rgba-255-tuple` - Validate deck.gl RGBA tuples (all channels 0-255)
- `@accelint/predicates/is-hex-color` - Validate hex color strings
- `@accelint/predicates/is-css-rgba-object` - Validate CSS RGBA objects (RGB 0-255, alpha 0-1)
- `@accelint/predicates/is-css-rgba-string` - Validate CSS rgba/rgb strings (legacy & modern syntax)
- `@accelint/predicates/is-valid-255-channel` - Validate individual channel values (0-255)

Includes `Rgba255Tuple` and `CssRgbaObject` type exports.

### @accelint/constants

Add color validation regex patterns:

- `HEX_REGEX` - Match hex colors (#RGB, #RGBA, #RRGGBB, #RRGGBBAA)
- `CSS_RGBA_LEGACY_REGEX` - Match comma-separated CSS colors
- `CSS_RGBA_MODERN_REGEX` - Match space/slash-separated CSS colors
