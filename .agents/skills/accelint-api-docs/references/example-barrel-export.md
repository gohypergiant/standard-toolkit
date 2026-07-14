## Installation

```bash
pnpm add @accelint/constants
```

## Usage

```typescript
// Import from root (all exports)
import { CSS_RGBA_LEGACY_REGEX, DEFAULT_COORDINATE } from '@accelint/constants';

// Import from sub-modules
import { HEX_REGEX } from '@accelint/constants/color';
import { DISTANCE_UNIT_SYMBOLS } from '@accelint/constants/units';
```

## Available Exports

| Export Path | Description |
|-------------|-------------|
| [color](./color/index.md) | Regular expressions for validating CSS rgba() and hex color formats |
| [coordinates](./coordinates/index.md) | Default coordinate constants and types |
| [units](./units/index.md) | Distance unit symbols and type-safe mappings |

## Related

- [@accelint/converters](../converters/index.md) - Color format converters
- [@accelint/predicates](../predicates/index.md) - Validation predicates
