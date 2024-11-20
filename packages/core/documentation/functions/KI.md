[**@accelint/core**](../README.md) • **Docs**

***

[@accelint/core](../README.md) / KI

# Function: KI()

> **KI**\<`A`\>(`_`): \<`B`\>(`b`) => `B`

Corresponds to the encoding of `false` in the lambda calculus.
Takes two arguments and always returns the second.
Inverse of `constant` (`K`).

Bird: `Kite`

Signature: `Ki :: a → b → b`

Lambda: `λab.b`

## Type Parameters

• **A**

## Parameters

• **\_**: `A`

## Returns

`Function`

### Type Parameters

• **B**

### Parameters

• **b**: `B`

### Returns

`B`

## Example

```ts
KI(1)(2);
// 2
```
