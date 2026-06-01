---
title: DEFAULT_COORDINATE
description: Default empty coordinate value using NaN to avoid the "Null Island" problem.
source: packages/constants/src/coordinates/index.ts
source_sha: baa1663be9d9bdbd5724b463df1021593f219c76
doc_sha: pending
deprecated: false
updated: 2026-05-28
---

# DEFAULT_COORDINATE

Default empty coordinate value using NaN to avoid the "Null Island" problem.

## Usage

```typescript
import { DEFAULT_COORDINATE } from '@accelint/constants';

// Use as default for optional coordinates
const userLocation = user.coordinates || DEFAULT_COORDINATE;

// Check if coordinate is unset
function isUnsetCoordinate(coord: number[]): boolean {
  return Number.isNaN(coord[0]) && Number.isNaN(coord[1]);
}
```

## Reference

```typescript
const DEFAULT_COORDINATE: [number, number]
```

Value: `[Number.NaN, Number.NaN]`

Represents an unset or invalid coordinate pair. Using `[0, 0]` as a default is incorrect because it represents a real location: "Null Island" in the Gulf of Guinea off the west coast of Africa (0°N 0°E).

`DEFAULT_COORDINATE` uses `NaN` (Not-a-Number) to clearly indicate the absence of a valid coordinate without accidentally pointing to a real geographic location.

## Examples

### Example: Initializing map state

```typescript
import { DEFAULT_COORDINATE } from '@accelint/constants';

interface MapState {
  center: [number, number];
  zoom: number;
}

const initialMapState: MapState = {
  center: DEFAULT_COORDINATE,
  zoom: 10,
};

// Later, check if map needs to be centered
if (Number.isNaN(initialMapState.center[0])) {
  console.log('Map center not yet set');
}
```

### Example: User profile with optional location

```typescript
import { DEFAULT_COORDINATE } from '@accelint/constants';

interface UserProfile {
  id: string;
  name: string;
  coordinates: [number, number];
}

function createUserProfile(id: string, name: string): UserProfile {
  return {
    id,
    name,
    coordinates: DEFAULT_COORDINATE, // Unset until user shares location
  };
}

function hasLocation(user: UserProfile): boolean {
  return !Number.isNaN(user.coordinates[0]);
}
```

### Example: Validating coordinate data

```typescript
import { DEFAULT_COORDINATE } from '@accelint/constants';

function isValidCoordinate(coord: [number, number]): boolean {
  const [lon, lat] = coord;
  
  // Check if coordinate is the default (unset)
  if (Number.isNaN(lon) || Number.isNaN(lat)) {
    return false;
  }
  
  // Check if coordinate is within valid ranges
  return lon >= -180 && lon <= 180 && lat >= -90 && lat <= 90;
}

isValidCoordinate(DEFAULT_COORDINATE); // false
isValidCoordinate([0, 0]); // true (valid, but "Null Island")
isValidCoordinate([-122.4194, 37.7749]); // true (San Francisco)
```

### Example: Fallback for missing data

```typescript
import { DEFAULT_COORDINATE } from '@accelint/constants';

interface LocationData {
  name: string;
  coordinates?: [number, number];
}

function getCoordinates(location: LocationData): [number, number] {
  return location.coordinates || DEFAULT_COORDINATE;
}

const unknownLocation = { name: 'Unknown' };
const coords = getCoordinates(unknownLocation);
// coords = [NaN, NaN]
```

### Example: Database initialization

```typescript
import { DEFAULT_COORDINATE } from '@accelint/constants';

interface Place {
  id: number;
  name: string;
  coordinates: [number, number];
  verified: boolean;
}

const newPlace: Place = {
  id: 1,
  name: 'Pending Verification',
  coordinates: DEFAULT_COORDINATE,
  verified: false,
};

// Before displaying on map, check if coordinate is set
function canDisplayOnMap(place: Place): boolean {
  const [lon, lat] = place.coordinates;
  return !Number.isNaN(lon) && !Number.isNaN(lat);
}
```

### Example: Coordinate comparison

```typescript
import { DEFAULT_COORDINATE } from '@accelint/constants';

function coordinatesEqual(
  a: [number, number],
  b: [number, number]
): boolean {
  // Handle NaN specially (NaN !== NaN in JavaScript)
  if (Number.isNaN(a[0]) && Number.isNaN(b[0])) {
    return Number.isNaN(a[1]) && Number.isNaN(b[1]);
  }
  
  return a[0] === b[0] && a[1] === b[1];
}

coordinatesEqual(DEFAULT_COORDINATE, [Number.NaN, Number.NaN]); // true
coordinatesEqual(DEFAULT_COORDINATE, [0, 0]); // false
```

> **Good to know:** When checking if a coordinate is the default, use `Number.isNaN()` rather than direct equality comparison. In JavaScript, `NaN !== NaN`, so `coord === DEFAULT_COORDINATE` will always be false.

## Related

- [Null Island](https://en.wikipedia.org/wiki/Null_Island) - Wikipedia article on 0°N 0°E
- [Number.isNaN()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN) - MDN documentation
- [GeoJSON specification](https://datatracker.ietf.org/doc/html/rfc7946) - Coordinate format standard
