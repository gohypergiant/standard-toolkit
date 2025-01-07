# Function: isNo()

> **isNo**(`val`): `boolean`

Returns true if the given value is found in a case-insensitive list of
"no" values.

False values: ['', '0', 'false', 'nan', 'null', 'undefined']

Additional values: ['n', 'no']

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
isNo('n');       // true
isNo('');        // true
isNo(0);         // true
isNo(1);         // false
isNo(true);      // false
isNo('yes');     // false
```
