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

import { uuid } from '@accelint/core';
import { BaseMap } from '@/deckgl/base-map';
import iconMapping from '../../shapes/__fixtures__/atlas.json';
import iconAtlas from '../../shapes/__fixtures__/atlas.png';
import CoffinCornersExtension from './coffin-corners-extension';
import { useCoffinCorner } from './use-coffin-corner';
import type { Meta, StoryObj } from '@storybook/react-vite';

const CA_VIEW_STATE = {
  longitude: -119.5,
  latitude: 37.0,
  zoom: 5.5,
};

interface IconData {
  position: [number, number];
  icon: string;
  size: number;
  id: number;
}

const HIGHLIGHT_COLOR = [0, 0, 0, 0];

const ICON_DATA: IconData[] = [
  // San Francisco area
  { id: 1, position: [-122.45, 37.78], icon: 'marker', size: 24 },
  { id: 2, position: [-122.46, 37.79], icon: 'marker-serious', size: 24 },
  // Los Angeles
  { id: 3, position: [-118.24, 34.05], icon: 'marker', size: 24 },
  // San Diego
  { id: 4, position: [-117.16, 32.72], icon: 'marker-serious', size: 24 },
  // Sacramento
  { id: 5, position: [-121.49, 38.58], icon: 'marker', size: 24 },
  // Fresno
  { id: 6, position: [-119.77, 36.74], icon: 'marker-serious', size: 24 },
  // Oakland
  { id: 7, position: [-122.27, 37.8], icon: 'marker', size: 24 },
  // San Jose
  { id: 8, position: [-121.89, 37.34], icon: 'marker-serious', size: 24 },
  // Santa Barbara
  { id: 9, position: [-119.7, 34.42], icon: 'marker', size: 24 },
  // Monterey
  { id: 10, position: [-121.89, 36.6], icon: 'marker-serious', size: 24 },
];

const meta: Meta = {
  title: 'DeckGL/Coffin Corner',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const MAP_ID = uuid();
const LAYER_ID = 'icons';
const coffinCornersExtension = new CoffinCornersExtension();

function CoffinCornersDemo() {
  const { selectedId } = useCoffinCorner(MAP_ID, LAYER_ID);

  return (
    <div className='relative h-dvh w-dvw'>
      <BaseMap
        className='absolute inset-0'
        id={MAP_ID}
        initialViewState={CA_VIEW_STATE}
      >
        <iconLayer
          id={LAYER_ID}
          data={ICON_DATA}
          iconAtlas={iconAtlas}
          iconMapping={iconMapping}
          getPosition={(d: IconData) => d.position}
          getIcon={(d: IconData) => d.icon}
          getSize={(d: IconData) => d.size}
          pickable
          autoHighlight
          highlightColor={HIGHLIGHT_COLOR}
          extensions={[coffinCornersExtension]}
          selectedEntityId={selectedId}
        />
      </BaseMap>

      <div className='absolute top-l left-l z-10 rounded-lg bg-surface-default p-l shadow-elevation-overlay'>
        <p className='font-bold text-header-l'>Coffin Corners</p>
        <p className='mt-s text-body-s text-content-secondary'>
          Click icon to select/deselect. Hover for preview.
        </p>
      </div>
    </div>
  );
}

export const Default: Story = {
  render: () => <CoffinCornersDemo />,
};
