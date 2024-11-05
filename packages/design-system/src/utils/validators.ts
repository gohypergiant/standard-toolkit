import clamp from 'lodash/clamp';
import { z } from 'zod';
import type { RGBA } from '../types';

/**
 * Test for any safe number that could represent a pixel value
 */
export const pixelValueAsNumberValidator = z.number().safe();

/**
 * Test for and capture numeric pixel values
 * Will allow decimals and negative numbers
 *
 * Examples:
 * 0 -> 0
 * 1px -> 1
 * 20.5px -> 20.5
 */
export const pixelValueAsStringValidator = z
  .union([
    z.literal('0'),
    z
      .string()
      .endsWith('px')
      .transform((value) => value.replace(/px$/, '')),
  ])
  .pipe(z.coerce.number())
  .pipe(pixelValueAsNumberValidator);

/**
 * Test for an integer in the range of 0-255 as a representation of an RGB color channel value
 */
export const colorChannelAsNumberValidator = z
  .number()
  .safe()
  .int()
  .min(0)
  .max(255);

/**
 * Test for and convert CSS RGB color channel to numeric value (0-255)
 */
export const colorChannelAsStringValidator = z
  .string()
  .trim()
  .pipe(z.coerce.number())
  .pipe(colorChannelAsNumberValidator);

/**
 * DeckGL treats alpha channel the same as color channels (0-255)
 */
export const alphaChannelAsNumberValidator = colorChannelAsNumberValidator;

/**
 * Test for and convert CSS RGBA alpha channel to DeckGL numeric value
 */
export const alphaChannelAsStringValidator = z
  .string()
  .trim()
  .pipe(z.coerce.number().safe().min(0)) // CSS allows for values greater than 1
  .transform((value) => Math.round(clamp(value, 0, 1) * 255));

/**
 * Test for and convert CSS RGB(A) values to numeric RGBA tuple
 * Will only allow for rgb with 3 valid numbers (0-255){3, intergers only}
 * Will only allow for rgba with 4 valid numbers (0-255){3, intergers only} + (0-1){1, decimals allowed}
 * Will allow for whitespace spread throughout
 *
 * Examples:
 * rgb( 0, 0, 0 ) -> [0, 0, 0, 255]
 * rgba(203,117,98,0.4) -> [203, 117, 98, 102]
 */
export const rgbaAsStringValidator = z
  .union([
    z
      .string()
      .startsWith('rgb(')
      .endsWith(')')
      .transform((value) => value.replace(/\)$/, ',1')), // Add on 100% alpha channel
    z
      .string()
      .startsWith('rgba(')
      .endsWith(')')
      .transform((value) => value.replace(/\)$/, '')),
  ])
  .transform((value) => value.replace(/^rgba?\(/, '').split(','))
  .pipe(
    z.tuple([
      colorChannelAsStringValidator,
      colorChannelAsStringValidator,
      colorChannelAsStringValidator,
      alphaChannelAsStringValidator,
    ]),
  );

/**
 * Test for numeric RGB(A) tuple
 *
 * Will return RGB as RGBA with 100% alpha channel
 */
export const rgbaAsTupleValidator = z.union([
  z
    .tuple([
      colorChannelAsNumberValidator,
      colorChannelAsNumberValidator,
      colorChannelAsNumberValidator,
    ])
    .transform<RGBA>((rgb) => [...rgb, 255]),
  z.tuple([
    colorChannelAsNumberValidator,
    colorChannelAsNumberValidator,
    colorChannelAsNumberValidator,
    alphaChannelAsNumberValidator,
  ]),
]);
