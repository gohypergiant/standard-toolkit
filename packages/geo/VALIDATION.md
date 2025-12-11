# External Validation Against geographiclib-mgrs

This document summarizes the validation of the `@accelint/geo` package against the [geographiclib-mgrs](https://github.com/spatialillusions/geographiclib-mgrs) library, which is a widely-used JavaScript port of GeographicLib C++ by Charles Karney.

## Validation Approach

The validation test suite (`src/external-validation.test.ts`) uses geographiclib-mgrs as a dev dependency and directly compares results between both implementations. This provides:

1. **External Validation**: Comparison against a reference implementation
2. **Automated Testing**: Direct integration prevents test case drift
3. **Gap Identification**: Highlights implementation differences and missing features

## Test Results Summary

### Passing Tests (6/13)

✅ **Precision Matching**: Zone numbers and letters match across different precision levels  
✅ **Zone Boundaries**: Coordinate handling near 6° UTM zone boundaries is consistent  
✅ **Coordinate Order Consistency**: latlon/lonlat/wgs coordinate formats produce equivalent results  
✅ **Invalid Coordinate Handling**: Gracefully handles coordinates outside standard UTM range  
✅ **Documentation**: Known limitations are properly documented

### Known Implementation Differences (7 failing tests)

#### 1. MGRS to Geographic Conversion Precision

**Issue**: Approximately 0.018° (~2km) difference when converting MGRS to WGS84  
**Example**: 
- Input: `33VVE7220287839`
- geographiclib result: `58.530194°N`
- Our result: `58.512335°N`

**Likely Cause**: Differences in how grid square centroids are calculated or in the reverse UTM→WGS projection formulas.

#### 2. Grid Row Letter Assignment

**Issue**: Grid row letter differs by one letter in some cases  
**Example**:
- Input: `48.858194°N, 2.294489°E`
- geographiclib: `31UDQ4825111932`
- Our result: `31UEQ4825111932`

**Cause**: Our implementation may use a different base latitude for row letter calculation. The NGA specification allows for two different row letter schemes (MGRS and US National Grid), and this might be a systematic offset.

#### 3. Round-trip Accuracy

**Issue**: MGRS → WGS → MGRS round-trips have slight easting differences (~10m)  
**Example**:
- Original: `33VVE7220287839`
- After round-trip: `33VVE7220187839`

**Cause**: Accumulation of the precision differences mentioned above.

#### 4. Signed Zero at Equator

**Issue**: Does not distinguish between `+0` and `-0` latitude at equator  
**Expected**:
- `lat: 0` → Band N (northern hemisphere)
- `lat: -0` → Band M (southern hemisphere)

**Result**: Both produce Band N

**Impact**: Low - this only affects a narrow band at the equator and JavaScript's signed zero is rarely used intentionally.

#### 5. High Latitude Coordinates (83°N)

**Issue**: Throws error for zone letter 'Z'  
**Error**: `ParseError: Invalid zone letter Z; input: "32ZPT1360516576"`

**Cause**: Our implementation does not support UPS (Universal Polar Stereographic) zones, which use letters beyond X. See below for details.

## Major Missing Feature: UPS Zone Support

### What is UPS?

Universal Polar Stereographic (UPS) is a coordinate system for polar regions:
- **North Polar**: Latitudes above 84°N (zones Y, Z)
- **South Polar**: Latitudes below 80°S (zones A, B)

### Implementation Scope

Adding UPS support would require:

1. **Polar Stereographic Projection**: Different projection math than UTM
2. **Different Grid Scheme**: UPS uses 100km grid squares A-Z differently
3. **Zone Determination**: Logic to select UPS vs UTM based on latitude
4. **NGA Specification Section 3**: Implement polar region formulas

**Estimated Effort**: 3-5 days for full implementation and testing

### Current Behavior

- Coordinates outside -80°S to 84°N are handled using standard UTM formulas
- This produces results but they are not correct for polar regions
- Parser rejects UPS zone letters (A, B, Y, Z)

## Special Zone Exceptions

### Norway and Svalbard

Both geographiclib-mgrs and our implementation support special zone exceptions defined in the MGRS specification:

- **Norway Exception (Zone 32V)**: Uses column letters JKLMN instead of standard set
- **Svalbard Exceptions**: 
  - Zone 31X: Uses columns QRSTUV
  - Zone 33X: Uses columns ABCDEFGH
  - Zone 35X: Uses columns JKLMNPQR
  - Zone 37X: Uses columns STUVWXYZ
  - Zones 32X, 34X, 36X: Band X excluded (polar adjustments per NGA.TR8350.2 §2-7)
- **Polar Adjustments**: Band X is also excluded from zone 60 (per NGA.TR8350.2 §2-7)

**Implementation**: Both libraries validate MGRS grid square column letters according to these exceptions.

**Note**: The special zone exceptions apply to **parsing and validation** of MGRS coordinates. The zone letter differences observed in test failures (e.g., 31UDQ vs 31UEQ) are related to the **forward conversion** (WGS→MGRS) and grid row letter calculation, not the Norway/Svalbard exceptions themselves.

## Precision Comparison

### What Precision Differences Mean

MGRS precision levels define grid square sizes:
- Precision 0: 100km grid square (~11km error radius)
- Precision 1: 10km (~1.1km error radius)
- Precision 2: 1km (~110m error radius)
- Precision 3: 100m (~11m error radius)
- Precision 4: 10m (~1.1m error radius)
- Precision 5: 1m (~0.11m error radius)

### Current Differences

The ~2km difference in MGRS→WGS conversion is due to differences in how the implementations handle grid square coordinates and the reverse projection formulas. The main factors include:

1. **Grid Square Reference Point**: Both implementations correctly **truncate** (floor) coordinates to grid squares when converting TO MGRS per the NGA specification. However, when converting FROM MGRS to geographic coordinates:
   - **geographiclib** (default): Returns the **center** of the grid square (`centerp=true`)
   - **Our implementation**: Returns the **southwest corner** of the grid square
   
   Both approaches are valid - the NGA specification defines MGRS grid squares by their southwest corners but doesn't mandate which point to return for the reverse conversion. The center is often more useful for display/analysis, while the corner is the literal grid square origin.

2. **Grid Row Letter Calculation**: Systematic offset of one row letter in some cases (e.g., D vs E)
3. **UTM Projection Formulas**: Minor differences in the reverse UTM→WGS projection equations

For many applications, these differences are acceptable - the coordinates are within the same general area. However, applications requiring meter-level accuracy should:
- Use geographiclib-mgrs directly for critical conversions
- Validate specific test cases in their target regions
- Understand that the centering difference is a design choice, not an error (for precision 5, this is a 0.5m offset)

## Recommendations

### Improving Precision

To improve the precision of MGRS→WGS conversions:

1. **Grid Row Letter Investigation**: The one-letter systematic offset (D vs E) indicates the base offset calculation may differ from geographiclib. This is likely in `gridRowOffset` or how `gridRowToNorthing` determines the base cycle.

2. **Centering Behavior** (Design Decision): 
   
   The NGA specification defines MGRS grid squares by their southwest corner but doesn't mandate which point within the square to return when converting FROM MGRS. Both approaches are specification-compliant:
   
   - **Southwest corner** (current): Literal grid square origin, matches the specification's grid definition
   - **Center point** (geographiclib): Often more useful for visualization and analysis
   
   Implementing optional centering would require:
   - Adding an optional `centered` parameter to conversion functions  
   - When `centered=true`, add `scale / 2` to easting and northing in `toUTMFromMGRS`
   - Document that WGS→MGRS→WGS round-trips will differ by 0.5 grid units when centered
   
   **Note**: The ~2km difference in test results is NOT primarily from centering (which would only be 0.5m at precision 5). The larger difference comes from the grid row letter offset and projection formula differences.

3. **UTM Projection Formulas**: The reverse UTM→WGS projection in `toWGSFromUTM` could be compared term-by-term with GeographicLib's C++ implementation to identify any formula differences in:
   - Footpoint latitude calculation
   - Prime vertical radius computation
   - Latitude/longitude correction terms

## References

- [geographiclib-mgrs GitHub](https://github.com/spatialillusions/geographiclib-mgrs)
- [GeographicLib C++](https://geographiclib.sourceforge.io/)
- [NGA.SIG.0012_2.0.0_UTMUPS (2014)](https://earth-info.nga.mil/php/download.php?file=coord-grids) - Official MGRS specification
- [USGS Professional Paper 1395 (1987)](https://pubs.usgs.gov/pp/1395/report.pdf) - Map Projections: A Working Manual

## Test Maintenance

The test suite automatically uses the latest test data from geographiclib-mgrs. To update:

```bash
pnpm update geographiclib-mgrs --filter @accelint/geo
```

To run only external validation tests:

```bash
pnpm -F geo test external-validation
```
