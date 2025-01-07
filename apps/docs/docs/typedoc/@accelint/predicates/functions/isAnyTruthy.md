# Function: isAnyTruthy()

> **isAnyTruthy**(`val`): `boolean`

Returns true if the given value is found in any of:
- `isTrue(val)`
- `isYes(val)`
- `isOn(val)`

## Parameters

### val

`unknown`

## Returns

`boolean`

## Pure

## Example

```ts
isAnyTruthy('');        // false
isAnyTruthy('no');      // false
isAnyTruthy('off');     // false
isAnyTruthy(0);         // false
isAnyTruthy(1);         // true
isAnyTruthy(true);      // true
isAnyTruthy('on');      // true
isAnyTruthy('yes');     // true
```
