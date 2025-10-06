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

import { useState } from 'react';
import { bus } from '../components/mapClient';
import { MapEvents } from '../components/mapClient/events';
import type {
  MapClickEvent,
  MapHoverEvent,
} from '../components/mapClient/types';

// TODO: need to use the react library: https://github.com/gohypergiant/standard-toolkit/blob/main/packages/bus/README.md#react or manage the memory leak
export function useMapEvents() {
  const [hover, setHover] = useState<Partial<MapHoverEvent['payload']>>();
  const [click, setClick] = useState<Partial<MapClickEvent['payload']>>();

  bus.on(MapEvents.hover, (data: MapHoverEvent) => setHover(data.payload));
  bus.on(MapEvents.click, (data: MapClickEvent) => setClick(data.payload));

  return {
    hover,
    click,
  };
}
