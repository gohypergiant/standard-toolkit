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

import { describe, expect, it } from 'vitest';
import { MAP_INTERACTION } from '../constants';
import {
  getIconConfig,
  getIconLayerProps,
  getIconUpdateTriggers,
} from './icon-config';
import type { Shape } from '../../shared/types';

/** Create a minimal feature with optional icon config. */
function createFeature(
  icon?: Shape['feature']['properties']['styleProperties']['icon'],
): Shape['feature'] {
  return {
    type: 'Feature',
    properties: {
      styleProperties: {
        fillColor: [255, 255, 255, 255],
        lineColor: [136, 138, 143, 255],
        lineWidth: 2,
        linePattern: 'solid',
        ...(icon ? { icon } : {}),
      },
    },
    geometry: { type: 'Point', coordinates: [0, 0] },
  } as Shape['feature'];
}

const TEST_MAPPING = {
  marker: { x: 0, y: 0, width: 32, height: 32, mask: true },
};

const TEST_ATLAS = 'https://example.com/atlas.png';

describe('Icon Config Utilities', () => {
  describe('getIconConfig', () => {
    it('returns hasIcons false for features without icons', () => {
      const features = [createFeature(), createFeature()];

      const result = getIconConfig(features);

      expect(result).toEqual({ hasIcons: false });
    });

    it('returns hasIcons true with atlas and mapping from first icon feature', () => {
      const features = [
        createFeature({
          atlas: TEST_ATLAS,
          mapping: TEST_MAPPING,
          name: 'marker',
          size: 32,
        }),
      ];

      const result = getIconConfig(features);

      expect(result).toEqual({
        hasIcons: true,
        atlas: TEST_ATLAS,
        mapping: TEST_MAPPING,
      });
    });

    it('uses first icon feature when multiple have icons', () => {
      const firstMapping = { pin: { x: 0, y: 0, width: 16, height: 16 } };
      const features = [
        createFeature({
          atlas: 'first-atlas',
          mapping: firstMapping,
          name: 'pin',
          size: 16,
        }),
        createFeature({
          atlas: 'second-atlas',
          mapping: TEST_MAPPING,
          name: 'marker',
          size: 32,
        }),
      ];

      const result = getIconConfig(features);

      expect(result.atlas).toBe('first-atlas');
      expect(result.mapping).toBe(firstMapping);
    });

    it('skips non-icon features and finds first icon', () => {
      const features = [
        createFeature(),
        createFeature({
          atlas: TEST_ATLAS,
          mapping: TEST_MAPPING,
          name: 'marker',
          size: 32,
        }),
      ];

      const result = getIconConfig(features);

      expect(result.hasIcons).toBe(true);
      expect(result.atlas).toBe(TEST_ATLAS);
    });

    it('returns hasIcons false for empty array', () => {
      const result = getIconConfig([]);

      expect(result).toEqual({ hasIcons: false });
    });
  });

  describe('getIconLayerProps', () => {
    it('returns empty object when hasIcons is false', () => {
      const result = getIconLayerProps(false, undefined, undefined);

      expect(result).toEqual({});
    });

    it('includes iconAtlas and iconMapping when provided', () => {
      const result = getIconLayerProps(true, TEST_ATLAS, TEST_MAPPING);

      expect(result.iconAtlas).toBe(TEST_ATLAS);
      expect(result.iconMapping).toBe(TEST_MAPPING);
    });

    it('omits iconAtlas when undefined', () => {
      const result = getIconLayerProps(true, undefined, TEST_MAPPING);

      expect(result).not.toHaveProperty('iconAtlas');
      expect(result.iconMapping).toBe(TEST_MAPPING);
    });

    it('omits iconMapping when undefined', () => {
      const result = getIconLayerProps(true, TEST_ATLAS, undefined);

      expect(result.iconAtlas).toBe(TEST_ATLAS);
      expect(result).not.toHaveProperty('iconMapping');
    });

    it('provides getIcon accessor that returns icon name', () => {
      const result = getIconLayerProps(true, TEST_ATLAS, TEST_MAPPING);
      const feature = createFeature({
        atlas: TEST_ATLAS,
        mapping: TEST_MAPPING,
        name: 'pin',
        size: 32,
      });

      const getIcon = result.getIcon as (d: Shape['feature']) => string;

      expect(getIcon(feature)).toBe('pin');
    });

    it('getIcon falls back to "marker" when icon name is missing', () => {
      const result = getIconLayerProps(true, TEST_ATLAS, TEST_MAPPING);
      const feature = createFeature();

      const getIcon = result.getIcon as (d: Shape['feature']) => string;

      expect(getIcon(feature)).toBe('marker');
    });

    it('provides getIconSize accessor that returns icon size', () => {
      const result = getIconLayerProps(true, TEST_ATLAS, TEST_MAPPING);
      const feature = createFeature({
        atlas: TEST_ATLAS,
        mapping: TEST_MAPPING,
        name: 'pin',
        size: 48,
      });

      const getIconSize = result.getIconSize as (d: Shape['feature']) => number;

      expect(getIconSize(feature)).toBe(48);
    });

    it('getIconSize falls back to MAP_INTERACTION.ICON_SIZE when not specified', () => {
      const result = getIconLayerProps(true, TEST_ATLAS, TEST_MAPPING);
      const feature = createFeature();

      const getIconSize = result.getIconSize as (d: Shape['feature']) => number;

      expect(getIconSize(feature)).toBe(MAP_INTERACTION.ICON_SIZE);
    });

    it('provides getIconPixelOffset accessor', () => {
      const result = getIconLayerProps(true, TEST_ATLAS, TEST_MAPPING);
      const feature = createFeature({
        atlas: TEST_ATLAS,
        mapping: TEST_MAPPING,
        name: 'pin',
        size: 40,
      });

      const getIconPixelOffset = result.getIconPixelOffset as (
        d: Shape['feature'],
      ) => [number, number];

      expect(getIconPixelOffset(feature)).toEqual([-1, -20]);
    });

    it('sets iconBillboard to true', () => {
      const result = getIconLayerProps(true, TEST_ATLAS, TEST_MAPPING);

      expect(result.iconBillboard).toBe(true);
    });
  });

  describe('getIconUpdateTriggers', () => {
    it('returns empty object when hasIcons is false', () => {
      const result = getIconUpdateTriggers(false, []);

      expect(result).toEqual({});
    });

    it('returns trigger keys referencing features array when hasIcons is true', () => {
      const features = [createFeature()];

      const result = getIconUpdateTriggers(true, features);

      expect(result).toEqual({
        getIcon: [features],
        getIconSize: [features],
        getIconColor: [features],
        getIconPixelOffset: [features],
      });
    });
  });
});
