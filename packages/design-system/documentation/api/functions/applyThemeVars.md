[**@accelint/design-system**](../README.md) • **Docs**

***

[@accelint/design-system](../README.md) / applyThemeVars

# Function: applyThemeVars()

> **applyThemeVars**\<`T`\>(`contract`, `styles`, `layer`): `StyleRule`

Helper for establishing global theme variables with the restriction that
only variables may be set (and are required). All other styles must be
established using alternative utils

The first style rule has an optional query. If the query is missing, the vars
are set outside of a container query

## Type Parameters

• **T** *extends* `CssVarValues` = `CssVarValues`

## Parameters

• **contract**: [`MapLeafNodes`](../type-aliases/MapLeafNodes.md)\<`Omit`\<`T`, keyof `ContainerQueryOptions`\>, `CSSVarFunction`\>

• **styles**: [`QueryOptionalVarsOnlyContainerQuery`\<`T`\>, ...Required\<Pick\<ContainerQueries\<T\>, "vars" \| "query"\>\>\[\]] \| `Required`\<`Pick`\<`ContainerQueries`\<`T`\>, `"vars"` \| `"query"`\>\>[]

• **layer**: `string` = `layers.variables.l1`

## Returns

`StyleRule`
