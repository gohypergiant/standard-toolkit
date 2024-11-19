[**@accelint/core**](../README.md) • **Docs**

***

[@accelint/core](../README.md) / prop

# Function: prop()

> **prop**\<`T`\>(`obj`): \<`K`\>(`prop`) => `T`\[`K`\]

## Type Parameters

• **T** *extends* `object`

## Parameters

• **obj**: `T`

## Returns

`Function`

### Type Parameters

• **K** *extends* `string` \| `number` \| `symbol`

### Parameters

• **prop**: `K`

### Returns

`T`\[`K`\]

## Alias

property

## Example

```ts
property(personStore)('address');
// personStore.address

property(userStore.profile)(0);
// userStore.profile.at(0)
```

## Defined in

[object/property/index.ts:21](https://github.com/gohypergiant/standard-toolkit/blob/87ae5060c82d212b75a10cafb0030b08916e90f1/packages/core/src/object/property/index.ts#L21)
