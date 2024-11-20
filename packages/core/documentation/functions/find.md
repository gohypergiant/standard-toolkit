[**@accelint/core**](../README.md) • **Docs**

***

[@accelint/core](../README.md) / find

# Function: find()

> **find**\<`T`\>(`predicate`): (`arr`) => `undefined` \| `null` \| `T`

Returns the first element of the given array that satisfies the predicate.
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
find(x => !(x & 1))([1, 2, 3, 4, 5]);
// 2
```
