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

import '@/deckgl/symbol-layer/fiber';
import { useId } from 'react';
import { withDeckGL } from '@/decorators/deckgl';
import type { Meta, StoryObj } from '@storybook/react';

const MOCK_DATA = [
  {
    sidc: '130340000015011300000000000000',
    position: [-117.957499, 34.236734],
  },
  {
    sidc: '130540000014080000000000000000',
    position: [-117.032638, 32.902588],
  },
  {
    sidc: '130140000011011000000000000000',
    position: [-122.32659, 44.91817],
  },
  {
    sidc: 'SNGPEWAM--*****',
    position: [-122.636867, 47.622294],
  },
  {
    sidc: 'SHGPEWMAT-*****',
    position: [-120.003256, 48.700736],
  },
  {
    sidc: '130610000016480000000000000000',
    position: [-114.569926, 38.717394],
  },
  {
    sidc: '13040000011010500000000000000',
    position: [-104.510301, 31.851944],
  },
  {
    sidc: '130601000011010300000000000000',
    position: [-104.939931, 45.761557],
  },
  {
    sidc: '130405000011160000000000000000',
    position: [-109.321169, 46.589224],
  },
  {
    sidc: '130120000012131200000000000000',
    position: [-95.73333, 30.996191],
  },
  {
    sidc: 'SNGPIMFA--H****',
    position: [-87.305973, 31.6678],
  },
  {
    sidc: '130301000011012900000000000000',
    position: [-82.466525, 31.864581],
  },
  {
    sidc: '130630000012000000000000000000',
    position: [-118.504157, 33.941637],
  },
  {
    sidc: 'SUGPIMF---H****',
    position: [-84.321958, 38.487365],
  },
  {
    sidc: '130301000011010100000000000000',
    position: [-77.504648, 41.59541],
  },
  {
    sidc: '130320000011211200000000000000',
    position: [-77.715059, 35.838516],
  },
  {
    sidc: 'SUAPWMAA--*****',
    position: [-74.790348, 40.46853],
  },
  {
    sidc: '130420000011170000000000000000',
    position: [-82.218397, 32.787792],
  },
  {
    sidc: '130420000012020000000000000000',
    position: [-74.370726, 43.387782],
  },
  {
    sidc: 'SHAPMF----*****',
    position: [-88.308809, 41.661155],
  },
];

const meta: Meta = {
  title: 'DeckGL/Symbol Layer',
  decorators: [withDeckGL()],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const SymbolLayer: Story = {
  render: () => {
    return (
      <symbolLayer
        id={useId()}
        data={MOCK_DATA}
        defaultSymbolOptions={{
          colorMode: 'Dark',
          square: true,
        }}
      />
    );
  },
};
