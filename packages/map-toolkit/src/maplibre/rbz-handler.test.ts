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

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_RBZ_STYLE, RbzHandler } from './rbz-handler';

// ---------------------------------------------------------------------------
// Fakes
// ---------------------------------------------------------------------------

function makePoint(x: number, y: number) {
  return {
    x,
    y,
    equals: (other: { x: number; y: number }) => x === other.x && y === other.y,
    dist: (other: { x: number; y: number }) =>
      Math.hypot(x - other.x, y - other.y),
  };
}

type FakePoint = ReturnType<typeof makePoint>;

/**
 * Minimal MapLibre map fake. Captures container div, scroll-zoom handler, and
 * any fitBounds/unproject calls so assertions can inspect them.
 */
function makeMap(containerWidth = 1920, containerHeight = 1080) {
  const container = document.createElement('div');
  Object.defineProperty(container, 'clientWidth', {
    get: () => containerWidth,
  });
  Object.defineProperty(container, 'clientHeight', {
    get: () => containerHeight,
  });

  const scrollZoom = {
    disable: vi.fn(),
    enable: vi.fn(),
  };

  const fitBounds = vi.fn();
  const unproject = vi.fn(([x, y]: [number, number]) => ({
    lng: x / 10,
    lat: y / 10,
  }));

  const map = {
    getContainer: () => container,
    // biome-ignore lint/style/useNamingConvention: mirrors MapLibre's internal handler API
    handlers: { _handlersById: { scrollZoom } },
    fitBounds,
    unproject,
  };

  return { map, container, scrollZoom, fitBounds, unproject };
}

function makeMouseEvent(button = 0): MouseEvent {
  return { button } as MouseEvent;
}

function makeKeyEvent(code: string): KeyboardEvent {
  return { code } as KeyboardEvent;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Simulates a complete drag gesture: mousedown → one or more mousemoves → mouseup.
 * Returns the HandlerResult from mouseup (if any).
 */
function simulateDrag(
  handler: RbzHandler,
  start: FakePoint,
  end: FakePoint,
  intermediate: FakePoint[] = [],
) {
  handler.mousedown(makeMouseEvent(), start as never);
  for (const pt of intermediate) {
    handler.mousemove(makeMouseEvent(), pt as never);
  }
  handler.mousemove(makeMouseEvent(), end as never);
  return handler.mouseup(makeMouseEvent(), end as never);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('RbzHandler', () => {
  describe('constructor', () => {
    it('should be disabled and inactive by default', () => {
      const { map } = makeMap();

      const handler = new RbzHandler(map as never);

      expect(handler.isEnabled()).toBe(false);
      expect(handler.isActive()).toBe(false);
    });

    it('should append a selection box div to the map container', () => {
      const { map, container } = makeMap();

      new RbzHandler(map as never);

      expect(container.children).toHaveLength(1);
    });

    it('should apply default style to the selection box', () => {
      const { map, container } = makeMap();

      new RbzHandler(map as never);

      const box = container.children[0] as HTMLElement;
      // jsdom normalizes hex colors to rgb() in shorthand border property
      expect(box.style.border).toContain('rgb(0, 180, 255)'); // #00B4FF
      expect(box.style.border).toContain(`${DEFAULT_RBZ_STYLE.borderWidth}px`);
      expect(box.style.backgroundColor).toBe(DEFAULT_RBZ_STYLE.fillColor);
      expect(box.style.display).toBe('none');
    });

    it('should apply custom style overrides', () => {
      const { map, container } = makeMap();

      new RbzHandler(map as never, {
        style: { borderColor: '#FF0000', borderWidth: 4 },
      });

      const box = container.children[0] as HTMLElement;
      // jsdom normalizes hex to rgb() in the border shorthand
      expect(box.style.border).toContain('rgb(255, 0, 0)'); // #FF0000
      expect(box.style.border).toContain('4px');
      // fillColor should still be the default
      expect(box.style.backgroundColor).toBe(DEFAULT_RBZ_STYLE.fillColor);
    });
  });

  describe('enable / disable', () => {
    it('should enable the handler', () => {
      const { map } = makeMap();
      const handler = new RbzHandler(map as never);

      handler.enable();

      expect(handler.isEnabled()).toBe(true);
    });

    it('should disable the handler', () => {
      const { map } = makeMap();
      const handler = new RbzHandler(map as never);

      handler.enable();
      handler.disable();

      expect(handler.isEnabled()).toBe(false);
    });

    it('should restore scroll zoom when disabled with a drag in progress', () => {
      const { map, scrollZoom } = makeMap();
      const handler = new RbzHandler(map as never);

      handler.enable();
      handler.mousedown(makeMouseEvent(), makePoint(100, 100) as never);
      handler.disable();

      expect(scrollZoom.enable).toHaveBeenCalledOnce();
    });
  });

  describe('mousedown', () => {
    it('should do nothing when disabled', () => {
      const { map, scrollZoom } = makeMap();
      const handler = new RbzHandler(map as never);

      handler.mousedown(makeMouseEvent(), makePoint(100, 100) as never);

      expect(scrollZoom.disable).not.toHaveBeenCalled();
    });

    it('should do nothing for non-primary mouse buttons', () => {
      const { map, scrollZoom } = makeMap();
      const handler = new RbzHandler(map as never);

      handler.enable();
      handler.mousedown(makeMouseEvent(2), makePoint(100, 100) as never);

      expect(scrollZoom.disable).not.toHaveBeenCalled();
    });

    it('should suppress scroll zoom on primary click when enabled', () => {
      const { map, scrollZoom } = makeMap();
      const handler = new RbzHandler(map as never);

      handler.enable();
      handler.mousedown(makeMouseEvent(), makePoint(100, 100) as never);

      expect(scrollZoom.disable).toHaveBeenCalledOnce();
    });

    it('should reset _isDrawing to false on each new mousedown', () => {
      const { map } = makeMap();
      const handler = new RbzHandler(map as never);

      handler.enable();
      // First gesture — draw something
      simulateDrag(handler, makePoint(100, 100), makePoint(200, 200));

      // Re-enable and start a new mousedown before moving
      handler.enable();
      handler.mousedown(makeMouseEvent(), makePoint(50, 50) as never);

      expect(handler.isActive()).toBe(false);
    });

    it('should suppress scroll zoom only once when mousedown fires multiple times', () => {
      const { map, scrollZoom } = makeMap();
      const handler = new RbzHandler(map as never);

      handler.enable();
      handler.mousedown(makeMouseEvent(), makePoint(100, 100) as never);
      handler.mousedown(makeMouseEvent(), makePoint(110, 110) as never);

      expect(scrollZoom.disable).toHaveBeenCalledOnce();
    });
  });

  describe('mousemove', () => {
    it('should do nothing when disabled', () => {
      const { map } = makeMap();
      const handler = new RbzHandler(map as never);

      handler.mousemove(makeMouseEvent(), makePoint(200, 200) as never);

      expect(handler.isActive()).toBe(false);
    });

    it('should not activate when no mousedown has occurred', () => {
      const { map } = makeMap();
      const handler = new RbzHandler(map as never);

      handler.enable();
      handler.mousemove(makeMouseEvent(), makePoint(200, 200) as never);

      expect(handler.isActive()).toBe(false);
    });

    it('should not set isDrawing when cursor is within the distance threshold', () => {
      const { map } = makeMap();
      const handler = new RbzHandler(map as never);

      handler.enable();
      handler.mousedown(makeMouseEvent(), makePoint(100, 100) as never);
      // 2px diagonal — below DISTANCE_THRESHOLD of 3
      handler.mousemove(makeMouseEvent(), makePoint(101, 101) as never);

      expect(handler.isActive()).toBe(false);
    });

    it('should set isDrawing when cursor exceeds the distance threshold', () => {
      const { map } = makeMap();
      const handler = new RbzHandler(map as never);

      handler.enable();
      handler.mousedown(makeMouseEvent(), makePoint(100, 100) as never);
      handler.mousemove(makeMouseEvent(), makePoint(150, 150) as never);

      expect(handler.isActive()).toBe(true);
    });
  });

  describe('mouseup', () => {
    it('should do nothing when disabled', () => {
      const { map } = makeMap();
      const handler = new RbzHandler(map as never);

      const result = handler.mouseup(
        makeMouseEvent(),
        makePoint(200, 200) as never,
      );

      expect(result).toBeUndefined();
    });

    it('should do nothing for non-primary mouse buttons', () => {
      const { map } = makeMap();
      const handler = new RbzHandler(map as never);

      handler.enable();
      handler.mousedown(makeMouseEvent(), makePoint(100, 100) as never);
      handler.mousemove(makeMouseEvent(), makePoint(200, 200) as never);

      const result = handler.mouseup(
        makeMouseEvent(2),
        makePoint(200, 200) as never,
      );

      expect(result).toBeUndefined();
    });

    it('should return undefined when the cursor did not move enough to draw', () => {
      const { map } = makeMap();
      const handler = new RbzHandler(map as never);

      handler.enable();
      // Click without meaningful drag
      const result = simulateDrag(
        handler,
        makePoint(100, 100),
        makePoint(101, 100),
      );

      expect(result).toBeUndefined();
    });

    it('should return a cameraAnimation when a valid drag is completed', () => {
      const { map } = makeMap();
      const handler = new RbzHandler(map as never);

      handler.enable();
      const result = simulateDrag(
        handler,
        makePoint(100, 100),
        makePoint(200, 200),
      );

      expect(result).toMatchObject({ cameraAnimation: expect.any(Function) });
    });

    it('should call map.fitBounds inside the cameraAnimation callback', () => {
      const { map, fitBounds } = makeMap();
      const handler = new RbzHandler(map as never);

      handler.enable();
      const result = simulateDrag(
        handler,
        makePoint(100, 100),
        makePoint(200, 200),
      );

      result?.cameraAnimation?.(map as never);

      expect(fitBounds).toHaveBeenCalledOnce();
    });

    it('should disable itself after a completed gesture', () => {
      const { map } = makeMap();
      const handler = new RbzHandler(map as never);

      handler.enable();
      simulateDrag(handler, makePoint(100, 100), makePoint(200, 200));

      expect(handler.isEnabled()).toBe(false);
    });

    it('should disable itself after a click (no real drag)', () => {
      const { map } = makeMap();
      const handler = new RbzHandler(map as never);

      handler.enable();
      simulateDrag(handler, makePoint(100, 100), makePoint(101, 100));

      expect(handler.isEnabled()).toBe(false);
    });

    it('should restore scroll zoom on mouseup', () => {
      const { map, scrollZoom } = makeMap();
      const handler = new RbzHandler(map as never);

      handler.enable();
      simulateDrag(handler, makePoint(100, 100), makePoint(200, 200));

      expect(scrollZoom.enable).toHaveBeenCalledOnce();
    });
  });

  describe('keydown', () => {
    it('should do nothing when disabled', () => {
      const { map } = makeMap();
      const handler = new RbzHandler(map as never);

      handler.keydown(makeKeyEvent('Escape'));

      expect(handler.isEnabled()).toBe(false);
    });

    it('should cancel an in-progress drag on Escape', () => {
      const { map, scrollZoom } = makeMap();
      const handler = new RbzHandler(map as never);

      handler.enable();
      handler.mousedown(makeMouseEvent(), makePoint(100, 100) as never);
      handler.mousemove(makeMouseEvent(), makePoint(200, 200) as never);

      handler.keydown(makeKeyEvent('Escape'));

      expect(handler.isEnabled()).toBe(false);
      expect(handler.isActive()).toBe(false);
      expect(scrollZoom.enable).toHaveBeenCalledOnce();
    });

    it('should ignore non-Escape keys', () => {
      const { map } = makeMap();
      const handler = new RbzHandler(map as never);

      handler.enable();
      handler.keydown(makeKeyEvent('Enter'));

      expect(handler.isEnabled()).toBe(true);
    });
  });

  describe('reset', () => {
    it('should clear drawing state', () => {
      const { map } = makeMap();
      const handler = new RbzHandler(map as never);

      handler.enable();
      handler.mousedown(makeMouseEvent(), makePoint(100, 100) as never);
      handler.mousemove(makeMouseEvent(), makePoint(200, 200) as never);

      handler.reset();

      expect(handler.isActive()).toBe(false);
    });

    it("should not restore scroll zoom (scroll zoom is the caller's responsibility)", () => {
      // reset() is invoked by MapLibre during any camera transition, including
      // non-RBZ ones. It must not blindly re-enable scroll zoom.
      const { map, scrollZoom } = makeMap();
      const handler = new RbzHandler(map as never);

      handler.enable();
      handler.mousedown(makeMouseEvent(), makePoint(100, 100) as never);
      // scroll zoom is now suppressed
      expect(scrollZoom.disable).toHaveBeenCalledOnce();

      // reset() is called by the map during a camera transition
      handler.reset();

      // enable was NOT called — scroll zoom should still be suppressed
      expect(scrollZoom.enable).not.toHaveBeenCalled();
    });
  });

  describe('origin option', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should place the box from the top-left by default (topLeft origin)', async () => {
      const { map, container } = makeMap();
      const handler = new RbzHandler(map as never);

      handler.enable();
      handler.mousedown(makeMouseEvent(), makePoint(100, 100) as never);
      // Drag right and down
      handler.mousemove(makeMouseEvent(), makePoint(200, 200) as never);

      // flush rAF
      await vi.runAllTimersAsync();

      const box = container.children[0] as HTMLElement;
      // Box should be anchored at start (100,100) and extend to (200,200)
      expect(box.style.transform).toBe('translate(100px, 100px)');
      expect(box.style.width).toBe('100px');
      expect(box.style.height).toBe('100px');
    });

    it('should place the box from the top-left when dragging up-left (topLeft origin)', async () => {
      const { map, container } = makeMap();
      const handler = new RbzHandler(map as never);

      handler.enable();
      handler.mousedown(makeMouseEvent(), makePoint(200, 200) as never);
      // Drag up and left
      handler.mousemove(makeMouseEvent(), makePoint(100, 100) as never);

      await vi.runAllTimersAsync();

      const box = container.children[0] as HTMLElement;
      // Box extends from (100,100) to (200,200) — upper-left corner at (100,100)
      expect(box.style.transform).toBe('translate(100px, 100px)');
      expect(box.style.width).toBe('100px');
      expect(box.style.height).toBe('100px');
    });

    it('should place the box from the center when origin is center', async () => {
      const { map, container } = makeMap();
      const handler = new RbzHandler(map as never, { origin: 'center' });

      handler.enable();
      handler.mousedown(makeMouseEvent(), makePoint(200, 200) as never);
      // Move 50px right and 30px down → half-widths
      handler.mousemove(makeMouseEvent(), makePoint(250, 230) as never);

      await vi.runAllTimersAsync();

      const box = container.children[0] as HTMLElement;
      // Width = deltaX * 2 = 100; Height = deltaY * 2 = 60
      expect(box.style.transform).toBe('translate(150px, 170px)');
      expect(box.style.width).toBe('100px');
      expect(box.style.height).toBe('60px');
    });
  });

  describe('constrainAspectRatio option', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should constrain the rectangle to the viewport aspect ratio when enabled', async () => {
      // 1920×1080 = 16:9 aspect ratio
      const { map, container } = makeMap(1920, 1080);
      const handler = new RbzHandler(map as never, {
        constrainAspectRatio: true,
      });

      handler.enable();
      handler.mousedown(makeMouseEvent(), makePoint(100, 100) as never);
      // Drag a wide rectangle — deltaX=200, deltaY=10 → pointer angle is ~3°, below threshold
      handler.mousemove(makeMouseEvent(), makePoint(300, 110) as never);

      await vi.runAllTimersAsync();

      const box = container.children[0] as HTMLElement;
      const width = Number.parseInt(box.style.width, 10);
      const height = Number.parseInt(box.style.height, 10);

      // The ratio width/height should approximate the viewport ratio (1.78)
      expect(width / height).toBeCloseTo(1920 / 1080, 1);
    });

    it('should allow freeform rectangles when constrainAspectRatio is false (default)', async () => {
      const { map, container } = makeMap(1920, 1080);
      const handler = new RbzHandler(map as never);

      handler.enable();
      handler.mousedown(makeMouseEvent(), makePoint(100, 100) as never);
      handler.mousemove(makeMouseEvent(), makePoint(300, 150) as never);

      await vi.runAllTimersAsync();

      const box = container.children[0] as HTMLElement;
      expect(box.style.width).toBe('200px');
      expect(box.style.height).toBe('50px');
    });
  });

  describe('buffer option', () => {
    it('should expand SW/NE bounds before fitBounds when buffer is configured', () => {
      const { map, fitBounds, unproject } = makeMap();
      const handler = new RbzHandler(map as never, {
        buffer: { amount: 10, unit: 'kilometers' },
      });

      handler.enable();
      const result = simulateDrag(
        handler,
        makePoint(100, 100),
        makePoint(300, 300),
      );
      result?.cameraAnimation?.(map as never);

      expect(unproject).toHaveBeenCalledTimes(2);
      expect(fitBounds).toHaveBeenCalledOnce();

      // fitBounds([sw, ne], opts) → calls[0][0] is the [sw, ne] array
      const [sw, ne] = fitBounds.mock.calls[0]?.[0] as [
        { lng: number; lat: number },
        { lng: number; lat: number },
      ];

      // The fake unproject returns {lng: x/10, lat: y/10}.
      // Pixel SW = bottom-left = [100, 300] → {lng: 10, lat: 30}
      // After 10km SW buffer (bearing 225°), lng and lat should decrease.
      expect(sw.lng).toBeLessThan(10);
      expect(sw.lat).toBeLessThan(30);

      // Pixel NE = top-right = [300, 100] → {lng: 30, lat: 10}
      // After 10km NE buffer (bearing 45°), lng and lat should increase.
      expect(ne.lng).toBeGreaterThan(30);
      expect(ne.lat).toBeGreaterThan(10);
    });

    it('should not modify bounds when no buffer is configured', () => {
      const { map, fitBounds, unproject } = makeMap();
      const handler = new RbzHandler(map as never);

      handler.enable();
      const result = simulateDrag(
        handler,
        makePoint(100, 100),
        makePoint(300, 300),
      );
      result?.cameraAnimation?.(map as never);

      expect(unproject).toHaveBeenCalledTimes(2);
      const [sw, ne] = fitBounds.mock.calls[0]?.[0] as [
        { lng: number; lat: number },
        { lng: number; lat: number },
      ];

      // No buffer — values should be exactly what unproject returned
      // SW pixel = [100, 300] → {lng: 10, lat: 30}
      expect(sw).toStrictEqual({ lng: 10, lat: 30 });
      // NE pixel = [300, 100] → {lng: 30, lat: 10}
      expect(ne).toStrictEqual({ lng: 30, lat: 10 });
    });
  });

  describe('destroy', () => {
    it('should remove the selection box from the container', () => {
      const { map, container } = makeMap();
      const handler = new RbzHandler(map as never);

      expect(container.children).toHaveLength(1);

      handler.destroy();

      expect(container.children).toHaveLength(0);
    });

    it('should disable the handler on destroy', () => {
      const { map } = makeMap();
      const handler = new RbzHandler(map as never);

      handler.enable();
      handler.destroy();

      expect(handler.isEnabled()).toBe(false);
    });
  });

  describe('fitBounds arguments', () => {
    it('should call fitBounds with animate, essential, and linear options', () => {
      const { map, fitBounds } = makeMap();
      const handler = new RbzHandler(map as never);

      handler.enable();
      const result = simulateDrag(
        handler,
        makePoint(100, 100),
        makePoint(200, 200),
      );
      result?.cameraAnimation?.(map as never);

      expect(fitBounds).toHaveBeenCalledWith(
        expect.any(Array),
        expect.objectContaining({
          animate: true,
          essential: true,
          linear: true,
        }),
      );
    });
  });
});
