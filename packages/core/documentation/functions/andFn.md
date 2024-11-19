[**@accelint/core**](../README.md) • **Docs**

***

[@accelint/core](../README.md) / andFn

# Function: andFn()

> **andFn**\<`T`, `A`\>(`a`): \<`B`\>(`b`) => (`c`) => `boolean`

Logical `(a(x) && b(x))`

Logical (Function Result) Conjunction

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

https://en.wikipedia.org/wiki/Logical_conjunction

## Example

```ts
andFn(s => s.trim())(s => s.trimEnd())('foo bar ');
// true
```

## Defined in

[logical/and/index.ts:29](https://github.com/gohypergiant/standard-toolkit/blob/87ae5060c82d212b75a10cafb0030b08916e90f1/packages/core/src/logical/and/index.ts#L29)
