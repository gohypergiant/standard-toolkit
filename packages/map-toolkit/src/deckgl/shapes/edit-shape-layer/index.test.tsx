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
import type { Shape } from '../shared/types';

// Track hotkey lifecycle calls
type MockFn = ReturnType<typeof vi.fn<(...args: unknown[]) => unknown>>;
let mockBind: MockFn;
let mockUnbind: MockFn;
let mockRegisterHotkey: MockFn;
let mockUnregisterHotkey: MockFn;

// Track icon-config calls
const mockGetIconConfig = vi.fn();
const mockGetIconLayerProps = vi.fn();

vi.mock('@accelint/hotkey-manager', () => ({
  globalBind: vi.fn(),
  Keycode: { Enter: 'Enter', Space: 'Space' },
  registerHotkey: (...args: unknown[]) => mockRegisterHotkey(...args),
  unregisterHotkey: (...args: unknown[]) => mockUnregisterHotkey(...args),
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
      config: {},
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

    it('should register and bind hotkeys on mount', () => {
      const { unmount } = render(<EditShapeLayer mapId={mapId} />);

      expect(mockRegisterHotkey).toHaveBeenCalledWith(
        expect.objectContaining({
          id: `saveEditHotkey-${mapId}`,
          key: { code: 'Enter' },
        }),
      );
      expect(mockRegisterHotkey).toHaveBeenCalledWith(
        expect.objectContaining({
          id: `editPanningHotkey-${mapId}`,
          key: { code: 'Space' },
        }),
      );
      expect(mockBind).toHaveBeenCalled();

      unmount();
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

  describe('icon-point editing', () => {
    it('should call getIconConfig with the editing shape feature', () => {
      const shape = createTestShape({
        atlas: TEST_ATLAS,
        mapping: TEST_MAPPING,
        name: 'marker',
        size: 32,
      });

      editStore.set(mapId, {
        editingShape: shape,
        editMode: 'point-translate',
        featureBeingEdited: null,
        previousMode: null,
      });

      const { unmount } = render(<EditShapeLayer mapId={mapId} />);

      expect(mockGetIconConfig).toHaveBeenCalledWith([shape.feature]);

      unmount();
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

      editStore.set(mapId, {
        editingShape: shape,
        editMode: 'point-translate',
        featureBeingEdited: null,
        previousMode: null,
      });

      const { unmount } = render(<EditShapeLayer mapId={mapId} />);

      expect(mockGetIconLayerProps).toHaveBeenCalledWith(
        true,
        TEST_ATLAS,
        TEST_MAPPING,
      );

      unmount();
    });

    it('should not call getIconLayerProps when no icons are detected', () => {
      const shape = createTestShape();

      mockGetIconConfig.mockReturnValue({ hasIcons: false });

      editStore.set(mapId, {
        editingShape: shape,
        editMode: 'point-translate',
        featureBeingEdited: null,
        previousMode: null,
      });

      const { unmount } = render(<EditShapeLayer mapId={mapId} />);

      expect(mockGetIconLayerProps).not.toHaveBeenCalled();

      unmount();
    });
  });
});
