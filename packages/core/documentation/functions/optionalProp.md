[**@accelint/core**](../README.md) • **Docs**

***

[@accelint/core](../README.md) / optionalProp

# Function: optionalProp()

> **optionalProp**\<`T`\>(`obj`?): \<`K`\>(`prop`) => `undefined` \| `T`\[`K`\]

## Type Parameters

• **T** *extends* `object`

## Parameters

• **obj?**: `T`

## Returns

`Function`

### Type Parameters

• **K** *extends* `string` \| `number` \| `symbol`

### Parameters

• **prop**: `K`

### Returns

`undefined` \| `T`\[`K`\]

## Alias

optionalProperty

## Example

```ts
optionalProperty(personStore)('address');
// personStore?.address

optionalProperty(userStore.profile)(0);
// userStore?.profile?.at(0)
```

## Defined in

[object/property/index.ts:43](https://github.com/gohypergiant/standard-toolkit/blob/258694cea8ed8bbd956b3cf5da47c2c9debcf127/packages/core/src/object/property/index.ts#L43)
