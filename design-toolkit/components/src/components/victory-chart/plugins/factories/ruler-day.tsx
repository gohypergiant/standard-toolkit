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

import type React from 'react';
import type { CSSProperties } from 'react';
import type { GridPlacement } from '../../components/ruler';
import type { PluginsInitial } from '..';

export interface RulerDayProps extends GridPlacement {
  fullDate: string;
}

const MIN_IN_AN_HOUR = 60;

function RulerDay(props: RulerDayProps) {
  const { column, fullDate, span } = props;
  const [_weekday, _, date, month, _year] = fullDate.split(/[,\s]/g);

  return (
    <span
      className='@container/victory-day flex items-center justify-center overflow-hidden'
      style={
        {
          containerName: 'victory-day',
          containerType: 'size',
          gridColumn: `${1 + (column - 1) * MIN_IN_AN_HOUR} / span ${
            span * MIN_IN_AN_HOUR
          }`,
          gridRow: props.gridRow,
        } as CSSProperties
      }
      title={`UTC: ${fullDate}`}
    >
      <span
        className='@container/victory-day:w-[<=5em]:inline-block hidden'
        data-display='small'
      >
        {date}
      </span>
      <span
        className='@container/victory-day:w-[<=10em]:inline-block @container/victory-day:w-[>5em]:inline-block hidden'
        data-display='medium'
      >{`${date} ${month}`}</span>
      <span
        className='@container/victory-day:w-[>10em]:inline-block hidden'
        data-display='large'
      >
        {fullDate}
      </span>
    </span>
  );
}

export function factoryForRulerDay({ rulerDay }: PluginsInitial) {
  if (rulerDay === false) {
    return false;
  }

  if (!rulerDay) {
    return RulerDay as React.FC;
  }

  return rulerDay;
}
