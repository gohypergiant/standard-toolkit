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

import '@/deckgl/symbol-layer/fiber';
import { uuid } from '@accelint/core';
import { useCallback, useState } from 'react';
import { BaseMap } from '@/deckgl/base-map';
import iconMapping from '../../shapes/__fixtures__/atlas.json';
import iconAtlas from '../../shapes/__fixtures__/atlas.png';
import { CoffinCornerExtension } from './coffin-corner-extension';
import './fiber';
import { useCoffinCorner } from './use-coffin-corner';
import type { Rgba255Tuple } from '@accelint/predicates';
import type { PickingInfo } from '@deck.gl/core';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { EntityId } from './types';

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
const coffinCornerExtension = new CoffinCornerExtension();

function CoffinCornerDemo({
  selectedCoffinCornerColor,
}: {
  selectedCoffinCornerColor: Rgba255Tuple;
}) {
  const { selectedId, hoveredId } = useCoffinCorner(MAP_ID, LAYER_ID);

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
          getPosition={(d: unknown) => (d as IconData).position}
          getIcon={(d: unknown) => (d as IconData).icon}
          getSize={(d: unknown) => (d as IconData).size}
          pickable
          extensions={[coffinCornerExtension]}
          selectedEntityId={selectedId}
          hoveredEntityId={hoveredId}
          selectedCoffinCornerColor={selectedCoffinCornerColor}
        />
      </BaseMap>

      <div className='absolute top-l left-l z-10 rounded-lg bg-surface-default p-l shadow-elevation-overlay'>
        <p className='font-bold text-header-l'>Coffin Corner</p>
        <p className='mt-s text-body-s text-content-secondary'>
          Click icon to select/deselect. Hover for preview.
        </p>
      </div>
    </div>
  );
}

export const Default: Story = {
  args: {
    selectedCoffinCornerColor: [57, 183, 250, 255],
  },
  argTypes: {
    selectedCoffinCornerColor: {
      control: { type: 'object' },
      description:
        'Selected coffin corner color [R, G, B, A] with values 0-255',
    },
  },
  render: (args) => (
    <CoffinCornerDemo
      selectedCoffinCornerColor={args.selectedCoffinCornerColor as Rgba255Tuple}
    />
  ),
};

// -- Set-based multi-select story --

const MULTI_MAP_ID = uuid();
const ICON_LAYER_ID = 'multi-icons';
const SYMBOL_LAYER_ID = 'multi-symbols';

interface SymbolData {
  id: number;
  sidc: string;
  position: [number, number];
}

const SYMBOL_DATA: SymbolData[] = [
  // Sacramento area
  {
    id: 101,
    sidc: '130340000015011300000000000000',
    position: [-121.49, 38.58],
  },
  // Bakersfield
  {
    id: 102,
    sidc: '130540000014080000000000000000',
    position: [-119.02, 35.37],
  },
  // Palm Springs
  {
    id: 103,
    sidc: '130140000011011000000000000000',
    position: [-116.55, 33.83],
  },
  // Redding
  { id: 104, sidc: 'SNGPEWAM--*****', position: [-122.39, 40.59] },
  // Eureka
  {
    id: 105,
    sidc: '130610000016480000000000000000',
    position: [-124.16, 40.8],
  },
];

function MultiSelectDemo({
  selectedCoffinCornerColor,
}: {
  selectedCoffinCornerColor: Rgba255Tuple;
}) {
  const [selected, setSelected] = useState<Set<EntityId>>(() => new Set());
  const [hoveredId, setHoveredId] = useState<EntityId | undefined>();

  const handleClick = useCallback((info: PickingInfo) => {
    if (info.index === -1 || !info.object) {
      setSelected(new Set());
      return;
    }

    const id = (info.object as { id: EntityId }).id;

    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleHover = useCallback((info: PickingInfo) => {
    setHoveredId(
      info.index !== -1 && info.object
        ? (info.object as { id: EntityId }).id
        : undefined,
    );
  }, []);

  return (
    <div className='relative h-dvh w-dvw'>
      <BaseMap
        className='absolute inset-0'
        id={MULTI_MAP_ID}
        initialViewState={CA_VIEW_STATE}
        onClick={handleClick}
        onHover={handleHover}
      >
        <iconLayer
          id={ICON_LAYER_ID}
          data={ICON_DATA}
          iconAtlas={iconAtlas}
          iconMapping={iconMapping}
          getPosition={(d: unknown) => (d as IconData).position}
          getIcon={(d: unknown) => (d as IconData).icon}
          getSize={(d: unknown) => (d as IconData).size}
          pickable
          extensions={[coffinCornerExtension]}
          selectedEntityIds={selected}
          hoveredEntityId={hoveredId}
          selectedCoffinCornerColor={selectedCoffinCornerColor}
        />
        <symbolLayer
          id={SYMBOL_LAYER_ID}
          data={SYMBOL_DATA}
          defaultSymbolOptions={{ colorMode: 'Dark', square: true }}
          pickable
          extensions={[coffinCornerExtension]}
          selectedEntityIds={selected}
          hoveredEntityId={hoveredId}
          selectedCoffinCornerColor={selectedCoffinCornerColor}
        />
      </BaseMap>

      <div className='absolute top-l left-l z-10 rounded-lg bg-surface-default p-l shadow-elevation-overlay'>
        <p className='font-bold text-header-l'>Multi-Select</p>
        <p className='mt-s text-body-s text-content-secondary'>
          Click to toggle selection across both layers. Uses{' '}
          <code>selectedEntityIds</code> Set prop.
        </p>
        {selected.size > 0 && (
          <p className='mt-s text-body-s text-content-secondary'>
            Selected: {[...selected].join(', ')}
          </p>
        )}
      </div>
    </div>
  );
}

export const MultiSelect: Story = {
  args: {
    selectedCoffinCornerColor: [57, 183, 250, 255],
  },
  argTypes: {
    selectedCoffinCornerColor: {
      control: { type: 'object' },
      description:
        'Selected coffin corner color [R, G, B, A] with values 0-255',
    },
  },
  render: (args) => (
    <MultiSelectDemo
      selectedCoffinCornerColor={args.selectedCoffinCornerColor as Rgba255Tuple}
    />
  ),
};
