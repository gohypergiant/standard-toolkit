/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

'use client';

import '@accelint/map-toolkit/deckgl/symbol-layer/fiber';
import { DEFAULT_VIEW_STATE } from '@accelint/map-toolkit/shared/constants';
import { MapExample } from '~/features/map';

/**
 * Symbols spread across the map, plus one pinned to the initial view center
 * (`id: 'center'`) so an integration test can click canvas-center and reliably
 * hit a known feature without doing any lng/lat → screen projection.
 */
const SYMBOL_DATA = [
  {
    id: 'center',
    sidc: '130301000011010100000000000000',
    position: [DEFAULT_VIEW_STATE.longitude, DEFAULT_VIEW_STATE.latitude],
  },
  {
    id: 1,
    sidc: '130340000015011300000000000000',
    position: [-117.957499, 34.236734],
  },
  {
    id: 2,
    sidc: '130540000014080000000000000000',
    position: [-122.32659, 44.91817],
  },
  {
    id: 3,
    sidc: '130610000016480000000000000000',
    position: [-95.73333, 30.996191],
  },
];

export default function Page() {
  return (
    <MapExample>
      <symbolLayer
        id='symbols'
        data={SYMBOL_DATA}
        defaultSymbolOptions={{ colorMode: 'Dark', square: true }}
        pickable
      />
    </MapExample>
  );
}
