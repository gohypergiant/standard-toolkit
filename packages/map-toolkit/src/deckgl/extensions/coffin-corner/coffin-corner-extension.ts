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
import { IconLayer, ScatterplotLayer } from '@deck.gl/layers';
import { createLoggerDomain } from '@/shared/logger';
import type { Rgba255Tuple } from '@accelint/predicates';
import type { Layer, UpdateParameters } from '@deck.gl/core';
import type { CoffinCornerExtensionProps, EntityId } from './types';

const logger = createLoggerDomain('[CoffinCornerExtension]');

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

// -- Shared shader injections (IconLayer and ScatterplotLayer) --

/**
 * Vertex declarations: per-instance attributes for selection/hover state,
 * passed to the fragment shader as varyings.
 */
const VS_DECL = /* glsl */ `\
in float instanceSelectedEntity;
in float instanceHoveredEntity;
out float vInstanceSelectedEntity; // v prefix is conventional for "varying"
out float vInstanceHoveredEntity;
`;

/** Vertex main-end: forward per-instance attributes to the fragment shader. */
const VS_MAIN_END = /* glsl */ `\
vInstanceSelectedEntity = instanceSelectedEntity;
vInstanceHoveredEntity = instanceHoveredEntity;
`;

// -- ScatterplotLayer-specific vertex shader injections --

/**
 * ScatterplotLayer vertex declarations: adds `vQuadScale` varying to
 * communicate the quad expansion factor to the fragment shader.
 */
const SCATTERPLOT_VS_DECL = /* glsl */ `\
${VS_DECL}out float vQuadScale;
`;

/**
 * ScatterplotLayer vertex main-end: expands the quad when hovered/selected
 * to provide room for coffin corner brackets beyond the circle edge.
 *
 * The expansion multiplies `unitPosition` by the scale factor so that
 * fragment shader interpolation covers the larger area. The extra pixel
 * offset is added to `gl_Position` in clip space.
 *
 * References ScatterplotLayer vertex-scope variables:
 * `edgePadding`, `positions`, `outerRadiusPixels` (all still in scope at #main-end).
 */
const SCATTERPLOT_VS_MAIN_END = /* glsl */ `\
${VS_MAIN_END}
// Expand the quad when hovered/selected to make room for bracket arms.
// Scale factor 2.0 gives brackets the same visual footprint as the circle diameter.
// Skip expansion in globe mode — clip-space XY manipulation causes depth conflicts
// with the globe surface (known deck.gl limitation, see PR #9975).
vQuadScale = 1.0;
if ((instanceSelectedEntity > 0.5 || instanceHoveredEntity > 0.5)
    && project.projectionMode != PROJECTION_MODE_GLOBE) {
  vQuadScale = 2.0;
  // Add extra offset in clip space (works for both billboard and non-billboard)
  vec2 extraPixelOffset = (vQuadScale - 1.0) * edgePadding * positions.xy * outerRadiusPixels;
  gl_Position.xy += project_pixel_size_to_clipspace(extraPixelOffset);
  // Scale unitPosition so fragment interpolation covers the expanded quad
  unitPosition *= vQuadScale;
}
`;

/**
 * Fragment declarations: SDF functions for bracket rendering.
 *
 * Signed distance functions (SDF) return negative inside the shape,
 * zero on the edge, and positive outside. Used for anti-aliased rendering.
 */
const FS_DECL = /* glsl */ `\
in float vInstanceSelectedEntity;
in float vInstanceHoveredEntity;

/**
 * Signed distance to an axis-aligned box.
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
 * @param position - point in normalized space (-0.5 to 0.5)
 * @param armLength - length of each bracket arm in UV units
 * @param armWidth - stroke width of each bracket arm in UV units
 * @returns signed distance to the nearest corner bracket
 */
float coffinCorner_allCorners(vec2 position, float armLength, float armWidth) {
  const vec2 halfSize = vec2(0.5);

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

/**
 * Composite bracket visuals over a base color.
 * Applies: hover fill → base color → black stroke → colored bracket fill.
 * Returns the composited color — caller is responsible for writing to fragColor.
 *
 * @param baseColor - the layer's rendered color for this pixel (icon texture or circle fill)
 * @param isHovered - whether the entity is hovered
 * @param isSelected - whether the entity is selected
 * @param strokeAlpha - alpha for the dilated black outline
 * @param fillAlpha - alpha for the bracket fill shape
 * @returns composited RGBA color
 */
vec4 coffinCorner_composite(
  vec4 baseColor,
  bool isHovered,
  bool isSelected,
  float strokeAlpha,
  float fillAlpha
) {
  // Start with background fill (only when hovering) — white 30% opacity
  vec4 result = isHovered
    ? vec4(1.0, 1.0, 1.0, 0.3)
    : vec4(0.0);  // no fill when just selected

  // Composite base color OVER fill
  result.rgb = baseColor.rgb * baseColor.a + result.rgb * result.a * (1.0 - baseColor.a);
  result.a = baseColor.a + result.a * (1.0 - baseColor.a);

  // Composite black stroke OVER base (dilated shape)
  if (strokeAlpha > 0.01) {
    vec3 strokeColor = vec3(0.0);  // Black
    result.rgb = strokeColor * strokeAlpha + result.rgb * (1.0 - strokeAlpha);
    result.a = strokeAlpha + result.a * (1.0 - strokeAlpha);
  }

  // Composite colored fill OVER stroke (normal shape)
  if (fillAlpha > 0.01) {
    vec4 cornerColor = isSelected
      ? coffinCorner.highlightColor
      : vec4(1.0);  // White fully opaque for hover-only
    float blendedAlpha = fillAlpha * cornerColor.a;
    result.rgb = cornerColor.rgb * blendedAlpha + result.rgb * (1.0 - blendedAlpha);
    result.a = blendedAlpha + result.a * (1.0 - blendedAlpha);
  }

  return result;
}
`;

// -- Layer-specific fragment shader main-start injections --

/**
 * IconLayer `fs:#main-start` — samples `iconsTexture` to get the base icon color,
 * then composites brackets over it. References IconLayer-specific uniforms/varyings:
 * `iconsTexture`, `vTextureCoords`, `uv`.
 */
const ICON_FS_MAIN_START = /* glsl */ `\
  geometry.uv = uv; // uv = texture coordinate on the icon quad (ranges -1 to 1, center is 0,0)
  bool isHovered = vInstanceHoveredEntity > 0.5;
  bool isSelected = vInstanceSelectedEntity > 0.5;

  if (isHovered || isSelected) {
    vec2 bracketPos = uv * 0.5;  // map -1..1 to -0.5..0.5

    // Check if inside the icon quad (the rectangular surface the icon texture is drawn on)
    bool insideBox = max(abs(bracketPos.x), abs(bracketPos.y)) < 0.5;

    // Distance from this pixel to the nearest bracket edge — drives stroke and fill alpha
    float cornerDist = coffinCorner_allCorners(bracketPos, 0.26, 0.07);

    // Outline width (proportional to icon)
    float strokeWidth = 0.026;
    // Anti-alias band: ~1 screen pixel regardless of icon size
    float antiAlias = fwidth(cornerDist);

    // strokeAlpha: expanded (dilated) shape for black border
    // fillAlpha: true SDF edge for the bracket fill color
    float strokeAlpha = 1.0 - smoothstep(0.0, antiAlias, cornerDist + strokeWidth);
    float fillAlpha = 1.0 - smoothstep(0.0, antiAlias, cornerDist);

    if (insideBox) {
      // Sample icon texture (iconsTexture and vTextureCoords are provided by IconLayer's shader)
      vec4 baseColor = texture(iconsTexture, vTextureCoords);

      fragColor = coffinCorner_composite(baseColor, isHovered, isSelected, strokeAlpha, fillAlpha);
      DECKGL_FILTER_COLOR(fragColor, geometry);
      return;
    }
  }
`;

/**
 * ScatterplotLayer fragment declarations: adds `vQuadScale` varying
 * (received from the vertex shader) to the shared SDF function declarations.
 */
const SCATTERPLOT_FS_DECL = /* glsl */ `\
in float vQuadScale;
${FS_DECL}`;

/**
 * ScatterplotLayer `fs:#main-start` — replicates the circle rendering logic to get
 * the base fill/stroke color, then composites brackets over it.
 *
 * Uses two coordinate systems:
 * - **Original** (`originalUnit`): `unitPosition / vQuadScale` — maps back to
 *   the pre-expansion circle space (±1) for circle fill/stroke rendering.
 * - **Expanded** (`bracketPos`): `unitPosition / (2 * vQuadScale)` — maps the
 *   expanded quad to -0.5..0.5 for the bracket SDF.
 *
 * The vertex shader expands the quad by `vQuadScale` (2×) when hovered/selected,
 * giving the brackets room to render beyond the circle edge while keeping the circle
 * at its original visual size.
 *
 * References ScatterplotLayer-specific varyings/uniforms:
 * `unitPosition`, `outerRadiusPixels`, `innerUnitRadius`, `vFillColor`, `vLineColor`,
 * `scatterplot.antialiasing`, `scatterplot.stroked`, `scatterplot.filled`.
 */
const SCATTERPLOT_FS_MAIN_START = /* glsl */ `\
  geometry.uv = unitPosition;
  bool isHovered = vInstanceHoveredEntity > 0.5;
  bool isSelected = vInstanceSelectedEntity > 0.5;

  if (isHovered || isSelected) {
    // Bracket SDF coordinates: map the expanded quad to -0.5..0.5.
    // Since both vertex positions and unitPosition were scaled by vQuadScale,
    // the quad edge is at unitPosition ≈ ±(edgePadding * vQuadScale).
    // Dividing by (2 * vQuadScale) maps ±vQuadScale to ±0.5.
    // The circle edge (unitPosition = 1.0) maps to 1/(2*scale) ≈ 0.25 (for scale=2).
    vec2 bracketPos = unitPosition / (2.0 * vQuadScale);

    bool insideBox = max(abs(bracketPos.x), abs(bracketPos.y)) < 0.5;

    // Arm proportions scaled for the expanded quad: the circle fills ~50% of the
    // bracket box (circle edge at 0.25, bracket corner at 0.5). Shorter arms (0.15)
    // keep L-shapes distinct instead of merging into a solid square.
    float uvPerPx = fwidth(bracketPos.x);
    float armLength = max(0.15, 6.0 * uvPerPx);   // min 6px arm length
    float armWidth = max(0.04, 2.0 * uvPerPx);    // min 2px stroke width

    float cornerDist = coffinCorner_allCorners(bracketPos, armLength, armWidth);
    float strokeWidth = max(0.016, 1.0 * uvPerPx);     // min 1px outline
    float antiAlias = fwidth(cornerDist);
    float strokeAlpha = 1.0 - smoothstep(0.0, antiAlias, cornerDist + strokeWidth);
    float fillAlpha = 1.0 - smoothstep(0.0, antiAlias, cornerDist);

    if (insideBox) {
      // Circle rendering uses unitPosition directly (NOT divided by vQuadScale).
      // Because both the vertex positions and unitPosition were scaled equally in
      // the vertex shader, the interpolated unitPosition at the circle-edge screen
      // position is preserved at 1.0 — identical to the original shader's math.
      float distToCenter = length(unitPosition) * outerRadiusPixels;
      float inCircle = scatterplot.antialiasing
        ? smoothedge(distToCenter, outerRadiusPixels)
        : step(distToCenter, outerRadiusPixels);

      vec4 baseColor = vec4(0.0);
      if (inCircle > 0.0) {
        if (scatterplot.stroked > 0.5) {
          float isLine = scatterplot.antialiasing
            ? smoothedge(innerUnitRadius * outerRadiusPixels, distToCenter)
            : step(innerUnitRadius * outerRadiusPixels, distToCenter);
          if (scatterplot.filled > 0.5) {
            baseColor = mix(vFillColor, vLineColor, isLine);
          } else {
            baseColor = vec4(vLineColor.rgb, vLineColor.a * isLine);
          }
        } else if (scatterplot.filled > 0.5) {
          baseColor = vFillColor;
        }
        baseColor.a *= inCircle;
      }

      fragColor = coffinCorner_composite(baseColor, isHovered, isSelected, strokeAlpha, fillAlpha);
      DECKGL_FILTER_COLOR(fragColor, geometry);
      return;
    }
  }
`;

// -- Shader configs --

/**
 * Shader injection config for IconLayer.
 *
 * deck.gl inject keys follow the pattern `<stage>:<hook>`:
 *   - `vs:#decl`       — vertex shader, top-level declarations (before main)
 *   - `vs:#main-end`   — vertex shader, end of main()
 *   - `fs:#decl`       — fragment shader, top-level declarations (before main)
 *   - `fs:#main-start` — fragment shader, start of main()
 */
const ICON_SHADERS = {
  modules: [coffinCornerModule],
  inject: {
    'vs:#decl': VS_DECL,
    'vs:#main-end': VS_MAIN_END,
    'fs:#decl': FS_DECL,
    'fs:#main-start': ICON_FS_MAIN_START,
  },
};

/**
 * Shader injection config for ScatterplotLayer.
 * Uses scatterplot-specific vertex injections for quad expansion and
 * scatterplot-specific fragment declarations for the `vQuadScale` varying.
 */
const SCATTERPLOT_SHADERS = {
  modules: [coffinCornerModule],
  inject: {
    'vs:#decl': SCATTERPLOT_VS_DECL,
    'vs:#main-end': SCATTERPLOT_VS_MAIN_END,
    'fs:#decl': SCATTERPLOT_FS_DECL,
    'fs:#main-start': SCATTERPLOT_FS_MAIN_START,
  },
};

/** Default bracket fill color when selected: #39B7FA fully opaque. */
const DEFAULT_SELECTED_CORNER_FILL: Rgba255Tuple = [57, 183, 250, 255];

/** Layer types supported by this extension. */
const SUPPORTED_LAYERS = [IconLayer, ScatterplotLayer];

// -- Extension class --

/**
 * deck.gl layer extension that renders bracket-like "coffin corner" indicators
 * around hovered and selected map entities.
 *
 * Driven by explicit `hoveredEntityId` and `selectedEntityId` props rather than
 * deck.gl's built-in autoHighlight. Data objects are identified via the
 * `getEntityId` accessor (defaults to `item => item.id`).
 *
 * **Supported layer types:**
 * - **IconLayer** (and subclasses like SymbolLayer) — samples `iconsTexture`
 *   to re-composite the icon beneath the brackets.
 * - **ScatterplotLayer** — replicates the circle fill/stroke logic to composite
 *   the circle beneath the brackets.
 *
 * Using this extension on unsupported layer types will produce shader compilation
 * errors due to missing layer-specific uniforms/varyings.
 *
 * The host layer must set `pickable` to enable picking events.
 *
 * @see CoffinCornerExtensionProps for the full list of extension props.
 *
 * @example Fiber renderer JSX (IconLayer / SymbolLayer)
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
 * @example ScatterplotLayer
 * ```typescript
 * new ScatterplotLayer({
 *   extensions: [new CoffinCornerExtension()],
 *   getEntityId: (d) => d.id,
 *   selectedEntityId: selectedId,
 *   hoveredEntityId: hoveredId,
 * })
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

  /** Returns true if the host layer is a supported type. */
  private static isSupportedLayer(layer: Layer): boolean {
    return SUPPORTED_LAYERS.some((LayerType) => layer instanceof LayerType);
  }

  /**
   * Initializes selection and hover entity state maps and registers
   * `instanceSelectedEntity` / `instanceHoveredEntity` GPU attributes.
   * No-op on unsupported layer types (e.g. PathLayer, SolidPolygonLayer).
   */
  override initializeState(this: CoffinCornerLayer) {
    if (!CoffinCornerExtension.isSupportedLayer(this)) {
      logger.warn(
        `CoffinCornerExtension supports IconLayer and ScatterplotLayer (and subclasses). Received: ${(this.constructor as typeof Layer).layerName}`,
      );
      return;
    }

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
   * No-op on unsupported layer types.
   *
   * @param params - The deck.gl update parameters containing current and previous props.
   */
  override updateState(
    this: CoffinCornerLayer,
    params: UpdateParameters<Layer<CoffinCornerExtensionProps>>,
  ) {
    if (!CoffinCornerExtension.isSupportedLayer(this)) {
      return;
    }

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
   * each frame. No-op on unsupported layer types.
   */
  override draw(this: CoffinCornerLayer) {
    if (!CoffinCornerExtension.isSupportedLayer(this)) {
      return;
    }

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
   * Returns the appropriate shader injection config based on the host layer type.
   * IconLayer gets texture-sampling shaders; ScatterplotLayer gets circle-replicating shaders.
   * Returns null for unsupported layer types to skip shader injection.
   *
   * @returns The vertex/fragment shader injection config and uniform module, or null.
   */
  override getShaders(this: CoffinCornerLayer, _extensions: this) {
    if (this instanceof ScatterplotLayer) {
      return SCATTERPLOT_SHADERS;
    }
    if (this instanceof IconLayer) {
      return ICON_SHADERS;
    }
    return null;
  }
}
