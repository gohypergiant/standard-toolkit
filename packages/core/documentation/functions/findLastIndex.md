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
