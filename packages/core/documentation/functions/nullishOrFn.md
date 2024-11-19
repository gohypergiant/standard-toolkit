[**@accelint/core**](../README.md) • **Docs**

***

[@accelint/core](../README.md) / nullishOrFn

# Function: nullishOrFn()

> **nullishOrFn**\<`T`, `A`\>(`a`): \<`B`\>(`b`) => (`c`) => `B` \| `NonNullable`\<`A`\>

Nullish Coalescing `(a(x) ?? b(x))`

## Type Parameters

• **T**

• **A**

## Parameters

• **a**

## Returns

`Function`

### Type Parameters

• **B**

### Parameters

• **b**

### Returns

`Function`

#### Parameters

• **c**: `T`

#### Returns

`B` \| `NonNullable`\<`A`\>

## Example

```ts
nullishOrFn(x => x.foo)(x => x.bar)({ bar: 4 });
// 4
```

## Defined in

[logical/nullish-or/index.ts:21](https://github.com/gohypergiant/standard-toolkit/blob/424b88fd48a5bcc02ed99ee27fd64cd73349aa30/packages/core/src/logical/nullish-or/index.ts#L21)
