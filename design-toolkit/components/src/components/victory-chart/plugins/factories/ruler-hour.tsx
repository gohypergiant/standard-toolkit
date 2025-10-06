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

import { dayAndDate } from '../../lib/date-utils';
import type React from 'react';
import type { GridPlacement } from '../../components/ruler';
import type { PluginsInitial } from '..';

export interface RulerHourProps extends GridPlacement {
  hours: number;
  time: Date;
}

function RulerHour(props: RulerHourProps) {
  const hoursPadded = `${props.time.getUTCHours()}`.padStart(2, '0');

  return (
    <span
      className='@container/victory-hour flex select-none items-center justify-center overflow-hidden hover:cursor-crosshair hover:bg-gray-300 hover:text-black'
      style={{
        containerName: 'victory-hour',
        containerType: 'size',
        gridColumn: `${props.column} / span ${props.span}`,
        gridRow: props.gridRow,
      }}
      title={`UTC: ${hoursPadded}:00 ${dayAndDate(props.time)}`}
    >
      <span
        className='@container/victory-hour:w-[<=2em]:inline-block hidden'
        data-display='small'
      >
        |
      </span>
      <span
        className='@container/victory-hour:w-[<=4em]:inline-block @container/victory-hour:w-[>2em]:inline-block hidden'
        data-display='medium'
      >
        {hoursPadded}
      </span>
      <span
        className='@container/victory-hour:w-[>4em]:inline-block hidden'
        data-display='large'
      >
        {hoursPadded}:00
      </span>
    </span>
  );
}

export function factoryForRulerHour({ rulerHour }: PluginsInitial) {
  if (rulerHour === false) {
    return false;
  }

  if (!rulerHour) {
    return RulerHour as React.FC;
  }

  return rulerHour;
}
