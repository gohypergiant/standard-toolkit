---
"@accelint/converters": minor
"@accelint/predicates": minor
---

The `toBoolean` function (packages/converters) centralizes the logic for coercing a value
to a boolean which enables the predicate functions (packages/predicates/src/is-noyes) to
be more specific in what they compare against rather than them simply being alias names
to broad validation. The available predicates are now:

- `isAnyFalsy`
- `isAnyTruthy`
- `isFalse`
- `isTrue`
- `isOn`
- `isOff`
- `isNo`
- `isYes`
