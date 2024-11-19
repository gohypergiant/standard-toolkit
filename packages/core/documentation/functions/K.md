[**@accelint/core**](../README.md) • **Docs**

***

[@accelint/core](../README.md) / K

# Function: K()

> **K**\<`A`\>(`a`): \<`B`\>(`_`) => `A`

Corresponds to the encoding of `true` in the lambda calculus.
Takes two arguments and always returns the first.

Bird: `Kestrel`

Signature: `K :: a → b → a`

Lambda: `λab.a`

## Type Parameters

• **A**

## Parameters

• **a**: `A`

## Returns

`Function`

### Type Parameters

• **B**

### Parameters

• **\_**: `B`

### Returns

`A`

## Example

```ts
K(1)(2);
// 1
```

## Defined in

[combinators/k/index.ts:16](https://github.com/gohypergiant/standard-toolkit/blob/258694cea8ed8bbd956b3cf5da47c2c9debcf127/packages/core/src/combinators/k/index.ts#L16)
