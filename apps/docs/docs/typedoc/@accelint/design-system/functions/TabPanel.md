# Function: TabPanel()

> **TabPanel**(`props`): `null` \| `ReactElement`

Must be direct child of TabPanels if TabPanel implements shouldForceMount=true

Othewise can be used anywhere inside of Tabs. TabPanels may be desirable to use
if theme implements any styles that adjust layout

## Parameters

### props

`Omit`\<`TabPanelProps`, `"className"` \| `"style"`\> & `BaseTabPanelProps` & `BaseProps` & `RefAttributes`\<`HTMLDivElement`\>

## Returns

`null` \| `ReactElement`
