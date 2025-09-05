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

import { assignInlineVars } from '@vanilla-extract/dynamic';
import { kebabCase } from 'lodash';
import { layers } from '../../styles/layers.css';
import {
  pixelValueAsStringValidator,
  rgbaAsStringValidator,
} from '../validators';
import type { GlobalStyleRule, StyleRule } from '@vanilla-extract/css';
import type { RGBA } from '../../types/deckgl';
import type {
  Contract,
  CssVarFunction,
  MapLeafNodes,
  PartialMapLeafNodes,
  Primitive,
} from '../../types/vanilla-extract';

/**
 * Parse out CSS var name from CSS var implementation
 *
 * @example
 * unwrapCssVar('var(--foo)')
 * // returns '--foo'
 *
 * @example
 * unwrapCssVar('var(--foo, blue)')
 * // returns '--foo'
 *
 * @example
 * unwrapCssVar('var(--foo, var(--bar))')
 * // returns '--foo'
 */
export function unwrapCssVar(cssVar: string) {
  return cssVar.replace(/^var\((--[\w-]+)[^\w-]+.*/i, '$1');
}

type FulfilledContract<T> = MapLeafNodes<T, null | number | string | RGBA>;

// TODO: remove if possible
// NOTE: had to create a generic version not bound to type of T because of type issues around setting values on accumulator
type GenericFulfilledContract = {
  [key: string]: GenericFulfilledContract | null | number | string | RGBA;
};

/**
 * Convert contract to nested object of identical shape with computed CSS values
 * Pixel values are converted to numbers
 * RGB(A) values are converted to DeckGL compatible tuples
 * All other values are left unconverted
 */
export function computeContract<T extends Contract>(
  contract: T,
  css: CSSStyleDeclaration,
): FulfilledContract<T> {
  return Object.entries(contract).reduce<GenericFulfilledContract>(
    (acc, [key, cssVarOrContract]) => {
      if (cssVarOrContract == null) {
        acc[key] = null;

        return acc;
      }

      if (typeof cssVarOrContract === 'object') {
        acc[key] = computeContract(cssVarOrContract, css);

        return acc;
      }

      const cssVar = unwrapCssVar(cssVarOrContract);
      const value = css.getPropertyValue(cssVar);
      const pixel = pixelValueAsStringValidator.safeParse(value);

      if (pixel.success) {
        acc[key] = pixel.data;

        return acc;
      }

      const rgba = rgbaAsStringValidator.safeParse(value);

      if (rgba.success) {
        acc[key] = rgba.data;

        return acc;
      }

      acc[key] = value ?? null;

      return acc;
    },
    {},
  ) as FulfilledContract<T>;
}

/**
 * Convert potentially nested contract and values pair into flattened CSS var record
 * The contract provides a lookup for CSS vars
 * The values are expected to partially match the contract shapeForm
 */
export function reduceContract<T extends Contract, U>(
  contract: T,
  values: PartialMapLeafNodes<T, U>,
) {
  const nodes: { contract: Contract; values: PartialMapLeafNodes<T, U> }[] = [
    { contract, values },
  ];

  const vars: Record<CssVarFunction, U> = {};

  for (const node of nodes) {
    // biome-ignore lint/complexity/noForEach: TODO: refactor. converting to for...of results in breaking complexity rule limit 🫠
    Object.entries(node.values).forEach(([key, value]: [string, U]) => {
      const cssVarOrSubContract = node.contract[key];

      if (cssVarOrSubContract == null || value == null) {
        return;
      }

      if (
        typeof cssVarOrSubContract === 'string' &&
        (typeof value !== 'object' || Array.isArray(value))
      ) {
        vars[cssVarOrSubContract] = value;

        return;
      }

      if (
        typeof cssVarOrSubContract === 'object' &&
        typeof value === 'object'
      ) {
        nodes.push({ contract: cssVarOrSubContract, values: value });
      }
    });
  }

  return vars;
}

/**
 * Reduce contract and values into Vanilla Extract friendly CSS vars
 */
export function assignPartialVars<T extends Contract>(
  contract: T,
  values: PartialMapLeafNodes<T, Primitive>,
) {
  return Object.fromEntries(
    Object.entries(reduceContract(contract, values)).map(([key, value]) => [
      key,
      `${value}`,
    ]),
  );
}

type CssVarValues = {
  [key: string]: CssVarValues | Primitive;
};

type CssVarValueOptions<T extends object> = {
  [P in keyof T]?: T[P] extends object
    ? CssVarValueOptions<T[P]>
    : T[P] | T[P][];
};

type Operators = 'and' | 'or';

type ContainerQueryOptions = {
  container?: string;
  operator?: Operators;
  maxHeight?: string;
  minHeight?: string;
  maxWidth?: string;
  minWidth?: string;
};

type ContainerQueryValues<T extends CssVarValues> = CssVarValueOptions<T> &
  ContainerQueryOptions;

type MultiContainerQuery<T extends CssVarValues> = {
  operator?: Operators;
  groups: ContainerQueryValues<T>[];
};

/**
 * Handle creation of query groups based on options and values
 * Internal to containerQueries
 */
function processConditions<T extends CssVarValues>(
  contract: MapLeafNodes<Omit<T, keyof ContainerQueryOptions>, CssVarFunction>,
  values: ContainerQueryValues<T>,
) {
  return Object.entries(
    reduceContract(
      {
        ...contract,
        maxHeight: 'maxHeight', // NOTE: Passthrough these values not as CSS vars
        minHeight: 'minHeight',
        maxWidth: 'maxWidth',
        minWidth: 'minWidth',
      },
      values as PartialMapLeafNodes<
        MapLeafNodes<Omit<T, keyof ContainerQueryOptions>, CssVarFunction>,
        ContainerQueryValues<T>[string]
      >,
    ),
  ).reduce<string[]>((acc, [key, value]) => {
    if (key === 'container' || key === 'operator' || value == null) {
      return acc;
    }

    const isStyle = !/^(?:max|min)(?:Height|Width)$/.test(key);
    const prefix = isStyle ? 'style' : '';
    const prop = isStyle ? unwrapCssVar(key) : kebabCase(key);

    if (Array.isArray(value)) {
      const group = value.reduce<string[]>((ac, val) => {
        if (val != null) {
          ac.push(`${prefix}(${prop}: ${val})`);
        }

        return ac;
      }, []);

      acc.push(`(${group.join(' or ')})`);
    } else {
      acc.push(`${prefix}(${prop}: ${value})`);
    }

    return acc;
  }, []);
}

function isMultiQuery<T extends CssVarValues>(
  value: unknown,
): value is MultiContainerQuery<T> {
  return (
    value != null &&
    typeof value === 'object' &&
    (!('operator' in value) ||
      ('operator' in value &&
        (value.operator === 'and' || value.operator === 'or'))) &&
    'groups' in value &&
    Array.isArray(value.groups) &&
    value.groups.every((group) => group != null && typeof group === 'object')
  );
}

/**
 * Create simple or complex container queries with and/or operators.
 *
 * To provide type safety and ease of use, this function accepts a generic and a contract
 * The generic type defines the possible values for the parameters defined within the contract
 *
 * Ex: `containerQuery<{ foo: boolean }>({ foo: 'var(--foo)' }, { foo: true })`
 *
 * By providing the type constraint and contract, the query parameters will have intellisense
 * on which parameters exist and what their possible values can be
 *
 * @example
 * containerQuery(contract, { a: true })
 * // returns (a: true)
 *
 * @example
 * containerQuery(contract, { a: true, b: true })
 * // returns (a: true) and (b: true)
 *
 * @example
 * containerQuery(contract, { operator: 'or', a: true, b: true })
 * // returns (a: true) or (b: true)
 *
 * @example
 * containerQuery(contract, { groups: [{ a: true }, { b: true }] })
 * // returns (a: true) or (b: true)
 *
 * @example
 * containerQuery(contract, { a: ['foo', 'bar'] })
 * // returns (a: 'foo') or (a: 'bar')
 *
 * @example
 * containerQuery(contract, { a: ['foo', 'bar'], b: true })
 * // returns ((a: 'foo') or (a: 'bar')) and (b: true)
 *
 * @example
 * containerQuery(contract, { operator: 'or', a: ['foo', 'bar'], b: true })
 * // returns ((a: 'foo') or (a: 'bar')) or (b: true)
 *
 * @example
 * containerQuery(contract, { groups: [{ a: true, b: true }, { c: true, d: true }] })
 * // returns ((a: true) and (b: true)) or ((c: true) and (d: true))
 *
 * @example
 * containerQuery(contract, { operator: 'and', groups: [{ operator: 'or', a: true, b: true }, { c: true, d: true }] })
 * // returns ((a: true) or (b: true)) and ((c: true) and (d: true))
 *
 * @example
 * containerQuery(contract, { operator: 'and', groups: [{ operator: 'or', a: true, b: true }, { operator: 'or', c: true, d: true }] })
 * // returns ((a: true) or (b: true)) and ((c: true) or (d: true))
 */
export function containerQuery<T extends CssVarValues = CssVarValues>(
  contract: MapLeafNodes<Omit<T, keyof ContainerQueryOptions>, CssVarFunction>,
  query: ContainerQueryValues<T> | MultiContainerQuery<T>,
) {
  const isMultiGroup = isMultiQuery<T>(query);
  const groups = isMultiGroup ? query.groups : [query];
  const groupsOperator = ` ${(isMultiGroup ? query.operator : null) ?? 'or'} `;

  return groups
    .map((group, index) => {
      const operator = ` ${group.operator ?? 'and'} `;

      let container = group.container ?? '';

      if (index) {
        // Multiple container specifiers is not yet supported: https://github.com/w3c/csswg-drafts/issues/6876
        container = '';
      }

      const conditions = processConditions(contract, group);
      const isMultiCondition = groups.length > 1 && conditions.length > 1;

      return [
        container,
        container && ' ',
        isMultiCondition ? '(' : '',
        conditions.join(operator),
        isMultiCondition ? ')' : '',
      ].join('');
    })
    .join(groupsOperator);
}

type ContainerStyle = Exclude<StyleRule['@container'], undefined>[string];

type ContainerQuery<T extends CssVarValues> = {
  query: ContainerQueryValues<T> | MultiContainerQuery<T>;
};

type ContainerQueries<T extends CssVarValues> = ContainerStyle &
  ContainerQuery<T>;

type GlobalContainerStyle = Exclude<
  GlobalStyleRule['@container'],
  undefined
>[string];

type GlobalContainerQueries<T extends CssVarValues> = GlobalContainerStyle &
  ContainerQuery<T>;

/**
 * Bulk container query creation based on the same contract
 */
export function containerQueries<T extends CssVarValues = CssVarValues>(
  contract: MapLeafNodes<Omit<T, keyof ContainerQueryOptions>, CssVarFunction>,
  ...styles: ContainerQueries<T>[]
): Record<string, ContainerStyle>;

export function containerQueries<T extends CssVarValues = CssVarValues>(
  contract: MapLeafNodes<Omit<T, keyof ContainerQueryOptions>, CssVarFunction>,
  ...styles: GlobalContainerQueries<T>[]
): Record<string, GlobalContainerStyle>;

export function containerQueries<T extends CssVarValues = CssVarValues>(
  contract: MapLeafNodes<Omit<T, keyof ContainerQueryOptions>, CssVarFunction>,
  ...styles: ContainerQueries<T>[] | GlobalContainerQueries<T>[]
): Record<string, ContainerStyle | GlobalContainerStyle> {
  return Object.fromEntries(
    styles.map(({ query, ...style }) => [
      containerQuery<T>(contract, query),
      style,
    ]),
  );
}

type VarsOnlyContainerQuery<T extends CssVarValues> = Required<
  Pick<ContainerQueries<T>, 'query' | 'vars'>
>;

type QueryOptionalVarsOnlyContainerQuery<T extends CssVarValues> = Partial<
  Pick<VarsOnlyContainerQuery<T>, 'query'>
> &
  Pick<VarsOnlyContainerQuery<T>, 'vars'>;

/**
 * Helper for establishing global theme variables with the restriction that
 * only variables may be set (and are required). All other styles must be
 * established using alternative utils
 *
 * The first style rule has an optional query. If the query is missing, the vars
 * are set outside of a container query
 */
export function applyThemeVars<T extends CssVarValues = CssVarValues>(
  contract: MapLeafNodes<Omit<T, keyof ContainerQueryOptions>, CssVarFunction>,
  styles:
    | [QueryOptionalVarsOnlyContainerQuery<T>, ...VarsOnlyContainerQuery<T>[]]
    | VarsOnlyContainerQuery<T>[],
  layer = layers.variables.l1,
): StyleRule {
  const [style, ...rest] = styles;

  const stylesWithQueries = (
    style.query ? styles : rest
  ) as VarsOnlyContainerQuery<T>[];

  return {
    '@layer': {
      [layer]: {
        ...(style.query ? {} : { vars: style.vars }),
        ...(stylesWithQueries.length
          ? {
              '@container': containerQueries<T>(contract, ...stylesWithQueries),
            }
          : {}),
      },
    },
  };
}

/**
 * Runtime creation of inline style CSS vars that enable CSS container queries
 */
export function inlineVars(
  vars: Record<string, Primitive>,
): Record<string, string>;

export function inlineVars<T extends Contract>(
  contract: T,
  values: PartialMapLeafNodes<T, Primitive>,
): Record<string, string>;

export function inlineVars<T extends Contract>(
  varsOrContract: Record<string, Primitive> | T,
  values?: PartialMapLeafNodes<T, Primitive>,
): Record<string, string> {
  return assignInlineVars(
    values
      ? assignPartialVars(varsOrContract as T, values)
      : Object.entries(varsOrContract).reduce<Record<string, string>>(
          (acc, [key, value]) => {
            if (value != null) {
              acc[key] = `${value}`;
            }

            return acc;
          },
          {},
        ),
  );
}
