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

import '@/deckgl/symbol-layer/fiber';
import { useEmit, useOn } from '@accelint/bus/react';
import { uuid } from '@accelint/core';
import {
  Button,
  Divider,
  NoticeEventTypes,
  NoticeList,
  type NoticeQueueEvent,
} from '@accelint/design-toolkit';
import { useCallback, useRef, useState } from 'react';
import { BaseMap } from '../deckgl/base-map';
import { MapModeEvents } from '../map-mode/events';
import { useMapMode } from '../map-mode/use-map-mode';
import { MapCursorEvents } from './events';
import { useMapCursor, useMapCursorEffect } from './use-map-cursor';
import type { UniqueId } from '@accelint/core';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type {
  ModeChangeAuthorizationEvent,
  ModeChangeDecisionEvent,
  ModeChangedEvent,
} from '../map-mode/types';
import type {
  CSSCursorType,
  CursorChangedEvent,
  CursorRejectedEvent,
} from './types';

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
const INTEGRATION_MAP_ID = uuid();

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
 * Story component extracted to a named function to ensure proper React hook lifecycle.
 *
 * When hooks like `useOn` or `useEmit` are called directly inside a Storybook
 * `render: () => { ... }` function, Storybook's decorator system can cause the
 * render function to be invoked multiple times without proper cleanup, resulting
 * in duplicate event listeners on the singleton bus.
 *
 * By extracting to a named component and rendering via `render: () => <Component />`,
 * React manages the component lifecycle correctly and cleanup functions run as expected.
 */
function WithModeOwnerStory() {
  const emitNotice = useEmit<NoticeQueueEvent>(NoticeEventTypes.queue);

  // Listen for cursor rejection events
  useOn<CursorRejectedEvent>(MapCursorEvents.rejected, (event) => {
    if (event.payload.id === WITH_MODE_OWNER_MAP_ID) {
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
              <strong>Default Mode:</strong> Anyone can change the cursor (most
              recent request wins)
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
              onPress={() => {
                requestModeChange('default', ownerId.current);
                clearCursor(ownerId.current);
              }}
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
              onPress={() => requestCursorChange('crosshair', ownerId.current)}
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
}

/**
 * Demonstrates cursor priority with map mode ownership.
 * Mode owners have priority for cursor changes.
 */
export const WithModeOwner: Story = {
  render: () => <WithModeOwnerStory />,
};

/**
 * Advanced integration demonstrating cursor management with map mode authorization.
 * Shows how cursor priority respects mode ownership and handles all authorization scenarios
 * including auto-accept when returning to default mode.
 *
 * Key scenarios demonstrated:
 * - Shapes feature requires authorization to exit (drawing/editing modes)
 * - MeasuringTool auto-accepts exit to unowned modes
 * - Cursor automatically syncs with mode ownership
 * - Pending mode requests trigger after approval
 * - Returning to default mode auto-accepts first pending request
 */
export const IntegrationWithModeAuth: Story = {
  render: () => {
    function IntegrationDemo() {
      const { mode, requestModeChange } = useMapMode(INTEGRATION_MAP_ID);
      const { cursor, requestCursorChange } = useMapCursor(INTEGRATION_MAP_ID);
      const [modeOwners, setModeOwners] = useState<Map<string, string>>(
        new Map(),
      );
      const [pendingAuths, setPendingAuths] = useState<
        Array<{
          authId: string;
          desiredMode: string;
          requestingOwner: string;
          id: UniqueId;
        }>
      >([]);
      const [eventLog, setEventLog] = useState<string[]>([]);

      const pendingRequests = useRef<
        Map<
          string,
          {
            requesterId: string;
            desiredMode: string;
          }
        >
      >(new Map());
      const logContainerRef = useRef<HTMLDivElement>(null);

      const emitDecision = useEmit<ModeChangeDecisionEvent>(
        MapModeEvents.changeDecision,
      );
      const emitNotice = useEmit<NoticeQueueEvent>(NoticeEventTypes.queue);

      const addLog = (message: string) => {
        setEventLog((prev) => [
          ...prev,
          `${new Date().toLocaleTimeString()}: ${message}`,
        ]);
        setTimeout(() => {
          if (logContainerRef.current) {
            logContainerRef.current.scrollTop =
              logContainerRef.current.scrollHeight;
          }
        }, 0);
      };

      const showNotice = (message: string) => {
        emitNotice({
          message,
          color: 'serious',
        });
      };

      // Listen for mode changes
      useOn<ModeChangedEvent>(MapModeEvents.changed, (event) => {
        if (!('payload' in event) || event.payload.id !== INTEGRATION_MAP_ID) {
          return;
        }

        addLog(
          `Mode: "${event.payload.previousMode}" → "${event.payload.currentMode}"`,
        );

        const requestData = pendingRequests.current.get(
          event.payload.currentMode,
        );
        const requestingOwner = requestData?.requesterId;

        if (requestingOwner && event.payload.currentMode !== 'default') {
          setModeOwners((prev) => {
            const newMap = new Map(prev);
            if (!newMap.has(event.payload.currentMode)) {
              newMap.set(event.payload.currentMode, requestingOwner);
              addLog(
                `"${event.payload.currentMode}" owned by ${requestingOwner}`,
              );
            }
            return newMap;
          });
          pendingRequests.current.delete(event.payload.currentMode);
        }
      });

      // Listen for cursor changes
      useOn<CursorChangedEvent>(MapCursorEvents.changed, (event) => {
        if (event.payload.id !== INTEGRATION_MAP_ID) {
          return;
        }
        addLog(
          `Cursor: "${event.payload.previousCursor}" → "${event.payload.currentCursor}" (by ${event.payload.owner})`,
        );
      });

      // Listen for cursor rejections
      useOn<CursorRejectedEvent>(MapCursorEvents.rejected, (event) => {
        if (event.payload.id !== INTEGRATION_MAP_ID) {
          return;
        }
        addLog(
          `Cursor REJECTED: ${event.payload.rejectedOwner} cannot set "${event.payload.rejectedCursor}"`,
        );
        showNotice(`Cursor change rejected: ${event.payload.reason}`);
      });

      // Helper: Auto-accept authorization for MeasuringTool
      const handleMeasuringToolAuth = useCallback(
        (authId: string, id: UniqueId, currentModeOwner: string) => {
          addLog('MeasuringTool auto-accepting');
          emitDecision({
            authId,
            approved: true,
            owner: currentModeOwner,
            id,
          });
        },
        [emitDecision, addLog],
      );

      // Helper: Show authorization dialog for Shapes feature
      const handleShapesAuth = useCallback(
        (
          authId: string,
          desiredMode: string,
          requestingOwner: string,
          id: UniqueId,
        ) => {
          const existingIndex = pendingAuths.findIndex(
            (auth) => auth.requestingOwner === requestingOwner,
          );

          if (existingIndex !== -1) {
            addLog(`Replacing pending request from ${requestingOwner}`);
            setPendingAuths((prev) => {
              const updated = [...prev];
              updated[existingIndex] = {
                authId,
                desiredMode,
                requestingOwner,
                id,
              };
              return updated;
            });
          } else {
            setPendingAuths((prev) => [
              ...prev,
              {
                authId,
                desiredMode,
                requestingOwner,
                id,
              },
            ]);
          }
        },
        [pendingAuths, addLog],
      );

      // Listen for authorization requests
      useOn<ModeChangeAuthorizationEvent>(
        MapModeEvents.changeAuthorization,
        (event) => {
          if (
            !('payload' in event) ||
            event.payload.id !== INTEGRATION_MAP_ID
          ) {
            return;
          }

          const requestData = pendingRequests.current.get(
            event.payload.desiredMode,
          );
          if (!requestData) {
            return;
          }

          const requestingOwner = requestData.requesterId;
          const currentModeOwner = modeOwners.get(event.payload.currentMode);

          addLog(
            `Authorization: ${requestingOwner} wants "${event.payload.desiredMode}"`,
          );

          // Auto-accept for MeasuringTool
          if (currentModeOwner === 'MeasuringTool') {
            handleMeasuringToolAuth(
              event.payload.authId,
              event.payload.id,
              currentModeOwner,
            );
            return;
          }

          // Show dialog for Shapes feature
          if (currentModeOwner === 'Shapes') {
            handleShapesAuth(
              event.payload.authId,
              event.payload.desiredMode,
              requestingOwner,
              event.payload.id,
            );
          }
        },
      );

      // Listen for authorization decisions
      useOn<ModeChangeDecisionEvent>(MapModeEvents.changeDecision, (event) => {
        if (!('payload' in event) || event.payload.id !== INTEGRATION_MAP_ID) {
          return;
        }

        const status = event.payload.approved ? 'APPROVED' : 'REJECTED';
        addLog(
          `Decision: ${status}${event.payload.reason ? ` - ${event.payload.reason}` : ''}`,
        );

        setPendingAuths((prev) =>
          prev.filter((a) => a.authId !== event.payload.authId),
        );
      });

      const handleModeRequest = (modeName: string, owner: string) => {
        pendingRequests.current.set(modeName, {
          requesterId: owner,
          desiredMode: modeName,
        });
        requestModeChange(modeName, owner);
      };

      const handleCursorRequest = (
        cursorType: CSSCursorType,
        owner: string,
      ) => {
        requestCursorChange(cursorType, owner);
      };

      const handleDefaultModeRequest = (owner: string) => {
        handleModeRequest('default', owner);
        // Explicitly clear cursor when returning to default mode
        requestCursorChange('default', owner);
      };

      const handleApprove = (authId: string) => {
        const auth = pendingAuths.find((a) => a.authId === authId);
        if (auth) {
          const currentModeOwner = modeOwners.get(mode);
          if (currentModeOwner) {
            emitDecision({
              authId,
              approved: true,
              owner: currentModeOwner,
              id: auth.id,
            });
          }
        }
      };

      const handleReject = (authId: string) => {
        const auth = pendingAuths.find((a) => a.authId === authId);
        if (auth) {
          const currentModeOwner = modeOwners.get(mode);
          if (currentModeOwner) {
            emitDecision({
              authId,
              approved: false,
              owner: currentModeOwner,
              reason: `${currentModeOwner} rejected the request`,
              id: auth.id,
            });
          }
        }
      };

      return (
        <>
          <div className='absolute top-l left-l flex max-h-[calc(100vh-2rem)] w-[380px] flex-col gap-l rounded-lg bg-surface-default p-l shadow-elevation-overlay'>
            <p className='font-bold text-header-l'>Cursor + Mode Integration</p>

            <div>
              <p className='mb-s font-bold text-body-m'>Current State</p>
              <div className='space-y-xs rounded-lg bg-info-muted p-s'>
                <div className='flex items-center justify-between'>
                  <span className='text-body-s'>Mode:</span>
                  <code className='text-body-m'>{mode}</code>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-body-s'>Cursor:</span>
                  <code className='text-body-m'>{cursor}</code>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-body-s'>Owner:</span>
                  <strong className='text-body-s'>
                    {modeOwners.get(mode) || 'None'}
                  </strong>
                </div>
              </div>
            </div>

            <div className='mb-m'>
              <p className='mb-s font-bold text-body-m'>Shapes Feature</p>
              <p className='mb-m text-body-xs text-content-secondary'>
                Requires auth to exit. Cursors: crosshair (drawing), move
                (editing)
              </p>
              <div className='flex flex-wrap gap-s'>
                <Button
                  size='small'
                  variant='filled'
                  color='accent'
                  onPress={() => handleDefaultModeRequest('Shapes')}
                >
                  default
                </Button>
                <Button
                  size='small'
                  variant='filled'
                  color='accent'
                  onPress={() => {
                    handleModeRequest('drawing', 'Shapes');
                    handleCursorRequest('crosshair', 'Shapes');
                  }}
                >
                  drawing
                </Button>
                <Button
                  size='small'
                  variant='filled'
                  color='accent'
                  onPress={() => {
                    handleModeRequest('editing', 'Shapes');
                    handleCursorRequest('move', 'Shapes');
                  }}
                >
                  editing
                </Button>
              </div>
            </div>

            <div className='mb-m'>
              <p className='mb-s font-bold text-body-m'>Measuring Tool</p>
              <p className='mb-m text-body-xs text-content-secondary'>
                Auto-accepts exit. Cursor: ew-resize (measuring)
              </p>
              <div className='flex flex-wrap gap-s'>
                <Button
                  size='small'
                  variant='filled'
                  color='serious'
                  onPress={() => handleDefaultModeRequest('MeasuringTool')}
                >
                  default
                </Button>
                <Button
                  size='small'
                  variant='filled'
                  color='serious'
                  onPress={() => {
                    handleModeRequest('measuring', 'MeasuringTool');
                    handleCursorRequest('ew-resize', 'MeasuringTool');
                  }}
                >
                  measuring
                </Button>
              </div>
            </div>

            <div className='mb-m'>
              <p className='mb-s font-bold text-body-m'>
                Non-Owner (Cursor Only)
              </p>
              <p className='mb-m text-body-xs text-content-secondary'>
                Can only set cursor in default mode
              </p>
              <div className='flex flex-wrap gap-s'>
                <Button
                  size='small'
                  variant='outline'
                  color='mono-muted'
                  onPress={() => handleDefaultModeRequest('NonOwner')}
                >
                  default
                </Button>
                <Button
                  size='small'
                  variant='outline'
                  color='mono-muted'
                  onPress={() => handleCursorRequest('pointer', 'NonOwner')}
                >
                  pointer
                </Button>
                <Button
                  size='small'
                  variant='outline'
                  color='mono-muted'
                  onPress={() => handleCursorRequest('help', 'NonOwner')}
                >
                  help
                </Button>
              </div>
            </div>

            <Divider />

            <div className='flex min-h-0 flex-1 flex-col'>
              <p className='mb-s font-semibold text-body-m'>Event Log</p>
              <div
                ref={logContainerRef}
                className='min-h-0 flex-1 overflow-y-auto rounded-lg border border-border-default bg-surface-subtle p-s'
              >
                {eventLog.length === 0 ? (
                  <p className='text-body-xs text-content-disabled'>
                    No events yet
                  </p>
                ) : (
                  eventLog.map((entry, index) => (
                    <p
                      key={`${index.toString()}-${entry}`}
                      className='mb-xs text-body-xs'
                    >
                      {entry}
                    </p>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Notice list */}
          <NoticeList
            placement='bottom'
            defaultColor='serious'
            defaultTimeout={5000}
            hideClearAll
          />

          {/* Authorization dialogs */}
          <div className='absolute top-l right-l flex w-[384px] flex-col gap-m'>
            {pendingAuths.map((auth, index) => (
              <div
                key={auth.authId}
                className='flex flex-col gap-m rounded-lg bg-surface-default p-l shadow-elevation-overlay'
              >
                <p className='font-bold text-header-m'>
                  Authorization Request{' '}
                  {pendingAuths.length > 1
                    ? `${index + 1}/${pendingAuths.length}`
                    : ''}
                </p>
                <div className='space-y-m'>
                  <div className='rounded-lg bg-surface-muted p-s'>
                    <p className='mb-xs text-body-xs'>Request From</p>
                    <code className='text-body-m'>{auth.requestingOwner}</code>
                  </div>
                  <div className='text-body-m'>
                    <span>Wants to change to: </span>
                    <code className='rounded bg-surface-muted px-s py-xs text-body-m'>
                      {auth.desiredMode}
                    </code>
                  </div>
                  <Divider />
                  <div className='rounded-lg bg-surface-muted p-s'>
                    <p className='mb-xs text-body-xs'>Current Mode</p>
                    <code className='text-body-m'>{mode}</code>
                  </div>
                </div>
                <div className='flex justify-end gap-s'>
                  <Button
                    variant='flat'
                    color='critical'
                    onPress={() => handleReject(auth.authId)}
                  >
                    Reject
                  </Button>
                  <Button
                    variant='filled'
                    color='accent'
                    onPress={() => handleApprove(auth.authId)}
                  >
                    Approve
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      );
    }

    return (
      <div className='relative h-dvh w-dvw'>
        <BaseMap className='absolute inset-0' id={INTEGRATION_MAP_ID} />
        <IntegrationDemo />
      </div>
    );
  },
};

const MOCK_DATA = [
  {
    sidc: '130340000015011300000000000000',
    position: [-117.957499, 34.236734],
  },
  {
    sidc: '130540000014080000000000000000',
    position: [-117.032638, 32.902588],
  },
  {
    sidc: '130140000011011000000000000000',
    position: [-122.32659, 44.91817],
  },
  {
    sidc: 'SNGPEWAM--*****',
    position: [-122.636867, 47.622294],
  },
  {
    sidc: 'SHGPEWMAT-*****',
    position: [-120.003256, 48.700736],
  },
  {
    sidc: '130610000016480000000000000000',
    position: [-114.569926, 38.717394],
  },
  {
    sidc: '13040000011010500000000000000',
    position: [-104.510301, 31.851944],
  },
  {
    sidc: '130601000011010300000000000000',
    position: [-104.939931, 45.761557],
  },
  {
    sidc: '130405000011160000000000000000',
    position: [-109.321169, 46.589224],
  },
  {
    sidc: '130120000012131200000000000000',
    position: [-95.73333, 30.996191],
  },
  {
    sidc: 'SNGPIMFA--H****',
    position: [-87.305973, 31.6678],
  },
  {
    sidc: '130301000011012900000000000000',
    position: [-82.466525, 31.864581],
  },
  {
    sidc: '130630000012000000000000000000',
    position: [-118.504157, 33.941637],
  },
  {
    sidc: 'SUGPIMF---H****',
    position: [-84.321958, 38.487365],
  },
  {
    sidc: '130301000011010100000000000000',
    position: [-77.504648, 41.59541],
  },
  {
    sidc: '130320000011211200000000000000',
    position: [-77.715059, 35.838516],
  },
  {
    sidc: 'SUAPWMAA--*****',
    position: [-74.790348, 40.46853],
  },
  {
    sidc: '130420000011170000000000000000',
    position: [-82.218397, 32.787792],
  },
  {
    sidc: '130420000012020000000000000000',
    position: [-74.370726, 43.387782],
  },
  {
    sidc: 'SHAPMF----*****',
    position: [-88.308809, 41.661155],
  },
];

/**
 * Example showing cursor changes on hover of a layer.
 */
export const WithHover: Story = {
  render: () => {
    function SymbolHoverLayer() {
      const { cursor, requestCursorChange, clearCursor } =
        useMapCursor(BASIC_USAGE_MAP_ID);

      // Guard to avoid unnecessary bus events on repeated hover callbacks
      // note: the store dedupes repeated requests from the same owner for the same cursor
      // but best practice is to not send unnecessary bus events in the first place
      const hoverCallback = useCallback(
        (info: { picked: boolean }) => {
          if (!info.picked) {
            clearCursor('symbol-layer');
          } else if (cursor !== 'pointer') {
            requestCursorChange('pointer', 'symbol-layer');
          }
        },
        [cursor, requestCursorChange, clearCursor],
      );

      return (
        <symbolLayer
          id={BASIC_USAGE_MAP_ID}
          data={MOCK_DATA}
          defaultSymbolOptions={{
            colorMode: 'Dark',
            square: true,
          }}
          pickable={true}
          onHover={hoverCallback}
        />
      );
    }

    return (
      <div className='relative h-dvh w-dvw'>
        <BaseMap className='absolute inset-0' id={BASIC_USAGE_MAP_ID}>
          <SymbolHoverLayer />
        </BaseMap>
      </div>
    );
  },
};

const WITH_DRAG_MAP_ID = uuid();

/**
 * Example showing cursor changes during drag operations.
 * Demonstrates using onDragStart/onDragEnd with the cursor API.
 */
export const WithDrag: Story = {
  render: () => {
    function DragCursorDemo() {
      const { cursor, requestCursorChange } = useMapCursor(WITH_DRAG_MAP_ID);

      // Set default cursor to 'grab'
      useMapCursorEffect('grab', 'drag-handler', WITH_DRAG_MAP_ID);

      const handleDragStart = useCallback(() => {
        requestCursorChange('grabbing', 'drag-handler');
      }, [requestCursorChange]);

      const handleDragEnd = useCallback(() => {
        requestCursorChange('grab', 'drag-handler');
      }, [requestCursorChange]);

      return (
        <>
          <BaseMap
            className='absolute inset-0'
            id={WITH_DRAG_MAP_ID}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          />
          <div className='absolute top-l left-l flex w-[300px] flex-col gap-l rounded-lg bg-surface-default p-l shadow-elevation-overlay'>
            <p className='font-bold text-header-l'>Drag Cursor Demo</p>
            <p className='text-body-s text-content-secondary'>
              Click and drag the map to see the cursor change to 'grabbing'.
              Release to revert.
            </p>
            <Divider />
            <div className='flex items-center gap-s'>
              <p className='text-body-m'>Current cursor:</p>
              <code className='text-body-m'>{cursor}</code>
            </div>
          </div>
        </>
      );
    }

    return (
      <div className='relative h-dvh w-dvw'>
        <DragCursorDemo />
      </div>
    );
  },
};
