[**@accelint/predicates**](../README.md) • **Docs**

***

[@accelint/predicates](../README.md) / isFalse

# Function: isFalse()

> **isFalse**(`val`): `boolean`

Compare the given value against a custom list of `falsey` values.

String values are not case sensitive.

_0, '0', 'n', 'no', 'off', 'false', false_

## Parameters

• **val**: `unknown`

## Returns

`boolean`

## Pure

## Example

```ts
isFalse('on');
// false

isFalse('yes');
// false

isFalse('off');
// true

isFalse('no');
// true
```

## Defined in

[predicates/src/is-noyes/index.ts:98](https://github.com/gohypergiant/standard-toolkit/blob/258694cea8ed8bbd956b3cf5da47c2c9debcf127/packages/predicates/src/is-noyes/index.ts#L98)
