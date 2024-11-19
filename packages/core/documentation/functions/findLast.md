[**@accelint/core**](../README.md) • **Docs**

***

[@accelint/core](../README.md) / findLast

# Function: findLast()

> **findLast**\<`T`\>(`predicate`): (`arr`) => `undefined` \| `null` \| `T`

Returns the last element of the given array that satisfies the predicate.
Returns `null` otherwise.

## Type Parameters

• **T**

## Parameters

• **predicate**: [`Predicate`](../type-aliases/Predicate.md)\<`T`\>

## Returns

`Function`

### Parameters

• **arr**: `T`[]

### Returns

`undefined` \| `null` \| `T`

## Example

```ts
findLast(x => !(x & 1))([1, 2, 3, 4, 5]);
// 4
```

## Defined in

[array/find-last/index.ts:12](https://github.com/gohypergiant/standard-toolkit/blob/87ae5060c82d212b75a10cafb0030b08916e90f1/packages/core/src/array/find-last/index.ts#L12)
