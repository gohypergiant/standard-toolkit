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

import { Broadcast } from '@accelint/bus';
import { useOn } from '@accelint/bus/react';
import { distance } from '@turf/distance';
import {
  type ComponentProps,
  type ComponentType,
  type ElementType,
  useEffect,
  useRef,
} from 'react';
import { MapEvents } from '../base-map/events';
import type { Bounds, MapEventType, MapViewportEvent } from '../base-map/types';

export const bus = Broadcast.getInstance<MapEventType>();

const UNIT_MAP = {
  km: 'kilometers',
  m: 'meters',
  nmi: 'nauticalmiles',
  mi: 'miles',
  ft: 'feet',
} as const;

type AllowedUnit = keyof typeof UNIT_MAP;
type GetViewportScaleArgs = {
  bounds?: Bounds;
  unit: AllowedUnit;
};
type ViewportScale = {
  width?: string;
  height?: string;
  toString: (unit?: 'km' | 'mi' | 'nmi') => string;
};

const formatter = Intl.NumberFormat('en-US');

const getWidth = (unit: AllowedUnit, bounds: Bounds) => {
  const [minX, minY, maxX] = bounds;
  return formatter.format(
    Math.round(
      distance([minY, minX], [minY, maxX], {
        units: UNIT_MAP[unit],
      }),
    ),
  );
};

const getHeight = (unit: AllowedUnit, bounds: Bounds) => {
  const [minX, minY, maxY] = bounds;
  return formatter.format(
    Math.round(
      distance([minX, minY], [minX, maxY], {
        units: UNIT_MAP[unit],
      }),
    ),
  );
};

export function getViewportScale({ bounds, unit }: GetViewportScaleArgs) {
  if (!bounds) {
    return {
      width: undefined,
      height: undefined,
      toString: () => '-- x --',
    } as const;
  }

  const width = getWidth(unit, bounds);
  const height = getHeight(unit, bounds);

  const print = (unit: 'km' | 'mi' | 'nmi' = 'nmi') => {
    const width = getWidth(unit, bounds);
    const height = getHeight(unit, bounds);

    return `${width} x ${height} ${unit.toUpperCase()}`;
  };

  return { width, height, toString: print } as const;
}

type ViewportScaleProps = ComponentProps<'span'> & {
  unit?: AllowedUnit;
  className?: string;
};

export function useViewportScale(unit: AllowedUnit = 'nmi') {
  const viewPortScaleRef = useRef<ViewportScale>(undefined);

  useOn<MapViewportEvent>(
    MapEvents.viewport,
    ({ payload: { bounds } }: MapViewportEvent) => {
      console.log('viewport changed');
      if (bounds) {
        viewPortScaleRef.current = getViewportScale({
          bounds,
          unit,
        });
      }
    },
  );

  return viewPortScaleRef.current;
}

////// using the hook
export function ViewportScale({
  unit = 'nmi',
  className,
  ...rest
}: ViewportScaleProps) {
  const viewPortScale = useViewportScale(unit);
  console.log({ viewPortScale });

  if (!viewPortScale) {
    return (
      <span className={className} {...rest}>
        ### x ### {unit}
      </span>
    );
  }

  return (
    <span className={className} {...rest}>
      {viewPortScale.toString()}
    </span>
  );
}

////// just using the util

// export function ViewportScale({ unit, className }: ViewportScaleProps) {
//   const lastBounds = useRef<Bounds>(undefined);
//   const el = useRef<HTMLSpanElement>(null);

//   useEffect(() => {
//     function onMove(e: { payload: { bounds?: Bounds } }) {
//       if (el.current && e.payload.bounds) {
//         lastBounds.current = e.payload.bounds;

//         el.current.textContent = getViewportScale({
//           bounds: lastBounds.current,
//           unit,
//         }).toString();
//       }
//     }

//     bus.on(EVENTS.MAP_MOVE, onMove);

//     return () => {
//       bus.off(EVENTS.MAP_MOVE, onMove);
//     };
//   }, [unit]);

//   return (
//     <span className={className} ref={el}>
//       {getViewportScale({ bounds: lastBounds.current, unit }).toString()}
//     </span>
//   );
// }
