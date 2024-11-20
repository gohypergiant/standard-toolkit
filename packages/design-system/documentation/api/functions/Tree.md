[**@accelint/design-system**](../README.md) • **Docs**

***

[@accelint/design-system](../README.md) / Tree

# Function: Tree()

> **Tree**\<`T`\>(`props`): `Element`

By default Tree only works as an uncontrolled input. However, if you need to use the Tree
as a controlled input (passing state changes to the "nodes" props), you will need to add a
"key" prop that is a hash of the "nodes" prop to trigger a rerender of the component and
abandon it's previous state. Unfortunately, the underlying hooks don't provide a good way
to update the internal state of the Tree onces it's been initialized.

## Type Parameters

• **T**

## Parameters

• **props**: [`TreeProps`](../type-aliases/TreeProps.md)\<`T`\>

## Returns

`Element`
