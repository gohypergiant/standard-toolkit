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

import { type JSX, useContext, useMemo } from 'react';
import { ChartContext } from '../lib/chart-context';
import { addHours, fullDateString, HOURS_IN_A_DAY } from '../lib/date-utils';
export interface GridPlacement {
  column: number;
  gridRow: string;
  span: number;
}

interface RulerProps {
  hours: number;
  startAt: Date;
}

const MIN_IN_AN_HOUR = 60;

export function Ruler(props: RulerProps) {
  const {
    plugins: { rulerDay: RulerDay, rulerHour: RulerHour },
    rulerRows: [cssGridDays, cssGridHours],
  } = useContext(ChartContext);

  const markersForDays = useMemo(() => {
    if (!RulerDay) {
      return null;
    }

    let column = 1;
    let day = props.startAt;
    let hours = props.hours;
    const spans: JSX.Element[] = [];

    do {
      const fullDate = fullDateString(day);
      const span = Math.min(hours, HOURS_IN_A_DAY - day.getUTCHours());

      spans.push(
        <RulerDay
          gridRow={`${cssGridDays}`}
          key={fullDate}
          {...{ column, fullDate, span }}
        />,
      );

      column += span;
      hours -= span;
      day = addHours(span, day);
    } while (hours > 0);

    return <>{spans}</>;
  }, [cssGridDays, props.hours, props.startAt, RulerDay]);

  const markersForHours = useMemo(() => {
    if (!RulerHour) {
      return null;
    }

    return (
      <>
        {Array.from({ length: props.hours }, (_, index) => {
          const time = addHours(index, props.startAt);

          return (
            <RulerHour
              column={1 + index * MIN_IN_AN_HOUR}
              gridRow={`${cssGridHours}`}
              hours={props.hours}
              key={time.toUTCString()}
              span={MIN_IN_AN_HOUR}
              time={time}
            />
          );
        })}
      </>
    );
  }, [cssGridHours, props.hours, props.startAt, RulerHour]);

  return (
    <div className='col-span-full grid grid-cols-subgrid'>
      {markersForDays}
      {markersForHours}
    </div>
  );
}
