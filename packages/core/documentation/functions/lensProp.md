[**@accelint/core**](../README.md) • **Docs**

***

[@accelint/core](../README.md) / lensProp

# Function: lensProp()

> **lensProp**\<`T`\>(): \<`K`\>(`prop`) => [`Lens`](../type-aliases/Lens.md)\<`T`, `T`\[`K`\]\>

Short-hand to create is simplistic get/set lens.

## Type Parameters

• **T** *extends* `object`

## Returns

`Function`

### Type Parameters

• **K** *extends* `string` \| `number` \| `symbol`

### Parameters

• **prop**: `K`

### Returns

[`Lens`](../type-aliases/Lens.md)\<`T`, `T`\[`K`\]\>

## Example

```ts
const { get, set } = lensProp<Person>()('name');
```

## Defined in

[object/lens/index.ts:103](https://github.com/gohypergiant/standard-toolkit/blob/87ae5060c82d212b75a10cafb0030b08916e90f1/packages/core/src/object/lens/index.ts#L103)
