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

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Viewport } from '@deck.gl/core';
import { getViewportBounds } from './viewport-utils';
import { Bounds, Unit } from '@ngageoint/grid-js';

vi.mock('@ngageoint/grid-js', () => ({
  Bounds: {
    bounds: vi.fn((minLon, minLat, maxLon, maxLat, unit) => ({
      minLon,
      minLat,
      maxLon,
      maxLat,
      unit,
    })),
  },
  Unit: { DEGREE: 'DEGREE' },
}));

const makeViewport = (
  zoom: number,
  width: number,
  height: number,
  unproject: (coords: number[]) => number[] | null,
): Viewport =>
  ({
    zoom,
    width,
    height,
    unproject,
  }) as unknown as Viewport;

describe('getViewportBounds', () => {
  beforeEach(() => {
    vi.mocked(Bounds.bounds).mockClear();
  });

  it('should return full bounds when viewport is wider than the world', () => {
    // worldPixelWidth = 512 * 2^0 = 512; viewport.width (512) >= worldPixelWidth
    const viewport = makeViewport(0, 512, 400, vi.fn());
    const result = getViewportBounds(viewport);
    expect(result).not.toBeNull();
    expect(vi.mocked(Bounds.bounds)).toHaveBeenCalledWith(
      -180,
      -80,
      180,
      84,
      Unit.DEGREE,
    );
  });

  it('should return computed bounds for a normal viewport', () => {
    const unproject = vi
      .fn()
      .mockReturnValueOnce([-10, 50]) // nw corner
      .mockReturnValueOnce([20, 30]); // se corner
    const viewport = makeViewport(7, 800, 600, unproject);

    const result = getViewportBounds(viewport);

    expect(result).not.toBeNull();
    // minLon = Math.min(-10, 20) = -10, maxLon = Math.max(-10, 20) = 20
    // minLat = Math.max(-80, Math.min(50, 30)) = 30, maxLat = Math.min(84, Math.max(50, 30)) = 50
    expect(vi.mocked(Bounds.bounds)).toHaveBeenCalledWith(
      -10,
      30,
      20,
      50,
      Unit.DEGREE,
    );
  });

  it('should return null when unproject returns null', () => {
    const unproject = vi.fn().mockReturnValue(null);
    const viewport = makeViewport(7, 800, 600, unproject);
    const result = getViewportBounds(viewport);
    expect(result).toBeUndefined();
  });

  it('should return null when unproject values are undefined', () => {
    const unproject = vi.fn().mockReturnValue([undefined, undefined]);
    const viewport = makeViewport(7, 800, 600, unproject);
    const result = getViewportBounds(viewport);
    expect(result).toBeUndefined();
  });

  it('should clamp to full longitude range when crossing the antimeridian', () => {
    // nwLon=170 > seLon=-170: antimeridian crossing → maxLon=190 > 180 → clamp
    const unproject = vi
      .fn()
      .mockReturnValueOnce([170, 50])
      .mockReturnValueOnce([-170, 30]);
    const viewport = makeViewport(7, 800, 600, unproject);

    getViewportBounds(viewport);

    expect(vi.mocked(Bounds.bounds)).toHaveBeenCalledWith(
      -180,
      30,
      180,
      50,
      Unit.DEGREE,
    );
  });

  it('should clamp latitude to valid MGRS range (-80 to 84)', () => {
    const unproject = vi
      .fn()
      .mockReturnValueOnce([0, 90]) // nwLat=90 → clamped to 84
      .mockReturnValueOnce([10, -90]); // seLat=-90 → clamped to -80
    const viewport = makeViewport(7, 800, 600, unproject);

    getViewportBounds(viewport);

    expect(vi.mocked(Bounds.bounds)).toHaveBeenCalledWith(
      0,
      -80,
      10,
      84,
      Unit.DEGREE,
    );
  });

  it('should return null when unproject throws', () => {
    const unproject = vi.fn().mockImplementation(() => {
      throw new Error('viewport error');
    });
    const viewport = makeViewport(7, 800, 600, unproject);
    const result = getViewportBounds(viewport);
    expect(result).toBeUndefined();
  });
});
