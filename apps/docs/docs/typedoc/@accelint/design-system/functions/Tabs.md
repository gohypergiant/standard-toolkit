# Function: Tabs()

> **Tabs**(`props`): `null` \| `ReactElement`

A required wrapper for other Tabs components, which manages
and provides the state context. Other Tabs components will
throw an error if not wrapped with this component

NOTE: TabList & TabPanels do not have to be direct children
of this component. Additional layout can be introduced around
this components children

## Parameters

### props

`Omit`\<`TabsProps`, `"children"` \| `"className"` \| `"style"`\> & `BaseProps` & `object` & `RefAttributes`\<`HTMLDivElement`\>

## Returns

`null` \| `ReactElement`
