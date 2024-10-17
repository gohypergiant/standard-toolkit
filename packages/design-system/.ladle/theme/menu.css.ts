import { style } from '@vanilla-extract/css';
import {
  applyThemeVars,
  assignPartialVars,
  genericColorVars,
  menuColorVars,
  menuItemStateVars,
  menuSpaceVars,
  semanticColorVars,
  sizeVars,
  type MenuItemState,
  type ThemeContext,
} from '../../src';

export const Menu: ThemeContext['Menu'] = {
  list: {
    list: style(
      applyThemeVars<MenuItemState>(menuItemStateVars, [
        {
          vars: assignPartialVars(
            { color: menuColorVars, space: menuSpaceVars },
            {
              color: {
                list: {
                  background: semanticColorVars.background.surface.overlay,
                  border: semanticColorVars.border.static.exterior,
                },
                header: {
                  color: genericColorVars.neutral.v03,
                },
                separator: genericColorVars.neutral.v03,
              },
              space: {
                header: {
                  x: `calc(${sizeVars.v03} + ${sizeVars.v03})`,
                  y: sizeVars.v03,
                },
              },
            },
          ),
        },
      ]),
    ),
  },
  item: {
    item: style(
      applyThemeVars<MenuItemState>(menuItemStateVars, [
        {
          vars: assignPartialVars(
            { color: menuColorVars, space: menuSpaceVars },
            {
              color: {
                item: {
                  color: semanticColorVars.foreground.interactive.primary.bold,
                },
                description: genericColorVars.neutral.v03,
              },
              space: {
                item: {
                  x: sizeVars.v03,
                  y: sizeVars.v04,
                  gap: `${sizeVars.v02} ${sizeVars.v03}`,
                },
              },
            },
          ),
        },
        {
          query: { size: 'sm' },
          vars: assignPartialVars(menuSpaceVars, {
            item: {
              y: sizeVars.v03,
            },
          }),
        },
        {
          query: { size: 'lg' },
          vars: assignPartialVars(menuSpaceVars, {
            item: {
              y: sizeVars.v04,
            },
          }),
        },
        {
          query: {
            operator: 'or',
            isPressed: true,
            isHovered: true,
            isSelected: true,
          },
          vars: assignPartialVars(menuColorVars, {
            item: {
              background: semanticColorVars.background.highlight.bold,
              color: genericColorVars.neutral.v09,
            },
            description: genericColorVars.neutral.v09,
          }),
        },
        {
          query: {
            isDisabled: true,
          },
          vars: assignPartialVars(menuColorVars, {
            item: { color: genericColorVars.neutral.v05 },
            description: 'currentcolor',
          }),
        },
      ]),
    ),
  },
};
