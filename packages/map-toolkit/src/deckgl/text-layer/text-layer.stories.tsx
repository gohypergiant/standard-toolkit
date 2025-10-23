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

import '@/deckgl/text-layer/fiber';
import { useId } from 'react';
import { withDeckGL } from '@/decorators/deckgl';
import type { Color, Position } from '@deck.gl/core';
import type { Meta, StoryObj } from '@storybook/react';

interface TextDataPoint {
  position: Position;
  text: string;
}

interface ColoredTextDataPoint extends TextDataPoint {
  color: Color;
}

const spot = (text: string, position: [number, number]) => ({
  position,
  text,
});

// US Landmarks (longitude, latitude)
const STATUE_OF_LIBERTY = spot('Statue of Liberty', [-74.0445, 40.6892]);
const GOLDEN_GATE_BRIDGE = spot('Golden Gate Bridge', [-122.4786, 37.8199]);
const GRAND_CANYON = spot('Grand Canyon', [-112.1401, 36.1069]);
const GATEWAY_ARCH = spot('Gateway Arch', [-90.1847, 38.6247]);
const SPACE_NEEDLE = spot('Space Needle', [-122.3493, 47.6205]);
const LIBERTY_BELL = spot('Liberty Bell', [-75.1503, 39.9496]);

const meta: Meta = {
  title: 'DeckGL/Text Layer',
  decorators: [withDeckGL()],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicTextLayer: Story = {
  name: 'Basic Usage',
  render: () => {
    return (
      <textLayer
        data={[GOLDEN_GATE_BRIDGE, SPACE_NEEDLE, STATUE_OF_LIBERTY]}
        getColor={[0, 0, 0, 255]}
        getPosition={(d: unknown) => (d as TextDataPoint).position}
        getSize={12}
        getText={(d: unknown) => (d as TextDataPoint).text}
        id={useId()}
        outlineColor={[0, 200, 155, 255]}
        outlineWidth={2}
      />
    );
  },
};

export const StyledText: Story = {
  name: 'Styled Text with Outline',
  render: () => {
    return (
      <>
        <textLayer
          data={[GRAND_CANYON, GATEWAY_ARCH]}
          fontWeight={700}
          getColor={[0, 0, 0, 255]}
          getPosition={(d: unknown) => (d as TextDataPoint).position}
          getSize={24}
          getText={(d: unknown) => (d as TextDataPoint).text}
          id={`${useId()}-main`}
          outlineColor={[255, 155, 255, 255]}
          outlineWidth={2}
        />

        <textLayer
          data={[LIBERTY_BELL]}
          getColor={[0, 0, 0, 255]}
          getPosition={(d: unknown) => (d as TextDataPoint).position}
          getSize={20}
          getText={(d: unknown) => (d as TextDataPoint).text}
          getTextAnchor='middle'
          id={`${useId()}-details`}
          outlineColor={[255, 155, 155, 255]}
          outlineWidth={1}
        />
      </>
    );
  },
};

export const ColoredLabels: Story = {
  name: 'Per-Item Colors',
  render: () => {
    return (
      <textLayer
        data={[
          {
            ...GOLDEN_GATE_BRIDGE,
            color: [100, 0, 0, 255],
          },
          {
            ...GRAND_CANYON,
            color: [0, 100, 0, 255],
          },
          {
            ...STATUE_OF_LIBERTY,
            color: [0, 0, 100, 255],
          },
        ]}
        fontFamily='Arial, sans-serif'
        getColor={(d: unknown) => (d as ColoredTextDataPoint).color}
        getPosition={(d: unknown) => (d as ColoredTextDataPoint).position}
        getSize={14}
        getText={(d: unknown) => (d as ColoredTextDataPoint).text}
        getTextAnchor='middle'
        id={useId()}
        outlineColor={[255, 255, 255, 255]}
        outlineWidth={2}
      />
    );
  },
};
