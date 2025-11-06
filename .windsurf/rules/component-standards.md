---
trigger: always_on
---

# Design Toolkit Component Standards

These rules define how to create and organize components in `design-toolkit/component/src/components`. Use this guide when generating NEW components to ensure they follow the established patterns.

## Component Families and Relationships

Components are organized into **families** that share a common directory and purpose. Each family consists of:

**1. Main Component** - The primary component (e.g., `Button`, `Menu`, `Dialog`)
**2. Variants** - Alternative versions with different behavior but similar visual style
   - Example: `LinkButton` and `ToggleButton` are variants of `Button`
   - They render different elements (`<a>` vs `<button>`) but share the button styling

**3. Sub-components** - Compositional children that work together with the main component
   - Example: `MenuItem`, `MenuItemLabel`, `MenuSection` are sub-components of `Menu`
   - They nest inside the parent component in JSX: `<Menu><MenuItem /></Menu>`

**Important:** All components are exported as **flat named exports**. There is NO namespace or dot notation:
```tsx
// ✅ Correct - how components are actually used
import { Button, LinkButton, Menu, MenuItem } from '@accelint/design-toolkit'

// ❌ Wrong - dot notation does NOT exist
Button.Link  // This doesn't exist!
Menu.Item    // This doesn't exist!
```

## Component File Organization

**One Component Per File**
- Each component must be defined in its own separate file
- Never combine multiple component definitions in a single file (except for Context/Provider - see exception below)
- Component files must use kebab-case naming

**File Naming Convention**

When creating a new component, follow this naming pattern:

**Rule:** File names are kebab-case WITHOUT the family prefix, but function names are PascalCase WITH the family prefix.

**For Variants:** Include the family name in the function, but not in the file
- Creating a link variant of Button → File: `link.tsx`, Function: `LinkButton`
- Creating a toggle variant of Button → File: `toggle.tsx`, Function: `ToggleButton`

**For Sub-components:** Include the parent name in the function, use descriptive file name
- Creating a menu item component → File: `item.tsx`, Function: `MenuItem`
- Creating a menu separator → File: `separator.tsx`, Function: `MenuSeparator`
- Creating a dialog footer → File: `footer.tsx`, Function: `DialogFooter`
- Creating a dialog title → File: `title.tsx`, Function: `DialogTitle`

**For Nested Sub-components:** Use hyphens to show nesting depth
- Creating a menu item label → File: `item-label.tsx`, Function: `MenuItemLabel`
- Creating a kanban card body → File: `card-body.tsx`, Function: `KanbanCardBody`
- Creating a kanban column header title → File: `column-header-title.tsx`, Function: `KanbanColumnHeaderTitle`

**Directory Structure:** All related components live in the same family directory
```
button/
  index.tsx           ← Main Button component
  link.tsx            ← LinkButton variant
  toggle.tsx          ← ToggleButton variant

menu/
  index.tsx           ← Main Menu component
  item.tsx            ← MenuItem sub-component
  item-label.tsx      ← MenuItemLabel nested sub-component
  separator.tsx       ← MenuSeparator sub-component
```

**Context & Provider Exception**
- If a component folder includes **both** a context and a provider component:
  - Create a single file named `context.tsx`
  - Export both the context and the provider component from this file
  - This is the **only** scenario where multiple component-related exports are allowed in one file

## Component Definition Format

**Required Directives**
Every client component must start with:
```tsx
'use client';
import 'client-only';
```

**Use Named Function Declarations**
- Always use `export function ComponentName()` syntax
- Never use arrow function const declarations (`const Component = () => {}`)
- Never use default exports for components

**Component Naming Rules**
- Function name must be in PascalCase
- Include the family name in the function name to avoid conflicts
- File name uses kebab-case without the family prefix

Examples:
- In `button/link.tsx` → `export function LinkButton()`
- In `menu/item.tsx` → `export function MenuItem()`
- In `dialog/footer.tsx` → `export function DialogFooter()`
- In `kanban/card-body.tsx` → `export function KanbanCardBody()`

**No displayName Assignments**
- Never assign the `displayName` property to components
- The function name itself serves as the component identifier

**Standard Component Patterns**

When generating components, follow these established patterns:

**1. Context Integration (for components that support providers)**
```tsx
import { useContextProps } from 'react-aria-components';
import { ButtonContext } from './context';

export function Button({ ref, ...props }: ButtonProps) {
  [props, ref] = useContextProps(props, ref ?? null, ButtonContext);
  // ... rest of component
}
```

**2. Props Destructuring with Defaults**
```tsx
export function Button({ ref, ...props }: ButtonProps) {
  [props, ref] = useContextProps(props, ref ?? null, ButtonContext);
  const { children, className, color = 'mono-muted', size = 'medium', variant } = props;
  // ...
}
```

**3. Styling with composeRenderProps**
```tsx
import { composeRenderProps } from 'react-aria-components';
import { ButtonStyles } from './styles';

className={composeRenderProps(className, (className) =>
  ButtonStyles({ className, variant })
)}
```

**4. Data Attributes for Styling Hooks**
```tsx
data-color={color}
data-size={size}
data-variant={variant}
```

**5. Icon Provider (when component accepts icon children)**
```tsx
import { IconProvider } from '../icon/provider';

return (
  <IconProvider size={size}>
    <AriaButton {...rest}>
      {children}
    </AriaButton>
  </IconProvider>
);
```

**6. Sub-components Accessing Parent Context**
```tsx
import { useContext } from 'react';
import { MenuContext } from './context';

export function MenuItem({ children, ...rest }: MenuItemProps) {
  const context = useContext(MenuContext);
  const variant = context?.variant ?? MenuStylesDefaults.variant;
  // ...
}
```

## Complete Component Examples

**Example 1: Creating a Button Variant**

When you need a link that looks like a button, create a variant in the Button family:

```tsx
// button/link.tsx
'use client';
import 'client-only';

import { Link } from 'react-aria-components';
import type { LinkProps as AriaLinkProps } from 'react-aria-components';
import { composeRenderProps, useContextProps } from 'react-aria-components';
import { IconProvider } from '../icon/provider';
import { LinkButtonContext } from './context';
import { LinkButtonStyles } from './styles';

export interface LinkButtonProps extends AriaLinkProps {
  color?: 'mono-muted' | 'info' | 'success' | 'warning' | 'danger';
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  variant?: 'solid' | 'outline' | 'flat' | 'icon';
}

export function LinkButton({ ref, ...props }: LinkButtonProps) {
  [props, ref] = useContextProps(props, ref ?? null, LinkButtonContext);
  const { children, className, color = 'mono-muted', size = 'medium', variant } = props;

  return (
    <IconProvider size={size}>
      <Link
        ref={ref}
        className={composeRenderProps(className, (className) =>
          LinkButtonStyles({ className, variant })
        )}
        data-color={color}
        data-size={size}
        {...props}
      >
        {children}
      </Link>
    </IconProvider>
  );
}
```

**Example 2: Creating a Menu Sub-component**

When creating a sub-component that nests inside Menu:

```tsx
// menu/item.tsx
'use client';
import 'client-only';

import { MenuItem as AriaMenuItem } from 'react-aria-components';
import type { MenuItemProps as AriaMenuItemProps } from 'react-aria-components';
import { composeRenderProps } from 'react-aria-components';
import { useContext } from 'react';
import { MenuContext } from './context';
import { item, MenuStylesDefaults } from './styles';

export interface MenuItemProps extends AriaMenuItemProps {
  color?: 'info' | 'success' | 'warning' | 'danger';
  classNames?: {
    item?: string;
  };
}

export function MenuItem({ children, classNames, color = 'info', ...rest }: MenuItemProps) {
  const context = useContext(MenuContext);
  const variant = context?.variant ?? MenuStylesDefaults.variant;

  return (
    <AriaMenuItem
      className={composeRenderProps(classNames?.item, (className) =>
        item({ className, variant })
      )}
      data-color={color}
      {...rest}
    >
      {children}
    </AriaMenuItem>
  );
}
```

**Example 3: Creating a Simple Sub-component**

When creating a simple presentational sub-component:

```tsx
// dialog/footer.tsx
'use client';
import 'client-only';

import type { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

export interface DialogFooterProps extends ComponentProps<'footer'> {}

export function DialogFooter({ children, className, ...rest }: DialogFooterProps) {
  return (
    <footer
      className={twMerge('flex gap-2 justify-end mt-4', className)}
      {...rest}
    >
      {children}
    </footer>
  );
}
```

**Example 4: Creating Context and Providers**

When components need to share state or configuration, create contexts in `context.tsx`:

```tsx
// button/context.tsx
'use client';
import 'client-only';

import type { ContextValue } from 'react-aria-components';
import { createContext } from 'react';
import type { ButtonProps } from './types';
import type { LinkButtonProps } from './link';
import type { ToggleButtonProps } from './toggle';

// Create contexts for each variant in the family
export const ButtonContext = createContext<ContextValue<ButtonProps, HTMLButtonElement>>(null);

export const LinkButtonContext = createContext<ContextValue<LinkButtonProps, HTMLAnchorElement>>(null);

export const ToggleButtonContext = createContext<ContextValue<ToggleButtonProps, HTMLButtonElement>>(null);

// Providers allow setting default props for all children
export interface ProviderProps<T> extends T {
  children: React.ReactNode;
}

export function ButtonProvider({ children, ...props }: ProviderProps<ButtonProps>) {
  return <ButtonContext.Provider value={props}>{children}</ButtonContext.Provider>;
}

export function LinkButtonProvider({ children, ...props }: ProviderProps<LinkButtonProps>) {
  return <LinkButtonContext.Provider value={props}>{children}</LinkButtonContext.Provider>;
}
```

## Supporting Files Organization

Each component folder may contain:

- **Component files**: `[component-name].tsx` (one per component)
- **Index**: `index.tsx` - Contains the main component implementation
- **Types**: `types.ts` - Shared TypeScript types and interfaces
- **Context**: `context.tsx` - Context and provider components (if needed)
- **Styles**: `styles.ts` - Shared styling definitions (if needed)
- **Tests**: `[component-name].test.tsx` - Component unit tests
- **Stories**: `[component-name].stories.tsx` - Storybook stories
- **Documentation**: `[component-name].docs.mdx` - Component documentation

**Test File Naming**
- Test files are typically named after the main component (not individual sub-components)
- Example: `menu.test.tsx` tests Menu, MenuItem, MenuSeparator together
- Individual sub-component tests are optional: `item.test.tsx` for specific MenuItem tests

**Story File Naming**
- Story files are named after the main component
- Example: `menu.stories.tsx` demonstrates all Menu-related components
- Example: `button.stories.tsx` demonstrates Button, LinkButton, ToggleButton

**Documentation File Naming**
- Documentation files are named after the main component
- Example: `menu.docs.mdx` documents the entire Menu component family

## Import/Export Patterns

**Important:** The design-toolkit uses a **flat export structure**. All components are exported as individual named exports from the package root, with NO namespace or dot notation.

**Component-Level Index Files**
- Each family's `index.tsx` contains the **main component implementation** (not just re-exports)
- Sub-components and variants live in separate files within the same directory

```tsx
// button/index.tsx - Contains the Button implementation
export function Button({ children, ...props }: ButtonProps) {
  // Full component implementation here
}

// button/link.tsx - Contains the LinkButton implementation
export function LinkButton({ children, ...props }: LinkButtonProps) {
  // Full component implementation here
}
```

**Package-Level Exports (Barrel File)**

When you create a new component, you MUST add it to `/src/index.ts`:

```tsx
// src/index.ts - Exports EVERYTHING as flat named exports
export { Button } from './components/button';
export { LinkButton } from './components/button/link';
export { ToggleButton } from './components/button/toggle';
export { Menu } from './components/menu';
export { MenuItem } from './components/menu/item';
export { MenuItemLabel } from './components/menu/item-label';
export { MenuSeparator } from './components/menu/separator';
// ... all components exported individually
```

**How Consumers Use Components**

```tsx
// ✅ Correct - All imports from package root as flat exports
import { Button, LinkButton, ToggleButton } from '@accelint/design-toolkit';
import { Menu, MenuItem, MenuItemLabel } from '@accelint/design-toolkit';

// Usage in JSX - components compose together
<LinkButton href="/" variant="flat" size="small">
  Home
</LinkButton>

<Menu>
  <MenuItem>
    <MenuItemLabel>Option 1</MenuItemLabel>
  </MenuItem>
</Menu>

// ❌ Wrong - This doesn't exist
import { Button } from '@accelint/design-toolkit';
<Button.Link /> // NO! This pattern doesn't exist

<Menu.Item /> // NO! This pattern doesn't exist
```

**Internal Imports (Within the Package)**

```tsx
// When working inside the components folder:
import { Button } from '../button';
import { LinkButton } from './link';  // Same directory
import { MenuItem } from './item';   // Same directory
```

## How to Create Component Families

Follow these guidelines when creating new component families:

### Creating a New Standalone Component

When creating a simple, standalone component (e.g., Avatar, Badge, Icon):

1. **Create directory:** `components/avatar/`
2. **Create main component:** `avatar/index.tsx` with `export function Avatar()`
3. **Create types:** `avatar/types.ts` for TypeScript definitions
4. **Create styles:** `avatar/styles.ts` using Tailwind Variants
5. **Add to barrel export:** Add `export { Avatar } from './components/avatar'` to `src/index.ts`
6. **Create tests:** `avatar/avatar.test.tsx`
7. **Create stories:** `avatar/avatar.stories.tsx`

### Creating Variants

When you need different behaviors of the same component (e.g., LinkButton for Button):

1. **Create variant file:** `button/link.tsx`
2. **Name function with family prefix:** `export function LinkButton()`
3. **Extend base props:** `interface LinkButtonProps extends AriaLinkProps`
4. **Add context if needed:** Add `LinkButtonContext` to `button/context.tsx`
5. **Reuse styles:** Import and adapt styles from `button/styles.ts`
6. **Export from package:** Add `export { LinkButton } from './components/button/link'` to `src/index.ts`

**Directory structure:**
```
button/
├── index.tsx          ← export function Button()
├── link.tsx           ← export function LinkButton()  (NEW)
├── toggle.tsx         ← export function ToggleButton()
├── context.tsx        ← ButtonContext, LinkButtonContext, etc.
├── styles.ts          ← Shared styling logic
└── types.ts           ← Shared types
```

### Creating Sub-components

When you need compositional children that nest inside a parent (e.g., MenuItem for Menu):

1. **Create sub-component file:** `menu/item.tsx`
2. **Name function with parent prefix:** `export function MenuItem()`
3. **Access parent context:** Use `useContext(MenuContext)` to get parent state
4. **Create nested sub-components:** Use hyphens for deeper nesting (e.g., `item-label.tsx`)
5. **Export from package:** Add `export { MenuItem } from './components/menu/item'` to `src/index.ts`

**Directory structure:**
```
menu/
├── index.tsx           ← export function Menu()
├── item.tsx            ← export function MenuItem()  (NEW)
├── item-label.tsx      ← export function MenuItemLabel()  (NEW)
├── item-description.tsx ← export function MenuItemDescription()  (NEW)
├── separator.tsx       ← export function MenuSeparator()  (NEW)
├── context.tsx         ← MenuContext for parent-child communication
└── styles.ts           ← Shared styling
```

**Usage in JSX:**
```tsx
<Menu>
  <MenuItem>
    <MenuItemLabel>My Item</MenuItemLabel>
    <MenuItemDescription>Description text</MenuItemDescription>
  </MenuItem>
  <MenuSeparator />
</Menu>
```

### Creating Deeply Nested Component Systems

For complex components with multiple levels (e.g., Kanban, Drawer):

1. **Use hyphens to show hierarchy:** `card-header-title.tsx` represents nesting levels
2. **Include all parent names in function:** `KanbanCardHeaderTitle`
3. **Organize by top-level entities:** Group related files (e.g., all `card-*` files together)
4. **Use context for communication:** Parent components provide context, children consume it

**Example structure:**
```
kanban/
├── kanban.tsx              ← export function Kanban()
├── card.tsx                ← export function KanbanCard()
├── card-header.tsx         ← export function KanbanCardHeader()
├── card-header-title.tsx   ← export function KanbanCardHeaderTitle()
├── card-header-actions.tsx ← export function KanbanCardHeaderActions()
├── card-body.tsx           ← export function KanbanCardBody()
├── column.tsx              ← export function KanbanColumn()
├── column-header.tsx       ← export function KanbanColumnHeader()
└── ...
```

**Usage in JSX:**
```tsx
<Kanban>
  <KanbanColumn>
    <KanbanColumnHeader>
      <KanbanColumnHeaderTitle>To Do</KanbanColumnHeaderTitle>
    </KanbanColumnHeader>
    <KanbanCard>
      <KanbanCardHeader>
        <KanbanCardHeaderTitle>Task 1</KanbanCardHeaderTitle>
        <KanbanCardHeaderActions>{/* ... */}</KanbanCardHeaderActions>
      </KanbanCardHeader>
      <KanbanCardBody>
        Task content
      </KanbanCardBody>
    </KanbanCard>
  </KanbanColumn>
</Kanban>
```

## Quality Checklist for Component Generation

When generating a new component, verify:

### File Structure
- ✓ Component file created in correct family directory
- ✓ File name is kebab-case WITHOUT family prefix
  - Example: `link.tsx` (not `button-link.tsx` or `LinkButton.tsx`)
- ✓ For nested components, use hyphens: `card-header-title.tsx`
- ✓ Main component lives in `index.tsx` of its directory
- ✓ Created `types.ts` if needed for shared type definitions
- ✓ Created `styles.ts` using Tailwind Variants pattern
- ✓ Created `context.tsx` if parent-child communication is needed

### Component Code
- ✓ Starts with `'use client';` and `import 'client-only';`
- ✓ Uses named function declaration: `export function ComponentName()`
- ✓ Function name is PascalCase WITH family prefix included
  - Example: `LinkButton` (not `Link` or `button-link`)
  - Example: `MenuItem` (not `Item`)
  - Example: `KanbanCardHeaderTitle` (not `Title`)
- ✓ No `displayName` property assigned
- ✓ Uses named export (NOT default export)

### Props and Patterns
- ✓ Extends appropriate React Aria component props if applicable
- ✓ Uses `useContextProps` for context integration
- ✓ Destructures props with sensible defaults
- ✓ Uses `composeRenderProps` for className composition
- ✓ Includes data attributes for styling (`data-color`, `data-size`, etc.)
- ✓ Wraps with `IconProvider` if component accepts icon children
- ✓ Sub-components use `useContext` to access parent context

### Exports
- ✓ Component exported from its file with named export
  - Example: `export { LinkButton } from './components/button/link';`
- ✓ Types exported from `/src/index.ts` if part of public API

### Testing and Documentation
- ✓ Created test file (usually `[family].test.tsx` for main component)
- ✓ Created story file (usually `[family].stories.tsx`)
- ✓ Tests demonstrate component composition if applicable
- ✓ All tests pass

### Usage Validation
- ✓ Component can be imported from package root
  - `import { ComponentName } from '@accelint/design-toolkit'`
- ✓ Component works with its variants/sub-components
- ✓ No namespace/dot notation required (e.g., NO `Button.Link`)
- ✓ Component composes correctly in JSX
