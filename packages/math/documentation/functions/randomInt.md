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

[random/index.ts:46](https://github.com/gohypergiant/standard-toolkit/blob/258694cea8ed8bbd956b3cf5da47c2c9debcf127/packages/math/src/random/index.ts#L46)
