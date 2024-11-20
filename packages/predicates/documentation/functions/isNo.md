[**@accelint/predicates**](../README.md) • **Docs**

***

[@accelint/predicates](../README.md) / isNo

# Function: isNo()

> **isNo**(`val`): `boolean`

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
isNo('on');
// false

isNo('yes');
// false

isNo('off');
// true

isNo('no');
```
