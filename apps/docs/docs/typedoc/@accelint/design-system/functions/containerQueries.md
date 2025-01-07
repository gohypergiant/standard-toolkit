# Function: containerQueries()

## Call Signature

> **containerQueries**\<`T`\>(`contract`, ...`styles`): `Record`\<`string`, `ContainerStyle`\>

Bulk container query creation based on the same contract

### Type Parameters

• **T** *extends* `CssVarValues` = `CssVarValues`

### Parameters

#### contract

[`MapLeafNodes`](../type-aliases/MapLeafNodes.md)\<`Omit`\<`T`, keyof `ContainerQueryOptions`\>, `CSSVarFunction`\>

#### styles

...`ContainerQueries`\<`T`\>[]

### Returns

`Record`\<`string`, `ContainerStyle`\>

## Call Signature

> **containerQueries**\<`T`\>(`contract`, ...`styles`): `Record`\<`string`, `GlobalContainerStyle`\>

Bulk container query creation based on the same contract

### Type Parameters

• **T** *extends* `CssVarValues` = `CssVarValues`

### Parameters

#### contract

[`MapLeafNodes`](../type-aliases/MapLeafNodes.md)\<`Omit`\<`T`, keyof `ContainerQueryOptions`\>, `CSSVarFunction`\>

#### styles

...`GlobalContainerQueries`\<`T`\>[]

### Returns

`Record`\<`string`, `GlobalContainerStyle`\>
