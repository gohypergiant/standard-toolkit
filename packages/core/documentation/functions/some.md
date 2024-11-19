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

[array/some/index.ts:11](https://github.com/gohypergiant/standard-toolkit/blob/258694cea8ed8bbd956b3cf5da47c2c9debcf127/packages/core/src/array/some/index.ts#L11)
