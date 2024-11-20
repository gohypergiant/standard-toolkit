[**@accelint/design-system**](../README.md) • **Docs**

***

[@accelint/design-system](../README.md) / pixelValueAsStringValidator

# Variable: pixelValueAsStringValidator

> `const` **pixelValueAsStringValidator**: `ZodPipeline`\<`ZodPipeline`\<`ZodUnion`\<[`ZodLiteral`\<`"0"`\>, `ZodEffects`\<`ZodString`, `string`, `string`\>]\>, `ZodNumber`\>, `ZodNumber`\>

Test for and capture numeric pixel values
Will allow decimals and negative numbers

Examples:
0 -> 0
1px -> 1
20.5px -> 20.5
