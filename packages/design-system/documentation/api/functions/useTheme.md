[**@accelint/design-system**](../README.md) • **Docs**

***

[@accelint/design-system](../README.md) / useTheme

# Function: useTheme()

> **useTheme**\<`T`\>(`contract`?): [`ThemeContext`](../type-aliases/ThemeContext.md) & `object`

Computes CSS values into DeckGL compatible formats using the optionally provided contract

This function allows for the reuse of CSS contract tokens within React context for non-CSS
use cases. This ensures synchronized theming across the entire rendering stack

## Type Parameters

• **T** *extends* [`Contract`](../type-aliases/Contract.md)

## Parameters

• **contract?**: `T`

## Returns

[`ThemeContext`](../type-aliases/ThemeContext.md) & `object`
