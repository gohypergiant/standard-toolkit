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

import '@/deckgl/grid-layers/gars/fiber';
import { useId } from 'react';
import { withDeckGL } from '@/decorators/deckgl';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta = {
  title: 'DeckGL/Grid Layers/GARS Layer',
  decorators: [withDeckGL({ viewState: { zoom: 8 } })],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default GARS layer showing all three precision levels.
 * Zoom in/out to see different grid densities activate.
 */
export const Default: Story = {
  render: () => {
    return <garsLayer id={useId()} showLabels={true} />;
  },
};

/**
 * GARS layer with custom colors for each precision level.
 */
export const CustomColors: Story = {
  render: () => {
    return (
      <garsLayer
        id={useId()}
        showLabels={true}
        thirtyMinuteStyle={{
          lineColor: [255, 0, 0, 255],
          lineWidth: 3,
          labelColor: [255, 255, 255, 255],
          backgroundColor: [255, 0, 0, 180],
        }}
        fifteenMinuteStyle={{
          lineColor: [0, 255, 0, 200],
          lineWidth: 2,
          labelColor: [255, 255, 255, 255],
          backgroundColor: [0, 255, 0, 160],
        }}
        fiveMinuteStyle={{
          lineColor: [0, 0, 255, 180],
          lineWidth: 1.5,
          labelColor: [255, 255, 255, 255],
          backgroundColor: [0, 0, 255, 140],
        }}
      />
    );
  },
};

/**
 * GARS layer with no labels (grid lines only).
 */
export const NoLabels: Story = {
  render: () => {
    return <garsLayer id={useId()} showLabels={false} />;
  },
};

/**
 * GARS layer showing only 30-minute grid cells.
 * Custom zoom range limits visibility to lower zoom levels.
 */
export const ThirtyMinuteOnly: Story = {
  render: () => {
    return (
      <garsLayer
        id={useId()}
        showLabels={true}
        zoomRanges={[
          {
            type: 'THIRTY_MINUTE',
            key: '30min',
            minZoom: 0,
            maxZoom: 20,
            labelMinZoom: 0,
          },
        ]}
      />
    );
  },
};

/**
 * GARS layer with thin, subtle lines.
 */
export const SubtleGrid: Story = {
  render: () => {
    return (
      <garsLayer
        id={useId()}
        showLabels={false}
        thirtyMinuteStyle={{
          lineColor: [255, 255, 255, 100],
          lineWidth: 1,
        }}
        fifteenMinuteStyle={{
          lineColor: [255, 255, 255, 80],
          lineWidth: 0.8,
        }}
        fiveMinuteStyle={{
          lineColor: [255, 255, 255, 60],
          lineWidth: 0.6,
        }}
      />
    );
  },
};
