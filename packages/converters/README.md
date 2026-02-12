# @accelint/converters

A lightweight JavaScript utility for converting between various value types, including colors, booleans, numbers, geographic coordinates, and map tile coordinates.

## Installation

```sh
pnpm add @accelint/converters
```

**Optional dependencies** (only needed for specific color converters):

```sh
# For hex and CSS color conversions
pnpm add @accelint/constants @accelint/predicates

# For GLSL color conversions (in addition to above)
pnpm add @accelint/math
```

## Quick Start

```ts
import { booleanToNumber, toBoolean, hexToRgba255Tuple } from '@accelint/converters';

// Boolean conversions
booleanToNumber(true);           // 1
toBoolean('false');              // false
toBoolean('  0.000  ');          // false

// Color conversions
hexToRgba255Tuple('#FF8040');    // [255, 128, 64, 255]
```

## Usage

Import from the main package or specific subpaths:

```ts
// Import from main package
import { booleanToNumber, toBoolean, hexToRgba255Tuple } from '@accelint/converters';

// Import from subpaths
import { booleanToNumber } from '@accelint/converters/boolean-to-number';
import { toBoolean } from '@accelint/converters/to-boolean';
import { zxyToBbox } from '@accelint/converters/zxy-to-bbox';

// Color converters (from main package or submodules)
import { hexToRgba255Tuple } from '@accelint/converters';
import { hexToRgba255Tuple } from '@accelint/converters/hex';
import { cssRgbaStringToRgba255Tuple } from '@accelint/converters/css-rgba';
import { rgba255TupleToGlsl } from '@accelint/converters/glsl';
```

## Converters

### Boolean Conversions

#### `booleanToNumber(val: boolean): number`

Convert boolean values to integers.

```ts
import { booleanToNumber } from '@accelint/converters/boolean-to-number';

booleanToNumber(true);   // 1
booleanToNumber(false);  // 0
```

#### `toBoolean(val: unknown): boolean`

Convert various values to boolean with smart handling of "false" values.

**"false" values:**

- Inherently false: `''` (empty string), `0`, `false`, `undefined`, `null`, `NaN`
- Numeric zero: `'0.000'` - any number of leading or trailing zeros
- String literal: `'false'` - any capitalizations or space-padding

```ts
import { toBoolean } from '@accelint/converters/to-boolean';

toBoolean(1);             // true
toBoolean(' FaLsE ');     // false
toBoolean('  true');      // true
toBoolean('000.000');     // false
toBoolean('');            // false
toBoolean('anything');    // true
```

For more restrictive comparisons against `true`, `false`, `on`, `off`, `yes`, `no`, see [@accelint/predicates](https://github.com/gohypergiant/standard-toolkit/tree/main/packages/predicates).

### Geographic Conversions

#### `zxyToBbox(tile: ZxyTuple): BoundingBoxTuple`

Convert map tile coordinates (z, x, y) to bounding box coordinates (west, south, east, north).

**Types:**

- `ZxyTuple`: `[z, x, y]`
- `BoundingBoxTuple`: `[west, south, east, north]`

```ts
import { zxyToBbox } from '@accelint/converters/zxy-to-bbox';
import type { ZxyTuple, BoundingBoxTuple } from '@accelint/converters/zxy-to-bbox';

const tile: ZxyTuple = [8, 71, 96];
const bbox: BoundingBoxTuple = zxyToBbox(tile);
// [west, south, east, north]
```

Based on the [OpenStreetMap Slippy Map tile naming convention](https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames).

### Color Conversions

Comprehensive color conversion utilities for working with RGBA 255 tuples (deck.gl format), hex strings, CSS RGBA formats, and GLSL tuples.

Color converters are organized into three modules based on their dependencies:

#### Hex Converters

Convert between hex color strings and RGBA 255 tuples.

**Dependencies:** `@accelint/constants`, `@accelint/predicates`

```ts
import { hexToRgba255Tuple, rgba255TupleToHex } from '@accelint/converters/hex';

hexToRgba255Tuple('#FF8040');                    // [255, 128, 64, 255]
rgba255TupleToHex([255, 128, 64, 255]);          // "#FF8040"
rgba255TupleToHex([255, 128, 64, 128], true);    // "#FF804080" (with alpha)
```

See the [hex converter README](./src/hex/README.md) for detailed documentation.

#### CSS RGBA Converters

Convert between CSS RGBA formats (string/tuple/object) and RGBA 255 tuples.

**Dependencies:** `@accelint/constants`, `@accelint/predicates`

```ts
import {
  cssRgbaStringToRgba255Tuple,
  rgba255TupleToCssRgbaString,
  cssRgbaObjectToRgba255Tuple,
  rgba255TupleToCssRgbaObject,
} from '@accelint/converters/css-rgba';

// CSS string conversions
cssRgbaStringToRgba255Tuple('rgba(255, 128, 64, 0.5)');  // [255, 128, 64, 128]
rgba255TupleToCssRgbaString([255, 128, 64, 128]);        // "rgba(255, 128, 64, 0.5019607843137255)"

// CSS object conversions (React Aria Components)
cssRgbaObjectToRgba255Tuple({ r: 255, g: 128, b: 64, a: 0.5 });  // [255, 128, 64, 128]
rgba255TupleToCssRgbaObject([255, 128, 64, 128]);                // { r: 255, g: 128, b: 64, a: 0.5 }
```

See the [CSS RGBA converter README](./src/css-rgba/README.md) for detailed documentation.

#### GLSL Converters

Convert between GLSL format (0-1) and RGBA 255 tuples (0-255) for shader programming.

**Dependencies:** `@accelint/math`

```ts
import { rgba255TupleToGlsl, glslToRgba255Tuple } from '@accelint/converters/glsl';

rgba255TupleToGlsl([255, 128, 64, 255]);  // [1, 0.5019607843137255, 0.25098039215686274, 1]
glslToRgba255Tuple([1, 0.5, 0.25, 1]);    // [255, 128, 64, 255]
```

See the [GLSL converter README](./src/glsl/README.md) for detailed documentation.

## License

Apache-2.0
