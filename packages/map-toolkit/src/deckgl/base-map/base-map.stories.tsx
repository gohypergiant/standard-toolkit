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

import { useMapEvents } from '../hooks/use-map-events';
import { BaseMap } from './index';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'DeckGL',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const BaseMapStory: Story = {
  // Using the deckGL decorator, blank base map.
  render: () => {
    useMapEvents({
      onHover: (payload) => console.log('hover', payload),
      onClick: (payload) => console.log('click', payload),
    });

    // biome-ignore lint/complexity/noUselessFragments: testing
    return <BaseMap className='h-dvh w-dvw'></BaseMap>;
  },
};
