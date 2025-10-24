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
import {
  act,
  render,
  renderHook,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MapModeEvents } from '../events';
import { MapIdProvider } from './provider';
import { useMapMode } from './use-map-mode';
import type { ReactNode } from 'react';
import type {
  ModeChangeAuthorizationEvent,
  ModeChangeDecisionEvent,
  ModeChangedEvent,
} from '../types';

describe('MapIdProvider', () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <MapIdProvider>{children}</MapIdProvider>
  );

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Basic Functionality', () => {
    it('provides default mode on mount', () => {
      const { result } = renderHook(() => useMapMode(), { wrapper });

      expect(result.current.mode).toBe('default');
    });

    it('accepts custom defaultMode', () => {
      const customWrapper = ({ children }: { children: ReactNode }) => (
        <MapIdProvider defaultMode='drawing'>{children}</MapIdProvider>
      );

      const { result } = renderHook(() => useMapMode(), {
        wrapper: customWrapper,
      });

      expect(result.current.mode).toBe('drawing');
    });

    it('provides requestModeChange function', () => {
      const { result } = renderHook(() => useMapMode(), { wrapper });

      expect(typeof result.current.requestModeChange).toBe('function');
    });
  });

  describe('Mode Changes', () => {
    it('changes mode when no ownership conflicts', async () => {
      const user = userEvent.setup();

      function TestComponent() {
        const { mode, requestModeChange } = useMapMode();

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

      render(
        <MapIdProvider>
          <TestComponent />
        </MapIdProvider>,
      );

      const modeDisplay = screen.getByTestId('mode');
      expect(modeDisplay).toHaveTextContent('default');

      await user.click(screen.getByTestId('change-mode'));

      await waitFor(() => {
        expect(modeDisplay).toHaveTextContent('drawing');
      });
    });

    it('emits mode changed event', async () => {
      const user = userEvent.setup();
      const onModeChanged = vi.fn();

      function TestComponent() {
        const { requestModeChange } = useMapMode();
        useOn<ModeChangedEvent>(MapModeEvents.changed, onModeChanged);

        return (
          <button
            type='button'
            onClick={() => requestModeChange('drawing', 'owner1')}
            data-testid='change-mode'
          >
            Change
          </button>
        );
      }

      render(
        <MapIdProvider>
          <TestComponent />
        </MapIdProvider>,
      );

      await user.click(screen.getByTestId('change-mode'));

      await waitFor(() => {
        expect(onModeChanged).toHaveBeenCalledWith(
          expect.objectContaining({
            payload: {
              previousMode: 'default',
              currentMode: 'drawing',
              mapInstanceId: expect.any(String),
            },
          }),
        );
      });
    });

    it('allows current mode owner to switch to default', async () => {
      const user = userEvent.setup();

      function TestComponent() {
        const { mode, requestModeChange } = useMapMode();

        return (
          <div>
            <span data-testid='mode'>{mode}</span>
            <button
              type='button'
              onClick={() => requestModeChange('drawing', 'owner1')}
              data-testid='to-drawing'
            >
              Drawing
            </button>
            <button
              type='button'
              onClick={() => requestModeChange('default', 'owner1')}
              data-testid='to-default'
            >
              Default
            </button>
          </div>
        );
      }

      render(
        <MapIdProvider>
          <TestComponent />
        </MapIdProvider>,
      );

      // Switch to drawing
      await user.click(screen.getByTestId('to-drawing'));

      await waitFor(() => {
        expect(screen.getByTestId('mode')).toHaveTextContent('drawing');
      });

      // Switch to default (same owner should work)
      await user.click(screen.getByTestId('to-default'));

      await waitFor(() => {
        expect(screen.getByTestId('mode')).toHaveTextContent('default');
      });
    });

    it('requires authorization when non-owner tries to switch to default', async () => {
      const user = userEvent.setup();
      const onAuthRequest = vi.fn();

      function TestComponent() {
        const { mode, requestModeChange } = useMapMode();
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
              data-testid='to-drawing'
            >
              Drawing
            </button>
            <button
              type='button'
              onClick={() => requestModeChange('default', 'owner2')}
              data-testid='to-default'
            >
              Default
            </button>
          </div>
        );
      }

      render(
        <MapIdProvider>
          <TestComponent />
        </MapIdProvider>,
      );

      // owner1 claims drawing mode
      await user.click(screen.getByTestId('to-drawing'));

      await waitFor(() => {
        expect(screen.getByTestId('mode')).toHaveTextContent('drawing');
      });

      // owner2 tries to switch to default - should trigger authorization
      await user.click(screen.getByTestId('to-default'));

      await waitFor(() => {
        expect(onAuthRequest).toHaveBeenCalledWith(
          expect.objectContaining({
            payload: expect.objectContaining({
              desiredMode: 'default',
              currentMode: 'drawing',
            }),
          }),
        );
      });

      // Mode should not have changed without authorization
      expect(screen.getByTestId('mode')).toHaveTextContent('drawing');
    });

    it('allows owner to return to their own mode from default', async () => {
      const user = userEvent.setup();

      function TestComponent() {
        const { mode, requestModeChange } = useMapMode();

        return (
          <div>
            <span data-testid='mode'>{mode}</span>
            <button
              type='button'
              onClick={() => requestModeChange('drawing', 'owner1')}
              data-testid='to-drawing'
            >
              Drawing
            </button>
            <button
              type='button'
              onClick={() => requestModeChange('default', 'owner1')}
              data-testid='to-default'
            >
              Default
            </button>
          </div>
        );
      }

      render(
        <MapIdProvider>
          <TestComponent />
        </MapIdProvider>,
      );

      // owner1 claims drawing mode
      await user.click(screen.getByTestId('to-drawing'));

      await waitFor(() => {
        expect(screen.getByTestId('mode')).toHaveTextContent('drawing');
      });

      // owner1 switches to default
      await user.click(screen.getByTestId('to-default'));

      await waitFor(() => {
        expect(screen.getByTestId('mode')).toHaveTextContent('default');
      });

      // owner1 should be able to return to drawing without authorization
      await user.click(screen.getByTestId('to-drawing'));

      await waitFor(() => {
        expect(screen.getByTestId('mode')).toHaveTextContent('drawing');
      });
    });

    it('does not change mode if already in that mode', async () => {
      const user = userEvent.setup();
      const onModeChanged = vi.fn();

      function TestComponent() {
        const { requestModeChange } = useMapMode();
        useOn<ModeChangedEvent>(MapModeEvents.changed, onModeChanged);

        return (
          <button
            type='button'
            onClick={() => requestModeChange('default', 'owner1')}
            data-testid='change-mode'
          >
            Change
          </button>
        );
      }

      render(
        <MapIdProvider>
          <TestComponent />
        </MapIdProvider>,
      );

      await user.click(screen.getByTestId('change-mode'));

      // Wait a bit to ensure no event was emitted
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      expect(onModeChanged).not.toHaveBeenCalled();
    });

    it('allows switching between ownerless modes', async () => {
      const user = userEvent.setup();

      const customWrapper = ({ children }: { children: ReactNode }) => (
        <MapIdProvider defaultMode='mode1'>{children}</MapIdProvider>
      );

      function TestComponent() {
        const { mode, requestModeChange } = useMapMode();

        return (
          <div>
            <span data-testid='mode'>{mode}</span>
            <button
              type='button'
              onClick={() => requestModeChange('mode2', 'owner1')}
              data-testid='to-mode2'
            >
              Mode 2
            </button>
            <button
              type='button'
              onClick={() => requestModeChange('mode3', 'owner1')}
              data-testid='to-mode3'
            >
              Mode 3
            </button>
          </div>
        );
      }

      render(
        <MapIdProvider>
          <TestComponent />
        </MapIdProvider>,
        { wrapper: customWrapper },
      );

      // mode 2 is ownerless, should allow switching
      await user.click(screen.getByTestId('to-mode2'));

      await waitFor(() => {
        expect(screen.getByTestId('mode')).toHaveTextContent('mode2');
      });

      // mode 3 is ownerless, should allow switching
      await user.click(screen.getByTestId('to-mode3'));

      await waitFor(() => {
        expect(screen.getByTestId('mode')).toHaveTextContent('mode3');
      });
    });
  });

  describe('Validation', () => {
    it('throws error for empty desiredMode', () => {
      const { result } = renderHook(() => useMapMode(), { wrapper });

      expect(() => {
        result.current.requestModeChange('', 'owner1');
      }).toThrow('requestModeChange requires non-empty desiredMode');
    });

    it('throws error for empty requestOwner', () => {
      const { result } = renderHook(() => useMapMode(), { wrapper });

      expect(() => {
        result.current.requestModeChange('drawing', '');
      }).toThrow('requestModeChange requires non-empty requestOwner');
    });
  });

  describe('Authorization Flow', () => {
    it('triggers authorization when different owner attempts to switch mode', async () => {
      const user = userEvent.setup();
      const onAuthRequest = vi.fn();

      function TestComponent() {
        const { mode, requestModeChange } = useMapMode();
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
              Owner1 Drawing
            </button>
            <button
              type='button'
              onClick={() => requestModeChange('measuring', 'owner2')}
              data-testid='owner2-measuring'
            >
              Owner2 Measuring
            </button>
          </div>
        );
      }

      render(
        <MapIdProvider>
          <TestComponent />
        </MapIdProvider>,
      );

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

    it('changes mode when authorization is approved', async () => {
      const user = userEvent.setup();

      function TestComponent() {
        const { mode, requestModeChange } = useMapMode();
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
              mapInstanceId: event.payload.mapInstanceId,
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

      render(
        <MapIdProvider>
          <TestComponent />
        </MapIdProvider>,
      );

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

    it('does not change mode when authorization is rejected', async () => {
      const user = userEvent.setup();

      function TestComponent() {
        const { mode, requestModeChange } = useMapMode();
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
              mapInstanceId: event.payload.mapInstanceId,
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

      render(
        <MapIdProvider>
          <TestComponent />
        </MapIdProvider>,
      );

      // owner1 claims drawing
      await user.click(screen.getByTestId('owner1-drawing'));

      await waitFor(() => {
        expect(screen.getByTestId('mode')).toHaveTextContent('drawing');
      });

      // owner2 requests measuring and it gets rejected
      await user.click(screen.getByTestId('owner2-measuring'));

      // Wait a bit to ensure mode didn't change
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      expect(screen.getByTestId('mode')).toHaveTextContent('drawing');
    });

    it('ignores decisions from unauthorized owners', async () => {
      const user = userEvent.setup();
      const onModeChanged = vi.fn();

      function TestComponent() {
        const { mode, requestModeChange } = useMapMode();
        const emitDecision = useEmit<ModeChangeDecisionEvent>(
          MapModeEvents.changeDecision,
        );
        useOn<ModeChangedEvent>(MapModeEvents.changed, onModeChanged);

        useOn<ModeChangeAuthorizationEvent>(
          MapModeEvents.changeAuthorization,
          (event) => {
            // Try to approve from wrong owner
            emitDecision({
              authId: event.payload.authId,
              approved: true,
              owner: 'owner-wrong', // Not the current mode owner
              mapInstanceId: event.payload.mapInstanceId,
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

      render(
        <MapIdProvider>
          <TestComponent />
        </MapIdProvider>,
      );

      // owner1 claims drawing
      await user.click(screen.getByTestId('owner1-drawing'));

      await waitFor(() => {
        expect(screen.getByTestId('mode')).toHaveTextContent('drawing');
      });

      onModeChanged.mockClear();

      // owner2 requests but unauthorized owner tries to approve
      await user.click(screen.getByTestId('owner2-measuring'));

      // Wait to ensure no mode change occurred
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      expect(onModeChanged).not.toHaveBeenCalled();
      expect(screen.getByTestId('mode')).toHaveTextContent('drawing');
    });
  });

  describe('Stale Request Handling', () => {
    it('clears pending requests when mode changes successfully', async () => {
      const user = userEvent.setup();
      const onAuthRequest = vi.fn();

      function TestComponent() {
        const { mode, requestModeChange } = useMapMode();
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
              data-testid='to-drawing'
            >
              Drawing
            </button>
            <button
              type='button'
              onClick={() => requestModeChange('measuring', 'owner1')}
              data-testid='to-measuring'
            >
              Measuring
            </button>
          </div>
        );
      }

      render(
        <MapIdProvider>
          <TestComponent />
        </MapIdProvider>,
      );

      // Change to drawing
      await user.click(screen.getByTestId('to-drawing'));

      await waitFor(() => {
        expect(screen.getByTestId('mode')).toHaveTextContent('drawing');
      });

      // Change to measuring (same owner, should auto-accept)
      await user.click(screen.getByTestId('to-measuring'));

      await waitFor(() => {
        expect(screen.getByTestId('mode')).toHaveTextContent('measuring');
      });

      // No authorization should have been requested
      expect(onAuthRequest).not.toHaveBeenCalled();
    });

    it('should auto-accept new mode request from default when no ownership conflicts exist', async () => {
      const user = userEvent.setup();
      const onAuthRequest = vi.fn();

      function TestComponent() {
        const { mode, requestModeChange } = useMapMode();
        useOn<ModeChangeAuthorizationEvent>(
          MapModeEvents.changeAuthorization,
          onAuthRequest,
        );

        return (
          <div>
            <span data-testid='mode'>{mode}</span>
            <button
              type='button'
              onClick={() => requestModeChange('measuring', 'MeasuringTool')}
              data-testid='to-measuring'
            >
              Measuring
            </button>
            <button
              type='button'
              onClick={() => requestModeChange('default', 'MeasuringTool')}
              data-testid='to-default'
            >
              Default
            </button>
            <button
              type='button'
              onClick={() =>
                requestModeChange('multi-select', 'MultiSelectLasso')
              }
              data-testid='to-multi-select'
            >
              Multi-Select
            </button>
          </div>
        );
      }

      render(
        <MapIdProvider>
          <TestComponent />
        </MapIdProvider>,
      );

      // Start in default mode
      expect(screen.getByTestId('mode')).toHaveTextContent('default');

      // Switch to measuring mode
      await user.click(screen.getByTestId('to-measuring'));
      await waitFor(() => {
        expect(screen.getByTestId('mode')).toHaveTextContent('measuring');
      });

      // Switch back to default
      await user.click(screen.getByTestId('to-default'));
      await waitFor(() => {
        expect(screen.getByTestId('mode')).toHaveTextContent('default');
      });

      // Now multi-select tries to switch to multi-select mode
      // This should NOT trigger authorization since we're in default mode
      // and multi-select has no conflicts
      await user.click(screen.getByTestId('to-multi-select'));
      await waitFor(() => {
        expect(screen.getByTestId('mode')).toHaveTextContent('multi-select');
      });

      // No authorization should have been requested
      expect(onAuthRequest).not.toHaveBeenCalled();
    });

    it('should not assign owner to default mode when approving request for default', async () => {
      const user = userEvent.setup();
      const onAuthRequest = vi.fn();

      function TestComponent() {
        const { mode, requestModeChange } = useMapMode();
        const emitDecision = useEmit<ModeChangeDecisionEvent>(
          MapModeEvents.changeDecision,
        );

        useOn<ModeChangeAuthorizationEvent>(
          MapModeEvents.changeAuthorization,
          (event) => {
            onAuthRequest(event);
            // MeasuringTool auto-approves all requests
            emitDecision({
              authId: event.payload.authId,
              approved: true,
              owner: 'MeasuringTool',
              mapInstanceId: event.payload.mapInstanceId,
            });
          },
        );

        return (
          <div>
            <span data-testid='mode'>{mode}</span>
            <button
              type='button'
              onClick={() => requestModeChange('measuring', 'MeasuringTool')}
              data-testid='to-measuring'
            >
              Measuring
            </button>
            <button
              type='button'
              onClick={() => requestModeChange('default', 'MultiSelectLasso')}
              data-testid='multi-select-to-default'
            >
              MultiSelect to Default
            </button>
            <button
              type='button'
              onClick={() => requestModeChange('drawing', 'Shapes')}
              data-testid='to-drawing'
            >
              Shapes to Drawing
            </button>
          </div>
        );
      }

      render(
        <MapIdProvider>
          <TestComponent />
        </MapIdProvider>,
      );

      // MeasuringTool switches to measuring mode
      await user.click(screen.getByTestId('to-measuring'));
      await waitFor(() => {
        expect(screen.getByTestId('mode')).toHaveTextContent('measuring');
      });

      // MultiSelectLasso requests default (requires auth from MeasuringTool)
      await user.click(screen.getByTestId('multi-select-to-default'));
      await waitFor(() => {
        expect(screen.getByTestId('mode')).toHaveTextContent('default');
      });
      expect(onAuthRequest).toHaveBeenCalledTimes(1);

      // NOW: Shapes should be able to switch to drawing from default WITHOUT auth
      // This was failing before because default mode was incorrectly assigned MultiSelectLasso as owner
      await user.click(screen.getByTestId('to-drawing'));
      await waitFor(() => {
        expect(screen.getByTestId('mode')).toHaveTextContent('drawing');
      });

      // Should still only have 1 auth request (the one for default)
      expect(onAuthRequest).toHaveBeenCalledTimes(1);
    });
  });
});
