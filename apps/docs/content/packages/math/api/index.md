---
title: Math Utilities
description: Mathematical utility functions for clamping, rounding, and random number generation.
source: packages/math/src/index.ts
source_sha: 2fde7042d193f22ca9eb29527a4576100c1ae7c7
doc_sha: pending
deprecated: false
updated: 2026-05-28
---

# Math Utilities

Mathematical utility functions for clamping, rounding, and random number generation.

## Usage

```typescript
import { clamp, round, random, randomInt } from '@accelint/math';

// Clamp values within bounds
const clamped = clamp(0, 100, 150); // 100

// Round to precision
const rounded = round(2, 3.14159); // 3.14

// Generate random numbers
const float = random(0, 1); // 0.742...
const integer = randomInt(1, 10); // 7
```

---

## clamp

Clamps a number within the specified bounds.

### Usage

```typescript
import { clamp } from '@accelint/math';

const value = clamp(5, 15, 10); // 10
const tooLow = clamp(5, 15, 2); // 5
const tooHigh = clamp(5, 15, 20); // 15
```

### Reference

```typescript
function clamp(min: number, max: number, value: number): number
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `min` | `number` | The lower bound to clamp to |
| `max` | `number` | The upper bound to clamp to |
| `value` | `number` | The number value to clamp to the given range |

#### Returns

Returns the clamped value. If `value` is less than `min`, returns `min`. If `value` is greater than `max`, returns `max`. Otherwise returns `value`.

#### Throws

Throws `RangeError` if `min > max`.

### Examples

#### Example: Clamping user input

```typescript
import { clamp } from '@accelint/math';

function setVolume(level: number): void {
  // Ensure volume is between 0 and 100
  const safeLevel = clamp(0, 100, level);
  console.log(`Volume set to: ${safeLevel}`);
}

setVolume(150); // Volume set to: 100
setVolume(-10); // Volume set to: 0
setVolume(50); // Volume set to: 50
```

#### Example: Clamping coordinates

```typescript
import { clamp } from '@accelint/math';

interface Bounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

function constrainPosition(
  x: number,
  y: number,
  bounds: Bounds
): [number, number] {
  return [
    clamp(bounds.minX, bounds.maxX, x),
    clamp(bounds.minY, bounds.maxY, y),
  ];
}

const bounds = { minX: 0, maxX: 800, minY: 0, maxY: 600 };
constrainPosition(1000, -50, bounds); // [800, 0]
```

#### Example: Error handling

```typescript
import { clamp } from '@accelint/math';

try {
  clamp(15, 5, 10); // Invalid: min > max
} catch (error) {
  console.error(error.message); // "min exceeded max"
}
```

> **Good to know:** `clamp` throws a `RangeError` if `min` exceeds `max`. Always ensure your bounds are valid before calling.

---

## round

Rounds a number to a specified precision.

### Usage

```typescript
import { round } from '@accelint/math';

const value = round(1, 1.2345); // 1.2
const twoDecimals = round(2, 1.2345); // 1.23
const threeDecimals = round(3, 1.2345); // 1.235
```

### Reference

```typescript
function round(precision: number, value: number): number
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `precision` | `number` | The precision of the rounded output (must be an integer) |
| `value` | `number` | The value to round |

#### Returns

Returns the value rounded to the specified number of decimal places.

#### Throws

Throws `Error` if `precision` is not an integer.

### Examples

#### Example: Formatting currency

```typescript
import { round } from '@accelint/math';

function formatPrice(amount: number): string {
  const rounded = round(2, amount);
  return `$${rounded.toFixed(2)}`;
}

formatPrice(19.99567); // "$20.00"
formatPrice(5.4321); // "$5.43"
```

#### Example: Scientific calculations

```typescript
import { round } from '@accelint/math';

const pi = Math.PI; // 3.141592653589793

round(0, pi); // 3
round(2, pi); // 3.14
round(4, pi); // 3.1416
round(6, pi); // 3.141593
```

#### Example: Percentage display

```typescript
import { round } from '@accelint/math';

function calculatePercentage(part: number, total: number): number {
  const percentage = (part / total) * 100;
  return round(1, percentage);
}

calculatePercentage(47, 150); // 31.3
calculatePercentage(2, 3); // 66.7
```

#### Example: Precision validation

```typescript
import { round } from '@accelint/math';

try {
  round(3.5, 1.2345); // Invalid: precision must be integer
} catch (error) {
  console.error(error.message); // "Precision must be an integer."
}

round(3, 1.2345); // 1.235 ✓ Valid
```

> **Good to know:** The `precision` parameter must be an integer. Fractional precision values will throw an error.

---

## random

Generates a random number within the given bounds.

### Usage

```typescript
import { random } from '@accelint/math';

const value = random(0, 10); // 7.284...
const negative = random(-5, 5); // -2.136...
```

### Reference

```typescript
function random(min: number, max: number): number
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `min` | `number` | The minimum value in the range (inclusive) |
| `max` | `number` | The maximum value in the range (inclusive) |

#### Returns

Returns a random floating-point number between `min` and `max` (inclusive).

#### Throws

Throws `RangeError` if `min > max`.

### Examples

#### Example: Random positioning

```typescript
import { random } from '@accelint/math';

function randomPosition(width: number, height: number) {
  return {
    x: random(0, width),
    y: random(0, height),
  };
}

const pos = randomPosition(800, 600);
// { x: 523.847..., y: 312.951... }
```

#### Example: Random animation delay

```typescript
import { random } from '@accelint/math';

function applyRandomDelay(element: HTMLElement): void {
  const delay = random(0, 1);
  element.style.animationDelay = `${delay}s`;
}
```

#### Example: Random color component

```typescript
import { random } from '@accelint/math';

function randomColor(): string {
  const r = Math.floor(random(0, 255));
  const g = Math.floor(random(0, 255));
  const b = Math.floor(random(0, 255));
  return `rgb(${r}, ${g}, ${b})`;
}

randomColor(); // "rgb(142, 67, 203)"
```

#### Example: Random range with negative numbers

```typescript
import { random } from '@accelint/math';

// Random temperature fluctuation
const fluctuation = random(-2.5, 2.5); // -1.347...
const baseTemp = 20;
const actualTemp = baseTemp + fluctuation; // 18.653...
```

> **Good to know:** `random` returns a floating-point number. For integer values, use `randomInt` instead.

---

## randomInt

Generates a random integer within the given bounds.

### Usage

```typescript
import { randomInt } from '@accelint/math';

const value = randomInt(0, 10); // 7
const diceRoll = randomInt(1, 6); // 4
```

### Reference

```typescript
function randomInt(min: number, max: number): number
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `min` | `number` | The minimum value in the range (inclusive) |
| `max` | `number` | The maximum value in the range (inclusive) |

#### Returns

Returns a random integer between `min` and `max` (inclusive). The returned value is always a whole number.

#### Throws

Throws `RangeError` if `min > max`.

### Examples

#### Example: Dice rolling

```typescript
import { randomInt } from '@accelint/math';

function rollDice(sides: number = 6): number {
  return randomInt(1, sides);
}

rollDice(); // 4 (standard six-sided die)
rollDice(20); // 17 (twenty-sided die)
```

#### Example: Random array element

```typescript
import { randomInt } from '@accelint/math';

function randomElement<T>(array: T[]): T {
  const index = randomInt(0, array.length - 1);
  return array[index];
}

const colors = ['red', 'green', 'blue', 'yellow'];
randomElement(colors); // "blue"
```

#### Example: Random ID generation

```typescript
import { randomInt } from '@accelint/math';

function generateId(length: number = 8): string {
  let id = '';
  for (let i = 0; i < length; i++) {
    id += randomInt(0, 9).toString();
  }
  return id;
}

generateId(); // "73824659"
generateId(4); // "2841"
```

#### Example: Random grid position

```typescript
import { randomInt } from '@accelint/math';

interface GridPosition {
  row: number;
  col: number;
}

function randomGridCell(rows: number, cols: number): GridPosition {
  return {
    row: randomInt(0, rows - 1),
    col: randomInt(0, cols - 1),
  };
}

randomGridCell(10, 10); // { row: 7, col: 3 }
```

#### Example: Random subset selection

```typescript
import { randomInt } from '@accelint/math';

function randomSubset<T>(array: T[], count: number): T[] {
  const result: T[] = [];
  const used = new Set<number>();
  
  while (result.length < count && result.length < array.length) {
    const index = randomInt(0, array.length - 1);
    if (!used.has(index)) {
      used.add(index);
      result.push(array[index]);
    }
  }
  
  return result;
}

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
randomSubset(numbers, 3); // [4, 7, 2]
```

> **Good to know:** `randomInt` always returns a whole number. The implementation uses `Math.ceil` and `Math.floor` internally to ensure proper integer bounds.

---

## Related

- [Math.random()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random) - MDN documentation for Math.random
- [Math.round()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round) - MDN documentation for Math.round
