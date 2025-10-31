import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

let isClientValue = true;
vi.mock('@/lib/is-client', () => ({
  get isClient() {
    return isClientValue;
  },
}));

const CHROME_WINDOWS_USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36';
const CHROME_MACOS_USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36';

describe('isMac', () => {
  // Store the original window object
  const originalWindow = global.window;

  beforeEach(() => {
    isClientValue = false;
  });

  afterEach(() => {
    // Restore window after each test
    global.window = originalWindow;
  });

  it('should return false if client is false and Windows', async () => {
    // Ensure window is defined
    global.window = {
      navigator: {
        userAgent: CHROME_WINDOWS_USER_AGENT,
      },
    } as Window & typeof globalThis;

    // Re-import the module to evaluate isClient with the new window value
    vi.resetModules();
    const { isMac } = await import('.');

    expect(isMac).toBe(false);
  });

  it('should return false if client is false and macOS', async () => {
    // Ensure window is defined
    global.window = {
      navigator: {
        userAgent: CHROME_MACOS_USER_AGENT,
      },
    } as Window & typeof globalThis;

    // Re-import the module to evaluate isClient with the new window value
    vi.resetModules();
    const { isMac } = await import('.');

    expect(isMac).toBe(false);
  });

  it('should return false if client is true and Windows', async () => {
    isClientValue = true;

    // Ensure window is defined
    global.window = {
      navigator: {
        userAgent: CHROME_WINDOWS_USER_AGENT,
      },
    } as Window & typeof globalThis;

    // Re-import the module to evaluate isClient with the new window value
    vi.resetModules();
    const { isMac } = await import('.');

    expect(isMac).toBe(false);
  });

  it('should return true if client is true and macOS', async () => {
    isClientValue = true;

    // Ensure window is defined
    global.window = {
      navigator: {
        userAgent: CHROME_MACOS_USER_AGENT,
      },
    } as Window & typeof globalThis;

    // Re-import the module to evaluate isClient with the new window value
    vi.resetModules();
    const { isMac } = await import('.');

    expect(isMac).toBe(true);
  });
});
