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

import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest';
import { bootstrap } from './bootstrap';
import type { LoggerOptions } from '../definitions';

// Mock dependencies
vi.mock('loglayer', () => ({
  LogLayer: vi.fn(function (this: any, config: any) {
    this.config = config;
    this.info = vi.fn();
    this.warn = vi.fn();
    this.error = vi.fn();
    this.debug = vi.fn();
    this.trace = vi.fn();
    this.fatal = vi.fn();
    return this;
  }),
  ConsoleTransport: vi.fn(function (this: any, config: any) {
    this.type = 'console';
    this.config = config;
    return this;
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
  getSimplePrettyTerminal: vi.fn((config: any) => ({
    type: 'pretty',
    config,
  })),
}));

vi.mock('serialize-error', () => ({
  serializeError: vi.fn((error: Error) => error),
}));

vi.mock('../plugins/callsite', () => ({
  callsitePlugin: vi.fn((options: any) => ({
    id: 'callsite',
    pluginOptions: options,
  })),
}));

vi.mock('../plugins/environment', () => ({
  environmentPlugin: vi.fn((options: any) => ({
    id: 'environment',
    pluginOptions: options,
  })),
}));

describe('bootstrap', () => {
  let windowSpy: typeof globalThis.window | undefined;
  let LogLayerMock: any;
  let getSimplePrettyTerminalMock: any;
  let ConsoleTransportMock: any;
  let callsitePluginMock: any;
  let environmentPluginMock: any;
  let serializeErrorMock: any;

  beforeEach(async () => {
    // Store original window value
    windowSpy = globalThis.window;

    // Get mocked functions
    const loglayerModule = await import('loglayer');
    const prettyTerminalModule = await import(
      '@loglayer/transport-simple-pretty-terminal'
    );
    const serializeErrorModule = await import('serialize-error');
    const callsiteModule = await import('../plugins/callsite');
    const environmentModule = await import('../plugins/environment');

    LogLayerMock = loglayerModule.LogLayer as any;
    getSimplePrettyTerminalMock =
      prettyTerminalModule.getSimplePrettyTerminal as any;
    ConsoleTransportMock = loglayerModule.ConsoleTransport as any;
    callsitePluginMock = callsiteModule.callsitePlugin as any;
    environmentPluginMock = environmentModule.environmentPlugin as any;
    serializeErrorMock = serializeErrorModule.serializeError as any;

    // Clear mock call history
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Restore original window value
    if (windowSpy === undefined) {
      // @ts-expect-error - intentionally deleting window for cleanup
      delete globalThis.window;
    } else {
      globalThis.window = windowSpy;
    }
    vi.restoreAllMocks();
  });

  describe('Default configuration', () => {
    test('should create LogLayer instance with default options', () => {
      const options: LoggerOptions = { enabled: true };

      const logger = bootstrap(options);

      expect(logger).toBeDefined();
      expect(logger.info).toBeTypeOf('function');
      expect(logger.warn).toBeTypeOf('function');
      expect(logger.error).toBeTypeOf('function');
      expect(logger.debug).toBeTypeOf('function');
      expect(LogLayerMock).toHaveBeenCalledTimes(1);
    });

    test('should use debug level when level option is not provided', () => {
      const options: LoggerOptions = { enabled: true };

      const logger = bootstrap(options);

      expect(logger).toBeDefined();
      expect(getSimplePrettyTerminalMock).toHaveBeenCalledWith(
        expect.objectContaining({ level: 'debug' }),
      );
    });

    test('should use development environment when env option is not provided', () => {
      const options: LoggerOptions = { enabled: true };

      const logger = bootstrap(options);

      expect(logger).toBeDefined();
      expect(callsitePluginMock).toHaveBeenCalledWith(
        expect.objectContaining({ isProductionEnv: false }),
      );
      expect(environmentPluginMock).toHaveBeenCalledWith(
        expect.objectContaining({ isProductionEnv: false }),
      );
    });

    test('should enable pretty printing when pretty option is not provided', () => {
      const options: LoggerOptions = { enabled: true };

      const logger = bootstrap(options);

      expect(logger).toBeDefined();
      expect(getSimplePrettyTerminalMock).toHaveBeenCalled();
      expect(ConsoleTransportMock).not.toHaveBeenCalled();
    });

    test('should use empty prefix when prefix option is not provided', () => {
      const options: LoggerOptions = { enabled: true };

      const logger = bootstrap(options);

      expect(logger).toBeDefined();
      expect(LogLayerMock).toHaveBeenCalledWith(
        expect.objectContaining({ prefix: '' }),
      );
    });
  });

  describe('Custom level configuration', () => {
    test.each([
      { level: 'trace' as const, description: 'trace level' },
      { level: 'debug' as const, description: 'debug level' },
      { level: 'info' as const, description: 'info level' },
      { level: 'warn' as const, description: 'warn level' },
      { level: 'error' as const, description: 'error level' },
      { level: 'fatal' as const, description: 'fatal level' },
    ])('should create logger with $description when level is $level', ({
      level,
    }) => {
      const options: LoggerOptions = { enabled: true, level };

      const logger = bootstrap(options);

      expect(logger).toBeDefined();
      expect(getSimplePrettyTerminalMock).toHaveBeenCalledWith(
        expect.objectContaining({ level }),
      );
    });
  });

  describe('Environment detection', () => {
    test('should set isProductionEnv to true when env is production', () => {
      const options: LoggerOptions = { enabled: true, env: 'production' };

      const logger = bootstrap(options);

      expect(logger).toBeDefined();
      expect(callsitePluginMock).toHaveBeenCalledWith(
        expect.objectContaining({ isProductionEnv: true }),
      );
      expect(environmentPluginMock).toHaveBeenCalledWith(
        expect.objectContaining({ isProductionEnv: true }),
      );
    });

    test('should set isProductionEnv to false when env is development', () => {
      const options: LoggerOptions = { enabled: true, env: 'development' };

      const logger = bootstrap(options);

      expect(logger).toBeDefined();
      expect(callsitePluginMock).toHaveBeenCalledWith(
        expect.objectContaining({ isProductionEnv: false }),
      );
      expect(environmentPluginMock).toHaveBeenCalledWith(
        expect.objectContaining({ isProductionEnv: false }),
      );
    });

    test('should set isProductionEnv to false when env is test', () => {
      const options: LoggerOptions = { enabled: true, env: 'test' };

      const logger = bootstrap(options);

      expect(logger).toBeDefined();
      expect(callsitePluginMock).toHaveBeenCalledWith(
        expect.objectContaining({ isProductionEnv: false }),
      );
      expect(environmentPluginMock).toHaveBeenCalledWith(
        expect.objectContaining({ isProductionEnv: false }),
      );
    });

    test('should set isServer to true when window is undefined', () => {
      // @ts-expect-error - intentionally deleting window to simulate Node.js
      delete globalThis.window;
      const options: LoggerOptions = { enabled: true };

      const logger = bootstrap(options);

      expect(logger).toBeDefined();
      expect(environmentPluginMock).toHaveBeenCalledWith(
        expect.objectContaining({ isServer: true }),
      );
    });

    test('should set isServer to false when window is defined', () => {
      globalThis.window = {} as Window & typeof globalThis;
      const options: LoggerOptions = { enabled: true };

      const logger = bootstrap(options);

      expect(logger).toBeDefined();
      expect(environmentPluginMock).toHaveBeenCalledWith(
        expect.objectContaining({ isServer: false }),
      );
    });
  });

  describe('Transport configuration', () => {
    test('should use pretty terminal transport when pretty is true', () => {
      const options: LoggerOptions = { enabled: true, pretty: true };

      const logger = bootstrap(options);

      expect(logger).toBeDefined();
      expect(getSimplePrettyTerminalMock).toHaveBeenCalled();
      expect(ConsoleTransportMock).not.toHaveBeenCalled();
    });

    test('should use console transport when pretty is false', () => {
      const options: LoggerOptions = { enabled: true, pretty: false };

      const logger = bootstrap(options);

      expect(logger).toBeDefined();
      expect(ConsoleTransportMock).toHaveBeenCalled();
      expect(getSimplePrettyTerminalMock).not.toHaveBeenCalled();
    });

    test('should include custom transports after default transport', () => {
      const customTransport = {
        log: vi.fn(),
      };
      const options: LoggerOptions = {
        enabled: true,
        transports: [customTransport],
      };

      const logger = bootstrap(options);

      expect(logger).toBeDefined();
      expect(LogLayerMock).toHaveBeenCalledWith(
        expect.objectContaining({
          transport: expect.arrayContaining([customTransport]),
        }),
      );
    });

    test('should handle empty transports array', () => {
      const options: LoggerOptions = { enabled: true, transports: [] };

      const logger = bootstrap(options);

      expect(logger).toBeDefined();
      expect(LogLayerMock).toHaveBeenCalledWith(
        expect.objectContaining({
          transport: expect.any(Array),
        }),
      );
    });

    test('should handle multiple custom transports', () => {
      const transport1 = { log: vi.fn() };
      const transport2 = { log: vi.fn() };
      const options: LoggerOptions = {
        enabled: true,
        transports: [transport1, transport2],
      };

      const logger = bootstrap(options);

      expect(logger).toBeDefined();
      expect(LogLayerMock).toHaveBeenCalledWith(
        expect.objectContaining({
          transport: expect.arrayContaining([transport1, transport2]),
        }),
      );
    });
  });

  describe('Plugin configuration', () => {
    test('should include callsitePlugin and environmentPlugin by default', () => {
      const options: LoggerOptions = { enabled: true };

      const logger = bootstrap(options);

      expect(logger).toBeDefined();
      expect(callsitePluginMock).toHaveBeenCalled();
      expect(environmentPluginMock).toHaveBeenCalled();
    });

    test('should append custom plugins after default plugins', () => {
      const customPlugin = {
        id: 'custom-plugin',
        onBeforeDataOut: vi.fn(({ data }) => data),
      };
      const options: LoggerOptions = {
        enabled: true,
        plugins: [customPlugin],
      };

      const logger = bootstrap(options);

      expect(logger).toBeDefined();
      expect(LogLayerMock).toHaveBeenCalledWith(
        expect.objectContaining({
          plugins: expect.arrayContaining([customPlugin]),
        }),
      );
    });

    test('should handle empty plugins array', () => {
      const options: LoggerOptions = { enabled: true, plugins: [] };

      const logger = bootstrap(options);

      expect(logger).toBeDefined();
      expect(LogLayerMock).toHaveBeenCalledWith(
        expect.objectContaining({
          plugins: expect.any(Array),
        }),
      );
    });

    test('should handle multiple custom plugins', () => {
      const plugin1 = {
        id: 'plugin-1',
        onBeforeDataOut: vi.fn(({ data }) => data),
      };
      const plugin2 = {
        id: 'plugin-2',
        onBeforeDataOut: vi.fn(({ data }) => data),
      };
      const options: LoggerOptions = {
        enabled: true,
        plugins: [plugin1, plugin2],
      };

      const logger = bootstrap(options);

      expect(logger).toBeDefined();
      expect(LogLayerMock).toHaveBeenCalledWith(
        expect.objectContaining({
          plugins: expect.arrayContaining([plugin1, plugin2]),
        }),
      );
    });
  });

  describe('Prefix configuration', () => {
    test('should set custom prefix when provided', () => {
      const options: LoggerOptions = { enabled: true, prefix: '[MyApp]' };

      const logger = bootstrap(options);

      expect(logger).toBeDefined();
      expect(LogLayerMock).toHaveBeenCalledWith(
        expect.objectContaining({ prefix: '[MyApp]' }),
      );
    });

    test('should handle empty string prefix', () => {
      const options: LoggerOptions = { enabled: true, prefix: '' };

      const logger = bootstrap(options);

      expect(logger).toBeDefined();
      expect(LogLayerMock).toHaveBeenCalledWith(
        expect.objectContaining({ prefix: '' }),
      );
    });
  });

  describe('Enabled configuration', () => {
    test('should create logger with enabled=true', () => {
      const options: LoggerOptions = { enabled: true };

      const logger = bootstrap(options);

      expect(logger).toBeDefined();
      expect(LogLayerMock).toHaveBeenCalledWith(
        expect.objectContaining({ enabled: true }),
      );
    });

    test('should create logger with enabled=false', () => {
      const options: LoggerOptions = { enabled: false };

      const logger = bootstrap(options);

      expect(logger).toBeDefined();
      expect(LogLayerMock).toHaveBeenCalledWith(
        expect.objectContaining({ enabled: false }),
      );
    });
  });

  describe('Error serialization', () => {
    test('should configure serializeError as errorSerializer', () => {
      const options: LoggerOptions = { enabled: true };

      const logger = bootstrap(options);

      expect(logger).toBeDefined();
      expect(LogLayerMock).toHaveBeenCalledWith(
        expect.objectContaining({ errorSerializer: serializeErrorMock }),
      );
    });
  });

  describe('Pretty terminal configuration', () => {
    test('should configure viewMode as message-only for pretty transport', () => {
      const options: LoggerOptions = { enabled: true, pretty: true };

      const logger = bootstrap(options);

      expect(logger).toBeDefined();
      expect(getSimplePrettyTerminalMock).toHaveBeenCalledWith(
        expect.objectContaining({ viewMode: 'message-only' }),
      );
    });

    test('should configure runtime as browser for pretty transport', () => {
      const options: LoggerOptions = { enabled: true, pretty: true };

      const logger = bootstrap(options);

      expect(logger).toBeDefined();
      expect(getSimplePrettyTerminalMock).toHaveBeenCalledWith(
        expect.objectContaining({ runtime: 'browser' }),
      );
    });

    test('should set includeDataInBrowserConsole to true for pretty transport', () => {
      const options: LoggerOptions = { enabled: true, pretty: true };

      const logger = bootstrap(options);

      expect(logger).toBeDefined();
      expect(getSimplePrettyTerminalMock).toHaveBeenCalledWith(
        expect.objectContaining({ includeDataInBrowserConsole: true }),
      );
    });
  });

  describe('Console transport configuration', () => {
    test('should configure appendObjectData for console transport', () => {
      const options: LoggerOptions = { enabled: true, pretty: false };

      const logger = bootstrap(options);

      expect(logger).toBeDefined();
      expect(ConsoleTransportMock).toHaveBeenCalledWith(
        expect.objectContaining({ appendObjectData: true }),
      );
    });

    test('should use console as logger for console transport', () => {
      const options: LoggerOptions = { enabled: true, pretty: false };

      const logger = bootstrap(options);

      expect(logger).toBeDefined();
      expect(ConsoleTransportMock).toHaveBeenCalledWith(
        expect.objectContaining({ logger: console }),
      );
    });
  });
});
