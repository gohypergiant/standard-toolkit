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
import { layers } from '../../styles/layers.css';
import { radiusVars } from '../../styles/theme.css';
import { containerQueries } from '../../utils/css';
import type { TreeClassNames, TreeItemState, TreeState } from './types';

export const treeContainers = {
  tree: createContainer(),
  group: createContainer(),
  item: createContainer(),
};

export const treeColorVars = createThemeContract({
  bar: {
    background: '',
    border: '',
    color: '',
  },
  indicator: {
    background: '',
    border: '',
    color: '',
  },
});

export const treeSpaceVars = createThemeContract({
  bar: {
    x: '',
    y: '',
  },
  description: {
    x: '',
    y: '',
  },
  empty: {
    x: '',
    y: '',
  },
});

export const treeStateVars = createThemeContract({
  allowsDragging: '',
  allowsExpansion: '',
  allowsVisibility: '',
  showTreeLines: '',
  size: '',
});

export const treeGroupStateVars = createThemeContract({
  count: '',
  layout: '',
  isDropTarget: '',
  isEmpty: '',
  isFocused: '',
  isFocusVisible: '',
});

export const treeIndicatorStateVars = createThemeContract({
  dropPosition: '',
  isDropTarget: '',
});

export const treeItemStateVars = createThemeContract({
  allowsDragging: '',
  count: '',
  index: '',
  selectionMode: '',
  selectionBehavior: '',
  isDisabled: '',
  isDragging: '',
  isDropTarget: '',
  isExpanded: '',
  isFirstChild: '',
  isFocused: '',
  isFocusVisible: '',
  isGroup: '',
  isHovered: '',
  isLastChild: '',
  isPressed: '',
  isReadOnly: '',
  isSelected: '',
  isViewable: '',
  isVisible: '',
});

export const treeClassNames: TreeClassNames = {
  tree: {
    container: style({
      '@layer': {
        [layers.components.l1]: {
          containerName: treeContainers.tree,
          display: 'contents',
        },
      },
    }),
  },
  empty: style({
    '@layer': {
      [layers.components.l1]: {
        padding: `${fallbackVar(treeSpaceVars.empty.y, '0')} ${fallbackVar(treeSpaceVars.empty.x, '0')}`,
        border: `1px dashed ${fallbackVar(treeColorVars.indicator.border, 'transparent')}`,
        borderRadius: radiusVars.sm,
        background: treeColorVars.indicator.background,
        color: treeColorVars.indicator.color,
        textAlign: 'center',
      },
    },
  }),
  group: style({
    '@layer': {
      [layers.components.l1]: {
        containerName: treeContainers.group,
        gridArea: 'group',
      },
    },
  }),
  indicator: {
    indicator: style({
      '@layer': {
        [layers.components.l1]: {
          outline: `1px solid ${fallbackVar(treeColorVars.indicator.border, 'transparent')}`,
        },
      },
    }),
  },
  item: {
    container: style({
      '@layer': {
        [layers.components.l1]: {
          containerName: treeContainers.item,
        },
      },
    }),
    item: style({
      '@layer': {
        [layers.components.l1]: {
          display: 'grid',
          gridTemplateAreas: '"lines bar" "lines group"',
          gridTemplateColumns: 'auto 1fr',
          alignItems: 'center',
        },
      },
    }),
    bar: style({
      '@layer': {
        [layers.components.l1]: {
          display: 'grid',
          gridArea: 'bar',
          gridTemplateAreas:
            '"visibility expansion description space actions selection drag"',
          gridTemplateColumns: 'auto auto auto 1fr auto auto auto',
          alignItems: 'center',
          gap: treeSpaceVars.bar.x,
          padding: `${fallbackVar(treeSpaceVars.bar.y, '0')} ${fallbackVar(treeSpaceVars.bar.x, '0')}`,
          border: `1px solid ${fallbackVar(treeColorVars.bar.border, 'transparent')}`,
          borderRadius: radiusVars.md,
          background: treeColorVars.bar.background,
          color: treeColorVars.bar.color,
        },
      },
    }),
    lines: {
      container: style({
        '@layer': {
          [layers.components.l2]: {
            height: '100%',
            position: 'relative',
            display: 'flex',
            gridArea: 'lines',
            alignItems: 'flex-start',
            marginLeft: treeSpaceVars.bar.x,
            pointerEvents: 'none',
            '::before': {
              content: '',
              width: 1,
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: '50%',
              backgroundImage:
                'repeating-linear-gradient(to bottom, white 0%, white 50%, transparent 50%, transparent 100%)',
              backgroundPosition: 'left -1px',
              backgroundRepeat: 'repeat-y',
              backgroundSize: '1px 4px',
            },
            '@container': containerQueries<{
              tree: TreeState;
              item: TreeItemState;
            }>(
              { tree: treeStateVars, item: treeItemStateVars },
              {
                query: {
                  operator: 'or',
                  tree: { showTreeLines: false },
                  item: { isLastChild: true },
                },
                '::before': {
                  display: 'none',
                },
              },
            ),
          },
        },
      }),
      button: style({
        '@layer': {
          [layers.components.l2]: {
            position: 'relative',
            background: 'none',
            border: '1px solid transparent',
            marginTop: treeSpaceVars.bar.y,
            '::after': {
              content: '',
              width: '50%',
              height: 1,
              position: 'absolute',
              top: '50%',
              right: 0,
              backgroundImage:
                'repeating-linear-gradient(to right, white 0%, white 50%, transparent 50%, transparent 100%)',
              backgroundPosition: '-1px top',
              backgroundRepeat: 'repeat-x',
              backgroundSize: '4px 1px',
            },
            '@container': containerQueries<{
              tree: TreeState;
              item: TreeItemState;
            }>(
              { tree: treeStateVars, item: treeItemStateVars },
              {
                query: { item: { isLastChild: true } },
                '::before': {
                  content: '',
                  width: 1,
                  position: 'absolute',
                  top: `calc(${treeSpaceVars.bar.y} * -1)`,
                  bottom: '50%',
                  left: '50%',
                  backgroundImage:
                    'repeating-linear-gradient(to bottom, white 0%, white 50%, transparent 50%, transparent 100%)',
                  backgroundPosition: 'left -1px',
                  backgroundRepeat: 'repeat-y',
                  backgroundSize: '1px 4px',
                },
              },
              {
                query: {
                  operator: 'or',
                  tree: { showTreeLines: false },
                },
                '::before': {
                  display: 'none',
                },
                '::after': {
                  display: 'none',
                },
              },
            ),
          },
        },
      }),
    },
    visibility: {
      container: style({
        '@layer': {
          [layers.components.l2]: {
            gridArea: 'visibility',
            '@container': containerQueries<TreeState>(treeStateVars, {
              query: { allowsVisibility: false },
              display: 'none',
            }),
          },
        },
      }),
    },
    expansion: {
      container: style({
        '@layer': {
          [layers.components.l2]: {
            gridArea: 'expansion',
            '@container': containerQueries<{
              tree: TreeState;
              item: TreeItemState;
            }>(
              {
                tree: treeStateVars,
                item: treeItemStateVars,
              },
              {
                query: {
                  operator: 'or',
                  tree: { allowsExpansion: false },
                  item: { isGroup: false },
                },
                display: 'none',
              },
            ),
          },
        },
      }),
    },
    description: style({
      '@layer': {
        [layers.components.l1]: {
          gridArea: 'description',
          padding: `${fallbackVar(treeSpaceVars.description.y, '0')} ${fallbackVar(treeSpaceVars.description.x, '0')}`,
          '@container': containerQueries<{
            tree: TreeState;
            item: TreeItemState;
          }>(
            { tree: treeStateVars, item: treeItemStateVars },
            {
              query: {
                tree: { allowsExpansion: true },
                item: { isDisabled: false, isGroup: true },
              },
              cursor: 'pointer',
            },
          ),
        },
      },
    }),
    actions: {
      container: style({
        '@layer': {
          [layers.components.l2]: {
            gridArea: 'actions',
          },
        },
      }),
    },
    selection: {
      checkbox: {
        container: style({
          '@layer': {
            [layers.components.l2]: {
              gridArea: 'selection',
              '@container': containerQueries<TreeItemState>(treeItemStateVars, {
                query: { selectionMode: 'none' },
                display: 'none',
              }),
            },
          },
        }),
      },
    },
    drag: {
      container: style({
        '@layer': {
          [layers.components.l2]: {
            gridArea: 'drag',
            '@container': containerQueries<TreeState>(treeStateVars, {
              query: { allowsDragging: false },
              display: 'none',
            }),
          },
        },
      }),
    },
  },
};
