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

import { circle } from '@turf/turf';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CircleTransformMode } from './circle-transform-mode';
import type {
  DraggingEvent,
  FeatureCollection,
  GeoJsonEditMode,
  ModeProps,
  StopDraggingEvent,
} from '@deck.gl-community/editable-layers';

// Center and radius for test circle geometry
const CENTER: [number, number] = [-122.4, 37.8];
const RADIUS_KM = 1;
const STEPS = 64;

/**
 * Generate a valid circle polygon feature using turf.
 */
function createCircleFeature(
  center: [number, number] = CENTER,
  radiusKm: number = RADIUS_KM,
  steps: number = STEPS,
) {
  const circleGeo = circle(center, radiusKm, { steps });

  return {
    type: 'Feature' as const,
    properties: {},
    geometry: circleGeo.geometry,
  };
}

function createMockProps(
  overrides?: Partial<ModeProps<FeatureCollection>>,
): ModeProps<FeatureCollection> {
  return {
    data: {
      type: 'FeatureCollection',
      features: [createCircleFeature()],
    },
    selectedIndexes: [0],
    lastPointerMoveEvent: null,
    modeConfig: {},
    onEdit: vi.fn(),
    onUpdateCursor: vi.fn(),
    ...overrides,
  } as ModeProps<FeatureCollection>;
}

function createStopDraggingEvent(
  overrides?: Partial<StopDraggingEvent>,
): StopDraggingEvent {
  return {
    mapCoords: [-122.39, 37.8],
    screenCoords: [100, 100],
    picks: [],
    pointerDownMapCoords: [-122.4, 37.8],
    pointerDownScreenCoords: [50, 50],
    sourceEvent: new MouseEvent('pointerup'),
    cancelPan: vi.fn(),
    ...overrides,
  } as StopDraggingEvent;
}

function createDraggingEvent(
  overrides?: Partial<DraggingEvent>,
): DraggingEvent {
  return {
    mapCoords: [-122.39, 37.8],
    screenCoords: [100, 100],
    picks: [],
    pointerDownMapCoords: [-122.4, 37.8],
    pointerDownScreenCoords: [50, 50],
    sourceEvent: new MouseEvent('pointermove'),
    cancelPan: vi.fn(),
    ...overrides,
  } as DraggingEvent;
}

/**
 * Access internals of CircleTransformMode for testing.
 * Matches the pattern used in point-translate-mode.test.ts.
 */
type ModeInternals = {
  resizeMode: GeoJsonEditMode;
  translateMode: GeoJsonEditMode;
  activeDragMode: GeoJsonEditMode | null;
  cachedCenter: [number, number] | null;
  tooltip: { position: unknown; text: string } | null;
};

function getInternals(mode: CircleTransformMode): ModeInternals {
  return mode as unknown as ModeInternals;
}

/** Assert that onEdit was never called with editType 'resized'. */
function expectNoResizedCalls(onEdit: ReturnType<typeof vi.fn>): void {
  const resizedCalls = onEdit.mock.calls.filter(
    (call: unknown[]) =>
      (call[0] as { editType: string }).editType === 'resized',
  );
  expect(resizedCalls).toHaveLength(0);
}

describe('CircleTransformMode', () => {
  let mode: CircleTransformMode;

  beforeEach(() => {
    mode = new CircleTransformMode();
  });

  describe('instantiation', () => {
    it('should create a new instance', () => {
      expect(mode).toBeInstanceOf(CircleTransformMode);
    });

    it('should have the expected methods', () => {
      expect(mode.handleStopDragging).toBeTypeOf('function');
      expect(mode.handleDragging).toBeTypeOf('function');
      expect(mode.handleStartDragging).toBeTypeOf('function');
      expect(mode.getTooltips).toBeTypeOf('function');
    });
  });

  describe('handleStopDragging', () => {
    it('should emit resized completion event with updated geometry when resize ends', () => {
      // Arrange
      const onEdit = vi.fn();
      const props = createMockProps({ onEdit });
      const event = createStopDraggingEvent();
      const internals = getInternals(mode);
      internals.activeDragMode = internals.resizeMode;

      // Act
      mode.handleStopDragging(event, props);

      // Assert
      expect(onEdit).toHaveBeenCalledWith(
        expect.objectContaining({
          editType: 'resized',
          editContext: { featureIndexes: [0] },
        }),
      );
      const editCall = onEdit.mock.calls[0]?.[0];
      expect(editCall.updatedData.features).toHaveLength(1);
      expect(editCall.updatedData.features[0].geometry.type).toBe('Polygon');
    });

    it('should not emit completion event when translate drag ends', () => {
      // Arrange
      const onEdit = vi.fn();
      const props = createMockProps({ onEdit });
      const event = createStopDraggingEvent();
      const internals = getInternals(mode);
      internals.activeDragMode = internals.translateMode;

      // Act
      mode.handleStopDragging(event, props);

      // Assert — our 'resized' event should not fire (TranslateMode may call onEdit separately)
      expectNoResizedCalls(onEdit);
    });

    it('should not emit when no feature is selected', () => {
      // Arrange
      const onEdit = vi.fn();
      const props = createMockProps({ onEdit, selectedIndexes: [] });
      const event = createStopDraggingEvent();
      const internals = getInternals(mode);
      internals.activeDragMode = internals.resizeMode;

      // Act
      mode.handleStopDragging(event, props);

      // Assert
      expectNoResizedCalls(onEdit);
    });

    it('should not emit when selected feature is not a polygon', () => {
      // Arrange
      const onEdit = vi.fn();
      const props = createMockProps({
        onEdit,
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {},
              geometry: { type: 'Point', coordinates: [0, 0] },
            },
          ],
        },
      });
      const event = createStopDraggingEvent();
      const internals = getInternals(mode);
      internals.activeDragMode = internals.resizeMode;

      // Act
      mode.handleStopDragging(event, props);

      // Assert
      expectNoResizedCalls(onEdit);
    });

    it('should use cached center when available', () => {
      // Arrange
      const onEdit = vi.fn();
      const props = createMockProps({ onEdit });
      const event = createStopDraggingEvent();
      const internals = getInternals(mode);
      internals.activeDragMode = internals.resizeMode;
      internals.cachedCenter = CENTER;

      // Act
      mode.handleStopDragging(event, props);

      // Assert — should still produce valid geometry using cached center
      expect(onEdit).toHaveBeenCalledWith(
        expect.objectContaining({
          editType: 'resized',
        }),
      );
    });

    it('should reset activeDragMode after stop', () => {
      // Arrange
      const props = createMockProps();
      const event = createStopDraggingEvent();
      const internals = getInternals(mode);
      internals.activeDragMode = internals.resizeMode;

      // Act
      mode.handleStopDragging(event, props);

      // Assert
      expect(internals.activeDragMode).toBeNull();
    });
  });

  describe('onDragging (tooltip)', () => {
    it('should set tooltip with radius and area during resize drag', () => {
      // Arrange
      const props = createMockProps();
      const cursorCoords: [number, number] = [-122.38, 37.8];
      const event = createDraggingEvent({ mapCoords: cursorCoords });
      const internals = getInternals(mode);
      internals.activeDragMode = internals.resizeMode;

      // Act
      mode.handleDragging(event, props);

      // Assert
      const tooltips = mode.getTooltips();
      expect(tooltips).toHaveLength(1);
      expect(tooltips[0]).toEqual(
        expect.objectContaining({
          position: cursorCoords,
        }),
      );
      expect(tooltips[0]?.text).toMatch(/^r:/);
      expect(tooltips[0]?.text).toContain('km');
    });

    it('should clear tooltip when no valid circle is selected', () => {
      // Arrange
      const props = createMockProps({ selectedIndexes: [] });
      const event = createDraggingEvent();
      const internals = getInternals(mode);
      internals.activeDragMode = internals.resizeMode;

      // Act
      mode.handleDragging(event, props);

      // Assert
      expect(mode.getTooltips()).toHaveLength(0);
    });

    it('should not set tooltip when active mode is translate', () => {
      // Arrange
      const props = createMockProps();
      const event = createDraggingEvent();
      const internals = getInternals(mode);
      internals.activeDragMode = internals.translateMode;

      // Act
      mode.handleDragging(event, props);

      // Assert
      expect(mode.getTooltips()).toHaveLength(0);
    });

    it('should use configured distance units for tooltip', () => {
      // Arrange
      const props = createMockProps({
        modeConfig: { distanceUnits: 'miles' },
      });
      const event = createDraggingEvent();
      const internals = getInternals(mode);
      internals.activeDragMode = internals.resizeMode;

      // Act
      mode.handleDragging(event, props);

      // Assert
      const tooltips = mode.getTooltips();
      expect(tooltips).toHaveLength(1);
      expect(tooltips[0]?.text).toContain('mi');
    });
  });

  describe('cachedCenter', () => {
    it('should cache center on first onDragging call', () => {
      // Arrange
      const props = createMockProps();
      const event = createDraggingEvent();
      const internals = getInternals(mode);
      internals.activeDragMode = internals.resizeMode;
      expect(internals.cachedCenter).toBeNull();

      // Act
      mode.handleDragging(event, props);

      // Assert
      expect(internals.cachedCenter).not.toBeNull();
      expect(internals.cachedCenter).toHaveLength(2);
    });

    it('should reuse cached center on subsequent onDragging calls', () => {
      // Arrange
      const props = createMockProps();
      const event1 = createDraggingEvent({ mapCoords: [-122.39, 37.8] });
      const event2 = createDraggingEvent({ mapCoords: [-122.38, 37.8] });
      const internals = getInternals(mode);
      internals.activeDragMode = internals.resizeMode;

      // Act
      mode.handleDragging(event1, props);
      const centerAfterFirst = internals.cachedCenter;
      // Need to re-set activeDragMode since handleDragging delegates to base
      // which may modify state, but onDragging is called within handleDragging
      internals.activeDragMode = internals.resizeMode;
      mode.handleDragging(event2, props);
      const centerAfterSecond = internals.cachedCenter;

      // Assert — same reference
      expect(centerAfterFirst).toBe(centerAfterSecond);
    });

    it('should clear cached center when drag state resets', () => {
      // Arrange
      const props = createMockProps();
      const event = createDraggingEvent();
      const internals = getInternals(mode);
      internals.activeDragMode = internals.resizeMode;

      // Populate the cache
      mode.handleDragging(event, props);
      expect(internals.cachedCenter).not.toBeNull();

      // Act — handleStopDragging calls resetDragState
      internals.activeDragMode = internals.resizeMode;
      mode.handleStopDragging(createStopDraggingEvent(), props);

      // Assert
      expect(internals.cachedCenter).toBeNull();
    });
  });

  describe('getHandleMatchers', () => {
    it('should match intermediate edit handles to resize mode', () => {
      // Arrange
      const props = createMockProps();
      const resizeHandlePick = {
        isGuide: true,
        object: {
          properties: {
            guideType: 'editHandle',
            editHandleType: 'intermediate',
          },
        },
      };
      const event = {
        ...createDraggingEvent(),
        picks: [resizeHandlePick],
        cancelPan: vi.fn(),
      };

      // Act — handleStartDragging evaluates matchers
      mode.handleStartDragging(event, props);

      // Assert
      const internals = getInternals(mode);
      expect(internals.activeDragMode).toBe(internals.resizeMode);
    });

    it('should fall back to translate mode for non-guide picks', () => {
      // Arrange
      const props = createMockProps();
      const bodyPick = { featureIndex: 0 };
      const event = {
        ...createDraggingEvent(),
        picks: [bodyPick],
        cancelPan: vi.fn(),
      };

      // Act
      mode.handleStartDragging(event, props);

      // Assert
      const internals = getInternals(mode);
      expect(internals.activeDragMode).toBe(internals.translateMode);
    });
  });
});
