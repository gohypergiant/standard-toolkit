---
name: accelint-api-docs
description: Generate and maintain TypeScript/React API reference documentation in markdown. TRIGGER when user mentions documenting code, API docs, "add docs for X", updating/validating docs, or working with fumadocs/Storybook. Handles all API reference documentation for functions, components, hooks, classes, and constants. If TypeScript/React code needs documentation, use this skill.
compatibility:
  required_permissions:
    - Read: "**/.claude/skills/accelint-api-docs/references/*.md"
    - Write: "apps/docs/content/ (or custom outputDir)"
    - Bash: "git hash-object (for SHA tracking, optional)"
  graceful_degradation:
    - "Without Bash: skips source_sha/doc_sha fields, uses file mtimes"
    - "Without Read: cannot load reference examples, structure may vary"
  parameters:
    - outputDir: "Output directory (default: apps/docs/content)"
---

# API Documentation Generation

Generate and maintain comprehensive markdown API documentation for TypeScript/React code. You are a drafting assistant helping engineers create consistent, maintainable API reference documentation.

---

## Contents

**Core Workflows:**
- [Philosophy & Role](#philosophy--role)
- [Generate Documentation](#generate-documentation)
- [Update Documentation](#update-documentation)
- [Validate Documentation](#validate-documentation)

**Guidance:**
- [How Reference Examples Work](#how-reference-examples-work)
- [Entity Type Detection](#entity-type-detection)
- [SHA Tracking System](#sha-tracking-system)
- [Writing Style Rules](#writing-style-rules)
- [Internal Export Handling](#internal-export-handling)
- [Fumadocs Folder Structure Rules](#fumadocs-folder-structure-rules)

**Advanced Topics:**
- CI/CD integration → [ci-cd.md](references/ci-cd.md)
- Troubleshooting → [troubleshooting.md](references/troubleshooting.md)
- Batch operations → [advanced.md](references/advanced.md)
- Testing guide → [testing.md](references/testing.md)

---

## Philosophy & Role

**Engineers maintain the documentation. You assist.**

Your role:
1. **Draft initial content** from source code, JSDoc, and tests
2. **Suggest updates** when code changes
3. **Validate quality** (links, structure, freshness)

All generated content is editable markdown. Engineers can freely customize—you adapt to their patterns rather than enforcing rigid templates.

### When to Ask for Confirmation

**Always prompt:**
- Multi-export files: "Document: [All] [EntityName only] [Custom selection]"
- Existing docs found: "[U]se as reference [I]gnore"
- Update will affect manual edits: Show diff, "[A]pply [S]kip [E]dit"

**Proceed directly:**
- Single export, no existing docs: Generate and write
- Validation without --fix: Report findings only
- Entity detection with high confidence: Generate after brief confirmation

---

## How Reference Examples Work

**Reference examples over templates.** This skill uses 6 gold-standard examples showing both structure AND writing style:

- `references/example-function.md` - Curried functions with generics
- `references/example-component.md` - React components with multi-part patterns
- `references/example-hook.md` - Type-safe hooks with generics
- `references/example-class.md` - Classes with singleton patterns
- `references/example-constant.md` - Frozen object patterns (SafeEnum)
- `references/example-barrel-export.md` - Barrel export landing pages (lightweight navigation)

### How to Use Reference Examples

**Match these aspects:**
- Section structure: ## Usage → ## Reference → ## Examples → ## Related
- Voice and tone: direct, imperative, no preamble
- Code-first approach: show usage before explaining
- Body starts with ## (H2), never # (H1) - frontmatter title/description provide the H1

**Adapt these aspects:**
- Depth based on API complexity
- Number of examples based on use cases
- Level of detail in reference section

**CRITICAL**: Reference examples have been updated to remove duplicate H1/description from the body. All reference files now start directly with `## Usage` (or `## Installation` for barrel exports). The frontmatter `title` and `description` fields are the single source of truth - they are rendered by the docs framework as the page H1 and intro text. Never add an H1 or duplicate description in the body.

Pattern match from these examples—they demonstrate the target quality level.

---

## Generate Documentation

When the user asks to document a file, follow this workflow.

### Parameters

- `outputDir` (optional): Directory to write generated docs. Default: `apps/docs/content`
- If provided as argument or from context, use it; otherwise use default

### Step-by-Step Process

**1. Read and analyze the source**
   - Read the source file completely
   - Read any colocated test files (`*.test.ts`, `*.test.tsx`) for usage examples
   - Exclude test files and directories from documentation output:
     - Skip `*.test.ts`, `*.test.tsx` files
     - Skip `__tests__/`, `__mocks__/` directories
   - Read existing documentation if present (`.md`, `.docs.mdx`, `README.md`)

**2. Detect package section**
   - Extract package name from source path (e.g., `packages/logger/` → `logger`)
   - Map to section using these rules:
     - `design-toolkit`, `map-toolkit` → `toolkits/`
     - `postcss-tailwind-css-modules`, `biome-config`, `eslint-config`, `prettier-config`, `smeegl`, `typescript-config`, `vitest-config` → `tooling/`
     - All other packages (including `design-foundation`) → `packages/`
   - Strip `@accelint/` scope if present (e.g., `@accelint/logger` → `logger`)

**3. Detect barrel export vs composed API**
   - **Barrel export**: File only contains re-export statements (`export { X } from './path'`)
   - **Composed API**: File contains actual implementation (classes, functions, orchestration)
   - For root `index.ts` files:
     - If barrel export → generate lightweight landing page (see Barrel Export Detection)
     - If composed API → generate comprehensive documentation (see Common Patterns)
   - **Examples**:
     - Barrel: `packages/constants/src/index.ts` (just re-exports from sub-modules)
     - Composed: `packages/bus/src/index.ts` (exports Broadcast class with orchestration)

**4. Classify exports**
   - Identify all exported entities
   - Classify each: Function, Component, Hook, Class, Constant
   - Skip internal exports (prefixed with `_`, marked `@internal`, in `/internal/` directories)
   - For multi-export files, ask: "Document: [All] [EntityName only] [Custom selection]"

**5. Load matching reference example**
   - Function → read `references/example-function.md`
   - Component → read `references/example-component.md`
   - Hook → read `references/example-hook.md`
   - Class → read `references/example-class.md`
   - Constant → read `references/example-constant.md`
   - Barrel export → read `references/example-barrel-export.md`

**6. Generate markdown content**
   - Follow the reference example structure exactly
   - Extract information from source (don't infer or hallucinate)
   - Use direct imperative voice ("Returns the filtered array")
   - Name examples by use case ("Example: Filtering null values")
   - Keep prose concise—show code first, explain after

**7. Compute source_sha before generating content**
   - Run `git hash-object <source-file>` to get the current source file hash
   - Store this value to use in frontmatter

**8. Generate markdown content with frontmatter**
   - Follow the reference example structure exactly
   - Extract information from source (don't infer or hallucinate)
   - Use direct imperative voice ("Returns the filtered array")
   - Name examples by use case ("Example: Filtering null values")
   - Keep prose concise—show code first, explain after
   - Add frontmatter at the top:
   ```yaml
   ---
   title: "<entity-name or descriptive-title>"
   description: One sentence describing what it does
   source: relative/path/to/source.ts
   source_sha: <value from step 7>
   doc_sha: pending
   deprecated: false
   updated: YYYY-MM-DD
   ---
   ```
   - **Title Convention**: The title field MUST use export names, NOT deep import paths:
     - **For package index.mdx files** (`packages/X/src/index.ts`): Use full package name
       - Example: `"@accelint/predicates"`, `"@accelint/temporal"`, `"@accelint/core"`
     - **For sub-page files** (any other file): Use the primary export name(s) from the source file
       - Single export: Use the export name exactly as it appears in code
         - `export const isIn = ...` → `"isIn"`
         - `export function Button() { ... }` → `"Button"`
         - `export class Broadcast { ... }` → `"Broadcast"`
       - Multiple related exports: Use EITHER a descriptive group name OR list primary exports
         - Multiple utility functions → Descriptive category: `"Array Utilities"`, `"Timers"`, `"Color Constants"`
         - Complementary pair → List both: `"isIn & isNotIn"`, `"Radio & RadioGroup"`
         - Multiple hooks → Group name: `"React Hooks"`, `"Worker Utilities"`
       - **Never include slashes** (/) in sub-page titles — titles should match what developers type in code, not import paths
     - **Examples** (CORRECT ✅):
       - `packages/predicates/src/index.ts` → `"@accelint/predicates"` (package index)
       - `packages/predicates/src/is-in/index.ts` → `"isIn"` (single export)
       - `packages/bus/src/react/index.ts` → `"React Hooks"` (multiple hooks: useBus, useEmit, useOn)
       - `packages/temporal/src/timers/index.ts` → `"Timers"` (multiple related: setClockInterval, setClockTimeout)
       - `toolkits/design-toolkit/src/button/index.tsx` → `"Button"` (single component)
       - `toolkits/design-toolkit/src/radio/index.tsx` → `"Radio & RadioGroup"` (complementary components)
     - **Examples** (INCORRECT ❌ — DO NOT USE):
       - ❌ `"@accelint/predicates/is-in"` — Never use deep paths for sub-pages
       - ❌ `"@accelint/temporal/timers"` — Never use deep paths for sub-pages
       - ❌ `"@accelint/core/array/map"` — Never use deep paths for sub-pages
     - **Why this matters**: Users import by export name (`import { isIn } from '@accelint/predicates'`), not by path. Titles should match what developers type in code. Deep paths suggest incorrect import patterns and create confusing documentation structure.
   - Set `deprecated: true` if source has `@deprecated` JSDoc tag
   - Set `doc_sha: pending` as a placeholder (will be computed after writing)

**9. Validate markdown quality**
   - Body should start with H2 (##), NOT H1 (#) - frontmatter title becomes the page H1
   - Do not include duplicate description paragraph after frontmatter - frontmatter description is rendered in page header
   - Add language tags to code fences
   - Convert bare URLs to markdown links
   - Check that examples have descriptive names

**10. Write file and compute doc_sha**
   - Compute output path: `{outputDir}/{section}/{package-name}/{relative-path}.mdx`
   - Preserve source directory structure directly (no `/api/` subdirectory)
   - Examples:
     - `packages/logger/src/index.ts` → `apps/docs/content/packages/logger/index.mdx`
     - `packages/logger/src/plugins/callsite.ts` → `apps/docs/content/packages/logger/plugins/callsite.mdx`
     - `toolkits/design-toolkit/src/Button.tsx` → `apps/docs/content/toolkits/design-toolkit/Button.mdx`
   - **IMPORTANT: Fumadocs Folder Conventions**
     - Fumadocs treats folders as navigation dropdowns
     - **ONLY create folders when there are MULTIPLE child pages** (2+ .mdx files)
     - **For single pages, use flat .mdx files** (NOT folder/index.mdx)
     - ❌ **Bad**: `packages/bus/broadcast/index.mdx` (creates empty dropdown)
     - ✅ **Good**: `packages/bus/broadcast.mdx` (creates direct page link)
     - Exception: Packages with sub-modules (like `core/array/`, `core/logical/`) should use folders when they have an overview page PLUS multiple child pages
     - Before creating a folder, count documentation pages that will be generated:
       - If count === 1: create flat .mdx file at parent level
       - If count >= 2: create folder with index.mdx overview + child pages
   - Create directories if they don't exist (use mkdir -p)
   - Single export: Write to computed path following fumadocs conventions
   - Multi-export: Write single file with H2 sections per entity
   - **IMMEDIATELY after writing**, compute `doc_sha`:
     ```bash
     # Extract content after frontmatter, hash it
     awk '/^---$/{if(++count==2){flag=1;next}}flag' <output-file> | git hash-object --stdin
     ```
   - Update the file's frontmatter, replacing `doc_sha: pending` with the computed hash

**11. Update or create meta.json for parent directory**
   - **CRITICAL**: Fumadocs requires explicit `meta.json` files to include flat `.mdx` files in navigation
   - After writing the documentation file, check the parent directory for a `meta.json` file
   - Get parent directory: `dirname <output-file>`
   - List all items (folders and flat .mdx files) in parent directory:
     ```bash
     # List folders (directories)
     find <parent-dir> -maxdepth 1 -type d ! -name '.' ! -name '..' -exec basename {} \;
     # List flat .mdx files (remove .mdx extension)
     find <parent-dir> -maxdepth 1 -name '*.mdx' -type f -exec basename {} .mdx \;
     ```
   - Sort items alphabetically
   - Check if `meta.json` exists in parent directory:
     - **If exists**: Read it, verify all items are in `pages` array, add missing items alphabetically
     - **If not exists**: Create new `meta.json` with all items in alphabetical order
   - Format:
     ```json
     {
       "title": "<Section Title>",
       "pages": [
         "item1",
         "item2",
         "flat-file",
         "item3"
       ]
     }
     ```
   - **Title mapping**:
     - `packages/` → "Packages"
     - `toolkits/` → "Toolkits"
     - `tooling/` → "Tooling"
     - Nested folders: Use capitalized folder name
   - **Important**: Without this step, flat `.mdx` files won't appear in sidebar navigation

**12. Update tracking index**

**12. Update tracking index**
   - Read `apps/docs/.index.json`
   - Update or append entry with: source, doc, entities, source_sha, doc_sha, updated (ISO 8601 timestamp)
   - Use the computed `doc_sha` from step 10 (NOT "pending")
   - Update `generated` timestamp to current time
   - Write back to `apps/docs/.index.json`
   - Keep entries sorted by source path for clean diffs

---

## Update Documentation

When the user asks to update docs after code changes, follow this workflow.

### Step-by-Step Process

**1. Detect changed files**
   ```bash
   # Default: git diff main...HEAD --name-only
   # Filter to source files (.ts, .tsx)
   ```

**2. Lookup affected docs**
   - Read `apps/docs/.index.json`
   - Find entries where `source` matches changed files
   - Validate mapping (detect moved/deleted files)

**3. For each stale doc:**
   
   a. **Analyze what changed in source**
      - Compare `source_sha` in frontmatter to current HEAD
      - Run: `git diff <source_sha> HEAD -- <source-file>`
      - Understand nature of change: new param? behavior change? deprecation?
   
   b. **Detect manual edits to docs**
      - Hash current doc content (excluding frontmatter)
      - Compare to `doc_sha` in frontmatter
      - If different: user manually edited docs, preserve their changes
   
   c. **Generate update suggestion**
      - Read reference example for entity type
      - Read current doc completely
      - Identify affected sections only (don't rewrite entire doc)
      - Draft changes preserving manual edits and established voice
   
   d. **Present inline diff**
      - Show before/after for changed sections
      - Prompt: `[A]pply [S]kip [E]dit [D]iff [Q]uit`
      - Apply: write file, update SHAs, update mapping
      - Skip: leave unchanged (will re-suggest next time)
      - Edit: let user modify suggestion before applying
      - Diff: show full git-style diff
      - Quit: stop update process

**4. Batch updates**
   - Process all stale docs sequentially
   - Checkpoint after each successful update
   - Log failures to `/ACCELINT_API_DOCS_ERRORS.log`

---

## Validate Documentation

When the user asks to validate docs, follow this workflow.

### Six Validation Checks

**1. Mapping Accuracy**
   - Source files in mapping exist
   - Doc files in mapping exist
   - Report orphaned docs (source deleted)
   - Report undocumented exports (source exists, no doc)

**2. SHA Staleness**
   - Compare `source_sha` to current HEAD
   - Report how many commits behind
   - Warning level: stale docs don't fail validation unless `--strict`

**3. Broken Cross-References**
   - Parse markdown links: `[text](../path/to/file.md)`
   - Verify linked files exist
   - Suggest fixes when files moved

**4. Missing Frontmatter**
   - Required fields: title, description, source, source_sha, doc_sha, updated
   - Error if any missing

**5. Structural Issues**
   - Body should start with H2 (##), NOT H1 (#) - frontmatter title becomes the page H1
   - Verify body does NOT contain duplicate description paragraph (frontmatter description is rendered in page header)
   - Verify code fences have language tags
   - Check for bare URLs (should be markdown links)

**6. Multi-Source Document Detection** 🆕
   - Scan doc content for H2 sections (each H2 typically = one function)
   - Parse frontmatter `source` field (should reference ONE file)
   - Count documented functions vs source file
   - **If mismatch detected**: ERROR "Document appears to cover multiple source files"
   - **Check for**: Multiple `import` statements from different predicate/utility paths
   - **Recommendation**: Split into separate docs OR add frontmatter comment documenting all sources
   - **Why this matters**: SHA tracking and update workflows require 1:1 mapping

### Flags

- `--fix`: Auto-fix orphaned docs (delete), mapping issues (update), structural issues
- `--strict`: Treat warnings (stale SHAs) as errors

### Exit Codes

- 0 = all valid
- 1 = warnings (stale SHAs, structural issues)
- 2 = errors (broken links, orphaned docs, missing frontmatter)

---

## Entity Type Detection

When analyzing source code, classify exports based on their patterns:

### Classification Rules

**Function**: `export function` or `export const = () =>`
- Returns a value, not JSX
- May be curried or take parameters

**Component**: Returns JSX, uses hooks, or has `props` parameter
- Check for JSX return type
- Look for React hooks usage
- Check for props parameter with TypeScript interface

**Hook**: Name starts with `use`, returns object/array
- Must follow React hook naming convention
- Returns stateful values or handlers

**Class**: `export class`
- May have constructor, methods, properties
- Check for singleton pattern (getInstance)

**Constant**: `export const` with primitive/frozen object
- Frozen with Object.freeze() or as const
- SafeEnum pattern (value object + type)

### Decision Tree

1. Analyze source, propose classification
2. **If confidence high** (clear patterns): "Detected: Button (Component). Proceed?"
3. **If confidence low**: "This could be a Component or Factory Function. Which is it?"
4. **If multi-export**: Show all classifications, ask: [All] [Custom selection]

Report: "Detected: Button (Component), useButton (Hook), BUTTON_SIZES (Constant)"

---

## SHA Tracking System

The dual-SHA system enables smart updates that preserve manual edits.

### Understanding SHA Tracking

**source_sha**: Hash of source file at time docs were generated
- Tracks which version of code was documented
- Run: `git hash-object <source-file>`
- Enables staleness detection

**doc_sha**: Hash of documentation content (excluding frontmatter)
- Tracks whether docs were manually edited
- Generate from markdown content only
- Enables three-way merge

### Three-Way Merge Logic

```
IF doc_sha matches current doc content:
  → No manual edits, safe to regenerate affected sections
ELSE:
  → Manual edits detected, preserve prose and merge code changes carefully
```

**When updating:**
1. Compare `source_sha` to current HEAD → what changed in code
2. Compare `doc_sha` to current doc → whether user edited docs
3. If user edited: preserve their prose, only update code-related changes
4. If user didn't edit: regenerate affected sections from code

### Graceful Degradation

Without git/bash access:
- Skip SHA fields in frontmatter
- Use file modification times for staleness
- Less precise but still functional

---

## Writing Style Rules

Follow these patterns from the reference examples:

1. **Lead with what it does** - No preamble, no "This is a...", just direct description
2. **Show code immediately** - Usage section comes before Reference section
3. **Name examples by use case** - "Example: Filtering null values" not "Example 1"
4. **Direct imperative voice** - "Returns the filtered array" not "This function returns..."
5. **Standard markdown only** - Must work in GitHub, Storybook, fumadocs
6. **Edge cases in callouts** - Use `> **Good to know:**` for gotchas

### Common Sections Structure

**All entity types:**
- **Frontmatter** (title, description, source, etc.) - rendered as page H1 and meta description
- **## Usage** - Minimal working example (body starts here, NO H1 in body)
- **## Reference** - Type signatures, parameters, returns
- **## Examples** - Named by use case ("### Example: Use case name")
- **## Related** - Auto-generated from imports + manual additions

**IMPORTANT**: Do NOT include an H1 (`#`) or duplicate description paragraph in the body. The frontmatter `title` and `description` fields are rendered by the docs framework as the page H1 and intro text. Body content should start immediately with `## Usage`.

**Components:**
- Props table with Type, Default, Required columns
- Complex props get H4 subsections under Reference
- JSX examples with realistic prop combinations

**Functions:**
- Show curried usage patterns clearly
- Parameter descriptions inline with types
- Generic type parameters explained

**Hooks:**
- Show setup and teardown patterns
- Event handler examples
- Type safety patterns with generics

**Classes:**
- Constructor parameters
- Public methods grouped logically
- Singleton patterns highlighted

**Constants:**
- Available values listed
- Type usage examples
- Integration with related APIs

---

## Internal Export Handling

Skip by default:
- `@internal` JSDoc tag
- `_` prefix (naming convention)
- `/internal/` or `/__tests__/` directories
- `__private-exports` comment at file top

User can request `--internal` flag to include these.

**Type/interface documentation:**
Types and interfaces are NOT documented as standalone entities. Rationale:
- LSP provides inline type information
- TypeScript definition files already document types
- Reduces scope, keeps skill focused on executable APIs

---

## Fumadocs Folder Structure Rules

**Critical Rule**: Only create folders when there are multiple child pages. Fumadocs treats folders as navigation dropdowns.

### The Problem

Fumadocs automatically converts folder structures into navigation:
- **Folder with multiple files** → Creates dropdown menu with child pages (desired)
- **Folder with single index.mdx** → Creates empty dropdown with just the folder page (undesired)
- **Flat .mdx file** → Creates direct page link (desired for single pages)

### Decision Rules

**Before generating documentation for a package/module:**

1. **Count how many documentation pages will be generated**
   - Count exported entities that will become pages
   - Don't count the package overview (index.mdx)
   
2. **Apply the folder rule:**
   - **If 0-1 child pages**: Use flat file structure
   - **If 2+ child pages**: Use folder structure with index.mdx overview

### Examples

✅ **Good: Flat structure for single pages**
```
packages/bus/
├── index.mdx          # Package overview
├── broadcast.mdx      # Single export - flat file
└── react.mdx          # Single export - flat file
```

❌ **Bad: Empty dropdowns**
```
packages/bus/
├── index.mdx
├── broadcast/
│   └── index.mdx      # Only file - creates empty "broadcast" dropdown
└── react/
    └── index.mdx      # Only file - creates empty "react" dropdown
```

✅ **Good: Folder with multiple children**
```
packages/core/array/
├── index.mdx          # Overview of array utilities
├── map.mdx            # Child page 1
├── filter.mdx         # Child page 2
├── reduce.mdx         # Child page 3
└── find.mdx           # Child page 4
```
This creates a useful "array" dropdown with 5 pages total.

✅ **Good: Single-page package**
```
packages/
└── icons.mdx          # NOT icons/index.mdx
```

### Source-to-Doc Path Mapping

**Rule**: Strip `/src/` from source path, count child pages, then apply folder rule.

**Examples:**

1. **Single export package** (`@accelint/icons`)
   - Source: `packages/icons/src/index.ts` (only exports Icon component)
   - Doc path: `packages/icons.mdx` (flat file, no folder)
   
2. **Package with multiple sibling exports** (`@accelint/bus`)
   - Source: `packages/bus/src/index.ts` (exports Broadcast)
   - Source: `packages/bus/src/react/index.ts` (exports useBroadcast)
   - Doc paths:
     - `packages/bus/index.mdx` (overview)
     - `packages/bus/broadcast.mdx` (flat file)
     - `packages/bus/react.mdx` (flat file)
   - **NOT** `packages/bus/broadcast/index.mdx`

3. **Package with sub-module having multiple exports** (`@accelint/core/array`)
   - Source: `packages/core/src/array/map.ts`
   - Source: `packages/core/src/array/filter.ts`
   - Source: `packages/core/src/array/reduce.ts`
   - Doc paths:
     - `packages/core/index.mdx` (core package overview)
     - `packages/core/array/index.mdx` (array sub-module overview)
     - `packages/core/array/map.mdx` (child page)
     - `packages/core/array/filter.mdx` (child page)
     - `packages/core/array/reduce.mdx` (child page)
   - This creates a valid dropdown because array/ has 3+ child pages

4. **Package with nested single export** (`@accelint/map-toolkit/deckgl`)
   - Source: `toolkits/map-toolkit/src/deckgl/base-map.tsx` (only file in deckgl/)
   - Doc path: `toolkits/map-toolkit/deckgl/base-map.mdx` (flat file)
   - **NOT** `toolkits/map-toolkit/deckgl/base-map/index.mdx`

### Implementation Checklist

When generating docs:

- [ ] Count exports before creating folder structure
- [ ] If package has 1 export total → flat file at package level
- [ ] If sub-module has 1 export → flat file at sub-module level  
- [ ] If sub-module has 2+ exports → folder with index + children
- [ ] Never create folder/index.mdx for single pages
- [ ] Apply rules recursively at every nesting level

### Verification

After generation, check that no empty dropdowns exist:

```bash
find apps/docs/content/docs/{tooling,packages,toolkits} -type d -exec sh -c '
  count=$(find "$1" -maxdepth 1 -name "*.mdx" | wc -l)
  if [ "$count" -eq 1 ]; then
    index="$1/index.mdx"
    if [ -f "$index" ]; then
      echo "ERROR: Single-file folder: $1"
    fi
  fi
' sh {} \;
```

Should return no output if structure is correct.

---

## Integration with Existing Docs

### Using Existing Docs as Reference

When generating, check for existing docs:
- Same directory: `ComponentName.docs.mdx`, `ComponentName.md`, `README.md`
- Parent directories: `../../documentation/`

If found, prompt: `"Found existing docs. [U]se as reference [I]gnore"`

If "Use as reference":
- Read existing content completely
- Extract useful sections (examples, edge cases, gotchas)
- Incorporate into new structure following reference examples
- Cite source: `<!-- Referenced: TextField.docs.mdx for examples -->`

### Storybook Integration

Shared source, parallel rendering:
- Generate `.md` file (prose, reference material)
- Engineers manually create `.docs.mdx` once (Storybook wrapper)
- Wrapper imports `.md` content + adds Canvas/Controls

Example `.docs.mdx`:
```mdx
import { Meta, Canvas, Controls } from '@storybook/blocks';
import Content from './index.md';
import * as Stories from './Button.stories';

<Meta of={Stories} />
<Content />
<Canvas of={Stories.Default} />
```

---

## Deprecation Handling

Auto-detect `@deprecated` JSDoc tags and generate a callout at the start of the body (after frontmatter):

```markdown
---
title: "oldMap"
description: Legacy map implementation
deprecated: true
---

> **Deprecated**: This function is deprecated since v2.0.0. Use [map](../map/index.md) instead.

## Usage
...
```

**IMPORTANT**: No H1 in body - frontmatter title becomes the page H1. Deprecation notice appears before `## Usage`.

Set `deprecated: true` in frontmatter.

---

## Barrel Export Detection

**Barrel exports** are root `index.ts` files that only re-export from sub-modules:

```typescript
// Barrel export - just re-exports
export { CSS_RGBA_LEGACY_REGEX } from './color';
export { DEFAULT_COORDINATE } from './coordinates';
```

**Composed APIs** contain orchestration logic or implementation:

```typescript
// Composed API - has implementation
export { Broadcast } from './broadcast';  // Class with logic
export { CONNECTION_EVENT_TYPES } from './broadcast/constants';
```

### Detection Algorithm

1. Read source file
2. Strip comments, imports, type exports
3. Check if all remaining exports are re-export statements (`export { X } from './path'`)
4. If yes AND file is a root `index.ts` → **barrel export** (use `references/example-barrel-export.md`)
5. If no OR contains implementation → **composed API** or regular entity (use appropriate reference)

**When ambiguous:** Ask user: "This looks like a [barrel export / composed API]. Generate [landing page / full docs]?"

---

## Common Patterns

### Multi-Export Files

**CRITICAL DISTINCTION**: This pattern applies ONLY to a SINGLE source file that exports MULTIPLE entities.

**✅ CORRECT application** (ONE file with multiple exports):
```typescript
// packages/core/src/array/index.ts exports map, filter, reduce
export function map<T, R>(fn: (val: T) => R) { ... }
export function filter<T>(fn: (val: T) => boolean) { ... }
export function reduce<T, R>(fn: (acc: R, val: T) => R) { ... }
```
→ Generate ONE doc with H2 sections for each function

**❌ INCORRECT application** (multiple separate files):
```typescript
// packages/predicates/src/is-latitude/index.ts
export function isLatitude() { ... }

// packages/predicates/src/is-longitude/index.ts  
export function isLongitude() { ... }

// packages/predicates/src/is-bbox/index.ts
export function isBbox() { ... }
```
→ **DO NOT merge these into one doc**. Generate THREE separate docs.

**The rule**: Each source file gets its own documentation file. Preserve the 1:1 mapping.

**Why this matters**:
1. SHA tracking requires one source file per doc
2. Update workflows expect 1:1 mapping
3. Source structure should map to doc structure
4. Discovery: developers search by function name, expect dedicated pages

**When you have ONE multi-export file**, generate one markdown with ## (H2) sections for each export:

```markdown
---
title: "Array Utilities"
description: Functional array operations
source: packages/core/src/array/index.ts
---

## map
{Documentation for map}

## filter
{Documentation for filter}
```

**IMPORTANT**: No H1 in body - frontmatter title becomes the page H1. Body starts with `## map` (H2).

Later, engineers can split manually if one entity needs extensive docs.

**Exception handling**:
- If user explicitly requests grouping separate files, ask for confirmation
- Warn about SHA tracking limitations
- Document all source files in frontmatter comments

### Curried Functions

Show both partial application and full usage:

```typescript
// Partial application
const double = map(x => x * 2);
double([1, 2, 3]); // [2, 4, 6]

// Direct usage
map(x => x * 2)([1, 2, 3]); // [2, 4, 6]
```

### Generic Type Parameters

Explain what each generic represents:

```markdown
#### Type Parameters

- `T` - The type of array elements
- `R` - The return type of the mapping function
```

### Singleton Classes

Highlight the pattern explicitly:

```markdown
Broadcast is a singleton. Use `Broadcast.getInstance()` to access the shared instance across your application.
```

---

## Related Section (Hybrid Approach)

```markdown
## Related

<!-- Auto-generated from imports -->
- [filter](../filter/index.md)
- [reduce](../reduce/index.md)

<!-- Add manual links below -->
```

Auto-populate from:
- Direct imports in source file
- Type dependencies
- Related types from same package

Engineers can remove irrelevant links or add domain-specific relationships. The `--update` command preserves manual additions below the marker.

---

## Best Practices

### For You (The LLM)

1. **Extract, don't infer** - Pull info from source, JSDoc, tests. Don't guess behavior.
2. **Match reference voice** - Study the reference examples for writing style.
3. **Preserve manual edits** - When updating, detect human changes and keep them.
4. **Be specific in examples** - Show realistic use cases, not toy examples.
5. **Ask when uncertain** - Multi-export: prompt for selection. Ambiguous classification: ask user.

### For Engineers

1. **Review all generated content** - You are the maintainer, LLM is drafting assistant.
2. **Customize freely** - Edit markdown directly, LLM adapts to your changes.
3. **Update docs with code** - Run `--update` after changing APIs.
4. **Use validation** - Run `--validate` before merging PRs.
5. **Refine references** - If generation quality drops, update reference examples.
