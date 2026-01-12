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
import { ShapeFeatureType } from '../../shared/types';
import { DrawCircleModeWithTooltip } from './draw-circle-mode-with-tooltip';
import { DrawEllipseModeWithTooltip } from './draw-ellipse-mode-with-tooltip';
import { DrawLineStringModeWithTooltip } from './draw-line-string-mode-with-tooltip';
import { DrawPolygonModeWithTooltip } from './draw-polygon-mode-with-tooltip';
import { DrawRectangleModeWithTooltip } from './draw-rectangle-mode-with-tooltip';
import {
  getModeInstance,
  getViewModeInstance,
  triggerDoubleClickFinish,
} from './index';

describe('Draw Mode Classes', () => {
  describe('DrawCircleModeWithTooltip', () => {
    let mode: DrawCircleModeWithTooltip;

    beforeEach(() => {
      mode = new DrawCircleModeWithTooltip();
    });

    it('returns empty tooltips when not drawing', () => {
      expect(mode.getTooltips()).toEqual([]);
    });

    it('extends DrawCircleFromCenterMode', () => {
      // Verify the class has the expected parent methods
      expect(typeof mode.handleClick).toBe('function');
      expect(typeof mode.handlePointerMove).toBe('function');
      expect(typeof mode.getTooltips).toBe('function');
      expect(typeof mode.getClickSequence).toBe('function');
    });
  });

  describe('DrawPolygonModeWithTooltip', () => {
    let mode: DrawPolygonModeWithTooltip;

    beforeEach(() => {
      mode = new DrawPolygonModeWithTooltip();
    });

    it('returns empty tooltips when not drawing', () => {
      expect(mode.getTooltips()).toEqual([]);
    });

    it('extends DrawPolygonMode', () => {
      expect(typeof mode.handleClick).toBe('function');
      expect(typeof mode.handlePointerMove).toBe('function');
      expect(typeof mode.getTooltips).toBe('function');
      expect(typeof mode.getClickSequence).toBe('function');
    });

    it('has handleDoubleClick method for finish workaround', () => {
      expect(typeof mode.handleDoubleClick).toBe('function');
    });

    it('handleDoubleClick does nothing when no props stored', () => {
      // Should not throw when called without prior handleClick
      expect(() => mode.handleDoubleClick()).not.toThrow();
    });
  });

  describe('DrawLineStringModeWithTooltip', () => {
    let mode: DrawLineStringModeWithTooltip;

    beforeEach(() => {
      mode = new DrawLineStringModeWithTooltip();
    });

    it('returns empty tooltips when not drawing', () => {
      expect(mode.getTooltips()).toEqual([]);
    });

    it('extends DrawLineStringMode', () => {
      expect(typeof mode.handleClick).toBe('function');
      expect(typeof mode.handlePointerMove).toBe('function');
      expect(typeof mode.getTooltips).toBe('function');
      expect(typeof mode.getClickSequence).toBe('function');
    });

    it('has handleDoubleClick method for finish workaround', () => {
      expect(typeof mode.handleDoubleClick).toBe('function');
    });
  });

  describe('DrawRectangleModeWithTooltip', () => {
    let mode: DrawRectangleModeWithTooltip;

    beforeEach(() => {
      mode = new DrawRectangleModeWithTooltip();
    });

    it('returns empty tooltips when not drawing', () => {
      expect(mode.getTooltips()).toEqual([]);
    });

    it('extends DrawRectangleMode', () => {
      expect(typeof mode.handleClick).toBe('function');
      expect(typeof mode.handlePointerMove).toBe('function');
      expect(typeof mode.getTooltips).toBe('function');
      expect(typeof mode.getClickSequence).toBe('function');
    });
  });

  describe('DrawEllipseModeWithTooltip', () => {
    let mode: DrawEllipseModeWithTooltip;

    beforeEach(() => {
      mode = new DrawEllipseModeWithTooltip();
    });

    it('returns empty tooltips when not drawing', () => {
      expect(mode.getTooltips()).toEqual([]);
    });

    it('extends DrawEllipseByBoundingBoxMode', () => {
      expect(typeof mode.handleClick).toBe('function');
      expect(typeof mode.handlePointerMove).toBe('function');
      expect(typeof mode.getTooltips).toBe('function');
      expect(typeof mode.getClickSequence).toBe('function');
    });
  });
});

describe('Mode Instance Functions', () => {
  describe('getModeInstance', () => {
    it('returns cached mode instance for Circle', () => {
      const mode1 = getModeInstance(ShapeFeatureType.Circle);
      const mode2 = getModeInstance(ShapeFeatureType.Circle);

      expect(mode1).toBe(mode2);
      expect(mode1).toBeInstanceOf(DrawCircleModeWithTooltip);
    });

    it('returns cached mode instance for Polygon', () => {
      const mode1 = getModeInstance(ShapeFeatureType.Polygon);
      const mode2 = getModeInstance(ShapeFeatureType.Polygon);

      expect(mode1).toBe(mode2);
      expect(mode1).toBeInstanceOf(DrawPolygonModeWithTooltip);
    });

    it('returns cached mode instance for Rectangle', () => {
      const mode1 = getModeInstance(ShapeFeatureType.Rectangle);
      const mode2 = getModeInstance(ShapeFeatureType.Rectangle);

      expect(mode1).toBe(mode2);
      expect(mode1).toBeInstanceOf(DrawRectangleModeWithTooltip);
    });

    it('returns cached mode instance for LineString', () => {
      const mode1 = getModeInstance(ShapeFeatureType.LineString);
      const mode2 = getModeInstance(ShapeFeatureType.LineString);

      expect(mode1).toBe(mode2);
      expect(mode1).toBeInstanceOf(DrawLineStringModeWithTooltip);
    });

    it('returns cached mode instance for Ellipse', () => {
      const mode1 = getModeInstance(ShapeFeatureType.Ellipse);
      const mode2 = getModeInstance(ShapeFeatureType.Ellipse);

      expect(mode1).toBe(mode2);
      expect(mode1).toBeInstanceOf(DrawEllipseModeWithTooltip);
    });
  });

  describe('getViewModeInstance', () => {
    it('returns cached ViewMode instance', () => {
      const mode1 = getViewModeInstance();
      const mode2 = getViewModeInstance();

      expect(mode1).toBe(mode2);
    });
  });

  describe('triggerDoubleClickFinish', () => {
    it('calls handleDoubleClick on Polygon mode', () => {
      const polygonMode = getModeInstance(
        ShapeFeatureType.Polygon,
      ) as DrawPolygonModeWithTooltip;
      const spy = vi.spyOn(polygonMode, 'handleDoubleClick');

      triggerDoubleClickFinish(ShapeFeatureType.Polygon);

      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });

    it('calls handleDoubleClick on LineString mode', () => {
      const lineMode = getModeInstance(
        ShapeFeatureType.LineString,
      ) as DrawLineStringModeWithTooltip;
      const spy = vi.spyOn(lineMode, 'handleDoubleClick');

      triggerDoubleClickFinish(ShapeFeatureType.LineString);

      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });

    it('does not throw for Circle mode (no double-click finish)', () => {
      expect(() => {
        triggerDoubleClickFinish(ShapeFeatureType.Circle);
      }).not.toThrow();
    });

    it('does not throw for Rectangle mode (no double-click finish)', () => {
      expect(() => {
        triggerDoubleClickFinish(ShapeFeatureType.Rectangle);
      }).not.toThrow();
    });
  });
});
