---
title: Distance Unit Constants
description: SI-compliant distance unit symbols and mappings for use with Turf.js and geographic calculations.
source: packages/constants/src/units/index.ts
source_sha: 2eb2aeec378a8df693295660d015c4968dd924a5
doc_sha: pending
deprecated: false
updated: 2026-05-28
---

# Distance Unit Constants

SI-compliant distance unit symbols and mappings for use with Turf.js and geographic calculations.

## Usage

```typescript
import {
  DISTANCE_UNIT_SYMBOLS,
  DISTANCE_UNIT_BY_SYMBOL,
} from '@accelint/constants';

// Display symbol for a unit
const kmSymbol = DISTANCE_UNIT_SYMBOLS.kilometers; // 'km'
console.log(`Distance: 42 ${kmSymbol}`); // "Distance: 42 km"

// Convert symbol back to unit name
const unit = DISTANCE_UNIT_BY_SYMBOL['km']; // 'kilometers'
```

---

## DISTANCE_UNIT_SYMBOLS

SI-compliant display symbols for distance units.

### Usage

```typescript
import { DISTANCE_UNIT_SYMBOLS } from '@accelint/constants';

const label = `${distance} ${DISTANCE_UNIT_SYMBOLS.kilometers}`;
// "42 km"
```

### Reference

```typescript
const DISTANCE_UNIT_SYMBOLS: {
  readonly kilometers: 'km';
  readonly meters: 'm';
  readonly nauticalmiles: 'NM';
  readonly miles: 'mi';
  readonly feet: 'ft';
}
```

Maps human-readable unit names to their correct display symbols per the International System of Units (SI) and international standards.

### Available Units

| Unit Name | Symbol | Standard |
|-----------|--------|----------|
| `kilometers` | `'km'` | SI (lowercase k for kilo, lowercase m for meters) |
| `meters` | `'m'` | SI (lowercase m, uppercase M is mega prefix) |
| `nauticalmiles` | `'NM'` | ICAO/IMO aviation/maritime convention |
| `miles` | `'mi'` | Conventional lowercase |
| `feet` | `'ft'` | Conventional lowercase |

### Examples

#### Example: Formatting distance display

```typescript
import { DISTANCE_UNIT_SYMBOLS } from '@accelint/constants';
import type { DistanceUnit } from '@accelint/constants';

function formatDistance(value: number, unit: DistanceUnit): string {
  const symbol = DISTANCE_UNIT_SYMBOLS[unit];
  return `${value.toFixed(2)} ${symbol}`;
}

formatDistance(42.567, 'kilometers'); // "42.57 km"
formatDistance(1500, 'meters'); // "1500.00 m"
formatDistance(120, 'nauticalmiles'); // "120.00 NM"
```

#### Example: Map scale label

```typescript
import { DISTANCE_UNIT_SYMBOLS } from '@accelint/constants';
import type { DistanceUnit } from '@accelint/constants';

interface ScaleOptions {
  distance: number;
  unit: DistanceUnit;
}

function createScaleLabel(options: ScaleOptions): string {
  const { distance, unit } = options;
  const symbol = DISTANCE_UNIT_SYMBOLS[unit];
  return `Scale: 1:${distance} ${symbol}`;
}

createScaleLabel({ distance: 1000, unit: 'kilometers' });
// "Scale: 1:1000 km"
```

#### Example: Unit selector UI

```typescript
import { DISTANCE_UNIT_SYMBOLS } from '@accelint/constants';
import type { DistanceUnit } from '@accelint/constants';

function getUnitOptions(): Array<{ value: DistanceUnit; label: string }> {
  return Object.entries(DISTANCE_UNIT_SYMBOLS).map(([unit, symbol]) => ({
    value: unit as DistanceUnit,
    label: `${unit} (${symbol})`,
  }));
}

// Returns:
// [
//   { value: 'kilometers', label: 'kilometers (km)' },
//   { value: 'meters', label: 'meters (m)' },
//   { value: 'nauticalmiles', label: 'nauticalmiles (NM)' },
//   ...
// ]
```

#### Example: Aviation/maritime display

```typescript
import { DISTANCE_UNIT_SYMBOLS } from '@accelint/constants';

interface FlightInfo {
  distance: number;
  altitude: number;
}

function formatFlightInfo(info: FlightInfo): string {
  const distanceSymbol = DISTANCE_UNIT_SYMBOLS.nauticalmiles;
  const altitudeSymbol = DISTANCE_UNIT_SYMBOLS.feet;
  
  return `Distance: ${info.distance} ${distanceSymbol}, Altitude: ${info.altitude} ${altitudeSymbol}`;
}

formatFlightInfo({ distance: 2500, altitude: 35000 });
// "Distance: 2500 NM, Altitude: 35000 ft"
```

> **Good to know:** These symbols follow SI conventions where applicable. Note that "km" uses lowercase k (kilo prefix) and lowercase m (meters), not "KM". Uppercase K is for kelvin, and uppercase M is the mega prefix.

---

## DISTANCE_UNIT_BY_SYMBOL

Reverse lookup map from display symbol to Turf.js unit name.

### Usage

```typescript
import { DISTANCE_UNIT_BY_SYMBOL } from '@accelint/constants';

const unit = DISTANCE_UNIT_BY_SYMBOL['km']; // 'kilometers'
const nautical = DISTANCE_UNIT_BY_SYMBOL['NM']; // 'nauticalmiles'
```

### Reference

```typescript
const DISTANCE_UNIT_BY_SYMBOL: Record<DistanceUnitSymbol, DistanceUnit>
```

Provides reverse lookup from display symbols to Turf.js-compatible unit names.

### Mappings

| Symbol | Unit Name |
|--------|-----------|
| `'km'` | `'kilometers'` |
| `'m'` | `'meters'` |
| `'NM'` | `'nauticalmiles'` |
| `'mi'` | `'miles'` |
| `'ft'` | `'feet'` |

### Examples

#### Example: Parsing user input

```typescript
import { DISTANCE_UNIT_BY_SYMBOL } from '@accelint/constants';
import type { DistanceUnit } from '@accelint/constants';

function parseDistanceInput(input: string): {
  value: number;
  unit: DistanceUnit;
} | null {
  const match = input.match(/^([\d.]+)\s*([a-zA-Z]+)$/);
  if (!match) return null;
  
  const [, valueStr, symbol] = match;
  const unit = DISTANCE_UNIT_BY_SYMBOL[symbol as keyof typeof DISTANCE_UNIT_BY_SYMBOL];
  
  if (!unit) return null;
  
  return {
    value: parseFloat(valueStr),
    unit,
  };
}

parseDistanceInput('42 km'); // { value: 42, unit: 'kilometers' }
parseDistanceInput('1500 m'); // { value: 1500, unit: 'meters' }
parseDistanceInput('120 NM'); // { value: 120, unit: 'nauticalmiles' }
```

#### Example: Converting display format to API format

```typescript
import { DISTANCE_UNIT_BY_SYMBOL } from '@accelint/constants';
import type { DistanceUnit } from '@accelint/constants';

interface DisplayDistance {
  value: number;
  symbol: string;
}

interface ApiDistance {
  value: number;
  unit: DistanceUnit;
}

function toApiFormat(display: DisplayDistance): ApiDistance | null {
  const unit = DISTANCE_UNIT_BY_SYMBOL[display.symbol as keyof typeof DISTANCE_UNIT_BY_SYMBOL];
  
  if (!unit) {
    console.error(`Unknown unit symbol: ${display.symbol}`);
    return null;
  }
  
  return {
    value: display.value,
    unit,
  };
}

toApiFormat({ value: 50, symbol: 'km' });
// { value: 50, unit: 'kilometers' }
```

#### Example: Validating unit symbols

```typescript
import { DISTANCE_UNIT_BY_SYMBOL } from '@accelint/constants';

function isValidUnitSymbol(symbol: string): boolean {
  return symbol in DISTANCE_UNIT_BY_SYMBOL;
}

isValidUnitSymbol('km'); // true
isValidUnitSymbol('NM'); // true
isValidUnitSymbol('KM'); // false (incorrect casing)
isValidUnitSymbol('yards'); // false (not supported)
```

#### Example: Form field validation

```typescript
import { DISTANCE_UNIT_BY_SYMBOL } from '@accelint/constants';

function validateDistanceField(value: string, symbol: string): string | null {
  const numValue = parseFloat(value);
  
  if (isNaN(numValue) || numValue < 0) {
    return 'Distance must be a positive number';
  }
  
  if (!(symbol in DISTANCE_UNIT_BY_SYMBOL)) {
    return `Invalid unit symbol: ${symbol}. Use km, m, NM, mi, or ft`;
  }
  
  return null; // Valid
}

validateDistanceField('42', 'km'); // null (valid)
validateDistanceField('42', 'KM'); // 'Invalid unit symbol: KM...'
validateDistanceField('-10', 'km'); // 'Distance must be a positive number'
```

#### Example: Integration with Turf.js

```typescript
import { distance } from '@turf/distance';
import { DISTANCE_UNIT_BY_SYMBOL } from '@accelint/constants';

function calculateDistance(
  from: [number, number],
  to: [number, number],
  unitSymbol: string
): number | null {
  const unit = DISTANCE_UNIT_BY_SYMBOL[unitSymbol as keyof typeof DISTANCE_UNIT_BY_SYMBOL];
  
  if (!unit) {
    console.error(`Invalid unit symbol: ${unitSymbol}`);
    return null;
  }
  
  return distance(from, to, { units: unit });
}

calculateDistance([-122.4194, 37.7749], [-118.2437, 34.0522], 'km');
// ~559.12 (distance from SF to LA in kilometers)
```

> **Good to know:** This map is generated programmatically from `DISTANCE_UNIT_SYMBOLS`, ensuring consistency between forward and reverse lookups.

---

## Related

- [International System of Units](https://en.wikipedia.org/wiki/International_System_of_Units) - SI units specification
- [Turf.js](https://turfjs.org/) - Geospatial analysis library
- [ICAO Annex 5](https://en.wikipedia.org/wiki/ICAO_airport_code) - Aviation measurement standards
- [Nautical mile](https://en.wikipedia.org/wiki/Nautical_mile) - Maritime distance unit
