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

import { useOn } from '@accelint/bus/react';
import { MapEvents } from './events';
import { BaseMap as BaseMapComponent } from './index';
import type { Meta, StoryObj } from '@storybook/react';
import type { MapClickEvent, MapHoverEvent } from '../base-map/types';

const meta: Meta = {
  title: 'DeckGL',
};

export default meta;
type Story = StoryObj<typeof meta>;

export const BaseMap: Story = {
  render: () => {
    useOn<MapClickEvent>(MapEvents.click, (data: MapClickEvent) => {
      console.log('click:', data.payload);
    });

    useOn<MapHoverEvent>(MapEvents.hover, (data: MapHoverEvent) => {
      console.log('hover:', data.payload);
    });

    return <BaseMapComponent className='h-dvh w-dvw' />;
  },
};
