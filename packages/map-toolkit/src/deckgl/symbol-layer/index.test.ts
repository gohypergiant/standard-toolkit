/*
 * Copyright 2025 Hypergiant Galactic Systems Inc. All rights reserved.
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
import { SymbolLayer } from './index';

const TEST_DATA = [
  {
    sidc: '130340000015011300000000000000',
    position: [-117.957499, 34.236734],
  },
  {
    sidc: 'SNGPEWAM--*****',
    position: [-122.636867, 47.622294],
  },
];
const mockId = 'symbol-layer';

describe('SymbolLayer', () => {
  it('should handle layer props correctly', () => {
    const mockSize = 64;

    const layer = new SymbolLayer({
      id: mockId,
      data: TEST_DATA,
      getSize: mockSize,
    });

    expect(layer.props.getSize).toEqual(mockSize);
    expect(layer.props.data).toEqual(TEST_DATA);
    expect(layer.props.id).toEqual(mockId);
  });

  it('should apply custom symbol options', () => {
    const customOptions = {
      colorMode: 'Dark',
      square: true,
    };

    const layer = new SymbolLayer({
      id: mockId,
      data: TEST_DATA,
      defaultSymbolOptions: customOptions,
    });

    expect(layer.props.defaultSymbolOptions).toEqual(customOptions);
  });

  it('should extract SIDC correctly using default accessor', () => {
    const layer = new SymbolLayer({
      id: mockId,
      data: TEST_DATA,
    });

    const sidc = layer.props.getSidc(TEST_DATA[0], {
      index: 0,
      data: TEST_DATA,
      target: [],
    });

    expect(sidc).toBe(TEST_DATA[0].sidc);
  });

  it('should use custom getSidc accessor', () => {
    const mockSidCCode = 'CUSTOM-SIDC-1';
    const customData = [{ code: mockSidCCode, position: [0, 0] }];

    const layer = new SymbolLayer({
      id: mockId,
      data: customData,
      getSidc: (d: (typeof customData)[0]) => d.code,
    });

    const sidc = layer.props.getSidc(customData[0], {
      index: 0,
      data: customData,
      target: [],
    });

    expect(sidc).toBe(mockSidCCode);
  });

  it('should cache generated icons', () => {
    const layer = new SymbolLayer({
      id: mockId,
      data: TEST_DATA,
    });

    // Generate icon first time
    const icon1 = layer['generateIcon'](TEST_DATA[0], {
      index: 0,
      data: TEST_DATA,
      target: [],
    });

    // Generate same icon second time
    const icon2 = layer['generateIcon'](TEST_DATA[0], {
      index: 0,
      data: TEST_DATA,
      target: [],
    });

    // Should have same URL (cached)
    expect(icon1.url).toStrictEqual(icon2.url);
    expect(icon1.id).toStrictEqual(icon2.id);
  });

  it('should generate different cache keys for different options', () => {
    const layer = new SymbolLayer({
      id: mockId,
      data: TEST_DATA,
    });

    const key1 = layer['generateCacheKey']('SIDC123', { size: 32 });
    const key2 = layer['generateCacheKey']('SIDC123', { size: 64 });

    expect(key1).not.toBe(key2);
  });

  it('should merge default options with local options', () => {
    const defaultOptions = { colorMode: 'Dark' };

    const layer = new SymbolLayer({
      id: mockId,
      data: TEST_DATA,
      defaultSymbolOptions: defaultOptions,
      getSymbolOptions: () => ({ square: true }),
    });

    // Generate an icon to trigger option merging
    const icon = layer['generateIcon'](TEST_DATA[0], {
      index: 0,
      data: TEST_DATA,
      target: [],
    });

    // icon was generated
    expect(icon.url).toContain('data:image');
    // options were merged
    expect(icon.id).toContain('"colorMode":"Dark"');
    expect(icon.id).toContain('"square":true');
  });
});
