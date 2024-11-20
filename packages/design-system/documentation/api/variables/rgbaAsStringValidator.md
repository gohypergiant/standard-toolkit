[**@accelint/design-system**](../README.md) • **Docs**

***

[@accelint/design-system](../README.md) / rgbaAsStringValidator

# Variable: rgbaAsStringValidator

> `const` **rgbaAsStringValidator**: `ZodPipeline`\<`ZodEffects`\<`ZodUnion`\<[`ZodEffects`\<`ZodString`, `string`, `string`\>, `ZodEffects`\<`ZodString`, `string`, `string`\>]\>, `string`[], `string`\>, `ZodTuple`\<[`ZodPipeline`\<`ZodPipeline`\<`ZodString`, `ZodNumber`\>, `ZodNumber`\>, `ZodPipeline`\<`ZodPipeline`\<`ZodString`, `ZodNumber`\>, `ZodNumber`\>, `ZodPipeline`\<`ZodPipeline`\<`ZodString`, `ZodNumber`\>, `ZodNumber`\>, `ZodEffects`\<`ZodPipeline`\<`ZodString`, `ZodNumber`\>, `number`, `string`\>], `null`\>\>

Test for and convert CSS RGB(A) values to numeric RGBA tuple
Will only allow for rgb with 3 valid numbers (0-255){3, intergers only}
Will only allow for rgba with 4 valid numbers (0-255){3, intergers only} + (0-1){1, decimals allowed}
Will allow for whitespace spread throughout

Examples:
rgb( 0, 0, 0 ) -> [0, 0, 0, 255]
rgba(203,117,98,0.4) -> [203, 117, 98, 102]
