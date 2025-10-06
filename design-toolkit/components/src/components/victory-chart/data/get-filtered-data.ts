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

import { MS_IN_AN_HOUR } from '../lib/date-utils';
import { getStartDate } from './date-values';
import { isChartRow } from './tree-utils';
import type { ChartData, ChartItem, ChartRow } from '.';

type AliasGroup = ChartItem[] | ChartRow;

interface Args<T = ChartRow[]> {
  data: T;
  end: Date;
  removeEmpty?: boolean;
  start: Date;
}

const filterTimeRange = (item: ChartItem, start: Date, end: Date) =>
  item.start <= end && item.end >= start;

function applyFilter({ data, end, removeEmpty, start }: Args): ChartData {
  return data
    .map((group) => {
      const processedData = group.data
        .map((data) => processGroupData({ data, end, removeEmpty, start }))
        .filter((item): item is ChartItem[] | ChartRow => item !== null);

      if (removeEmpty && processedData.length === 0) {
        return null;
      }

      return {
        title: group.title,
        data: processedData,
      };
    })
    .filter((group): group is ChartRow => group !== null);
}

/**
 * Recursively (if necessary) filter data to be only elements that fall within
 * the provided time "window". This filter will include partial results for
 * elements that are both "inside" and "outside" the window.
 *
 * @param data - the data, recursive or flat, to be filtered
 * @param focus - the length, in hours, to filter the data by
 * @param removeEmpty - optionally remove empty elements after filter
 * @returns - the filtered data
 */
export function getFilteredData(
  data: ChartData,
  focus: number,
  removeEmpty = false,
) {
  const begin = getStartDate(data).valueOf();

  return applyFilter({
    data,
    end: new Date(begin + focus * MS_IN_AN_HOUR),
    removeEmpty,
    start: new Date(begin),
  });
}

function processChartItems({ data, end, start }: Args<ChartItem[]>) {
  const filtered = data.filter((item) => filterTimeRange(item, start, end));

  return filtered.length > 0 ? filtered : null;
}

function processChartRow({ data, end, removeEmpty, start }: Args<ChartRow>) {
  const filtered = applyFilter({
    data: [data],
    start,
    end,
    removeEmpty,
  });

  if (filtered.length === 0 && removeEmpty) {
    return null;
  }

  return { ...data, data: filtered?.[0]?.data || [] };
}

function processGroupData({ data, end, removeEmpty, start }: Args<AliasGroup>) {
  return isChartRow(data)
    ? processChartRow({ data, start, end, removeEmpty })
    : processChartItems({ data, start, end });
}
