# Storybook Standardization Guide

## Overview
This guide establishes consistent patterns for Storybook stories across the design-toolkit to improve maintainability and user experience.

## 🎯 Key Improvements Implemented

### 1. **Control Configuration Standards**

#### Use Shared Control Utilities
```typescript
import { 
  createStandardParameters, 
  createSizeControl,
  createVariantControl,
  STANDARD_ARG_TYPES
} from '^storybook/utils/controls';

// Use standard parameters for component type
parameters: createStandardParameters('form'), // 'form' | 'overlay' | 'container' | 'content'

// Use helper functions for consistent controls
argTypes: {
  size: createSizeControl('FULL'),     // For Button, Icon (xsmall-large)
  size: createSizeControl('COMPACT'),  // For form fields (small-medium)
  size: createSizeControl('STANDARD'), // For most components (small-large)
  size: createSizeControl('BINARY'),   // For simple toggles (small, large)
  
  variant: createVariantControl(['filled', 'outline', 'flat']),
  
  // Use standard argTypes for common props
  children: STANDARD_ARG_TYPES.children,
  isDisabled: STANDARD_ARG_TYPES.isDisabled,
  label: STANDARD_ARG_TYPES.label,
  criticality: STANDARD_ARG_TYPES.criticality,
}
```

#### Control Exclusion Patterns
- **Form components**: Exclude form submission props (`form`, `formAction`, etc.)
- **All components**: Exclude React internals (`children`, `key`, `ref`) and styling props (`className`, `style`)
- **Interactive components**: Keep essential event handlers, exclude mouse/keyboard detail events

### 2. **Consistent Story Patterns**

#### Required Stories
Every component should have:
1. `Default` - Basic usage with essential controls
2. `States` - Shows disabled, loading, error states where applicable
3. `Variants` - Demonstrates all visual variants in a grid (controls disabled)

#### Story Naming
- Use PascalCase: `Default`, `WithIcon`, `AllVariants`
- Be descriptive but concise
- Group related stories: `FormStates`, `InteractiveStates`

### 3. **State Management Standards**

#### Loading States
```typescript
// For async components
isLoading: boolean
loadingText?: string

// For components with pending actions
isPending: boolean
```

#### Error States
```typescript
// For form fields
isInvalid: boolean
errorMessage?: string

// For data components  
error?: string | Error
```

#### Disabled States
```typescript
// Consistent naming
isDisabled: boolean // NOT disabled
```

### 4. **Layout Parameters**

#### Component Type Guidelines
- **Form fields**: Use default `centered` layout
- **Overlays** (dialogs, tooltips): Use `fullscreen` with container
- **Full-width components**: Use `padded` layout  
- **Content components**: Use `centered` with appropriate spacing

### 5. **Args and ArgTypes Best Practices**

#### Standard ArgTypes Usage
```typescript
// Use STANDARD_ARG_TYPES for common props
argTypes: {
  children: STANDARD_ARG_TYPES.children,
  label: STANDARD_ARG_TYPES.label,
  description: STANDARD_ARG_TYPES.description,
  errorMessage: STANDARD_ARG_TYPES.errorMessage,
  isDisabled: STANDARD_ARG_TYPES.isDisabled,
  isRequired: STANDARD_ARG_TYPES.isRequired,
  isInvalid: STANDARD_ARG_TYPES.isInvalid,
  orientation: STANDARD_ARG_TYPES.orientation,
  placement: STANDARD_ARG_TYPES.placement,
  placeholder: STANDARD_ARG_TYPES.placeholder,
  selectionMode: STANDARD_ARG_TYPES.selectionMode,
  criticality: STANDARD_ARG_TYPES.criticality,
  classificationVariant: STANDARD_ARG_TYPES.classificationVariant,
}
```

#### Required Args Configuration
```typescript
args: {
  // Set meaningful defaults
  children: 'Button Text',
  variant: 'filled',
  size: 'medium',
  isDisabled: false,
}
```

#### ArgTypes Guidelines
- Use `{ type: 'select' }` for enums/variants
- Use `{ type: 'boolean' }` for flags with table documentation
- Add `table: { type: { summary: 'type' }}` for complex props
- Document default values in table summaries

## 🚀 Implementation Checklist

### For Each Component Story:

- [ ] **Controls**: Use shared control exclusions appropriate for component type
- [ ] **States**: Add States story showing disabled, loading, error variants
- [ ] **Variants**: Add comprehensive visual variant showcase
- [ ] **Layout**: Set appropriate layout parameter for component type
- [ ] **Args**: Set meaningful defaults and proper types
- [ ] **Documentation**: Add component description and prop documentation
