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
  tabListStateVars,
  tabColorVars,
  tabStateVars,
  semanticColorVars,
  sizeVars,
} from '@accelint/design-system/vanilla';

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
