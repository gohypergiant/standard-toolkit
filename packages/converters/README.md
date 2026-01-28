# @accelint/converters

A lightweight JavaScript utility for converting between various value types, including booleans, numbers, geographic coordinates, and map tile coordinates.

## Installation

```sh
npm install @accelint/converters
```

## Converters

This package includes the following converters:

- **azimuthToCardinal** - Convert azimuth angles to cardinal directions (N, NE, E, SE, S, SW, W, NW)
- **booleanToNumber** - Convert boolean values to integers (true → 1, false → 0)
- **toBoolean** - Convert various values to boolean (handles truthy/falsy conversion)
- **zxyToBbox** - Convert map tile coordinates (z, x, y) to bounding box coordinates
