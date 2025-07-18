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

import { assert, describe, expect, it } from 'vitest';
import { mergeClassNames, mergeProps } from './';
import type { RenderProps } from '../../types/react-aria';

describe('utils/props', () => {
  describe('mergeClassNames', () => {
    it('should merge class names objects', () => {
      expect(
        mergeClassNames({ foo: 'foo' }, { foo: 'FOO', bar: 'bar' }),
      ).toEqual({ foo: 'foo FOO', bar: 'bar' });
    });

    it('should return undefined if provided no class names objects', () => {
      expect(mergeClassNames(null, undefined)).toBeUndefined();
    });
  });

  describe('mergeProps', () => {
    it('should merge plain class names', () => {
      expect(
        mergeProps({ className: 'Foo' }, { className: 'Bar' }, {}),
      ).toEqual({
        className: 'Foo Bar',
      });

      expect(mergeProps({ className: 'Foo' }, { className: null }, {})).toEqual(
        {
          className: 'Foo',
        },
      );
    });

    it('should merge render prop class names', () => {
      const props = mergeProps<RenderProps<object>>(
        { className: () => 'Foo' },
        { className: 'Bar' },
        {},
      );

      expect(props).toEqual({
        className: expect.any(Function),
      });

      assert(typeof props.className === 'function');

      expect(props.className({})).toBe('Foo Bar');

      expect(props.className({ defaultClassName: 'Default' })).toBe(
        'Default Foo Bar',
      );
    });

    it('should merge plain styles', () => {
      expect(
        mergeProps(
          { style: { display: 'block' } },
          { style: { position: 'absolute' } },
          {},
        ),
      ).toEqual({
        style: {
          display: 'block',
          position: 'absolute',
        },
      });
    });

    it('should merge render prop styles', () => {
      const props = mergeProps<RenderProps<object>>(
        { style: () => ({ display: 'block' }) },
        { style: { position: 'absolute' } },
        {},
      );

      expect(props).toEqual({
        style: expect.any(Function),
      });

      assert(typeof props.style === 'function');

      expect(props.style({})).toEqual({
        display: 'block',
        position: 'absolute',
      });

      expect(props.style({ defaultStyle: { color: 'red' } })).toEqual({
        color: 'red',
        display: 'block',
        position: 'absolute',
      });
    });
  });
});
