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

import type {
  ClickEvent,
  FeatureCollection,
  ModeProps,
} from '@deck.gl-community/editable-layers';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PointTranslateMode } from './point-translate-mode';

/**
 * Create mock props for testing
 */
function createMockProps(
  overrides?: Partial<ModeProps<FeatureCollection>>,
): ModeProps<FeatureCollection> {
  return {
    data: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: [0, 0],
          },
        },
      ],
    },
    selectedIndexes: [0],
    lastPointerMoveEvent: null,
    modeConfig: {},
    onEdit: vi.fn(),
    onUpdateCursor: vi.fn(),
    ...overrides,
  } as ModeProps<FeatureCollection>;
}

/**
 * Create a mock click event
 */
function createMockClickEvent(overrides?: Partial<ClickEvent>): ClickEvent {
  return {
    mapCoords: [-122.4, 37.8],
    screenCoords: [100, 100],
    picks: [],
    sourceEvent: new MouseEvent('click'),
    ...overrides,
  } as ClickEvent;
}

describe('PointTranslateMode', () => {
  let mode: PointTranslateMode;

  beforeEach(() => {
    mode = new PointTranslateMode();
  });

  describe('instantiation', () => {
    it('creates a new instance', () => {
      expect(mode).toBeInstanceOf(PointTranslateMode);
    });

    it('has the expected methods', () => {
      expect(typeof mode.handleClick).toBe('function');
      expect(typeof mode.handlePointerMove).toBe('function');
      expect(typeof mode.handleStartDragging).toBe('function');
      expect(typeof mode.handleDragging).toBe('function');
      expect(typeof mode.handleStopDragging).toBe('function');
      expect(typeof mode.getGuides).toBe('function');
    });
  });

  describe('handleClick', () => {
    it('moves point to clicked location when clicking on empty space', () => {
      const onEdit = vi.fn();
      const props = createMockProps({ onEdit });
      const event = createMockClickEvent({
        mapCoords: [-122.5, 37.9],
        picks: [], // Empty picks = clicking on empty space
      });

      mode.handleClick(event, props);

      expect(onEdit).toHaveBeenCalledWith({
        updatedData: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'Point',
                coordinates: [-122.5, 37.9],
              },
            },
          ],
        },
        editType: 'translated',
        editContext: {
          featureIndexes: [0],
        },
      });
    });

    it('does not move point when clicking on the feature itself', () => {
      const onEdit = vi.fn();
      const props = createMockProps({ onEdit });
      const event = createMockClickEvent({
        picks: [{ featureIndex: 0 }], // Clicked on the point
      });

      mode.handleClick(event, props);

      expect(onEdit).not.toHaveBeenCalled();
    });

    it('does not move point when clicking on a guide', () => {
      const onEdit = vi.fn();
      const props = createMockProps({ onEdit });
      const event = createMockClickEvent({
        picks: [{ isGuide: true }], // Clicked on a guide
      });

      mode.handleClick(event, props);

      expect(onEdit).not.toHaveBeenCalled();
    });

    it('does nothing when no feature is selected', () => {
      const onEdit = vi.fn();
      const props = createMockProps({
        onEdit,
        selectedIndexes: [], // No selection
      });
      const event = createMockClickEvent();

      mode.handleClick(event, props);

      expect(onEdit).not.toHaveBeenCalled();
    });

    it('does nothing when selected feature does not exist', () => {
      const onEdit = vi.fn();
      const props = createMockProps({
        onEdit,
        data: {
          type: 'FeatureCollection',
          features: [], // Empty features array
        },
        selectedIndexes: [0],
      });
      const event = createMockClickEvent();

      mode.handleClick(event, props);

      expect(onEdit).not.toHaveBeenCalled();
    });

    it('emits translated edit type for compatibility with existing handlers', () => {
      const onEdit = vi.fn();
      const props = createMockProps({ onEdit });
      const event = createMockClickEvent();

      mode.handleClick(event, props);

      expect(onEdit).toHaveBeenCalledWith(
        expect.objectContaining({
          editType: 'translated',
        }),
      );
    });
  });

  describe('drag delegation', () => {
    it('delegates handleStartDragging to TranslateMode', () => {
      const props = createMockProps();
      const event = {
        picks: [{ featureIndex: 0 }],
        mapCoords: [0, 0],
        screenCoords: [0, 0],
        pointerDownMapCoords: [0, 0],
        pointerDownScreenCoords: [0, 0],
        sourceEvent: new MouseEvent('mousedown'),
        cancelPan: vi.fn(),
      };

      // Should not throw
      expect(() => {
        mode.handleStartDragging(event as never, props);
      }).not.toThrow();
    });

    it('delegates handleDragging to TranslateMode', () => {
      const props = createMockProps();
      const event = {
        picks: [],
        mapCoords: [1, 1],
        screenCoords: [100, 100],
        pointerDownMapCoords: [0, 0],
        pointerDownScreenCoords: [0, 0],
        sourceEvent: new MouseEvent('mousemove'),
        cancelPan: vi.fn(),
      };

      // Should not throw
      expect(() => {
        mode.handleDragging(event as never, props);
      }).not.toThrow();
    });

    it('delegates handleStopDragging to TranslateMode', () => {
      const props = createMockProps();
      const event = {
        picks: [],
        mapCoords: [1, 1],
        screenCoords: [100, 100],
        pointerDownMapCoords: [0, 0],
        pointerDownScreenCoords: [0, 0],
        sourceEvent: new MouseEvent('mouseup'),
        cancelPan: vi.fn(),
      };

      // Should not throw
      expect(() => {
        mode.handleStopDragging(event as never, props);
      }).not.toThrow();
    });
  });

  describe('getGuides', () => {
    it('delegates to TranslateMode for guide rendering', () => {
      const props = createMockProps();

      const guides = mode.getGuides(props);

      // TranslateMode returns a FeatureCollection for guides
      expect(guides).toHaveProperty('type', 'FeatureCollection');
      expect(guides).toHaveProperty('features');
    });
  });
});
