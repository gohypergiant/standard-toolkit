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

import { useOn } from '@accelint/bus/react';
import { useState } from 'react';
import { MapEvents } from '../base-map/events';
import { createCoordinate } from './temp-format';
import type { MapHoverEvent, MapViewStateEvent } from '../base-map/types';

// Should I suppress pascal case warning here? use a completely different type declaration?
export enum FormatTypes {
  Dd = 'dd',
  Ddm = 'ddm',
}

export function useHoverCoordinate() {
  const [formattedCoord, setFormattedCoord] = useState('--, --');
  const [format, setFormat] = useState<FormatTypes>(FormatTypes.Dd);
  //const create = createCoordinate(coordinateSystems.dd, 'LATLON');
  const create = createCoordinate();

  useOn<MapHoverEvent>(MapEvents.hover, (data: MapHoverEvent) => {
    const coords = data.payload.info.coordinate;

    if (coords) {
      const coord = create(coords.join(' / '));
      const result = format ? coord[`${format}`]() : coord.dd();
      setFormattedCoord(result);
    }
  });

  // Are any of these map events actually relevant for this ticket?
  useOn<MapViewStateEvent>(
    MapEvents.viewportChange,
    (data: MapViewStateEvent) => {
      const { latitude, longitude } = data.payload;

      if (latitude && longitude) {
        const coord = create(`${latitude} / ${longitude}`);
        const result = format ? coord[`${format}`]() : coord.dd();
        setFormattedCoord(result);
      }
    },
  );

  return { formattedCoord, setFormat };
}
