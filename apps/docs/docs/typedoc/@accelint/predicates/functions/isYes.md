# Function: isYes()

> **isYes**(`val`): `boolean`

Returns true if the given value is found in a case-insensitive list of
"yes" values.

True values: ['1', 'true']

Additional values: ['y', 'yes']

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
isTrue('');        // false
isTrue(0);         // false
isTrue(1);         // true
isTrue(true);      // true
```
