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

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { eventStore } from '@/stores/event-store';
import { globalBind } from '.';

let isClientValue = true;

// Mock the isClient module
vi.mock('@/lib/is-client', () => ({
  get isClient() {
    return isClientValue;
  },
}));

describe('globalBind', () => {
  const mockAddEventListener = vi.fn();

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Mock window object
    global.window = {
      addEventListener: mockAddEventListener,
    } as any;

    eventStore.getState().setBound(false);
  });

  afterEach(() => {
    // Clean up after each test
    isClientValue = true;
    eventStore.setState(eventStore.getInitialState());
    vi.restoreAllMocks();
  });

  it('should bind keydown and keyup event listeners when not already bound', () => {
    globalBind();

    expect(mockAddEventListener).toHaveBeenCalledTimes(2);
    expect(mockAddEventListener).toHaveBeenCalledWith(
      'keydown',
      expect.any(Function),
    );
    expect(mockAddEventListener).toHaveBeenCalledWith(
      'keyup',
      expect.any(Function),
    );
    expect(eventStore.getState().bound).toBe(true);
  });

  it('should not bind event listeners when already bound', () => {
    eventStore.getState().setBound(true);

    globalBind();

    expect(mockAddEventListener).not.toHaveBeenCalled();
    expect(eventStore.getState().bound).toBe(true);
  });

  it('should not bind event listeners when not in client environment', () => {
    isClientValue = false;

    globalBind();

    expect(mockAddEventListener).not.toHaveBeenCalled();
    expect(eventStore.getState().bound).toBe(false);
  });
});
