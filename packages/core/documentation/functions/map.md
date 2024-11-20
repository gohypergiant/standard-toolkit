[**@accelint/core**](../README.md) • **Docs**

***

[@accelint/core](../README.md) / map

# Function: map()

> **map**\<`T`, `R`\>(`map`): (`arr`) => `R`[]

Maps over the given array, calling the mapping function for each element.
Returns a new array of the results.

## Type Parameters

• **T**

• **R**

## Parameters

• **map**: [`MapFn`](../type-aliases/MapFn.md)\<`T`, `R`\>

## Returns

`Function`

### Parameters

• **arr**: `T`[]

### Returns

`R`[]

## Example

```ts
map(x => x * 2)([1, 2, 3, 4, 5]);
// [2, 4, 6, 8, 10]
```
