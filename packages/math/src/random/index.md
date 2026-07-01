---
title: random & randomInt
description: Generate random numbers and integers within specified bounds
source: packages/math/src/random/index.ts
source_sha: 4db721b2f40ef197ee2668fc6433a84625a8788a
doc_sha: a6ec4e7670110a74b6d360758d42198d57e8c56b
deprecated: false
updated: 2026-05-28
---

# random & randomInt

Functions for generating random numbers and integers within specified bounds.

## random

Generate a random number within the given bounds.

### Usage

```typescript
import { random } from '@accelint/math';

const value = random(0, 10);
// value >= 0 && value <= 10
```

### Reference

```typescript
function random(min: number, max: number): number
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `min` | `number` | The minimum value in the range (inclusive). |
| `max` | `number` | The maximum value in the range (inclusive). |

#### Returns

Returns a random number between `min` and `max` (inclusive).

#### Throws

- `RangeError` - Throws if `min > max`.

### Examples

#### Example: Generating random decimal

```typescript
import { random } from '@accelint/math';

const value = random(0, 1);
// A decimal between 0 and 1 (inclusive)
```

#### Example: Negative range

```typescript
import { random } from '@accelint/math';

const value = random(-10, -5);
// A decimal between -10 and -5 (inclusive)
```

#### Example: Same min and max

```typescript
import { random } from '@accelint/math';

const value = random(5, 5);
// Approximately 5
```

> **Good to know:** Both bounds are inclusive. The function adds `Number.EPSILON` to ensure the maximum value can be generated.

---

## randomInt

Generate a random integer within the given bounds.

### Usage

```typescript
import { randomInt } from '@accelint/math';

const value = randomInt(0, 10);
// An integer: 0, 1, 2, ..., 9, or 10
```

### Reference

```typescript
function randomInt(min: number, max: number): number
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `min` | `number` | The minimum value in the range (inclusive). |
| `max` | `number` | The maximum value in the range (inclusive). |

#### Returns

Returns a random integer between `min` and `max` (inclusive).

#### Throws

- `RangeError` - Throws if `min > max`.

### Examples

#### Example: Generating dice roll

```typescript
import { randomInt } from '@accelint/math';

const roll = randomInt(1, 6);
// A whole number: 1, 2, 3, 4, 5, or 6
```

#### Example: Floating point boundaries

```typescript
import { randomInt } from '@accelint/math';

const value = randomInt(0.5, 10.5);
// Integer between Math.ceil(0.5) and Math.floor(10.5)
// Result: 1, 2, 3, ..., 9, or 10
```

#### Example: Same min and max

```typescript
import { randomInt } from '@accelint/math';

const value = randomInt(5, 5);
// Always returns 5
```

> **Good to know:** When given floating point boundaries, the function uses `Math.ceil` on `min` and `Math.floor` on `max` to ensure integer results.

## Related

- [clamp](../clamp/index.md) - Clamps a number within specified bounds
