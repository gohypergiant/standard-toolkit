[**@accelint/predicates**](../README.md) • **Docs**

***

[@accelint/predicates](../README.md) / isYes

# Function: isYes()

> **isYes**(`val`): `boolean`

Compare the given value against a custom list of `truthy` values.

String values are not case sensitive.

_1, '1', 'y', 'yes', 'on', 'true', true_

## Parameters

• **val**: `unknown`

## Returns

`boolean`

## Pure

## Example

```ts
isYes('on');
// true

isYes('yes');
// true

isYes('off');
// false

isYes('no');
// false
```

## Defined in

[predicates/src/is-noyes/index.ts:72](https://github.com/gohypergiant/standard-toolkit/blob/7f574e64e57e697a3e2daabb1b78393aca67cb22/packages/predicates/src/is-noyes/index.ts#L72)
