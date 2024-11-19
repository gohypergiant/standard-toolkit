[**@accelint/core**](../README.md) • **Docs**

***

[@accelint/core](../README.md) / get

# Function: get()

> **get**\<`T`, `V`\>(`lensVal`): (`obj`) => `V`

A simple warpper function to access the `get` of a lens and the given object.

## Type Parameters

• **T**

• **V**

## Parameters

• **lensVal**: [`Lens`](../type-aliases/Lens.md)\<`T`, `V`\>

## Returns

`Function`

### Parameters

• **obj**: `T`

### Returns

`V`

## Example

```ts
get(nameLens)(personStore);
```

## Defined in

[object/lens/index.ts:75](https://github.com/gohypergiant/standard-toolkit/blob/424b88fd48a5bcc02ed99ee27fd64cd73349aa30/packages/core/src/object/lens/index.ts#L75)
