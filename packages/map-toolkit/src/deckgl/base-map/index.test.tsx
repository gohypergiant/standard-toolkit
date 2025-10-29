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
import { describe, expect, it, vi } from 'vitest';
import { destroyStore, getStore } from '../../map-mode/store';
import { BaseMap } from './index';

// Mock MapLibre hook since it requires browser APIs
vi.mock('../../maplibre/hooks/use-maplibre', () => ({
  useMapLibre: vi.fn(),
}));

describe('BaseMap', () => {
  describe('Rendering', () => {
    it('renders with className', () => {
      const instanceId = uuid();
      const { container } = render(
        <BaseMap className='custom-map-class' instanceId={instanceId} />,
      );

      const mapContainer = container.querySelector('.custom-map-class');
      expect(mapContainer).toBeInTheDocument();

      // Cleanup
      destroyStore(instanceId);
    });
  });

  describe('Props', () => {
    it('passes instanceId to MapIdProvider correctly', () => {
      const specificInstanceId = uuid();

      render(<BaseMap instanceId={specificInstanceId} />);

      // Verify that a store exists for the provided instanceId
      // This confirms instanceId was passed through to MapIdProvider
      const store = getStore(specificInstanceId);
      expect(store).toBeDefined();

      // Verify no store exists for a different instanceId
      const differentId = uuid();
      const wrongStore = getStore(differentId);
      expect(wrongStore).toBeUndefined();

      // Cleanup
      destroyStore(specificInstanceId);
    });
  });
});
