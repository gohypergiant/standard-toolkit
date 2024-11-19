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

## Defined in

[array/slice/index.ts:10](https://github.com/gohypergiant/standard-toolkit/blob/87ae5060c82d212b75a10cafb0030b08916e90f1/packages/core/src/array/slice/index.ts#L10)
