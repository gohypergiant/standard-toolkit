[**@accelint/temporal**](../README.md) • **Docs**

***

[@accelint/temporal](../README.md) / setClockTimeout

# Function: setClockTimeout()

> **setClockTimeout**(`cb`, `ms`): () => `void`

Works the same way as setTimeout but will wait to fire until next clock second.

## Parameters

• **cb**

• **ms**: `number`

## Returns

`Function`

### Returns

`void`

## Example

```ts
const cleanup = setClockTimeout(() => console.log('hi'), 250);
// will log hi after 250ms starting on next clock second
```

## Defined in

[index.ts:35](https://github.com/gohypergiant/standard-toolkit/blob/258694cea8ed8bbd956b3cf5da47c2c9debcf127/packages/temporal/src/timers/index.ts#L35)
