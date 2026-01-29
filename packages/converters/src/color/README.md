# Color Converters

Comprehensive color conversion utilities for web applications. Convert between deck.gl tuples and GLSL tuples, CSS RGBA (string/tuple/object), and hex string formats.

## Installation

```sh
npm install @accelint/converters
```

Optional dependency (for GLSL conversions):

```sh
npm install @accelint/math
```

## Core Concept

All conversions use a **standard deck.gl format**: `[r, g, b, a]` where all channels are **0-255**.

This provides:

- **Precision**: No floating-point errors
- **Simplicity**: One internal format
- **Lossless conversions**: Round-trip without data loss
- **deck.gl native**: Minimal overhead for deck.gl applications

## API

### Parsing (External → Color)

#### `hexToColor(hex: string): Color`

Parse hex color strings. Supports 3, 6, and 8 character formats.

```ts
import { hexToColor } from '@accelint/converters/color';

hexToColor('#FF8040');      // [255, 128, 64, 255]
hexToColor('#F84');         // [255, 136, 68, 255] (expands to FF8844)
hexToColor('#FF804080');    // [255, 128, 64, 128]
hexToColor('FF8040');       // [255, 128, 64, 255] (hash optional)
```

#### `cssRgbaStringToColor(css: string): Color`

Parse CSS RGBA/RGB strings.

```ts
import { cssRgbaStringToColor } from '@accelint/converters/color';

cssRgbaStringToColor('rgba(255, 128, 64, 0.5)');  // [255, 128, 64, 128]
cssRgbaStringToColor('rgb(255, 128, 64)');        // [255, 128, 64, 255]
```

#### `cssRgbaTupleToColor(tuple: [r, g, b, a]): Color`

Parse CSS RGBA tuples (RGB 0-255, alpha 0-1).

```ts
import { cssRgbaTupleToColor } from '@accelint/converters/color';

cssRgbaTupleToColor([255, 128, 64, 1]);    // [255, 128, 64, 255]
cssRgbaTupleToColor([255, 128, 64, 0.5]);  // [255, 128, 64, 128]
```

#### `cssRgbaObjectToColor(obj: CssRgbaObject): Color`

Convert CSS RGBA objects to tuples (RGB 0-255, alpha 0-1).

```ts
import { cssRgbaObjectToColor } from '@accelint/converters/color';

cssRgbaObjectToColor({ r: 255, g: 128, b: 64, a: 1 });    // [255, 128, 64, 255]
cssRgbaObjectToColor({ r: 255, g: 128, b: 64, a: 0.5 });  // [255, 128, 64, 128]
```

### Serialization (Color → External)

#### `colorToHex(color: Color, includeAlpha?: boolean): string`

Convert to hex string format.

```ts
import { colorToHex } from '@accelint/converters/color';

colorToHex([255, 128, 64, 255]);         // "#FF8040"
colorToHex([255, 128, 64, 128], true);   // "#FF804080"
```

#### `colorToCssRgbaString(color: Color): string`

Convert to CSS RGBA string.

```ts
import { colorToCssRgbaString } from '@accelint/converters/color';

colorToCssRgbaString([255, 128, 64, 255]);  // "rgba(255, 128, 64, 1)"
colorToCssRgbaString([255, 128, 64, 128]);  // "rgba(255, 128, 64, 0.5019607843137255)"
```

#### `colorToCssRgbaTuple(color: Color): [r, g, b, a]`

Convert to CSS RGBA tuple (RGB 0-255, alpha 0-1).

```ts
import { colorToCssRgbaTuple } from '@accelint/converters/color';

colorToCssRgbaTuple([255, 128, 64, 255]);  // [255, 128, 64, 1]
colorToCssRgbaTuple([255, 128, 64, 128]);  // [255, 128, 64, 0.5019607843137255]
```

#### `colorToCssRgbaObject(color: Color): CssRgbaObject`

Convert tuple to CSS RGBA object format (RGB 0-255, alpha 0-1).

```ts
import { colorToCssRgbaObject } from '@accelint/converters/color';

colorToCssRgbaObject([255, 128, 64, 255]);  // { r: 255, g: 128, b: 64, a: 1 }
colorToCssRgbaObject([255, 128, 64, 128]);  // { r: 255, g: 128, b: 64, a: 0.5019607843137255 }
```

### Transforms (Color → Color)

#### `colorToGlsl(color: Color): Color`

Convert deck.gl format (0-255) to GLSL format (0-1).

```ts
import { colorToGlsl } from '@accelint/converters/color';

colorToGlsl([255, 128, 64, 255]);
// [1, 0.5019607843137255, 0.25098039215686274, 1]
```

#### `glslToColor(color: Color): Color`

Convert GLSL format (0-1) to deck.gl format (0-255).

```ts
import { glslToColor } from '@accelint/converters/color';

glslToColor([1, 0.5, 0.25, 1]);  // [255, 128, 64, 255]
```

### Type Guards

#### `isColor(value: unknown): value is Color`

Check if a value is a valid Color tuple.

```ts
import { isColor } from '@accelint/converters/color';

isColor([255, 128, 64, 255]);     // true
isColor([255, 128, 64]);          // false (missing alpha)
isColor([256, 0, 0, 0]);          // false (out of range)
```

#### `isCssRgbaObject(value: unknown): value is CssRgbaObject`

Check if a value is a valid CssRgbaObject (RGB 0-255, alpha 0-1).

```ts
import { isCssRgbaObject } from '@accelint/converters/color';

isCssRgbaObject({ r: 255, g: 128, b: 64, a: 1 });    // true
isCssRgbaObject({ r: 255, g: 128, b: 64, a: 0.5 });  // true
isCssRgbaObject({ r: 255, g: 128, b: 64 });          // false (missing alpha)
```

## Usage Examples

### deck.gl → GLSL Workflow

```ts
import { colorToGlsl } from '@accelint/converters/color';

const deckColor = [255, 128, 64, 255];
const glslColor = colorToGlsl(deckColor);
// Use glslColor in shader uniforms
```

### CSS → deck.gl → CSS Workflow

```ts
import { cssRgbaStringToColor, colorToCssRgbaString } from '@accelint/converters/color';

// Parse user input
const userColor = 'rgba(255, 128, 64, 0.5)';
const deckColor = cssRgbaStringToColor(userColor);  // [255, 128, 64, 128]

// Use in deck.gl
// ...

// Convert back for display
const cssString = colorToCssRgbaString(deckColor);  // "rgba(255, 128, 64, 0.5)"
```

### Hex → deck.gl → Hex Workflow

```ts
import { hexToColor, colorToHex } from '@accelint/converters/color';

const hex = '#FF8040';
const deckColor = hexToColor(hex);  // [255, 128, 64, 255]

// Use in deck.gl
// ...

// Convert back
const hexString = colorToHex(deckColor);  // "#FF8040"
```

### Composition Pipeline

```ts
import { colorToGlsl, glslToColor } from '@accelint/converters/color';
import { compose } from 'your-compose-library';

const adjustBrightness = (color: Color, factor: number): Color => {
  return color.map(v => Math.min(1, v * factor)) as Color;
};

const pipeline = compose(
  colorToGlsl,           // [0-255] → [0-1]
  adjustBrightness,      // Adjust in normalized space
  glslToColor            // [0-1] → [0-255]
);

const adjusted = pipeline([255, 128, 64, 255], 1.2);
```

## Type Definitions

```ts
/**
 * RGBA color where all channels are 0-255 (deck.gl standard format)
 * [red, green, blue, alpha]
 */
type Color = readonly [number, number, number, number];

/**
 * CSS-style RGBA color object (React Aria Components style)
 * RGB channels are 0-255, alpha is 0-1
 */
type CssRgbaObject = {
  readonly r: number;  // 0-255
  readonly g: number;  // 0-255
  readonly b: number;  // 0-255
  readonly a: number;  // 0-1
};
```

## Format Reference

| Format | RGB Range | Alpha Range | Example |
|--------|-----------|-------------|---------|
| **deck.gl** | 0-255 | 0-255 | `[255, 128, 64, 255]` |
| **GLSL** | 0-1 | 0-1 | `[1.0, 0.5, 0.25, 1.0]` |
| **CSS RGBA String** | 0-255 | 0-1 | `"rgba(255, 128, 64, 0.5)"` |
| **CSS RGBA Tuple** | 0-255 | 0-1 | `[255, 128, 64, 0.5]` |
| **CSS RGBA Object** | 0-255 | 0-1 | `{ r: 255, g: 128, b: 64, a: 0.5 }` |
| **Hex (6-char)** | 00-FF | - | `"#FF8040"` |
| **Hex (8-char)** | 00-FF | 00-FF | `"#FF804080"` |

## Round-Trip Conversions

All conversions are lossless when round-tripped:

```ts
import {
  hexToColor, 
  colorToHex,
  cssRgbaStringToColor, 
  colorToCssRgbaString,
  cssRgbaTupleToColor, 
  colorToCssRgbaTuple,
  cssRgbaObjectToColor, 
  colorToCssRgbaObject,
  colorToGlsl, 
  glslToColor,
} from '@accelint/converters/color';

const original = [255, 128, 64, 255];

// Hex round-trip
hexToColor(colorToHex(original)) === original  // ✓

// CSS string round-trip
cssRgbaStringToColor(colorToCssRgbaString(original)) === original  // ✓

// CSS tuple round-trip
cssRgbaTupleToColor(colorToCssRgbaTuple(original)) === original  // ✓

// CSS object round-trip
cssRgbaObjectToColor(colorToCssRgbaObject(original)) === original  // ✓

// GLSL round-trip
glslToColor(colorToGlsl(original)) === original  // ✓
```

## Why This Approach?

Compared to existing color libraries (colord, chroma.js, colorjs.io):

### No Object Creation Overhead

```ts
// Other libraries (object creation for every operation)
const color = new Color('rgba(255, 128, 64, 0.5)');
const glsl = [color.r / 255, color.g / 255, color.b / 255, color.alpha];

// This library (direct tuple operations)
const glsl = colorToGlsl(cssRgbaStringToColor('rgba(255, 128, 64, 0.5)'));
```

### Composition-Friendly

```ts
// Works naturally in composition pipelines
const result = compose(
  colorToGlsl,
  adjustBrightness, // Custom consumer-side function
  glslToColor
)(deckColor);
```

### deck.gl Native

```ts
// No conversion needed for deck.gl
const layer = new ScatterplotLayer({
  data,
  getFillColor: [255, 128, 64, 255],  // Already in the right format
});
```

## License

Apache-2.0
