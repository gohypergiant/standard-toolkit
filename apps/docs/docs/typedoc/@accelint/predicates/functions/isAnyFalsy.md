# Function: isAnyFalsy()

> **isAnyFalsy**(`val`): `boolean`

Returns true if the given value is found in any of:
- `isFalse(val)`
- `isNo(val)`
- `isOff(val)`

## Parameters

### val

`unknown`

## Returns

`boolean`

## Pure

## Example

```ts
isAnyFalsy('');        // true
isAnyFalsy('no');      // true
isAnyFalsy('off');     // true
isAnyFalsy(0);         // true
isAnyFalsy(1);         // false
isAnyFalsy(true);      // false
isAnyFalsy('on');      // false
isAnyFalsy('yes');     // false
```
