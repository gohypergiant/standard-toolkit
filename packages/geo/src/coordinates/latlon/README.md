# Latitude and Longitude Coordinate Parsing

This library is designed to parse strings that resemble latitude and longitude coordinates and convert them into usable values. The goal is to handle a wide variety of formats as intuitively as possible, without over-interpreting input in a way that might lead to incorrect results.

## Parsing Stages

The parsing process occurs in three main stages to extract accurate coordinate values:

1. Lexing
2. Raw Parsing
3. Format/Specific Parsing

### Lexing

In the lexing phase, all extraneous characters are removed to facilitate "tokenization." The output of this stage is a refined sequence of character groupings that are meaningful and indicative of the intended coordinate value.

### Raw Parsing

During this phase, certain disqualifying errors are detected to halt further processing when it's clearly unnecessary. Additionally, some characters (particularly dividers) may be added where appropriate to ensure consistent interpretation in the next stage.

### Format/Specific Parsing

This is the primary interface for library users. Specific parsing targets well-known coordinate formats, delivering results that are useful and relevant to most applications, rather than focusing on lower-level parsing details.
