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
import { type UniqueId, uuid } from '@accelint/core';
import {
  Button,
  Divider,
  NoticeEventTypes,
  NoticeList,
  type NoticeQueueEvent,
} from '@accelint/design-toolkit';
import { useRef, useState } from 'react';
import { BaseMap } from '../deckgl/base-map';
import { MapModeEvents } from './events';
import { useMapMode } from './use-map-mode';
import type { Meta, StoryObj } from '@storybook/react';
import type {
  ModeChangeAuthorizationEvent,
  ModeChangeDecisionEvent,
  ModeChangedEvent,
} from './types';

const EXAMPLE_MAP_MODES = [
  'default',
  'drawing',
  'measuring',
  'editing',
  'multi-select',
];

// Stable ids for each story
const BASIC_USAGE_MAP_ID = uuid();
const MULTIPLE_CONSUMERS_MAP_ID = uuid();
const AUTHORIZATION_FLOW_MAP_ID = uuid();

const meta = {
  title: 'Map Mode',
} satisfies Meta;

export default meta;
type Story = StoryObj;

/**
 * Basic usage example showing how to consume and change map modes.
 * This demonstrates the core API: wrapping with MapModeProvider and using the useMapMode hook.
 */
export const BasicUsage: Story = {
  render: () => {
    // A simple toolbar that changes modes
    function ModeToolbar() {
      const { mode, requestModeChange } = useMapMode(BASIC_USAGE_MAP_ID);

      return (
        <div className='absolute top-l left-l flex w-[256px] flex-col gap-xl rounded-lg bg-surface-default p-l shadow-elevation-overlay'>
          <p className='font-bold text-header-l'>Map Modes</p>
          <div className='flex flex-col gap-s'>
            {EXAMPLE_MAP_MODES.map((modeName) => (
              <Button
                key={modeName}
                variant={mode === modeName ? 'filled' : 'outline'}
                color={mode === modeName ? 'accent' : 'mono-muted'}
                onPress={() => requestModeChange(modeName, 'toolbar')}
                className='w-full'
              >
                {modeName}
              </Button>
            ))}
          </div>
          <div className='flex items-center gap-s'>
            <p className='text-body-m'>Current mode:</p>
            <code className='text-body-m'>{mode}</code>
          </div>
        </div>
      );
    }

    return (
      <div className='relative h-dvh w-dvw'>
        <BaseMap className='absolute inset-0' id={BASIC_USAGE_MAP_ID} />
        <ModeToolbar />
      </div>
    );
  },
};

/**
 * Multiple components consuming the same mode context.
 * Shows how different parts of your UI can react to the same mode changes.
 */
export const MultipleConsumers: Story = {
  render: () => {
    // Toolbar component that changes modes
    function ModeToolbar() {
      const { requestModeChange } = useMapMode(MULTIPLE_CONSUMERS_MAP_ID);

      return (
        <div className='absolute top-l left-l flex gap-s'>
          {EXAMPLE_MAP_MODES.map((modeName) => (
            <Button
              key={modeName}
              variant='filled'
              size='medium'
              color='mono-bold'
              onPress={() => requestModeChange(modeName, 'toolbar')}
            >
              {modeName}
            </Button>
          ))}
        </div>
      );
    }

    // Status indicator component
    function ModeIndicator() {
      const { mode } = useMapMode(MULTIPLE_CONSUMERS_MAP_ID);

      return (
        <div className='absolute top-l right-l flex flex-col items-center gap-xs rounded-lg bg-surface-default p-m shadow-elevation-raised'>
          <p className='text-body-s'>Current Mode</p>
          <code className='text-header-l'>{mode}</code>
        </div>
      );
    }

    // Instructions panel that changes based on mode
    function InstructionsPanel() {
      const { mode } = useMapMode(MULTIPLE_CONSUMERS_MAP_ID);

      const instructions: Record<string, string> = {
        default: 'Pan and zoom the map',
        drawing: 'Click to add points to draw on the map',
        measuring: 'Click to measure distances',
        editing: 'Select features to edit them',
        'multi-select': 'Draw a lasso to select multiple features',
      };

      return (
        <div className='absolute bottom-l left-l rounded-lg bg-surface-default p-m text-m shadow-elevation-raised'>
          {instructions[mode] || 'Unknown mode'}
        </div>
      );
    }

    return (
      <div className='relative h-dvh w-dvw'>
        <BaseMap className='absolute inset-0' id={MULTIPLE_CONSUMERS_MAP_ID} />
        <ModeToolbar />
        <ModeIndicator />
        <InstructionsPanel />
      </div>
    );
  },
};

/**
 * Advanced: Authorization flow with feature-specific modes.
 * Demonstrates realistic mode management between three features: Shapes (drawing/editing),
 * MeasuringTool (measuring), and MultiSelectLasso (multi-select). Shows automatic acceptance,
 * notices, authorization dialogs, and how multiple concurrent authorization requests are handled
 * (one per requester).
 *
 * Key behaviors demonstrated:
 * - Each requester can have one pending request at a time
 * - New requests from the same requester replace previous requests
 * - Pending requests persist when mode owner switches between their own modes
 * - Approving one request auto-rejects all other pending requests
 * - Returning to default mode with pending requests:
 *   - If first pending request is for default mode, all requests are rejected (already in that mode)
 *   - If first pending request is for a different mode, it's auto-approved and others are rejected
 */
export const AuthorizationFlow: Story = {
  render: () => {
    function AuthorizationDemo() {
      const { mode, requestModeChange } = useMapMode(AUTHORIZATION_FLOW_MAP_ID);
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
        // Scroll to bottom after adding log entry
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

      const handleAutoAccept = (
        authId: string,
        owner: string,
        id: UniqueId,
      ) => {
        addLog(`${owner} auto-accepting request`);

        emitDecision({
          authId,
          approved: true,
          owner,
          id,
        });
      };

      const handleAuthorizationDialog = (
        authId: string,
        desiredMode: string,
        requestingOwner: string,
        id: UniqueId,
      ) => {
        // Check if this requester already has a pending auth
        const existingIndex = pendingAuths.findIndex(
          (auth) => auth.requestingOwner === requestingOwner,
        );

        if (existingIndex !== -1) {
          // Replace the existing request from this requester
          addLog(
            `Previous request from ${requestingOwner} auto-rejected (replaced by new request)`,
          );
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
          // Add new request
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
      };

      // Listen for mode changes
      useOn<ModeChangedEvent>(MapModeEvents.changed, (event) => {
        addLog(
          `Mode changed: "${event.payload.previousMode}" → "${event.payload.currentMode}"`,
        );

        const requestData = pendingRequests.current.get(
          event.payload.currentMode,
        );
        const requestingOwner = requestData?.requesterId;

        // Show notice when leaving measuring or multi-select modes (only if someone else is requesting the change)
        const previousModeOwner = modeOwners.get(event.payload.previousMode);
        if (
          ((previousModeOwner === 'MeasuringTool' &&
            event.payload.previousMode === 'measuring') ||
            (previousModeOwner === 'MultiSelectLasso' &&
              event.payload.previousMode === 'multi-select')) &&
          requestingOwner !== previousModeOwner
        ) {
          showNotice(
            `${getModeName(event.payload.previousMode)} mode was canceled, mode changed to ${event.payload.currentMode}`,
          );
        }

        if (requestingOwner && event.payload.currentMode !== 'default') {
          // Update ownership map if this mode doesn't have an owner yet
          setModeOwners((prev) => {
            const newMap = new Map(prev);
            if (!newMap.has(event.payload.currentMode)) {
              newMap.set(event.payload.currentMode, requestingOwner);
              addLog(
                `"${event.payload.currentMode}" now owned by ${requestingOwner}`,
              );
            }
            return newMap;
          });
          pendingRequests.current.delete(event.payload.currentMode);
        }
      });

      const shouldAutoAccept = (owner: string, mode: string) => {
        return (
          (owner === 'MeasuringTool' && mode === 'measuring') ||
          (owner === 'MultiSelectLasso' && mode === 'multi-select')
        );
      };

      const shouldShowDialog = (
        requestingOwner: string,
        currentMode: string,
      ) => {
        return (
          (requestingOwner === 'MeasuringTool' ||
            requestingOwner === 'MultiSelectLasso') &&
          (currentMode === 'drawing' || currentMode === 'editing')
        );
      };

      const getModeName = (mode: string) => {
        if (mode === 'measuring') {
          return 'Measuring';
        }
        if (mode === 'multi-select') {
          return 'Multi-select';
        }
        return mode;
      };

      // Listen for authorization requests
      useOn<ModeChangeAuthorizationEvent>(
        MapModeEvents.changeAuthorization,
        (event) => {
          const requestData = pendingRequests.current.get(
            event.payload.desiredMode,
          );

          if (!requestData) {
            return;
          }

          const requestingOwner = requestData.requesterId;
          const currentModeOwner = modeOwners.get(event.payload.currentMode);

          addLog(
            `Authorization needed: ${requestingOwner} wants "${event.payload.desiredMode}"`,
          );

          // Auto-accept for features that don't require explicit approval
          if (
            currentModeOwner &&
            shouldAutoAccept(currentModeOwner, event.payload.currentMode)
          ) {
            handleAutoAccept(
              event.payload.authId,
              currentModeOwner,
              event.payload.id,
            );
            return;
          }

          // Show dialog for requests that require approval
          if (shouldShowDialog(requestingOwner, event.payload.currentMode)) {
            handleAuthorizationDialog(
              event.payload.authId,
              event.payload.desiredMode,
              requestingOwner,
              event.payload.id,
            );
          }
        },
      );

      // Listen for decisions
      useOn<ModeChangeDecisionEvent>(MapModeEvents.changeDecision, (event) => {
        const { authId, approved } = event.payload;
        const status = approved ? 'approved' : 'rejected';
        const reason = event.payload.reason ? ` - ${event.payload.reason}` : '';

        addLog(`Request ${status}${reason}`);

        // Remove the dialog for this request
        setPendingAuths((prev) => prev.filter((a) => a.authId !== authId));
      });

      const handleModeRequest = (modeName: string, owner: string) => {
        pendingRequests.current.set(modeName, {
          requesterId: owner,
          desiredMode: modeName,
        });
        requestModeChange(modeName, owner);
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
            // Note: Dialog removal is handled by the decision event listener
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
            // Note: Dialog removal is handled by the decision event listener
          }
        }
      };

      return (
        <>
          <div className='absolute top-l left-l flex max-h-[calc(100vh-2rem)] w-[320px] flex-col gap-l rounded-lg bg-surface-default p-l shadow-elevation-overlay'>
            <p className='font-bold text-header-l'>Feature Mode Demo</p>

            <div>
              <p className='mb-s font-bold text-body-m'>Current Mode</p>
              <div className='flex items-center justify-between rounded-lg bg-info-muted p-s'>
                <code className='text-body-m'>{mode}</code>
                <span className='text-body-xs'>
                  Owner: <strong>{modeOwners.get(mode) || 'None'}</strong>
                </span>
              </div>
            </div>

            <div className='mb-m'>
              <p className='mb-s font-bold text-body-m'>Shapes Feature</p>
              <p className='mb-m text-body-xs'>
                Auth required for exit to unowned modes
              </p>
              <div className='flex flex-wrap gap-s'>
                <Button
                  size='small'
                  variant='filled'
                  color='accent'
                  onPress={() => handleModeRequest('default', 'Shapes')}
                >
                  default
                </Button>
                <Button
                  size='small'
                  variant='filled'
                  color='accent'
                  onPress={() => handleModeRequest('drawing', 'Shapes')}
                >
                  drawing
                </Button>
                <Button
                  size='small'
                  variant='filled'
                  color='accent'
                  onPress={() => handleModeRequest('editing', 'Shapes')}
                >
                  editing
                </Button>
              </div>
            </div>

            <div className='mb-m'>
              <p className='mb-s font-bold text-body-m'>
                Measuring Tool Feature
              </p>
              <p className='mb-m text-body-xs'>
                Auto-accepts exit to unowned modes
              </p>
              <div className='flex flex-wrap gap-s'>
                <Button
                  size='small'
                  variant='filled'
                  color='serious'
                  onPress={() => handleModeRequest('default', 'MeasuringTool')}
                >
                  default
                </Button>
                <Button
                  size='small'
                  variant='filled'
                  color='serious'
                  onPress={() =>
                    handleModeRequest('measuring', 'MeasuringTool')
                  }
                >
                  measuring
                </Button>
              </div>
            </div>

            <div className='mb-m'>
              <p className='mb-s font-bold text-body-m'>
                Multi-Select Lasso Feature
              </p>
              <p className='mb-m text-body-xs'>
                Auto-accepts exit to unowned modes
              </p>
              <div className='flex flex-wrap gap-s'>
                <Button
                  size='small'
                  variant='filled'
                  color='mono-bold'
                  onPress={() =>
                    handleModeRequest('default', 'MultiSelectLasso')
                  }
                >
                  default
                </Button>
                <Button
                  size='small'
                  variant='filled'
                  color='mono-bold'
                  onPress={() =>
                    handleModeRequest('multi-select', 'MultiSelectLasso')
                  }
                >
                  multi-select
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
                    <p key={`${index}-${entry}`} className='mb-xs text-body-xs'>
                      {entry}
                    </p>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Notice list for stacking notifications */}
          <NoticeList
            placement='top right'
            defaultColor='serious'
            defaultTimeout={5000}
            hideClearAll
            aria-label='Mode change notifications'
          />

          {/* Dialogs for authorization from Shapes - positioned to not overlay controls */}
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
                    <div className='flex items-center gap-s'>
                      <code className='text-body-m'>{mode}</code>
                    </div>
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
        <BaseMap className='absolute inset-0' id={AUTHORIZATION_FLOW_MAP_ID} />
        <AuthorizationDemo />
      </div>
    );
  },
};
