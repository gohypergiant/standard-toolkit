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

import type { HoursTimescale, MinutesTimescale, Timescale } from './types';

const MS_PER_SECOND = 1000;
export const MS_PER_MINUTE = MS_PER_SECOND * 60;
export const MS_PER_HOUR = MS_PER_MINUTE * 60;
const MS_PER_DAY = MS_PER_HOUR * 24;

export const HOURS_MAPPING: Record<HoursTimescale, number> = {
  '1h': MS_PER_HOUR,
  '2h': MS_PER_HOUR * 2,
  '6h': MS_PER_HOUR * 6,
  '12h': MS_PER_HOUR * 12,
  '24h': MS_PER_DAY,
};

export const MINUTES_MAPPING: Record<MinutesTimescale, number> = {
  '1m': MS_PER_MINUTE,
  '5m': MS_PER_MINUTE * 5,
  '10m': MS_PER_MINUTE * 10,
  '30m': MS_PER_MINUTE * 30,
};

export const TIMESCALE_MAPPING: Record<Timescale, number> = {
  ...HOURS_MAPPING,
  ...MINUTES_MAPPING,
};

export const TIMELINE_CHUNK_WIDTH = 80;

export const OUT_OF_VIEW_CHUNK_COUNT = 2;
