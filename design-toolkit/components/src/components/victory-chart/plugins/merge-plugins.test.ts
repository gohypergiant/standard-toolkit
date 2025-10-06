/*
 * Copyright 2025 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { describe, expect, it, vi } from 'vitest';
import { mergePlugins } from './merge-plugins';

describe('mergePlugins', () => {
  it('should return default plugins when no overrides are provided', () => {
    const plugins = mergePlugins();

    expect(plugins.title).toBeDefined();
    expect(plugins.noData).toBeDefined();
    expect(plugins.detail).toBeDefined();
    expect(plugins.focus).toBeDefined();
    expect(plugins.rulerDay).toBeDefined();
    expect(plugins.rulerHour).toBeDefined();
    expect(plugins.timing).toBeDefined();
    expect(plugins.zoom).toBeDefined();
  });

  it('should override specific plugins when overrides are provided', () => {
    const mockTitle = vi.fn();
    const mockNoData = vi.fn();

    const plugins = mergePlugins({
      title: mockTitle,
      noData: mockNoData,
    });

    expect(plugins.title).toBe(mockTitle);
    expect(plugins.noData).toBe(mockNoData);
    expect(plugins.detail).toBeDefined();
    expect(plugins.focus).toBeDefined();
  });

  it('should handle all plugin overrides', () => {
    const mockTitle = vi.fn();
    const mockNoData = vi.fn();
    const mockDetail = vi.fn();
    const mockFocus = vi.fn();
    const mockRulerDay = vi.fn();
    const mockRulerHour = vi.fn();
    const mockTiming = vi.fn();
    const mockZoom = vi.fn();

    const plugins = mergePlugins({
      title: mockTitle,
      noData: mockNoData,
      detail: mockDetail,
      focus: mockFocus,
      rulerDay: mockRulerDay,
      rulerHour: mockRulerHour,
      timing: mockTiming,
      zoom: mockZoom,
    });

    expect(plugins.title).toBe(mockTitle);
    expect(plugins.noData).toBe(mockNoData);
    expect(plugins.detail).toBe(mockDetail);
    expect(plugins.focus).toBe(mockFocus);
    expect(plugins.rulerDay).toBe(mockRulerDay);
    expect(plugins.rulerHour).toBe(mockRulerHour);
    expect(plugins.timing).toBe(mockTiming);
    expect(plugins.zoom).toBe(mockZoom);
  });
});
