[**@accelint/design-system**](../README.md) • **Docs**

***

[@accelint/design-system](../README.md) / Group

# Function: Group()

> **Group**\<`T`, `E`\>(`props`): `null` \| `ReactElement`\<`any`, `string` \| `JSXElementConstructor`\<`any`\>\>

This generic component allows for collective prop distribution to a collection of components of the same type

## Type Parameters

• **T**

• **E** *extends* `Element`

## Parameters

• **props**: `BaseGroupProps`\<`T`, `E`\> & `SlotProps` & `RefAttributes`\<`HTMLDivElement`\>

## Returns

`null` \| `ReactElement`\<`any`, `string` \| `JSXElementConstructor`\<`any`\>\>

## Example

```ts
A list of <Button />s and you want to control their size instead of passing the same props to each
```
