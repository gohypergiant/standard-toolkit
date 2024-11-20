[**@accelint/design-system**](../README.md) • **Docs**

***

[@accelint/design-system](../README.md) / ThemeProviderProps

# Type Alias: ThemeProviderProps

> **ThemeProviderProps**: `PropsWithChildren`\<`object`\>

## Type declaration

### className?

> `optional` **className**: `string`

### inherit?

> `optional` **inherit**: `boolean`

Set to true to skip defaults and inherit classNames, styles, theme & vars from parent
All other props will be merged on top of inherited theme

### style?

> `optional` **style**: `CSSProperties`

Use to set runtime CSS variables, not intended for other styles. Will be passed to
nested themes and global portals

### theme?

> `optional` **theme**: [`ThemeContext`](ThemeContext.md)

### vars?

> `optional` **vars**: [`ThemeVars`](ThemeVars.md)
