[**@accelint/core**](../README.md) • **Docs**

***

[@accelint/core](../README.md) / associate

# Function: associate()

> **associate**\<`T`\>(`obj`): \<`K`\>(`prop`) => (`val`) => `T`

Sets the `val` of `prop` in `obj`. Returning a new, shallow copy of the object.

## Type Parameters

• **T** *extends* `object`

## Parameters

• **obj**: `T`

## Returns

`Function`

### Type Parameters

• **K** *extends* `string` \| `number` \| `symbol` = keyof `T`

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
associate(personStore)('address')({
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

[object/associate/index.ts:16](https://github.com/gohypergiant/standard-toolkit/blob/87ae5060c82d212b75a10cafb0030b08916e90f1/packages/core/src/object/associate/index.ts#L16)
