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
