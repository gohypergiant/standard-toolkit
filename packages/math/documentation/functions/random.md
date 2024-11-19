[**@accelint/math**](../README.md) • **Docs**

***

[@accelint/math](../README.md) / random

# Function: random()

> **random**(`min`, `max`): `number`

Generate a random number within the given bounds.

## Parameters

• **min**: `number`

• **max**: `number`

## Returns

`number`

## Throws

Throws an error if min > max.

## Example

```ts
const value = random(0, 10);
// value >= 0 && value <= 10;

const value = random(10, 0);
// RangeError
```

## Defined in

[random/index.ts:25](https://github.com/gohypergiant/standard-toolkit/blob/424b88fd48a5bcc02ed99ee27fd64cd73349aa30/packages/math/src/random/index.ts#L25)
