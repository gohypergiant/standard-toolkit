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

// Tuesday, Jan 27, 2026 at 12:00 AM UTC
export const DATASET_JAN27_TO_JAN30_START_TIME_MS = 1769472000000;

// Friday, Jan 30, 2026 at 8:00 AM UTC
export const DATASET_JAN27_TO_JAN30_END_TIME_MS = 1769760000000;

type RangeTuple = readonly [startMs: number, endMs: number];

type Element =
  | { type: 'block'; rangeMs: RangeTuple }
  | { type: 'spacer'; rangeMs: RangeTuple }
  | { type: 'bracket-open'; timeMs: number }
  | { type: 'bracket-close'; timeMs: number }
  | { type: 'marker'; timeMs: number };

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
        { type: 'block', rangeMs: [1769473800000, 1769479200000] },
        // Tue Jan 27 — 2:00 AM - 2:05 AM
        { type: 'spacer', rangeMs: [1769479200000, 1769479500000] },
        // Tue Jan 27 — 2:05 AM - 2:45 AM
        { type: 'block', rangeMs: [1769479500000, 1769481900000] },
        // Tue Jan 27 — 2:45 AM - 2:50 AM
        { type: 'spacer', rangeMs: [1769481900000, 1769482200000] },
        // Tue Jan 27 — 2:50 AM - 3:30 AM
        { type: 'block', rangeMs: [1769482200000, 1769484600000] },

        // Tue Jan 27 — 3:30 AM - 4:00 AM
        { type: 'spacer', rangeMs: [1769484600000, 1769486400000] },
        // Tue Jan 27 — 4:00 AM
        { type: 'bracket-close', timeMs: 1769486400000 },

        // Tue Jan 27 — 4:10 AM
        { type: 'marker', timeMs: 1769487000000 },

        // Tue Jan 27 — 4:15 AM
        { type: 'bracket-open', timeMs: 1769487300000 },
        // Tue Jan 27 — 4:15 AM - 7:30 AM
        { type: 'spacer', rangeMs: [1769487300000, 1769499000000] },
        // Tue Jan 27 — 7:30 AM
        { type: 'marker', timeMs: 1769499000000 },
        // Tue Jan 27 — 7:30 AM - 8:40 AM
        { type: 'spacer', rangeMs: [1769499000000, 1769503200000] },
        // Tue Jan 27 — 8:40 AM
        { type: 'marker', timeMs: 1769503200000 },
        // Tue Jan 27 — 8:40 AM - 10:30 AM
        { type: 'spacer', rangeMs: [1769503200000, 1769509800000] },

        // Tue Jan 27 — 10:30 AM - 12:00 PM
        { type: 'block', rangeMs: [1769509800000, 1769515200000] },
        // Tue Jan 27 — 12:00 PM - 12:05 PM
        { type: 'spacer', rangeMs: [1769515200000, 1769515500000] },
        // Tue Jan 27 — 12:05 PM - 12:45 PM
        { type: 'block', rangeMs: [1769515500000, 1769517900000] },
        // Tue Jan 27 — 12:45 PM - 12:50 PM
        { type: 'spacer', rangeMs: [1769517900000, 1769518200000] },
        // Tue Jan 27 — 12:50 PM - 1:20 PM
        { type: 'block', rangeMs: [1769518200000, 1769520000000] },

        // Wed Jan 28 — 2:00 PM - 4:30 PM
        { type: 'block', rangeMs: [1769618400000, 1769627400000] },
        // Wed Jan 28 — 4:30 PM - 4:35 PM
        { type: 'spacer', rangeMs: [1769627400000, 1769627700000] },
        // Wed Jan 28 — 4:35 PM - 5:15 PM
        { type: 'block', rangeMs: [1769627700000, 1769630100000] },
        // Wed Jan 28 — 5:15 PM - 5:20 PM
        { type: 'spacer', rangeMs: [1769630100000, 1769630400000] },
        // Wed Jan 28 — 5:20 PM - 6:00 PM
        { type: 'block', rangeMs: [1769630400000, 1769632800000] },

        // Thu Jan 29 — 7:30 AM - 9:00 AM
        { type: 'block', rangeMs: [1769679000000, 1769684400000] },
        // Thu Jan 29 — 9:00 AM - 9:05 AM
        { type: 'spacer', rangeMs: [1769684400000, 1769684700000] },
        // Thu Jan 29 — 9:05 AM - 9:40 AM
        { type: 'block', rangeMs: [1769684700000, 1769687000000] },

        // Thu Jan 29 — 11:00 AM
        { type: 'bracket-open', timeMs: 1769691600000 },
        // Thu Jan 29 — 11:00 AM - 12:00 PM
        { type: 'spacer', rangeMs: [1769691600000, 1769695200000] },
        // Thu Jan 29 — 12:00 PM
        { type: 'bracket-close', timeMs: 1769695200000 },

        // Thu Jan 29 — 11:30 PM - Fri Jan 30 12:30 AM
        { type: 'block', rangeMs: [1769722200000, 1769725800000] },
        // Fri Jan 30 — 12:30 AM - 12:35 AM
        { type: 'spacer', rangeMs: [1769725800000, 1769726100000] },
        // Fri Jan 30 — 12:35 AM - 1:10 AM
        { type: 'block', rangeMs: [1769726100000, 1769728200000] },
      ],
    },

    {
      id: 'row-B',
      elements: [
        // Tue Jan 27 — 2:00 AM - 4:00 AM
        { type: 'block', rangeMs: [1769479200000, 1769486400000] },
        // Tue Jan 27 — 4:00 AM - 4:05 AM
        { type: 'spacer', rangeMs: [1769486400000, 1769486700000] },
        // Tue Jan 27 — 4:05 AM - 4:45 AM
        { type: 'block', rangeMs: [1769486700000, 1769489100000] },
        // Tue Jan 27 — 4:45 AM - 4:50 AM
        { type: 'spacer', rangeMs: [1769489100000, 1769489400000] },
        // Tue Jan 27 — 4:50 AM - 5:20 AM
        { type: 'block', rangeMs: [1769489400000, 1769491200000] },

        // Tue Jan 27 — 5:25 AM
        { type: 'bracket-open', timeMs: 1769491500000 },
        // Tue Jan 27 — 5:25 AM - 5:40 AM
        { type: 'spacer', rangeMs: [1769491500000, 1769492400000] },
        // Tue Jan 27 — 5:40 AM
        { type: 'marker', timeMs: 1769492400000 },
        // Tue Jan 27 — 5:40 AM - 6:00 AM
        { type: 'spacer', rangeMs: [1769492400000, 1769493600000] },

        // Tue Jan 27 — 6:00 AM - 8:00 AM
        { type: 'block', rangeMs: [1769493600000, 1769500800000] },
        // Tue Jan 27 — 8:00 AM - 8:05 AM
        { type: 'spacer', rangeMs: [1769500800000, 1769501100000] },
        // Tue Jan 27 — 8:05 AM - 8:40 AM
        { type: 'block', rangeMs: [1769501100000, 1769503200000] },

        // Tue Jan 27 — 8:40 AM - 9:10 AM
        { type: 'spacer', rangeMs: [1769503200000, 1769505000000] },
        // Tue Jan 27 — 9:10 AM
        { type: 'bracket-close', timeMs: 1769505000000 },

        // Wed Jan 28 — 9:00 AM - 11:00 AM
        { type: 'block', rangeMs: [1769590800000, 1769598000000] },
        // Wed Jan 28 — 11:00 AM - 11:05 AM
        { type: 'spacer', rangeMs: [1769598000000, 1769598300000] },
        // Wed Jan 28 — 11:05 AM - 11:40 AM
        { type: 'block', rangeMs: [1769598300000, 1769600400000] },

        // Wed Jan 28 — 10:40 PM
        { type: 'bracket-open', timeMs: 1769640000000 },
        // Wed Jan 28 — 10:40 PM - 11:30 PM
        { type: 'spacer', rangeMs: [1769640000000, 1769643000000] },
        // Wed Jan 28 — 11:30 PM
        { type: 'bracket-close', timeMs: 1769643000000 },

        // Thu Jan 29 — 1:00 PM - 4:00 PM
        { type: 'block', rangeMs: [1769691600000, 1769702400000] },
        // Thu Jan 29 — 4:00 PM - 4:05 PM
        { type: 'spacer', rangeMs: [1769702400000, 1769702700000] },
        // Thu Jan 29 — 4:05 PM - 4:45 PM
        { type: 'block', rangeMs: [1769702700000, 1769705100000] },
      ],
    },

    {
      id: 'row-C',
      elements: [
        // Tue Jan 27 — 5:30 AM - 7:00 AM
        { type: 'block', rangeMs: [1769491800000, 1769497200000] },
        // Tue Jan 27 — 7:00 AM - 7:05 AM
        { type: 'spacer', rangeMs: [1769497200000, 1769497500000] },
        // Tue Jan 27 — 7:05 AM - 7:35 AM
        { type: 'block', rangeMs: [1769497500000, 1769499300000] },

        // Tue Jan 27 — 3:00 PM - 6:00 PM
        { type: 'block', rangeMs: [1769526000000, 1769536800000] },
        // Tue Jan 27 — 6:00 PM - 6:05 PM
        { type: 'spacer', rangeMs: [1769536800000, 1769537100000] },
        // Tue Jan 27 — 6:05 PM - 6:45 PM
        { type: 'block', rangeMs: [1769537100000, 1769539500000] },

        // Tue Jan 27 — 6:45 PM - 6:46 PM
        { type: 'spacer', rangeMs: [1769539500000, 1769540160000] },
        // Tue Jan 27 — 6:46 PM
        { type: 'bracket-close', timeMs: 1769540160000 },

        // Tue Jan 27 — 6:50 PM
        { type: 'bracket-open', timeMs: 1769540400000 },
        // Tue Jan 27 — 6:50 PM - Tue Jan 27 1:46 AM (next day boundary not shown)
        { type: 'spacer', rangeMs: [1769540400000, 1769564000000] },
        // Wed Jan 28 — 1:46 AM
        { type: 'marker', timeMs: 1769564000000 },
        // Wed Jan 28 — 1:46 AM - Wed Jan 28 12:26 PM
        { type: 'spacer', rangeMs: [1769564000000, 1769600000000] },
        // Wed Jan 28 — 12:26 PM
        { type: 'marker', timeMs: 1769600000000 },
        // Wed Jan 28 — 12:26 PM - Wed Jan 28 11:30 PM
        { type: 'spacer', rangeMs: [1769600000000, 1769643000000] },

        // Wed Jan 28 — 11:30 PM - Thu Jan 29 2:30 AM
        { type: 'block', rangeMs: [1769643000000, 1769653800000] },
        // Thu Jan 29 — 2:30 AM - 2:35 AM
        { type: 'spacer', rangeMs: [1769653800000, 1769654100000] },
        // Thu Jan 29 — 2:35 AM - 3:15 AM
        { type: 'block', rangeMs: [1769654100000, 1769656500000] },

        // Thu Jan 29 — 10:00 AM
        { type: 'bracket-open', timeMs: 1769700000000 },
        // Thu Jan 29 — 10:00 AM - 10:40 AM
        { type: 'spacer', rangeMs: [1769700000000, 1769702400000] },
        // Thu Jan 29 — 10:40 AM
        { type: 'bracket-close', timeMs: 1769702400000 },

        // Fri Jan 30 — 4:00 AM - 8:00 AM
        { type: 'block', rangeMs: [1769745600000, 1769760000000] },
      ],
    },

    {
      id: 'row-D',
      elements: [
        // Wed Jan 28 — 1:00 AM - 4:00 AM
        { type: 'block', rangeMs: [1769562000000, 1769572800000] },
        // Wed Jan 28 — 4:00 AM - 4:05 AM
        { type: 'spacer', rangeMs: [1769572800000, 1769573100000] },
        // Wed Jan 28 — 4:05 AM - 4:45 AM
        { type: 'block', rangeMs: [1769573100000, 1769575500000] },

        // Wed Jan 28 — 5:10 AM
        { type: 'bracket-open', timeMs: 1769577000000 },
        // Wed Jan 28 — 5:10 AM - 7:00 AM
        { type: 'spacer', rangeMs: [1769577000000, 1769583600000] },
        // Wed Jan 28 — 7:00 AM
        { type: 'marker', timeMs: 1769583600000 },
        // Wed Jan 28 — 7:00 AM - 10:00 AM
        { type: 'spacer', rangeMs: [1769583600000, 1769594400000] },

        // Wed Jan 28 — 10:00 AM - 12:00 PM
        { type: 'block', rangeMs: [1769594400000, 1769601600000] },
        // Wed Jan 28 — 12:00 PM - 12:05 PM
        { type: 'spacer', rangeMs: [1769601600000, 1769601900000] },
        // Wed Jan 28 — 12:05 PM - 12:45 PM
        { type: 'block', rangeMs: [1769601900000, 1769604300000] },

        // Wed Jan 28 — 12:45 PM - 1:30 PM
        { type: 'spacer', rangeMs: [1769604300000, 1769607000000] },
        // Wed Jan 28 — 1:30 PM
        { type: 'bracket-close', timeMs: 1769607000000 },

        // Thu Jan 29 — 6:00 AM - 8:00 AM
        { type: 'block', rangeMs: [1769676000000, 1769683200000] },
        // Thu Jan 29 — 8:00 AM - 8:05 AM
        { type: 'spacer', rangeMs: [1769683200000, 1769683500000] },
        // Thu Jan 29 — 8:05 AM - 8:45 AM
        { type: 'block', rangeMs: [1769683500000, 1769685900000] },

        // Thu Jan 29 — 2:20 PM
        { type: 'bracket-open', timeMs: 1769706000000 },
        // Thu Jan 29 — 2:20 PM - 2:50 PM
        { type: 'spacer', rangeMs: [1769706000000, 1769707800000] },
        // Thu Jan 29 — 2:50 PM
        { type: 'bracket-close', timeMs: 1769707800000 },

        // Thu Jan 29 — 10:00 PM - Fri Jan 30 1:00 AM
        { type: 'block', rangeMs: [1769724000000, 1769734800000] },
      ],
    },

    {
      id: 'row-E',
      elements: [
        // Tue Jan 27 — 9:00 AM - 10:00 AM
        { type: 'block', rangeMs: [1769504400000, 1769508000000] },
        // Tue Jan 27 — 10:00 AM - 10:05 AM
        { type: 'spacer', rangeMs: [1769508000000, 1769508300000] },
        // Tue Jan 27 — 10:05 AM - 10:45 AM
        { type: 'block', rangeMs: [1769508300000, 1769510700000] },

        // Tue Jan 27 — 6:39 PM
        { type: 'bracket-open', timeMs: 1769539980000 },
        // Tue Jan 27 — 6:39 PM - 8:00 PM
        { type: 'spacer', rangeMs: [1769539980000, 1769544000000] },
        // Tue Jan 27 — 8:00 PM
        { type: 'bracket-close', timeMs: 1769544000000 },

        // Wed Jan 28 — 12:00 AM
        { type: 'marker', timeMs: 1769562000000 },

        // Wed Jan 28 — 8:30 AM - 11:00 AM
        { type: 'block', rangeMs: [1769589000000, 1769598000000] },
        // Wed Jan 28 — 11:00 AM - 11:05 AM
        { type: 'spacer', rangeMs: [1769598000000, 1769598300000] },
        // Wed Jan 28 — 11:05 AM - 11:45 AM
        { type: 'block', rangeMs: [1769598300000, 1769600700000] },

        // Wed Jan 28 — 12:00 PM
        { type: 'bracket-open', timeMs: 1769601600000 },
        // Wed Jan 28 — 12:00 PM - 3:00 PM
        { type: 'spacer', rangeMs: [1769601600000, 1769612400000] },

        // Wed Jan 28 — 3:00 PM - 7:00 PM
        { type: 'block', rangeMs: [1769612400000, 1769626800000] },
        // Wed Jan 28 — 7:00 PM - 7:05 PM
        { type: 'spacer', rangeMs: [1769626800000, 1769627100000] },
        // Wed Jan 28 — 7:05 PM - 7:45 PM
        { type: 'block', rangeMs: [1769627100000, 1769629500000] },

        // Wed Jan 28 — 7:45 PM - 8:30 PM
        { type: 'spacer', rangeMs: [1769629500000, 1769632200000] },
        // Wed Jan 28 — 8:30 PM
        { type: 'bracket-close', timeMs: 1769632200000 },

        // Thu Jan 29 — 4:30 PM - 6:30 PM
        { type: 'block', rangeMs: [1769704200000, 1769711400000] },
      ],
    },

    {
      id: 'row-F',
      elements: [
        // Tue Jan 27 — 6:00 PM - 8:00 PM
        { type: 'block', rangeMs: [1769536800000, 1769544000000] },
        // Tue Jan 27 — 8:00 PM - 8:05 PM
        { type: 'spacer', rangeMs: [1769544000000, 1769544300000] },
        // Tue Jan 27 — 8:05 PM - 8:45 PM
        { type: 'block', rangeMs: [1769544300000, 1769546700000] },

        // Tue Jan 27 — 11:20 PM
        { type: 'bracket-open', timeMs: 1769556000000 },
        // Tue Jan 27 — 11:20 PM - 11:40 PM
        { type: 'spacer', rangeMs: [1769556000000, 1769557200000] },
        // Tue Jan 27 — 11:40 PM
        { type: 'marker', timeMs: 1769557200000 },
        // Tue Jan 27 — 11:40 PM - Wed Jan 28 12:10 AM
        { type: 'spacer', rangeMs: [1769557200000, 1769559000000] },
        // Wed Jan 28 — 12:10 AM
        { type: 'bracket-close', timeMs: 1769559000000 },

        // Wed Jan 28 — 5:30 AM - 7:30 AM
        { type: 'block', rangeMs: [1769578200000, 1769585400000] },
        // Wed Jan 28 — 7:30 AM - 7:35 AM
        { type: 'spacer', rangeMs: [1769585400000, 1769585700000] },
        // Wed Jan 28 — 7:35 AM - 8:15 AM
        { type: 'block', rangeMs: [1769585700000, 1769588100000] },

        // Wed Jan 28 — 8:30 AM
        { type: 'bracket-open', timeMs: 1769589000000 },
        // Wed Jan 28 — 8:30 AM - Wed Jan 28 5:20 PM
        { type: 'spacer', rangeMs: [1769589000000, 1769620000000] },
        // Wed Jan 28 — 5:20 PM
        { type: 'marker', timeMs: 1769620000000 },
        // Wed Jan 28 — 5:20 PM - Thu Jan 29 4:26 AM
        { type: 'spacer', rangeMs: [1769620000000, 1769660000000] },
        // Thu Jan 29 — 4:26 AM
        { type: 'marker', timeMs: 1769660000000 },
        // Thu Jan 29 — 4:26 AM - Thu Jan 29 2:00 PM
        { type: 'spacer', rangeMs: [1769660000000, 1769688000000] },

        // Thu Jan 29 — 2:00 PM - 5:00 PM
        { type: 'block', rangeMs: [1769688000000, 1769698800000] },
        // Thu Jan 29 — 5:00 PM - 5:05 PM
        { type: 'spacer', rangeMs: [1769698800000, 1769699100000] },
        // Thu Jan 29 — 5:05 PM - 5:45 PM
        { type: 'block', rangeMs: [1769699100000, 1769701500000] },

        // Thu Jan 29 — 5:45 PM - 6:30 PM
        { type: 'spacer', rangeMs: [1769701500000, 1769704200000] },
        // Thu Jan 29 — 6:30 PM
        { type: 'bracket-close', timeMs: 1769704200000 },

        // Fri Jan 30 — 12:30 AM - 4:00 AM
        { type: 'block', rangeMs: [1769725800000, 1769738400000] },
      ],
    },

    {
      id: 'row-G',
      elements: [
        // Tue Jan 27 — 12:00 AM - 12:45 AM
        { type: 'block', rangeMs: [1769472000000, 1769474700000] },
        // Tue Jan 27 — 12:45 AM - 12:50 AM
        { type: 'spacer', rangeMs: [1769474700000, 1769475000000] },
        // Tue Jan 27 — 12:50 AM - 1:20 AM
        { type: 'block', rangeMs: [1769475000000, 1769476800000] },

        // Tue Jan 27 — 2:00 AM
        { type: 'bracket-open', timeMs: 1769479200000 },
        // Tue Jan 27 — 2:00 AM - Tue Jan 27 6:40 PM
        { type: 'spacer', rangeMs: [1769479200000, 1769540000000] },
        // Tue Jan 27 — 6:40 PM
        { type: 'marker', timeMs: 1769540000000 },
        // Tue Jan 27 — 6:40 PM - Wed Jan 28 6:00 AM
        { type: 'spacer', rangeMs: [1769540000000, 1769580000000] },
        // Wed Jan 28 — 6:00 AM
        { type: 'marker', timeMs: 1769580000000 },
        // Wed Jan 28 — 6:00 AM - Wed Jan 28 12:30 PM
        { type: 'spacer', rangeMs: [1769580000000, 1769603400000] },

        // Wed Jan 28 — 12:30 PM - 2:00 PM
        { type: 'block', rangeMs: [1769603400000, 1769608800000] },
        // Wed Jan 28 — 2:00 PM - 2:05 PM
        { type: 'spacer', rangeMs: [1769608800000, 1769609100000] },
        // Wed Jan 28 — 2:05 PM - 2:45 PM
        { type: 'block', rangeMs: [1769609100000, 1769611500000] },

        // Thu Jan 29 — 9:30 AM - 11:30 AM
        { type: 'block', rangeMs: [1769679000000, 1769686200000] },
        // Thu Jan 29 — 11:30 AM - 11:35 AM
        { type: 'spacer', rangeMs: [1769686200000, 1769686500000] },
        // Thu Jan 29 — 11:35 AM - 12:15 PM
        { type: 'block', rangeMs: [1769686500000, 1769688900000] },

        // Thu Jan 29 — 12:15 PM - 1:00 PM
        { type: 'spacer', rangeMs: [1769688900000, 1769691600000] },
        // Thu Jan 29 — 1:00 PM
        { type: 'bracket-close', timeMs: 1769691600000 },

        // Fri Jan 30 — 5:00 AM - 7:30 AM
        { type: 'block', rangeMs: [1769749200000, 1769758200000] },
        // Fri Jan 30 — 7:30 AM - 7:50 AM
        { type: 'spacer', rangeMs: [1769758200000, 1769759400000] },
        // Fri Jan 30 — 7:50 AM
        { type: 'bracket-close', timeMs: 1769759400000 },
      ],
    },

    {
      id: 'row-H',
      elements: [
        // Tue Jan 27 — 4:30 AM - 5:15 AM
        { type: 'block', rangeMs: [1769488200000, 1769490900000] },
        // Tue Jan 27 — 5:15 AM - 5:20 AM
        { type: 'spacer', rangeMs: [1769490900000, 1769491200000] },
        // Tue Jan 27 — 5:20 AM - 5:50 AM
        { type: 'block', rangeMs: [1769491200000, 1769493000000] },

        // Tue Jan 27 — 6:00 AM
        { type: 'bracket-open', timeMs: 1769493600000 },
        // Tue Jan 27 — 6:00 AM - 8:10 AM
        { type: 'spacer', rangeMs: [1769493600000, 1769502000000] },
        // Tue Jan 27 — 8:10 AM
        { type: 'marker', timeMs: 1769502000000 },
        // Tue Jan 27 — 8:10 AM - 12:00 PM
        { type: 'spacer', rangeMs: [1769502000000, 1769515200000] },

        // Tue Jan 27 — 12:00 PM - 2:30 PM
        { type: 'block', rangeMs: [1769515200000, 1769524200000] },
        // Tue Jan 27 — 2:30 PM - 2:35 PM
        { type: 'spacer', rangeMs: [1769524200000, 1769524500000] },
        // Tue Jan 27 — 2:35 PM - 3:15 PM
        { type: 'block', rangeMs: [1769524500000, 1769526900000] },

        // Wed Jan 28 — 10:40 PM
        { type: 'bracket-open', timeMs: 1769640000000 },
        // Wed Jan 28 — 10:40 PM - 11:10 PM
        { type: 'spacer', rangeMs: [1769640000000, 1769641800000] },
        // Wed Jan 28 — 11:10 PM
        { type: 'bracket-close', timeMs: 1769641800000 },

        // Thu Jan 29 — 6:30 PM - 9:00 PM
        { type: 'block', rangeMs: [1769711400000, 1769720400000] },
        // Thu Jan 29 — 9:00 PM - 9:05 PM
        { type: 'spacer', rangeMs: [1769720400000, 1769720700000] },
        // Thu Jan 29 — 9:05 PM - 9:45 PM
        { type: 'block', rangeMs: [1769720700000, 1769723100000] },

        // Thu Jan 29 — 9:45 PM - 10:30 PM
        { type: 'spacer', rangeMs: [1769723100000, 1769725800000] },
        // Thu Jan 29 — 10:30 PM
        { type: 'bracket-close', timeMs: 1769725800000 },

        // Fri Jan 30 — 2:30 AM - 3:45 AM
        { type: 'block', rangeMs: [1769740200000, 1769744700000] },
      ],
    },

    {
      id: 'row-I',
      elements: [
        // Tue Jan 27 — 8:00 PM - 10:00 PM
        { type: 'block', rangeMs: [1769544000000, 1769551200000] },
        // Tue Jan 27 — 10:00 PM - 10:05 PM
        { type: 'spacer', rangeMs: [1769551200000, 1769551500000] },
        // Tue Jan 27 — 10:05 PM - 10:45 PM
        { type: 'block', rangeMs: [1769551500000, 1769553900000] },

        // Tue Jan 27 — 11:06 PM
        { type: 'bracket-open', timeMs: 1769559960000 },
        // Tue Jan 27 — 11:06 PM - Wed Jan 28 12:00 AM
        { type: 'spacer', rangeMs: [1769559960000, 1769562000000] },
        // Wed Jan 28 — 12:00 AM
        { type: 'bracket-close', timeMs: 1769562000000 },

        // Wed Jan 28 — 4:30 AM - 6:00 AM
        { type: 'block', rangeMs: [1769574600000, 1769580000000] },
        // Wed Jan 28 — 6:00 AM - 6:05 AM
        { type: 'spacer', rangeMs: [1769580000000, 1769580300000] },
        // Wed Jan 28 — 6:05 AM - 6:45 AM
        { type: 'block', rangeMs: [1769580300000, 1769582700000] },

        // Wed Jan 28 — 7:00 AM
        { type: 'bracket-open', timeMs: 1769583600000 },
        // Wed Jan 28 — 7:00 AM - 1:20 PM
        { type: 'spacer', rangeMs: [1769583600000, 1769608000000] },
        // Wed Jan 28 — 1:20 PM
        { type: 'marker', timeMs: 1769608000000 },
        // Wed Jan 28 — 1:20 PM - 3:20 PM
        { type: 'spacer', rangeMs: [1769608000000, 1769616000000] },
        // Wed Jan 28 — 3:20 PM
        { type: 'marker', timeMs: 1769616000000 },
        // Wed Jan 28 — 3:20 PM - 7:30 PM
        { type: 'spacer', rangeMs: [1769616000000, 1769628600000] },

        // Wed Jan 28 — 7:30 PM - 10:30 PM
        { type: 'block', rangeMs: [1769628600000, 1769639400000] },
        // Wed Jan 28 — 10:30 PM - 10:35 PM
        { type: 'spacer', rangeMs: [1769639400000, 1769639700000] },
        // Wed Jan 28 — 10:35 PM - 11:15 PM
        { type: 'block', rangeMs: [1769639700000, 1769642100000] },

        // Thu Jan 29 — 12:00 PM - 1:00 PM
        { type: 'block', rangeMs: [1769688000000, 1769691600000] },

        // Thu Jan 29 — 1:00 PM - 2:00 PM
        { type: 'spacer', rangeMs: [1769691600000, 1769695200000] },
        // Thu Jan 29 — 2:00 PM
        { type: 'bracket-close', timeMs: 1769695200000 },

        // Fri Jan 30 — 7:00 AM - 8:00 AM
        { type: 'block', rangeMs: [1769756400000, 1769760000000] },
      ],
    },

    {
      id: 'row-J',
      elements: [
        // Tue Jan 27 — 1:00 AM - 1:45 AM
        { type: 'block', rangeMs: [1769475600000, 1769478300000] },
        // Tue Jan 27 — 1:45 AM - 1:50 AM
        { type: 'spacer', rangeMs: [1769478300000, 1769478600000] },
        // Tue Jan 27 — 1:50 AM - 2:20 AM
        { type: 'block', rangeMs: [1769478600000, 1769480400000] },

        // Tue Jan 27 — 8:15 AM - 9:00 AM
        { type: 'block', rangeMs: [1769501700000, 1769504400000] },
        // Tue Jan 27 — 9:00 AM - 9:05 AM
        { type: 'spacer', rangeMs: [1769504400000, 1769504700000] },
        // Tue Jan 27 — 9:05 AM - 9:40 AM
        { type: 'block', rangeMs: [1769504700000, 1769506800000] },

        // Tue Jan 27 — 9:40 PM
        { type: 'bracket-open', timeMs: 1769550000000 },
        // Tue Jan 27 — 9:40 PM - 10:00 PM
        { type: 'spacer', rangeMs: [1769550000000, 1769551200000] },
        // Tue Jan 27 — 10:00 PM
        { type: 'marker', timeMs: 1769551200000 },
        // Tue Jan 27 — 10:00 PM - 10:30 PM
        { type: 'spacer', rangeMs: [1769551200000, 1769553000000] },
        // Tue Jan 27 — 10:30 PM
        { type: 'bracket-close', timeMs: 1769553000000 },

        // Wed Jan 28 — 12:00 PM - 1:30 PM
        { type: 'block', rangeMs: [1769601600000, 1769607000000] },
        // Wed Jan 28 — 1:30 PM - 1:35 PM
        { type: 'spacer', rangeMs: [1769607000000, 1769607300000] },
        // Wed Jan 28 — 1:35 PM - 2:15 PM
        { type: 'block', rangeMs: [1769607300000, 1769609700000] },

        // Wed Jan 28 — 2:15 PM - 3:00 PM
        { type: 'spacer', rangeMs: [1769609700000, 1769612400000] },
        // Wed Jan 28 — 3:00 PM
        { type: 'bracket-close', timeMs: 1769612400000 },

        // Thu Jan 29 — 8:00 AM - 9:30 AM
        { type: 'block', rangeMs: [1769683200000, 1769688600000] },

        // Fri Jan 30 — 1:00 AM - 2:30 AM
        { type: 'block', rangeMs: [1769731200000, 1769736600000] },
      ],
    },

    {
      id: 'row-K',
      elements: [
        // Tue Jan 27 — 3:30 AM - 5:00 AM
        { type: 'block', rangeMs: [1769484600000, 1769490000000] },
        // Tue Jan 27 — 5:00 AM - 5:05 AM
        { type: 'spacer', rangeMs: [1769490000000, 1769490300000] },
        // Tue Jan 27 — 5:05 AM - 5:35 AM
        { type: 'block', rangeMs: [1769490300000, 1769492100000] },

        // Tue Jan 27 — 6:00 AM
        { type: 'bracket-open', timeMs: 1769493600000 },
        // Tue Jan 27 — 6:00 AM - 8:00 AM
        { type: 'spacer', rangeMs: [1769493600000, 1769500800000] },
        // Tue Jan 27 — 8:00 AM
        { type: 'marker', timeMs: 1769500800000 },
        // Tue Jan 27 — 8:00 AM - 11:00 AM
        { type: 'spacer', rangeMs: [1769500800000, 1769511600000] },

        // Tue Jan 27 — 11:00 AM - 12:00 PM
        { type: 'block', rangeMs: [1769511600000, 1769515200000] },
        // Tue Jan 27 — 12:00 PM - 12:05 PM
        { type: 'spacer', rangeMs: [1769515200000, 1769515500000] },
        // Tue Jan 27 — 12:05 PM - 12:45 PM
        { type: 'block', rangeMs: [1769515500000, 1769517900000] },

        // Wed Jan 28 — 6:00 AM - 7:00 AM
        { type: 'block', rangeMs: [1769580000000, 1769583600000] },
        // Wed Jan 28 — 7:00 AM - 7:05 AM
        { type: 'spacer', rangeMs: [1769583600000, 1769583900000] },
        // Wed Jan 28 — 7:05 AM - 7:45 AM
        { type: 'block', rangeMs: [1769583900000, 1769586300000] },

        // Wed Jan 28 — 8:46 AM
        { type: 'bracket-open', timeMs: 1769589960000 },
        // Wed Jan 28 — 8:46 AM - 9:00 AM
        { type: 'spacer', rangeMs: [1769589960000, 1769590800000] },
        // Wed Jan 28 — 9:00 AM
        { type: 'bracket-close', timeMs: 1769590800000 },

        // Wed Jan 28 — 1:45 PM - 3:15 PM
        { type: 'block', rangeMs: [1769607900000, 1769613300000] },

        // Wed Jan 28 — 3:15 PM - 3:45 PM
        { type: 'spacer', rangeMs: [1769613300000, 1769615100000] },
        // Wed Jan 28 — 3:45 PM
        { type: 'bracket-close', timeMs: 1769615100000 },

        // Thu Jan 29 — 5:00 PM - 7:00 PM
        { type: 'block', rangeMs: [1769710800000, 1769718000000] },

        // Fri Jan 30 — 3:00 AM - 4:30 AM
        { type: 'block', rangeMs: [1769738400000, 1769743800000] },
      ],
    },

    {
      id: 'row-L',
      elements: [
        // Tue Jan 27 — 6:45 AM - 7:30 AM
        { type: 'block', rangeMs: [1769496300000, 1769499000000] },
        // Tue Jan 27 — 7:30 AM - 7:35 AM
        { type: 'spacer', rangeMs: [1769499000000, 1769499300000] },
        // Tue Jan 27 — 7:35 AM - 8:05 AM
        { type: 'block', rangeMs: [1769499300000, 1769501100000] },

        // Tue Jan 27 — 11:33 AM
        { type: 'bracket-open', timeMs: 1769511960000 },
        // Tue Jan 27 — 11:33 AM - 11:53 AM
        { type: 'spacer', rangeMs: [1769511960000, 1769513200000] },
        // Tue Jan 27 — 11:53 AM
        { type: 'marker', timeMs: 1769513200000 },
        // Tue Jan 27 — 11:53 AM - 12:23 PM
        { type: 'spacer', rangeMs: [1769513200000, 1769514960000] },
        // Tue Jan 27 — 12:23 PM
        { type: 'bracket-close', timeMs: 1769514960000 },

        // Tue Jan 27 — 1:00 PM - 2:00 PM
        { type: 'block', rangeMs: [1769518800000, 1769522400000] },
        // Tue Jan 27 — 2:00 PM - 2:05 PM
        { type: 'spacer', rangeMs: [1769522400000, 1769522700000] },
        // Tue Jan 27 — 2:05 PM - 2:45 PM
        { type: 'block', rangeMs: [1769522700000, 1769525100000] },

        // Wed Jan 28 — 9:30 AM - 10:30 AM
        { type: 'block', rangeMs: [1769592600000, 1769596200000] },

        // Wed Jan 28 — 10:30 AM - 11:00 AM
        { type: 'spacer', rangeMs: [1769596200000, 1769598000000] },
        // Wed Jan 28 — 11:00 AM
        { type: 'bracket-close', timeMs: 1769598000000 },

        // Wed Jan 28 — 6:30 PM - 8:00 PM
        { type: 'block', rangeMs: [1769632200000, 1769637600000] },

        // Thu Jan 29 — 10:00 AM - 12:00 PM
        { type: 'block', rangeMs: [1769689200000, 1769696400000] },

        // Fri Jan 30 — 5:30 AM - 7:00 AM
        { type: 'block', rangeMs: [1769751000000, 1769756400000] },
      ],
    },

    {
      id: 'row-M',
      elements: [
        // Tue Jan 27 — 12:45 AM - 1:30 AM
        { type: 'block', rangeMs: [1769474700000, 1769477400000] },
        // Tue Jan 27 — 1:30 AM - 1:35 AM
        { type: 'spacer', rangeMs: [1769477400000, 1769477700000] },
        // Tue Jan 27 — 1:35 AM - 2:05 AM
        { type: 'block', rangeMs: [1769477700000, 1769479500000] },

        // Tue Jan 27 — 2:30 AM
        { type: 'bracket-open', timeMs: 1769481000000 },
        // Tue Jan 27 — 2:30 AM - 7:46 AM
        { type: 'spacer', rangeMs: [1769481000000, 1769500000000] },
        // Tue Jan 27 — 7:46 AM
        { type: 'marker', timeMs: 1769500000000 },
        // Tue Jan 27 — 7:46 AM - 1:20 PM
        { type: 'spacer', rangeMs: [1769500000000, 1769520000000] },
        // Tue Jan 27 — 1:20 PM
        { type: 'marker', timeMs: 1769520000000 },
        // Tue Jan 27 — 1:20 PM - 4:00 PM
        { type: 'spacer', rangeMs: [1769520000000, 1769532000000] },

        // Tue Jan 27 — 4:00 PM - 5:30 PM
        { type: 'block', rangeMs: [1769532000000, 1769537400000] },
        // Tue Jan 27 — 5:30 PM - 5:35 PM
        { type: 'spacer', rangeMs: [1769537400000, 1769537700000] },
        // Tue Jan 27 — 5:35 PM - 6:15 PM
        { type: 'block', rangeMs: [1769537700000, 1769540100000] },

        // Wed Jan 28 — 7:00 AM - 8:30 AM
        { type: 'block', rangeMs: [1769583600000, 1769589000000] },

        // Wed Jan 28 — 11:00 AM - 12:30 PM
        { type: 'block', rangeMs: [1769598000000, 1769603400000] },

        // Wed Jan 28 — 11:40 PM
        { type: 'bracket-open', timeMs: 1769646000000 },
        // Wed Jan 28 — 11:40 PM - Thu Jan 29 12:30 AM
        { type: 'spacer', rangeMs: [1769646000000, 1769649000000] },
        // Thu Jan 29 — 12:30 AM
        { type: 'bracket-close', timeMs: 1769649000000 },

        // Thu Jan 29 — 3:00 PM - 4:30 PM
        { type: 'block', rangeMs: [1769695200000, 1769700600000] },

        // Thu Jan 29 — 4:30 PM - 5:00 PM
        { type: 'spacer', rangeMs: [1769700600000, 1769702400000] },
        // Thu Jan 29 — 5:00 PM
        { type: 'bracket-close', timeMs: 1769702400000 },

        // Fri Jan 30 — 12:00 AM - 1:00 AM
        { type: 'block', rangeMs: [1769724000000, 1769727600000] },
      ],
    },

    {
      id: 'row-N',
      elements: [
        // Tue Jan 27 — 7:30 AM - 9:00 AM
        { type: 'block', rangeMs: [1769499000000, 1769504400000] },
        // Tue Jan 27 — 9:00 AM - 9:05 AM
        { type: 'spacer', rangeMs: [1769504400000, 1769504700000] },
        // Tue Jan 27 — 9:05 AM - 9:45 AM
        { type: 'block', rangeMs: [1769504700000, 1769507100000] },

        // Tue Jan 27 — 2:30 PM - 4:00 PM
        { type: 'block', rangeMs: [1769524200000, 1769529600000] },
        // Tue Jan 27 — 4:00 PM - 4:05 PM
        { type: 'spacer', rangeMs: [1769529600000, 1769529900000] },
        // Tue Jan 27 — 4:05 PM - 4:45 PM
        { type: 'block', rangeMs: [1769529900000, 1769532300000] },

        // Tue Jan 27 — 5:00 PM
        { type: 'bracket-open', timeMs: 1769533200000 },
        // Tue Jan 27 — 5:00 PM - Tue Jan 27 9:10 PM
        { type: 'spacer', rangeMs: [1769533200000, 1769550000000] },
        // Tue Jan 27 — 9:10 PM
        { type: 'marker', timeMs: 1769550000000 },
        // Tue Jan 27 — 9:10 PM - Wed Jan 28 2:00 AM
        { type: 'spacer', rangeMs: [1769550000000, 1769565600000] },

        // Wed Jan 28 — 2:00 AM - 3:30 AM
        { type: 'block', rangeMs: [1769565600000, 1769571000000] },

        // Wed Jan 28 — 9:43 AM
        { type: 'bracket-open', timeMs: 1769599800000 },
        // Wed Jan 28 — 9:43 AM - 10:00 AM
        { type: 'spacer', rangeMs: [1769599800000, 1769600400000] },
        // Wed Jan 28 — 10:00 AM
        { type: 'marker', timeMs: 1769600400000 },
        // Wed Jan 28 — 10:00 AM - 10:30 AM
        { type: 'spacer', rangeMs: [1769600400000, 1769601600000] },
        // Wed Jan 28 — 10:30 AM
        { type: 'bracket-close', timeMs: 1769601600000 },

        // Wed Jan 28 — 5:00 PM - 6:30 PM
        { type: 'block', rangeMs: [1769627400000, 1769632800000] },

        // Wed Jan 28 — 6:30 PM - 8:00 PM
        { type: 'spacer', rangeMs: [1769632800000, 1769637600000] },
        // Wed Jan 28 — 8:00 PM
        { type: 'bracket-close', timeMs: 1769637600000 },

        // Thu Jan 29 — 7:00 AM - 8:30 AM
        { type: 'block', rangeMs: [1769679600000, 1769685000000] },

        // Fri Jan 30 — 6:00 AM - 8:00 AM
        { type: 'block', rangeMs: [1769752800000, 1769760000000] },
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
        { type: 'bracket-open', timeMs: 1769299200000 },
        // Sat Jan 25 — 12:00 AM - 1:20 AM
        { type: 'spacer', rangeMs: [1769299200000, 1769304000000] },
        // Sat Jan 25 — 1:20 AM
        { type: 'marker', timeMs: 1769304000000 },
        // Sat Jan 25 — 1:20 AM - 2:10 AM
        { type: 'spacer', rangeMs: [1769304000000, 1769307000000] },
        // Sat Jan 25 — 2:10 AM - 3:10 AM
        { type: 'block', rangeMs: [1769307000000, 1769310600000] },
        // Sat Jan 25 — 3:10 AM - 3:40 AM
        { type: 'spacer', rangeMs: [1769310600000, 1769312400000] },
        // Sat Jan 25 — 3:40 AM - 4:20 AM
        { type: 'block', rangeMs: [1769312400000, 1769314800000] },
        // Sat Jan 25 — 4:20 AM
        { type: 'bracket-close', timeMs: 1769314800000 },

        // Sun Jan 26 — 9:30 AM - 11:00 AM
        { type: 'block', rangeMs: [1769439000000, 1769444400000] },
        // Sun Jan 26 — 11:00 AM - 11:05 AM
        { type: 'spacer', rangeMs: [1769444400000, 1769444700000] },
        // Sun Jan 26 — 11:05 AM - 11:45 AM
        { type: 'block', rangeMs: [1769444700000, 1769447100000] },

        // --- CANONICAL OVERLAP COPY (from ROWS) ---
        // Tue Jan 27 — 12:00 AM
        { type: 'bracket-open', timeMs: 1769472000000 },
        // Tue Jan 27 — 12:00 AM - 12:30 AM
        { type: 'spacer', rangeMs: [1769472000000, 1769473800000] },

        // Tue Jan 27 — 12:30 AM - 2:00 AM
        { type: 'block', rangeMs: [1769473800000, 1769479200000] },
        // Tue Jan 27 — 2:00 AM - 2:05 AM
        { type: 'spacer', rangeMs: [1769479200000, 1769479500000] },
        // Tue Jan 27 — 2:05 AM - 2:45 AM
        { type: 'block', rangeMs: [1769479500000, 1769481900000] },
        // Tue Jan 27 — 2:45 AM - 2:50 AM
        { type: 'spacer', rangeMs: [1769481900000, 1769482200000] },
        // Tue Jan 27 — 2:50 AM - 3:30 AM
        { type: 'block', rangeMs: [1769482200000, 1769484600000] },

        // Tue Jan 27 — 3:30 AM - 4:00 AM
        { type: 'spacer', rangeMs: [1769484600000, 1769486400000] },
        // Tue Jan 27 — 4:00 AM
        { type: 'bracket-close', timeMs: 1769486400000 },

        // Tue Jan 27 — 4:10 AM
        { type: 'marker', timeMs: 1769487000000 },

        // Tue Jan 27 — 4:15 AM
        { type: 'bracket-open', timeMs: 1769487300000 },
        // Tue Jan 27 — 4:15 AM - 7:30 AM
        { type: 'spacer', rangeMs: [1769487300000, 1769499000000] },
        // Tue Jan 27 — 7:30 AM
        { type: 'marker', timeMs: 1769499000000 },
        // Tue Jan 27 — 7:30 AM - 8:40 AM
        { type: 'spacer', rangeMs: [1769499000000, 1769503200000] },
        // Tue Jan 27 — 8:40 AM
        { type: 'marker', timeMs: 1769503200000 },
        // Tue Jan 27 — 8:40 AM - 10:30 AM
        { type: 'spacer', rangeMs: [1769503200000, 1769509800000] },

        // Tue Jan 27 — 10:30 AM - 12:00 PM
        { type: 'block', rangeMs: [1769509800000, 1769515200000] },
        // Tue Jan 27 — 12:00 PM - 12:05 PM
        { type: 'spacer', rangeMs: [1769515200000, 1769515500000] },
        // Tue Jan 27 — 12:05 PM - 12:45 PM
        { type: 'block', rangeMs: [1769515500000, 1769517900000] },
        // Tue Jan 27 — 12:45 PM - 12:50 PM
        { type: 'spacer', rangeMs: [1769517900000, 1769518200000] },
        // Tue Jan 27 — 12:50 PM - 1:20 PM
        { type: 'block', rangeMs: [1769518200000, 1769520000000] },
      ],
    },

    {
      id: 'row-B',
      elements: [
        // Sat Jan 25 — 6:00 AM - 7:30 AM
        { type: 'block', rangeMs: [1769320800000, 1769326200000] },
        // Sat Jan 25 — 7:30 AM - 7:40 AM
        { type: 'spacer', rangeMs: [1769326200000, 1769326800000] },
        // Sat Jan 25 — 7:40 AM
        { type: 'marker', timeMs: 1769326800000 },
        // Sat Jan 25 — 7:40 AM - 8:10 AM
        { type: 'spacer', rangeMs: [1769326800000, 1769328600000] },
        // Sat Jan 25 — 8:10 AM - 9:00 AM
        { type: 'block', rangeMs: [1769328600000, 1769331600000] },

        // --- CANONICAL OVERLAP COPY (from ROWS) ---
        // Tue Jan 27 — 2:00 AM - 4:00 AM
        { type: 'block', rangeMs: [1769479200000, 1769486400000] },
        // Tue Jan 27 — 4:00 AM - 4:05 AM
        { type: 'spacer', rangeMs: [1769486400000, 1769486700000] },
        // Tue Jan 27 — 4:05 AM - 4:45 AM
        { type: 'block', rangeMs: [1769486700000, 1769489100000] },
        // Tue Jan 27 — 4:45 AM - 4:50 AM
        { type: 'spacer', rangeMs: [1769489100000, 1769489400000] },
        // Tue Jan 27 — 4:50 AM - 5:20 AM
        { type: 'block', rangeMs: [1769489400000, 1769491200000] },

        // Tue Jan 27 — 5:25 AM
        { type: 'bracket-open', timeMs: 1769491500000 },
        // Tue Jan 27 — 5:25 AM - 5:40 AM
        { type: 'spacer', rangeMs: [1769491500000, 1769492400000] },
        // Tue Jan 27 — 5:40 AM
        { type: 'marker', timeMs: 1769492400000 },
        // Tue Jan 27 — 5:40 AM - 6:00 AM
        { type: 'spacer', rangeMs: [1769492400000, 1769493600000] },

        // Tue Jan 27 — 6:00 AM - 8:00 AM
        { type: 'block', rangeMs: [1769493600000, 1769500800000] },
        // Tue Jan 27 — 8:00 AM - 8:05 AM
        { type: 'spacer', rangeMs: [1769500800000, 1769501100000] },
        // Tue Jan 27 — 8:05 AM - 8:40 AM
        { type: 'block', rangeMs: [1769501100000, 1769503200000] },

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
        { type: 'bracket-open', timeMs: 1769385600000 },
        // Sun Jan 26 — 12:00 AM - 12:45 AM
        { type: 'spacer', rangeMs: [1769385600000, 1769388300000] },
        // Sun Jan 26 — 12:45 AM
        { type: 'marker', timeMs: 1769388300000 },
        // Sun Jan 26 — 12:45 AM - 1:30 AM
        { type: 'spacer', rangeMs: [1769388300000, 1769391000000] },
        // Sun Jan 26 — 1:30 AM - 3:00 AM
        { type: 'block', rangeMs: [1769391000000, 1769396400000] },
        // Sun Jan 26 — 3:00 AM
        { type: 'bracket-close', timeMs: 1769396400000 },

        // --- CANONICAL OVERLAP COPY (from ROWS) ---
        // Tue Jan 27 — 5:30 AM - 7:00 AM
        { type: 'block', rangeMs: [1769491800000, 1769497200000] },
        // Tue Jan 27 — 7:00 AM - 7:05 AM
        { type: 'spacer', rangeMs: [1769497200000, 1769497500000] },
        // Tue Jan 27 — 7:05 AM - 7:35 AM
        { type: 'block', rangeMs: [1769497500000, 1769499300000] },

        // Tue Jan 27 — 3:00 PM - 6:00 PM
        { type: 'block', rangeMs: [1769526000000, 1769536800000] },
        // Tue Jan 27 — 6:00 PM - 6:05 PM
        { type: 'spacer', rangeMs: [1769536800000, 1769537100000] },
        // Tue Jan 27 — 6:05 PM - 6:45 PM
        { type: 'block', rangeMs: [1769537100000, 1769539500000] },

        // Tue Jan 27 — 6:45 PM - 6:46 PM
        { type: 'spacer', rangeMs: [1769539500000, 1769540160000] },
        // Tue Jan 27 — 6:46 PM
        { type: 'bracket-close', timeMs: 1769540160000 },

        // Tue Jan 27 — 6:50 PM
        { type: 'bracket-open', timeMs: 1769540400000 },
        // Tue Jan 27 — 6:50 PM - Wed Jan 28 1:46 AM
        { type: 'spacer', rangeMs: [1769540400000, 1769564000000] },
        // Wed Jan 28 — 1:46 AM
        { type: 'marker', timeMs: 1769564000000 },
        // Wed Jan 28 — 1:46 AM - Wed Jan 28 12:26 PM
        { type: 'spacer', rangeMs: [1769564000000, 1769600000000] },
      ],
    },

    {
      id: 'row-D',
      elements: [
        // Sat Jan 25 — 12:00 PM - 1:30 PM
        { type: 'block', rangeMs: [1769342400000, 1769347800000] },
        // Sat Jan 25 — 1:30 PM - 1:40 PM
        { type: 'spacer', rangeMs: [1769347800000, 1769348400000] },
        // Sat Jan 25 — 1:40 PM
        { type: 'marker', timeMs: 1769348400000 },
        // Sat Jan 25 — 1:40 PM - 2:10 PM
        { type: 'spacer', rangeMs: [1769348400000, 1769350200000] },
        // Sat Jan 25 — 2:10 PM - 3:00 PM
        { type: 'block', rangeMs: [1769350200000, 1769353200000] },

        // --- CANONICAL OVERLAP COPY (from ROWS) ---
        // Wed Jan 28 — 1:00 AM - 4:00 AM
        { type: 'block', rangeMs: [1769562000000, 1769572800000] },
        // Wed Jan 28 — 4:00 AM - 4:05 AM
        { type: 'spacer', rangeMs: [1769572800000, 1769573100000] },
        // Wed Jan 28 — 4:05 AM - 4:45 AM
        { type: 'block', rangeMs: [1769573100000, 1769575500000] },

        // Wed Jan 28 — 5:10 AM
        { type: 'bracket-open', timeMs: 1769577000000 },
        // Wed Jan 28 — 5:10 AM - 7:00 AM
        { type: 'spacer', rangeMs: [1769577000000, 1769583600000] },
        // Wed Jan 28 — 7:00 AM
        { type: 'marker', timeMs: 1769583600000 },
        // Wed Jan 28 — 7:00 AM - 10:00 AM
        { type: 'spacer', rangeMs: [1769583600000, 1769594400000] },
      ],
    },

    {
      id: 'row-E',
      elements: [
        // Sun Jan 26 — 6:00 PM
        { type: 'marker', timeMs: 1769450400000 },

        // --- CANONICAL OVERLAP COPY (from ROWS) ---
        // Tue Jan 27 — 9:00 AM - 10:00 AM
        { type: 'block', rangeMs: [1769504400000, 1769508000000] },
        // Tue Jan 27 — 10:00 AM - 10:05 AM
        { type: 'spacer', rangeMs: [1769508000000, 1769508300000] },
        // Tue Jan 27 — 10:05 AM - 10:45 AM
        { type: 'block', rangeMs: [1769508300000, 1769510700000] },

        // Tue Jan 27 — 6:39 PM
        { type: 'bracket-open', timeMs: 1769539980000 },
        // Tue Jan 27 — 6:39 PM - 8:00 PM
        { type: 'spacer', rangeMs: [1769539980000, 1769544000000] },
        // Tue Jan 27 — 8:00 PM
        { type: 'bracket-close', timeMs: 1769544000000 },

        // Wed Jan 28 — 12:00 AM
        { type: 'marker', timeMs: 1769562000000 },
      ],
    },

    {
      id: 'row-F',
      elements: [
        // Sat Jan 25 — 9:00 PM - 10:30 PM
        { type: 'block', rangeMs: [1769374800000, 1769380200000] },
        // Sat Jan 25 — 10:30 PM - 10:40 PM
        { type: 'spacer', rangeMs: [1769380200000, 1769380800000] },
        // Sat Jan 25 — 10:40 PM
        { type: 'marker', timeMs: 1769380800000 },
        // Sat Jan 25 — 10:40 PM - 11:10 PM
        { type: 'spacer', rangeMs: [1769380800000, 1769382600000] },

        // --- CANONICAL OVERLAP COPY (from ROWS) ---
        // Tue Jan 27 — 6:00 PM - 8:00 PM
        { type: 'block', rangeMs: [1769536800000, 1769544000000] },
        // Tue Jan 27 — 8:00 PM - 8:05 PM
        { type: 'spacer', rangeMs: [1769544000000, 1769544300000] },
        // Tue Jan 27 — 8:05 PM - 8:45 PM
        { type: 'block', rangeMs: [1769544300000, 1769546700000] },

        // Tue Jan 27 — 11:20 PM
        { type: 'bracket-open', timeMs: 1769556000000 },
        // Tue Jan 27 — 11:20 PM - 11:40 PM
        { type: 'spacer', rangeMs: [1769556000000, 1769557200000] },
        // Tue Jan 27 — 11:40 PM
        { type: 'marker', timeMs: 1769557200000 },
        // Tue Jan 27 — 11:40 PM - Wed Jan 28 12:10 AM
        { type: 'spacer', rangeMs: [1769557200000, 1769559000000] },
        // Wed Jan 28 — 12:10 AM
        { type: 'bracket-close', timeMs: 1769559000000 },

        // Wed Jan 28 — 5:30 AM - 7:30 AM
        { type: 'block', rangeMs: [1769578200000, 1769585400000] },
        // Wed Jan 28 — 7:30 AM - 7:35 AM
        { type: 'spacer', rangeMs: [1769585400000, 1769585700000] },
        // Wed Jan 28 — 7:35 AM - 8:15 AM
        { type: 'block', rangeMs: [1769585700000, 1769588100000] },
      ],
    },

    {
      id: 'row-G',
      elements: [
        // Sun Jan 26 — 3:00 AM - 4:00 AM
        { type: 'block', rangeMs: [1769396400000, 1769400000000] },

        // --- CANONICAL OVERLAP COPY (from ROWS) ---
        // Tue Jan 27 — 12:00 AM - 12:45 AM
        { type: 'block', rangeMs: [1769472000000, 1769474700000] },
        // Tue Jan 27 — 12:45 AM - 12:50 AM
        { type: 'spacer', rangeMs: [1769474700000, 1769475000000] },
        // Tue Jan 27 — 12:50 AM - 1:20 AM
        { type: 'block', rangeMs: [1769475000000, 1769476800000] },

        // Tue Jan 27 — 2:00 AM
        { type: 'bracket-open', timeMs: 1769479200000 },
        // Tue Jan 27 — 2:00 AM - Tue Jan 27 6:40 PM
        { type: 'spacer', rangeMs: [1769479200000, 1769540000000] },
        // Tue Jan 27 — 6:40 PM
        { type: 'marker', timeMs: 1769540000000 },
        // Tue Jan 27 — 6:40 PM - Wed Jan 28 6:00 AM
        { type: 'spacer', rangeMs: [1769540000000, 1769580000000] },
        // Wed Jan 28 — 6:00 AM
        { type: 'marker', timeMs: 1769580000000 },
        // Wed Jan 28 — 6:00 AM - Wed Jan 28 12:30 PM
        { type: 'spacer', rangeMs: [1769580000000, 1769603400000] },
      ],
    },

    {
      id: 'row-H',
      elements: [
        // Sun Jan 26 — 8:00 PM - 9:30 PM
        { type: 'block', rangeMs: [1769462400000, 1769467800000] },

        // --- CANONICAL OVERLAP COPY (from ROWS) ---
        // Tue Jan 27 — 4:30 AM - 5:15 AM
        { type: 'block', rangeMs: [1769488200000, 1769490900000] },
        // Tue Jan 27 — 5:15 AM - 5:20 AM
        { type: 'spacer', rangeMs: [1769490900000, 1769491200000] },
        // Tue Jan 27 — 5:20 AM - 5:50 AM
        { type: 'block', rangeMs: [1769491200000, 1769493000000] },

        // Tue Jan 27 — 6:00 AM
        { type: 'bracket-open', timeMs: 1769493600000 },
        // Tue Jan 27 — 6:00 AM - 8:10 AM
        { type: 'spacer', rangeMs: [1769493600000, 1769502000000] },
        // Tue Jan 27 — 8:10 AM
        { type: 'marker', timeMs: 1769502000000 },
        // Tue Jan 27 — 8:10 AM - 12:00 PM
        { type: 'spacer', rangeMs: [1769502000000, 1769515200000] },

        // Tue Jan 27 — 12:00 PM - 2:30 PM
        { type: 'block', rangeMs: [1769515200000, 1769524200000] },
        // Tue Jan 27 — 2:30 PM - 2:35 PM
        { type: 'spacer', rangeMs: [1769524200000, 1769524500000] },
        // Tue Jan 27 — 2:35 PM - 3:15 PM
        { type: 'block', rangeMs: [1769524500000, 1769526900000] },
      ],
    },

    {
      id: 'row-I',
      elements: [
        // Sun Jan 26 — 6:00 AM - 7:30 AM
        { type: 'block', rangeMs: [1769407200000, 1769412600000] },

        // --- CANONICAL OVERLAP COPY (from ROWS) ---
        // Tue Jan 27 — 8:00 PM - 10:00 PM
        { type: 'block', rangeMs: [1769544000000, 1769551200000] },
        // Tue Jan 27 — 10:00 PM - 10:05 PM
        { type: 'spacer', rangeMs: [1769551200000, 1769551500000] },
        // Tue Jan 27 — 10:05 PM - 10:45 PM
        { type: 'block', rangeMs: [1769551500000, 1769553900000] },

        // Tue Jan 27 — 11:06 PM
        { type: 'bracket-open', timeMs: 1769559960000 },
        // Tue Jan 27 — 11:06 PM - Wed Jan 28 12:00 AM
        { type: 'spacer', rangeMs: [1769559960000, 1769562000000] },
        // Wed Jan 28 — 12:00 AM
        { type: 'bracket-close', timeMs: 1769562000000 },

        // Wed Jan 28 — 4:30 AM - 6:00 AM
        { type: 'block', rangeMs: [1769574600000, 1769580000000] },
        // Wed Jan 28 — 6:00 AM - 6:05 AM
        { type: 'spacer', rangeMs: [1769580000000, 1769580300000] },
        // Wed Jan 28 — 6:05 AM - 6:45 AM
        { type: 'block', rangeMs: [1769580300000, 1769582700000] },

        // Wed Jan 28 — 7:00 AM
        { type: 'bracket-open', timeMs: 1769583600000 },
        // Wed Jan 28 — 7:00 AM - 1:20 PM
        { type: 'spacer', rangeMs: [1769583600000, 1769608000000] },
      ],
    },

    {
      id: 'row-J',
      elements: [
        // Sat Jan 25 — 2:00 PM
        { type: 'marker', timeMs: 1769352000000 },

        // --- CANONICAL OVERLAP COPY (from ROWS) ---
        // Tue Jan 27 — 1:00 AM - 1:45 AM
        { type: 'block', rangeMs: [1769475600000, 1769478300000] },
        // Tue Jan 27 — 1:45 AM - 1:50 AM
        { type: 'spacer', rangeMs: [1769478300000, 1769478600000] },
        // Tue Jan 27 — 1:50 AM - 2:20 AM
        { type: 'block', rangeMs: [1769478600000, 1769480400000] },

        // Tue Jan 27 — 8:15 AM - 9:00 AM
        { type: 'block', rangeMs: [1769501700000, 1769504400000] },
        // Tue Jan 27 — 9:00 AM - 9:05 AM
        { type: 'spacer', rangeMs: [1769504400000, 1769504700000] },
        // Tue Jan 27 — 9:05 AM - 9:40 AM
        { type: 'block', rangeMs: [1769504700000, 1769506800000] },

        // Tue Jan 27 — 9:40 PM
        { type: 'bracket-open', timeMs: 1769550000000 },
        // Tue Jan 27 — 9:40 PM - 10:00 PM
        { type: 'spacer', rangeMs: [1769550000000, 1769551200000] },
        // Tue Jan 27 — 10:00 PM
        { type: 'marker', timeMs: 1769551200000 },
        // Tue Jan 27 — 10:00 PM - 10:30 PM
        { type: 'spacer', rangeMs: [1769551200000, 1769553000000] },
        // Tue Jan 27 — 10:30 PM
        { type: 'bracket-close', timeMs: 1769553000000 },

        // Wed Jan 28 — 12:00 PM - 1:30 PM
        { type: 'block', rangeMs: [1769601600000, 1769607000000] },
        // Wed Jan 28 — 1:30 PM - 1:35 PM
        { type: 'spacer', rangeMs: [1769607000000, 1769607300000] },
        // Wed Jan 28 — 1:35 PM - 2:15 PM
        { type: 'block', rangeMs: [1769607300000, 1769609700000] },
      ],
    },

    {
      id: 'row-K',
      elements: [
        // Sun Jan 26 — 1:00 PM - 2:30 PM
        { type: 'block', rangeMs: [1769449200000, 1769454600000] },

        // --- CANONICAL OVERLAP COPY (from ROWS) ---
        // Tue Jan 27 — 3:30 AM - 5:00 AM
        { type: 'block', rangeMs: [1769484600000, 1769490000000] },
        // Tue Jan 27 — 5:00 AM - 5:05 AM
        { type: 'spacer', rangeMs: [1769490000000, 1769490300000] },
        // Tue Jan 27 — 5:05 AM - 5:35 AM
        { type: 'block', rangeMs: [1769490300000, 1769492100000] },

        // Tue Jan 27 — 6:00 AM
        { type: 'bracket-open', timeMs: 1769493600000 },
        // Tue Jan 27 — 6:00 AM - 8:00 AM
        { type: 'spacer', rangeMs: [1769493600000, 1769500800000] },
        // Tue Jan 27 — 8:00 AM
        { type: 'marker', timeMs: 1769500800000 },
        // Tue Jan 27 — 8:00 AM - 11:00 AM
        { type: 'spacer', rangeMs: [1769500800000, 1769511600000] },

        // Tue Jan 27 — 11:00 AM - 12:00 PM
        { type: 'block', rangeMs: [1769511600000, 1769515200000] },
        // Tue Jan 27 — 12:00 PM - 12:05 PM
        { type: 'spacer', rangeMs: [1769515200000, 1769515500000] },
        // Tue Jan 27 — 12:05 PM - 12:45 PM
        { type: 'block', rangeMs: [1769515500000, 1769517900000] },

        // Wed Jan 28 — 6:00 AM - 7:00 AM
        { type: 'block', rangeMs: [1769580000000, 1769583600000] },
        // Wed Jan 28 — 7:00 AM - 7:05 AM
        { type: 'spacer', rangeMs: [1769583600000, 1769583900000] },
        // Wed Jan 28 — 7:05 AM - 7:45 AM
        { type: 'block', rangeMs: [1769583900000, 1769586300000] },
      ],
    },

    {
      id: 'row-L',
      elements: [
        // Sat Jan 25 — 5:00 AM
        { type: 'marker', timeMs: 1769317200000 },

        // --- CANONICAL OVERLAP COPY (from ROWS) ---
        // Tue Jan 27 — 6:45 AM - 7:30 AM
        { type: 'block', rangeMs: [1769496300000, 1769499000000] },
        // Tue Jan 27 — 7:30 AM - 7:35 AM
        { type: 'spacer', rangeMs: [1769499000000, 1769499300000] },
        // Tue Jan 27 — 7:35 AM - 8:05 AM
        { type: 'block', rangeMs: [1769499300000, 1769501100000] },

        // Tue Jan 27 — 11:33 AM
        { type: 'bracket-open', timeMs: 1769511960000 },
        // Tue Jan 27 — 11:33 AM - 11:53 AM
        { type: 'spacer', rangeMs: [1769511960000, 1769513200000] },
        // Tue Jan 27 — 11:53 AM
        { type: 'marker', timeMs: 1769513200000 },
        // Tue Jan 27 — 11:53 AM - 12:23 PM
        { type: 'spacer', rangeMs: [1769513200000, 1769514960000] },
        // Tue Jan 27 — 12:23 PM
        { type: 'bracket-close', timeMs: 1769514960000 },

        // Tue Jan 27 — 1:00 PM - 2:00 PM
        { type: 'block', rangeMs: [1769518800000, 1769522400000] },
        // Tue Jan 27 — 2:00 PM - 2:05 PM
        { type: 'spacer', rangeMs: [1769522400000, 1769522700000] },
        // Tue Jan 27 — 2:05 PM - 2:45 PM
        { type: 'block', rangeMs: [1769522700000, 1769525100000] },
      ],
    },

    {
      id: 'row-M',
      elements: [
        // Sun Jan 26 — 10:00 PM
        { type: 'bracket-open', timeMs: 1769464800000 },
        // Sun Jan 26 — 10:00 PM - 10:15 PM
        { type: 'spacer', rangeMs: [1769464800000, 1769465700000] },
        // Sun Jan 26 — 10:15 PM
        { type: 'marker', timeMs: 1769465700000 },
        // Sun Jan 26 — 10:15 PM - 10:40 PM
        { type: 'spacer', rangeMs: [1769465700000, 1769467200000] },
        // Sun Jan 26 — 10:40 PM
        { type: 'bracket-close', timeMs: 1769467200000 },

        // --- CANONICAL OVERLAP COPY (from ROWS) ---
        // Tue Jan 27 — 12:45 AM - 1:30 AM
        { type: 'block', rangeMs: [1769474700000, 1769477400000] },
        // Tue Jan 27 — 1:30 AM - 1:35 AM
        { type: 'spacer', rangeMs: [1769477400000, 1769477700000] },
        // Tue Jan 27 — 1:35 AM - 2:05 AM
        { type: 'block', rangeMs: [1769477700000, 1769479500000] },

        // Tue Jan 27 — 2:30 AM
        { type: 'bracket-open', timeMs: 1769481000000 },
        // Tue Jan 27 — 2:30 AM - 7:46 AM
        { type: 'spacer', rangeMs: [1769481000000, 1769500000000] },
        // Tue Jan 27 — 7:46 AM
        { type: 'marker', timeMs: 1769500000000 },
        // Tue Jan 27 — 7:46 AM - 1:20 PM
        { type: 'spacer', rangeMs: [1769500000000, 1769520000000] },
        // Tue Jan 27 — 1:20 PM
        { type: 'marker', timeMs: 1769520000000 },
        // Tue Jan 27 — 1:20 PM - 4:00 PM
        { type: 'spacer', rangeMs: [1769520000000, 1769532000000] },

        // Tue Jan 27 — 4:00 PM - 5:30 PM
        { type: 'block', rangeMs: [1769532000000, 1769537400000] },
        // Tue Jan 27 — 5:30 PM - 5:35 PM
        { type: 'spacer', rangeMs: [1769537400000, 1769537700000] },
        // Tue Jan 27 — 5:35 PM - 6:15 PM
        { type: 'block', rangeMs: [1769537700000, 1769540100000] },

        // Wed Jan 28 — 7:00 AM - 8:30 AM
        { type: 'block', rangeMs: [1769583600000, 1769589000000] },
      ],
    },

    {
      id: 'row-N',
      elements: [
        // Sat Jan 25 — 7:00 PM - 8:00 PM
        { type: 'block', rangeMs: [1769367600000, 1769371200000] },

        // --- CANONICAL OVERLAP COPY (from ROWS) ---
        // Tue Jan 27 — 7:30 AM - 9:00 AM
        { type: 'block', rangeMs: [1769499000000, 1769504400000] },
        // Tue Jan 27 — 9:00 AM - 9:05 AM
        { type: 'spacer', rangeMs: [1769504400000, 1769504700000] },
        // Tue Jan 27 — 9:05 AM - 9:45 AM
        { type: 'block', rangeMs: [1769504700000, 1769507100000] },

        // Tue Jan 27 — 2:30 PM - 4:00 PM
        { type: 'block', rangeMs: [1769524200000, 1769529600000] },
        // Tue Jan 27 — 4:00 PM - 4:05 PM
        { type: 'spacer', rangeMs: [1769529600000, 1769529900000] },
        // Tue Jan 27 — 4:05 PM - 4:45 PM
        { type: 'block', rangeMs: [1769529900000, 1769532300000] },

        // Tue Jan 27 — 5:00 PM
        { type: 'bracket-open', timeMs: 1769533200000 },
        // Tue Jan 27 — 5:00 PM - Tue Jan 27 9:10 PM
        { type: 'spacer', rangeMs: [1769533200000, 1769550000000] },
        // Tue Jan 27 — 9:10 PM
        { type: 'marker', timeMs: 1769550000000 },
        // Tue Jan 27 — 9:10 PM - Wed Jan 28 2:00 AM
        { type: 'spacer', rangeMs: [1769550000000, 1769565600000] },

        // Wed Jan 28 — 2:00 AM - 3:30 AM
        { type: 'block', rangeMs: [1769565600000, 1769571000000] },
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
        // Thu Jan 29 — 9:30 AM - 11:00 AM
        { type: 'block', rangeMs: [1769679000000, 1769684400000] },

        // Thu Jan 29 — 11:00 AM - 11:05 AM
        { type: 'spacer', rangeMs: [1769684400000, 1769684700000] },

        // Thu Jan 29 — 11:05 AM - 11:43 AM
        { type: 'block', rangeMs: [1769684700000, 1769687000000] },

        // Thu Jan 29 — 1:00 PM
        { type: 'bracket-open', timeMs: 1769691600000 },

        // Thu Jan 29 — 1:00 PM - 2:00 PM
        { type: 'spacer', rangeMs: [1769691600000, 1769695200000] },

        // Thu Jan 29 — 2:00 PM
        { type: 'bracket-close', timeMs: 1769695200000 },

        // Thu Jan 29 — 9:30 PM - 10:30 PM
        { type: 'block', rangeMs: [1769722200000, 1769725800000] },

        // Thu Jan 29 — 10:30 PM - 10:35 PM
        { type: 'spacer', rangeMs: [1769725800000, 1769726100000] },

        // Thu Jan 29 — 10:35 PM - 11:10 PM
        { type: 'block', rangeMs: [1769726100000, 1769728200000] },

        // Fri Jan 30 — 9:20 AM - 10:35 AM
        { type: 'block', rangeMs: [1769764800000, 1769769300000] },

        // Fri Jan 30 — 10:50 AM
        { type: 'bracket-open', timeMs: 1769770200000 },

        // Fri Jan 30 — 10:50 AM - 10:57 AM
        { type: 'spacer', rangeMs: [1769770200000, 1769770620000] },

        // Fri Jan 30 — 10:57 AM - 11:18 AM
        { type: 'spacer', rangeMs: [1769770620000, 1769771880000] },

        // Fri Jan 30 — 10:57 AM
        { type: 'marker', timeMs: 1769770620000 },

        // Fri Jan 30 — 11:18 AM - 11:21 AM
        { type: 'spacer', rangeMs: [1769771880000, 1769772060000] },

        // Fri Jan 30 — 11:18 AM
        { type: 'marker', timeMs: 1769771880000 },

        // Fri Jan 30 — 11:21 AM - 1:42 PM
        { type: 'block', rangeMs: [1769772060000, 1769780520000] },

        // Fri Jan 30 — 11:21 AM
        { type: 'bracket-close', timeMs: 1769772060000 },

        // Fri Jan 30 — 2:36 PM
        { type: 'bracket-open', timeMs: 1769783760000 },

        // Fri Jan 30 — 2:36 PM - 2:38 PM
        { type: 'spacer', rangeMs: [1769783760000, 1769783880000] },

        // Fri Jan 30 — 2:38 PM - 2:52 PM
        { type: 'spacer', rangeMs: [1769783880000, 1769784720000] },

        // Fri Jan 30 — 2:38 PM
        { type: 'marker', timeMs: 1769783880000 },

        // Fri Jan 30 — 2:52 PM
        { type: 'bracket-close', timeMs: 1769784720000 },

        // Fri Jan 30 — 3:26 PM - 5:19 PM
        { type: 'block', rangeMs: [1769786760000, 1769793540000] },

        // Fri Jan 30 — 6:02 PM - 8:08 PM
        { type: 'block', rangeMs: [1769796120000, 1769803680000] },

        // Fri Jan 30 — 6:41 PM
        { type: 'bracket-open', timeMs: 1769798460000 },

        // Fri Jan 30 — 6:41 PM - 7:04 PM
        { type: 'spacer', rangeMs: [1769798460000, 1769799840000] },

        // Fri Jan 30 — 7:04 PM - 7:06 PM
        { type: 'spacer', rangeMs: [1769799840000, 1769799960000] },

        // Fri Jan 30 — 7:04 PM
        { type: 'marker', timeMs: 1769799840000 },

        // Fri Jan 30 — 7:06 PM
        { type: 'bracket-close', timeMs: 1769799960000 },

        // Fri Jan 30 — 8:08 PM - 8:27 PM
        { type: 'spacer', rangeMs: [1769803680000, 1769804820000] },

        // Fri Jan 30 — 9:02 PM - 11:21 PM
        { type: 'block', rangeMs: [1769806920000, 1769815260000] },

        // Sat Jan 31 — 12:35 AM
        { type: 'bracket-open', timeMs: 1769819700000 },

        // Sat Jan 31 — 12:35 AM - 1:09 AM
        { type: 'spacer', rangeMs: [1769819700000, 1769821740000] },

        // Sat Jan 31 — 1:09 AM - 1:19 AM
        { type: 'spacer', rangeMs: [1769821740000, 1769822340000] },

        // Sat Jan 31 — 1:09 AM
        { type: 'marker', timeMs: 1769821740000 },

        // Sat Jan 31 — 1:17 AM - 4:16 AM
        { type: 'block', rangeMs: [1769822220000, 1769832960000] },

        // Sat Jan 31 — 1:19 AM - 1:45 AM
        { type: 'spacer', rangeMs: [1769822340000, 1769823900000] },

        // Sat Jan 31 — 1:19 AM
        { type: 'marker', timeMs: 1769822340000 },

        // Sat Jan 31 — 1:45 AM
        { type: 'bracket-close', timeMs: 1769823900000 },

        // Sat Jan 31 — 5:18 AM - 6:19 AM
        { type: 'block', rangeMs: [1769836680000, 1769840340000] },

        // Sat Jan 31 — 5:34 AM
        { type: 'bracket-open', timeMs: 1769837640000 },

        // Sat Jan 31 — 5:34 AM - 6:11 AM
        { type: 'spacer', rangeMs: [1769837640000, 1769839860000] },

        // Sat Jan 31 — 6:11 AM - 6:22 AM
        { type: 'spacer', rangeMs: [1769839860000, 1769840520000] },

        // Sat Jan 31 — 6:11 AM
        { type: 'marker', timeMs: 1769839860000 },

        // Sat Jan 31 — 6:19 AM - 7:03 AM
        { type: 'spacer', rangeMs: [1769840340000, 1769842980000] },

        // Sat Jan 31 — 6:22 AM - 6:26 AM
        { type: 'spacer', rangeMs: [1769840520000, 1769840760000] },

        // Sat Jan 31 — 6:22 AM
        { type: 'marker', timeMs: 1769840520000 },

        // Sat Jan 31 — 6:26 AM
        { type: 'bracket-close', timeMs: 1769840760000 },

        // Sat Jan 31 — 9:32 AM - 12:07 PM
        { type: 'block', rangeMs: [1769851920000, 1769861220000] },

        // Sat Jan 31 — 1:03 PM - 3:44 PM
        { type: 'block', rangeMs: [1769864580000, 1769874240000] },

        // Sat Jan 31 — 1:11 PM
        { type: 'bracket-open', timeMs: 1769865060000 },

        // Sat Jan 31 — 1:11 PM - 1:15 PM
        { type: 'spacer', rangeMs: [1769865060000, 1769865300000] },

        // Sat Jan 31 — 1:15 PM - 1:20 PM
        { type: 'spacer', rangeMs: [1769865300000, 1769865600000] },

        // Sat Jan 31 — 1:15 PM
        { type: 'marker', timeMs: 1769865300000 },

        // Sat Jan 31 — 1:20 PM - 1:39 PM
        { type: 'spacer', rangeMs: [1769865600000, 1769866740000] },

        // Sat Jan 31 — 1:20 PM
        { type: 'marker', timeMs: 1769865600000 },

        // Sat Jan 31 — 1:39 PM
        { type: 'bracket-close', timeMs: 1769866740000 },

        // Sat Jan 31 — 2:37 PM
        { type: 'marker', timeMs: 1769870220000 },

        // Sat Jan 31 — 5:10 PM
        { type: 'bracket-open', timeMs: 1769879400000 },

        // Sat Jan 31 — 5:10 PM - 5:54 PM
        { type: 'spacer', rangeMs: [1769879400000, 1769882040000] },

        // Sat Jan 31 — 5:54 PM - 6:21 PM
        { type: 'spacer', rangeMs: [1769882040000, 1769883660000] },

        // Sat Jan 31 — 5:54 PM
        { type: 'marker', timeMs: 1769882040000 },

        // Sat Jan 31 — 6:03 PM
        { type: 'marker', timeMs: 1769882580000 },

        // Sat Jan 31 — 6:16 PM - 7:09 PM
        { type: 'block', rangeMs: [1769883360000, 1769886540000] },

        // Sat Jan 31 — 6:21 PM
        { type: 'bracket-close', timeMs: 1769883660000 },

        // Sat Jan 31 — 7:28 PM
        { type: 'bracket-open', timeMs: 1769887680000 },

        // Sat Jan 31 — 7:28 PM - 7:54 PM
        { type: 'spacer', rangeMs: [1769887680000, 1769889240000] },

        // Sat Jan 31 — 7:54 PM - 8:16 PM
        { type: 'spacer', rangeMs: [1769889240000, 1769890560000] },

        // Sat Jan 31 — 7:54 PM
        { type: 'marker', timeMs: 1769889240000 },

        // Sat Jan 31 — 8:16 PM
        { type: 'bracket-close', timeMs: 1769890560000 },
      ],
    },

    {
      id: 'row-B',
      elements: [
        // Thu Jan 29 — 1:00 PM - 4:00 PM
        { type: 'block', rangeMs: [1769691600000, 1769702400000] },

        // Thu Jan 29 — 4:00 PM - 4:05 PM
        { type: 'spacer', rangeMs: [1769702400000, 1769702700000] },

        // Thu Jan 29 — 4:05 PM - 4:45 PM
        { type: 'block', rangeMs: [1769702700000, 1769705100000] },

        // Fri Jan 30 — 10:42 AM - 12:32 PM
        { type: 'block', rangeMs: [1769769720000, 1769776320000] },

        // Fri Jan 30 — 12:32 PM - 1:12 PM
        { type: 'spacer', rangeMs: [1769776320000, 1769778720000] },

        // Fri Jan 30 — 1:54 PM - 3:47 PM
        { type: 'block', rangeMs: [1769781240000, 1769788020000] },

        // Fri Jan 30 — 3:47 PM - 4:24 PM
        { type: 'spacer', rangeMs: [1769788020000, 1769790240000] },

        // Fri Jan 30 — 4:51 PM - 7:20 PM
        { type: 'block', rangeMs: [1769791860000, 1769800800000] },

        // Fri Jan 30 — 8:12 PM
        { type: 'bracket-open', timeMs: 1769803920000 },

        // Fri Jan 30 — 8:12 PM - 8:14 PM
        { type: 'spacer', rangeMs: [1769803920000, 1769804040000] },

        // Fri Jan 30 — 8:14 PM - 8:47 PM
        { type: 'spacer', rangeMs: [1769804040000, 1769806020000] },

        // Fri Jan 30 — 8:14 PM
        { type: 'marker', timeMs: 1769804040000 },

        // Fri Jan 30 — 8:47 PM
        { type: 'bracket-close', timeMs: 1769806020000 },

        // Fri Jan 30 — 9:09 PM - 10:56 PM
        { type: 'block', rangeMs: [1769807340000, 1769813760000] },

        // Fri Jan 30 — 11:23 PM - Sat Jan 31 — 12:52 AM
        { type: 'block', rangeMs: [1769815380000, 1769820720000] },

        // Fri Jan 30 — 11:25 PM
        { type: 'bracket-open', timeMs: 1769815500000 },

        // Fri Jan 30 — 11:25 PM - 11:27 PM
        { type: 'spacer', rangeMs: [1769815500000, 1769815620000] },

        // Fri Jan 30 — 11:27 PM - 11:44 PM
        { type: 'spacer', rangeMs: [1769815620000, 1769816640000] },

        // Fri Jan 30 — 11:27 PM
        { type: 'marker', timeMs: 1769815620000 },

        // Fri Jan 30 — 11:44 PM
        { type: 'bracket-close', timeMs: 1769816640000 },

        // Sat Jan 31 — 2:08 AM
        { type: 'bracket-open', timeMs: 1769825280000 },

        // Sat Jan 31 — 2:08 AM - 2:27 AM
        { type: 'spacer', rangeMs: [1769825280000, 1769826420000] },

        // Sat Jan 31 — 2:13 AM - 3:29 AM
        { type: 'block', rangeMs: [1769825580000, 1769830140000] },

        // Sat Jan 31 — 2:27 AM - 2:34 AM
        { type: 'spacer', rangeMs: [1769826420000, 1769826840000] },

        // Sat Jan 31 — 2:27 AM
        { type: 'marker', timeMs: 1769826420000 },

        // Sat Jan 31 — 2:34 AM - 2:36 AM
        { type: 'spacer', rangeMs: [1769826840000, 1769826960000] },

        // Sat Jan 31 — 2:34 AM
        { type: 'marker', timeMs: 1769826840000 },

        // Sat Jan 31 — 2:36 AM
        { type: 'bracket-close', timeMs: 1769826960000 },

        // Sat Jan 31 — 4:36 AM
        { type: 'bracket-open', timeMs: 1769834160000 },

        // Sat Jan 31 — 4:36 AM - 4:48 AM
        { type: 'spacer', rangeMs: [1769834160000, 1769834880000] },

        // Sat Jan 31 — 4:48 AM - 4:53 AM
        { type: 'spacer', rangeMs: [1769834880000, 1769835180000] },

        // Sat Jan 31 — 4:48 AM
        { type: 'marker', timeMs: 1769834880000 },

        // Sat Jan 31 — 4:53 AM
        { type: 'bracket-close', timeMs: 1769835180000 },

        // Sat Jan 31 — 5:08 AM - 6:09 AM
        { type: 'block', rangeMs: [1769836080000, 1769839740000] },

        // Sat Jan 31 — 6:09 AM - 6:47 AM
        { type: 'spacer', rangeMs: [1769839740000, 1769842020000] },

        // Sat Jan 31 — 7:59 AM - 8:50 AM
        { type: 'block', rangeMs: [1769846340000, 1769849400000] },

        // Sat Jan 31 — 9:44 AM - 10:50 AM
        { type: 'block', rangeMs: [1769852640000, 1769856600000] },

        // Sat Jan 31 — 9:49 AM
        { type: 'bracket-open', timeMs: 1769852940000 },

        // Sat Jan 31 — 9:49 AM - 10:16 AM
        { type: 'spacer', rangeMs: [1769852940000, 1769854560000] },

        // Sat Jan 31 — 10:16 AM - 11:00 AM
        { type: 'spacer', rangeMs: [1769854560000, 1769857200000] },

        // Sat Jan 31 — 10:16 AM
        { type: 'marker', timeMs: 1769854560000 },

        // Sat Jan 31 — 11:00 AM
        { type: 'bracket-close', timeMs: 1769857200000 },

        // Sat Jan 31 — 11:06 AM
        { type: 'bracket-open', timeMs: 1769857560000 },

        // Sat Jan 31 — 11:06 AM - 11:37 AM
        { type: 'spacer', rangeMs: [1769857560000, 1769859420000] },

        // Sat Jan 31 — 11:37 AM - 11:57 AM
        { type: 'spacer', rangeMs: [1769859420000, 1769860620000] },

        // Sat Jan 31 — 11:37 AM
        { type: 'marker', timeMs: 1769859420000 },

        // Sat Jan 31 — 11:57 AM
        { type: 'bracket-close', timeMs: 1769860620000 },

        // Sat Jan 31 — 12:20 PM - 2:28 PM
        { type: 'block', rangeMs: [1769862000000, 1769869680000] },

        // Sat Jan 31 — 1:25 PM
        { type: 'marker', timeMs: 1769865900000 },

        // Sat Jan 31 — 2:28 PM - 3:13 PM
        { type: 'spacer', rangeMs: [1769869680000, 1769872380000] },

        // Sat Jan 31 — 5:11 PM - 8:07 PM
        { type: 'block', rangeMs: [1769879460000, 1769890020000] },

        // Sat Jan 31 — 6:21 PM
        { type: 'marker', timeMs: 1769883660000 },

        // Sat Jan 31 — 9:11 PM
        { type: 'bracket-open', timeMs: 1769893860000 },

        // Sat Jan 31 — 9:11 PM - 9:19 PM
        { type: 'spacer', rangeMs: [1769893860000, 1769894340000] },

        // Sat Jan 31 — 9:19 PM - 9:20 PM
        { type: 'spacer', rangeMs: [1769894340000, 1769894400000] },

        // Sat Jan 31 — 9:19 PM
        { type: 'marker', timeMs: 1769894340000 },

        // Sat Jan 31 — 9:20 PM - 9:42 PM
        { type: 'spacer', rangeMs: [1769894400000, 1769895720000] },

        // Sat Jan 31 — 9:20 PM
        { type: 'marker', timeMs: 1769894400000 },

        // Sat Jan 31 — 9:42 PM
        { type: 'bracket-close', timeMs: 1769895720000 },
      ],
    },

    {
      id: 'row-C',
      elements: [
        // Thu Jan 29 — 12:00 AM - 2:30 AM
        { type: 'block', rangeMs: [1769644800000, 1769653800000] },

        // Thu Jan 29 — 2:30 AM - 2:35 AM
        { type: 'spacer', rangeMs: [1769653800000, 1769654100000] },

        // Thu Jan 29 — 2:35 AM - 3:15 AM
        { type: 'block', rangeMs: [1769654100000, 1769656500000] },

        // Thu Jan 29 — 3:20 PM
        { type: 'bracket-open', timeMs: 1769700000000 },

        // Thu Jan 29 — 3:20 PM - 4:00 PM
        { type: 'spacer', rangeMs: [1769700000000, 1769702400000] },

        // Thu Jan 29 — 4:00 PM
        { type: 'bracket-close', timeMs: 1769702400000 },

        // Fri Jan 30 — 4:00 AM - 8:00 AM
        { type: 'block', rangeMs: [1769745600000, 1769760000000] },

        // Fri Jan 30 — 10:41 AM - 12:59 PM
        { type: 'block', rangeMs: [1769769660000, 1769777940000] },

        // Fri Jan 30 — 1:34 PM
        { type: 'bracket-open', timeMs: 1769780040000 },

        // Fri Jan 30 — 1:34 PM - 1:38 PM
        { type: 'spacer', rangeMs: [1769780040000, 1769780280000] },

        // Fri Jan 30 — 1:38 PM - 2:25 PM
        { type: 'spacer', rangeMs: [1769780280000, 1769783100000] },

        // Fri Jan 30 — 1:38 PM
        { type: 'marker', timeMs: 1769780280000 },

        // Fri Jan 30 — 2:25 PM
        { type: 'bracket-close', timeMs: 1769783100000 },

        // Fri Jan 30 — 3:44 PM - 5:10 PM
        { type: 'block', rangeMs: [1769787840000, 1769793000000] },

        // Fri Jan 30 — 5:30 PM - 7:35 PM
        { type: 'block', rangeMs: [1769794200000, 1769801700000] },

        // Fri Jan 30 — 6:09 PM
        { type: 'bracket-open', timeMs: 1769796540000 },

        // Fri Jan 30 — 6:09 PM - 6:13 PM
        { type: 'spacer', rangeMs: [1769796540000, 1769796780000] },

        // Fri Jan 30 — 6:13 PM - 6:20 PM
        { type: 'spacer', rangeMs: [1769796780000, 1769797200000] },

        // Fri Jan 30 — 6:13 PM
        { type: 'marker', timeMs: 1769796780000 },

        // Fri Jan 30 — 6:20 PM - 6:50 PM
        { type: 'spacer', rangeMs: [1769797200000, 1769799000000] },

        // Fri Jan 30 — 6:20 PM
        { type: 'marker', timeMs: 1769797200000 },

        // Fri Jan 30 — 6:25 PM
        { type: 'marker', timeMs: 1769797500000 },

        // Fri Jan 30 — 6:50 PM
        { type: 'bracket-close', timeMs: 1769799000000 },

        // Fri Jan 30 — 8:03 PM - 10:55 PM
        { type: 'block', rangeMs: [1769803380000, 1769813700000] },

        // Fri Jan 30 — 8:46 PM
        { type: 'bracket-open', timeMs: 1769805960000 },

        // Fri Jan 30 — 8:46 PM - 9:15 PM
        { type: 'spacer', rangeMs: [1769805960000, 1769807700000] },

        // Fri Jan 30 — 9:15 PM - 9:20 PM
        { type: 'spacer', rangeMs: [1769807700000, 1769808000000] },

        // Fri Jan 30 — 9:15 PM
        { type: 'marker', timeMs: 1769807700000 },

        // Fri Jan 30 — 9:20 PM - 9:26 PM
        { type: 'spacer', rangeMs: [1769808000000, 1769808360000] },

        // Fri Jan 30 — 9:20 PM
        { type: 'marker', timeMs: 1769808000000 },

        // Fri Jan 30 — 9:26 PM
        { type: 'bracket-close', timeMs: 1769808360000 },

        // Fri Jan 30 — 11:30 PM
        { type: 'bracket-open', timeMs: 1769815800000 },

        // Fri Jan 30 — 11:30 PM - 11:58 PM
        { type: 'spacer', rangeMs: [1769815800000, 1769817480000] },

        // Fri Jan 30 — 11:58 PM - Sat Jan 31 — 12:09 AM
        { type: 'spacer', rangeMs: [1769817480000, 1769818140000] },

        // Fri Jan 30 — 11:58 PM
        { type: 'marker', timeMs: 1769817480000 },

        // Sat Jan 31 — 12:09 AM
        { type: 'bracket-close', timeMs: 1769818140000 },

        // Sat Jan 31 — 1:20 AM - 2:38 AM
        { type: 'block', rangeMs: [1769822400000, 1769827080000] },

        // Sat Jan 31 — 2:38 AM - 3:09 AM
        { type: 'spacer', rangeMs: [1769827080000, 1769828940000] },

        // Sat Jan 31 — 5:17 AM - 8:01 AM
        { type: 'block', rangeMs: [1769836620000, 1769846460000] },

        // Sat Jan 31 — 8:54 AM
        { type: 'bracket-open', timeMs: 1769849640000 },

        // Sat Jan 31 — 8:54 AM - 9:08 AM
        { type: 'spacer', rangeMs: [1769849640000, 1769850480000] },

        // Sat Jan 31 — 9:08 AM - 9:54 AM
        { type: 'spacer', rangeMs: [1769850480000, 1769853240000] },

        // Sat Jan 31 — 9:08 AM
        { type: 'marker', timeMs: 1769850480000 },

        // Sat Jan 31 — 9:54 AM
        { type: 'bracket-close', timeMs: 1769853240000 },

        // Sat Jan 31 — 11:01 AM - 1:28 PM
        { type: 'block', rangeMs: [1769857260000, 1769866080000] },

        // Sat Jan 31 — 1:28 PM - 1:55 PM
        { type: 'spacer', rangeMs: [1769866080000, 1769867700000] },

        // Sat Jan 31 — 3:28 PM - 4:57 PM
        { type: 'block', rangeMs: [1769873280000, 1769878620000] },

        // Sat Jan 31 — 5:32 PM - 7:37 PM
        { type: 'block', rangeMs: [1769880720000, 1769888220000] },

        // Sat Jan 31 — 6:03 PM
        { type: 'bracket-open', timeMs: 1769882580000 },

        // Sat Jan 31 — 6:03 PM - 6:13 PM
        { type: 'spacer', rangeMs: [1769882580000, 1769883180000] },

        // Sat Jan 31 — 6:13 PM - 6:25 PM
        { type: 'spacer', rangeMs: [1769883180000, 1769883900000] },

        // Sat Jan 31 — 6:13 PM
        { type: 'marker', timeMs: 1769883180000 },

        // Sat Jan 31 — 6:25 PM
        { type: 'bracket-close', timeMs: 1769883900000 },

        // Sat Jan 31 — 8:13 PM
        { type: 'bracket-open', timeMs: 1769890380000 },

        // Sat Jan 31 — 8:13 PM - 8:25 PM
        { type: 'spacer', rangeMs: [1769890380000, 1769891100000] },

        // Sat Jan 31 — 8:25 PM - 8:34 PM
        { type: 'spacer', rangeMs: [1769891100000, 1769891640000] },

        // Sat Jan 31 — 8:25 PM
        { type: 'marker', timeMs: 1769891100000 },

        // Sat Jan 31 — 8:34 PM - 8:42 PM
        { type: 'spacer', rangeMs: [1769891640000, 1769892120000] },

        // Sat Jan 31 — 8:34 PM
        { type: 'marker', timeMs: 1769891640000 },

        // Sat Jan 31 — 8:42 PM
        { type: 'bracket-close', timeMs: 1769892120000 },

        // Sat Jan 31 — 10:01 PM - Sun Feb 1 — 12:18 AM
        { type: 'block', rangeMs: [1769896860000, 1769905080000] },

        // Sun Feb 1 — 1:23 AM
        { type: 'bracket-open', timeMs: 1769908980000 },

        // Sun Feb 1 — 1:23 AM - 1:50 AM
        { type: 'spacer', rangeMs: [1769908980000, 1769910600000] },

        // Sun Feb 1 — 1:50 AM - 2:15 AM
        { type: 'spacer', rangeMs: [1769910600000, 1769912100000] },

        // Sun Feb 1 — 1:50 AM
        { type: 'marker', timeMs: 1769910600000 },

        // Sun Feb 1 — 2:15 AM
        { type: 'bracket-close', timeMs: 1769912100000 },

        // Sun Feb 1 — 2:25 AM
        { type: 'marker', timeMs: 1769912700000 },
      ],
    },

    {
      id: 'row-D',
      elements: [
        // Thu Jan 29 — 8:40 AM - 10:40 AM
        { type: 'block', rangeMs: [1769676000000, 1769683200000] },

        // Thu Jan 29 — 10:40 AM - 10:45 AM
        { type: 'spacer', rangeMs: [1769683200000, 1769683500000] },

        // Thu Jan 29 — 10:45 AM - 11:25 AM
        { type: 'block', rangeMs: [1769683500000, 1769685900000] },

        // Thu Jan 29 — 5:00 PM
        { type: 'bracket-open', timeMs: 1769706000000 },

        // Thu Jan 29 — 5:00 PM - 5:30 PM
        { type: 'spacer', rangeMs: [1769706000000, 1769707800000] },

        // Thu Jan 29 — 5:30 PM
        { type: 'bracket-close', timeMs: 1769707800000 },

        // Thu Jan 29 — 10:00 PM - Fri Jan 30 — 1:00 AM
        { type: 'block', rangeMs: [1769724000000, 1769734800000] },

        // Fri Jan 30 — 9:39 AM - 11:01 AM
        { type: 'block', rangeMs: [1769765940000, 1769770860000] },

        // Fri Jan 30 — 11:01 AM - 11:31 AM
        { type: 'spacer', rangeMs: [1769770860000, 1769772660000] },

        // Fri Jan 30 — 11:04 AM
        { type: 'marker', timeMs: 1769771040000 },

        // Fri Jan 30 — 1:38 PM - 2:40 PM
        { type: 'block', rangeMs: [1769780280000, 1769784000000] },

        // Fri Jan 30 — 2:40 PM - 3:14 PM
        { type: 'spacer', rangeMs: [1769784000000, 1769786040000] },

        // Fri Jan 30 — 3:35 PM - 5:52 PM
        { type: 'block', rangeMs: [1769787300000, 1769795520000] },

        // Fri Jan 30 — 5:52 PM - 6:25 PM
        { type: 'spacer', rangeMs: [1769795520000, 1769797500000] },

        // Fri Jan 30 — 7:11 PM - 9:38 PM
        { type: 'block', rangeMs: [1769800260000, 1769809080000] },

        // Fri Jan 30 — 7:28 PM
        { type: 'marker', timeMs: 1769801280000 },

        // Fri Jan 30 — 9:38 PM - 10:02 PM
        { type: 'spacer', rangeMs: [1769809080000, 1769810520000] },

        // Fri Jan 30 — 11:17 PM - Sat Jan 31 — 12:43 AM
        { type: 'block', rangeMs: [1769815020000, 1769820180000] },

        // Sat Jan 31 — 12:43 AM - 1:22 AM
        { type: 'spacer', rangeMs: [1769820180000, 1769822520000] },

        // Sat Jan 31 — 2:12 AM - 4:08 AM
        { type: 'block', rangeMs: [1769825520000, 1769832480000] },

        // Sat Jan 31 — 4:08 AM - 4:21 AM
        { type: 'spacer', rangeMs: [1769832480000, 1769833260000] },

        // Sat Jan 31 — 6:37 AM - 8:43 AM
        { type: 'block', rangeMs: [1769841420000, 1769848980000] },

        // Sat Jan 31 — 8:43 AM - 9:28 AM
        { type: 'spacer', rangeMs: [1769848980000, 1769851680000] },

        // Sat Jan 31 — 11:01 AM - 12:38 PM
        { type: 'block', rangeMs: [1769857260000, 1769863080000] },

        // Sat Jan 31 — 12:38 PM - 12:49 PM
        { type: 'spacer', rangeMs: [1769863080000, 1769863740000] },

        // Sat Jan 31 — 1:09 PM - 4:08 PM
        { type: 'block', rangeMs: [1769864940000, 1769875680000] },

        // Sat Jan 31 — 4:08 PM - 4:25 PM
        { type: 'spacer', rangeMs: [1769875680000, 1769876700000] },

        // Sat Jan 31 — 7:07 PM - 8:57 PM
        { type: 'block', rangeMs: [1769886420000, 1769893020000] },

        // Sat Jan 31 — 10:23 PM
        { type: 'bracket-open', timeMs: 1769898180000 },

        // Sat Jan 31 — 10:23 PM - 10:41 PM
        { type: 'spacer', rangeMs: [1769898180000, 1769899260000] },

        // Sat Jan 31 — 10:41 PM - 10:50 PM
        { type: 'spacer', rangeMs: [1769899260000, 1769899800000] },

        // Sat Jan 31 — 10:41 PM
        { type: 'marker', timeMs: 1769899260000 },

        // Sat Jan 31 — 10:50 PM
        { type: 'bracket-close', timeMs: 1769899800000 },
      ],
    },

    {
      id: 'row-E',
      elements: [
        // Thu Jan 29 — 4:30 PM - 6:30 PM
        { type: 'block', rangeMs: [1769704200000, 1769711400000] },

        // Fri Jan 30 — 9:27 AM - 11:05 AM
        { type: 'block', rangeMs: [1769765220000, 1769771100000] },

        // Fri Jan 30 — 12:02 PM
        { type: 'bracket-open', timeMs: 1769774520000 },

        // Fri Jan 30 — 12:02 PM - 12:11 PM
        { type: 'spacer', rangeMs: [1769774520000, 1769775060000] },

        // Fri Jan 30 — 12:11 PM - 12:34 PM
        { type: 'spacer', rangeMs: [1769775060000, 1769776440000] },

        // Fri Jan 30 — 12:11 PM
        { type: 'marker', timeMs: 1769775060000 },

        // Fri Jan 30 — 12:34 PM
        { type: 'bracket-close', timeMs: 1769776440000 },

        // Fri Jan 30 — 1:56 PM - 4:15 PM
        { type: 'block', rangeMs: [1769781360000, 1769789700000] },

        // Fri Jan 30 — 4:15 PM - 4:32 PM
        { type: 'spacer', rangeMs: [1769789700000, 1769790720000] },

        // Fri Jan 30 — 6:09 PM - 7:50 PM
        { type: 'block', rangeMs: [1769796540000, 1769802600000] },

        // Fri Jan 30 — 8:52 PM
        { type: 'bracket-open', timeMs: 1769806320000 },

        // Fri Jan 30 — 8:52 PM - 9:08 PM
        { type: 'spacer', rangeMs: [1769806320000, 1769807280000] },

        // Fri Jan 30 — 8:54 PM - 10:21 PM
        { type: 'block', rangeMs: [1769806440000, 1769811660000] },

        // Fri Jan 30 — 9:08 PM - 9:18 PM
        { type: 'spacer', rangeMs: [1769807280000, 1769807880000] },

        // Fri Jan 30 — 9:08 PM
        { type: 'marker', timeMs: 1769807280000 },

        // Fri Jan 30 — 9:18 PM - 9:29 PM
        { type: 'spacer', rangeMs: [1769807880000, 1769808540000] },

        // Fri Jan 30 — 9:18 PM
        { type: 'marker', timeMs: 1769807880000 },

        // Fri Jan 30 — 9:29 PM
        { type: 'bracket-close', timeMs: 1769808540000 },

        // Fri Jan 30 — 10:21 PM - 10:39 PM
        { type: 'spacer', rangeMs: [1769811660000, 1769812740000] },

        // Sat Jan 31 — 1:10 AM - 3:31 AM
        { type: 'block', rangeMs: [1769821800000, 1769830260000] },

        // Sat Jan 31 — 3:31 AM - 4:09 AM
        { type: 'spacer', rangeMs: [1769830260000, 1769832540000] },

        // Sat Jan 31 — 5:39 AM - 6:25 AM
        { type: 'block', rangeMs: [1769837940000, 1769840700000] },

        // Sat Jan 31 — 6:10 AM
        { type: 'marker', timeMs: 1769839800000 },

        // Sat Jan 31 — 6:25 AM - 6:35 AM
        { type: 'spacer', rangeMs: [1769840700000, 1769841300000] },

        // Sat Jan 31 — 7:28 AM
        { type: 'marker', timeMs: 1769844480000 },

        // Sat Jan 31 — 7:50 AM - 10:47 AM
        { type: 'block', rangeMs: [1769845800000, 1769856420000] },

        // Sat Jan 31 — 11:07 AM
        { type: 'bracket-open', timeMs: 1769857620000 },

        // Sat Jan 31 — 11:07 AM - 12:06 PM
        { type: 'spacer', rangeMs: [1769857620000, 1769861160000] },

        // Sat Jan 31 — 12:06 PM - 12:22 PM
        { type: 'spacer', rangeMs: [1769861160000, 1769862120000] },

        // Sat Jan 31 — 12:06 PM
        { type: 'marker', timeMs: 1769861160000 },

        // Sat Jan 31 — 12:20 PM - 3:13 PM
        { type: 'block', rangeMs: [1769862000000, 1769872380000] },

        // Sat Jan 31 — 12:22 PM
        { type: 'bracket-close', timeMs: 1769862120000 },

        // Sat Jan 31 — 3:13 PM - 3:54 PM
        { type: 'spacer', rangeMs: [1769872380000, 1769874840000] },

        // Sat Jan 31 — 4:23 PM - 5:30 PM
        { type: 'block', rangeMs: [1769876580000, 1769880600000] },

        // Sat Jan 31 — 5:30 PM - 5:57 PM
        { type: 'spacer', rangeMs: [1769880600000, 1769882220000] },
      ],
    },

    {
      id: 'row-F',
      elements: [
        { type: 'spacer', rangeMs: [1769644800000, 1769660000000] },
        // Thu Jan 29 — 4:13 AM
        { type: 'marker', timeMs: 1769660000000 },

        // Thu Jan 29 — 4:13 AM - 12:00 PM
        { type: 'spacer', rangeMs: [1769660000000, 1769688000000] },

        // Thu Jan 29 — 12:00 PM - 3:00 PM
        { type: 'block', rangeMs: [1769688000000, 1769698800000] },

        // Thu Jan 29 — 3:00 PM - 3:05 PM
        { type: 'spacer', rangeMs: [1769698800000, 1769699100000] },

        // Thu Jan 29 — 3:05 PM - 3:45 PM
        { type: 'block', rangeMs: [1769699100000, 1769701500000] },

        // Thu Jan 29 — 3:45 PM - 4:30 PM
        { type: 'spacer', rangeMs: [1769701500000, 1769704200000] },

        // Thu Jan 29 — 4:30 PM
        { type: 'bracket-close', timeMs: 1769704200000 },

        // Thu Jan 29 — 10:30 PM - Fri Jan 30 — 2:00 AM
        { type: 'block', rangeMs: [1769725800000, 1769738400000] },

        // Fri Jan 30 — 10:07 AM - 11:18 AM
        { type: 'block', rangeMs: [1769767620000, 1769771880000] },

        // Fri Jan 30 — 11:18 AM - 11:53 AM
        { type: 'spacer', rangeMs: [1769771880000, 1769773980000] },

        // Fri Jan 30 — 12:33 PM - 2:46 PM
        { type: 'block', rangeMs: [1769776380000, 1769784360000] },

        // Fri Jan 30 — 2:46 PM - 2:59 PM
        { type: 'spacer', rangeMs: [1769784360000, 1769785140000] },

        // Fri Jan 30 — 5:31 PM - 7:45 PM
        { type: 'block', rangeMs: [1769794260000, 1769802300000] },

        // Fri Jan 30 — 8:21 PM
        { type: 'bracket-open', timeMs: 1769804460000 },

        // Fri Jan 30 — 8:21 PM - 8:24 PM
        { type: 'spacer', rangeMs: [1769804460000, 1769804640000] },

        // Fri Jan 30 — 8:24 PM - 9:09 PM
        { type: 'spacer', rangeMs: [1769804640000, 1769807340000] },

        // Fri Jan 30 — 8:24 PM
        { type: 'marker', timeMs: 1769804640000 },

        // Fri Jan 30 — 9:09 PM - 11:20 PM
        { type: 'block', rangeMs: [1769807340000, 1769815200000] },

        // Fri Jan 30 — 9:09 PM
        { type: 'bracket-close', timeMs: 1769807340000 },

        // Sat Jan 31 — 12:26 AM - 2:44 AM
        { type: 'block', rangeMs: [1769819160000, 1769827440000] },

        // Sat Jan 31 — 12:32 AM
        { type: 'bracket-open', timeMs: 1769819520000 },

        // Sat Jan 31 — 12:32 AM - 1:06 AM
        { type: 'spacer', rangeMs: [1769819520000, 1769821560000] },

        // Sat Jan 31 — 1:06 AM - 1:39 AM
        { type: 'spacer', rangeMs: [1769821560000, 1769823540000] },

        // Sat Jan 31 — 1:06 AM
        { type: 'marker', timeMs: 1769821560000 },

        // Sat Jan 31 — 1:39 AM
        { type: 'bracket-close', timeMs: 1769823540000 },

        // Sat Jan 31 — 3:15 AM
        { type: 'bracket-open', timeMs: 1769829300000 },

        // Sat Jan 31 — 3:15 AM - 3:27 AM
        { type: 'spacer', rangeMs: [1769829300000, 1769830020000] },

        // Sat Jan 31 — 3:27 AM - 3:28 AM
        { type: 'spacer', rangeMs: [1769830020000, 1769830080000] },

        // Sat Jan 31 — 3:27 AM
        { type: 'marker', timeMs: 1769830020000 },

        // Sat Jan 31 — 3:28 AM - 4:14 AM
        { type: 'spacer', rangeMs: [1769830080000, 1769832840000] },

        // Sat Jan 31 — 3:28 AM
        { type: 'marker', timeMs: 1769830080000 },

        // Sat Jan 31 — 4:14 AM
        { type: 'bracket-close', timeMs: 1769832840000 },

        // Sat Jan 31 — 4:47 AM - 7:37 AM
        { type: 'block', rangeMs: [1769834820000, 1769845020000] },

        // Sat Jan 31 — 7:37 AM - 8:17 AM
        { type: 'spacer', rangeMs: [1769845020000, 1769847420000] },

        // Sat Jan 31 — 10:08 AM - 12:25 PM
        { type: 'block', rangeMs: [1769854080000, 1769862300000] },

        // Sat Jan 31 — 12:25 PM - 12:35 PM
        { type: 'spacer', rangeMs: [1769862300000, 1769862900000] },

        // Sat Jan 31 — 2:55 PM - 5:46 PM
        { type: 'block', rangeMs: [1769871300000, 1769881560000] },

        // Sat Jan 31 — 5:46 PM - 6:07 PM
        { type: 'spacer', rangeMs: [1769881560000, 1769882820000] },

        // Sat Jan 31 — 6:42 PM
        { type: 'marker', timeMs: 1769884920000 },

        // Sat Jan 31 — 8:55 PM - 11:03 PM
        { type: 'block', rangeMs: [1769892900000, 1769900580000] },

        // Sat Jan 31 — 11:03 PM - 11:21 PM
        { type: 'spacer', rangeMs: [1769900580000, 1769901660000] },

        // Sun Feb 1 — 4:48 AM
        { type: 'marker', timeMs: 1769921280000 },
      ],
    },

    {
      id: 'row-G',
      elements: [
        // Thu Jan 29 — 9:30 AM - 11:30 AM
        { type: 'block', rangeMs: [1769679000000, 1769686200000] },

        // Thu Jan 29 — 11:30 AM - 11:35 AM
        { type: 'spacer', rangeMs: [1769686200000, 1769686500000] },

        // Thu Jan 29 — 11:35 AM - 12:15 PM
        { type: 'block', rangeMs: [1769686500000, 1769688900000] },

        // Thu Jan 29 — 12:15 PM - 1:00 PM
        { type: 'spacer', rangeMs: [1769688900000, 1769691600000] },

        // Thu Jan 29 — 1:00 PM
        { type: 'bracket-close', timeMs: 1769691600000 },

        // Fri Jan 30 — 5:00 AM - 7:30 AM
        { type: 'block', rangeMs: [1769749200000, 1769758200000] },

        // Fri Jan 30 — 7:30 AM - 7:50 AM
        { type: 'spacer', rangeMs: [1769758200000, 1769759400000] },

        // Fri Jan 30 — 7:50 AM
        { type: 'bracket-close', timeMs: 1769759400000 },

        // Fri Jan 30 — 10:14 AM - 1:05 PM
        { type: 'block', rangeMs: [1769768040000, 1769778300000] },

        // Fri Jan 30 — 1:05 PM - 1:47 PM
        { type: 'spacer', rangeMs: [1769778300000, 1769780820000] },

        // Fri Jan 30 — 2:29 PM - 4:19 PM
        { type: 'block', rangeMs: [1769783340000, 1769789940000] },

        // Fri Jan 30 — 4:19 PM - 4:31 PM
        { type: 'spacer', rangeMs: [1769789940000, 1769790660000] },

        // Fri Jan 30 — 6:49 PM - 7:37 PM
        { type: 'block', rangeMs: [1769798940000, 1769801820000] },

        // Fri Jan 30 — 7:37 PM - 8:21 PM
        { type: 'spacer', rangeMs: [1769801820000, 1769804460000] },

        // Fri Jan 30 — 9:23 PM - 10:54 PM
        { type: 'block', rangeMs: [1769808180000, 1769813640000] },

        // Fri Jan 30 — 10:54 PM - 11:26 PM
        { type: 'spacer', rangeMs: [1769813640000, 1769815560000] },

        // Sat Jan 31 — 2:05 AM - 3:01 AM
        { type: 'block', rangeMs: [1769825100000, 1769828460000] },

        // Sat Jan 31 — 4:13 AM
        { type: 'bracket-open', timeMs: 1769832780000 },

        // Sat Jan 31 — 4:13 AM - 4:15 AM
        { type: 'spacer', rangeMs: [1769832780000, 1769832900000] },

        // Sat Jan 31 — 4:15 AM - 4:48 AM
        { type: 'spacer', rangeMs: [1769832900000, 1769834880000] },

        // Sat Jan 31 — 4:15 AM
        { type: 'marker', timeMs: 1769832900000 },

        // Sat Jan 31 — 4:18 AM - 5:12 AM
        { type: 'block', rangeMs: [1769833080000, 1769836320000] },

        // Sat Jan 31 — 4:48 AM
        { type: 'bracket-close', timeMs: 1769834880000 },

        // Sat Jan 31 — 5:12 AM - 5:55 AM
        { type: 'spacer', rangeMs: [1769836320000, 1769838900000] },

        // Sat Jan 31 — 6:26 AM - 8:48 AM
        { type: 'block', rangeMs: [1769840760000, 1769849280000] },

        // Sat Jan 31 — 9:31 AM
        { type: 'bracket-open', timeMs: 1769851860000 },

        // Sat Jan 31 — 9:31 AM - 9:34 AM
        { type: 'spacer', rangeMs: [1769851860000, 1769852040000] },

        // Sat Jan 31 — 9:34 AM - 10:00 AM
        { type: 'spacer', rangeMs: [1769852040000, 1769853600000] },

        // Sat Jan 31 — 9:34 AM
        { type: 'marker', timeMs: 1769852040000 },

        // Sat Jan 31 — 10:00 AM - 10:42 AM
        { type: 'spacer', rangeMs: [1769853600000, 1769856120000] },

        // Sat Jan 31 — 10:00 AM
        { type: 'marker', timeMs: 1769853600000 },

        // Sat Jan 31 — 10:20 AM - 11:45 AM
        { type: 'block', rangeMs: [1769854800000, 1769859900000] },

        // Sat Jan 31 — 10:42 AM
        { type: 'bracket-close', timeMs: 1769856120000 },

        // Sat Jan 31 — 10:50 AM
        { type: 'marker', timeMs: 1769856600000 },

        // Sat Jan 31 — 11:45 AM - 12:09 PM
        { type: 'spacer', rangeMs: [1769859900000, 1769861340000] },

        // Sat Jan 31 — 9:15 PM
        { type: 'marker', timeMs: 1769894100000 },
      ],
    },

    {
      id: 'row-H',
      elements: [
        // Thu Jan 29 — 6:30 PM - 9:00 PM
        { type: 'block', rangeMs: [1769711400000, 1769720400000] },

        // Thu Jan 29 — 9:00 PM - 9:05 PM
        { type: 'spacer', rangeMs: [1769720400000, 1769720700000] },

        // Thu Jan 29 — 9:05 PM - 9:45 PM
        { type: 'block', rangeMs: [1769720700000, 1769723100000] },

        // Thu Jan 29 — 9:45 PM - 10:30 PM
        { type: 'spacer', rangeMs: [1769723100000, 1769725800000] },

        // Thu Jan 29 — 10:30 PM
        { type: 'bracket-close', timeMs: 1769725800000 },

        // Fri Jan 30 — 2:30 AM - 3:45 AM
        { type: 'block', rangeMs: [1769740200000, 1769744700000] },

        // Fri Jan 30 — 9:48 AM - 10:58 AM
        { type: 'block', rangeMs: [1769766480000, 1769770680000] },

        // Fri Jan 30 — 10:58 AM - 11:33 AM
        { type: 'spacer', rangeMs: [1769770680000, 1769772780000] },

        // Fri Jan 30 — 12:57 PM - 3:38 PM
        { type: 'block', rangeMs: [1769777820000, 1769787480000] },

        // Fri Jan 30 — 3:38 PM - 3:54 PM
        { type: 'spacer', rangeMs: [1769787480000, 1769788440000] },

        // Fri Jan 30 — 5:50 PM - 8:35 PM
        { type: 'block', rangeMs: [1769795400000, 1769805300000] },

        // Fri Jan 30 — 8:35 PM - 9:10 PM
        { type: 'spacer', rangeMs: [1769805300000, 1769807400000] },

        // Fri Jan 30 — 10:01 PM - 11:31 PM
        { type: 'block', rangeMs: [1769810460000, 1769815860000] },

        // Fri Jan 30 — 11:31 PM - Sat Jan 31 — 12:03 AM
        { type: 'spacer', rangeMs: [1769815860000, 1769817780000] },

        // Sat Jan 31 — 1:55 AM
        { type: 'marker', timeMs: 1769824500000 },

        // Sat Jan 31 — 2:37 AM - 3:43 AM
        { type: 'block', rangeMs: [1769827020000, 1769830980000] },

        // Sat Jan 31 — 5:05 AM - 7:46 AM
        { type: 'block', rangeMs: [1769835900000, 1769845560000] },

        // Sat Jan 31 — 5:07 AM
        { type: 'bracket-open', timeMs: 1769836020000 },

        // Sat Jan 31 — 5:07 AM - 5:13 AM
        { type: 'spacer', rangeMs: [1769836020000, 1769836380000] },

        // Sat Jan 31 — 5:13 AM - 5:56 AM
        { type: 'spacer', rangeMs: [1769836380000, 1769838960000] },

        // Sat Jan 31 — 5:13 AM
        { type: 'marker', timeMs: 1769836380000 },

        // Sat Jan 31 — 5:56 AM
        { type: 'bracket-close', timeMs: 1769838960000 },

        // Sat Jan 31 — 7:46 AM - 8:05 AM
        { type: 'spacer', rangeMs: [1769845560000, 1769846700000] },

        // Sat Jan 31 — 10:22 AM - 12:43 PM
        { type: 'block', rangeMs: [1769854920000, 1769863380000] },

        // Sat Jan 31 — 1:12 PM
        { type: 'bracket-open', timeMs: 1769865120000 },

        // Sat Jan 31 — 1:12 PM - 1:14 PM
        { type: 'spacer', rangeMs: [1769865120000, 1769865240000] },

        // Sat Jan 31 — 1:14 PM - 1:20 PM
        { type: 'spacer', rangeMs: [1769865240000, 1769865600000] },

        // Sat Jan 31 — 1:14 PM
        { type: 'marker', timeMs: 1769865240000 },

        // Sat Jan 31 — 1:20 PM - 1:40 PM
        { type: 'spacer', rangeMs: [1769865600000, 1769866800000] },

        // Sat Jan 31 — 1:20 PM
        { type: 'marker', timeMs: 1769865600000 },

        // Sat Jan 31 — 1:40 PM
        { type: 'bracket-close', timeMs: 1769866800000 },

        // Sat Jan 31 — 2:58 PM - 3:46 PM
        { type: 'block', rangeMs: [1769871480000, 1769874360000] },

        // Sat Jan 31 — 4:41 PM
        { type: 'bracket-open', timeMs: 1769877660000 },

        // Sat Jan 31 — 4:41 PM - 4:54 PM
        { type: 'spacer', rangeMs: [1769877660000, 1769878440000] },

        // Sat Jan 31 — 4:54 PM - 5:06 PM
        { type: 'spacer', rangeMs: [1769878440000, 1769879160000] },

        // Sat Jan 31 — 4:54 PM
        { type: 'marker', timeMs: 1769878440000 },

        // Sat Jan 31 — 5:06 PM
        { type: 'bracket-close', timeMs: 1769879160000 },

        // Sat Jan 31 — 5:38 PM - 7:51 PM
        { type: 'block', rangeMs: [1769881080000, 1769889060000] },

        // Sat Jan 31 — 7:51 PM - 8:09 PM
        { type: 'spacer', rangeMs: [1769889060000, 1769890140000] },

        // Sat Jan 31 — 8:11 PM
        { type: 'marker', timeMs: 1769890260000 },
      ],
    },

    {
      id: 'row-I',
      elements: [
        // Thu Jan 29 — 12:00 PM - 1:00 PM
        { type: 'block', rangeMs: [1769688000000, 1769691600000] },

        // Thu Jan 29 — 1:00 PM - 2:00 PM
        { type: 'spacer', rangeMs: [1769691600000, 1769695200000] },

        // Thu Jan 29 — 2:00 PM
        { type: 'bracket-close', timeMs: 1769695200000 },

        // Fri Jan 30 — 7:00 AM - 8:00 AM
        { type: 'block', rangeMs: [1769756400000, 1769760000000] },

        // Fri Jan 30 — 9:27 AM - 11:08 AM
        { type: 'block', rangeMs: [1769765220000, 1769771280000] },

        // Fri Jan 30 — 11:08 AM - 11:46 AM
        { type: 'spacer', rangeMs: [1769771280000, 1769773560000] },

        // Fri Jan 30 — 2:41 PM - 4:05 PM
        { type: 'block', rangeMs: [1769784060000, 1769789100000] },

        // Fri Jan 30 — 4:05 PM - 4:17 PM
        { type: 'spacer', rangeMs: [1769789100000, 1769789820000] },

        // Fri Jan 30 — 6:46 PM - 7:56 PM
        { type: 'block', rangeMs: [1769798760000, 1769802960000] },

        // Fri Jan 30 — 7:56 PM - 8:33 PM
        { type: 'spacer', rangeMs: [1769802960000, 1769805180000] },

        // Fri Jan 30 — 9:00 PM - 9:56 PM
        { type: 'block', rangeMs: [1769806800000, 1769810160000] },

        // Fri Jan 30 — 9:56 PM - 10:24 PM
        { type: 'spacer', rangeMs: [1769810160000, 1769811840000] },

        // Fri Jan 30 — 11:00 PM - Sat Jan 31 — 1:07 AM
        { type: 'block', rangeMs: [1769814000000, 1769821620000] },

        // Sat Jan 31 — 2:28 AM
        { type: 'bracket-open', timeMs: 1769826480000 },

        // Sat Jan 31 — 2:28 AM - 2:53 AM
        { type: 'spacer', rangeMs: [1769826480000, 1769827980000] },

        // Sat Jan 31 — 2:53 AM - 3:06 AM
        { type: 'spacer', rangeMs: [1769827980000, 1769828760000] },

        // Sat Jan 31 — 2:53 AM
        { type: 'marker', timeMs: 1769827980000 },

        // Sat Jan 31 — 3:04 AM
        { type: 'marker', timeMs: 1769828640000 },

        // Sat Jan 31 — 3:06 AM - 3:38 AM
        { type: 'spacer', rangeMs: [1769828760000, 1769830680000] },

        // Sat Jan 31 — 3:06 AM
        { type: 'marker', timeMs: 1769828760000 },

        // Sat Jan 31 — 3:38 AM
        { type: 'bracket-close', timeMs: 1769830680000 },

        // Sat Jan 31 — 3:45 AM - 5:46 AM
        { type: 'block', rangeMs: [1769831100000, 1769838360000] },

        // Sat Jan 31 — 5:46 AM - 6:24 AM
        { type: 'spacer', rangeMs: [1769838360000, 1769840640000] },

        // Sat Jan 31 — 9:22 AM - 10:24 AM
        { type: 'block', rangeMs: [1769851320000, 1769855040000] },

        // Sat Jan 31 — 10:24 AM - 10:48 AM
        { type: 'spacer', rangeMs: [1769855040000, 1769856480000] },

        // Sat Jan 31 — 1:40 PM - 3:31 PM
        { type: 'block', rangeMs: [1769866800000, 1769873460000] },

        // Sat Jan 31 — 4:03 PM - 5:38 PM
        { type: 'block', rangeMs: [1769875380000, 1769881080000] },

        // Sat Jan 31 — 4:18 PM
        { type: 'bracket-open', timeMs: 1769876280000 },

        // Sat Jan 31 — 4:18 PM - 4:31 PM
        { type: 'spacer', rangeMs: [1769876280000, 1769877060000] },

        // Sat Jan 31 — 4:31 PM - 5:11 PM
        { type: 'spacer', rangeMs: [1769877060000, 1769879460000] },

        // Sat Jan 31 — 4:31 PM
        { type: 'marker', timeMs: 1769877060000 },

        // Sat Jan 31 — 5:11 PM
        { type: 'bracket-close', timeMs: 1769879460000 },

        // Sat Jan 31 — 6:53 PM - 8:57 PM
        { type: 'block', rangeMs: [1769885580000, 1769893020000] },

        // Sat Jan 31 — 7:08 PM
        { type: 'bracket-open', timeMs: 1769886480000 },

        // Sat Jan 31 — 7:08 PM - 8:11 PM
        { type: 'spacer', rangeMs: [1769886480000, 1769890260000] },

        // Sat Jan 31 — 8:11 PM - 8:21 PM
        { type: 'spacer', rangeMs: [1769890260000, 1769890860000] },

        // Sat Jan 31 — 8:11 PM
        { type: 'marker', timeMs: 1769890260000 },

        // Sat Jan 31 — 8:21 PM
        { type: 'bracket-close', timeMs: 1769890860000 },

        // Sat Jan 31 — 9:13 PM
        { type: 'bracket-open', timeMs: 1769893980000 },

        // Sat Jan 31 — 9:13 PM - 9:32 PM
        { type: 'spacer', rangeMs: [1769893980000, 1769895120000] },

        // Sat Jan 31 — 9:32 PM - 9:54 PM
        { type: 'spacer', rangeMs: [1769895120000, 1769896440000] },

        // Sat Jan 31 — 9:32 PM
        { type: 'marker', timeMs: 1769895120000 },

        // Sat Jan 31 — 9:54 PM
        { type: 'bracket-close', timeMs: 1769896440000 },

        // Sat Jan 31 — 10:37 PM - Sun Feb 1 — 12:10 AM
        { type: 'block', rangeMs: [1769899020000, 1769904600000] },

        // Sun Feb 1 — 1:12 AM
        { type: 'bracket-open', timeMs: 1769908320000 },

        // Sun Feb 1 — 1:12 AM - 1:27 AM
        { type: 'spacer', rangeMs: [1769908320000, 1769909220000] },

        // Sun Feb 1 — 1:24 AM
        { type: 'marker', timeMs: 1769909040000 },

        // Sun Feb 1 — 1:27 AM - 1:40 AM
        { type: 'spacer', rangeMs: [1769909220000, 1769910000000] },

        // Sun Feb 1 — 1:27 AM
        { type: 'marker', timeMs: 1769909220000 },

        // Sun Feb 1 — 1:40 AM
        { type: 'bracket-close', timeMs: 1769910000000 },
      ],
    },

    {
      id: 'row-J',
      elements: [
        // Thu Jan 29 — 10:40 AM - 12:10 PM
        { type: 'block', rangeMs: [1769683200000, 1769688600000] },

        // Fri Jan 30 — 12:00 AM - 1:30 AM
        { type: 'block', rangeMs: [1769731200000, 1769736600000] },

        // Fri Jan 30 — 8:44 AM - 10:18 AM
        { type: 'block', rangeMs: [1769762640000, 1769768280000] },

        // Fri Jan 30 — 10:36 AM
        { type: 'bracket-open', timeMs: 1769769360000 },

        // Fri Jan 30 — 10:36 AM - 11:17 AM
        { type: 'spacer', rangeMs: [1769769360000, 1769771820000] },

        // Fri Jan 30 — 11:17 AM - 11:41 AM
        { type: 'spacer', rangeMs: [1769771820000, 1769773260000] },

        // Fri Jan 30 — 11:17 AM
        { type: 'marker', timeMs: 1769771820000 },

        // Fri Jan 30 — 11:26 AM - 2:16 PM
        { type: 'block', rangeMs: [1769772360000, 1769782560000] },

        // Fri Jan 30 — 11:28 AM
        { type: 'marker', timeMs: 1769772480000 },

        // Fri Jan 30 — 11:41 AM
        { type: 'bracket-close', timeMs: 1769773260000 },

        // Fri Jan 30 — 2:57 PM - 4:53 PM
        { type: 'block', rangeMs: [1769785020000, 1769791980000] },

        // Fri Jan 30 — 3:44 PM
        { type: 'bracket-open', timeMs: 1769787840000 },

        // Fri Jan 30 — 3:44 PM - 4:14 PM
        { type: 'spacer', rangeMs: [1769787840000, 1769789640000] },

        // Fri Jan 30 — 4:14 PM - 4:42 PM
        { type: 'spacer', rangeMs: [1769789640000, 1769791320000] },

        // Fri Jan 30 — 4:14 PM
        { type: 'marker', timeMs: 1769789640000 },

        // Fri Jan 30 — 4:42 PM
        { type: 'bracket-close', timeMs: 1769791320000 },

        // Fri Jan 30 — 4:53 PM - 5:32 PM
        { type: 'spacer', rangeMs: [1769791980000, 1769794320000] },

        // Fri Jan 30 — 8:15 PM - 10:19 PM
        { type: 'block', rangeMs: [1769804100000, 1769811540000] },

        // Fri Jan 30 — 11:18 PM
        { type: 'bracket-open', timeMs: 1769815080000 },

        // Fri Jan 30 — 11:18 PM - 11:22 PM
        { type: 'spacer', rangeMs: [1769815080000, 1769815320000] },

        // Fri Jan 30 — 11:22 PM - 11:57 PM
        { type: 'spacer', rangeMs: [1769815320000, 1769817420000] },

        // Fri Jan 30 — 11:22 PM
        { type: 'marker', timeMs: 1769815320000 },

        // Fri Jan 30 — 11:57 PM - Sat Jan 31 — 12:04 AM
        { type: 'spacer', rangeMs: [1769817420000, 1769817840000] },

        // Fri Jan 30 — 11:57 PM
        { type: 'marker', timeMs: 1769817420000 },

        // Sat Jan 31 — 12:04 AM
        { type: 'bracket-close', timeMs: 1769817840000 },

        // Sat Jan 31 — 1:02 AM - 3:42 AM
        { type: 'block', rangeMs: [1769821320000, 1769830920000] },

        // Sat Jan 31 — 3:42 AM - 4:15 AM
        { type: 'spacer', rangeMs: [1769830920000, 1769832900000] },

        // Sat Jan 31 — 4:49 AM - 5:40 AM
        { type: 'block', rangeMs: [1769834940000, 1769838000000] },

        // Sat Jan 31 — 7:03 AM
        { type: 'bracket-open', timeMs: 1769842980000 },

        // Sat Jan 31 — 7:03 AM - 7:44 AM
        { type: 'spacer', rangeMs: [1769842980000, 1769845440000] },

        // Sat Jan 31 — 7:44 AM - 8:08 AM
        { type: 'spacer', rangeMs: [1769845440000, 1769846880000] },

        // Sat Jan 31 — 7:44 AM
        { type: 'marker', timeMs: 1769845440000 },

        // Sat Jan 31 — 8:08 AM
        { type: 'bracket-close', timeMs: 1769846880000 },

        // Sat Jan 31 — 8:24 AM - 10:08 AM
        { type: 'block', rangeMs: [1769847840000, 1769854080000] },

        // Sat Jan 31 — 9:32 AM
        { type: 'marker', timeMs: 1769851920000 },

        // Sat Jan 31 — 11:30 AM
        { type: 'bracket-open', timeMs: 1769859000000 },

        // Sat Jan 31 — 11:30 AM - 11:51 AM
        { type: 'spacer', rangeMs: [1769859000000, 1769860260000] },

        // Sat Jan 31 — 11:51 AM - 12:20 PM
        { type: 'spacer', rangeMs: [1769860260000, 1769862000000] },

        // Sat Jan 31 — 11:51 AM
        { type: 'marker', timeMs: 1769860260000 },

        // Sat Jan 31 — 12:18 PM - 3:14 PM
        { type: 'block', rangeMs: [1769861880000, 1769872440000] },

        // Sat Jan 31 — 12:20 PM - 12:27 PM
        { type: 'spacer', rangeMs: [1769862000000, 1769862420000] },

        // Sat Jan 31 — 12:20 PM
        { type: 'marker', timeMs: 1769862000000 },

        // Sat Jan 31 — 12:27 PM
        { type: 'bracket-close', timeMs: 1769862420000 },

        // Sat Jan 31 — 3:14 PM - 3:49 PM
        { type: 'spacer', rangeMs: [1769872440000, 1769874540000] },

        // Sat Jan 31 — 4:45 PM - 7:30 PM
        { type: 'block', rangeMs: [1769877900000, 1769887800000] },

        // Sat Jan 31 — 7:30 PM - 8:05 PM
        { type: 'spacer', rangeMs: [1769887800000, 1769889900000] },

        // Sat Jan 31 — 9:42 PM - 11:10 PM
        { type: 'block', rangeMs: [1769895720000, 1769901000000] },

        // Sat Jan 31 — 11:10 PM - 11:29 PM
        { type: 'spacer', rangeMs: [1769901000000, 1769902140000] },
      ],
    },

    {
      id: 'row-K',
      elements: [
        // Thu Jan 29 — 6:20 PM - 8:20 PM
        { type: 'block', rangeMs: [1769710800000, 1769718000000] },

        // Fri Jan 30 — 2:00 AM - 3:30 AM
        { type: 'block', rangeMs: [1769738400000, 1769743800000] },

        // Fri Jan 30 — 10:50 AM - 1:48 PM
        { type: 'block', rangeMs: [1769770200000, 1769780880000] },

        // Fri Jan 30 — 1:48 PM - 2:17 PM
        { type: 'spacer', rangeMs: [1769780880000, 1769782620000] },

        // Fri Jan 30 — 4:14 PM - 6:43 PM
        { type: 'block', rangeMs: [1769789640000, 1769798580000] },

        // Fri Jan 30 — 6:43 PM - 7:14 PM
        { type: 'spacer', rangeMs: [1769798580000, 1769800440000] },

        // Fri Jan 30 — 9:28 PM - 10:53 PM
        { type: 'block', rangeMs: [1769808480000, 1769813580000] },

        // Fri Jan 30 — 10:53 PM - 11:20 PM
        { type: 'spacer', rangeMs: [1769813580000, 1769815200000] },

        // Sat Jan 31 — 12:42 AM - 1:29 AM
        { type: 'block', rangeMs: [1769820120000, 1769822940000] },

        // Sat Jan 31 — 2:04 AM
        { type: 'bracket-open', timeMs: 1769825040000 },

        // Sat Jan 31 — 2:04 AM - 2:13 AM
        { type: 'spacer', rangeMs: [1769825040000, 1769825580000] },

        // Sat Jan 31 — 2:13 AM - 2:31 AM
        { type: 'spacer', rangeMs: [1769825580000, 1769826660000] },

        // Sat Jan 31 — 2:13 AM
        { type: 'marker', timeMs: 1769825580000 },

        // Sat Jan 31 — 2:31 AM - 2:52 AM
        { type: 'spacer', rangeMs: [1769826660000, 1769827920000] },

        // Sat Jan 31 — 2:31 AM
        { type: 'marker', timeMs: 1769826660000 },

        // Sat Jan 31 — 2:52 AM
        { type: 'bracket-close', timeMs: 1769827920000 },

        // Sat Jan 31 — 3:59 AM - 5:33 AM
        { type: 'block', rangeMs: [1769831940000, 1769837580000] },

        // Sat Jan 31 — 7:02 AM
        { type: 'bracket-open', timeMs: 1769842920000 },

        // Sat Jan 31 — 7:02 AM - 7:04 AM
        { type: 'spacer', rangeMs: [1769842920000, 1769843040000] },

        // Sat Jan 31 — 7:04 AM - 7:22 AM
        { type: 'spacer', rangeMs: [1769843040000, 1769844120000] },

        // Sat Jan 31 — 7:04 AM
        { type: 'marker', timeMs: 1769843040000 },

        // Sat Jan 31 — 7:15 AM - 9:35 AM
        { type: 'block', rangeMs: [1769843700000, 1769852100000] },

        // Sat Jan 31 — 7:22 AM - 7:24 AM
        { type: 'spacer', rangeMs: [1769844120000, 1769844240000] },

        // Sat Jan 31 — 7:22 AM
        { type: 'marker', timeMs: 1769844120000 },

        // Sat Jan 31 — 7:24 AM
        { type: 'bracket-close', timeMs: 1769844240000 },

        // Sat Jan 31 — 9:35 AM - 9:45 AM
        { type: 'spacer', rangeMs: [1769852100000, 1769852700000] },

        // Sat Jan 31 — 12:39 PM - 3:10 PM
        { type: 'block', rangeMs: [1769863140000, 1769872200000] },

        // Sat Jan 31 — 3:10 PM - 3:24 PM
        { type: 'spacer', rangeMs: [1769872200000, 1769873040000] },

        // Sat Jan 31 — 4:22 PM - 5:28 PM
        { type: 'block', rangeMs: [1769876520000, 1769880480000] },

        // Sat Jan 31 — 6:00 PM
        { type: 'bracket-open', timeMs: 1769882400000 },

        // Sat Jan 31 — 6:00 PM - 6:05 PM
        { type: 'spacer', rangeMs: [1769882400000, 1769882700000] },

        // Sat Jan 31 — 6:05 PM - 6:24 PM
        { type: 'spacer', rangeMs: [1769882700000, 1769883840000] },

        // Sat Jan 31 — 6:05 PM
        { type: 'marker', timeMs: 1769882700000 },

        // Sat Jan 31 — 6:24 PM - 6:42 PM
        { type: 'spacer', rangeMs: [1769883840000, 1769884920000] },

        // Sat Jan 31 — 6:24 PM
        { type: 'marker', timeMs: 1769883840000 },

        // Sat Jan 31 — 6:42 PM
        { type: 'bracket-close', timeMs: 1769884920000 },

        // Sat Jan 31 — 7:48 PM - 8:39 PM
        { type: 'block', rangeMs: [1769888880000, 1769891940000] },

        // Sat Jan 31 — 8:56 PM
        { type: 'marker', timeMs: 1769892960000 },

        // Sat Jan 31 — 9:57 PM
        { type: 'bracket-open', timeMs: 1769896620000 },

        // Sat Jan 31 — 9:57 PM - 10:16 PM
        { type: 'spacer', rangeMs: [1769896620000, 1769897760000] },

        // Sat Jan 31 — 10:16 PM - 10:32 PM
        { type: 'spacer', rangeMs: [1769897760000, 1769898720000] },

        // Sat Jan 31 — 10:16 PM
        { type: 'marker', timeMs: 1769897760000 },

        // Sat Jan 31 — 10:32 PM - 10:42 PM
        { type: 'spacer', rangeMs: [1769898720000, 1769899320000] },

        // Sat Jan 31 — 10:32 PM
        { type: 'marker', timeMs: 1769898720000 },

        // Sat Jan 31 — 10:42 PM
        { type: 'bracket-close', timeMs: 1769899320000 },

        // Sat Jan 31 — 11:34 PM - Sun Feb 1 — 2:24 AM
        { type: 'block', rangeMs: [1769902440000, 1769912640000] },

        // Sun Feb 1 — 2:24 AM - 2:51 AM
        { type: 'spacer', rangeMs: [1769912640000, 1769914260000] },

        // Sun Feb 1 — 3:24 AM
        { type: 'marker', timeMs: 1769916240000 },

        // Sun Feb 1 — 3:40 AM - 5:56 AM
        { type: 'block', rangeMs: [1769917200000, 1769925360000] },
      ],
    },

    {
      id: 'row-L',
      elements: [
        // Thu Jan 29 — 12:20 PM - 2:20 PM
        { type: 'block', rangeMs: [1769689200000, 1769696400000] },

        // Fri Jan 30 — 5:30 AM - 7:00 AM
        { type: 'block', rangeMs: [1769751000000, 1769756400000] },

        // Fri Jan 30 — 10:03 AM - 10:54 AM
        { type: 'block', rangeMs: [1769767380000, 1769770440000] },

        // Fri Jan 30 — 11:38 AM - 2:26 PM
        { type: 'block', rangeMs: [1769773080000, 1769783160000] },

        // Fri Jan 30 — 11:50 AM
        { type: 'bracket-open', timeMs: 1769773800000 },

        // Fri Jan 30 — 11:50 AM - 12:38 PM
        { type: 'spacer', rangeMs: [1769773800000, 1769776680000] },

        // Fri Jan 30 — 12:38 PM - 12:48 PM
        { type: 'spacer', rangeMs: [1769776680000, 1769777280000] },

        // Fri Jan 30 — 12:38 PM
        { type: 'marker', timeMs: 1769776680000 },

        // Fri Jan 30 — 12:48 PM
        { type: 'bracket-close', timeMs: 1769777280000 },

        // Fri Jan 30 — 3:00 PM
        { type: 'bracket-open', timeMs: 1769785200000 },

        // Fri Jan 30 — 3:00 PM - 3:02 PM
        { type: 'spacer', rangeMs: [1769785200000, 1769785320000] },

        // Fri Jan 30 — 3:02 PM - 3:16 PM
        { type: 'spacer', rangeMs: [1769785320000, 1769786160000] },

        // Fri Jan 30 — 3:02 PM
        { type: 'marker', timeMs: 1769785320000 },

        // Fri Jan 30 — 3:16 PM
        { type: 'bracket-close', timeMs: 1769786160000 },

        // Fri Jan 30 — 3:38 PM - 4:27 PM
        { type: 'block', rangeMs: [1769787480000, 1769790420000] },

        // Fri Jan 30 — 4:27 PM - 4:55 PM
        { type: 'spacer', rangeMs: [1769790420000, 1769792100000] },

        // Fri Jan 30 — 7:28 PM - 9:34 PM
        { type: 'block', rangeMs: [1769801280000, 1769808840000] },

        // Fri Jan 30 — 10:18 PM
        { type: 'bracket-open', timeMs: 1769811480000 },

        // Fri Jan 30 — 10:18 PM - 10:26 PM
        { type: 'spacer', rangeMs: [1769811480000, 1769811960000] },

        // Fri Jan 30 — 10:26 PM - 11:22 PM
        { type: 'spacer', rangeMs: [1769811960000, 1769815320000] },

        // Fri Jan 30 — 10:26 PM
        { type: 'marker', timeMs: 1769811960000 },

        // Fri Jan 30 — 10:48 PM - 11:49 PM
        { type: 'block', rangeMs: [1769813280000, 1769816940000] },

        // Fri Jan 30 — 11:22 PM
        { type: 'bracket-close', timeMs: 1769815320000 },

        // Fri Jan 30 — 11:49 PM - Sat Jan 31 — 12:14 AM
        { type: 'spacer', rangeMs: [1769816940000, 1769818440000] },

        // Sat Jan 31 — 12:54 AM - 3:02 AM
        { type: 'block', rangeMs: [1769820840000, 1769828520000] },

        // Sat Jan 31 — 4:20 AM
        { type: 'bracket-open', timeMs: 1769833200000 },

        // Sat Jan 31 — 4:20 AM - 4:24 AM
        { type: 'spacer', rangeMs: [1769833200000, 1769833440000] },

        // Sat Jan 31 — 4:24 AM - 4:28 AM
        { type: 'spacer', rangeMs: [1769833440000, 1769833680000] },

        // Sat Jan 31 — 4:24 AM
        { type: 'marker', timeMs: 1769833440000 },

        // Sat Jan 31 — 4:27 AM - 5:47 AM
        { type: 'block', rangeMs: [1769833620000, 1769838420000] },

        // Sat Jan 31 — 4:28 AM - 5:30 AM
        { type: 'spacer', rangeMs: [1769833680000, 1769837400000] },

        // Sat Jan 31 — 4:28 AM
        { type: 'marker', timeMs: 1769833680000 },

        // Sat Jan 31 — 4:37 AM
        { type: 'marker', timeMs: 1769834220000 },

        // Sat Jan 31 — 5:30 AM
        { type: 'bracket-close', timeMs: 1769837400000 },

        // Sat Jan 31 — 5:47 AM - 6:04 AM
        { type: 'spacer', rangeMs: [1769838420000, 1769839440000] },

        // Sat Jan 31 — 6:37 AM - 7:24 AM
        { type: 'block', rangeMs: [1769841420000, 1769844240000] },

        // Sat Jan 31 — 7:24 AM - 8:04 AM
        { type: 'spacer', rangeMs: [1769844240000, 1769846640000] },

        // Sat Jan 31 — 9:04 AM - 10:50 AM
        { type: 'block', rangeMs: [1769850240000, 1769856600000] },

        // Sat Jan 31 — 11:19 AM
        { type: 'bracket-open', timeMs: 1769858340000 },

        // Sat Jan 31 — 11:19 AM - 11:31 AM
        { type: 'spacer', rangeMs: [1769858340000, 1769859060000] },

        // Sat Jan 31 — 11:31 AM - 11:37 AM
        { type: 'spacer', rangeMs: [1769859060000, 1769859420000] },

        // Sat Jan 31 — 11:31 AM
        { type: 'marker', timeMs: 1769859060000 },

        // Sat Jan 31 — 11:37 AM
        { type: 'bracket-close', timeMs: 1769859420000 },

        // Sun Feb 1 — 3:37 AM
        { type: 'marker', timeMs: 1769917020000 },
      ],
    },

    {
      id: 'row-M',
      elements: [
        // Thu Jan 29 — 2:00 PM - 3:30 PM
        { type: 'block', rangeMs: [1769695200000, 1769700600000] },

        // Thu Jan 29 — 3:30 PM - 4:00 PM
        { type: 'spacer', rangeMs: [1769700600000, 1769702400000] },

        // Thu Jan 29 — 4:00 PM
        { type: 'bracket-close', timeMs: 1769702400000 },

        // Thu Jan 29 — 10:00 PM - 11:00 PM
        { type: 'block', rangeMs: [1769724000000, 1769727600000] },

        // Fri Jan 30 — 10:42 AM - 12:22 PM
        { type: 'block', rangeMs: [1769769720000, 1769775720000] },

        // Fri Jan 30 — 12:53 PM - 3:09 PM
        { type: 'block', rangeMs: [1769777580000, 1769785740000] },

        // Fri Jan 30 — 12:54 PM
        { type: 'bracket-open', timeMs: 1769777640000 },

        // Fri Jan 30 — 12:54 PM - 12:58 PM
        { type: 'spacer', rangeMs: [1769777640000, 1769777880000] },

        // Fri Jan 30 — 12:58 PM - 1:15 PM
        { type: 'spacer', rangeMs: [1769777880000, 1769778900000] },

        // Fri Jan 30 — 12:58 PM
        { type: 'marker', timeMs: 1769777880000 },

        // Fri Jan 30 — 1:15 PM
        { type: 'bracket-close', timeMs: 1769778900000 },

        // Fri Jan 30 — 3:09 PM - 3:27 PM
        { type: 'spacer', rangeMs: [1769785740000, 1769786820000] },

        // Fri Jan 30 — 4:54 PM - 6:09 PM
        { type: 'block', rangeMs: [1769792040000, 1769796540000] },

        // Fri Jan 30 — 7:06 PM - 9:38 PM
        { type: 'block', rangeMs: [1769799960000, 1769809080000] },

        // Fri Jan 30 — 7:19 PM
        { type: 'bracket-open', timeMs: 1769800740000 },

        // Fri Jan 30 — 7:19 PM - 7:27 PM
        { type: 'spacer', rangeMs: [1769800740000, 1769801220000] },

        // Fri Jan 30 — 7:27 PM - 7:29 PM
        { type: 'spacer', rangeMs: [1769801220000, 1769801340000] },

        // Fri Jan 30 — 7:27 PM
        { type: 'marker', timeMs: 1769801220000 },

        // Fri Jan 30 — 7:29 PM - 7:35 PM
        { type: 'spacer', rangeMs: [1769801340000, 1769801700000] },

        // Fri Jan 30 — 7:29 PM
        { type: 'marker', timeMs: 1769801340000 },

        // Fri Jan 30 — 7:35 PM
        { type: 'bracket-close', timeMs: 1769801700000 },

        // Fri Jan 30 — 10:30 PM
        { type: 'bracket-open', timeMs: 1769812200000 },

        // Fri Jan 30 — 10:30 PM - 11:13 PM
        { type: 'spacer', rangeMs: [1769812200000, 1769814780000] },

        // Fri Jan 30 — 11:13 PM - 11:21 PM
        { type: 'spacer', rangeMs: [1769814780000, 1769815260000] },

        // Fri Jan 30 — 11:13 PM
        { type: 'marker', timeMs: 1769814780000 },

        // Fri Jan 30 — 11:21 PM
        { type: 'bracket-close', timeMs: 1769815260000 },

        // Fri Jan 30 — 11:35 PM - Sat Jan 31 — 1:06 AM
        { type: 'block', rangeMs: [1769816100000, 1769821560000] },

        // Sat Jan 31 — 1:06 AM - 1:34 AM
        { type: 'spacer', rangeMs: [1769821560000, 1769823240000] },

        // Sat Jan 31 — 1:56 AM - 3:54 AM
        { type: 'block', rangeMs: [1769824560000, 1769831640000] },

        // Sat Jan 31 — 3:54 AM - 4:04 AM
        { type: 'spacer', rangeMs: [1769831640000, 1769832240000] },

        // Sat Jan 31 — 4:40 AM - 5:51 AM
        { type: 'block', rangeMs: [1769834400000, 1769838660000] },

        // Sat Jan 31 — 5:51 AM - 6:36 AM
        { type: 'spacer', rangeMs: [1769838660000, 1769841360000] },

        // Sat Jan 31 — 8:21 AM - 10:10 AM
        { type: 'block', rangeMs: [1769847660000, 1769854200000] },

        // Sat Jan 31 — 10:10 AM - 10:37 AM
        { type: 'spacer', rangeMs: [1769854200000, 1769855820000] },

        // Sat Jan 31 — 10:58 AM
        { type: 'marker', timeMs: 1769857080000 },

        // Sat Jan 31 — 12:02 PM - 2:53 PM
        { type: 'block', rangeMs: [1769860920000, 1769871180000] },

        // Sat Jan 31 — 2:53 PM - 3:15 PM
        { type: 'spacer', rangeMs: [1769871180000, 1769872500000] },

        // Sat Jan 31 — 4:45 PM - 5:52 PM
        { type: 'block', rangeMs: [1769877900000, 1769881920000] },

        // Sat Jan 31 — 6:20 PM
        { type: 'bracket-open', timeMs: 1769883600000 },

        // Sat Jan 31 — 6:20 PM - 7:14 PM
        { type: 'spacer', rangeMs: [1769883600000, 1769886840000] },

        // Sat Jan 31 — 7:14 PM - 7:26 PM
        { type: 'spacer', rangeMs: [1769886840000, 1769887560000] },

        // Sat Jan 31 — 7:14 PM
        { type: 'marker', timeMs: 1769886840000 },

        // Sat Jan 31 — 7:26 PM
        { type: 'bracket-close', timeMs: 1769887560000 },

        // Sat Jan 31 — 8:32 PM - 10:03 PM
        { type: 'block', rangeMs: [1769891520000, 1769896980000] },

        // Sat Jan 31 — 9:50 PM
        { type: 'marker', timeMs: 1769896200000 },

        // Sat Jan 31 — 11:18 PM
        { type: 'bracket-open', timeMs: 1769901480000 },

        // Sat Jan 31 — 11:18 PM - 11:23 PM
        { type: 'spacer', rangeMs: [1769901480000, 1769901780000] },

        // Sat Jan 31 — 11:23 PM - 11:30 PM
        { type: 'spacer', rangeMs: [1769901780000, 1769902200000] },

        // Sat Jan 31 — 11:23 PM
        { type: 'marker', timeMs: 1769901780000 },

        // Sat Jan 31 — 11:30 PM - 11:42 PM
        { type: 'spacer', rangeMs: [1769902200000, 1769902920000] },

        // Sat Jan 31 — 11:30 PM
        { type: 'marker', timeMs: 1769902200000 },

        // Sat Jan 31 — 11:42 PM
        { type: 'bracket-close', timeMs: 1769902920000 },
      ],
    },

    {
      id: 'row-N',
      elements: [
        // Thu Jan 29 — 9:40 AM - 11:10 AM
        { type: 'block', rangeMs: [1769679600000, 1769685000000] },

        // Fri Jan 30 — 6:00 AM - 8:00 AM
        { type: 'block', rangeMs: [1769752800000, 1769760000000] },

        // Fri Jan 30 — 9:24 AM - 12:04 PM
        { type: 'block', rangeMs: [1769765040000, 1769774640000] },

        // Fri Jan 30 — 12:04 PM - 12:22 PM
        { type: 'spacer', rangeMs: [1769774640000, 1769775720000] },

        // Fri Jan 30 — 2:54 PM
        { type: 'marker', timeMs: 1769784840000 },

        // Fri Jan 30 — 2:56 PM - 4:09 PM
        { type: 'block', rangeMs: [1769784960000, 1769789340000] },

        // Fri Jan 30 — 5:06 PM - 7:09 PM
        { type: 'block', rangeMs: [1769792760000, 1769800140000] },

        // Fri Jan 30 — 5:13 PM
        { type: 'bracket-open', timeMs: 1769793180000 },

        // Fri Jan 30 — 5:13 PM - 5:16 PM
        { type: 'spacer', rangeMs: [1769793180000, 1769793360000] },

        // Fri Jan 30 — 5:16 PM - 5:23 PM
        { type: 'spacer', rangeMs: [1769793360000, 1769793780000] },

        // Fri Jan 30 — 5:16 PM
        { type: 'marker', timeMs: 1769793360000 },

        // Fri Jan 30 — 5:23 PM - 5:42 PM
        { type: 'spacer', rangeMs: [1769793780000, 1769794920000] },

        // Fri Jan 30 — 5:23 PM
        { type: 'marker', timeMs: 1769793780000 },

        // Fri Jan 30 — 5:42 PM
        { type: 'bracket-close', timeMs: 1769794920000 },

        // Fri Jan 30 — 7:09 PM - 7:28 PM
        { type: 'spacer', rangeMs: [1769800140000, 1769801280000] },

        // Fri Jan 30 — 8:24 PM - 10:46 PM
        { type: 'block', rangeMs: [1769804640000, 1769813160000] },

        // Fri Jan 30 — 10:46 PM - 11:07 PM
        { type: 'spacer', rangeMs: [1769813160000, 1769814420000] },

        // Sat Jan 31 — 2:04 AM - 4:09 AM
        { type: 'block', rangeMs: [1769825040000, 1769832540000] },

        // Sat Jan 31 — 4:31 AM
        { type: 'bracket-open', timeMs: 1769833860000 },

        // Sat Jan 31 — 4:31 AM - 4:34 AM
        { type: 'spacer', rangeMs: [1769833860000, 1769834040000] },

        // Sat Jan 31 — 4:32 AM
        { type: 'marker', timeMs: 1769833920000 },

        // Sat Jan 31 — 4:34 AM - 4:49 AM
        { type: 'spacer', rangeMs: [1769834040000, 1769834940000] },

        // Sat Jan 31 — 4:34 AM
        { type: 'marker', timeMs: 1769834040000 },

        // Sat Jan 31 — 4:49 AM
        { type: 'bracket-close', timeMs: 1769834940000 },

        // Sat Jan 31 — 6:33 AM - 9:31 AM
        { type: 'block', rangeMs: [1769841180000, 1769851860000] },

        // Sat Jan 31 — 9:49 AM
        { type: 'bracket-open', timeMs: 1769852940000 },

        // Sat Jan 31 — 9:49 AM - 10:35 AM
        { type: 'spacer', rangeMs: [1769852940000, 1769855700000] },

        // Sat Jan 31 — 10:35 AM - 10:57 AM
        { type: 'spacer', rangeMs: [1769855700000, 1769857020000] },

        // Sat Jan 31 — 10:35 AM
        { type: 'marker', timeMs: 1769855700000 },

        // Sat Jan 31 — 10:57 AM
        { type: 'bracket-close', timeMs: 1769857020000 },

        // Sat Jan 31 — 11:44 AM - 2:23 PM
        { type: 'block', rangeMs: [1769859840000, 1769869380000] },

        // Sat Jan 31 — 2:23 PM - 3:05 PM
        { type: 'spacer', rangeMs: [1769869380000, 1769871900000] },

        // Sat Jan 31 — 5:18 PM - 6:36 PM
        { type: 'block', rangeMs: [1769879880000, 1769884560000] },

        // Sat Jan 31 — 7:59 PM
        { type: 'bracket-open', timeMs: 1769889540000 },

        // Sat Jan 31 — 7:59 PM - 8:31 PM
        { type: 'spacer', rangeMs: [1769889540000, 1769891460000] },

        // Sat Jan 31 — 8:31 PM - 8:40 PM
        { type: 'spacer', rangeMs: [1769891460000, 1769892000000] },

        // Sat Jan 31 — 8:31 PM
        { type: 'marker', timeMs: 1769891460000 },

        // Sat Jan 31 — 8:40 PM - 8:50 PM
        { type: 'spacer', rangeMs: [1769892000000, 1769892600000] },

        // Sat Jan 31 — 8:40 PM
        { type: 'marker', timeMs: 1769892000000 },

        // Sat Jan 31 — 8:50 PM
        { type: 'bracket-close', timeMs: 1769892600000 },
      ],
    },
  ],
};
