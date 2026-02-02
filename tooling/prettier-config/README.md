# @accelint/prettier-config

Shared [Prettier](https://prettier.io/) configuration used across Accelint projects. Provides consistent code formatting with Tailwind CSS class sorting support.

## Features

- **Tailwind CSS Support**: Automatic class sorting via `prettier-plugin-tailwindcss`
- **Pragma-based Formatting**: Only formats files with `@format` pragma by default
- **CSS Overrides**: Special handling for CSS and CSS Module files
- **Zero Configuration**: Works out of the box with sensible defaults

## Installation

```bash
# Using pnpm (recommended)
pnpm add -D @accelint/prettier-config

# Using npm
npm install --save-dev @accelint/prettier-config

# Using yarn
yarn add -D @accelint/prettier-config
```

## Usage

### package.json Method (Recommended)

Add this to your `package.json`:

```json
{
  "prettier": "@accelint/prettier-config/config"
}
```

### Configuration File Method

Create a `prettier.config.js` in your project root:

```javascript
export { default } from '@accelint/prettier-config/config';
```

Or use CommonJS:

```javascript
module.exports = require('@accelint/prettier-config/config');
```

## Configuration Details

The configuration includes:

- **Tailwind CSS Plugin**: Automatically sorts Tailwind CSS classes
- **Pragma Requirement**: Files must include `@format` comment to be formatted
- **CSS Overrides**:
  - CSS files don't require pragma
  - Single quotes enabled for CSS files
  - Applies to both `.css` and `.module.css` files

### Adding Format Pragma

To enable formatting for a file, add this comment at the top:

```javascript
/** @format */

// Your code here
```

Or for CSS files (optional, as pragma is disabled):

```css
/* @format */

.your-styles {
  /* ... */
}
```

## Extending the Configuration

Create a `prettier.config.js` to extend or override settings:

```javascript
import baseConfig from '@accelint/prettier-config/config';

export default {
  ...baseConfig,
  semi: false,
  printWidth: 100,
};
```

## Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

## Integration

### VSCode

Install the [Prettier VSCode extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) and add to your `.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true
}
```

### Pre-commit Hook

Using [lefthook](https://github.com/evilmartians/lefthook):

```yaml
pre-commit:
  commands:
    prettier:
      glob: "*.{js,ts,jsx,tsx,json,css,md}"
      run: prettier --write {staged_files}
```

### CI/CD

Example GitHub Actions workflow:

```yaml
- name: Check Formatting
  run: pnpm prettier --check .
```

## Tailwind CSS Class Sorting

The configuration automatically sorts Tailwind CSS classes:

```javascript
// Before
<div className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">

// After (automatically sorted)
<div className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
```

## License

Apache-2.0
