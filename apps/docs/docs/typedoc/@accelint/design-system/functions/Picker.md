# Function: Picker()

> **Picker**\<`T`\>(`props`): `null` \| `ReactElement`

Generic stylable picker that supports the functionality (sans drag and drop) of
React Aria's ListBox: https://react-spectrum.adobe.com/react-aria/ListBox.html

NOTE: The picker items does not support sections or separators

## Type Parameters

• **T** *extends* `object`

## Parameters

### props

`Omit`\<`ListBoxProps`\<`T`\>, `"className"` \| `"style"` \| `"dragAndDropHooks"`\> & `BaseProps` & `object` & `RefAttributes`\<`HTMLDivElement`\>

## Returns

`null` \| `ReactElement`
