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
import { ActionBar } from '@accelint/design-toolkit';
import { useEffect } from 'react';
import { BaseMap } from '../deckgl/base-map';
import { useCursorCoordinates } from './use-cursor-coordinates';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CoordinateFormatTypes } from './types';

const MAP_ID = uuid();

const meta: Meta = {
  title: 'Cursor Coordinates',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Hook for displaying formatted cursor coordinates on a map. Supports multiple coordinate systems, custom formatters, and raw coordinate access.',
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
  const { formattedCoord, setFormat, rawCoord, currentFormat } =
    useCursorCoordinates(MAP_ID);

  useEffect(() => {
    setFormat(props.format);
  }, [props.format, setFormat]);

  return (
    <>
      {/* Main formatted coordinate display */}
      <ActionBar className='absolute right-l bottom-xxl'>
        <span className='text-body-m'>{formattedCoord}</span>
      </ActionBar>

      {/* Hook output panel */}
      <div className='absolute top-l left-l z-10 flex w-[320px] flex-col gap-l rounded-lg bg-surface-default p-l shadow-elevation-overlay'>
        <p className='font-bold text-header-l'>useCursorCoordinates Output</p>

        <div className='rounded-lg bg-info-muted p-s'>
          <p className='mb-xs text-body-xs'>formattedCoord</p>
          <code className='text-body-m'>{formattedCoord}</code>
        </div>

        <div className='rounded-lg bg-info-muted p-s'>
          <p className='mb-xs text-body-xs'>currentFormat</p>
          <code className='text-body-m'>{currentFormat}</code>
        </div>

        <div className='rounded-lg bg-info-muted p-s'>
          <p className='mb-xs text-body-xs'>rawCoord</p>
          {rawCoord ? (
            <div className='flex flex-col gap-xs'>
              <code className='text-body-m'>
                longitude: {rawCoord.longitude}
              </code>
              <code className='text-body-m'>latitude: {rawCoord.latitude}</code>
            </div>
          ) : (
            <code className='text-body-m text-content-disabled'>null</code>
          )}
        </div>
      </div>
    </>
  );
};

export const Default: Story = {
  args: { format: 'ddm' },
  parameters: {
    docs: {
      description: {
        story:
          'Hover over the map to see cursor coordinates. Use the format control to switch between coordinate systems. The panel shows all values returned by the useCursorCoordinates hook.',
      },
    },
  },
  render: (args: Partial<Props>) => (
    <>
      <BaseMap className='h-dvh w-dvw' id={MAP_ID} />
      <CursorCoordinateDisplay {...(args as Props)} />
    </>
  ),
};
