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
import { MaskedIconLayer, type MaskedIconLayerProps } from './index';
import type { MaskedIconShaderProps } from './masked-icon-uniforms';

const TEST_DATA = [
  { position: [-117.95, 34.23], color: [255, 0, 0, 255] },
  { position: [-122.63, 47.62], color: [0, 255, 0, 255] },
];
const mockId = 'masked-icon-layer';

/**
 * Drive `layer.draw()` `count` times with the GL-dependent base `draw` stubbed,
 * capturing the `maskedIcon` uniform pushed on each call. Returns the captured
 * uniforms in draw order so a test can assert their values and/or identity.
 */
function captureDrawUniforms(
  layer: MaskedIconLayer,
  count = 1,
): MaskedIconShaderProps[] {
  const captured: MaskedIconShaderProps[] = [];

  vi.spyOn(
    layer as unknown as { setShaderModuleProps: (props: unknown) => void },
    'setShaderModuleProps',
  ).mockImplementation((props) => {
    captured.push((props as { maskedIcon: MaskedIconShaderProps }).maskedIcon);
  });
  vi.spyOn(
    Object.getPrototypeOf(MaskedIconLayer.prototype),
    'draw',
  ).mockImplementation(() => undefined);

  for (let i = 0; i < count; i++) {
    layer.draw({ uniforms: {} });
  }

  return captured;
}

describe('MaskedIconLayer', () => {
  it('exposes the masking defaults', () => {
    const layer = new MaskedIconLayer({ id: mockId, data: TEST_DATA });

    expect(layer.props.matchColor).toEqual([255, 105, 180, 1]); // pink
    expect(layer.props.ignoreColor).toEqual([0, 0, 0, 1]);
    expect(layer.props.hoverColor).toEqual([255, 255, 255, 1]);
    expect(layer.props.clickColor).toEqual([40, 245, 190, 1]);
  });

  it('resolves the per-instance fill and clicked accessors', () => {
    const getFillColor = (d: (typeof TEST_DATA)[number]) => d.color;
    const getClicked = () => true;
    const layer = new MaskedIconLayer({
      id: mockId,
      data: TEST_DATA,
      getFillColor,
      getClicked,
    });

    expect(layer.props.getFillColor).toBe(getFillColor);
    expect(layer.props.getClicked).toBe(getClicked);
    expect(
      (layer.props.getFillColor as typeof getFillColor)(TEST_DATA[0]),
    ).toBe(TEST_DATA[0].color);
    expect((layer.props.getClicked as typeof getClicked)()).toBe(true);
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
  });

  it('throws when no attribute manager is available', () => {
    const layer = new MaskedIconLayer({ id: mockId, data: TEST_DATA });

    vi.spyOn(
      Object.getPrototypeOf(MaskedIconLayer.prototype),
      'initializeState',
    ).mockImplementation(() => undefined);
    vi.spyOn(layer, 'getAttributeManager').mockReturnValue(null);

    expect(() => layer.initializeState()).toThrow(
      'MaskedIconLayer requires an attribute manager',
    );
  });

  it('normalizes the color props into the maskedIcon uniform on draw', () => {
    const layer = new MaskedIconLayer({ id: mockId, data: TEST_DATA });

    const [maskedIcon] = captureDrawUniforms(layer);

    // Defaults 0–255 → 0–1: pink match, black ignore, white hover, aqua click.
    expect(maskedIcon?.matchColor).toEqual([1, 105 / 255, 180 / 255, 1 / 255]);
    expect(maskedIcon?.ignoreColor).toEqual([0, 0, 0, 1 / 255]);
    expect(maskedIcon?.hoverColor).toEqual([1, 1, 1, 1 / 255]);
    expect(maskedIcon?.clickColor).toEqual([
      40 / 255,
      245 / 255,
      190 / 255,
      1 / 255,
    ]);
  });

  it('reuses the cached uniform across draws while colors are unchanged', () => {
    const layer = new MaskedIconLayer({ id: mockId, data: TEST_DATA });

    const [first, second] = captureDrawUniforms(layer, 2);

    // Same colors → same normalized values, returned as the same cached object
    // (no per-frame rebuild).
    expect(second).toEqual(first);
    expect(second).toBe(first);
  });

  it('rebuilds the cached uniform when a color prop changes', () => {
    const layer = new MaskedIconLayer({ id: mockId, data: TEST_DATA });

    const captured: MaskedIconShaderProps[] = [];
    vi.spyOn(
      layer as unknown as { setShaderModuleProps: (props: unknown) => void },
      'setShaderModuleProps',
    ).mockImplementation((props) => {
      captured.push(
        (props as { maskedIcon: MaskedIconShaderProps }).maskedIcon,
      );
    });
    vi.spyOn(
      Object.getPrototypeOf(MaskedIconLayer.prototype),
      'draw',
    ).mockImplementation(() => undefined);

    layer.draw({ uniforms: {} });
    // deck.gl freezes and replaces the whole props object on a prop change (it
    // never mutates in place), so swap the props reference to one carrying a new
    // matchColor (defaults resolve lazily off the props prototype, so spreading
    // would drop the other resolved colors — set the four explicitly). The cache
    // keys on prop identity, so the next draw must rebuild rather than return the
    // stale cached uniform.
    (layer as unknown as { props: Partial<MaskedIconLayerProps> }).props = {
      matchColor: [0, 0, 0, 255],
      ignoreColor: [0, 0, 0, 1],
      hoverColor: [255, 255, 255, 1],
      clickColor: [40, 245, 190, 1],
    };
    layer.draw({ uniforms: {} });

    const [first, second] = captured;
    expect(second).not.toBe(first);
    expect(second?.matchColor).toEqual([0, 0, 0, 1]);
  });

  it('pads a 3-channel color to RGBA when normalizing', () => {
    const layer = new MaskedIconLayer({
      id: mockId,
      data: TEST_DATA,
      matchColor: [255, 0, 0],
    });

    const [maskedIcon] = captureDrawUniforms(layer);

    // Missing alpha padded to 255 → 1.0.
    expect(maskedIcon?.matchColor).toEqual([1, 0, 0, 1]);
  });
});
