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

import { BaseMap } from '../base-map';
import { ViewportSyncWidget } from '../widgets/viewport-sync';
import { ViewportScale as ViewportScaleComponent } from '.';
import type { Meta, StoryObj } from '@storybook/react';

const WIDGETS = [new ViewportSyncWidget({ id: 'viewport-sync' })];

const meta: Meta = {
  title: 'DeckGL',
  decorators: [],
  parameters: {
    layout: '',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ViewportScale: Story = {
  render: () => {
    return (
      <div>
        <ViewportScaleComponent className='absolute right-4 bottom-4 bg-gray-400 p-4' />
        <BaseMap
          interleaved={false} // setting it to true breaks the widget somehow, may be a Storybook specific bug
          widgets={WIDGETS}
          className='h-dvh w-dvw'
        />
      </div>
    );
  },
};
