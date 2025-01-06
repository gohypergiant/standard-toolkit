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

[@accelint/predicates](../README.md) / isNumber

# Function: isNumber()

> **isNumber**(`val`): `val is number`

Determine if the given value is a number.

Includes Infinities and NaN, does not include strings that look like numbers

## Parameters

• **val**: `unknown`

## Returns

`val is number`

## Example

```ts
isNumber(1.23) // true
isNumber(Infinity) // true
isNumber(NaN) // true
isNumber('1.23') // false
```