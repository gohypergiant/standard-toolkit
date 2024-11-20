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
