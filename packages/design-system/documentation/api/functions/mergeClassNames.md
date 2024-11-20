[**@accelint/design-system**](../README.md) • **Docs**

***

[@accelint/design-system](../README.md) / mergeClassNames

# Function: mergeClassNames()

> **mergeClassNames**\<`T`\>(...`classNamesToMerge`): `undefined` \| `T`

Deep merges classNames objects by concatenating class values

## Type Parameters

• **T** *extends* [`ClassNames`](../type-aliases/ClassNames.md)

## Parameters

• ...**classNamesToMerge**: (`undefined` \| `null` \| `T`)[]

## Returns

`undefined` \| `T`

## Example

```ts
mergeClassNames({ foo: 'foo' }, { foo: 'FOO', bar: 'bar' })
// returns { foo: 'foo FOO', bar: 'bar' }
```
