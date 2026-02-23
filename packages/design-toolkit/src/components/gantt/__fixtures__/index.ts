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

import type { RowElementColorProp } from '../types';

// Tuesday, Jan 27, 2026 at 12:00 AM UTC
export const DATASET_JAN27_TO_JAN30_START_TIME_MS = 1769472000000;

// Proxy for 'Now' in stories to demonstrate current time indicator
// Wed Jan 28, 2026 at 7:30 AM UTC
export const CURRENT_TIME_MS = 1769585400000;

// Friday, Jan 30, 2026 at 8:00 AM UTC
export const DATASET_JAN27_TO_JAN30_END_TIME_MS = 1769760000000;

type RangeTuple = readonly [startMs: number, endMs: number];

type Element =
  | { type: 'block'; rangeMs: RangeTuple; color?: RowElementColorProp }
  | { type: 'spacer'; rangeMs: RangeTuple; color?: RowElementColorProp }
  | { type: 'bracket-open'; timeMs: number; color?: RowElementColorProp }
  | { type: 'bracket-close'; timeMs: number; color?: RowElementColorProp }
  | { type: 'marker'; timeMs: number; color?: RowElementColorProp };

type Row = {
  id: string;
  elements: Element[];
};

type Dataset = {
  startTimeMs: number;
  endTimeMs: number;
  rows: Row[];
};

export const DATASET_JAN27_TO_JAN30: Dataset = {
  startTimeMs: DATASET_JAN27_TO_JAN30_START_TIME_MS,
  endTimeMs: DATASET_JAN27_TO_JAN30_END_TIME_MS,
  rows: [
    {
      id: 'row-A',
      elements: [
        // Tue Jan 27 — 12:00 AM
        { type: 'bracket-open', timeMs: 1769472000000 },
        // Tue Jan 27 — 12:00 AM - 12:30 AM
        { type: 'spacer', rangeMs: [1769472000000, 1769473800000] },

        // Tue Jan 27 — 12:30 AM - 2:00 AM
        {
          type: 'block',
          rangeMs: [1769473800000, 1769479200000],
          color: 'serious',
        },
        // Tue Jan 27 — 2:00 AM - 2:05 AM
        { type: 'spacer', rangeMs: [1769479200000, 1769479500000] },
        // Tue Jan 27 — 2:05 AM - 2:45 AM
        {
          type: 'block',
          rangeMs: [1769479500000, 1769481900000],
          color: 'accent',
        },
        // Tue Jan 27 — 2:45 AM - 2:50 AM
        { type: 'spacer', rangeMs: [1769481900000, 1769482200000] },
        // Tue Jan 27 — 2:50 AM - 3:30 AM
        {
          type: 'block',
          rangeMs: [1769482200000, 1769484600000],
          color: 'critical',
        },

        // Tue Jan 27 — 3:30 AM - 4:00 AM
        { type: 'spacer', rangeMs: [1769484600000, 1769486400000] },
        // Tue Jan 27 — 4:00 AM
        { type: 'bracket-close', timeMs: 1769486400000 },

        // Tue Jan 27 — 4:10 AM
        { type: 'marker', timeMs: 1769487000000, color: 'accent' },

        // Tue Jan 27 — 4:15 AM
        { type: 'bracket-open', timeMs: 1769487300000 },
        // Tue Jan 27 — 4:15 AM - 7:30 AM
        {
          type: 'spacer',
          rangeMs: [1769487300000, 1769499000000],
          color: 'serious',
        },
        // Tue Jan 27 — 7:30 AM
        { type: 'marker', timeMs: 1769499000000, color: 'critical' },
        // Tue Jan 27 — 7:30 AM - 8:40 AM
        {
          type: 'spacer',
          rangeMs: [1769499000000, 1769503200000],
          color: 'accent',
        },
        // Tue Jan 27 — 8:40 AM
        { type: 'marker', timeMs: 1769503200000, color: 'serious' },
        // Tue Jan 27 — 8:40 AM - 10:30 AM
        { type: 'spacer', rangeMs: [1769503200000, 1769509800000] },

        // Tue Jan 27 — 10:30 AM - 12:00 PM
        {
          type: 'block',
          rangeMs: [1769509800000, 1769515200000],
          color: 'critical',
        },
        // Tue Jan 27 — 12:00 PM - 12:05 PM
        { type: 'spacer', rangeMs: [1769515200000, 1769515500000] },
        // Tue Jan 27 — 12:05 PM - 12:45 PM
        {
          type: 'block',
          rangeMs: [1769515500000, 1769517900000],
          color: 'serious',
        },
        // Tue Jan 27 — 12:45 PM - 12:50 PM
        { type: 'spacer', rangeMs: [1769517900000, 1769518200000] },
        // Tue Jan 27 — 12:50 PM - 1:20 PM
        {
          type: 'block',
          rangeMs: [1769518200000, 1769520000000],
          color: 'accent',
        },

        // Wed Jan 28 — 2:00 PM - 4:30 PM
        {
          type: 'block',
          rangeMs: [1769618400000, 1769627400000],
          color: 'critical',
        },
        // Wed Jan 28 — 4:30 PM - 4:35 PM
        { type: 'spacer', rangeMs: [1769627400000, 1769627700000] },
        // Wed Jan 28 — 4:35 PM - 5:15 PM
        {
          type: 'block',
          rangeMs: [1769627700000, 1769630100000],
          color: 'accent',
        },
        // Wed Jan 28 — 5:15 PM - 5:20 PM
        { type: 'spacer', rangeMs: [1769630100000, 1769630400000] },
        // Wed Jan 28 — 5:20 PM - 6:00 PM
        {
          type: 'block',
          rangeMs: [1769630400000, 1769632800000],
          color: 'serious',
        },

        // Thu Jan 29 — 7:30 AM - 9:00 AM
        {
          type: 'block',
          rangeMs: [1769679000000, 1769684400000],
          color: 'accent',
        },
        // Thu Jan 29 — 9:00 AM - 9:05 AM
        { type: 'spacer', rangeMs: [1769684400000, 1769684700000] },
        // Thu Jan 29 — 9:05 AM - 9:40 AM
        {
          type: 'block',
          rangeMs: [1769684700000, 1769687000000],
          color: 'critical',
        },

        // Thu Jan 29 — 11:00 AM
        { type: 'bracket-open', timeMs: 1769691600000, color: 'serious' },
        // Thu Jan 29 — 11:00 AM - 12:00 PM
        {
          type: 'spacer',
          rangeMs: [1769691600000, 1769695200000],
          color: 'serious',
        },
        // Thu Jan 29 — 12:00 PM
        { type: 'bracket-close', timeMs: 1769695200000, color: 'serious' },

        // Thu Jan 29 — 11:30 PM - Fri Jan 30 12:30 AM
        {
          type: 'block',
          rangeMs: [1769722200000, 1769725800000],
          color: 'serious',
        },
        // Fri Jan 30 — 12:30 AM - 12:35 AM
        { type: 'spacer', rangeMs: [1769725800000, 1769726100000] },
        // Fri Jan 30 — 12:35 AM - 1:10 AM
        {
          type: 'block',
          rangeMs: [1769726100000, 1769728200000],
          color: 'accent',
        },
      ],
    },

    {
      id: 'row-B',
      elements: [
        // Tue Jan 27 — 2:00 AM - 4:00 AM
        {
          type: 'block',
          rangeMs: [1769479200000, 1769486400000],
          color: 'critical',
        },
        // Tue Jan 27 — 4:00 AM - 4:05 AM
        { type: 'spacer', rangeMs: [1769486400000, 1769486700000] },
        // Tue Jan 27 — 4:05 AM - 4:45 AM
        {
          type: 'block',
          rangeMs: [1769486700000, 1769489100000],
          color: 'accent',
        },
        // Tue Jan 27 — 4:45 AM - 4:50 AM
        { type: 'spacer', rangeMs: [1769489100000, 1769489400000] },
        // Tue Jan 27 — 4:50 AM - 5:20 AM
        {
          type: 'block',
          rangeMs: [1769489400000, 1769491200000],
          color: 'serious',
        },

        // Tue Jan 27 — 5:25 AM
        { type: 'bracket-open', timeMs: 1769491500000 },
        // Tue Jan 27 — 5:25 AM - 5:40 AM
        {
          type: 'spacer',
          rangeMs: [1769491500000, 1769492400000],
          color: 'critical',
        },
        // Tue Jan 27 — 5:40 AM
        { type: 'marker', timeMs: 1769492400000, color: 'accent' },
        // Tue Jan 27 — 5:40 AM - 6:00 AM
        { type: 'spacer', rangeMs: [1769492400000, 1769493600000] },

        // Tue Jan 27 — 6:00 AM - 8:00 AM
        {
          type: 'block',
          rangeMs: [1769493600000, 1769500800000],
          color: 'serious',
        },
        // Tue Jan 27 — 8:00 AM - 8:05 AM
        { type: 'spacer', rangeMs: [1769500800000, 1769501100000] },
        // Tue Jan 27 — 8:05 AM - 8:40 AM
        {
          type: 'block',
          rangeMs: [1769501100000, 1769503200000],
          color: 'critical',
        },

        // Tue Jan 27 — 8:40 AM - 9:10 AM
        { type: 'spacer', rangeMs: [1769503200000, 1769505000000] },
        // Tue Jan 27 — 9:10 AM
        { type: 'bracket-close', timeMs: 1769505000000 },

        // Wed Jan 28 — 9:00 AM - 11:00 AM
        {
          type: 'block',
          rangeMs: [1769590800000, 1769598000000],
          color: 'accent',
        },
        // Wed Jan 28 — 11:00 AM - 11:05 AM
        { type: 'spacer', rangeMs: [1769598000000, 1769598300000] },
        // Wed Jan 28 — 11:05 AM - 11:40 AM
        {
          type: 'block',
          rangeMs: [1769598300000, 1769600400000],
          color: 'serious',
        },

        // Wed Jan 28 — 10:40 PM
        { type: 'bracket-open', timeMs: 1769640000000, color: 'critical' },
        // Wed Jan 28 — 10:40 PM - 11:30 PM
        {
          type: 'spacer',
          rangeMs: [1769640000000, 1769643000000],
          color: 'critical',
        },
        // Wed Jan 28 — 11:30 PM
        { type: 'bracket-close', timeMs: 1769643000000, color: 'critical' },

        // Thu Jan 29 — 1:00 PM - 4:00 PM
        {
          type: 'block',
          rangeMs: [1769691600000, 1769702400000],
          color: 'critical',
        },
        // Thu Jan 29 — 4:00 PM - 4:05 PM
        { type: 'spacer', rangeMs: [1769702400000, 1769702700000] },
        // Thu Jan 29 — 4:05 PM - 4:45 PM
        {
          type: 'block',
          rangeMs: [1769702700000, 1769705100000],
          color: 'accent',
        },
      ],
    },

    {
      id: 'row-C',
      elements: [
        // Tue Jan 27 — 5:30 AM - 7:00 AM
        {
          type: 'block',
          rangeMs: [1769491800000, 1769497200000],
          color: 'accent',
        },
        // Tue Jan 27 — 7:00 AM - 7:05 AM
        { type: 'spacer', rangeMs: [1769497200000, 1769497500000] },
        // Tue Jan 27 — 7:05 AM - 7:35 AM
        {
          type: 'block',
          rangeMs: [1769497500000, 1769499300000],
          color: 'critical',
        },

        // Tue Jan 27 — 3:00 PM - 6:00 PM
        {
          type: 'block',
          rangeMs: [1769526000000, 1769536800000],
          color: 'serious',
        },
        // Tue Jan 27 — 6:00 PM - 6:05 PM
        { type: 'spacer', rangeMs: [1769536800000, 1769537100000] },
        // Tue Jan 27 — 6:05 PM - 6:45 PM
        {
          type: 'block',
          rangeMs: [1769537100000, 1769539500000],
          color: 'accent',
        },

        // Tue Jan 27 — 6:45 PM - 6:46 PM
        { type: 'spacer', rangeMs: [1769539500000, 1769540160000] },
        // Tue Jan 27 — 6:46 PM
        { type: 'bracket-close', timeMs: 1769540160000 },

        // Tue Jan 27 — 6:50 PM
        { type: 'bracket-open', timeMs: 1769540400000 },
        // Tue Jan 27 — 6:50 PM - Tue Jan 27 1:46 AM (next day boundary not shown)
        {
          type: 'spacer',
          rangeMs: [1769540400000, 1769564000000],
          color: 'critical',
        },
        // Wed Jan 28 — 1:46 AM
        { type: 'marker', timeMs: 1769564000000, color: 'serious' },
        // Wed Jan 28 — 1:46 AM - Wed Jan 28 12:26 PM
        {
          type: 'spacer',
          rangeMs: [1769564000000, 1769600000000],
          color: 'accent',
        },
        // Wed Jan 28 — 12:26 PM
        { type: 'marker', timeMs: 1769600000000, color: 'critical' },
        // Wed Jan 28 — 12:26 PM - Wed Jan 28 11:30 PM
        { type: 'spacer', rangeMs: [1769600000000, 1769643000000] },

        // Wed Jan 28 — 11:30 PM - Thu Jan 29 2:30 AM
        {
          type: 'block',
          rangeMs: [1769643000000, 1769653800000],
          color: 'serious',
        },
        // Thu Jan 29 — 2:30 AM - 2:35 AM
        { type: 'spacer', rangeMs: [1769653800000, 1769654100000] },
        // Thu Jan 29 — 2:35 AM - 3:15 AM
        {
          type: 'block',
          rangeMs: [1769654100000, 1769656500000],
          color: 'accent',
        },

        // Thu Jan 29 — 10:00 AM
        { type: 'bracket-open', timeMs: 1769700000000, color: 'serious' },
        // Thu Jan 29 — 10:00 AM - 10:40 AM
        {
          type: 'spacer',
          rangeMs: [1769700000000, 1769702400000],
          color: 'serious',
        },
        // Thu Jan 29 — 10:40 AM
        { type: 'bracket-close', timeMs: 1769702400000, color: 'serious' },

        // Fri Jan 30 — 4:00 AM - 8:00 AM
        {
          type: 'block',
          rangeMs: [1769745600000, 1769760000000],
          color: 'critical',
        },
      ],
    },

    {
      id: 'row-D',
      elements: [
        // Wed Jan 28 — 1:00 AM - 4:00 AM
        {
          type: 'block',
          rangeMs: [1769562000000, 1769572800000],
          color: 'serious',
        },
        // Wed Jan 28 — 4:00 AM - 4:05 AM
        { type: 'spacer', rangeMs: [1769572800000, 1769573100000] },
        // Wed Jan 28 — 4:05 AM - 4:45 AM
        {
          type: 'block',
          rangeMs: [1769573100000, 1769575500000],
          color: 'accent',
        },

        // Wed Jan 28 — 5:10 AM
        { type: 'bracket-open', timeMs: 1769577000000 },
        // Wed Jan 28 — 5:10 AM - 7:00 AM
        {
          type: 'spacer',
          rangeMs: [1769577000000, 1769583600000],
          color: 'critical',
        },
        // Wed Jan 28 — 7:00 AM
        { type: 'marker', timeMs: 1769583600000, color: 'serious' },
        // Wed Jan 28 — 7:00 AM - 10:00 AM
        { type: 'spacer', rangeMs: [1769583600000, 1769594400000] },

        // Wed Jan 28 — 10:00 AM - 12:00 PM
        {
          type: 'block',
          rangeMs: [1769594400000, 1769601600000],
          color: 'critical',
        },
        // Wed Jan 28 — 12:00 PM - 12:05 PM
        { type: 'spacer', rangeMs: [1769601600000, 1769601900000] },
        // Wed Jan 28 — 12:05 PM - 12:45 PM
        {
          type: 'block',
          rangeMs: [1769601900000, 1769604300000],
          color: 'accent',
        },

        // Wed Jan 28 — 12:45 PM - 1:30 PM
        { type: 'spacer', rangeMs: [1769604300000, 1769607000000] },
        // Wed Jan 28 — 1:30 PM
        { type: 'bracket-close', timeMs: 1769607000000 },

        // Thu Jan 29 — 6:00 AM - 8:00 AM
        {
          type: 'block',
          rangeMs: [1769676000000, 1769683200000],
          color: 'serious',
        },
        // Thu Jan 29 — 8:00 AM - 8:05 AM
        { type: 'spacer', rangeMs: [1769683200000, 1769683500000] },
        // Thu Jan 29 — 8:05 AM - 8:45 AM
        {
          type: 'block',
          rangeMs: [1769683500000, 1769685900000],
          color: 'critical',
        },

        // Thu Jan 29 — 2:20 PM
        { type: 'bracket-open', timeMs: 1769706000000, color: 'accent' },
        // Thu Jan 29 — 2:20 PM - 2:50 PM
        {
          type: 'spacer',
          rangeMs: [1769706000000, 1769707800000],
          color: 'accent',
        },
        // Thu Jan 29 — 2:50 PM
        { type: 'bracket-close', timeMs: 1769707800000, color: 'accent' },

        // Thu Jan 29 — 10:00 PM - Fri Jan 30 1:00 AM
        {
          type: 'block',
          rangeMs: [1769724000000, 1769734800000],
          color: 'accent',
        },
      ],
    },

    {
      id: 'row-E',
      elements: [
        // Tue Jan 27 — 9:00 AM - 10:00 AM
        {
          type: 'block',
          rangeMs: [1769504400000, 1769508000000],
          color: 'critical',
        },
        // Tue Jan 27 — 10:00 AM - 10:05 AM
        { type: 'spacer', rangeMs: [1769508000000, 1769508300000] },
        // Tue Jan 27 — 10:05 AM - 10:45 AM
        {
          type: 'block',
          rangeMs: [1769508300000, 1769510700000],
          color: 'serious',
        },

        // Tue Jan 27 — 6:39 PM
        { type: 'bracket-open', timeMs: 1769539980000, color: 'accent' },
        // Tue Jan 27 — 6:39 PM - 8:00 PM
        {
          type: 'spacer',
          rangeMs: [1769539980000, 1769544000000],
          color: 'accent',
        },
        // Tue Jan 27 — 8:00 PM
        { type: 'bracket-close', timeMs: 1769544000000, color: 'accent' },

        // Wed Jan 28 — 12:00 AM
        { type: 'marker', timeMs: 1769562000000, color: 'critical' },

        // Wed Jan 28 — 8:30 AM - 11:00 AM
        {
          type: 'block',
          rangeMs: [1769589000000, 1769598000000],
          color: 'accent',
        },
        // Wed Jan 28 — 11:00 AM - 11:05 AM
        { type: 'spacer', rangeMs: [1769598000000, 1769598300000] },
        // Wed Jan 28 — 11:05 AM - 11:45 AM
        {
          type: 'block',
          rangeMs: [1769598300000, 1769600700000],
          color: 'serious',
        },

        // Wed Jan 28 — 12:00 PM
        { type: 'bracket-open', timeMs: 1769601600000 },
        // Wed Jan 28 — 12:00 PM - 3:00 PM
        { type: 'spacer', rangeMs: [1769601600000, 1769612400000] },

        // Wed Jan 28 — 3:00 PM - 7:00 PM
        {
          type: 'block',
          rangeMs: [1769612400000, 1769626800000],
          color: 'critical',
        },
        // Wed Jan 28 — 7:00 PM - 7:05 PM
        { type: 'spacer', rangeMs: [1769626800000, 1769627100000] },
        // Wed Jan 28 — 7:05 PM - 7:45 PM
        {
          type: 'block',
          rangeMs: [1769627100000, 1769629500000],
          color: 'accent',
        },

        // Wed Jan 28 — 7:45 PM - 8:30 PM
        { type: 'spacer', rangeMs: [1769629500000, 1769632200000] },
        // Wed Jan 28 — 8:30 PM
        { type: 'bracket-close', timeMs: 1769632200000 },

        // Thu Jan 29 — 4:30 PM - 6:30 PM
        {
          type: 'block',
          rangeMs: [1769704200000, 1769711400000],
          color: 'serious',
        },
      ],
    },

    {
      id: 'row-F',
      elements: [
        // Tue Jan 27 — 6:00 PM - 8:00 PM
        {
          type: 'block',
          rangeMs: [1769536800000, 1769544000000],
          color: 'accent',
        },
        // Tue Jan 27 — 8:00 PM - 8:05 PM
        { type: 'spacer', rangeMs: [1769544000000, 1769544300000] },
        // Tue Jan 27 — 8:05 PM - 8:45 PM
        {
          type: 'block',
          rangeMs: [1769544300000, 1769546700000],
          color: 'critical',
        },

        // Tue Jan 27 — 11:20 PM
        { type: 'bracket-open', timeMs: 1769556000000, color: 'serious' },
        // Tue Jan 27 — 11:20 PM - 11:40 PM
        {
          type: 'spacer',
          rangeMs: [1769556000000, 1769557200000],
          color: 'serious',
        },
        // Tue Jan 27 — 11:40 PM
        { type: 'marker', timeMs: 1769557200000, color: 'critical' },
        // Tue Jan 27 — 11:40 PM - Wed Jan 28 12:10 AM
        {
          type: 'spacer',
          rangeMs: [1769557200000, 1769559000000],
          color: 'serious',
        },
        // Wed Jan 28 — 12:10 AM
        { type: 'bracket-close', timeMs: 1769559000000, color: 'serious' },

        // Wed Jan 28 — 5:30 AM - 7:30 AM
        {
          type: 'block',
          rangeMs: [1769578200000, 1769585400000],
          color: 'serious',
        },
        // Wed Jan 28 — 7:30 AM - 7:35 AM
        { type: 'spacer', rangeMs: [1769585400000, 1769585700000] },
        // Wed Jan 28 — 7:35 AM - 8:15 AM
        {
          type: 'block',
          rangeMs: [1769585700000, 1769588100000],
          color: 'accent',
        },

        // Wed Jan 28 — 8:30 AM
        { type: 'bracket-open', timeMs: 1769589000000 },
        // Wed Jan 28 — 8:30 AM - Wed Jan 28 5:20 PM
        {
          type: 'spacer',
          rangeMs: [1769589000000, 1769620000000],
          color: 'critical',
        },
        // Wed Jan 28 — 5:20 PM
        { type: 'marker', timeMs: 1769620000000, color: 'accent' },
        // Wed Jan 28 — 5:20 PM - Thu Jan 29 4:26 AM
        {
          type: 'spacer',
          rangeMs: [1769620000000, 1769660000000],
          color: 'serious',
        },
        // Thu Jan 29 — 4:26 AM
        { type: 'marker', timeMs: 1769660000000, color: 'critical' },
        // Thu Jan 29 — 4:26 AM - Thu Jan 29 2:00 PM
        { type: 'spacer', rangeMs: [1769660000000, 1769688000000] },

        // Thu Jan 29 — 2:00 PM - 5:00 PM
        {
          type: 'block',
          rangeMs: [1769688000000, 1769698800000],
          color: 'accent',
        },
        // Thu Jan 29 — 5:00 PM - 5:05 PM
        { type: 'spacer', rangeMs: [1769698800000, 1769699100000] },
        // Thu Jan 29 — 5:05 PM - 5:45 PM
        {
          type: 'block',
          rangeMs: [1769699100000, 1769701500000],
          color: 'serious',
        },

        // Thu Jan 29 — 5:45 PM - 6:30 PM
        { type: 'spacer', rangeMs: [1769701500000, 1769704200000] },
        // Thu Jan 29 — 6:30 PM
        { type: 'bracket-close', timeMs: 1769704200000 },

        // Fri Jan 30 — 12:30 AM - 4:00 AM
        {
          type: 'block',
          rangeMs: [1769725800000, 1769738400000],
          color: 'critical',
        },
      ],
    },

    {
      id: 'row-G',
      elements: [
        // Tue Jan 27 — 12:00 AM - 12:45 AM
        {
          type: 'block',
          rangeMs: [1769472000000, 1769474700000],
          color: 'serious',
        },
        // Tue Jan 27 — 12:45 AM - 12:50 AM
        { type: 'spacer', rangeMs: [1769474700000, 1769475000000] },
        // Tue Jan 27 — 12:50 AM - 1:20 AM
        {
          type: 'block',
          rangeMs: [1769475000000, 1769476800000],
          color: 'critical',
        },

        // Tue Jan 27 — 2:00 AM
        { type: 'bracket-open', timeMs: 1769479200000 },
        // Tue Jan 27 — 2:00 AM - Tue Jan 27 6:40 PM
        {
          type: 'spacer',
          rangeMs: [1769479200000, 1769540000000],
          color: 'accent',
        },
        // Tue Jan 27 — 6:40 PM
        { type: 'marker', timeMs: 1769540000000, color: 'serious' },
        // Tue Jan 27 — 6:40 PM - Wed Jan 28 6:00 AM
        {
          type: 'spacer',
          rangeMs: [1769540000000, 1769580000000],
          color: 'critical',
        },
        // Wed Jan 28 — 6:00 AM
        { type: 'marker', timeMs: 1769580000000, color: 'accent' },
        // Wed Jan 28 — 6:00 AM - Wed Jan 28 12:30 PM
        { type: 'spacer', rangeMs: [1769580000000, 1769603400000] },

        // Wed Jan 28 — 12:30 PM - 2:00 PM
        {
          type: 'block',
          rangeMs: [1769603400000, 1769608800000],
          color: 'accent',
        },
        // Wed Jan 28 — 2:00 PM - 2:05 PM
        { type: 'spacer', rangeMs: [1769608800000, 1769609100000] },
        // Wed Jan 28 — 2:05 PM - 2:45 PM
        {
          type: 'block',
          rangeMs: [1769609100000, 1769611500000],
          color: 'serious',
        },

        // Thu Jan 29 — 9:30 AM - 11:30 AM
        {
          type: 'block',
          rangeMs: [1769679000000, 1769686200000],
          color: 'critical',
        },
        // Thu Jan 29 — 11:30 AM - 11:35 AM
        { type: 'spacer', rangeMs: [1769686200000, 1769686500000] },
        // Thu Jan 29 — 11:35 AM - 12:15 PM
        {
          type: 'block',
          rangeMs: [1769686500000, 1769688900000],
          color: 'accent',
        },

        // Thu Jan 29 — 12:15 PM - 1:00 PM
        { type: 'spacer', rangeMs: [1769688900000, 1769691600000] },
        // Thu Jan 29 — 1:00 PM
        { type: 'bracket-close', timeMs: 1769691600000 },

        // Fri Jan 30 — 5:00 AM - 7:30 AM
        {
          type: 'block',
          rangeMs: [1769749200000, 1769758200000],
          color: 'serious',
        },
        // Fri Jan 30 — 7:30 AM - 7:50 AM
        {
          type: 'spacer',
          rangeMs: [1769758200000, 1769759400000],
          color: 'critical',
        },
        // Fri Jan 30 — 7:50 AM
        { type: 'bracket-close', timeMs: 1769759400000 },
      ],
    },

    {
      id: 'row-H',
      elements: [
        // Tue Jan 27 — 4:30 AM - 5:15 AM
        {
          type: 'block',
          rangeMs: [1769488200000, 1769490900000],
          color: 'critical',
        },
        // Tue Jan 27 — 5:15 AM - 5:20 AM
        { type: 'spacer', rangeMs: [1769490900000, 1769491200000] },
        // Tue Jan 27 — 5:20 AM - 5:50 AM
        {
          type: 'block',
          rangeMs: [1769491200000, 1769493000000],
          color: 'accent',
        },

        // Tue Jan 27 — 6:00 AM
        { type: 'bracket-open', timeMs: 1769493600000 },
        // Tue Jan 27 — 6:00 AM - 8:10 AM
        {
          type: 'spacer',
          rangeMs: [1769493600000, 1769502000000],
          color: 'serious',
        },
        // Tue Jan 27 — 8:10 AM
        { type: 'marker', timeMs: 1769502000000, color: 'critical' },
        // Tue Jan 27 — 8:10 AM - 12:00 PM
        { type: 'spacer', rangeMs: [1769502000000, 1769515200000] },

        // Tue Jan 27 — 12:00 PM - 2:30 PM
        {
          type: 'block',
          rangeMs: [1769515200000, 1769524200000],
          color: 'serious',
        },
        // Tue Jan 27 — 2:30 PM - 2:35 PM
        { type: 'spacer', rangeMs: [1769524200000, 1769524500000] },
        // Tue Jan 27 — 2:35 PM - 3:15 PM
        {
          type: 'block',
          rangeMs: [1769524500000, 1769526900000],
          color: 'accent',
        },

        // Wed Jan 28 — 10:40 PM
        { type: 'bracket-open', timeMs: 1769640000000, color: 'critical' },
        // Wed Jan 28 — 10:40 PM - 11:10 PM
        {
          type: 'spacer',
          rangeMs: [1769640000000, 1769641800000],
          color: 'critical',
        },
        // Wed Jan 28 — 11:10 PM
        { type: 'bracket-close', timeMs: 1769641800000, color: 'critical' },

        // Thu Jan 29 — 6:30 PM - 9:00 PM
        {
          type: 'block',
          rangeMs: [1769711400000, 1769720400000],
          color: 'accent',
        },
        // Thu Jan 29 — 9:00 PM - 9:05 PM
        { type: 'spacer', rangeMs: [1769720400000, 1769720700000] },
        // Thu Jan 29 — 9:05 PM - 9:45 PM
        {
          type: 'block',
          rangeMs: [1769720700000, 1769723100000],
          color: 'serious',
        },

        // Thu Jan 29 — 9:45 PM - 10:30 PM
        { type: 'spacer', rangeMs: [1769723100000, 1769725800000] },
        // Thu Jan 29 — 10:30 PM
        { type: 'bracket-close', timeMs: 1769725800000 },

        // Fri Jan 30 — 2:30 AM - 3:45 AM
        {
          type: 'block',
          rangeMs: [1769740200000, 1769744700000],
          color: 'critical',
        },
      ],
    },

    {
      id: 'row-I',
      elements: [
        // Tue Jan 27 — 8:00 PM - 10:00 PM
        {
          type: 'block',
          rangeMs: [1769544000000, 1769551200000],
          color: 'accent',
        },
        // Tue Jan 27 — 10:00 PM - 10:05 PM
        { type: 'spacer', rangeMs: [1769551200000, 1769551500000] },
        // Tue Jan 27 — 10:05 PM - 10:45 PM
        {
          type: 'block',
          rangeMs: [1769551500000, 1769553900000],
          color: 'critical',
        },

        // Tue Jan 27 — 11:06 PM
        { type: 'bracket-open', timeMs: 1769559960000, color: 'serious' },
        // Tue Jan 27 — 11:06 PM - Wed Jan 28 12:00 AM
        {
          type: 'spacer',
          rangeMs: [1769559960000, 1769562000000],
          color: 'serious',
        },
        // Wed Jan 28 — 12:00 AM
        { type: 'bracket-close', timeMs: 1769562000000, color: 'serious' },

        // Wed Jan 28 — 4:30 AM - 6:00 AM
        {
          type: 'block',
          rangeMs: [1769574600000, 1769580000000],
          color: 'serious',
        },
        // Wed Jan 28 — 6:00 AM - 6:05 AM
        { type: 'spacer', rangeMs: [1769580000000, 1769580300000] },
        // Wed Jan 28 — 6:05 AM - 6:45 AM
        {
          type: 'block',
          rangeMs: [1769580300000, 1769582700000],
          color: 'accent',
        },

        // Wed Jan 28 — 7:00 AM
        { type: 'bracket-open', timeMs: 1769583600000 },
        // Wed Jan 28 — 7:00 AM - 1:20 PM
        {
          type: 'spacer',
          rangeMs: [1769583600000, 1769608000000],
          color: 'critical',
        },
        // Wed Jan 28 — 1:20 PM
        { type: 'marker', timeMs: 1769608000000, color: 'accent' },
        // Wed Jan 28 — 1:20 PM - 3:20 PM
        {
          type: 'spacer',
          rangeMs: [1769608000000, 1769616000000],
          color: 'serious',
        },
        // Wed Jan 28 — 3:20 PM
        { type: 'marker', timeMs: 1769616000000, color: 'critical' },
        // Wed Jan 28 — 3:20 PM - 7:30 PM
        { type: 'spacer', rangeMs: [1769616000000, 1769628600000] },

        // Wed Jan 28 — 7:30 PM - 10:30 PM
        {
          type: 'block',
          rangeMs: [1769628600000, 1769639400000],
          color: 'serious',
        },
        // Wed Jan 28 — 10:30 PM - 10:35 PM
        { type: 'spacer', rangeMs: [1769639400000, 1769639700000] },
        // Wed Jan 28 — 10:35 PM - 11:15 PM
        {
          type: 'block',
          rangeMs: [1769639700000, 1769642100000],
          color: 'accent',
        },

        // Thu Jan 29 — 12:00 PM - 1:00 PM
        {
          type: 'block',
          rangeMs: [1769688000000, 1769691600000],
          color: 'critical',
        },

        // Thu Jan 29 — 1:00 PM - 2:00 PM
        { type: 'spacer', rangeMs: [1769691600000, 1769695200000] },
        // Thu Jan 29 — 2:00 PM
        { type: 'bracket-close', timeMs: 1769695200000 },

        // Fri Jan 30 — 7:00 AM - 8:00 AM
        {
          type: 'block',
          rangeMs: [1769756400000, 1769760000000],
          color: 'serious',
        },
      ],
    },

    {
      id: 'row-J',
      elements: [
        // Tue Jan 27 — 1:00 AM - 1:45 AM
        {
          type: 'block',
          rangeMs: [1769475600000, 1769478300000],
          color: 'critical',
        },
        // Tue Jan 27 — 1:45 AM - 1:50 AM
        { type: 'spacer', rangeMs: [1769478300000, 1769478600000] },
        // Tue Jan 27 — 1:50 AM - 2:20 AM
        {
          type: 'block',
          rangeMs: [1769478600000, 1769480400000],
          color: 'accent',
        },

        // Tue Jan 27 — 8:15 AM - 9:00 AM
        {
          type: 'block',
          rangeMs: [1769501700000, 1769504400000],
          color: 'serious',
        },
        // Tue Jan 27 — 9:00 AM - 9:05 AM
        { type: 'spacer', rangeMs: [1769504400000, 1769504700000] },
        // Tue Jan 27 — 9:05 AM - 9:40 AM
        {
          type: 'block',
          rangeMs: [1769504700000, 1769506800000],
          color: 'critical',
        },

        // Tue Jan 27 — 9:40 PM
        { type: 'bracket-open', timeMs: 1769550000000, color: 'accent' },
        // Tue Jan 27 — 9:40 PM - 10:00 PM
        {
          type: 'spacer',
          rangeMs: [1769550000000, 1769551200000],
          color: 'accent',
        },
        // Tue Jan 27 — 10:00 PM
        { type: 'marker', timeMs: 1769551200000, color: 'serious' },
        // Tue Jan 27 — 10:00 PM - 10:30 PM
        {
          type: 'spacer',
          rangeMs: [1769551200000, 1769553000000],
          color: 'accent',
        },
        // Tue Jan 27 — 10:30 PM
        { type: 'bracket-close', timeMs: 1769553000000, color: 'accent' },

        // Wed Jan 28 — 12:00 PM - 1:30 PM
        {
          type: 'block',
          rangeMs: [1769601600000, 1769607000000],
          color: 'accent',
        },
        // Wed Jan 28 — 1:30 PM - 1:35 PM
        { type: 'spacer', rangeMs: [1769607000000, 1769607300000] },
        // Wed Jan 28 — 1:35 PM - 2:15 PM
        {
          type: 'block',
          rangeMs: [1769607300000, 1769609700000],
          color: 'serious',
        },

        // Wed Jan 28 — 2:15 PM - 3:00 PM
        {
          type: 'spacer',
          rangeMs: [1769609700000, 1769612400000],
          color: 'critical',
        },
        // Wed Jan 28 — 3:00 PM
        { type: 'bracket-close', timeMs: 1769612400000 },

        // Thu Jan 29 — 8:00 AM - 9:30 AM
        {
          type: 'block',
          rangeMs: [1769683200000, 1769688600000],
          color: 'critical',
        },

        // Fri Jan 30 — 1:00 AM - 2:30 AM
        {
          type: 'block',
          rangeMs: [1769731200000, 1769736600000],
          color: 'accent',
        },
      ],
    },

    {
      id: 'row-K',
      elements: [
        // Tue Jan 27 — 3:30 AM - 5:00 AM
        {
          type: 'block',
          rangeMs: [1769484600000, 1769490000000],
          color: 'serious',
        },
        // Tue Jan 27 — 5:00 AM - 5:05 AM
        { type: 'spacer', rangeMs: [1769490000000, 1769490300000] },
        // Tue Jan 27 — 5:05 AM - 5:35 AM
        {
          type: 'block',
          rangeMs: [1769490300000, 1769492100000],
          color: 'critical',
        },

        // Tue Jan 27 — 6:00 AM
        { type: 'bracket-open', timeMs: 1769493600000 },
        // Tue Jan 27 — 6:00 AM - 8:00 AM
        {
          type: 'spacer',
          rangeMs: [1769493600000, 1769500800000],
          color: 'accent',
        },
        // Tue Jan 27 — 8:00 AM
        { type: 'marker', timeMs: 1769500800000, color: 'critical' },
        // Tue Jan 27 — 8:00 AM - 11:00 AM
        { type: 'spacer', rangeMs: [1769500800000, 1769511600000] },

        // Tue Jan 27 — 11:00 AM - 12:00 PM
        {
          type: 'block',
          rangeMs: [1769511600000, 1769515200000],
          color: 'accent',
        },
        // Tue Jan 27 — 12:00 PM - 12:05 PM
        { type: 'spacer', rangeMs: [1769515200000, 1769515500000] },
        // Tue Jan 27 — 12:05 PM - 12:45 PM
        {
          type: 'block',
          rangeMs: [1769515500000, 1769517900000],
          color: 'serious',
        },

        // Wed Jan 28 — 6:00 AM - 7:00 AM
        {
          type: 'block',
          rangeMs: [1769580000000, 1769583600000],
          color: 'critical',
        },
        // Wed Jan 28 — 7:00 AM - 7:05 AM
        { type: 'spacer', rangeMs: [1769583600000, 1769583900000] },
        // Wed Jan 28 — 7:05 AM - 7:45 AM
        {
          type: 'block',
          rangeMs: [1769583900000, 1769586300000],
          color: 'accent',
        },

        // Wed Jan 28 — 8:46 AM
        { type: 'bracket-open', timeMs: 1769589960000, color: 'serious' },
        // Wed Jan 28 — 8:46 AM - 9:00 AM
        {
          type: 'spacer',
          rangeMs: [1769589960000, 1769590800000],
          color: 'serious',
        },
        // Wed Jan 28 — 9:00 AM
        { type: 'bracket-close', timeMs: 1769590800000, color: 'serious' },

        // Wed Jan 28 — 1:45 PM - 3:15 PM
        {
          type: 'block',
          rangeMs: [1769607900000, 1769613300000],
          color: 'critical',
        },

        // Wed Jan 28 — 3:15 PM - 3:45 PM
        {
          type: 'spacer',
          rangeMs: [1769613300000, 1769615100000],
          color: 'accent',
        },
        // Wed Jan 28 — 3:45 PM
        { type: 'bracket-close', timeMs: 1769615100000 },

        // Thu Jan 29 — 5:00 PM - 7:00 PM
        {
          type: 'block',
          rangeMs: [1769710800000, 1769718000000],
          color: 'accent',
        },

        // Fri Jan 30 — 3:00 AM - 4:30 AM
        {
          type: 'block',
          rangeMs: [1769738400000, 1769743800000],
          color: 'serious',
        },
      ],
    },

    {
      id: 'row-L',
      elements: [
        // Tue Jan 27 — 6:45 AM - 7:30 AM
        {
          type: 'block',
          rangeMs: [1769496300000, 1769499000000],
          color: 'accent',
        },
        // Tue Jan 27 — 7:30 AM - 7:35 AM
        { type: 'spacer', rangeMs: [1769499000000, 1769499300000] },
        // Tue Jan 27 — 7:35 AM - 8:05 AM
        {
          type: 'block',
          rangeMs: [1769499300000, 1769501100000],
          color: 'critical',
        },

        // Tue Jan 27 — 11:33 AM
        { type: 'bracket-open', timeMs: 1769511960000, color: 'serious' },
        // Tue Jan 27 — 11:33 AM - 11:53 AM
        {
          type: 'spacer',
          rangeMs: [1769511960000, 1769513200000],
          color: 'serious',
        },
        // Tue Jan 27 — 11:53 AM
        { type: 'marker', timeMs: 1769513200000, color: 'accent' },
        // Tue Jan 27 — 11:53 AM - 12:23 PM
        {
          type: 'spacer',
          rangeMs: [1769513200000, 1769514960000],
          color: 'serious',
        },
        // Tue Jan 27 — 12:23 PM
        { type: 'bracket-close', timeMs: 1769514960000, color: 'serious' },

        // Tue Jan 27 — 1:00 PM - 2:00 PM
        {
          type: 'block',
          rangeMs: [1769518800000, 1769522400000],
          color: 'critical',
        },
        // Tue Jan 27 — 2:00 PM - 2:05 PM
        { type: 'spacer', rangeMs: [1769522400000, 1769522700000] },
        // Tue Jan 27 — 2:05 PM - 2:45 PM
        {
          type: 'block',
          rangeMs: [1769522700000, 1769525100000],
          color: 'accent',
        },

        // Wed Jan 28 — 9:30 AM - 10:30 AM
        {
          type: 'block',
          rangeMs: [1769592600000, 1769596200000],
          color: 'serious',
        },

        // Wed Jan 28 — 10:30 AM - 11:00 AM
        {
          type: 'spacer',
          rangeMs: [1769596200000, 1769598000000],
          color: 'critical',
        },
        // Wed Jan 28 — 11:00 AM
        { type: 'bracket-close', timeMs: 1769598000000 },

        // Wed Jan 28 — 6:30 PM - 8:00 PM
        {
          type: 'block',
          rangeMs: [1769632200000, 1769637600000],
          color: 'accent',
        },

        // Thu Jan 29 — 10:00 AM - 12:00 PM
        {
          type: 'block',
          rangeMs: [1769689200000, 1769696400000],
          color: 'critical',
        },

        // Fri Jan 30 — 5:30 AM - 7:00 AM
        {
          type: 'block',
          rangeMs: [1769751000000, 1769756400000],
          color: 'serious',
        },
      ],
    },

    {
      id: 'row-M',
      elements: [
        // Tue Jan 27 — 12:45 AM - 1:30 AM
        {
          type: 'block',
          rangeMs: [1769474700000, 1769477400000],
          color: 'critical',
        },
        // Tue Jan 27 — 1:30 AM - 1:35 AM
        { type: 'spacer', rangeMs: [1769477400000, 1769477700000] },
        // Tue Jan 27 — 1:35 AM - 2:05 AM
        {
          type: 'block',
          rangeMs: [1769477700000, 1769479500000],
          color: 'accent',
        },

        // Tue Jan 27 — 2:30 AM
        { type: 'bracket-open', timeMs: 1769481000000 },
        // Tue Jan 27 — 2:30 AM - 7:46 AM
        {
          type: 'spacer',
          rangeMs: [1769481000000, 1769500000000],
          color: 'serious',
        },
        // Tue Jan 27 — 7:46 AM
        { type: 'marker', timeMs: 1769500000000, color: 'critical' },
        // Tue Jan 27 — 7:46 AM - 1:20 PM
        {
          type: 'spacer',
          rangeMs: [1769500000000, 1769520000000],
          color: 'accent',
        },
        // Tue Jan 27 — 1:20 PM
        { type: 'marker', timeMs: 1769520000000, color: 'serious' },
        // Tue Jan 27 — 1:20 PM - 4:00 PM
        { type: 'spacer', rangeMs: [1769520000000, 1769532000000] },

        // Tue Jan 27 — 4:00 PM - 5:30 PM
        {
          type: 'block',
          rangeMs: [1769532000000, 1769537400000],
          color: 'accent',
        },
        // Tue Jan 27 — 5:30 PM - 5:35 PM
        { type: 'spacer', rangeMs: [1769537400000, 1769537700000] },
        // Tue Jan 27 — 5:35 PM - 6:15 PM
        {
          type: 'block',
          rangeMs: [1769537700000, 1769540100000],
          color: 'critical',
        },

        // Wed Jan 28 — 7:00 AM - 8:30 AM
        {
          type: 'block',
          rangeMs: [1769583600000, 1769589000000],
          color: 'serious',
        },

        // Wed Jan 28 — 11:00 AM - 12:30 PM
        {
          type: 'block',
          rangeMs: [1769598000000, 1769603400000],
          color: 'accent',
        },

        // Wed Jan 29 — 12:20 AM
        { type: 'bracket-open', timeMs: 1769646000000, color: 'critical' },
        // Wed Jan 29 — 12:20 AM - Thu Jan 29 01:10 AM
        {
          type: 'spacer',
          rangeMs: [1769646000000, 1769649000000],
          color: 'critical',
        },
        // Thu Jan 29 — 01:10 AM
        { type: 'bracket-close', timeMs: 1769649000000, color: 'critical' },

        // Thu Jan 29 — 3:00 PM - 4:30 PM
        {
          type: 'block',
          rangeMs: [1769695200000, 1769700600000],
          color: 'serious',
        },

        // Thu Jan 29 — 4:30 PM - 5:00 PM
        {
          type: 'spacer',
          rangeMs: [1769700600000, 1769702400000],
          color: 'accent',
        },
        // Thu Jan 29 — 5:00 PM
        { type: 'bracket-close', timeMs: 1769702400000 },

        // Fri Jan 30 — 12:00 AM - 1:00 AM
        {
          type: 'block',
          rangeMs: [1769724000000, 1769727600000],
          color: 'critical',
        },
      ],
    },

    {
      id: 'row-N',
      elements: [
        // Tue Jan 27 — 7:30 AM - 9:00 AM
        {
          type: 'block',
          rangeMs: [1769499000000, 1769504400000],
          color: 'accent',
        },
        // Tue Jan 27 — 9:00 AM - 9:05 AM
        { type: 'spacer', rangeMs: [1769504400000, 1769504700000] },
        // Tue Jan 27 — 9:05 AM - 9:45 AM
        {
          type: 'block',
          rangeMs: [1769504700000, 1769507100000],
          color: 'critical',
        },

        // Tue Jan 27 — 2:30 PM - 4:00 PM
        {
          type: 'block',
          rangeMs: [1769524200000, 1769529600000],
          color: 'serious',
        },
        // Tue Jan 27 — 4:00 PM - 4:05 PM
        { type: 'spacer', rangeMs: [1769529600000, 1769529900000] },
        // Tue Jan 27 — 4:05 PM - 4:45 PM
        {
          type: 'block',
          rangeMs: [1769529900000, 1769532300000],
          color: 'accent',
        },

        // Tue Jan 27 — 5:00 PM
        { type: 'bracket-open', timeMs: 1769533200000 },
        // Tue Jan 27 — 5:00 PM - Tue Jan 27 9:10 PM
        {
          type: 'spacer',
          rangeMs: [1769533200000, 1769550000000],
          color: 'critical',
        },
        // Tue Jan 27 — 9:10 PM
        { type: 'marker', timeMs: 1769550000000, color: 'serious' },
        // Tue Jan 27 — 9:10 PM - Wed Jan 28 2:00 AM
        { type: 'spacer', rangeMs: [1769550000000, 1769565600000] },

        // Wed Jan 28 — 2:00 AM - 3:30 AM
        {
          type: 'block',
          rangeMs: [1769565600000, 1769571000000],
          color: 'accent',
        },

        // Wed Jan 28 — 9:43 AM
        { type: 'bracket-open', timeMs: 1769599800000, color: 'serious' },
        // Wed Jan 28 — 9:43 AM - 10:00 AM
        {
          type: 'spacer',
          rangeMs: [1769599800000, 1769600400000],
          color: 'serious',
        },
        // Wed Jan 28 — 10:00 AM
        { type: 'marker', timeMs: 1769600400000, color: 'critical' },
        // Wed Jan 28 — 10:00 AM - 10:30 AM
        {
          type: 'spacer',
          rangeMs: [1769600400000, 1769601600000],
          color: 'serious',
        },
        // Wed Jan 28 — 10:30 AM
        { type: 'bracket-close', timeMs: 1769601600000, color: 'serious' },

        // Wed Jan 28 — 5:00 PM - 6:30 PM
        {
          type: 'block',
          rangeMs: [1769627400000, 1769632800000],
          color: 'critical',
        },

        // Wed Jan 28 — 6:30 PM - 8:00 PM
        {
          type: 'spacer',
          rangeMs: [1769632800000, 1769637600000],
          color: 'accent',
        },
        // Wed Jan 28 — 8:00 PM
        { type: 'bracket-close', timeMs: 1769637600000 },

        // Thu Jan 29 — 7:00 AM - 8:30 AM
        {
          type: 'block',
          rangeMs: [1769679600000, 1769685000000],
          color: 'serious',
        },

        // Fri Jan 30 — 6:00 AM - 8:00 AM
        {
          type: 'block',
          rangeMs: [1769752800000, 1769760000000],
          color: 'accent',
        },
      ],
    },
  ],
};

// Sun Jan 25 — 12:00 AM UTC
export const DATASET_JAN25_TO_JAN28_START_TIME_MS = 1769299200000;

// Wed Jan 28 — 8:00 AM UTC
export const DATASET_JAN25_TO_JAN28_END_TIME_MS = 1769587200000;

export const DATASET_JAN25_TO_JAN28: Dataset = {
  startTimeMs: DATASET_JAN25_TO_JAN28_START_TIME_MS,
  endTimeMs: DATASET_JAN25_TO_JAN28_END_TIME_MS,
  rows: [
    {
      id: 'row-A',
      elements: [
        // Sat Jan 25 — 12:00 AM
        { type: 'bracket-open', timeMs: 1769299200000, color: 'accent' },
        // Sat Jan 25 — 12:00 AM - 1:20 AM
        {
          type: 'spacer',
          rangeMs: [1769299200000, 1769304000000],
          color: 'accent',
        },
        // Sat Jan 25 — 1:20 AM
        { type: 'marker', timeMs: 1769304000000, color: 'serious' },
        // Sat Jan 25 — 1:20 AM - 2:10 AM
        {
          type: 'spacer',
          rangeMs: [1769304000000, 1769307000000],
          color: 'accent',
        },
        // Sat Jan 25 — 2:10 AM - 3:10 AM
        {
          type: 'block',
          rangeMs: [1769307000000, 1769310600000],
          color: 'critical',
        },
        // Sat Jan 25 — 3:10 AM - 3:40 AM
        { type: 'spacer', rangeMs: [1769310600000, 1769312400000] },
        // Sat Jan 25 — 3:40 AM - 4:20 AM
        {
          type: 'block',
          rangeMs: [1769312400000, 1769314800000],
          color: 'accent',
        },
        // Sat Jan 25 — 4:20 AM
        { type: 'bracket-close', timeMs: 1769314800000, color: 'accent' },

        // Sun Jan 26 — 9:30 AM - 11:00 AM
        {
          type: 'block',
          rangeMs: [1769439000000, 1769444400000],
          color: 'serious',
        },
        // Sun Jan 26 — 11:00 AM - 11:05 AM
        { type: 'spacer', rangeMs: [1769444400000, 1769444700000] },
        // Sun Jan 26 — 11:05 AM - 11:45 AM
        {
          type: 'block',
          rangeMs: [1769444700000, 1769447100000],
          color: 'critical',
        },

        // --- CANONICAL OVERLAP COPY (from ROWS) ---
        // Tue Jan 27 — 12:00 AM
        { type: 'bracket-open', timeMs: 1769472000000 },
        // Tue Jan 27 — 12:00 AM - 12:30 AM
        { type: 'spacer', rangeMs: [1769472000000, 1769473800000] },

        // Tue Jan 27 — 12:30 AM - 2:00 AM
        {
          type: 'block',
          rangeMs: [1769473800000, 1769479200000],
          color: 'serious',
        },
        // Tue Jan 27 — 2:00 AM - 2:05 AM
        { type: 'spacer', rangeMs: [1769479200000, 1769479500000] },
        // Tue Jan 27 — 2:05 AM - 2:45 AM
        {
          type: 'block',
          rangeMs: [1769479500000, 1769481900000],
          color: 'accent',
        },
        // Tue Jan 27 — 2:45 AM - 2:50 AM
        { type: 'spacer', rangeMs: [1769481900000, 1769482200000] },
        // Tue Jan 27 — 2:50 AM - 3:30 AM
        {
          type: 'block',
          rangeMs: [1769482200000, 1769484600000],
          color: 'critical',
        },

        // Tue Jan 27 — 3:30 AM - 4:00 AM
        { type: 'spacer', rangeMs: [1769484600000, 1769486400000] },
        // Tue Jan 27 — 4:00 AM
        { type: 'bracket-close', timeMs: 1769486400000 },

        // Tue Jan 27 — 4:10 AM
        { type: 'marker', timeMs: 1769487000000, color: 'accent' },

        // Tue Jan 27 — 4:15 AM
        { type: 'bracket-open', timeMs: 1769487300000 },
        // Tue Jan 27 — 4:15 AM - 7:30 AM
        {
          type: 'spacer',
          rangeMs: [1769487300000, 1769499000000],
          color: 'serious',
        },
        // Tue Jan 27 — 7:30 AM
        { type: 'marker', timeMs: 1769499000000, color: 'critical' },
        // Tue Jan 27 — 7:30 AM - 8:40 AM
        {
          type: 'spacer',
          rangeMs: [1769499000000, 1769503200000],
          color: 'accent',
        },
        // Tue Jan 27 — 8:40 AM
        { type: 'marker', timeMs: 1769503200000, color: 'serious' },
        // Tue Jan 27 — 8:40 AM - 10:30 AM
        { type: 'spacer', rangeMs: [1769503200000, 1769509800000] },

        // Tue Jan 27 — 10:30 AM - 12:00 PM
        {
          type: 'block',
          rangeMs: [1769509800000, 1769515200000],
          color: 'critical',
        },
        // Tue Jan 27 — 12:00 PM - 12:05 PM
        { type: 'spacer', rangeMs: [1769515200000, 1769515500000] },
        // Tue Jan 27 — 12:05 PM - 12:45 PM
        {
          type: 'block',
          rangeMs: [1769515500000, 1769517900000],
          color: 'serious',
        },
        // Tue Jan 27 — 12:45 PM - 12:50 PM
        { type: 'spacer', rangeMs: [1769517900000, 1769518200000] },
        // Tue Jan 27 — 12:50 PM - 1:20 PM
        {
          type: 'block',
          rangeMs: [1769518200000, 1769520000000],
          color: 'accent',
        },
      ],
    },

    {
      id: 'row-B',
      elements: [
        // Sat Jan 25 — 6:00 AM - 7:30 AM
        {
          type: 'block',
          rangeMs: [1769320800000, 1769326200000],
          color: 'accent',
        },
        // Sat Jan 25 — 7:30 AM - 7:40 AM
        {
          type: 'spacer',
          rangeMs: [1769326200000, 1769326800000],
          color: 'critical',
        },
        // Sat Jan 25 — 7:40 AM
        { type: 'marker', timeMs: 1769326800000, color: 'serious' },
        // Sat Jan 25 — 7:40 AM - 8:10 AM
        {
          type: 'spacer',
          rangeMs: [1769326800000, 1769328600000],
          color: 'critical',
        },
        // Sat Jan 25 — 8:10 AM - 9:00 AM
        {
          type: 'block',
          rangeMs: [1769328600000, 1769331600000],
          color: 'serious',
        },

        // --- CANONICAL OVERLAP COPY (from ROWS) ---
        // Tue Jan 27 — 2:00 AM - 4:00 AM
        {
          type: 'block',
          rangeMs: [1769479200000, 1769486400000],
          color: 'critical',
        },
        // Tue Jan 27 — 4:00 AM - 4:05 AM
        { type: 'spacer', rangeMs: [1769486400000, 1769486700000] },
        // Tue Jan 27 — 4:05 AM - 4:45 AM
        {
          type: 'block',
          rangeMs: [1769486700000, 1769489100000],
          color: 'accent',
        },
        // Tue Jan 27 — 4:45 AM - 4:50 AM
        { type: 'spacer', rangeMs: [1769489100000, 1769489400000] },
        // Tue Jan 27 — 4:50 AM - 5:20 AM
        {
          type: 'block',
          rangeMs: [1769489400000, 1769491200000],
          color: 'serious',
        },

        // Tue Jan 27 — 5:25 AM
        { type: 'bracket-open', timeMs: 1769491500000 },
        // Tue Jan 27 — 5:25 AM - 5:40 AM
        {
          type: 'spacer',
          rangeMs: [1769491500000, 1769492400000],
          color: 'critical',
        },
        // Tue Jan 27 — 5:40 AM
        { type: 'marker', timeMs: 1769492400000, color: 'accent' },
        // Tue Jan 27 — 5:40 AM - 6:00 AM
        { type: 'spacer', rangeMs: [1769492400000, 1769493600000] },

        // Tue Jan 27 — 6:00 AM - 8:00 AM
        {
          type: 'block',
          rangeMs: [1769493600000, 1769500800000],
          color: 'serious',
        },
        // Tue Jan 27 — 8:00 AM - 8:05 AM
        { type: 'spacer', rangeMs: [1769500800000, 1769501100000] },
        // Tue Jan 27 — 8:05 AM - 8:40 AM
        {
          type: 'block',
          rangeMs: [1769501100000, 1769503200000],
          color: 'critical',
        },

        // Tue Jan 27 — 8:40 AM - 9:10 AM
        { type: 'spacer', rangeMs: [1769503200000, 1769505000000] },
        // Tue Jan 27 — 9:10 AM
        { type: 'bracket-close', timeMs: 1769505000000 },
      ],
    },

    {
      id: 'row-C',
      elements: [
        // Sun Jan 26 — 12:00 AM
        { type: 'bracket-open', timeMs: 1769385600000, color: 'serious' },
        // Sun Jan 26 — 12:00 AM - 12:45 AM
        {
          type: 'spacer',
          rangeMs: [1769385600000, 1769388300000],
          color: 'serious',
        },
        // Sun Jan 26 — 12:45 AM
        { type: 'marker', timeMs: 1769388300000, color: 'accent' },
        // Sun Jan 26 — 12:45 AM - 1:30 AM
        {
          type: 'spacer',
          rangeMs: [1769388300000, 1769391000000],
          color: 'serious',
        },
        // Sun Jan 26 — 1:30 AM - 3:00 AM
        {
          type: 'block',
          rangeMs: [1769391000000, 1769396400000],
          color: 'critical',
        },
        // Sun Jan 26 — 3:00 AM
        { type: 'bracket-close', timeMs: 1769396400000, color: 'serious' },

        // --- CANONICAL OVERLAP COPY (from ROWS) ---
        // Tue Jan 27 — 5:30 AM - 7:00 AM
        {
          type: 'block',
          rangeMs: [1769491800000, 1769497200000],
          color: 'accent',
        },
        // Tue Jan 27 — 7:00 AM - 7:05 AM
        { type: 'spacer', rangeMs: [1769497200000, 1769497500000] },
        // Tue Jan 27 — 7:05 AM - 7:35 AM
        {
          type: 'block',
          rangeMs: [1769497500000, 1769499300000],
          color: 'critical',
        },

        // Tue Jan 27 — 3:00 PM - 6:00 PM
        {
          type: 'block',
          rangeMs: [1769526000000, 1769536800000],
          color: 'serious',
        },
        // Tue Jan 27 — 6:00 PM - 6:05 PM
        { type: 'spacer', rangeMs: [1769536800000, 1769537100000] },
        // Tue Jan 27 — 6:05 PM - 6:45 PM
        {
          type: 'block',
          rangeMs: [1769537100000, 1769539500000],
          color: 'accent',
        },

        // Tue Jan 27 — 6:45 PM - 6:46 PM
        { type: 'spacer', rangeMs: [1769539500000, 1769540160000] },
        // Tue Jan 27 — 6:46 PM
        { type: 'bracket-close', timeMs: 1769540160000 },

        // Tue Jan 27 — 6:50 PM
        { type: 'bracket-open', timeMs: 1769540400000 },
        // Tue Jan 27 — 6:50 PM - Wed Jan 28 1:46 AM
        {
          type: 'spacer',
          rangeMs: [1769540400000, 1769564000000],
          color: 'critical',
        },
        // Wed Jan 28 — 1:46 AM
        { type: 'marker', timeMs: 1769564000000, color: 'serious' },
        // Wed Jan 28 — 1:46 AM - Wed Jan 28 12:26 PM
        {
          type: 'spacer',
          rangeMs: [1769564000000, 1769600000000],
          color: 'accent',
        },
      ],
    },

    {
      id: 'row-D',
      elements: [
        // Sat Jan 25 — 12:00 PM - 1:30 PM
        {
          type: 'block',
          rangeMs: [1769342400000, 1769347800000],
          color: 'critical',
        },
        // Sat Jan 25 — 1:30 PM - 1:40 PM
        {
          type: 'spacer',
          rangeMs: [1769347800000, 1769348400000],
          color: 'accent',
        },
        // Sat Jan 25 — 1:40 PM
        { type: 'marker', timeMs: 1769348400000, color: 'serious' },
        // Sat Jan 25 — 1:40 PM - 2:10 PM
        {
          type: 'spacer',
          rangeMs: [1769348400000, 1769350200000],
          color: 'accent',
        },
        // Sat Jan 25 — 2:10 PM - 3:00 PM
        {
          type: 'block',
          rangeMs: [1769350200000, 1769353200000],
          color: 'serious',
        },

        // --- CANONICAL OVERLAP COPY (from ROWS) ---
        // Wed Jan 28 — 1:00 AM - 4:00 AM
        {
          type: 'block',
          rangeMs: [1769562000000, 1769572800000],
          color: 'serious',
        },
        // Wed Jan 28 — 4:00 AM - 4:05 AM
        { type: 'spacer', rangeMs: [1769572800000, 1769573100000] },
        // Wed Jan 28 — 4:05 AM - 4:45 AM
        {
          type: 'block',
          rangeMs: [1769573100000, 1769575500000],
          color: 'accent',
        },

        // Wed Jan 28 — 5:10 AM
        { type: 'bracket-open', timeMs: 1769577000000 },
        // Wed Jan 28 — 5:10 AM - 7:00 AM
        {
          type: 'spacer',
          rangeMs: [1769577000000, 1769583600000],
          color: 'critical',
        },
        // Wed Jan 28 — 7:00 AM
        { type: 'marker', timeMs: 1769583600000, color: 'serious' },
        // Wed Jan 28 — 7:00 AM - 10:00 AM
        { type: 'spacer', rangeMs: [1769583600000, 1769594400000] },
      ],
    },

    {
      id: 'row-E',
      elements: [
        // Sun Jan 26 — 6:00 PM
        { type: 'marker', timeMs: 1769450400000, color: 'serious' },

        // --- CANONICAL OVERLAP COPY (from ROWS) ---
        // Tue Jan 27 — 9:00 AM - 10:00 AM
        {
          type: 'block',
          rangeMs: [1769504400000, 1769508000000],
          color: 'critical',
        },
        // Tue Jan 27 — 10:00 AM - 10:05 AM
        { type: 'spacer', rangeMs: [1769508000000, 1769508300000] },
        // Tue Jan 27 — 10:05 AM - 10:45 AM
        {
          type: 'block',
          rangeMs: [1769508300000, 1769510700000],
          color: 'serious',
        },

        // Tue Jan 27 — 6:39 PM
        { type: 'bracket-open', timeMs: 1769539980000, color: 'accent' },
        // Tue Jan 27 — 6:39 PM - 8:00 PM
        {
          type: 'spacer',
          rangeMs: [1769539980000, 1769544000000],
          color: 'accent',
        },
        // Tue Jan 27 — 8:00 PM
        { type: 'bracket-close', timeMs: 1769544000000, color: 'accent' },

        // Wed Jan 28 — 12:00 AM
        { type: 'marker', timeMs: 1769562000000, color: 'critical' },
      ],
    },

    {
      id: 'row-F',
      elements: [
        // Sat Jan 25 — 9:00 PM - 10:30 PM
        {
          type: 'block',
          rangeMs: [1769374800000, 1769380200000],
          color: 'accent',
        },
        // Sat Jan 25 — 10:30 PM - 10:40 PM
        {
          type: 'spacer',
          rangeMs: [1769380200000, 1769380800000],
          color: 'critical',
        },
        // Sat Jan 25 — 10:40 PM
        { type: 'marker', timeMs: 1769380800000, color: 'serious' },
        // Sat Jan 25 — 10:40 PM - 11:10 PM
        {
          type: 'spacer',
          rangeMs: [1769380800000, 1769382600000],
          color: 'critical',
        },

        // --- CANONICAL OVERLAP COPY (from ROWS) ---
        // Tue Jan 27 — 6:00 PM - 8:00 PM
        {
          type: 'block',
          rangeMs: [1769536800000, 1769544000000],
          color: 'accent',
        },
        // Tue Jan 27 — 8:00 PM - 8:05 PM
        { type: 'spacer', rangeMs: [1769544000000, 1769544300000] },
        // Tue Jan 27 — 8:05 PM - 8:45 PM
        {
          type: 'block',
          rangeMs: [1769544300000, 1769546700000],
          color: 'critical',
        },

        // Tue Jan 27 — 11:20 PM
        { type: 'bracket-open', timeMs: 1769556000000, color: 'serious' },
        // Tue Jan 27 — 11:20 PM - 11:40 PM
        {
          type: 'spacer',
          rangeMs: [1769556000000, 1769557200000],
          color: 'serious',
        },
        // Tue Jan 27 — 11:40 PM
        { type: 'marker', timeMs: 1769557200000, color: 'critical' },
        // Tue Jan 27 — 11:40 PM - Wed Jan 28 12:10 AM
        {
          type: 'spacer',
          rangeMs: [1769557200000, 1769559000000],
          color: 'serious',
        },
        // Wed Jan 28 — 12:10 AM
        { type: 'bracket-close', timeMs: 1769559000000, color: 'serious' },

        // Wed Jan 28 — 5:30 AM - 7:30 AM
        {
          type: 'block',
          rangeMs: [1769578200000, 1769585400000],
          color: 'serious',
        },
        // Wed Jan 28 — 7:30 AM - 7:35 AM
        { type: 'spacer', rangeMs: [1769585400000, 1769585700000] },
        // Wed Jan 28 — 7:35 AM - 8:15 AM
        {
          type: 'block',
          rangeMs: [1769585700000, 1769588100000],
          color: 'accent',
        },
      ],
    },

    {
      id: 'row-G',
      elements: [
        // Sun Jan 26 — 3:00 AM - 4:00 AM
        {
          type: 'block',
          rangeMs: [1769396400000, 1769400000000],
          color: 'critical',
        },

        // --- CANONICAL OVERLAP COPY (from ROWS) ---
        // Tue Jan 27 — 12:00 AM - 12:45 AM
        {
          type: 'block',
          rangeMs: [1769472000000, 1769474700000],
          color: 'serious',
        },
        // Tue Jan 27 — 12:45 AM - 12:50 AM
        { type: 'spacer', rangeMs: [1769474700000, 1769475000000] },
        // Tue Jan 27 — 12:50 AM - 1:20 AM
        {
          type: 'block',
          rangeMs: [1769475000000, 1769476800000],
          color: 'critical',
        },

        // Tue Jan 27 — 2:00 AM
        { type: 'bracket-open', timeMs: 1769479200000 },
        // Tue Jan 27 — 2:00 AM - Tue Jan 27 6:40 PM
        {
          type: 'spacer',
          rangeMs: [1769479200000, 1769540000000],
          color: 'accent',
        },
        // Tue Jan 27 — 6:40 PM
        { type: 'marker', timeMs: 1769540000000, color: 'serious' },
        // Tue Jan 27 — 6:40 PM - Wed Jan 28 6:00 AM
        {
          type: 'spacer',
          rangeMs: [1769540000000, 1769580000000],
          color: 'critical',
        },
        // Wed Jan 28 — 6:00 AM
        { type: 'marker', timeMs: 1769580000000, color: 'accent' },
        // Wed Jan 28 — 6:00 AM - Wed Jan 28 12:30 PM
        { type: 'spacer', rangeMs: [1769580000000, 1769603400000] },
      ],
    },

    {
      id: 'row-H',
      elements: [
        // Sun Jan 26 — 8:00 PM - 9:30 PM
        {
          type: 'block',
          rangeMs: [1769462400000, 1769467800000],
          color: 'serious',
        },

        // --- CANONICAL OVERLAP COPY (from ROWS) ---
        // Tue Jan 27 — 4:30 AM - 5:15 AM
        {
          type: 'block',
          rangeMs: [1769488200000, 1769490900000],
          color: 'critical',
        },
        // Tue Jan 27 — 5:15 AM - 5:20 AM
        { type: 'spacer', rangeMs: [1769490900000, 1769491200000] },
        // Tue Jan 27 — 5:20 AM - 5:50 AM
        {
          type: 'block',
          rangeMs: [1769491200000, 1769493000000],
          color: 'accent',
        },

        // Tue Jan 27 — 6:00 AM
        { type: 'bracket-open', timeMs: 1769493600000 },
        // Tue Jan 27 — 6:00 AM - 8:10 AM
        {
          type: 'spacer',
          rangeMs: [1769493600000, 1769502000000],
          color: 'serious',
        },
        // Tue Jan 27 — 8:10 AM
        { type: 'marker', timeMs: 1769502000000, color: 'critical' },
        // Tue Jan 27 — 8:10 AM - 12:00 PM
        { type: 'spacer', rangeMs: [1769502000000, 1769515200000] },

        // Tue Jan 27 — 12:00 PM - 2:30 PM
        {
          type: 'block',
          rangeMs: [1769515200000, 1769524200000],
          color: 'serious',
        },
        // Tue Jan 27 — 2:30 PM - 2:35 PM
        { type: 'spacer', rangeMs: [1769524200000, 1769524500000] },
        // Tue Jan 27 — 2:35 PM - 3:15 PM
        {
          type: 'block',
          rangeMs: [1769524500000, 1769526900000],
          color: 'accent',
        },
      ],
    },

    {
      id: 'row-I',
      elements: [
        // Sun Jan 26 — 6:00 AM - 7:30 AM
        {
          type: 'block',
          rangeMs: [1769407200000, 1769412600000],
          color: 'accent',
        },

        // --- CANONICAL OVERLAP COPY (from ROWS) ---
        // Tue Jan 27 — 8:00 PM - 10:00 PM
        {
          type: 'block',
          rangeMs: [1769544000000, 1769551200000],
          color: 'accent',
        },
        // Tue Jan 27 — 10:00 PM - 10:05 AM
        { type: 'spacer', rangeMs: [1769551200000, 1769551500000] },
        // Tue Jan 27 — 10:05 PM - 10:45 PM
        {
          type: 'block',
          rangeMs: [1769551500000, 1769553900000],
          color: 'critical',
        },

        // Tue Jan 27 — 11:06 PM
        { type: 'bracket-open', timeMs: 1769559960000, color: 'serious' },
        // Tue Jan 27 — 11:06 PM - Wed Jan 28 12:00 AM
        {
          type: 'spacer',
          rangeMs: [1769559960000, 1769562000000],
          color: 'serious',
        },
        // Wed Jan 28 — 12:00 AM
        { type: 'bracket-close', timeMs: 1769562000000, color: 'serious' },

        // Wed Jan 28 — 4:30 AM - 6:00 AM
        {
          type: 'block',
          rangeMs: [1769574600000, 1769580000000],
          color: 'serious',
        },
        // Wed Jan 28 — 6:00 AM - 6:05 AM
        { type: 'spacer', rangeMs: [1769580000000, 1769580300000] },
        // Wed Jan 28 — 6:05 AM - 6:45 AM
        {
          type: 'block',
          rangeMs: [1769580300000, 1769582700000],
          color: 'accent',
        },

        // Wed Jan 28 — 7:00 AM
        { type: 'bracket-open', timeMs: 1769583600000 },
        // Wed Jan 28 — 7:00 AM - 1:20 PM
        {
          type: 'spacer',
          rangeMs: [1769583600000, 1769608000000],
          color: 'critical',
        },
      ],
    },

    {
      id: 'row-J',
      elements: [
        // Sat Jan 25 — 2:00 PM
        { type: 'marker', timeMs: 1769352000000, color: 'critical' },

        // --- CANONICAL OVERLAP COPY (from ROWS) ---
        // Tue Jan 27 — 1:00 AM - 1:45 AM
        {
          type: 'block',
          rangeMs: [1769475600000, 1769478300000],
          color: 'critical',
        },
        // Tue Jan 27 — 1:45 AM - 1:50 AM
        { type: 'spacer', rangeMs: [1769478300000, 1769478600000] },
        // Tue Jan 27 — 1:50 AM - 2:20 AM
        {
          type: 'block',
          rangeMs: [1769478600000, 1769480400000],
          color: 'accent',
        },

        // Tue Jan 27 — 8:15 AM - 9:00 AM
        {
          type: 'block',
          rangeMs: [1769501700000, 1769504400000],
          color: 'serious',
        },
        // Tue Jan 27 — 9:00 AM - 9:05 AM
        { type: 'spacer', rangeMs: [1769504400000, 1769504700000] },
        // Tue Jan 27 — 9:05 AM - 9:40 AM
        {
          type: 'block',
          rangeMs: [1769504700000, 1769506800000],
          color: 'critical',
        },

        // Tue Jan 27 — 9:40 PM
        { type: 'bracket-open', timeMs: 1769550000000, color: 'accent' },
        // Tue Jan 27 — 9:40 PM - 10:00 PM
        {
          type: 'spacer',
          rangeMs: [1769550000000, 1769551200000],
          color: 'accent',
        },
        // Tue Jan 27 — 10:00 PM
        { type: 'marker', timeMs: 1769551200000, color: 'serious' },
        // Tue Jan 27 — 10:00 PM - 10:30 PM
        {
          type: 'spacer',
          rangeMs: [1769551200000, 1769553000000],
          color: 'accent',
        },
        // Tue Jan 27 — 10:30 PM
        { type: 'bracket-close', timeMs: 1769553000000, color: 'accent' },

        // Wed Jan 28 — 12:00 PM - 1:30 PM
        {
          type: 'block',
          rangeMs: [1769601600000, 1769607000000],
          color: 'accent',
        },
        // Wed Jan 28 — 1:30 PM - 1:35 PM
        { type: 'spacer', rangeMs: [1769607000000, 1769607300000] },
        // Wed Jan 28 — 1:35 PM - 2:15 PM
        {
          type: 'block',
          rangeMs: [1769607300000, 1769609700000],
          color: 'serious',
        },
      ],
    },

    {
      id: 'row-K',
      elements: [
        // Sun Jan 26 — 1:00 PM - 2:30 PM
        {
          type: 'block',
          rangeMs: [1769449200000, 1769454600000],
          color: 'critical',
        },

        // --- CANONICAL OVERLAP COPY (from ROWS) ---
        // Tue Jan 27 — 3:30 AM - 5:00 AM
        {
          type: 'block',
          rangeMs: [1769484600000, 1769490000000],
          color: 'serious',
        },
        // Tue Jan 27 — 5:00 AM - 5:05 AM
        { type: 'spacer', rangeMs: [1769490000000, 1769490300000] },
        // Tue Jan 27 — 5:05 AM - 5:35 AM
        {
          type: 'block',
          rangeMs: [1769490300000, 1769492100000],
          color: 'critical',
        },

        // Tue Jan 27 — 6:00 AM
        { type: 'bracket-open', timeMs: 1769493600000 },
        // Tue Jan 27 — 6:00 AM - 8:00 AM
        {
          type: 'spacer',
          rangeMs: [1769493600000, 1769500800000],
          color: 'accent',
        },
        // Tue Jan 27 — 8:00 AM
        { type: 'marker', timeMs: 1769500800000, color: 'critical' },
        // Tue Jan 27 — 8:00 AM - 11:00 AM
        { type: 'spacer', rangeMs: [1769500800000, 1769511600000] },

        // Tue Jan 27 — 11:00 AM - 12:00 PM
        {
          type: 'block',
          rangeMs: [1769511600000, 1769515200000],
          color: 'accent',
        },
        // Tue Jan 27 — 12:00 PM - 12:05 PM
        { type: 'spacer', rangeMs: [1769515200000, 1769515500000] },
        // Tue Jan 27 — 12:05 PM - 12:45 PM
        {
          type: 'block',
          rangeMs: [1769515500000, 1769517900000],
          color: 'serious',
        },

        // Wed Jan 28 — 6:00 AM - 7:00 AM
        {
          type: 'block',
          rangeMs: [1769580000000, 1769583600000],
          color: 'critical',
        },
        // Wed Jan 28 — 7:00 AM - 7:05 AM
        { type: 'spacer', rangeMs: [1769583600000, 1769583900000] },
        // Wed Jan 28 — 7:05 AM - 7:45 AM
        {
          type: 'block',
          rangeMs: [1769583900000, 1769586300000],
          color: 'accent',
        },
      ],
    },

    {
      id: 'row-L',
      elements: [
        // Sat Jan 25 — 5:00 AM
        { type: 'marker', timeMs: 1769317200000, color: 'accent' },

        // --- CANONICAL OVERLAP COPY (from ROWS) ---
        // Tue Jan 27 — 6:45 AM - 7:30 AM
        {
          type: 'block',
          rangeMs: [1769496300000, 1769499000000],
          color: 'accent',
        },
        // Tue Jan 27 — 7:30 AM - 7:35 AM
        { type: 'spacer', rangeMs: [1769499000000, 1769499300000] },
        // Tue Jan 27 — 7:35 AM - 8:05 AM
        {
          type: 'block',
          rangeMs: [1769499300000, 1769501100000],
          color: 'critical',
        },

        // Tue Jan 27 — 11:33 AM
        { type: 'bracket-open', timeMs: 1769511960000, color: 'serious' },
        // Tue Jan 27 — 11:33 AM - 11:53 AM
        {
          type: 'spacer',
          rangeMs: [1769511960000, 1769513200000],
          color: 'serious',
        },
        // Tue Jan 27 — 11:53 AM
        { type: 'marker', timeMs: 1769513200000, color: 'accent' },
        // Tue Jan 27 — 11:53 AM - 12:23 PM
        {
          type: 'spacer',
          rangeMs: [1769513200000, 1769514960000],
          color: 'serious',
        },
        // Tue Jan 27 — 12:23 PM
        { type: 'bracket-close', timeMs: 1769514960000, color: 'serious' },

        // Tue Jan 27 — 1:00 PM - 2:00 PM
        {
          type: 'block',
          rangeMs: [1769518800000, 1769522400000],
          color: 'critical',
        },
        // Tue Jan 27 — 2:00 PM - 2:05 PM
        { type: 'spacer', rangeMs: [1769522400000, 1769522700000] },
        // Tue Jan 27 — 2:05 PM - 2:45 PM
        {
          type: 'block',
          rangeMs: [1769522700000, 1769525100000],
          color: 'accent',
        },
      ],
    },

    {
      id: 'row-M',
      elements: [
        // Sun Jan 26 — 10:00 PM
        { type: 'bracket-open', timeMs: 1769464800000, color: 'serious' },
        // Sun Jan 26 — 10:00 PM - 10:15 PM
        {
          type: 'spacer',
          rangeMs: [1769464800000, 1769465700000],
          color: 'serious',
        },
        // Sun Jan 26 — 10:15 PM
        { type: 'marker', timeMs: 1769465700000, color: 'critical' },
        // Sun Jan 26 — 10:15 PM - 10:40 PM
        {
          type: 'spacer',
          rangeMs: [1769465700000, 1769467200000],
          color: 'serious',
        },
        // Sun Jan 26 — 10:40 PM
        { type: 'bracket-close', timeMs: 1769467200000, color: 'serious' },

        // --- CANONICAL OVERLAP COPY (from ROWS) ---
        // Tue Jan 27 — 12:45 AM - 1:30 AM
        {
          type: 'block',
          rangeMs: [1769474700000, 1769477400000],
          color: 'critical',
        },
        // Tue Jan 27 — 1:30 AM - 1:35 AM
        { type: 'spacer', rangeMs: [1769477400000, 1769477700000] },
        // Tue Jan 27 — 1:35 AM - 2:05 AM
        {
          type: 'block',
          rangeMs: [1769477700000, 1769479500000],
          color: 'accent',
        },

        // Tue Jan 27 — 2:30 AM
        { type: 'bracket-open', timeMs: 1769481000000 },
        // Tue Jan 27 — 2:30 AM - 7:46 AM
        {
          type: 'spacer',
          rangeMs: [1769481000000, 1769500000000],
          color: 'serious',
        },
        // Tue Jan 27 — 7:46 AM
        { type: 'marker', timeMs: 1769500000000, color: 'critical' },
        // Tue Jan 27 — 7:46 AM - 1:20 PM
        {
          type: 'spacer',
          rangeMs: [1769500000000, 1769520000000],
          color: 'accent',
        },
        // Tue Jan 27 — 1:20 PM
        { type: 'marker', timeMs: 1769520000000, color: 'serious' },
        // Tue Jan 27 — 1:20 PM - 4:00 PM
        { type: 'spacer', rangeMs: [1769520000000, 1769532000000] },

        // Tue Jan 27 — 4:00 PM - 5:30 PM
        {
          type: 'block',
          rangeMs: [1769532000000, 1769537400000],
          color: 'accent',
        },
        // Tue Jan 27 — 5:30 PM - 5:35 PM
        { type: 'spacer', rangeMs: [1769537400000, 1769537700000] },
        // Tue Jan 27 — 5:35 PM - 6:15 PM
        {
          type: 'block',
          rangeMs: [1769537700000, 1769540100000],
          color: 'critical',
        },

        // Wed Jan 28 — 7:00 AM - 8:30 AM
        {
          type: 'block',
          rangeMs: [1769583600000, 1769589000000],
          color: 'serious',
        },
      ],
    },

    {
      id: 'row-N',
      elements: [
        // Sat Jan 25 — 7:00 PM - 8:00 PM
        {
          type: 'block',
          rangeMs: [1769367600000, 1769371200000],
          color: 'serious',
        },

        // --- CANONICAL OVERLAP COPY (from ROWS) ---
        // Tue Jan 27 — 7:30 AM - 9:00 AM
        {
          type: 'block',
          rangeMs: [1769499000000, 1769504400000],
          color: 'accent',
        },
        // Tue Jan 27 — 9:00 AM - 9:05 AM
        { type: 'spacer', rangeMs: [1769504400000, 1769504700000] },
        // Tue Jan 27 — 9:05 AM - 9:45 AM
        {
          type: 'block',
          rangeMs: [1769504700000, 1769507100000],
          color: 'critical',
        },

        // Tue Jan 27 — 2:30 PM - 4:00 PM
        {
          type: 'block',
          rangeMs: [1769524200000, 1769529600000],
          color: 'serious',
        },
        // Tue Jan 27 — 4:00 PM - 4:05 PM
        { type: 'spacer', rangeMs: [1769529600000, 1769529900000] },
        // Tue Jan 27 — 4:05 PM - 4:45 PM
        {
          type: 'block',
          rangeMs: [1769529900000, 1769532300000],
          color: 'accent',
        },

        // Tue Jan 27 — 5:00 PM
        { type: 'bracket-open', timeMs: 1769533200000 },
        // Tue Jan 27 — 5:00 PM - Tue Jan 27 9:10 PM
        {
          type: 'spacer',
          rangeMs: [1769533200000, 1769550000000],
          color: 'critical',
        },
        // Tue Jan 27 — 9:10 PM
        { type: 'marker', timeMs: 1769550000000, color: 'serious' },
        // Tue Jan 27 — 9:10 PM - Wed Jan 28 2:00 AM
        { type: 'spacer', rangeMs: [1769550000000, 1769565600000] },

        // Wed Jan 28 — 2:00 AM - 3:30 AM
        {
          type: 'block',
          rangeMs: [1769565600000, 1769571000000],
          color: 'accent',
        },
      ],
    },
  ],
};

// Thu Jan 29, 2026 at 12:00 AM UTC
export const DATASET_JAN29_TO_FEB1_START_TIME_MS = 1769644800000;

// Sun Feb 1, 2026 at 8:00 AM UTC
export const DATASET_JAN29_TO_FEB1_END_TIME_MS = 1769932800000;

export const DATASET_JAN29_TO_FEB1: Dataset = {
  startTimeMs: DATASET_JAN29_TO_FEB1_START_TIME_MS,
  endTimeMs: DATASET_JAN29_TO_FEB1_END_TIME_MS,
  rows: [
    {
      id: 'row-A',
      elements: [
        // --- OVERLAP COPY (from Jan 27–30 dataset) ---
        // Thu Jan 29 — 7:30 AM - 9:00 AM
        {
          type: 'block',
          rangeMs: [1769679000000, 1769684400000],
          color: 'accent',
        },
        // Thu Jan 29 — 9:00 AM - 9:05 AM
        { type: 'spacer', rangeMs: [1769684400000, 1769684700000] },
        // Thu Jan 29 — 9:05 AM - 9:40 AM
        {
          type: 'block',
          rangeMs: [1769684700000, 1769687000000],
          color: 'critical',
        },

        // Thu Jan 29 — 11:00 AM
        { type: 'bracket-open', timeMs: 1769691600000, color: 'serious' },
        // Thu Jan 29 — 11:00 AM - 12:00 PM
        {
          type: 'spacer',
          rangeMs: [1769691600000, 1769695200000],
          color: 'serious',
        },
        // Thu Jan 29 — 12:00 PM
        { type: 'bracket-close', timeMs: 1769695200000, color: 'serious' },

        // Thu Jan 29 — 11:30 PM - Fri Jan 30 12:30 AM
        {
          type: 'block',
          rangeMs: [1769722200000, 1769725800000],
          color: 'serious',
        },
        // Fri Jan 30 — 12:30 AM - 12:35 AM
        { type: 'spacer', rangeMs: [1769725800000, 1769726100000] },
        // Fri Jan 30 — 12:35 AM - 1:10 AM
        {
          type: 'block',
          rangeMs: [1769726100000, 1769728200000],
          color: 'accent',
        },

        // Fri Jan 30 — 2:30 PM - 4:00 PM
        {
          type: 'block',
          rangeMs: [1769783400000, 1769788800000],
          color: 'accent',
        },
        // Fri Jan 30 — 4:00 PM - 4:05 PM
        { type: 'spacer', rangeMs: [1769788800000, 1769789100000] },
        // Fri Jan 30 — 4:05 PM - 4:45 PM
        {
          type: 'block',
          rangeMs: [1769789100000, 1769791500000],
          color: 'critical',
        },

        // Fri Jan 30 — 5:10 PM
        { type: 'bracket-open', timeMs: 1769793000000 },
        // Fri Jan 30 — 5:10 PM - 7:40 PM
        {
          type: 'spacer',
          rangeMs: [1769793000000, 1769802000000],
          color: 'serious',
        },
        // Fri Jan 30 — 7:40 PM
        { type: 'marker', timeMs: 1769802000000, color: 'accent' },
        // Fri Jan 30 — 7:40 PM - 9:20 PM
        {
          type: 'spacer',
          rangeMs: [1769802000000, 1769808000000],
          color: 'serious',
        },
        // Fri Jan 30 — 9:20 PM
        { type: 'marker', timeMs: 1769808000000, color: 'critical' },
        // Fri Jan 30 — 9:20 PM - 11:30 PM
        {
          type: 'spacer',
          rangeMs: [1769808000000, 1769815800000],
          color: 'serious',
        },
        // Fri Jan 30 — 11:30 PM
        { type: 'bracket-close', timeMs: 1769815800000 },

        // --- GENERATED COPY OF Jan 27/28 PATTERN SHIFTED +4 DAYS ---
        // Sat Jan 31 — 12:00 AM
        { type: 'bracket-open', timeMs: 1769817600000 },
        // Sat Jan 31 — 12:00 AM - 12:30 AM
        { type: 'spacer', rangeMs: [1769817600000, 1769819400000] },

        // Sat Jan 31 — 12:30 AM - 2:00 AM
        {
          type: 'block',
          rangeMs: [1769819400000, 1769824800000],
          color: 'serious',
        },
        // Sat Jan 31 — 2:00 AM - 2:05 AM
        { type: 'spacer', rangeMs: [1769824800000, 1769825100000] },
        // Sat Jan 31 — 2:05 AM - 2:45 AM
        {
          type: 'block',
          rangeMs: [1769825100000, 1769827500000],
          color: 'accent',
        },
        // Sat Jan 31 — 2:45 AM - 2:50 AM
        { type: 'spacer', rangeMs: [1769827500000, 1769827800000] },
        // Sat Jan 31 — 2:50 AM - 3:30 AM
        {
          type: 'block',
          rangeMs: [1769827800000, 1769830200000],
          color: 'critical',
        },

        // Sat Jan 31 — 3:30 AM - 4:00 AM
        { type: 'spacer', rangeMs: [1769830200000, 1769832000000] },
        // Sat Jan 31 — 4:00 AM
        { type: 'bracket-close', timeMs: 1769832000000 },

        // Sat Jan 31 — 4:10 AM
        { type: 'marker', timeMs: 1769832600000, color: 'accent' },

        // Sat Jan 31 — 4:15 AM
        { type: 'bracket-open', timeMs: 1769832900000 },
        // Sat Jan 31 — 4:15 AM - 7:30 AM
        {
          type: 'spacer',
          rangeMs: [1769832900000, 1769844600000],
          color: 'serious',
        },
        // Sat Jan 31 — 7:30 AM
        { type: 'marker', timeMs: 1769844600000, color: 'critical' },
        // Sat Jan 31 — 7:30 AM - 8:40 AM
        {
          type: 'spacer',
          rangeMs: [1769844600000, 1769848800000],
          color: 'accent',
        },
        // Sat Jan 31 — 8:40 AM
        { type: 'marker', timeMs: 1769848800000, color: 'serious' },
        // Sat Jan 31 — 8:40 AM - 10:30 AM
        { type: 'spacer', rangeMs: [1769848800000, 1769855400000] },

        // Sat Jan 31 — 10:30 AM - 12:00 PM
        {
          type: 'block',
          rangeMs: [1769855400000, 1769860800000],
          color: 'critical',
        },
        // Sat Jan 31 — 12:00 PM - 12:05 PM
        { type: 'spacer', rangeMs: [1769860800000, 1769861100000] },
        // Sat Jan 31 — 12:05 PM - 12:45 PM
        {
          type: 'block',
          rangeMs: [1769861100000, 1769863500000],
          color: 'serious',
        },
        // Sat Jan 31 — 12:45 PM - 12:50 PM
        { type: 'spacer', rangeMs: [1769863500000, 1769863800000] },
        // Sat Jan 31 — 12:50 PM - 1:20 PM
        {
          type: 'block',
          rangeMs: [1769863800000, 1769865600000],
          color: 'accent',
        },

        // Sun Feb 1 — 2:00 PM - 4:30 PM
        {
          type: 'block',
          rangeMs: [1769964000000, 1769973000000],
          color: 'critical',
        },
        // Sun Feb 1 — 4:30 PM - 4:35 PM
        { type: 'spacer', rangeMs: [1769973000000, 1769973300000] },
        // Sun Feb 1 — 4:35 PM - 5:15 PM
        {
          type: 'block',
          rangeMs: [1769973300000, 1769975700000],
          color: 'accent',
        },
        // Sun Feb 1 — 5:15 PM - 5:20 PM
        { type: 'spacer', rangeMs: [1769975700000, 1769976000000] },
        // Sun Feb 1 — 5:20 PM - 6:00 PM
        {
          type: 'block',
          rangeMs: [1769976000000, 1769978400000],
          color: 'serious',
        },
      ],
    },

    {
      id: 'row-B',
      elements: [
        // --- OVERLAP COPY ---
        // Thu Jan 29 — 1:00 PM - 4:00 PM
        {
          type: 'block',
          rangeMs: [1769691600000, 1769702400000],
          color: 'critical',
        },
        // Thu Jan 29 — 4:00 PM - 4:05 PM
        { type: 'spacer', rangeMs: [1769702400000, 1769702700000] },
        // Thu Jan 29 — 4:05 PM - 4:45 PM
        {
          type: 'block',
          rangeMs: [1769702700000, 1769705100000],
          color: 'accent',
        },

        // Fri Jan 30 — 1:00 PM - 3:00 PM
        {
          type: 'block',
          rangeMs: [1769781600000, 1769788800000],
          color: 'critical',
        },
        // Fri Jan 30 — 3:00 PM - 3:05 PM
        { type: 'spacer', rangeMs: [1769788800000, 1769789100000] },
        // Fri Jan 30 — 3:05 PM - 3:45 PM
        {
          type: 'block',
          rangeMs: [1769789100000, 1769791500000],
          color: 'accent',
        },

        // Fri Jan 30 — 10:40 PM
        { type: 'bracket-open', timeMs: 1769812800000, color: 'serious' },
        // Fri Jan 30 — 10:40 PM - 11:30 PM
        {
          type: 'spacer',
          rangeMs: [1769812800000, 1769815800000],
          color: 'serious',
        },
        // Fri Jan 30 — 11:30 PM
        { type: 'bracket-close', timeMs: 1769815800000, color: 'serious' },

        // --- GENERATED COPY OF Jan 27/28 PATTERN SHIFTED +4 DAYS ---
        // Sat Jan 31 — 2:00 AM - 4:00 AM
        {
          type: 'block',
          rangeMs: [1769824800000, 1769832000000],
          color: 'critical',
        },
        // Sat Jan 31 — 4:00 AM - 4:05 AM
        { type: 'spacer', rangeMs: [1769832000000, 1769832300000] },
        // Sat Jan 31 — 4:05 AM - 4:45 AM
        {
          type: 'block',
          rangeMs: [1769832300000, 1769834700000],
          color: 'accent',
        },
        // Sat Jan 31 — 4:45 AM - 4:50 AM
        { type: 'spacer', rangeMs: [1769834700000, 1769835000000] },
        // Sat Jan 31 — 4:50 AM - 5:20 AM
        {
          type: 'block',
          rangeMs: [1769835000000, 1769836800000],
          color: 'serious',
        },

        // Sat Jan 31 — 5:25 AM
        { type: 'bracket-open', timeMs: 1769837100000 },
        // Sat Jan 31 — 5:25 AM - 5:40 AM
        {
          type: 'spacer',
          rangeMs: [1769837100000, 1769838000000],
          color: 'critical',
        },
        // Sat Jan 31 — 5:40 AM
        { type: 'marker', timeMs: 1769838000000, color: 'accent' },
        // Sat Jan 31 — 5:40 AM - 6:00 AM
        { type: 'spacer', rangeMs: [1769838000000, 1769839200000] },

        // Sat Jan 31 — 6:00 AM - 8:00 AM
        {
          type: 'block',
          rangeMs: [1769839200000, 1769846400000],
          color: 'serious',
        },
        // Sat Jan 31 — 8:00 AM - 8:05 AM
        { type: 'spacer', rangeMs: [1769846400000, 1769846700000] },
        // Sat Jan 31 — 8:05 AM - 8:40 AM
        {
          type: 'block',
          rangeMs: [1769846700000, 1769848800000],
          color: 'critical',
        },

        // Sat Jan 31 — 8:40 AM - 9:10 AM
        { type: 'spacer', rangeMs: [1769848800000, 1769850600000] },
        // Sat Jan 31 — 9:10 AM
        { type: 'bracket-close', timeMs: 1769850600000 },

        // Sun Feb 1 — 9:00 AM - 11:00 AM
        {
          type: 'block',
          rangeMs: [1769936400000, 1769943600000],
          color: 'accent',
        },
        // Sun Feb 1 — 11:00 AM - 11:05 AM
        { type: 'spacer', rangeMs: [1769943600000, 1769943900000] },
        // Sun Feb 1 — 11:05 AM - 11:40 AM
        {
          type: 'block',
          rangeMs: [1769943900000, 1769946000000],
          color: 'serious',
        },

        // Sun Feb 1 — 10:40 PM
        { type: 'bracket-open', timeMs: 1769985600000, color: 'critical' },
        // Sun Feb 1 — 10:40 PM - 11:30 PM
        {
          type: 'spacer',
          rangeMs: [1769985600000, 1769988600000],
          color: 'critical',
        },
        // Sun Feb 1 — 11:30 PM
        { type: 'bracket-close', timeMs: 1769988600000, color: 'critical' },
      ],
    },

    {
      id: 'row-C',
      elements: [
        // Wed Jan 28 — 11:30 PM - Thu Jan 29 2:30 AM
        {
          type: 'block',
          rangeMs: [1769643000000, 1769653800000],
          color: 'serious',
        },
        // Thu Jan 29 — 2:30 AM - 2:35 AM
        { type: 'spacer', rangeMs: [1769653800000, 1769654100000] },
        // Thu Jan 29 — 2:35 AM - 3:15 AM
        {
          type: 'block',
          rangeMs: [1769654100000, 1769656500000],
          color: 'accent',
        },
        // Thu Jan 29 — 10:00 AM
        { type: 'bracket-open', timeMs: 1769700000000, color: 'serious' },
        // Thu Jan 29 — 10:00 AM - 10:40 AM
        {
          type: 'spacer',
          rangeMs: [1769700000000, 1769702400000],
          color: 'serious',
        },
        // Thu Jan 29 — 10:40 AM
        { type: 'bracket-close', timeMs: 1769702400000, color: 'serious' },

        // Fri Jan 30 — 4:00 AM - 8:00 AM
        {
          type: 'block',
          rangeMs: [1769745600000, 1769760000000],
          color: 'critical',
        },

        // Fri Jan 30 — 10:00 AM - 11:30 AM
        {
          type: 'block',
          rangeMs: [1769776800000, 1769782200000],
          color: 'accent',
        },
        // Fri Jan 30 — 11:30 AM - 11:35 AM
        { type: 'spacer', rangeMs: [1769782200000, 1769782500000] },
        // Fri Jan 30 — 11:35 AM - 12:15 PM
        {
          type: 'block',
          rangeMs: [1769782500000, 1769784900000],
          color: 'critical',
        },

        // Fri Jan 30 — 6:00 PM
        { type: 'bracket-open', timeMs: 1769804000000 },
        // Fri Jan 30 — 6:00 PM - 11:20 PM
        {
          type: 'spacer',
          rangeMs: [1769804000000, 1769815200000],
          color: 'serious',
        },
        // Fri Jan 30 — 11:20 PM
        { type: 'bracket-close', timeMs: 1769815200000 },

        // --- GENERATED COPY OF Jan 27/28 PATTERN SHIFTED +4 DAYS ---
        // Sat Jan 31 — 5:30 AM - 7:00 AM
        {
          type: 'block',
          rangeMs: [1769837400000, 1769842800000],
          color: 'accent',
        },
        // Sat Jan 31 — 7:00 AM - 7:05 AM
        { type: 'spacer', rangeMs: [1769842800000, 1769843100000] },
        // Sat Jan 31 — 7:05 AM - 7:35 AM
        {
          type: 'block',
          rangeMs: [1769843100000, 1769844900000],
          color: 'critical',
        },

        // Sat Jan 31 — 3:00 PM - 6:00 PM
        {
          type: 'block',
          rangeMs: [1769871600000, 1769882400000],
          color: 'serious',
        },
        // Sat Jan 31 — 6:00 PM - 6:05 PM
        { type: 'spacer', rangeMs: [1769882400000, 1769882700000] },
        // Sat Jan 31 — 6:05 PM - 6:45 PM
        {
          type: 'block',
          rangeMs: [1769882700000, 1769885100000],
          color: 'accent',
        },

        // Sat Jan 31 — 6:45 PM - 6:46 PM
        { type: 'spacer', rangeMs: [1769885100000, 1769885760000] },
        // Sat Jan 31 — 6:46 PM
        { type: 'bracket-close', timeMs: 1769885760000 },

        // Sat Jan 31 — 6:50 PM
        { type: 'bracket-open', timeMs: 1769886000000 },
        // Sat Jan 31 — 6:50 PM - Sun Feb 1 1:46 AM
        {
          type: 'spacer',
          rangeMs: [1769886000000, 1769909600000],
          color: 'critical',
        },
        // Sun Feb 1 — 1:46 AM
        { type: 'marker', timeMs: 1769909600000, color: 'serious' },
        // Sun Feb 1 — 1:46 AM - Sun Feb 1 12:26 PM
        {
          type: 'spacer',
          rangeMs: [1769909600000, 1769945600000],
          color: 'accent',
        },
      ],
    },

    {
      id: 'row-D',
      elements: [
        // --- OVERLAP COPY ---
        // Thu Jan 29 — 6:00 AM - 8:00 AM
        {
          type: 'block',
          rangeMs: [1769676000000, 1769683200000],
          color: 'serious',
        },
        // Thu Jan 29 — 8:00 AM - 8:05 AM
        { type: 'spacer', rangeMs: [1769683200000, 1769683500000] },
        // Thu Jan 29 — 8:05 AM - 8:45 AM
        {
          type: 'block',
          rangeMs: [1769683500000, 1769685900000],
          color: 'critical',
        },

        // Thu Jan 29 — 2:20 PM
        { type: 'bracket-open', timeMs: 1769706000000, color: 'accent' },
        // Thu Jan 29 — 2:20 PM - 2:50 PM
        {
          type: 'spacer',
          rangeMs: [1769706000000, 1769707800000],
          color: 'accent',
        },
        // Thu Jan 29 — 2:50 PM
        { type: 'bracket-close', timeMs: 1769707800000, color: 'accent' },

        // Thu Jan 29 — 10:00 PM - Fri Jan 30 1:00 AM
        {
          type: 'block',
          rangeMs: [1769724000000, 1769734800000],
          color: 'accent',
        },

        // Fri Jan 30 — 9:00 AM - 11:00 AM
        {
          type: 'block',
          rangeMs: [1769773200000, 1769780400000],
          color: 'serious',
        },
        // Fri Jan 30 — 11:00 AM - 11:05 AM
        { type: 'spacer', rangeMs: [1769780400000, 1769780700000] },
        // Fri Jan 30 — 11:05 AM - 11:45 AM
        {
          type: 'block',
          rangeMs: [1769780700000, 1769783100000],
          color: 'critical',
        },

        // Fri Jan 30 — 6:20 PM
        { type: 'bracket-open', timeMs: 1769805200000, color: 'accent' },
        // Fri Jan 30 — 6:20 PM - 6:50 PM
        {
          type: 'spacer',
          rangeMs: [1769805200000, 1769807000000],
          color: 'accent',
        },
        // Fri Jan 30 — 6:50 PM
        { type: 'bracket-close', timeMs: 1769807000000, color: 'accent' },

        // --- GENERATED COPY OF Jan 27/28 PATTERN SHIFTED +4 DAYS ---
        // Sun Feb 1 — 1:00 AM - 4:00 AM
        {
          type: 'block',
          rangeMs: [1769907600000, 1769918400000],
          color: 'serious',
        },
        // Sun Feb 1 — 4:00 AM - 4:05 AM
        { type: 'spacer', rangeMs: [1769918400000, 1769918700000] },
        // Sun Feb 1 — 4:05 AM - 4:45 AM
        {
          type: 'block',
          rangeMs: [1769918700000, 1769921100000],
          color: 'accent',
        },

        // Sun Feb 1 — 5:10 AM
        { type: 'bracket-open', timeMs: 1769922600000 },
        // Sun Feb 1 — 5:10 AM - 7:00 AM
        {
          type: 'spacer',
          rangeMs: [1769922600000, 1769929200000],
          color: 'critical',
        },
        // Sun Feb 1 — 7:00 AM
        { type: 'marker', timeMs: 1769929200000, color: 'serious' },
        // Sun Feb 1 — 7:00 AM - 10:00 AM
        { type: 'spacer', rangeMs: [1769929200000, 1769940000000] },
      ],
    },

    {
      id: 'row-E',
      elements: [
        // --- OVERLAP COPY ---
        // Thu Jan 29 — 4:30 PM - 6:30 PM
        {
          type: 'block',
          rangeMs: [1769704200000, 1769711400000],
          color: 'serious',
        },

        // Fri Jan 30 — 8:30 AM
        { type: 'marker', timeMs: 1769771400000, color: 'accent' },

        // Fri Jan 30 — 3:00 PM - 4:30 PM
        {
          type: 'block',
          rangeMs: [1769792400000, 1769797800000],
          color: 'serious',
        },
        // Fri Jan 30 — 4:30 PM - 4:35 PM
        { type: 'spacer', rangeMs: [1769797800000, 1769798100000] },
        // Fri Jan 30 — 4:35 PM - 5:15 PM
        {
          type: 'block',
          rangeMs: [1769798100000, 1769800500000],
          color: 'critical',
        },

        // Fri Jan 30 — 9:40 PM
        { type: 'bracket-open', timeMs: 1769809200000, color: 'serious' },
        // Fri Jan 30 — 9:40 PM - 10:40 PM
        {
          type: 'spacer',
          rangeMs: [1769809200000, 1769812800000],
          color: 'serious',
        },
        // Fri Jan 30 — 10:40 PM
        { type: 'bracket-close', timeMs: 1769812800000, color: 'serious' },

        // --- GENERATED COPY OF Jan 27/28 PATTERN SHIFTED +4 DAYS ---
        // Sat Jan 31 — 9:00 AM - 10:00 AM
        {
          type: 'block',
          rangeMs: [1769850000000, 1769853600000],
          color: 'critical',
        },
        // Sat Jan 31 — 10:00 AM - 10:05 AM
        { type: 'spacer', rangeMs: [1769853600000, 1769853900000] },
        // Sat Jan 31 — 10:05 AM - 10:45 AM
        {
          type: 'block',
          rangeMs: [1769853900000, 1769856300000],
          color: 'serious',
        },

        // Sat Jan 31 — 6:39 PM
        { type: 'bracket-open', timeMs: 1769885580000, color: 'accent' },
        // Sat Jan 31 — 6:39 PM - 8:00 PM
        {
          type: 'spacer',
          rangeMs: [1769885580000, 1769890400000],
          color: 'accent',
        },
        // Sat Jan 31 — 8:00 PM
        { type: 'bracket-close', timeMs: 1769890400000, color: 'accent' },

        // Sun Feb 1 — 12:00 AM
        { type: 'marker', timeMs: 1769907600000, color: 'critical' },
      ],
    },

    {
      id: 'row-F',
      elements: [
        // --- OVERLAP COPY ---
        // Wed Jan 28 — 5:20 PM - Thu Jan 29 4:26 AM
        {
          type: 'spacer',
          rangeMs: [1769620000000, 1769660000000],
          color: 'serious',
        },
        // Thu Jan 29 — 4:26 AM
        { type: 'marker', timeMs: 1769660000000, color: 'critical' },
        // Thu Jan 29 — 4:26 AM - Thu Jan 29 2:00 PM
        { type: 'spacer', rangeMs: [1769660000000, 1769688000000] },
        // Thu Jan 29 — 2:00 PM - 5:00 PM
        {
          type: 'block',
          rangeMs: [1769688000000, 1769698800000],
          color: 'accent',
        },
        // Thu Jan 29 — 5:00 PM - 5:05 PM
        { type: 'spacer', rangeMs: [1769698800000, 1769699100000] },
        // Thu Jan 29 — 5:05 PM - 5:45 PM
        {
          type: 'block',
          rangeMs: [1769699100000, 1769701500000],
          color: 'serious',
        },

        // Thu Jan 29 — 5:45 PM - 6:30 PM
        { type: 'spacer', rangeMs: [1769701500000, 1769704200000] },
        // Thu Jan 29 — 6:30 PM
        { type: 'bracket-close', timeMs: 1769704200000 },

        // Fri Jan 30 — 12:30 AM - 4:00 AM
        {
          type: 'block',
          rangeMs: [1769725800000, 1769738400000],
          color: 'critical',
        },

        // Fri Jan 30 — 8:30 AM
        { type: 'bracket-open', timeMs: 1769771400000 },
        // Fri Jan 30 — 8:30 AM - 2:20 PM
        {
          type: 'spacer',
          rangeMs: [1769771400000, 1769792400000],
          color: 'accent',
        },
        // Fri Jan 30 — 2:20 PM
        { type: 'marker', timeMs: 1769792400000, color: 'critical' },
        // Fri Jan 30 — 2:20 PM - 8:00 PM
        {
          type: 'spacer',
          rangeMs: [1769792400000, 1769812800000],
          color: 'serious',
        },
        // Fri Jan 30 — 8:00 PM
        { type: 'marker', timeMs: 1769812800000, color: 'accent' },
        // Fri Jan 30 — 8:00 PM - 11:30 PM
        {
          type: 'spacer',
          rangeMs: [1769812800000, 1769815800000],
          color: 'critical',
        },
        // Fri Jan 30 — 11:30 PM
        { type: 'bracket-close', timeMs: 1769815800000 },

        // Sat Jan 31 — 6:00 PM - 8:00 PM
        {
          type: 'block',
          rangeMs: [1769882400000, 1769889600000],
          color: 'accent',
        },
        // Sat Jan 31 — 8:00 PM - 8:05 PM
        { type: 'spacer', rangeMs: [1769889600000, 1769889900000] },
        // Sat Jan 31 — 8:05 PM - 8:45 PM
        {
          type: 'block',
          rangeMs: [1769889900000, 1769892300000],
          color: 'critical',
        },

        // Sat Jan 31 — 11:20 PM
        { type: 'bracket-open', timeMs: 1769895600000, color: 'serious' },
        // Sat Jan 31 — 11:20 PM - 11:40 PM
        {
          type: 'spacer',
          rangeMs: [1769895600000, 1769896800000],
          color: 'serious',
        },
        // Sat Jan 31 — 11:40 PM
        { type: 'marker', timeMs: 1769896800000, color: 'critical' },
        // Sat Jan 31 — 11:40 PM - Sun Feb 1 12:10 AM
        {
          type: 'spacer',
          rangeMs: [1769896800000, 1769898600000],
          color: 'serious',
        },
        // Sun Feb 1 — 12:10 AM
        { type: 'bracket-close', timeMs: 1769898600000, color: 'serious' },

        // Sun Feb 1 — 5:30 AM - 7:30 AM
        {
          type: 'block',
          rangeMs: [1769917800000, 1769925000000],
          color: 'serious',
        },
        // Sun Feb 1 — 7:30 AM - 7:35 AM
        { type: 'spacer', rangeMs: [1769925000000, 1769925300000] },
        // Sun Feb 1 — 7:35 AM - 8:15 AM
        {
          type: 'block',
          rangeMs: [1769925300000, 1769927700000],
          color: 'accent',
        },
      ],
    },

    {
      id: 'row-G',
      elements: [
        // --- OVERLAP COPY ---
        // Thu Jan 29 — 9:30 AM - 11:30 AM
        {
          type: 'block',
          rangeMs: [1769679000000, 1769686200000],
          color: 'critical',
        },
        // Thu Jan 29 — 11:30 AM - 11:35 AM
        { type: 'spacer', rangeMs: [1769686200000, 1769686500000] },
        // Thu Jan 29 — 11:35 AM - 12:15 PM
        {
          type: 'block',
          rangeMs: [1769686500000, 1769688900000],
          color: 'accent',
        },

        // Thu Jan 29 — 12:15 PM - 1:00 PM
        { type: 'spacer', rangeMs: [1769688900000, 1769691600000] },
        // Thu Jan 29 — 1:00 PM
        { type: 'bracket-close', timeMs: 1769691600000 },

        // Fri Jan 30 — 5:00 AM - 7:30 AM
        {
          type: 'block',
          rangeMs: [1769749200000, 1769758200000],
          color: 'serious',
        },
        // Fri Jan 30 — 7:30 AM - 7:50 AM
        {
          type: 'spacer',
          rangeMs: [1769758200000, 1769759400000],
          color: 'critical',
        },
        // Fri Jan 30 — 7:50 AM
        { type: 'bracket-close', timeMs: 1769759400000 },

        // Fri Jan 30 — 1:00 PM - 2:30 PM
        {
          type: 'block',
          rangeMs: [1769781600000, 1769787000000],
          color: 'accent',
        },
        // Fri Jan 30 — 2:30 PM - 2:35 PM
        { type: 'spacer', rangeMs: [1769787000000, 1769787300000] },
        // Fri Jan 30 — 2:35 PM - 3:15 PM
        {
          type: 'block',
          rangeMs: [1769787300000, 1769789700000],
          color: 'serious',
        },

        // Fri Jan 30 — 9:30 PM - 11:00 PM
        {
          type: 'block',
          rangeMs: [1769808600000, 1769814000000],
          color: 'critical',
        },
        // Fri Jan 30 — 11:00 PM - 11:05 PM
        { type: 'spacer', rangeMs: [1769814000000, 1769814300000] },
        // Fri Jan 30 — 11:05 PM - 11:40 PM
        {
          type: 'block',
          rangeMs: [1769814300000, 1769816400000],
          color: 'accent',
        },

        // Sat Jan 31 — 12:00 AM - 12:45 AM
        {
          type: 'block',
          rangeMs: [1769817600000, 1769820300000],
          color: 'serious',
        },
        // Sat Jan 31 — 12:45 AM - 12:50 AM
        { type: 'spacer', rangeMs: [1769820300000, 1769820600000] },
        // Sat Jan 31 — 12:50 AM - 1:20 AM
        {
          type: 'block',
          rangeMs: [1769820600000, 1769822400000],
          color: 'critical',
        },

        // Sat Jan 31 — 2:00 AM
        { type: 'bracket-open', timeMs: 1769824800000 },
        // Sat Jan 31 — 2:00 AM - Sat Jan 31 6:40 PM
        {
          type: 'spacer',
          rangeMs: [1769824800000, 1769885600000],
          color: 'accent',
        },
        // Sat Jan 31 — 6:40 PM
        { type: 'marker', timeMs: 1769885600000, color: 'serious' },
        // Sat Jan 31 — 6:40 PM - Sun Feb 1 6:00 AM
        {
          type: 'spacer',
          rangeMs: [1769885600000, 1769925600000],
          color: 'critical',
        },
        // Sun Feb 1 — 6:00 AM
        { type: 'marker', timeMs: 1769925600000, color: 'accent' },
        // Sun Feb 1 — 6:00 AM - Sun Feb 1 12:30 PM
        { type: 'spacer', rangeMs: [1769925600000, 1769949000000] },
      ],
    },

    {
      id: 'row-H',
      elements: [
        // --- OVERLAP COPY ---
        // Thu Jan 29 — 6:30 PM - 9:00 PM
        {
          type: 'block',
          rangeMs: [1769711400000, 1769720400000],
          color: 'accent',
        },
        // Thu Jan 29 — 9:00 PM - 9:05 PM
        { type: 'spacer', rangeMs: [1769720400000, 1769720700000] },
        // Thu Jan 29 — 9:05 PM - 9:45 PM
        {
          type: 'block',
          rangeMs: [1769720700000, 1769723100000],
          color: 'serious',
        },

        // Thu Jan 29 — 9:45 PM - 10:30 PM
        { type: 'spacer', rangeMs: [1769723100000, 1769725800000] },
        // Thu Jan 29 — 10:30 PM
        { type: 'bracket-close', timeMs: 1769725800000 },

        // Fri Jan 30 — 2:30 AM - 3:45 AM
        {
          type: 'block',
          rangeMs: [1769740200000, 1769744700000],
          color: 'critical',
        },

        // Fri Jan 30 — 10:30 AM
        { type: 'bracket-open', timeMs: 1769778600000, color: 'critical' },
        // Fri Jan 30 — 10:30 AM - 11:10 AM
        {
          type: 'spacer',
          rangeMs: [1769778600000, 1769781000000],
          color: 'critical',
        },
        // Fri Jan 30 — 11:10 AM
        { type: 'bracket-close', timeMs: 1769781000000, color: 'critical' },

        // Fri Jan 30 — 6:30 PM - 9:00 PM
        {
          type: 'block',
          rangeMs: [1769807400000, 1769816400000],
          color: 'accent',
        },
        // Fri Jan 30 — 9:00 PM - 9:05 PM
        { type: 'spacer', rangeMs: [1769816400000, 1769816700000] },
        // Fri Jan 30 — 9:05 PM - 9:45 PM
        {
          type: 'block',
          rangeMs: [1769816700000, 1769819100000],
          color: 'serious',
        },
        // Sat Jan 31 — 4:30 AM - 5:15 AM
        {
          type: 'block',
          rangeMs: [1769833800000, 1769836500000],
          color: 'critical',
        },
        // Sat Jan 31 — 5:15 AM - 5:20 AM
        { type: 'spacer', rangeMs: [1769836500000, 1769836800000] },
        // Sat Jan 31 — 5:20 AM - 5:50 AM
        {
          type: 'block',
          rangeMs: [1769836800000, 1769838600000],
          color: 'accent',
        },

        // Sat Jan 31 — 6:00 AM
        { type: 'bracket-open', timeMs: 1769839200000 },
        // Sat Jan 31 — 6:00 AM - 8:10 AM
        {
          type: 'spacer',
          rangeMs: [1769839200000, 1769847600000],
          color: 'serious',
        },
        // Sat Jan 31 — 8:10 AM
        { type: 'marker', timeMs: 1769847600000, color: 'critical' },
        // Sat Jan 31 — 8:10 AM - 12:00 PM
        { type: 'spacer', rangeMs: [1769847600000, 1769860800000] },

        // Sat Jan 31 — 12:00 PM - 2:30 PM
        {
          type: 'block',
          rangeMs: [1769860800000, 1769869800000],
          color: 'serious',
        },
        // Sat Jan 31 — 2:30 PM - 2:35 PM
        { type: 'spacer', rangeMs: [1769869800000, 1769870100000] },
        // Sat Jan 31 — 2:35 PM - 3:15 PM
        {
          type: 'block',
          rangeMs: [1769870100000, 1769872500000],
          color: 'accent',
        },
      ],
    },

    {
      id: 'row-I',
      elements: [
        // --- OVERLAP COPY ---
        // Thu Jan 29 — 12:00 PM - 1:00 PM
        {
          type: 'block',
          rangeMs: [1769688000000, 1769691600000],
          color: 'critical',
        },

        // Thu Jan 29 — 1:00 PM - 2:00 PM
        { type: 'spacer', rangeMs: [1769691600000, 1769695200000] },
        // Thu Jan 29 — 2:00 PM
        { type: 'bracket-close', timeMs: 1769695200000 },

        // Fri Jan 30 — 7:00 AM - 8:00 AM
        {
          type: 'block',
          rangeMs: [1769756400000, 1769760000000],
          color: 'serious',
        },

        // Fri Jan 30 — 12:30 PM - 2:00 PM
        {
          type: 'block',
          rangeMs: [1769783400000, 1769788800000],
          color: 'accent',
        },
        // Fri Jan 30 — 2:00 PM - 2:05 PM
        { type: 'spacer', rangeMs: [1769788800000, 1769789100000] },
        // Fri Jan 30 — 2:05 PM - 2:45 PM
        {
          type: 'block',
          rangeMs: [1769789100000, 1769791500000],
          color: 'critical',
        },

        // Fri Jan 30 — 7:00 PM
        { type: 'bracket-open', timeMs: 1769806800000 },
        // Fri Jan 30 — 7:00 PM - 11:10 PM
        {
          type: 'spacer',
          rangeMs: [1769806800000, 1769815200000],
          color: 'serious',
        },
        // Fri Jan 30 — 11:10 PM
        { type: 'marker', timeMs: 1769815200000, color: 'accent' },
        // Fri Jan 30 — 11:10 PM - 11:40 PM
        {
          type: 'spacer',
          rangeMs: [1769815200000, 1769817000000],
          color: 'critical',
        },
        // Fri Jan 30 — 11:40 PM
        { type: 'bracket-close', timeMs: 1769817000000 },

        // Sat Jan 31 — 8:00 PM - 10:00 PM
        {
          type: 'block',
          rangeMs: [1769889600000, 1769896800000],
          color: 'accent',
        },
        // Sat Jan 31 — 10:00 PM - 10:05 PM
        { type: 'spacer', rangeMs: [1769896800000, 1769897100000] },
        // Sat Jan 31 — 10:05 PM - 10:45 PM
        {
          type: 'block',
          rangeMs: [1769897100000, 1769899500000],
          color: 'critical',
        },

        // Sat Jan 31 — 11:06 PM
        { type: 'bracket-open', timeMs: 1769905560000, color: 'serious' },
        // Sat Jan 31 — 11:06 PM - Sun Feb 1 12:00 AM
        {
          type: 'spacer',
          rangeMs: [1769905560000, 1769907600000],
          color: 'serious',
        },
        // Sun Feb 1 — 12:00 AM
        { type: 'bracket-close', timeMs: 1769907600000, color: 'serious' },

        // Sun Feb 1 — 4:30 AM - 6:00 AM
        {
          type: 'block',
          rangeMs: [1769920200000, 1769925600000],
          color: 'serious',
        },
        // Sun Feb 1 — 6:00 AM - 6:05 AM
        { type: 'spacer', rangeMs: [1769925600000, 1769925900000] },
        // Sun Feb 1 — 6:05 AM - 6:45 AM
        {
          type: 'block',
          rangeMs: [1769925900000, 1769928300000],
          color: 'accent',
        },

        // Sun Feb 1 — 7:00 AM
        { type: 'bracket-open', timeMs: 1769929200000 },
        // Sun Feb 1 — 7:00 AM - 1:20 PM
        {
          type: 'spacer',
          rangeMs: [1769929200000, 1769953600000],
          color: 'critical',
        },
      ],
    },

    {
      id: 'row-J',
      elements: [
        // --- OVERLAP COPY ---
        // Thu Jan 29 — 8:00 AM - 9:30 AM
        {
          type: 'block',
          rangeMs: [1769683200000, 1769688600000],
          color: 'critical',
        },

        // Fri Jan 30 — 1:00 AM - 2:30 AM
        {
          type: 'block',
          rangeMs: [1769731200000, 1769736600000],
          color: 'accent',
        },

        // Fri Jan 30 — 8:00 AM - 9:00 AM
        {
          type: 'block',
          rangeMs: [1769760000000, 1769763600000],
          color: 'serious',
        },
        // Fri Jan 30 — 9:00 AM - 9:05 AM
        { type: 'spacer', rangeMs: [1769763600000, 1769763900000] },
        // Fri Jan 30 — 9:05 AM - 9:45 AM
        {
          type: 'block',
          rangeMs: [1769763900000, 1769766300000],
          color: 'critical',
        },

        // Fri Jan 30 — 3:40 PM
        { type: 'bracket-open', timeMs: 1769794800000, color: 'accent' },
        // Fri Jan 30 — 3:40 PM - 4:00 PM
        {
          type: 'spacer',
          rangeMs: [1769794800000, 1769796000000],
          color: 'accent',
        },
        // Fri Jan 30 — 4:00 PM
        { type: 'marker', timeMs: 1769796000000, color: 'serious' },
        // Fri Jan 30 — 4:00 PM - 4:30 PM
        {
          type: 'spacer',
          rangeMs: [1769796000000, 1769797800000],
          color: 'accent',
        },
        // Fri Jan 30 — 4:30 PM
        { type: 'bracket-close', timeMs: 1769797800000, color: 'accent' },

        // Sat Jan 31 — 1:00 AM - 1:45 AM
        {
          type: 'block',
          rangeMs: [1769821200000, 1769823900000],
          color: 'critical',
        },
        // Sat Jan 31 — 1:45 AM - 1:50 AM
        { type: 'spacer', rangeMs: [1769823900000, 1769824200000] },
        // Sat Jan 31 — 1:50 AM - 2:20 AM
        {
          type: 'block',
          rangeMs: [1769824200000, 1769826000000],
          color: 'accent',
        },

        // Sat Jan 31 — 8:15 AM - 9:00 AM
        {
          type: 'block',
          rangeMs: [1769849700000, 1769852400000],
          color: 'serious',
        },
        // Sat Jan 31 — 9:00 AM - 9:05 AM
        { type: 'spacer', rangeMs: [1769852400000, 1769852700000] },
        // Sat Jan 31 — 9:05 AM - 9:40 AM
        {
          type: 'block',
          rangeMs: [1769852700000, 1769854800000],
          color: 'critical',
        },

        // Sat Jan 31 — 9:40 PM
        { type: 'bracket-open', timeMs: 1769895600000, color: 'accent' },
        // Sat Jan 31 — 9:40 PM - 10:00 PM
        {
          type: 'spacer',
          rangeMs: [1769895600000, 1769896800000],
          color: 'accent',
        },
        // Sat Jan 31 — 10:00 PM
        { type: 'marker', timeMs: 1769896800000, color: 'serious' },
        // Sat Jan 31 — 10:00 PM - 10:30 PM
        {
          type: 'spacer',
          rangeMs: [1769896800000, 1769898600000],
          color: 'accent',
        },
        // Sat Jan 31 — 10:30 PM
        { type: 'bracket-close', timeMs: 1769898600000, color: 'accent' },

        // Sun Feb 1 — 12:00 PM - 1:30 PM
        {
          type: 'block',
          rangeMs: [1769943600000, 1769949000000],
          color: 'accent',
        },
        // Sun Feb 1 — 1:30 PM - 1:35 PM
        { type: 'spacer', rangeMs: [1769949000000, 1769949300000] },
        // Sun Feb 1 — 1:35 PM - 2:15 PM
        {
          type: 'block',
          rangeMs: [1769949300000, 1769951700000],
          color: 'serious',
        },
      ],
    },

    {
      id: 'row-K',
      elements: [
        // --- OVERLAP COPY ---
        // Thu Jan 29 — 5:00 PM - 7:00 PM
        {
          type: 'block',
          rangeMs: [1769710800000, 1769718000000],
          color: 'accent',
        },

        // Fri Jan 30 — 3:00 AM - 4:30 AM
        {
          type: 'block',
          rangeMs: [1769738400000, 1769743800000],
          color: 'serious',
        },

        // Fri Jan 30 — 8:46 AM
        { type: 'bracket-open', timeMs: 1769762760000, color: 'serious' },
        // Fri Jan 30 — 8:46 AM - 9:00 AM
        {
          type: 'spacer',
          rangeMs: [1769762760000, 1769763600000],
          color: 'serious',
        },
        // Fri Jan 30 — 9:00 AM
        { type: 'bracket-close', timeMs: 1769763600000, color: 'serious' },

        // Fri Jan 30 — 1:45 PM - 3:15 PM
        {
          type: 'block',
          rangeMs: [1769787900000, 1769793300000],
          color: 'critical',
        },

        // Fri Jan 30 — 3:15 PM - 3:45 PM
        {
          type: 'spacer',
          rangeMs: [1769793300000, 1769795100000],
          color: 'accent',
        },
        // Fri Jan 30 — 3:45 PM
        { type: 'bracket-close', timeMs: 1769795100000 },

        // --- GENERATED COPY OF Jan 27/28 PATTERN SHIFTED +4 DAYS ---
        // Sat Jan 31 — 3:30 AM - 5:00 AM
        {
          type: 'block',
          rangeMs: [1769830200000, 1769835600000],
          color: 'serious',
        },
        // Sat Jan 31 — 5:00 AM - 5:05 AM
        { type: 'spacer', rangeMs: [1769835600000, 1769835900000] },
        // Sat Jan 31 — 5:05 AM - 5:35 AM
        {
          type: 'block',
          rangeMs: [1769835900000, 1769837700000],
          color: 'critical',
        },

        // Sat Jan 31 — 6:00 AM
        { type: 'bracket-open', timeMs: 1769839200000 },
        // Sat Jan 31 — 6:00 AM - 8:00 AM
        {
          type: 'spacer',
          rangeMs: [1769839200000, 1769846400000],
          color: 'accent',
        },
        // Sat Jan 31 — 8:00 AM
        { type: 'marker', timeMs: 1769846400000, color: 'critical' },
        // Sat Jan 31 — 8:00 AM - 11:00 AM
        { type: 'spacer', rangeMs: [1769846400000, 1769857200000] },

        // Sat Jan 31 — 11:00 AM - 12:00 PM
        {
          type: 'block',
          rangeMs: [1769857200000, 1769860800000],
          color: 'accent',
        },
        // Sat Jan 31 — 12:00 PM - 12:05 PM
        { type: 'spacer', rangeMs: [1769860800000, 1769861100000] },
        // Sat Jan 31 — 12:05 PM - 12:45 PM
        {
          type: 'block',
          rangeMs: [1769861100000, 1769863500000],
          color: 'serious',
        },

        // Sun Feb 1 — 6:00 AM - 7:00 AM
        {
          type: 'block',
          rangeMs: [1769925600000, 1769929200000],
          color: 'critical',
        },
        // Sun Feb 1 — 7:00 AM - 7:05 AM
        { type: 'spacer', rangeMs: [1769929200000, 1769929500000] },
        // Sun Feb 1 — 7:05 AM - 7:45 AM
        {
          type: 'block',
          rangeMs: [1769929500000, 1769931900000],
          color: 'accent',
        },
      ],
    },

    {
      id: 'row-L',
      elements: [
        // --- OVERLAP COPY ---
        // Thu Jan 29 — 10:00 AM - 12:00 PM
        {
          type: 'block',
          rangeMs: [1769689200000, 1769696400000],
          color: 'critical',
        },

        // Fri Jan 30 — 5:30 AM - 7:00 AM
        {
          type: 'block',
          rangeMs: [1769751000000, 1769756400000],
          color: 'serious',
        },

        // Fri Jan 30 — 9:30 AM - 10:30 AM
        {
          type: 'block',
          rangeMs: [1769765400000, 1769769000000],
          color: 'serious',
        },

        // Fri Jan 30 — 10:30 AM - 11:00 AM
        {
          type: 'spacer',
          rangeMs: [1769769000000, 1769770800000],
          color: 'critical',
        },
        // Fri Jan 30 — 11:00 AM
        { type: 'bracket-close', timeMs: 1769770800000 },

        // Fri Jan 30 — 6:30 PM - 8:00 PM
        {
          type: 'block',
          rangeMs: [1769807400000, 1769812800000],
          color: 'accent',
        },

        // Fri Jan 30 — 10:00 PM - 11:30 PM
        {
          type: 'block',
          rangeMs: [1769816400000, 1769821800000],
          color: 'critical',
        },
        // Sat Jan 31 — 6:45 AM - 7:30 AM
        {
          type: 'block',
          rangeMs: [1769841900000, 1769844600000],
          color: 'accent',
        },
        // Sat Jan 31 — 7:30 AM - 7:35 AM
        { type: 'spacer', rangeMs: [1769844600000, 1769844900000] },
        // Sat Jan 31 — 7:35 AM - 8:05 AM
        {
          type: 'block',
          rangeMs: [1769844900000, 1769846700000],
          color: 'critical',
        },

        // Sat Jan 31 — 11:33 AM
        { type: 'bracket-open', timeMs: 1769857560000, color: 'serious' },
        // Sat Jan 31 — 11:33 AM - 11:53 AM
        {
          type: 'spacer',
          rangeMs: [1769857560000, 1769858800000],
          color: 'serious',
        },
        // Sat Jan 31 — 11:53 AM
        { type: 'marker', timeMs: 1769858800000, color: 'accent' },
        // Sat Jan 31 — 11:53 AM - 12:23 PM
        {
          type: 'spacer',
          rangeMs: [1769858800000, 1769860560000],
          color: 'serious',
        },
        // Sat Jan 31 — 12:23 PM
        { type: 'bracket-close', timeMs: 1769860560000, color: 'serious' },

        // Sat Jan 31 — 1:00 PM - 2:00 PM
        {
          type: 'block',
          rangeMs: [1769864400000, 1769868000000],
          color: 'critical',
        },
        // Sat Jan 31 — 2:00 PM - 2:05 PM
        { type: 'spacer', rangeMs: [1769868000000, 1769868300000] },
        // Sat Jan 31 — 2:05 PM - 2:45 PM
        {
          type: 'block',
          rangeMs: [1769868300000, 1769870700000],
          color: 'accent',
        },
      ],
    },

    {
      id: 'row-M',
      elements: [
        // --- OVERLAP COPY ---
        // Wed Jan 29 — 12:20 AM
        { type: 'bracket-open', timeMs: 1769646000000, color: 'critical' },
        // Wed Jan 29 — 12:20 AM - Thu Jan 29 01:10 AM
        {
          type: 'spacer',
          rangeMs: [1769646000000, 1769649000000],
          color: 'critical',
        },
        // Thu Jan 29 — 01:10 AM
        { type: 'bracket-close', timeMs: 1769649000000, color: 'critical' },
        // Thu Jan 29 — 3:00 PM - 4:30 PM
        {
          type: 'block',
          rangeMs: [1769695200000, 1769700600000],
          color: 'serious',
        },

        // Thu Jan 29 — 4:30 PM - 5:00 PM
        {
          type: 'spacer',
          rangeMs: [1769700600000, 1769702400000],
          color: 'accent',
        },
        // Thu Jan 29 — 5:00 PM
        { type: 'bracket-close', timeMs: 1769702400000 },

        // Fri Jan 30 — 12:00 AM - 1:00 AM
        {
          type: 'block',
          rangeMs: [1769724000000, 1769727600000],
          color: 'critical',
        },

        // Fri Jan 30 — 7:00 AM - 8:30 AM
        {
          type: 'block',
          rangeMs: [1769756400000, 1769761800000],
          color: 'serious',
        },

        // Fri Jan 30 — 11:00 AM - 12:30 PM
        {
          type: 'block',
          rangeMs: [1769770800000, 1769776200000],
          color: 'accent',
        },

        // Fri Jan 30 — 11:40 PM
        { type: 'bracket-open', timeMs: 1769815200000, color: 'critical' },
        // Fri Jan 30 — 11:40 PM - Sat Jan 31 12:00 AM
        {
          type: 'spacer',
          rangeMs: [1769815200000, 1769817600000],
          color: 'critical',
        },
        // Sat Jan 31 — 12:45 AM - 1:30 AM
        {
          type: 'block',
          rangeMs: [1769820300000, 1769823000000],
          color: 'critical',
        },
        // Sat Jan 31 — 1:30 AM - 1:35 AM
        { type: 'spacer', rangeMs: [1769823000000, 1769823300000] },
        // Sat Jan 31 — 1:35 AM - 2:05 AM
        {
          type: 'block',
          rangeMs: [1769823300000, 1769825100000],
          color: 'accent',
        },

        // Sat Jan 31 — 2:30 AM
        { type: 'bracket-open', timeMs: 1769826600000 },
        // Sat Jan 31 — 2:30 AM - 7:46 AM
        {
          type: 'spacer',
          rangeMs: [1769826600000, 1769845600000],
          color: 'serious',
        },
        // Sat Jan 31 — 7:46 AM
        { type: 'marker', timeMs: 1769845600000, color: 'critical' },
        // Sat Jan 31 — 7:46 AM - 1:20 PM
        {
          type: 'spacer',
          rangeMs: [1769845600000, 1769865600000],
          color: 'accent',
        },
        // Sat Jan 31 — 1:20 PM
        { type: 'marker', timeMs: 1769865600000, color: 'serious' },
        // Sat Jan 31 — 1:20 PM - 4:00 PM
        { type: 'spacer', rangeMs: [1769865600000, 1769877600000] },

        // Sat Jan 31 — 4:00 PM - 5:30 PM
        {
          type: 'block',
          rangeMs: [1769877600000, 1769883000000],
          color: 'accent',
        },
        // Sat Jan 31 — 5:30 PM - 5:35 PM
        { type: 'spacer', rangeMs: [1769883000000, 1769883300000] },
        // Sat Jan 31 — 5:35 PM - 6:15 PM
        {
          type: 'block',
          rangeMs: [1769883300000, 1769885700000],
          color: 'critical',
        },

        // Sun Feb 1 — 7:00 AM - 8:30 AM
        {
          type: 'block',
          rangeMs: [1769929200000, 1769934600000],
          color: 'serious',
        },
      ],
    },

    {
      id: 'row-N',
      elements: [
        // --- OVERLAP COPY ---
        // Thu Jan 29 — 7:00 AM - 8:30 AM
        {
          type: 'block',
          rangeMs: [1769679600000, 1769685000000],
          color: 'serious',
        },

        // Fri Jan 30 — 6:00 AM - 8:00 AM
        {
          type: 'block',
          rangeMs: [1769752800000, 1769760000000],
          color: 'accent',
        },

        // Fri Jan 30 — 8:43 AM
        { type: 'bracket-open', timeMs: 1769762580000, color: 'serious' },
        // Fri Jan 30 — 8:43 AM - 9:00 AM
        {
          type: 'spacer',
          rangeMs: [1769762580000, 1769763600000],
          color: 'serious',
        },
        // Fri Jan 30 — 9:00 AM
        { type: 'marker', timeMs: 1769763600000, color: 'critical' },
        // Fri Jan 30 — 9:00 AM - 9:30 AM
        {
          type: 'spacer',
          rangeMs: [1769763600000, 1769765400000],
          color: 'serious',
        },
        // Fri Jan 30 — 9:30 AM
        { type: 'bracket-close', timeMs: 1769765400000, color: 'serious' },

        // Fri Jan 30 — 5:00 PM - 6:30 PM
        {
          type: 'block',
          rangeMs: [1769799600000, 1769805000000],
          color: 'critical',
        },

        // Fri Jan 30 — 6:30 PM - 8:00 PM
        {
          type: 'spacer',
          rangeMs: [1769805000000, 1769810400000],
          color: 'accent',
        },
        // Fri Jan 30 — 8:00 PM
        { type: 'bracket-close', timeMs: 1769810400000 },

        // Sat Jan 31 — 7:30 AM - 9:00 AM
        {
          type: 'block',
          rangeMs: [1769844600000, 1769850000000],
          color: 'accent',
        },
        // Sat Jan 31 — 9:00 AM - 9:05 AM
        { type: 'spacer', rangeMs: [1769850000000, 1769850300000] },
        // Sat Jan 31 — 9:05 AM - 9:45 AM
        {
          type: 'block',
          rangeMs: [1769850300000, 1769852700000],
          color: 'critical',
        },

        // Sat Jan 31 — 2:30 PM - 4:00 PM
        {
          type: 'block',
          rangeMs: [1769869800000, 1769875200000],
          color: 'serious',
        },
        // Sat Jan 31 — 4:00 PM - 4:05 PM
        { type: 'spacer', rangeMs: [1769875200000, 1769875500000] },
        // Sat Jan 31 — 4:05 PM - 4:45 PM
        {
          type: 'block',
          rangeMs: [1769875500000, 1769877900000],
          color: 'accent',
        },

        // Sat Jan 31 — 5:00 PM
        { type: 'bracket-open', timeMs: 1769878800000 },
        // Sat Jan 31 — 5:00 PM - Sat Jan 31 9:10 PM
        {
          type: 'spacer',
          rangeMs: [1769878800000, 1769895600000],
          color: 'critical',
        },
        // Sat Jan 31 — 9:10 PM
        { type: 'marker', timeMs: 1769895600000, color: 'serious' },
        // Sat Jan 31 — 9:10 PM - Sun Feb 1 2:00 AM
        { type: 'spacer', rangeMs: [1769895600000, 1769911200000] },

        // Sun Feb 1 — 2:00 AM - 3:30 AM
        {
          type: 'block',
          rangeMs: [1769911200000, 1769916600000],
          color: 'accent',
        },
      ],
    },
  ],
};
