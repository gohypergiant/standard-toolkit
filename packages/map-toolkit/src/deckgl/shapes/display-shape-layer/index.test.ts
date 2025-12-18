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

import { Broadcast } from '@accelint/bus';
import { uuid } from '@accelint/core';
import { GeoJsonLayer, TextLayer } from '@deck.gl/layers';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SHAPE_LAYER_IDS } from '../shared/constants';
import {
  ShapeEvents,
  type ShapeHoveredEvent,
  type ShapeSelectedEvent,
} from '../shared/events';
import { DisplayShapeLayer } from './index';
import type { UniqueId } from '@accelint/core';
import type { Color } from '@deck.gl/core';
import type { EditableShape } from '../shared/types';

/**
 * Create a minimal mock shape for testing
 */
function createMockShape(overrides?: Partial<EditableShape>): EditableShape {
  const id = uuid();
  return {
    id,
    name: 'Test Shape',
    label: 'Test',
    locked: false,
    shapeType: 'Polygon',
    feature: {
      type: 'Feature',
      properties: {
        styleProperties: {
          fillColor: [98, 166, 255, 255] as Color,
          strokeColor: [98, 166, 255, 255] as Color,
          strokeWidth: 4,
          strokePattern: 'solid',
        },
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [0, 0],
            [1, 0],
            [1, 1],
            [0, 1],
            [0, 0],
          ],
        ],
      },
    },
    ...overrides,
  };
}

/**
 * Create a mock Point shape for testing
 */
function createMockPointShape(
  overrides?: Partial<EditableShape>,
): EditableShape {
  const id = uuid();
  return {
    id,
    name: 'Test Point',
    label: 'Point',
    locked: false,
    shapeType: 'Point',
    feature: {
      type: 'Feature',
      properties: {
        styleProperties: {
          fillColor: [98, 166, 255, 255] as Color,
          strokeColor: [98, 166, 255, 255] as Color,
          strokeWidth: 4,
          strokePattern: 'solid',
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [0, 0],
      },
    },
    ...overrides,
  };
}

/**
 * Initialize layer with proper deck.gl state
 * deck.gl requires state to be initialized before setState can be called
 */
function initializeLayerWithState(layer: DisplayShapeLayer): void {
  // Initialize the layer (this sets up internal deck.gl state)
  layer.initializeState({} as never);
  // Manually initialize state object that deck.gl needs for setState to work
  // biome-ignore lint/suspicious/noExplicitAny: accessing internal state for testing
  if (!(layer as any).state) {
    // biome-ignore lint/suspicious/noExplicitAny: accessing internal state for testing
    (layer as any).state = {};
  }
}

describe('DisplayShapeLayer', () => {
  let mapId: UniqueId;
  let shapeBus: ReturnType<typeof Broadcast.getInstance<ShapeSelectedEvent>>;

  beforeEach(() => {
    mapId = uuid();
    shapeBus = Broadcast.getInstance();
  });

  describe('renderLayers', () => {
    it('renders main layer and labels layer when showLabels is true', () => {
      const shapes = [createMockShape()];
      const layer = new DisplayShapeLayer({
        id: 'test-layer',
        mapId,
        data: shapes,
        showLabels: true,
      });

      initializeLayerWithState(layer);

      const sublayers = layer.renderLayers();

      // Should have 2 layers: main GeoJsonLayer + TextLayer (no highlight without selection)
      expect(sublayers.length).toBe(2);

      const mainLayer = sublayers.find(
        (l) => l.id === `test-layer-${SHAPE_LAYER_IDS.DISPLAY}`,
      );
      const labelLayer = sublayers.find(
        (l) => l.id === `test-layer-${SHAPE_LAYER_IDS.DISPLAY_LABELS}`,
      );

      expect(mainLayer).toBeInstanceOf(GeoJsonLayer);
      expect(labelLayer).toBeInstanceOf(TextLayer);
    });

    it('renders only main layer when showLabels is false', () => {
      const shapes = [createMockShape()];
      const layer = new DisplayShapeLayer({
        id: 'test-layer',
        mapId,
        data: shapes,
        showLabels: false,
      });

      initializeLayerWithState(layer);

      const sublayers = layer.renderLayers();

      // Should have only 1 layer: main GeoJsonLayer
      expect(sublayers.length).toBe(1);

      const mainLayer = sublayers[0];
      expect(mainLayer).toBeInstanceOf(GeoJsonLayer);
      expect(mainLayer.id).toBe(`test-layer-${SHAPE_LAYER_IDS.DISPLAY}`);
    });

    it('renders highlight layer when selectedShapeId is provided and showHighlight is true', () => {
      const shape = createMockShape();
      const layer = new DisplayShapeLayer({
        id: 'test-layer',
        mapId,
        data: [shape],
        selectedShapeId: shape.id,
        showHighlight: true,
        showLabels: false,
      });

      initializeLayerWithState(layer);

      const sublayers = layer.renderLayers();

      // Should have 2 layers: highlight + main
      expect(sublayers.length).toBe(2);

      const highlightLayer = sublayers.find(
        (l) => l.id === `test-layer-${SHAPE_LAYER_IDS.DISPLAY_HIGHLIGHT}`,
      );
      const mainLayer = sublayers.find(
        (l) => l.id === `test-layer-${SHAPE_LAYER_IDS.DISPLAY}`,
      );

      expect(highlightLayer).toBeInstanceOf(GeoJsonLayer);
      expect(mainLayer).toBeInstanceOf(GeoJsonLayer);
    });

    it('does not render highlight layer when selectedShapeId does not match any shape', () => {
      const shape = createMockShape();
      const layer = new DisplayShapeLayer({
        id: 'test-layer',
        mapId,
        data: [shape],
        selectedShapeId: 'non-existent-id',
        showLabels: false,
      });

      initializeLayerWithState(layer);

      const sublayers = layer.renderLayers();

      // Should have only 1 layer: main
      expect(sublayers.length).toBe(1);
      expect(sublayers[0].id).toBe(`test-layer-${SHAPE_LAYER_IDS.DISPLAY}`);
    });

    it('adds shapeId to feature properties for event correlation', () => {
      const shape = createMockShape();
      const layer = new DisplayShapeLayer({
        id: 'test-layer',
        mapId,
        data: [shape],
        showLabels: false,
      });

      initializeLayerWithState(layer);

      const sublayers = layer.renderLayers();
      const mainLayer = sublayers[0] as GeoJsonLayer;

      // Access the data prop from the layer
      // biome-ignore lint/suspicious/noExplicitAny: accessing internal props for testing
      const layerData = (mainLayer.props as any).data;
      expect(layerData[0].properties.shapeId).toBe(shape.id);
    });

    it('caches features when data reference is unchanged', () => {
      const shapes = [createMockShape()];
      const layer = new DisplayShapeLayer({
        id: 'test-layer',
        mapId,
        data: shapes,
        showLabels: false,
      });

      initializeLayerWithState(layer);

      // First render
      const sublayers1 = layer.renderLayers();
      // biome-ignore lint/suspicious/noExplicitAny: accessing internal props for testing
      const data1 = ((sublayers1[0] as GeoJsonLayer).props as any).data;

      // Second render with same data reference
      const sublayers2 = layer.renderLayers();
      // biome-ignore lint/suspicious/noExplicitAny: accessing internal props for testing
      const data2 = ((sublayers2[0] as GeoJsonLayer).props as any).data;

      // Should be the same cached array
      expect(data1).toBe(data2);
    });
  });

  describe('getPickingInfo - click handling', () => {
    it('emits shapes:selected event when shape is clicked', () => {
      const shape = createMockShape();
      const selectedSpy = vi.fn();
      shapeBus.on(ShapeEvents.selected, selectedSpy);

      const layer = new DisplayShapeLayer({
        id: 'test-layer',
        mapId,
        data: [shape],
        showLabels: false,
      });

      initializeLayerWithState(layer);
      // Render to populate cache with shapeId in properties
      layer.renderLayers();

      // Simulate click via getPickingInfo
      layer.getPickingInfo({
        info: {
          object: { properties: { shapeId: shape.id } },
          index: 0,
        } as never,
        mode: 'query',
        sourceLayer: { id: `test-layer-${SHAPE_LAYER_IDS.DISPLAY}` },
      });

      expect(selectedSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: { shapeId: shape.id, mapId },
        }),
      );

      shapeBus.off(ShapeEvents.selected, selectedSpy);
    });

    it('calls onShapeClick callback when shape is clicked', () => {
      const shape = createMockShape();
      const clickCallback = vi.fn();

      const layer = new DisplayShapeLayer({
        id: 'test-layer',
        mapId,
        data: [shape],
        showLabels: false,
        onShapeClick: clickCallback,
      });

      initializeLayerWithState(layer);
      layer.renderLayers();

      layer.getPickingInfo({
        info: {
          object: { properties: { shapeId: shape.id } },
          index: 0,
        } as never,
        mode: 'query',
        sourceLayer: { id: `test-layer-${SHAPE_LAYER_IDS.DISPLAY}` },
      });

      expect(clickCallback).toHaveBeenCalledWith(shape);
    });

    it('does not emit event when clicking on empty space', () => {
      const shape = createMockShape();
      const selectedSpy = vi.fn();
      shapeBus.on(ShapeEvents.selected, selectedSpy);

      const layer = new DisplayShapeLayer({
        id: 'test-layer',
        mapId,
        data: [shape],
        showLabels: false,
      });

      initializeLayerWithState(layer);

      // Simulate click on empty space (no object)
      layer.getPickingInfo({
        info: { object: null, index: -1 } as never,
        mode: 'query',
        sourceLayer: { id: `test-layer-${SHAPE_LAYER_IDS.DISPLAY}` },
      });

      expect(selectedSpy).not.toHaveBeenCalled();

      shapeBus.off(ShapeEvents.selected, selectedSpy);
    });

    it('ignores clicks from non-main sublayers', () => {
      const shape = createMockShape();
      const selectedSpy = vi.fn();
      shapeBus.on(ShapeEvents.selected, selectedSpy);

      const layer = new DisplayShapeLayer({
        id: 'test-layer',
        mapId,
        data: [shape],
        showLabels: false,
      });

      initializeLayerWithState(layer);
      layer.renderLayers();

      // Simulate click from highlight layer (should be ignored)
      layer.getPickingInfo({
        info: {
          object: { properties: { shapeId: shape.id } },
          index: 0,
        } as never,
        mode: 'query',
        sourceLayer: { id: `test-layer-${SHAPE_LAYER_IDS.DISPLAY_HIGHLIGHT}` },
      });

      expect(selectedSpy).not.toHaveBeenCalled();

      shapeBus.off(ShapeEvents.selected, selectedSpy);
    });
  });

  describe('getPickingInfo - hover handling', () => {
    it('emits shapes:hovered event when hovering over shape', () => {
      const shape = createMockShape();
      const hoveredBus = Broadcast.getInstance<ShapeHoveredEvent>();
      const hoveredSpy = vi.fn();
      hoveredBus.on(ShapeEvents.hovered, hoveredSpy);

      const layer = new DisplayShapeLayer({
        id: 'test-layer',
        mapId,
        data: [shape],
        showLabels: false,
      });

      initializeLayerWithState(layer);
      layer.renderLayers();

      // Simulate hover
      layer.getPickingInfo({
        info: {
          object: { properties: { shapeId: shape.id } },
          index: 0,
        } as never,
        mode: 'hover',
        sourceLayer: { id: `test-layer-${SHAPE_LAYER_IDS.DISPLAY}` },
      });

      expect(hoveredSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: { shapeId: shape.id, mapId },
        }),
      );

      hoveredBus.off(ShapeEvents.hovered, hoveredSpy);
    });

    it('deduplicates hover events for same shape', () => {
      const shape = createMockShape();
      const hoveredBus = Broadcast.getInstance<ShapeHoveredEvent>();
      const hoveredSpy = vi.fn();
      hoveredBus.on(ShapeEvents.hovered, hoveredSpy);

      const layer = new DisplayShapeLayer({
        id: 'test-layer',
        mapId,
        data: [shape],
        showLabels: false,
      });

      initializeLayerWithState(layer);
      layer.renderLayers();

      // First hover
      layer.getPickingInfo({
        info: {
          object: { properties: { shapeId: shape.id } },
          index: 0,
        } as never,
        mode: 'hover',
        sourceLayer: { id: `test-layer-${SHAPE_LAYER_IDS.DISPLAY}` },
      });

      // Second hover on same shape
      layer.getPickingInfo({
        info: {
          object: { properties: { shapeId: shape.id } },
          index: 0,
        } as never,
        mode: 'hover',
        sourceLayer: { id: `test-layer-${SHAPE_LAYER_IDS.DISPLAY}` },
      });

      // Should only emit once due to deduplication
      expect(hoveredSpy).toHaveBeenCalledTimes(1);

      hoveredBus.off(ShapeEvents.hovered, hoveredSpy);
    });

    it('emits shapes:hovered with null when hover ends', () => {
      const shape = createMockShape();
      const hoveredBus = Broadcast.getInstance<ShapeHoveredEvent>();
      const hoveredSpy = vi.fn();
      hoveredBus.on(ShapeEvents.hovered, hoveredSpy);

      const layer = new DisplayShapeLayer({
        id: 'test-layer',
        mapId,
        data: [shape],
        showLabels: false,
      });

      initializeLayerWithState(layer);
      layer.renderLayers();

      // First hover on shape
      layer.getPickingInfo({
        info: {
          object: { properties: { shapeId: shape.id } },
          index: 0,
        } as never,
        mode: 'hover',
        sourceLayer: { id: `test-layer-${SHAPE_LAYER_IDS.DISPLAY}` },
      });

      // Then hover off (no object)
      layer.getPickingInfo({
        info: { object: null, index: undefined } as never,
        mode: 'hover',
        sourceLayer: { id: `test-layer-${SHAPE_LAYER_IDS.DISPLAY}` },
      });

      expect(hoveredSpy).toHaveBeenLastCalledWith(
        expect.objectContaining({
          payload: { shapeId: null, mapId },
        }),
      );

      hoveredBus.off(ShapeEvents.hovered, hoveredSpy);
    });

    it('calls onShapeHover callback', () => {
      const shape = createMockShape();
      const hoverCallback = vi.fn();

      const layer = new DisplayShapeLayer({
        id: 'test-layer',
        mapId,
        data: [shape],
        showLabels: false,
        onShapeHover: hoverCallback,
      });

      initializeLayerWithState(layer);
      layer.renderLayers();

      layer.getPickingInfo({
        info: {
          object: { properties: { shapeId: shape.id } },
          index: 0,
        } as never,
        mode: 'hover',
        sourceLayer: { id: `test-layer-${SHAPE_LAYER_IDS.DISPLAY}` },
      });

      expect(hoverCallback).toHaveBeenCalledWith(shape);
    });

    it('updates hover state for line width increase', () => {
      const shape = createMockShape();

      const layer = new DisplayShapeLayer({
        id: 'test-layer',
        mapId,
        data: [shape],
        showLabels: false,
      });

      initializeLayerWithState(layer);

      // Initially no hover
      expect(layer.state.hoverIndex).toBeUndefined();

      layer.renderLayers();

      // Hover on shape at index 0
      layer.getPickingInfo({
        info: {
          object: { properties: { shapeId: shape.id } },
          index: 0,
        } as never,
        mode: 'hover',
        sourceLayer: { id: `test-layer-${SHAPE_LAYER_IDS.DISPLAY}` },
      });

      expect(layer.state.hoverIndex).toBe(0);

      // Hover off
      layer.getPickingInfo({
        info: { object: null, index: undefined } as never,
        mode: 'hover',
        sourceLayer: { id: `test-layer-${SHAPE_LAYER_IDS.DISPLAY}` },
      });

      expect(layer.state.hoverIndex).toBeUndefined();
    });
  });

  describe('finalizeState', () => {
    it('clears hover state when layer is destroyed', () => {
      const shape = createMockShape();

      const layer = new DisplayShapeLayer({
        id: 'test-layer',
        mapId,
        data: [shape],
        showLabels: false,
      });

      initializeLayerWithState(layer);
      layer.renderLayers();

      // Set hover state
      layer.getPickingInfo({
        info: {
          object: { properties: { shapeId: shape.id } },
          index: 0,
        } as never,
        mode: 'hover',
        sourceLayer: { id: `test-layer-${SHAPE_LAYER_IDS.DISPLAY}` },
      });

      expect(layer.state.hoverIndex).toBe(0);
      expect(layer.state.lastHoveredId).toBe(shape.id);

      // Finalize (destroy) the layer
      layer.finalizeState();

      // State should be cleared
      expect(layer.state.hoverIndex).toBeUndefined();
      expect(layer.state.lastHoveredId).toBeUndefined();
    });

    it('clears features cache when layer is destroyed', () => {
      const shapes = [createMockShape()];

      const layer = new DisplayShapeLayer({
        id: 'test-layer',
        mapId,
        data: shapes,
        showLabels: false,
      });

      initializeLayerWithState(layer);

      // Render to populate cache
      layer.renderLayers();

      // Access private cache via any cast
      // biome-ignore lint/suspicious/noExplicitAny: accessing private field for testing
      expect((layer as any).featuresCache).not.toBeNull();

      // Finalize
      layer.finalizeState();

      // biome-ignore lint/suspicious/noExplicitAny: accessing private field for testing
      expect((layer as any).featuresCache).toBeNull();
    });
  });

  describe('default props', () => {
    it('uses default props when not specified', () => {
      const layer = new DisplayShapeLayer({
        id: 'test-layer',
        mapId,
        data: [],
      });

      // Check default props
      expect(layer.props.pickable).toBe(true);
      expect(layer.props.showLabels).toBe(true);
      expect(layer.props.highlightColor).toEqual([40, 245, 190, 100]);
    });

    it('allows overriding default props', () => {
      const customHighlight: [number, number, number, number] = [
        255, 0, 0, 200,
      ];

      const layer = new DisplayShapeLayer({
        id: 'test-layer',
        mapId,
        data: [],
        pickable: false,
        showLabels: false,
        highlightColor: customHighlight,
      });

      expect(layer.props.pickable).toBe(false);
      expect(layer.props.showLabels).toBe(false);
      expect(layer.props.highlightColor).toEqual(customHighlight);
    });
  });

  describe('icon support', () => {
    it('detects icon configuration from features', () => {
      const iconAtlas = 'https://example.com/icons.png';
      const iconMapping = {
        marker: { x: 0, y: 0, width: 32, height: 32 },
      };

      const pointShape = createMockPointShape({
        feature: {
          type: 'Feature',
          properties: {
            styleProperties: {
              fillColor: [98, 166, 255, 255] as Color,
              strokeColor: [98, 166, 255, 255] as Color,
              strokeWidth: 4,
              strokePattern: 'solid',
              icon: {
                atlas: iconAtlas,
                mapping: iconMapping,
                name: 'marker',
                size: 32,
              },
            },
          },
          geometry: {
            type: 'Point',
            coordinates: [0, 0],
          },
        },
      });

      const layer = new DisplayShapeLayer({
        id: 'test-layer',
        mapId,
        data: [pointShape],
        showLabels: false,
      });

      initializeLayerWithState(layer);

      const sublayers = layer.renderLayers();
      const mainLayer = sublayers[0] as GeoJsonLayer;

      // Check that icon config was applied
      // biome-ignore lint/suspicious/noExplicitAny: accessing internal props for testing
      const props = mainLayer.props as any;
      expect(props.pointType).toBe('icon');
      expect(props.iconAtlas).toBe(iconAtlas);
      expect(props.iconMapping).toEqual(iconMapping);
    });

    it('uses circle point type when no icons configured', () => {
      const pointShape = createMockPointShape();

      const layer = new DisplayShapeLayer({
        id: 'test-layer',
        mapId,
        data: [pointShape],
        showLabels: false,
      });

      initializeLayerWithState(layer);

      const sublayers = layer.renderLayers();
      const mainLayer = sublayers[0] as GeoJsonLayer;

      // biome-ignore lint/suspicious/noExplicitAny: accessing internal props for testing
      const props = mainLayer.props as any;
      expect(props.pointType).toBe('circle');
    });
  });

  describe('applyBaseOpacity', () => {
    it('passes applyBaseOpacity to getFillColor accessor', () => {
      const shape = createMockShape();

      const layer = new DisplayShapeLayer({
        id: 'test-layer',
        mapId,
        data: [shape],
        showLabels: false,
        applyBaseOpacity: true,
      });

      initializeLayerWithState(layer);

      const sublayers = layer.renderLayers();
      const mainLayer = sublayers[0] as GeoJsonLayer;

      // The getFillColor accessor should be configured with applyBaseOpacity
      // biome-ignore lint/suspicious/noExplicitAny: accessing internal props for testing
      const props = mainLayer.props as any;
      expect(props.updateTriggers.getFillColor).toContain(true);
    });
  });
});
