# Proposal: Remove `/api/` Subdirectory from Documentation Paths

## Problem

The API documentation generator currently creates output paths with an `/api/` subdirectory that doesn't align with fumadocs' content structure expectations. This creates unnecessary nesting and complicates navigation.

**Current pattern:**
```
apps/docs/content/packages/bus/api/broadcast/index.md
```

**Expected pattern:**
```
apps/docs/content/packages/bus/broadcast/index.mdx
```

## Solution

Simplify the output path structure by:
1. Removing the `/api/` subdirectory from generated paths
2. Changing output file extension from `.md` to `.mdx`
3. Preserving source directory structure and section mapping

## Impact

- **Existing documentation**: All existing API docs will need regeneration
- **Fumadocs integration**: Paths will align with content structure conventions
- **Navigation**: Simpler, flatter hierarchy improves discoverability
- **Backwards compatibility**: Existing links will break (requires regeneration)

## Success Criteria

- Generated docs follow pattern: `{outputDir}/{section}/{package-name}/{relative-path}.mdx`
- Source directory structure preserved (e.g., `broadcast/index.ts` → `broadcast/index.mdx`)
- Section mapping unchanged (packages/, tooling/, toolkits/)
- All frontmatter fields maintained
