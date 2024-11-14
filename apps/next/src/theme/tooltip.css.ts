import { style } from '@vanilla-extract/css';
import {
  type ThemeContext,
  type TooltipState,
  applyThemeVars,
  assignPartialVars,
  sizeVars,
  tooltipSpaceVars,
  tooltipStateVars,
} from '@accelint/design-system/vanilla';

export const Tooltip: ThemeContext['Tooltip'] = {
  tooltip: {
    tooltip: style(
      applyThemeVars<TooltipState>(tooltipStateVars, [
        {
          vars: assignPartialVars(tooltipSpaceVars, {
            x: sizeVars.v03,
            y: sizeVars.v02,
          }),
        },
      ]),
    ),
  },
};
