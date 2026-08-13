# GLSL Color Converters

GLSL color conversion utilities for web applications. Convert between RGBA 255 tuples and GLSL tuples.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Core Concept](#core-concept)
- [API](#api)
  - [Transforms](#transforms-glslrgbatuple--rgba255tuple)
- [Usage Examples](#usage-examples)
- [Type Definitions](#type-definitions)
- [Format Reference](#format-reference)
- [Round-Trip Conversions](#round-trip-conversions)
- [Why This Approach](#why-this-approach)
- [License](#license)

## Installation

```sh
pnpm add @accelint/converters
```

**Required dependencies:**

```sh
pnpm add @accelint/math @accelint/predicates
```

GLSL converters require `@accelint/math` for clamping operations when converting from GLSL (0-1) to deck.gl (0-255) format.

## Quick Start

```ts
import { rgba255TupleToGlsl, glslToRgba255Tuple } from '@accelint/converters/glsl';

// Convert deck.gl color to GLSL format for shaders
const glslColor = rgba255TupleToGlsl([255, 128, 64, 255]);
// [1, 0.5019607843137255, 0.25098039215686274, 1]

// Convert GLSL color back to deck.gl format
const deckColor = glslToRgba255Tuple([1, 0.5, 0.25, 1]);
// [255, 128, 64, 255]
```

## Core Concept

All conversions use a **standard deck.gl format**: `[r, g, b, a]` where all channels are **0-255**.

This provides:

- **Precision**: No floating-point errors
- **Simplicity**: One internal format
- **Lossless conversions**: Round-trip without data loss
- **deck.gl native**: Minimal overhead for deck.gl applications

## API

### Transforms (GlslRgbaTuple ↔ Rgba255Tuple)

#### `rgba255TupleToGlsl(color: Rgba255Tuple): GlslRgbaTuple`

Convert deck.gl format (0-255) to GLSL format (0-1).

```ts
import { rgba255TupleToGlsl } from '@accelint/converters/glsl';

rgba255TupleToGlsl([255, 128, 64, 255]);
// [1, 0.5019607843137255, 0.25098039215686274, 1]
```

#### `glslToRgba255Tuple(color: GlslRgbaTuple): Rgba255Tuple`

Convert GLSL format (0-1) to deck.gl format (0-255).

```ts
import { glslToRgba255Tuple } from '@accelint/converters/glsl';

glslToRgba255Tuple([1, 0.5, 0.25, 1]);  // [255, 128, 64, 255]
```

## Usage Examples

### deck.gl → GLSL Workflow

```ts
import { rgba255TupleToGlsl } from '@accelint/converters/glsl';

const deckColor = [255, 128, 64, 255];
const glslColor = rgba255TupleToGlsl(deckColor);
// Use glslColor in shader uniforms
```

### Composition Pipeline

```ts
import { rgba255TupleToGlsl, glslToRgba255Tuple } from '@accelint/converters/glsl';

const adjustBrightness = (color: Rgba255Tuple, factor: number): Rgba255Tuple => {
  // Convert to GLSL space (0-1)
  const glsl = rgba255TupleToGlsl(color);

  // Adjust brightness in normalized space
  const adjusted = glsl.map(v => Math.min(1, v * factor)) as GlslRgbaTuple;

  // Convert back to deck.gl format (0-255)
  return glslToRgba255Tuple(adjusted);
};

const brighter = adjustBrightness([255, 128, 64, 255], 1.2);
// [255, 154, 77, 255]
```

## Type Definitions

```ts
/**
 * RGBA color where all channels are 0-255 (deck.gl standard format)
 * [red, green, blue, alpha]
 *
 * Imported from @accelint/predicates/is-rgba-255-tuple
 */
type Rgba255Tuple = readonly [
  r: number,  // 0-255
  g: number,  // 0-255
  b: number,  // 0-255
  a: number,  // 0-255
];

/**
 * GLSL RGBA color tuple where all channels are normalized 0-1.
 * [red, green, blue, alpha]
 *
 * Exported from @accelint/converters/color
 */
export type GlslRgbaTuple = readonly [
  r: number, // 0-1
  g: number, // 0-1
  b: number, // 0-1
  a: number, // 0-1
];
```

## Format Reference

| Format | RGB Range | Alpha Range | Example |
|--------|-----------|-------------|---------|
| **deck.gl** | 0-255 | 0-255 | `[255, 128, 64, 255]` |
| **GLSL** | 0-1 | 0-1 | `[1.0, 0.5, 0.25, 1.0]` |

## Round-Trip Conversions

All conversions are lossless when round-tripped:

```ts
import {
  rgba255TupleToGlsl, 
  glslToRgba255Tuple,
} from '@accelint/converters/glsl';

const original = [255, 128, 64, 255];

// GLSL round-trip
glslToRgba255Tuple(rgba255TupleToGlsl(original)) === original  // ✓
```

## Why This Approach?

Compared to existing color libraries (colord, chroma.js, colorjs.io):

### No Object Creation Overhead

```ts
// Other libraries (object creation for every operation)
const color = new Color([255, 128, 64, 255]);
const glsl = [color.r / 255, color.g / 255, color.b / 255, color.alpha / 255];

// This library (direct tuple operations)
const glsl = rgba255TupleToGlsl([255, 128, 64, 255]);
```

### Composition-Friendly

```ts
// Works naturally in composition pipelines
const result = compose(
  rgba255TupleToGlsl,
  adjustBrightness, // Custom consumer-side function
  glslToRgba255Tuple
)(deckColor);
```

### deck.gl Native

```ts
// No conversion needed for deck.gl
const layer = new ScatterplotLayer({
  data,
  getFillColor: [255, 128, 64, 255],  // Already in the right format
});
```

## License

Apache-2.0
