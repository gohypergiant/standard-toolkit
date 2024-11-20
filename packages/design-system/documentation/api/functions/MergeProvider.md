[**@accelint/design-system**](../README.md) • **Docs**

***

[@accelint/design-system](../README.md) / MergeProvider

# Function: MergeProvider()

> **MergeProvider**\<`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`, `I`, `J`, `K`\>(`__namedParameters`): `Element`

Merges provided contexts with parent contexts, if available and of the same structure
If parent context doesn't exist or differs in structure (slotted vs non-slotted) from
the context being provided, the provided context will override the parent context

This is typically used in conjunction with React Aria Component's contexts, where a
RAC may provide a slotted context (ex: ButtonContext, with a slot of "remove") where
that slot has a number of attributes and event listeners, but we want to merge in our
own to supplement things for stylistic or additional functionality purposes

See tests for examples

## Type Parameters

• **A**

• **B**

• **C**

• **D**

• **E**

• **F**

• **G**

• **H**

• **I**

• **J**

• **K**

## Parameters

• **\_\_namedParameters**: [`MergeProviderProps`](../type-aliases/MergeProviderProps.md)\<`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`, `I`, `J`, `K`\>

## Returns

`Element`
