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

import { useEmit } from '@accelint/bus/react';
import { uuid } from '@accelint/core';
import { Button } from '@accelint/design-toolkit/components/button';
import { OptionsItem } from '@accelint/design-toolkit/components/options/item';
import { SelectField } from '@accelint/design-toolkit/components/select-field';
import { Slider } from '@accelint/design-toolkit/components/slider';
import { BaseMap } from '../deckgl/base-map';
import { CameraEventTypes } from './events';
import { useCameraState } from './store';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type {
  CameraResetEvent,
  CameraSetPitchEvent,
  CameraSetProjectionEvent,
  CameraSetRotationEvent,
  CameraSetViewEvent,
  CameraSetZoomEvent,
  ProjectionType,
  ViewType,
} from './types';

const CAMERA_STORY_ID = uuid();

const meta: Meta = {
  title: 'Camera',
};

export default meta;
type Story = StoryObj<typeof meta>;

function CameraToolbar() {
  const setZoom = useEmit<CameraSetZoomEvent>(CameraEventTypes.setZoom);
  const setPitch = useEmit<CameraSetPitchEvent>(CameraEventTypes.setPitch);
  const setRotation = useEmit<CameraSetRotationEvent>(
    CameraEventTypes.setRotation,
  );
  const setProjection = useEmit<CameraSetProjectionEvent>(
    CameraEventTypes.setProjection,
  );
  const resetCamera = useEmit<CameraResetEvent>(CameraEventTypes.reset);
  const setView = useEmit<CameraSetViewEvent>(CameraEventTypes.setView);
  const { cameraState } = useCameraState(CAMERA_STORY_ID);
  return (
    <div className='absolute top-l left-l flex w-[256px] flex-col gap-xl rounded-lg bg-surface-default p-l shadow-elevation-overlay'>
      <p className='font-bold text-header-l'>Camera controls</p>
      <div className='relative flex flex-col gap-s'>
        <Button
          variant='filled'
          color='mono-muted'
          onPress={() => resetCamera({ id: CAMERA_STORY_ID })}
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
            typeof value === 'number'
              ? setZoom({
                  id: CAMERA_STORY_ID,
                  zoom: value,
                })
              : setZoom({
                  id: CAMERA_STORY_ID,
                  zoom: value[0] ?? 0,
                });
          }}
        />

        <Slider
          label='Pitch'
          showLabel
          showInput
          value={cameraState.pitch}
          isDisabled={cameraState.view !== '2.5D'}
          minValue={0}
          maxValue={65}
          layout='stack'
          onChange={(value) => {
            typeof value === 'number'
              ? setPitch({
                  id: CAMERA_STORY_ID,
                  pitch: value,
                })
              : setPitch({
                  id: CAMERA_STORY_ID,
                  pitch: value[0] ?? 0,
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
            typeof value === 'number'
              ? setRotation({
                  id: CAMERA_STORY_ID,
                  rotation: value,
                })
              : setRotation({
                  id: CAMERA_STORY_ID,
                  rotation: value[0] ?? 0,
                });
          }}
        />
        <SelectField
          label='Projection'
          value={cameraState.projection}
          onChange={(value) => {
            setProjection({
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
            setView({
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
