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

import { style } from '@vanilla-extract/css';
import {
  applyThemeVars,
  assignPartialVars,
  genericColorVars,
  semanticColorVars,
  sizeVars,
  type TabListState,
  type TabState,
  type ThemeContext,
  tabColorVars,
  tabListStateVars,
  tabSpaceVars,
  tabStateVars,
} from '../../src';

export const Tabs: ThemeContext['Tabs'] = {
  list: {
    list: style(
      applyThemeVars<TabListState>(tabListStateVars, [
        {
          query: { orientation: 'horizontal', size: 'sm' },
          vars: assignPartialVars(tabSpaceVars, {
            list: {
              x: sizeVars.v03,
              y: sizeVars.v03,
            },
          }),
        },
        {
          query: { orientation: 'horizontal', size: 'lg' },
          vars: assignPartialVars(tabSpaceVars, {
            list: {
              x: sizeVars.v04,
              y: sizeVars.v04,
            },
          }),
        },
        {
          query: { orientation: 'vertical', size: 'sm' },
          vars: assignPartialVars(tabSpaceVars, {
            list: {
              x: sizeVars.v03,
              y: sizeVars.v03,
            },
          }),
        },
        {
          query: { orientation: 'vertical', size: 'lg' },
          vars: assignPartialVars(tabSpaceVars, {
            list: {
              x: sizeVars.v04,
              y: sizeVars.v04,
            },
          }),
        },
        {
          query: {
            groups: [
              { orientation: 'horizontal', size: 'sm', variant: 'fill' },
              { orientation: 'vertical', size: 'sm' },
            ],
          },
          vars: assignPartialVars(tabSpaceVars, {
            list: {
              gap: sizeVars.v03,
            },
          }),
        },
        {
          query: {
            groups: [
              { orientation: 'horizontal', size: 'lg', variant: 'fill' },
              { orientation: 'vertical', size: 'lg' },
            ],
          },
          vars: assignPartialVars(tabSpaceVars, {
            list: {
              gap: sizeVars.v04,
            },
          }),
        },
      ]),
    ),
  },
  tab: {
    tab: style(
      applyThemeVars<{ list: TabListState; tab: TabState }>(
        { list: tabListStateVars, tab: tabStateVars },
        [
          {
            vars: assignPartialVars(tabColorVars, {
              color: semanticColorVars.foreground.interactive.primary.subtle,
            }),
          },
          {
            query: { list: { size: 'sm' } },
            vars: assignPartialVars(tabSpaceVars, {
              tab: {
                x: sizeVars.v02,
                y: sizeVars.v02,
              },
            }),
          },
          {
            query: { list: { size: 'lg' } },
            vars: assignPartialVars(tabSpaceVars, {
              tab: {
                x: sizeVars.v03,
                y: sizeVars.v03,
              },
            }),
          },
          {
            query: {
              operator: 'or',
              tab: { isHovered: true, isPressed: true },
            },
            vars: assignPartialVars(tabColorVars, {
              background: genericColorVars.neutral.v07,
              color: semanticColorVars.foreground.interactive.primary.bold,
            }),
          },
          {
            query: { list: { orientation: 'horizontal', variant: 'border' } },
            vars: assignPartialVars(tabColorVars, {
              border: semanticColorVars.border.interactive.default,
            }),
          },
          {
            query: {
              operator: 'and',
              groups: [
                {
                  list: { orientation: 'horizontal', variant: 'border' },
                },
                {
                  operator: 'or',
                  tab: { isHovered: true, isPressed: true },
                },
              ],
            },
            vars: assignPartialVars(tabColorVars, {
              border: semanticColorVars.border.interactive.hover,
            }),
          },
          {
            query: {
              list: { variant: 'border' },
              tab: { isSelected: true },
            },
            vars: assignPartialVars(tabColorVars, {
              border: semanticColorVars.border.interactive.highlight,
            }),
          },
          {
            query: {
              list: { orientation: 'horizontal', variant: 'border' },
              tab: { isDisabled: true },
            },
            vars: assignPartialVars(tabColorVars, {
              border: semanticColorVars.border.interactive.disabled,
            }),
          },
          {
            query: {
              list: { variant: 'border' },
              tab: { isDisabled: true },
            },
            vars: assignPartialVars(tabColorVars, {
              color: semanticColorVars.foreground.interactive.disabled,
            }),
          },
          {
            query: {
              list: { variant: 'fill' },
              tab: { isSelected: true },
            },
            vars: assignPartialVars(tabColorVars, {
              background: genericColorVars.highlight.primary.v5,
              color: semanticColorVars.foreground.interactive.highlight,
            }),
          },
        ],
      ),
    ),
  },
};
