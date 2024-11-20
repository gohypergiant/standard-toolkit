[**@accelint/design-system**](../README.md) • **Docs**

***

[@accelint/design-system](../README.md) / wrapRenderProps

# Function: wrapRenderProps()

> **wrapRenderProps**\<`T`, `U`, `R`\>(`value`, `inject`?): `R` \| (`renderProps`) => `R`

A helper function to pair with React Aria's render props. Typically
implemented with children, className and styles

Allows for the injection of additional renderProps that a component
from React Aria may not already provide

If the value isn't a renderProp function, then it is passed through unchanged

## Type Parameters

• **T** *extends* `object`

• **U** *extends* `object`

• **R**

## Parameters

• **value**: `R` \| (`renderProps`) => `R`

• **inject?**: `U`

## Returns

`R` \| (`renderProps`) => `R`
