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
