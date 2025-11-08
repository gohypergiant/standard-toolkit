# @accelint/geo

A collection of JavaScript functions for working with coordinates and geospatial data.

## Installation

```sh
npm install @accelint/geo
```

## Usage

### Creating Coordinates

The `createCoordinate` function is the primary interface for creating and converting between coordinate systems. It supports three coordinate systems: MGRS, UTM, and WGS84.

For WGS84 coordinates, you can use convenient aliases (`'latlon'` or `'lonlat'`) that automatically set the coordinate order.

```typescript
import { createCoordinate } from '@accelint/geo';

// Create an MGRS coordinate
const mgrs = createCoordinate('mgrs', '18SUJ2306806559');

// Create a UTM coordinate
const utm = createCoordinate('utm', '18N 323068 4606559');

// Create a WGS84 coordinate (latitude, longitude)
const wgs = createCoordinate('wgs', '42.3601, -71.0589');

// Or use aliases for explicit coordinate order
const latlon = createCoordinate('latlon', '42.3601, -71.0589'); // latitude, longitude
const lonlat = createCoordinate('lonlat', '-71.0589, 42.3601'); // longitude, latitude
```

### WGS84 Coordinate Order

When working with WGS84 coordinates, you have three options for specifying the system:

#### `'wgs'` - Generic WGS84

The generic `'wgs'` identifier accepts an optional `order` parameter to specify coordinate order:

```typescript
// Default order is 'latlon' (latitude, longitude)
const wgs1 = createCoordinate('wgs', '42.3601, -71.0589');
console.log(wgs1.toString()); // "42.3601, -71.0589"

// Explicit lonlat order
const wgs2 = createCoordinate('wgs', '-71.0589, 42.3601', { order: 'lonlat' });
console.log(wgs2.toString()); // "-71.0589, 42.3601"
```

#### `'latlon'` - Latitude, Longitude

The `'latlon'` alias automatically sets the order to latitude-longitude. It does not accept the `order` option:

```typescript
const latlon = createCoordinate('latlon', '42.3601, -71.0589');
console.log(latlon.toString()); // "42.3601, -71.0589"

// TypeScript prevents conflicting options:
// createCoordinate('latlon', '...', { order: 'lonlat' }); // ❌ Compile error
```

#### `'lonlat'` - Longitude, Latitude

The `'lonlat'` alias automatically sets the order to longitude-latitude. It does not accept the `order` option:

```typescript
const lonlat = createCoordinate('lonlat', '-71.0589, 42.3601');
console.log(lonlat.toString()); // "-71.0589, 42.3601"

// TypeScript prevents conflicting options:
// createCoordinate('lonlat', '...', { order: 'latlon' }); // ❌ Compile error
```

**When to use each:**
- Use `'wgs'` when you need flexibility or are working with dynamic order options
- Use `'latlon'` when your data is explicitly in latitude-longitude order for clearer intent
- Use `'lonlat'` when your data is explicitly in longitude-latitude order (e.g., GeoJSON format)

### Return Types

The `createCoordinate` function returns different coordinate objects based on the system specified:

#### CoordinateMGRS

Returned when creating an MGRS coordinate. Contains the following properties:

- `gridCol: string` - The 100km grid square column letter
- `gridRow: string` - The 100km grid square row letter
- `precision: number` - The precision level of the coordinate
- `easting: number` - The easting value in meters
- `northing: number` - The northing value in meters
- `zoneLetter: string` - The UTM zone letter
- `zoneNumber: number` - The UTM zone number
- `tokens: () => TokensMGRS` - A function that returns the coordinate's underlying token object

#### CoordinateUTM

Returned when creating a UTM coordinate. Contains the following properties:

- `hemisphere: 'N' | 'S'` - The hemisphere (North or South)
- `easting: number` - The easting value in meters
- `northing: number` - The northing value in meters
- `zoneLetter: string` - The UTM zone letter
- `zoneNumber: number` - The UTM zone number
- `precision: number` - The precision level of the coordinate
- `tokens: () => TokensUTM` - A function that returns the coordinate's underlying token object

#### CoordinateWGS

Returned when creating a WGS84 coordinate. Contains the following properties:

- `lat: number` - The latitude in decimal degrees
- `lon: number` - The longitude in decimal degrees
- `tokens: (options?: OptionsWGS) => object` - A function that returns the coordinate values in various formats (see below)

### Available Methods

All coordinate objects include conversion methods, a `toString` method, and a `tokens` function:

#### tokens()

The `tokens()` function provides access to the underlying coordinate data. It accepts optional format parameters for WGS84 coordinates.

##### MGRS and UTM tokens

For MGRS and UTM coordinates, `tokens()` returns the underlying token object containing all the coordinate properties:

```typescript
const mgrs = createCoordinate('mgrs', '31UEQ4825211932');
const mgrsTokens = mgrs.tokens();
console.log(mgrsTokens);
// {
//   zoneNumber: 31,
//   zoneLetter: 'U',
//   gridCol: 'E',
//   gridRow: 'Q',
//   easting: 48252,
//   northing: 11932,
//   precision: 5
// }

const utm = createCoordinate('utm', '18N 323068 4606559');
const utmTokens = utm.tokens();
console.log(utmTokens);
// {
//   zoneNumber: 18,
//   zoneLetter: 'N',
//   hemisphere: 'N',
//   easting: 323068,
//   northing: 4606559,
//   precision: 1
// }
```

##### WGS84 tokens

For WGS84 coordinates, `tokens()` accepts format options and returns the coordinate values in different representations:

```typescript
const coord = createCoordinate('wgs', '42.3601, -71.0589');

// Get as decimal degrees (default)
const dd = coord.tokens();
console.log(dd); // { lat: 42.3601, lon: -71.0589 }

// Get as degrees decimal minutes
const ddm = coord.tokens({ format: 'ddm' });
console.log(ddm); // { lat: [42, 21.606], lon: [-71, 3.534] }

// Get as degrees minutes seconds
const dms = coord.tokens({ format: 'dms' });
console.log(dms); // { lat: [42, 21, 36.36], lon: [-71, 3, 32.04] }
```

**WGS84 Token Format Options:**
- **`'dd'`** (Decimal Degrees) - Default. Returns `{ lat: number, lon: number }`
- **`'ddm'`** (Degrees Decimal Minutes) - Returns `{ lat: [degrees, minutes], lon: [degrees, minutes] }`
- **`'dms'`** (Degrees Minutes Seconds) - Returns `{ lat: [degrees, minutes, seconds], lon: [degrees, minutes, seconds] }`

The `tokens()` function is useful when you need programmatic access to the coordinate components for calculations or custom formatting, as opposed to `toString()` which returns a formatted string.

#### toString()

Outputs the coordinate in its canonical format for the system. This is the standard way to get a string representation.

```typescript
const mgrs = createCoordinate('mgrs', '18SUJ2306806559');
console.log(mgrs.toString()); // "18SUJ2306806559"

const utm = createCoordinate('utm', '18N 323068 4606559');
console.log(utm.toString()); // "18N 323068 4606559"

const wgs = createCoordinate('wgs', '42.3601, -71.0589');
console.log(wgs.toString()); // "42.3601, -71.0589"
```

##### WGS84 Format Options

For WGS84 coordinates, `toString()` accepts an options object to control both the coordinate order and output format:

```typescript
const coord = createCoordinate('wgs', '42.3601, -71.0589');

// Decimal Degrees (DD) - default format
console.log(coord.toString()); // "42.3601, -71.0589"
console.log(coord.toString({ format: 'dd' })); // "42.3601, -71.0589"

// Degrees Decimal Minutes (DDM)
console.log(coord.toString({ format: 'ddm' })); // "42° 21.606', -71° 3.534'"

// Degrees Minutes Seconds (DMS)
console.log(coord.toString({ format: 'dms' })); // "42° 21' 36.36\", -71° 3' 32.04\""

// Combine format with order
console.log(coord.toString({ format: 'dms', order: 'lonlat' }));
// "-71° 3' 32.04\", 42° 21' 36.36\""

// Use compass directions (N/S/E/W) instead of negative values
console.log(coord.toString({ compass: true }));
// "42.3601°N, 71.0589°W"

// Combine compass with other formats
console.log(coord.toString({ format: 'dms', compass: true }));
// "42° 21' 36.36\"N, 71° 3' 32.04\"W"

console.log(coord.toString({ format: 'ddm', compass: true, order: 'lonlat' }));
// "71° 3.534'W, 42° 21.606'N"
```

**Format Details:**
- **`'dd'`** (Decimal Degrees) - Default. Full precision decimal values
- **`'ddm'`** (Degrees Decimal Minutes) - Degrees and minutes with 3 decimal places
- **`'dms'`** (Degrees Minutes Seconds) - Degrees, minutes, and seconds with 2 decimal places

**Options:**
- **`format`** - Coordinate format: `'dd'`, `'ddm'`, or `'dms'`
- **`compass`** - When `true`, uses compass directions (N/S/E/W) instead of negative values
- **`order`** - Coordinate order: `'latlon'` (default) or `'lonlat'`

**Note:** If you need completely custom formatting, you can access the individual `lat` and `lon` properties directly and format them as needed.

#### Conversion Methods

Each coordinate type provides methods to convert to other coordinate systems:

##### CoordinateMGRS methods:
- `toUTM(): CoordinateUTM` - Convert to UTM
- `toWGS(order?: 'latlon' | 'lonlat'): CoordinateWGS` - Convert to WGS84

##### CoordinateUTM methods:
- `toMGRS(): CoordinateMGRS` - Convert to MGRS
- `toWGS(order?: 'latlon' | 'lonlat'): CoordinateWGS` - Convert to WGS84

##### CoordinateWGS methods:
- `toMGRS(): CoordinateMGRS` - Convert to MGRS
- `toUTM(): CoordinateUTM` - Convert to UTM

### Examples

```typescript
// Create and convert between systems
const mgrs = createCoordinate('mgrs', '18SUJ2306806559');
const utm = mgrs.toUTM();
const wgs = mgrs.toWGS();

console.log(utm.toString()); // "18N 323068 4606559"
console.log(wgs.toString()); // "42.3601, -71.0589"

// Access individual properties for custom formatting
console.log(`Lat: ${wgs.lat}°, Lon: ${wgs.lon}°`);
console.log(`Zone ${utm.zoneNumber}${utm.zoneLetter}, E: ${utm.easting}, N: ${utm.northing}`);
console.log(`MGRS Grid: ${mgrs.zoneNumber}${mgrs.zoneLetter}${mgrs.gridCol}${mgrs.gridRow}`);

// Specify coordinate order for WGS84
const wgsLonLat = createCoordinate('wgs', '-71.0589, 42.3601', { order: 'lonlat' });
console.log(wgsLonLat.toString()); // "-71.0589, 42.3601"

// Using coordinate order aliases for clarity
const latlon = createCoordinate('latlon', '42.3601, -71.0589');
const lonlat = createCoordinate('lonlat', '-71.0589, 42.3601');

console.log(latlon.toString()); // "42.3601, -71.0589"
console.log(lonlat.toString()); // "-71.0589, 42.3601"

// Aliases automatically set the order for toString
console.log(latlon.lat, latlon.lon); // 42.3601 -71.0589
console.log(lonlat.lat, lonlat.lon); // 42.3601 -71.0589 (same values, different input order)

// You can still override toString order if needed
console.log(lonlat.toString({ order: 'latlon' })); // "42.3601, -71.0589"

// WGS84 formatting options
const coord = createCoordinate('wgs', '42.3601, -71.0589');

// Default: Decimal Degrees (DD)
console.log(coord.toString()); // "42.3601, -71.0589"

// Degrees Decimal Minutes (DDM)
console.log(coord.toString({ format: 'ddm' })); // "42° 21.606', -71° 3.534'"

// Degrees Minutes Seconds (DMS)
console.log(coord.toString({ format: 'dms' })); // "42° 21' 36.36\", -71° 3' 32.04\""

// Combine format with order
console.log(coord.toString({ format: 'dms', order: 'lonlat' }));
// "-71° 3' 32.04\", 42° 21' 36.36\""

// Use compass directions instead of negative values
console.log(coord.toString({ compass: true }));
// "42.3601°N, 71.0589°W"

// Combine compass with different formats
console.log(coord.toString({ format: 'dms', compass: true }));
// "42° 21' 36.36\"N, 71° 3' 32.04\"W"

console.log(coord.toString({ format: 'ddm', compass: true, order: 'lonlat' }));
// "71° 3.534'W, 42° 21.606'N"

// Access coordinate tokens programmatically
const mgrs = createCoordinate('mgrs', '31UEQ4825211932');
console.log(mgrs.tokens());
// { zoneNumber: 31, zoneLetter: 'U', gridCol: 'E', gridRow: 'Q', ... }

const utm = createCoordinate('utm', '18N 323068 4606559');
console.log(utm.tokens());
// { zoneNumber: 18, hemisphere: 'N', easting: 323068, northing: 4606559, ... }

const wgs = createCoordinate('wgs', '42.3601, -71.0589');
console.log(wgs.tokens()); // { lat: 42.3601, lon: -71.0589 }
console.log(wgs.tokens({ format: 'ddm' })); // { lat: [42, 21.606], lon: [-71, 3.534] }
console.log(wgs.tokens({ format: 'dms' })); // { lat: [42, 21, 36.36], lon: [-71, 3, 32.04] }
```
