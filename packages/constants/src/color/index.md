---
title: Color Constants
description: Regex patterns for validating CSS color values in legacy and modern formats
source: packages/constants/src/color/index.ts
source_sha: d6cb28551a341a293027f2084e6e7f5c6c5cd467
doc_sha: bd48abdf53be28ece4e0030f6729fc6614e737ad
deprecated: false
updated: 2026-05-28
---

# Color Constants

Regex patterns for validating CSS rgba() and hex color strings in both legacy comma-separated and modern space-separated formats.

## Usage

```typescript
import { 
  CSS_RGBA_LEGACY_REGEX, 
  CSS_RGBA_MODERN_REGEX, 
  HEX_REGEX 
} from '@accelint/constants';

// Validate legacy CSS rgba format
const isValidLegacy = CSS_RGBA_LEGACY_REGEX.test('rgba(255, 128, 64, 0.5)');

// Validate modern CSS rgba format
const isValidModern = CSS_RGBA_MODERN_REGEX.test('rgb(255 128 64 / 0.5)');

// Validate hex color
const isValidHex = HEX_REGEX.test('#ff8040');
```

## Reference

### CSS_RGBA_LEGACY_REGEX

```typescript
const CSS_RGBA_LEGACY_REGEX: RegExp
```

Matches legacy comma-separated CSS color syntax: `rgb(r, g, b)` or `rgba(r, g, b, a)`.

**Supported formats:**
- Integer values: `rgb(255, 128, 64)` or `rgba(255, 128, 64, 0.5)`
- Percentage values: `rgb(100%, 50%, 25%)` or `rgba(100%, 50%, 25%, 50%)`
- Decimal values: `rgb(255.5, 128.2, 64.8)` or `rgba(255, 128, 64, 0.75)`
- Optional alpha: `rgb(255, 128, 64)` or `rgba(255, 128, 64, 1)`

> **Good to know:** This regex is case-insensitive and accepts whitespace around values.

### CSS_RGBA_MODERN_REGEX

```typescript
const CSS_RGBA_MODERN_REGEX: RegExp
```

Matches modern space-separated CSS color syntax: `rgb(r g b)` or `rgb(r g b / a)`.

**Supported formats:**
- Integer values: `rgb(255 128 64)` or `rgb(255 128 64 / 0.5)`
- Percentage values: `rgb(100% 50% 25%)` or `rgb(100% 50% 25% / 50%)`
- Decimal values: `rgb(255.5 128.2 64.8)` or `rgb(255 128 64 / 0.75)`
- Optional alpha with slash separator: `rgb(255 128 64)` or `rgb(255 128 64 / 1)`

> **Good to know:** This regex follows the CSS Color Module Level 4 specification using space separators and `/` for alpha.

### HEX_REGEX

```typescript
const HEX_REGEX: RegExp
```

Matches hexadecimal color codes with or without the `#` prefix.

**Supported formats:**
- 3-digit shorthand: `#RGB` or `RGB` (e.g., `#f80`, `abc`)
- 4-digit with alpha: `#RGBA` or `RGBA` (e.g., `#f808`, `abcd`)
- 6-digit full: `#RRGGBB` or `RRGGBB` (e.g., `#ff8040`, `aabbcc`)
- 8-digit with alpha: `#RRGGBBAA` or `RRGGBBAA` (e.g., `#ff804080`, `aabbccdd`)

> **Good to know:** This regex is case-insensitive and accepts both uppercase and lowercase hex digits.

## Examples

### Example: Validating legacy CSS rgba values

```typescript
import { CSS_RGBA_LEGACY_REGEX } from '@accelint/constants';

// Valid formats
CSS_RGBA_LEGACY_REGEX.test('rgb(255, 128, 64)');         // true
CSS_RGBA_LEGACY_REGEX.test('rgba(255, 128, 64, 0.5)');   // true
CSS_RGBA_LEGACY_REGEX.test('RGB(100%, 50%, 25%)');       // true
CSS_RGBA_LEGACY_REGEX.test('rgba(255.5, 128, 64, 1)');   // true

// Invalid formats
CSS_RGBA_LEGACY_REGEX.test('rgb(255 128 64)');           // false (no commas)
CSS_RGBA_LEGACY_REGEX.test('rgb(255, 128)');             // false (missing value)
```

### Example: Validating modern CSS rgba values

```typescript
import { CSS_RGBA_MODERN_REGEX } from '@accelint/constants';

// Valid formats
CSS_RGBA_MODERN_REGEX.test('rgb(255 128 64)');           // true
CSS_RGBA_MODERN_REGEX.test('rgb(255 128 64 / 0.5)');     // true
CSS_RGBA_MODERN_REGEX.test('RGB(100% 50% 25%)');         // true
CSS_RGBA_MODERN_REGEX.test('rgba(255 128 64 / 1)');      // true

// Invalid formats
CSS_RGBA_MODERN_REGEX.test('rgb(255, 128, 64)');         // false (commas)
CSS_RGBA_MODERN_REGEX.test('rgb(255 128)');              // false (missing value)
```

### Example: Validating hex colors

```typescript
import { HEX_REGEX } from '@accelint/constants';

// Valid formats
HEX_REGEX.test('#ff8040');      // true (6-digit with #)
HEX_REGEX.test('ff8040');       // true (6-digit without #)
HEX_REGEX.test('#f80');         // true (3-digit shorthand)
HEX_REGEX.test('#ff804080');    // true (8-digit with alpha)
HEX_REGEX.test('#f808');        // true (4-digit with alpha)

// Invalid formats
HEX_REGEX.test('#ff80');        // false (invalid length)
HEX_REGEX.test('gggggg');       // false (invalid hex characters)
```

### Example: Extracting color values

```typescript
import { CSS_RGBA_LEGACY_REGEX } from '@accelint/constants';

const color = 'rgba(255, 128, 64, 0.5)';
const match = color.match(CSS_RGBA_LEGACY_REGEX);

if (match) {
  const [, r, g, b, a] = match;
  console.log({ r, g, b, a }); // { r: '255', g: '128', b: '64', a: '0.5' }
}
```

### Example: Color parser utility

```typescript
import { 
  CSS_RGBA_LEGACY_REGEX, 
  CSS_RGBA_MODERN_REGEX, 
  HEX_REGEX 
} from '@accelint/constants';

function parseColor(input: string): { format: string; valid: boolean } {
  if (CSS_RGBA_LEGACY_REGEX.test(input)) {
    return { format: 'legacy-rgba', valid: true };
  }
  if (CSS_RGBA_MODERN_REGEX.test(input)) {
    return { format: 'modern-rgba', valid: true };
  }
  if (HEX_REGEX.test(input)) {
    return { format: 'hex', valid: true };
  }
  return { format: 'unknown', valid: false };
}

parseColor('rgba(255, 128, 64, 0.5)');  // { format: 'legacy-rgba', valid: true }
parseColor('rgb(255 128 64)');          // { format: 'modern-rgba', valid: true }
parseColor('#ff8040');                  // { format: 'hex', valid: true }
```

## Related

<!-- Auto-generated from imports -->
<!-- Add manual links below -->
