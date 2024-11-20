[**@accelint/predicates**](../README.md) • **Docs**

***

[@accelint/predicates](../README.md) / isLongitude

# Function: isLongitude()

> **isLongitude**(`val`): `boolean`

Determines if given value is a valid longitude range.

Assumes degrees as the unit of measure.

## Parameters

• **val**: `unknown`

## Returns

`boolean`

## Example

```ts
isLongitude(-180) // true
isLongitude(0) // true
isLongitude(180) // true
isLongitude(-190) // false
isLongitude(NaN) // false
```
