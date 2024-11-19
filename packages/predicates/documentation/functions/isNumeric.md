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

## Defined in

[predicates/src/is-number/index.ts:75](https://github.com/gohypergiant/standard-toolkit/blob/258694cea8ed8bbd956b3cf5da47c2c9debcf127/packages/predicates/src/is-number/index.ts#L75)
