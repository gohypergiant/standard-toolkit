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

import { withDeckGL } from '../../stories/decorators/deckgl';
import type { StoryObj } from '@storybook/react-vite';
import './fiber';
import { useId } from 'react';
import { handlers } from '../../stories/mocks/handlers';
import type { Feature, Point } from 'maplibre-gl';
import type { SymbolLayerProps } from './index';

const meta = {
  title: 'DeckGL/SymbolLayer',
  decorators: [withDeckGL({})],
  parameters: {
    layout: 'fullscreen',
    msw: { handlers },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

type TrackProperties = {
  is_emergency: boolean;
  is_force_tell: boolean;
  is_special_process: boolean;
  is_simulation: boolean;
  environment: string;
  track_number: string;
  track_number_system: string;
  site: string;
  platform_type: string;
  course: number;
  uuid: string;
  is_exercise: boolean;
  speed_mps: number;
  sidc: string;
};

type TrackFeature = Feature<
  Omit<Point, 'coordinates'> & { coordinates: [number, number] },
  TrackProperties
>;

export const Something: Story = {
  render: () => {
    const getPosition: SymbolLayerProps['getPosition'] = ({
      geometry,
    }: TrackFeature) => geometry.coordinates;
    const getSidC: SymbolLayerProps['getSidc'] = ({
      properties,
    }: TrackFeature) => properties.sidc || '00000000000000000000';

    return (
      <symbolLayer
        id={useId()}
        data='/tracks'
        getPosition={getPosition}
        getSidc={getSidC}
        getSize={32}
        defaultSymbolOptions={{
          colorMode: 'Light',
          size: 32 * 2,
          square: true,
        }}
        sizeUnits='pixels'
        visible
        pickable
      />
    );
  },
};
