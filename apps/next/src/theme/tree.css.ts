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
  applyThemeVars,
  assignPartialVars,
  buttonColorVars,
  genericColorVars,
  layers,
  semanticColorVars,
  sizeVars,
  type ThemeContext,
  type TreeGroupState,
  type TreeIndicatorState,
  type TreeItemState,
  type TreeState,
  treeColorVars,
  treeGroupStateVars,
  treeIndicatorStateVars,
  treeItemStateVars,
  treeSpaceVars,
  treeStateVars,
} from '@accelint/design-system/vanilla';
import { style } from '@vanilla-extract/css';

export const Tree: ThemeContext['Tree'] = {
  empty: style(
    applyThemeVars<TreeGroupState>(treeGroupStateVars, [
      {
        query: { isDropTarget: false },
        vars: assignPartialVars(treeColorVars, {
          indicator: {
            border: genericColorVars.neutral.v07,
            color: genericColorVars.neutral.v03,
          },
        }),
      },
      {
        query: { isDropTarget: true },
        vars: assignPartialVars(treeColorVars, {
          indicator: {
            background: genericColorVars.highlight.primary.v5,
            border: genericColorVars.highlight.primary.v3,
          },
        }),
      },
    ]),
  ),
  indicator: {
    indicator: style(
      applyThemeVars<TreeIndicatorState>(treeIndicatorStateVars, [
        {
          query: { isDropTarget: true },
          vars: assignPartialVars(treeColorVars, {
            indicator: {
              border: genericColorVars.highlight.primary.v3,
            },
          }),
        },
      ]),
    ),
  },
  item: {
    item: style([
      applyThemeVars<TreeState>(treeStateVars, [
        {
          vars: assignPartialVars(treeSpaceVars, {
            bar: {
              x: sizeVars.v03,
              y: sizeVars.v04,
            },
          }),
        },
        {
          query: { size: 'sm' },
          vars: assignPartialVars(treeSpaceVars, {
            description: {
              x: sizeVars.v02,
              y: sizeVars.none,
            },
            empty: {
              x: sizeVars.v03,
              y: sizeVars.v02,
            },
          }),
        },
        {
          query: { size: 'lg' },
          vars: assignPartialVars(treeSpaceVars, {
            description: {
              x: sizeVars.v03,
              y: sizeVars.none,
            },
            empty: {
              x: sizeVars.v04,
              y: sizeVars.v03,
            },
          }),
        },
      ]),
      applyThemeVars<TreeItemState>(treeItemStateVars, [
        {
          query: { isHovered: false },
          vars: assignPartialVars(treeColorVars, {
            bar: {
              background: 'transparent',
            },
          }),
        },
        {
          query: { isHovered: true },
          vars: assignPartialVars(treeColorVars, {
            bar: {
              background: genericColorVars.neutral.v07,
            },
          }),
        },
        {
          query: { isVisible: false },
          vars: assignPartialVars(treeColorVars, {
            bar: {
              color: genericColorVars.neutral.v03,
            },
          }),
        },
        {
          query: { isVisible: true },
          vars: assignPartialVars(treeColorVars, {
            bar: {
              color: semanticColorVars.foreground.interactive.primary.bold,
            },
          }),
        },
      ]),
    ]),
    expansion: {
      button: style(
        applyThemeVars<TreeItemState>(
          treeItemStateVars,
          [
            {
              vars: assignPartialVars(buttonColorVars, {
                color: 'currentcolor',
              }),
            },
          ],
          layers.variables.l2,
        ),
      ),
    },
    visibility: {
      button: style(
        applyThemeVars<TreeItemState>(
          treeItemStateVars,
          [
            {
              vars: assignPartialVars(buttonColorVars, {
                color: 'currentcolor',
              }),
            },
          ],
          layers.variables.l2,
        ),
      ),
    },
    drag: {
      button: style(
        applyThemeVars<TreeItemState>(
          treeItemStateVars,
          [
            {
              vars: assignPartialVars(buttonColorVars, {
                color: 'currentcolor',
              }),
            },
          ],
          layers.variables.l2,
        ),
      ),
    },
  },
};
