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
import { Button, Dialog, Divider, Notice } from '@accelint/design-toolkit';
import { useRef, useState } from 'react';
import { BaseMap } from '../index';
import { MapModeProvider } from '.';
import { MapModeEvents } from './events';
import { useMapMode } from './use-map-mode';
import type { Meta, StoryObj } from '@storybook/react';
import type {
  ModeChangeAuthorizationEvent,
  ModeChangeDecisionEvent,
  ModeChangedEvent,
} from './types';

const EXAMPLE_MAP_MODES = ['default', 'drawing', 'measuring', 'editing'];

const meta = {
  title: 'DeckGL/Base Map/Map Mode',
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
      const { mode, requestModeChange } = useMapMode();

      return (
        <div className='absolute left-l top-l w-[256px] rounded-lg bg-surface-default p-l shadow-elevation-overlay flex flex-col gap-xl'>
          <p className='text-header-l font-bold'>Map Modes</p>
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
      <MapModeProvider defaultMode='default'>
        <BaseMap className='relative h-dvh w-dvw' />
        <ModeToolbar />
      </MapModeProvider>
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
      const { requestModeChange } = useMapMode();

      return (
        <div className='absolute left-l top-l flex gap-s'>
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
      const { mode } = useMapMode();

      return (
        <div className='absolute right-l top-l flex flex-col gap-xs items-center rounded-lg bg-surface-default p-m shadow-elevation-raised'>
          <p className='text-body-s'>Current Mode</p>
          <code className='text-header-l'>{mode}</code>
        </div>
      );
    }

    // Instructions panel that changes based on mode
    function InstructionsPanel() {
      const { mode } = useMapMode();

      const instructions: Record<string, string> = {
        default: 'Pan and zoom the map',
        drawing: 'Click to add points to draw on the map',
        measuring: 'Click to measure distances',
        editing: 'Select features to edit them',
      };

      return (
        <div className='absolute bottom-l left-l rounded-lg bg-surface-default p-m shadow-elevation-raised text-m'>
          {instructions[mode] || 'Unknown mode'}
        </div>
      );
    }

    return (
      <MapModeProvider defaultMode='default'>
        <BaseMap className='relative h-dvh w-dvw' />
        <ModeToolbar />
        <ModeIndicator />
        <InstructionsPanel />
      </MapModeProvider>
    );
  },
};

/**
 * Advanced: Authorization flow with feature-specific modes.
 * Demonstrates realistic mode management between two features: Shapes (drawing/editing)
 * and MeasuringTool (measuring). Shows automatic acceptance, notices, and authorization dialogs.
 */
export const AuthorizationFlow: Story = {
  render: () => {
    function AuthorizationDemo() {
      const { mode, requestModeChange } = useMapMode();
      const [modeOwners, setModeOwners] = useState<Map<string, string>>(
        new Map(),
      );
      const [pendingAuth, setPendingAuth] = useState<{
        authId: string;
        desiredMode: string;
        requestingOwner: string;
        currentMode: string;
      } | null>(null);
      const [eventLog, setEventLog] = useState<string[]>([]);
      const [showNotice, setShowNotice] = useState(false);
      const [noticeMessage, setNoticeMessage] = useState('');
      const [dialogOpen, setDialogOpen] = useState(false);
      const [noticeId] = useState(() => uuid());

      const pendingRequests = useRef<Map<string, string>>(new Map());

      const emitDecision = useEmit<ModeChangeDecisionEvent>(
        MapModeEvents.changeDecision,
      );

      const addLog = (message: string) => {
        setEventLog((prev) => [
          ...prev,
          `${new Date().toLocaleTimeString()}: ${message}`,
        ]);
      };

      // Listen for mode changes
      useOn<ModeChangedEvent>(MapModeEvents.changed, (event) => {
        addLog(
          `Mode changed: "${event.payload.previousMode}" → "${event.payload.currentMode}"`,
        );

        const requestingOwner = pendingRequests.current.get(
          event.payload.currentMode,
        );
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

      // Listen for authorization requests
      useOn<ModeChangeAuthorizationEvent>(
        MapModeEvents.changeAuthorization,
        (event) => {
          const requestingOwner = pendingRequests.current.get(
            event.payload.desiredMode,
          );

          if (!requestingOwner) {
            return;
          }

          const currentModeOwner = modeOwners.get(event.payload.currentMode);

          addLog(
            `Authorization needed: ${requestingOwner} wants "${event.payload.desiredMode}"`,
          );

          // MeasuringTool automatically accepts requests to leave measuring mode
          if (
            currentModeOwner === 'MeasuringTool' &&
            event.payload.currentMode === 'measuring'
          ) {
            addLog('MeasuringTool auto-accepting request');
            // Show notice that measuring was canceled
            setNoticeMessage(
              `Measuring mode was canceled, mode changed to ${event.payload.desiredMode}`,
            );
            setShowNotice(true);
            setTimeout(() => setShowNotice(false), 5000);

            // Auto-approve
            emitDecision({
              authId: event.payload.authId,
              approved: true,
              owner: currentModeOwner,
            });
            return;
          }

          // For MeasuringTool requesting from Shapes modes (drawing/editing), show dialog
          if (
            requestingOwner === 'MeasuringTool' &&
            (event.payload.currentMode === 'drawing' ||
              event.payload.currentMode === 'editing')
          ) {
            setPendingAuth({
              authId: event.payload.authId,
              desiredMode: event.payload.desiredMode,
              requestingOwner,
              currentMode: event.payload.currentMode,
            });
            setDialogOpen(true);
          }
        },
      );

      // Listen for decisions
      useOn<ModeChangeDecisionEvent>(MapModeEvents.changeDecision, (event) => {
        const status = event.payload.approved ? 'approved' : 'rejected';
        const reason = event.payload.reason ? ` - ${event.payload.reason}` : '';
        addLog(`Request ${status}${reason}`);
      });

      const handleModeRequest = (modeName: string, owner: string) => {
        pendingRequests.current.set(modeName, owner);
        requestModeChange(modeName, owner);
      };

      const handleApprove = () => {
        if (pendingAuth) {
          const currentModeOwner = modeOwners.get(pendingAuth.currentMode);
          if (currentModeOwner) {
            emitDecision({
              authId: pendingAuth.authId,
              approved: true,
              owner: currentModeOwner,
            });
            setPendingAuth(null);
            setDialogOpen(false);
          }
        }
      };

      const handleReject = () => {
        if (pendingAuth) {
          const currentModeOwner = modeOwners.get(pendingAuth.currentMode);
          if (currentModeOwner) {
            emitDecision({
              authId: pendingAuth.authId,
              approved: false,
              owner: currentModeOwner,
              reason: `${currentModeOwner} rejected the request`,
            });
            setPendingAuth(null);
            setDialogOpen(false);
          }
        }
      };

      return (
        <>
          <div className='absolute left-l top-l w-[320px] rounded-lg bg-surface-default p-l shadow-elevation-overlay flex flex-col gap-l'>
            <p className='text-header-l font-bold'>Feature Mode Demo</p>

            <div>
              <p className='mb-s text-body-m font-bold'>Current Mode</p>
              <div className='flex items-center justify-between rounded-lg bg-info-muted p-s'>
                <code className='text-body-m '>{mode}</code>
                <span className='text-body-xs'>
                  Owner: <strong>{modeOwners.get(mode) || 'None'}</strong>
                </span>
              </div>
            </div>

            <div className='mb-m'>
              <p className='mb-s text-body-m font-bold'>Shapes Feature</p>
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
              <p className='mb-s text-body-m font-bold'>
                Measuring Tool Feature
              </p>
              <p className='mb-m text-body-xs'>Auto-accepts exits</p>
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

            <Divider />

            <div>
              <p className='mb-s text-body-m font-semibold'>Event Log</p>
              <div className='max-h-40 overflow-y-auto rounded-lg border border-border-default bg-surface-subtle p-s'>
                {eventLog.length === 0 ? (
                  <p className='text-body-xs text-content-disabled'>
                    No events yet
                  </p>
                ) : (
                  eventLog.map((entry) => (
                    <p key={entry} className='mb-xs text-body-xs '>
                      {entry}
                    </p>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Notice for measuring mode cancellation */}
          {showNotice && (
            <div className='absolute top-l right-l w-[384px]'>
              <Notice
                id={noticeId}
                color='serious'
                message={noticeMessage}
                showClose
                onClose={() => setShowNotice(false)}
              />
            </div>
          )}

          {/* Dialog for authorization from Shapes */}
          <Dialog.Trigger isOpen={dialogOpen} onOpenChange={setDialogOpen}>
            <button type='button' style={{ display: 'none' }} />
            <Dialog>
              <Dialog.Title>Authorization Request</Dialog.Title>
              <Dialog.Content>
                <div className='space-y-m'>
                  <div className='rounded-lg bg-surface-muted p-s'>
                    <p className='mb-xs text-body-xs'>Request From</p>
                    <code className='text-body-m '>
                      {pendingAuth?.requestingOwner}
                    </code>
                  </div>
                  <div className='text-body-m '>
                    <span>Wants to change to: </span>
                    <code className='rounded bg-surface-muted px-s py-xs text-body-m '>
                      {pendingAuth?.desiredMode}
                    </code>
                  </div>
                  <Divider />
                  <div className='rounded-lg bg-surface-muted p-s'>
                    <p className='mb-xs text-body-xs'>Current Mode</p>
                    <div className='flex items-center gap-s'>
                      <code className='text-body-m '>
                        {pendingAuth?.currentMode}
                      </code>
                    </div>
                  </div>
                </div>
              </Dialog.Content>
              <Dialog.Footer>
                <Button variant='flat' color='critical' onPress={handleReject}>
                  Reject
                </Button>
                <Button variant='filled' color='accent' onPress={handleApprove}>
                  Approve
                </Button>
              </Dialog.Footer>
            </Dialog>
          </Dialog.Trigger>
        </>
      );
    }

    return (
      <MapModeProvider defaultMode='default'>
        <BaseMap className='relative h-dvh w-dvw' />
        <AuthorizationDemo />
      </MapModeProvider>
    );
  },
};
