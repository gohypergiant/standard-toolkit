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

import { BaseMap } from '../deckgl/base-map';
import { ViewportSyncWidget } from '../deckgl/widgets/viewport-sync';
import { ViewportSize as ViewportSizeComponent } from './index';
import type { Meta, StoryObj } from '@storybook/react';

const WIDGETS = [new ViewportSyncWidget({ id: 'default' })];

const meta: Meta = {
  title: 'Viewport',
  decorators: [],
  parameters: {
    layout: '',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ViewportSize: Story = {
  render: () => {
    return (
      <div>
        <ViewportSizeComponent
          viewId='default'
          className='absolute right-xl bottom-xl rounded-medium bg-surface-overlay p-l shadow-elevation-raised'
        />
        <BaseMap
          interleaved={false} // setting it to true breaks the widget somehow, may be a Storybook specific bug
          widgets={WIDGETS}
          className='h-dvh w-dvw'
        />
      </div>
    );
  },
};
