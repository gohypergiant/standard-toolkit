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

[@accelint/predicates](../README.md) / isNo

# Function: isNo()

> **isNo**(`val`): `boolean`

Returns true if the given value is found in a case-insensitive list of
"no" values.

False values: ['', '0', 'false', 'nan', 'null', 'undefined']

Additional values: ['n', 'no']

For a more liberal comparison/coercion to true or false see the converters
package (@accelint/converters).

## Parameters

• **val**: `unknown`

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
