[**@accelint/predicates**](../README.md) • **Docs**

***

[@accelint/predicates](../README.md) / isFiniteNumber

# Function: isFiniteNumber()

> **isFiniteNumber**(`val`): `boolean`

Determine if the given value is a finite number.

Does not include infinities, NaN, or strings that look like numbers.

## Parameters

• **val**: `unknown`

## Returns

`boolean`

## Example

```ts
isFiniteNumber(1.23) // true
isFiniteNumber(Infinity) // false
isFiniteNumber(NaN) // false
isFiniteNumber('1.23') // false
```
