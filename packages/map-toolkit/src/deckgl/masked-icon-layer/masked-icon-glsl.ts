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

/**
 * Shared GLSL for masked-icon color replacement.
 *
 * Declares a single function, `maskedIcon_replace(vec4 texel) -> vec4`, that
 * recolors a sampled icon texel: pixels matching `maskedIcon.matchColor` become
 * the current target color, and the anti-aliased rim between the match color and
 * the outline (`maskedIcon.ignoreColor`) is recolored to preserve that gradient.
 * Every other pixel — including solid colors that merely sit near the match color
 * but off the match→ignore line (e.g. white) — passes through untouched. The
 * target is `clickColor` when the instance is clicked, `hoverColor` when the
 * picking buffer marks it as hovered, otherwise the per-instance `vFillColor`.
 *
 * The function is *declared* by {@link MaskedIconLayer}'s fragment shader (this
 * constant is inlined there) and *called* both from that shader's `main` and
 * from `MaskedCoffinCornerExtension`'s injected `fs:#main-start` — which compiles
 * into the same program, so the replacement math has a single source of truth.
 * It depends on the `maskedIcon` uniform block (see `masked-icon-uniforms.ts`)
 * and the `vFillColor` / `vClicked` varyings emitted by the masked-icon vertex
 * shader, plus deck.gl's `picking_vRGBcolor_Avalid` — all of which a
 * MaskedIconLayer host provides.
 *
 * @remarks
 * `MASKED_ICON_EDGE_TOLERANCE` is how far (in normalized 0..1 RGB space) a texel
 * may sit off the match→ignore line and still be treated as an anti-aliased rim
 * pixel. Widen it if rims fringe; tighten it if unrelated colors get recolored.
 */
export const MASKED_ICON_REPLACE_GLSL = /* glsl */ `\
// How far (in normalized 0..1 RGB space) a texel may sit OFF the
// matchColor → ignoreColor line and still count as an anti-aliased edge pixel.
// Anti-aliased rims between the maskable fill and the outline land on that line;
// unrelated solid colors (e.g. white) sit well off it and pass through untouched.
const float MASKED_ICON_EDGE_TOLERANCE = 0.08;

vec4 maskedIcon_replace(vec4 texel) {
  // Determine the current target color: clicked > hovered > fill.
  vec3 currentColor = vClicked > 0.5
    ? maskedIcon.clickColor.rgb
    : bool(picking_vRGBcolor_Avalid.a)
      ? maskedIcon.hoverColor.rgb
      : vFillColor.rgb;

  // Exact match → target color.
  if (all(equal(texel.rgb, maskedIcon.matchColor.rgb))) {
    texel.rgb = currentColor.rgb;
    return texel;
  }

  // Anti-aliased edge handling. An anti-aliased rim pixel is a linear blend of
  // the match color and the outline (ignore) color, so it lies on the segment
  // between them. Project the texel onto that segment:
  //   t  = position along the segment (0 = matchColor, 1 = ignoreColor)
  //   perp = how far the texel sits off the segment
  // Only pixels close to the segment (small perp) are treated as edges, so a
  // solid color that merely happens to be near the match color in distance —
  // but off the match→ignore line — is left unchanged.
  vec3 segment = maskedIcon.ignoreColor.rgb - maskedIcon.matchColor.rgb;
  float segmentLenSq = dot(segment, segment);

  if (segmentLenSq > 0.0001) {
    vec3 toTexel = texel.rgb - maskedIcon.matchColor.rgb;
    float t = clamp(dot(toTexel, segment) / segmentLenSq, 0.0, 1.0);
    vec3 projected = maskedIcon.matchColor.rgb + t * segment;
    float perp = distance(texel.rgb, projected);

    if (perp < MASKED_ICON_EDGE_TOLERANCE) {
      // Recolor the rim: replace the match-color end with the target color while
      // preserving the gradient toward the outline (ignore) color.
      texel.rgb = mix(currentColor.rgb, maskedIcon.ignoreColor.rgb, t);
    }
  }

  return texel;
}
`;
