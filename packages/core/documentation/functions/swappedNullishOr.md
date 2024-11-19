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

[logical/nullish-or/index.ts:34](https://github.com/gohypergiant/standard-toolkit/blob/424b88fd48a5bcc02ed99ee27fd64cd73349aa30/packages/core/src/logical/nullish-or/index.ts#L34)
