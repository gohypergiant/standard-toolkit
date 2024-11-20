[**@accelint/design-system**](../README.md) • **Docs**

***

[@accelint/design-system](../README.md) / TextArea

# Function: TextArea()

> **TextArea**(`props`): `null` \| `ReactElement`\<`any`, `string` \| `JSXElementConstructor`\<`any`\>\>

We implement a textarea as a content editable span to provide
improved UX, where the input area automatically grows with input
content length. This can be overriden by applying max-height
and overflow CSS, if desired.

This also has the side effect of changing the target element in
the ref and event handlers. The normal `event.target.value` is not
available, and must be substituted with `event.currentTarget.textContent`

## Parameters

• **props**: `Omit`\<`TextAreaProps`, `"children"` \| `"className"` \| `"style"` \| `"onChange"` \| `"cols"` \| `"rows"`\> & `BaseTextAreaProps` & `RefAttributes`\<`HTMLTextAreaElement`\>

## Returns

`null` \| `ReactElement`\<`any`, `string` \| `JSXElementConstructor`\<`any`\>\>
