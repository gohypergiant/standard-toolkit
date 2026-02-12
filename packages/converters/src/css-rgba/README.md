# Color Converters

Comprehensive CSS RGBA color conversion utilities for web applications. Convert between RGBA 255 tuples and CSS RGBA (string/tuple/object) formats.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Core Concept](#core-concept)
- [API](#api)
  - [Parsing](#parsing-external--rgba255tuple)
  - [Serialization](#serialization-rgba255tuple--external)
  - [Type Guards](#type-guards)
- [Usage Examples](#usage-examples)
- [Type Definitions](#type-definitions)
- [Format Reference](#format-reference)
- [Round-Trip Conversions](#round-trip-conversions)
- [Why This Approach](#why-this-approach)
- [License](#license)

## Installation

```sh
pnpm add @accelint/converters
```

**Required peer dependency:**

```sh
pnpm add @accelint/constants @accelint/predicates
```

## Quick Start

```ts
import {
  rgba255TupleToCssRgbaString,
  cssRgbaStringToRgba255Tuple,
} from '@accelint/converters/css-rgba';

// Convert to CSS
const css = rgba255TupleToCssRgbaString(color);  // "rgba(255, 128, 64, 1)"

// Parse CSS color
const parsed = cssRgbaStringToRgba255Tuple('rgb(255 128 64 / 0.5)');  // [255, 128, 64, 128]
```

## Core Concept

All conversions use a **standard deck.gl format**: `[r, g, b, a]` where all channels are **0-255**.

This provides:

- **Precision**: No floating-point errors
- **Simplicity**: One internal format
- **Lossless conversions**: Round-trip without data loss
- **deck.gl native**: Minimal overhead for deck.gl applications

## API

### Parsing (External → Rgba255Tuple)

#### `cssRgbaStringToRgba255Tuple(css: string): Rgba255Tuple`

Parse CSS RGBA/RGB strings. Supports CSS Color Module Level 4 spec including legacy comma-separated and modern space-separated syntax with percentages.

```ts
import { cssRgbaStringToRgba255Tuple } from '@accelint/converters/css-rgba';

// Legacy comma-separated syntax
cssRgbaStringToRgba255Tuple('rgba(255, 128, 64, 0.5)');  // [255, 128, 64, 128]
cssRgbaStringToRgba255Tuple('rgb(255, 128, 64)');        // [255, 128, 64, 255]

// Modern space-separated syntax with slash for alpha
cssRgbaStringToRgba255Tuple('rgb(255 128 64 / 0.5)');    // [255, 128, 64, 128]
cssRgbaStringToRgba255Tuple('rgb(255 128 64)');          // [255, 128, 64, 255]

// Percentage RGB values
cssRgbaStringToRgba255Tuple('rgb(100%, 50%, 25%)');      // [255, 128, 64, 255]
cssRgbaStringToRgba255Tuple('rgb(100% 50% 25% / 50%)');  // [255, 128, 64, 128]
```

#### `cssRgbaTupleToRgba255Tuple(tuple: [r, g, b, a]): Rgba255Tuple`

Parse CSS RGBA tuples (RGB 0-255, alpha 0-1).

```ts
import { cssRgbaTupleToRgba255Tuple } from '@accelint/converters/css-rgba';

cssRgbaTupleToRgba255Tuple([255, 128, 64, 1]);    // [255, 128, 64, 255]
cssRgbaTupleToRgba255Tuple([255, 128, 64, 0.5]);  // [255, 128, 64, 128]
```

#### `cssRgbaObjectToRgba255Tuple(obj: CssRgbaObject): Rgba255Tuple`

Convert CSS RGBA objects to tuples (RGB 0-255, alpha 0-1).

```ts
import { cssRgbaObjectToRgba255Tuple } from '@accelint/converters/css-rgba';

cssRgbaObjectToRgba255Tuple({ r: 255, g: 128, b: 64, a: 1 });    // [255, 128, 64, 255]
cssRgbaObjectToRgba255Tuple({ r: 255, g: 128, b: 64, a: 0.5 });  // [255, 128, 64, 128]
```

### Serialization (Rgba255Tuple → External)

#### `rgba255TupleToCssRgbaString(color: Rgba255Tuple): string`

Convert to CSS RGBA string.

```ts
import { rgba255TupleToCssRgbaString } from '@accelint/converters/css-rgba';

rgba255TupleToCssRgbaString([255, 128, 64, 255]);  // "rgba(255, 128, 64, 1)"
rgba255TupleToCssRgbaString([255, 128, 64, 128]);  // "rgba(255, 128, 64, 0.5019607843137255)"
```

#### `rgba255TupleToCssRgbaTuple(color: Rgba255Tuple): [r, g, b, a]`

Convert to CSS RGBA tuple (RGB 0-255, alpha 0-1).

```ts
import { rgba255TupleToCssRgbaTuple } from '@accelint/converters/css-rgba';

rgba255TupleToCssRgbaTuple([255, 128, 64, 255]);  // [255, 128, 64, 1]
rgba255TupleToCssRgbaTuple([255, 128, 64, 128]);  // [255, 128, 64, 0.5019607843137255]
```

#### `rgba255TupleToCssRgbaObject(color: Rgba255Tuple): CssRgbaObject`

Convert tuple to CSS RGBA object format (RGB 0-255, alpha 0-1).

```ts
import { rgba255TupleToCssRgbaObject } from '@accelint/converters/css-rgba';

rgba255TupleToCssRgbaObject([255, 128, 64, 255]);  // { r: 255, g: 128, b: 64, a: 1 }
rgba255TupleToCssRgbaObject([255, 128, 64, 128]);  // { r: 255, g: 128, b: 64, a: 0.5019607843137255 }
```

### Type Guards

Type guard functions have been moved to the `@accelint/predicates` package for better separation of concerns:

- **`isRgba255Tuple`** - Check if value is a valid Rgba255Tuple (all channels 0-255)
- **`isCssRgbaObject`** - Check if value is a valid CssRgbaObject (RGB 0-255, alpha 0-1)
- **`isCssRgbaString`** - Check if value is a valid CSS RGBA/RGB string

```ts
import { isRgba255Tuple } from '@accelint/predicates/is-rgba-255-tuple';
import { isCssRgbaObject } from '@accelint/predicates/is-css-rgba-object';
import { isCssRgbaString } from '@accelint/predicates/is-css-rgba-string';

isRgba255Tuple([255, 128, 64, 255]);  // true
isCssRgbaObject({ r: 255, g: 128, b: 64, a: 1 });  // true
isCssRgbaString('rgba(255, 128, 64, 0.5)');  // true
```

See the [predicates documentation](https://github.com/gohypergiant/standard-toolkit/tree/main/packages/predicates) for more details.

## Usage Examples

### CSS → deck.gl → CSS Workflow

```ts
import { cssRgbaStringToRgba255Tuple, rgba255TupleToCssRgbaString } from '@accelint/converters/css-rgba';

// Parse user input
const userColor = 'rgba(255, 128, 64, 0.5)';
const deckColor = cssRgbaStringToRgba255Tuple(userColor);  // [255, 128, 64, 128]

// Use in deck.gl
// ...

// Convert back for display
const cssString = rgba255TupleToCssRgbaString(deckColor);  // "rgba(255, 128, 64, 0.5)"
```

### Working with React Aria Components

```ts
import { cssRgbaObjectToRgba255Tuple, rgba255TupleToCssRgbaObject } from '@accelint/converters/css-rgba';
import type { CssRgbaObject } from '@accelint/converters/css-rgba';

// Parse color from React Aria Component
const colorFromPicker: CssRgbaObject = { r: 255, g: 128, b: 64, a: 0.5 };
const deckColor = cssRgbaObjectToRgba255Tuple(colorFromPicker);  // [255, 128, 64, 128]

// Use in deck.gl visualization
// ...

// Convert back for another React Aria Component
const colorForInput = rgba255TupleToCssRgbaObject(deckColor);  // { r: 255, g: 128, b: 64, a: 0.5 }
```

### Adjusting Opacity

```ts
import { cssRgbaStringToRgba255Tuple, rgba255TupleToCssRgbaString } from '@accelint/converters/css-rgba';

const adjustOpacity = (cssColor: string, opacity: number): string => {
  const [r, g, b] = cssRgbaStringToRgba255Tuple(cssColor);
  const newAlpha = Math.round(opacity * 255);
  return rgba255TupleToCssRgbaString([r, g, b, newAlpha]);
};

adjustOpacity('rgba(255, 128, 64, 1)', 0.5);  // "rgba(255, 128, 64, 0.5)"
```

## Type Definitions

```ts
/**
 * RGBA color where all channels are 0-255 (deck.gl standard format)
 * [red, green, blue, alpha]
 *
 * Imported from @accelint/predicates/is-rgba-255-tuple
 */
type Rgba255Tuple = readonly [
  r: number,  // 0-255
  g: number,  // 0-255
  b: number,  // 0-255
  a: number,  // 0-255
];

/**
 * CSS-style RGBA color object (React Aria Components style)
 * RGB channels are 0-255, alpha is 0-1
 *
 * Imported from @accelint/predicates/is-css-rgba-object
 */
type CssRgbaObject = {
  readonly r: number;  // 0-255
  readonly g: number;  // 0-255
  readonly b: number;  // 0-255
  readonly a: number;  // 0-1
};

/**
 * CSS RGBA tuple format (used by React Aria Components and other CSS-based libraries)
 * RGB channels are 0-255, alpha is 0-1
 * [red, green, blue, alpha]
 */
type CssRgbaTuple = readonly [
  r: number,  // 0-255
  g: number,  // 0-255
  b: number,  // 0-255
  a: number,  // 0-1
];

```

## Format Reference

| Format | RGB Range | Alpha Range | Example |
|--------|-----------|-------------|---------|
| **deck.gl** | 0-255 | 0-255 | `[255, 128, 64, 255]` |
| **CSS RGBA String** | 0-255 | 0-1 | `"rgba(255, 128, 64, 0.5)"` |
| **CSS RGBA Tuple** | 0-255 | 0-1 | `[255, 128, 64, 0.5]` |
| **CSS RGBA Object** | 0-255 | 0-1 | `{ r: 255, g: 128, b: 64, a: 0.5 }` |

## Round-Trip Conversions

All conversions are lossless when round-tripped:

```ts
import {
  cssRgbaStringToRgba255Tuple, 
  rgba255TupleToCssRgbaString,
  cssRgbaTupleToRgba255Tuple, 
  rgba255TupleToCssRgbaTuple,
  cssRgbaObjectToRgba255Tuple, 
  rgba255TupleToCssRgbaObject,
} from '@accelint/converters/css-rgba';

const original = [255, 128, 64, 255];

// CSS string round-trip
cssRgbaStringToRgba255Tuple(rgba255TupleToCssRgbaString(original)) === original  // ✓

// CSS tuple round-trip
cssRgbaTupleToRgba255Tuple(rgba255TupleToCssRgbaTuple(original)) === original  // ✓

// CSS object round-trip
cssRgbaObjectToRgba255Tuple(rgba255TupleToCssRgbaObject(original)) === original  // ✓
```

## Why This Approach?

Compared to existing color libraries (colord, chroma.js, colorjs.io):

### No Object Creation Overhead

```ts
// Other libraries (object creation for every operation)
const color = new Color('rgba(255, 128, 64, 0.5)');
const cssString = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.alpha})`;

// This library (direct tuple operations)
const tuple = cssRgbaStringToRgba255Tuple('rgba(255, 128, 64, 0.5)');
const cssString = rgba255TupleToCssRgbaString(tuple);
```

### Composition-Friendly

```ts
// Works naturally in composition pipelines
import { cssRgbaStringToRgba255Tuple, rgba255TupleToCssRgbaString } from '@accelint/converters/css-rgba';

const parseAndAdjustOpacity = (cssColor: string, opacity: number) => {
  const [r, g, b] = cssRgbaStringToRgba255Tuple(cssColor);
  return rgba255TupleToCssRgbaString([r, g, b, Math.round(opacity * 255)]);
};

// Compose with other CSS operations
const result = compose(
  parseAndAdjustOpacity,
  convertToHsl,      // Custom consumer-side function
  normalizeForCss    // Custom consumer-side function
)('rgba(255, 128, 64, 1)', 0.8);
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
