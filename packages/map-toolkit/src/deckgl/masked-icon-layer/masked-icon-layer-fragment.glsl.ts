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

import { MASKED_ICON_REPLACE_GLSL } from './masked-icon-glsl';

/**
 * Fragment shader for {@link MaskedIconLayer}. Forks deck.gl's IconLayer
 * fragment shader to recolor the sampled icon texel via the shared
 * `maskedIcon_replace` function (matchColor → fill/hover/click, near-match
 * blend). Pinned against `@deck.gl/layers` ~9.2.
 */
export default /* glsl */ `\
#version 300 es
#define SHADER_NAME masked-icon-layer-fragment-shader

precision highp float;

uniform sampler2D iconsTexture;

in float vColorMode;
in vec4 vColor;
in vec2 vTextureCoords;
in vec2 uv;
in vec4 vFillColor;
in float vClicked;

out vec4 fragColor;

${MASKED_ICON_REPLACE_GLSL}

void main(void) {
  geometry.uv = uv;

  vec4 texColor = texture(iconsTexture, vTextureCoords);

  // if colorMode == 0, use pixel color from the texture
  // if colorMode == 1 or rendering picking buffer, use texture as transparency mask
  vec3 color = mix(texColor.rgb, vColor.rgb, vColorMode);

  // Take the global opacity and the alpha from vColor into account for the alpha component
  float a = texColor.a * layer.opacity * vColor.a;

  if (a < icon.alphaCutoff) {
    discard;
  }

  fragColor = maskedIcon_replace(vec4(color, a));

  DECKGL_FILTER_COLOR(fragColor, geometry);
}
`;
