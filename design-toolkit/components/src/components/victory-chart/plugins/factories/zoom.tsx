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

import { Range } from '../range';
import type React from 'react';
import type { ChartState } from '../../lib/chart-state';
import type { PluginsInitial } from '..';

interface ZoomProps {
  onUpdate: (state: Partial<ChartState>) => void;
  state: ChartState;
}

const ZOOM_STEP = 100;
const ZOOM_STEP_COUNT = 5;

export function factoryForZoom({ zoom }: PluginsInitial) {
  if (zoom === false) {
    return false;
  }

  if (!zoom) {
    return (({ onUpdate, state }: ZoomProps) => (
      <Range
        altText={'How big to make the timeline.'}
        label={'Zoom'}
        max={ZOOM_STEP_COUNT * ZOOM_STEP}
        min={ZOOM_STEP}
        onUpdate={(e) => {
          onUpdate({ zoom: Number.parseFloat(e.target.value) });
        }}
        preview={`${state.zoom}%`}
        // step={ZOOM_STEP}
        value={state.zoom}
      />
    )) as React.FC;
  }

  return zoom;
}
