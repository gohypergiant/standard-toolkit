[**@accelint/design-system**](../README.md) • **Docs**

***

[@accelint/design-system](../README.md) / usePropagatingPress

# Function: usePropagatingPress()

> **usePropagatingPress**(`props`): `PressResult`

The default behavior of usePress is to stop all propagation of press events

To allow the more typical behavior of event propagation by default, this hook
continues propagation of press events. This allows for nested press event
listeners to not block press event listeners higher in the heirarchy

## Parameters

• **props**: `PressHookProps`

## Returns

`PressResult`
