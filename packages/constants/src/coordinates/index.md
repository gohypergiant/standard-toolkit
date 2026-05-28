---
title: DEFAULT_COORDINATE
description: Safe default coordinate value using NaN to avoid the "Null Island" problem
source: packages/constants/src/coordinates/index.ts
source_sha: baa1663be9d9bdbd5724b463df1021593f219c76
doc_sha: abf269842093bddb005298c5de98d07b68a8f270
deprecated: false
updated: 2026-05-28
---

# DEFAULT_COORDINATE

Safe default coordinate value using `[NaN, NaN]` to avoid unintentionally placing geographic data at "Null Island" (`[0, 0]`).

## Usage

```typescript
import { DEFAULT_COORDINATE } from '@accelint/constants';

// Initialize coordinate state safely
const [position, setPosition] = useState(DEFAULT_COORDINATE);

// Check for uninitialized coordinates
if (Number.isNaN(position[0]) || Number.isNaN(position[1])) {
  console.log('Position not set');
}
```

## Reference

```typescript
const DEFAULT_COORDINATE: readonly [number, number]
```

A constant array `[NaN, NaN]` representing an uninitialized or invalid coordinate.

**Why not `[0, 0]`?**

The coordinate `[0, 0]` is a real location in the Atlantic Ocean (Gulf of Guinea), colloquially known as "Null Island." Using `[0, 0]` as a default can lead to data quality issues where uninitialized coordinates are mistaken for valid data points at this location.

Using `[NaN, NaN]` makes uninitialized coordinates explicitly invalid and detectable via `Number.isNaN()`, preventing accidental mapping or calculations with placeholder values.

> **Good to know:** Always validate coordinates before passing them to mapping libraries or distance calculations, as many functions will not handle `NaN` values gracefully.

## Examples

### Example: Safe coordinate initialization

```typescript
import { DEFAULT_COORDINATE } from '@accelint/constants';

interface Location {
  name: string;
  coordinate: [number, number];
}

// Initialize with safe default
const location: Location = {
  name: 'Unknown',
  coordinate: DEFAULT_COORDINATE,
};

// Later, update with real coordinates
location.coordinate = [40.7128, -74.0060]; // New York City
```

### Example: Validating coordinates

```typescript
import { DEFAULT_COORDINATE } from '@accelint/constants';

function isValidCoordinate(coord: [number, number]): boolean {
  return !Number.isNaN(coord[0]) && !Number.isNaN(coord[1]);
}

const userLocation = getUserLocation(); // Returns [number, number] or DEFAULT_COORDINATE

if (isValidCoordinate(userLocation)) {
  showMarkerOnMap(userLocation);
} else {
  showLocationPrompt();
}
```

### Example: Fallback for missing data

```typescript
import { DEFAULT_COORDINATE } from '@accelint/constants';

function parseCoordinateFromAPI(data: unknown): [number, number] {
  if (
    typeof data === 'object' &&
    data !== null &&
    'lat' in data &&
    'lng' in data &&
    typeof data.lat === 'number' &&
    typeof data.lng === 'number'
  ) {
    return [data.lat, data.lng];
  }
  return DEFAULT_COORDINATE;
}

const coord = parseCoordinateFromAPI(apiResponse);

if (isValidCoordinate(coord)) {
  calculateDistance(coord, targetCoord);
}
```

### Example: Filtering invalid coordinates

```typescript
import { DEFAULT_COORDINATE } from '@accelint/constants';

const locations: Array<{ name: string; coordinate: [number, number] }> = [
  { name: 'New York', coordinate: [40.7128, -74.0060] },
  { name: 'Unknown', coordinate: DEFAULT_COORDINATE },
  { name: 'London', coordinate: [51.5074, -0.1278] },
];

// Filter out uninitialized locations
const validLocations = locations.filter((loc) =>
  !Number.isNaN(loc.coordinate[0]) && !Number.isNaN(loc.coordinate[1])
);

console.log(validLocations.length); // 2
```

### Example: Type guard for valid coordinates

```typescript
import { DEFAULT_COORDINATE } from '@accelint/constants';

type ValidCoordinate = readonly [number, number] & { _brand: 'ValidCoordinate' };

function assertValidCoordinate(
  coord: readonly [number, number]
): asserts coord is ValidCoordinate {
  if (Number.isNaN(coord[0]) || Number.isNaN(coord[1])) {
    throw new Error('Invalid coordinate: contains NaN values');
  }
}

function calculateBounds(coordinates: ValidCoordinate[]): BoundingBox {
  // Guaranteed to have valid coordinates here
  // ...
}

const coord = getUserLocation();
try {
  assertValidCoordinate(coord);
  calculateBounds([coord]);
} catch (error) {
  console.error('Cannot calculate bounds for uninitialized coordinate');
}
```

## Related

<!-- Auto-generated from imports -->
<!-- Add manual links below -->
