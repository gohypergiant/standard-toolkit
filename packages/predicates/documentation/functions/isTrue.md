[**@accelint/predicates**](../README.md) • **Docs**

***

[@accelint/predicates](../README.md) / isTrue

# Function: isTrue()

> **isTrue**(`val`): `boolean`

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
isTrue('on');
// true

isTrue('yes');
// true

isTrue('off');
// false

isTrue('no');
// false
```

## Defined in

[predicates/src/is-noyes/index.ts:45](https://github.com/gohypergiant/standard-toolkit/blob/258694cea8ed8bbd956b3cf5da47c2c9debcf127/packages/predicates/src/is-noyes/index.ts#L45)
