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

[array/filter/index.ts:11](https://github.com/gohypergiant/standard-toolkit/blob/424b88fd48a5bcc02ed99ee27fd64cd73349aa30/packages/core/src/array/filter/index.ts#L11)
