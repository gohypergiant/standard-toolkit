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

import { beforeEach, describe, expect, it, vi } from 'vitest';
import CoffinCornersExtension from './coffin-corners-extension';
import type { Rgba255Tuple } from '@accelint/predicates';
import type { EntityId } from './types';

/**
 * Creates a mock deck.gl layer object that satisfies the `this` binding
 * required by CoffinCornersExtension lifecycle methods.
 */
function createMockLayer(propsOverrides: Record<string, unknown> = {}) {
  const invalidate = vi.fn();

  return {
    state: {
      selectedEntities: new Map<EntityId, number>(),
      hoveredEntities: new Map<EntityId, number>(),
    },
    props: propsOverrides,
    getAttributeManager: vi.fn(() => ({ invalidate })),
    setShaderModuleProps: vi.fn(),
    invalidate,
  };
}

describe('CoffinCornersExtension', () => {
  let extension: CoffinCornersExtension;

  beforeEach(() => {
    extension = new CoffinCornersExtension();
  });

  describe('updateState', () => {
    it('should set selectedEntityId=1 in Map and invalidate attribute', () => {
      const layer = createMockLayer();
      const params = {
        props: { selectedEntityId: 'entity-1' },
        oldProps: { selectedEntityId: undefined },
      };

      extension.updateState.call(layer, params);

      expect(layer.state.selectedEntities.get('entity-1')).toBe(1);
      expect(layer.invalidate).toHaveBeenCalledWith('instanceSelectedEntity');
    });

    it('should clear old selectedEntityId when changed', () => {
      const layer = createMockLayer();
      layer.state.selectedEntities.set('entity-1', 1);
      const params = {
        props: { selectedEntityId: 'entity-2' },
        oldProps: { selectedEntityId: 'entity-1' },
      };

      extension.updateState.call(layer, params);

      expect(layer.state.selectedEntities.get('entity-1')).toBe(0);
      expect(layer.state.selectedEntities.get('entity-2')).toBe(1);
      expect(layer.invalidate).toHaveBeenCalledWith('instanceSelectedEntity');
    });

    it('should not invalidate when selectedEntityId is unchanged', () => {
      const layer = createMockLayer();
      const params = {
        props: { selectedEntityId: 'entity-1' },
        oldProps: { selectedEntityId: 'entity-1' },
      };

      extension.updateState.call(layer, params);

      expect(layer.invalidate).not.toHaveBeenCalledWith(
        'instanceSelectedEntity',
      );
    });

    it('should set hoveredEntityId=1 in Map and invalidate attribute', () => {
      const layer = createMockLayer();
      const params = {
        props: { hoveredEntityId: 42 },
        oldProps: { hoveredEntityId: undefined },
      };

      extension.updateState.call(layer, params);

      expect(layer.state.hoveredEntities.get(42)).toBe(1);
      expect(layer.invalidate).toHaveBeenCalledWith('instanceHoveredEntity');
    });

    it('should clear old hoveredEntityId when changed', () => {
      const layer = createMockLayer();
      layer.state.hoveredEntities.set(42, 1);
      const params = {
        props: { hoveredEntityId: 99 },
        oldProps: { hoveredEntityId: 42 },
      };

      extension.updateState.call(layer, params);

      expect(layer.state.hoveredEntities.get(42)).toBe(0);
      expect(layer.state.hoveredEntities.get(99)).toBe(1);
      expect(layer.invalidate).toHaveBeenCalledWith('instanceHoveredEntity');
    });

    it('should not invalidate when hoveredEntityId is unchanged', () => {
      const layer = createMockLayer();
      const params = {
        props: { hoveredEntityId: 42 },
        oldProps: { hoveredEntityId: 42 },
      };

      extension.updateState.call(layer, params);

      expect(layer.invalidate).not.toHaveBeenCalledWith(
        'instanceHoveredEntity',
      );
    });

    it('should handle both selection and hover changing simultaneously', () => {
      const layer = createMockLayer();
      const params = {
        props: { selectedEntityId: 'sel-1', hoveredEntityId: 'hov-1' },
        oldProps: {
          selectedEntityId: undefined,
          hoveredEntityId: undefined,
        },
      };

      extension.updateState.call(layer, params);

      expect(layer.state.selectedEntities.get('sel-1')).toBe(1);
      expect(layer.state.hoveredEntities.get('hov-1')).toBe(1);
      expect(layer.invalidate).toHaveBeenCalledWith('instanceSelectedEntity');
      expect(layer.invalidate).toHaveBeenCalledWith('instanceHoveredEntity');
    });

    it('should handle entity ID of 0 (falsy but valid)', () => {
      const layer = createMockLayer();
      const params = {
        props: { selectedEntityId: 0 },
        oldProps: { selectedEntityId: undefined },
      };

      extension.updateState.call(layer, params);

      expect(layer.state.selectedEntities.get(0)).toBe(1);
      expect(layer.invalidate).toHaveBeenCalledWith('instanceSelectedEntity');
    });

    it('should clear entity ID of 0 when changed', () => {
      const layer = createMockLayer();
      layer.state.selectedEntities.set(0, 1);
      const params = {
        props: { selectedEntityId: 'new-id' },
        oldProps: { selectedEntityId: 0 },
      };

      extension.updateState.call(layer, params);

      expect(layer.state.selectedEntities.get(0)).toBe(0);
      expect(layer.state.selectedEntities.get('new-id')).toBe(1);
    });

    it('should handle null attributeManager gracefully', () => {
      const layer = createMockLayer();
      layer.getAttributeManager = vi.fn(() => null);
      const params = {
        props: { selectedEntityId: 'entity-1' },
        oldProps: { selectedEntityId: undefined },
      };

      extension.updateState.call(layer, params);

      expect(layer.state.selectedEntities.get('entity-1')).toBe(1);
    });
  });

  describe('draw', () => {
    it('should normalize RGBA 255 values to 0-1 for shader uniform', () => {
      const coffinCornerColor: Rgba255Tuple = [255, 128, 0, 255];
      const layer = createMockLayer({ coffinCornerColor });

      extension.draw.call(layer);

      expect(layer.setShaderModuleProps).toHaveBeenCalledWith({
        coffinCorners: {
          highlightColor: [1, 128 / 255, 0, 1],
        },
      });
    });

    it('should use default color when coffinCornerColor is undefined', () => {
      const layer = createMockLayer({ coffinCornerColor: undefined });

      extension.draw.call(layer);

      // Default: [57, 183, 250, 255] → normalized
      expect(layer.setShaderModuleProps).toHaveBeenCalledWith({
        coffinCorners: {
          highlightColor: [57 / 255, 183 / 255, 250 / 255, 1],
        },
      });
    });

    it('should pass alpha channel to shader', () => {
      const coffinCornerColor: Rgba255Tuple = [100, 100, 100, 127];
      const layer = createMockLayer({ coffinCornerColor });

      extension.draw.call(layer);

      expect(layer.setShaderModuleProps).toHaveBeenCalledWith({
        coffinCorners: {
          highlightColor: [100 / 255, 100 / 255, 100 / 255, 127 / 255],
        },
      });
    });
  });
});
