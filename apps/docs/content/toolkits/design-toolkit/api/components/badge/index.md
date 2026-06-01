---
title: Badge
description: Small status indicator for labels, counts, and notifications
source: packages/design-toolkit/src/components/badge/index.tsx
source_sha: 07929f0b1281248f07e82ac1550c8a27eb98d98b
doc_sha: pending
deprecated: false
updated: 2026-05-28
---

# Badge

Small status indicator for displaying labels, counts, and notifications. Supports dot indicators when empty.

## Usage

```tsx
import { Badge } from '@accelint/design-toolkit';

export function MyComponent() {
  return <Badge>New</Badge>;
}
```

## Reference

```typescript
interface BadgeProps extends ComponentPropsWithRef<'span'> {
  children?: string | number | boolean | null;
  color?: 'info' | 'advisory' | 'normal' | 'serious' | 'critical';
  offset?: number | { x?: number; y?: number };
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'top left' | 'top right' | 'bottom left' | 'bottom right';
}
```

### Props

| Prop | Type | Default | Required |
|------|------|---------|----------|
| `children` | `string \| number \| boolean \| null` | - | No |
| `color` | `'info' \| 'advisory' \| 'normal' \| 'serious' \| 'critical'` | `'info'` | No |
| `offset` | `number \| { x?: number; y?: number }` | - | No |
| `placement` | `string` | - | No |
| `className` | `string` | - | No |

#### `children`

Badge content. Can be text, numbers, or empty:
- String/number: Renders as text content
- Empty/null/false: Renders as a dot indicator

#### `color`

Semantic color variant:
- `info` - Informational (default)
- `advisory` - Advisory/warning
- `normal` - Normal/success state
- `serious` - Serious/warning state
- `critical` - Critical/error state

#### `placement`

Position relative to a container element. Requires the badge to be positioned (absolute/fixed):
- Single axis: `'top'`, `'bottom'`, `'left'`, `'right'`
- Corner: `'top left'`, `'top right'`, `'bottom left'`, `'bottom right'`

#### `offset`

Offset from positioned edge in pixels:
- Number: Applies same offset to both axes
- Object: `{ x: number, y: number }` for independent axis control

### Inherited Props

Badge extends all standard HTML span attributes, including:
- `onClick` - Click handler
- `aria-label` - Accessible label
- `role` - ARIA role
- All standard HTML global attributes

## Examples

### Example: Basic badges

```tsx
import { Badge } from '@accelint/design-toolkit';

<>
  <Badge>New</Badge>
  <Badge>12</Badge>
  <Badge>Beta</Badge>
</>
```

### Example: Color variants

```tsx
import { Badge } from '@accelint/design-toolkit';

<>
  <Badge color="info">Info</Badge>
  <Badge color="advisory">Warning</Badge>
  <Badge color="normal">Success</Badge>
  <Badge color="serious">Important</Badge>
  <Badge color="critical">Error</Badge>
</>
```

### Example: Dot indicator

```tsx
import { Badge } from '@accelint/design-toolkit';

<Badge color="critical" />
```

Empty badges render as small dot indicators, useful for status markers.

### Example: Notification count

```tsx
import { Badge } from '@accelint/design-toolkit';

<div style={{ position: 'relative' }}>
  <Button>
    <Icon><Bell /></Icon>
  </Button>
  <Badge color="critical" placement="top right" offset={4}>
    3
  </Badge>
</div>
```

### Example: Positioned badge with offset

```tsx
import { Badge } from '@accelint/design-toolkit';

<div style={{ position: 'relative' }}>
  <Avatar />
  <Badge 
    color="normal" 
    placement="bottom right"
    offset={{ x: 8, y: 8 }}
  />
</div>
```

### Example: Status indicator in list

```tsx
import { Badge } from '@accelint/design-toolkit';

<List>
  <ListItem>
    <Badge color="normal" /> Online
  </ListItem>
  <ListItem>
    <Badge color="advisory" /> Away
  </ListItem>
  <ListItem>
    <Badge color="critical" /> Offline
  </ListItem>
</List>
```

> **Good to know:** When using positioned badges, ensure the parent element has `position: relative` or another positioned context.

## Related

- [Avatar](../avatar/index.md) - Often used with badges for status
- [Button](../button/index.md) - Can contain badges for notifications
- [Chip](../chip/index.md) - Alternative for removable tags
