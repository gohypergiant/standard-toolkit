import { style } from '@vanilla-extract/css';
import {
  type ThemeContext,
  type TreeGroupState,
  type TreeIndicatorState,
  type TreeItemState,
  type TreeState,
  applyThemeVars,
  assignPartialVars,
  buttonColorVars,
  genericColorVars,
  layers,
  semanticColorVars,
  sizeVars,
  treeColorVars,
  treeGroupStateVars,
  treeIndicatorStateVars,
  treeItemStateVars,
  treeSpaceVars,
  treeStateVars,
} from '../../src';

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
    ])
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
      ])
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
          layers.variables.l2
        )
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
          layers.variables.l2
        )
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
          layers.variables.l2
        )
      ),
    },
  },
};
