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
import { render, renderHook, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MapModeEvents } from './events';
import { destroyStore, getOrCreateStore } from './store';
import { useMapMode } from './use-map-mode';
import type { UniqueId } from '@accelint/core';
import type {
  ModeChangeAuthorizationEvent,
  ModeChangeDecisionEvent,
} from './types';

describe('useMapMode', () => {
  let testid: UniqueId;

  beforeEach(() => {
    // Create a stable id and store for each test
    testid = uuid();
    getOrCreateStore(testid);
  });

  afterEach(() => {
    // Clean up the store after each test
    destroyStore(testid);
    vi.restoreAllMocks();
  });

  describe('Hook Behavior', () => {
    it('provides default mode on mount', () => {
      const { result } = renderHook(() => useMapMode(testid));

      expect(result.current.mode).toBe('default');
    });

    it('provides requestModeChange function', () => {
      const { result } = renderHook(() => useMapMode(testid));

      expect(typeof result.current.requestModeChange).toBe('function');
    });

    it('throws error when used outside MapProvider without id', () => {
      expect(() => {
        renderHook(() => useMapMode());
      }).toThrow(
        'useMapMode requires either an id parameter or to be used within a MapProvider',
      );
    });

    it('throws error when store does not exist for the given id', () => {
      const nonExistentId = uuid();
      expect(() => {
        renderHook(() => useMapMode(nonExistentId));
      }).toThrow(`MapModeStore not found for map instance: ${nonExistentId}`);
    });

    it('updates when mode changes via subscription', async () => {
      const user = userEvent.setup();

      function TestComponent() {
        const { mode, requestModeChange } = useMapMode(testid);

        return (
          <div>
            <span data-testid='mode'>{mode}</span>
            <button
              type='button'
              onClick={() => requestModeChange('drawing', 'owner1')}
              data-testid='change-mode'
            >
              Change
            </button>
          </div>
        );
      }

      render(<TestComponent />);

      const modeDisplay = screen.getByTestId('mode');
      expect(modeDisplay).toHaveTextContent('default');

      await user.click(screen.getByTestId('change-mode'));

      await waitFor(() => {
        expect(modeDisplay).toHaveTextContent('drawing');
      });
    });
  });

  describe('Integration with Store', () => {
    it('calls store.requestModeChange when hook method is called', async () => {
      const user = userEvent.setup();

      function TestComponent() {
        const { mode, requestModeChange } = useMapMode(testid);

        return (
          <div>
            <span data-testid='mode'>{mode}</span>
            <button
              type='button'
              onClick={() => requestModeChange('drawing', 'owner1')}
              data-testid='change-mode'
            >
              Change
            </button>
          </div>
        );
      }

      render(<TestComponent />);

      expect(screen.getByTestId('mode')).toHaveTextContent('default');

      await user.click(screen.getByTestId('change-mode'));

      await waitFor(() => {
        expect(screen.getByTestId('mode')).toHaveTextContent('drawing');
      });
    });

    it('triggers authorization flow when ownership conflict exists', async () => {
      const user = userEvent.setup();
      const onAuthRequest = vi.fn();

      function TestComponent() {
        const { mode, requestModeChange } = useMapMode(testid);
        useOn<ModeChangeAuthorizationEvent>(
          MapModeEvents.changeAuthorization,
          onAuthRequest,
        );

        return (
          <div>
            <span data-testid='mode'>{mode}</span>
            <button
              type='button'
              onClick={() => requestModeChange('drawing', 'owner1')}
              data-testid='owner1-drawing'
            >
              Owner1
            </button>
            <button
              type='button'
              onClick={() => requestModeChange('measuring', 'owner2')}
              data-testid='owner2-measuring'
            >
              Owner2
            </button>
          </div>
        );
      }

      render(<TestComponent />);

      // owner1 claims drawing
      await user.click(screen.getByTestId('owner1-drawing'));

      await waitFor(() => {
        expect(screen.getByTestId('mode')).toHaveTextContent('drawing');
      });

      // owner2 tries to switch to measuring - should trigger authorization
      await user.click(screen.getByTestId('owner2-measuring'));

      await waitFor(() => {
        expect(onAuthRequest).toHaveBeenCalledWith(
          expect.objectContaining({
            payload: expect.objectContaining({
              desiredMode: 'measuring',
              currentMode: 'drawing',
            }),
          }),
        );
      });

      // Mode should NOT have changed yet
      expect(screen.getByTestId('mode')).toHaveTextContent('drawing');
    });

    it('handles authorization approval correctly', async () => {
      const user = userEvent.setup();

      function TestComponent() {
        const { mode, requestModeChange } = useMapMode(testid);
        const emitDecision = useEmit<ModeChangeDecisionEvent>(
          MapModeEvents.changeDecision,
        );

        useOn<ModeChangeAuthorizationEvent>(
          MapModeEvents.changeAuthorization,
          (event) => {
            // Auto-approve for test
            emitDecision({
              authId: event.payload.authId,
              approved: true,
              owner: 'owner1',
              id: event.payload.id,
            });
          },
        );

        return (
          <div>
            <span data-testid='mode'>{mode}</span>
            <button
              type='button'
              onClick={() => requestModeChange('drawing', 'owner1')}
              data-testid='owner1-drawing'
            >
              Owner1
            </button>
            <button
              type='button'
              onClick={() => requestModeChange('measuring', 'owner2')}
              data-testid='owner2-measuring'
            >
              Owner2
            </button>
          </div>
        );
      }

      render(<TestComponent />);

      // owner1 claims drawing
      await user.click(screen.getByTestId('owner1-drawing'));

      await waitFor(() => {
        expect(screen.getByTestId('mode')).toHaveTextContent('drawing');
      });

      // owner2 requests measuring and it gets approved
      await user.click(screen.getByTestId('owner2-measuring'));

      await waitFor(() => {
        expect(screen.getByTestId('mode')).toHaveTextContent('measuring');
      });
    });

    it('handles authorization rejection correctly', async () => {
      const user = userEvent.setup();

      function TestComponent() {
        const { mode, requestModeChange } = useMapMode(testid);
        const emitDecision = useEmit<ModeChangeDecisionEvent>(
          MapModeEvents.changeDecision,
        );

        useOn<ModeChangeAuthorizationEvent>(
          MapModeEvents.changeAuthorization,
          (event) => {
            // Auto-reject for test
            emitDecision({
              authId: event.payload.authId,
              approved: false,
              owner: 'owner1',
              reason: 'Test rejection',
              id: event.payload.id,
            });
          },
        );

        return (
          <div>
            <span data-testid='mode'>{mode}</span>
            <button
              type='button'
              onClick={() => requestModeChange('drawing', 'owner1')}
              data-testid='owner1-drawing'
            >
              Owner1
            </button>
            <button
              type='button'
              onClick={() => requestModeChange('measuring', 'owner2')}
              data-testid='owner2-measuring'
            >
              Owner2
            </button>
          </div>
        );
      }

      render(<TestComponent />);

      // owner1 claims drawing
      await user.click(screen.getByTestId('owner1-drawing'));

      await waitFor(() => {
        expect(screen.getByTestId('mode')).toHaveTextContent('drawing');
      });

      const initialMode = screen.getByTestId('mode').textContent;

      // owner2 requests measuring and it gets rejected
      await user.click(screen.getByTestId('owner2-measuring'));

      // Wait a bit to ensure mode didn't change
      await waitFor(
        () => {
          expect(screen.getByTestId('mode')).toHaveTextContent(
            initialMode as string,
          );
        },
        { timeout: 200 },
      );

      expect(screen.getByTestId('mode')).toHaveTextContent('drawing');
    });
  });
});
