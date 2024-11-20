[**@accelint/core**](../README.md) • **Docs**

***

[@accelint/core](../README.md) / reduceRight

# Function: reduceRight()

> **reduceRight**\<`T`, `R`\>(`fn`): (`initVal`) => (`arr`) => `R`

Calls the accumulator with each element of the given array, starting with the last element.
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
reduceRight((total, n) => total - n)(0)([1, 2, 3, 4, 5]);
// -5
```
