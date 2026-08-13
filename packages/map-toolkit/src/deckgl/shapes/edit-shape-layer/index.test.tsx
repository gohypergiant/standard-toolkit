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
import { clearEditingState, editStore } from './store';
import type { UniqueId } from '@accelint/core';
import type {
  HotkeyConfig,
  HotkeyManager,
  HotkeyOptions,
} from '@accelint/hotkey-manager';
import type { Mock } from 'vitest';
import type { Shape } from '../shared/types';
import type { EditingState } from './types';

// Typed mocks so `mock.calls` carries the real argument shape and consumers
// (e.g. findOnKeyUp) can read `.id` and `.onKeyUp` without casts.
let mockBind: Mock<() => () => void>;
let mockUnbind: Mock<() => void>;
let mockRegisterHotkey: Mock<(options: HotkeyOptions) => HotkeyManager>;
let mockUnregisterHotkey: Mock<(manager: HotkeyManager) => void>;

// Track icon-config calls
const mockGetIconConfig = vi.fn();
const mockGetIconLayerProps = vi.fn();

vi.mock('@accelint/hotkey-manager', () => ({
  globalBind: vi.fn(),
  Keycode: { Enter: 'Enter', Escape: 'Escape', Space: 'Space' },
  registerHotkey: (options: HotkeyOptions) => mockRegisterHotkey(options),
  unregisterHotkey: (manager: HotkeyManager) => mockUnregisterHotkey(manager),
}));

vi.mock('../shared/hooks/use-shift-zoom-disable', () => ({
  useShiftZoomDisable: vi.fn(),
}));

vi.mock('../display-shape-layer/utils/icon-config', () => ({
  getIconConfig: (...args: unknown[]) => mockGetIconConfig(...args),
  getIconLayerProps: (...args: unknown[]) => mockGetIconLayerProps(...args),
}));

// Import after mocks are set up
const { EditShapeLayer } = await import('./index');

/** Seed the edit store with a minimal active-editing state for `mapId`. */
function startEditing(
  mapId: UniqueId,
  shape: Shape,
  overrides: Partial<EditingState> = {},
) {
  editStore.set(mapId, {
    editingShape: shape,
    editMode: 'point-translate',
    featureBeingEdited: null,
    previousMode: null,
    ...overrides,
  });
}

/** Create a minimal shape for testing */
function createTestShape(
  icon?: Shape['feature']['properties']['styleProperties']['icon'],
): Shape {
  return {
    id: uuid(),
    name: 'Test Shape',
    label: 'Test',
    shape: 'Point',
    lastUpdated: Date.now(),
    feature: {
      type: 'Feature',
      properties: {
        styleProperties: {
          fillColor: [255, 255, 255, 255],
          lineColor: [136, 138, 143, 255],
          lineWidth: 2,
          linePattern: 'solid',
          ...(icon ? { icon } : {}),
        },
        shapeId: uuid(),
      },
      geometry: { type: 'Point', coordinates: [0, 0] },
    } as Shape['feature'],
  };
}

const TEST_ATLAS = 'https://example.com/atlas.png';
const TEST_MAPPING = {
  marker: { x: 0, y: 0, width: 32, height: 32, mask: true },
};

describe('EditShapeLayer', () => {
  let mapId: UniqueId;

  beforeEach(() => {
    mapId = uuid();

    mockUnbind = vi.fn();
    mockBind = vi.fn(() => mockUnbind);
    mockRegisterHotkey = vi.fn(() => ({
      id: 'test-hotkey',
      // Tests never read `config`; the real shape has required fields we don't care about.
      config: {} as HotkeyConfig,
      bind: mockBind,
      forceBind: vi.fn(),
      forceUnbind: vi.fn(),
      isBound: false,
    }));
    mockUnregisterHotkey = vi.fn();

    // Default: no icons
    mockGetIconConfig.mockReturnValue({ hasIcons: false });
    mockGetIconLayerProps.mockReturnValue({});
  });

  afterEach(() => {
    clearEditingState(mapId);
  });

  describe('hotkey lifecycle', () => {
    it('should throw when mapId is not provided and no MapProvider exists', () => {
      vi.spyOn(console, 'error').mockImplementation(() => undefined);

      expect(() => {
        render(<EditShapeLayer />);
      }).toThrow(
        'EditShapeLayer requires either a mapId prop or to be used within a MapProvider',
      );
    });

    it('should wire up the expected hotkeys on mount', () => {
      render(<EditShapeLayer mapId={mapId} />);

      expect(mockRegisterHotkey).toHaveBeenCalledWith(
        expect.objectContaining({
          id: `saveEditHotkey-${mapId}`,
          key: { code: 'Enter' },
        }),
      );
      expect(mockRegisterHotkey).toHaveBeenCalledWith(
        expect.objectContaining({
          id: `cancelEditHotkey-${mapId}`,
          key: { code: 'Escape' },
        }),
      );
      expect(mockRegisterHotkey).toHaveBeenCalledWith(
        expect.objectContaining({
          id: `editPanningHotkey-${mapId}`,
          key: { code: 'Space' },
        }),
      );
      expect(mockBind).toHaveBeenCalled();
    });

    it('should unbind and unregister hotkeys on unmount', () => {
      const { unmount } = render(<EditShapeLayer mapId={mapId} />);

      unmount();

      expect(mockUnbind).toHaveBeenCalled();
      expect(mockUnregisterHotkey).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'test-hotkey' }),
      );
    });

    it('should not throw when remounting after unmount', () => {
      const { unmount } = render(<EditShapeLayer mapId={mapId} />);
      unmount();

      // Remount should register a fresh hotkey without error
      const { unmount: unmount2 } = render(<EditShapeLayer mapId={mapId} />);

      expect(mockRegisterHotkey).toHaveBeenCalled();
      expect(mockBind).toHaveBeenCalled();

      unmount2();

      expect(mockUnbind).toHaveBeenCalled();
      expect(mockUnregisterHotkey).toHaveBeenCalled();
    });
  });

  describe('keyboard shortcuts', () => {
    /**
     * Grab the onKeyUp handler the component registered for `hotkeyId`.
     * Throws if the hotkey isn't registered so tests fail loudly at the
     * setup boundary rather than silently invoking `undefined?.()`.
     */
    function findOnKeyUp(hotkeyId: string): () => void {
      const match = mockRegisterHotkey.mock.calls.find(
        ([options]) => options.id === hotkeyId,
      );
      if (!match?.[0].onKeyUp) {
        throw new Error(
          `No onKeyUp handler registered for hotkey "${hotkeyId}"`,
        );
      }
      // The handler passed by useEditActionHotkey ignores event/key/hotkey
      // args; narrow HotkeyAction to () => void so tests can invoke it like
      // a synthetic key-up without fabricating a KeyboardEvent.
      return match[0].onKeyUp as () => void;
    }

    it('should save editing when Enter is released while a shape is being edited', () => {
      const shape = createTestShape();
      startEditing(mapId, shape, { featureBeingEdited: shape.feature });

      render(<EditShapeLayer mapId={mapId} />);

      findOnKeyUp(`saveEditHotkey-${mapId}`)();

      // Save clears editing state once the session completes.
      expect(editStore.get(mapId)?.editingShape).toBeNull();
    });

    it('should cancel editing when Escape is released while a shape is being edited', () => {
      const shape = createTestShape();
      startEditing(mapId, shape);

      render(<EditShapeLayer mapId={mapId} />);

      findOnKeyUp(`cancelEditHotkey-${mapId}`)();

      expect(editStore.get(mapId)?.editingShape).toBeNull();
    });

    it('should no-op on Escape when no shape is being edited', () => {
      render(<EditShapeLayer mapId={mapId} />);

      const onEscapeUp = findOnKeyUp(`cancelEditHotkey-${mapId}`);

      // Invoking with no active edit should not throw or populate the store.
      expect(() => onEscapeUp()).not.toThrow();
      const editingShape = editStore.get(mapId)?.editingShape ?? null;
      expect(editingShape).toBeNull();
    });
  });

  describe('icon-point editing', () => {
    it('should call getIconConfig with the editing shape feature', () => {
      const shape = createTestShape({
        atlas: TEST_ATLAS,
        mapping: TEST_MAPPING,
        name: 'marker',
        size: 32,
      });

      startEditing(mapId, shape);

      render(<EditShapeLayer mapId={mapId} />);

      expect(mockGetIconConfig).toHaveBeenCalledWith([shape.feature]);
    });

    it('should call getIconLayerProps when icons are detected', () => {
      const shape = createTestShape({
        atlas: TEST_ATLAS,
        mapping: TEST_MAPPING,
        name: 'marker',
        size: 32,
      });

      mockGetIconConfig.mockReturnValue({
        hasIcons: true,
        atlas: TEST_ATLAS,
        mapping: TEST_MAPPING,
      });
      mockGetIconLayerProps.mockReturnValue({
        iconAtlas: TEST_ATLAS,
        iconMapping: TEST_MAPPING,
      });

      startEditing(mapId, shape);

      render(<EditShapeLayer mapId={mapId} />);

      expect(mockGetIconLayerProps).toHaveBeenCalledWith(
        true,
        TEST_ATLAS,
        TEST_MAPPING,
      );
    });

    it('should not call getIconLayerProps when no icons are detected', () => {
      const shape = createTestShape();

      mockGetIconConfig.mockReturnValue({ hasIcons: false });

      startEditing(mapId, shape);

      render(<EditShapeLayer mapId={mapId} />);

      expect(mockGetIconLayerProps).not.toHaveBeenCalled();
    });
  });
});
