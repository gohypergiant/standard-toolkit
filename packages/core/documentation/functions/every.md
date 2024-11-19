[**@accelint/core**](../README.md) • **Docs**

***

[@accelint/core](../README.md) / every

# Function: every()

> **every**\<`T`\>(`comparator`): (`arr`) => `boolean`

Tests whether all elements in the array pass the given comparator.

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
// false
```

## Defined in

[array/every/index.ts:11](https://github.com/gohypergiant/standard-toolkit/blob/424b88fd48a5bcc02ed99ee27fd64cd73349aa30/packages/core/src/array/every/index.ts#L11)
