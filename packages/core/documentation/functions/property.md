[**@accelint/core**](../README.md) • **Docs**

***

[@accelint/core](../README.md) / property

# Function: property()

> **property**\<`T`\>(`obj`): \<`K`\>(`prop`) => `T`\[`K`\]

Gets the value of `prop` in `obj`. Array index support.

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

## Example

```ts
property(personStore)('address');
// personStore.address

property(userStore.profile)(0);
// userStore.profile.at(0)
```
