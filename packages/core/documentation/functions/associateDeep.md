[**@accelint/core**](../README.md) • **Docs**

***

[@accelint/core](../README.md) / associateDeep

# Function: associateDeep()

> **associateDeep**\<`T`\>(`obj`): \<`K`\>(`prop`) => (`val`) => `T`

Sets the `val` of `prop` in `obj`. Returning a new, deep copy of the object.

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

`Function`

#### Parameters

• **val**: `T`\[`K`\]

#### Returns

`T`

## Example

```ts
associateDeep(personStore)('address')({
  city: 'Austin',
  street: '987 Sample St',
});
// {
//   // ...,
//   city: 'Austin',
//   street: '987 Sample St',
// }
```
