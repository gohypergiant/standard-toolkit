// __private-exports
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

import { HOURS_MAPPING, MINUTES_MAPPING, MS_PER_HOUR } from '../constants';

const MS_PER_SECOND = 1000;
const MS_PER_DAY = MS_PER_HOUR * 24;

const hoursIntervalSet = new Set(Object.values(HOURS_MAPPING));
const minutesIntervalSet = new Set(Object.values(MINUTES_MAPPING));

/**
 * Rounds a millisecond timestamp down to the nearest interval boundary.
 * Uses pure integer arithmetic to avoid Date object allocations.
 *
 * @throws {RangeError} If selectedTimeIntervalMs does not match a known interval.
 */
export function roundMsToInterval(
  timestampMs: number,
  selectedTimeIntervalMs: number,
): number {
  // Zero out sub-second precision (handle negative timestamps correctly)
  const msRemainder =
    ((timestampMs % MS_PER_SECOND) + MS_PER_SECOND) % MS_PER_SECOND;
  const secondAligned = timestampMs - msRemainder;

  if (minutesIntervalSet.has(selectedTimeIntervalMs)) {
    const intervalRemainder =
      ((secondAligned % selectedTimeIntervalMs) + selectedTimeIntervalMs) %
      selectedTimeIntervalMs;
    return secondAligned - intervalRemainder;
  }

  if (hoursIntervalSet.has(selectedTimeIntervalMs)) {
    // Hours interval — align to interval boundary within the day
    const msIntoDayRaw = secondAligned % MS_PER_DAY;
    const msIntoDay =
      msIntoDayRaw < 0 ? msIntoDayRaw + MS_PER_DAY : msIntoDayRaw;
    const hourAligned = msIntoDay - (msIntoDay % selectedTimeIntervalMs);
    return secondAligned - msIntoDay + hourAligned;
  }

  throw new RangeError(
    `Unrecognized time interval: ${selectedTimeIntervalMs}ms`,
  );
}
