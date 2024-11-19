[**@accelint/design-system**](../README.md) • **Docs**

***

[@accelint/design-system](../README.md) / computeContract

# Function: computeContract()

> **computeContract**\<`T`\>(`contract`, `css`): `FulfilledContract`\<`T`\>

Convert contract to nested object of identical shape with computed CSS values
Pixel values are converted to numbers
RGB(A) values are converted to DeckGL compatible tuples
All other values are left unconverted

## Type Parameters

• **T** *extends* [`Contract`](../type-aliases/Contract.md)

## Parameters

• **contract**: `T`

• **css**: `CSSStyleDeclaration`

## Returns

`FulfilledContract`\<`T`\>

## Defined in

[packages/design-system/src/utils/css.ts:51](https://github.com/gohypergiant/standard-toolkit/blob/258694cea8ed8bbd956b3cf5da47c2c9debcf127/packages/design-system/src/utils/css.ts#L51)
