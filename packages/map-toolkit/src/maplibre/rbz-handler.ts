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

import { radiansToDegrees } from '@turf/helpers';
import { destination } from '@turf/turf';
import type { DistanceUnit } from '@accelint/constants/units';
import type {
  Handler,
  HandlerResult,
  LngLatLike,
  Map as MaplibreMap,
  Point,
} from 'maplibre-gl';

const DISTANCE_THRESHOLD = 3; // pixels

/**
 * Visual style options for the RBZ selection rectangle.
 */
export type RbzStyleOptions = {
  /** CSS color string for the rectangle border (e.g. `'#00B4FF'`). */
  borderColor: string;
  /** Border width in pixels. */
  borderWidth: number;
  /**
   * CSS color string for the rectangle fill.
   * Include alpha for transparency (e.g. `'rgba(0, 180, 255, 0.1)'`).
   */
  fillColor: string;
};

/**
 * The origin point from which the selection rectangle grows during a drag.
 *
 * - `'topLeft'` — The mousedown position anchors the top-left corner;
 *   the rectangle expands toward the cursor.
 * - `'center'` — The mousedown position anchors the center; the rectangle
 *   expands outward in all directions symmetrically.
 */
export type RbzOrigin = 'topLeft' | 'center';

/**
 * Geographic buffer applied around the selection bounds before fitting the
 * viewport. Useful for adding a margin around the selected area.
 */
export type RbzBuffer = {
  /** Numeric distance to expand each side. */
  amount: number;
  /** Distance unit compatible with Turf.js (e.g. `'nauticalmiles'`). */
  unit: DistanceUnit;
};

/**
 * Configuration options for {@link RbzHandler}.
 */
export type RbzOptions = {
  /**
   * Determines the origin point of the selection rectangle during drag.
   * @default 'topLeft'
   */
  origin?: RbzOrigin;
  /**
   * When `true`, the selection rectangle is constrained to the viewport's
   * aspect ratio. When `false`, any freeform rectangle is allowed.
   * @default false
   */
  constrainAspectRatio?: boolean;
  /**
   * Optional geographic buffer to expand the selection area before fitting
   * the viewport. When omitted, no buffer is applied.
   */
  buffer?: RbzBuffer;
  /**
   * Visual style overrides for the selection rectangle.
   * Unspecified properties fall back to {@link DEFAULT_RBZ_STYLE}.
   */
  style?: Partial<RbzStyleOptions>;
};

export const DEFAULT_RBZ_STYLE: RbzStyleOptions = {
  borderColor: '#00B4FF',
  borderWidth: 2,
  fillColor: 'rgba(0, 180, 255, 0.1)',
};

/**
 * A MapLibre GL handler that implements rubber-band zoom (RBZ): the user drags
 * a selection rectangle on the map and, on mouse release, the viewport fits to
 * that rectangle (plus an optional geographic buffer).
 *
 * Activation is **external** — call {@link enable} to arm the handler for one
 * gesture. The handler disables itself automatically after the gesture
 * completes or is cancelled via `Escape`.
 *
 * The handler creates its own absolutely-positioned overlay `<div>` and
 * appends it to the map container. No pre-existing HTML elements are required.
 *
 * @example
 * ```ts
 * const rbz = new RbzHandler(map, {
 *   origin: 'topLeft',
 *   buffer: { amount: 10, unit: 'nauticalmiles' },
 *   style: { borderColor: '#FF8C00' },
 * });
 *
 * map.addHandler('rbz', rbz);
 *
 * // Arm for the next drag gesture (e.g. from a hotkey or toolbar button):
 * hotkey.on('b', () => rbz.enable());
 * ```
 */
export class RbzHandler implements Handler {
  private readonly _map: MaplibreMap;
  private readonly _rbzBox: HTMLElement;
  private readonly _style: RbzStyleOptions;
  private readonly _origin: RbzOrigin;
  private readonly _constrainAspectRatio: boolean;
  private readonly _buffer: RbzBuffer | undefined;

  private _enabled: boolean;
  private _startPos: Point | undefined;
  private _rbzBounds: [[number, number], [number, number]] | undefined;
  private _aspectRatio: number;
  private _aspectRatioAngle: number;
  private _isDrawing: boolean;
  private _isSuppressingScrollZoom: boolean;
  private _boxIsVisible: boolean;

  constructor(map: MaplibreMap, options: RbzOptions = {}) {
    this._map = map;
    this._style = { ...DEFAULT_RBZ_STYLE, ...options.style };
    this._origin = options.origin ?? 'topLeft';
    this._constrainAspectRatio = options.constrainAspectRatio ?? false;
    this._buffer = options.buffer;

    this._enabled = false;
    this._startPos = undefined;
    this._rbzBounds = undefined;
    this._aspectRatio = 1;
    this._aspectRatioAngle = 45;
    this._isDrawing = false;
    this._isSuppressingScrollZoom = false;
    this._boxIsVisible = false;

    this._rbzBox = this._createSelectionBox();
    this._map.getContainer().appendChild(this._rbzBox);
  }

  isEnabled(): boolean {
    return this._enabled;
  }

  isActive(): boolean {
    return this._isDrawing;
  }

  /**
   * Arms the handler for one drag gesture. After the gesture completes (or is
   * cancelled with `Escape`), the handler disables itself automatically.
   */
  enable(): void {
    this._enabled = true;
  }

  /**
   * Disarms the handler immediately, restoring any suppressed scroll zoom and
   * hiding the selection rectangle.
   */
  disable(): void {
    this._enabled = false;
    this._restoreScrollZoom();
    this.reset();
  }

  /**
   * Clears in-progress gesture state and hides the selection rectangle.
   * Called automatically by MapLibre during camera transitions, so avoid
   * expensive DOM work here; changes are deferred via `requestAnimationFrame`.
   */
  reset(): void {
    this._startPos = undefined;
    this._rbzBounds = undefined;
    this._isDrawing = false;

    if (this._boxIsVisible) {
      requestAnimationFrame(() => {
        this._rbzBox.style.display = 'none';
        this._rbzBox.style.transform = 'translate(0px, 0px)';
        this._rbzBox.style.width = '0px';
        this._rbzBox.style.height = '0px';
      });
      this._boxIsVisible = false;
    }
  }

  mousedown(e: MouseEvent, point: Point): void {
    if (!this._enabled || e.button !== 0) {
      return;
    }

    this._startPos = point;
    this._isDrawing = false;

    // Recalculate aspect ratios here as a simple way to handle window resizes,
    // since no resize event exists in the MapLibre handler spec.
    if (this._constrainAspectRatio) {
      this._calculateAspectRatios();
    }

    this._suppressScrollZoom();
  }

  mousemove(_e: MouseEvent, point: Point): void {
    if (!this._enabled) {
      return;
    }

    if (!this._startPos) {
      return;
    }

    const p0 = this._startPos;
    const p1 = point;

    if (!this._isDrawing) {
      this._isDrawing = !p0.equals(p1) && p1.dist(p0) > DISTANCE_THRESHOLD;
    }

    const { left, top, width, height } = this._computeBoxGeometry(p0, p1);

    // Store bounds in screen-pixel space; unproject to LngLat on mouseup to
    // avoid per-frame geo calculations. MapLibre fitBounds expects [sw, ne].
    this._rbzBounds = [
      [left, top + height], // SW: bottom-left pixel
      [left + width, top], // NE: top-right pixel
    ];

    requestAnimationFrame(() => {
      this._rbzBox.style.display = 'block';
      this._rbzBox.style.opacity = this._isDrawing ? '1' : '0';
      this._rbzBox.style.transform = `translate(${left}px, ${top}px)`;
      this._rbzBox.style.width = `${width}px`;
      this._rbzBox.style.height = `${height}px`;
    });

    this._boxIsVisible = true;
  }

  mouseup(e: MouseEvent, _point: Point): HandlerResult | undefined {
    if (!this._enabled || e.button !== 0) {
      return;
    }

    const bounds = this._rbzBounds;
    const isDrawing = this._isDrawing;

    // Disable after one complete gesture; caller must re-enable for the next.
    this._enabled = false;
    this._restoreScrollZoom();
    this.reset();

    if (!isDrawing) {
      return;
    }

    if (!bounds) {
      return;
    }

    return {
      cameraAnimation: (map) => {
        const sw = map.unproject(bounds[0]);
        const ne = map.unproject(bounds[1]);
        const [fitSw, fitNe] = this._applyBuffer(sw, ne);

        map.fitBounds([fitSw, fitNe], {
          animate: true,
          essential: true,
          linear: true,
        });
      },
    };
  }

  keydown(e: KeyboardEvent): void {
    if (!this._enabled) {
      return;
    }

    if (e.code === 'Escape') {
      this._enabled = false;
      this._restoreScrollZoom();
      this.reset();
    }
  }

  private _createSelectionBox(): HTMLElement {
    const { borderColor, borderWidth, fillColor } = this._style;
    const box = document.createElement('div');

    box.style.position = 'absolute';
    box.style.top = '0px';
    box.style.left = '0px';
    box.style.pointerEvents = 'none';
    box.style.display = 'none';
    box.style.border = `${borderWidth}px solid ${borderColor}`;
    box.style.backgroundColor = fillColor;
    box.style.boxSizing = 'border-box';

    return box;
  }

  /**
   * Computes the CSS box geometry (position and size) for the selection
   * rectangle given the drag start and current cursor positions.
   */
  private _computeBoxGeometry(
    start: Point,
    current: Point,
  ): { left: number; top: number; width: number; height: number } {
    const deltaX = Math.abs(current.x - start.x);
    const deltaY = Math.abs(current.y - start.y);

    let width: number;
    let height: number;

    if (this._constrainAspectRatio) {
      const pointerAngle = radiansToDegrees(Math.atan2(deltaY, deltaX));

      if (pointerAngle >= this._aspectRatioAngle) {
        width = Math.round(deltaY * this._aspectRatio);
        height = Math.round(deltaY);
      } else {
        width = Math.round(deltaX);
        height = Math.round(deltaX / this._aspectRatio);
      }
    } else {
      width = Math.round(deltaX);
      height = Math.round(deltaY);
    }

    if (this._origin === 'center') {
      const halfWidth = width;
      const halfHeight = height;
      return {
        left: start.x - halfWidth,
        top: start.y - halfHeight,
        width: halfWidth * 2,
        height: halfHeight * 2,
      };
    }

    // topLeft origin: anchor the closest corner to the drag start, expand
    // toward the current cursor position in all four quadrants.
    return {
      left: current.x < start.x ? start.x - width : start.x,
      top: current.y < start.y ? start.y - height : start.y,
      width,
      height,
    };
  }

  /**
   * Expands a SW/NE bounding box outward by the configured buffer distance.
   * Returns the original pair unmodified when no buffer is configured.
   */
  private _applyBuffer(
    sw: { lng: number; lat: number },
    ne: { lng: number; lat: number },
  ): [LngLatLike, LngLatLike] {
    if (!this._buffer) {
      return [sw, ne];
    }

    const { amount, unit } = this._buffer;

    const expandedSw = destination([sw.lng, sw.lat], amount, 225, {
      units: unit,
    });
    const expandedNe = destination([ne.lng, ne.lat], amount, 45, {
      units: unit,
    });

    const [swLng, swLat] = expandedSw.geometry.coordinates as [number, number];
    const [neLng, neLat] = expandedNe.geometry.coordinates as [number, number];

    return [
      { lng: swLng, lat: swLat },
      { lng: neLng, lat: neLat },
    ];
  }

  private _calculateAspectRatios(): void {
    const container = this._map.getContainer();
    const width = container.clientWidth;
    const height = container.clientHeight;

    this._aspectRatio = width / height;
    this._aspectRatioAngle = 90 - radiansToDegrees(Math.atan(width / height));
  }

  private _suppressScrollZoom(): void {
    if (!this._isSuppressingScrollZoom) {
      this._map.scrollZoom?.disable();
      this._isSuppressingScrollZoom = true;
    }
  }

  private _restoreScrollZoom(): void {
    if (this._isSuppressingScrollZoom) {
      this._map.scrollZoom?.enable();
      this._isSuppressingScrollZoom = false;
    }
  }

  /**
   * Removes the selection overlay element from the map container.
   * Call this when the handler will no longer be used to avoid memory leaks.
   */
  destroy(): void {
    this.disable();
    this._rbzBox.remove();
  }
}
