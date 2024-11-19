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

## Defined in

[predicates/src/is-number/index.ts:57](https://github.com/gohypergiant/standard-toolkit/blob/7f574e64e57e697a3e2daabb1b78393aca67cb22/packages/predicates/src/is-number/index.ts#L57)
