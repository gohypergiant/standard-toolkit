import { style } from '@vanilla-extract/css';
import {
  type ThemeContext,
  applyThemeVars,
  assignPartialVars,
  dateFieldColorVars,
  dateFieldSpaceVars,
  dateFieldStateVars,
  genericColorVars,
  semanticColorVars,
  sizeVars,
} from '../../src';
import type { DateFieldState } from '../../src/components/date-field/types';

export const DateField: ThemeContext['DateField'] = {
  input: style(
    applyThemeVars<DateFieldState>(dateFieldStateVars, [
      {
        vars: assignPartialVars(dateFieldSpaceVars, {
          gap: sizeVars.v03,
        }),
      },
    ]),
  ),
  group: style(
    applyThemeVars<DateFieldState>(dateFieldStateVars, [
      {
        vars: assignPartialVars(dateFieldColorVars, {
          border: semanticColorVars.border.interactive.default,
        }),
      },
    ]),
  ),
  description: style(
    applyThemeVars<DateFieldState>(dateFieldStateVars, [
      {
        vars: assignPartialVars(dateFieldColorVars, {
          description: {
            color: genericColorVars.neutral.v03,
          },
        }),
      },
      {
        query: { isDisabled: true },
        vars: assignPartialVars(dateFieldColorVars, {
          description: {
            color: semanticColorVars.foreground.interactive.disabled,
          },
        }),
      },
    ]),
  ),
  error: style(
    applyThemeVars<DateFieldState>(dateFieldStateVars, [
      {
        vars: assignPartialVars(dateFieldColorVars, {
          error: {
            color: semanticColorVars.border.serious,
          },
        }),
      },
    ]),
  ),
};
