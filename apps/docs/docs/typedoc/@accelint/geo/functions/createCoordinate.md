# Function: createCoordinate()

> **createCoordinate**(`initSystem`, `initFormat`): (`input`) => `Readonly`\<`Coordinate`\>

Create a coordinate object enabling: lexing, parsing, validation, and
formatting in alternative systems and formats. The system and format will be
used for validation and eventually for output as defaults if no alternatives
are provided.

## Parameters

### initSystem

`AnySystem` = `DEFAULT_SYSTEM`

dd, ddm, or dms

### initFormat

`"LATLON"` | `"LONLAT"`

## Returns

`Function`

### Parameters

#### input

`string`

### Returns

`Readonly`\<`Coordinate`\>

## Pure

## Example

```ts
const create = createCoordinate(coordinateSystems.dd, 'LATLON')
const create = createCoordinate(coordinateSystems.ddm, 'LONLAT')
```
