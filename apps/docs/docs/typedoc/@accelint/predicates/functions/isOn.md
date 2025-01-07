# Function: isOn()

> **isOn**(`val`): `boolean`

Returns true if the given value is found in a case-insensitive list of
"on" values.

True values: ['1', 'true']

Additional values: ['on']

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
isOn('off');     // false
isOn('');        // false
isOn(0);         // false
isOn(1);         // true
isOn(true);      // true
isOn('on');      // true
```
