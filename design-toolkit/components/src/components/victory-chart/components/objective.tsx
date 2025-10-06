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

import { useContext, useMemo } from 'react';
import { getEndDate, getStartDate } from '../data/date-values';
import { ChartContext } from '../lib/chart-context';
import { columnCount, gridColumnPlacement } from '../lib/css-grid-utils';
import { getTimeString } from '../lib/date-utils';
import type { ChartItem } from '../data';

interface CoordinationProps {
  data: ChartItem[];
  row: string;
  timelineEnd: number;
  timelineStart: number;
}

export function Objective(props: CoordinationProps) {
  const { plugins } = useContext(ChartContext);

  const { gridTemplateColumns, itemsEnd, itemsStart, nonEmptyTasks } =
    useMemo(() => {
      const itemsEnd = Math.min(
        getEndDate([props.data]).valueOf(),
        props.timelineEnd,
      );
      const itemsStart = getStartDate([props.data]).valueOf();
      const nonEmptyTasks = props.data.filter(
        (item) =>
          item.start.valueOf() >= props.timelineStart &&
          item.end.valueOf() <= props.timelineEnd,
      );
      const gridTemplateColumns = `repeat(${columnCount(itemsEnd, itemsStart)}, 1fr)`;

      return { gridTemplateColumns, itemsEnd, itemsStart, nonEmptyTasks };
    }, [props.data, props.timelineEnd, props.timelineStart]);

  if (!nonEmptyTasks.length) {
    return null;
  }

  return (
    <ol
      className='m-0 grid list-none overflow-hidden p-0'
      style={{
        ...gridColumnPlacement(itemsStart, itemsEnd, props.timelineStart),
        gridRow: props.row,
        gridTemplateColumns,
      }}
      title={`${getTimeString(new Date(itemsStart))} - ${getTimeString(
        new Date(itemsEnd),
      )}`}
    >
      {nonEmptyTasks.map((item) => (
        <li
          key={`${item.title}-${getTimeString(item.start)}`}
          style={{
            ...gridColumnPlacement(
              item.start.valueOf(),
              item.end.valueOf(),
              itemsStart,
            ),
          }}
        >
          <plugins.timing item={item} />
        </li>
      ))}
    </ol>
  );
}
