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
