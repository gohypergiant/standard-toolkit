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
import { render, renderHook, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { destroyStore, getOrCreateStore } from './store';
import { useMapCursor } from './use-map-cursor';
import type { UniqueId } from '@accelint/core';

describe('useMapCursor', () => {
  let testid: UniqueId;

  beforeEach(() => {
    // Create a stable id and store for each test
    testid = uuid();
    getOrCreateStore(testid);
  });

  afterEach(() => {
    // Clean up the store after each test
    destroyStore(testid);
    vi.restoreAllMocks();
  });

  describe('Hook Behavior', () => {
    it('returns default cursor on mount', () => {
      const { result } = renderHook(() => useMapCursor(testid));

      expect(result.current.cursor).toBe('default');
    });

    it('provides requestCursorChange function', () => {
      const { result } = renderHook(() => useMapCursor(testid));

      expect(typeof result.current.requestCursorChange).toBe('function');
    });

    it('throws error when used outside MapProvider without id', () => {
      expect(() => {
        renderHook(() => useMapCursor());
      }).toThrow(
        'useMapCursor requires either an id parameter or to be used within a MapProvider',
      );
    });

    it('throws error when store does not exist for the given id', () => {
      const nonExistentId = uuid();
      expect(() => {
        renderHook(() => useMapCursor(nonExistentId));
      }).toThrow(`MapCursorStore not found for map instance: ${nonExistentId}`);
    });

    it('updates when cursor changes via subscription', async () => {
      const user = userEvent.setup();

      function TestComponent() {
        const { cursor, requestCursorChange } = useMapCursor(testid);

        return (
          <div>
            <span data-testid='cursor'>{cursor}</span>
            <button
              type='button'
              onClick={() => requestCursorChange('zoom-in', 'owner1')}
              data-testid='change-cursor'
            >
              Change
            </button>
          </div>
        );
      }

      render(<TestComponent />);

      const cursorDisplay = screen.getByTestId('cursor');
      expect(cursorDisplay).toHaveTextContent('default');

      await user.click(screen.getByTestId('change-cursor'));

      await waitFor(() => {
        expect(cursorDisplay).toHaveTextContent('zoom-in');
      });
    });
  });
});
