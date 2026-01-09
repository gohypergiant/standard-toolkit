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
import { clearCursorState, getCursor } from './store';
import { useMapCursor, useMapCursorEffect } from './use-map-cursor';
import type { UniqueId } from '@accelint/core';
import type { CSSCursorType } from './types';

describe('useMapCursor', () => {
  let testid: UniqueId;

  beforeEach(() => {
    // Create a stable id for each test
    testid = uuid();
  });

  afterEach(() => {
    // Clean up the store after each test
    clearCursorState(testid);
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

describe('useMapCursorEffect', () => {
  let testid: UniqueId;

  beforeEach(() => {
    // Create a stable id for each test
    testid = uuid();
  });

  afterEach(() => {
    // Clean up the store after each test
    clearCursorState(testid);
  });

  it('sets cursor on mount', () => {
    function TestComponent() {
      useMapCursorEffect('crosshair', 'test-owner', testid);
      return <div>Component</div>;
    }

    render(<TestComponent />);

    expect(getCursor(testid)).toBe('crosshair');
  });

  it('clears cursor on unmount', () => {
    function TestComponent() {
      useMapCursorEffect('crosshair', 'test-owner', testid);
      return <div>Component</div>;
    }

    const { unmount } = render(<TestComponent />);

    expect(getCursor(testid)).toBe('crosshair');

    unmount();

    // Cursor should be cleared after unmount
    expect(getCursor(testid)).toBe('default');
  });

  it('updates cursor when cursor prop changes', () => {
    function TestComponent({ cursor }: { cursor: CSSCursorType }) {
      useMapCursorEffect(cursor, 'test-owner', testid);
      return <div>Component</div>;
    }

    const { rerender } = render(<TestComponent cursor='crosshair' />);

    expect(getCursor(testid)).toBe('crosshair');

    rerender(<TestComponent cursor='zoom-in' />);

    expect(getCursor(testid)).toBe('zoom-in');
  });

  it('does not clear cursor if owner changes but cursor remains', () => {
    function TestComponent({ owner }: { owner: string }) {
      useMapCursorEffect('crosshair', owner, testid);
      return <div>Component</div>;
    }

    const { rerender } = render(<TestComponent owner='owner1' />);

    expect(getCursor(testid)).toBe('crosshair');

    // Change owner - cursor should update but stay as crosshair
    rerender(<TestComponent owner='owner2' />);

    expect(getCursor(testid)).toBe('crosshair');
  });

  it('throws error when used without id or MapProvider', () => {
    // Suppress console error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {
      // Intentionally empty - suppressing error output in test
    });

    function TestComponent() {
      useMapCursorEffect('crosshair', 'test-owner');
      return <div>Component</div>;
    }

    expect(() => {
      render(<TestComponent />);
    }).toThrow(
      'useMapCursorEffect requires either an id parameter or to be used within a MapProvider',
    );

    consoleSpy.mockRestore();
  });
});
