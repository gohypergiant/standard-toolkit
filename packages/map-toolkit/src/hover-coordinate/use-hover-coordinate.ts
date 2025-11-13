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

const MAX_LONGITUDE = 180;
const LONGITUDE_RANGE = 360;
const COORDINATE_PRECISION = 8;
const prepareCoord = (coord: [number, number]) => {
  // Normalize longitude to -180 to 180 range (handles International Date Line)
  let lon = coord[0];
  if (lon > MAX_LONGITUDE) {
    lon -= LONGITUDE_RANGE;
  } else if (lon < -MAX_LONGITUDE) {
    lon += LONGITUDE_RANGE;
  }

  const lat = coord[1];
  const lonStr = `${Math.abs(lon).toFixed(COORDINATE_PRECISION)} ${lon < 0 ? 'W' : 'E'}`;
  const latStr = `${Math.abs(lat).toFixed(COORDINATE_PRECISION)} ${lat < 0 ? 'S' : 'N'}`;

  return `${lonStr} / ${latStr}`;
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: format change should trigger reset
  useEffect(() => {
    setFormattedCoord('--, --');
  }, [format]);

  useOn<MapHoverEvent>(MapEvents.hover, (data: MapHoverEvent) => {
    const eventId = data.payload.id;

    // Ignore hover events from other possible map instances
    if (actualId !== eventId) {
      return;
    }

    const coords = data.payload.info.coordinate;
    // Validate it's a proper coordinate tuple
    if (
      Array.isArray(coords) &&
      coords.length === 2 &&
      typeof coords[0] === 'number' &&
      typeof coords[1] === 'number'
    ) {
      const coord = create(prepareCoord(coords as [number, number]));
      const result = coord[format]();
      setFormattedCoord(result);
    }
  });

  return { formattedCoord, setFormat };
}
