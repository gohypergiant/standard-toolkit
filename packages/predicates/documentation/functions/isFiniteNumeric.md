[**@accelint/predicates**](../README.md) • **Docs**

***

[@accelint/predicates](../README.md) / isFiniteNumeric

# Function: isFiniteNumeric()

> **isFiniteNumeric**(`val`): `boolean`

Determine if given value is a finite number, or string that parses to a finite number.

Does not include infinities, NaN.

## Parameters

• **val**: `unknown`

## Returns

`boolean`

## Example

```ts
isFiniteNumeric(1.23) // true
isFiniteNumeric('Infinity') // false
isFiniteNumeric(NaN) // false
isFiniteNumeric('1.23') // true
isFiniteNumeric('hi') // false
```
