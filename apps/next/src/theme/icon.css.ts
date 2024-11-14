import { style } from '@vanilla-extract/css';
import {
  type IconState,
  type ThemeContext,
  applyThemeVars,
  assignPartialVars,
  iconColorVars,
  iconSpaceVars,
  iconStateVars,
} from '@accelint/design-system/vanilla';

export const Icon: ThemeContext['Icon'] = {
  icon: style(
    applyThemeVars<IconState>(iconStateVars, [
      {
        vars: assignPartialVars(iconColorVars, {
          fill: 'currentcolor',
        }),
      },
      {
        query: {
          size: ['xs', 'sm'],
        },
        vars: assignPartialVars(iconSpaceVars, {
          width: '16px',
        }),
      },
      {
        query: {
          size: 'md',
        },
        vars: assignPartialVars(iconSpaceVars, {
          width: '20px',
        }),
      },
      {
        query: {
          size: ['lg', 'xl'],
        },
        vars: assignPartialVars(iconSpaceVars, {
          width: '24px',
        }),
      },
      {
        query: { size: 'relative' },
        vars: assignPartialVars(iconSpaceVars, {
          width: '1.25em',
        }),
      },
    ]),
  ),
};
