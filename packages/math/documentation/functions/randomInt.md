[**@accelint/math**](../README.md) • **Docs**

***

[@accelint/math](../README.md) / randomInt

# Function: randomInt()

> **randomInt**(`min`, `max`): `number`

Generate a random integer within the given bounds.

## Parameters

• **min**: `number`

• **max**: `number`

## Returns

`number`

## Throws

Throws an error if min > max.

## Example

```ts
const value = randomInt(0, 10);
// value >= 0 && value <= 10;

const value = randomInt(10, 0);
// RangeError
```

## Defined in

[random/index.ts:46](https://github.com/gohypergiant/standard-toolkit/blob/7f574e64e57e697a3e2daabb1b78393aca67cb22/packages/math/src/random/index.ts#L46)
