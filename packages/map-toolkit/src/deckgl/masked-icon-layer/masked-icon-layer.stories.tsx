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
import { ColorPicker } from '@accelint/design-toolkit/components/color-picker';
import { useCallback, useState } from 'react';
import { BaseMap } from '@/deckgl/base-map';
import { MaskedCoffinCornerExtension } from '../extensions/coffin-corner/masked-coffin-corner-extension';
import { MARKER, MARKER_MASKED } from '../shapes/__fixtures__/atlas';
import iconMapping from '../shapes/__fixtures__/atlas.json';
import iconAtlas from '../shapes/__fixtures__/atlas.png';
import type { ColorPickerProps } from '@accelint/design-toolkit/components/color-picker/types';
import './fiber';
import type { Rgba255Tuple } from '@accelint/predicates';
import type { PickingInfo } from '@deck.gl/core';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { EntityId } from '../extensions/coffin-corner';

/** The react-aria Color the swatch picker hands to `onChange`. */
type PickerColor = Parameters<NonNullable<ColorPickerProps['onChange']>>[0];

const meta: Meta = {
  title: 'DeckGL/Masked Icon Layer',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const MAP_ID = uuid();

const CA_VIEW_STATE = {
  longitude: -119.5,
  latitude: 37.0,
  zoom: 5.5,
};

const maskedCoffinCornerExtension = new MaskedCoffinCornerExtension();

const DEFAULT_FILL: Rgba255Tuple = [98, 166, 255, 255]; // blue (#62a6ff)

/** Palette offered by the "Icon fill" picker — the neo shape color palette. */
const FILL_SWATCHES = [
  '#898989', // gray
  '#62a6ff', // blue
  '#30D27E', // green
  '#FCA400', // orange
  '#D4231D', // red
];

interface IconData {
  id: number;
  position: [number, number];
  /** Maskable marker (pink fill → recolored) vs a plain marker (renders unchanged). */
  icon: string;
}

const ICON_DATA: IconData[] = [
  // Maskable markers — their pink region recolors to the chosen fill.
  { id: 1, position: [-122.45, 37.78], icon: MARKER_MASKED },
  { id: 2, position: [-121.49, 38.58], icon: MARKER_MASKED },
  { id: 3, position: [-119.77, 36.74], icon: MARKER_MASKED },
  { id: 4, position: [-118.24, 34.05], icon: MARKER_MASKED },
  // Plain (white) marker with no maskable region — should render unchanged.
  { id: 5, position: [-117.16, 32.72], icon: MARKER },
];

/** Convert the picker's react-aria Color to an [r, g, b, a] tuple. */
function ariaColorToRgba(color: PickerColor): Rgba255Tuple {
  const rgb = color.toFormat('rgb');
  return [
    rgb.getChannelValue('red'),
    rgb.getChannelValue('green'),
    rgb.getChannelValue('blue'),
    255,
  ];
}

function MaskedIconDemo() {
  const [fill, setFill] = useState<Rgba255Tuple>(DEFAULT_FILL);
  const [selected, setSelected] = useState<Set<EntityId>>(() => new Set());
  const [hovered, setHovered] = useState<Set<EntityId>>(() => new Set());

  const handleClick = useCallback((info: PickingInfo) => {
    if (info.index === -1 || !info.object) {
      setSelected(new Set());
      return;
    }

    const id = (info.object as IconData).id;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.clear();
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleHover = useCallback((info: PickingInfo) => {
    setHovered(
      info.index !== -1 && info.object
        ? new Set([(info.object as IconData).id])
        : new Set(),
    );
  }, []);

  return (
    <div className='relative h-dvh w-dvw'>
      <BaseMap
        className='absolute inset-0'
        id={MAP_ID}
        initialViewState={CA_VIEW_STATE}
        onClick={handleClick}
        onHover={handleHover}
      >
        <maskedIconLayer
          id='masked-icons'
          data={ICON_DATA}
          iconAtlas={iconAtlas}
          iconMapping={iconMapping}
          getPosition={(d: unknown) => (d as IconData).position}
          getIcon={(d: unknown) => (d as IconData).icon}
          getSize={48}
          billboard
          pickable
          getFillColor={() => fill}
          updateTriggers={{ getFillColor: [fill] }}
          extensions={[maskedCoffinCornerExtension]}
          getEntityId={(d: unknown) => (d as IconData).id}
          selectedEntityIds={selected}
          hoveredEntityIds={hovered}
        />
      </BaseMap>

      <div className='absolute top-l left-l z-10 flex w-[360px] flex-col gap-m rounded-lg bg-surface-default p-l shadow-elevation-overlay'>
        <p className='font-bold text-header-l'>Masked Icon Layer</p>
        <p className='text-body-s text-content-secondary'>
          The pink marker region recolors to the chosen fill in real time. The
          white marker has no maskable region and is unchanged. Click an icon to
          select, hover for a preview — brackets composite over the recolored
          icon.
        </p>
        <ColorPicker
          label='Icon fill'
          isRequired
          value={fill}
          items={FILL_SWATCHES}
          onChange={(color) => setFill(ariaColorToRgba(color))}
        />
      </div>
    </div>
  );
}

export const Default: Story = {
  render: () => <MaskedIconDemo />,
};
