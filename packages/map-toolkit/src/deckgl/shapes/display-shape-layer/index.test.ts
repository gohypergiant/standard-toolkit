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
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
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
import type { DisplayShapeLayerProps } from './types';

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

const TEST_LAYER_ID = 'test-layer';

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

  /** Create an initialized DisplayShapeLayer with sensible test defaults. */
  function createTestLayer(
    props: Partial<DisplayShapeLayerProps> = {},
    initialState?: Record<string, unknown>,
  ): DisplayShapeLayer {
    const layer = new DisplayShapeLayer({
      id: TEST_LAYER_ID,
      mapId,
      data: [],
      showLabels: 'never',
      ...props,
    });
    initializeLayerWithState(layer, initialState);
    return layer;
  }

  describe('renderLayers', () => {
    it('renders main layer and labels layer when showLabels is "always"', () => {
      const layer = createTestLayer({
        data: [polygonFixture],
        showLabels: 'always',
      });
      const sublayers = layer.renderLayers();

      expect(sublayers.length).toBe(2);

      const mainLayer = sublayers.find(
        (l) => l.id === `${TEST_LAYER_ID}-${SHAPE_LAYER_IDS.DISPLAY}`,
      );
      const labelLayer = sublayers.find(
        (l) => l.id === `${TEST_LAYER_ID}-${SHAPE_LAYER_IDS.DISPLAY_LABELS}`,
      );

      expect(mainLayer).toBeInstanceOf(GeoJsonLayer);
      expect(labelLayer).toBeInstanceOf(TextLayer);
    });

    it('renders label only for hovered shape when showLabels is "hover"', () => {
      const layer = createTestLayer(
        { data: [polygonFixture, rectangleFixture], showLabels: 'hover' },
        { hoverIndex: undefined },
      );

      // Without hover - should not show labels
      let sublayers = layer.renderLayers();

      expect(sublayers.length).toBe(1);
      expect(sublayers[0]).toBeInstanceOf(GeoJsonLayer);

      // Now simulate hovering over first shape
      initializeLayerWithState(layer, { hoverIndex: 0 });
      sublayers = layer.renderLayers();

      expect(sublayers.length).toBe(3);
      const labelLayer = sublayers.find(
        (l) => l.id === `${TEST_LAYER_ID}-${SHAPE_LAYER_IDS.DISPLAY_LABELS}`,
      );
      expect(labelLayer).toBeInstanceOf(TextLayer);
    });

    it('renders only main layer when showLabels is "never"', () => {
      const layer = createTestLayer({ data: [polygonFixture] });
      const sublayers = layer.renderLayers();

      expect(sublayers.length).toBe(1);

      const mainLayer = sublayers[0];
      expect(mainLayer).toBeInstanceOf(GeoJsonLayer);
      expect(mainLayer.id).toBe(`${TEST_LAYER_ID}-${SHAPE_LAYER_IDS.DISPLAY}`);
    });

    it('renders highlight layer when selectedShapeId is provided and showHighlight is true', () => {
      const layer = createTestLayer({
        data: [polygonFixture],
        selectedShapeId: polygonFixture.id,
        showHighlight: true,
      });
      const sublayers = layer.renderLayers();

      expect(sublayers.length).toBe(3);

      const highlightLayer = sublayers.find(
        (l) => l.id === `${TEST_LAYER_ID}-${SHAPE_LAYER_IDS.DISPLAY_HIGHLIGHT}`,
      );
      const selectLayer = sublayers.find(
        (l) => l.id === `${TEST_LAYER_ID}-${SHAPE_LAYER_IDS.DISPLAY_SELECTION}`,
      );
      const mainLayer = sublayers.find(
        (l) => l.id === `${TEST_LAYER_ID}-${SHAPE_LAYER_IDS.DISPLAY}`,
      );

      expect(highlightLayer).toBeInstanceOf(GeoJsonLayer);
      expect(selectLayer).toBeInstanceOf(GeoJsonLayer);
      expect(mainLayer).toBeInstanceOf(GeoJsonLayer);
    });

    it('does not render highlight layer when selectedShapeId does not match any shape', () => {
      const layer = createTestLayer({
        data: [polygonFixture],
        selectedShapeId: 'non-existent-id',
      });
      const sublayers = layer.renderLayers();

      expect(sublayers.length).toBe(1);
      expect(sublayers[0].id).toBe(
        `${TEST_LAYER_ID}-${SHAPE_LAYER_IDS.DISPLAY}`,
      );
    });

    it('renders select layer when selectedShapeId is provided', () => {
      const layer = createTestLayer({
        data: [polygonFixture],
        selectedShapeId: polygonFixture.id,
      });
      const sublayers = layer.renderLayers();

      expect(sublayers.length).toBe(2);

      const selectLayer = sublayers.find(
        (l) => l.id === `${TEST_LAYER_ID}-${SHAPE_LAYER_IDS.DISPLAY_SELECTION}`,
      );
      const mainLayer = sublayers.find(
        (l) => l.id === `${TEST_LAYER_ID}-${SHAPE_LAYER_IDS.DISPLAY}`,
      );

      expect(selectLayer).toBeInstanceOf(GeoJsonLayer);
      expect(mainLayer).toBeInstanceOf(GeoJsonLayer);
    });

    it('does not render select layer when selectedShapeId does not match any shape', () => {
      const layer = createTestLayer({
        data: [polygonFixture],
        selectedShapeId: 'non-existent-id',
      });
      const sublayers = layer.renderLayers();

      expect(sublayers.length).toBe(1);
      expect(sublayers[0].id).toBe(
        `${TEST_LAYER_ID}-${SHAPE_LAYER_IDS.DISPLAY}`,
      );
    });

    it('adds shapeId to feature properties for event correlation', () => {
      const layer = createTestLayer({ data: [polygonFixture] });
      const sublayers = layer.renderLayers();
      const mainLayer = sublayers[0] as GeoJsonLayer;

      // biome-ignore lint/suspicious/noExplicitAny: accessing internal props for testing
      const layerData = (mainLayer.props as any).data;
      expect(layerData[0].properties.shapeId).toBe(polygonFixture.id);
    });

    it('caches features when data reference is unchanged', () => {
      const layer = createTestLayer({ data: [polygonFixture] });

      // First render
      const sublayers1 = layer.renderLayers();
      // biome-ignore lint/suspicious/noExplicitAny: accessing internal props for testing
      const data1 = ((sublayers1[0] as GeoJsonLayer).props as any).data;

      // Second render with same data reference
      const sublayers2 = layer.renderLayers();
      // biome-ignore lint/suspicious/noExplicitAny: accessing internal props for testing
      const data2 = ((sublayers2[0] as GeoJsonLayer).props as any).data;

      expect(data1).toBe(data2);
    });
  });

  describe('getPickingInfo - click handling', () => {
    let cleanupBusSpy: () => void;

    beforeEach(() => {
      cleanupBusSpy = () => undefined;
    });

    afterEach(() => {
      cleanupBusSpy();
    });

    it('emits shapes:selected event when shape is clicked', () => {
      const selectedSpy = vi.fn();
      shapeBus.on(ShapeEvents.selected, selectedSpy);
      cleanupBusSpy = () => shapeBus.off(ShapeEvents.selected, selectedSpy);

      const layer = createTestLayer({ data: [polygonFixture] });
      layer.renderLayers();

      layer.getPickingInfo({
        info: {
          object: { properties: { shapeId: polygonFixture.id } },
          index: 0,
        } as never,
        mode: 'query',
        sourceLayer: {
          id: `${TEST_LAYER_ID}-${SHAPE_LAYER_IDS.DISPLAY}`,
        },
      });

      expect(selectedSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: { shapeId: polygonFixture.id, mapId },
        }),
      );
    });

    it('calls onShapeClick callback when shape is clicked', () => {
      const clickCallback = vi.fn();

      const layer = createTestLayer({
        data: [polygonFixture],
        onShapeClick: clickCallback,
      });
      layer.renderLayers();

      layer.getPickingInfo({
        info: {
          object: { properties: { shapeId: polygonFixture.id } },
          index: 0,
        } as never,
        mode: 'query',
        sourceLayer: {
          id: `${TEST_LAYER_ID}-${SHAPE_LAYER_IDS.DISPLAY}`,
        },
      });

      expect(clickCallback).toHaveBeenCalledWith(polygonFixture);
    });

    it('does not emit event when clicking on empty space', () => {
      const selectedSpy = vi.fn();
      shapeBus.on(ShapeEvents.selected, selectedSpy);
      cleanupBusSpy = () => shapeBus.off(ShapeEvents.selected, selectedSpy);

      const layer = createTestLayer({ data: [polygonFixture] });

      layer.getPickingInfo({
        info: { object: null, index: -1 } as never,
        mode: 'query',
        sourceLayer: {
          id: `${TEST_LAYER_ID}-${SHAPE_LAYER_IDS.DISPLAY}`,
        },
      });

      expect(selectedSpy).not.toHaveBeenCalled();
    });

    it('ignores clicks from non-main sublayers', () => {
      const selectedSpy = vi.fn();
      shapeBus.on(ShapeEvents.selected, selectedSpy);
      cleanupBusSpy = () => shapeBus.off(ShapeEvents.selected, selectedSpy);

      const layer = createTestLayer({ data: [polygonFixture] });
      layer.renderLayers();

      layer.getPickingInfo({
        info: {
          object: { properties: { shapeId: polygonFixture.id } },
          index: 0,
        } as never,
        mode: 'query',
        sourceLayer: {
          id: `${TEST_LAYER_ID}-${SHAPE_LAYER_IDS.DISPLAY_SELECTION}`,
        },
      });

      expect(selectedSpy).not.toHaveBeenCalled();
    });
  });

  describe('getPickingInfo - hover handling', () => {
    let hoveredBus: ReturnType<typeof Broadcast.getInstance<ShapeHoveredEvent>>;
    let cleanupBusSpy: () => void;

    beforeEach(() => {
      hoveredBus = Broadcast.getInstance();
      cleanupBusSpy = () => undefined;
    });

    afterEach(() => {
      cleanupBusSpy();
    });

    it('emits shapes:hovered event when hovering over shape', () => {
      const hoveredSpy = vi.fn();
      hoveredBus.on(ShapeEvents.hovered, hoveredSpy);
      cleanupBusSpy = () => hoveredBus.off(ShapeEvents.hovered, hoveredSpy);

      const layer = createTestLayer({ data: [polygonFixture] });
      layer.renderLayers();

      layer.getPickingInfo({
        info: {
          object: { properties: { shapeId: polygonFixture.id } },
          index: 0,
        } as never,
        mode: 'hover',
        sourceLayer: {
          id: `${TEST_LAYER_ID}-${SHAPE_LAYER_IDS.DISPLAY}`,
        },
      });

      expect(hoveredSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: { shapeId: polygonFixture.id, mapId },
        }),
      );
    });

    it('deduplicates hover events for same shape', () => {
      const hoveredSpy = vi.fn();
      hoveredBus.on(ShapeEvents.hovered, hoveredSpy);
      cleanupBusSpy = () => hoveredBus.off(ShapeEvents.hovered, hoveredSpy);

      const layer = createTestLayer({ data: [polygonFixture] });
      layer.renderLayers();

      layer.getPickingInfo({
        info: {
          object: { properties: { shapeId: polygonFixture.id } },
          index: 0,
        } as never,
        mode: 'hover',
        sourceLayer: {
          id: `${TEST_LAYER_ID}-${SHAPE_LAYER_IDS.DISPLAY}`,
        },
      });

      layer.getPickingInfo({
        info: {
          object: { properties: { shapeId: polygonFixture.id } },
          index: 0,
        } as never,
        mode: 'hover',
        sourceLayer: {
          id: `${TEST_LAYER_ID}-${SHAPE_LAYER_IDS.DISPLAY}`,
        },
      });

      expect(hoveredSpy).toHaveBeenCalledTimes(1);
    });

    it('emits shapes:hovered with null when hover ends', () => {
      const hoveredSpy = vi.fn();
      hoveredBus.on(ShapeEvents.hovered, hoveredSpy);
      cleanupBusSpy = () => hoveredBus.off(ShapeEvents.hovered, hoveredSpy);

      const layer = createTestLayer({ data: [polygonFixture] });
      layer.renderLayers();

      layer.getPickingInfo({
        info: {
          object: { properties: { shapeId: polygonFixture.id } },
          index: 0,
        } as never,
        mode: 'hover',
        sourceLayer: {
          id: `${TEST_LAYER_ID}-${SHAPE_LAYER_IDS.DISPLAY}`,
        },
      });

      layer.getPickingInfo({
        info: { object: null, index: undefined } as never,
        mode: 'hover',
        sourceLayer: {
          id: `${TEST_LAYER_ID}-${SHAPE_LAYER_IDS.DISPLAY}`,
        },
      });

      expect(hoveredSpy).toHaveBeenLastCalledWith(
        expect.objectContaining({
          payload: { shapeId: null, mapId },
        }),
      );
    });

    it('calls onShapeHover callback', () => {
      const hoverCallback = vi.fn();

      const layer = createTestLayer({
        data: [polygonFixture],
        onShapeHover: hoverCallback,
      });
      layer.renderLayers();

      layer.getPickingInfo({
        info: {
          object: { properties: { shapeId: polygonFixture.id } },
          index: 0,
        } as never,
        mode: 'hover',
        sourceLayer: {
          id: `${TEST_LAYER_ID}-${SHAPE_LAYER_IDS.DISPLAY}`,
        },
      });

      expect(hoverCallback).toHaveBeenCalledWith(polygonFixture);
    });

    it('updates hover state for line width increase', () => {
      const layer = createTestLayer({ data: [polygonFixture] });

      expect(layer.state.hoverIndex).toBeUndefined();

      layer.renderLayers();

      layer.getPickingInfo({
        info: {
          object: { properties: { shapeId: polygonFixture.id } },
          index: 0,
        } as never,
        mode: 'hover',
        sourceLayer: {
          id: `${TEST_LAYER_ID}-${SHAPE_LAYER_IDS.DISPLAY}`,
        },
      });

      expect(layer.state.hoverIndex).toBe(0);

      layer.getPickingInfo({
        info: { object: null, index: undefined } as never,
        mode: 'hover',
        sourceLayer: {
          id: `${TEST_LAYER_ID}-${SHAPE_LAYER_IDS.DISPLAY}`,
        },
      });

      expect(layer.state.hoverIndex).toBeUndefined();
    });
  });

  describe('finalizeState', () => {
    it('clears hover state when layer is destroyed', () => {
      const layer = createTestLayer({ data: [polygonFixture] });
      layer.renderLayers();

      layer.getPickingInfo({
        info: {
          object: { properties: { shapeId: polygonFixture.id } },
          index: 0,
        } as never,
        mode: 'hover',
        sourceLayer: {
          id: `${TEST_LAYER_ID}-${SHAPE_LAYER_IDS.DISPLAY}`,
        },
      });

      expect(layer.state.hoverIndex).toBe(0);
      expect(layer.state.lastHoveredId).toBe(polygonFixture.id);

      layer.finalizeState();

      expect(layer.state.hoverIndex).toBeUndefined();
      expect(layer.state.lastHoveredId).toBeUndefined();
    });

    it('clears features cache when layer is destroyed', () => {
      const layer = createTestLayer({ data: [polygonFixture] });
      layer.renderLayers();

      // biome-ignore lint/suspicious/noExplicitAny: accessing private field for testing
      expect((layer as any).featuresCache).not.toBeNull();

      layer.finalizeState();

      // biome-ignore lint/suspicious/noExplicitAny: accessing private field for testing
      expect((layer as any).featuresCache).toBeNull();
    });
  });

  describe('default props', () => {
    it('uses default props when not specified', () => {
      // Intentionally NOT using createTestLayer — testing real layer defaults
      const layer = new DisplayShapeLayer({
        id: TEST_LAYER_ID,
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
      // Intentionally NOT using createTestLayer — testing prop overrides
      const layer = new DisplayShapeLayer({
        id: TEST_LAYER_ID,
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
      const layer = createTestLayer({ data: [iconPointFixture] });
      const sublayers = layer.renderLayers();
      const mainLayer = sublayers[0] as GeoJsonLayer;

      // biome-ignore lint/suspicious/noExplicitAny: accessing internal props for testing
      const props = mainLayer.props as any;
      const iconConfig =
        iconPointFixture.feature.properties.styleProperties.icon;
      expect(props.pointType).toBe('icon');
      expect(props.iconAtlas).toBe(iconConfig?.atlas);
      expect(props.iconMapping).toEqual(iconConfig?.mapping);
    });

    it('uses circle point type when no icons configured', () => {
      const layer = createTestLayer({ data: [pointFixture] });
      const sublayers = layer.renderLayers();
      const mainLayer = sublayers[0] as GeoJsonLayer;

      // biome-ignore lint/suspicious/noExplicitAny: accessing internal props for testing
      const props = mainLayer.props as any;
      expect(props.pointType).toBe('circle');
    });
  });

  describe('applyBaseOpacity', () => {
    it('passes applyBaseOpacity to getFillColor accessor', () => {
      const layer = createTestLayer({
        data: [polygonFixture],
        applyBaseOpacity: true,
      });
      const sublayers = layer.renderLayers();
      const mainLayer = sublayers[0] as GeoJsonLayer;

      // biome-ignore lint/suspicious/noExplicitAny: accessing internal props for testing
      const props = mainLayer.props as any;
      expect(props.updateTriggers.getFillColor).toContain(true);
    });
  });

  describe('main layer configuration', () => {
    it('sets extruded and material when enableElevation is true', () => {
      const layer = createTestLayer({
        data: [elevatedPolygon],
        enableElevation: true,
      });
      const sublayers = layer.renderLayers();

      const mainLayer = sublayers.find(
        (l) => l.id === `${TEST_LAYER_ID}-${SHAPE_LAYER_IDS.DISPLAY}`,
      ) as GeoJsonLayer;
      // biome-ignore lint/suspicious/noExplicitAny: accessing internal props for testing
      const props = mainLayer.props as any;

      expect(props.extruded).toBe(true);
      expect(props.material).toEqual(MATERIAL_SETTINGS.NORMAL);
    });

    it('sets extruded to false when enableElevation is false', () => {
      const layer = createTestLayer({
        data: [elevatedPolygon],
        enableElevation: false,
      });
      const sublayers = layer.renderLayers();

      const mainLayer = sublayers.find(
        (l) => l.id === `${TEST_LAYER_ID}-${SHAPE_LAYER_IDS.DISPLAY}`,
      ) as GeoJsonLayer;
      // biome-ignore lint/suspicious/noExplicitAny: accessing internal props for testing
      const props = mainLayer.props as any;

      expect(props.extruded).toBe(false);
    });

    it('adds depth test parameters when enableElevation is true', () => {
      const layer = createTestLayer({
        data: [elevatedPolygon],
        enableElevation: true,
      });
      const sublayers = layer.renderLayers();

      const mainLayer = sublayers.find(
        (l) => l.id === `${TEST_LAYER_ID}-${SHAPE_LAYER_IDS.DISPLAY}`,
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
      const layer = createTestLayer({
        data: [elevatedLineString],
        enableElevation: true,
      });
      const sublayers = layer.renderLayers();

      const curtainLayer = sublayers.find((l) =>
        l.id.includes('elevation-curtain'),
      );

      expect(curtainLayer).toBeInstanceOf(GeoJsonLayer);
    });

    it('renders wireframe layer for elevated Polygons', () => {
      const layer = createTestLayer({
        data: [elevatedPolygon],
        enableElevation: true,
      });
      const sublayers = layer.renderLayers();

      const wireframeLayer = sublayers.find((l) =>
        l.id.includes('elevation-wireframe'),
      );

      expect(wireframeLayer).toBeInstanceOf(GeoJsonLayer);
    });

    it('renders elevation indicator lines for elevated LineStrings', () => {
      const layer = createTestLayer({
        data: [elevatedLineString],
        enableElevation: true,
      });
      const sublayers = layer.renderLayers();

      const indicatorLayer = sublayers.find((l) =>
        l.id.includes('elevation-indicators'),
      );

      expect(indicatorLayer).toBeInstanceOf(LineLayer);
    });

    it('does not render elevation layers when enableElevation is false', () => {
      const layer = createTestLayer({
        data: [elevatedLineString],
        enableElevation: false,
      });
      const sublayers = layer.renderLayers();

      expect(sublayers).toHaveLength(1);
      expect(sublayers[0]?.id).toBe(
        `${TEST_LAYER_ID}-${SHAPE_LAYER_IDS.DISPLAY}`,
      );
    });

    it('renders curtain selected layer when elevated LineString is selected', () => {
      const layer = createTestLayer({
        data: [elevatedLineString],
        selectedShapeId: elevatedLineString.id,
        enableElevation: true,
      });
      const sublayers = layer.renderLayers();

      const curtainSelectedLayer = sublayers.find((l) =>
        l.id.includes('elevation-curtain-selected'),
      );

      expect(curtainSelectedLayer).toBeInstanceOf(GeoJsonLayer);
    });

    it('renders curtain hover layer when elevated LineString is hovered', () => {
      const layer = createTestLayer(
        { data: [elevatedLineString], enableElevation: true },
        { hoverIndex: 0 },
      );
      const sublayers = layer.renderLayers();

      const curtainHoverLayer = sublayers.find((l) =>
        l.id.includes('elevation-curtain-hover'),
      );

      expect(curtainHoverLayer).toBeInstanceOf(GeoJsonLayer);
    });
  });

  describe('hover layer', () => {
    it('renders hover layer for extruded polygon when hovered', () => {
      const layer = createTestLayer(
        { data: [elevatedPolygon], enableElevation: true },
        { hoverIndex: 0 },
      );
      const sublayers = layer.renderLayers();

      const hoverLayer = sublayers.find(
        (l) => l.id === `${TEST_LAYER_ID}-${SHAPE_LAYER_IDS.DISPLAY}-hover`,
      );

      expect(hoverLayer).toBeInstanceOf(GeoJsonLayer);
      // biome-ignore lint/suspicious/noExplicitAny: accessing internal props for testing
      const props = (hoverLayer as GeoJsonLayer).props as any;
      expect(props.extruded).toBe(true);
      expect(props.material).toEqual(MATERIAL_SETTINGS.HOVER_OR_SELECT);
    });

    it('renders hover layer when enableElevation is false (2D hover)', () => {
      const layer = createTestLayer(
        { data: [elevatedPolygon], enableElevation: false },
        { hoverIndex: 0 },
      );
      const sublayers = layer.renderLayers();

      const hoverLayer = sublayers.find(
        (l) => l.id === `${TEST_LAYER_ID}-${SHAPE_LAYER_IDS.DISPLAY}-hover`,
      );

      expect(hoverLayer).toBeInstanceOf(GeoJsonLayer);
      const props = (hoverLayer as GeoJsonLayer).props;
      expect(props.extruded).toBe(false);
      expect(props.material).toEqual(MATERIAL_SETTINGS.HOVER_OR_SELECT);
    });

    it('does not render hover layer for non-polygon shapes', () => {
      const layer = createTestLayer(
        { data: [elevatedLineString], enableElevation: true },
        { hoverIndex: 0 },
      );
      const sublayers = layer.renderLayers();

      const hoverLayer = sublayers.find(
        (l) => l.id === `${TEST_LAYER_ID}-${SHAPE_LAYER_IDS.DISPLAY}-hover`,
      );

      expect(hoverLayer).toBeUndefined();
    });
  });

  describe('highlight layer', () => {
    it('renders highlight for elevated polygon at its ground footprint', () => {
      const layer = createTestLayer({
        data: [elevatedPolygon],
        selectedShapeId: elevatedPolygon.id,
        showHighlight: true,
        enableElevation: true,
      });
      const sublayers = layer.renderLayers();

      const highlightLayer = sublayers.find(
        (l) => l.id === `${TEST_LAYER_ID}-${SHAPE_LAYER_IDS.DISPLAY_HIGHLIGHT}`,
      );

      expect(highlightLayer).toBeInstanceOf(GeoJsonLayer);
    });

    it('renders highlight for non-elevated shape when enableElevation is true', () => {
      const layer = createTestLayer({
        data: [polygonFixture],
        selectedShapeId: polygonFixture.id,
        showHighlight: true,
        enableElevation: true,
      });
      const sublayers = layer.renderLayers();

      const highlightLayer = sublayers.find(
        (l) => l.id === `${TEST_LAYER_ID}-${SHAPE_LAYER_IDS.DISPLAY_HIGHLIGHT}`,
      );

      expect(highlightLayer).toBeInstanceOf(GeoJsonLayer);
    });

    it('renders highlight for elevated LineString with 2D coordinates', () => {
      const layer = createTestLayer({
        data: [elevatedLineString],
        selectedShapeId: elevatedLineString.id,
        showHighlight: true,
        enableElevation: true,
      });
      const sublayers = layer.renderLayers();

      const highlightLayer = sublayers.find(
        (l) => l.id === `${TEST_LAYER_ID}-${SHAPE_LAYER_IDS.DISPLAY_HIGHLIGHT}`,
      ) as GeoJsonLayer;

      expect(highlightLayer).toBeInstanceOf(GeoJsonLayer);

      // biome-ignore lint/suspicious/noExplicitAny: accessing internal props for testing
      const data = (highlightLayer.props as any).data as Array<{
        geometry: { coordinates: number[][] };
      }>;
      const coords = data[0]?.geometry.coordinates;

      expect(coords?.every((c) => c.length === 2)).toBe(true);
    });
  });

  describe('select layer', () => {
    it('renders select layer for elevated polygon when enableElevation is true', () => {
      const layer = createTestLayer({
        data: [elevatedPolygon],
        selectedShapeId: elevatedPolygon.id,
        enableElevation: true,
      });
      const sublayers = layer.renderLayers();

      const selectLayer = sublayers.find(
        (l) => l.id === `${TEST_LAYER_ID}-${SHAPE_LAYER_IDS.DISPLAY_SELECTION}`,
      );

      expect(selectLayer).toBeInstanceOf(GeoJsonLayer);
    });

    it('renders select layer for polygon when enableElevation is false', () => {
      const layer = createTestLayer({
        data: [polygonFixture],
        selectedShapeId: polygonFixture.id,
        enableElevation: false,
      });
      const sublayers = layer.renderLayers();

      const selectLayer = sublayers.find(
        (l) => l.id === `${TEST_LAYER_ID}-${SHAPE_LAYER_IDS.DISPLAY_SELECTION}`,
      );

      expect(selectLayer).toBeInstanceOf(GeoJsonLayer);
    });
  });

  describe('selection fill color', () => {
    it('does not modify fill color for selected elevated polygon', () => {
      const layer = createTestLayer({
        data: [elevatedPolygon],
        selectedShapeId: elevatedPolygon.id,
        enableElevation: true,
      });
      const sublayers = layer.renderLayers();

      const mainLayer = sublayers.find(
        (l) => l.id === `${TEST_LAYER_ID}-${SHAPE_LAYER_IDS.DISPLAY}`,
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
    let cleanupBusSpy: () => void;

    beforeEach(() => {
      cleanupBusSpy = () => undefined;
    });

    afterEach(() => {
      cleanupBusSpy();
    });

    it('emits shapes:selected event when curtain is clicked', () => {
      const selectedSpy = vi.fn();
      shapeBus.on(ShapeEvents.selected, selectedSpy);
      cleanupBusSpy = () => shapeBus.off(ShapeEvents.selected, selectedSpy);

      const layer = createTestLayer({
        data: [elevatedLineString],
        enableElevation: true,
      });
      layer.renderLayers();

      layer.getPickingInfo({
        info: {
          object: { properties: { shapeId: elevatedLineString.id } },
          index: 0,
        } as never,
        mode: 'query',
        sourceLayer: {
          id: `${TEST_LAYER_ID}-${SHAPE_LAYER_IDS.DISPLAY}-elevation-curtain`,
        },
      });

      expect(selectedSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: { shapeId: elevatedLineString.id, mapId },
        }),
      );
    });

    it('calls onShapeClick with original LineString shape when curtain is clicked', () => {
      const clickCallback = vi.fn();
      const layer = createTestLayer({
        data: [elevatedLineString],
        enableElevation: true,
        onShapeClick: clickCallback,
      });
      layer.renderLayers();

      layer.getPickingInfo({
        info: {
          object: { properties: { shapeId: elevatedLineString.id } },
          index: 0,
        } as never,
        mode: 'query',
        sourceLayer: {
          id: `${TEST_LAYER_ID}-${SHAPE_LAYER_IDS.DISPLAY}-elevation-curtain`,
        },
      });

      expect(clickCallback).toHaveBeenCalledWith(elevatedLineString);
    });

    it('updates hover state when hovering over curtain', () => {
      const layer = createTestLayer({
        data: [elevatedLineString],
        enableElevation: true,
      });
      layer.renderLayers();

      expect(layer.state.hoverIndex).toBeUndefined();

      layer.getPickingInfo({
        info: {
          object: { properties: { shapeId: elevatedLineString.id } },
          index: 0,
        } as never,
        mode: 'hover',
        sourceLayer: {
          id: `${TEST_LAYER_ID}-${SHAPE_LAYER_IDS.DISPLAY}-elevation-curtain`,
        },
      });

      expect(layer.state.hoverIndex).toBe(0);
    });
  });

  describe('radius label layer', () => {
    /** Circle fixture: radius 250 km */
    const circleFixture = mockShapes[0] as Shape;

    it('renders radius label when hovering over a circle shape', () => {
      const layer = createTestLayer(
        { data: [circleFixture] },
        { hoverIndex: 0 },
      );
      const sublayers = layer.renderLayers();

      const radiusLabel = sublayers.find((l) => l.id.includes('radius-label'));

      expect(radiusLabel).toBeInstanceOf(TextLayer);
    });

    it('does not render radius label when hovering over a non-circle shape', () => {
      const layer = createTestLayer(
        { data: [polygonFixture] },
        { hoverIndex: 0 },
      );
      const sublayers = layer.renderLayers();

      const radiusLabel = sublayers.find((l) => l.id.includes('radius-label'));

      expect(radiusLabel).toBeUndefined();
    });

    it('does not render radius label when nothing is hovered', () => {
      const layer = createTestLayer(
        { data: [circleFixture] },
        { hoverIndex: undefined },
      );
      const sublayers = layer.renderLayers();

      const radiusLabel = sublayers.find((l) => l.id.includes('radius-label'));

      expect(radiusLabel).toBeUndefined();
    });

    it('passes the unit prop to the radius label', () => {
      const layer = createTestLayer(
        { data: [circleFixture], unit: 'km' },
        { hoverIndex: 0 },
      );
      const sublayers = layer.renderLayers();

      const radiusLabel = sublayers.find((l) => l.id.includes('radius-label'));

      expect(radiusLabel).toBeInstanceOf(TextLayer);
      // biome-ignore lint/suspicious/noExplicitAny: accessing internal props for testing
      const props = (radiusLabel as TextLayer).props as any;
      // 250 km stored, display in km — should show "r: 250.00 km"
      expect(props.data[0].text).toBe('r: 250.00 km');
    });

    it('offsets below label when showLabels is "always"', () => {
      const layer = createTestLayer(
        { data: [circleFixture], showLabels: 'always' },
        { hoverIndex: 0 },
      );
      const sublayers = layer.renderLayers();

      const radiusLabel = sublayers.find((l) => l.id.includes('radius-label'));
      expect(radiusLabel).toBeInstanceOf(TextLayer);

      // biome-ignore lint/suspicious/noExplicitAny: accessing internal props for testing
      const props = (radiusLabel as TextLayer).props as any;
      // Default circle label offset is [0, 10], radius adds DEFAULT_TEXT_SIZE + 2px gap below
      expect(props.getPixelOffset).toEqual([0, 24]);
    });

    it('uses label position when showLabels is "never"', () => {
      const layer = createTestLayer(
        { data: [circleFixture], showLabels: 'never' },
        { hoverIndex: 0 },
      );
      const sublayers = layer.renderLayers();

      const radiusLabel = sublayers.find((l) => l.id.includes('radius-label'));
      expect(radiusLabel).toBeInstanceOf(TextLayer);

      // biome-ignore lint/suspicious/noExplicitAny: accessing internal props for testing
      const props = (radiusLabel as TextLayer).props as any;
      // Default circle label offset is [0, 10] — no additional offset
      expect(props.getPixelOffset).toEqual([0, 10]);
    });
  });
});
