# Design Tokens System

This directory contains the design tokens system that generates both CSS variables and JavaScript constants from a single source of truth.

## Overview

The design tokens system ensures consistency between CSS and JavaScript by:

1. **Single Source of Truth**: All design tokens are defined in `tokens.json`
2. **Automatic Generation**: CSS variables and JavaScript constants are generated from the same source
3. **Type Safety**: TypeScript types are generated for all tokens
4. **Build Integration**: Token generation is part of the build process

## File Structure

```
src/tokens/
├── tokens.json         # Single source of truth for all tokens
├── generator.ts        # Token generator logic
├── tokens.d.ts         # TypeScript declarations
├── generated/          # Generated files (auto-created)
│   ├── tokens.css      # CSS variables
│   ├── tokens.js       # JavaScript constants
│   └── tokens.ts       # TypeScript constants and types
└── example-usage.tsx   # Example usage
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

### 2. Generating Tokens

Run the token generation:

```bash
pnpm generate:tokens
```

This will create:
- `src/tokens/generated/tokens.css` - CSS variables
- `src/tokens/generated/tokens.js`  - JavaScript constants  
- `src/tokens/generated/tokens.ts`  - TypeScript constants and types

### 3. Using Tokens in CSS

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
import { colorsNeutral01, spacingL } from './tokens/generated/tokens';

const styles = {
  backgroundColor: colorsNeutral01,
  padding: spacingL
};
```

### 5. Using Tokens in Components

```tsx
import React from 'react';
import { tokens } from './generator';

const MyComponent: React.FC = () => {
  return (
    <div 
      style={{ 
        backgroundColor: tokens.colors.neutral['01'],
        padding: tokens.spacing.l 
      }}
    >
      Content
    </div>
  );
};
```

## Build Integration

The token generation is automatically integrated into the build process:

```json
{
  "scripts": {
    "build": "pnpm generate:tokens && pnpm tsup && pnpm build:css"
  }
}
```

## Token Categories

The system supports various token categories:

- **Colors**: Neutral, highlight, utility, classification colors
- **Typography**: Font sizes, line heights, font families
- **Spacing**: Margin, padding, gap values
- **Radius**: Border radius values
- **Shadows**: Box shadow values
- **Icons**: Icon size values

## Benefits

1. **Consistency**: Same tokens used in CSS and JavaScript
2. **Maintainability**: Single source of truth for all design tokens
3. **Type Safety**: TypeScript support for all tokens
4. **Automation**: Automatic generation during build
5. **Flexibility**: Support for both CSS variables and JavaScript constants

## Migration from Current System

To migrate from the current hardcoded CSS variables:

1. Extract values from `src/index.css` into `tokens.json`
2. Update imports to use generated tokens
3. Remove hardcoded CSS variables
4. Update build process to include token generation

## Example Migration

**Before (hardcoded in CSS):**
```css
:root {
  --neutral-01: #ffffff;
  --spacing-l: 16px;
}
```

**After (generated from tokens.json):**
```json
{
  "colors": {
    "neutral": {
      "01": "#ffffff"
    }
  },
  "spacing": {
    "l": "16px"
  }
}
```

The generator will automatically create:
```css
:root {
  --colors-neutral-01: #ffffff;
  --spacing-l: 16px;
}
```

And JavaScript constants:
```javascript
export const colorsNeutral01 = '#ffffff';
export const spacingL = '16px';
``` 