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

## Defined in

[logical/nullish-or/index.ts:9](https://github.com/gohypergiant/standard-toolkit/blob/87ae5060c82d212b75a10cafb0030b08916e90f1/packages/core/src/logical/nullish-or/index.ts#L9)
