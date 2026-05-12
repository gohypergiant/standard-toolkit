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
import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { BaseMap, stripLockedMapLibreOptions } from './index';
import { LOCKED_MAP_LIBRE_OPTION_KEYS } from './types';
import type { MapOptions } from 'maplibre-gl';
import type { MapLibreOptions } from './types';

// Mock MapLibre hook since it requires browser APIs
vi.mock('../../maplibre/hooks/use-maplibre', () => ({
  useMapLibre: vi.fn(),
}));

describe('BaseMap', () => {
  it('should render without crashing when given a valid id', () => {
    const { container } = render(<BaseMap id={uuid()} />);

    expect(container.firstChild).toBeInTheDocument();
  });

  it('should apply className to the root element', () => {
    const { container } = render(
      <BaseMap className='custom-map-class' id={uuid()} />,
    );

    expect(container.firstChild).toHaveClass('custom-map-class');
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
