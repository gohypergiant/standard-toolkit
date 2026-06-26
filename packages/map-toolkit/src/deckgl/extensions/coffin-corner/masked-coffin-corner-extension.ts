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

import { IconLayer } from '@deck.gl/layers';
import { CoffinCornerExtension } from './coffin-corner-extension';
import type { Layer } from '@deck.gl/core';

/**
 * Fragment `#main-start` injected by {@link MaskedCoffinCornerExtension} for an
 * IconLayer host. It replaces the base extension's icon `fs:#main-start`: it
 * samples the icon texel, runs it through the masked-icon color replacement
 * (`maskedIcon_replace`), then composites the brackets over the *recolored*
 * texel — so a `MaskedIconLayer` host shows its fill under the brackets instead
 * of the raw match color.
 *
 * This must run at `fs:#main-start` (inside `main`), not `fs:#decl`: deck.gl
 * assembles `#decl` injections *before* the layer's own shader source, so a
 * `#decl` function cannot reference `iconsTexture` or the `maskedIcon_replace`
 * helper — both of which are declared in the MaskedIconLayer fragment source and
 * are only in scope inside `main`. `coffinCorner_allCorners` and
 * `coffinCorner_composite` come from the base extension's `fs:#decl`.
 */
const MASKED_ICON_FS_MAIN_START = /* glsl */ `\
  geometry.uv = uv;
  bool isHovered = vInstanceHoveredEntity > 0.5;
  bool isSelected = vInstanceSelectedEntity > 0.5;

  if (isHovered || isSelected) {
    vec2 bracketPos = uv * 0.5;
    bool insideBox = max(abs(bracketPos.x), abs(bracketPos.y)) < 0.5;
    float cornerDist = coffinCorner_allCorners(bracketPos, 0.26, 0.07);
    float strokeWidth = 0.026;
    float antiAlias = fwidth(cornerDist);
    float strokeAlpha = 1.0 - smoothstep(0.0, antiAlias, cornerDist + strokeWidth);
    float fillAlpha = 1.0 - smoothstep(0.0, antiAlias, cornerDist);

    if (insideBox) {
      // Sample and apply the masked-icon color replacement before compositing
      // brackets, so the recolored icon shows beneath them (not the match color).
      vec4 baseColor = maskedIcon_replace(texture(iconsTexture, vTextureCoords));

      fragColor = coffinCorner_composite(baseColor, isHovered, isSelected, strokeAlpha, fillAlpha);
      DECKGL_FILTER_COLOR(fragColor, geometry);
      return;
    }
  }
`;

/**
 * A {@link CoffinCornerExtension} for use on a `MaskedIconLayer` host.
 *
 * The base extension samples the raw icon texel for the color its brackets
 * composite over, which on a masked-icon layer leaves the unreplaced match color
 * (pink) showing under the brackets. This subclass overrides the icon
 * `fs:#main-start` injection so the sampled texel is run through the masked-icon
 * color replacement first; the brackets then composite over the recolored icon.
 *
 * **Only valid on a `MaskedIconLayer` host** — the override references
 * `maskedIcon_replace`, `iconsTexture`, and the `maskedIcon` uniform block, which
 * only that layer supplies. On a ScatterplotLayer host the base extension returns
 * its scatterplot shaders (which this subclass leaves untouched), so that host
 * still works.
 *
 * @example
 * ```tsx
 * import {
 *   MaskedIconLayer,
 *   MaskedCoffinCornerExtension,
 * } from '@accelint/map-toolkit/deckgl';
 *
 * new MaskedIconLayer({
 *   // ...icon + getFillColor props...
 *   extensions: [new MaskedCoffinCornerExtension()],
 *   selectedEntityIds: selectedSet,
 *   hoveredEntityIds: hoveredSet,
 * });
 * ```
 */
export class MaskedCoffinCornerExtension extends CoffinCornerExtension {
  static override componentName = 'MaskedCoffinCornerExtension';

  /**
   * Replaces the base extension's icon `fs:#main-start` with the masked variant.
   * Returns the base config unchanged for non-IconLayer hosts (e.g.
   * ScatterplotLayer), whose `fs:#main-start` references no masked-icon symbols.
   */
  override getShaders(this: Layer, extension: this) {
    const baseShaders = CoffinCornerExtension.prototype.getShaders.call(
      this,
      extension,
    );

    // Non-IconLayer hosts (e.g. ScatterplotLayer) keep the inherited shaders —
    // their main-start references no masked-icon symbols.
    if (!baseShaders) {
      return null;
    }
    if (!(this instanceof IconLayer)) {
      return baseShaders;
    }

    return {
      ...baseShaders,
      inject: {
        ...baseShaders.inject,
        'fs:#main-start': MASKED_ICON_FS_MAIN_START,
      },
    };
  }
}
