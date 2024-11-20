[**@accelint/core**](../README.md) • **Docs**

***

[@accelint/core](../README.md) / A

# Function: A()

> **A**\<`T`, `R`\>(`f`): (`x`) => `R`

Takes an unary function and applies it to the given argument.

Signature: `A :: (a → b) → a → b`

Lambda: `λab.ab`

## Type Parameters

• **T**

• **R**

## Parameters

• **f**

## Returns

`Function`

### Parameters

• **x**: `T`

### Returns

`R`

## Example

```ts
A((a) => a + 6)(3);
// 9
```
