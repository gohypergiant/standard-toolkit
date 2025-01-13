<!-- Copyright 2025 Hypergiant Galactic Systems Inc. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at https://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License. -->

[**@accelint/geo**](../README.md) • **Docs**

***

[@accelint/geo](../README.md) / createCoordinate

# Function: createCoordinate()

> **createCoordinate**(`initSystem`, `initFormat`): (`input`) => `Readonly`\<`Coordinate`\>

Create a coordinate object enabling: lexing, parsing, validation, and
formatting in alternative systems and formats. The system and format will be
used for validation and eventually for output as defaults if no alternatives
are provided.

## Parameters

• **initSystem**: `AnySystem` = `DEFAULT_SYSTEM`

dd, ddm, or dms

• **initFormat**: `"LATLON"` \| `"LONLAT"` = `FORMATS_DEFAULT`

## Returns

`Function`

### Parameters

• **input**: `string`

### Returns

`Readonly`\<`Coordinate`\>

## Pure

## Example

```ts
const create = createCoordinate(coordinateSystems.dd, 'LATLON')
const create = createCoordinate(coordinateSystems.ddm, 'LONLAT')
```
