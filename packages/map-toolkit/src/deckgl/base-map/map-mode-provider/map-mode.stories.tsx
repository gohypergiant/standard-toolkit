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
import { useEffect, useRef, useState } from 'react';
import { BaseMap } from '../index';
import { MapModeProvider, useMapMode } from '.';
import { MapModeEvents } from './events';
import type { Meta, StoryObj } from '@storybook/react';
import type {
  ModeChangeAuthorizationEvent,
  ModeChangeDecisionEvent,
  ModeChangedEvent,
  ModeChangeRequestEvent,
} from './types';

const MAP_MODES = ['default', 'drawing', 'measuring', 'editing'];
const OWNER_1_ID = 'owner1';
const OWNER_2_ID = 'owner2';

// Module-level state to persist across Storybook remounts
// Track which owner owns which mode (mode -> owner UUID)
const globalModeOwnership = new Map<string, string>();
// Track event log across remounts
const globalEventLog: string[] = [];

type MapModeStoryArgs = {
  defaultMode: string;
  requestModeOwner1: string;
  requestModeOwner2: string;
};

const meta = {
  title: 'DeckGL/Base Map/Map Mode',
  args: {
    defaultMode: 'default',
    requestModeOwner1: '',
    requestModeOwner2: '',
  },
  argTypes: {
    defaultMode: {
      control: 'radio',
      options: MAP_MODES,
      description:
        'Initial mode when the map loads (starts ownerless, auto-accepts first request)',
    },
    requestModeOwner1: {
      control: 'radio',
      options: ['', ...MAP_MODES],
      description: 'Request a mode change as Owner 1 (can re-select same mode)',
    },
    requestModeOwner2: {
      control: 'radio',
      options: ['', ...MAP_MODES],
      description: 'Request a mode change as Owner 2 (can re-select same mode)',
    },
  },
} satisfies Meta<MapModeStoryArgs>;

export default meta;
type Story = StoryObj<MapModeStoryArgs>;

export const MapMode: Story = {
  args: {
    defaultMode: 'default',
    requestModeOwner1: '',
    requestModeOwner2: '',
  },

  render: (args) => {
    // StatusPanel component that uses the map mode context
    function StatusPanel() {
      const [pendingAuth, setPendingAuth] = useState<{
        authId: string;
        desiredMode: string;
      } | null>(null);
      // Force re-render when module-level data changes
      const [, forceUpdate] = useState({});

      // Get mode from context
      const { mode: currentMode, requestModeChange } = useMapMode();

      const emitDecision = useEmit<ModeChangeDecisionEvent>(
        MapModeEvents.changeDecision,
      );

      const addLog = (message: string) => {
        globalEventLog.push(`${new Date().toLocaleTimeString()}: ${message}`);
        forceUpdate({}); // Trigger re-render to show new log entry
      };

      // Track pending requests to correlate with mode changes
      const pendingRequests = useRef<Map<string, string>>(new Map()); // mode -> owner

      // Listen for mode change requests to track pending requests
      useOn<ModeChangeRequestEvent>(MapModeEvents.changeRequest, (event) => {
        // Track this request so we know who requested it
        pendingRequests.current.set(
          event.payload.desiredMode,
          event.payload.owner,
        );
      });

      // Listen for mode changes to update global ownership
      useOn<ModeChangedEvent>(MapModeEvents.changed, (event) => {
        addLog(
          `Mode changed from "${event.payload.previousMode}" to "${event.payload.currentMode}"`,
        );

        // Check if we have a pending request for this mode
        const requestingOwner = pendingRequests.current.get(
          event.payload.currentMode,
        );
        // Update global ownership (except for 'default' which stays ownerless)
        if (requestingOwner && event.payload.currentMode !== 'default') {
          globalModeOwnership.set(event.payload.currentMode, requestingOwner);
          addLog(
            `"${event.payload.currentMode}" now owned by ${requestingOwner}`,
          );
          pendingRequests.current.delete(event.payload.currentMode);
          forceUpdate({});
        } else if (event.payload.currentMode === 'default') {
          // Clear ownership for default mode
          globalModeOwnership.delete(event.payload.currentMode);
          forceUpdate({});
        }
      });

      // Listen for authorization requests
      useOn<ModeChangeAuthorizationEvent>(
        MapModeEvents.changeAuthorization,
        (event) => {
          addLog(
            `Authorization requested for mode change to "${event.payload.desiredMode}" (authId: ${event.payload.authId})`,
          );

          // Check who owns the current mode
          const currentModeOwner = globalModeOwnership.get(
            event.payload.currentMode,
          );

          // Only show authorization UI if someone owns the current mode
          // (The UI will show which owner can authorize it)
          if (currentModeOwner) {
            setPendingAuth({
              authId: event.payload.authId,
              desiredMode: event.payload.desiredMode,
            });
          }
        },
      );

      // Listen for decisions
      useOn<ModeChangeDecisionEvent>(MapModeEvents.changeDecision, (event) => {
        const status = event.payload.approved ? 'approved' : 'rejected';
        const reason = event.payload.reason ? ` (${event.payload.reason})` : '';
        addLog(`Mode change ${status}${reason}`);
      });

      // Handle requestModeOwner1 control changes
      useEffect(() => {
        if (args.requestModeOwner1) {
          // Track the request BEFORE emitting (so it's ready when mode changes)
          pendingRequests.current.set(args.requestModeOwner1, OWNER_1_ID);
          requestModeChange(args.requestModeOwner1, OWNER_1_ID);
        }
      }, [args.requestModeOwner1, requestModeChange]);

      // Handle requestModeOwner2 control changes (different owner's requests)
      useEffect(() => {
        if (args.requestModeOwner2) {
          // Track the request BEFORE emitting (so it's ready when mode changes)
          pendingRequests.current.set(args.requestModeOwner2, OWNER_2_ID);
          requestModeChange(args.requestModeOwner2, OWNER_2_ID);
        }
      }, [args.requestModeOwner2, requestModeChange]);

      // Get current mode ownership for UI
      const currentModeOwner = globalModeOwnership.get(currentMode);
      const currentOwnerName = currentModeOwner ? currentModeOwner : 'None';

      const handleApprove = () => {
        if (pendingAuth && currentModeOwner) {
          emitDecision({
            authId: pendingAuth.authId,
            approved: true,
            owner: currentModeOwner, // Use the actual current mode owner
          });
          setPendingAuth(null);
        }
      };

      const handleReject = () => {
        if (pendingAuth && currentModeOwner) {
          emitDecision({
            authId: pendingAuth.authId,
            approved: false,
            owner: currentModeOwner, // Use the actual current mode owner
            reason: `${currentModeOwner} rejected the request`,
          });
          setPendingAuth(null);
        }
      };

      return (
        <div className='absolute top-4 left-4 w-80 rounded-lg bg-white p-4 shadow-lg'>
          <h2 className='mb-4 font-bold text-lg'>Map Mode Monitor</h2>

          <div className='mb-4'>
            <p className='mb-2 font-semibold text-sm'>Current Mode:</p>
            <div className='flex items-center gap-2'>
              <p className='flex-1 rounded bg-blue-100 p-2 text-center font-mono'>
                {currentMode}
              </p>
            </div>
            <p className='mt-1 text-gray-600 text-xs'>
              Owner: <strong>{currentOwnerName}</strong>
            </p>
          </div>

          <div className='mb-4'>
            <p className='mb-2 font-semibold text-sm'>Mode Ownership:</p>
            <div className='rounded border bg-gray-50 p-2'>
              {MAP_MODES.map((mode) => {
                const owner = globalModeOwnership.get(mode);
                const ownerDisplay = owner ? owner : 'Ownerless';
                const isActive = mode === currentMode;
                return (
                  <div
                    key={mode}
                    className={`flex justify-between border-b py-1 last:border-b-0 ${isActive ? 'font-bold' : ''}`}
                  >
                    <span className='font-mono text-xs'>{mode}</span>
                    <span className='text-gray-600 text-xs'>
                      {ownerDisplay}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {pendingAuth && currentModeOwner && (
            <div className='mb-4 rounded border-2 border-amber-400 bg-amber-50 p-3'>
              <p className='mb-2 font-semibold text-sm'>
                ⚠️ Authorization Needed
              </p>
              <p className='mb-2 text-sm'>
                Someone wants: <strong>{pendingAuth.desiredMode}</strong>
              </p>
              <p className='mb-3 text-gray-600 text-xs'>
                Only <strong>{currentModeOwner}</strong> can authorize this
                request
              </p>
              <div className='flex gap-2'>
                <button
                  type='button'
                  onClick={handleApprove}
                  className='flex-1 rounded bg-green-500 px-3 py-1 text-sm text-white hover:bg-green-600'
                  title={`Approve as ${currentModeOwner}`}
                >
                  Approve
                </button>
                <button
                  type='button'
                  onClick={handleReject}
                  className='flex-1 rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600'
                  title={`Reject as ${currentModeOwner}`}
                >
                  Reject
                </button>
              </div>
            </div>
          )}

          <div className='border-t pt-4'>
            <p className='mb-2 font-semibold text-sm'>Event Log:</p>
            <div className='max-h-40 overflow-y-auto rounded border bg-gray-50 p-2'>
              {globalEventLog.length === 0 ? (
                <p className='text-gray-400 text-xs'>No events yet</p>
              ) : (
                globalEventLog.map((entry, i) => (
                  <p key={`log-${i}`} className='mb-1 text-xs'>
                    {entry}
                  </p>
                ))
              )}
            </div>
          </div>
        </div>
      );
    }

    return (
      <MapModeProvider defaultMode={args.defaultMode}>
        <BaseMap className='relative h-dvh w-dvw' />
        <StatusPanel />
      </MapModeProvider>
    );
  },
};
