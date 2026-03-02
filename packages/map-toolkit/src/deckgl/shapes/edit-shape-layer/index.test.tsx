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
import { render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { clearEditingState } from './store';
import type { UniqueId } from '@accelint/core';

// Track hotkey lifecycle calls
type MockFn = ReturnType<typeof vi.fn<(...args: unknown[]) => unknown>>;
let mockBind: MockFn;
let mockUnbind: MockFn;
let mockRegisterHotkey: MockFn;
let mockUnregisterHotkey: MockFn;

vi.mock('@accelint/hotkey-manager', () => ({
  globalBind: vi.fn(),
  Keycode: { Enter: 'Enter' },
  registerHotkey: (...args: unknown[]) => mockRegisterHotkey(...args),
  unregisterHotkey: (...args: unknown[]) => mockUnregisterHotkey(...args),
}));

vi.mock('../shared/hooks/use-shift-zoom-disable', () => ({
  useShiftZoomDisable: vi.fn(),
}));

// Import after mocks are set up
const { EditShapeLayer } = await import('./index');

describe('EditShapeLayer', () => {
  let mapId: UniqueId;

  beforeEach(() => {
    mapId = uuid();

    mockUnbind = vi.fn();
    mockBind = vi.fn(() => mockUnbind);
    mockRegisterHotkey = vi.fn(() => ({
      id: 'test-hotkey',
      config: {},
      bind: mockBind,
      forceBind: vi.fn(),
      forceUnbind: vi.fn(),
      isBound: false,
    }));
    mockUnregisterHotkey = vi.fn();
  });

  afterEach(() => {
    clearEditingState(mapId);
  });

  describe('hotkey lifecycle', () => {
    it('should throw when mapId is not provided and no MapProvider exists', () => {
      const spy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);

      expect(() => {
        render(<EditShapeLayer />);
      }).toThrow(
        'EditShapeLayer requires either a mapId prop or to be used within a MapProvider',
      );

      spy.mockRestore();
    });

    it('should throw when mapId is not provided and no MapProvider exists', () => {
      const spy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);

      expect(() => {
        render(<EditShapeLayer />);
      }).toThrow(
        'EditShapeLayer requires either a mapId prop or to be used within a MapProvider',
      );

      spy.mockRestore();
    });
    it('registers and binds the save hotkey on mount', () => {
      const { unmount } = render(<EditShapeLayer mapId={mapId} />);

      expect(mockRegisterHotkey).toHaveBeenCalledTimes(2);
      expect(mockRegisterHotkey).toHaveBeenCalledWith(
        expect.objectContaining({
          id: `saveEditHotkey-${mapId}`,
          key: { code: 'Enter' },
        }),
      );
      expect(mockBind).toHaveBeenCalledTimes(2);

      unmount();
    });

    it('unbinds and unregisters the save hotkey on unmount', () => {
      const { unmount } = render(<EditShapeLayer mapId={mapId} />);

      unmount();

      expect(mockUnbind).toHaveBeenCalledTimes(2);
      expect(mockUnregisterHotkey).toHaveBeenCalledTimes(2);
      expect(mockUnregisterHotkey).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'test-hotkey' }),
      );
    });

    it('does not throw when remounting after unmount', () => {
      const { unmount } = render(<EditShapeLayer mapId={mapId} />);
      unmount();

      // Remount should register a fresh hotkey without error
      const { unmount: unmount2 } = render(<EditShapeLayer mapId={mapId} />);

      expect(mockRegisterHotkey).toHaveBeenCalledTimes(4);
      expect(mockBind).toHaveBeenCalledTimes(4);

      unmount2();

      expect(mockUnbind).toHaveBeenCalledTimes(4);
      expect(mockUnregisterHotkey).toHaveBeenCalledTimes(4);
    });
  });
});
