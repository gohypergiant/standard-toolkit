---
title: "@accelint/constants"
description: Shared constants, regular expressions, and type definitions for common patterns.
source: packages/constants/src/index.ts
source_sha: 3a165d8f4fcefdb569e96058bba87c59250d0703
doc_sha: 1bbb4599c0450094f2e5a7ebb6e530d2716ec103
deprecated: false
updated: 2026-07-13
---

# Constants

Shared constants, regular expressions, and type definitions for common patterns.

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

---

<!-- REFERENCE GUIDE - Remove this section in generated docs -->

## How to Use This Reference

This example shows the structure for **barrel export landing pages** — packages whose root `index.ts` only re-exports from sub-modules.

### What Makes This a Barrel Export

The source file (`packages/constants/src/index.ts`) contains only re-export statements:

```typescript
export { CSS_RGBA_LEGACY_REGEX, CSS_RGBA_MODERN_REGEX, HEX_REGEX } from './color';
export { DEFAULT_COORDINATE } from './coordinates';
export { DISTANCE_UNIT_SYMBOLS, DISTANCE_UNIT_BY_SYMBOL } from './units';
export type { DistanceUnit, DistanceUnitSymbol } from './units';
```

No implementation, no orchestration — just convenience re-exports.

### Structure to Match

**H1: Package Name**
- Short, friendly name (drop the `@accelint/` scope)
- Opening line: package.json description (1-2 sentences)

**Installation**
- Always use `pnpm` (project standard)
- Show full scoped name: `@accelint/package-name`

**Usage**
- Show 2-3 import patterns
- Include both root import and sub-module imports
- Use actual exported names from the source file
- Keep examples short and clear

**Available Exports Table**
- Two columns: Export Path (linked), Description
- One row per sub-export from package.json exports
- Link to detailed sub-module docs: `[sub-module](./sub-module/index.md)`
- Extract descriptions from:
  1. First sentence of existing sub-module docs (best)
  2. JSDoc comment on exported entities (good)
  3. Infer from name if no docs exist (fallback)

**Related**
- Link to related packages in monorepo
- Link to external docs if package.json has `homepage` field
- Keep minimal — this is navigation, not a guide

### Voice and Tone

**Direct and concise:**
- "Shared constants for X" not "This package provides shared constants for X"
- Lead with what it does, skip preamble
- Table-first navigation (not prose)

**What NOT to include:**
- No "Overview" section (opening line is sufficient)
- No "Core Concepts" (save for composed APIs)
- No "Best Practices" (that goes in sub-module docs)
- No extensive examples (show imports only)

### Detection Algorithm

Generate this style when the source file:
- Is a root `index.ts` file
- Only contains `export { X } from './path'` statements
- Has no classes, functions, or implementation code

If the file has orchestration logic (like `packages/bus/src/index.ts` with the `Broadcast` class), use comprehensive documentation instead.

### Adapting This Template

**Package description:** Extract from `package.json` description field

**Import examples:** Use actual exported names from source file

**Available Exports table:**
- Read package.json exports map for the list of sub-modules
- Check if corresponding docs exist: `apps/docs/content/packages/{package}/{sub-module}/index.mdx`
- Extract description from existing docs' frontmatter description or H1 content
- If no docs exist yet, infer from sub-module name (e.g., "color" → "Color utilities")

**Related links:**
- Scan package.json dependencies for other `@accelint/*` packages
- Check for `homepage` or `repository` fields
- Link to functionally related packages (converters ↔ constants, predicates ↔ validators)
