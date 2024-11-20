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
