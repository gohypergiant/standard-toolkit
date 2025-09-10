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
  STANDARD_CONTROLS 
} from '../../../.storybook/shared-controls';
import { CRITICALITY_VARIANTS } from '@/constants/criticality-variants';

// Use standard parameters for component type
parameters: createStandardParameters('form'), // 'form' | 'overlay' | 'container' | 'content'

// Use size controls based on component capabilities
argTypes: {
  size: createSizeControl('FULL'),     // For Button, Icon (xsmall-large)
  size: createSizeControl('COMPACT'),  // For form fields (small-medium)
  size: createSizeControl('STANDARD'), // For most components (small-large)
  size: createSizeControl('BINARY'),   // For simple toggles (small, large)
  
  color: {
    control: { type: 'select' },
    options: Object.values(CRITICALITY_VARIANTS), // All semantic colors
  },
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

#### Required Args Configuration
```typescript
args: {
  // Set meaningful defaults
  children: 'Button Text',
  variant: ComponentDefaults.variant,
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

### Global Improvements:

- [ ] **Shared utilities**: Implement `shared-controls.ts` and `story-templates.tsx`
- [ ] **Consistency audit**: Review all stories for control noise and missing states
- [ ] **Documentation**: Update component docs with state examples
- [ ] **Testing**: Verify stories work correctly with new patterns

## 📋 Common Issues Addressed

1. **Control Noise**: Removed irrelevant props from controls panel
2. **Inconsistent States**: Standardized loading, error, disabled state naming
3. **Missing Patterns**: Added state demonstration stories
4. **Layout Confusion**: Clarified layout parameter usage by component type
5. **Variant Discovery**: Added comprehensive variant showcase stories

## 🔧 Migration Strategy

1. **Phase 1**: Implement shared utilities (shared-controls.ts, story-templates.tsx)
2. **Phase 2**: Update high-traffic components (Button, Input, Dialog)
3. **Phase 3**: Systematically update remaining components
4. **Phase 4**: Remove deprecated patterns and add linting rules

This standardization improves the Storybook experience by reducing cognitive overhead and providing consistent patterns for component exploration and testing.
