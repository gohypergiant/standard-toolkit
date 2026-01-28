# @accelint/formatters

A set of useful formatting functions for enhancing readability and consistency in your applications.

## Installation

```sh
npm install @accelint/formatters
```

## Formatters

### IFF (Identification Friend or Foe)

Aviation transponder code formatters for military and civilian aircraft identification:

- **`formatM1(value?)`** - Mode 1: 2-digit octal mission/type code (military only)
- **`formatM2(value?)`** - Mode 2: 4-digit octal unit code/tail number (military only)
- **`formatM3A(value?)`** - Mode 3/A: 4-digit octal squawk code (military and civilian)
- **`formatM4(value)`** - Mode 4: 4-digit encrypted challenge (military only)
- **`formatM5(value)`** - Mode 5: 4-digit cryptographic Mode S/ADS-B (military only)

All formatters return zero-padded strings or default values (`--` for 2-digit, `----` for 4-digit) when value is unavailable.

### Planned

The following formatters are planned for future releases:

- Altitude formatters
- Azimuth formatters
- Bearing formatters
