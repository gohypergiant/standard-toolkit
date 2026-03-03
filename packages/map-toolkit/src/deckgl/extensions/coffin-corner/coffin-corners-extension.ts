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
import type { Rgba255Tuple } from '@accelint/predicates';
import type { Layer, UpdateParameters } from '@deck.gl/core';
import type { EntityId } from './types';

type CoffinCornerLayer = Layer & {
  state: {
    selectedEntities: Map<EntityId, number>;
    hoveredEntities: Map<EntityId, number>;
  };
};

// -- Shader module for the highlight color uniform --

const coffinCornersModule: {
  name: string;
  fs: string;
  uniformTypes: Record<string, string>;
} = {
  name: 'coffinCorners',
  fs: /* glsl */ `\
uniform coffinCornersUniforms {
  vec4 highlightColor;
} coffinCorners;
`,
  uniformTypes: {
    highlightColor: 'vec4<f32>',
  },
};

// -- Shader injection code --

const SHADERS = {
  modules: [coffinCornersModule],
  inject: {
    'vs:#decl': `\
in float instanceSelectedEntity;
in float instanceHoveredEntity;
out float v_instanceSelectedEntity;
out float v_instanceHoveredEntity;
`,
    'vs:#main-end': `\
v_instanceSelectedEntity = instanceSelectedEntity;
v_instanceHoveredEntity = instanceHoveredEntity;
`,
    'fs:#decl': `\
in float v_instanceSelectedEntity;
in float v_instanceHoveredEntity;

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
    bool cc_isHovered = v_instanceHoveredEntity > 0.5;
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

      // Stroke width in pixels
      float strokeWidth = 1.0;

      // Two alphas: stroke (dilated) and fill (normal)
      float cc_strokeAlpha = 1.0 - smoothstep(0.0, 1.0, cc_d + strokeWidth);
      float cc_fillAlpha = 1.0 - smoothstep(0.0, 1.0, cc_d);

      if (cc_insideBox) {
        // Sample icon texture
        vec4 iconColor = texture(iconsTexture, vTextureCoords);

        // Start with background fill (only when hovering)
        // White 30% opacity
        vec4 result = cc_isHovered
          ? vec4(1.0, 1.0, 1.0, 0.3)
          : vec4(0.0);  // no fill when just selected

        // Composite icon OVER fill
        result.rgb = iconColor.rgb * iconColor.a + result.rgb * result.a * (1.0 - iconColor.a);
        result.a = iconColor.a + result.a * (1.0 - iconColor.a);

        // Composite black stroke OVER icon (dilated shape)
        if (cc_strokeAlpha > 0.01) {
          vec3 strokeColor = vec3(0.0);  // Black
          result.rgb = strokeColor * cc_strokeAlpha + result.rgb * (1.0 - cc_strokeAlpha);
          result.a = cc_strokeAlpha + result.a * (1.0 - cc_strokeAlpha);
        }

        // Composite colored fill OVER stroke (normal shape)
        if (cc_fillAlpha > 0.01) {
          vec4 cc_cornerColor = cc_isSelected
            ? coffinCorners.highlightColor
            : vec4(1.0);  // White fully opaque for hover-only
          float cc_modAlpha = cc_fillAlpha * cc_cornerColor.a;
          result.rgb = cc_cornerColor.rgb * cc_modAlpha + result.rgb * (1.0 - cc_modAlpha);
          result.a = cc_modAlpha + result.a * (1.0 - cc_modAlpha);
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

// -- Props type --

/** Props added by {@link CoffinCornersExtension}. */
export type CoffinCornersExtensionProps<TLayerProps = unknown> = {
  /** The currently selected entity ID. */
  selectedEntityId?: EntityId;
  /** The currently hovered entity ID. */
  hoveredEntityId?: EntityId;
  /**
   * RGBA color (0-255) for the selected-state bracket fill.
   * Alpha modulates the bracket opacity.
   * @default [57, 183, 250, 255] (#39B7FA, fully opaque)
   */
  coffinCornerColor?: Rgba255Tuple;
  /**
   * Accessor to extract an entity ID from a data item. Matched against
   * `selectedEntityId` and `hoveredEntityId` to drive the shader state.
   * @default (item) => item.id
   */
  // biome-ignore lint/suspicious/noExplicitAny: Data type is unknown at extension level.
  getEntityId?: (item: any) => EntityId;
} & TLayerProps;

// -- Default highlight color: #39B7FA fully opaque --
const DEFAULT_CORNER_COLOR: Rgba255Tuple = [57, 183, 250, 255];

// -- Extension class --

/**
 * deck.gl layer extension that renders bracket-like "coffin corner" indicators
 * around hovered and selected map entities.
 *
 * Driven by explicit `hoveredEntityId` and `selectedEntityId` props rather than
 * deck.gl's built-in autoHighlight. Data objects are identified via the
 * `getEntityId` accessor (defaults to `item => item.id`).
 *
 * The host layer must set `pickable` to enable picking events.
 *
 * @example Fiber renderer JSX
 * ```tsx
 * <symbolLayer
 *   {...props}
 *   pickable
 *   extensions={[new CoffinCornersExtension()]}
 *   selectedEntityId={selectedId}
 *   hoveredEntityId={hoveredId}
 * />
 * ```
 *
 * @example Custom entity ID accessor (e.g. GeoJSON features)
 * ```ts
 * new IconLayer({
 *   extensions: [new CoffinCornersExtension()],
 *   getEntityId: (d) => d.properties?.shapeId,
 *   selectedEntityId: selectedShapeId,
 *   hoveredEntityId: hoveredShapeId,
 *   coffinCornerColor: [255, 0, 0, 255],
 * })
 * ```
 */
export default class CoffinCornersExtension extends LayerExtension {
  static override componentName = 'CoffinCornersExtension';

  static override defaultProps = {
    selectedEntityId: { type: 'value', value: undefined },
    hoveredEntityId: { type: 'value', value: undefined },
    coffinCornerColor: { type: 'color', value: DEFAULT_CORNER_COLOR },
    getEntityId: {
      type: 'accessor',
      value: (item: { id: EntityId }) => item.id,
    },
  };

  override initializeState(this: CoffinCornerLayer) {
    this.state.selectedEntities = new Map<EntityId, number>();
    this.state.hoveredEntities = new Map<EntityId, number>();

    const attributeManager = this.getAttributeManager();
    if (!attributeManager) {
      return;
    }

    const makeUpdateCallback =
      (stateKey: 'selectedEntities' | 'hoveredEntities') =>
      (
        attribute: { value: unknown },
        { data }: { data: unknown[] | undefined },
      ) => {
        const entities = this.state[stateKey];
        const getId =
          (this.props as unknown as CoffinCornersExtensionProps).getEntityId ??
          // biome-ignore lint/suspicious/noExplicitAny: Default accessor assumes item.id exists.
          ((item: any) => item.id as EntityId);
        const items = data ?? [];
        const value = attribute.value as Float32Array;

        for (const [i, item] of items.entries()) {
          value[i] = entities.get(getId(item)) ?? 0;
        }
      };

    attributeManager.addInstanced({
      instanceSelectedEntity: {
        size: 1,
        update: makeUpdateCallback('selectedEntities'),
      },
      instanceHoveredEntity: {
        size: 1,
        update: makeUpdateCallback('hoveredEntities'),
      },
    });
  }

  override updateState(
    this: CoffinCornerLayer,
    params: UpdateParameters<Layer<CoffinCornersExtensionProps>>,
  ) {
    const attributeManager = this.getAttributeManager();

    // Selection state
    const newSelectedId = params.props.selectedEntityId;
    const oldSelectedId = params.oldProps.selectedEntityId;
    if (newSelectedId !== oldSelectedId) {
      const { selectedEntities } = this.state;
      if (oldSelectedId != null) {
        selectedEntities.set(oldSelectedId, 0);
      }
      if (newSelectedId != null) {
        selectedEntities.set(newSelectedId, 1);
      }
      attributeManager?.invalidate('instanceSelectedEntity');
    }

    // Hover state
    const newHoveredId = params.props.hoveredEntityId;
    const oldHoveredId = params.oldProps.hoveredEntityId;
    if (newHoveredId !== oldHoveredId) {
      const { hoveredEntities } = this.state;
      if (oldHoveredId != null) {
        hoveredEntities.set(oldHoveredId, 0);
      }
      if (newHoveredId != null) {
        hoveredEntities.set(newHoveredId, 1);
      }
      attributeManager?.invalidate('instanceHoveredEntity');
    }
  }

  override draw(this: CoffinCornerLayer) {
    const color =
      (this.props as unknown as CoffinCornersExtensionProps)
        .coffinCornerColor ?? DEFAULT_CORNER_COLOR;

    this.setShaderModuleProps({
      coffinCorners: {
        highlightColor: [
          color[0] / 255,
          color[1] / 255,
          color[2] / 255,
          color[3] / 255,
        ],
      },
    });
  }

  override getShaders(this: CoffinCornerLayer, _extensions: this) {
    return SHADERS;
  }
}
