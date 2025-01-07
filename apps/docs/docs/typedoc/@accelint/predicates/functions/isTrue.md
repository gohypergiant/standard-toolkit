# Function: isTrue()

> **isTrue**(`val`): `boolean`

Returns true if the given value is found in a case-insensitive list of
"true" values.

True values: ['1', 'true']

For a more liberal comparison/coercion to true or false see the converters
package (@accelint/converters).

## Parameters

### val

`unknown`

## Returns

`boolean`

## Pure

## Example

```ts
isOn('no');      // false
isOn('');        // false
isOn(0);         // false
isOn(1);         // true
isOn(true);      // true
isOn('yes');     // true
```
