[**@accelint/core**](../README.md) • **Docs**

***

[@accelint/core](../README.md) / swappedOrFn

# Function: swappedOrFn()

> **swappedOrFn**\<`T`, `A`\>(`a`): \<`B`\>(`b`) => (`c`) => `boolean`

Swapped Logical Or(): `(b(x) || a(x))`

Swapped Logical (Function Result) Disjunction

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
swappedOrFn(s => s.trimEnd())(s => s.trim())('foo bar ');
// true
```

## Defined in

[logical/or/index.ts:62](https://github.com/gohypergiant/standard-toolkit/blob/7f574e64e57e697a3e2daabb1b78393aca67cb22/packages/core/src/logical/or/index.ts#L62)
