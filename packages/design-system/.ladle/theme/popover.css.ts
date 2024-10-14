import { style } from '@vanilla-extract/css';
import {
  type PopoverState,
  type ThemeContext,
  applyThemeVars,
  assignPartialVars,
  genericColorVars,
  popoverColorVars,
  popoverSpaceVars,
  popoverStateVars,
  sizeVars,
} from '../../src';

export const Popover: ThemeContext['Popover'] = {
  popover: {
    popover: style(
      applyThemeVars<PopoverState>(popoverStateVars, [
        {
          vars: assignPartialVars(popoverSpaceVars, {
            width: '280px',
            x: sizeVars.v06,
            y: sizeVars.v06,
            gap: {
              default: sizeVars.v03,
              header: {
                after: sizeVars.v03,
              },
              footer: {
                before: sizeVars.v06,
              },
            },
          }),
        },
      ])
    ),
  },
  content: style(
    applyThemeVars<PopoverState>(popoverStateVars, [
      {
        query: { hasHeader: true },
        vars: assignPartialVars(popoverColorVars, {
          content: { color: genericColorVars.neutral.v03 },
        }),
      },
    ])
  ),
};
