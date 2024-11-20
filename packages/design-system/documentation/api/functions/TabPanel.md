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
