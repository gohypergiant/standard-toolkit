[**@accelint/design-system**](../README.md) • **Docs**

***

[@accelint/design-system](../README.md) / useContextProps

# Function: useContextProps()

> **useContextProps**\<`T`, `U`, `E`\>(`props`, `ref`, `context`): [`T`, `RefObject`\<`E` \| `null`\>]

Reimplementation of React Aria's useContextProps, to utilize our own
mergeProps which handles renderProps and classNames

## Type Parameters

• **T**

• **U** *extends* `SlotProps`

• **E** *extends* `Element`

## Parameters

• **props**: `T` & `SlotProps`

• **ref**: `ForwardedRef`\<`E`\>

• **context**: `Context`\<`ContextValue`\<`U`, `E`\>\>

## Returns

[`T`, `RefObject`\<`E` \| `null`\>]
