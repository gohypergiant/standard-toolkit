[**@accelint/core**](../README.md) • **Docs**

***

[@accelint/core](../README.md) / compose

# Function: compose()

> **compose**\<`Fns`\>(...`fns`): (`arg`) => `ReturnType`\<`Fns`\[`0`\]\>

Allows you combine two or more functions to create a new function, which passes the results from one
function to the next until all have be called. Has a rigth-to-left call order.

## Type Parameters

• **Fns** *extends* readonly [`UnaryFunction`](../type-aliases/UnaryFunction.md)[]

## Parameters

• ...**fns**: `Composable`\<`Fns`\>

## Returns

`Function`

### Parameters

• **arg**: `ComposeParams`\<`Fns`\>

### Returns

`ReturnType`\<`Fns`\[`0`\]\>

## Example

```ts
const getActiveUsers = page => compose(
  displayPage,
  sortUserNames,
  filterActive,
);

const activeUsers = getActiveUsersByPage(users);
```
