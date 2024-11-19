[**@accelint/core**](../README.md) • **Docs**

***

[@accelint/core](../README.md) / concat

# Function: concat()

> **concat**\<`T`\>(`newValue`): (`concatable`) => `T`[]

Concatenate the two given arrays together.

## Type Parameters

• **T**

## Parameters

• **newValue**: `T`[]

## Returns

`Function`

### Parameters

• **concatable**: `T`[]

### Returns

`T`[]

## Example

```ts
concat([1, 2, 3])([4, 5, 6]);
// [1, 2, 3, 4, 5, 6]
```

## Defined in

[array/concat/index.ts:9](https://github.com/gohypergiant/standard-toolkit/blob/7f574e64e57e697a3e2daabb1b78393aca67cb22/packages/core/src/array/concat/index.ts#L9)
