[**@accelint/core**](../README.md) • **Docs**

***

[@accelint/core](../README.md) / equalityFn

# Function: equalityFn()

> **equalityFn**\<`T`\>(`a`): (`b`) => (`c`) => `boolean`

Logical `(a(x) === b(x))`

## Type Parameters

• **T**

## Parameters

• **a**

## Returns

`Function`

### Parameters

• **b**

### Returns

`Function`

#### Parameters

• **c**: `T`

#### Returns

`boolean`

## Link

https://en.wikipedia.org/wiki/Logical_equality

## Link

https://en.wikipedia.org/wiki/Logical_biconditional

## Example

```ts
equalityFn(s => s.trim())(s => s.trimEnd())('foo bar ');
// true
```

## Defined in

[logical/equality/index.ts:26](https://github.com/gohypergiant/standard-toolkit/blob/87ae5060c82d212b75a10cafb0030b08916e90f1/packages/core/src/logical/equality/index.ts#L26)
