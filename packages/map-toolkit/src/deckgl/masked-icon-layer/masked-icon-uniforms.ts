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

import type { ShaderModule } from '@luma.gl/shadertools';

const uniformBlock = /* glsl */ `\
uniform maskedIconUniforms {
  vec4 matchColor;
  vec4 ignoreColor;
  vec4 hoverColor;
  vec4 clickColor;
} maskedIcon;
`;

/**
 * Normalized (0–1) color inputs for the `maskedIcon` uniform block.
 */
export type MaskedIconShaderProps = {
  matchColor: number[] | Uint8Array | Uint8ClampedArray;
  ignoreColor: number[] | Uint8Array | Uint8ClampedArray;
  hoverColor: number[] | Uint8Array | Uint8ClampedArray;
  clickColor: number[] | Uint8Array | Uint8ClampedArray;
};

/**
 * Shader module declaring the `maskedIcon` uniform block consumed by
 * {@link MaskedIconLayer} and the masked `CoffinCornerExtension` override.
 */
export const maskedIconUniforms = {
  name: 'maskedIcon',
  vs: uniformBlock,
  fs: uniformBlock,
  uniformTypes: {
    matchColor: 'vec4<f32>',
    ignoreColor: 'vec4<f32>',
    hoverColor: 'vec4<f32>',
    clickColor: 'vec4<f32>',
  },
} as const satisfies ShaderModule<MaskedIconShaderProps>;
