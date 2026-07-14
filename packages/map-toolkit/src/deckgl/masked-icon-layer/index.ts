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

import { IconLayer, type IconLayerProps } from '@deck.gl/layers';
import fs from './masked-icon-layer-fragment.glsl';
import vs from './masked-icon-layer-vertex.glsl';
import {
  type MaskedIconShaderProps,
  maskedIconUniforms,
} from './masked-icon-uniforms';
import type { Accessor, Color, DefaultProps } from '@deck.gl/core';

/**
 * Props for {@link MaskedIconLayer}, extending {@link IconLayerProps} with the
 * color-masking accessors and uniforms.
 *
 * @template DataT - The per-datum record type accessors receive.
 */
export type MaskedIconLayerProps<DataT = unknown> = IconLayerProps<DataT> & {
  /**
   * The pixel color the masking algorithm matches and replaces.
   *
   * @default [255, 105, 180, 1] (pink)
   */
  matchColor?: Color;

  /**
   * The pixel color blended toward for near-matches of `matchColor`.
   *
   * @default [0, 0, 0, 1] (black)
   */
  ignoreColor?: Color;

  /**
   * The replacement color used while the icon is hovered (picking buffer).
   *
   * @default [255, 255, 255, 1] (white)
   */
  hoverColor?: Color;

  /**
   * The replacement color used while the icon is clicked (`getClicked`).
   *
   * @default [40, 245, 190, 1] (aqua)
   */
  clickColor?: Color;

  /**
   * Per-instance replacement color used when the icon is neither hovered nor
   * clicked.
   *
   * @default [150, 150, 150, 1] (gray)
   */
  getFillColor?: Accessor<DataT, Color>;

  /**
   * Per-instance flag selecting `clickColor` over `getFillColor`.
   *
   * @default false
   */
  getClicked?: Accessor<DataT, boolean>;
};

const defaultProps: DefaultProps<MaskedIconLayerProps> = {
  matchColor: { type: 'color', value: [255, 105, 180, 1] }, // pink
  ignoreColor: { type: 'color', value: [0, 0, 0, 1] }, // black
  hoverColor: { type: 'color', value: [255, 255, 255, 1] }, // white
  clickColor: { type: 'color', value: [40, 245, 190, 1] }, // aqua
  getFillColor: { type: 'accessor', value: [150, 150, 150, 1] }, // gray
  getClicked: { type: 'accessor', value: false },
};

/**
 * Scale a color tuple's channels from 0–255 to 0–1 for the GPU, defaulting a
 * missing alpha channel to fully opaque.
 *
 * @param color - RGB or RGBA tuple in 0–255.
 * @returns The channels as an RGBA tuple scaled to 0–1.
 */
function toGlColor(color: Color): number[] {
  return [
    (color[0] ?? 0) / 255,
    (color[1] ?? 0) / 255,
    (color[2] ?? 0) / 255,
    (color[3] ?? 255) / 255,
  ];
}

/**
 * An {@link IconLayer} that recolors each icon's "maskable" region in real time
 * without needing a separate icon atlas per color.
 *
 * Pixels in the icon texture matching `matchColor` (default pink `#FF69B4`) are
 * replaced with a per-instance color — `clickColor` when the instance is
 * clicked (`getClicked`), `hoverColor` while hovered, otherwise the per-instance
 * `getFillColor`. Pixels near `matchColor` blend toward `ignoreColor`, and every
 * other pixel passes through unchanged, so an icon without a maskable region
 * renders exactly like a plain `IconLayer`.
 *
 * To draw selection/hover brackets over the recolored icon, pair this layer with
 * `CoffinCornerExtension` — on a masked-icon host it automatically composites its
 * brackets on top of the masked color rather than the raw match color.
 *
 * @template DataT - The per-datum record type; defaults to unknown.
 *
 * @example
 * ```tsx
 * import { MaskedIconLayer } from '@accelint/map-toolkit/deckgl';
 *
 * new MaskedIconLayer({
 *   id: 'points',
 *   data,
 *   iconAtlas,
 *   iconMapping,
 *   getPosition: (d) => d.position,
 *   getIcon: () => 'marker',
 *   getSize: 32,
 *   billboard: true,
 *   pickable: true,
 *   getFillColor: (d) => d.color,
 * });
 * ```
 */
export class MaskedIconLayer<DataT = unknown> extends IconLayer<
  DataT,
  MaskedIconLayerProps<DataT>
> {
  static override defaultProps = defaultProps;
  static override layerName = 'MaskedIconLayer';

  /**
   * Cached normalized uniform, keyed on the raw color-prop references it was
   * derived from so `draw()` can skip re-normalizing unchanged colors.
   */
  private maskedIconUniforms?: {
    sources: {
      matchColor: Color;
      ignoreColor: Color;
      hoverColor: Color;
      clickColor: Color;
    };
    uniforms: MaskedIconShaderProps;
  };

  override initializeState() {
    super.initializeState();

    const attributeManager = this.getAttributeManager();

    if (!attributeManager) {
      throw new Error('MaskedIconLayer requires an attribute manager');
    }

    attributeManager.addInstanced({
      instanceFill: {
        size: 4,
        type: 'unorm8',
        transition: true,
        defaultValue: [150, 150, 150, 1],
        accessor: 'getFillColor',
      },
      instanceClicked: {
        size: 1,
        type: 'unorm8',
        accessor: 'getClicked',
        transform: (value) => (value ? 1 : 0),
      },
    });
  }

  override getShaders() {
    const shaders = super.getShaders();

    return {
      ...shaders,
      vs,
      fs,
      modules: [...shaders.modules, maskedIconUniforms],
    };
  }

  override draw(opts: { uniforms: Record<string, unknown> }) {
    this.setShaderModuleProps({ maskedIcon: this.getMaskedIconUniforms() });

    super.draw(opts);
  }

  /**
   * The normalized `maskedIcon` uniform, recomputed only when a color prop
   * changes. `draw()` runs every frame, so normalizing four static colors and
   * allocating a fresh uniform object each call is pure per-frame waste — cache
   * it against the raw prop references and rebuild only on a mismatch.
   *
   * @returns The cached, normalized `maskedIcon` uniform props.
   */
  private getMaskedIconUniforms(): MaskedIconShaderProps {
    const { matchColor, ignoreColor, hoverColor, clickColor } = this
      .props as Required<MaskedIconLayerProps<DataT>>;

    const cache = this.maskedIconUniforms;

    if (
      cache &&
      cache.sources.matchColor === matchColor &&
      cache.sources.ignoreColor === ignoreColor &&
      cache.sources.hoverColor === hoverColor &&
      cache.sources.clickColor === clickColor
    ) {
      return cache.uniforms;
    }

    const fresh = {
      sources: { matchColor, ignoreColor, hoverColor, clickColor },
      uniforms: {
        matchColor: toGlColor(matchColor),
        ignoreColor: toGlColor(ignoreColor),
        hoverColor: toGlColor(hoverColor),
        clickColor: toGlColor(clickColor),
      },
    };

    this.maskedIconUniforms = fresh;

    return fresh.uniforms;
  }
}
