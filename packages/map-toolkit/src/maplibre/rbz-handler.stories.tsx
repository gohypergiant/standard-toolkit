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
import { BaseMap as BaseMapComponent } from '../deckgl/base-map';
import {
  DARK_BASE_MAP_STYLE,
  LIGHT_BASE_MAP_STYLE,
} from '../deckgl/base-map/constants';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { RbzOrigin } from './rbz-handler';

type StoryArgs = {
  enableRbz: boolean;
  boxZoom: boolean;
  styleUrl: string;
  origin: RbzOrigin;
  constrainAspectRatio: boolean;
  borderColor: string;
  borderWidth: number;
  fillColor: string;
};

const meta: Meta<StoryArgs> = {
  title: 'DeckGL/Rubber Band Zoom',
};

export default meta;
type Story = StoryObj<StoryArgs>;

// Stable id for Storybook story
const RBZ_HANDLER_STORY_ID = uuid();

export const BasicUsage: Story = {
  args: {
    enableRbz: true,
    boxZoom: false,
    styleUrl: DARK_BASE_MAP_STYLE,
    origin: 'topLeft',
    constrainAspectRatio: false,
    borderColor: '#39b7fa',
    borderWidth: 2,
    fillColor: 'rgba(57, 183, 250, 0.1)',
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
    origin: {
      control: { type: 'radio' },
      options: ['topLeft', 'center'],
      description:
        'Where the rectangle grows from during drag. topLeft anchors at corner, center expands symmetrically.',
      table: {
        category: 'RBZ Options',
      },
    },
    constrainAspectRatio: {
      control: { type: 'boolean' },
      description:
        'Lock rectangle to viewport aspect ratio. Prevents letterboxing after fitBounds.',
      table: {
        category: 'RBZ Options',
      },
    },
    borderColor: {
      control: { type: 'color' },
      description: 'Rectangle border color',
      table: {
        category: 'RBZ Style',
      },
    },
    borderWidth: {
      control: { type: 'range', min: 1, max: 10, step: 1 },
      description: 'Border width in pixels',
      table: {
        category: 'RBZ Style',
      },
    },
    fillColor: {
      control: { type: 'color' },
      description: 'Rectangle fill color (include alpha for transparency)',
      table: {
        category: 'RBZ Style',
      },
    },
  },
  render: (args) => {
    const rbzOptions = {
      origin: args.origin,
      constrainAspectRatio: args.constrainAspectRatio,
      style: {
        borderColor: args.borderColor,
        borderWidth: args.borderWidth,
        fillColor: args.fillColor,
      },
    };

    // Force remount when RBZ options change so the handler is recreated
    // Note: this is only needed to in this story to show different options dynamically
    // You should not force a remount in an app / rbzOptions are static config options
    const key = JSON.stringify(rbzOptions);

    return (
      <BaseMapComponent
        key={key}
        className='h-dvh w-dvw'
        id={RBZ_HANDLER_STORY_ID}
        enableRbz={args.enableRbz}
        boxZoom={args.boxZoom}
        styleUrl={args.styleUrl}
        rbzOptions={rbzOptions}
      />
    );
  },
};
