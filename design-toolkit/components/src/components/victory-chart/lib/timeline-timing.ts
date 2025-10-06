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

import { getEndDate, getStartDate } from '../data/date-values';
import { addHours, MS_IN_AN_HOUR } from './date-utils';
import type { ChartData } from '../data';
import type { ChartState } from './chart-state';

export function getTimelineTiming(focus: ChartState['focus'], data: ChartData) {
  const times = {
    timelineEnd: getEndDate(data)?.valueOf(),
    timelineStart: getStartDate(data)?.valueOf(),
  };

  if (
    (data && !data.length) || // no data
    !times.timelineStart || // invalid Date
    !times.timelineEnd || // invalid Date
    times.timelineStart === times.timelineEnd // zero-length time
  ) {
    return {
      timelineEnd: 0,
      timelineStart: 0,
    };
  }

  // fix the timelineEnd to not exceed the chosen filter length
  times.timelineEnd = Math.min(
    // data-defined end of timeline
    times.timelineEnd,
    // calculated end of timeline based on start of first item and chosen filter
    addHours(focus, new Date(times.timelineStart)).valueOf(),
  );

  const totalHours = (times.timelineEnd - times.timelineStart) / MS_IN_AN_HOUR;

  if (totalHours < focus) {
    // if the data available spans less time than the current filter selection
    // these values need to be padded to make sure the UI matches expectations
    const padding = Math.trunc(((focus - totalHours) / 2) * MS_IN_AN_HOUR);

    // to center the data in the graph the time needs to be added at the
    // beginning and the end of the times

    // pad forward in time
    times.timelineEnd += padding;
    // pad backward in time
    times.timelineStart -= padding;
  }

  return times;
}
