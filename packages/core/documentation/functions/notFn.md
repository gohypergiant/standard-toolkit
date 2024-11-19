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

## Defined in

[logical/not/index.ts:26](https://github.com/gohypergiant/standard-toolkit/blob/7f574e64e57e697a3e2daabb1b78393aca67cb22/packages/core/src/logical/not/index.ts#L26)
