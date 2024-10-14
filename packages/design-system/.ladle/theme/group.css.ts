import { style } from '@vanilla-extract/css';
import {
  type GroupState,
  type ThemeContext,
  applyThemeVars,
  assignPartialVars,
  groupSpaceVars,
  groupStateVars,
  sizeVars,
} from '../../src';

export const Group: ThemeContext['Group'] = {
  group: style(
    applyThemeVars<GroupState>(groupStateVars, [
      {
        vars: assignPartialVars(groupSpaceVars, {
          gap: sizeVars.v04,
        }),
      },
    ])
  ),
};
