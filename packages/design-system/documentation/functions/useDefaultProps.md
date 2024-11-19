[**@accelint/design-system**](../README.md) • **Docs**

***

[@accelint/design-system](../README.md) / useDefaultProps

# Function: useDefaultProps()

> **useDefaultProps**\<`K`, `P`\>(`props`, `key`): `P`

Select default props from context and merge with provided props
with provided props taking precedence

## Type Parameters

• **K** *extends* `"Menu"` \| `"NumberField"` \| `"Button"` \| `"Checkbox"` \| `"CheckboxGroup"` \| `"Chip"` \| `"ChipGroup"` \| `"ComboBox"` \| `"Dialog"` \| `"Drawer"` \| `"DrawerTab"` \| `"DrawerTabList"` \| `"Icon"` \| `"Input"` \| `"LinkButton"` \| `"MenuList"` \| `"MenuItem"` \| `"Options"` \| `"OptionsList"` \| `"OptionsItem"` \| `"Picker"` \| `"Popover"` \| `"Radio"` \| `"RadioGroup"` \| `"SearchField"` \| `"Select"` \| `"Switch"` \| `"Tab"` \| `"TabList"` \| `"TabPanel"` \| `"TabPanels"` \| `"Tabs"` \| `"TextArea"` \| `"TextField"` \| `"ToggleButton"` \| `"Tooltip"` \| `"TooltipTarget"` \| `"Tree"`

• **P** *extends* `undefined` \| [`OmitProtectedProps`](../type-aliases/OmitProtectedProps.md)\<`object`\[`K`\]\>

## Parameters

• **props**: `P`

• **key**: `K`

## Returns

`P`

## Defined in

[packages/design-system/src/hooks/use-defaults/use-defaults.tsx:18](https://github.com/gohypergiant/standard-toolkit/blob/258694cea8ed8bbd956b3cf5da47c2c9debcf127/packages/design-system/src/hooks/use-defaults/use-defaults.tsx#L18)
