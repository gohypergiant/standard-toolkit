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

//import { useEmit, useOn } from '@accelint/bus/react';
import { uuid } from '@accelint/core';
import { Button } from '@accelint/design-toolkit';
import { BaseMap } from '../deckgl/base-map';
import { useMapCursor } from './use-map-cursor';
import type { Meta, StoryObj } from '@storybook/react';

//import { useCallback } from 'react';

const EXAMPLE_MAP_CURSORS = ['auto', 'pointer', 'crosshair', 'grab', 'zoom-in'];

const meta: Meta = {
  title: 'Map Custom Cursor',
  parameters: {
    layout: 'fullscreen',
  },
};

// Stable ids for each story
const BASIC_USAGE_MAP_ID = uuid();

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic usage example showing how to consume and change cursor icon for layers.
 * This demonstrates the core API: wrapping with MapModeProvider and using the useMapCursor hook.
 */
export const BasicUsage: Story = {
  render: () => {
    let mapCursor = 'auto';

    // const cursorCallback = useCallback((isDragging, isHovering) => {

    // });

    // A simple toolbar that changes cursor
    function CursorToolbar() {
      const { cursor, addCursor } = useMapCursor(BASIC_USAGE_MAP_ID);
      mapCursor = cursor;
      return (
        <div className='absolute top-l left-l flex w-[256px] flex-col gap-xl rounded-lg bg-surface-default p-l shadow-elevation-overlay'>
          <p className='font-bold text-header-l'>Map Modes</p>
          <div className='flex flex-col gap-s'>
            {EXAMPLE_MAP_CURSORS.map((cursorName) => (
              <Button
                key={cursorName}
                variant={cursor === cursorName ? 'filled' : 'outline'}
                color={cursor === cursorName ? 'accent' : 'mono-muted'}
                onPress={() => addCursor(cursorName, 'toolbar')}
                className='w-full'
              >
                {cursorName}
              </Button>
            ))}
          </div>
          <div className='flex items-center gap-s'>
            <p className='text-body-m'>Current cursor:</p>
            <code className='text-body-m'>{cursor}</code>
          </div>
        </div>
      );
    }

    return (
      <div className='relative h-dvh w-dvw'>
        <BaseMap
          className='absolute inset-0'
          id={BASIC_USAGE_MAP_ID}
          getCursor={() => mapCursor}
        />
        <CursorToolbar />
      </div>
    );
  },
};
