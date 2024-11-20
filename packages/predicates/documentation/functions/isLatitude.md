[**@accelint/predicates**](../README.md) • **Docs**

***

[@accelint/predicates](../README.md) / isLatitude

# Function: isLatitude()

> **isLatitude**(`val`): `boolean`

Determines if given value is a valid latitude range.

Assumes degrees as the unit of measure.

## Parameters

• **val**: `unknown`

## Returns

`boolean`

## Example

```ts
isLatitude(-90) // true
isLatitude(0) // true
isLatitude(90) // true
isLatitude(-100) // false
isLatitude(NaN) // false
```
