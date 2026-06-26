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

import { describe, expect, it, vi } from 'vitest';
import { MaskedIconLayer } from './index';

const TEST_DATA = [
  { position: [-117.95, 34.23], color: [255, 0, 0, 255] },
  { position: [-122.63, 47.62], color: [0, 255, 0, 255] },
];
const mockId = 'masked-icon-layer';

describe('MaskedIconLayer', () => {
  it('exposes the masking defaults', () => {
    const layer = new MaskedIconLayer({ id: mockId, data: TEST_DATA });

    expect(layer.props.matchColor).toEqual([255, 105, 180, 1]); // pink
    expect(layer.props.ignoreColor).toEqual([0, 0, 0, 1]);
    expect(layer.props.hoverColor).toEqual([255, 255, 255, 1]);
    expect(layer.props.clickColor).toEqual([40, 245, 190, 1]);
  });

  it('resolves the per-instance fill and clicked accessors', () => {
    const layer = new MaskedIconLayer({
      id: mockId,
      data: TEST_DATA,
      getFillColor: (d: (typeof TEST_DATA)[number]) => d.color,
      getClicked: () => true,
    });

    expect(layer.props.getFillColor).toBeTypeOf('function');
    expect(layer.props.getClicked).toBeTypeOf('function');
  });

  it('forks the icon shaders and adds the maskedIcon module', () => {
    const layer = new MaskedIconLayer({ id: mockId, data: TEST_DATA });

    // The IconLayer base getShaders needs a GL/deck context this bare layer
    // lacks, so stub it with the minimal shape our override extends.
    vi.spyOn(
      Object.getPrototypeOf(MaskedIconLayer.prototype),
      'getShaders',
    ).mockReturnValue({
      vs: 'base-vs',
      fs: 'base-fs',
      modules: [{ name: 'icon' }],
    });

    const shaders = layer.getShaders();

    expect(shaders.vs).toContain('masked-icon-layer-vertex-shader');
    expect(shaders.fs).toContain('masked-icon-layer-fragment-shader');
    expect(shaders.fs).toContain('maskedIcon_replace');
    expect(
      // biome-ignore lint/suspicious/noExplicitAny: deck.gl module typing is loose.
      shaders.modules.some((module: any) => module?.name === 'maskedIcon'),
    ).toBe(true);

    vi.restoreAllMocks();
  });

  it('registers the instanceFill and instanceClicked attributes', () => {
    const layer = new MaskedIconLayer({ id: mockId, data: TEST_DATA });

    const addInstanced = vi.fn();
    // Stub the IconLayer base so initializeState reaches our addInstanced call
    // without a GL context.
    vi.spyOn(
      Object.getPrototypeOf(MaskedIconLayer.prototype),
      'initializeState',
    ).mockImplementation(() => undefined);
    vi.spyOn(layer, 'getAttributeManager').mockReturnValue({
      addInstanced,
      // biome-ignore lint/suspicious/noExplicitAny: minimal attribute-manager stub.
    } as any);

    layer.initializeState();

    expect(addInstanced).toHaveBeenCalledTimes(1);
    const registered = addInstanced.mock.calls[0]?.[0];
    expect(registered.instanceFill).toMatchObject({
      size: 4,
      type: 'unorm8',
      accessor: 'getFillColor',
    });
    expect(registered.instanceClicked).toMatchObject({
      size: 1,
      type: 'unorm8',
      accessor: 'getClicked',
    });
    expect(registered.instanceClicked.transform(true)).toBe(1);
    expect(registered.instanceClicked.transform(false)).toBe(0);

    vi.restoreAllMocks();
  });
});
