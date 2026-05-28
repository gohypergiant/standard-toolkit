# Troubleshooting

Common issues and solutions when using the API documentation skill.

---

## Generation Issues

### "Could not detect exports"

**Cause**: Syntax errors in source file  
**Fix**: Run `pnpm run build` to check for TypeScript errors  
**Workaround**: Fix syntax, then regenerate

### "Source file not found"

**Cause**: File path is incorrect or file was moved  
**Fix**: Verify path with `ls <path>`, check for typos  
**Note**: Use tab completion to avoid path errors

### "Cannot read reference examples"

**Cause**: Missing Read permission for skill directory  
**Fix**: Grant Read permission: `**/.claude/skills/accelint-api-docs/references/*`  
**Impact**: Without references, structure will be inconsistent

### "git hash-object command not found"

**Cause**: Git not installed or not in PATH  
**Fix**: Install git or grant Bash permission  
**Impact**: Cannot generate SHA fields for staleness tracking

---

## Update Issues

### "Source file not found in mapping"

**Cause**: File moved/renamed after docs were generated  
**Fix**: Run `--validate` to detect orphaned docs, update manually  
**Prevention**: Update docs before moving files

### "Update suggests rewriting entire doc"

**Cause**: Large refactor or doc_sha mismatch  
**Review carefully**: Ensure manual edits are preserved  
**Option**: Reject update, manually merge changes

### "Manual edits were overwritten"

**Should not happen**: Skill uses doc_sha to detect manual edits  
**Report as bug**: Save backup, report with before/after docs  
**Workaround**: Restore from git, try update again

---

## Validation Issues

### "Circular dependency in Related section"

**Not an error**: Bidirectional links are fine (A links B, B links A)  
**Purpose**: Related sections show connections between APIs

### "Markdown lint errors"

**Auto-fixed on generation**: Run `--validate --fix` to repair  
**Persisting errors**: Check `.markdownlint.json` for rule overrides  
**Common**: MD013 (line length) is disabled by default

### "All docs reported as stale"

**Cause**: source_sha fields are outdated after git operations  
**Fix**: Run `--update` to refresh SHAs  
**Not an error**: Staleness warnings don't fail validation unless `--strict`

---

## Batch Operation Issues

### "Batch stopped after first error"

**Expected behavior**: Use [S]kip to continue, errors logged to ACCELINT_API_DOCS_ERRORS.log  
**Retry**: Run `--retry` to replay only failed files  
**Check log**: `cat ACCELINT_API_DOCS_ERRORS.log` for details

### "Progress is slow (1 file per minute)"

**Cause**: Reading source, tests, references for each file  
**Normal**: Typical rate is 30-60s per file  
**Speedup**: Use `--non-interactive` to skip prompts

---

## Permission Issues

### "Permission prompt on every file"

**Cause**: Permissions not pre-granted  
**Fix**: Add to .claude/settings.json (see testing.md)  
**For CI/CD**: Use `--non-interactive` and pre-grant permissions

### "Write permission denied"

**Cause**: Output directory doesn't exist or is read-only  
**Fix**: Check directory permissions, create parent dirs  
**Colocated docs**: Ensure source directory is writable

---

## Integration Issues

### "Storybook can't import .md files"

**Cause**: MDX loader not configured  
**Fix**: Add to .storybook/main.js:
```js
module.exports = {
  stories: ['../**/*.docs.mdx'],
  // Add markdown loader
};
```

### "fumadocs doesn't see the docs"

**Cause**: Docs not in fumadocs content directory  
**Fix**: Configure fumadocs to scan package directories  
**Alternative**: Use symlinks to fumadocs content dir

### "CI validation fails with exit code 2"

**Expected**: Exit code 2 = errors (broken links, orphaned docs)  
**Fix**: Run `--validate --fix` locally, commit fixes  
**Exit codes**: 0 = clean, 1 = warnings, 2 = errors
