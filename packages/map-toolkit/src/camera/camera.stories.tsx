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

import { useEffectEvent } from '@accelint/bus/react';
import { uuid } from '@accelint/core';
import { useEffect } from 'react';
import { useArgs } from 'storybook/preview-api';
import { BaseMap } from '../deckgl/base-map';
import { useCameraState } from './use-camera-state';
import type { Meta, StoryObj } from '@storybook/react-vite';

const BASE_MAP_STORY_ID = uuid();

const meta: Meta = {
  title: 'Camera',
  args: {
    zoom: 0,
    pitch: 0,
    bearing: 0,
    projection: 'mercator',
  },
  argTypes: {
    zoom: {
      control: {
        type: 'range',
        min: 0,
        max: 22,
        step: 0.1,
      },
    },
    pitch: {
      control: {
        type: 'range',
        min: 0,
        max: 90,
        step: 1,
      },
    },
    bearing: {
      control: {
        type: 'range',
        min: -180,
        max: 180,
        step: 1,
      },
    },
    projection: {
      control: 'select',
      options: ['mercator', 'globe'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicUsage: Story = {
  args: {
    zoom: 0,
  },

  render: function Render() {
    const [{ zoom, pitch, bearing, projection }] = useArgs();

    const { cameraState: currentCameraState, setCameraState } = useCameraState({
      instanceId: BASE_MAP_STORY_ID,
    });

    const onChange = useEffectEvent((cameraState) => {
      const {
        zoom: newZoom,
        pitch: newPitch,
        bearing: newBearing,
        projection: newProjection,
      } = cameraState;
      setCameraState(BASE_MAP_STORY_ID, {
        ...currentCameraState,
        zoom: newZoom,
        pitch: newPitch,
        bearing: newBearing,
        projection: newProjection,
      });
    });

    useEffect(() => {
      onChange({ zoom, pitch, bearing, projection });
    }, [zoom, pitch, bearing, projection, onChange]);

    return <BaseMap id={BASE_MAP_STORY_ID} className='h-screen w-screen' />;
  },
};
