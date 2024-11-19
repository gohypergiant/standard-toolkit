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

[logical/nor/index.ts:32](https://github.com/gohypergiant/standard-toolkit/blob/424b88fd48a5bcc02ed99ee27fd64cd73349aa30/packages/core/src/logical/nor/index.ts#L32)
