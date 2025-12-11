# AI Agent Prompts for Geo Package

This document contains the prompts used with GitHub Copilot and ChatGPT to generate the coordinate conversion functions in the `@accelint/geo` package. These prompts are provided for verification and reproducibility purposes.

## Overview

The geo package implements conversions between three coordinate systems:
- **MGRS** (Military Grid Reference System)
- **UTM** (Universal Transverse Mercator)
- **WGS84** (World Geodetic System 1984) - Latitude/Longitude

## Primary Conversion Functions

### 1. MGRS to UTM Conversion (`src/mgrs/to-utm-from-mgrs.ts`)

**Prompt:**
```
Create a TypeScript function that converts MGRS (Military Grid Reference System) coordinates to UTM (Universal Transverse Mercator) coordinates. The function should:

1. Accept a TokensMGRS object containing:
   - zoneNumber: UTM zone number (1-60)
   - zoneLetter: MGRS latitude band letter (C-X, excluding I and O)
   - gridCol: 100km grid square column letter
   - gridRow: 100km grid square row letter
   - easting: Easting within grid square (0-99999, depending on precision)
   - northing: Northing within grid square (0-99999, depending on precision)
   - precision: Number of digits in easting/northing (1-5)

2. Return a TokensUTM object with full UTM coordinates:
   - zoneNumber: Same as input
   - zoneLetter: Same as input
   - hemisphere: Derived from zone letter (N-X = 'N', C-M = 'S')
   - easting: Full easting value in meters
   - northing: Full northing value in meters
   - precision: Precision metadata

3. Implement the conversion logic:
   - Calculate the 100km grid square offset for the column letter based on zone number
   - Calculate the 100km grid square offset for the row letter based on zone number, zone letter, and hemisphere
   - Scale MGRS precision values (each digit = 10^(5-precision) meters)
   - Combine offsets and scaled values to produce full UTM coordinates

4. Helper functions needed:
   - gridColumnToEasting(col: string, zoneNumber: number): number
     * Use GRID_COLUMN_CYCLE (3 zones), GRID_COLUMN_SET_SIZE (8 letters), and GRID_COLUMN_LETTERS
     * Calculate position within the current set with wrapping
     * Each column is 100km (GRID_SQUARE_SIZE_METERS) wide
   
   - gridRowToNorthing(row: string, zoneNumber: number, zoneLetter: string, hemisphere: 'N' | 'S'): number
     * Use gridRowOffset helper to determine base offset based on hemisphere and zone number
     * Account for 2M meter row cycling (GRID_ROW_CYCLE_METERS)
     * Use GRID_ZONE_LIMITS to determine valid northing range for the zone letter
     * Handle cases where the row cycles into the next 2M band

5. Include comprehensive JSDoc documentation with examples
6. No validation required - assume inputs are pre-validated
7. Use constants from nga-grids-common module
```

### 2. UTM to MGRS Conversion (`src/utm/to-mgrs-from-utm.ts`)

**Prompt:**
```
Create a TypeScript function that converts UTM (Universal Transverse Mercator) coordinates to MGRS (Military Grid Reference System) coordinates. The function should:

1. Accept a TokensUTM object containing:
   - zoneNumber: UTM zone number (1-60)
   - zoneLetter: MGRS latitude band letter (C-X, excluding I and O)
   - hemisphere: Hemisphere indicator ('N' or 'S')
   - easting: Full easting value in meters
   - northing: Full northing value in meters

2. Accept an optional precision parameter (1-5, default 5):
   - 5: 1 meter precision (5 digits each)
   - 4: 10 meter precision
   - 3: 100 meter precision
   - 2: 1 kilometer precision
   - 1: 10 kilometer precision

3. Return a TokensMGRS object with:
   - zoneNumber: Same as input
   - zoneLetter: Same as input
   - gridCol: 100km grid square column letter
   - gridRow: 100km grid square row letter
   - easting: Position within grid square (truncated to precision)
   - northing: Position within grid square (truncated to precision)
   - precision: Number of digits

4. Implement the conversion logic:
   - Determine grid square column letter from easting value
   - Determine grid square row letter from northing value and hemisphere
   - Calculate position within the 100km grid square (modulo operation)
   - Truncate (not round) the position to the specified precision

5. Helper functions needed:
   - eastingToGridColumn(easting: number, zoneNumber: number): string
     * Calculate which 100km column the easting falls into
     * Account for zone-based column letter cycling
   
   - northingToGridRow(northing: number, zoneNumber: number, hemisphere: 'N' | 'S'): string
     * Calculate which 100km row the northing falls into
     * Use gridRowOffset helper for hemisphere and zone-based offset
     * Account for 20-letter row cycling

6. Include comprehensive JSDoc documentation with examples
7. No validation required - assume inputs are pre-validated
8. Use DEFAULT_MGRS_PRECISION (5) from nga-grids-common module
```

### 3. WGS84 to UTM Conversion (`src/wgs/to-utm-from-wgs.ts`)

**Prompt:**
```
Create a TypeScript function that converts WGS84 latitude/longitude to UTM (Universal Transverse Mercator) coordinates using the Transverse Mercator projection. The function should:

1. Accept a TokensWGS object containing:
   - lat: Latitude in decimal degrees (-90 to 90)
   - lon: Longitude in decimal degrees (-180 to 180)

2. Return a TokensUTM object with:
   - zoneNumber: UTM zone number (1-60)
   - zoneLetter: MGRS latitude band letter (C-X)
   - hemisphere: 'N' or 'S'
   - easting: Easting value in meters
   - northing: Northing value in meters
   - precision: Precision metadata object

3. Implement the Transverse Mercator projection using WGS84 ellipsoid parameters:
   - Semi-major axis (a): 6378137.0 meters
   - Eccentricity squared (e2): 0.00669438
   - Second eccentricity squared (ePrime2): 0.00673949
   - Scale factor (UTM_K0): 0.9996
   - False easting: 500,000 meters
   - False northing: 10,000,000 meters (Southern hemisphere only)

4. Conversion steps:
   - Normalize longitude to [-180, 180] range
   - Calculate zone number: floor((lon + 180) / 6) + 1
   - Calculate central meridian for the zone
   - Convert lat/lon to radians
   - Calculate ellipsoidal parameters (N, T, C, A)
   - Calculate meridional arc (M)
   - Apply Transverse Mercator equations for easting and northing
   - Add false easting and false northing

5. Implement getZoneLetter helper function:
   - Return 'X' for latitudes >= 84°
   - Return 'C' for latitudes <= -80°
   - Use 8° bands between -80° and 84°
   - Map to GRID_ZONE_LETTER array

6. Use helper functions from nga-grids-common:
   - centralMeridian(zoneNumber)
   - toRadians(degrees)
   - primeVerticalRadius(sinLat, a, e2)
   - meridionalArc(latRad, a, e2)
   - computePrecision(value)

7. Include comprehensive JSDoc documentation with examples for both hemispheres
8. No validation required - assume inputs are pre-validated
```

### 4. UTM to WGS84 Conversion (`src/utm/to-wgs-from-utm.ts`)

**Prompt:**
```
Create a TypeScript function that converts UTM (Universal Transverse Mercator) coordinates to WGS84 latitude/longitude using the inverse Transverse Mercator projection. The function should:

1. Accept a TokensUTM object containing:
   - zoneNumber: UTM zone number (1-60)
   - zoneLetter: MGRS latitude band letter
   - hemisphere: 'N' or 'S'
   - easting: Easting value in meters
   - northing: Northing value in meters

2. Return a TokensWGS object with:
   - lat: Latitude in decimal degrees
   - lon: Longitude in decimal degrees

3. Implement the inverse Transverse Mercator projection using WGS84 ellipsoid parameters:
   - Semi-major axis (a): 6378137.0 meters
   - Eccentricity squared (e2): 0.00669438
   - Second eccentricity squared (ePrime2): 0.00673949
   - Scale factor (UTM_K0): 0.9996
   - False easting: 500,000 meters
   - False northing: 10,000,000 meters (Southern hemisphere)

4. Conversion steps using footpoint latitude method:
   - Remove UTM false easting and northing offsets
   - Normalize northing based on hemisphere
   - Calculate meridional arc: M = y / UTM_K0
   - Compute footpoint latitude from M
   - Calculate ellipsoidal parameters (N1, R1, T1, C1, D)
   - Apply inverse Transverse Mercator equations
   - Calculate latitude in radians
   - Calculate central meridian and longitude offset
   - Calculate longitude in radians
   - Convert results to decimal degrees

5. Use helper functions from nga-grids-common:
   - centralMeridian(zoneNumber)
   - toFootpointLatitude(M, a, e2)
   - primeVerticalRadius(sinPhi1, a, e2)
   - toDegrees(radians)

6. Include comprehensive JSDoc documentation with examples for both Northern and Southern hemispheres
7. No validation required - assume inputs are pre-validated
```

### 5. MGRS to WGS84 Conversion (`src/mgrs/to-wgs-from-mgrs.ts`)

**Prompt:**
```
Create a simple TypeScript function that converts MGRS coordinates to WGS84 by composing two existing conversion functions. The function should:

1. Accept a TokensMGRS object
2. First convert MGRS to UTM using toUTMFromMGRS
3. Then convert UTM to WGS84 using toWGSFromUTM
4. Return the TokensWGS result
5. Support optional precision override parameter
6. Export as a const arrow function for consistency

Implementation should be a one-liner composition.
```

### 6. WGS84 to MGRS Conversion (`src/wgs/to-mgrs-from-wgs.ts`)

**Prompt:**
```
Create a simple TypeScript function that converts WGS84 coordinates to MGRS by composing two existing conversion functions. The function should:

1. Accept a TokensWGS object
2. First convert WGS84 to UTM using toUTMFromWGS
3. Then convert UTM to MGRS using toMGRSFromUTM
4. Return the TokensMGRS result
5. Support optional precision parameter (default to DEFAULT_MGRS_PRECISION)
6. Export as a const arrow function for consistency

Implementation should be a one-liner composition.
```

## Mathematical Helper Functions

### Footpoint Latitude (`src/nga-grids-common/convert/to-footpoint-latitude.ts`)

**Prompt:**
```
Create a TypeScript function that calculates the footpoint latitude from a meridional arc distance for the inverse Transverse Mercator projection. The function should:

1. Accept parameters:
   - M: Meridional arc distance in meters
   - a: Semi-major axis of ellipsoid
   - e2: Eccentricity squared

2. Implement the iterative footpoint latitude calculation:
   - Calculate mu (rectifying latitude)
   - Calculate e1 parameter
   - Calculate J1, J2, J3, J4 series coefficients
   - Apply series expansion to compute footpoint latitude

3. Return the footpoint latitude in radians

4. Use the standard geodetic formulas for WGS84 ellipsoid
5. Include a comment noting that intermediate variables improve minification/compression
```

### Meridional Arc (`src/nga-grids-common/convert/meridional-arc.ts`)

**Prompt:**
```
Create a TypeScript function that calculates the meridional arc length (distance along the central meridian) for a given latitude on the WGS84 ellipsoid. The function should:

1. Accept parameters:
   - latRad: Latitude in radians
   - a: Semi-major axis of ellipsoid (meters)
   - e2: Eccentricity squared

2. Implement the meridional arc formula:
   - Apply the series expansion with e2 coefficients
   - Include terms for latRad, sin(2*latRad), sin(4*latRad), and sin(6*latRad)
   - Use standard geodetic formulas

3. Return the meridional arc distance in meters

4. The formula should match standard UTM projection implementations
```

### Prime Vertical Radius (`src/nga-grids-common/convert/prime-vertical-radius.ts`)

**Prompt:**
```
Create a TypeScript function that calculates the prime vertical radius of curvature (radius perpendicular to the meridian) at a given latitude on an ellipsoid. The function should:

1. Accept parameters:
   - sinLat: Sine of the latitude (pre-computed for efficiency)
   - a: Semi-major axis of ellipsoid (meters)
   - e2: Eccentricity squared

2. Implement the formula: N = a / sqrt(1 - e2 * sin²(lat))

3. Return the radius in meters

4. This is a fundamental calculation used in both forward and inverse Transverse Mercator projections
```

## Verification and Testing

All conversion functions were verified against:

1. **NGA (National Geospatial-Intelligence Agency) specifications** for MGRS/UTM conversions
2. **Standard geodetic references** for WGS84 ellipsoid parameters
3. **Test cases** covering:
   - All UTM zones (1-60)
   - Both hemispheres (Northern and Southern)
   - Various MGRS precision levels (1-5)
   - Edge cases at zone boundaries
   - High latitude zones near the poles

## References

- [MGRS Standard (MIL-STD-2407)](https://earth-info.nga.mil/php/download.php?file=coord-grids)
- [Universal Transverse Mercator coordinate system](https://en.wikipedia.org/wiki/Universal_Transverse_Mercator_coordinate_system)
- [WGS84 Ellipsoid Parameters](https://en.wikipedia.org/wiki/World_Geodetic_System#WGS84)
- [Transverse Mercator Projection Formulas](https://en.wikipedia.org/wiki/Transverse_Mercator_projection)

## Notes

- All functions assume pre-validated inputs and perform no validation themselves
- Validation should be performed using the respective `parse` functions before conversion
- The conversion functions use consistent type definitions (`TokensMGRS`, `TokensUTM`, `TokensWGS`)
- Mathematical constants and ellipsoid parameters are centralized in the `nga-grids-common` module
- All code includes comprehensive JSDoc documentation for API reference generation
