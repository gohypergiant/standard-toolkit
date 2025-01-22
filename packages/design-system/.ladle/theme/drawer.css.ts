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
  type DrawerState,
  type TabListState,
  type TabState,
  type ThemeContext,
  applyThemeVars,
  assignPartialVars,
  drawerSpaceVars,
  drawerStateVars,
  layers,
  semanticColorVars,
  sizeVars,
  tabColorVars,
  tabListStateVars,
  tabStateVars,
} from '../../src';

export const Drawer: ThemeContext['Drawer'] = {
  tabs: {
    tabs: style(
      applyThemeVars<DrawerState>(drawerStateVars, [
        {
          vars: assignPartialVars(drawerSpaceVars, {
            drawer: {
              width: '400px',
              gap: sizeVars.v05,
              x: sizeVars.v06,
              y: sizeVars.v05,
            },
          }),
        },
      ]),
    ),
    list: {
      list: style(
        applyThemeVars<TabListState>(tabListStateVars, [
          {
            vars: assignPartialVars(drawerSpaceVars, {
              list: {
                top: '60px',
              },
            }),
          },
          {
            query: { count: 1 },
            vars: assignPartialVars(drawerSpaceVars, {
              list: {
                top: '50%',
                translateY: '-50%',
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
              query: { list: { count: 1 }, tab: { isSelected: true } },
              vars: assignPartialVars(tabColorVars, {
                background: 'none',
                color: semanticColorVars.foreground.interactive.primary.subtle,
              }),
            },
            {
              query: {
                list: { count: 1 },
                tab: { isSelected: true, isHovered: true },
              },
              vars: assignPartialVars(tabColorVars, {
                background: 'none',
                color: semanticColorVars.foreground.interactive.primary.bold,
              }),
            },
          ],
          layers.variables.l2,
        ),
      ),
    },
  },
};
