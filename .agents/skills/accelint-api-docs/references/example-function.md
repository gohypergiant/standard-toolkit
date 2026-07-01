# map

Maps over an array, calling the mapping function for each element and returning a new array of results.

## Usage

```typescript
import { map } from '@accelint/core';

// Basic usage
const doubled = map((x: number) => x * 2)([1, 2, 3, 4, 5]);
// [2, 4, 6, 8, 10]

// Partial application
const double = map((x: number) => x * 2);
double([1, 2, 3]); // [2, 4, 6]
```

## Reference

```typescript
function map<T, R>(
  mapFn: (element: T, index: number) => R
): (arr: T[]) => R[]
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `mapFn` | `(element: T, index: number) => R` | Function called for each element. Receives the element and its index. |

### Returns

Returns a curried function that accepts an array and returns a new array with transformed elements.

### Type Parameters

- `T` - The type of elements in the input array
- `R` - The return type of the mapping function (type of elements in output array)

## Examples

### Example: Transforming objects

```typescript
import { map } from '@accelint/core';

interface User {
  id: number;
  name: string;
}

const users: User[] = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
];

const names = map((user: User) => user.name)(users);
// ['Alice', 'Bob']
```

### Example: Using index parameter

```typescript
import { map } from '@accelint/core';

const addIndex = map((value: string, index: number) => `${index}: ${value}`);
addIndex(['a', 'b', 'c']);
// ['0: a', '1: b', '2: c']
```

### Example: Composing with other functions

```typescript
import { map, filter } from '@accelint/core';
import { pipe } from '@accelint/core';

const processNumbers = pipe(
  filter((x: number) => x > 0),
  map((x: number) => x * 2)
);

processNumbers([-1, 0, 1, 2, 3]);
// [2, 4, 6]
```

> **Good to know:** The mapping function is called for every element in the array. The original array is not modified—a new array is always returned.

## Related

- [filter](../filter/index.md) - Filter array elements by predicate
- [reduce](../reduce/index.md) - Reduce array to single value
- [pipe](../pipe/index.md) - Compose functions left-to-right
