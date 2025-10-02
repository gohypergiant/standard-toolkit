# Storybook Audit Tooling Ecosystem

This document provides a complete overview of the audit tooling created to maintain consistent Storybook story structure across the design toolkit.

## 🛠️ Available Tools

### 1. Primary Audit Script

**Location**: `.storybook/scripts/audit/index.mjs`

**Purpose**: AST-based analysis of story files to ensure compliance with standardized patterns.

**Usage**:
```bash
# Detailed analysis with suggestions (from design-toolkit/components directory)
pnpm --filter @accelint/design-toolkit audit:stories

# CI-friendly output (exits with error code)
pnpm --filter @accelint/design-toolkit audit:stories:ci

# Direct execution with custom directory
# Detailed command line usage
node .storybook/scripts/audit/index.mjs <directory> [--ci] [--json]

# Examples
node .storybook/scripts/audit/index.mjs .          # Current directory
node .storybook/scripts/audit/index.mjs . --ci     # CI mode
node .storybook/scripts/audit/index.mjs . --json   # JSON output
```

**Features**:
- Parses TypeScript/JavaScript files using Babel AST
- Checks for required imports from shared utilities
- Validates meta object structure
- Generates reports with counts
- Supports both verbose and CI modes
- Flexible directory targeting for reusability

### 2. Pre-commit Hook Configuration

**Location**: `lefthook.yml`

**Purpose**: Prevent non-compliant stories from being committed.

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

**Display Behavior**: Info issues are only shown in the audit output when there are **no errors or warnings** present. This progressive disclosure approach helps developers focus on critical issues first, then improve documentation and polish when the code is otherwise compliant.

## 📋 Quick Reference

### Standard Meta Structure

```typescript
const meta: Meta<typeof Component> = {
  title: 'Components/ComponentName',
  component: Component,
  args: {
    // default values
  },
  argTypes: {
    // Component-specific controls
  },
  parameters: {
    controls: {
      exclude: [], // strings as names of properties
      include: [], // strings as names of properties
    },
    layout: 'centered', // centered (default), fullscreen, or padded
  },
};
```

## 🔄 Maintenance

The audit tooling is designed to be self-maintaining:

1. **Pre-commit Validation**: Prevents new issues
2. **CI Integration**: Catches issues in PRs
3. **Documentation Updates**: Keep guidelines current

This ecosystem ensures long-term consistency and quality of Storybook stories across the entire design toolkit.
