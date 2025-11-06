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
      const { cursor, requestCursorChange } = useMapCursor(BASIC_USAGE_MAP_ID);
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
                onPress={() => requestCursorChange(cursorName, 'toolbar')}
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
