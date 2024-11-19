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

## Defined in

[object/lens/index.ts:117](https://github.com/gohypergiant/standard-toolkit/blob/258694cea8ed8bbd956b3cf5da47c2c9debcf127/packages/core/src/object/lens/index.ts#L117)
