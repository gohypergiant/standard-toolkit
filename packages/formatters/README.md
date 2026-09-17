# @accelint/formatters

A set of useful formatting functions for enhancing readability and consistency in your applications.

## Installation

```sh
pnpm add @accelint/formatters
```

## Usage

Every formatter is available from the package root or from its own subpath for tree-shaking:

```typescript
// Import from the package root
import { formatBearing, formatDistance, formatM3A } from '@accelint/formatters';

// Or import from a subpath
import { formatBearing, formatDistance } from '@accelint/formatters/bearing';
import { formatM3A } from '@accelint/formatters/iff';
```

## Formatters

### Bearing and Distance

Display helpers for tactical bearing and range readouts.

#### `formatBearing(degrees)`

Formats a bearing in degrees as a zero-padded 3-digit string with a degree symbol. Any value is wrapped into the `0–360` range first, and fractional bearings round to the nearest whole degree. Throws a `RangeError` if `degrees` is `NaN` or infinite.

```typescript
import { formatBearing } from '@accelint/formatters/bearing';

formatBearing(45);    // "045°"
formatBearing(-10);   // "350°"
formatBearing(360);   // "000°"
formatBearing(359.6); // "000°"
```

#### `formatDistance(meters, units)`

Converts a distance in meters to a string with one decimal place and a unit symbol. Pass a single `DistanceUnit` or an array of one or two units; two units are joined with `" / "`. Conversion factors come from `METERS_PER_UNIT` and symbols from `DISTANCE_UNIT_SYMBOLS`, both in `@accelint/constants/units`.

Supported units: `kilometers`, `meters`, `nauticalmiles`, `miles`, `feet`.

```typescript
import { formatDistance } from '@accelint/formatters/bearing';

formatDistance(42300, 'kilometers');                    // "42.3 km"
formatDistance(42300, ['kilometers', 'nauticalmiles']); // "42.3 km / 22.8 NM"
formatDistance(1609.344, 'miles');                      // "1.0 mi"

formatDistance(42300, []);                              // Error: formatDistance accepts 1 or 2 units.
formatDistance(42300, ['kilometers', 'miles', 'feet']); // Error: formatDistance accepts 1 or 2 units.
formatDistance(Number.NaN, 'kilometers');               // RangeError: meters must be a finite number.
```

### IFF (Identification Friend or Foe)

Aviation transponder code formatters for military and civilian aircraft identification:

- **`formatM1(value?)`** - Mode 1: 2-digit octal mission/type code (military only)
- **`formatM2(value?)`** - Mode 2: 4-digit octal unit code/tail number (military only)
- **`formatM3A(value?)`** - Mode 3/A: 4-digit octal squawk code (military and civilian)
- **`formatM4(value)`** - Mode 4: 4-digit encrypted challenge (military only)
- **`formatM5(value)`** - Mode 5: 4-digit cryptographic Mode S/ADS-B (military only)

All formatters return zero-padded strings or default values (`--` for 2-digit, `----` for 4-digit) when value is unavailable.

### Planned

The following formatters are planned for future releases:

- Altitude formatters
- Azimuth formatters
