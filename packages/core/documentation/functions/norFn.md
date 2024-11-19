[**@accelint/core**](../README.md) • **Docs**

***

[@accelint/core](../README.md) / norFn

# Function: norFn()

> **norFn**\<`T`, `A`\>(`a`): \<`B`\>(`b`) => (`c`) => `boolean`

Logical `!(a(x) || b(x))`

Logical (Function Result) Non-disjunction

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

https://en.wikipedia.org/wiki/Logical_NOR

## Example

```ts
norFn(s => s.trim())(s => s.trimEnd())('foo bar ');
// false
```

## Defined in

[logical/nor/index.ts:32](https://github.com/gohypergiant/standard-toolkit/blob/258694cea8ed8bbd956b3cf5da47c2c9debcf127/packages/core/src/logical/nor/index.ts#L32)
