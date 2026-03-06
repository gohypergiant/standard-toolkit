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

/**
 * Shader module defining the `highlightColor` uniform for coffin corner brackets.
 *
 * @property name - Module identifier used by deck.gl's shader assembly.
 * @property fs - Fragment shader (GLSL) source declaring the uniform block.
 * @property uniformTypes - Maps uniform names to WGSL-style type strings for deck.gl's uniform system.
 *
 * @remarks
 * GLSL type reference:
 *   - `float`   — single decimal number
 *   - `vec2`    — 2-component vector (x, y)
 *   - `vec3`    — 3-component vector (x, y, z) or (r, g, b)
 *   - `vec4`    — 4-component vector (x, y, z, w) or (r, g, b, a)
 *   - `uniform` — read-only value passed from JS to the GPU each frame
 *   - `in/out`  — values passed between vertex and fragment shader stages
 */
const coffinCornerModule: {
  name: string;
  fs: string;
  uniformTypes: Record<string, string>;
} = {
  name: 'coffinCorner',
  fs: /* glsl */ `\
uniform coffinCornerUniforms {
  vec4 highlightColor;  // RGBA color, each channel 0.0–1.0
} coffinCorner;
`,
  uniformTypes: {
    highlightColor: 'vec4<f32>', // WGSL-style type: 4-component vector of 32-bit floats (deck.gl convention)
  },
};

/**
 * Shader injection config for vertex/fragment attribute passing and SDF bracket rendering.
 *
 * deck.gl inject keys follow the pattern `<stage>:<hook>`:
 *   - `vs:#decl`       — vertex shader, top-level declarations (before main)
 *   - `vs:#main-end`   — vertex shader, end of main()
 *   - `fs:#decl`       — fragment shader, top-level declarations (before main)
 *   - `fs:#main-start` — fragment shader, start of main()
 */
const SHADERS = {
  modules: [coffinCornerModule],
  inject: {
    'vs:#decl': /* glsl */ `\
in float instanceSelectedEntity;
in float instanceHoveredEntity;
out float v_instanceSelectedEntity; // v_ is conventional prefix for "varying"
out float v_instanceHoveredEntity;
`,
    'vs:#main-end': /* glsl */ `\
v_instanceSelectedEntity = instanceSelectedEntity;
v_instanceHoveredEntity = instanceHoveredEntity;
`,
    'fs:#decl': /* glsl */ `\
in float v_instanceSelectedEntity;
in float v_instanceHoveredEntity;

/**
 * Signed distance functions (SDF): return negative inside the shape,
 * zero on the edge, and positive outside. Used for anti-aliased rendering.
 *
 * @param position - point to measure distance from
 * @param halfExtents - half-width and half-height of the box (distance from center to each edge)
 * @returns signed distance: negative inside, zero on edge, positive outside
 */
float coffinCorner_signedDistBox(vec2 position, vec2 halfExtents) {
  vec2 dist = abs(position) - halfExtents;
  return length(max(dist, 0.0)) + min(max(dist.x, dist.y), 0.0);
}

/**
 * Signed distance to an L-shaped bracket arm (horizontal + vertical box union).
 *
 * @param position - point to measure distance from
 * @param length - length of each arm of the L-shape (fraction of icon size)
 * @param width - stroke width of each arm (fraction of icon size)
 * @returns signed distance to the nearest arm of the L-shape
 */
float coffinCorner_signedDistBracketArm(vec2 position, float length, float width) {
  float horizontalDist = coffinCorner_signedDistBox(position - vec2(length * 0.5, 0.0), vec2(length * 0.5, width * 0.5));
  float verticalDist = coffinCorner_signedDistBox(position - vec2(0.0, length * 0.5), vec2(width * 0.5, length * 0.5));
  return min(horizontalDist, verticalDist);
}

/**
 * Minimum signed distance from a point to any of the four corner brackets.
 *
 * @param position - point in normalized icon space (-0.5 to 0.5)
 * @returns signed distance to the nearest corner bracket
 */
float coffinCorner_allCorners(vec2 position) {
  const vec2 halfSize = vec2(0.5);
  float armLength = 0.26;   // bracket arm ≈ 26% of icon
  float armWidth = 0.07;    // bracket stroke ≈ 7% of icon

  vec2 topLeft = position + halfSize;
  vec2 topRight = vec2(halfSize.x - position.x, position.y + halfSize.y);
  vec2 bottomLeft = vec2(position.x + halfSize.x, halfSize.y - position.y);
  vec2 bottomRight = halfSize - position;

  return min(
    min(coffinCorner_signedDistBracketArm(topLeft, armLength, armWidth),
        coffinCorner_signedDistBracketArm(topRight, armLength, armWidth)),
    min(coffinCorner_signedDistBracketArm(bottomLeft, armLength, armWidth),
        coffinCorner_signedDistBracketArm(bottomRight, armLength, armWidth))
  );
}
`,
    'fs:#main-start': /* glsl */ `\
  geometry.uv = uv; // uv = texture coordinate of the current pixel on the icon quad (ranges -1 to 1, center is 0,0)
  bool cc_isHovered = v_instanceHoveredEntity > 0.5;
  bool cc_isSelected = v_instanceSelectedEntity > 0.5;

  if (cc_isHovered || cc_isSelected) {
    vec2 cc_position = uv * 0.5;  // map -1..1 to -0.5..0.5

    // Check if inside the icon quad (the rectangular surface the icon texture is drawn on)
    bool cc_insideBox = max(abs(cc_position.x), abs(cc_position.y)) < 0.5;

    // Distance from this pixel to the nearest bracket edge — drives stroke and fill alpha below
    float cc_cornerDist = coffinCorner_allCorners(cc_position);

    // Outline width (proportional to icon)
    float cc_stroke = 0.026;
    // Anti-alias band: ~1 screen pixel regardless of icon size
    float cc_aa = fwidth(cc_cornerDist);

    // Two alphas used to layer the bracket rendering:
    // strokeAlpha: expanded (dilated) shape — adds cc_stroke to push the edge outward, creating a black border
    // fillAlpha: true SDF edge — the actual bracket shape filled with the highlight color
    float cc_strokeAlpha = 1.0 - smoothstep(0.0, cc_aa, cc_cornerDist + cc_stroke);
    float cc_fillAlpha = 1.0 - smoothstep(0.0, cc_aa, cc_cornerDist);

    if (cc_insideBox) {
      // Sample icon texture (iconsTexture and vTextureCoords are provided by IconLayer's shader)
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
        float cc_blendedAlpha = cc_fillAlpha * cc_cornerColor.a;
        result.rgb = cc_cornerColor.rgb * cc_blendedAlpha + result.rgb * (1.0 - cc_blendedAlpha);
        result.a = cc_blendedAlpha + result.a * (1.0 - cc_blendedAlpha);
      }

      fragColor = result; // fragColor is deck.gl's built-in output variable for the final pixel color
      DECKGL_FILTER_COLOR(fragColor, geometry); // deck.gl hook: allows other extensions/filters to modify the color
      return;
    }
  }
`,
  },
};

/** Default bracket fill color when selected: #39B7FA fully opaque. */
const DEFAULT_SELECTED_CORNER_FILL: Rgba255Tuple = [57, 183, 250, 255];

// -- Extension class --

/**
 * deck.gl layer extension that renders bracket-like "coffin corner" indicators
 * around hovered and selected map entities.
 *
 * Driven by explicit `hoveredEntityId` and `selectedEntityId` props rather than
 * deck.gl's built-in autoHighlight. Data objects are identified via the
 * `getEntityId` accessor (defaults to `item => item.id`).
 *
 * **IconLayer-only** — The fragment shader samples `iconsTexture` and reads
 * `vTextureCoords`, which are uniforms/varyings specific to deck.gl's IconLayer.
 * Using this extension on other layer types will produce shader compilation errors.
 * Note: can be used on layers that extend IconLayer, like map-toolkit's SymbolLayer
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
 *   selectedCoffinCornerColor: [255, 0, 0, 255],
 * })
 * ```
 */
export class CoffinCornerExtension extends LayerExtension {
  static override componentName = 'CoffinCornerExtension';

  static override defaultProps = {
    selectedEntityId: { type: 'value', value: undefined },
    hoveredEntityId: { type: 'value', value: undefined },
    selectedCoffinCornerColor: {
      type: 'color',
      value: DEFAULT_SELECTED_CORNER_FILL,
    },
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
   * Pushes the normalized `selectedCoffinCornerColor` to the shader's `highlightColor` uniform
   * each frame.
   */
  override draw(this: CoffinCornerLayer) {
    const color =
      (this.props as unknown as CoffinCornerExtensionProps)
        .selectedCoffinCornerColor ?? DEFAULT_SELECTED_CORNER_FILL;

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
