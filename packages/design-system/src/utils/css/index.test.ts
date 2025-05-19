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
import { layers } from '../../styles/layers.css';
import type { Contract } from '../../types/vanilla-extract';
import {
  applyThemeVars,
  assignPartialVars,
  computeContract,
  containerQueries,
  containerQuery,
  inlineVars,
  unwrapCssVar,
} from './';

describe('utils/css', () => {
  describe('applyThemeVars', () => {
    it('should assign vars to defined layer', () => {
      expect(
        applyThemeVars<{ foo: boolean }>(
          { foo: 'var(--foo)' },
          [{ vars: { bar: 'bar' } }],
          layers.variables.l3,
        ),
      ).toEqual({
        '@layer': {
          [layers.variables.l3]: {
            vars: { bar: 'bar' },
          },
        },
      });
    });

    it('should create root vars style rule', () => {
      expect(
        applyThemeVars<{ foo: boolean }>({ foo: 'var(--foo)' }, [
          { vars: { bar: 'bar' } },
        ]),
      ).toEqual({
        '@layer': {
          [layers.variables.l1]: {
            vars: { bar: 'bar' },
          },
        },
      });
    });

    it('should create container queries', () => {
      expect(
        applyThemeVars<{ foo: boolean }>({ foo: 'var(--foo)' }, [
          { vars: { bar: 'bar' } },
          { query: { foo: true }, vars: { bar: 'rab' } },
        ]),
      ).toEqual({
        '@layer': {
          [layers.variables.l1]: {
            vars: { bar: 'bar' },
            '@container': {
              'style(--foo: true)': {
                vars: { bar: 'rab' },
              },
            },
          },
        },
      });

      expect(
        applyThemeVars<{ foo: boolean }>({ foo: 'var(--foo)' }, [
          { query: { foo: false }, vars: { bar: 'bar' } },
          { query: { foo: true }, vars: { bar: 'rab' } },
        ]),
      ).toEqual({
        '@layer': {
          [layers.variables.l1]: {
            '@container': {
              'style(--foo: false)': {
                vars: { bar: 'bar' },
              },
              'style(--foo: true)': {
                vars: { bar: 'rab' },
              },
            },
          },
        },
      });
    });
  });

  describe('assignPartialVars', () => {
    it('should allow for partially setting a contract', () => {
      const vars = {
        foo: {
          a: 'var(--foo-a)',
          b: 'var(--foo-b)',
        },
        bar: 'var(--bar)',
      } satisfies Contract;

      expect(
        assignPartialVars(vars, {
          foo: {
            a: 'tada',
          },
          bar: null,
        }),
      ).toEqual({
        [vars.foo.a]: 'tada',
      });
    });
  });

  describe('computeContract', () => {
    it('should convert pixel values to numbers', () => {
      expect(
        computeContract({ foo: 'var(--foo)' }, {
          getPropertyValue: () => '10px',
        } as unknown as CSSStyleDeclaration),
      ).toEqual({ foo: 10 });

      expect(
        computeContract({ foo: 'var(--foo)' }, {
          getPropertyValue: () => '0',
        } as unknown as CSSStyleDeclaration),
      ).toEqual({ foo: 0 });
    });

    it('should convert rgb(a) values to rgba tuples', () => {
      expect(
        computeContract({ foo: 'var(--foo)' }, {
          getPropertyValue: () => 'rgb(10, 10, 10)',
        } as unknown as CSSStyleDeclaration),
      ).toEqual({ foo: [10, 10, 10, 255] });

      expect(
        computeContract({ foo: 'var(--foo)' }, {
          getPropertyValue: () => 'rgba(0, 0, 0, 0.4)',
        } as unknown as CSSStyleDeclaration),
      ).toEqual({ foo: [0, 0, 0, 102] });
    });

    it('should leave all other values unconverted', () => {
      expect(
        computeContract({ foo: 'var(--foo)' }, {
          getPropertyValue: () => 'none',
        } as unknown as CSSStyleDeclaration),
      ).toEqual({ foo: 'none' });

      expect(
        computeContract({ foo: 'var(--foo)' }, {
          getPropertyValue: () => 'transform(-50%, -50%)',
        } as unknown as CSSStyleDeclaration),
      ).toEqual({ foo: 'transform(-50%, -50%)' });
    });

    it('should handle nested and incomplete contracts', () => {
      expect(
        computeContract(
          { foo: 'var(--foo)', bar: { fizz: 'var(--foo)', bang: null } },
          {
            getPropertyValue: () => 'none',
          } as unknown as CSSStyleDeclaration,
        ),
      ).toEqual({ foo: 'none', bar: { fizz: 'none', bang: null } });
    });
  });

  describe('containerQuery', () => {
    it('should handle named containers', () => {
      expect(
        containerQuery<{ foo: boolean }>(
          { foo: 'var(--foo)' },
          { container: 'foo', foo: true },
        ),
      ).toBe('foo style(--foo: true)');
    });

    it('should handle dimension queries', () => {
      expect(
        containerQuery(
          {},
          {
            maxHeight: '1000px',
            minHeight: '1px',
            maxWidth: '1000px',
            minWidth: '1px',
          },
        ),
      ).toBe(
        '(max-height: 1000px) and (min-height: 1px) and (max-width: 1000px) and (min-width: 1px)',
      );
    });

    it('should handle it all together', () => {
      expect(
        containerQuery<{ foo: boolean }>(
          { foo: 'var(--foo)' },
          {
            container: 'foo',
            minWidth: '300px',
            foo: true,
          },
        ),
      ).toBe('foo (min-width: 300px) and style(--foo: true)');
    });

    it('should handle changing the operator', () => {
      expect(
        containerQuery<{ a: boolean; b: boolean }>(
          { a: 'var(--a)', b: 'var(--b)' },
          { operator: 'or', a: true, b: true },
        ),
      ).toBe('style(--a: true) or style(--b: true)');
    });

    it('should handle multiple values for a single prop', () => {
      expect(
        containerQuery<{ a: 'foo' | 'bar' }>(
          { a: 'var(--a)' },
          { a: ['foo', 'bar'] },
        ),
      ).toBe('(style(--a: foo) or style(--a: bar))');
    });

    it('should handle multiple groups', () => {
      expect(
        containerQuery<{ a: boolean; b: boolean }>(
          { a: 'var(--a)', b: 'var(--b)' },
          { groups: [{ a: true }, { b: true }] },
        ),
      ).toBe('style(--a: true) or style(--b: true)');
    });

    it('should handle compound operators', () => {
      expect(
        containerQuery<{ a: 'foo' | 'bar'; b: boolean }>(
          { a: 'var(--a)', b: 'var(--b)' },
          { a: ['foo', 'bar'], b: true },
        ),
      ).toBe('(style(--a: foo) or style(--a: bar)) and style(--b: true)');

      expect(
        containerQuery<{ a: boolean; b: boolean; c: boolean; d: boolean }>(
          { a: 'var(--a)', b: 'var(--b)', c: 'var(--c)', d: 'var(--d)' },
          {
            groups: [
              { a: true, b: true },
              { c: true, d: true },
            ],
          },
        ),
      ).toBe(
        '(style(--a: true) and style(--b: true)) or (style(--c: true) and style(--d: true))',
      );

      expect(
        containerQuery<{ a: boolean; b: boolean; c: boolean; d: boolean }>(
          { a: 'var(--a)', b: 'var(--b)', c: 'var(--c)', d: 'var(--d)' },
          {
            operator: 'and',
            groups: [
              { operator: 'or', a: true, b: true },
              { operator: 'or', c: true, d: true },
            ],
          },
        ),
      ).toBe(
        '(style(--a: true) or style(--b: true)) and (style(--c: true) or style(--d: true))',
      );

      expect(
        containerQuery<{ a: boolean; b: boolean; c: boolean; d: boolean }>(
          { a: 'var(--a)', b: 'var(--b)', c: 'var(--c)', d: 'var(--d)' },
          {
            operator: 'and',
            groups: [
              { operator: 'or', a: true, b: true },
              { c: true, d: true },
            ],
          },
        ),
      ).toBe(
        '(style(--a: true) or style(--b: true)) and (style(--c: true) and style(--d: true))',
      );
    });
  });

  describe('containerQueries', () => {
    it('should handle multiple container query styles', () => {
      expect(
        containerQueries<{ foo: boolean }>(
          { foo: 'var(--foo)' },
          { query: { foo: true }, display: 'block' },
          { query: { foo: false }, display: 'none' },
        ),
      ).toEqual({
        'style(--foo: true)': {
          display: 'block',
        },
        'style(--foo: false)': {
          display: 'none',
        },
      });
    });
  });

  describe('inlineVars', () => {
    it('should filter out css vars with nullish values', () => {
      expect(
        inlineVars({ a: true, b: false, c: 0, d: '', e: null, f: undefined }),
      ).toEqual({
        a: 'true',
        b: 'false',
        c: '0',
        d: '',
      });
    });
  });

  describe('unwrapCssVar', () => {
    it('should unwrap and return first css var', () => {
      expect(unwrapCssVar('var(--foo)')).toBe('--foo');
      expect(unwrapCssVar('var(--foo, red)')).toBe('--foo');
      expect(unwrapCssVar('var(--foo, var(--bar), red)')).toBe('--foo');
    });
  });
});
