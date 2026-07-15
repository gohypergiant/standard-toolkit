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
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  type Mock,
  vi,
} from 'vitest';
import { cameraStore, clearCameraState } from '../../camera/store';
import { BaseMap, stripLockedMapLibreOptions } from './index';
import { LOCKED_MAP_LIBRE_OPTION_KEYS } from './types';
import type { MapOptions } from 'maplibre-gl';
import type { MjolnirGestureEvent } from 'mjolnir.js';
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

type DragHandler = (info: unknown, event: MjolnirGestureEvent) => void;

let activeMap: FakeMap | null = null;
let capturedOnLoad: (() => void) | undefined;
let capturedMapProps: Record<string, unknown> | undefined;
let capturedDragHandlers: {
  onDragStart?: DragHandler;
  onDrag?: DragHandler;
  onDragEnd?: DragHandler;
} = {};

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

// Mock the deck.gl fiber renderer so tests can drive the drag lifecycle
// (onDragStart/onDrag/onDragEnd) without a real Deck.gl/WebGL instance.
vi.mock('@deckgl-fiber-renderer/dom', () => ({
  Deckgl: ({
    children,
    onDragStart,
    onDrag,
    onDragEnd,
  }: {
    children?: React.ReactNode;
    onDragStart?: DragHandler;
    onDrag?: DragHandler;
    onDragEnd?: DragHandler;
  }) => {
    capturedDragHandlers = { onDragStart, onDrag, onDragEnd };

    return <div data-testid='deckgl-mock'>{children}</div>;
  },
  useDeckgl: () => ({}),
}));

beforeEach(() => {
  activeMap = null;
  capturedOnLoad = undefined;
  capturedMapProps = undefined;
  capturedDragHandlers = {};
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

  describe('mouse tilt drag orchestration', () => {
    // Build the minimal gesture-event shape the tilt handlers read: buttons,
    // cumulative deltas, and the modifier on the wrapped `srcEvent`.
    function tiltEvent(
      overrides: Partial<{
        leftButton: boolean;
        rightButton: boolean;
        deltaX: number;
        deltaY: number;
        ctrlKey: boolean;
      }> = {},
    ): MjolnirGestureEvent {
      const {
        leftButton = false,
        rightButton = false,
        deltaX = 0,
        deltaY = 0,
        ctrlKey = false,
      } = overrides;

      return {
        leftButton,
        rightButton,
        deltaX,
        deltaY,
        srcEvent: { ctrlKey },
      } as unknown as MjolnirGestureEvent;
    }

    // Run any frame the drag handler scheduled. The handlers coalesce camera
    // updates into a `requestAnimationFrame`, so a drag has no effect until a
    // frame fires; faking it keeps the test synchronous and deterministic.
    let scheduledFrame: FrameRequestCallback | null = null;

    beforeEach(() => {
      scheduledFrame = null;
      vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
        scheduledFrame = cb;

        return 1;
      });
      vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {
        scheduledFrame = null;
      });
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    function runScheduledFrame(): void {
      act(() => {
        scheduledFrame?.(performance.now());
      });
    }

    it('promotes a flat 2D view to 2.5D on a right-drag tilt', () => {
      const id = uuid();
      useFakeMap(createFakeMap());

      render(<BaseMap id={id} defaultView='2D' />);

      act(() => {
        capturedDragHandlers.onDragStart?.(
          {},
          tiltEvent({ rightButton: true }),
        );
      });

      expect(cameraStore.get(id).view).toBe('2.5D');

      clearCameraState(id);
    });

    it('rotates and pitches the camera on a right-drag, applied on the next frame', () => {
      const id = uuid();
      useFakeMap(createFakeMap());

      render(<BaseMap id={id} defaultView='2.5D' />);

      // 2.5D initializes at pitch 60, so the drag continues from that baseline.
      act(() => {
        capturedDragHandlers.onDragStart?.(
          {},
          tiltEvent({ rightButton: true }),
        );
        // rotation 0 + 40 * 0.5 = 20; pitch 60 - (-30 * 0.5) = 75
        capturedDragHandlers.onDrag?.(
          {},
          tiltEvent({ rightButton: true, deltaX: 40, deltaY: -30 }),
        );
      });

      // Nothing applied until the coalescing frame fires.
      expect(cameraStore.get(id).rotation).toBe(0);

      runScheduledFrame();

      expect(cameraStore.get(id).rotation).toBe(20);
      expect(cameraStore.get(id).pitch).toBe(75);

      clearCameraState(id);
    });

    it('leaves the camera untouched on a plain left-drag pan', () => {
      const id = uuid();
      useFakeMap(createFakeMap());

      render(<BaseMap id={id} defaultView='2.5D' />);

      act(() => {
        capturedDragHandlers.onDragStart?.({}, tiltEvent({ leftButton: true }));
        capturedDragHandlers.onDrag?.(
          {},
          tiltEvent({ leftButton: true, deltaX: 40, deltaY: -30 }),
        );
      });
      runScheduledFrame();

      expect(cameraStore.get(id).rotation).toBe(0);
      expect(cameraStore.get(id).view).toBe('2.5D');

      clearCameraState(id);
    });

    it('flushes the last pending angle on drag end even if no frame fired', () => {
      const id = uuid();
      useFakeMap(createFakeMap());

      render(<BaseMap id={id} defaultView='2.5D' />);

      act(() => {
        capturedDragHandlers.onDragStart?.(
          {},
          tiltEvent({ rightButton: true }),
        );
        capturedDragHandlers.onDrag?.(
          {},
          tiltEvent({ rightButton: true, deltaX: 20, deltaY: 0 }),
        );
        // End the drag before the scheduled frame runs; the flush must still land.
        capturedDragHandlers.onDragEnd?.(
          {},
          tiltEvent({ rightButton: true, deltaX: 20, deltaY: 0 }),
        );
      });

      expect(cameraStore.get(id).rotation).toBe(10);

      clearCameraState(id);
    });
  });

  describe('mouse pitch/rotate gating by view', () => {
    // MapLibre's own rotate/pitch handlers stay disabled in every view — the
    // camera is driven through the store from the deck.gl `onDrag` handler. Only
    // `maxPitch` varies by view: it opens to 85° in 2.5D (so the store-driven
    // pitch can apply) and stays clamped to 0 in flat 2D and fixed-orientation 3D.
    it.each([
      { view: '2D' as const, maxPitch: 0 },
      { view: '2.5D' as const, maxPitch: 85 },
      { view: '3D' as const, maxPitch: 0 },
    ])('keeps MapLibre rotate/pitch off and sets maxPitch for the $view view', ({
      view,
      maxPitch,
    }) => {
      useFakeMap(createFakeMap());

      render(<BaseMap id={uuid()} defaultView={view} />);

      expect(capturedMapProps).toMatchObject({
        dragRotate: false,
        pitchWithRotate: false,
        maxPitch,
      });
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
