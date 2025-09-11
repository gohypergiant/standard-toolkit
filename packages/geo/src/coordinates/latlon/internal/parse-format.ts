// __private-exports
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

import { type Format, SYMBOL_PATTERNS, SYMBOLS } from '.';
import { type ParseResults, parse } from './parse';
import { violation } from './violation';

type FormatParserConfig<T> = {
  formats: {
    // biome-ignore lint/style/useNamingConvention: Name is chosen to stand out amongst other formats
    LATLON: RegExp;
    // biome-ignore lint/style/useNamingConvention: Name is chosen to stand out amongst other formats
    LONLAT: RegExp;
  };
  identifyErrors: (format: Format) => (arg: T, i: number) => ParseResults;
  identifyPieces: (half: string[]) => T;
};

const axisTypeTest = (k: keyof typeof SYMBOL_PATTERNS, t: string) =>
  SYMBOL_PATTERNS[k].test(t) && k;

export const createParser =
  <T>(config: FormatParserConfig<T | undefined>) =>
  (format: Format, input: string) =>
    parseWithConfig(config, format, input);

function parseWithConfig<T>(
  config: FormatParserConfig<T>,
  format: Format,
  input: string,
): ParseResults {
  const [parseTokens, violations] = parse(input, format);

  const foundFormat = parseTokens.reduce(
    (acc, t) => acc + (axisTypeTest('LAT', t) || axisTypeTest('LON', t) || ''),
    '',
  );

  if (!violations.length && foundFormat && foundFormat !== format) {
    return [
      [],
      [
        violation(
          `Mismatched formats: "${format}" expected, "${foundFormat}" found.`,
        ),
      ],
    ];
  }

  const hasErrors = !parseTokens.length && violations.length;

  if (hasErrors) {
    return [[], violations];
  }

  const [tokens, errors] = [
    parseTokens.slice(0, parseTokens.indexOf(SYMBOLS.DIVIDER)), // left of divider
    parseTokens.slice(1 + parseTokens.indexOf(SYMBOLS.DIVIDER)), // right of divider
  ]
    .map(config.identifyPieces)
    .map(config.identifyErrors(format))
    .reduce((a, b) => [
      [...a[0], SYMBOLS.DIVIDER, ...b[0]],
      [...a[1], ...b[1]].map(violation),
    ]);

  if (errors.length) {
    return [
      [],
      // dedupe errors
      Array.from(new Set(errors)),
    ];
  }

  const matches = (config.formats[format].exec(tokens.join(' ')) || []).slice(
    1,
  );

  if (!matches?.length) {
    throw new Error(
      [
        'A validation check seems to be missing because the cleaned and normalized input value (',
        tokens.join(' '),
        ') is not matching the pattern (',
        config.formats[format],
        ').',
      ].join(''),
    );
  }

  return [matches, []];
}
