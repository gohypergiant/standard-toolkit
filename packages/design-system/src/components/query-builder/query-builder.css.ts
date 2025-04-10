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

import {
  createContainer,
  createThemeContract,
  fallbackVar,
  style,
} from '@vanilla-extract/css';
import { layers, radiusVars } from '../../styles';
import { containerQueries } from '../../utils';
import type {
  QueryBuilderClassNames,
  QueryBuilderGroupState,
  QueryBuilderRuleState,
} from './types';

export const queryBuilderContainers = {
  queryBuilder: createContainer(),
  group: createContainer(),
  rule: createContainer(),
  values: createContainer(),
};

export const queryBuilderColorVars = createThemeContract({
  queryBuilder: {
    background: '',
    border: '',
    color: '',
  },
  group: {
    background: '',
    border: '',
    color: '',
    lineColor: '',
  },
  rule: {
    background: '',
    border: '',
    color: '',
    lineColor: '',
  },
  error: {
    color: '',
  },
});

export const queryBuilderSpaceVars = createThemeContract({
  queryBuilder: {
    x: '',
    y: '',
  },
  group: {
    gap: '',
    x: '',
    y: '',
    lineIndent: '',
  },
  header: {
    x: '',
    y: '',
  },
  body: {
    gap: '',
    x: '',
    y: '',
  },
  rule: {
    x: '',
    y: '',
    lineIndent: '',
  },
  core: {
    gap: '',
  },
  field: {
    width: '',
    maxWidth: '',
    minWidth: '',
  },
  operator: {
    width: '',
    maxWidth: '',
    minWidth: '',
  },
  values: {
    gap: '',
    width: '',
    maxWidth: '',
    minWidth: '',
  },
  source: {
    width: '',
    maxWidth: '',
    minWidth: '',
  },
  footer: {
    x: '',
    y: '',
  },
});

export const queryBuilderStateVars = createThemeContract({
  isDisabled: '',
  showRuleLines: '',
});

export const queryBuilderGroupStateVars = createThemeContract({
  after: '',
  before: '',
  columns: '',
  orientation: '',
  isDisabled: '',
});

export const queryBuilderRuleStateVars = createThemeContract({
  orientation: '',
  isDisabled: '',
  isDragging: '',
  isDropTarget: '',
});

export const queryBuilderClassNames: QueryBuilderClassNames = {
  queryBuilder: {
    container: style({
      '@layer': {
        [layers.components.l1]: {
          containerName: queryBuilderContainers.queryBuilder,
          display: 'contents',
        },
      },
    }),
    queryBuilder: style({
      '@layer': {
        [layers.components.l1]: {
          border: `1px solid ${fallbackVar(queryBuilderColorVars.queryBuilder.border, 'transparent')}`,
          background: queryBuilderColorVars.queryBuilder.background,
          color: queryBuilderColorVars.queryBuilder.color,
          padding: `${fallbackVar(queryBuilderSpaceVars.queryBuilder.y, '0')} ${fallbackVar(queryBuilderSpaceVars.queryBuilder.x, '0')}`,
        },
      },
    }),
  },
  group: {
    container: style({
      '@layer': {
        [layers.components.l1]: {
          containerName: queryBuilderContainers.group,
          position: 'relative',
          gridColumn: '1/-1',
        },
      },
    }),
    group: style({
      '@layer': {
        [layers.components.l1]: {
          border: `1px solid ${fallbackVar(queryBuilderColorVars.group.border, 'transparent')}`,
          borderRadius: radiusVars.md,
          background: queryBuilderColorVars.group.background,
          color: queryBuilderColorVars.group.color,
          display: 'flex',
          flexDirection: 'column',
          gap: queryBuilderSpaceVars.group.gap,
          padding: `${fallbackVar(queryBuilderSpaceVars.group.y, '0')} ${fallbackVar(queryBuilderSpaceVars.group.x, '0')}`,
          width: 'fit-content',
          position: 'relative',
          marginLeft: fallbackVar(
            queryBuilderSpaceVars.group.lineIndent,
            '10px',
          ),
          borderColor: fallbackVar(
            queryBuilderColorVars.group.lineColor,
            'rgb(89,89,89)',
          ),
          '::before': {
            content: '',
            position: 'absolute',
            top: `calc(${queryBuilderSpaceVars.body.gap} * -1)`,
            left: `calc(${fallbackVar(queryBuilderSpaceVars.group.lineIndent, '10px')} * -1)`,
            width: fallbackVar(queryBuilderSpaceVars.group.lineIndent, '10px'),
            borderWidth: '0 0 1px 1px',
            borderRadius: radiusVars.sm,
            borderColor: fallbackVar(
              queryBuilderColorVars.group.lineColor,
              'rgb(89,89,89)',
            ),
            borderStyle: 'solid',
            height: `calc(50% + ${queryBuilderSpaceVars.body.gap})`,
          },
          '::after': {
            content: '',
            position: 'absolute',
            width: 1,
            left: `calc(${fallbackVar(queryBuilderSpaceVars.group.lineIndent, '10px')} * -1)`,
            borderRadius: radiusVars.sm,
            top: '50%',
            height: `calc(50% + ${queryBuilderSpaceVars.body.gap})`,
            borderWidth: '0 0 1px 1px',
            borderColor: fallbackVar(
              queryBuilderColorVars.group.lineColor,
              'rgb(89,89,89)',
            ),
            borderStyle: 'solid',
          },
          get selectors() {
            return {
              [`${queryBuilderClassNames?.queryBuilder?.queryBuilder} > ${queryBuilderClassNames.group?.container} > &`]:
                {
                  border: 'none',
                  padding: 0,
                  margin: 0,
                },
              [`${queryBuilderClassNames.queryBuilder?.queryBuilder} > ${queryBuilderClassNames.group?.container} > &::before`]:
                {
                  display: 'none',
                },
              [`${queryBuilderClassNames.queryBuilder?.queryBuilder} > ${queryBuilderClassNames.group?.container} > &::after`]:
                {
                  display: 'none',
                },
              ':last-child > &::before': {
                borderBottomLeftRadius: radiusVars.md,
              },
              ':last-child > &::after': {
                display: 'none',
              },
            };
          },
          '@container': containerQueries(queryBuilderStateVars, {
            query: {
              showRuleLines: false,
            },
            '::before': {
              display: 'none',
            },
            '::after': {
              display: 'none',
            },
          }),
        },
      },
    }),
    header: style({
      '@layer': {
        [layers.components.l1]: {
          display: 'flex',
          padding: `${fallbackVar(queryBuilderSpaceVars.header.y, '0')} ${fallbackVar(queryBuilderSpaceVars.header.x, '0')}`,
          justifyContent: 'space-between',
        },
      },
    }),
    body: style({
      '@layer': {
        [layers.components.l1]: {
          display: 'grid',
          alignItems: 'start',
          gap: queryBuilderSpaceVars.body.gap,
          /**
           * Because we're dealing with a dynamic number of columns and there are two columns that we want to provide the most space to
           * we have to track their position by counting how many optional columns exist on either side of the core columns
           *
           * Then because CSS repeat doesn't work with 0, we have to query for possible states and account for columns shift
           *
           * The one big caveat with this is that if a custom Rule component changes the order of rendered elements, then this style must
           * be updated as well to reflect the new order
           */
          '@container': containerQueries<QueryBuilderGroupState>(
            queryBuilderGroupStateVars,
            {
              query: { orientation: 'vertical' },
              gridTemplateColumns: 'max-content min-content',
            },
            {
              query: { orientation: 'vertical', before: [1, 2], after: 0 },
              gridTemplateColumns: `repeat(${queryBuilderGroupStateVars.before}, min-content) max-content min-content`,
            },
            {
              query: { orientation: 'vertical', before: 0, after: [1, 2] },
              gridTemplateColumns: `max-content repeat(${queryBuilderGroupStateVars.after}, min-content) min-content`,
            },
            {
              query: { orientation: 'vertical', before: [1, 2], after: [1, 2] },
              gridTemplateColumns: `repeat(${queryBuilderGroupStateVars.before}, min-content) max-content repeat(${queryBuilderGroupStateVars.after}, min-content) min-content`,
            },
            {
              query: { orientation: 'horizontal' },
              gridTemplateColumns:
                'max-content min-content min-content max-content min-content',
            },
            {
              query: { orientation: 'horizontal', before: [1, 2], after: 0 },
              gridTemplateColumns: `repeat(${queryBuilderGroupStateVars.before}, min-content) max-content min-content min-content max-content min-content`,
            },
            {
              query: { orientation: 'horizontal', before: 0, after: [1, 2] },
              gridTemplateColumns: `max-content min-content min-content max-content repeat(${queryBuilderGroupStateVars.after}, min-content) min-content`,
            },
            {
              query: {
                orientation: 'horizontal',
                before: [1, 2],
                after: [1, 2],
              },
              gridTemplateColumns: `repeat(${queryBuilderGroupStateVars.before}, min-content) max-content min-content min-content max-content repeat(${queryBuilderGroupStateVars.after}, min-content) min-content`,
            },
          ),
          padding: `${fallbackVar(queryBuilderSpaceVars.body.y, '0')} ${fallbackVar(queryBuilderSpaceVars.body.x, '0')}`,
        },
      },
    }),
    footer: style({
      '@layer': {
        [layers.components.l1]: {
          display: 'flex',
          justifyContent: 'flex-start',
          padding: `${fallbackVar(queryBuilderSpaceVars.footer.y, '0')} ${fallbackVar(queryBuilderSpaceVars.footer.x, '0')}`,
        },
      },
    }),
  },
  rule: {
    container: style({
      '@layer': {
        [layers.components.l1]: {
          containerName: queryBuilderContainers.rule,
          display: 'contents',
        },
      },
    }),
    rule: style({
      '@layer': {
        [layers.components.l1]: {
          display: 'grid',
          alignItems: 'center',
          gridTemplateColumns: 'subgrid',
          gridColumnStart: 1,
          gridColumnEnd: -1,
          padding: `${fallbackVar(queryBuilderSpaceVars.rule.y, '0')} ${fallbackVar(queryBuilderSpaceVars.rule.x, '0')}`,
          border: `1px solid ${fallbackVar(queryBuilderColorVars.rule.border, 'transparent')}`,
          borderRadius: radiusVars.sm,
          background: queryBuilderColorVars.rule.background,
          color: queryBuilderColorVars.rule.color,
          marginLeft: fallbackVar(
            queryBuilderSpaceVars.rule.lineIndent,
            '10px',
          ),
          position: 'relative',
          '::before': {
            content: '',
            position: 'absolute',
            top: `calc(${queryBuilderSpaceVars.body.gap} * -1)`,
            left: `calc(${fallbackVar(queryBuilderSpaceVars.rule.lineIndent, '10px')} * -1)`,
            width: fallbackVar(queryBuilderSpaceVars.rule.lineIndent, '10px'),
            borderRadius: radiusVars.sm,
            height: `calc(50% + ${queryBuilderSpaceVars.body.gap})`,
            borderWidth: '0 0 1px 1px',
            borderColor: fallbackVar(
              queryBuilderColorVars.rule.lineColor,
              'rgb(89,89,89)',
            ),
            borderStyle: 'solid',
          },
          '::after': {
            content: '',
            position: 'absolute',
            width: 1,
            left: `calc(${fallbackVar(queryBuilderSpaceVars.rule.lineIndent, '10px')} * -1)`,
            borderRadius: radiusVars.sm,
            top: '50%',
            height: `calc(50% + ${queryBuilderSpaceVars.body.gap})`,
            borderWidth: '0 0 1px 1px',
            borderColor: fallbackVar(
              queryBuilderColorVars.rule.lineColor,
              'rgb(89,89,89)',
            ),
            borderStyle: 'solid',
          },
          selectors: {
            ':last-child > &::before': {
              borderBottomLeftRadius: radiusVars.md,
            },
            ':last-child > &::after': {
              display: 'none',
            },
          },
          '@container': containerQueries(queryBuilderStateVars, {
            query: {
              showRuleLines: false,
            },
            marginLeft: 0,
            '::before': {
              display: 'none',
            },
            '::after': {
              display: 'none',
            },
          }),
        },
      },
    }),
    core: style({
      '@layer': {
        [layers.components.l1]: {
          display: 'flex',
          flexDirection: 'column',
          gap: fallbackVar(
            queryBuilderSpaceVars.core.gap,
            queryBuilderSpaceVars.body.gap,
          ),
        },
      },
    }),
    field: style({
      '@layer': {
        [layers.components.l1]: {
          width: fallbackVar(queryBuilderSpaceVars.field.width, '100%'),
          minWidth: fallbackVar(
            queryBuilderSpaceVars.field.minWidth,
            queryBuilderSpaceVars.field.width,
          ),
          maxWidth: fallbackVar(
            queryBuilderSpaceVars.field.maxWidth,
            queryBuilderSpaceVars.field.width,
          ),
        },
      },
    }),
    operator: style({
      '@layer': {
        [layers.components.l1]: {
          width: fallbackVar(queryBuilderSpaceVars.operator.width, '100%'),
          minWidth: fallbackVar(
            queryBuilderSpaceVars.operator.minWidth,
            queryBuilderSpaceVars.operator.width,
          ),
          maxWidth: fallbackVar(
            queryBuilderSpaceVars.operator.maxWidth,
            queryBuilderSpaceVars.operator.width,
          ),
        },
      },
    }),
    values: style({
      '@layer': {
        [layers.components.l1]: {
          display: 'flex',
          gap: fallbackVar(
            queryBuilderSpaceVars.values.gap,
            queryBuilderSpaceVars.body.gap,
          ),
          '@container': containerQueries<QueryBuilderRuleState>(
            queryBuilderRuleStateVars,
            {
              query: { orientation: 'vertical' },
              flexDirection: 'row',
            },
            {
              query: { orientation: 'horizontal' },
              flexDirection: 'column',
              width: fallbackVar(queryBuilderSpaceVars.values.width, '100%'),
              minWidth: fallbackVar(
                queryBuilderSpaceVars.values.minWidth,
                queryBuilderSpaceVars.values.width,
              ),
              maxWidth: fallbackVar(
                queryBuilderSpaceVars.values.maxWidth,
                queryBuilderSpaceVars.values.width,
              ),
            },
          ),
        },
      },
    }),
    source: style({
      '@layer': {
        [layers.components.l1]: {
          width: fallbackVar(queryBuilderSpaceVars.source.width, '100%'),
          minWidth: fallbackVar(
            queryBuilderSpaceVars.source.minWidth,
            queryBuilderSpaceVars.source.width,
          ),
          maxWidth: fallbackVar(
            queryBuilderSpaceVars.source.maxWidth,
            queryBuilderSpaceVars.source.width,
          ),
        },
      },
    }),
    value: style({
      '@layer': {
        [layers.components.l1]: {
          width: '100%',
        },
      },
    }),
    error: style({
      '@layer': {
        [layers.components.l1]: {
          color: queryBuilderColorVars.error.color,
          '@container': containerQueries<QueryBuilderGroupState>(
            queryBuilderGroupStateVars,
            {
              query: { before: 2 },
              gridColumnStart: 3,
            },
            {
              query: { before: 1 },
              gridColumnStart: 2,
            },
            {
              query: { before: 0 },
              gridColumnStart: 1,
            },
            {
              query: { after: 2 },
              gridColumnEnd: -4,
            },
            {
              query: { after: 1 },
              gridColumnEnd: -3,
            },
            {
              query: { after: 0 },
              gridColumnEnd: -2,
            },
          ),
        },
      },
    }),
  },
};
