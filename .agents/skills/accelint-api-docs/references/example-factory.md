# createButton

Factory function that returns a customized Button component.

## Usage

```typescript
import { createButton } from './button-factory';

// Create a themed button factory
const PrimaryButton = createButton({ variant: 'primary' });

function MyComponent() {
  return <PrimaryButton>Click me</PrimaryButton>;
}
```

## Reference

### Function Signature

```typescript
function createButton<P extends ButtonProps>(
  defaults: Partial<ButtonProps>
): React.ComponentType<P>
```

### Type Parameters

- `P` - Props interface for the returned component (must extend ButtonProps)

### Parameters

- `defaults` - Default props to apply to all instances

### Returns

A new React component with the specified defaults baked in.

## Examples

### Example: Theme-Specific Buttons

```typescript
// Create variants with different defaults
const PrimaryButton = createButton({ variant: 'primary', size: 'lg' });
const DangerButton = createButton({ variant: 'danger', size: 'sm' });

// Use like normal components
<PrimaryButton onClick={handleSave}>Save</PrimaryButton>
<DangerButton onClick={handleDelete}>Delete</DangerButton>
```

### Example: With Custom Props

```typescript
interface CustomButtonProps extends ButtonProps {
  icon?: IconName;
}

const IconButton = createButton<CustomButtonProps>({ size: 'sm' });

<IconButton icon="save" onClick={handleSave}>
  Save
</IconButton>
```

## Related

- [Button](../button/index.md) - Base component
- [ButtonProps](../button/index.md#buttonprops) - Props interface
