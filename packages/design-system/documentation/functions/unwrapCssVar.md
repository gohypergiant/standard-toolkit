[**@accelint/design-system**](../README.md) • **Docs**

***

[@accelint/design-system](../README.md) / unwrapCssVar

# Function: unwrapCssVar()

> **unwrapCssVar**(`cssVar`): `string`

Parse out CSS var name from CSS var implementation

## Parameters

• **cssVar**: `string`

## Returns

`string`

## Examples

```ts
unwrapCssVar('var(--foo)')
// returns '--foo'
```

```ts
unwrapCssVar('var(--foo, blue)')
// returns '--foo'
```

```ts
unwrapCssVar('var(--foo, var(--bar))')
// returns '--foo'
```

## Defined in

[packages/design-system/src/utils/css.ts:33](https://github.com/gohypergiant/standard-toolkit/blob/258694cea8ed8bbd956b3cf5da47c2c9debcf127/packages/design-system/src/utils/css.ts#L33)
