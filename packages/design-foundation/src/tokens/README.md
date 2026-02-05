# Design Tokens System

This directory contains the design tokens system that generates both CSS variables and JavaScript constants from a single source of truth.

## Overview

The design tokens system ensures consistency between CSS and JavaScript by:

1. **Single Source of Truth**: All design tokens are defined in `primitive.json` with semantic mappings in `semantic.json`
2. **Automatic Generation**: CSS variables and TS constants are generated from the same source
3. **Type Safety**: TypeScript types are defined for all tokens
4. **Build Integration**: Token generation is part of the build process

## File Structure

```text
scripts/
└── generate-tokens.mjs   # Token generator logic

src/tokens/
├── primitive.json   # Raw design tokens (colors, spacing, etc.)
├── semantic.json    # Semantic mappings to primitives
├── types.ts         # TypeScript type definitions
├── tokens.css       # Generated CSS variables
├── themes.css       # Generated Tailwind theme blocks
└── index.ts         # Generated TypeScript constants (deck.gl RGBA format)
```

## Usage

### 1. Defining Tokens

Edit `primitive.json` to define your design tokens:

```json
{
  "primitive": {
    "neutral": {
      "50": "#ffffff",
      "100": "#eff1f2"
    },
    "alpha": {
      "black": {
        "100": "rgba(0, 0, 0, 0.08)"
      }
    }
  },
  "spacing": {
    "s": "8px",
    "m": "12px",
    "l": "16px"
  }
}
```

### 2. Define Semantic Mapping

Edit `semantic.json` to create meaningful semantic mappings:

```json
{
  "dark": {
    "bg": {
      "surface": {
        "default": "--primitive-neutral-900"
      }
    }
  }
}
```

### 3. Generating Tokens

Run the token generation:

```bash
pnpm gen:tokens
```

This will create:

- `src/tokens/tokens.css` - CSS variables (hex colors)
- `src/tokens/index.ts` - TypeScript constants (deck.gl RGBA format)
- `src/tokens/themes.css` - Tailwind theme blocks with semantic naming

### 4. Using Tokens in CSS

Import the generated CSS in your stylesheets:

```css
@import './tokens/tokens.css';

.my-component {
  background-color: var(--primitive-neutral-50);
  padding: var(--spacing-l);
}
```

### 5. Using Tokens in JavaScript/TypeScript

Import the generated constants:

```typescript
import { designTokens } from '@accelint/design-foundation/tokens';

// Color tokens are deck.gl RGBA format: [R, G, B, A] all 0-255
const surfaceColor = designTokens.dark.bg.surface.default;
// e.g., [21, 21, 23, 255]
```

### 6. Using Tokens with Deck.gl

The TypeScript token format is optimized for deck.gl layers:

```tsx
import DeckGL from '@deck.gl/react';
import { ScatterplotLayer } from '@deck.gl/layers';
import { designTokens } from '@accelint/design-foundation/tokens';

const { dark } = designTokens;

const layer = new ScatterplotLayer({
  id: 'scatter',
  data,
  getPosition: d => d.position,
  getRadius: d => d.size,
  // Colors are already in deck.gl format [R, G, B, A] 0-255
  getFillColor: dark.bg.accent.primary.base,
  getLineColor: dark.outline.neutral.bold,
  stroked: true,
  lineWidthMinPixels: 2
});

export default function MyDeckGLMap() {
  return (
    <DeckGL
      initialViewState={{
        longitude: -122.45,
        latitude: 37.78,
        zoom: 12
      }}
      controller={true}
      layers={[layer]}
    />
  );
}
```
