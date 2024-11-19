[**@accelint/design-system**](../README.md) • **Docs**

***

[@accelint/design-system](../README.md) / createCollectionRenderer

# Function: createCollectionRenderer()

> **createCollectionRenderer**\<`C`, `V`\>(`context`, `values`): `CollectionRenderer`

Replace the default collection renderer to allow for injection of
context props for multiple composed components. Also enables use of
Section as wrapper of list items at the top level as a styleable
element within the RAC container

## Type Parameters

• **C** *extends* `object`

• **V** *extends* [`ProviderValues`](../type-aliases/ProviderValues.md)\<`any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`, `any`\>

## Parameters

• **context**: `Context`\<`C`\>

• **values**: `V`

## Returns

`CollectionRenderer`

## Defined in

[packages/design-system/src/components/collection/collection.tsx:13](https://github.com/gohypergiant/standard-toolkit/blob/258694cea8ed8bbd956b3cf5da47c2c9debcf127/packages/design-system/src/components/collection/collection.tsx#L13)
