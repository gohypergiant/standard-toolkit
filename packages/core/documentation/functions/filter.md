[**@accelint/core**](../README.md) • **Docs**

***

[@accelint/core](../README.md) / filter

# Function: filter()

> **filter**\<`T`\>(`predicate`): (`arr`) => `T`[]

Returns a copy of the given array of elements that satisfy the predicate.

## Type Parameters

• **T**

## Parameters

• **predicate**: [`Predicate`](../type-aliases/Predicate.md)\<`T`\>

## Returns

`Function`

### Parameters

• **arr**: `T`[]

### Returns

`T`[]

## Example

```ts
filter(x => !(x & 1))([1, 2, 3, 4, 5]);
// [2, 4]
```

## Defined in

[array/filter/index.ts:11](https://github.com/gohypergiant/standard-toolkit/blob/87ae5060c82d212b75a10cafb0030b08916e90f1/packages/core/src/array/filter/index.ts#L11)
