# Design: Remove `/api/` Subdirectory from Documentation Paths

## Decision 1: Remove `/api/` Subdirectory

**Choice**: Eliminate the `/api/` subdirectory from the output path pattern.

**Rationale**: The `/api/` subdirectory adds unnecessary nesting that conflicts with fumadocs' flat content structure. Removing it aligns with content organization conventions where the section (packages/, tooling/, toolkits/) already provides sufficient context.

**Alternatives**:
- Keep `/api/` and adjust fumadocs configuration to expect it
- Use `/api/` only for certain package types

**Trade-off**: Breaks existing paths but creates cleaner, more maintainable structure long-term.

## Decision 2: Change Extension to `.mdx`

**Choice**: Output files with `.mdx` extension instead of `.md`.

**Rationale**: Fumadocs expects `.mdx` for documentation files to enable React component embedding and enhanced markdown features. Using `.md` limits functionality and creates inconsistency with other documentation.

**Alternatives**:
- Keep `.md` and configure fumadocs to accept it
- Support both extensions via configuration

**Trade-off**: `.mdx` requires fumadocs-specific processing but enables richer documentation capabilities.

## Decision 3: Preserve Directory Structure

**Choice**: Maintain source directory structure in output paths (e.g., `broadcast/index.ts` → `broadcast/index.mdx`).

**Rationale**: Preserving structure keeps mental model simple and maintains correspondence between source and docs. Developers can predict doc locations based on source paths.

**Alternatives**:
- Flatten all files to package root
- Group by export type (functions/, components/, hooks/)

**Trade-off**: May create deeply nested docs for deeply nested source files, but predictability outweighs concerns.

## Decision 4: Regeneration Strategy

**Choice**: Full regeneration of existing documentation after path changes.

**Rationale**: Since paths change fundamentally, incremental migration would create confusion with split documentation. Clean regeneration ensures consistency.

**Alternatives**:
- Keep old docs and redirect
- Gradual migration with both structures temporarily

**Trade-off**: Requires coordinated regeneration but avoids dual maintenance burden.

## Decision 5: Correct Section Mapping Rules

**Choice**: Update section mapping to match actual project organization:
- `packages/design-toolkit/` and `packages/map-toolkit/` → `toolkits/`
- All other `packages/*` (including `design-foundation`) → `packages/`
- All `tooling/*` → `tooling/`

**Rationale**: The current skill incorrectly maps `design-foundation` to `toolkits/` when it should go to `packages/`. Only `design-toolkit` and `map-toolkit` are architectural toolkits that warrant separate categorization. This corrects the mapping to match project intent.

**Alternatives**:
- Keep all three (design-foundation, design-toolkit, map-toolkit) in toolkits
- Use package.json metadata to determine section

**Trade-off**: Requires migrating `design-foundation` docs from `toolkits/` to `packages/`, but creates correct long-term organization.

## Decision 6: Test File Exclusion

**Choice**: Explicitly ignore test folders and files during documentation generation.

**Rationale**: Test code (`*.test.ts`, `*.test.tsx`, `__tests__/` directories) should not appear in API documentation. While tests are valuable for understanding usage patterns during generation, the generated docs should only document production exports.

**Alternatives**:
- Document test utilities separately
- Include test examples inline in API docs

**Trade-off**: Loses dedicated test documentation but keeps API reference focused on production code.

## Decision 7: Fumadocs Link Conventions

**Choice**: Generate relative paths oriented to Next.js App Router structure for internal documentation links.

**Rationale**: Fumadocs uses Next.js App Router, which expects paths relative to the `content/` directory. Links must work correctly within the fumadocs navigation system without breaking on build or in production.

**Alternatives**:
- Use absolute paths from site root
- Use fumadocs-specific link helpers

**Trade-off**: Requires understanding of fumadocs routing conventions but ensures links work reliably.

## Decision 8: Migrate Tracking File to JSON Index

**Choice**: Convert `ACCELINT_API_DOCS_MAPPING.md` to `apps/docs/.index.json` with structured data following the Karpathy Wiki pattern.

**Rationale**: The Karpathy Wiki pattern uses a persistent, structured index as the "map" between source and generated content. Moving from markdown table to JSON:
- Enables consistent, accurate parsing (no regex on markdown tables)
- Supports programmatic queries (which file generated which doc?)
- Lives in the docs app (co-located with generated content)
- Acts as fumadocs' "map" for API documentation
- Enables future CLI tools (search, lint, validation)

**JSON Schema**:
```json
{
  "version": "1.0",
  "generated": "2026-07-13T15:30:00Z",
  "entries": [
    {
      "source": "packages/bus/src/index.ts",
      "doc": "packages/bus/index.mdx",
      "entities": ["broadcast", "subscribe"],
      "source_sha": "abc123...",
      "doc_sha": "def456...",
      "updated": "2026-07-13T15:30:00Z"
    }
  ]
}
```

**Karpathy Wiki Alignment**:
- `entries[]` = the persistent index of all generated docs
- `source_sha`/`doc_sha` = dual-SHA tracking for staleness detection
- Enables "lint" operation (find stale docs, missing cross-refs)
- Supports "ingest" workflow (track what was generated)

**Alternatives**:
- Keep markdown table in root
- Use SQLite database
- Use fumadocs' native metadata only

**Trade-off**: Requires one-time migration of existing entries, but unlocks programmatic tooling and aligns with industry patterns for LLM-maintained knowledge bases.

## Decision 9: Frontmatter Preservation

**Choice**: Maintain all existing frontmatter fields without changes.

**Rationale**: Frontmatter serves fumadocs navigation and metadata needs. Path changes don't affect metadata requirements.

**Alternatives**:
- Add path-related metadata
- Simplify frontmatter

**Trade-off**: None - preserves existing metadata contract.

## Implementation Approach

The change affects multiple aspects of path computation and filtering:

**Path Generation**:
- Remove `/api/` subdirectory insertion from path builder
- Change file extension logic from `.md` to `.mdx`
- Update section mapping to correctly handle design-foundation vs. toolkits

**Source File Filtering**:
- Skip `*.test.ts`, `*.test.tsx` files
- Skip `__tests__/`, `__mocks__/` directories
- Continue reading test files for usage examples (input only, not documented as output)

**Link Generation**:
- Ensure internal links use relative paths compatible with fumadocs/Next.js routing
- Verify links work within the App Router content structure

**Testing Strategy**:
- Test with design-foundation (should → packages/)
- Test with design-toolkit and map-toolkit (should → toolkits/)
- Test with regular packages (should → packages/)
- Test with tooling packages (should → tooling/)
- Verify test files are excluded from output

## Migration Path

1. Update section mapping rules in skill documentation (remove `design-foundation` from toolkits)
2. Update path generation code (remove `/api/`, change extension to `.mdx`)
3. Update test file exclusion logic (skip `*.test.ts`, `__tests__/`, `__mocks__/`)
4. **Migrate tracking file**:
   - Read existing `ACCELINT_API_DOCS_MAPPING.md`
   - Convert to JSON structure in `apps/docs/.index.json`
   - Update all references in skill to use new location
5. Run full documentation regeneration for all packages
6. Move `design-foundation` docs from `toolkits/` to `packages/`
7. Verify fumadocs recognizes new paths and builds successfully
8. Update any hardcoded path references in docs or build scripts
9. Clean up old `/api/` directories
10. Remove obsolete `ACCELINT_API_DOCS_MAPPING.md` from root

## Validation

Success indicators:
- Generated paths match pattern: `{section}/{package}/{relative-path}.mdx`
- Fumadocs builds without errors
- Navigation works correctly
- All exported symbols documented
