---
trigger: always_on
---

# Design Toolkit Component Standards

These rules define the component pattern standard for `design-toolkit/component/src/components`. All components in this directory must follow these conventions.

## Component File Organization

**One Component Per File**
- Each component must be defined in its own separate file
- Never combine multiple component definitions in a single file (except for Context/Provider - see exception below)
- Component files must use kebab-case naming

**File Naming Convention**

There are two file naming patterns. **Use the Variant Pattern by default** unless explicitly specified otherwise for specific component families.

**Pattern 1: Variant Pattern (Default)**
- Strip the parent component name prefix from the file name
- Use this for component variants (different styles/versions of the same component type)
- Examples:
  - `Button.PrimaryButton` → `primary-button.tsx`
  - `Button.SecondaryButton` → `secondary-button.tsx`
  - `Button.DangerButton` → `danger-button.tsx`

**Pattern 2: Sub-component Pattern (Use When Specified)**
- Keep the full component name in kebab-case (including parent prefix)
- Use this for compositional sub-components (parts that work together)
- Only use when explicitly specified for certain component families (e.g., Menu, Dialog)
- Examples:
  - `Menu.Item` → `menu-item.tsx`
  - `Menu.Separator` → `menu-separator.tsx`
  - `Dialog.Header` → `dialog-header.tsx`
  - `Dialog.Footer` → `dialog-footer.tsx`

**Context & Provider Exception**
- If a component folder includes **both** a context and a provider component:
  - Create a single file named `context.tsx`
  - Export both the context and the provider component from this file
  - This is the **only** scenario where multiple component-related exports are allowed in one file

## Component Definition Format

**Use Named Function Declarations**
- Always use `export function ComponentName()` syntax
- Never use arrow function const declarations (`const Component = () => {}`)
- Never use default exports for components

**Component Naming**
- Function name must be in PascalCase
- Remove all dots from the component's display name to create the function name
- Examples:
  - `Button.PrimaryButton` → `function PrimaryButton()`
  - `Menu.Item` → `function MenuItem()`
  - `Dialog.Header` → `function DialogHeader()`
  - `Table.Row.Cell` → `function TableRowCell()`

**No displayName Assignments**
- Never assign the `displayName` property to components
- The function name itself serves as the component identifier

## Component Example

```typescript
// button/primary-button.tsx
export function PrimaryButton({ children, ...props }) {
  return <button className="primary" {...props}>{children}</button>
}
```

### Context/Provider Example

```typescript
// dialog/context.tsx
export const DialogContext = createContext<DialogContextType | null>(null)

export function DialogProvider({ children }: DialogProviderProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <DialogContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </DialogContext.Provider>
  )
}
```

## Supporting Files Organization

Each component folder may contain:

- **Component files**: `[component-name].tsx` (one per component)
- **Types**: `types.ts` - Shared TypeScript types and interfaces
- **Styles**: `styles.ts` - Shared styling definitions
- **Tests**: `[component-name].test.tsx` - Component unit tests
- **Stories**: `[component-name].stories.tsx` - Storybook stories
- **Documentation**: `[component-name].docs.mdx` - Component documentation
- **Index**: `index.tsx` - Re-exports for public API (if needed)

**Test File Naming**
- Test file names must match the component file name
- Example: `primary-button.tsx` → `primary-button.test.tsx`

**Story File Naming**
- Story file names must match the component file name
- Example: `primary-button.tsx` → `primary-button.stories.tsx`

**Documentation File Naming**
- Documentation file names must match the component file name
- Example: `primary-button.tsx` → `primary-button.docs.mdx`

## Import/Export Patterns

**Exporting from Index**
- The `index.tsx` file should **only export the main/parent component**
- Sub-components and variants are NOT re-exported from the index
- Only export shared types if needed

```typescript
// button/index.tsx
export { Button } from './button'
export type { ButtonProps } from './types'
```

**Importing Components**
```typescript
// Import main component from the folder index
import { Button } from './button'

// Import variants/sub-components directly from their files
import { PrimaryButton } from './button/primary-button'
import { SecondaryButton } from './button/secondary-button'

// For sub-component pattern (when used):
import { MenuItem } from './menu/menu-item'
import { MenuSeparator } from './menu/menu-separator'
```

## Composite Component Patterns

When building composite components (e.g., `Menu.Item`, `Dialog.Header`) using the **Sub-component Pattern**:

1. **Create separate files** for each sub-component
2. **Keep parent prefix** in file names (use full component name in kebab-case)
3. **Include parent name** in the function name (PascalCase, no dots)
4. **Index exports only** the main component (not sub-components)

Example structure using Sub-component Pattern:
```
menu/
├── menu.tsx              → export function Menu()
├── menu-item.tsx         → export function MenuItem()
├── menu-separator.tsx    → export function MenuSeparator()
├── index.tsx             → ONLY exports: Menu (and types)
├── types.ts              → shared types
├── menu.test.tsx
├── menu-item.test.tsx
└── menu-separator.test.tsx
```

**Usage:**
```typescript
// index.tsx
export { Menu } from './menu'
export type { MenuProps, MenuItemProps } from './types'

// In consuming code:
import { Menu } from './menu'                         // from index
import { MenuItem } from './menu/menu-item'           // direct import
import { MenuSeparator } from './menu/menu-separator' // direct import
```

Example structure using Variant Pattern (default):
```
button/
├── button.tsx            → export function Button()
├── primary-button.tsx    → export function PrimaryButton()
├── secondary-button.tsx  → export function SecondaryButton()
├── index.tsx             → ONLY exports: Button (and types)
├── types.ts              → shared types
├── button.test.tsx
├── primary-button.test.tsx
└── secondary-button.test.tsx
```

**Usage:**
```typescript
// index.tsx
export { Button } from './button'
export type { ButtonProps } from './types'

// In consuming code:
import { Button } from './button'                           // from index
import { PrimaryButton } from './button/primary-button'     // direct import
import { SecondaryButton } from './button/secondary-button' // direct import
```

## Quality Checklist

When creating components, ensure:

- ✓ Component uses named function declaration
- ✓ Function name is PascalCase with no dots
- ✓ File name follows the correct pattern:
  - Variant Pattern (default): kebab-case without parent prefix
  - Sub-component Pattern (when specified): kebab-case with parent prefix
- ✓ No `displayName` property assigned
- ✓ Component uses named export (not default)
- ✓ Index.tsx only exports the main component (and types)
- ✓ Test file name matches component file name
- ✓ Story file name matches component file name
- ✓ All tests pass
