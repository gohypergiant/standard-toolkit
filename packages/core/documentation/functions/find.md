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

## Defined in

[array/find/index.ts:12](https://github.com/gohypergiant/standard-toolkit/blob/424b88fd48a5bcc02ed99ee27fd64cd73349aa30/packages/core/src/array/find/index.ts#L12)
