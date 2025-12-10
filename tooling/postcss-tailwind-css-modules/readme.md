# About

`@accelint/postcss-tailwind-css-modules` is a postcss plugin that uses https://www.npmjs.com/package/postcss-selector-parser under the hood to wrap specific class nodes in a `:global(...)` pseudo class.

# What problem does this solve?

Tailwind has some nifty utilities for [styling based on parent state](https://tailwindcss.com/docs/hover-focus-and-other-states#styling-based-on-parent-state). However, these utility classes use global classes under the hood. Without this plugin, those classes get hashed by css modules and styling based on parent state breaks.

> [!NOTE]  
> currently the plugin fixes `group/` classes. Future updates can expand the functionality to support other classes that may have a similar problem, like `peer/` classes.

# Example transformation flow from source -> postcss -> css modules

Without this plugin:

<img width="847" height="576" alt="Screenshot 2025-12-01 at 9 02 31 PM" src="https://github.com/user-attachments/assets/8e403cfa-aacc-445b-b24b-4bfb64f566c6" />

With this plugin:

<img width="784" height="709" alt="Screenshot 2025-12-01 at 9 04 10 PM" src="https://github.com/user-attachments/assets/5ca6c4a7-bc81-48d3-9714-b8c7de906d6a" />

# usage

## Turbo and Webpack

Add this plugin to your postcss config. it must come AFTER the tailwind postcss plugin
```
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    '@accelint/postcss-tailwind-css-modules': {},
  },
};
```

## Vite

Continue to use the tailwind vite plugin in your vite config

Your postcss.config.js file only needs our plugin, as tailwind's postcss stuff is included in their vite plugin
```
export default {
  plugins: {
    '@accelint/postcss-tailwind-css-modules': {},
  },
};
```

> [!NOTE]  
> the array syntax for postcss plugin configuration does not seem to work with vite. i.e. `plugins: ['@accelint/postcss-tailwind-css-modules']` will cause errors.
