---
change: plain-decimal-coordinate-magnitudes
specs_touched: [coordinate-formatting]
decisions:
  - id: D1
    choice: Render sub-1e-6 magnitudes in plain decimal notation at the lexer and round-trip renderers via one exported helper (toPlainDecimalString), expanding only negative exponents
    rationale: One helper keeps the parse and format sides in agreement; expanding positive exponents would corrupt large values (toFixed also goes exponential at 1e21) and no coordinate needs them
    alternatives: [reject sub-1e-6 input as invalid, expand all exponents via BigInt]
---

## Context

`packages/geo/src/coordinates/latlon/internal/lexer.ts` `fixLeadingAndTrailing`
normalized tokens as `${Number.parseFloat(num)}`; the DD/DDM/DMS
`system.ts` `toFormat` renderers used the same template conversion. Both
produce exponential notation below `1e-6`. The fix (shipped as the
`geo-plain-decimal-notation` patch changeset) routes both through
`toPlainDecimalString`, which expands negative exponents to at most 20
fraction digits with trailing zeros trimmed and returns everything else as
JavaScript renders it.

## Decisions

**D1** — see frontmatter. The DD parser's existing 10-decimal cap
(`\.\d{1,10}`) is unchanged; values that need more decimals still fail to
parse, which is the pre-existing, documented limit.

## Non-Goals

- Changing parser precision caps.
- Rendering magnitudes at or above `1e21` in plain notation.
