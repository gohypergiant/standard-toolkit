/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
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
import {
  DARK_BASE_MAP_STYLE,
  LIGHT_BASE_MAP_STYLE,
} from '../deckgl/base-map/constants';
import { BaseMap as BaseMapComponent } from '../deckgl/base-map';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta = {
  title: 'DeckGL/Rubber Band Zoom',
};

export default meta;
type Story = StoryObj<typeof meta>;

// Stable id for Storybook story
const RBZ_HANDLER_STORY_ID = uuid();

export const BasicUsage: Story = {
  args: {
    enableRbz: true,
    boxZoom: false,
    styleUrl: DARK_BASE_MAP_STYLE,
  },
  argTypes: {
    enableRbz: {
      control: { type: 'boolean' },
      description:
        'Enable rubber band zoom (Shift + drag). Disables native box zoom when enabled.',
    },
    boxZoom: {
      control: { type: 'boolean' },
      description:
        'Enable native MapLibre box zoom. Automatically false when enableRbz is true.',
    },
    styleUrl: {
      control: { type: 'select' },
      options: [DARK_BASE_MAP_STYLE, LIGHT_BASE_MAP_STYLE],
      labels: {
        [DARK_BASE_MAP_STYLE]: 'Dark Matter',
        [LIGHT_BASE_MAP_STYLE]: 'Voyager (Light)',
      },
    },
  },
  render: (args) => {
    return (
      <BaseMapComponent
        className='h-dvh w-dvw'
        id={RBZ_HANDLER_STORY_ID}
        enableRbz={args.enableRbz}
        boxZoom={args.boxZoom}
        styleUrl={args.styleUrl}
      />
    );
  },
};
