/*
 * Copyright 2024 Hypergiant Galactic Systems Inc. All rights reserved.
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
 * Default value returned when a 2-digit IFF mode value is not available.
 */
const TWO_DIGIT_DEFAULT = '--';

/**
 * Default value returned when a 4-digit IFF mode value is not available.
 */
const FOUR_DIGIT_DEFAULT = '----';

/**
 * Internal helper to format IFF codes with zero-padding.
 * Handles the common logic for all IFF mode formatters.
 *
 * @param value - The value to format.
 * @param digits - Number of digits for zero-padding (2 or 4).
 * @returns Zero-padded string or default value if input is invalid.
 * @internal
 */
function formatIFFCode(
  value: string | number | undefined,
  digits: 2 | 4,
): string {
  const defaultValue = digits === 2 ? TWO_DIGIT_DEFAULT : FOUR_DIGIT_DEFAULT;

  // Fix zero value bug: 0 is a valid IFF code
  if (value == null || value === '') {
    return defaultValue;
  }

  // Optimize string coercion: avoid template literal overhead
  const str = typeof value === 'string' ? value : String(value);
  return str.padStart(digits, '0');
}

/**
 * A 2-digit octal code that identifies the aircraft's mission or type.
 * This mode is only used by the military.
 *
 * @param value - The value to format.
 * @returns A 2-digit zero-padded string, or '--' if value is undefined/null/empty.
 *
 * @example
 * ```typescript
 * formatM1(5);         // '05'
 * formatM1('7');       // '07'
 * formatM1(0);         // '00'
 * formatM1(undefined); // '--'
 * formatM1('');        // '--'
 * ```
 */
export function formatM1(value?: string | number): string {
  return formatIFFCode(value, 2);
}

/**
 * A 4-digit octal code that identifies the aircraft's unit code or tail number.
 * This mode is only used by the military.
 *
 * @param value - The value to format.
 * @returns A 4-digit zero-padded string, or '----' if value is undefined/null/empty.
 *
 * @example
 * ```typescript
 * formatM2(1234);      // '1234'
 * formatM2(42);        // '0042'
 * formatM2('7');       // '0007'
 * formatM2(0);         // '0000'
 * formatM2(undefined); // '----'
 * ```
 */
export function formatM2(value?: string | number): string {
  return formatIFFCode(value, 4);
}

/**
 * A 4-digit octal code that identifies the aircraft. This mode is used by both the
 * military and civilians, and is often called a squawk code. Air traffic controllers
 * assign these codes.
 *
 * @param value - The value to format.
 * @returns A 4-digit zero-padded string (squawk code), or '----' if value is undefined/null/empty.
 *
 * @example
 * ```typescript
 * formatM3A(1200);     // '1200' - VFR code
 * formatM3A(7700);     // '7700' - Emergency
 * formatM3A(42);       // '0042'
 * formatM3A(0);        // '0000'
 * formatM3A(undefined); // '----'
 * ```
 */
export function formatM3A(value?: string | number): string {
  return formatIFFCode(value, 4);
}

/**
 * A 3-pulse reply that uses an encrypted challenge to determine the delay.
 * This mode is only used by the military.
 *
 * @remarks
 * The exact format specification for Mode 4 is not publicly documented.
 * This implementation assumes a 4-digit zero-padded format.
 *
 * @param value - The value to format.
 * @returns A 4-digit zero-padded string, or '----' if value is undefined/null/empty.
 *
 * @example
 * ```typescript
 * formatM4(1234);      // '1234'
 * formatM4(42);        // '0042'
 * formatM4(0);         // '0000'
 * formatM4(undefined); // '----'
 * formatM4('');        // '----'
 * ```
 */
export function formatM4(value?: string | number): string {
  return formatIFFCode(value, 4);
}

/**
 * A cryptographically secured version of Mode S and ADS-B GPS position.
 * This mode is only used by the military.
 *
 * @remarks
 * The exact format specification for Mode 5 is not publicly documented.
 * This implementation assumes a 4-digit zero-padded format.
 *
 * @param value - The value to format.
 * @returns A 4-digit zero-padded string, or '----' if value is undefined/null/empty.
 *
 * @example
 * ```typescript
 * formatM5(5678);      // '5678'
 * formatM5(99);        // '0099'
 * formatM5(0);         // '0000'
 * formatM5(undefined); // '----'
 * formatM5('');        // '----'
 * ```
 */
export function formatM5(value?: string | number): string {
  return formatIFFCode(value, 4);
}
