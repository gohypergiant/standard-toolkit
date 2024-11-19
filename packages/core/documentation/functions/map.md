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

## Defined in

[array/map/index.ts:12](https://github.com/gohypergiant/standard-toolkit/blob/87ae5060c82d212b75a10cafb0030b08916e90f1/packages/core/src/array/map/index.ts#L12)
