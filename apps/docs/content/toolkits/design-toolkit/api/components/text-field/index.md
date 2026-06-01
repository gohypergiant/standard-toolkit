---
title: TextField
description: Single-line text input with integrated label, description, and error message
source: packages/design-toolkit/src/components/text-field/index.tsx
source_sha: 61190e9e44f0e0f96b593e6a52cf7f0de26f1080
doc_sha: pending
deprecated: false
updated: 2026-05-28
---

# TextField

Single-line text input with integrated label, description, and error message. Built on React Aria for accessibility and automatic ARIA relationships.

## Usage

```tsx
import { TextField } from '@accelint/design-toolkit';

export function MyForm() {
  return (
    <TextField 
      label="Email" 
      type="email" 
      isRequired
    />
  );
}
```

## Reference

```typescript
interface TextFieldProps extends AriaTextFieldProps {
  label?: string;
  description?: string;
  errorMessage?: string;
  size?: 'medium' | 'small';
  inputProps?: InputProps;
  classNames?: {
    field?: string;
    label?: string;
    input?: InputProps['classNames'];
    description?: string;
    error?: string;
  };
}
```

### Props

| Prop | Type | Default | Required |
|------|------|---------|----------|
| `label` | `string` | - | No |
| `description` | `string` | - | No |
| `errorMessage` | `string` | - | No |
| `size` | `'medium' \| 'small'` | `'medium'` | No |
| `inputProps` | `InputProps` | - | No |
| `classNames` | `object` | - | No |
| `value` | `string` | - | No |
| `defaultValue` | `string` | - | No |
| `onChange` | `(value: string) => void` | - | No |
| `isRequired` | `boolean` | `false` | No |
| `isDisabled` | `boolean` | `false` | No |
| `isReadOnly` | `boolean` | `false` | No |
| `isInvalid` | `boolean` | - | No |

#### `label`

Label text displayed above the input. When `size="small"`, the label is visually hidden but still provides accessible labeling.

#### `description`

Helper text displayed below the input. Hidden when field is in error state or when `size="small"`.

#### `errorMessage`

Error message displayed when validation fails. Setting this prop automatically marks the field as invalid.

#### `size`

Controls field dimensions and layout:
- `medium` - Standard size with visible label and description
- `small` - Compact size with visually hidden label

#### `inputProps`

Props forwarded to the underlying `Input` component for advanced customization.

#### `classNames`

Custom CSS class names for internal elements:
- `field` - Container element
- `label` - Label element
- `input` - Input element (accepts `InputProps['classNames']`)
- `description` - Description text
- `error` - Error message

### Inherited Props

TextField extends React Aria's `TextField`, inheriting:
- `name` - Form field name
- `value` / `defaultValue` - Controlled/uncontrolled value
- `onChange` - Value change handler
- `onBlur` / `onFocus` - Focus event handlers
- `isRequired` / `isDisabled` / `isReadOnly` - State props
- `validate` - Custom validation function
- `autoFocus` / `autoComplete` - HTML attributes

See [React Aria TextField](https://react-spectrum.adobe.com/react-aria/TextField.html) for full API reference.

## Examples

### Example: Basic text input

```tsx
import { TextField } from '@accelint/design-toolkit';

<TextField 
  label="Username" 
  description="Choose a unique username"
/>
```

### Example: Required field

```tsx
import { TextField } from '@accelint/design-toolkit';

<TextField 
  label="Email" 
  type="email"
  isRequired
/>
```

The required indicator (*) is automatically added to the label.

### Example: Field with validation error

```tsx
import { TextField } from '@accelint/design-toolkit';
import { useState } from 'react';

function MyForm() {
  const [email, setEmail] = useState('');
  const isInvalid = email && !email.includes('@');
  
  return (
    <TextField 
      label="Email"
      value={email}
      onChange={setEmail}
      errorMessage={isInvalid ? 'Please enter a valid email' : undefined}
    />
  );
}
```

### Example: Controlled input

```tsx
import { TextField } from '@accelint/design-toolkit';
import { useState } from 'react';

function MyForm() {
  const [name, setName] = useState('');
  
  return (
    <TextField 
      label="Full Name"
      value={name}
      onChange={setName}
    />
  );
}
```

### Example: Custom validation

```tsx
import { TextField } from '@accelint/design-toolkit';

<TextField 
  label="Password"
  type="password"
  validate={(value) => {
    if (value.length < 8) {
      return 'Password must be at least 8 characters';
    }
  }}
/>
```

### Example: Small size variant

```tsx
import { TextField } from '@accelint/design-toolkit';

<TextField 
  label="Search"
  size="small"
  placeholder="Type to search..."
/>
```

> **Good to know:** In `small` size, the label is visually hidden but remains accessible to screen readers. Description and error messages are also hidden.

### Example: Disabled state

```tsx
import { TextField } from '@accelint/design-toolkit';

<TextField 
  label="Account ID"
  value="12345"
  isDisabled
/>
```

## Related

- [Input](../../input/index.md) - Underlying input component
- [Label](../../label/index.md) - Label component
- [TextAreaField](../text-area-field/index.md) - Multi-line text input
- [SearchField](../search-field/index.md) - Search-specific input field
