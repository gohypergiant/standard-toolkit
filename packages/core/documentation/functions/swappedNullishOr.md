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
