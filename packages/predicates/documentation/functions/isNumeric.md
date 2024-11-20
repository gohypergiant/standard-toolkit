[**@accelint/predicates**](../README.md) • **Docs**

***

[@accelint/predicates](../README.md) / isNumeric

# Function: isNumeric()

> **isNumeric**(`val`): `boolean`

Determine if given value is a number, or string that parses to a number. Includes infinities and NaN.

Non-finite strings are: 'Infinity', '-Infinity', and 'NaN'.

## Parameters

• **val**: `unknown`

## Returns

`boolean`

## Example

```ts
isNumeric(1.23) // true
isNumeric('Infinity') // true
isNumeric(NaN) // true
isNumeric('1.23') // true
isNumeric('hi') // false
```
