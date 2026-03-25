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
import { useOn } from '@accelint/bus/react';
import { uuid } from '@accelint/core';
import { useId, useState } from 'react';
import { BaseMap } from '@/deckgl/base-map';
import { withDeckGL } from '@/decorators/deckgl';
import {
  type GridCellClickEvent,
  GridCellEvents,
  type GridCellHoverEvent,
} from '../core/types';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DEFAULT_VIEW_STATE } from '../../../shared/constants';

const meta: Meta = {
  title: 'DeckGL/Grid Layers/GARS Layer',
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
  decorators: [withDeckGL({ viewState: { zoom: 7 } })],
  args: {
    showLabels: true,
  },
  argTypes: {
    showLabels: {
      control: { type: 'boolean' },
      description: 'Show/hide grid cell labels',
    },
  },
  render: ({ showLabels }) => {
    return <garsLayer id={useId()} showLabels={showLabels} />;
  },
};

/**
 * GARS layer with custom colors for each precision level.
 */
export const CustomColors: Story = {
  decorators: [withDeckGL({ viewState: { zoom: 7 } })],
  args: {
    showLabels: true,
  },
  argTypes: {
    showLabels: {
      control: { type: 'boolean' },
      description: 'Show/hide grid cell labels',
    },
  },
  render: ({ showLabels }) => {
    return (
      <garsLayer
        id={useId()}
        showLabels={showLabels}
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

// Stable ID for event story
const GARS_EVENTS_MAP_ID = uuid();

/**
 * GARS layer with event handling demonstration
 *
 * Demonstrates automatic bus integration:
 * - Hover over grid cells to see hover events (emits grid.hover.enter/exit via bus)
 * - Click a grid cell to see click events (emits grid.click via bus)
 * - Grid events include cell ID, grid type, and map coordinates
 * - Events can be controlled via the bus from anywhere in the app
 */
export const Interactive: Story = {
  args: {
    showLabels: true,
  },
  argTypes: {
    showLabels: {
      control: { type: 'boolean' },
      description: 'Show/hide grid cell labels',
    },
  },
  render: (args) => {
    const [eventLog, setEventLog] = useState<
      Array<{ id: string; message: string }>
    >([]);
    const [hoveredCell, setHoveredCell] = useState<string | null>(null);

    // Log hover enter events
    useOn<GridCellHoverEvent>(GridCellEvents.hover, (event) => {
      if (event.payload.mapId !== GARS_EVENTS_MAP_ID) {
        return;
      }
      setHoveredCell(event.payload.cellId);

      setEventLog((log) => [
        ...log.slice(-4),
        {
          id: `${Date.now()}-hover-${event.payload.cellId}`,
          message: `gridcell:hover - "${event.payload.cellId}"`,
        },
      ]);
    });

    // Log click events
    useOn<GridCellClickEvent>(GridCellEvents.click, (event) => {
      if (event.payload.mapId !== GARS_EVENTS_MAP_ID) {
        return;
      }

      setEventLog((log) => [
        ...log.slice(-4),
        {
          id: `${Date.now()}-click-${event.payload.cellId}`,
          message: `gridcell:click - "${JSON.stringify(event.payload)}`,
        },
      ]);
    });

    return (
      <div className='relative h-dvh w-dvw'>
        <BaseMap
          className='absolute inset-0'
          id={GARS_EVENTS_MAP_ID}
          initialViewState={{ ...DEFAULT_VIEW_STATE, zoom: 7 }}
        >
          <garsLayer
            id='gars-events'
            mapId={GARS_EVENTS_MAP_ID}
            showLabels={args.showLabels}
            enableInteractivity={true}
          />
        </BaseMap>

        {/* Event log showing bus integration */}
        <div className='absolute top-l left-l z-10 flex max-h-[calc(100vh-2rem)] w-[320px] flex-col gap-l rounded-lg bg-surface-default p-l shadow-elevation-overlay'>
          <p className='font-bold text-header-l'>GARS Grid Events</p>

          <div className='rounded-lg bg-info-muted p-s'>
            <p className='mb-xs text-body-xs'>Hovered Cell</p>
            <code className='text-body-m'>{hoveredCell || 'None'}</code>
          </div>

          <div className='flex min-h-0 flex-1 flex-col'>
            <p className='mb-s font-semibold text-body-m'>Event Log</p>
            <div className='min-h-0 flex-1 overflow-y-auto rounded-lg border border-border-default bg-surface-subtle p-s'>
              {eventLog.length === 0 ? (
                <p className='text-body-xs text-content-disabled'>
                  Hover or click on grid cells to see events...
                </p>
              ) : (
                eventLog.map((entry) => (
                  <p key={entry.id} className='mb-xs text-body-xs'>
                    {entry.message}
                  </p>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  },
};
