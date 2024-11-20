[**@accelint/converters**](../README.md) • **Docs**

***

[@accelint/converters](../README.md) / xyzToBbox

# Function: xyzToBbox()

> **xyzToBbox**(`tile`): [`BoundingBoxTuple`](../type-aliases/BoundingBoxTuple.md)

Converts a Tile (x, y, z) to a Bounding Box (west, south, east, north).

## Parameters

• **tile**: [`XyzTuple`](../type-aliases/XyzTuple.md)

## Returns

[`BoundingBoxTuple`](../type-aliases/BoundingBoxTuple.md)

## Pure

## Example

```ts
xyzToBbox([71, 96, 8]);
// [-80.15625, 39.909736234537185, -78.75, 40.97989806962013]
```
