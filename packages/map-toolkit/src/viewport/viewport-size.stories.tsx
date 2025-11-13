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

import { uuid } from '@accelint/core';
import { ActionBar } from '@accelint/design-toolkit';
import { BaseMap } from '../deckgl/base-map';
import { ViewportSize as ViewportSizeComponent } from './index';
import type { Meta, StoryObj } from '@storybook/react';
import 'maplibre-gl/dist/maplibre-gl.css';

const BASE_MAP_STORY_ID = uuid();

const meta: Meta = {
  title: 'Viewport/Viewport Size',
  args: {
    unit: undefined,
  },
  argTypes: {
    unit: {
      control: 'select',
      options: ['km', 'm', 'nm', 'mi', 'ft'],
    },
  },
};

export default meta;

export const ViewportSize: StoryObj<typeof meta> = {
  render: ({ unit }) => (
    <>
      <BaseMap id={BASE_MAP_STORY_ID} className='h-screen w-screen' />
      <ActionBar className='absolute right-l bottom-xxl'>
        <ViewportSizeComponent instanceId={BASE_MAP_STORY_ID} unit={unit} />
      </ActionBar>
    </>
  ),
};
