[**@accelint/design-system**](../README.md) • **Docs**

***

[@accelint/design-system](../README.md) / ChipItem

# Function: ChipItem()

> **ChipItem**(`props`): `null` \| `ReactElement`\<`any`, `string` \| `JSXElementConstructor`\<`any`\>\>

Must be used in conjunction with ChipList & ChipGroup and
cannot be used outside of ChipList, else will throw error

Color & Size props can be passed in from ChipGroup and overriden
on each instance of this components

Order of precedence (from lowest to highest):
Design System Defaults of Chip
Global Defaults of ChipGroup
Instance of ChipGroup
Global Defaults of ChipItem
Instance of ChipItem

## Parameters

• **props**: `Omit`\<`TagProps`, `"children"` \| `"className"` \| `"style"`\> & `BaseChipProps` & `RefAttributes`\<`HTMLDivElement`\>

## Returns

`null` \| `ReactElement`\<`any`, `string` \| `JSXElementConstructor`\<`any`\>\>

## Defined in

[packages/design-system/src/components/chip/chip.tsx:128](https://github.com/gohypergiant/standard-toolkit/blob/258694cea8ed8bbd956b3cf5da47c2c9debcf127/packages/design-system/src/components/chip/chip.tsx#L128)
