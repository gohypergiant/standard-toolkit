[**@accelint/math**](../README.md) • **Docs**

***

[@accelint/math](../README.md) / round

# Function: round()

> **round**(`precision`, `value`): `number`

Rounds a number to a specified precision.

## Parameters

• **precision**: `number`

• **value**: `number`

## Returns

`number`

## Throws

Throws an error if precision is not integer.

## Example

```ts
const value = round(1, 1.2345); // 1.2
const value = round(2, 1.2345); // 1.23
const value = round(3, 1.2345); // 1.235
const value = round(3.1, 1.2345); // Error
```
