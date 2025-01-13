<!-- Copyright 2025 Hypergiant Galactic Systems Inc. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at https://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License. -->

[**@accelint/converters**](../README.md) • **Docs**

***

[@accelint/converters](../README.md) / toBoolean

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

• **val**: `unknown`

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
