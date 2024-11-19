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

### Defined in

[packages/design-system/src/utils/css.ts:351](https://github.com/gohypergiant/standard-toolkit/blob/258694cea8ed8bbd956b3cf5da47c2c9debcf127/packages/design-system/src/utils/css.ts#L351)

## containerQueries(contract, styles)

> **containerQueries**\<`T`\>(`contract`, ...`styles`): `Record`\<`string`, `GlobalContainerStyle`\>

### Type Parameters

• **T** *extends* `CssVarValues` = `CssVarValues`

### Parameters

• **contract**: [`MapLeafNodes`](../type-aliases/MapLeafNodes.md)\<`Omit`\<`T`, keyof `ContainerQueryOptions`\>, `CSSVarFunction`\>

• ...**styles**: `GlobalContainerQueries`\<`T`\>[]

### Returns

`Record`\<`string`, `GlobalContainerStyle`\>

### Defined in

[packages/design-system/src/utils/css.ts:356](https://github.com/gohypergiant/standard-toolkit/blob/258694cea8ed8bbd956b3cf5da47c2c9debcf127/packages/design-system/src/utils/css.ts#L356)
