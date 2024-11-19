[**@accelint/core**](../README.md) • **Docs**

***

[@accelint/core](../README.md) / some

# Function: some()

> **some**\<`T`\>(`comparator`): (`arr`) => `boolean`

Tests whether any elements in the array pass the given comparator.

## Type Parameters

• **T**

## Parameters

• **comparator**: [`Comparator`](../type-aliases/Comparator.md)\<`T`\>

## Returns

`Function`

### Parameters

• **arr**: `T`[]

### Returns

`boolean`

## Example

```ts
every(x => !(x & 1))([1, 2, 3, 4, 5]);
// true
```

## Defined in

[array/some/index.ts:11](https://github.com/gohypergiant/standard-toolkit/blob/87ae5060c82d212b75a10cafb0030b08916e90f1/packages/core/src/array/some/index.ts#L11)
