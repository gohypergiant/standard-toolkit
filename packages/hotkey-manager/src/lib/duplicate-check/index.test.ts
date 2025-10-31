import { afterEach, describe, expect, it, vi } from 'vitest';

// Extend the globalThis type to include our symbol
declare global {
  var __HOTKEY_DUPLICATE_CHECK_SYMBOL: symbol | undefined;
}

describe('duplicate-check', () => {
  afterEach(() => {
    delete globalThis.__HOTKEY_DUPLICATE_CHECK_SYMBOL;
    vi.resetModules();
  });

  it('should set the symbol if it is not set', async () => {
    await vi.importActual('.');

    expect(globalThis.__HOTKEY_DUPLICATE_CHECK_SYMBOL).toBeDefined();
  });

  it('should throw an error if the symbol is already set', async () => {
    await vi.importActual('.');

    vi.resetModules();

    expect(async () => {
      await vi.importActual('.');
    }).rejects.toThrow();
  });
});
