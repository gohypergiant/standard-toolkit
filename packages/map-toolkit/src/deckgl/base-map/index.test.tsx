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

import { uuid } from '@accelint/core';
import { act, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';
import { BaseMap, stripLockedMapLibreOptions } from './index';
import { LOCKED_MAP_LIBRE_OPTION_KEYS } from './types';
import type { MapOptions } from 'maplibre-gl';
import type { MapLibreOptions } from './types';

interface FakeMap {
  setProjection: Mock;
  isStyleLoaded: Mock;
}

function createFakeMap(): FakeMap {
  return {
    setProjection: vi.fn(),
    isStyleLoaded: vi.fn().mockReturnValue(false),
  };
}

let activeMap: FakeMap | null = null;
let capturedOnLoad: (() => void) | undefined;
let capturedMapProps: Record<string, unknown> | undefined;

function useFakeMap(map: FakeMap): void {
  activeMap = map;
}

function fireMapLoad(): void {
  capturedOnLoad?.();
}

// Mock react-map-gl/maplibre so tests can drive the MapLibre lifecycle
// (ref population + onLoad event) without a real WebGL context.
vi.mock('react-map-gl/maplibre', () => ({
  Map: ({
    children,
    onLoad,
    ref,
    ...rest
  }: {
    children?: React.ReactNode;
    onLoad?: () => void;
    ref?: { current: unknown };
  } & Record<string, unknown>) => {
    if (ref && typeof ref === 'object') {
      ref.current = { getMap: () => activeMap };
    }
    capturedOnLoad = onLoad;
    capturedMapProps = rest;

    return <div data-testid='maplibre-mock'>{children}</div>;
  },
  useControl: vi.fn(),
}));

beforeEach(() => {
  activeMap = null;
  capturedOnLoad = undefined;
  capturedMapProps = undefined;
});

describe('BaseMap', () => {
  it('should render without crashing when given a valid id', () => {
    useFakeMap(createFakeMap());

    render(<BaseMap id={uuid()} />);

    expect(screen.getByTestId('maplibre-mock')).toBeInTheDocument();
  });

  it('should apply className to the wrapping element', () => {
    useFakeMap(createFakeMap());

    render(<BaseMap className='custom-map-class' id={uuid()} />);

    const map = screen.getByTestId('maplibre-mock');

    expect(map.closest('.custom-map-class')).not.toBeNull();
  });

  it('should apply globe projection after MapLibre style loads when defaultView is 3D', () => {
    const fakeMap = createFakeMap();
    useFakeMap(fakeMap);

    render(<BaseMap id={uuid()} defaultView='3D' />);

    expect(fakeMap.setProjection).not.toHaveBeenCalled();

    act(() => {
      fakeMap.isStyleLoaded.mockReturnValue(true);
      fireMapLoad();
    });

    expect(fakeMap.setProjection).toHaveBeenCalledWith({ type: 'globe' });
  });

  it('should apply mercator projection after MapLibre style loads when defaultView is 2D', () => {
    const fakeMap = createFakeMap();
    useFakeMap(fakeMap);

    render(<BaseMap id={uuid()} defaultView='2D' />);

    act(() => {
      fakeMap.isStyleLoaded.mockReturnValue(true);
      fireMapLoad();
    });

    expect(fakeMap.setProjection).toHaveBeenCalledWith({ type: 'mercator' });
  });

  describe('mouse pitch/rotate gating by view', () => {
    // Only 2.5D permits mouse-driven rotate/pitch; 2D stays flat and 3D is a
    // fixed-orientation globe. `pitchWithRotate` is a constructor-only option
    // (react-map-gl never re-applies it), so it stays true in every view and is
    // inert outside 2.5D because the rotate handler + maxPitch are disabled there.
    it.each([
      {
        view: '2D' as const,
        expected: {
          dragRotate: false,
          pitchWithRotate: true,
          touchPitch: false,
          maxPitch: 0,
        },
      },
      {
        view: '2.5D' as const,
        expected: {
          dragRotate: true,
          pitchWithRotate: true,
          touchPitch: true,
          maxPitch: 85,
        },
      },
      {
        view: '3D' as const,
        expected: {
          dragRotate: false,
          pitchWithRotate: true,
          touchPitch: false,
          maxPitch: 0,
        },
      },
    ])('gates the rotate/pitch handlers and maxPitch for the $view view', ({
      view,
      expected,
    }) => {
      useFakeMap(createFakeMap());

      render(<BaseMap id={uuid()} defaultView={view} />);

      expect(capturedMapProps).toMatchObject(expected);
    });
  });
});

describe('stripLockedMapLibreOptions', () => {
  // Type alias for tests that need to inject keys outside the public
  // `MapLibreOptions` surface (which omits locked keys). Casts via `unknown`
  // are required to exercise the function's defensive behavior against
  // runtime inputs that include locked keys.
  type UnsafeInput = Partial<MapOptions>;

  it('should return an empty object when input is undefined', () => {
    const result = stripLockedMapLibreOptions(undefined);

    expect(result).toEqual({});
  });

  it('should return an empty object when input is empty', () => {
    const result = stripLockedMapLibreOptions({});

    expect(result).toEqual({});
  });

  it('should pass through non-locked keys unchanged', () => {
    const transformRequest: NonNullable<MapOptions['transformRequest']> = (
      url,
    ) => ({ url });
    const input: MapLibreOptions = {
      transformRequest,
      maxBounds: [
        [-130, 20],
        [-60, 55],
      ],
      minZoom: 2,
      maxZoom: 18,
      locale: { 'AttributionControl.ToggleAttribution': 'Toggle' },
    };

    const result = stripLockedMapLibreOptions(input);

    expect(result).toEqual(input);
  });

  it.each(
    LOCKED_MAP_LIBRE_OPTION_KEYS,
  )('should strip locked key %s', (lockedKey) => {
    const unsafe: UnsafeInput = { [lockedKey]: 'arbitrary' };
    const input = unsafe as unknown as MapLibreOptions;

    const result = stripLockedMapLibreOptions(input);

    expect(result).toEqual({});
  });

  it('should preserve reference equality for passthrough values', () => {
    const transformRequest: NonNullable<MapOptions['transformRequest']> = (
      url,
    ) => ({ url });

    const result = stripLockedMapLibreOptions({ transformRequest });

    expect(result.transformRequest).toBe(transformRequest);
  });

  it('should keep only passthrough keys when input mixes locked and passthrough', () => {
    const transformRequest: NonNullable<MapOptions['transformRequest']> = (
      url,
    ) => ({ url });
    const unsafe: UnsafeInput = {
      transformRequest,
      container: 'evil-container',
      zoom: 99,
      maxBounds: [
        [-130, 20],
        [-60, 55],
      ],
    };
    const input = unsafe as unknown as MapLibreOptions;

    const result = stripLockedMapLibreOptions(input);

    expect(result).toEqual({
      transformRequest,
      maxBounds: [
        [-130, 20],
        [-60, 55],
      ],
    });
  });

  it('should not mutate the input object', () => {
    const transformRequest: NonNullable<MapOptions['transformRequest']> = (
      url,
    ) => ({ url });
    const unsafe: UnsafeInput = { transformRequest, container: 'evil' };
    const input = unsafe as unknown as MapLibreOptions;
    const snapshot = { ...input };

    stripLockedMapLibreOptions(input);

    expect(input).toEqual(snapshot);
  });
});
