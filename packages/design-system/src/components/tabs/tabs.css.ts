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
import { label, layers, radiusVars } from '../../styles';
import { containerQueries } from '../../utils';
import type {
  TabListState,
  TabPanelState,
  TabPanelsState,
  TabState,
  TabsClassNames,
} from './types';

export const tabsContainers = {
  list: createContainer(),
  tab: createContainer(),
  panels: createContainer(),
  panel: createContainer(),
};

export const tabColorVars = createThemeContract({
  background: '',
  border: '',
  color: '',
});

export const tabSpaceVars = createThemeContract({
  list: {
    gap: '',
    x: '',
    y: '',
  },
  tab: {
    x: '',
    y: '',
  },
});

export const tabListStateVars = createThemeContract({
  align: '',
  anchor: '',
  count: '',
  orientation: '',
  size: '',
  variant: '',
});

export const tabStateVars = createThemeContract({
  isHovered: '',
  isPressed: '',
  isSelected: '',
  isFocused: '',
  isFocusVisible: '',
  isDisabled: '',
});

export const tabPanelsStateVars = createThemeContract({
  shouldForceMount: '',
});

export const tabPanelStateVars = createThemeContract({
  shouldForceMount: '',
  isFocused: '',
  isFocusVisible: '',
  isInert: '',
});

export const tabsClassNames: TabsClassNames = {
  tabs: style({
    '@layer': {
      [layers.components.l1]: {
        display: 'contents',
      },
    },
  }),
  list: {
    container: style({
      '@layer': {
        [layers.components.l1]: {
          containerName: tabsContainers.list,
          display: 'contents',
        },
      },
    }),
    list: style({
      '@layer': {
        [layers.components.l1]: {
          display: 'flex',
          gap: tabSpaceVars.list.gap,
          padding: `${fallbackVar(tabSpaceVars.list.y, '0')} ${fallbackVar(tabSpaceVars.list.x, '0')}`,
          '@container': containerQueries<TabListState>(
            tabListStateVars,
            {
              query: { orientation: 'horizontal' },
              flexDirection: 'row',
            },
            {
              query: { orientation: 'vertical' },
              flexDirection: 'column',
            },
            {
              query: {
                orientation: 'horizontal',
                anchor: 'start',
              },
              borderBottomLeftRadius: radiusVars.md,
              borderBottomRightRadius: radiusVars.md,
            },
            {
              query: {
                orientation: 'horizontal',
                anchor: 'end',
              },
              borderTopLeftRadius: radiusVars.md,
              borderTopRightRadius: radiusVars.md,
            },
            {
              query: {
                orientation: 'vertical',
                anchor: 'start',
              },
              borderTopRightRadius: radiusVars.md,
              borderBottomRightRadius: radiusVars.md,
            },
            {
              query: {
                orientation: 'vertical',
                anchor: 'end',
              },
              borderTopLeftRadius: radiusVars.md,
              borderBottomLeftRadius: radiusVars.md,
            },
            {
              query: {
                variant: 'border',
                orientation: 'horizontal',
                anchor: 'start',
              },
              paddingTop: 0,
            },
            {
              query: {
                variant: 'border',
                orientation: 'horizontal',
                anchor: 'end',
              },
              paddingBottom: 0,
            },
            {
              query: {
                variant: 'border',
                orientation: 'vertical',
                anchor: 'start',
              },
              paddingLeft: 0,
            },
            {
              query: {
                variant: 'border',
                orientation: 'vertical',
                anchor: 'end',
              },
              paddingRight: 0,
            },
          ),
        },
      },
    }),
  },
  tab: {
    container: style({
      '@layer': {
        [layers.components.l1]: {
          containerName: tabsContainers.tab,
          display: 'contents',
        },
      },
    }),
    tab: style([
      label,
      {
        '@layer': {
          [layers.components.l1]: {
            display: 'flex',
            position: 'relative',
            padding: `${fallbackVar(tabSpaceVars.tab.y, '0')} ${fallbackVar(tabSpaceVars.tab.x, '0')}`,
            background: tabColorVars.background,
            color: tabColorVars.color,
            cursor: 'pointer',
            '@container': {
              ...containerQueries<TabListState>(
                tabListStateVars,
                {
                  query: { align: 'start' },
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                },
                {
                  query: { align: 'center' },
                  justifyContent: 'center',
                  textAlign: 'center',
                },
                {
                  query: { align: 'end' },
                  justifyContent: 'flex-end',
                  textAlign: 'right',
                },
                {
                  query: {
                    variant: 'border',
                    orientation: 'horizontal',
                    anchor: 'start',
                  },
                  borderTop: `1px solid ${fallbackVar(tabColorVars.border, 'transparent')}`,
                },
                {
                  query: {
                    variant: 'border',
                    orientation: 'horizontal',
                    anchor: 'end',
                  },
                  borderBottom: `1px solid ${fallbackVar(tabColorVars.border, 'transparent')}`,
                },
                {
                  query: {
                    variant: 'border',
                    orientation: 'vertical',
                    anchor: 'start',
                  },
                  borderLeft: `1px solid ${fallbackVar(tabColorVars.border, 'transparent')}`,
                },
                {
                  query: {
                    variant: 'border',
                    orientation: 'vertical',
                    anchor: 'end',
                  },
                  borderRight: `1px solid ${fallbackVar(tabColorVars.border, 'transparent')}`,
                },
                {
                  query: { variant: 'fill' },
                  borderRadius: radiusVars.md,
                },
              ),
              ...containerQueries<TabState>(tabStateVars, {
                query: { isDisabled: true },
                cursor: 'not-allowed',
              }),
            },
          },
        },
      },
    ]),
  },
  panels: {
    container: style({
      '@layer': {
        [layers.components.l1]: {
          containerName: tabsContainers.panels,
          display: 'contents',
        },
      },
    }),
    panels: style({
      '@layer': {
        [layers.components.l1]: {
          '@container': containerQueries<TabPanelsState>(tabPanelsStateVars, {
            query: { shouldForceMount: true },
            display: 'grid',
            gridTemplateAreas: '"panels"',
          }),
        },
      },
    }),
  },
  panel: {
    container: style({
      '@layer': {
        [layers.components.l1]: {
          containerName: tabsContainers.panel,
          display: 'contents',
        },
      },
    }),
    panel: style({
      '@layer': {
        [layers.components.l1]: {
          '@container': containerQueries<{
            panels: TabPanelsState;
            panel: TabPanelState;
          }>(
            { panels: tabPanelsStateVars, panel: tabPanelStateVars },
            {
              query: { panels: { shouldForceMount: true } },
              gridArea: 'panels',
            },
            {
              query: {
                panels: { shouldForceMount: true },
                panel: { isInert: true },
              },
              pointerEvents: 'none',
              visibility: 'hidden',
            },
          ),
        },
      },
    }),
  },
};
