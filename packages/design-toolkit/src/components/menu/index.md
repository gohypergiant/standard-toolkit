---
title: Menu
description: Dropdown menu component with keyboard navigation, selection modes, and accessible ARIA patterns
source: src/components/menu/index.tsx
source_sha: 6d3f2ffa271fa4d98a9a78af4cf953ed76546ebb
doc_sha: c1a63127d69e08d51c27dc38ba414375af6be844
deprecated: false
updated: 2026-05-28
---

# Menu

Dropdown menu component with keyboard navigation, selection modes, and accessible ARIA patterns.

Menu is composed of multiple subcomponents: `Menu`, `MenuTrigger`, `MenuItem`, `MenuItemLabel`, `MenuItemDescription`, `MenuSeparator`, `MenuSection`, and `MenuSubmenu`. Compose with `Hotkey` and `Icon` components for enhanced functionality.

> **Good to know:** Menu includes its own internal Popover. Do NOT wrap Menu in a Popover component—use the `popoverProps` prop to configure placement and positioning.

## Usage

```tsx
import {
  Menu,
  MenuTrigger,
  MenuItem,
  MenuItemLabel,
  Button,
} from '@accelint/design-toolkit';

<MenuTrigger>
  <Button>Open Menu</Button>
  <Menu>
    <MenuItem>
      <MenuItemLabel>Edit</MenuItemLabel>
    </MenuItem>
    <MenuItem>
      <MenuItemLabel>Copy</MenuItemLabel>
    </MenuItem>
    <MenuItem>
      <MenuItemLabel>Delete</MenuItemLabel>
    </MenuItem>
  </Menu>
</MenuTrigger>
```

## Reference

### Menu

```typescript
interface MenuProps<T> extends AriaMenuProps<T> {
  classNames?: {
    menu?: AriaMenuProps<T>['className'];
    popover?: PopoverProps['className'];
  };
  popoverProps?: Omit<AriaPopoverProps, 'children' | 'className'>;
  variant?: 'compact' | 'cozy';
  ref?: RefAttributes<HTMLDivElement>;
}
```

#### Props

| Prop | Type | Default | Required |
|------|------|---------|----------|
| `children` | `ReactNode` | - | Yes |
| `variant` | `'cozy' \| 'compact'` | `'cozy'` | No |
| `selectionMode` | `'none' \| 'single' \| 'multiple'` | `'single'` | No |
| `popoverProps` | `Omit<PopoverProps, 'children' \| 'className'>` | - | No |
| `classNames` | `{ menu?, popover? }` | - | No |
| `onAction` | `(key: Key) => void` | - | No |
| `onClose` | `() => void` | - | No |

#### `variant`

Controls visual density:
- `cozy` - Comfortable spacing for desktop applications
- `compact` - Reduced padding for space-constrained interfaces

#### `popoverProps`

Configure placement, offset, and positioning of the menu popover. Accepts all React Aria Popover props except `children` and `className`.

Common properties:
- `placement` - Position relative to trigger (e.g., `'bottom start'`, `'top end'`)
- `offset` - Distance in pixels from trigger

### MenuItem

```typescript
interface MenuItemProps extends AriaMenuItemProps {
  classNames?: {
    item?: AriaMenuItemProps['className'];
    text?: AriaTextProps['className'];
    more?: IconProps['className'];
    icon?: IconProps['className'];
    hotkey?: string;
  };
  color?: 'info' | 'serious' | 'critical';
}
```

#### Props

| Prop | Type | Default | Required |
|------|------|---------|----------|
| `children` | `ReactNode` | - | Yes |
| `color` | `'info' \| 'serious' \| 'critical'` | `'info'` | No |
| `isDisabled` | `boolean` | `false` | No |
| `classNames` | `{ item?, icon?, hotkey?, more?, text? }` | - | No |

#### `color`

Semantic color variants:
- `info` - Default neutral styling
- `serious` - Warning or cautionary actions
- `critical` - Destructive actions (delete, remove)

> **Good to know:** String children are automatically wrapped in a `MenuItemLabel`. For complex layouts, use `MenuItemLabel` and `MenuItemDescription` explicitly.

### MenuItemLabel

Primary text label for menu items. Renders as a Text component with the `label` slot.

#### Props

| Prop | Type | Default | Required |
|------|------|---------|----------|
| `children` | `ReactNode` | - | Yes |
| `className` | `string` | - | No |

### MenuItemDescription

Secondary descriptive text for menu items. Renders as a Text component with the `description` slot.

#### Props

| Prop | Type | Default | Required |
|------|------|---------|----------|
| `children` | `ReactNode` | - | Yes |
| `className` | `string` | - | No |

### MenuSection

Groups related menu items with an optional header.

```typescript
interface MenuSectionProps<T> extends AriaMenuSectionProps<T> {
  classNames?: {
    section?: AriaMenuSectionProps<T>['className'];
    header?: string;
  };
  title?: string | ReactElement;
}
```

#### Props

| Prop | Type | Default | Required |
|------|------|---------|----------|
| `children` | `ReactNode` | - | Yes |
| `title` | `string \| ReactElement` | - | No |
| `classNames` | `{ section?, header? }` | - | No |

#### `title`

Section header displayed above grouped items. Accepts strings or React elements for custom formatting.

### MenuSeparator

Visual divider between menu items or sections.

#### Props

| Prop | Type | Default | Required |
|------|------|---------|----------|
| `className` | `string` | - | No |

### MenuTrigger

Manages open/close state and anchors menu position. Wraps a trigger element (typically a Button) and the Menu component.

Re-exports React Aria's `MenuTrigger`. See [React Aria MenuTrigger](https://react-spectrum.adobe.com/react-aria/Menu.html#menutrigger) for full API reference.

### MenuSubmenu

Trigger for nested submenu flyouts. Wraps a MenuItem and nested Menu to create hierarchical navigation.

Re-exports React Aria's `SubmenuTrigger`. See [React Aria Submenu](https://react-spectrum.adobe.com/react-aria/Menu.html#submenu) for full API reference.

## Examples

### Example: Basic menu

```tsx
<MenuTrigger>
  <Button>Open Menu</Button>
  <Menu>
    <MenuItem>
      <MenuItemLabel>Item 1</MenuItemLabel>
    </MenuItem>
    <MenuSeparator />
    <MenuItem>
      <MenuItemLabel>Item 2</MenuItemLabel>
    </MenuItem>
  </Menu>
</MenuTrigger>
```

### Example: Custom placement

```tsx
<MenuTrigger>
  <Button>Open Menu</Button>
  <Menu popoverProps={{ placement: 'top end' }}>
    <MenuItem>
      <MenuItemLabel>Item 1</MenuItemLabel>
    </MenuItem>
    <MenuItem>
      <MenuItemLabel>Item 2</MenuItemLabel>
    </MenuItem>
  </Menu>
</MenuTrigger>
```

Available placements: `'bottom'`, `'bottom start'`, `'bottom end'`, `'top'`, `'top start'`, `'top end'`, `'left'`, `'right'`, etc.

### Example: Offset control

```tsx
<MenuTrigger>
  <Button>Open Menu</Button>
  <Menu popoverProps={{ placement: 'bottom', offset: 8 }}>
    <MenuItem>
      <MenuItemLabel>Item</MenuItemLabel>
    </MenuItem>
  </Menu>
</MenuTrigger>
```

### Example: Action handler

```tsx
<MenuTrigger>
  <Button>Actions</Button>
  <Menu onAction={(key) => console.log('Selected:', key)}>
    <MenuItem id="edit">
      <MenuItemLabel>Edit</MenuItemLabel>
    </MenuItem>
    <MenuItem id="delete">
      <MenuItemLabel>Delete</MenuItemLabel>
    </MenuItem>
  </Menu>
</MenuTrigger>
```

Each `MenuItem` requires an `id` prop when using `onAction`.

### Example: Selection modes

```tsx
// Single selection
<MenuTrigger>
  <Button>Select One</Button>
  <Menu
    selectionMode="single"
    selectedKeys={selectedKeys}
    onSelectionChange={setSelectedKeys}
  >
    <MenuItem id="item-1">
      <MenuItemLabel>Item 1</MenuItemLabel>
    </MenuItem>
    <MenuItem id="item-2">
      <MenuItemLabel>Item 2</MenuItemLabel>
    </MenuItem>
  </Menu>
</MenuTrigger>

// Multiple selection
<MenuTrigger>
  <Button>Select Multiple</Button>
  <Menu
    selectionMode="multiple"
    selectedKeys={selectedKeys}
    onSelectionChange={setSelectedKeys}
  >
    <MenuItem id="item-1">
      <MenuItemLabel>Item 1</MenuItemLabel>
    </MenuItem>
    <MenuItem id="item-2">
      <MenuItemLabel>Item 2</MenuItemLabel>
    </MenuItem>
  </Menu>
</MenuTrigger>
```

### Example: Sections and separators

```tsx
<MenuTrigger>
  <Button>Open</Button>
  <Menu>
    <MenuSection title="File Actions">
      <MenuItem>
        <MenuItemLabel>New File</MenuItemLabel>
      </MenuItem>
      <MenuItem>
        <MenuItemLabel>Open File</MenuItemLabel>
      </MenuItem>
    </MenuSection>

    <MenuSeparator />

    <MenuItem>
      <MenuItemLabel>Settings</MenuItemLabel>
    </MenuItem>
  </Menu>
</MenuTrigger>
```

### Example: Color variants

```tsx
<Menu>
  <MenuItem color="info">
    <MenuItemLabel>Info Action</MenuItemLabel>
  </MenuItem>
  <MenuItem color="serious">
    <MenuItemLabel>Warning Action</MenuItemLabel>
  </MenuItem>
  <MenuItem color="critical">
    <MenuItemLabel>Delete</MenuItemLabel>
  </MenuItem>
</Menu>
```

### Example: Disabled items

```tsx
<Menu>
  <MenuItem>
    <MenuItemLabel>Available Action</MenuItemLabel>
  </MenuItem>
  <MenuItem isDisabled>
    <MenuItemLabel>Disabled Action</MenuItemLabel>
  </MenuItem>
</Menu>
```

### Example: With icons and descriptions

```tsx
import { Icon } from '@accelint/design-toolkit';
import { Placeholder } from '@accelint/icons';

<Menu>
  <MenuItem>
    <Icon>
      <Placeholder />
    </Icon>
    <MenuItemLabel>Blue Jay</MenuItemLabel>
    <MenuItemDescription>Cyanocitta cristata</MenuItemDescription>
  </MenuItem>
</Menu>
```

### Example: Submenu

```tsx
<MenuTrigger>
  <Button>Actions</Button>
  <Menu>
    <MenuItem>
      <MenuItemLabel>New File</MenuItemLabel>
    </MenuItem>
    <MenuSubmenu>
      <MenuItem>
        <MenuItemLabel>Export</MenuItemLabel>
      </MenuItem>
      <Menu>
        <MenuItem>
          <MenuItemLabel>Export as PDF</MenuItemLabel>
        </MenuItem>
        <MenuItem>
          <MenuItemLabel>Export as CSV</MenuItemLabel>
        </MenuItem>
        <MenuItem>
          <MenuItemLabel>Export as JSON</MenuItemLabel>
        </MenuItem>
      </Menu>
    </MenuSubmenu>
    <MenuItem>
      <MenuItemLabel>Delete</MenuItemLabel>
    </MenuItem>
  </Menu>
</MenuTrigger>
```

### Example: Dynamic section header

```tsx
const CustomHeader = () => (
  <div>
    <div>Section Title</div>
    <div>Subheader text</div>
  </div>
);

<MenuTrigger>
  <Button>Open Menu</Button>
  <Menu>
    <MenuItem>
      <MenuItemLabel>Item</MenuItemLabel>
    </MenuItem>
    <MenuSection title={<CustomHeader />}>
      <MenuItem>
        <MenuItemLabel>Section Item</MenuItemLabel>
      </MenuItem>
    </MenuSection>
  </Menu>
</MenuTrigger>
```

## Accessibility

- Full keyboard navigation with Arrow keys
- Type-ahead selection support
- Submenu navigation with Arrow Left/Right
- Escape closes menu and returns focus to trigger
- Screen reader announcements for selection changes
- ARIA roles and attributes for menu structure

## Related

<!-- Auto-generated from imports -->
- [Button](../button/index.md)
- [Icon](../icon/index.md)
- [Hotkey](../hotkey/index.md)

<!-- Referenced: menu.docs.mdx for examples and structure -->
