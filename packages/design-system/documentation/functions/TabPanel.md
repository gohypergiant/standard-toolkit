[**@accelint/design-system**](../README.md) • **Docs**

***

[@accelint/design-system](../README.md) / TabPanel

# Function: TabPanel()

> **TabPanel**(`props`): `null` \| `ReactElement`\<`any`, `string` \| `JSXElementConstructor`\<`any`\>\>

Must be direct child of TabPanels if TabPanel implements shouldForceMount=true

Othewise can be used anywhere inside of Tabs. TabPanels may be desirable to use
if theme implements any styles that adjust layout

## Parameters

• **props**: `Omit`\<`TabPanelProps`, `"className"` \| `"style"`\> & `BaseTabPanelProps` & `BaseProps` & `RefAttributes`\<`HTMLDivElement`\>

## Returns

`null` \| `ReactElement`\<`any`, `string` \| `JSXElementConstructor`\<`any`\>\>

## Defined in

[packages/design-system/src/components/tabs/tabs.tsx:332](https://github.com/gohypergiant/standard-toolkit/blob/258694cea8ed8bbd956b3cf5da47c2c9debcf127/packages/design-system/src/components/tabs/tabs.tsx#L332)
