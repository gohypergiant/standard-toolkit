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
