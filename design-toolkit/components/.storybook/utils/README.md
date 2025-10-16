# Storybook Utils & Documentation

This directory contains shared utilities, helpers, and guidelines for creating consistent Storybook stories.

## 📋 Audit & Compliance

Use the built-in [audit script](../scripts/audit/README.md) to check story structure compliance:

```bash
# Run audit (view issues)
pnpm --filter @accelint/design-toolkit audit:stories
```

## ✅ Required Story Structure

Every story file must include:

### 1. Imports

```typescript
import { ComponentName } from './';
import type { Meta, StoryObj } from '@storybook/react';
```

### 2. Meta Configuration

It is recommended to use `satisfies` for `meta` declaration instead of a type assertion `as`.

```typescript
const meta = {
  title: 'Components/ComponentName',
  component: ComponentName,
  args: {
    // Default args
  },
  argTypes: {
    // Enhanced argTypes with categories
  },
  parameters: {
    docs: {
      subtitle: 'Brief description of component purpose.',
    },
  },
} satisfies Meta<typeof ComponentName>;

export default meta;
// create a type alias for shorter, more consistent, story definitions.
type Story = StoryObj<typeof meta>;
```

## 🔧 Shared Utilities

This directory provides several utilities to ensure consistency across stories:

### Control Configuration

Import and use shared control utilities:

```typescript
import { 
  createVariantControl,
  createSizeControl,
  COMMON_ARG_TYPES 
} from '^storybook/utils';
```

### Mock Data

Use `MOCK_DATA` for consistent, realistic content:

```typescript
import { MOCK_DATA } from '^storybook/utils';

// Use in stories
<Component items={MOCK_DATA.MENU_ITEMS} />
<Component users={MOCK_DATA.USERS} />
<Component>{MOCK_DATA.TEXT_CONTENT.SHORT}</Component>
```

## 🎯 Story Patterns

### Default Story

```typescript
export const Default: Story = {
  render: (args) => <Component {...args} />,
};
```

### State Stories

Use shared templates for consistent state stories:

```typescript
import { createStatesStory } from '^storybook/utils';

export const States: Story = createStatesStory({
  Component,
  baseProps: { children: 'Label' },
  stateProps: {
    disabled: { isDisabled: true },
    loading: { isLoading: true },
    error: { isInvalid: true, errorMessage: 'Error message' },
  },
});
```

## 🎯 Standardization Guidelines

### Key Improvements Implemented

#### 1. Control Configuration Standards

Use Common Control Utilities:

```typescript
import { 
  COMMON_ARG_TYPES
} from '^storybook/utils';

// Use helper functions for consistent controls
argTypes: {
  // For Button, Icon (xsmall-large)
  size: COMMON_ARG_TYPES.size.full,
  
  // Create ad-hoc argType configurations when needed
  variant: createArgTypeSelect('Description of argType', ['filled', 'outline', 'flat']),
  
  // Use standard argTypes for common props
  children: COMMON_ARG_TYPES.children,
  isDisabled: COMMON_ARG_TYPES.isDisabled,
  label: COMMON_ARG_TYPES.label,
  criticality: COMMON_ARG_TYPES.criticality,
}

// Use standard parameters for component type
```

#### 2. Consistent Story Patterns

Every component should have:

1. `Default` - Basic usage with essential controls
2. `States` - Shows disabled, loading, error states where applicable
3. `Variants` - Demonstrates all visual variants in a grid (controls disabled)

**Story Naming**
- Use PascalCase: `Default`, `WithIcon`, `AllVariants`
- Be descriptive but concise
- Group related stories: `FormStates`, `InteractiveStates`

#### 3. State Management Standards

**Loading States**
```typescript
// For async components
isLoading: boolean
loadingText?: string

// For components with pending actions
isPending: boolean
```

**Error States**
```typescript
// For form fields
isInvalid: boolean
errorMessage?: string

// For data components  
error?: string | Error
```

**Disabled States**
```typescript
// Consistent naming
isDisabled: boolean // NOT disabled
```

#### 4. Args and ArgTypes Best Practices

**Required Args Configuration**
```typescript
args: {
  // Set meaningful defaults
  children: 'Button Text',
  variant: 'filled',
  size: 'medium',
  isDisabled: false,
}
```

**Standard ArgTypes Usage**
```typescript
// Use COMMON_ARG_TYPES for common props
argTypes: {
  children: COMMON_ARG_TYPES.children,
  label: COMMON_ARG_TYPES.label,
  description: COMMON_ARG_TYPES.description,
  errorMessage: COMMON_ARG_TYPES.errorMessage,
  isDisabled: COMMON_ARG_TYPES.isDisabled,
  isRequired: COMMON_ARG_TYPES.isRequired,
  isInvalid: COMMON_ARG_TYPES.isInvalid,
  orientation: COMMON_ARG_TYPES.orientation,
  placement: COMMON_ARG_TYPES.placement,
  placeholder: COMMON_ARG_TYPES.placeholder,
  selectionMode: COMMON_ARG_TYPES.selectionMode,
  criticality: COMMON_ARG_TYPES.criticality,
  classificationVariant: COMMON_ARG_TYPES.classificationVariant,
}
```

## 📁 Utility Files

This directory contains the following utility files:

- **`arg-types.ts`** - Common argument type definitions
- **`create-arg-types.ts`** - Utilities for creating custom argument types
- **`create-parameters.ts`** - Parameter creation helper
- **`create-states-story.tsx`** - Template for state-based stories
- **`mock-data.tsx`** - Consistent mock data for stories
- **`state-props.ts`** - State property definitions
- **`index.ts`** - Main exports

These utilities help maintain consistency and reduce boilerplate across all component stories.
