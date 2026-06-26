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

import { IconLayer, ScatterplotLayer } from '@deck.gl/layers';
import { beforeEach, describe, expect, it } from 'vitest';
import { MaskedCoffinCornerExtension } from './masked-coffin-corner-extension';

/** Mock a deck.gl layer of the given prototype for `instanceof` checks. */
function createMockLayer(prototype: object) {
  // biome-ignore lint/suspicious/noExplicitAny: Mock only needs to pass instanceof.
  return Object.create(prototype) as any;
}

describe('MaskedCoffinCornerExtension', () => {
  let extension: MaskedCoffinCornerExtension;

  beforeEach(() => {
    extension = new MaskedCoffinCornerExtension();
  });

  it('has its own component name', () => {
    expect(MaskedCoffinCornerExtension.componentName).toBe(
      'MaskedCoffinCornerExtension',
    );
  });

  describe('getShaders on an IconLayer host', () => {
    it('replaces the icon main-start with the masked color replacement', () => {
      const layer = createMockLayer(IconLayer.prototype);

      const shaders = extension.getShaders.call(layer, extension);
      const fsMainStart = shaders?.inject?.['fs:#main-start'] ?? '';

      // Samples + masks the icon before compositing brackets.
      expect(fsMainStart).toContain('maskedIcon_replace');
      expect(fsMainStart).toContain('texture(iconsTexture, vTextureCoords)');
      expect(fsMainStart).toContain('coffinCorner_composite');
    });

    it('keeps the base SDF declarations from fs:#decl', () => {
      const layer = createMockLayer(IconLayer.prototype);

      const shaders = extension.getShaders.call(layer, extension);

      // The SDF helpers still come from the inherited base fs:#decl.
      expect(shaders?.inject?.['fs:#decl']).toContain(
        'coffinCorner_allCorners',
      );
    });
  });

  describe('getShaders on a ScatterplotLayer host', () => {
    it('leaves the scatterplot shaders untouched (no masked override)', () => {
      const layer = createMockLayer(ScatterplotLayer.prototype);

      const shaders = extension.getShaders.call(layer, extension);
      const fsMainStart = shaders?.inject?.['fs:#main-start'] ?? '';

      // The scatterplot host has no maskedIcon helpers, so the override must not
      // be injected; it keeps the inherited scatterplot main-start.
      expect(fsMainStart).not.toContain('maskedIcon_replace');
      // It still returns the inherited scatterplot config.
      expect(fsMainStart).toContain('vQuadScale');
    });
  });

  it('returns null for unsupported layer types', () => {
    const layer = createMockLayer(Object.prototype);

    const shaders = extension.getShaders.call(layer, extension);

    expect(shaders).toBeNull();
  });
});
