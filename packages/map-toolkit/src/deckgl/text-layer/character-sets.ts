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

const ALL_NUMBERS = '1234567890';

const ASCII_LETTERS_LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const ASCII_LETTERS_UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const ASCII_SYMBOLS = ' !"#$%&\'()*+,-./:;<=>?@[]^_`{|}~';

const ASCII_LETTERS = `${ASCII_LETTERS_LOWERCASE}${ASCII_LETTERS_UPPERCASE}`;
const ASCII_ALPHA_NUMERIC = `${ASCII_LETTERS}${ALL_NUMBERS}`;
const ASCII_ALL = `${ASCII_LETTERS}${ALL_NUMBERS}${ASCII_SYMBOLS}`;

const AUTO = 'auto';

const LATIN_LETTERS_LOWERCASE = 'àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿß';
const LATIN_LETTERS_UPPERCASE = 'ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞ';
const LATIN_SYMBOLS = ' ¡¿¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿×÷';

const LATIN_LETTERS = `${LATIN_LETTERS_LOWERCASE}${LATIN_LETTERS_UPPERCASE}`;
const LATIN_ALPHA_NUMERIC = `${LATIN_LETTERS}${ALL_NUMBERS}`;
const LATIN_ALL = `${LATIN_LETTERS}${ALL_NUMBERS}${LATIN_SYMBOLS}`;

const EXPANDED = `${ASCII_ALL}${LATIN_ALL}`;

export type CharacterSetsKeys = keyof typeof CHARACTER_SETS;

export const CHARACTER_SETS = Object.freeze({
  ALL_NUMBERS,

  ASCII_ALL,
  ASCII_ALPHA_NUMERIC,
  ASCII_LETTERS,
  ASCII_LETTERS_LOWERCASE,
  ASCII_LETTERS_UPPERCASE,
  ASCII_SYMBOLS,

  AUTO,
  EXPANDED,

  LATIN_ALL,
  LATIN_ALPHA_NUMERIC,
  LATIN_LETTERS,
  LATIN_LETTERS_LOWERCASE,
  LATIN_LETTERS_UPPERCASE,
  LATIN_SYMBOLS,
} as const);
