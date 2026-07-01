# CI/CD Integration

This guide covers integrating API documentation into continuous integration and deployment pipelines.

---

## Pre-commit Hook

Validate docs on every commit:

```bash
# .git/hooks/pre-commit
#!/bin/bash
/accelint-api-docs --validate . --strict
if [ $? -eq 2 ]; then
  echo "❌ Documentation validation failed"
  exit 1
fi
```

---

## GitHub Actions

```yaml
name: Validate Docs
on: [pull_request]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Validate API docs
        run: |
          /accelint-api-docs --validate . --strict
```

---

## Pre-merge Checklist

Before merging PRs that change public APIs:

```bash
# 1. Update docs for changed files
/accelint-api-docs --update .

# 2. Validate all docs
/accelint-api-docs --validate . --strict

# 3. Check mapping file
git diff ACCELINT_API_DOCS_MAPPING.md

# 4. Commit docs with code
git add packages/**/*.md ACCELINT_API_DOCS_MAPPING.md
git commit -m "docs: update API reference for X"
```

---

## Non-Interactive Mode

For automation, use `--non-interactive`:
- Auto-selects "All" for multi-export files
- Auto-applies updates without prompts
- Fails fast on errors (exit code 2)
- No color output (parseable logs)

```bash
# Generate all docs without prompts
/accelint-api-docs packages/ --non-interactive

# Update all stale docs automatically  
/accelint-api-docs --update . --non-interactive

# Validate strictly (warnings = errors)
/accelint-api-docs --validate . --strict --non-interactive
```

---

## Exit Codes

- 0 = all valid
- 1 = warnings (stale SHAs, markdownlint issues)
- 2 = errors (broken links, orphaned docs, missing frontmatter)
