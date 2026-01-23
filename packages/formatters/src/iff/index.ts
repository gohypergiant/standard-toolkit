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
 * Default value for 2-digit IFF codes when value is unavailable.
 */
const TWO_DIGIT_DEFAULT = '--';

/**
 * Default value for 4-digit IFF codes when value is unavailable.
 */
const FOUR_DIGIT_DEFAULT = '----';

/**
 * A 2-digit octal code that identifies the aircraft's mission or type.
 * This mode is only used by the military.
 *
 * @param value - The value to format.
 * @returns A 2-digit zero-padded string, or '--' if value is null/undefined/empty string.
 *
 * @example
 * ```typescript
 * const code = formatM1(5);  // '05'
 * const code = formatM1(42); // '42'
 * const code = formatM1();   // '--'
 * ```
 */
export function formatM1(value?: string | number): string {
  if (value) {
    return `${value}`.padStart(2, '0');
  }

  return TWO_DIGIT_DEFAULT;
}

/**
 * A 4-digit octal code that identifies the aircraft's unit code or tail number.
 * This mode is only used by the military.
 *
 * @param value - The value to format.
 * @returns A 4-digit zero-padded string, or '----' if value is null/undefined/empty string.
 *
 * @example
 * ```typescript
 * const code = formatM2(123);  // '0123'
 * const code = formatM2(7654); // '7654'
 * const code = formatM2();     // '----'
 * ```
 */
export function formatM2(value?: string | number): string {
  if (value) {
    return `${value}`.padStart(4, '0');
  }

  return FOUR_DIGIT_DEFAULT;
}

/**
 * A 4-digit octal code that identifies the aircraft. This mode is used by both the
 * military and civilians, and is often called a squawk code. Air traffic controllers
 * assign these codes.
 *
 * @param value - The value to format.
 * @returns A 4-digit zero-padded string, or '----' if value is null/undefined/empty string.
 *
 * @example
 * ```typescript
 * const code = formatM3A(1200); // '1200'
 * const code = formatM3A(7700); // '7700'
 * const code = formatM3A();     // '----'
 * ```
 */
export function formatM3A(value?: string | number): string {
  if (value) {
    return `${value}`.padStart(4, '0');
  }

  return FOUR_DIGIT_DEFAULT;
}

/**
 * A 3-pulse reply that uses an encrypted challenge to determine the delay.
 * This mode is only used by the military.
 *
 * TODO: Verify the correct format for M4
 *
 * @param value - The value to format.
 * @returns A 4-digit zero-padded string, or '----' if value is empty string.
 *
 * @example
 * ```typescript
 * const code = formatM4(123);  // '0123'
 * const code = formatM4(7654); // '7654'
 * ```
 */
export function formatM4(value: string | number): string {
  // If not empty string
  if (value) {
    return `${value}`.padStart(4, '0');
  }

  return FOUR_DIGIT_DEFAULT;
}

/**
 * A cryptographically secured version of Mode S and ADS-B GPS position.
 * This mode is only used by the military.
 *
 * TODO: Verify the correct format for M5
 *
 * @param value - The value to format.
 * @returns A 4-digit zero-padded string, or '----' if value is empty string.
 *
 * @example
 * ```typescript
 * const code = formatM5(123);  // '0123'
 * const code = formatM5(7654); // '7654'
 * ```
 */
export function formatM5(value: string | number): string {
  // If not empty string
  if (value) {
    return `${value}`.padStart(4, '0');
  }

  return FOUR_DIGIT_DEFAULT;
}
