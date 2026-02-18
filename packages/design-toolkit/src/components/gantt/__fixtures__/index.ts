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
export const START_TIME_MS = 1769472000000;

// Friday, Jan 30, 2026 at 8:00 AM UTC
export const END_TIME_MS = 1769760000000;

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

export const ROWS: Row[] = [
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

      // Tue Jan 27 — 4:15 AM
      { type: 'bracket-open', timeMs: 1769487300000 },
      // Tue Jan 27 — 4:15 AM - 10:30 AM
      { type: 'spacer', rangeMs: [1769487300000, 1769509800000] },

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
      // Tue Jan 27 — 5:25 AM - 6:00 AM
      { type: 'spacer', rangeMs: [1769491500000, 1769493600000] },

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
      // Tue Jan 27 — 6:50 PM - Wed Jan 28 11:30 PM
      { type: 'spacer', rangeMs: [1769540400000, 1769643000000] },

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
      // Wed Jan 28 — 5:10 AM - 10:00 AM
      { type: 'spacer', rangeMs: [1769577000000, 1769594400000] },

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
      // Tue Jan 27 — 11:20 PM - Wed Jan 28 12:10 AM
      { type: 'spacer', rangeMs: [1769556000000, 1769559000000] },
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
      // Wed Jan 28 — 8:30 AM - Thu Jan 29 2:00 PM
      { type: 'spacer', rangeMs: [1769589000000, 1769688000000] },

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
      // Tue Jan 27 — 2:00 AM - Wed Jan 28 12:30 PM
      { type: 'spacer', rangeMs: [1769479200000, 1769603400000] },

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
      // Tue Jan 27 — 6:00 AM - 12:00 PM
      { type: 'spacer', rangeMs: [1769493600000, 1769515200000] },

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
      // Wed Jan 28 — 7:00 AM - 7:30 PM
      { type: 'spacer', rangeMs: [1769583600000, 1769628600000] },

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
      // Tue Jan 27 — 9:40 PM - 10:30 PM
      { type: 'spacer', rangeMs: [1769550000000, 1769553000000] },
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
      // Tue Jan 27 — 6:00 AM - 11:00 AM
      { type: 'spacer', rangeMs: [1769493600000, 1769511600000] },

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
      // Tue Jan 27 — 11:33 AM - 12:23 PM
      { type: 'spacer', rangeMs: [1769511960000, 1769514960000] },
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
      // Tue Jan 27 — 2:30 AM - 4:00 PM
      { type: 'spacer', rangeMs: [1769481000000, 1769532000000] },

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
      // Tue Jan 27 — 5:00 PM - Wed Jan 28 2:00 AM
      { type: 'spacer', rangeMs: [1769533200000, 1769565600000] },

      // Wed Jan 28 — 2:00 AM - 3:30 AM
      { type: 'block', rangeMs: [1769565600000, 1769571000000] },

      // Wed Jan 28 — 9:46 AM
      { type: 'bracket-open', timeMs: 1769599960000 },
      // Wed Jan 28 — 9:46 AM - 10:00 AM
      { type: 'spacer', rangeMs: [1769599960000, 1769601600000] },
      // Wed Jan 28 — 10:00 AM
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
];
