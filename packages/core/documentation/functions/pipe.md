[**@accelint/core**](../README.md) • **Docs**

***

[@accelint/core](../README.md) / pipe

# Function: pipe()

> **pipe**\<`Fns`\>(...`fns`): (`arg`) => `ReturnType`\<`Fns` *extends* readonly [`any`, `Last`] ? `Last` : `never`\>

Allows you combine two or more functions to create a new function, which passes the results from one
function to the next until all have be called. Has a left-to-right call order.

## Type Parameters

• **Fns** *extends* readonly [`UnaryFunction`](../type-aliases/UnaryFunction.md)[]

## Parameters

• ...**fns**: `Pipeable`\<`Fns`\>

## Returns

`Function`

### Parameters

• **arg**: `PipeParams`\<`Fns`\>

### Returns

`ReturnType`\<`Fns` *extends* readonly [`any`, `Last`] ? `Last` : `never`\>

## Example

```ts
const getActiveUsers = page => pipe(
  filterActive,
  sortUserNames,
  displayPage,
);

const activeUsers = getActiveUsersByPage(users);
```

## Defined in

[composition/pipe/index.ts:49](https://github.com/gohypergiant/standard-toolkit/blob/424b88fd48a5bcc02ed99ee27fd64cd73349aa30/packages/core/src/composition/pipe/index.ts#L49)
