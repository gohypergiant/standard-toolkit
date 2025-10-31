import { afterEach, describe, expect, it, vi } from 'vitest';

describe('isClient', () => {
  // Store the original window object
  const originalWindow = global.window;

  afterEach(() => {
    // Restore window after each test
    global.window = originalWindow;
  });

  it('should return true when window is defined (client environment)', async () => {
    // Ensure window is defined
    global.window = {} as Window & typeof globalThis;

    // Re-import the module to evaluate isClient with the new window value
    vi.resetModules();
    const { isClient } = await import('.');

    expect(isClient).toBe(true);
  });

  it('should return false when window is undefined (server environment)', async () => {
    // Mock server environment by setting window to undefined
    global.window = undefined as any;

    // Re-import the module to evaluate isClient with the new window value
    vi.resetModules();
    const { isClient } = await import('.');

    expect(isClient).toBe(false);
  });
});
