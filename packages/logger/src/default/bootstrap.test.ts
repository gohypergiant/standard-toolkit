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

import { getSimplePrettyTerminal } from '@loglayer/transport-simple-pretty-terminal';
import { LogLayer, StructuredTransport } from 'loglayer';
import { serializeError } from 'serialize-error';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { callsitePlugin } from '../plugins/callsite';
import { environmentPlugin } from '../plugins/environment';
import { bootstrap } from './bootstrap';

vi.mock('loglayer', () => ({
  LogLayer: vi.fn(function () {
    return {
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      debug: vi.fn(),
      trace: vi.fn(),
      fatal: vi.fn(),
      withLogLevelManager: vi.fn(),
    };
  }),
  StructuredTransport: vi.fn(function () {
    return { type: 'structured' as const };
  }),
  LogLevel: {
    trace: 'trace',
    debug: 'debug',
    info: 'info',
    warn: 'warn',
    error: 'error',
    fatal: 'fatal',
  },
}));

vi.mock('@loglayer/transport-simple-pretty-terminal', () => ({
  getSimplePrettyTerminal: vi.fn(() => ({ type: 'pretty' as const })),
}));

vi.mock('serialize-error', () => ({
  serializeError: vi.fn((error: Error) => error),
}));

vi.mock('../plugins/callsite', () => ({
  callsitePlugin: vi.fn(() => ({ id: 'callsite' })),
}));

vi.mock('../plugins/environment', () => ({
  environmentPlugin: vi.fn(() => ({ id: 'environment' })),
}));

describe('bootstrap', () => {
  describe('Default configuration', () => {
    test('should create LogLayer instance with logging methods', () => {
      const logger = bootstrap({ enabled: true });

      expect(logger.info).toBeTypeOf('function');
      expect(logger.warn).toBeTypeOf('function');
      expect(logger.error).toBeTypeOf('function');
      expect(logger.debug).toBeTypeOf('function');
      expect(vi.mocked(LogLayer)).toHaveBeenCalledOnce();
    });

    test('should use debug level when level option is not provided', () => {
      bootstrap({ enabled: true });

      expect(vi.mocked(getSimplePrettyTerminal)).toHaveBeenCalledWith(
        expect.objectContaining({ level: 'debug' }),
      );
    });

    test('should use development environment when env option is not provided', () => {
      bootstrap({ enabled: true });

      expect(vi.mocked(callsitePlugin)).toHaveBeenCalledWith(
        expect.objectContaining({ isProductionEnv: false }),
      );
      expect(vi.mocked(environmentPlugin)).toHaveBeenCalledWith(
        expect.objectContaining({ isProductionEnv: false }),
      );
    });

    test('should enable pretty printing when pretty option is not provided', () => {
      bootstrap({ enabled: true });

      expect(vi.mocked(getSimplePrettyTerminal)).toHaveBeenCalled();
      expect(vi.mocked(StructuredTransport)).not.toHaveBeenCalled();
    });

    test('should use empty prefix when prefix option is not provided', () => {
      bootstrap({ enabled: true });

      expect(vi.mocked(LogLayer)).toHaveBeenCalledWith(
        expect.objectContaining({ prefix: '' }),
      );
    });
  });

  describe('Custom level configuration', () => {
    test.each([
      { level: 'trace' as const },
      { level: 'debug' as const },
      { level: 'info' as const },
      { level: 'warn' as const },
      { level: 'error' as const },
      { level: 'fatal' as const },
    ])('should pass $level level to transport', ({ level }) => {
      bootstrap({ enabled: true, level });

      expect(vi.mocked(getSimplePrettyTerminal)).toHaveBeenCalledWith(
        expect.objectContaining({ level }),
      );
    });
  });

  describe('Environment detection', () => {
    let originalWindow: (typeof globalThis)['window'] | undefined;

    beforeEach(() => {
      originalWindow = globalThis.window;
    });

    afterEach(() => {
      if (originalWindow === undefined) {
        // @ts-expect-error - intentionally deleting window for cleanup
        delete globalThis.window;
      } else {
        globalThis.window = originalWindow;
      }
    });

    test('should set isProductionEnv to true when env is production', () => {
      bootstrap({ enabled: true, env: 'production' });

      expect(vi.mocked(callsitePlugin)).toHaveBeenCalledWith(
        expect.objectContaining({ isProductionEnv: true }),
      );
      expect(vi.mocked(environmentPlugin)).toHaveBeenCalledWith(
        expect.objectContaining({ isProductionEnv: true }),
      );
    });

    test('should set isProductionEnv to false when env is development', () => {
      bootstrap({ enabled: true, env: 'development' });

      expect(vi.mocked(callsitePlugin)).toHaveBeenCalledWith(
        expect.objectContaining({ isProductionEnv: false }),
      );
      expect(vi.mocked(environmentPlugin)).toHaveBeenCalledWith(
        expect.objectContaining({ isProductionEnv: false }),
      );
    });

    test('should set isProductionEnv to false when env is test', () => {
      bootstrap({ enabled: true, env: 'development' });

      expect(vi.mocked(callsitePlugin)).toHaveBeenCalledWith(
        expect.objectContaining({ isProductionEnv: false }),
      );
      expect(vi.mocked(environmentPlugin)).toHaveBeenCalledWith(
        expect.objectContaining({ isProductionEnv: false }),
      );
    });

    test('should set isServer to true when window is undefined', () => {
      // @ts-expect-error - intentionally deleting window to simulate Node.js
      delete globalThis.window;

      bootstrap({ enabled: true });

      expect(vi.mocked(environmentPlugin)).toHaveBeenCalledWith(
        expect.objectContaining({ isServer: true }),
      );
    });

    test('should set isServer to false when window is defined', () => {
      globalThis.window = {} as Window & typeof globalThis;

      bootstrap({ enabled: true });

      expect(vi.mocked(environmentPlugin)).toHaveBeenCalledWith(
        expect.objectContaining({ isServer: false }),
      );
    });
  });

  describe('Transport configuration', () => {
    test('should use pretty terminal transport when pretty is true', () => {
      bootstrap({ enabled: true, pretty: true });

      expect(vi.mocked(getSimplePrettyTerminal)).toHaveBeenCalled();
      expect(vi.mocked(StructuredTransport)).not.toHaveBeenCalled();
    });

    test('should use console transport when pretty is false', () => {
      bootstrap({ enabled: true, pretty: false });

      expect(vi.mocked(StructuredTransport)).toHaveBeenCalled();
      expect(vi.mocked(getSimplePrettyTerminal)).not.toHaveBeenCalled();
    });

    test('should include custom transports after default transport', () => {
      const customTransport = { log: vi.fn() };

      // @ts-expect-error partial transport implementation
      bootstrap({ enabled: true, transports: [customTransport] });

      expect(vi.mocked(LogLayer)).toHaveBeenCalledWith(
        expect.objectContaining({
          transport: expect.arrayContaining([customTransport]),
        }),
      );
    });

    test('should handle empty transports array', () => {
      bootstrap({ enabled: true, transports: [] });

      expect(vi.mocked(LogLayer)).toHaveBeenCalledWith(
        expect.objectContaining({
          transport: expect.any(Array),
        }),
      );
    });

    test('should handle multiple custom transports', () => {
      const transport1 = { log: vi.fn() };
      const transport2 = { log: vi.fn() };

      // @ts-expect-error partial transport implementation
      bootstrap({ enabled: true, transports: [transport1, transport2] });

      expect(vi.mocked(LogLayer)).toHaveBeenCalledWith(
        expect.objectContaining({
          transport: expect.arrayContaining([transport1, transport2]),
        }),
      );
    });
  });

  describe('Plugin configuration', () => {
    test('should include callsitePlugin and environmentPlugin by default', () => {
      bootstrap({ enabled: true });

      expect(vi.mocked(callsitePlugin)).toHaveBeenCalled();
      expect(vi.mocked(environmentPlugin)).toHaveBeenCalled();
    });

    test('should append custom plugins after default plugins', () => {
      const customPlugin = {
        id: 'custom-plugin',
        onBeforeDataOut: vi.fn(({ data }: { data: object }) => data),
      };

      // @ts-expect-error partial plugin implementation
      bootstrap({ enabled: true, plugins: [customPlugin] });

      expect(vi.mocked(LogLayer)).toHaveBeenCalledWith(
        expect.objectContaining({
          plugins: expect.arrayContaining([customPlugin]),
        }),
      );
    });

    test('should handle empty plugins array', () => {
      bootstrap({ enabled: true, plugins: [] });

      expect(vi.mocked(LogLayer)).toHaveBeenCalledWith(
        expect.objectContaining({
          plugins: expect.any(Array),
        }),
      );
    });

    test('should handle multiple custom plugins', () => {
      const plugin1 = {
        id: 'plugin-1',
        onBeforeDataOut: vi.fn(({ data }: { data: object }) => data),
      };
      const plugin2 = {
        id: 'plugin-2',
        onBeforeDataOut: vi.fn(({ data }: { data: object }) => data),
      };

      // @ts-expect-error partial plugin implementation
      bootstrap({ enabled: true, plugins: [plugin1, plugin2] });

      expect(vi.mocked(LogLayer)).toHaveBeenCalledWith(
        expect.objectContaining({
          plugins: expect.arrayContaining([plugin1, plugin2]),
        }),
      );
    });
  });

  describe('Prefix configuration', () => {
    test('should set custom prefix when provided', () => {
      bootstrap({ enabled: true, prefix: '[MyApp]' });

      expect(vi.mocked(LogLayer)).toHaveBeenCalledWith(
        expect.objectContaining({ prefix: '[MyApp]' }),
      );
    });

    test('should handle empty string prefix', () => {
      bootstrap({ enabled: true, prefix: '' });

      expect(vi.mocked(LogLayer)).toHaveBeenCalledWith(
        expect.objectContaining({ prefix: '' }),
      );
    });
  });

  describe('Enabled configuration', () => {
    test('should create logger with enabled=true', () => {
      bootstrap({ enabled: true });

      expect(vi.mocked(LogLayer)).toHaveBeenCalledWith(
        expect.objectContaining({ enabled: true }),
      );
    });

    test('should create logger with enabled=false', () => {
      bootstrap({ enabled: false });

      expect(vi.mocked(LogLayer)).toHaveBeenCalledWith(
        expect.objectContaining({ enabled: false }),
      );
    });
  });

  describe('Error serialization', () => {
    test('should configure serializeError as errorSerializer', () => {
      bootstrap({ enabled: true });

      expect(vi.mocked(LogLayer)).toHaveBeenCalledWith(
        expect.objectContaining({ errorSerializer: vi.mocked(serializeError) }),
      );
    });
  });

  describe('Pretty terminal configuration', () => {
    test('should configure viewMode as message-only for pretty transport', () => {
      bootstrap({ enabled: true, pretty: true });

      expect(vi.mocked(getSimplePrettyTerminal)).toHaveBeenCalledWith(
        expect.objectContaining({ viewMode: 'message-only' }),
      );
    });

    test('should configure runtime as browser for pretty transport', () => {
      bootstrap({ enabled: true, pretty: true });

      expect(vi.mocked(getSimplePrettyTerminal)).toHaveBeenCalledWith(
        expect.objectContaining({ runtime: 'browser' }),
      );
    });

    test('should set includeDataInBrowserConsole to true for pretty transport', () => {
      bootstrap({ enabled: true, pretty: true });

      expect(vi.mocked(getSimplePrettyTerminal)).toHaveBeenCalledWith(
        expect.objectContaining({ includeDataInBrowserConsole: true }),
      );
    });
  });

  describe('Structured transport configuration', () => {
    test('should configure log level for structured transport', () => {
      bootstrap({ enabled: true, pretty: false, level: 'warn' });

      expect(vi.mocked(StructuredTransport)).toHaveBeenCalledWith(
        expect.objectContaining({ level: 'warn' }),
      );
    });

    test('should use console as logger for structured transport', () => {
      bootstrap({ enabled: true, pretty: false });

      expect(vi.mocked(StructuredTransport)).toHaveBeenCalledWith(
        expect.objectContaining({ logger: console }),
      );
    });
  });
});
