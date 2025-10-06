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

import { addHours } from '../lib/date-utils';
import type { ChartRow } from '../data';

const NATO = [
  'Alfa',
  'Bravo',
  'Charlie',
  'Delta',
  'Echo',
  'Foxtrot',
  'Golf',
  'Hotel',
  'India',
  'Juliett',
  'Kilo',
  'Lima',
  'Mike',
  'November',
  'Oscar',
  'Papa',
  'Quebec',
  'Romeo',
  'Sierra',
  'Tango',
  'Uniform',
  'Victor',
  'Whiskey',
  'Xray',
  'Yankee',
  'Zulu',
];

const rand = (list = NATO) => list[Math.trunc(Math.random() * list.length)];
const usedNames = new Set<string>();

function createTitle(): string {
  if (usedNames.size === 676) {
    throw new Error('All names taken.');
  }

  const result = `${rand()} ${rand()}`;

  // NOTE: there is no good reason for recursion here other than amusing myself
  return !usedNames.has(result) && usedNames.add(result)
    ? result
    : createTitle();
}

function mockChartItemsGroup(template: string, start: Date) {
  const title = createTitle();
  const [count = 3, offset = 10, groups = 1] = template
    .split(' ')
    .filter(Boolean)
    .map((val) => Number.parseFloat(val));

  return {
    title,
    data: Array.from({ length: groups }, (_, groupIndex) => {
      const groupStart = addHours(
        (groupIndex * (1 + count) * offset) / 60,
        new Date(start),
      );

      return Array.from({ length: count }, (_, itemIndex) => {
        return {
          start: addHours((itemIndex * offset) / 60, groupStart),
          end: addHours(((1 + itemIndex) * offset) / 60, groupStart),
          title: `${title} ${groupStart.getUTCHours() + 1}`,
        };
      });
    }),
  };
}

function mockChartRow(...data: ChartRow[]) {
  return {
    data,
    title: createTitle(),
  };
}

// const now = new Date();
const now = new Date('2025-04-20');
const midpoint = new Date(`${now.toISOString().replace(/T.*/, '')} 12:00Z`);

export const data: ChartRow[] = [
  mockChartRow(
    mockChartItemsGroup('4 15 3', addHours(-14, midpoint)),
    mockChartItemsGroup('4 20 4', addHours(-12, midpoint)),
    mockChartItemsGroup('', addHours(-8, midpoint)), // use defaults
    mockChartItemsGroup('4 25 2', addHours(-2, midpoint)),
    mockChartItemsGroup('4 45 2', addHours(3, midpoint)),
    mockChartItemsGroup('4 15 4', addHours(8, midpoint)),
    mockChartItemsGroup('4 60 3', addHours(12, midpoint)),
    mockChartItemsGroup('4 95', addHours(14, midpoint)),
  ),

  // mockChartRow(
  //   mockChartItemsGroup('4 5 2', '2024-10-15 08:00 GMT-0400'),
  //   mockChartRow(
  //     mockChartItemsGroup('2 5', '2024-10-15 10:00 GMT-0400'),
  //     mockChartItemsGroup('2 15', '2024-10-15 13:00 GMT-0400'),
  //   ),
  //   mockChartItemsGroup('3 15', '2024-10-15 18:00 GMT-0400'),
  //   mockChartItemsGroup('3 5 3', '2024-10-15 09:00 GMT-0400'),
  //   mockChartItemsGroup('2 15', '2024-10-15 14:00 GMT-0400'),
  // ),
  // mockChartRow(
  //   mockChartRow(
  //     mockChartItemsGroup('6 5', '2024-10-15 10:00 GMT-0400'),
  //     mockChartItemsGroup('5 15', '2024-10-15 13:00 GMT-0400'),
  //   ),
  //   mockChartItemsGroup('4 5 2', '2024-10-15 08:00 GMT-0400'),
  //   mockChartItemsGroup('3 15', '2024-10-15 12:00 GMT-0400'),
  // ),
  // mockChartItemsGroup('3 5', '2024-10-15 09:00 GMT-0400'),
  // mockChartItemsGroup('2 15 3', '2024-10-15 14:00 GMT-0400'),
];
