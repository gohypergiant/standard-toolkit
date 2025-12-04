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
import { useOn } from '@accelint/bus/react';
import { uuid } from '@accelint/core';
import { globalBind } from '@accelint/hotkey-manager';
import { BaseMap as BaseMapComponent } from '../base-map';
import { MapEvents } from '../base-map/events';
import { createSavedViewport } from '../saved-viewports';
import type { MapViewState } from '@deck.gl/core';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { MapViewportEvent, MapViewportPayload } from '../base-map/types';

globalBind();
// Track current viewport (replace with more robust state management as needed)
const bus = Broadcast.getInstance<MapViewportEvent>();
let currentViewport: MapViewportPayload;
const getCurrentViewport = () => currentViewport;
const setCurrentViewport = (newState: MapViewState) => {
  currentViewport = {
    ...currentViewport,
    ...newState,
  };
  bus.emit(MapEvents.viewport, currentViewport);
};

const useSavedViewportHotkey = createSavedViewport({
  threshold: 3000,
  getCurrentViewport,
  setCurrentViewport,
});

const meta: Meta = {
  title: 'DeckGL/Saved Viewports',
};

export default meta;
type Story = StoryObj<typeof meta>;
const SAVED_VIEWPORTS_STORY_ID = uuid();

export const SavedViewports: Story = {
  render: () => {
    useSavedViewportHotkey();

    // Subscribe to viewport changes from BaseMap
    useOn<MapViewportEvent>(MapEvents.viewport, (event) => {
      const newState = {
        ...currentViewport,
        ...event.payload,
      };
      currentViewport = newState;
      console.log('Viewport updated:', newState);
    });

    return (
      <BaseMapComponent className='h-dvh w-dvw' id={SAVED_VIEWPORTS_STORY_ID} />
    );
  },
};
