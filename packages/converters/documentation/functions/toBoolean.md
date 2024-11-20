[**@accelint/converters**](../README.md) • **Docs**

***

[@accelint/converters](../README.md) / toBoolean

# Function: toBoolean()

> **toBoolean**(`val`): `boolean`

Compare the given value against a custom list of `truthy` values.

String values are not case sensitive.

_1, '1', 'on', 'true', 'yes', true_

## Parameters

• **val**: `unknown`

## Returns

`boolean`

## Pure

## Example

```ts
toBoolean('on');
// true

toBoolean('yes');
// true

toBoolean('off');
// false

toBoolean('no');
// false
```
