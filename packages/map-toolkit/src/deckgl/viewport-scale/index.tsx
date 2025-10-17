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
import { type ComponentProps, useRef } from 'react';
import { MapEvents } from '../base-map/events';
import { getViewportScale } from './utils';
import type { MapEventType, MapViewportEvent } from '../base-map/types';
import type { AllowedUnit } from './types';

export const bus = Broadcast.getInstance<MapEventType>();

type ViewportScaleProps = ComponentProps<'span'> & {
  unit?: AllowedUnit;
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
        console.log({ bounds });
        const viewportScale = getViewportScale({
          bounds,
          unit,
        });
        ref.current.innerText = viewportScale;
      }
    },
  );

  return (
    <span data-testid='blah' className={className} {...rest} ref={ref}>
      ### x ### {unit.toUpperCase()}
    </span>
  );
}
