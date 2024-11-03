import { style } from '@vanilla-extract/css';
import {
  type ThemeContext,
  type TimeFieldState,
  applyThemeVars,
  assignPartialVars,
  sizeVars,
  timeFieldSpaceVars,
  timeFieldStateVars,
} from '../../src';

export const TimeField: ThemeContext['TimeField'] = {
  input: style(
    applyThemeVars<TimeFieldState>(timeFieldStateVars, [
      {
        vars: assignPartialVars(timeFieldSpaceVars, {
          gap: sizeVars.v03,
        }),
      },
    ]),
  ),
};
