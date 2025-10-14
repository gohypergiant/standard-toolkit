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
import { useRef } from 'react';
import { MapEvents } from '../base-map/events';
import { CursorLatLngStyles } from './styles';
import type { MapHoverEvent, MapViewStateEvent } from '../base-map/types';
import type { CursorLatLngProps, FormatTypes } from './types';

export function CursorLatLng(props: CursorLatLngProps) {
  const el = useRef<HTMLDivElement>(null);
  const { formatString } = props;
  //const create = createCoordinate(coordinateSystems.dd, 'LATLON')

  useOn<MapHoverEvent>(MapEvents.hover, (data: MapHoverEvent) => {
    const coords = data.payload.info.coordinate;

    if (coords && el.current) {
      // const coord = create(coords.join(' / '));
      // const formatted = formatString ? coord[`${formatString}`]() : coord.dd();
      el.current.textContent = 'sup';
    }
  });

  // useOn<MapViewStateEvent>(MapEvents.viewportChange, (data: MapViewStateEvent) => {
  //   const { latitude, longitude } = data.payload;

  //   if (latitude && longitude && el.current) {
  //     const coord = create(`${latitude} / ${longitude}`);
  //     const formatted = formatString ? coord[`${formatString}`]() : coord.dd();
  //     el.current.textContent = formatted;
  //   }
  // });

  return (
    <div style={CursorLatLngStyles} ref={el}>
      --, --
    </div>
  );
}
