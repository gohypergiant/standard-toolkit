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
import { useCallback, useMemo, useState } from 'react';
import { BaseMap } from '@/deckgl/base-map';
import { CoffinCornerExtension } from '../extensions/coffin-corner';
import { MARKER, MARKER_MASKED } from '../shapes/__fixtures__/atlas';
import iconMapping from '../shapes/__fixtures__/atlas.json';
import iconAtlas from '../shapes/__fixtures__/atlas.png';
import type { ColorPickerProps } from '@accelint/design-toolkit/components/color-picker/types';
import './fiber';
import type { Rgba255Tuple } from '@accelint/predicates';
import type { PickingInfo } from '@deck.gl/core';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { EntityId } from '../extensions/coffin-corner';
import { Divider } from '@accelint/design-toolkit';

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

const coffinCornerExtension = new CoffinCornerExtension();

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
  // Maskable markers — each recolors independently from its own fill.
  { id: 1, position: [-122.45, 37.78], icon: MARKER_MASKED },
  { id: 2, position: [-121.49, 38.58], icon: MARKER_MASKED },
  { id: 3, position: [-119.77, 36.74], icon: MARKER_MASKED },
  { id: 4, position: [-118.24, 34.05], icon: MARKER_MASKED },
  // Plain (white) marker with no maskable region — should render unchanged.
  { id: 5, position: [-117.16, 32.72], icon: MARKER },
];

/** Per-icon starting fill, so the layer shows different colors per instance. */
const INITIAL_FILLS: Record<number, Rgba255Tuple> = {
  1: [98, 166, 255, 255], // blue
  2: [48, 210, 126, 255], // green
  3: [252, 164, 0, 255], // orange
  4: [212, 35, 29, 255], // red
};

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
  // Per-icon fill colors keyed by id — proves the layer recolors each instance
  // independently rather than tinting the whole layer one color.
  const [fills, setFills] =
    useState<Record<number, Rgba255Tuple>>(INITIAL_FILLS);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [hovered, setHovered] = useState<Set<EntityId>>(() => new Set());

  const handleClick = useCallback((info: PickingInfo) => {
    if (info.index === -1 || !info.object) {
      setSelectedId(null);
      return;
    }

    const id = (info.object as IconData).id;
    setSelectedId((prev) => (prev === id ? null : id));
  }, []);

  const handleHover = useCallback((info: PickingInfo) => {
    setHovered(
      info.index !== -1 && info.object
        ? new Set([(info.object as IconData).id])
        : new Set(),
    );
  }, []);

  const selected = useMemo(
    () => (selectedId === null ? new Set<EntityId>() : new Set([selectedId])),
    [selectedId],
  );

  const selectedFill =
    selectedId === null ? DEFAULT_FILL : (fills[selectedId] ?? DEFAULT_FILL);

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
          getFillColor={(d: unknown) =>
            fills[(d as IconData).id] ?? DEFAULT_FILL
          }
          updateTriggers={{ getFillColor: [fills] }}
          extensions={[coffinCornerExtension]}
          getEntityId={(d: unknown) => (d as IconData).id}
          selectedEntityIds={selected}
          hoveredEntityIds={hovered}
        />
      </BaseMap>

      <div className='absolute top-l left-l z-10 flex w-[360px] flex-col gap-m rounded-lg bg-surface-default p-l shadow-elevation-overlay'>
        <p className='font-bold text-header-l'>Masked Icon Layer</p>
        <p className='text-body-s text-content-secondary'>
          Each pink marker recolors independently from its own fill - they start
          in different colors. The white marker has no maskable region and is
          unchanged.
        </p>
        <p className='text-body-s text-content-secondary'>
          Click a marker to select it, then pick a color to recolor only that
          one. Hover for a preview; brackets composite over the recolored icon.
        </p>
        <Divider />
        <ColorPicker
          label={
            selectedId === null
              ? 'Icon fill (select a marker)'
              : `Icon fill — marker ${selectedId}`
          }
          isRequired
          isDisabled={selectedId === null}
          value={selectedFill}
          items={FILL_SWATCHES}
          onChange={(color) => {
            if (selectedId === null) {
              return;
            }
            const next = ariaColorToRgba(color);
            setFills((prev) => ({ ...prev, [selectedId]: next }));
          }}
        />
      </div>
    </div>
  );
}

export const Default: Story = {
  render: () => <MaskedIconDemo />,
};
