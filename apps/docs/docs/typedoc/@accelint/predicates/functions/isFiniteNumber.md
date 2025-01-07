# Function: isFiniteNumber()

> **isFiniteNumber**(`val`): `val is number`

Determine if the given value is a finite number.

Does not include infinities, NaN, or strings that look like numbers.

## Parameters

### val

`unknown`

## Returns

`val is number`

## Example

```ts
isFiniteNumber(1.23) // true
isFiniteNumber(Infinity) // false
isFiniteNumber(NaN) // false
isFiniteNumber('1.23') // false
```
