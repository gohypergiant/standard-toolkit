# @accelint/constants

A collection of commonly used constant values for Accelint projects.

## Installation

```sh
pnpm add @accelint/constants
```

## Usage

Import from the main package or specific subpaths:

```ts
// Import all constants
import { DEFAULT_COORDINATE, HEX_REGEX } from '@accelint/constants';

// Import from subpaths
import { CSS_RGBA_LEGACY_REGEX, CSS_RGBA_MODERN_REGEX, HEX_REGEX } from '@accelint/constants/color';
import { DEFAULT_COORDINATE } from '@accelint/constants/coordinates';
```

## Constants

### Color

Regex patterns for parsing color strings in various formats.

#### `HEX_REGEX`

Matches hex color formats with or without the `#` prefix.

**Supported formats:**

- 3-character: `#RGB` or `RGB`
- 4-character: `#RGBA` or `RGBA`
- 6-character: `#RRGGBB` or `RRGGBB`
- 8-character: `#RRGGBBAA` or `RRGGBBAA`

```ts
import { HEX_REGEX } from '@accelint/constants/color';

HEX_REGEX.test('#FF8040');     // true
HEX_REGEX.test('FF8040');      // true
HEX_REGEX.test('#F84');        // true
HEX_REGEX.test('#FF804080');   // true
```

#### `CSS_RGBA_LEGACY_REGEX`

Matches legacy comma-separated CSS color syntax (CSS Color Module Level 3).

**Supported formats:**

- `rgb(r, g, b)`
- `rgba(r, g, b, a)`
- Supports integers and percentages for RGB values
- Supports decimals and percentages for alpha

```ts
import { CSS_RGBA_LEGACY_REGEX } from '@accelint/constants/color';

CSS_RGBA_LEGACY_REGEX.test('rgb(255, 128, 64)');        // true
CSS_RGBA_LEGACY_REGEX.test('rgba(255, 128, 64, 0.5)'); // true
CSS_RGBA_LEGACY_REGEX.test('rgb(100%, 50%, 25%)');     // true
```

#### `CSS_RGBA_MODERN_REGEX`

Matches modern space-separated CSS color syntax (CSS Color Module Level 4).

**Supported formats:**

- `rgb(r g b)`
- `rgb(r g b / a)`
- Supports integers and percentages for RGB values
- Supports decimals and percentages for alpha

```ts
import { CSS_RGBA_MODERN_REGEX } from '@accelint/constants/color';

CSS_RGBA_MODERN_REGEX.test('rgb(255 128 64)');          // true
CSS_RGBA_MODERN_REGEX.test('rgb(255 128 64 / 0.5)');   // true
CSS_RGBA_MODERN_REGEX.test('rgb(100% 50% 25%)');       // true
```

### Coordinates

#### `DEFAULT_COORDINATE`

Default empty coordinate value `[NaN, NaN]`.

Using `[0, 0]` as a default is incorrect because it represents a real location in the Atlantic Ocean known as "Null Island" (where the prime meridian meets the equator in the Gulf of Guinea).

```ts
import { DEFAULT_COORDINATE } from '@accelint/constants/coordinates';

const userLocation = coordinates ?? DEFAULT_COORDINATE;
```

## License

Apache-2.0
