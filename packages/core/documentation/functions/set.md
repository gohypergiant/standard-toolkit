[**@accelint/core**](../README.md) • **Docs**

***

[@accelint/core](../README.md) / set

# Function: set()

> **set**\<`T`, `V`\>(`lensVal`): (`value`) => (`obj`) => `T`

A simple warpper function to access the `set` of a lens and the given object..

## Type Parameters

• **T**

• **V**

## Parameters

• **lensVal**: [`Lens`](../type-aliases/Lens.md)\<`T`, `V`\>

## Returns

`Function`

### Parameters

• **value**: `V`

### Returns

`Function`

#### Parameters

• **obj**: `T`

#### Returns

`T`

## Example

```ts
set(nameLens)('Fred')(personStore);
```

## Defined in

[object/lens/index.ts:86](https://github.com/gohypergiant/standard-toolkit/blob/7f574e64e57e697a3e2daabb1b78393aca67cb22/packages/core/src/object/lens/index.ts#L86)
