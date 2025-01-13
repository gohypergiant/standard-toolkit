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

[@accelint/predicates](../README.md) / isFiniteNumeric

# Function: isFiniteNumeric()

> **isFiniteNumeric**(`val`): `val is number`

Determine if given value is a finite number, or string that parses to a finite number.

Does not include infinities, NaN.

## Parameters

• **val**: `unknown`

## Returns

`val is number`

## Example

```ts
isFiniteNumeric(1.23) // true
isFiniteNumeric('Infinity') // false
isFiniteNumeric(NaN) // false
isFiniteNumeric('1.23') // true
isFiniteNumeric('hi') // false
```
