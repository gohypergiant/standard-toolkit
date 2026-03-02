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
import {
  DEFAULT_EDIT_HANDLE_COLOR,
  EDITABLE_LAYER_SUBLAYER_PROPS,
} from '../constants';
import { getDefaultEditableLayerProps } from './layer-config';

describe('layer-config', () => {
  describe('getDefaultEditableLayerProps', () => {
    it('should return default distance units when no abbreviation is provided', () => {
      const result = getDefaultEditableLayerProps();

      expect(result.modeConfig.distanceUnits).toBe('kilometers');
    });

    it('should return default distance units when undefined is passed', () => {
      const result = getDefaultEditableLayerProps(undefined);

      expect(result.modeConfig.distanceUnits).toBe('kilometers');
    });

    it.each([
      ['km', 'kilometers'],
      ['mi', 'miles'],
      ['m', 'meters'],
      ['nm', 'nauticalmiles'],
      ['ft', 'feet'],
    ] as const)('should resolve abbreviation "%s" to "%s"', (abbrev, expected) => {
      const result = getDefaultEditableLayerProps(abbrev);

      expect(result.modeConfig.distanceUnits).toBe(expected);
    });

    it('should return cached result for repeated calls with same abbreviation', () => {
      const result1 = getDefaultEditableLayerProps('km');
      const result2 = getDefaultEditableLayerProps('km');

      expect(result1).toBe(result2);
    });

    it('should return new result when abbreviation changes', () => {
      const result1 = getDefaultEditableLayerProps('km');
      const result2 = getDefaultEditableLayerProps('mi');

      expect(result1).not.toBe(result2);
      expect(result1.modeConfig.distanceUnits).toBe('kilometers');
      expect(result2.modeConfig.distanceUnits).toBe('miles');
    });

    it('should return the default edit handle point color', () => {
      const result = getDefaultEditableLayerProps();

      expect(result.getEditHandlePointColor).toBe(DEFAULT_EDIT_HANDLE_COLOR);
    });

    it('should return the default edit handle point outline color', () => {
      const result = getDefaultEditableLayerProps();

      expect(result.getEditHandlePointOutlineColor).toBe(
        DEFAULT_EDIT_HANDLE_COLOR,
      );
    });

    it('should return the editable layer sublayer props', () => {
      const result = getDefaultEditableLayerProps();

      expect(result._subLayerProps).toBe(EDITABLE_LAYER_SUBLAYER_PROPS);
    });
  });
});
