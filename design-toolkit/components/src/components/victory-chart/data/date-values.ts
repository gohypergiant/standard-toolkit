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

import { isChartRow } from './tree-utils';
import type { ChartItem, ChartRow } from '.';

/** Date constants for filtering boundaries */
const LARGE = new Date(Number.POSITIVE_INFINITY);
const SMALL = new Date(Number.NEGATIVE_INFINITY);

const max = (a: Date, b: Date) => (a > b ? a : b);
const min = (a: Date, b: Date) => (a < b ? a : b);

/**
 * Gets the latest "end" date from data
 */
export const getEndDate = (data: ChartRow['data']) =>
  dateValues('end', data).reduce(max, SMALL);

/**
 * Gets the earliest "start" date from data
 */
export const getStartDate = (data: ChartRow['data']) =>
  dateValues('start', data).reduce(min, LARGE);

function dateValues(prop: keyof ChartItem, raw: ChartRow['data']): Date[] {
  return raw.flatMap((item) =>
    isChartRow(item)
      ? item.data.flatMap((child) => dateValues(prop, [child]))
      : item.flatMap((item) => new Date(item[prop])),
  );
}
