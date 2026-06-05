---
title: Distance Unit Constants
description: SI-compliant distance unit symbols and Turf.js-compatible unit mappings
source: packages/constants/src/units/index.ts
source_sha: 2eb2aeec378a8df693295660d015c4968dd924a5
doc_sha: 58c216d536fc0d2fa5d840a617b213553bbf9b61
deprecated: false
updated: 2026-05-28
---

# Distance Unit Constants

SI-compliant display symbols for distance units and bidirectional mappings between Turf.js unit names and their display symbols.

## Usage

```typescript
import { 
  DISTANCE_UNIT_SYMBOLS, 
  DISTANCE_UNIT_BY_SYMBOL 
} from '@accelint/constants';

// Display unit symbols in UI
const label = `Distance: 42 ${DISTANCE_UNIT_SYMBOLS.kilometers}`; // 'Distance: 42 km'

// Parse user input
const userInput = 'NM'; // From dropdown
const turfUnit = DISTANCE_UNIT_BY_SYMBOL[userInput]; // 'nauticalmiles'
```

## Reference

### DISTANCE_UNIT_SYMBOLS

```typescript
const DISTANCE_UNIT_SYMBOLS: {
  readonly kilometers: 'km';
  readonly meters: 'm';
  readonly nauticalmiles: 'NM';
  readonly miles: 'mi';
  readonly feet: 'ft';
}

type DistanceUnit = keyof typeof DISTANCE_UNIT_SYMBOLS;
type DistanceUnitSymbol = typeof DISTANCE_UNIT_SYMBOLS[DistanceUnit];
```

Maps human-readable unit names to their correct display symbols per the International System of Units (SI) and international standards.

**Available units:**

| Unit Name | Symbol | Standard |
|-----------|--------|----------|
| `kilometers` | `km` | SI (lowercase k for kilo prefix, lowercase m for meters) |
| `meters` | `m` | SI (lowercase m; uppercase M is the mega prefix) |
| `nauticalmiles` | `NM` | ICAO/IMO aviation/maritime convention |
| `miles` | `mi` | Conventional lowercase |
| `feet` | `ft` | Conventional lowercase |

> **Good to know:** The unit names match Turf.js distance calculation units, enabling direct usage in geospatial calculations.

### DISTANCE_UNIT_BY_SYMBOL

```typescript
const DISTANCE_UNIT_BY_SYMBOL: Record<DistanceUnitSymbol, DistanceUnit>
```

Reverse lookup map from display symbol to Turf.js unit name.

**Mappings:**
- `'km'` → `'kilometers'`
- `'m'` → `'meters'`
- `'NM'` → `'nauticalmiles'`
- `'mi'` → `'miles'`
- `'ft'` → `'feet'`

## Examples

### Example: Display distance with correct symbol

```typescript
import { DISTANCE_UNIT_SYMBOLS } from '@accelint/constants';

function formatDistance(value: number, unit: keyof typeof DISTANCE_UNIT_SYMBOLS): string {
  const symbol = DISTANCE_UNIT_SYMBOLS[unit];
  return `${value.toFixed(2)} ${symbol}`;
}

formatDistance(42.5, 'kilometers');      // '42.50 km'
formatDistance(1852, 'meters');          // '1852.00 m'
formatDistance(100, 'nauticalmiles');    // '100.00 NM'
```

### Example: Parse user-selected unit

```typescript
import { DISTANCE_UNIT_BY_SYMBOL } from '@accelint/constants';
import { distance } from '@turf/turf';

function calculateDistance(
  from: [number, number],
  to: [number, number],
  displayUnit: string
): number {
  // Convert display symbol to Turf.js unit
  const turfUnit = DISTANCE_UNIT_BY_SYMBOL[displayUnit as keyof typeof DISTANCE_UNIT_BY_SYMBOL];
  
  if (!turfUnit) {
    throw new Error(`Unsupported unit: ${displayUnit}`);
  }
  
  return distance(from, to, { units: turfUnit });
}

const dist = calculateDistance([0, 0], [1, 1], 'km'); // Uses 'kilometers' internally
```

### Example: Unit selector dropdown

```typescript
import { DISTANCE_UNIT_SYMBOLS } from '@accelint/constants';

const unitOptions = Object.entries(DISTANCE_UNIT_SYMBOLS).map(([name, symbol]) => ({
  label: `${name} (${symbol})`,
  value: symbol,
}));

// Renders as:
// [
//   { label: 'kilometers (km)', value: 'km' },
//   { label: 'meters (m)', value: 'm' },
//   { label: 'nauticalmiles (NM)', value: 'NM' },
//   { label: 'miles (mi)', value: 'mi' },
//   { label: 'feet (ft)', value: 'ft' },
// ]
```

### Example: Validate user input

```typescript
import { DISTANCE_UNIT_BY_SYMBOL, DISTANCE_UNIT_SYMBOLS } from '@accelint/constants';

function isValidDistanceUnit(input: string): boolean {
  return input in DISTANCE_UNIT_BY_SYMBOL;
}

function normalizeUnit(input: string): string {
  // Accept both unit names and symbols
  if (input in DISTANCE_UNIT_SYMBOLS) {
    return DISTANCE_UNIT_SYMBOLS[input as keyof typeof DISTANCE_UNIT_SYMBOLS];
  }
  if (input in DISTANCE_UNIT_BY_SYMBOL) {
    return input;
  }
  throw new Error(`Invalid distance unit: ${input}`);
}

normalizeUnit('kilometers');  // 'km'
normalizeUnit('km');          // 'km'
normalizeUnit('NM');          // 'NM'
normalizeUnit('KM');          // Error: Invalid distance unit: KM
```

### Example: Convert between units

```typescript
import { DISTANCE_UNIT_SYMBOLS, DISTANCE_UNIT_BY_SYMBOL } from '@accelint/constants';
import { convertLength } from '@turf/turf';

function convertDistance(
  value: number,
  fromSymbol: string,
  toSymbol: string
): number {
  const fromUnit = DISTANCE_UNIT_BY_SYMBOL[fromSymbol as keyof typeof DISTANCE_UNIT_BY_SYMBOL];
  const toUnit = DISTANCE_UNIT_BY_SYMBOL[toSymbol as keyof typeof DISTANCE_UNIT_BY_SYMBOL];
  
  if (!fromUnit || !toUnit) {
    throw new Error('Invalid unit symbol');
  }
  
  return convertLength(value, fromUnit, toUnit);
}

convertDistance(1, 'km', 'm');   // 1000
convertDistance(1, 'NM', 'km');  // 1.852
convertDistance(5280, 'ft', 'mi'); // 1
```

### Example: Type-safe unit handling

```typescript
import type { DistanceUnit, DistanceUnitSymbol } from '@accelint/constants';
import { DISTANCE_UNIT_SYMBOLS } from '@accelint/constants';

interface DistanceConfig {
  value: number;
  unit: DistanceUnit;
}

function getDisplayString(config: DistanceConfig): string {
  const symbol: DistanceUnitSymbol = DISTANCE_UNIT_SYMBOLS[config.unit];
  return `${config.value} ${symbol}`;
}

const config: DistanceConfig = {
  value: 100,
  unit: 'kilometers',
};

getDisplayString(config); // '100 km'
```

### Example: Aviation distance display

```typescript
import { DISTANCE_UNIT_SYMBOLS } from '@accelint/constants';

function formatAviationDistance(nauticalMiles: number): string {
  const symbol = DISTANCE_UNIT_SYMBOLS.nauticalmiles;
  return `${nauticalMiles.toFixed(1)} ${symbol}`;
}

formatAviationDistance(250.5);  // '250.5 NM'
```

## Related

<!-- Auto-generated from imports -->
<!-- Add manual links below -->
- [Turf.js distance documentation](https://turfjs.org/docs/#distance)
- [International System of Units](https://en.wikipedia.org/wiki/International_System_of_Units)
