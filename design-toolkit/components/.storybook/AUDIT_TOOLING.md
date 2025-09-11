# Storybook Audit Tooling Ecosystem

This document provides a complete overview of the audit tooling created to maintain consistent Storybook story structure across the design toolkit.

## 🛠️ Available Tools

### 1. Primary Audit Script
**Location**: `scripts/audit-stories.mjs`

**Purpose**: AST-based analysis of story files to ensure compliance with standardized patterns.

**Usage**:
```bash
# Detailed analysis with suggestions (from design-toolkit/components directory)
pnpm audit:stories

# CI-friendly output (exits with error code)
pnpm audit:stories:ci

# Direct execution with custom directory
node scripts/audit-stories.mjs <directory> [--ci] [--json]

# Examples
node scripts/audit-stories.mjs .          # Current directory
node scripts/audit-stories.mjs . --ci     # CI mode
node scripts/audit-stories.mjs . --json   # JSON output
```

**Features**:
- Parses TypeScript/JavaScript files using Babel AST
- Checks for required imports from shared utilities
- Validates meta object structure
- Analyzes argTypes for proper categorization
- Generates color-coded reports with counts
- Supports both verbose and CI modes
- Flexible directory targeting for reusability

### 2. Pre-commit Hook Configuration
**Location**: `design-toolkit/components/.storybook/pre-commit-story-audit.yml`

**Purpose**: Prevent non-compliant stories from being committed.

**Integration**:
- Works with lefthook (already configured in project)
- Can be added to `.git/hooks/pre-commit`
- Runs audit on story files before commit

### 3. GitHub Actions Workflow
**Location**: `.github/workflows/story-validation.yml`

**Purpose**: Automated validation in CI/CD pipeline.

**Features**:
- Triggers on story file changes in PRs
- Provides detailed feedback in PR comments
- Integrates with existing PNPM setup
- Prevents merging of non-compliant stories

### 4. VS Code Integration
**Locations**: 
- `.vscode/settings.json` (enhanced)
- `.vscode/storybook-snippets.code-snippets`

**Purpose**: Enhanced development experience with auto-completion and formatting.

**Features**:
- File associations for story files
- Auto-import suggestions
- Code snippets for rapid story creation
- Biome formatting integration

## 🔧 Issue Categories

### Errors (Critical - Must Fix)
- Missing `createStandardParameters` import
- Missing required meta properties (title, component, parameters)
- Malformed meta object structure

### Warnings (Important - Should Fix)
- Missing argTypes categories
- Missing component documentation
- Inconsistent control configurations
- Missing story descriptions

### Info (Enhancement - Nice to Have)
- Missing argTypes descriptions
- Missing default value documentation
- Opportunities for better mock data usage
- Control optimization suggestions

## 📋 Quick Reference

### Common Fixes

1. **Add Required Import**:
```typescript
import { createStandardParameters } from '^storybook/shared-controls';
```

2. **Standard Meta Structure**:
```typescript
const meta: Meta<typeof Component> = {
  title: 'Components/ComponentName',
  component: Component,
  parameters: createStandardParameters('category'),
  argTypes: {
    // Component-specific controls
  },
};
```

3. **Categorized ArgTypes**:
```typescript
argTypes: {
  variant: {
    control: 'select',
    options: ['primary', 'secondary'],
    description: 'Visual style variant',
    table: {
      category: 'Appearance',
      type: { summary: 'string' },
      defaultValue: { summary: 'primary' },
    },
  },
},
```

### Running the Audit

```bash
# Check current status
pnpm audit:stories

# Fix issues and re-run
pnpm audit:stories

# Verify for CI
pnpm audit:stories:ci
```

## 📚 Related Documentation

- [Story Guidelines](design-toolkit/components/.storybook/STORY_GUIDELINES.md) - Comprehensive development guide
- [Shared Controls](design-toolkit/components/.storybook/shared-controls.ts) - Utility functions and constants
- [Mock Data](design-toolkit/components/.storybook/mock-data.tsx) - Standardized test data

## 🔄 Maintenance

The audit tooling is designed to be self-maintaining:

1. **Regular Audits**: Run weekly to catch drift
2. **Pre-commit Validation**: Prevents new issues
3. **CI Integration**: Catches issues in PRs
4. **Documentation Updates**: Keep guidelines current
5. **Tool Evolution**: Enhance rules as patterns emerge

This ecosystem ensures long-term consistency and quality of Storybook stories across the entire design toolkit.
