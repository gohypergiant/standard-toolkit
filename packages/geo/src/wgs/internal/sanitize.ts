// __private-exports
/*
 * Copyright 2025 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { rSEPARATOR, SEPARATOR } from './separator.js';

const CLEANING = {
  GARBAGE: /[^-\d.,;/NSEW°'"]/gi,
  HYPHEN: /\s*[−–—]\s*/g,
  LOCALE_DEC: /(\d+),(\d+)/g,
  SIGNIFIERS: /\s*([,;/NSEW])\s*/gi,
  UNITS: /\s*([°'"])\s*/g,
  WHITESPACE: /[\n\s\t]+/gi,
} as const;

const cleanSeparators = (_match: string, capture: string) =>
  ` ${capture.replace(rSEPARATOR, SEPARATOR)} `;

export function sanitize(raw: string) {
  return (
    raw
      // normalize locale decimal commas to dots, but only within numbers
      .replace(CLEANING.LOCALE_DEC, '$1.$2')
      // ensure the hemisphere designation is separated
      .replace(CLEANING.SIGNIFIERS, cleanSeparators)
      // group unit with number
      .replace(CLEANING.UNITS, '$1 ')
      // normalize alternate unicode symbols
      .replace(CLEANING.HYPHEN, ' -')
      // get rid of other garbage
      .replaceAll(CLEANING.GARBAGE, ' ')
      // collapse whitespace
      .replaceAll(CLEANING.WHITESPACE, ' ')
      .trim()
      .toUpperCase()
  );
}
