[**@accelint/core**](../README.md) • **Docs**

***

[@accelint/core](../README.md) / optionalProperty

# Function: optionalProperty()

> **optionalProperty**\<`T`\>(`obj`?): \<`K`\>(`prop`) => `undefined` \| `T`\[`K`\]

Gets the optional value of `prop` in `obj`. Array index support.

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

## Example

```ts
optionalProperty(personStore)('address');
// personStore?.address

optionalProperty(userStore.profile)(0);
// userStore?.profile?.at(0)
```

## Defined in

[object/property/index.ts:34](https://github.com/gohypergiant/standard-toolkit/blob/424b88fd48a5bcc02ed99ee27fd64cd73349aa30/packages/core/src/object/property/index.ts#L34)
