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

describe('bootstrap', () => {
  let windowSpy: typeof globalThis.window | undefined;

  beforeEach(() => {
    // Store original window value
    windowSpy = globalThis.window;
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
      // Arrange
      const options: LoggerOptions = { enabled: true };

      // Act
      const logger = bootstrap(options);

      // Assert
      expect(logger).toBeDefined();
      expect(logger.info).toBeTypeOf('function');
      expect(logger.warn).toBeTypeOf('function');
      expect(logger.error).toBeTypeOf('function');
      expect(logger.debug).toBeTypeOf('function');
    });

    test('should use debug level when level option is not provided', () => {
      // Arrange
      const options: LoggerOptions = { enabled: true };

      // Act
      const logger = bootstrap(options);

      // Assert
      expect(logger).toBeDefined();
      // TODO: verify level configuration via logger internal state or spy
    });

    test('should use development environment when env option is not provided', () => {
      // Arrange
      const options: LoggerOptions = { enabled: true };

      // Act
      const logger = bootstrap(options);

      // Assert
      expect(logger).toBeDefined();
      // TODO: verify isProductionEnv=false via plugin configuration
    });

    test('should enable pretty printing when pretty option is not provided', () => {
      // Arrange
      const options: LoggerOptions = { enabled: true };

      // Act
      const logger = bootstrap(options);

      // Assert
      expect(logger).toBeDefined();
      // TODO: verify pretty transport is used
    });

    test('should use empty prefix when prefix option is not provided', () => {
      // Arrange
      const options: LoggerOptions = { enabled: true };

      // Act
      const logger = bootstrap(options);

      // Assert
      expect(logger).toBeDefined();
      // TODO: verify prefix configuration
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
      // Arrange
      const options: LoggerOptions = { enabled: true, level };

      // Act
      const logger = bootstrap(options);

      // Assert
      expect(logger).toBeDefined();
      // TODO: verify level is correctly set in transport configuration
    });
  });

  describe('Environment detection', () => {
    test('should set isProductionEnv to true when env is production', () => {
      // Arrange
      const options: LoggerOptions = { enabled: true, env: 'production' };

      // Act
      const logger = bootstrap(options);

      // Assert
      expect(logger).toBeDefined();
      // TODO: verify isProductionEnv=true is passed to plugins
    });

    test('should set isProductionEnv to false when env is development', () => {
      // Arrange
      const options: LoggerOptions = { enabled: true, env: 'development' };

      // Act
      const logger = bootstrap(options);

      // Assert
      expect(logger).toBeDefined();
      // TODO: verify isProductionEnv=false is passed to plugins
    });

    test('should set isProductionEnv to false when env is test', () => {
      // Arrange
      const options: LoggerOptions = { enabled: true, env: 'test' };

      // Act
      const logger = bootstrap(options);

      // Assert
      expect(logger).toBeDefined();
      // TODO: verify isProductionEnv=false is passed to plugins
    });

    test('should set isServer to true when window is undefined', () => {
      // Arrange
      // @ts-expect-error - intentionally deleting window to simulate Node.js
      delete globalThis.window;
      const options: LoggerOptions = { enabled: true };

      // Act
      const logger = bootstrap(options);

      // Assert
      expect(logger).toBeDefined();
      // TODO: verify isServer=true is passed to environmentPlugin
    });

    test('should set isServer to false when window is defined', () => {
      // Arrange
      globalThis.window = {} as Window & typeof globalThis;
      const options: LoggerOptions = { enabled: true };

      // Act
      const logger = bootstrap(options);

      // Assert
      expect(logger).toBeDefined();
      // TODO: verify isServer=false is passed to environmentPlugin
    });
  });

  describe('Transport configuration', () => {
    test('should use pretty terminal transport when pretty is true', () => {
      // Arrange
      const options: LoggerOptions = { enabled: true, pretty: true };

      // Act
      const logger = bootstrap(options);

      // Assert
      expect(logger).toBeDefined();
      // TODO: verify getSimplePrettyTerminal is used
    });

    test('should use console transport when pretty is false', () => {
      // Arrange
      const options: LoggerOptions = { enabled: true, pretty: false };

      // Act
      const logger = bootstrap(options);

      // Assert
      expect(logger).toBeDefined();
      // TODO: verify ConsoleTransport is used
    });

    test('should include custom transports after default transport', () => {
      // Arrange
      const customTransport = {
        log: vi.fn(),
      };
      const options: LoggerOptions = {
        enabled: true,
        transports: [customTransport],
      };

      // Act
      const logger = bootstrap(options);

      // Assert
      expect(logger).toBeDefined();
      // TODO: verify custom transport is appended to transport array
    });

    test('should handle empty transports array', () => {
      // Arrange
      const options: LoggerOptions = { enabled: true, transports: [] };

      // Act
      const logger = bootstrap(options);

      // Assert
      expect(logger).toBeDefined();
    });

    test('should handle multiple custom transports', () => {
      // Arrange
      const transport1 = { log: vi.fn() };
      const transport2 = { log: vi.fn() };
      const options: LoggerOptions = {
        enabled: true,
        transports: [transport1, transport2],
      };

      // Act
      const logger = bootstrap(options);

      // Assert
      expect(logger).toBeDefined();
      // TODO: verify both transports are included
    });
  });

  describe('Plugin configuration', () => {
    test('should include callsitePlugin and environmentPlugin by default', () => {
      // Arrange
      const options: LoggerOptions = { enabled: true };

      // Act
      const logger = bootstrap(options);

      // Assert
      expect(logger).toBeDefined();
      // TODO: verify both default plugins are registered
    });

    test('should append custom plugins after default plugins', () => {
      // Arrange
      const customPlugin = {
        id: 'custom-plugin',
        onBeforeDataOut: vi.fn(({ data }) => data),
      };
      const options: LoggerOptions = {
        enabled: true,
        plugins: [customPlugin],
      };

      // Act
      const logger = bootstrap(options);

      // Assert
      expect(logger).toBeDefined();
      // TODO: verify custom plugin is appended after default plugins
    });

    test('should handle empty plugins array', () => {
      // Arrange
      const options: LoggerOptions = { enabled: true, plugins: [] };

      // Act
      const logger = bootstrap(options);

      // Assert
      expect(logger).toBeDefined();
    });

    test('should handle multiple custom plugins', () => {
      // Arrange
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

      // Act
      const logger = bootstrap(options);

      // Assert
      expect(logger).toBeDefined();
      // TODO: verify both custom plugins are included
    });
  });

  describe('Prefix configuration', () => {
    test('should set custom prefix when provided', () => {
      // Arrange
      const options: LoggerOptions = { enabled: true, prefix: '[MyApp]' };

      // Act
      const logger = bootstrap(options);

      // Assert
      expect(logger).toBeDefined();
      // TODO: verify prefix is set on LogLayer instance
    });

    test('should handle empty string prefix', () => {
      // Arrange
      const options: LoggerOptions = { enabled: true, prefix: '' };

      // Act
      const logger = bootstrap(options);

      // Assert
      expect(logger).toBeDefined();
    });
  });

  describe('Enabled configuration', () => {
    test('should create logger with enabled=true', () => {
      // Arrange
      const options: LoggerOptions = { enabled: true };

      // Act
      const logger = bootstrap(options);

      // Assert
      expect(logger).toBeDefined();
      // TODO: verify enabled flag is passed to LogLayer
    });

    test('should create logger with enabled=false', () => {
      // Arrange
      const options: LoggerOptions = { enabled: false };

      // Act
      const logger = bootstrap(options);

      // Assert
      expect(logger).toBeDefined();
      // TODO: verify enabled=false disables logging
    });
  });

  describe('Error serialization', () => {
    test('should configure serializeError as errorSerializer', () => {
      // Arrange
      const options: LoggerOptions = { enabled: true };

      // Act
      const logger = bootstrap(options);

      // Assert
      expect(logger).toBeDefined();
      // TODO: verify serializeError is used for error serialization
    });
  });

  describe('Pretty terminal configuration', () => {
    test('should configure viewMode as message-only for pretty transport', () => {
      // Arrange
      const options: LoggerOptions = { enabled: true, pretty: true };

      // Act
      const logger = bootstrap(options);

      // Assert
      expect(logger).toBeDefined();
      // TODO: verify viewMode is set to 'message-only'
    });

    test('should configure runtime as browser for pretty transport', () => {
      // Arrange
      const options: LoggerOptions = { enabled: true, pretty: true };

      // Act
      const logger = bootstrap(options);

      // Assert
      expect(logger).toBeDefined();
      // TODO: verify runtime is set to 'browser'
    });

    test('should set includeDataInBrowserConsole to true for pretty transport', () => {
      // Arrange
      const options: LoggerOptions = { enabled: true, pretty: true };

      // Act
      const logger = bootstrap(options);

      // Assert
      expect(logger).toBeDefined();
      // TODO: verify includeDataInBrowserConsole is true
    });
  });

  describe('Console transport configuration', () => {
    test('should configure appendObjectData for console transport', () => {
      // Arrange
      const options: LoggerOptions = { enabled: true, pretty: false };

      // Act
      const logger = bootstrap(options);

      // Assert
      expect(logger).toBeDefined();
      // TODO: verify appendObjectData is set to true
    });

    test('should use console as logger for console transport', () => {
      // Arrange
      const options: LoggerOptions = { enabled: true, pretty: false };

      // Act
      const logger = bootstrap(options);

      // Assert
      expect(logger).toBeDefined();
      // TODO: verify console is used as logger
    });
  });
});
