# Function: isNumber()

> **isNumber**(`val`): `val is number`

Determine if the given value is a number.

Includes Infinities and NaN, does not include strings that look like numbers

## Parameters

### val

`unknown`

## Returns

`val is number`

## Example

```ts
isNumber(1.23) // true
isNumber(Infinity) // true
isNumber(NaN) // true
isNumber('1.23') // false
```
