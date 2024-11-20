[**@accelint/core**](../README.md) • **Docs**

***

[@accelint/core](../README.md) / notFn

# Function: notFn()

> **notFn**\<`T`\>(`a`): (`b`) => `boolean`

Logical `(!a(b))`

Logical (Function Result) Not (Negation)

## Type Parameters

• **T**

## Parameters

• **a**

## Returns

`Function`

### Parameters

• **b**: `T`

### Returns

`boolean`

## Link

https://en.wikipedia.org/wiki/Negation

## Example

```ts
notFn(x => x & 1)(4);
// true
```
