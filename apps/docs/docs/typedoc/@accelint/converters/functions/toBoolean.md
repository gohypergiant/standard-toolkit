# Function: toBoolean()

> **toBoolean**(`val`): `boolean`

Returns true for any value not found to be a "false" value.

**"false" values**
  - inherently false values: '' (empty string), 0, false, undefined, null, NaN
  - numeric zero: '0.000' - any number of leading or trailing zeros
  - string literal: 'false' - any capitalizations or space-padding

For more restrictive comparisons against: true, false, on, off, yes, no; see
the predicates package (@accelint/predicates).

## Parameters

### val

`unknown`

## Returns

`boolean`

## Pure

## Example

```ts
toBoolean(1);          // true
toBoolean(' FaLsE ');  // false
toBoolean('  true');   // true
toBoolean('000.000');  // false
```
