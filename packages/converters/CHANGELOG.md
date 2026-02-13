# @accelint/converters

## 1.0.0

### Major Changes

- 4550911: **Refactor color converters into tree-shakable submodules**

  ### @accelint/converters

  Split color conversion functionality into three dedicated submodule exports for better tree-shaking and explicit dependency management:

  **New exports:**
  - `@accelint/converters/css-rgba` - CSS RGBA format conversions (requires `@accelint/constants`, `@accelint/predicates`)
    - `cssRgbaStringToRgba255Tuple()` - Parse CSS rgba/rgb strings to deck.gl format
    - `rgba255TupleToCssRgbaString()` - Convert deck.gl format to CSS string
    - `cssRgbaTupleToRgba255Tuple()` - Convert CSS tuples (alpha 0-1) to deck.gl
    - `rgba255TupleToCssRgbaTuple()` - Convert deck.gl to CSS tuples
    - `cssRgbaObjectToRgba255Tuple()` - Convert CSS objects to deck.gl
    - `rgba255TupleToCssRgbaObject()` - Convert deck.gl to CSS objects
    - Type: `CssRgbaTuple`
  - `@accelint/converters/hex` - Hex color conversions (requires `@accelint/constants`, `@accelint/predicates`)
    - `hexToRgba255Tuple()` - Parse hex strings (#RGB, #RRGGBB, etc.) to deck.gl format
    - `rgba255TupleToHex()` - Convert deck.gl format to hex string
  - `@accelint/converters/glsl` - GLSL shader format conversions (requires `@accelint/math`)
    - `glslToRgba255Tuple()` - Convert GLSL format (0-1) to deck.gl (0-255)
    - `rgba255TupleToGlsl()` - Convert deck.gl (0-255) to GLSL format (0-1)
    - Type: `GlslRgbaTuple`

  All functions use explicit `Rgba255Tuple` naming to clarify the deck.gl format (all RGBA channels 0-255). The main package export re-exports all functions for convenience.

  **BREAKING CHANGES:**

  Removed the `/color` module and old function names. Functions are now organized into dedicated submodules:

  **Migration Guide:**

  ```typescript
  // Before
  import { hexToColor, colorToHex } from "@accelint/converters/color";

  // After - Option 1: Import from specific submodule
  import {
    hexToRgba255Tuple,
    rgba255TupleToHex,
  } from "@accelint/converters/hex";

  // After - Option 2: Import from main package
  import { hexToRgba255Tuple, rgba255TupleToHex } from "@accelint/converters";
  ```

  **Function name mappings:**
  - `hexToColor` → `hexToRgba255Tuple` (from `/hex`)
  - `colorToHex` → `rgba255TupleToHex` (from `/hex`)
  - `cssRgbaStringToColor` → `cssRgbaStringToRgba255Tuple` (from `/css-rgba`)
  - `colorToCssRgbaString` → `rgba255TupleToCssRgbaString` (from `/css-rgba`)
  - `cssRgbaObjectToColor` → `cssRgbaObjectToRgba255Tuple` (from `/css-rgba`)
  - `colorToCssRgbaObject` → `rgba255TupleToCssRgbaObject` (from `/css-rgba`)
  - `glslToColor` → `glslToRgba255Tuple` (from `/glsl`)
  - `colorToGlsl` → `rgba255TupleToGlsl` (from `/glsl`)

  **Type name changes:**
  - `Color` → `Rgba255Tuple` (exported from `@accelint/predicates/is-rgba-255-tuple`)

  **Type guards moved to predicates:**
  - `isColor` → `isRgba255Tuple` from `@accelint/predicates/is-rgba-255-tuple`
  - `isCssRgbaObject` → `isCssRgbaObject` from `@accelint/predicates/is-css-rgba-object`

  ### @accelint/predicates

  Add color format validation type guards:
  - `@accelint/predicates/is-rgba-255-tuple` - Validate deck.gl RGBA tuples (all channels 0-255)
  - `@accelint/predicates/is-hex-color` - Validate hex color strings
  - `@accelint/predicates/is-css-rgba-object` - Validate CSS RGBA objects (RGB 0-255, alpha 0-1)
  - `@accelint/predicates/is-css-rgba-string` - Validate CSS rgba/rgb strings (legacy & modern syntax)
  - `@accelint/predicates/is-valid-255-channel` - Validate individual channel values (0-255)

  Includes `Rgba255Tuple` and `CssRgbaObject` type exports.

  ### @accelint/constants

  Add color validation regex patterns:
  - `HEX_REGEX` - Match hex colors (#RGB, #RGBA, #RRGGBB, #RRGGBBAA)
  - `CSS_RGBA_LEGACY_REGEX` - Match comma-separated CSS colors
  - `CSS_RGBA_MODERN_REGEX` - Match space/slash-separated CSS colors

### Patch Changes

- Updated dependencies [4550911]
  - @accelint/constants@0.2.0

## 0.4.0

### Minor Changes

- a127300: Add comprehensive color conversion utilities with full CSS spec support. Convert between deck.gl tuples (0-255), GLSL tuples (0-1), CSS RGBA (string/tuple/object), and hex strings. Includes all hex formats (3, 4, 6, 8 character), modern and legacy CSS RGBA syntax, type guards, and lossless round-trip conversions. Optimized for performance with 97% test coverage.

## 0.3.6

### Patch Changes

- bb73a1e: Ensure dependencies all follow the same semver range across devtk, maptk, and designtk.
- Updated dependencies [bb73a1e]
  - @accelint/constants@0.1.9

## 0.3.5

### Patch Changes

- 34c42a0: Swap bundling to tsdown and auto generate exports entries in package.json.
- Updated dependencies [34c42a0]
  - @accelint/constants@0.1.8

## 0.3.4

### Patch Changes

- 0d697fa: Fixed definitions in package files for longhand repository definitions, while disabling the option in syncpack that changed it.
- f99f294: Updated syncpack and realigned all packages for dependency versions
- 935b8e5: Updated the package names in the Constellation configuration file.
- Updated dependencies [0d697fa]
- Updated dependencies [f99f294]
- Updated dependencies [935b8e5]
  - @accelint/constants@0.1.7

## 0.3.3

### Patch Changes

- 64280a7: - Released `@accelint/constellation-tracker` - A tool that helps maintain catalog-info.yaml files for Constellation integration
  - Ensures all packages include catalog-info.yaml in their published files for better discoverability and integration with Constellation
  - Provides automated tracking and updating of component metadata across the project
  - Enhanced package metadata to support better integration with internal tooling
- Updated dependencies [64280a7]
  - @accelint/constants@0.1.6

## 0.3.2

### Patch Changes

- 83104ea: Refactored ViewStack to be event driven, allowing for triggers anywhere in the app
- Updated dependencies [83104ea]
  - @accelint/constants@0.1.5

## 0.3.1

### Patch Changes

- Updated dependencies [ca3922a]
  - @accelint/constants@0.1.4

## 0.3.0

### Minor Changes

- ef11767: Adjust name for bounding box conversion

## 0.2.0

### Minor Changes

- 13f0d6c: The `toBoolean` function (packages/converters) centralizes the logic for coercing a value
  to a boolean which enables the predicate functions (packages/predicates/src/is-noyes) to
  be more specific in what they compare against rather than them simply being alias names
  to broad validation. The available predicates are now:
  - `isAnyFalsy`
  - `isAnyTruthy`
  - `isFalse`
  - `isTrue`
  - `isOn`
  - `isOff`
  - `isNo`
  - `isYes`

## 0.1.3

### Patch Changes

- f117ea6: Converted build step to use `tsup`.
- d39c5d8: Added explicit file extensions to relative path imports via esbuild plugin for tsup.
- Updated dependencies [f117ea6]
- Updated dependencies [d39c5d8]
  - @accelint/predicates@0.1.3
  - @accelint/constants@0.1.3

## 0.1.2

### Patch Changes

- 2c661d3: Standardized package.json "exports" field
- Updated dependencies [2c661d3]
  - @accelint/predicates@0.1.2
  - @accelint/constants@0.1.2

## 0.1.1

### Patch Changes

- 017c16e: Fixed publishing artifacts.
- Updated dependencies [017c16e]
  - @accelint/constants@0.1.1
  - @accelint/predicates@0.1.1

## 0.1.0

### Minor Changes

- eba7ce9: Initial release.

### Patch Changes

- Updated dependencies [eba7ce9]
  - @accelint/constants@0.1.0
  - @accelint/predicates@0.1.0
