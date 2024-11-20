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
