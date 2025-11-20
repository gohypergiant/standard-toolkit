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
import { useEffect } from 'react';
import { BaseMap } from '../deckgl/base-map';
import {
  type CoordinateFormatTypes,
  useCursorCoordinates,
} from './use-cursor-coordinates';
import type { Meta, StoryObj } from '@storybook/react-vite';

const BASIC_USAGE_MAP_ID = uuid();

const meta: Meta = {
  title: 'Cursor Coordinates',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Hook for displaying formatted cursor coordinates on a map. Supports multiple coordinate systems and automatically tracks cursor position.',
      },
    },
  },
  argTypes: {
    format: {
      description: 'Coordinate format system to display',
      options: ['dd', 'ddm', 'dms', 'mgrs', 'utm'],
      control: {
        type: 'select',
        labels: {
          dd: 'Decimal Degrees',
          ddm: 'Degrees Decimal Minutes',
          dms: 'Degrees Minutes Seconds',
          mgrs: 'MGRS (Military Grid)',
          utm: 'UTM (Universal Transverse Mercator)',
        },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

type Props = {
  format: CoordinateFormatTypes;
};

const CursorCoordinateDisplay = (props: Props) => {
  const { formattedCoord, setFormat } =
    useCursorCoordinates(BASIC_USAGE_MAP_ID);
  useEffect(() => {
    setFormat(props.format);
  }, [props.format, setFormat]);

  return (
    <ActionBar className='absolute right-l bottom-xxl'>
      {formattedCoord}
    </ActionBar>
  );
};

export const Default: Story = {
  args: { format: 'ddm' },
  parameters: {
    docs: {
      description: {
        story:
          'Basic cursor coordinate display showing the current format. Hover over the map to see coordinates update in real-time.',
      },
    },
  },
  render: (args: Partial<Props>) => (
    <>
      <BaseMap className='h-dvh w-dvw' id={BASIC_USAGE_MAP_ID} />
      <CursorCoordinateDisplay {...(args as Props)} />
    </>
  ),
};
