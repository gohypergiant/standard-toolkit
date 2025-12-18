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

import { useEmit, useOn } from '@accelint/bus/react';
import { type UniqueId, uuid } from '@accelint/core';
import { Button } from '@accelint/design-toolkit/components/button';
import { useState } from 'react';
import { MapEvents } from './events';
import { BaseMap as BaseMapComponent } from './index';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type {
  MapClickEvent,
  MapDisablePanEvent,
  MapDisableZoomEvent,
  MapEnablePanEvent,
  MapEnableZoomEvent,
  MapHoverEvent,
} from '../base-map/types';

const meta: Meta = {
  title: 'DeckGL/Base Map',
};

export default meta;
type Story = StoryObj<typeof meta>;

// Stable id for Storybook story
const BASE_MAP_STORY_ID = uuid();

export const BaseMap: Story = {
  render: () => {
    useOn<MapClickEvent>(MapEvents.click, (data: MapClickEvent) => {
      console.log('click:', data.payload);
    });

    useOn<MapHoverEvent>(MapEvents.hover, (data: MapHoverEvent) => {
      console.log('hover:', data.payload);
    });

    return <BaseMapComponent className='h-dvh w-dvw' id={BASE_MAP_STORY_ID} />;
  },
};

const CONTROLS_STORY_ID = uuid();

function ControlsToolbar({ mapId }: { mapId: UniqueId }) {
  const [panEnabled, setPanEnabled] = useState(true);
  const [zoomEnabled, setZoomEnabled] = useState(true);

  const emitEnablePan = useEmit<MapEnablePanEvent>(MapEvents.enablePan);
  const emitDisablePan = useEmit<MapDisablePanEvent>(MapEvents.disablePan);
  const emitEnableZoom = useEmit<MapEnableZoomEvent>(MapEvents.enableZoom);
  const emitDisableZoom = useEmit<MapDisableZoomEvent>(MapEvents.disableZoom);

  const togglePan = () => {
    if (panEnabled) {
      emitDisablePan({ id: mapId });
    } else {
      emitEnablePan({ id: mapId });
    }
    setPanEnabled(!panEnabled);
  };

  const toggleZoom = () => {
    if (zoomEnabled) {
      emitDisableZoom({ id: mapId });
    } else {
      emitEnableZoom({ id: mapId });
    }
    setZoomEnabled(!zoomEnabled);
  };

  return (
    <div className='absolute top-l left-l flex w-[256px] flex-col gap-xl rounded-lg bg-surface-default p-l shadow-elevation-overlay'>
      <p className='font-bold text-header-l'>Map Controls</p>
      <div className='flex flex-col gap-s'>
        <Button
          variant={zoomEnabled ? 'filled' : 'outline'}
          color={zoomEnabled ? 'accent' : 'mono-muted'}
          onPress={toggleZoom}
          className='w-full'
        >
          Zoom: {zoomEnabled ? 'ON' : 'OFF'}
        </Button>
        <Button
          variant={panEnabled ? 'filled' : 'outline'}
          color={panEnabled ? 'accent' : 'mono-muted'}
          onPress={togglePan}
          className='w-full'
        >
          Pan: {panEnabled ? 'ON' : 'OFF'}
        </Button>
      </div>
    </div>
  );
}

export const WithControls: Story = {
  render: () => {
    return (
      <div className='relative h-dvh w-dvw'>
        <BaseMapComponent className='h-full w-full' id={CONTROLS_STORY_ID} />
        <ControlsToolbar mapId={CONTROLS_STORY_ID} />
      </div>
    );
  },
};
