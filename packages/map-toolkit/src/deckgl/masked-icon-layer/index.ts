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

/** Ensure a color tuple has an alpha channel. */
function addAlpha(color: Color): Color {
  if (color.length === 4) {
    return color;
  }

  const [r, g, b] = color;
  return [r ?? 0, g ?? 0, b ?? 0, 255];
}

/** Normalize a color tuple's channels from 0–255 to 0–1 for the GPU. */
function normalizeColor(color: Color): number[] {
  return addAlpha(color).map((channel) => channel / 255);
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

  override draw(opts: Record<string, unknown>) {
    const { matchColor, ignoreColor, hoverColor, clickColor } = this
      .props as Required<MaskedIconLayerProps<DataT>>;

    const maskedIcon: MaskedIconShaderProps = {
      matchColor: normalizeColor(matchColor),
      ignoreColor: normalizeColor(ignoreColor),
      hoverColor: normalizeColor(hoverColor),
      clickColor: normalizeColor(clickColor),
    };

    this.setShaderModuleProps({ maskedIcon });

    super.draw(opts);
  }
}
