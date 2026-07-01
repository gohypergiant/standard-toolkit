---
title: clamp
description: Clamps a number within the specified bounds
source: packages/math/src/clamp/index.ts
source_sha: af9d41f2cbd80d93eaf752583b987219960c4daa
doc_sha: faea60c716c7cee3d6a9e5ab7eb2458ba0e499ff
deprecated: false
updated: 2026-05-28
---

# clamp

Clamps a number within the specified bounds.

## Usage

```typescript
import { clamp } from '@accelint/math';

const result = clamp(5, 15, 10);
// 10

const belowMin = clamp(5, 15, 2);
// 5

const aboveMax = clamp(5, 15, 20);
// 15
```

## Reference

```typescript
function clamp(min: number, max: number, value: number): number
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `min` | `number` | The lower bound to clamp to. |
| `max` | `number` | The upper bound to clamp to. |
| `value` | `number` | The number value to clamp to the given range. |

### Returns

Returns the clamped value. If `value` is below `min`, returns `min`. If `value` is above `max`, returns `max`. Otherwise returns `value`.

### Throws

- `RangeError` - Throws if `min > max`.

## Examples

### Example: Clamping below minimum

```typescript
import { clamp } from '@accelint/math';

const result = clamp(1, 2, 0);
// 1
```

### Example: Clamping above maximum

```typescript
import { clamp } from '@accelint/math';

const result = clamp(1, 2, 3);
// 2
```

### Example: Value within range

```typescript
import { clamp } from '@accelint/math';

const result = clamp(1, 3, 2);
// 2
```

> **Good to know:** The function validates that `min` does not exceed `max` and throws a `RangeError` if this constraint is violated.

## Related

- [round](../round/index.md) - Rounds a number to specified precision
