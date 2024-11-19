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

## Defined in

[predicates/src/is-longitude/index.ts:30](https://github.com/gohypergiant/standard-toolkit/blob/7f574e64e57e697a3e2daabb1b78393aca67cb22/packages/predicates/src/is-longitude/index.ts#L30)
