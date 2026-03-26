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

- `src/tokens/tokens.css` - CSS variables (standard hex/rgba format)
- `src/tokens/index.ts` - TypeScript constants (deck.gl RGBA format: all channels 0-255)
- `src/tokens/themes.css` - Tailwind theme blocks with semantic naming

## Important: Format Differences

**CSS Variables** (`tokens.css`, `themes.css`):

- Use standard CSS color formats (hex, rgba)
- Alpha channel: **0-1** (CSS standard)
- Example: `--color-surface: rgba(21, 21, 23, 1)`

**TypeScript Constants** (`index.ts`):

- Use deck.gl RGBA tuple format
- Alpha channel: **0-255** (deck.gl standard)
- Example: `[21, 21, 23, 255]`

This dual format optimizes for both contexts:

- CSS variables work seamlessly with standard CSS
- TypeScript constants eliminate runtime conversion overhead in deck.gl

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

**In React contexts that use deck.gl / WebGL components**, use the theme provider to access tokens that match the user's current theme:

```typescript
import { useTheme } from '@accelint/design-foundation';
import { ScatterplotLayer } from '@deck.gl/layers';

function MyDeckGLComponent() {
  const theme = useTheme();

  const layer = new ScatterplotLayer({
    id: 'points',
    data,
    // Color tokens are deck.gl RGBA format: [R, G, B, A] all 0-255
    // Values automatically match the current theme (dark/light)
    getFillColor: theme.bg.accent.primary.base,
    getLineColor: theme.outline.neutral.bold,
  });

  return <DeckGL layers={[layer]} />;
}
```

**In non-React contexts** (Node.js scripts, workers), import tokens directly:

```typescript
import { designTokens } from '@accelint/design-foundation/tokens';

// Must specify theme explicitly
const surfaceColor = designTokens.dark.bg.surface.default;
// e.g., [21, 21, 23, 255]
```

**For CSS-based styling** (React components, DOM elements), use CSS variables via Tailwind classes or className props:

```typescript
import { Button } from '@accelint/design-toolkit';

function MyComponent() {
  return (
    <Button
      className="bg-surface-default text-fg-primary-bold"
      variant="primary"
    >
      Click me
    </Button>
  );
}
```

See the [Tailwind best practices documentation](../documentation/tailwind.md) for guidance on when to use design tokens in classNames vs. Tailwind utility classes.
