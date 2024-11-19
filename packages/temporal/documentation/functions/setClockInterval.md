[**@accelint/temporal**](../README.md) • **Docs**

***

[@accelint/temporal](../README.md) / setClockInterval

# Function: setClockInterval()

> **setClockInterval**(`cb`, `ms`): () => `void`

Works the same way as setInterval but will wait to fire until next clock second.

## Parameters

• **cb**

• **ms**: `number`

## Returns

`Function`

### Returns

`void`

## Example

```ts
const cleanup = setClockInterval(() => console.log('hi'), 250);
// will log hi every 250ms starting on next clock second
```

## Defined in

[index.ts:10](https://github.com/gohypergiant/standard-toolkit/blob/424b88fd48a5bcc02ed99ee27fd64cd73349aa30/packages/temporal/src/timers/index.ts#L10)
