[**@accelint/core**](../README.md) • **Docs**

***

[@accelint/core](../README.md) / lensOptionalProp

# Function: lensOptionalProp()

> **lensOptionalProp**\<`T`\>(): \<`K`\>(`prop`) => [`Lens`](../type-aliases/Lens.md)\<`T`, `undefined` \| `T`\[`K`\]\>

Short-hand to create is simplistic, optional, get/set lens.

## Type Parameters

• **T** *extends* `object`

## Returns

`Function`

### Type Parameters

• **K** *extends* `string` \| `number` \| `symbol`

### Parameters

• **prop**: `K`

### Returns

[`Lens`](../type-aliases/Lens.md)\<`T`, `undefined` \| `T`\[`K`\]\>

## Example

```ts
const { get, set } = lensOptionalProp<Person>()('name');
```
