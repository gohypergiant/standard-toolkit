[**@accelint/design-system**](../README.md) • **Docs**

***

[@accelint/design-system](../README.md) / containerQueries

# Function: containerQueries()

## containerQueries(contract, styles)

> **containerQueries**\<`T`\>(`contract`, ...`styles`): `Record`\<`string`, `ContainerStyle`\>

Bulk container query creation based on the same contract

### Type Parameters

• **T** *extends* `CssVarValues` = `CssVarValues`

### Parameters

• **contract**: [`MapLeafNodes`](../type-aliases/MapLeafNodes.md)\<`Omit`\<`T`, keyof `ContainerQueryOptions`\>, `CSSVarFunction`\>

• ...**styles**: `ContainerQueries`\<`T`\>[]

### Returns

`Record`\<`string`, `ContainerStyle`\>

## containerQueries(contract, styles)

> **containerQueries**\<`T`\>(`contract`, ...`styles`): `Record`\<`string`, `GlobalContainerStyle`\>

### Type Parameters

• **T** *extends* `CssVarValues` = `CssVarValues`

### Parameters

• **contract**: [`MapLeafNodes`](../type-aliases/MapLeafNodes.md)\<`Omit`\<`T`, keyof `ContainerQueryOptions`\>, `CSSVarFunction`\>

• ...**styles**: `GlobalContainerQueries`\<`T`\>[]

### Returns

`Record`\<`string`, `GlobalContainerStyle`\>
