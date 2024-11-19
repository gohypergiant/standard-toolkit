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

## Defined in

[round/index.ts:24](https://github.com/gohypergiant/standard-toolkit/blob/424b88fd48a5bcc02ed99ee27fd64cd73349aa30/packages/math/src/round/index.ts#L24)
