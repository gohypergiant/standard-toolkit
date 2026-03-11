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

import { useOn } from '@accelint/bus/react';
import { uuid } from '@accelint/core';
import {
  Flashcard,
  FlashcardDetailsLabel,
  FlashcardDetailsList,
  FlashcardDetailsValue,
  FlashcardHero,
} from '@accelint/design-toolkit/components/flashcard';
import { useMemo, useState } from 'react';
import { BaseMap } from '@/deckgl/base-map';
import { MapEvents } from '@/deckgl/base-map/events';
import iconMapping from '../../shapes/__fixtures__/atlas.json';
import iconAtlas from '../../shapes/__fixtures__/atlas.png';
import '../../symbol-layer/fiber';
import { HtmlOverlayItem } from './item';
import { useHtmlOverlay } from './use-html-overlay';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { MapClickEvent } from '@/deckgl/base-map/types';

const MAP_ID = uuid();
const LAYER_ID = 'entities';

const INITIAL_VIEW_STATE = {
  longitude: -119.5,
  latitude: 37,
  zoom: 5.5,
};

interface Entity {
  id: number;
  position: [number, number];
  icon: string;
  size: number;
  name: string;
  type: string;
  status: string;
  altitude: string;
  speed: string;
}

const ENTITY_DATA: Entity[] = [
  {
    id: 1,
    position: [-122.45, 37.78],
    icon: 'marker',
    size: 24,
    name: 'Alpha-1',
    type: 'Surveillance',
    status: 'Active',
    altitude: '35,000 ft',
    speed: '450 kts',
  },
  {
    id: 2,
    position: [-118.24, 34.05],
    icon: 'marker-serious',
    size: 24,
    name: 'Bravo-2',
    type: 'Transport',
    status: 'En Route',
    altitude: '28,000 ft',
    speed: '380 kts',
  },
  {
    id: 3,
    position: [-117.16, 32.72],
    icon: 'marker',
    size: 24,
    name: 'Charlie-3',
    type: 'Patrol',
    status: 'Holding',
    altitude: '22,000 ft',
    speed: '0 kts',
  },
  {
    id: 4,
    position: [-121.49, 38.58],
    icon: 'marker-serious',
    size: 24,
    name: 'Delta-4',
    type: 'Recon',
    status: 'Active',
    altitude: '41,000 ft',
    speed: '520 kts',
  },
];

const meta: Meta = {
  title: 'DeckGL/Widgets/HtmlOverlay',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

function FlashcardOnClickDemo() {
  const [selected, setSelected] = useState<Entity | null>(null);

  useOn<MapClickEvent>(MapEvents.click, (event) => {
    const { info } = event.payload;

    if (info.picked && info.object) {
      const entity = info.object as Entity;

      // Toggle off if clicking the same entity
      setSelected((prev) => (prev?.id === entity.id ? null : entity));
    } else {
      // Clicking empty space dismisses the flashcard
      setSelected(null);
    }
  });

  const items = useMemo(
    () =>
      selected ? (
        <HtmlOverlayItem
          key={selected.id}
          coordinates={selected.position}
          zIndex={10}
        >
          <Flashcard
            header={selected.name}
            subheader={selected.type}
            style={{ pointerEvents: 'auto' }}
          >
            <FlashcardHero />
            <FlashcardDetailsList>
              <FlashcardDetailsLabel>Status</FlashcardDetailsLabel>
              <FlashcardDetailsValue>{selected.status}</FlashcardDetailsValue>
              <FlashcardDetailsLabel>Altitude</FlashcardDetailsLabel>
              <FlashcardDetailsValue>{selected.altitude}</FlashcardDetailsValue>
              <FlashcardDetailsLabel>Speed</FlashcardDetailsLabel>
              <FlashcardDetailsValue>{selected.speed}</FlashcardDetailsValue>
            </FlashcardDetailsList>
          </Flashcard>
        </HtmlOverlayItem>
      ) : null,
    [selected],
  );

  const { widget, portal } = useHtmlOverlay({ items });

  return (
    <div className='relative h-dvh w-dvw'>
      <BaseMap
        className='absolute inset-0'
        id={MAP_ID}
        initialViewState={INITIAL_VIEW_STATE}
        widgets={[widget]}
      >
        <iconLayer
          id={LAYER_ID}
          data={ENTITY_DATA}
          iconAtlas={iconAtlas}
          iconMapping={iconMapping}
          getPosition={(d: unknown) => (d as Entity).position}
          getIcon={(d: unknown) => (d as Entity).icon}
          getSize={(d: unknown) => (d as Entity).size}
          pickable
        />
      </BaseMap>
      {portal}
    </div>
  );
}

export const FlashcardOnClick: Story = {
  render: () => <FlashcardOnClickDemo />,
};
