# Function: isFalse()

> **isFalse**(`val`): `boolean`

Returns true if the given value is found in a case-insensitive list of
"false" values.

False values: ['', '0', 'false', 'nan', 'null', 'undefined']

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
isFalse('');        // true
isFalse(0);         // true
isFalse(1);         // false
isFalse(true);      // false
```
