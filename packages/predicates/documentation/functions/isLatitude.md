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

## Defined in

[predicates/src/is-latitude/index.ts:30](https://github.com/gohypergiant/standard-toolkit/blob/7f574e64e57e697a3e2daabb1b78393aca67cb22/packages/predicates/src/is-latitude/index.ts#L30)
