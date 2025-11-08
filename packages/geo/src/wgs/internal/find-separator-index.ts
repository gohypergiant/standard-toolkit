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

import { createTokensMask } from './create-tokens-mask.js';
import { allWGSPatterns } from './patterns.js';

const validPairs = [
  'D',
  'M',
  'N',
  'S',
  'DM',
  'DN',
  'DS',
  'MN',
  'MS',
  'NN',
  'DMS',
  'DNS',
  'DMN',
  'NMS',
  'NMN',
  'NNN',
  'NNS',
].reduce(
  (acc, str) => {
    acc[`${str}${str}`] = str.length;
    acc[`${str}C${str}C`] = str.length + 1;
    acc[`C${str}C${str}`] = str.length + 1;
    acc[`C${str}${str}C`] = str.length + 1;
    acc[`${str}CC${str}`] = str.length + 1;

    return acc;
  },
  {} as Record<string, number>,
);

export function findSeparatorIndex(tokens: string[]) {
  const mask = createTokensMask(tokens);

  if (mask in validPairs) {
    return validPairs[mask];
  }

  const match =
    allWGSPatterns.reduce(
      (acc: string[], regex: RegExp) => acc || regex.exec(mask)?.slice(1),
      null as unknown as string[],
    ) || [];

  // Ensure we have both coordinate parts (2 capture groups)
  if (match.length >= 2 && match[0]) {
    return match[0].length;
  }

  // if (match[0] || match[1]) {
  //   throw new ParseError('Could not infer separator position', tokens.join(' '));
  // }

  // throw new ParseError(`Missed mask pattern handling: "${mask}"`, tokens.join(' '));
}
