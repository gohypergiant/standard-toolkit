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

import { describe, expect, it } from 'vitest';
import { CHARACTER_SETS } from './character-sets.js';
import { defaultSettings } from './default-settings.js';
import { TextLayer, type TextLayerProps } from './index';

describe('TextLayer', () => {
  const config: Omit<TextLayerProps, 'data'> = {
    id: Math.random().toString(36).slice(2),
    characterSet: TextLayer.CHARACTER_SETS.EXPANDED,
    fontFamily: 'Foo',
    fontSettings: {
      fontSize: 42,
    },
    fontWeight: 444,
    getColor: [123, 231, 213, 254],
    outlineColor: [1, 2, 3, 205],
    outlineWidth: 2,
  } as const;

  it('should create layer with customized props', () => {
    const layer = new TextLayer({ ...config, data: [] });
    const {
      // NOTE: these are specified because they should be ignored below
      count,
      internalState,
      lifecycle,
      parent,

      // the test should only care about these remaining settings
      // because they are being customized in TextLayer
      ...snapshotActual
    } = JSON.parse(JSON.stringify(layer));

    expect(snapshotActual.props).toEqual({
      ...defaultSettings,
      ...config,
      fontSettings: {
        ...defaultSettings.fontSettings,
        ...config.fontSettings,
      },
    });
  });

  it('should use defaults when no props are provided', () => {
    const id = 'testing-default-config-values';
    const layer = new TextLayer({ data: [], id } as unknown as TextLayerProps);
    const {
      // NOTE: these are specified because they should be ignored below
      count,
      internalState,
      lifecycle,
      parent,

      // the test should only care about these remaining settings
      // because they are being customized in TextLayer
      ...snapshotActual
    } = JSON.parse(JSON.stringify(layer));

    expect(snapshotActual.props).toMatchObject({
      ...defaultSettings,
      id,
      fontSettings: {
        ...defaultSettings.fontSettings,
      },
    });
  });

  it('should handle predefined character sets', () => {
    const id = 'predefined-characterSet-preset';
    const layer = new TextLayer({ id, data: [], characterSet: 'ASCII_ALL' });

    expect(layer.props.characterSet).toBe(TextLayer.CHARACTER_SETS.ASCII_ALL);
  });

  it('should handle custom character set strings', () => {
    const customCharSet = 'abcdefg123456';
    const layer = new TextLayer({
      id: 'custom-charset',
      data: [],
      characterSet: customCharSet,
    });

    expect(layer.props.characterSet).toBe(customCharSet);
  });

  it('should fall back to custom string for unknown character set keys', () => {
    const unknownCharSet = 'UNKNOWN_SET';
    const layer = new TextLayer({
      id: 'unknown-charset',
      data: [],
      characterSet: unknownCharSet,
    });

    // Should use the string as-is since it's not a known key
    expect(layer.props.characterSet).toBe(unknownCharSet);
  });

  it('should merge fontSettings with defaults', () => {
    const fontSize = 20;
    const layer = new TextLayer({
      id: 'font-settings',
      data: [],
      fontSettings: {
        fontSize,
      },
    });

    expect(layer.props.fontSettings).toEqual({
      ...defaultSettings.fontSettings,
      fontSize,
    });
  });

  it('should handle empty data array', () => {
    const layer = new TextLayer({
      id: 'test-empty-data',
      data: [],
    });

    expect(layer.props.data).toEqual([]);
    expect(layer.props.id).toBe('test-empty-data');
  });

  it('should preserve all TextLayer props', () => {
    const layer = new TextLayer({
      id: 'test-text-layer-props',
      data: [{ text: 'Hello', position: [0, 0] as [number, number] }],
      getText: (d) => (d as { text: string }).text,
      getPosition: (d) => (d as { position: [number, number] }).position,
      getAngle: 45,
      getTextAnchor: 'middle',
      getAlignmentBaseline: 'center',
    });

    expect(layer.props.getText).toBeDefined();
    expect(layer.props.getPosition).toBeDefined();
    expect(layer.props.getAngle).toBe(45);
    expect(layer.props.getTextAnchor).toBe('middle');
    expect(layer.props.getAlignmentBaseline).toBe('center');
  });

  it('should have a static property for character sets', () => {
    expect(TextLayer.CHARACTER_SETS).toEqual(CHARACTER_SETS);
  });
});
