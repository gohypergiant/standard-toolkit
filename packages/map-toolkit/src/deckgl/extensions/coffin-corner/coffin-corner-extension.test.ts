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

import { IconLayer } from '@deck.gl/layers';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CoffinCornerExtension } from './coffin-corner-extension';
import type { Rgba255Tuple } from '@accelint/predicates';
import type { EntityId } from './types';

/**
 * Creates mock UpdateParameters with only the props/oldProps the extension reads.
 */
function createMockParams(
  props: Record<string, unknown>,
  oldProps: Record<string, unknown>,
) {
  // biome-ignore lint/suspicious/noExplicitAny: Mock params only implements the subset of UpdateParameters the extension uses.
  return { props, oldProps } as any;
}

/**
 * Creates a mock deck.gl layer object that satisfies the `this` binding
 * required by CoffinCornerExtension lifecycle methods.
 *
 * Uses a type assertion to avoid needing the full 70+ property Layer interface
 * while still providing the properties the extension actually accesses.
 */
function createMockLayer(propsOverrides: Record<string, unknown> = {}) {
  const invalidate = vi.fn();
  const addInstanced = vi.fn();

  // Use Object.create so the mock passes `instanceof IconLayer` checks
  // in the extension's lifecycle guards.
  // biome-ignore lint/suspicious/noExplicitAny: Mock layer only implements the subset of Layer the extension uses.
  const layer = Object.create(IconLayer.prototype) as any;
  Object.assign(layer, {
    state: {
      selectedEntities: new Map<EntityId, number>(),
      hoveredEntities: new Map<EntityId, number>(),
    },
    props: propsOverrides,
    getAttributeManager: vi.fn(() => ({ invalidate, addInstanced })),
    setShaderModuleProps: vi.fn(),
    invalidate,
    addInstanced,
  });
  return layer;
}

describe('CoffinCornerExtension', () => {
  let extension: CoffinCornerExtension;

  beforeEach(() => {
    extension = new CoffinCornerExtension();
  });

  describe('initializeState', () => {
    it('should initialize empty entity state maps', () => {
      const layer = createMockLayer();

      extension.initializeState.call(layer);

      expect(layer.state.selectedEntities).toBeInstanceOf(Map);
      expect(layer.state.hoveredEntities).toBeInstanceOf(Map);
      expect(layer.state.selectedEntities.size).toBe(0);
      expect(layer.state.hoveredEntities.size).toBe(0);
    });

    it('should register two instanced GPU attributes', () => {
      const layer = createMockLayer();

      extension.initializeState.call(layer);

      expect(layer.addInstanced).toHaveBeenCalledWith(
        expect.objectContaining({
          instanceSelectedEntity: expect.objectContaining({ size: 1 }),
          instanceHoveredEntity: expect.objectContaining({ size: 1 }),
        }),
      );
    });

    it('should handle null attributeManager gracefully', () => {
      const layer = createMockLayer();
      layer.getAttributeManager = vi.fn(() => null);

      extension.initializeState.call(layer);

      expect(layer.state.selectedEntities).toBeInstanceOf(Map);
      expect(layer.state.hoveredEntities).toBeInstanceOf(Map);
    });

    it('should write 1.0 for selected entities in the attribute update callback', () => {
      const layer = createMockLayer();
      extension.initializeState.call(layer);

      layer.state.selectedEntities.set('entity-a', 1);

      const addInstancedCall = layer.addInstanced.mock.calls[0][0];
      const updateFn = addInstancedCall.instanceSelectedEntity.update;

      const attribute = { value: new Float32Array(3) };
      const data = [{ id: 'entity-a' }, { id: 'entity-b' }, { id: 'entity-c' }];
      updateFn(attribute, { data });

      expect(attribute.value[0]).toBe(1);
      expect(attribute.value[1]).toBe(0);
      expect(attribute.value[2]).toBe(0);
    });

    it('should use custom getEntityId accessor from props', () => {
      const layer = createMockLayer({
        getEntityId: (d: { uid: string }) => d.uid,
      });
      extension.initializeState.call(layer);

      layer.state.hoveredEntities.set('custom-1', 1);

      const addInstancedCall = layer.addInstanced.mock.calls[0][0];
      const updateFn = addInstancedCall.instanceHoveredEntity.update;

      const attribute = { value: new Float32Array(2) };
      const data = [{ uid: 'custom-1' }, { uid: 'custom-2' }];
      updateFn(attribute, { data });

      expect(attribute.value[0]).toBe(1);
      expect(attribute.value[1]).toBe(0);
    });

    it('should default to 0 for items not in the entity map', () => {
      const layer = createMockLayer();
      extension.initializeState.call(layer);

      const addInstancedCall = layer.addInstanced.mock.calls[0][0];
      const updateFn = addInstancedCall.instanceSelectedEntity.update;

      const attribute = { value: new Float32Array(2) };
      const data = [{ id: 'not-selected' }, { id: 'also-not-selected' }];
      updateFn(attribute, { data });

      expect(attribute.value[0]).toBe(0);
      expect(attribute.value[1]).toBe(0);
    });

    it('should handle undefined data gracefully', () => {
      const layer = createMockLayer();
      extension.initializeState.call(layer);

      const addInstancedCall = layer.addInstanced.mock.calls[0][0];
      const updateFn = addInstancedCall.instanceSelectedEntity.update;

      const attribute = { value: new Float32Array(0) };

      expect(() => updateFn(attribute, { data: undefined })).not.toThrow();
    });
  });

  describe('updateState', () => {
    it('should sync selectedEntityIds Set to entity map', () => {
      const layer = createMockLayer();
      const ids = new Set<EntityId>(['a', 'b', 'c']);

      extension.updateState.call(
        layer,
        createMockParams(
          { selectedEntityIds: ids },
          { selectedEntityIds: undefined },
        ),
      );

      expect(layer.state.selectedEntities.size).toBe(3);
      expect(layer.state.selectedEntities.get('a')).toBe(1);
      expect(layer.state.selectedEntities.get('b')).toBe(1);
      expect(layer.state.selectedEntities.get('c')).toBe(1);
      expect(layer.invalidate).toHaveBeenCalledWith('instanceSelectedEntity');
    });

    it('should replace entity map contents when selectedEntityIds changes', () => {
      const layer = createMockLayer();
      const idsV1 = new Set<EntityId>(['a', 'b']);
      const idsV2 = new Set<EntityId>(['b', 'c']);

      extension.updateState.call(
        layer,
        createMockParams(
          { selectedEntityIds: idsV1 },
          { selectedEntityIds: undefined },
        ),
      );

      extension.updateState.call(
        layer,
        createMockParams(
          { selectedEntityIds: idsV2 },
          { selectedEntityIds: idsV1 },
        ),
      );

      expect(layer.state.selectedEntities.size).toBe(2);
      expect(layer.state.selectedEntities.has('a')).toBe(false);
      expect(layer.state.selectedEntities.get('b')).toBe(1);
      expect(layer.state.selectedEntities.get('c')).toBe(1);
    });

    it('should clear entity map when selectedEntityIds is an empty Set', () => {
      const layer = createMockLayer();
      layer.state.selectedEntities.set('a', 1);
      layer.state.selectedEntities.set('b', 1);

      const emptySet = new Set<EntityId>();

      extension.updateState.call(
        layer,
        createMockParams(
          { selectedEntityIds: emptySet },
          { selectedEntityIds: undefined },
        ),
      );

      expect(layer.state.selectedEntities.size).toBe(0);
      expect(layer.invalidate).toHaveBeenCalledWith('instanceSelectedEntity');
    });

    it('should not invalidate when selectedEntityIds is same reference', () => {
      const layer = createMockLayer();
      const ids = new Set<EntityId>(['a']);

      extension.updateState.call(
        layer,
        createMockParams(
          { selectedEntityIds: ids },
          { selectedEntityIds: ids },
        ),
      );

      expect(layer.invalidate).not.toHaveBeenCalled();
    });

    it('should sync hoveredEntityIds Set to entity map', () => {
      const layer = createMockLayer();
      const ids = new Set<EntityId>(['a', 'b']);

      extension.updateState.call(
        layer,
        createMockParams(
          { hoveredEntityIds: ids },
          { hoveredEntityIds: undefined },
        ),
      );

      expect(layer.state.hoveredEntities.size).toBe(2);
      expect(layer.state.hoveredEntities.get('a')).toBe(1);
      expect(layer.state.hoveredEntities.get('b')).toBe(1);
      expect(layer.invalidate).toHaveBeenCalledWith('instanceHoveredEntity');
    });
  });

  describe('draw', () => {
    it('should normalize RGBA 255 values to 0-1 for shader uniform', () => {
      const selectedCoffinCornerColor: Rgba255Tuple = [255, 128, 0, 255];
      const layer = createMockLayer({ selectedCoffinCornerColor });

      extension.draw.call(layer);

      expect(layer.setShaderModuleProps).toHaveBeenCalledWith({
        coffinCorner: {
          highlightColor: [1, 128 / 255, 0, 1],
        },
      });
    });

    it('should use default color when selectedCoffinCornerColor is undefined', () => {
      const layer = createMockLayer({ selectedCoffinCornerColor: undefined });

      extension.draw.call(layer);

      // Default: [57, 183, 250, 255] → normalized
      expect(layer.setShaderModuleProps).toHaveBeenCalledWith({
        coffinCorner: {
          highlightColor: [57 / 255, 183 / 255, 250 / 255, 1],
        },
      });
    });

    it('should pass alpha channel to shader', () => {
      const selectedCoffinCornerColor: Rgba255Tuple = [100, 100, 100, 127];
      const layer = createMockLayer({ selectedCoffinCornerColor });

      extension.draw.call(layer);

      expect(layer.setShaderModuleProps).toHaveBeenCalledWith({
        coffinCorner: {
          highlightColor: [100 / 255, 100 / 255, 100 / 255, 127 / 255],
        },
      });
    });
  });

  describe('getShaders', () => {
    it('should return shader config with modules and inject keys', () => {
      const layer = createMockLayer();

      const shaders = extension.getShaders.call(layer, extension);

      expect(shaders?.modules).toHaveLength(1);
      expect(shaders?.modules[0]?.name).toBe('coffinCorner');
      expect(Object.keys(shaders?.inject)).toEqual(
        expect.arrayContaining([
          'vs:#decl',
          'vs:#main-end',
          'fs:#decl',
          'fs:#main-start',
        ]),
      );
    });

    it('should return null for unsupported layer types', () => {
      // biome-ignore lint/suspicious/noExplicitAny: Mock only needs to fail instanceof checks.
      const layer = Object.create(Object.prototype) as any;

      const shaders = extension.getShaders.call(layer, extension);

      expect(shaders).toBeNull();
    });

    it('exposes an overridable icon base-color hook guarded by a define', () => {
      // IconLayer subclasses that re-color the sampled texel override
      // `coffinCorner_iconBaseColor`; the `#ifndef` guard lets them suppress the
      // default. This contract is part of the extension's public surface, so the
      // hook name, guard macro, and the default texture sample must all be present.
      const layer = createMockLayer();

      const shaders = extension.getShaders.call(layer, extension);
      const fsDecl = shaders?.inject['fs:#decl'] ?? '';

      expect(fsDecl).toContain('coffinCorner_iconBaseColor');
      expect(fsDecl).toContain('COFFIN_CORNER_HAS_CUSTOM_ICON_BASE_COLOR');
      expect(fsDecl).toContain('texture(iconsTexture, textureCoords)');
      expect(shaders?.inject['fs:#main-start']).toContain(
        'coffinCorner_iconBaseColor(vTextureCoords)',
      );
    });
  });

  describe('unsupported layer guards', () => {
    it('should not initialize state on unsupported layer types', () => {
      // biome-ignore lint/suspicious/noExplicitAny: Mock only needs to fail instanceof checks.
      const layer = Object.create(Object.prototype) as any;
      layer.state = {};
      layer.getAttributeManager = vi.fn();

      extension.initializeState.call(layer);

      expect(layer.state.selectedEntities).toBeUndefined();
      expect(layer.getAttributeManager).not.toHaveBeenCalled();
    });

    it('should not update state on unsupported layer types', () => {
      // biome-ignore lint/suspicious/noExplicitAny: Mock only needs to fail instanceof checks.
      const layer = Object.create(Object.prototype) as any;
      layer.state = {
        selectedEntities: new Map(),
        hoveredEntities: new Map(),
      };
      layer.getAttributeManager = vi.fn();

      extension.updateState.call(
        layer,
        createMockParams(
          { selectedEntityIds: new Set(['entity-1']) },
          { selectedEntityIds: undefined },
        ),
      );

      expect(layer.state.selectedEntities.size).toBe(0);
      expect(layer.getAttributeManager).not.toHaveBeenCalled();
    });

    it('should not set shader module props on unsupported layer types', () => {
      // biome-ignore lint/suspicious/noExplicitAny: Mock only needs to fail instanceof checks.
      const layer = Object.create(Object.prototype) as any;
      layer.props = {};
      layer.setShaderModuleProps = vi.fn();

      extension.draw.call(layer);

      expect(layer.setShaderModuleProps).not.toHaveBeenCalled();
    });
  });
});
