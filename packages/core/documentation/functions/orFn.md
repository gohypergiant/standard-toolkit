[**@accelint/core**](../README.md) • **Docs**

***

[@accelint/core](../README.md) / orFn

# Function: orFn()

> **orFn**\<`T`, `A`\>(`a`): \<`B`\>(`b`) => (`c`) => `boolean`

Logical `(a(x) || b(x))`

Logical (Function Result) Disjunction

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

https://en.wikipedia.org/wiki/Logical_disjunction

## Example

```ts
orFn(s => s.trim())(s => s.trimEnd())('foo bar ');
// true
```
