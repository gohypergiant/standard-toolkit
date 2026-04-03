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

import { describe, it, expect, vi } from 'vitest';
import { MgrsLayer } from './';
import { mgrsDefinition, MGRS_GRID_TYPES } from './definition';

vi.mock('../core/base-grid-layer', () => ({
  BaseGridLayer: class MockBaseGridLayer {
    props: Record<string, unknown>;
    static layerName = 'BaseGridLayer';
    constructor(props: Record<string, unknown>) {
      this.props = props;
    }
  },
}));

describe('MgrsLayer', () => {
  it('should have correct layerName', () => {
    expect(MgrsLayer.layerName).toBe('MGRSLayer');
  });

  it('should use mgrsDefinition', () => {
    const layer = new MgrsLayer({ id: 'test' });
    expect(layer.props.definition).toBe(mgrsDefinition);
  });

  it('should map gzdStyle to GZD override', () => {
    const style = {
      lineColor: [255, 0, 0, 255] as [number, number, number, number],
      lineWidth: 2,
    };
    const layer = new MgrsLayer({ id: 'test', gzdStyle: style });
    expect(layer.props.styleOverrides?.[MGRS_GRID_TYPES.GZD]).toBe(style);
  });

  it('should map grid100kmStyle to GRID_100KM override', () => {
    const style = { lineWidth: 1.5 };
    const layer = new MgrsLayer({ id: 'test', grid100kmStyle: style });
    expect(layer.props.styleOverrides?.[MGRS_GRID_TYPES.GRID_100KM]).toBe(
      style,
    );
  });

  it('should map grid10kmStyle to GRID_10KM override', () => {
    const style = { lineWidth: 1 };
    const layer = new MgrsLayer({ id: 'test', grid10kmStyle: style });
    expect(layer.props.styleOverrides?.[MGRS_GRID_TYPES.GRID_10KM]).toBe(style);
  });

  it('should map grid1kmStyle to GRID_1KM override', () => {
    const style = { lineWidth: 0.5 };
    const layer = new MgrsLayer({ id: 'test', grid1kmStyle: style });
    expect(layer.props.styleOverrides?.[MGRS_GRID_TYPES.GRID_1KM]).toBe(style);
  });
});
