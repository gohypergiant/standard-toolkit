[**@accelint/core**](../README.md) • **Docs**

***

[@accelint/core](../README.md) / nullishOr

# Function: nullishOr()

> **nullishOr**\<`A`\>(`a`): \<`B`\>(`b`) => `B` \| `NonNullable`\<`A`\>

Nullish Coalescing `(a ?? b)`

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

`B` \| `NonNullable`\<`A`\>

## Example

```ts
nullishOr(null)(4);
// 4
```
