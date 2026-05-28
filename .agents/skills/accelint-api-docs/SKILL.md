---
name: accelint-api-docs
description: Generate and maintain TypeScript/React API reference documentation in markdown. TRIGGER when user mentions documenting code, API docs, "add docs for X", updating/validating docs, or working with fumadocs/Storybook. Handles all API reference documentation for functions, components, hooks, classes, and constants. If TypeScript/React code needs documentation, use this skill.
compatibility:
  required_permissions:
    - Read: "**/.claude/skills/accelint-api-docs/references/*.md"
    - Write: "colocated to source files (same directory as source)"
    - Bash: "git hash-object (for SHA tracking, optional)"
  graceful_degradation:
    - "Without Bash: skips source_sha/doc_sha fields, uses file mtimes"
    - "Without Read: cannot load reference examples, structure may vary"
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

**Reference examples over templates.** This skill uses 5 gold-standard examples showing both structure AND writing style:

- `references/example-function.md` - Curried functions with generics
- `references/example-component.md` - React components with multi-part patterns
- `references/example-hook.md` - Type-safe hooks with generics
- `references/example-class.md` - Classes with singleton patterns
- `references/example-constant.md` - Frozen object patterns (SafeEnum)

### How to Use Reference Examples

**Match these aspects:**
- Section structure: Usage → Reference → Examples → Related
- Voice and tone: direct, imperative, no preamble
- Code-first approach: show usage before explaining

**Adapt these aspects:**
- Depth based on API complexity
- Number of examples based on use cases
- Level of detail in reference section

Pattern match from these examples—they demonstrate the target quality level.

---

## Generate Documentation

When the user asks to document a file, follow this workflow.

### Step-by-Step Process

**1. Read and analyze the source**
   - Read the source file completely
   - Read any colocated test files (`*.test.ts`, `*.test.tsx`)
   - Read existing documentation if present (`.md`, `.docs.mdx`, `README.md`)

**2. Classify exports**
   - Identify all exported entities
   - Classify each: Function, Component, Hook, Class, Constant
   - Skip internal exports (prefixed with `_`, marked `@internal`, in `/internal/` directories)
   - For multi-export files, ask: "Document: [All] [EntityName only] [Custom selection]"

**3. Load matching reference example**
   - Function → read `references/example-function.md`
   - Component → read `references/example-component.md`
   - Hook → read `references/example-hook.md`
   - Class → read `references/example-class.md`
   - Constant → read `references/example-constant.md`

**4. Generate markdown content**
   - Follow the reference example structure exactly
   - Extract information from source (don't infer or hallucinate)
   - Use direct imperative voice ("Returns the filtered array")
   - Name examples by use case ("Example: Filtering null values")
   - Keep prose concise—show code first, explain after

**5. Add frontmatter with dual-SHA tracking**
   ```yaml
   ---
   title: EntityName
   description: One sentence describing what it does
   source: relative/path/to/source.ts
   source_sha: <git hash of source file>
   doc_sha: <hash of this doc content>
   deprecated: false
   updated: YYYY-MM-DD
   ---
   ```
   - `source_sha`: Run `git hash-object <source-file>` to get current hash
   - `doc_sha`: Generate hash of markdown content (excluding frontmatter)
   - `deprecated`: Auto-detect from `@deprecated` JSDoc tag

**6. Validate markdown quality**
   - Fix heading hierarchy (should start with H1)
   - Add language tags to code fences
   - Convert bare URLs to markdown links
   - Check that examples have descriptive names

**7. Write colocated file**
   - Single export: `index.md` alongside `index.ts`
   - Multi-export: `index.md` with H2 sections per entity
   - Alternative: User can manually split to `index.entityName.md` later

**8. Update tracking file**
   - Append or update entry in `/ACCELINT_API_DOCS_MAPPING.md`
   - Format: `| source/path.ts | doc/path.md | entities | source_sha | doc_sha | date |`
   - Keep table sorted by source path for clean diffs

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
   - Read `/ACCELINT_API_DOCS_MAPPING.md`
   - Find docs where `source` matches changed files
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

### Five Validation Checks

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
   - Check heading hierarchy (should start with H1)
   - Verify code fences have language tags
   - Check for bare URLs (should be markdown links)

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
- H1: Entity name
- Opening: One sentence description
- Usage: Minimal working example
- Reference: Type signatures, parameters, returns
- Examples: Named by use case
- Related: Auto-generated from imports + manual additions

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

Auto-detect `@deprecated` JSDoc tags and generate:

```markdown
# oldMap

> **Deprecated**: This function is deprecated since v2.0.0. Use [map](../map/index.md) instead.
```

Set `deprecated: true` in frontmatter.

---

## Common Patterns

### Multi-Export Files

Generate one markdown with H2 sections:

```markdown
# Array Utilities

## map
{Documentation for map}

## filter
{Documentation for filter}
```

Later, engineers can split manually if one entity needs extensive docs.

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
