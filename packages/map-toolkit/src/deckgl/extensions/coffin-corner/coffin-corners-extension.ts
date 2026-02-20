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

import { LayerExtension } from '@deck.gl/core';
import type { Layer, UpdateParameters } from '@deck.gl/core';
import type { EntityId } from './types';

type CoffinCornerLayer = Layer & {
  // type number for GPU attribute (0 or 1), keyed by entity ID
  state: { selectedEntities: Map<EntityId, number> };
};

/**
 * Props added by CoffinCornersExtension.
 *
 * Requires data objects to have an `id` field matching `EntityId`.
 *
 * The layer using the extension must include `CoffinCornersExtensionProps` in
 * its props type to ensure the `selectedEntityId` prop is passed
 * through correctly. This is necessary for the extension to determine which
 * entity is selected and update the GPU attribute accordingly.
 *
 * The host layer must also set the following deck.gl props for the extension
 * to function correctly:
 *
 * - `pickable` — Enables picking so hover and click events are emitted.
 *   Required for the coffin corners shader to detect hover state via the
 *   picking valid flag (`picking_vRGBcolor_Avalid.a`).
 * - `autoHighlight` — Enables deck.gl's automatic highlight-on-hover
 *   behavior which sets the picking valid flag read by the fragment shader.
 * - `highlightColor` — Set to `[0, 0, 0, 0]` (fully transparent) so the
 *   extension's custom hover effect is visible instead of the default
 *   highlight overlay.
 *
 * @example Type setup
 * ```ts
 * declare global {
 *   namespace React {
 *     namespace JSX {
 *       interface IntrinsicElements {
 *         symbolLayer: CoffinCornersExtensionProps<SymbolLayerProps>;
 *       }
 *     }
 *   }
 * }
 * ```
 *
 * @example Fiber renderer JSX
 * ```tsx
 * <symbolLayer
 *   {...props}
 *   pickable
 *   autoHighlight
 *   highlightColor={[0, 0, 0, 0]}
 *   extensions={[new CoffinCornersExtension()]}
 *   selectedEntityId={selectedId}
 * />
 * ```
 *
 * @example Imperative API
 * ```ts
 * new SymbolLayer<DataT, IconLayerProps<DataT> & CoffinCornersExtensionProps>({
 *   pickable: true,
 *   autoHighlight: true,
 *   highlightColor: [0, 0, 0, 0],
 *   extensions: [new CoffinCornersExtension()],
 *   selectedEntityId: selectedId,
 * })
 * ```
 */

const SHADERS = {
  inject: {
    'vs:#decl': `\
in float instanceSelectedEntity;
out float v_instanceSelectedEntity;
`,
    'vs:#main-end': `\
v_instanceSelectedEntity = instanceSelectedEntity;
`,
    'fs:#decl': `\
in float v_instanceSelectedEntity;

float coffinCorners_sdBox(vec2 p, vec2 b) {
  vec2 d = abs(p) - b;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

float coffinCorners_sdLCorner(vec2 p, float len, float wid) {
  float h = coffinCorners_sdBox(p - vec2(len * 0.5, 0.0), vec2(len * 0.5, wid * 0.5));
  float v = coffinCorners_sdBox(p - vec2(0.0, len * 0.5), vec2(wid * 0.5, len * 0.5));
  return min(h, v);
}

float coffinCorners_allCorners(vec2 uvCoord) {
  vec2 boxSize = vec2(40.0);
  float len = 10.0;
  float wid = 2.0;

  vec2 halfSize = boxSize * 0.5;
  vec2 localUV = (uvCoord + 1.0) * 0.5;
  vec2 pixelPos = localUV * boxSize;
  vec2 p = pixelPos - halfSize;

  vec2 top_left = p + halfSize;
  vec2 top_right = vec2(halfSize.x - p.x, p.y + halfSize.y);
  vec2 bottom_left = vec2(p.x + halfSize.x, halfSize.y - p.y);
  vec2 bottom_right = halfSize - p;

  return min(
    min(coffinCorners_sdLCorner(top_left, len, wid),
        coffinCorners_sdLCorner(top_right, len, wid)),
    min(coffinCorners_sdLCorner(bottom_left, len, wid),
        coffinCorners_sdLCorner(bottom_right, len, wid))
  );
}
`,
    'fs:#main-start': `\
  geometry.uv = uv;
  {
    bool cc_isHovered = bool(picking_vRGBcolor_Avalid.a);
    bool cc_isSelected = v_instanceSelectedEntity > 0.5;

    if (cc_isHovered || cc_isSelected) {
      vec2 boxSize = vec2(40.0);
      vec2 halfSize = boxSize * 0.5;
      vec2 localUV = (uv + 1.0) * 0.5;
      vec2 pixelPos = localUV * boxSize;
      vec2 p = pixelPos - halfSize;

      // Check if inside the coffin corner box
      float cc_boxDist = max(abs(p.x), abs(p.y)) - halfSize.x;
      bool cc_insideBox = cc_boxDist < 0.0;

      float cc_d = coffinCorners_allCorners(uv);
      float cc_cornerAlpha = 1.0 - smoothstep(0.0, 1.0, cc_d);

      if (cc_insideBox) {
        // Sample icon texture
        vec4 iconColor = texture(iconsTexture, vTextureCoords);

        // Start with fill (only when hovering)
        // Fill color: #38393A
        vec4 result = cc_isHovered
          ? vec4(0.22, 0.224, 0.227, 0.85)
          : vec4(0.0);  // no fill when just selected

        // Composite icon OVER fill
        result.rgb = iconColor.rgb * iconColor.a + result.rgb * result.a * (1.0 - iconColor.a);
        result.a = iconColor.a + result.a * (1.0 - iconColor.a);

        // Composite corners OVER result
        if (cc_cornerAlpha > 0.01) {
          // Blue if selected (even when hovering), white only if hover-only
          vec3 cc_cornerColor = cc_isSelected ? vec3(0.53, 0.70, 0.98) : vec3(1.0);
          result.rgb = cc_cornerColor * cc_cornerAlpha + result.rgb * (1.0 - cc_cornerAlpha);
          result.a = cc_cornerAlpha + result.a * (1.0 - cc_cornerAlpha);
        }

        fragColor = result;
        DECKGL_FILTER_COLOR(fragColor, geometry);
        return;
      }
    }
  }
`,
  },
};

export type CoffinCornersExtensionProps<TLayerProps = unknown> = {
  /**
   * The currently selected entity ID. Matched against each data object's `id`
   * field to determine selection state for the coffin corners shader.
   */
  selectedEntityId?: EntityId;
} & TLayerProps;

export default class CoffinCornersExtension extends LayerExtension {
  static override defaultProps = {
    selectedEntityId: { type: 'value', value: undefined },
  };

  override initializeState(this: CoffinCornerLayer) {
    this.state.selectedEntities = new Map<EntityId, number>();

    // Registers the GPU attribute. The `update` callback bridges the
    // JavaScript Map to the GPU Float32Array. When `updateState` calls
    // `invalidate`, this runs to copy selection values into the buffer.
    const attributeManager = this.getAttributeManager();
    if (attributeManager) {
      attributeManager.addInstanced({
        instanceSelectedEntity: {
          size: 1,
          update: (
            attribute: { value: unknown },
            { data }: { data: { id: EntityId }[] | undefined },
          ) => {
            const { selectedEntities } = this.state;
            const items = data ?? [];
            const value = attribute.value as Float32Array;

            for (const [i, item] of items.entries()) {
              value[i] = selectedEntities.get(item.id) ?? 0;
            }
          },
        },
      });
    }
  }

  override updateState(
    this: CoffinCornerLayer,
    params: UpdateParameters<Layer<CoffinCornersExtensionProps>>,
  ) {
    const { selectedEntityId: newId } = params.props;
    const { selectedEntityId: oldId } = params.oldProps;

    if (newId === oldId) {
      return;
    }

    const { selectedEntities } = this.state;

    if (oldId) {
      selectedEntities.set(oldId, 0);
    }

    if (newId) {
      selectedEntities.set(newId, 1);
    }

    this.getAttributeManager()?.invalidate('instanceSelectedEntity');
  }

  override getShaders(this: CoffinCornerLayer, _extensions: this) {
    return SHADERS;
  }
}
