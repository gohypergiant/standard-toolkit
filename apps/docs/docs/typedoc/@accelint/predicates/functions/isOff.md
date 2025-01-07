# Function: isOff()

> **isOff**(`val`): `boolean`

Returns true if the given value is found in a case-insensitive list of
"off" values.

False values: ['', '0', 'false', 'nan', 'null', 'undefined']

Additional values: ['off']

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
isOff('off');     // true
isOff('');        // true
isOff(0);         // true
isOff(1);         // false
isOff(true);      // false
isOff('on');      // false
```
