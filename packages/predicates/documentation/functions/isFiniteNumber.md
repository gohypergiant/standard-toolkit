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

## Defined in

[predicates/src/is-number/index.ts:41](https://github.com/gohypergiant/standard-toolkit/blob/258694cea8ed8bbd956b3cf5da47c2c9debcf127/packages/predicates/src/is-number/index.ts#L41)
