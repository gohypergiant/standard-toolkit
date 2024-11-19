[**@accelint/core**](../README.md) • **Docs**

***

[@accelint/core](../README.md) / assoc

# Function: assoc()

> **assoc**\<`T`\>(`obj`): \<`K`\>(`prop`) => (`val`) => `T`

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

## Alias

associate

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

[object/associate/index.ts:23](https://github.com/gohypergiant/standard-toolkit/blob/87ae5060c82d212b75a10cafb0030b08916e90f1/packages/core/src/object/associate/index.ts#L23)
