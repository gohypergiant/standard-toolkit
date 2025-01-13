<!-- Copyright 2025 Hypergiant Galactic Systems Inc. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at https://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License. -->

[**@accelint/predicates**](../README.md) • **Docs**

***

[@accelint/predicates](../README.md) / isNumeric

# Function: isNumeric()

> **isNumeric**(`val`): `val is number`

Determine if given value is a number, or string that parses to a number. Includes infinities and NaN.

Non-finite strings are: 'Infinity', '-Infinity', and 'NaN'.

## Parameters

• **val**: `unknown`

## Returns

`val is number`

## Example

```ts
isNumeric(1.23) // true
isNumeric('Infinity') // true
isNumeric(NaN) // true
isNumeric('1.23') // true
isNumeric('hi') // false
```
