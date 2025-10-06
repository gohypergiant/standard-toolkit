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

import { getParents } from '../data/tree-utils';
import type { ChartData } from '../data';
import type { Plugins } from '../plugins';

type TreeNode = ReturnType<typeof getParents>[number];

const MIN_IN_AN_HOUR = 60;

const namedTemplateRow = ({ item, parents }: TreeNode) =>
  `[${gridTemplateRowName(parents, item.title)}] var(--row-height)`;

const rulerOptions = {
  '00': ['', ''],
  '01': ['', '1 / -1'],
  '10': ['1 / -1', ''],
  '11': ['1 / 2', '2 / 2'],
};

const rulerRowRules = [
  '',
  '[ruler] var(--row-height)',
  '[ruler] calc(1.3 * var(--row-height))',
];

const sum = (a: boolean, b: boolean) => Number(a) + Number(b);

export function columnCount(num: number, start: number) {
  return Math.trunc(
    (num - start) /
      // 1000 * 60 = milliseconds per second
      // 60 / props.hourDivisions = minutes per hour subdivision
      // higher numbers of hour subdivisions means more granular display of time
      // lower (lowest being 1) mean that fewer divisions of an hour in the grid
      // less (fewer/lower) divisions means more time detail will be lost due to
      // "rounding"; time fidelity "loss" will result in possible overlapping
      (1000 * 60 * (60 / MIN_IN_AN_HOUR)),
  );
}

export function genGridTemplateRows(plugins: Plugins, data: ChartData) {
  return [
    rulerRowRules[sum(!!plugins.rulerDay, !!plugins.rulerHour)],
    ...getParents(data).map(namedTemplateRow),
  ].join(' ');
}

export function gridColumnPlacement(start: number, end: number, rel: number) {
  return {
    gridColumnEnd: `${1 + columnCount(end, rel)}`,
    gridColumnStart: `${1 + columnCount(start, rel)}`,
  };
}

export function gridTemplateRowName(parents: ChartData, title: string) {
  return `${[...parents, { title }]
    .map(({ title }) => title)
    .join('_')
    .toLowerCase()
    .replace(/[^-_a-z0-9]/gi, '-')}`;
}

export function rulerGridRows(day: boolean, hour: boolean) {
  return rulerOptions[
    [day, hour]
      .map((x) => Number(!!x)) // convert to 0 or 1; false === 0, truthy === 1
      .join('') as keyof typeof rulerOptions
  ] as [string, string];
}
