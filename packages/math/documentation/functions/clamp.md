[**@accelint/math**](../README.md) • **Docs**

***

[@accelint/math](../README.md) / clamp

# Function: clamp()

> **clamp**(`min`, `max`, `value`): `number`

Clamps a number within the specified bounds.

## Parameters

• **min**: `number`

• **max**: `number`

• **value**: `number`

## Returns

`number`

## Throws

Throws an error if min > max.

## Example

```ts
const value = clamp(5, 15, 10); // 10
const value = clamp(5, 15, 2); // 5
const value = clamp(5, 15, 20); // 15
const value = clamp(15, 5, 10); // RangeError
```

## Defined in

[clamp/index.ts:24](https://github.com/gohypergiant/standard-toolkit/blob/258694cea8ed8bbd956b3cf5da47c2c9debcf127/packages/math/src/clamp/index.ts#L24)
