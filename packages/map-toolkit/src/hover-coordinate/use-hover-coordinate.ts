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
import { useContext, useEffect, useState } from 'react';
import { MapEvents } from '../deckgl/base-map/events';
import { MapContext } from '../deckgl/base-map/provider';
import type { UniqueId } from '@accelint/core';
import type { MapHoverEvent } from '../deckgl/base-map/types';

export type FormatTypes = 'dd' | 'ddm' | 'dms' | 'mgrs' | 'utm';

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

export function useHoverCoordinate(id?: UniqueId) {
  const contextId = useContext(MapContext);
  const actualId = id ?? contextId;

  if (!actualId) {
    throw new Error(
      'useHoverCoordinate requires either an id parameter or to be used within a MapProvider',
    );
  }

  const [formattedCoord, setFormattedCoord] = useState('--, --');
  const [format, setFormat] = useState<FormatTypes>('dd');
  const create = createCoordinate(coordinateSystems.dd, 'LONLAT');

  // reset coordinate to default after new format is set
  useEffect(() => {
    console.log(`Format: ${format}`);
    setFormattedCoord('--, --');
  }, [format]);

  useOn<MapHoverEvent>(MapEvents.hover, (data: MapHoverEvent) => {
    console.log(data);
    console.log(data.payload.info.coordinate);
    const eventId = data.payload.id;

    // Ignore hover events from other possible map instances
    if (actualId !== eventId) {
      console.log('Bad id');
      return;
    }

    const coords = data.payload.info.coordinate as [number, number];

    if (coords) {
      console.log('Worked');
      const coord = create(prepareCoord(coords));
      const result = format ? coord[`${format}`]() : coord.dd();
      console.log(`Result: ${result}`);
      setFormattedCoord(result);
    }
  });

  return { formattedCoord, setFormat };
}
