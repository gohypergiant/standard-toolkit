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
import type { CoffinCornerExtensionProps, EntityId } from './types';

/** Layer shape with coffin-corner selection and hover state maps. */
type CoffinCornerLayer = Layer & {
  state: {
    selectedEntities: Map<EntityId, number>;
    hoveredEntities: Map<EntityId, number>;
  };
};

/** Shader module defining the `highlightColor` uniform for coffin corner brackets. */
const coffinCornerModule: {
  name: string;
  fs: string;
  uniformTypes: Record<string, string>;
} = {
  name: 'coffinCorner',
  fs: /* glsl */ `\
uniform coffinCornerUniforms {
  vec4 highlightColor;
} coffinCorner;
`,
  uniformTypes: {
    highlightColor: 'vec4<f32>',
  },
};

/** Shader injection config for vertex/fragment attribute passing and SDF bracket rendering. */
const SHADERS = {
  modules: [coffinCornerModule],
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

float coffinCorner_sdBox(vec2 p, vec2 b) {
  vec2 d = abs(p) - b;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

float coffinCorner_sdLCorner(vec2 p, float len, float wid) {
  float h = coffinCorner_sdBox(p - vec2(len * 0.5, 0.0), vec2(len * 0.5, wid * 0.5));
  float v = coffinCorner_sdBox(p - vec2(0.0, len * 0.5), vec2(wid * 0.5, len * 0.5));
  return min(h, v);
}

float coffinCorner_allCorners(vec2 p, vec2 halfSize) {
  float len = 0.26;   // bracket arm ≈ 26% of icon
  float wid = 0.07;   // bracket stroke ≈ 7% of icon

  vec2 top_left = p + halfSize;
  vec2 top_right = vec2(halfSize.x - p.x, p.y + halfSize.y);
  vec2 bottom_left = vec2(p.x + halfSize.x, halfSize.y - p.y);
  vec2 bottom_right = halfSize - p;

  return min(
    min(coffinCorner_sdLCorner(top_left, len, wid),
        coffinCorner_sdLCorner(top_right, len, wid)),
    min(coffinCorner_sdLCorner(bottom_left, len, wid),
        coffinCorner_sdLCorner(bottom_right, len, wid))
  );
}
`,
    'fs:#main-start': `\
  geometry.uv = uv;
  {
    bool cc_isHovered = v_instanceHoveredEntity > 0.5;
    bool cc_isSelected = v_instanceSelectedEntity > 0.5;

    if (cc_isHovered || cc_isSelected) {
      vec2 halfSize = vec2(0.5);
      vec2 p = uv * 0.5;  // map -1..1 to -0.5..0.5

      // Check if inside the icon quad
      bool cc_insideBox = max(abs(p.x), abs(p.y)) < halfSize.x;

      float cc_d = coffinCorner_allCorners(p, halfSize);

      // Outline width (proportional to icon)
      float cc_stroke = 0.026;
      // Anti-alias band: ~1 screen pixel regardless of icon size
      float cc_aa = fwidth(cc_d);

      // Two alphas: stroke (dilated) and fill (normal)
      float cc_strokeAlpha = 1.0 - smoothstep(0.0, cc_aa, cc_d + cc_stroke);
      float cc_fillAlpha = 1.0 - smoothstep(0.0, cc_aa, cc_d);

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
            ? coffinCorner.highlightColor
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

/** Default bracket fill color: #39B7FA fully opaque. */
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
 * @see CoffinCornerExtensionProps for the full list of extension props.
 *
 * @example Fiber renderer JSX
 * ```tsx
 * <symbolLayer
 *   {...props}
 *   pickable
 *   extensions={[new CoffinCornerExtension()]}
 *   selectedEntityId={selectedId}
 *   hoveredEntityId={hoveredId}
 * />
 * ```
 *
 * @example Custom entity ID accessor (e.g. GeoJSON features)
 * ```typescript
 * new IconLayer({
 *   extensions: [new CoffinCornerExtension()],
 *   getEntityId: (d) => d.properties?.shapeId,
 *   selectedEntityId: selectedShapeId,
 *   hoveredEntityId: hoveredShapeId,
 *   coffinCornerColor: [255, 0, 0, 255],
 * })
 * ```
 */
export class CoffinCornerExtension extends LayerExtension {
  static override componentName = 'CoffinCornerExtension';

  static override defaultProps = {
    selectedEntityId: { type: 'value', value: undefined },
    hoveredEntityId: { type: 'value', value: undefined },
    coffinCornerColor: { type: 'color', value: DEFAULT_CORNER_COLOR },
    getEntityId: {
      type: 'accessor',
      value: (item: { id: EntityId }) => item.id,
    },
  };

  /**
   * Initializes selection and hover entity state maps and registers
   * `instanceSelectedEntity` / `instanceHoveredEntity` GPU attributes.
   */
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
          (this.props as unknown as CoffinCornerExtensionProps).getEntityId ??
          // biome-ignore lint/suspicious/noExplicitAny: Default accessor assumes item.id exists.
          ((item: any) => item.id as EntityId);
        const items = data ?? [];
        const value = attribute.value as Float32Array;

        for (let i = 0; i < items.length; i++) {
          value[i] = entities.get(getId(items[i])) ?? 0;
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

  /**
   * Syncs `selectedEntityId` and `hoveredEntityId` prop changes into the
   * entity state maps and invalidates the corresponding GPU attributes.
   *
   * @param params - The deck.gl update parameters containing current and previous props.
   */
  override updateState(
    this: CoffinCornerLayer,
    params: UpdateParameters<Layer<CoffinCornerExtensionProps>>,
  ) {
    const attributeManager = this.getAttributeManager();

    // Selection state
    const newSelectedId = params.props.selectedEntityId;
    const oldSelectedId = params.oldProps.selectedEntityId;
    if (newSelectedId !== oldSelectedId) {
      const { selectedEntities } = this.state;
      if (oldSelectedId != null) {
        selectedEntities.delete(oldSelectedId);
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
        hoveredEntities.delete(oldHoveredId);
      }
      if (newHoveredId != null) {
        hoveredEntities.set(newHoveredId, 1);
      }
      attributeManager?.invalidate('instanceHoveredEntity');
    }
  }

  /**
   * Pushes the normalized `coffinCornerColor` to the shader's `highlightColor` uniform
   * each frame.
   */
  override draw(this: CoffinCornerLayer) {
    const color =
      (this.props as unknown as CoffinCornerExtensionProps).coffinCornerColor ??
      DEFAULT_CORNER_COLOR;

    this.setShaderModuleProps({
      coffinCorner: {
        highlightColor: [
          color[0] / 255,
          color[1] / 255,
          color[2] / 255,
          color[3] / 255,
        ],
      },
    });
  }

  /**
   * Returns the shader injection modules for coffin corner rendering.
   *
   * @returns The vertex/fragment shader injection config and uniform module.
   */
  override getShaders(this: CoffinCornerLayer, _extensions: this) {
    return SHADERS;
  }
}
