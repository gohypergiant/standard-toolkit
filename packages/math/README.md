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
import { clamp, random, randomInt, round } from '@accelint/math';

// Or import individually for tree-shaking
import { clamp } from '@accelint/math/clamp';
import { random, randomInt } from '@accelint/math/random';
import { round } from '@accelint/math/round';
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

## TypeScript Support

All functions are fully typed and written in TypeScript. Type definitions are included in the package.

## License

Apache-2.0
