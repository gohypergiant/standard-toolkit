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

import { Broadcast } from '@accelint/bus';
import { uuid } from '@accelint/core';
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MapEvents } from '@/deckgl/base-map/events';
import { useShiftZoomDisable } from './use-shift-zoom-disable';
import type { UniqueId } from '@accelint/core';

describe('useShiftZoomDisable', () => {
  let mapId: UniqueId;
  let bus: ReturnType<typeof Broadcast.getInstance>;
  let disableZoomSpy: ReturnType<typeof vi.fn>;
  let enableZoomSpy: ReturnType<typeof vi.fn>;
  let cleanupDisable: () => void;
  let cleanupEnable: () => void;

  beforeEach(() => {
    mapId = uuid();
    bus = Broadcast.getInstance();
    disableZoomSpy = vi.fn();
    enableZoomSpy = vi.fn();
    cleanupDisable = bus.on(MapEvents.disableZoom, disableZoomSpy);
    cleanupEnable = bus.on(MapEvents.enableZoom, enableZoomSpy);
  });

  afterEach(() => {
    cleanupDisable();
    cleanupEnable();
  });

  /** Dispatch a KeyboardEvent on `document`. */
  function pressKey(type: 'keydown' | 'keyup', key: string) {
    document.dispatchEvent(new KeyboardEvent(type, { key }));
  }

  /** Dispatch a MouseEvent on `document` with optional shiftKey. */
  function mouseDown(shiftKey = false) {
    document.dispatchEvent(new MouseEvent('mousedown', { shiftKey }));
  }

  describe('when active', () => {
    it('should emit disableZoom on Shift keydown', () => {
      renderHook(() => useShiftZoomDisable(mapId, true));

      act(() => {
        pressKey('keydown', 'Shift');
      });

      expect(disableZoomSpy).toHaveBeenCalledOnce();
      expect(disableZoomSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: { id: mapId },
        }),
      );
    });

    it('should emit enableZoom on Shift keyup after disabling', () => {
      renderHook(() => useShiftZoomDisable(mapId, true));

      act(() => {
        pressKey('keydown', 'Shift');
        pressKey('keyup', 'Shift');
      });

      expect(enableZoomSpy).toHaveBeenCalledOnce();
      expect(enableZoomSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: { id: mapId },
        }),
      );
    });

    it('should not emit disableZoom more than once for repeated Shift keydowns', () => {
      renderHook(() => useShiftZoomDisable(mapId, true));

      act(() => {
        pressKey('keydown', 'Shift');
        pressKey('keydown', 'Shift');
        pressKey('keydown', 'Shift');
      });

      expect(disableZoomSpy).toHaveBeenCalledOnce();
    });

    it('should not emit enableZoom on Shift keyup without prior disable', () => {
      renderHook(() => useShiftZoomDisable(mapId, true));

      act(() => {
        pressKey('keyup', 'Shift');
      });

      expect(enableZoomSpy).not.toHaveBeenCalled();
    });

    it('should ignore non-Shift keydown events', () => {
      renderHook(() => useShiftZoomDisable(mapId, true));

      act(() => {
        pressKey('keydown', 'Control');
        pressKey('keydown', 'Alt');
        pressKey('keydown', 'a');
      });

      expect(disableZoomSpy).not.toHaveBeenCalled();
    });

    it('should ignore non-Shift keyup events', () => {
      renderHook(() => useShiftZoomDisable(mapId, true));

      act(() => {
        pressKey('keydown', 'Shift');
        pressKey('keyup', 'Control');
      });

      // disableZoom was called, but enableZoom should not have been
      expect(disableZoomSpy).toHaveBeenCalledOnce();
      expect(enableZoomSpy).not.toHaveBeenCalled();
    });
  });

  describe('mousedown with shiftKey', () => {
    it('should emit disableZoom on mousedown with shiftKey held', () => {
      renderHook(() => useShiftZoomDisable(mapId, true));

      act(() => {
        mouseDown(true);
      });

      expect(disableZoomSpy).toHaveBeenCalledOnce();
      expect(disableZoomSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: { id: mapId },
        }),
      );
    });

    it('should not emit disableZoom on mousedown without shiftKey', () => {
      renderHook(() => useShiftZoomDisable(mapId, true));

      act(() => {
        mouseDown(false);
      });

      expect(disableZoomSpy).not.toHaveBeenCalled();
    });

    it('should not double-emit if Shift was already detected via keydown', () => {
      renderHook(() => useShiftZoomDisable(mapId, true));

      act(() => {
        pressKey('keydown', 'Shift');
        mouseDown(true);
      });

      expect(disableZoomSpy).toHaveBeenCalledOnce();
    });
  });

  describe('window blur', () => {
    it('should emit enableZoom when window loses focus while Shift is held', () => {
      renderHook(() => useShiftZoomDisable(mapId, true));

      act(() => {
        pressKey('keydown', 'Shift');
        window.dispatchEvent(new Event('blur'));
      });

      expect(enableZoomSpy).toHaveBeenCalledOnce();
    });

    it('should not emit enableZoom on blur if zoom is not disabled', () => {
      renderHook(() => useShiftZoomDisable(mapId, true));

      act(() => {
        window.dispatchEvent(new Event('blur'));
      });

      expect(enableZoomSpy).not.toHaveBeenCalled();
    });
  });

  describe('cleanup on unmount', () => {
    it('should emit enableZoom on unmount if zoom was disabled', () => {
      const { unmount } = renderHook(() => useShiftZoomDisable(mapId, true));

      act(() => {
        pressKey('keydown', 'Shift');
      });

      expect(disableZoomSpy).toHaveBeenCalledOnce();

      act(() => {
        unmount();
      });

      expect(enableZoomSpy).toHaveBeenCalledOnce();
    });

    it('should not emit enableZoom on unmount if zoom was not disabled', () => {
      const { unmount } = renderHook(() => useShiftZoomDisable(mapId, true));

      act(() => {
        unmount();
      });

      expect(enableZoomSpy).not.toHaveBeenCalled();
    });

    it('should remove all document and window event listeners on unmount', () => {
      const addSpy = vi.spyOn(document, 'addEventListener');
      const removeSpy = vi.spyOn(document, 'removeEventListener');

      const { unmount } = renderHook(() => useShiftZoomDisable(mapId, true));

      const addedListenerTypes = addSpy.mock.calls.map(([type]) => type);

      act(() => {
        unmount();
      });

      const removedListenerTypes = removeSpy.mock.calls.map(([type]) => type);

      expect(addedListenerTypes).toContain('keydown');
      expect(addedListenerTypes).toContain('keyup');
      expect(addedListenerTypes).toContain('mousedown');
      expect(removedListenerTypes).toContain('keydown');
      expect(removedListenerTypes).toContain('keyup');
      expect(removedListenerTypes).toContain('mousedown');

      addSpy.mockRestore();
      removeSpy.mockRestore();
    });
  });

  describe('when not active', () => {
    it('should not register event listeners when isActive is false', () => {
      renderHook(() => useShiftZoomDisable(mapId, false));

      act(() => {
        pressKey('keydown', 'Shift');
      });

      expect(disableZoomSpy).not.toHaveBeenCalled();
    });

    it('should remove listeners and re-enable zoom when isActive changes to false', () => {
      const { rerender } = renderHook(
        ({ active }) => useShiftZoomDisable(mapId, active),
        { initialProps: { active: true } },
      );

      act(() => {
        pressKey('keydown', 'Shift');
      });

      expect(disableZoomSpy).toHaveBeenCalledOnce();

      // Switch to inactive — cleanup runs, emitting enableZoom
      act(() => {
        rerender({ active: false });
      });

      expect(enableZoomSpy).toHaveBeenCalledOnce();

      // Further Shift presses should not emit
      act(() => {
        pressKey('keydown', 'Shift');
      });

      expect(disableZoomSpy).toHaveBeenCalledOnce(); // still 1
    });
  });
});
