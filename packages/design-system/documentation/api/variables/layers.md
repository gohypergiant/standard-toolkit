[**@accelint/design-system**](../README.md) • **Docs**

***

[@accelint/design-system](../README.md) / layers

# Variable: layers

> `const` **layers**: `object`

Be aware that using parent layers overrides their children

Example: "framework" overrides "components"

Because of this, it is recommended to never directly use the
parent layers directly, only their children, which is why we
don't export them

## Type declaration

### components

> **components**: `Record`\<`"l1"` \| `"l5"` \| `"l4"` \| `"l2"` \| `"l3"`, `string`\> = `componentsLevels`

### overrides

> **overrides**: `Record`\<`"l1"` \| `"l5"` \| `"l4"` \| `"l2"` \| `"l3"`, `string`\> = `overridesLevels`

### reset

> **reset**: `string`

### styles

> **styles**: `string`

### variables

> **variables**: `Record`\<`"l1"` \| `"l5"` \| `"l4"` \| `"l2"` \| `"l3"`, `string`\> = `varsLevels`
