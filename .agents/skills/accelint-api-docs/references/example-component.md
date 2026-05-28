# Button

A versatile interactive button component with multiple variants, sizes, and states.

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
  color?: 'mono-muted' | 'primary' | 'critical' | 'serious';
  size?: 'small' | 'medium' | 'large';
  variant?: 'filled' | 'outline' | 'flat' | 'icon';
  className?: string;
  children?: React.ReactNode;
}
```

### Props

| Prop | Type | Default | Required |
|------|------|---------|----------|
| `children` | `React.ReactNode` | - | No |
| `color` | `'mono-muted' \| 'primary' \| 'critical' \| 'serious'` | `'mono-muted'` | No |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | No |
| `variant` | `'filled' \| 'outline' \| 'flat' \| 'icon'` | `'filled'` | No |
| `className` | `string` | - | No |
| `onPress` | `(e: PressEvent) => void` | - | No |
| `isDisabled` | `boolean` | `false` | No |

#### `color`

Semantic color variant that controls the button's visual appearance:
- `mono-muted` - Default neutral styling
- `primary` - Primary action emphasis
- `critical` - Destructive or high-impact actions
- `serious` - Warning or important actions

#### `variant`

Visual style variant:
- `filled` - Solid background (default)
- `outline` - Border with transparent background
- `flat` - No border or background, text only
- `icon` - Icon-only button with minimal chrome

#### `size`

Controls button padding and font size. The `size` prop also automatically sizes nested `Icon` components via context.

### Inherited Props

Button inherits all props from React Aria's `Button` component, including:
- `onPress` - Called when the button is pressed
- `isDisabled` - Disables the button
- `type` - HTML button type (`button`, `submit`, `reset`)
- `form` - Associates button with a form by ID

See [React Aria Button](https://react-spectrum.adobe.com/react-aria/Button.html) for full API reference.

## Examples

### Example: Primary action button

```tsx
import { Button } from '@accelint/design-toolkit';

<Button variant="filled" color="primary" onPress={() => console.log('Saved')}>
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

- [Icon](../icon/index.md) - Icon component with automatic sizing from Button context
- [IconProvider](../icon/context.md) - Context provider for icon sizing
