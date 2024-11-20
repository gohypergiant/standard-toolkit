[**@accelint/core**](../README.md) • **Docs**

***

[@accelint/core](../README.md) / slice

# Function: slice()

> **slice**(`start`): (`end`) => \<`T`\>(`arr`) => `T`[]

Returns a new array containing elements between `start` and `end` (exclusive)
from the original array.

## Parameters

• **start**: `number`

## Returns

`Function`

### Parameters

• **end**: `number`

### Returns

`Function`

#### Type Parameters

• **T**

#### Parameters

• **arr**: `T`[]

#### Returns

`T`[]

## Example

```ts
slice(0)(4)([1, 2, 3, 4, 5, 6]);
// [1, 2, 3, 4]
```
