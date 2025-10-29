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
import { coordinateSystems, createCoordinate } from '@accelint/geo';
import { useState } from 'react';
import { MapEvents } from '../deckgl/base-map/events';
import type {
  MapHoverEvent,
  MapViewStateEvent,
} from '../deckgl/base-map/types';

// Should I suppress pascal case warning here? use a completely different type declaration?
export enum FormatTypes {
  Dd = 'dd',
  Ddm = 'ddm',
}

const prepareCoord = (coord: [number, number]) => {
  // Longitude can be above/below 180 when viewport center is near international date line
  const lon =
    coord[0] > 180
      ? coord[0] - 360
      : coord[0] < -180
        ? coord[0] + 360
        : coord[0];
  const lat = coord[1];
  const result = `${Math.abs(lon).toFixed(8) + (lon < 0 ? ' W' : ' E')} / ${Math.abs(lat).toFixed(8) + (lat < 0 ? ' S' : ' N')}`;

  return result;
};

export function useHoverCoordinate() {
  const [formattedCoord, setFormattedCoord] = useState('--, --');
  const [format, setFormat] = useState<FormatTypes>(FormatTypes.Dd);
  const create = createCoordinate(coordinateSystems.dd, 'LONLAT');

  useOn<MapHoverEvent>(MapEvents.hover, (data: MapHoverEvent) => {
    const coords = data.payload.info.coordinate as [number, number];

    if (coords) {
      const coord = create(prepareCoord(coords));
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
