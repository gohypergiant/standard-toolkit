[**@accelint/design-system**](../README.md) • **Docs**

***

[@accelint/design-system](../README.md) / pressToMouseEvent

# Function: pressToMouseEvent()

> **pressToMouseEvent**(`event`): `MouseEvent`\<`Element`, `MouseEvent`\>

This is required because the C2DS Button supports an onPress event but
QueryBuilder provides a callback that expects a MouseEvent and will error
out if preventDefault is not available as a method.

## Parameters

• **event**: `PressEvent`

## Returns

`MouseEvent`\<`Element`, `MouseEvent`\>
