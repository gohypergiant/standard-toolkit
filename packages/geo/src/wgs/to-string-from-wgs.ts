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

import type { OptionsWGS } from './options-wgs.js';
import type { TokensWGS } from './tokens-wgs.js';

const FORMAT = {
  dd(coord: TokensWGS) {
    return [coord.lat, coord.lon];
  },
  ddm(coord: TokensWGS) {
    return [toDDM(coord.lat), toDDM(coord.lon)];
  },
  dms(coord: TokensWGS) {
    return [toDMS(coord.lat), toDMS(coord.lon)];
  },
};

function toDDM(partial: number): string {
  const degrees = Math.trunc(partial);
  const minutes = Math.abs((partial - degrees) * 60);

  return `${degrees}° ${minutes.toFixed(3)}'`;
}

function toDMS(partial: number): string {
  const degrees = Math.trunc(partial);
  const minutesFull = Math.abs((partial - degrees) * 60);
  const minutes = Math.trunc(minutesFull);
  const seconds = (minutesFull - minutes) * 60;

  return `${degrees}° ${minutes}' ${seconds.toFixed(2)}"`;
}

export function toStringFromWGS(
  coord: TokensWGS,
  options?: OptionsWGS,
): string {
  const format = (options?.format ?? 'dd') as keyof typeof FORMAT;
  const [lat, lon] = FORMAT[format](coord);

  return options?.order === 'lonlat' ? `${lon}, ${lat}` : `${lat}, ${lon}`;
}
