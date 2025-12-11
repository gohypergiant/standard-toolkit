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
import { uuid } from '@accelint/core';
import { Button } from '@accelint/design-toolkit/components/button/index';
import { OptionsItem } from '@accelint/design-toolkit/components/options/item';
import { SelectField } from '@accelint/design-toolkit/components/select-field/index';
import { Slider } from '@accelint/design-toolkit/components/slider/index';
import { BaseMap } from '../deckgl/base-map';
import { CameraEventTypes } from './events';
import { useCameraState } from './use-camera-state';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CameraEvent, ProjectionType, ViewType } from './types';

const CAMERA_STORY_ID = uuid();

const meta: Meta = {
  title: 'Camera',
};

export default meta;
type Story = StoryObj<typeof meta>;

function CameraToolbar() {
  const bus = Broadcast.getInstance<CameraEvent>();
  const { cameraState } = useCameraState({ instanceId: CAMERA_STORY_ID });
  return (
    <div className='absolute top-l left-l flex w-[256px] flex-col gap-xl rounded-lg bg-surface-default p-l shadow-elevation-overlay'>
      <p className='font-bold text-header-l'>Camera controls</p>
      <div className='relative flex flex-col gap-s'>
        <Button
          variant='filled'
          color='mono-muted'
          onPress={() =>
            bus.emit(CameraEventTypes.reset, { id: CAMERA_STORY_ID })
          }
          className='w-full'
        >
          Reset Camera
        </Button>

        <Slider
          label='Zoom'
          showLabel
          showInput
          value={cameraState.zoom}
          minValue={0}
          maxValue={22}
          layout='stack'
          onChange={(value) => {
            typeof value === 'number' &&
              bus.emit(CameraEventTypes.setZoom, {
                id: CAMERA_STORY_ID,
                zoom: value,
              });
          }}
        />

        <Slider
          label='Pitch'
          showLabel
          showInput
          value={cameraState.pitch}
          minValue={0}
          maxValue={65}
          layout='stack'
          onChange={(value) => {
            typeof value === 'number' &&
              bus.emit(CameraEventTypes.setPitch, {
                id: CAMERA_STORY_ID,
                pitch: value,
              });
          }}
        />
        <Slider
          label='Rotation'
          showLabel
          showInput
          value={cameraState.rotation}
          minValue={0}
          maxValue={360}
          layout='stack'
          onChange={(value) => {
            typeof value === 'number' &&
              bus.emit(CameraEventTypes.setRotation, {
                id: CAMERA_STORY_ID,
                rotation: value,
              });
          }}
        />
        <SelectField
          label='Projection'
          value={cameraState.projection}
          onChange={(value) => {
            bus.emit(CameraEventTypes.setProjection, {
              id: CAMERA_STORY_ID,
              projection: value as ProjectionType,
            });
          }}
        >
          <OptionsItem id='mercator'>Mercator</OptionsItem>
          <OptionsItem id='globe'>Globe</OptionsItem>
        </SelectField>
        <SelectField
          label='View'
          value={cameraState.view}
          onChange={(value) => {
            bus.emit(CameraEventTypes.setView, {
              id: CAMERA_STORY_ID,
              view: value as ViewType,
            });
          }}
        >
          <OptionsItem id='2D'>2D</OptionsItem>
          <OptionsItem id='2.5D'>2.5D</OptionsItem>
          <OptionsItem id='3D'>3D</OptionsItem>
        </SelectField>
      </div>
    </div>
  );
}

export const BasicUsage: Story = {
  render: function Render() {
    return (
      <div className='relative h-dvh w-dvw'>
        <BaseMap className='absolute inset-0' id={CAMERA_STORY_ID} />
        <CameraToolbar />
      </div>
    );
  },
};
