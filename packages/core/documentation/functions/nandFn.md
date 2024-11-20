[**@accelint/core**](../README.md) • **Docs**

***

[@accelint/core](../README.md) / nandFn

# Function: nandFn()

> **nandFn**\<`T`, `A`\>(`a`): \<`B`\>(`b`) => (`c`) => `boolean`

Logical `!(a(x) && b(x))`

Logical (Function Result) Non-conjunction

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

`boolean`

## Link

https://en.wikipedia.org/wiki/Sheffer_stroke

## Example

```ts
nandFn(s => s.trim())(s => s.trimEnd())('foo bar ');
// false
```
