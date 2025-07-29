# Design Tokens System

This directory contains the design tokens system that generates both CSS variables and JavaScript constants from a single source of truth.

## Overview

The design tokens system ensures consistency between CSS and JavaScript by:

1. **Single Source of Truth**: All design tokens are defined in `tokens.json`
2. **Automatic Generation**: CSS variables and TS constants are generated from the same source
3. **Type Safety**: TypeScript types are generated for all tokens
4. **Build Integration**: Token generation is part of the build process

## File Structure

```
scripts
├── generate-tokens.mjs # Token generator logic

src/tokens/
├── tokens.json   # Single source of truth for all tokens
├── tokens.d.ts   # TypeScript declarations
│── tokens.css    # CSS variables
│── index.ts      # TypeScript constants and types
```

## Usage

### 1. Defining Tokens

Edit `tokens.json` to define your design tokens:

```json
{
  "colors": {
    "neutral": {
      "01": "#ffffff",
      "02": "#e6e6e6"
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
  "colors": {
    "surface": {
      "default": "---colors-neutral-01"
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
- `src/tokens/tokens.css` - CSS variables
- `src/tokens/index.ts`  - TypeScript constants and types
- `src/tokens/themes.css` - Tailwind theme blocks which map the raw color tokens to their semantic naming convention 

### 4. Using Tokens in CSS

Import the generated CSS in your stylesheets:

```css
@import './tokens/generated/tokens.css';

.my-component {
  background-color: var(--colors-neutral-01);
  padding: var(--spacing-l);
}
```

### 4. Using Tokens in JavaScript/TypeScript

Import the generated constants:

```typescript
import { 
  colorSurfaceDefault, 
  colorInteractiveHover, 
  spacingL 
 } from './tokens/generated/tokens';

// colorSurfaceDefault is a tuple: [11, 11, 11, 1]
const styles = {
  backgroundColor: `rgba(${colorSurfaceDefault.join(', ')})`,
  padding: spacingL // number, e.g. 16
};
```

### 5. Using Tokens in Components

```tsx
import DeckGL from '@deck.gl/react';
import { ScatterplotLayer } from '@deck.gl/layers';
import { 
  colorHighlight, 
  colorSurfaceDefault, 
  spacingL 
 } from './tokens/generated/tokens';

const data = [
  { position: [-122.45, 37.78], size: 100 },
  { position: [-122.46, 37.76], size: 200 }
];

const layer = new ScatterplotLayer({
  id: 'scatter',
  data,
  getPosition: d => d.position,
  getRadius: d => d.size,
  getFillColor: () => colorHighlight,
  getLineColor: () => colorSurfaceDefault,   
  radiusMinPixels: spacingL, 
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
