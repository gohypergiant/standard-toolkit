---
title: round
description: Rounds a number to a specified precision
source: packages/math/src/round/index.ts
source_sha: c5f26f19f5ca2227af188e1bd1eaa23060f6e38e
doc_sha: 320814ad8e72c60399e78426d686ba104833306d
deprecated: false
updated: 2026-05-28
---

# round

Rounds a number to a specified precision.

## Usage

```typescript
import { round } from '@accelint/math';

const result = round(1, 1.2345);
// 1.2

const result = round(2, 1.2345);
// 1.23

const result = round(3, 1.2345);
// 1.235
```

## Reference

```typescript
function round(precision: number, value: number): number
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `precision` | `number` | The precision of the rounded output. Must be an integer. Positive values round to decimal places; negative values round to positions left of the decimal point. |
| `value` | `number` | The value to round. |

### Returns

Returns the rounded value.

### Throws

- `Error` - Throws if `precision` is not an integer.

## Examples

### Example: Positive precision (decimal places)

```typescript
import { round } from '@accelint/math';

const value = 1.2345;

round(1, value); // 1.2
round(2, value); // 1.23
round(3, value); // 1.235
round(4, value); // 1.2345
```

### Example: Zero precision (round to integer)

```typescript
import { round } from '@accelint/math';

const result = round(0, 1.2345);
// 1
```

### Example: Negative precision (round left of decimal)

```typescript
import { round } from '@accelint/math';

const value = 12345.6789;

round(-1, value); // 12350
round(-2, value); // 12300
round(-3, value); // 12000
round(-4, value); // 10000
```

> **Good to know:** Precision must be an integer. Positive values round to decimal places (e.g., `1` = tenths, `2` = hundredths). Negative values round to positions left of the decimal point (e.g., `-1` = tens, `-2` = hundreds).

## Related

- [clamp](../clamp/index.md) - Clamps a number within specified bounds
