# @accelint/geo

Geographic coordinate parsing, conversion, and formatting for multiple coordinate systems.

## Features

- **5 Coordinate Systems**: Parse and format coordinates in multiple notation systems
  - Decimal Degrees (DD): `40.7128° N / 74.0060° W`
  - Degrees Decimal Minutes (DDM): `40° 42.768' N / 74° 0.36' W`
  - Degrees Minutes Seconds (DMS): `40° 42' 46.08" N / 74° 0' 21.6" W`
  - Military Grid Reference System (MGRS): `18T WL 80000 00000`
  - Universal Transverse Mercator (UTM): `18N 585628 4511644`

- **Flexible Format Ordering**: Convert between LATLON and LONLAT formats
- **Structured Parts API**: Get the numeric pieces of a coordinate (`{ degrees, minutes, seconds, hemisphere }`, or grid components) instead of a formatted string — useful for segmented inputs and custom renderers
- **Standalone Functions**: Per-system `format*`/`parse*` helpers and validation predicates alongside the `createCoordinate` façade
- **Input Validation**: Detailed error messages for invalid coordinates
- **Performance Optimized**: Immutable coordinate objects with intelligent caching
- **Type Safe**: Full TypeScript support with complete type definitions

## Installation

```sh
pnpm add @accelint/geo
```

## Quick Start

```typescript
import { createCoordinate, coordinateSystems } from '@accelint/geo';

// Create a coordinate parser for Decimal Degrees
const create = createCoordinate(coordinateSystems.dd, 'LATLON');
const coord = create('40.7128 / -74.0060');

// Or use numeric input
const coord2 = create([40.7128, -74.0060]);

// Access different formats
coord.dd();    // '40.7128 N / 74.006 W'
coord.ddm();   // '40 42.768 N / 74 0.36 W'
coord.dms();   // '40 42 46.08 N / 74 0 21.6 W'
coord.mgrs();  // '18T WL 80000 00000'
coord.utm();   // '18N 585628 4511644'

// Change format order
coord.dms('LONLAT'); // '74 0 21.6 W / 40 42 46.08 N'
```

## Usage Examples

### Parsing Different Coordinate Systems

```typescript
import { createCoordinate, coordinateSystems } from '@accelint/geo';

// Parse Decimal Degrees
const parseDD = createCoordinate(coordinateSystems.dd);
const coordDD = parseDD('40.7128 / -74.0060');

// Parse Degrees Minutes Seconds
const parseDMS = createCoordinate(coordinateSystems.dms);
const coordDMS = parseDMS('40° 42\' 46.08" N / 74° 0\' 21.6" W');

// Parse UTM coordinates
const parseUTM = createCoordinate(coordinateSystems.utm);
const coordUTM = parseUTM('18N 585628 4511644');

// Parse MGRS coordinates
const parseMGRS = createCoordinate(coordinateSystems.mgrs);
const coordMGRS = parseMGRS('18T WL 80000 00000');
```

### Numeric Input

```typescript
import { createCoordinate, coordinateSystems } from '@accelint/geo';
import type { LatLonTuple, LonLatTuple } from '@accelint/geo';

// Using typed tuple input (order follows format parameter)
const create = createCoordinate(coordinateSystems.dd, 'LATLON');
const latlon: LatLonTuple = [40.7128, -74.0060];
const coordTuple = create(latlon);

// LONLAT order (GeoJSON convention)
const createLonLat = createCoordinate(coordinateSystems.dd, 'LONLAT');
const lonlat: LonLatTuple = [-74.0060, 40.7128];
const coordLonLat = createLonLat(lonlat);

// Using object input
const coordObj = create({ lat: 40.7128, lon: -74.0060 });

// Object aliases also work
const coordAlt = create({ latitude: 40.7128, longitude: -74.0060 });
```

### Converting Between Formats

```typescript
const create = createCoordinate(coordinateSystems.dd, 'LATLON');
const coord = create('40.7128 / -74.0060');

// Convert to different coordinate systems
coord.dd();    // '40.7128 N / 74.006 W'
coord.ddm();   // '40 42.768 N / 74 0.36 W'
coord.dms();   // '40 42 46.08 N / 74 0 21.6 W'
coord.mgrs();  // '18T WL 80000 00000'
coord.utm();   // '18N 585628 4511644'

// Change coordinate order (LATLON to LONLAT)
coord.dd('LONLAT');  // '74.006 W / 40.7128 N'
coord.dms('LONLAT'); // '74 0 21.6 W / 40 42 46.08 N'
```

### Error Handling

```typescript
const create = createCoordinate(coordinateSystems.dd);
const coord = create('invalid input');

if (!coord.valid) {
  console.log(coord.errors);
  // ['[ERROR] No input.']
}

// Access raw coordinate values
if (coord.valid) {
  console.log(coord.raw.LAT); // 40.7128
  console.log(coord.raw.LON); // -74.0060
}
```

## API Reference

### `createCoordinate(system?, format?)`

Creates a coordinate parser function.

**Parameters:**

- `system` (CoordinateSystem, optional): Coordinate system to use for parsing. Defaults to `coordinateSystems.dd`
- `format` (Format, optional): Coordinate order format (`'LATLON'` or `'LONLAT'`). Defaults to `'LATLON'`

**Returns:** Function that accepts a coordinate input and returns a Coordinate object

**Input types:**

- **String**: Coordinate string in the specified system's format (e.g., `'40.7128 / -74.0060'`)
- **Tuple**: `LatLonTuple` or `LonLatTuple` — a `readonly [number, number]` with named elements, where order follows the `format` parameter (e.g., `[40.7128, -74.0060]` for LATLON)
- **Object**: Object with lat/lon properties. Accepts case-insensitive keys:
  - `lat` / `lon`
  - `latitude` / `longitude`

**Example:**

```typescript
const create = createCoordinate(coordinateSystems.dd, 'LATLON');
const coord = create('40.7128 / -74.0060');
```

### `coordinateSystems`

Object containing available coordinate system implementations.

**Properties:**

- `dd` - Decimal Degrees system
- `ddm` - Degrees Decimal Minutes system
- `dms` - Degrees Minutes Seconds system
- `mgrs` - Military Grid Reference System
- `utm` - Universal Transverse Mercator system

### Coordinate Object

The object returned by calling the function from `createCoordinate()`.

**Properties:**

- `valid` (boolean): Whether the coordinate was successfully parsed
- `errors` (string[]): Array of error messages (empty if valid)
- `raw` (object): Raw coordinate values with `LAT` and `LON` properties

**Methods:**

- `dd(format?)`: Format as Decimal Degrees
- `ddm(format?)`: Format as Degrees Decimal Minutes
- `dms(format?)`: Format as Degrees Minutes Seconds
- `mgrs(format?)`: Format as MGRS
- `utm(format?)`: Format as UTM

Each method accepts an optional `format` parameter (`'LATLON'` or `'LONLAT'`) to override the default format order.

### TypeScript Types

The package exports named tuple types for type-safe coordinate handling:

- **`LatLonTuple`** — `readonly [latitude: number, longitude: number]` — tuple in lat/lon order
- **`LonLatTuple`** — `readonly [longitude: number, latitude: number]` — tuple in lon/lat order (GeoJSON convention)
- **`CoordinateTuple`** — `LatLonTuple | LonLatTuple` — union of both orderings
- **`CoordinateObject`** — `Record<string, number>` — object with string keys (e.g., `{ lat, lon }`)
- **`CoordinateInput`** — `string | CoordinateTuple | CoordinateObject` — all accepted input types

Named tuple elements provide IDE hints for element order, preventing lat/lon mix-ups:

```typescript
import type { LatLonTuple, LonLatTuple } from '@accelint/geo';

const latlon: LatLonTuple = [40.7128, -74.0060]; // [latitude, longitude]
const lonlat: LonLatTuple = [-74.0060, 40.7128]; // [longitude, latitude]
```

## Structured Parts API

When you need the numeric components of a coordinate rather than a formatted string — driving segmented inputs, building a custom renderer, or feeding another calculation — reach for the parts functions instead of parsing a formatted string back apart.

### Lat/lon parts

`toDecimalDegreesParts`, `toDdmParts`, and `toDmsParts` each take a single signed value plus an axis (`'lat'` or `'lon'`) and return the non-negative magnitude components plus a `hemisphere` letter. Carry is applied so `minutes` and `seconds` never reach `60`.

```typescript
import { toDecimalDegreesParts, toDdmParts, toDmsParts } from '@accelint/geo';

toDecimalDegreesParts(-122.4194, 'lon');
// { degrees: 122.4194, hemisphere: 'W' }

toDdmParts(12.576, 'lat');
// { degrees: 12, minutes: 34.56, hemisphere: 'N' }

toDmsParts(-77.0369, 'lon');
// { degrees: 77, minutes: 2, seconds: 12.84, hemisphere: 'W' }
```

Each accepts an optional trailing `precision` argument (defaults: DD `6`, DDM `4`, DMS `2`).

### Grid parts

`toUtmParts` and `toMgrsParts` take a signed `[latitude, longitude]` tuple and read the grid components directly. They return a discriminated `GridPartsResult`: `{ ok: true, value }` on success, or `{ ok: false, reason: 'out-of-range' }` when the coordinate is non-finite, outside the inclusive `80°S`–`84°N` grid band, or exactly `+180°` longitude (where the UTM zone is undefined). They never throw, so callers branch on `ok` instead of catching an error.

```typescript
import { toUtmParts, toMgrsParts, formatUtmParts, formatMgrsParts } from '@accelint/geo';

toUtmParts([38.8977, -77.0365]);
// { ok: true, value: { zone: 18, hemisphere: 'N', easting: 323394, northing: 4307396 } }

toUtmParts([85, 0]);
// { ok: false, reason: 'out-of-range' }

toMgrsParts([-81, 0]);
// { ok: false, reason: 'out-of-range' }
```

`formatUtmParts` / `formatMgrsParts` render grid parts back into the canonical string, so a caller that already holds parts (or wants to consume `toUtmParts`/`toMgrsParts` and render) shares one renderer:

```typescript
formatUtmParts({ zone: 18, hemisphere: 'N', easting: 323394, northing: 4307396 });
// '18N 323394 4307396'
```

## Standalone Functions

The per-system `format*` and `parse*` functions are exported directly, so you can format a `[latitude, longitude]` tuple (or parse a single system's string) without building a `createCoordinate` object.

```typescript
import { formatDecimalDegrees, formatDegreesMinutesSeconds } from '@accelint/geo';

formatDecimalDegrees([37.7749, -122.4194], { separator: ' / ', withOrdinal: true });
// '37.774900° N / 122.419400° W'

formatDegreesMinutesSeconds([37.7749, -122.4194], { separator: ' / ' });
// '37° 46' 29.64″ / 122° 25' 9.84″'
```

Parsers: `parseDecimalDegrees`, `parseDegreesDecimalMinutes`, `parseDegreesMinutesSeconds`, `parseMGRS`, and `parseUTM` parse a single system's string.

### Validation

`isValidNumericCoordinate` is a boolean check (finite and in range); `validateNumericCoordinate` returns an array of error messages (empty when valid).

```typescript
import { isValidNumericCoordinate, validateNumericCoordinate } from '@accelint/geo';

isValidNumericCoordinate(45.5, -122.6); // true
isValidNumericCoordinate(91, -122.6);   // false

validateNumericCoordinate(45.5, -122.6); // []
validateNumericCoordinate(91, -122.6);
// ['[ERROR] Latitude value (91) is outside valid range (-90 to 90).']
```

## Coordinate System Formats

### Decimal Degrees (DD)

- Format: `±DD.DDDD°`
- Example: `40.7128° N / 74.0060° W`

### Degrees Decimal Minutes (DDM)

- Format: `±DD° MM.MMMM'`
- Example: `40° 42.768' N / 74° 0.36' W`

### Degrees Minutes Seconds (DMS)

- Format: `±DD° MM' SS.SSSS"`
- Example: `40° 42' 46.08" N / 74° 0' 21.6" W`

### Military Grid Reference System (MGRS)

- Format: `ZZ[A-Z] [A-Z][A-Z] EEEEE NNNNN`
- Example: `18T WL 80000 00000`

### Universal Transverse Mercator (UTM)

- Format: `ZZ[N|S] EEEEEE NNNNNNN`
- Example: `18N 585628 4511644`

## License

Apache-2.0

Copyright 2024-2026 Hypergiant Galactic Systems Inc.
