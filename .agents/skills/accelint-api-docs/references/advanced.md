# Advanced Operations

This guide covers batch operations, error handling, and command patterns for advanced use cases.

---

## Command Reference

### Generate

```bash
/accelint-api-docs packages/core/src/array/map/index.ts
/accelint-api-docs packages/core/src/array/  # Directory
/accelint-api-docs <path> --only=map         # Single entity from multi-export
/accelint-api-docs <path> --internal         # Include internal exports
```

### Update

```bash
/accelint-api-docs --update                  # Branch changes
/accelint-api-docs packages/core/ --update   # Specific directory
/accelint-api-docs . --update                # Full project
```

### Validate

```bash
/accelint-api-docs --validate                # Branch changes
/accelint-api-docs <path> --validate         # Specific path
/accelint-api-docs . --validate --strict     # Full project, warnings = errors
/accelint-api-docs . --validate --fix        # Auto-fix issues
```

### Batch & Recovery

```bash
/accelint-api-docs packages/core/ --non-interactive  # Auto-select all exports
/accelint-api-docs --retry                           # Replay failed generations
```

### Behavioral Rules

- No path + no flag = error (ambiguous)
- Path + no flag = generate
- No path + flag = operate on branch changes
- `.` as path = full project scope

---

## Batch Operations & Error Handling

### Sequential Processing with Checkpoints

When processing multiple files:

```
Processing 23 files...
[1/23] src/array/map/index.ts ✓
[2/23] src/array/filter/index.ts ✓
[3/23] src/utils/weird.ts ✗
  Error: Could not parse exports (syntax error line 42)
  [R]etry [S]kip [Q]uit > S
  Logged to: /ACCELINT_API_DOCS_ERRORS.log
[4/23] src/array/reduce/index.ts ✓
...
```

**Fail-forward philosophy:**
- Never abort entire batch on single failure
- Update mapping after each successful generation
- Continue processing remaining files
- Log errors to `/ACCELINT_API_DOCS_ERRORS.log` (gitignored)
- `--retry` replays only failed files

---

## Non-Interactive Mode

`--non-interactive` flag for CI/automation:
- Auto-selects "All" for multi-export files
- Auto-applies updates (no prompts)
- Fails fast on errors
- Returns non-zero exit code on any failure

---

## File Tracking System

### apps/docs/.index.json

Auto-generated JSON index following the Karpathy Wiki pattern:

```json
{
  "version": "1.0",
  "generated": "2026-05-27T14:32:15Z",
  "entries": [
    {
      "source": "packages/core/src/array/map/index.ts",
      "doc": "packages/core/api/array/map/index.mdx",
      "entities": ["map"],
      "source_sha": "abc123",
      "doc_sha": "def456",
      "updated": "2026-05-27T14:30:00Z"
    }
  ]
}
```

**Properties:**
- Machine-readable for programmatic queries
- Supports staleness detection via dual-SHA tracking
- Co-located with generated docs
- Git-friendly (sorted entries, stable diffs)
- Enables validation and lint operations

### ACCELINT_API_DOCS_ERRORS.log

Gitignored file for transient failures:

```markdown
# Failed Generations

## 2026-05-27 14:32:15
File: packages/core/src/utils/weird.ts
Error: Could not parse exports (syntax error on line 42)
Attempted: generate
```

Use for debugging and retry operations.
