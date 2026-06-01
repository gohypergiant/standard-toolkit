---
title: Button
description: A versatile interactive button component with multiple variants, sizes, and states
source: packages/design-toolkit/src/components/button/index.tsx
source_sha: 355e6a55663d0fc215a11d6dc67efa404e847c34
doc_sha: pending
deprecated: false
updated: 2026-05-28
---

# Button

A versatile interactive button component with support for different visual styles, sizes, and interactive states. Built on React Aria for accessibility and keyboard navigation.

## Usage

```tsx
import { Button } from '@accelint/design-toolkit';

export function MyComponent() {
  return <Button>Click me</Button>;
}
```

## Reference

```typescript
interface ButtonProps extends AriaButtonProps {
  color?: 'mono-muted' | 'mono-bold' | 'accent' | 'serious' | 'critical';
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  variant?: 'filled' | 'outline' | 'flat' | 'icon';
  className?: string;
  children?: React.ReactNode;
}
```

### Props

| Prop | Type | Default | Required |
|------|------|---------|----------|
| `children` | `React.ReactNode` | - | No |
| `color` | `'mono-muted' \| 'mono-bold' \| 'accent' \| 'serious' \| 'critical'` | `'mono-muted'` | No |
| `size` | `'xsmall' \| 'small' \| 'medium' \| 'large'` | `'medium'` | No |
| `variant` | `'filled' \| 'outline' \| 'flat' \| 'icon'` | `'filled'` | No |
| `className` | `string` | - | No |
| `onPress` | `(e: PressEvent) => void` | - | No |
| `isDisabled` | `boolean` | `false` | No |

#### `color`

Semantic color variant that controls the button's visual appearance:
- `mono-muted` - Default neutral styling (muted)
- `mono-bold` - Bold neutral styling  
- `accent` - Accent color emphasis
- `serious` - Warning or important actions
- `critical` - Destructive or high-impact actions

#### `variant`

Visual style variant:
- `filled` - Solid background (default)
- `outline` - Border with transparent background
- `flat` - No border or background, text only
- `icon` - Icon-only button with minimal chrome

#### `size`

Controls button padding and font size. The `size` prop automatically sizes nested `Icon` components via `IconProvider` context.

### Inherited Props

Button extends React Aria's `Button` component, inheriting:
- `onPress` - Called when the button is pressed
- `isDisabled` - Disables the button
- `type` - HTML button type (`button`, `submit`, `reset`)
- `form` - Associates button with a form by ID
- `autoFocus` - Focuses button on mount
- All standard HTML button attributes

See [React Aria Button](https://react-spectrum.adobe.com/react-aria/Button.html) for full API reference.

## Examples

### Example: Primary action button

```tsx
import { Button } from '@accelint/design-toolkit';

<Button variant="filled" color="accent" onPress={() => console.log('Saved')}>
  Save Changes
</Button>
```

### Example: Destructive action

```tsx
import { Button } from '@accelint/design-toolkit';

<Button variant="outline" color="critical" onPress={() => handleDelete()}>
  Delete Account
</Button>
```

### Example: Button with icon

```tsx
import { Button, Icon } from '@accelint/design-toolkit';
import { Plus } from '@accelint/icons';

<Button variant="flat">
  <Icon><Plus /></Icon>
  Add Item
</Button>
```

The `size` prop on Button automatically configures the icon size through context.

### Example: Icon-only button

```tsx
import { Button, Icon } from '@accelint/design-toolkit';
import { Settings } from '@accelint/icons';

<Button variant="icon" aria-label="Settings">
  <Icon><Settings /></Icon>
</Button>
```

> **Good to know:** When using the `icon` variant, always provide an `aria-label` for accessibility since there's no visible text.

### Example: Different sizes

```tsx
import { Button } from '@accelint/design-toolkit';

<>
  <Button size="xsmall">Extra Small</Button>
  <Button size="small">Small</Button>
  <Button size="medium">Medium</Button>
  <Button size="large">Large</Button>
</>
```

### Example: Disabled state

```tsx
import { Button } from '@accelint/design-toolkit';

<Button isDisabled onPress={() => console.log('Never called')}>
  Unavailable
</Button>
```

## Related

- [LinkButton](./link.md) - Button styled as a link
- [ToggleButton](./toggle.md) - Button with toggle state
- [Icon](../../icon/index.md) - Icon component with automatic sizing
