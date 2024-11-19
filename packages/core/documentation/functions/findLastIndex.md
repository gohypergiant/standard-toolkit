[**@accelint/core**](../README.md) • **Docs**

***

[@accelint/core](../README.md) / findLastIndex

# Function: findLastIndex()

> **findLastIndex**\<`T`\>(`predicate`): (`arr`) => `number`

Returns the last index of the given array that satisfies the predicate.
Returns `-1` otherwise.

## Type Parameters

• **T**

## Parameters

• **predicate**: [`Predicate`](../type-aliases/Predicate.md)\<`T`\>

## Returns

`Function`

### Parameters

• **arr**: `T`[]

### Returns

`number`

## Example

```ts
findLastIndex(x => !(x & 1))([1, 2, 3, 4, 5]);
// 3
```

## Defined in

[array/find-last-index/index.ts:12](https://github.com/gohypergiant/standard-toolkit/blob/7f574e64e57e697a3e2daabb1b78393aca67cb22/packages/core/src/array/find-last-index/index.ts#L12)
