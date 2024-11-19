[**@accelint/core**](../README.md) • **Docs**

***

[@accelint/core](../README.md) / swappedNullishOr

# Function: swappedNullishOr()

> **swappedNullishOr**\<`A`\>(`a`): \<`B`\>(`b`) => `A` \| `NonNullable`\<`B`\>

Swapped Nullish Coalescing: `b ?? a`

## Type Parameters

• **A**

## Parameters

• **a**: `A`

## Returns

`Function`

### Type Parameters

• **B**

### Parameters

• **b**: `B`

### Returns

`A` \| `NonNullable`\<`B`\>

## Example

```ts
swappedNullishOr(4)(null);
// 4
```

## Defined in

[logical/nullish-or/index.ts:34](https://github.com/gohypergiant/standard-toolkit/blob/258694cea8ed8bbd956b3cf5da47c2c9debcf127/packages/core/src/logical/nullish-or/index.ts#L34)
