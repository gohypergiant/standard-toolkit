---
title: Color Regex Constants
description: Regular expression patterns for validating and parsing CSS color values in hex and rgba formats.
source: packages/constants/src/color/index.ts
source_sha: d6cb28551a341a293027f2084e6e7f5c6c5cd467
doc_sha: pending
deprecated: false
updated: 2026-05-28
---

# Color Regex Constants

Regular expression patterns for validating and parsing CSS color values in hex and rgba formats.

## Usage

```typescript
import {
  CSS_RGBA_LEGACY_REGEX,
  CSS_RGBA_MODERN_REGEX,
  HEX_REGEX,
} from '@accelint/constants';

// Validate legacy rgba syntax
CSS_RGBA_LEGACY_REGEX.test('rgba(255, 128, 64, 0.5)'); // true

// Validate modern rgba syntax
CSS_RGBA_MODERN_REGEX.test('rgb(255 128 64 / 0.5)'); // true

// Validate hex colors
HEX_REGEX.test('#FF8040'); // true
```

---

## CSS_RGBA_LEGACY_REGEX

Regular expression for validating legacy comma-separated CSS rgb/rgba syntax.

### Usage

```typescript
import { CSS_RGBA_LEGACY_REGEX } from '@accelint/constants';

CSS_RGBA_LEGACY_REGEX.test('rgb(255, 128, 64)'); // true
CSS_RGBA_LEGACY_REGEX.test('rgba(255, 128, 64, 0.5)'); // true
```

### Reference

```typescript
const CSS_RGBA_LEGACY_REGEX: RegExp
```

Matches CSS color values in the legacy comma-separated format:
- `rgb(255, 128, 64)` - RGB with integer values
- `rgba(255, 128, 64, 0.5)` - RGBA with alpha channel
- `rgb(100%, 50%, 25%)` - RGB with percentage values
- `rgba(100%, 50%, 25%, 50%)` - RGBA with percentage alpha

Pattern: `/^rgba?\(\s*(\d+(?:\.\d+)?%?)\s*,\s*(\d+(?:\.\d+)?%?)\s*,\s*(\d+(?:\.\d+)?%?)\s*(?:,\s*(\d+(?:\.\d+)?%?)\s*)?\)$/i`

### Examples

#### Example: Validating user input

```typescript
import { CSS_RGBA_LEGACY_REGEX } from '@accelint/constants';

function isValidLegacyRgba(color: string): boolean {
  return CSS_RGBA_LEGACY_REGEX.test(color);
}

isValidLegacyRgba('rgb(255, 0, 0)'); // true
isValidLegacyRgba('rgba(0, 128, 255, 0.75)'); // true
isValidLegacyRgba('rgb(100%, 50%, 0%)'); // true
isValidLegacyRgba('rgb(255 128 64)'); // false (modern syntax)
```

#### Example: Extracting color components

```typescript
import { CSS_RGBA_LEGACY_REGEX } from '@accelint/constants';

function parseRgba(color: string) {
  const match = color.match(CSS_RGBA_LEGACY_REGEX);
  if (!match) return null;
  
  return {
    r: match[1],
    g: match[2],
    b: match[3],
    a: match[4] || '1',
  };
}

parseRgba('rgba(255, 128, 64, 0.5)');
// { r: '255', g: '128', b: '64', a: '0.5' }
```

#### Example: Form validation

```typescript
import { CSS_RGBA_LEGACY_REGEX } from '@accelint/constants';

function validateColorInput(input: string): string | null {
  if (!CSS_RGBA_LEGACY_REGEX.test(input)) {
    return 'Invalid color format. Use rgb(r, g, b) or rgba(r, g, b, a)';
  }
  return null;
}
```

> **Good to know:** This pattern is case-insensitive and accepts both `rgb()` and `rgba()` function names. It supports decimal values, percentages, and flexible whitespace.

---

## CSS_RGBA_MODERN_REGEX

Regular expression for validating modern space-separated CSS rgb/rgba syntax.

### Usage

```typescript
import { CSS_RGBA_MODERN_REGEX } from '@accelint/constants';

CSS_RGBA_MODERN_REGEX.test('rgb(255 128 64)'); // true
CSS_RGBA_MODERN_REGEX.test('rgb(255 128 64 / 0.5)'); // true
```

### Reference

```typescript
const CSS_RGBA_MODERN_REGEX: RegExp
```

Matches CSS color values in the modern space-separated format:
- `rgb(255 128 64)` - RGB with space-separated values
- `rgb(255 128 64 / 0.5)` - RGBA with slash-separated alpha
- `rgb(100% 50% 25%)` - RGB with percentage values
- `rgb(100% 50% 25% / 50%)` - RGBA with percentage alpha

Pattern: `/^rgba?\(\s*(\d+(?:\.\d+)?%?)\s+(\d+(?:\.\d+)?%?)\s+(\d+(?:\.\d+)?%?)\s*(?:\/\s*(\d+(?:\.\d+)?%?)\s*)?\)$/i`

### Examples

#### Example: Validating modern CSS syntax

```typescript
import { CSS_RGBA_MODERN_REGEX } from '@accelint/constants';

function isValidModernRgba(color: string): boolean {
  return CSS_RGBA_MODERN_REGEX.test(color);
}

isValidModernRgba('rgb(255 0 0)'); // true
isValidModernRgba('rgb(0 128 255 / 0.75)'); // true
isValidModernRgba('rgb(100% 50% 0%)'); // true
isValidModernRgba('rgb(255, 128, 64)'); // false (legacy syntax)
```

#### Example: Parsing modern format

```typescript
import { CSS_RGBA_MODERN_REGEX } from '@accelint/constants';

function parseModernRgba(color: string) {
  const match = color.match(CSS_RGBA_MODERN_REGEX);
  if (!match) return null;
  
  return {
    r: match[1],
    g: match[2],
    b: match[3],
    a: match[4] || '1',
  };
}

parseModernRgba('rgb(255 128 64 / 0.5)');
// { r: '255', g: '128', b: '64', a: '0.5' }
```

#### Example: Supporting both syntaxes

```typescript
import {
  CSS_RGBA_LEGACY_REGEX,
  CSS_RGBA_MODERN_REGEX,
} from '@accelint/constants';

function isValidRgba(color: string): boolean {
  return (
    CSS_RGBA_LEGACY_REGEX.test(color) ||
    CSS_RGBA_MODERN_REGEX.test(color)
  );
}

isValidRgba('rgb(255, 128, 64)'); // true (legacy)
isValidRgba('rgb(255 128 64)'); // true (modern)
```

> **Good to know:** The modern syntax uses spaces to separate RGB values and a forward slash `/` for the alpha channel. This is the recommended CSS Color Module Level 4 syntax.

---

## HEX_REGEX

Regular expression for validating hexadecimal color codes.

### Usage

```typescript
import { HEX_REGEX } from '@accelint/constants';

HEX_REGEX.test('#FF8040'); // true
HEX_REGEX.test('FF8040'); // true (# is optional)
HEX_REGEX.test('#F80'); // true (shorthand)
```

### Reference

```typescript
const HEX_REGEX: RegExp
```

Matches hexadecimal color values in the following formats:
- `#RGB` - 3-digit shorthand (e.g., `#F80`)
- `#RGBA` - 4-digit shorthand with alpha (e.g., `#F808`)
- `#RRGGBB` - 6-digit full format (e.g., `#FF8040`)
- `#RRGGBBAA` - 8-digit full format with alpha (e.g., `#FF804080`)

The `#` prefix is optional.

Pattern: `/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/`

### Examples

#### Example: Validating hex colors

```typescript
import { HEX_REGEX } from '@accelint/constants';

function isValidHexColor(color: string): boolean {
  return HEX_REGEX.test(color);
}

isValidHexColor('#FF0000'); // true
isValidHexColor('00FF00'); // true
isValidHexColor('#F00'); // true (shorthand)
isValidHexColor('#FF0000AA'); // true (with alpha)
isValidHexColor('#GG0000'); // false (invalid characters)
```

#### Example: Normalizing hex format

```typescript
import { HEX_REGEX } from '@accelint/constants';

function normalizeHex(color: string): string | null {
  const match = color.match(HEX_REGEX);
  if (!match) return null;
  
  const hex = match[1];
  return `#${hex.toUpperCase()}`;
}

normalizeHex('ff8040'); // '#FF8040'
normalizeHex('#f80'); // '#F80'
normalizeHex('invalid'); // null
```

#### Example: Extracting hex components

```typescript
import { HEX_REGEX } from '@accelint/constants';

function extractHexComponents(color: string) {
  const match = color.match(HEX_REGEX);
  if (!match) return null;
  
  const hex = match[1];
  
  if (hex.length === 3) {
    // Expand shorthand: #RGB → #RRGGBB
    const [r, g, b] = hex.split('');
    return { r: r + r, g: g + g, b: b + b, a: 'FF' };
  } else if (hex.length === 6) {
    // Full format: #RRGGBB
    return {
      r: hex.slice(0, 2),
      g: hex.slice(2, 4),
      b: hex.slice(4, 6),
      a: 'FF',
    };
  } else if (hex.length === 8) {
    // Full format with alpha: #RRGGBBAA
    return {
      r: hex.slice(0, 2),
      g: hex.slice(2, 4),
      b: hex.slice(4, 6),
      a: hex.slice(6, 8),
    };
  }
  
  return null;
}

extractHexComponents('#FF8040');
// { r: 'FF', g: '80', b: '40', a: 'FF' }
```

#### Example: Color picker validation

```typescript
import { HEX_REGEX } from '@accelint/constants';

function validateColorPicker(value: string): string | undefined {
  if (!value.startsWith('#')) {
    return 'Hex colors must start with #';
  }
  
  if (!HEX_REGEX.test(value)) {
    return 'Invalid hex color format';
  }
  
  const hex = value.slice(1);
  if (hex.length !== 3 && hex.length !== 6) {
    return 'Use 3-digit (#RGB) or 6-digit (#RRGGBB) format';
  }
  
  return undefined; // Valid
}
```

> **Good to know:** The regex accepts both uppercase and lowercase hex digits. It supports 3-digit shorthand (`#F80` expands to `#FF8800`) and 8-digit format with alpha channel.

---

## Related

- [CSS Color Module Level 4](https://www.w3.org/TR/css-color-4/) - W3C specification for CSS colors
- [MDN: CSS color values](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value) - CSS color value documentation
- [RGB color model](https://en.wikipedia.org/wiki/RGB_color_model) - Wikipedia article on RGB
