# Color Converters

Comprehensive hex color conversion utilities for web applications. Convert between RGBA 255 tuples and hex string formats.

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
  hexToRgba255Tuple,
} from '@accelint/converters/hex';

// Parse hex color
const color = hexToRgba255Tuple('#FF8040');  // [255, 128, 64, 255]
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

#### `hexToRgba255Tuple(hex: string): Rgba255Tuple`

Parse hex color strings. Supports 3, 4, 6, and 8 character formats following the CSS hex color spec.

```ts
import { hexToRgba255Tuple } from '@accelint/converters/hex';

hexToRgba255Tuple('#FF8040');      // [255, 128, 64, 255] (6-char: #RRGGBB)
hexToRgba255Tuple('#F84');         // [255, 136, 68, 255] (3-char: #RGB expands to #FF8844)
hexToRgba255Tuple('#F840');        // [255, 136, 68, 0]   (4-char: #RGBA expands to #FF884400)
hexToRgba255Tuple('#FF804080');    // [255, 128, 64, 128] (8-char: #RRGGBBAA)
hexToRgba255Tuple('FF8040');       // [255, 128, 64, 255] (hash optional)
```

### Serialization (Rgba255Tuple → External)

#### `rgba255TupleToHex(color: Rgba255Tuple, includeAlpha?: boolean): string`

Convert to hex string format.

```ts
import { rgba255TupleToHex } from '@accelint/converters/hex';

rgba255TupleToHex([255, 128, 64, 255]);         // "#FF8040"
rgba255TupleToHex([255, 128, 64, 128], true);   // "#FF804080"
```

### Type Guards

Type guard functions have been moved to the `@accelint/predicates` package for better separation of concerns:

- **`isRgba255Tuple`** - Check if value is a valid Rgba255Tuple (all channels 0-255)
- **`isHexColor`** - Check if value is a valid hex color string

```ts
import { isRgba255Tuple } from '@accelint/predicates/is-rgba-255-tuple';
import { isHexColor } from '@accelint/predicates/is-hex-color';

isRgba255Tuple([255, 128, 64, 255]);  // true
isHexColor('#FF8040');  // true
```

See the [predicates documentation](https://github.com/gohypergiant/standard-toolkit/tree/main/packages/predicates) for more details.

## Usage Examples

### Hex → deck.gl → Hex Workflow

```ts
import { hexToRgba255Tuple, rgba255TupleToHex } from '@accelint/converters/hex';

const hex = '#FF8040';
const deckColor = hexToRgba255Tuple(hex);  // [255, 128, 64, 255]

// Use in deck.gl
// ...

// Convert back
const hexString = rgba255TupleToHex(deckColor);  // "#FF8040"
```

### Manipulating Hex Colors

```ts
import { hexToRgba255Tuple, rgba255TupleToHex } from '@accelint/converters/hex';

// Darken a hex color by reducing each RGB channel
const darkenHex = (hexColor: string, amount: number): string => {
  const [r, g, b, a] = hexToRgba255Tuple(hexColor);
  const darkened: Rgba255Tuple = [
    Math.max(0, r - amount),
    Math.max(0, g - amount),
    Math.max(0, b - amount),
    a,
  ];
  return rgba255TupleToHex(darkened);
};

darkenHex('#FF8040', 50);  // "#CB5A1E"
```

### Working with Alpha Channel

```ts
import { hexToRgba255Tuple, rgba255TupleToHex } from '@accelint/converters/hex';

// Convert 6-char hex to 8-char hex with transparency
const addTransparency = (hexColor: string, opacity: number): string => {
  const [r, g, b] = hexToRgba255Tuple(hexColor);
  return rgba255TupleToHex([r, g, b, Math.round(opacity * 255)], true);
};

addTransparency('#FF8040', 0.5);  // "#FF804080"
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
```

## Format Reference

| Format | RGB Range | Alpha Range | Example |
|--------|-----------|-------------|---------|
| **deck.gl** | 0-255 | 0-255 | `[255, 128, 64, 255]` |
| **Hex (3-char)** | 0-F | - | `"#F84"` (expands to #FF8844) |
| **Hex (4-char)** | 0-F | 0-F | `"#F840"` (expands to #FF884400) |
| **Hex (6-char)** | 00-FF | - | `"#FF8040"` |
| **Hex (8-char)** | 00-FF | 00-FF | `"#FF804080"` |

## Round-Trip Conversions

All conversions are lossless when round-tripped:

```ts
import {
  hexToRgba255Tuple, 
  rgba255TupleToHex,
} from '@accelint/converters/hex';

const original = [255, 128, 64, 255];

// Hex round-trip
hexToRgba255Tuple(rgba255TupleToHex(original)) === original  // ✓
```

## Why This Approach?

Compared to existing color libraries (colord, chroma.js, colorjs.io):

### No Object Creation Overhead

```ts
// Other libraries (object creation for every operation)
const color = new Color('#FF8040');
const channels = [color.r, color.g, color.b, color.alpha];

// This library (direct tuple operations)
const channels = hexToRgba255Tuple('#FF8040');
const hexString = rgba255TupleToHex(channels);
```

### Composition-Friendly

```ts
// Works naturally in composition pipelines
import { hexToRgba255Tuple, rgba255TupleToHex } from '@accelint/converters/hex';

const darkenAndAddAlpha = (hexColor: string, darkenAmount: number, opacity: number) => {
  const [r, g, b] = hexToRgba255Tuple(hexColor);
  return rgba255TupleToHex([
    Math.max(0, r - darkenAmount),
    Math.max(0, g - darkenAmount),
    Math.max(0, b - darkenAmount),
    Math.round(opacity * 255),
  ], true);
};

// Compose with other hex operations
const result = compose(
  darkenAndAddAlpha,
  normalizeHex,      // Custom consumer-side function
  validateHex        // Custom consumer-side function
)('#FF8040', 30, 0.8);
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
