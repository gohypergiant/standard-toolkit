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

import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import type { LoggerOptions } from '../definitions';

// Mock the bootstrap module
vi.mock('./bootstrap', () => ({
  bootstrap: vi.fn((opts: LoggerOptions) => ({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
    trace: vi.fn(),
    fatal: vi.fn(),
    // biome-ignore lint/style/useNamingConvention: This is for testing
    _testOptions: opts, // For test verification
  })),
}));

describe('getLogger', () => {
  let bootstrapMock: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    // Clear module cache to reset singleton state between tests
    vi.resetModules();

    // Get fresh mock
    const bootstrapModule = await import('./bootstrap');
    bootstrapMock = bootstrapModule.bootstrap as ReturnType<typeof vi.fn>;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial logger creation', () => {
    test('should create logger instance on first call', async () => {
      // Arrange
      const { getLogger } = await import('./index');
      const options: LoggerOptions = { enabled: true, level: 'info' };

      // Act
      const logger = getLogger(options);

      // Assert
      expect(logger).toBeDefined();
      expect(logger.info).toBeTypeOf('function');
      expect(logger.error).toBeTypeOf('function');
      expect(logger.debug).toBeTypeOf('function');
    });

    test('should call bootstrap with provided options on first call', async () => {
      // Arrange
      const { getLogger } = await import('./index');
      const options: LoggerOptions = {
        enabled: true,
        level: 'warn',
        prefix: '[App]',
        env: 'production',
      };

      // Act
      getLogger(options);

      // Assert
      expect(bootstrapMock).toHaveBeenCalledTimes(1);
      expect(bootstrapMock).toHaveBeenCalledWith(options);
    });

    test('should pass all LoggerOptions properties to bootstrap', async () => {
      // Arrange
      const { getLogger } = await import('./index');
      const customPlugin = { id: 'test-plugin', onBeforeDataOut: vi.fn() };
      const customTransport = { log: vi.fn() };
      const options: LoggerOptions = {
        enabled: false,
        level: 'error',
        prefix: '[MyService]',
        env: 'test',
        pretty: false,
        plugins: [customPlugin],
        transports: [customTransport],
      };

      // Act
      getLogger(options);

      // Assert
      expect(bootstrapMock).toHaveBeenCalledWith(
        expect.objectContaining({
          enabled: false,
          level: 'error',
          prefix: '[MyService]',
          env: 'test',
          pretty: false,
          plugins: [customPlugin],
          transports: [customTransport],
        }),
      );
    });
  });

  describe('Singleton behavior', () => {
    test('should return same instance on subsequent calls', async () => {
      // Arrange
      const { getLogger } = await import('./index');
      const options1: LoggerOptions = { enabled: true, level: 'debug' };
      const options2: LoggerOptions = { enabled: true, level: 'error' };

      // Act
      const logger1 = getLogger(options1);
      const logger2 = getLogger(options2);

      // Assert
      expect(logger1).toBe(logger2);
    });

    test('should call bootstrap only once across multiple calls', async () => {
      // Arrange
      const { getLogger } = await import('./index');
      const options1: LoggerOptions = { enabled: true };
      const options2: LoggerOptions = { enabled: false };
      const options3: LoggerOptions = { enabled: true, level: 'warn' };

      // Act
      getLogger(options1);
      getLogger(options2);
      getLogger(options3);

      // Assert
      expect(bootstrapMock).toHaveBeenCalledTimes(1);
      expect(bootstrapMock).toHaveBeenCalledWith(options1);
    });

    test('should ignore options on second call', async () => {
      // Arrange
      const { getLogger } = await import('./index');
      const firstOptions: LoggerOptions = { enabled: true, level: 'info' };
      const secondOptions: LoggerOptions = { enabled: false, level: 'error' };

      // Act
      const logger1 = getLogger(firstOptions);
      const logger2 = getLogger(secondOptions);

      // Assert
      expect(logger1).toBe(logger2);
      expect(bootstrapMock).toHaveBeenCalledTimes(1);
      expect(bootstrapMock).toHaveBeenCalledWith(firstOptions);
      expect(bootstrapMock).not.toHaveBeenCalledWith(secondOptions);
    });

    test('should maintain singleton across many calls', async () => {
      // Arrange
      const { getLogger } = await import('./index');
      const options: LoggerOptions = { enabled: true };
      const instances = [];

      // Act
      for (let i = 0; i < 10; i++) {
        instances.push(getLogger(options));
      }

      // Assert
      const firstInstance = instances[0];
      for (const instance of instances) {
        expect(instance).toBe(firstInstance);
      }
      expect(bootstrapMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('Logger instance properties', () => {
    test('should return logger with info method', async () => {
      // Arrange
      const { getLogger } = await import('./index');
      const options: LoggerOptions = { enabled: true };

      // Act
      const logger = getLogger(options);

      // Assert
      expect(logger.info).toBeDefined();
      expect(logger.info).toBeTypeOf('function');
    });

    test('should return logger with warn method', async () => {
      // Arrange
      const { getLogger } = await import('./index');
      const options: LoggerOptions = { enabled: true };

      // Act
      const logger = getLogger(options);

      // Assert
      expect(logger.warn).toBeDefined();
      expect(logger.warn).toBeTypeOf('function');
    });

    test('should return logger with error method', async () => {
      // Arrange
      const { getLogger } = await import('./index');
      const options: LoggerOptions = { enabled: true };

      // Act
      const logger = getLogger(options);

      // Assert
      expect(logger.error).toBeDefined();
      expect(logger.error).toBeTypeOf('function');
    });

    test('should return logger with debug method', async () => {
      // Arrange
      const { getLogger } = await import('./index');
      const options: LoggerOptions = { enabled: true };

      // Act
      const logger = getLogger(options);

      // Assert
      expect(logger.debug).toBeDefined();
      expect(logger.debug).toBeTypeOf('function');
    });

    test('should return logger with trace method', async () => {
      // Arrange
      const { getLogger } = await import('./index');
      const options: LoggerOptions = { enabled: true };

      // Act
      const logger = getLogger(options);

      // Assert
      expect(logger.trace).toBeDefined();
      expect(logger.trace).toBeTypeOf('function');
    });

    test('should return logger with fatal method', async () => {
      // Arrange
      const { getLogger } = await import('./index');
      const options: LoggerOptions = { enabled: true };

      // Act
      const logger = getLogger(options);

      // Assert
      expect(logger.fatal).toBeDefined();
      expect(logger.fatal).toBeTypeOf('function');
    });
  });

  describe('Configuration variations', () => {
    test('should create logger with enabled=true', async () => {
      // Arrange
      const { getLogger } = await import('./index');
      const options: LoggerOptions = { enabled: true };

      // Act
      const logger = getLogger(options);

      // Assert
      expect(logger).toBeDefined();
      expect(bootstrapMock).toHaveBeenCalledWith(
        expect.objectContaining({ enabled: true }),
      );
    });

    test('should create logger with enabled=false', async () => {
      // Arrange
      const { getLogger } = await import('./index');
      const options: LoggerOptions = { enabled: false };

      // Act
      const logger = getLogger(options);

      // Assert
      expect(logger).toBeDefined();
      expect(bootstrapMock).toHaveBeenCalledWith(
        expect.objectContaining({ enabled: false }),
      );
    });

    test.each([
      { level: 'trace' as const, description: 'trace' },
      { level: 'debug' as const, description: 'debug' },
      { level: 'info' as const, description: 'info' },
      { level: 'warn' as const, description: 'warn' },
      { level: 'error' as const, description: 'error' },
      { level: 'fatal' as const, description: 'fatal' },
    ])('should create logger with level=$description', async ({ level }) => {
      // Arrange
      const { getLogger } = await import('./index');
      const options: LoggerOptions = { enabled: true, level };

      // Act
      getLogger(options);

      // Assert
      expect(bootstrapMock).toHaveBeenCalledWith(
        expect.objectContaining({ level }),
      );
    });

    test.each([
      { env: 'development' as const, description: 'development' },
      { env: 'production' as const, description: 'production' },
      { env: 'test' as const, description: 'test' },
    ])('should create logger with env=$description', async ({ env }) => {
      // Arrange
      const { getLogger } = await import('./index');
      const options: LoggerOptions = { enabled: true, env };

      // Act
      getLogger(options);

      // Assert
      expect(bootstrapMock).toHaveBeenCalledWith(
        expect.objectContaining({ env }),
      );
    });

    test('should create logger with custom prefix', async () => {
      // Arrange
      const { getLogger } = await import('./index');
      const options: LoggerOptions = { enabled: true, prefix: '[TestApp]' };

      // Act
      getLogger(options);

      // Assert
      expect(bootstrapMock).toHaveBeenCalledWith(
        expect.objectContaining({ prefix: '[TestApp]' }),
      );
    });

    test('should create logger with pretty=true', async () => {
      // Arrange
      const { getLogger } = await import('./index');
      const options: LoggerOptions = { enabled: true, pretty: true };

      // Act
      getLogger(options);

      // Assert
      expect(bootstrapMock).toHaveBeenCalledWith(
        expect.objectContaining({ pretty: true }),
      );
    });

    test('should create logger with pretty=false', async () => {
      // Arrange
      const { getLogger } = await import('./index');
      const options: LoggerOptions = { enabled: true, pretty: false };

      // Act
      getLogger(options);

      // Assert
      expect(bootstrapMock).toHaveBeenCalledWith(
        expect.objectContaining({ pretty: false }),
      );
    });
  });

  describe('Edge cases', () => {
    test('should handle minimal options object', async () => {
      // Arrange
      const { getLogger } = await import('./index');
      const options: LoggerOptions = { enabled: true };

      // Act
      const logger = getLogger(options);

      // Assert
      expect(logger).toBeDefined();
      expect(bootstrapMock).toHaveBeenCalledWith(options);
    });

    test('should handle options with undefined optional fields', async () => {
      // Arrange
      const { getLogger } = await import('./index');
      const options: LoggerOptions = {
        enabled: true,
        level: undefined,
        prefix: undefined,
        env: undefined,
        pretty: undefined,
        plugins: undefined,
        transports: undefined,
      };

      // Act
      const logger = getLogger(options);

      // Assert
      expect(logger).toBeDefined();
      expect(bootstrapMock).toHaveBeenCalledWith(
        expect.objectContaining({ enabled: true }),
      );
    });

    test('should handle empty plugins array', async () => {
      // Arrange
      const { getLogger } = await import('./index');
      const options: LoggerOptions = { enabled: true, plugins: [] };

      // Act
      const logger = getLogger(options);

      // Assert
      expect(logger).toBeDefined();
      expect(bootstrapMock).toHaveBeenCalledWith(
        expect.objectContaining({ plugins: [] }),
      );
    });

    test('should handle empty transports array', async () => {
      // Arrange
      const { getLogger } = await import('./index');
      const options: LoggerOptions = { enabled: true, transports: [] };

      // Act
      const logger = getLogger(options);

      // Assert
      expect(logger).toBeDefined();
      expect(bootstrapMock).toHaveBeenCalledWith(
        expect.objectContaining({ transports: [] }),
      );
    });
  });
});
