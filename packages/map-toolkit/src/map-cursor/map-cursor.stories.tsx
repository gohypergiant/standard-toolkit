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

import { useEmit, useOn } from '@accelint/bus/react';
import { uuid } from '@accelint/core';
import {
  Button,
  Divider,
  NoticeEventTypes,
  NoticeList,
  type NoticeQueueEvent,
} from '@accelint/design-toolkit';
import { useRef, useState } from 'react';
import { BaseMap } from '../deckgl/base-map';
import { useMapMode } from '../map-mode/use-map-mode';
import { MapCursorEvents } from './events';
import { useMapCursor, useMapCursorEffect } from './use-map-cursor';
import type { Meta, StoryObj } from '@storybook/react';
import type { CSSCursorType } from './types';

// Common cursor types to demonstrate
const EXAMPLE_CURSORS: CSSCursorType[] = [
  'default',
  'pointer',
  'crosshair',
  'grab',
  'grabbing',
  'move',
  'help',
];

// Stable IDs for each story
const BASIC_USAGE_MAP_ID = uuid();
const WITH_MODE_OWNER_MAP_ID = uuid();
const MULTIPLE_OWNERS_MAP_ID = uuid();

const meta = {
  title: 'Map Cursor',
} satisfies Meta;

export default meta;
type Story = StoryObj;

/**
 * Basic usage example showing how to control map cursor.
 * This demonstrates requesting cursor changes from a toolbar component.
 */
export const BasicUsage: Story = {
  render: () => {
    function CursorToolbar() {
      const { cursor, requestCursorChange, clearCursor } =
        useMapCursor(BASIC_USAGE_MAP_ID);
      const ownerId = useRef('cursor-toolbar');

      return (
        <div className='absolute top-l left-l flex w-[256px] flex-col gap-xl rounded-lg bg-surface-default p-l shadow-elevation-overlay'>
          <p className='font-bold text-header-l'>Map Cursor</p>
          <div className='grid grid-cols-2 gap-s'>
            {EXAMPLE_CURSORS.map((cursorType) => (
              <Button
                key={cursorType}
                variant={cursor === cursorType ? 'filled' : 'outline'}
                color={cursor === cursorType ? 'accent' : 'mono-muted'}
                onPress={() => requestCursorChange(cursorType, ownerId.current)}
                className='w-full'
              >
                {cursorType}
              </Button>
            ))}
          </div>
          <Button
            variant='outline'
            color='mono-muted'
            onPress={() => clearCursor(ownerId.current)}
          >
            Clear My Cursor
          </Button>
          <Divider />
          <div className='flex items-center gap-s'>
            <p className='text-body-m'>Current cursor:</p>
            <code className='text-body-m'>{cursor}</code>
          </div>
        </div>
      );
    }

    return (
      <div className='relative h-dvh w-dvw'>
        <BaseMap className='absolute inset-0' id={BASIC_USAGE_MAP_ID} />
        <CursorToolbar />
      </div>
    );
  },
};

/**
 * Demonstrates using useMapCursorEffect for automatic cursor management.
 * The cursor is automatically set when the component mounts and cleared when it unmounts.
 */
export const AutomaticCursorEffect: Story = {
  render: () => {
    const [showDrawingMode, setShowDrawingMode] = useState(false);

    function DrawingModeIndicator() {
      // Automatically set crosshair cursor when this component is mounted
      useMapCursorEffect('crosshair', 'drawing-mode', MULTIPLE_OWNERS_MAP_ID);

      return (
        <div className='absolute top-l left-l flex w-[300px] flex-col gap-l rounded-lg bg-surface-default p-l shadow-elevation-overlay'>
          <div className='flex items-center justify-between'>
            <p className='font-bold text-header-m'>Drawing Mode Active</p>
            <div className='h-m w-m animate-pulse rounded-full bg-status-success-default' />
          </div>
          <p className='text-body-s text-content-secondary'>
            Crosshair cursor is automatically applied while this component is
            mounted.
          </p>
        </div>
      );
    }

    function ControlPanel() {
      const { cursor } = useMapCursor(MULTIPLE_OWNERS_MAP_ID);

      return (
        <div className='absolute bottom-l left-l flex w-[300px] flex-col gap-l rounded-lg bg-surface-default p-l shadow-elevation-overlay'>
          <p className='font-bold text-header-l'>useMapCursorEffect Demo</p>

          <Button
            variant={showDrawingMode ? 'filled' : 'outline'}
            color={showDrawingMode ? 'accent' : 'mono-muted'}
            onPress={() => setShowDrawingMode(!showDrawingMode)}
          >
            {showDrawingMode ? 'Exit Drawing Mode' : 'Enter Drawing Mode'}
          </Button>

          <Divider />

          <div className='flex flex-col gap-s text-body-s'>
            <div className='flex items-center gap-s'>
              <span className='text-content-secondary'>Current cursor:</span>
              <code>{cursor}</code>
            </div>
            <p className='text-body-xs text-content-tertiary'>
              Toggle drawing mode to see the cursor automatically change
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className='relative h-dvh w-dvw'>
        <BaseMap className='absolute inset-0' id={MULTIPLE_OWNERS_MAP_ID} />
        {showDrawingMode && <DrawingModeIndicator />}
        <ControlPanel />
      </div>
    );
  },
};

/**
 * Demonstrates cursor priority with map mode ownership.
 * Mode owners have priority for cursor changes.
 */
export const WithModeOwner: Story = {
  render: () => {
    const emitNotice = useEmit<NoticeQueueEvent>(NoticeEventTypes.queue);

    // Listen for cursor rejection events
    useOn(MapCursorEvents.rejected, (event) => {
      if ('payload' in event && event.payload.id === WITH_MODE_OWNER_MAP_ID) {
        emitNotice({
          message: event.payload.reason,
          color: 'critical',
        });
      }
    });

    function InstructionPanel() {
      const { mode } = useMapMode(WITH_MODE_OWNER_MAP_ID);

      return (
        <div className='-translate-x-1/2 absolute top-l left-1/2 w-[400px] rounded-lg bg-surface-accent-subtle p-l shadow-elevation-overlay'>
          <p className='mb-s font-bold text-content-accent text-header-m'>
            Cursor Priority Rules
          </p>
          <ul className='space-y-xs text-body-s text-content-secondary'>
            <li className='flex items-start gap-xs'>
              <span className='text-content-accent'>•</span>
              <span>
                <strong>Default Mode:</strong> Anyone can change the cursor
                (most recent request wins)
              </span>
            </li>
            <li className='flex items-start gap-xs'>
              <span className='text-content-accent'>•</span>
              <span>
                <strong>Owned Mode:</strong> Only the mode owner can change the
                cursor
              </span>
            </li>
            <li className='flex items-start gap-xs'>
              <span className='text-content-accent'>•</span>
              <span>
                Non-owners' requests are rejected and shown as error notices
              </span>
            </li>
          </ul>
          <div className='mt-m border-border-subtle border-t pt-m'>
            <div className='flex items-center gap-s text-body-s'>
              <span className='text-content-secondary'>Current mode:</span>
              <code
                className={
                  mode === 'default'
                    ? 'text-content-success'
                    : 'text-content-warning'
                }
              >
                {mode}
              </code>
              <span className='text-content-tertiary'>
                {mode === 'default'
                  ? '(anyone can change cursor)'
                  : '(owner only)'}
              </span>
            </div>
          </div>
        </div>
      );
    }

    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Storybook UI example with multiple conditional renders
    function ModeOwnerToolbar() {
      const { mode, requestModeChange } = useMapMode(WITH_MODE_OWNER_MAP_ID);
      const { cursor, requestCursorChange, clearCursor } = useMapCursor(
        WITH_MODE_OWNER_MAP_ID,
      );
      const ownerId = useRef('mode-owner');

      const isDefaultMode = mode === 'default';
      const isDrawingMode = mode === 'drawing';
      const isDefaultCursor = cursor === 'default';
      const isCrosshairCursor = cursor === 'crosshair';

      return (
        <div className='absolute top-l left-l flex w-[300px] flex-col gap-xl rounded-lg bg-surface-default p-l shadow-elevation-overlay'>
          <p className='font-bold text-header-l'>Mode Owner Controls</p>

          <div className='flex flex-col gap-s'>
            <p className='text-body-s text-content-secondary'>Map Mode</p>
            <div className='grid grid-cols-2 gap-s'>
              <Button
                variant={isDefaultMode ? 'filled' : 'outline'}
                color={isDefaultMode ? 'accent' : 'mono-muted'}
                onPress={() => requestModeChange('default', ownerId.current)}
              >
                Default
              </Button>
              <Button
                variant={isDrawingMode ? 'filled' : 'outline'}
                color={isDrawingMode ? 'accent' : 'mono-muted'}
                onPress={() => requestModeChange('drawing', ownerId.current)}
              >
                Drawing
              </Button>
            </div>
          </div>

          <div className='flex flex-col gap-s'>
            <p className='text-body-s text-content-secondary'>
              Cursor (Owner Priority)
            </p>
            <div className='grid grid-cols-2 gap-s'>
              <Button
                variant={isDefaultCursor ? 'filled' : 'outline'}
                color={isDefaultCursor ? 'accent' : 'mono-muted'}
                onPress={() => requestCursorChange('default', ownerId.current)}
              >
                Default
              </Button>
              <Button
                variant={isCrosshairCursor ? 'filled' : 'outline'}
                color={isCrosshairCursor ? 'accent' : 'mono-muted'}
                onPress={() =>
                  requestCursorChange('crosshair', ownerId.current)
                }
              >
                Crosshair
              </Button>
            </div>
          </div>

          <Button
            variant='outline'
            color='mono-muted'
            onPress={() => clearCursor(ownerId.current)}
          >
            Clear My Cursor
          </Button>

          <Divider />
          <div className='flex flex-col gap-s text-body-s'>
            <div className='flex items-center gap-s'>
              <span className='text-content-secondary'>Mode:</span>
              <code>{mode}</code>
            </div>
            <div className='flex items-center gap-s'>
              <span className='text-content-secondary'>Cursor:</span>
              <code>{cursor}</code>
            </div>
          </div>
        </div>
      );
    }

    function NonOwnerToolbar() {
      const { cursor, requestCursorChange, clearCursor } = useMapCursor(
        WITH_MODE_OWNER_MAP_ID,
      );
      const ownerId = useRef('non-owner');

      return (
        <div className='absolute top-l right-l flex w-[300px] flex-col gap-xl rounded-lg bg-surface-default p-l shadow-elevation-overlay'>
          <p className='font-bold text-header-l'>Non-Owner Controls</p>

          <div className='flex flex-col gap-s'>
            <p className='text-body-s text-content-secondary'>
              Cursor (Will be rejected if mode is owned)
            </p>
            <div className='grid grid-cols-2 gap-s'>
              <Button
                variant={cursor === 'pointer' ? 'filled' : 'outline'}
                color={cursor === 'pointer' ? 'accent' : 'mono-muted'}
                onPress={() => requestCursorChange('pointer', ownerId.current)}
              >
                Pointer
              </Button>
              <Button
                variant={cursor === 'help' ? 'filled' : 'outline'}
                color={cursor === 'help' ? 'accent' : 'mono-muted'}
                onPress={() => requestCursorChange('help', ownerId.current)}
              >
                Help
              </Button>
            </div>
          </div>

          <Button
            variant='outline'
            color='mono-muted'
            onPress={() => clearCursor(ownerId.current)}
          >
            Clear My Cursor
          </Button>

          <div className='rounded-md bg-surface-contrast-subtle p-s text-body-s text-content-secondary'>
            <p className='mb-xs font-semibold'>Try this:</p>
            <ol className='list-inside list-decimal space-y-xs'>
              <li>Click Pointer or Help to set cursor</li>
              <li>Switch mode to "Drawing" on the left</li>
              <li>Try changing cursor here (will be rejected)</li>
              <li>Clear your cursor to allow mode owner control</li>
            </ol>
          </div>

          <Divider />
          <div className='flex items-center gap-s text-body-s'>
            <span className='text-content-secondary'>Current:</span>
            <code>{cursor}</code>
          </div>
        </div>
      );
    }

    return (
      <div className='relative h-dvh w-dvw'>
        <BaseMap className='absolute inset-0' id={WITH_MODE_OWNER_MAP_ID} />
        <InstructionPanel />
        <ModeOwnerToolbar />
        <NonOwnerToolbar />
        <NoticeList
          placement='bottom'
          defaultColor='critical'
          defaultTimeout={5000}
          hideClearAll
        />
      </div>
    );
  },
};
