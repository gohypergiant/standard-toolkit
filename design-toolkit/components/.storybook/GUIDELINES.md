# Storybook Structure Guidelines

This document outlines the standardized structure and patterns for Storybook stories in the design system.

## 📋 Audit Script

Use the built-in audit script to check story structure compliance:

```bash
# Run audit (view issues)
pnpm audit:stories

# Run in CI mode (fails on errors)
pnpm audit:stories:ci

# Output JSON format
pnpm audit:stories -- --json
```

## ✅ Required Structure

Every story file must include:

### 1. Imports
```typescript
import { ComponentName } from './';
import { createStandardParameters } from '^storybook/shared-controls';
import { MOCK_DATA } from '^storybook/mock-data';
import type { Meta, StoryObj } from '@storybook/react';
```

### 2. Meta Configuration
```typescript
const meta: Meta<typeof ComponentName> = {
  title: 'Components/ComponentName',
  component: ComponentName,
  parameters: {
    ...createStandardParameters('category'), // form, overlay, content, container
    docs: {
      subtitle: 'Brief description of component purpose.',
    },
  },
  args: {
    // Default args
  },
  argTypes: {
    // Enhanced argTypes with categories
  },
};
```

### 3. ArgTypes Categories
All argTypes should be categorized:

- **Visual**: Colors, variants, sizes, shapes
- **Behavior**: Interaction modes, selection, orientation
- **Layout**: Grid/stack layouts, positioning
- **Features**: Optional functionality, toggles
- **State**: Disabled, loading, error states
- **Content**: Text, labels, children
- **Styling**: CSS classes, custom styling

```typescript
argTypes: {
  variant: {
    control: 'select',
    options: ['primary', 'secondary'],
    table: { 
      defaultValue: { summary: 'primary' },
      category: 'Visual'
    },
    description: 'Visual style variant',
  },
  isDisabled: {
    control: 'boolean',
    table: { 
      defaultValue: { summary: 'false' },
      category: 'State'
    },
    description: 'Whether the component is disabled',
  },
}
```

## 🔧 Shared Utilities

### Parameters
Use `createStandardParameters()` with appropriate categories:
- `'form'` - Form components (inputs, selects, etc.)
- `'overlay'` - Overlays (modals, popovers, tooltips)
- `'content'` - Content components (text, icons, etc.)
- `'container'` - Layout containers (accordions, tabs, etc.)

### Controls
Import and use shared control utilities:
```typescript
import { 
  createStandardParameters,
  createVariantControl,
  createSizeControl,
  STANDARD_ARG_TYPES 
} from '^storybook/shared-controls';
```

### Mock Data
Use `MOCK_DATA` for consistent, realistic content:
```typescript
import { MOCK_DATA } from '^storybook/mock-data';

// Use in stories
<Component items={MOCK_DATA.MENU_ITEMS} />
<Component users={MOCK_DATA.USERS} />
<Component>{MOCK_DATA.TEXT_CONTENT.SHORT}</Component>
```

## 🎯 Story Patterns

### Default Story
```typescript
export const Default: StoryObj<typeof Component> = {
  render: (args) => <Component {...args} />,
};
```

### State Stories
Use shared templates for consistent state stories:
```typescript
import { createStatesStory } from '^storybook/story-templates';

export const States: StoryObj<typeof Component> = createStatesStory({
  Component,
  baseProps: { children: 'Label' },
  stateProps: {
    disabled: { isDisabled: true },
    loading: { isLoading: true },
    error: { isInvalid: true, errorMessage: 'Error message' },
  },
});
```

## 🚨 Common Issues

### Errors (Must Fix)
- Missing `createStandardParameters` import
- Missing `parameters` property in meta
- Missing `title` or `component` in meta
- Parse errors (syntax issues)

### Warnings (Should Fix)
- Missing `docs.subtitle` in parameters
- ArgTypes without `table.category`
- Not using `createStandardParameters`

### Info (Nice to Have)
- ArgTypes missing descriptions
- Missing default value summaries

## 🔄 Pre-commit Hooks

Add to your Git hooks or CI:

```bash
# Check stories before commit
pnpm audit:stories:ci
```

## 📊 Metrics

The audit script tracks:
- Total files audited
- Error count (blocking issues)
- Warning count (improvements needed)  
- Info count (enhancements)
- Compliance percentage

## 🛠️ Tools Integration

### CI/CD Integration
```yaml
# .github/workflows/storybook.yml
- name: Audit Storybook Structure
  run: pnpm audit:stories:ci
```

## 📝 Migration Guide

To migrate existing stories:

1. Run `pnpm audit:stories` to see current issues
2. Add required imports for shared utilities
3. Update meta object with `createStandardParameters`
4. Add `docs.subtitle` to parameters
5. Categorize all argTypes with `table.category`
6. Add descriptions and default summaries
7. Use `MOCK_DATA` for realistic content
8. Test with `pnpm audit:stories` to verify compliance

## 🔗 Related Files

- `/scripts/audit-stories.mjs` - Main audit script
- `/.storybook/shared-controls.ts` - Shared control utilities
- `/.storybook/mock-data.tsx` - Consistent mock data
- `/.storybook/story-templates.tsx` - Reusable story patterns
