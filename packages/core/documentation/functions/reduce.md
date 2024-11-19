[**@accelint/core**](../README.md) • **Docs**

***

[@accelint/core](../README.md) / reduce

# Function: reduce()

> **reduce**\<`T`, `R`\>(`fn`): (`initVal`) => (`arr`) => `R`

Calls the accumulator with each element of the given array, starting with the first element.
Returns the final result.

## Type Parameters

• **T**

• **R**

## Parameters

• **fn**: [`Accumulator`](../type-aliases/Accumulator.md)\<`T`, `R`\>

## Returns

`Function`

### Parameters

• **initVal**: `R`

### Returns

`Function`

#### Parameters

• **arr**: `T`[]

#### Returns

`R`

## Example

```ts
reduce((total, n) => total - n)(0)([1, 2, 3, 4, 5]);
// -13
```

## Defined in

[array/reduce/index.ts:12](https://github.com/gohypergiant/standard-toolkit/blob/7f574e64e57e697a3e2daabb1b78393aca67cb22/packages/core/src/array/reduce/index.ts#L12)
