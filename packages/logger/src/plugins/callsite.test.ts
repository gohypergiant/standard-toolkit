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

import { describe, expect, test, vi, beforeEach } from 'vitest';
import { callsitePlugin } from './callsite';
import type { CallSite } from 'callsites';

// Mock the callsites module
vi.mock('callsites', () => ({
  default: vi.fn(),
}));

describe('callsitePlugin', () => {
  let callsitesMock: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    // Get the mocked callsites function
    const callsitesModule = await import('callsites');
    callsitesMock = callsitesModule.default as ReturnType<typeof vi.fn>;
  });

  describe('Plugin creation', () => {
    test('should create plugin with provided id', () => {
      const options = { isProductionEnv: false, id: 'test-callsite' };

      const plugin = callsitePlugin(options);

      expect(plugin.id).toBe('test-callsite');
    });

    test('should create plugin with disabled flag', () => {
      const options = { isProductionEnv: false, disabled: true };

      const plugin = callsitePlugin(options);

      expect(plugin.disabled).toBe(true);
    });

    test('should create plugin without disabled flag when not provided', () => {
      const options = { isProductionEnv: false };

      const plugin = callsitePlugin(options);

      expect(plugin.disabled).toBeUndefined();
    });

    test('should have onBeforeDataOut hook', () => {
      const options = { isProductionEnv: false };

      const plugin = callsitePlugin(options);

      expect(plugin.onBeforeDataOut).toBeTypeOf('function');
    });
  });

  describe('Callsite detection - positive cases', () => {
    test('should extract callsite with file path, line number, and column number', () => {
      const mockCallsite = {
        getFunctionName: () => 'debug',
        getFileName: () => '/src/app.ts',
        getLineNumber: () => 42,
        getColumnNumber: () => 10,
        isEval: () => false,
        getEvalOrigin: () => undefined,
      } as CallSite;

      const nextCallsite = {
        getFunctionName: () => 'myFunction',
        getFileName: () => '/src/user.ts',
        getLineNumber: () => 100,
        getColumnNumber: () => 5,
        isEval: () => false,
        getEvalOrigin: () => undefined,
      } as CallSite;

      callsitesMock.mockReturnValue([mockCallsite, nextCallsite]);

      const plugin = callsitePlugin({ isProductionEnv: false });

      const result = plugin.onBeforeDataOut({ data: {} });

      expect(result).toEqual({
        callSite: '/src/user.ts:100:5',
      });
    });

    test.each([
      { level: 'info', description: 'info level' },
      { level: 'warn', description: 'warn level' },
      { level: 'error', description: 'error level' },
      { level: 'debug', description: 'debug level' },
      { level: 'trace', description: 'trace level' },
      { level: 'fatal', description: 'fatal level' },
    ])('should detect callsite after $description method in stack', ({
      level,
    }) => {
      const levelCallsite = {
        getFunctionName: () => level,
        getFileName: () => '/node_modules/loglayer/index.js',
        getLineNumber: () => 10,
        getColumnNumber: () => 1,
        isEval: () => false,
        getEvalOrigin: () => undefined,
      } as CallSite;

      const userCallsite = {
        getFunctionName: () => 'userCode',
        getFileName: () => '/src/main.ts',
        getLineNumber: () => 50,
        getColumnNumber: () => 15,
        isEval: () => false,
        getEvalOrigin: () => undefined,
      } as CallSite;

      callsitesMock.mockReturnValue([levelCallsite, userCallsite]);

      const plugin = callsitePlugin({ isProductionEnv: false });

      const result = plugin.onBeforeDataOut({ data: {} });

      expect(result).toEqual({
        callSite: '/src/main.ts:50:15',
      });
    });

    test('should preserve existing data properties when adding callSite', () => {
      const mockCallsite = {
        getFunctionName: () => 'info',
        getFileName: () => '/src/app.ts',
        getLineNumber: () => 20,
        getColumnNumber: () => 5,
        isEval: () => false,
        getEvalOrigin: () => undefined,
      } as CallSite;

      const nextCallsite = {
        getFunctionName: () => null,
        getFileName: () => '/src/user.ts',
        getLineNumber: () => 30,
        getColumnNumber: () => 8,
        isEval: () => false,
        getEvalOrigin: () => undefined,
      } as CallSite;

      callsitesMock.mockReturnValue([mockCallsite, nextCallsite]);

      const plugin = callsitePlugin({ isProductionEnv: false });
      const existingData = { userId: 123, action: 'login' };

      const result = plugin.onBeforeDataOut({ data: existingData });

      expect(result).toEqual({
        userId: 123,
        action: 'login',
        callSite: '/src/user.ts:30:8',
      });
    });

    test('should not mutate original data object', () => {
      const mockCallsite = {
        getFunctionName: () => 'debug',
        getFileName: () => '/src/app.ts',
        getLineNumber: () => 15,
        getColumnNumber: () => 3,
        isEval: () => false,
        getEvalOrigin: () => undefined,
      } as CallSite;

      const nextCallsite = {
        getFunctionName: () => null,
        getFileName: () => '/src/test.ts',
        getLineNumber: () => 25,
        getColumnNumber: () => 7,
        isEval: () => false,
        getEvalOrigin: () => undefined,
      } as CallSite;

      callsitesMock.mockReturnValue([mockCallsite, nextCallsite]);

      const plugin = callsitePlugin({ isProductionEnv: false });
      const originalData = { key: 'value' };

      plugin.onBeforeDataOut({ data: originalData });

      expect(originalData).toEqual({ key: 'value' });
      expect(originalData).not.toHaveProperty('callSite');
    });
  });

  describe('Callsite detection - eval origin handling', () => {
    test('should use getEvalOrigin when callsite is from eval', () => {
      const mockCallsite = {
        getFunctionName: () => 'error',
        getFileName: () => null,
        getLineNumber: () => 10,
        getColumnNumber: () => 1,
        isEval: () => false,
        getEvalOrigin: () => undefined,
      } as CallSite;

      const evalCallsite = {
        getFunctionName: () => 'dynamicCode',
        getFileName: () => null,
        getLineNumber: () => 5,
        getColumnNumber: () => 2,
        isEval: () => true,
        getEvalOrigin: () => 'eval at <anonymous> (/src/dynamic.ts:42:10)',
      } as CallSite;

      callsitesMock.mockReturnValue([mockCallsite, evalCallsite]);

      const plugin = callsitePlugin({ isProductionEnv: false });

      const result = plugin.onBeforeDataOut({ data: {} });

      expect(result).toEqual({
        callSite: 'eval at <anonymous> (/src/dynamic.ts:42:10):5:2',
      });
    });

    test('should use getFileName when callsite is not from eval', () => {
      const mockCallsite = {
        getFunctionName: () => 'warn',
        getFileName: () => '/lib/logger.js',
        getLineNumber: () => 20,
        getColumnNumber: () => 4,
        isEval: () => false,
        getEvalOrigin: () => undefined,
      } as CallSite;

      const normalCallsite = {
        getFunctionName: () => 'processData',
        getFileName: () => '/src/processor.ts',
        getLineNumber: () => 100,
        getColumnNumber: () => 12,
        isEval: () => false,
        getEvalOrigin: () => 'should-not-be-used',
      } as CallSite;

      callsitesMock.mockReturnValue([mockCallsite, normalCallsite]);

      const plugin = callsitePlugin({ isProductionEnv: false });

      const result = plugin.onBeforeDataOut({ data: {} });

      expect(result).toEqual({
        callSite: '/src/processor.ts:100:12',
      });
    });
  });

  describe('Callsite detection - edge cases', () => {
    test('should return unknown when callsites returns empty array', () => {
      callsitesMock.mockReturnValue([]);

      const plugin = callsitePlugin({ isProductionEnv: false });

      const result = plugin.onBeforeDataOut({ data: {} });

      expect(result).toEqual({
        callSite: 'unknown',
      });
    });

    test('should return unknown when callsites returns null', () => {
      callsitesMock.mockReturnValue(null);

      const plugin = callsitePlugin({ isProductionEnv: false });

      const result = plugin.onBeforeDataOut({ data: {} });

      expect(result).toEqual({
        callSite: 'unknown',
      });
    });

    test('should return unknown when callsites returns undefined', () => {
      callsitesMock.mockReturnValue(undefined);

      const plugin = callsitePlugin({ isProductionEnv: false });

      const result = plugin.onBeforeDataOut({ data: {} });

      expect(result).toEqual({
        callSite: 'unknown',
      });
    });

    test('should handle stack with no matching log level method', () => {
      const callsite1 = {
        getFunctionName: () => 'someFunction',
        getFileName: () => '/src/app.ts',
        getLineNumber: () => 10,
        getColumnNumber: () => 5,
        isEval: () => false,
        getEvalOrigin: () => undefined,
      } as CallSite;

      const callsite2 = {
        getFunctionName: () => 'anotherFunction',
        getFileName: () => '/src/util.ts',
        getLineNumber: () => 20,
        getColumnNumber: () => 10,
        isEval: () => false,
        getEvalOrigin: () => undefined,
      } as CallSite;

      callsitesMock.mockReturnValue([callsite1, callsite2]);

      const plugin = callsitePlugin({ isProductionEnv: false });

      const result = plugin.onBeforeDataOut({ data: {} });

      expect(result.callSite).toBeDefined();
      // When no level found, levelLine = 0, so it uses callsite at index 1
      expect(result).toEqual({
        callSite: '/src/util.ts:20:10',
      });
    });

    test('should handle callsite with undefined line number', () => {
      const mockCallsite = {
        getFunctionName: () => 'info',
        getFileName: () => '/src/app.ts',
        getLineNumber: () => 10,
        getColumnNumber: () => 5,
        isEval: () => false,
        getEvalOrigin: () => undefined,
      } as CallSite;

      const nextCallsite = {
        getFunctionName: () => null,
        getFileName: () => '/src/user.ts',
        getLineNumber: () => undefined,
        getColumnNumber: () => 20,
        isEval: () => false,
        getEvalOrigin: () => undefined,
      } as CallSite;

      callsitesMock.mockReturnValue([mockCallsite, nextCallsite]);

      const plugin = callsitePlugin({ isProductionEnv: false });

      const result = plugin.onBeforeDataOut({ data: {} });

      expect(result).toEqual({
        callSite: '/src/user.ts:undefined:20',
      });
    });

    test('should handle callsite with undefined column number', () => {
      const mockCallsite = {
        getFunctionName: () => 'debug',
        getFileName: () => '/src/app.ts',
        getLineNumber: () => 10,
        getColumnNumber: () => 5,
        isEval: () => false,
        getEvalOrigin: () => undefined,
      } as CallSite;

      const nextCallsite = {
        getFunctionName: () => null,
        getFileName: () => '/src/user.ts',
        getLineNumber: () => 50,
        getColumnNumber: () => undefined,
        isEval: () => false,
        getEvalOrigin: () => undefined,
      } as CallSite;

      callsitesMock.mockReturnValue([mockCallsite, nextCallsite]);

      const plugin = callsitePlugin({ isProductionEnv: false });

      const result = plugin.onBeforeDataOut({ data: {} });

      expect(result).toEqual({
        callSite: '/src/user.ts:50:undefined',
      });
    });

    test('should handle callsite with undefined file name', () => {
      const mockCallsite = {
        getFunctionName: () => 'error',
        getFileName: () => '/src/app.ts',
        getLineNumber: () => 10,
        getColumnNumber: () => 5,
        isEval: () => false,
        getEvalOrigin: () => undefined,
      } as CallSite;

      const nextCallsite = {
        getFunctionName: () => null,
        getFileName: () => undefined,
        getLineNumber: () => 30,
        getColumnNumber: () => 8,
        isEval: () => false,
        getEvalOrigin: () => undefined,
      } as CallSite;

      callsitesMock.mockReturnValue([mockCallsite, nextCallsite]);

      const plugin = callsitePlugin({ isProductionEnv: false });

      const result = plugin.onBeforeDataOut({ data: {} });

      expect(result).toEqual({
        callSite: 'undefined:30:8',
      });
    });

    test('should return unknown when callsite after level method is out of bounds', () => {
      const singleCallsite = {
        getFunctionName: () => 'info',
        getFileName: () => '/src/app.ts',
        getLineNumber: () => 10,
        getColumnNumber: () => 5,
        isEval: () => false,
        getEvalOrigin: () => undefined,
      } as CallSite;

      callsitesMock.mockReturnValue([singleCallsite]);

      const plugin = callsitePlugin({ isProductionEnv: false });

      const result = plugin.onBeforeDataOut({ data: {} });

      expect(result).toEqual({
        callSite: 'unknown',
      });
    });

    test('should handle callsite with null function name', () => {
      const mockCallsite = {
        getFunctionName: () => 'warn',
        getFileName: () => '/src/lib.ts',
        getLineNumber: () => 5,
        getColumnNumber: () => 2,
        isEval: () => false,
        getEvalOrigin: () => undefined,
      } as CallSite;

      const anonymousCallsite = {
        getFunctionName: () => null,
        getFileName: () => '/src/anonymous.ts',
        getLineNumber: () => 100,
        getColumnNumber: () => 25,
        isEval: () => false,
        getEvalOrigin: () => undefined,
      } as CallSite;

      callsitesMock.mockReturnValue([mockCallsite, anonymousCallsite]);

      const plugin = callsitePlugin({ isProductionEnv: false });

      const result = plugin.onBeforeDataOut({ data: {} });

      expect(result).toEqual({
        callSite: '/src/anonymous.ts:100:25',
      });
    });
  });

  describe('Data handling', () => {
    test('should handle missing data object', () => {
      const mockCallsite = {
        getFunctionName: () => 'debug',
        getFileName: () => '/src/app.ts',
        getLineNumber: () => 10,
        getColumnNumber: () => 5,
        isEval: () => false,
        getEvalOrigin: () => undefined,
      } as CallSite;

      const nextCallsite = {
        getFunctionName: () => null,
        getFileName: () => '/src/user.ts',
        getLineNumber: () => 20,
        getColumnNumber: () => 10,
        isEval: () => false,
        getEvalOrigin: () => undefined,
      } as CallSite;

      callsitesMock.mockReturnValue([mockCallsite, nextCallsite]);

      const plugin = callsitePlugin({ isProductionEnv: false });

      const result = plugin.onBeforeDataOut({});

      expect(result).toEqual({
        callSite: '/src/user.ts:20:10',
      });
    });

    test('should handle empty data object', () => {
      const mockCallsite = {
        getFunctionName: () => 'info',
        getFileName: () => '/src/app.ts',
        getLineNumber: () => 15,
        getColumnNumber: () => 8,
        isEval: () => false,
        getEvalOrigin: () => undefined,
      } as CallSite;

      const nextCallsite = {
        getFunctionName: () => null,
        getFileName: () => '/src/test.ts',
        getLineNumber: () => 25,
        getColumnNumber: () => 12,
        isEval: () => false,
        getEvalOrigin: () => undefined,
      } as CallSite;

      callsitesMock.mockReturnValue([mockCallsite, nextCallsite]);

      const plugin = callsitePlugin({ isProductionEnv: false });

      const result = plugin.onBeforeDataOut({ data: {} });

      expect(result).toEqual({
        callSite: '/src/test.ts:25:12',
      });
    });
  });

  describe('Production environment', () => {
    test('should create plugin with isProductionEnv=true', () => {
      const mockCallsite = {
        getFunctionName: () => 'error',
        getFileName: () => '/src/app.ts',
        getLineNumber: () => 10,
        getColumnNumber: () => 5,
        isEval: () => false,
        getEvalOrigin: () => undefined,
      } as CallSite;

      const nextCallsite = {
        getFunctionName: () => null,
        getFileName: () => '/src/prod.ts',
        getLineNumber: () => 50,
        getColumnNumber: () => 20,
        isEval: () => false,
        getEvalOrigin: () => undefined,
      } as CallSite;

      callsitesMock.mockReturnValue([mockCallsite, nextCallsite]);

      const plugin = callsitePlugin({ isProductionEnv: true });

      const result = plugin.onBeforeDataOut({ data: {} });

      expect(result).toEqual({
        callSite: '/src/prod.ts:50:20',
      });
      // NOTE: isProductionEnv is reserved for future use
    });
  });
});
