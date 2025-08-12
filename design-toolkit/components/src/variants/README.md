# Custom Variants System

This directory contains the custom variants system that generates Tailwind custom variants from a single source of truth. Recreating [React Aria Components TailwindCSS Plugin](https://github.com/adobe/react-spectrum/blob/main/packages/tailwindcss-react-aria-components/src/index.js) without RAC selectors (:where([data-rac])) or prefix and combining with native selectors

## Overview

The custom variants system ensures selectors :

1. **Single Source of Truth**: All custom variants are defined in `variants.json`
2. **Automatic Generation**: Variants are consistenty handled in the case of changes to selectors or implementation
3. **Build Integration**: Variant generation is part of the build process

## File Structure

```
scripts
├── generate-tokens.mjs # Token generator logic

src/variants/
├── variants.json   # Single source of truth for all tokens
│── variants.css    # Generated Tailwind custom variants
```

## Usage

### 1. Defining Variants

Edit `variants.json` to define your variants:

```json
{
  "placement-left": "[data-placement~=\"left\"]",
  "placement-right": "[data-placement~=\"right\"]",
  "placement-top": "[data-placement~=\"top\"]",
  "placement-bottom": "[data-placement~=\"bottom\"]",
}
```

_The order of implementation of these variants is critically important!_

The order is from __lowest to highest priority__, meaning that a variant further down the list will "win" in the case of a style conflict

### 2. Generating Variants

Run the variant generation:

```bash
pnpm gen:variants
```

This will create:
- `src/tokens/variants.css` - Tailwind custom variants
