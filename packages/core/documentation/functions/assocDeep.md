[**@accelint/core**](../README.md) • **Docs**

***

[@accelint/core](../README.md) / assocDeep

# Function: assocDeep()

> **assocDeep**\<`T`\>(`obj`): \<`K`\>(`prop`) => (`val`) => `T`

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

## Alias

associateDeep

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

[object/associate/index.ts:53](https://github.com/gohypergiant/standard-toolkit/blob/424b88fd48a5bcc02ed99ee27fd64cd73349aa30/packages/core/src/object/associate/index.ts#L53)
