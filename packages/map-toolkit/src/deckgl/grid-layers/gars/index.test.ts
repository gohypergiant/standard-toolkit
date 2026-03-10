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
import { GarsLayer } from './';
import { garsDefinition, GARS_GRID_TYPES } from './definition';

vi.mock('../core/base-grid-layer', () => ({
  BaseGridLayer: class MockBaseGridLayer {
    props: Record<string, unknown>;
    static layerName = 'BaseGridLayer';
    constructor(props: Record<string, unknown>) {
      this.props = props;
    }
  },
}));

describe('GarsLayer', () => {
  it('should have correct layerName', () => {
    expect(GarsLayer.layerName).toBe('GarsLayer');
  });

  it('should use garsDefinition', () => {
    const layer = new GarsLayer({ id: 'test' });
    // biome-ignore lint/suspicious/noExplicitAny: Test needs to access internal props
    expect((layer as any).props.definition).toBe(garsDefinition);
  });

  it('should map thirtyMinuteStyle to THIRTY_MINUTE override', () => {
    const style = {
      lineColor: [255, 0, 0, 255] as [number, number, number, number],
      lineWidth: 2,
    };
    const layer = new GarsLayer({ id: 'test', thirtyMinuteStyle: style });
    // biome-ignore lint/suspicious/noExplicitAny: Test needs to access internal props
    expect(
      (layer as any).props.styleOverrides[GARS_GRID_TYPES.THIRTY_MINUTE],
    ).toBe(style);
  });

  it('should map fifteenMinuteStyle to FIFTEEN_MINUTE override', () => {
    const style = { lineWidth: 1.5 };
    const layer = new GarsLayer({ id: 'test', fifteenMinuteStyle: style });
    // biome-ignore lint/suspicious/noExplicitAny: Test needs to access internal props
    expect(
      (layer as any).props.styleOverrides[GARS_GRID_TYPES.FIFTEEN_MINUTE],
    ).toBe(style);
  });

  it('should map fiveMinuteStyle to FIVE_MINUTE override', () => {
    const style = { lineWidth: 1 };
    const layer = new GarsLayer({ id: 'test', fiveMinuteStyle: style });
    // biome-ignore lint/suspicious/noExplicitAny: Test needs to access internal props
    expect(
      (layer as any).props.styleOverrides[GARS_GRID_TYPES.FIVE_MINUTE],
    ).toBe(style);
  });
});
