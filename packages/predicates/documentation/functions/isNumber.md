[**@accelint/predicates**](../README.md) • **Docs**

***

[@accelint/predicates](../README.md) / isNumber

# Function: isNumber()

> **isNumber**(`val`): val is number \| Number

Determine if the given value is a number.

Includes Infinities and NaN, does not include strings that look like numbers

## Parameters

• **val**: `unknown`

## Returns

val is number \| Number

## Example

```ts
isNumber(1.23) // true
isNumber(Infinity) // true
isNumber(NaN) // true
isNumber('1.23') // false
```

## Defined in

[predicates/src/is-number/index.ts:26](https://github.com/gohypergiant/standard-toolkit/blob/258694cea8ed8bbd956b3cf5da47c2c9debcf127/packages/predicates/src/is-number/index.ts#L26)
