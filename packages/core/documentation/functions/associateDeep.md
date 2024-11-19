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

## Defined in

[object/associate/index.ts:40](https://github.com/gohypergiant/standard-toolkit/blob/7f574e64e57e697a3e2daabb1b78393aca67cb22/packages/core/src/object/associate/index.ts#L40)
