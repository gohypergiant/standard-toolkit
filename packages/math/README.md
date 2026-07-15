# @accelint/math

A simple, lightweight JavaScript library that provides a collection of basic mathematical functions.

## Installation

```sh
npm install @accelint/math
```

## Usage

### Importing Functions

```typescript
// Import all functions
import { clamp, random, randomInt, round, wrap } from '@accelint/math';

// Or import individually for tree-shaking
import { clamp } from '@accelint/math/clamp';
import { random, randomInt } from '@accelint/math/random';
import { round } from '@accelint/math/round';
import { wrap } from '@accelint/math/wrap';
```

### Clamp

Clamps a number within the specified bounds.

```typescript
import { clamp } from '@accelint/math/clamp';

clamp(5, 15, 10);  // 10 (within bounds)
clamp(5, 15, 2);   // 5  (below min, clamped to min)
clamp(5, 15, 20);  // 15 (above max, clamped to max)
clamp(15, 5, 10);  // RangeError: min exceeded max
```

### Random

Generate a random number within the given bounds (inclusive).

```typescript
import { random } from '@accelint/math/random';

const value = random(0, 10);
// Returns a random decimal between 0 and 10 (inclusive)

random(10, 0);  // RangeError: Min exceeded max
```

### Random Integer

Generate a random integer within the given bounds (inclusive).

```typescript
import { randomInt } from '@accelint/math/random';

const value = randomInt(1, 6);
// Returns a random integer between 1 and 6 (like a dice roll)

randomInt(10, 0);  // RangeError: Min exceeded max
```

### Round

Rounds a number to a specified precision.

```typescript
import { round } from '@accelint/math/round';

round(1, 1.2345);    // 1.2   (1 decimal place)
round(2, 1.2345);    // 1.23  (2 decimal places)
round(3, 1.2345);    // 1.235 (3 decimal places)
round(0, 1.2345);    // 1     (no decimal places)
round(-1, 1234.5);   // 1230  (round to nearest 10)
round(3.1, 1.2345);  // Error: Precision must be an integer
```

### Wrap

Wraps a number into the half-open range `[min, max)`, cycling out-of-range values back around instead of clamping them to the edge. Handles negative and multi-revolution inputs — useful for angles and longitudes.

```typescript
import { wrap } from '@accelint/math/wrap';

wrap(0, 360, 370);     // 10   (past max, re-enters at min)
wrap(0, 360, -90);     // 270  (negative, wraps up into range)
wrap(-180, 180, 190);  // -170 (longitude past the antimeridian)
wrap(-180, 180, -180); // -180 (inclusive min bound)
wrap(0, 360, 720);     // 0    (multi-revolution)
wrap(360, 0, 10);      // RangeError: min must be less than max
```

## API Reference

### `clamp(min: number, max: number, value: number): number`

Clamps a number within the specified bounds.

**Parameters:**

- `min` - The lower bound to clamp to
- `max` - The upper bound to clamp to
- `value` - The number value to clamp to the given range

**Returns:** The clamped value

**Throws:** `RangeError` if min > max

### `random(min: number, max: number): number`

Generate a random number within the given bounds.

**Parameters:**

- `min` - The minimum value in the range (inclusive)
- `max` - The maximum value in the range (inclusive)

**Returns:** A random number between min and max (inclusive)

**Throws:** `RangeError` if min > max

### `randomInt(min: number, max: number): number`

Generate a random integer within the given bounds.

**Parameters:**

- `min` - The minimum value in the range (inclusive)
- `max` - The maximum value in the range (inclusive)

**Returns:** A random integer between min and max (inclusive)

**Throws:** `RangeError` if min > max

### `round(precision: number, value: number): number`

Rounds a number to a specified precision.

**Parameters:**

- `precision` - The precision of the rounded output (must be an integer)
- `value` - The value to round

**Returns:** The rounded value

**Throws:** `Error` if precision is not an integer

### `wrap(min: number, max: number, value: number): number`

Wraps a number into the half-open range `[min, max)`. Unlike `clamp`, which pins out-of-range values to the nearest bound, `wrap` treats the range as circular.

**Parameters:**

- `min` - The inclusive lower bound of the range
- `max` - The exclusive upper bound of the range
- `value` - The number value to wrap into the given range

**Returns:** The wrapped value in `[min, max)`

**Throws:** `RangeError` if min >= max

## TypeScript Support

All functions are fully typed and written in TypeScript. Type definitions are included in the package.

## License

Apache-2.0
