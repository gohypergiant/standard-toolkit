/*
 * Copyright 2025 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { uuid } from '@accelint/core';
import { render } from '@testing-library/react';
import { useContext } from 'react';
import { describe, expect, it } from 'vitest';
import { destroyStore, getStore } from '../../map-mode/store';
import { MapContext, MapProvider } from './provider';

describe('MapProvider', () => {
  describe('Context Provision', () => {
    it('provides id to children via context', () => {
      const id = uuid();
      const TestComponent = () => {
        const contextId = useContext(MapContext);
        return <div>{contextId}</div>;
      };

      const { container } = render(
        <MapProvider id={id}>
          <TestComponent />
        </MapProvider>,
      );

      expect(container.textContent).toBe(id);

      // Cleanup
      destroyStore(id);
    });
  });

  describe('Provider Lifecycle', () => {
    it('reuses existing store on rerender', () => {
      const id = uuid();

      const { rerender } = render(
        <MapProvider id={id}>
          <div>First render</div>
        </MapProvider>,
      );

      const store1 = getStore(id);

      rerender(
        <MapProvider id={id}>
          <div>Second render</div>
        </MapProvider>,
      );

      const store2 = getStore(id);
      expect(store1).toBe(store2);

      // Cleanup
      destroyStore(id);
    });

    it('destroys store when unmounted', () => {
      const id = uuid();

      const { unmount } = render(
        <MapProvider id={id}>
          <div>Child</div>
        </MapProvider>,
      );

      expect(getStore(id)).toBeDefined();

      unmount();

      expect(getStore(id)).toBeUndefined();
    });
  });
});
