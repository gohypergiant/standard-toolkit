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
