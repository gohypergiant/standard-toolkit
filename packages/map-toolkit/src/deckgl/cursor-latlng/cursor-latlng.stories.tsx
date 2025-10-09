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

import { Broadcast } from '@accelint/bus';
import { BaseMap } from '../base-map';
import { CursorLatLng } from './index';
import type { PickingInfo, Position } from '@deck.gl/core';
import type { Meta, StoryObj } from '@storybook/react';
import type { IControl } from 'maplibre-gl';

const meta: Meta = {
  title: 'Components/Cursor LatLng',
  component: CursorLatLng,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    test: false,
  },
} satisfies Meta<typeof CursorLatLng>;

export default meta;
type Story = StoryObj<typeof meta>;

const emitObject = (pickInfo: PickingInfo) => ({
  coordinates: [Number.NaN, Number.NaN],
  id: undefined,
  index: pickInfo.index,
  layerId: pickInfo.layer?.id,
  screenSpace: pickInfo.pixel as Position,
  type: undefined,
  worldSpace: pickInfo.coordinate as Position,
});

export const Default: Story = {
  render: ({ ...args }) => {
    return (
      <div>
        <BaseMap />
        <div
          className='size-[400px]'
          style={{ position: 'absolute', left: 0, top: 0, color: 'white' }}
        >
          <CursorLatLng />
        </div>
      </div>
    );
  },
};
