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
import { GeoJsonLayer, LineLayer, TextLayer } from '@deck.gl/layers';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mockShapes } from '../__fixtures__/mock-shapes';
import { mockShapes3D } from '../__fixtures__/mock-shapes-3d';
import { mockShapesWithIcons } from '../__fixtures__/mock-shapes-with-icons';
import { SHAPE_LAYER_IDS } from '../shared/constants';
import {
  ShapeEvents,
  type ShapeHoveredEvent,
  type ShapeSelectedEvent,
} from '../shared/events';
import { MATERIAL_SETTINGS } from './constants';
import { DisplayShapeLayer } from './index';
import type { UniqueId } from '@accelint/core';
import type { Shape } from '../shared/types';

/**
 * Initialize layer with proper deck.gl state
 * deck.gl requires state to be initialized before setState can be called
 */
function initializeLayerWithState(
  layer: DisplayShapeLayer,
  initialState: Record<string, unknown> = {},
): void {
  // Initialize the layer (this sets up internal deck.gl state)
  layer.initializeState({} as never);
  // Manually initialize state object that deck.gl needs for setState to work
  // biome-ignore lint/suspicious/noExplicitAny: accessing internal state for testing
  if ((layer as any).state) {
    // biome-ignore lint/suspicious/noExplicitAny: accessing internal state for testing
    Object.assign((layer as any).state, initialState);
  } else {
    // biome-ignore lint/suspicious/noExplicitAny: accessing internal state for testing
    (layer as any).state = { ...initialState };
  }
}

/** 2D Polygon fixture */
const polygonFixture = mockShapes[3] as Shape;
/** 2D Point fixture */
const pointFixture = mockShapes[2] as Shape;
/** 2D Rectangle fixture (second shape for multi-shape tests) */
const rectangleFixture = mockShapes[4] as Shape;
/** 2D Point with icon fixture */
const iconPointFixture = mockShapesWithIcons[0] as Shape;
/** Elevated LineString fixture (varying 20000m–85000m) */
const elevatedLineString = mockShapes3D[1] as Shape;
/** Elevated Polygon fixture (22500m) */
const elevatedPolygon = mockShapes3D[3] as Shape;

describe('DisplayShapeLayer', () => {
  let mapId: UniqueId;
  let shapeBus: ReturnType<typeof Broadcast.getInstance<ShapeSelectedEvent>>;

  beforeEach(() => {
    mapId = uuid();
    shapeBus = Broadcast.getInstance();
  });

  describe('renderLayers', () => {
    it('renders main layer and labels layer when showLabels is "always"', () => {
      const shapes = [polygonFixture];
      const layer = new DisplayShapeLayer({
        id: 'test-layer',
        mapId,
        data: shapes,
        showLabels: 'always',
      });

      initializeLayerWithState(layer);

      const sublayers = layer.renderLayers();

      // Should have 2 layers: main GeoJsonLayer + TextLayer (no select layer without selectedShapeId)
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

    it('renders label only for hovered shape when showLabels is "hover"', () => {
      const shapes = [polygonFixture, rectangleFixture];
      const layer = new DisplayShapeLayer({
        id: 'test-layer',
        mapId,
        data: shapes,
        showLabels: 'hover',
      });

      // Initialize without hover - should not show labels
      initializeLayerWithState(layer, { hoverIndex: undefined });
      let sublayers = layer.renderLayers();

      // Should have only main layer, no labels
      expect(sublayers.length).toBe(1);
      expect(sublayers[0]).toBeInstanceOf(GeoJsonLayer);

      // Now simulate hovering over first shape
      initializeLayerWithState(layer, { hoverIndex: 0 });
      sublayers = layer.renderLayers();

      // Should have hover layer + main layer + label layer
      expect(sublayers.length).toBe(3);
      const labelLayer = sublayers.find(
        (l) => l.id === `test-layer-${SHAPE_LAYER_IDS.DISPLAY_LABELS}`,
      );
      expect(labelLayer).toBeInstanceOf(TextLayer);
    });

    it('renders only main layer when showLabels is "never"', () => {
      const shapes = [polygonFixture];
      const layer = new DisplayShapeLayer({
        id: 'test-layer',
        mapId,
        data: shapes,
        showLabels: 'never',
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
      const shape = polygonFixture;
      const layer = new DisplayShapeLayer({
        id: 'test-layer',
        mapId,
        data: [shape],
        selectedShapeId: shape.id,
        showHighlight: true,
        showLabels: 'never',
      });

      initializeLayerWithState(layer);

      const sublayers = layer.renderLayers();

      // Should have 3 layers: highlight + select + main
      expect(sublayers.length).toBe(3);

      const highlightLayer = sublayers.find(
        (l) => l.id === `test-layer-${SHAPE_LAYER_IDS.DISPLAY_HIGHLIGHT}`,
      );
      const selectLayer = sublayers.find(
        (l) => l.id === `test-layer-${SHAPE_LAYER_IDS.DISPLAY_SELECTION}`,
      );
      const mainLayer = sublayers.find(
        (l) => l.id === `test-layer-${SHAPE_LAYER_IDS.DISPLAY}`,
      );

      expect(highlightLayer).toBeInstanceOf(GeoJsonLayer);
      expect(selectLayer).toBeInstanceOf(GeoJsonLayer);
      expect(mainLayer).toBeInstanceOf(GeoJsonLayer);
    });

    it('does not render highlight layer when selectedShapeId does not match any shape', () => {
      const shape = polygonFixture;
      const layer = new DisplayShapeLayer({
        id: 'test-layer',
        mapId,
        data: [shape],
        selectedShapeId: 'non-existent-id',
        showLabels: 'never',
      });

      initializeLayerWithState(layer);

      const sublayers = layer.renderLayers();

      // Should have only 1 layer: main
      expect(sublayers.length).toBe(1);
      expect(sublayers[0].id).toBe(`test-layer-${SHAPE_LAYER_IDS.DISPLAY}`);
    });

    it('renders select layer when selectedShapeId is provided', () => {
      const shape = polygonFixture;
      const layer = new DisplayShapeLayer({
        id: 'test-layer',
        mapId,
        data: [shape],
        selectedShapeId: shape.id,
        showLabels: 'never',
      });

      initializeLayerWithState(layer);

      const sublayers = layer.renderLayers();

      // Should have 2 layers: select layer + main
      expect(sublayers.length).toBe(2);

      const selectLayer = sublayers.find(
        (l) => l.id === `test-layer-${SHAPE_LAYER_IDS.DISPLAY_SELECTION}`,
      );
      const mainLayer = sublayers.find(
        (l) => l.id === `test-layer-${SHAPE_LAYER_IDS.DISPLAY}`,
      );

      expect(selectLayer).toBeInstanceOf(GeoJsonLayer);
      expect(mainLayer).toBeInstanceOf(GeoJsonLayer);
    });

    it('does not render select layer when selectedShapeId does not match any shape', () => {
      const shape = polygonFixture;
      const layer = new DisplayShapeLayer({
        id: 'test-layer',
        mapId,
        data: [shape],
        selectedShapeId: 'non-existent-id',
        showLabels: 'never',
      });

      initializeLayerWithState(layer);

      const sublayers = layer.renderLayers();

      // Should have only 1 layer: main
      expect(sublayers.length).toBe(1);
      expect(sublayers[0].id).toBe(`test-layer-${SHAPE_LAYER_IDS.DISPLAY}`);
    });

    it('adds shapeId to feature properties for event correlation', () => {
      const shape = polygonFixture;
      const layer = new DisplayShapeLayer({
        id: 'test-layer',
        mapId,
        data: [shape],
        showLabels: 'never',
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
      const shapes = [polygonFixture];
      const layer = new DisplayShapeLayer({
        id: 'test-layer',
        mapId,
        data: shapes,
        showLabels: 'never',
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
      const shape = polygonFixture;
      const selectedSpy = vi.fn();
      shapeBus.on(ShapeEvents.selected, selectedSpy);

      const layer = new DisplayShapeLayer({
        id: 'test-layer',
        mapId,
        data: [shape],
        showLabels: 'never',
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
      const shape = polygonFixture;
      const clickCallback = vi.fn();

      const layer = new DisplayShapeLayer({
        id: 'test-layer',
        mapId,
        data: [shape],
        showLabels: 'never',
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
      const shape = polygonFixture;
      const selectedSpy = vi.fn();
      shapeBus.on(ShapeEvents.selected, selectedSpy);

      const layer = new DisplayShapeLayer({
        id: 'test-layer',
        mapId,
        data: [shape],
        showLabels: 'never',
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
      const shape = polygonFixture;
      const selectedSpy = vi.fn();
      shapeBus.on(ShapeEvents.selected, selectedSpy);

      const layer = new DisplayShapeLayer({
        id: 'test-layer',
        mapId,
        data: [shape],
        showLabels: 'never',
      });

      initializeLayerWithState(layer);
      layer.renderLayers();

      // Simulate click from select layer (should be ignored)
      layer.getPickingInfo({
        info: {
          object: { properties: { shapeId: shape.id } },
          index: 0,
        } as never,
        mode: 'query',
        sourceLayer: { id: `test-layer-${SHAPE_LAYER_IDS.DISPLAY_SELECTION}` },
      });

      expect(selectedSpy).not.toHaveBeenCalled();

      shapeBus.off(ShapeEvents.selected, selectedSpy);
    });
  });

  describe('getPickingInfo - hover handling', () => {
    it('emits shapes:hovered event when hovering over shape', () => {
      const shape = polygonFixture;
      const hoveredBus = Broadcast.getInstance<ShapeHoveredEvent>();
      const hoveredSpy = vi.fn();
      hoveredBus.on(ShapeEvents.hovered, hoveredSpy);

      const layer = new DisplayShapeLayer({
        id: 'test-layer',
        mapId,
        data: [shape],
        showLabels: 'never',
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
      const shape = polygonFixture;
      const hoveredBus = Broadcast.getInstance<ShapeHoveredEvent>();
      const hoveredSpy = vi.fn();
      hoveredBus.on(ShapeEvents.hovered, hoveredSpy);

      const layer = new DisplayShapeLayer({
        id: 'test-layer',
        mapId,
        data: [shape],
        showLabels: 'never',
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
      const shape = polygonFixture;
      const hoveredBus = Broadcast.getInstance<ShapeHoveredEvent>();
      const hoveredSpy = vi.fn();
      hoveredBus.on(ShapeEvents.hovered, hoveredSpy);

      const layer = new DisplayShapeLayer({
        id: 'test-layer',
        mapId,
        data: [shape],
        showLabels: 'never',
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
      const shape = polygonFixture;
      const hoverCallback = vi.fn();

      const layer = new DisplayShapeLayer({
        id: 'test-layer',
        mapId,
        data: [shape],
        showLabels: 'never',
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
      const shape = polygonFixture;

      const layer = new DisplayShapeLayer({
        id: 'test-layer',
        mapId,
        data: [shape],
        showLabels: 'never',
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
      const shape = polygonFixture;

      const layer = new DisplayShapeLayer({
        id: 'test-layer',
        mapId,
        data: [shape],
        showLabels: 'never',
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
      const shapes = [polygonFixture];

      const layer = new DisplayShapeLayer({
        id: 'test-layer',
        mapId,
        data: shapes,
        showLabels: 'never',
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

      expect(layer.props.pickable).toBe(true);
      expect(layer.props.showLabels).toBe('always');
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
        showLabels: 'never',
        highlightColor: customHighlight,
      });

      expect(layer.props.pickable).toBe(false);
      expect(layer.props.showLabels).toBe('never');
      expect(layer.props.highlightColor).toEqual(customHighlight);
    });
  });

  describe('icon support', () => {
    it('detects icon configuration from features', () => {
      const layer = new DisplayShapeLayer({
        id: 'test-layer',
        mapId,
        data: [iconPointFixture],
        showLabels: 'never',
      });

      initializeLayerWithState(layer);

      const sublayers = layer.renderLayers();
      const mainLayer = sublayers[0] as GeoJsonLayer;

      // Icon config from fixture should be passed through to sublayer
      // biome-ignore lint/suspicious/noExplicitAny: accessing internal props for testing
      const props = mainLayer.props as any;
      const iconConfig =
        iconPointFixture.feature.properties.styleProperties.icon;
      expect(props.pointType).toBe('icon');
      expect(props.iconAtlas).toBe(iconConfig?.atlas);
      expect(props.iconMapping).toEqual(iconConfig?.mapping);
    });

    it('uses circle point type when no icons configured', () => {
      const layer = new DisplayShapeLayer({
        id: 'test-layer',
        mapId,
        data: [pointFixture],
        showLabels: 'never',
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
      const shape = polygonFixture;

      const layer = new DisplayShapeLayer({
        id: 'test-layer',
        mapId,
        data: [shape],
        showLabels: 'never',
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

  describe('elevation features (enableElevation)', () => {
    describe('main layer configuration', () => {
      it('sets extruded and material when enableElevation is true', () => {
        const layer = new DisplayShapeLayer({
          id: 'test-layer',
          mapId,
          data: [elevatedPolygon],
          showLabels: 'never',
          enableElevation: true,
        });

        initializeLayerWithState(layer);
        const sublayers = layer.renderLayers();

        const mainLayer = sublayers.find(
          (l) => l.id === `test-layer-${SHAPE_LAYER_IDS.DISPLAY}`,
        ) as GeoJsonLayer;
        // biome-ignore lint/suspicious/noExplicitAny: accessing internal props for testing
        const props = mainLayer.props as any;

        expect(props.extruded).toBe(true);
        expect(props.material).toEqual(MATERIAL_SETTINGS.NORMAL);
      });

      it('sets extruded to false when enableElevation is false', () => {
        const layer = new DisplayShapeLayer({
          id: 'test-layer',
          mapId,
          data: [elevatedPolygon],
          showLabels: 'never',
          enableElevation: false,
        });

        initializeLayerWithState(layer);
        const sublayers = layer.renderLayers();

        const mainLayer = sublayers.find(
          (l) => l.id === `test-layer-${SHAPE_LAYER_IDS.DISPLAY}`,
        ) as GeoJsonLayer;
        // biome-ignore lint/suspicious/noExplicitAny: accessing internal props for testing
        const props = mainLayer.props as any;

        expect(props.extruded).toBe(false);
      });

      it('adds depth test parameters when enableElevation is true', () => {
        const layer = new DisplayShapeLayer({
          id: 'test-layer',
          mapId,
          data: [elevatedPolygon],
          showLabels: 'never',
          enableElevation: true,
        });

        initializeLayerWithState(layer);
        const sublayers = layer.renderLayers();

        const mainLayer = sublayers.find(
          (l) => l.id === `test-layer-${SHAPE_LAYER_IDS.DISPLAY}`,
        ) as GeoJsonLayer;
        // biome-ignore lint/suspicious/noExplicitAny: accessing internal props for testing
        const props = mainLayer.props as any;

        expect(props.parameters).toEqual({
          depthTest: true,
          depthCompare: 'less-equal',
        });
      });
    });

    describe('elevation sublayers', () => {
      it('renders curtain layers for elevated LineStrings', () => {
        const layer = new DisplayShapeLayer({
          id: 'test-layer',
          mapId,
          data: [elevatedLineString],
          showLabels: 'never',
          enableElevation: true,
        });

        initializeLayerWithState(layer);
        const sublayers = layer.renderLayers();

        const curtainLayer = sublayers.find((l) =>
          l.id.includes('elevation-curtain'),
        );

        expect(curtainLayer).toBeInstanceOf(GeoJsonLayer);
      });

      it('renders wireframe layer for elevated Polygons', () => {
        const layer = new DisplayShapeLayer({
          id: 'test-layer',
          mapId,
          data: [elevatedPolygon],
          showLabels: 'never',
          enableElevation: true,
        });

        initializeLayerWithState(layer);
        const sublayers = layer.renderLayers();

        const wireframeLayer = sublayers.find((l) =>
          l.id.includes('elevation-wireframe'),
        );

        expect(wireframeLayer).toBeInstanceOf(GeoJsonLayer);
      });

      it('renders elevation indicator lines for elevated LineStrings', () => {
        const layer = new DisplayShapeLayer({
          id: 'test-layer',
          mapId,
          data: [elevatedLineString],
          showLabels: 'never',
          enableElevation: true,
        });

        initializeLayerWithState(layer);
        const sublayers = layer.renderLayers();

        const indicatorLayer = sublayers.find((l) =>
          l.id.includes('elevation-indicators'),
        );

        expect(indicatorLayer).toBeInstanceOf(LineLayer);
      });

      it('does not render elevation layers when enableElevation is false', () => {
        const layer = new DisplayShapeLayer({
          id: 'test-layer',
          mapId,
          data: [elevatedLineString],
          showLabels: 'never',
          enableElevation: false,
        });

        initializeLayerWithState(layer);
        const sublayers = layer.renderLayers();

        expect(sublayers).toHaveLength(1);
        expect(sublayers[0]?.id).toBe(`test-layer-${SHAPE_LAYER_IDS.DISPLAY}`);
      });

      it('renders curtain selected layer when elevated LineString is selected', () => {
        const layer = new DisplayShapeLayer({
          id: 'test-layer',
          mapId,
          data: [elevatedLineString],
          selectedShapeId: elevatedLineString.id,
          showLabels: 'never',
          enableElevation: true,
        });

        initializeLayerWithState(layer);
        const sublayers = layer.renderLayers();

        const curtainSelectedLayer = sublayers.find((l) =>
          l.id.includes('elevation-curtain-selected'),
        );

        expect(curtainSelectedLayer).toBeInstanceOf(GeoJsonLayer);
      });

      it('renders curtain hover layer when elevated LineString is hovered', () => {
        const layer = new DisplayShapeLayer({
          id: 'test-layer',
          mapId,
          data: [elevatedLineString],
          showLabels: 'never',
          enableElevation: true,
        });

        initializeLayerWithState(layer, { hoverIndex: 0 });
        const sublayers = layer.renderLayers();

        const curtainHoverLayer = sublayers.find((l) =>
          l.id.includes('elevation-curtain-hover'),
        );

        expect(curtainHoverLayer).toBeInstanceOf(GeoJsonLayer);
      });
    });

    describe('hover layer', () => {
      it('renders hover layer for extruded polygon when hovered', () => {
        const layer = new DisplayShapeLayer({
          id: 'test-layer',
          mapId,
          data: [elevatedPolygon],
          showLabels: 'never',
          enableElevation: true,
        });

        initializeLayerWithState(layer, { hoverIndex: 0 });
        const sublayers = layer.renderLayers();

        const hoverLayer = sublayers.find(
          (l) => l.id === `test-layer-${SHAPE_LAYER_IDS.DISPLAY}-hover`,
        );

        expect(hoverLayer).toBeInstanceOf(GeoJsonLayer);
        // biome-ignore lint/suspicious/noExplicitAny: accessing internal props for testing
        const props = (hoverLayer as GeoJsonLayer).props as any;
        expect(props.extruded).toBe(true);
        expect(props.material).toEqual(MATERIAL_SETTINGS.HOVER_OR_SELECT);
      });

      it('renders hover layer when enableElevation is false (2D hover)', () => {
        const layer = new DisplayShapeLayer({
          id: 'test-layer',
          mapId,
          data: [elevatedPolygon],
          showLabels: 'never',
          enableElevation: false,
        });

        initializeLayerWithState(layer, { hoverIndex: 0 });
        const sublayers = layer.renderLayers();

        const hoverLayer = sublayers.find(
          (l) => l.id === `test-layer-${SHAPE_LAYER_IDS.DISPLAY}-hover`,
        );

        expect(hoverLayer).toBeInstanceOf(GeoJsonLayer);
        const props = (hoverLayer as GeoJsonLayer).props;
        expect(props.extruded).toBe(false);
        expect(props.material).toEqual(MATERIAL_SETTINGS.HOVER_OR_SELECT);
      });

      it('does not render hover layer for non-polygon shapes', () => {
        const layer = new DisplayShapeLayer({
          id: 'test-layer',
          mapId,
          data: [elevatedLineString],
          showLabels: 'never',
          enableElevation: true,
        });

        initializeLayerWithState(layer, { hoverIndex: 0 });
        const sublayers = layer.renderLayers();

        const hoverLayer = sublayers.find(
          (l) => l.id === `test-layer-${SHAPE_LAYER_IDS.DISPLAY}-hover`,
        );

        expect(hoverLayer).toBeUndefined();
      });
    });

    describe('highlight layer', () => {
      it('renders highlight for elevated polygon at its ground footprint', () => {
        const layer = new DisplayShapeLayer({
          id: 'test-layer',
          mapId,
          data: [elevatedPolygon],
          selectedShapeId: elevatedPolygon.id,
          showHighlight: true,
          showLabels: 'never',
          enableElevation: true,
        });

        initializeLayerWithState(layer);
        const sublayers = layer.renderLayers();

        const highlightLayer = sublayers.find(
          (l) => l.id === `test-layer-${SHAPE_LAYER_IDS.DISPLAY_HIGHLIGHT}`,
        );

        // Elevated polygons still get a highlight outline — it traces the
        // ground footprint beneath the extruded shape
        expect(highlightLayer).toBeInstanceOf(GeoJsonLayer);
      });

      it('renders highlight for non-elevated shape when enableElevation is true', () => {
        const shape = polygonFixture;
        const layer = new DisplayShapeLayer({
          id: 'test-layer',
          mapId,
          data: [shape],
          selectedShapeId: shape.id,
          showHighlight: true,
          showLabels: 'never',
          enableElevation: true,
        });

        initializeLayerWithState(layer);
        const sublayers = layer.renderLayers();

        const highlightLayer = sublayers.find(
          (l) => l.id === `test-layer-${SHAPE_LAYER_IDS.DISPLAY_HIGHLIGHT}`,
        );

        expect(highlightLayer).toBeInstanceOf(GeoJsonLayer);
      });

      it('renders highlight for elevated LineString with 2D coordinates', () => {
        const layer = new DisplayShapeLayer({
          id: 'test-layer',
          mapId,
          data: [elevatedLineString],
          selectedShapeId: elevatedLineString.id,
          showHighlight: true,
          showLabels: 'never',
          enableElevation: true,
        });

        initializeLayerWithState(layer);
        const sublayers = layer.renderLayers();

        const highlightLayer = sublayers.find(
          (l) => l.id === `test-layer-${SHAPE_LAYER_IDS.DISPLAY_HIGHLIGHT}`,
        ) as GeoJsonLayer;

        expect(highlightLayer).toBeInstanceOf(GeoJsonLayer);

        // biome-ignore lint/suspicious/noExplicitAny: accessing internal props for testing
        const data = (highlightLayer.props as any).data as Array<{
          geometry: { coordinates: number[][] };
        }>;
        const coords = data[0]?.geometry.coordinates;

        // All coordinates must be 2D — no Z component
        expect(coords?.every((c) => c.length === 2)).toBe(true);
      });
    });

    describe('select layer', () => {
      it('renders select layer for elevated polygon when enableElevation is true', () => {
        const layer = new DisplayShapeLayer({
          id: 'test-layer',
          mapId,
          data: [elevatedPolygon],
          selectedShapeId: elevatedPolygon.id,
          showLabels: 'never',
          enableElevation: true,
        });

        initializeLayerWithState(layer);
        const sublayers = layer.renderLayers();

        const selectLayer = sublayers.find(
          (l) => l.id === `test-layer-${SHAPE_LAYER_IDS.DISPLAY_SELECTION}`,
        );

        expect(selectLayer).toBeInstanceOf(GeoJsonLayer);
      });

      it('renders select layer for polygon when enableElevation is false', () => {
        const shape = polygonFixture;
        const layer = new DisplayShapeLayer({
          id: 'test-layer',
          mapId,
          data: [shape],
          selectedShapeId: shape.id,
          showLabels: 'never',
          enableElevation: false,
        });

        initializeLayerWithState(layer);
        const sublayers = layer.renderLayers();

        const selectLayer = sublayers.find(
          (l) => l.id === `test-layer-${SHAPE_LAYER_IDS.DISPLAY_SELECTION}`,
        );

        expect(selectLayer).toBeInstanceOf(GeoJsonLayer);
      });
    });

    describe('selection fill color', () => {
      it('does not modify fill color for selected elevated polygon', () => {
        const layer = new DisplayShapeLayer({
          id: 'test-layer',
          mapId,
          data: [elevatedPolygon],
          selectedShapeId: elevatedPolygon.id,
          showLabels: 'never',
          enableElevation: true,
        });

        initializeLayerWithState(layer);
        const sublayers = layer.renderLayers();

        const mainLayer = sublayers.find(
          (l) => l.id === `test-layer-${SHAPE_LAYER_IDS.DISPLAY}`,
        ) as GeoJsonLayer;
        // biome-ignore lint/suspicious/noExplicitAny: accessing internal props for testing
        const props = mainLayer.props as any;
        const feature = props.data[0];

        const fillColor = props.getFillColor(feature);

        // Selection no longer modifies fill — innate shape styling is preserved
        // Base: [255, 255, 255, 255] → with applyBaseOpacity alpha = round(255 * 0.2) = 51
        expect(fillColor).toEqual([255, 255, 255, 51]);
      });
    });

    describe('curtain picking', () => {
      it('emits shapes:selected event when curtain is clicked', () => {
        const selectedSpy = vi.fn();
        shapeBus.on(ShapeEvents.selected, selectedSpy);

        const layer = new DisplayShapeLayer({
          id: 'test-layer',
          mapId,
          data: [elevatedLineString],
          showLabels: 'never',
          enableElevation: true,
        });

        initializeLayerWithState(layer);
        layer.renderLayers();

        layer.getPickingInfo({
          info: {
            object: { properties: { shapeId: elevatedLineString.id } },
            index: 0,
          } as never,
          mode: 'query',
          sourceLayer: {
            id: `test-layer-${SHAPE_LAYER_IDS.DISPLAY}-elevation-curtain`,
          },
        });

        expect(selectedSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            payload: { shapeId: elevatedLineString.id, mapId },
          }),
        );

        shapeBus.off(ShapeEvents.selected, selectedSpy);
      });

      it('calls onShapeClick with original LineString shape when curtain is clicked', () => {
        const clickCallback = vi.fn();
        const layer = new DisplayShapeLayer({
          id: 'test-layer',
          mapId,
          data: [elevatedLineString],
          showLabels: 'never',
          enableElevation: true,
          onShapeClick: clickCallback,
        });

        initializeLayerWithState(layer);
        layer.renderLayers();

        layer.getPickingInfo({
          info: {
            object: { properties: { shapeId: elevatedLineString.id } },
            index: 0,
          } as never,
          mode: 'query',
          sourceLayer: {
            id: `test-layer-${SHAPE_LAYER_IDS.DISPLAY}-elevation-curtain`,
          },
        });

        expect(clickCallback).toHaveBeenCalledWith(elevatedLineString);
      });

      it('updates hover state when hovering over curtain', () => {
        const layer = new DisplayShapeLayer({
          id: 'test-layer',
          mapId,
          data: [elevatedLineString],
          showLabels: 'never',
          enableElevation: true,
        });

        initializeLayerWithState(layer);
        layer.renderLayers();

        expect(layer.state.hoverIndex).toBeUndefined();

        layer.getPickingInfo({
          info: {
            object: { properties: { shapeId: elevatedLineString.id } },
            index: 0,
          } as never,
          mode: 'hover',
          sourceLayer: {
            id: `test-layer-${SHAPE_LAYER_IDS.DISPLAY}-elevation-curtain`,
          },
        });

        expect(layer.state.hoverIndex).toBe(0);
      });
    });
  });
});
