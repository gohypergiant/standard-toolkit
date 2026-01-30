# @accelint/postcss-tailwind-css-modules

A PostCSS plugin that wraps Tailwind CSS `group/` classes in `:global()` pseudo-class to fix compatibility issues with CSS Modules.

## Overview

This plugin uses [postcss-selector-parser](https://www.npmjs.com/package/postcss-selector-parser) to wrap specific class nodes in a `:global()` pseudo-class, solving issues with Tailwind's parent state utilities when used with CSS Modules.

## Problem

Tailwind has utilities for [styling based on parent state](https://tailwindcss.com/docs/hover-focus-and-other-states#styling-based-on-parent-state), like `group/` classes. However, these utility classes rely on global classes. Without this plugin, CSS Modules hashes these classes, breaking Tailwind's parent state functionality.

> [!NOTE]  
> currently the plugin fixes `group/` classes. Future updates can expand the functionality to support other classes that may have a similar problem, like `peer/` classes.

## Transformation Examples

### Before and After

Without this plugin:

<img width="847" height="576" alt="Screenshot 2025-12-01 at 9 02 31 PM" src="https://github.com/user-attachments/assets/8e403cfa-aacc-445b-b24b-4bfb64f566c6" />

With this plugin:

<img width="784" height="709" alt="Screenshot 2025-12-01 at 9 04 10 PM" src="https://github.com/user-attachments/assets/5ca6c4a7-bc81-48d3-9714-b8c7de906d6a" />

## Installation

```bash
pnpm add -D @accelint/postcss-tailwind-css-modules
```

Or with npm:

```bash
npm install --save-dev @accelint/postcss-tailwind-css-modules
```

## Usage

### Turbo and Webpack

Add this plugin to your PostCSS config. It must come **after** the Tailwind PostCSS plugin.

```javascript
// postcss.config.js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    '@accelint/postcss-tailwind-css-modules': {},
  },
};
```

### Vite

Continue to use the Tailwind Vite plugin in your `vite.config.js`.

Your `postcss.config.js` file only needs this plugin, as Tailwind's PostCSS processing is included in their Vite plugin.

```javascript
// postcss.config.js
export default {
  plugins: {
    '@accelint/postcss-tailwind-css-modules': {},
  },
};
```

> [!NOTE]
> The array syntax for PostCSS plugin configuration does not work with Vite. Using `plugins: ['@accelint/postcss-tailwind-css-modules']` will cause errors. Use the object syntax shown above.

## How It Works

The plugin:

1. Only processes files ending in `.module.css`
2. Finds all Tailwind `group/` classes in your CSS selectors
3. Wraps them in `:global()` pseudo-class to prevent CSS Modules from hashing them
4. Ensures each rule is transformed only once using symbol-based tracking

**Input:**

```css
.group/sidebar {
  /* styles */
}
```

**Output:**

```css
:global(.group/sidebar) {
  /* styles */
}
```

## Supported Classes

Currently, the plugin fixes:

- `group/` classes (e.g., `group/sidebar`, `group/card`)

Future updates may expand support to other classes with similar issues, like `peer/` classes.

## Requirements

- Node.js >= 22
- pnpm >= 10
- PostCSS ^8.5.6
- postcss-selector-parser ^7.1.1

## License

Apache-2.0
