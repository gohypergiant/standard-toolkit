[**@accelint/core**](../README.md) • **Docs**

***

[@accelint/core](../README.md) / Th

# Function: Th()

> **Th**\<`A`\>(`a`): \<`B`\>(`b`) => `B`

Takes an argument and an unary function and then applies the function to the argument.
Inverse of `apply` (`A`)

Bird: `Thrush`

Signature: `Th :: a → (a → b) → b`

Lamda: `λab.ba`

## Type Parameters

• **A**

## Parameters

• **a**: `A`

## Returns

`Function`

### Type Parameters

• **B**

### Parameters

• **b**

### Returns

`B`

## Example

```ts
Th(6)(x => x * 2);
// 12
```

## Defined in

[combinators/th/index.ts:16](https://github.com/gohypergiant/standard-toolkit/blob/258694cea8ed8bbd956b3cf5da47c2c9debcf127/packages/core/src/combinators/th/index.ts#L16)
