# Latitude and Longitude Coordinate Parsing

This library is designed to parse strings that resemble latitude and longitude coordinates and convert them into usable values. The goal is to handle a wide variety of formats as intuitively as possible, without over-interpreting input in a way that might lead to incorrect results.

## Supported Coordinate Systems

The library supports three standard geographic coordinate notation systems:

- **Decimal Degrees (DD)** - Coordinates as decimal numbers (e.g., `37.7749° N, 122.4194° W`)
- **Degrees Decimal Minutes (DDM)** - Integer degrees with decimal minutes (e.g., `37° 46.494' N, 122° 25.164' W`)
- **Degrees Minutes Seconds (DMS)** - Integer degrees, integer minutes, decimal seconds (e.g., `37° 46' 29.64" N, 122° 25' 9.84" W`)

## Format Options

Two coordinate ordering formats are supported:

- **LATLON** - Latitude followed by longitude (standard for most applications)
- **LONLAT** - Longitude followed by latitude (common in GIS systems)

## Features

- **Parsing** - Convert coordinate strings to numeric values with comprehensive error validation
- **Formatting** - Convert numeric coordinates to formatted strings with customizable separators and ordinal directions
- **Conversion** - Transform between coordinate notation systems while preserving accuracy
- **Error Handling** - Detailed error messages for out-of-range values, malformed input, and ambiguous coordinate groupings

## Parsing Stages

The parsing process occurs in three main stages to extract accurate coordinate values:

1. Lexing
2. Raw Parsing
3. Format/Specific Parsing

### Lexing

In the lexing phase, all extraneous characters are removed to facilitate "tokenization." The output of this stage is a refined sequence of character groupings that are meaningful and indicative of the intended coordinate value.

Key operations:

- Extract numbers with optional positional indicators (°, ', ")
- Identify bearing indicators (N, S, E, W)
- Normalize dividers (`,` and `/` become standard divider)
- Remove redundant positive signs and normalize numeric formatting

### Raw Parsing

During this phase, certain disqualifying errors are detected to halt further processing when it's clearly unnecessary. Additionally, some characters (particularly dividers) may be added where appropriate to ensure consistent interpretation in the next stage.

Validation checks include:

- Too many or too few numeric values
- Excessive bearings, degrees, minutes, or seconds indicators
- Ambiguous numeric groupings without clear latitude/longitude separation
- Negative values in invalid positions (only degrees can be negative)
- Bearing/number sign conflicts

### Format/Specific Parsing

This is the primary interface for library users. Specific parsing targets well-known coordinate formats, delivering results that are useful and relevant to most applications, rather than focusing on lower-level parsing details.

Each coordinate system (DD, DDM, DMS) provides:

- Pattern-based validation for the specific notation
- Range checking (latitude: -90 to 90, longitude: -180 to 180)
- Component validation (minutes/seconds: 0-59.999...)
- Conversion to floating-point values
- Formatting back to string representation
