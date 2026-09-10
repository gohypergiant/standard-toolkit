/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

/**
 * Fraction digits used to expand an exponential-notation number. Twenty covers
 * every magnitude that is meaningful for a coordinate (`1e-20°` is far below
 * the width of an atom) while staying within `toFixed`'s supported range.
 */
const EXPANDED_FRACTION_DIGITS = 20;

/**
 * Renders a small number in plain decimal notation instead of exponential.
 *
 * JavaScript's default number-to-string conversion switches to exponential
 * notation below `1e-6` (`String(0.0000001)` is `'1e-7'`), which the
 * coordinate lexer would mis-tokenize (`-7` reads as a sign) and which the
 * round-trip formatters must not emit. Values that already render plainly are
 * returned unchanged, so this is a no-op for ordinary coordinates.
 *
 * Only negative exponents are expanded, to at most 20 fraction digits — enough
 * for any coordinate magnitude. Numbers at or above `1e21` (positive exponent)
 * are returned as JavaScript renders them.
 *
 * @param value - The number to render.
 * @returns The value in plain decimal notation with no trailing zeros.
 *
 * @remarks pure function
 *
 * @example
 * ```typescript
 * toPlainDecimalString(0.0000001);
 * // '0.0000001'
 * ```
 *
 * @example
 * ```typescript
 * toPlainDecimalString(-122.4194);
 * // '-122.4194'
 * ```
 */
export const toPlainDecimalString = (value: number): string => {
  const rendered = `${value}`;

  if (!rendered.includes('e-')) {
    return rendered;
  }

  return value.toFixed(EXPANDED_FRACTION_DIGITS).replace(/\.?0+$/, '');
};
