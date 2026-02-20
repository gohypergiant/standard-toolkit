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

import { describe, expect, test } from 'vitest';
import { environmentPlugin } from './environment';

describe('environmentPlugin', () => {
  describe('Plugin creation', () => {
    test('should create plugin with provided id', () => {
      const plugin = environmentPlugin({
        isServer: false,
        isProductionEnv: false,
        id: 'test-environment',
      });

      expect(plugin.id).toBe('test-environment');
    });

    test('should create plugin with disabled=true', () => {
      const plugin = environmentPlugin({
        isServer: false,
        isProductionEnv: false,
        disabled: true,
      });

      expect(plugin.disabled).toBe(true);
    });

    test('should create plugin without disabled flag when not provided', () => {
      const plugin = environmentPlugin({
        isServer: false,
        isProductionEnv: false,
      });

      expect(plugin.disabled).toBeUndefined();
    });

    test('should have onBeforeDataOut hook', () => {
      const plugin = environmentPlugin({
        isServer: false,
        isProductionEnv: false,
      });

      expect(plugin.onBeforeDataOut).toBeTypeOf('function');
    });
  });

  describe('Server context injection', () => {
    test('should add server=true when isServer is true', () => {
      const plugin = environmentPlugin({
        isServer: true,
        isProductionEnv: false,
      });

      const result = plugin.onBeforeDataOut({ data: {} });

      expect(result).toEqual({ server: true });
    });

    test('should add server=false when isServer is false', () => {
      const plugin = environmentPlugin({
        isServer: false,
        isProductionEnv: false,
      });

      const result = plugin.onBeforeDataOut({ data: {} });

      expect(result).toEqual({ server: false });
    });
  });

  describe('Data handling', () => {
    test('should preserve existing data properties when adding server', () => {
      const plugin = environmentPlugin({
        isServer: true,
        isProductionEnv: false,
      });

      const result = plugin.onBeforeDataOut({
        data: { requestId: 'abc-123', userId: 42 },
      });

      expect(result).toEqual({
        requestId: 'abc-123',
        userId: 42,
        server: true,
      });
    });

    test('should not mutate original data object', () => {
      const plugin = environmentPlugin({
        isServer: false,
        isProductionEnv: false,
      });
      const originalData = { key: 'value' };

      plugin.onBeforeDataOut({ data: originalData });

      expect(originalData).toEqual({ key: 'value' });
      expect(originalData).not.toHaveProperty('server');
    });

    test('should handle missing data param using empty object default', () => {
      const plugin = environmentPlugin({
        isServer: true,
        isProductionEnv: false,
      });

      const result = plugin.onBeforeDataOut({});

      expect(result).toEqual({ server: true });
    });

    test('should handle empty data object', () => {
      const plugin = environmentPlugin({
        isServer: false,
        isProductionEnv: false,
      });

      const result = plugin.onBeforeDataOut({ data: {} });

      expect(result).toEqual({ server: false });
    });

    test('should overwrite existing server property with configured value', () => {
      const plugin = environmentPlugin({
        isServer: true,
        isProductionEnv: false,
      });

      const result = plugin.onBeforeDataOut({ data: { server: false } });

      expect(result).toEqual({ server: true });
    });
  });

  describe('Production environment', () => {
    test('should create plugin when isProductionEnv is true', () => {
      const plugin = environmentPlugin({
        isServer: false,
        isProductionEnv: true,
      });

      const result = plugin.onBeforeDataOut({ data: {} });

      // isProductionEnv is reserved for future use; server context is still injected
      expect(result).toEqual({ server: false });
    });

    test('should create plugin when isProductionEnv is false', () => {
      const plugin = environmentPlugin({
        isServer: true,
        isProductionEnv: false,
      });

      const result = plugin.onBeforeDataOut({ data: {} });

      expect(result).toEqual({ server: true });
    });
  });
});
