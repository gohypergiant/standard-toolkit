# Testing Guide

How to test the accelint-api-docs skill and set up permissions for smooth operation.

---

## Quick Setup (3 files)

To test the update and validation workflows, you need existing documentation:

```bash
# Generate docs for a few array utilities
/accelint-api-docs packages/core/src/array/map/index.ts
/accelint-api-docs packages/core/src/array/filter/index.ts  
/accelint-api-docs packages/core/src/array/reduce/index.ts

# Now you can test:
/accelint-api-docs --validate packages/core/src/array/
/accelint-api-docs --update packages/core/src/array/
```

---

## Full Test Suite (12 evals)

The skill's test suite covers:

1. **Core entity types**: function, component, hook, class, constant
2. **Multi-export files**: single markdown with H2 sections
3. **Update workflow**: preserving manual edits while incorporating code changes
4. **Validation workflow**: staleness, broken links, missing frontmatter
5. **Batch generation**: sequential processing with checkpoints
6. **Existing docs**: incorporating examples from .docs.mdx files
7. **Deprecation**: handling @deprecated JSDoc tags
8. **Internal exports**: skipping @internal and _prefixed exports

See `~/.claude/skills/accelint-api-docs/evals/evals.json` for test prompts.

---

## Permission Requirements

Grant these permissions before testing to avoid prompts:

### Option A: Grant globally (recommended for testing)

Add to `~/.claude/settings.json`:

```json
{
  "allowedBashCommands": ["git hash-object *"],
  "allowedReads": ["**/.claude/skills/accelint-api-docs/references/*"]
}
```

### Option B: Grant per-project

Add to `.claude/settings.json` in your project:

```json
{
  "allowedBashCommands": ["git hash-object packages/**"],
  "allowedReads": ["**/.claude/skills/accelint-api-docs/references/*"],
  "allowedWrites": ["packages/**/index.md"]
}
```

---

## Testing Checklist

Before considering the skill production-ready:

- [ ] Generate docs for all 5 entity types (function, component, hook, class, constant)
- [ ] Test multi-export file documentation
- [ ] Test update workflow with manual edits preserved
- [ ] Test validation workflow (staleness, broken links)
- [ ] Test batch generation on directory
- [ ] Test with existing docs (incorporation pattern)
- [ ] Test deprecated API handling
- [ ] Test internal export filtering
- [ ] Verify colocated file placement
- [ ] Verify SHA tracking works correctly
- [ ] Test CI integration (if applicable)
- [ ] Test with team members for usability
