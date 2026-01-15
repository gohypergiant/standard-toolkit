## Component Style and Conventions

These rules define how to create React components using React Aria Components. Use this guide when generating NEW components. When REFACTORING existing components, display the suggestion and await confirmation before applying changes.

### Component Architecture

Components are organized into **families** that share a common directory:

**1. Main Component** - Primary component (e.g., `Button`, `Menu`, `Dialog`)
**2. Variants** - Alternative versions with different behavior, shared styling
   - Example: `LinkButton` renders `<a>`, `ToggleButton` renders `<button>`, both use button styles
**3. Sub-components** - Compositional children that nest inside parents
   - Example: `MenuItem`, `MenuItemLabel`, `MenuSection` nest inside `<Menu>`

**CRITICAL: Flat Named Exports Only**
```tsx
// ✅ Correct
import { Button, LinkButton, Menu, MenuItem } from '@accelint/design-toolkit'

// ❌ Wrong - dot notation does NOT exist
Button.Link  // Doesn't exist!
Menu.Item    // Doesn't exist!
```

### File Organization

**One Component Per File**
- Each component in separate file (exception: Context/Provider can share)
- Files use kebab-case naming
- Functions use PascalCase WITH family prefix

**Naming Pattern**

| Component Type | File Name | Function Name |
|---|---|---|
| Variant | `link.tsx` | `LinkButton` |
| Sub-component | `item.tsx` | `MenuItem` |
| Nested sub-component | `item-label.tsx` | `MenuItemLabel` |
| Deep nesting | `card-header-title.tsx` | `KanbanCardHeaderTitle` |

**Directory Structure**
```
button/
  index.tsx           ← Button
  link.tsx            ← LinkButton
  toggle.tsx          ← ToggleButton
  context.tsx         ← Contexts
  styles.ts           ← Shared styles
  types.ts            ← Shared types

menu/
  index.tsx           ← Menu
  item.tsx            ← MenuItem
  item-label.tsx      ← MenuItemLabel
  separator.tsx       ← MenuSeparator
```

### Component Definition

**Required Directives**

If a component **can only run** in a React client component context, it must start with:
```tsx
'use client';
import 'client-only';
```

**Function Declaration Rules**
- Use `export function ComponentName()` (never arrow functions)
- Include family name in function: `LinkButton`, `MenuItem`, `DialogFooter`
- No `displayName` assignments
- Never use default exports

### Standard Patterns

**1. Context Integration**
```tsx
import { useContextProps } from 'react-aria-components';
import { ButtonContext } from './context';

export function Button({ ref, ...props }: ButtonProps) {
  [props, ref] = useContextProps(props, ref ?? null, ButtonContext);
  const { children, className, color = 'mono-muted', size = 'medium' } = props;
  // ...
}
```

**2. Styling with composeRenderProps**
```tsx
import { composeRenderProps } from 'react-aria-components';
import { ButtonStyles } from './styles';

className={composeRenderProps(className, (className) =>
  ButtonStyles({ className, variant })
)}
```

**3. Data Attributes for Styling**
```tsx
data-color={color}
data-size={size}
data-variant={variant}
```

**4. Icon Provider (when accepting icon children)**
```tsx
import { IconProvider } from '../icon/provider';

return (
  <IconProvider size={size}>
    <AriaButton {...rest}>{children}</AriaButton>
  </IconProvider>
);
```

**5. Sub-components Accessing Parent Context**
```tsx
import { useContext } from 'react';
import { MenuContext } from './context';

export function MenuItem({ children, ...rest }: MenuItemProps) {
  const context = useContext(MenuContext);
  const variant = context?.variant ?? MenuStylesDefaults.variant;
  // ...
}
```

### Creating New Components

#### Standalone Component
1. Create directory: `components/avatar/`
2. Create main: `avatar/index.tsx` → `export function Avatar()`
3. Create types: `avatar/types.ts`
4. Create styles: `avatar/styles.ts` (Tailwind Variants)
5. Export: Add to `src/index.ts`: `export { Avatar } from './components/avatar'`
6. Create tests: `avatar/avatar.test.tsx`
7. Create stories: `avatar/avatar.stories.tsx`

#### Variant (e.g., LinkButton)
1. Create file: `button/link.tsx`
2. Function name: `export function LinkButton()`
3. Extend props: `interface LinkButtonProps extends AriaLinkProps`
4. Add context: Include in `button/context.tsx`
5. Reuse styles: Import from `button/styles.ts`
6. Export: Add to `src/index.ts`: `export { LinkButton } from './components/button/link'`

#### Sub-component (e.g., MenuItem)
1. Create file: `menu/item.tsx`
2. Function name: `export function MenuItem()`
3. Access context: `useContext(MenuContext)`
4. For nested: Use hyphens (e.g., `item-label.tsx` → `MenuItemLabel`)
5. Export: Add to `src/index.ts`

**Nested Component Example**
```
kanban/
├── index.tsx               ← Kanban
├── card.tsx                ← KanbanCard
├── card-header.tsx         ← KanbanCardHeader
├── card-header-title.tsx   ← KanbanCardHeaderTitle (3-level nesting)
├── card-body.tsx           ← KanbanCardBody
```

### Package Exports

**ALL components export from `/src/index.ts`:**
```tsx
export { Button } from './components/button';
export { LinkButton } from './components/button/link';
export { Menu } from './components/menu';
export { MenuItem } from './components/menu/item';
```

**Consumer Usage:**
```tsx
import { Button, LinkButton, Menu, MenuItem } from '@accelint/design-toolkit';

<LinkButton href="/" variant="flat">Home</LinkButton>

<Menu>
  <MenuItem>
    <MenuItemLabel>Option</MenuItemLabel>
  </MenuItem>
</Menu>
```

### Quality Checklist

Before submitting a component:

**File Structure**
- ✓ File in correct family directory
- ✓ Kebab-case file name WITHOUT family prefix (`link.tsx`, not `button-link.tsx`)
- ✓ Nested components use hyphens (`card-header-title.tsx`)
- ✓ Main component in `index.tsx`

**Component Code**
- ✓ Starts with `'use client';` and `import 'client-only';`
- ✓ Named function: `export function ComponentName()`
- ✓ PascalCase WITH family prefix (`LinkButton`, `MenuItem`, `KanbanCardHeaderTitle`)
- ✓ No `displayName` property
- ✓ Named export (not default)

**Patterns**
- ✓ Extends React Aria props if applicable
- ✓ Uses `useContextProps` for context
- ✓ Uses `composeRenderProps` for className
- ✓ Includes data attributes for styling
- ✓ Wraps with `IconProvider` if accepting icons
- ✓ Sub-components use `useContext` to access parent

**Exports & Testing**
- ✓ Exported from `src/index.ts`
- ✓ Test file created
- ✓ Story file created
- ✓ All tests pass
- ✓ Component imports from package root
- ✓ No dot notation required
