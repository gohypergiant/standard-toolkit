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

import { expand } from './internal/expand-decimal';
import type { OptionsWGS } from './options-wgs';
import type { TokensWGS } from './tokens-wgs';

type DdPart = { degrees: number };
type DdmPart = { degrees: number; minutes: number };
type DmsPart = { degrees: number; minutes: number; seconds: number };

export type Dd = { lat: DdPart; lon: DdPart };
export type Ddm = { lat: DdmPart; lon: DdmPart };
export type Dms = { lat: DmsPart; lon: DmsPart };

const DEFAULT_FORMAT = 'dd';

const dd = ({ lat, lon }: TokensWGS) => [[lat], [lon]];
const ddm = ({ lat, lon }: TokensWGS) => [expand(lat), expand(lon)];
const dms = ({ lat, lon }: TokensWGS) => [expand(lat, true), expand(lon, true)];
const FORMATS = { dd, ddm, dms };
const KEYS = ['degrees', 'minutes', 'seconds'];

export function getTokens(
  coord: TokensWGS,
  options: OptionsWGS & { format: 'dd' },
): Dd;
export function getTokens(
  coord: TokensWGS,
  options: OptionsWGS & { format: 'ddm' },
): Ddm;
export function getTokens(
  coord: TokensWGS,
  options: OptionsWGS & { format: 'dms' },
): Dms;
export function getTokens(coord: TokensWGS, options?: OptionsWGS): Dd;
export function getTokens(coord: TokensWGS, options?: OptionsWGS) {
  const { format } = { format: DEFAULT_FORMAT, ...options };

  if (format && !(format in FORMATS)) {
    throw new Error(`Invalid format provided: "${format}"`);
  }

  const [lat, lon] = FORMATS[format as keyof typeof FORMATS](coord) as [
    number[],
    number[],
  ];

  return {
    lat: placement(lat),
    lon: placement(lon),
  } as Dd | Ddm | Dms;
}

function placement(part: number[]): Record<string, number> {
  return Object.fromEntries(
    part.map((value, index) => [KEYS[index], value]),
  ) as Record<string, number>;
}
