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

import { beforeEach, describe, expect, test, vi } from 'vitest';
import type { LogLayer } from 'loglayer';
import type { MockedFunction } from 'vitest';
import type { LoggerOptions } from '../definitions';
import type { bootstrap as BootstrapFn } from './bootstrap';

// MockLogLayer is a no-op ILogLayer implementation — the correct double for
// code that consumes a logger rather than code that creates one.
vi.mock('./bootstrap', async () => {
  const { MockLogLayer } = await import('loglayer');
  return {
    bootstrap: vi.fn(() => new MockLogLayer()),
  };
});

describe('getLogger', () => {
  let bootstrapMock: MockedFunction<typeof BootstrapFn>;

  beforeEach(async () => {
    // Reset module cache so each test gets a fresh singleton.
    vi.resetModules();

    const { bootstrap } = await import('./bootstrap');
    bootstrapMock = vi.mocked(bootstrap);
  });

  describe('Initial logger creation', () => {
    test('should create logger instance on first call', async () => {
      const { getLogger } = await import('./index');
      const options: LoggerOptions = { enabled: true, level: 'info' };

      const logger = getLogger(options);

      expect(logger.info).toBeTypeOf('function');
      expect(logger.error).toBeTypeOf('function');
      expect(logger.debug).toBeTypeOf('function');
    });

    test('should call bootstrap with provided options on first call', async () => {
      const { getLogger } = await import('./index');
      const options: LoggerOptions = {
        enabled: true,
        level: 'warn',
        prefix: '[App]',
        env: 'production',
      };

      getLogger(options);

      expect(bootstrapMock).toHaveBeenCalledOnce();
      expect(bootstrapMock).toHaveBeenCalledWith(options);
    });

    test('should pass all LoggerOptions properties to bootstrap', async () => {
      const { getLogger } = await import('./index');
      const customPlugin = { id: 'test-plugin', onBeforeDataOut: vi.fn() };
      const customTransport = { log: vi.fn() };
      const options: LoggerOptions = {
        enabled: false,
        level: 'error',
        prefix: '[MyService]',
        env: 'development',
        pretty: false,
        plugins: [customPlugin],
        // @ts-expect-error partial transport implementation
        transports: [customTransport],
      };

      getLogger(options);

      expect(bootstrapMock).toHaveBeenCalledWith(
        expect.objectContaining({
          enabled: false,
          level: 'error',
          prefix: '[MyService]',
          env: 'development',
          pretty: false,
          plugins: [customPlugin],
          transports: [customTransport],
        }),
      );
    });
  });

  describe('Singleton behavior', () => {
    test('should return same instance on subsequent calls', async () => {
      const { getLogger } = await import('./index');
      const options1: LoggerOptions = { enabled: true, level: 'debug' };
      const options2: LoggerOptions = { enabled: true, level: 'error' };

      const logger1 = getLogger(options1);
      const logger2 = getLogger(options2);

      expect(logger1).toBe(logger2);
    });

    test('should call bootstrap only once across multiple calls', async () => {
      const { getLogger } = await import('./index');
      const options1: LoggerOptions = { enabled: true };
      const options2: LoggerOptions = { enabled: false };
      const options3: LoggerOptions = { enabled: true, level: 'warn' };

      getLogger(options1);
      getLogger(options2);
      getLogger(options3);

      expect(bootstrapMock).toHaveBeenCalledOnce();
      expect(bootstrapMock).toHaveBeenCalledWith(options1);
    });

    test('should ignore options on second call', async () => {
      const { getLogger } = await import('./index');
      const firstOptions: LoggerOptions = { enabled: true, level: 'info' };
      const secondOptions: LoggerOptions = { enabled: false, level: 'error' };

      const logger1 = getLogger(firstOptions);
      const logger2 = getLogger(secondOptions);

      expect(logger1).toBe(logger2);
      expect(bootstrapMock).toHaveBeenCalledOnce();
      expect(bootstrapMock).toHaveBeenCalledWith(firstOptions);
      expect(bootstrapMock).not.toHaveBeenCalledWith(secondOptions);
    });

    test('should maintain singleton across many calls', async () => {
      const { getLogger } = await import('./index');
      const options: LoggerOptions = { enabled: true };
      const instances = [];

      for (let i = 0; i < 10; i++) {
        instances.push(getLogger(options));
      }

      const firstInstance = instances[0];
      for (const instance of instances) {
        expect(instance).toBe(firstInstance);
      }
      expect(bootstrapMock).toHaveBeenCalledOnce();
    });
  });

  describe('Logger instance properties', () => {
    test.each([
      { method: 'info' },
      { method: 'warn' },
      { method: 'error' },
      { method: 'debug' },
      { method: 'trace' },
      { method: 'fatal' },
    ])('should return logger with $method method', async ({ method }) => {
      const { getLogger } = await import('./index');
      const options: LoggerOptions = { enabled: true };

      const logger = getLogger(options);

      expect(logger[method as keyof LogLayer]).toBeTypeOf('function');
    });
  });

  describe('Configuration variations', () => {
    test('should create logger with enabled=true', async () => {
      const { getLogger } = await import('./index');

      getLogger({ enabled: true });

      expect(bootstrapMock).toHaveBeenCalledWith(
        expect.objectContaining({ enabled: true }),
      );
    });

    test('should create logger with enabled=false', async () => {
      const { getLogger } = await import('./index');

      getLogger({ enabled: false });

      expect(bootstrapMock).toHaveBeenCalledWith(
        expect.objectContaining({ enabled: false }),
      );
    });

    test.each([
      { level: 'trace' as const },
      { level: 'debug' as const },
      { level: 'info' as const },
      { level: 'warn' as const },
      { level: 'error' as const },
      { level: 'fatal' as const },
    ])('should create logger with level=$level', async ({ level }) => {
      const { getLogger } = await import('./index');

      getLogger({ enabled: true, level });

      expect(bootstrapMock).toHaveBeenCalledWith(
        expect.objectContaining({ level }),
      );
    });

    test.each([
      { env: 'development' as const },
      { env: 'production' as const },
    ])('should create logger with env=$env', async ({ env }) => {
      const { getLogger } = await import('./index');

      getLogger({ enabled: true, env });

      expect(bootstrapMock).toHaveBeenCalledWith(
        expect.objectContaining({ env }),
      );
    });

    test('should create logger with custom prefix', async () => {
      const { getLogger } = await import('./index');

      getLogger({ enabled: true, prefix: '[TestApp]' });

      expect(bootstrapMock).toHaveBeenCalledWith(
        expect.objectContaining({ prefix: '[TestApp]' }),
      );
    });

    test('should create logger with pretty=true', async () => {
      const { getLogger } = await import('./index');

      getLogger({ enabled: true, pretty: true });

      expect(bootstrapMock).toHaveBeenCalledWith(
        expect.objectContaining({ pretty: true }),
      );
    });

    test('should create logger with pretty=false', async () => {
      const { getLogger } = await import('./index');

      getLogger({ enabled: true, pretty: false });

      expect(bootstrapMock).toHaveBeenCalledWith(
        expect.objectContaining({ pretty: false }),
      );
    });
  });

  describe('Edge cases', () => {
    test('should handle minimal options object', async () => {
      const { getLogger } = await import('./index');
      const options: LoggerOptions = { enabled: true };

      const logger = getLogger(options);

      expect(logger).toBeDefined();
      expect(bootstrapMock).toHaveBeenCalledWith(options);
    });

    test('should handle options with undefined optional fields', async () => {
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

      getLogger(options);

      expect(bootstrapMock).toHaveBeenCalledWith(
        expect.objectContaining({ enabled: true }),
      );
    });

    test('should handle empty plugins array', async () => {
      const { getLogger } = await import('./index');

      getLogger({ enabled: true, plugins: [] });

      expect(bootstrapMock).toHaveBeenCalledWith(
        expect.objectContaining({ plugins: [] }),
      );
    });

    test('should handle empty transports array', async () => {
      const { getLogger } = await import('./index');

      getLogger({ enabled: true, transports: [] });

      expect(bootstrapMock).toHaveBeenCalledWith(
        expect.objectContaining({ transports: [] }),
      );
    });
  });
});
