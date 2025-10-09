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
import { type ComponentProps, useRef } from 'react';
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
  formatter?: Intl.NumberFormat;
};

const numberFormatter = Intl.NumberFormat('en-US');

export function getViewportScale({
  bounds,
  unit,
  formatter = numberFormatter,
}: GetViewportScaleArgs) {
  if (!bounds) {
    return '-- x --' as const;
  }

  const [minX, minY, maxX, maxY] = bounds;

  const width = formatter.format(
    Math.round(
      distance([minY, minX], [minY, maxX], {
        units: 'nauticalmiles',
      }),
    ),
  );

  const height = formatter.format(
    Math.round(
      distance([minX, minY], [minX, maxY], {
        units: 'nauticalmiles',
      }),
    ),
  );

  return `${width} x ${height} ${unit.toUpperCase()}` as const;
}

type ViewportScaleProps = ComponentProps<'span'> & {
  unit?: AllowedUnit;
  className?: string;
};

export function ViewportScale({
  unit = 'nmi',
  className,
  ...rest
}: ViewportScaleProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useOn<MapViewportEvent>(
    MapEvents.viewport,
    ({ payload: { bounds } }: MapViewportEvent) => {
      if (bounds && ref.current) {
        const viewportScale = getViewportScale({
          bounds,
          unit,
        });
        ref.current.innerText = viewportScale;
      }
    },
  );

  return (
    <span className={className} {...rest} ref={ref}>
      ### x ### {unit}
    </span>
  );
}
