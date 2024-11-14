import { style } from '@vanilla-extract/css';
import {
  applyThemeVars,
  assignPartialVars,
  genericColorVars,
  sizeVars,
  switchColorVars,
  switchSpaceVars,
  switchStateVars,
  type SwitchState,
  type ThemeContext,
} from '@accelint/design-system/vanilla';

export const Switch: ThemeContext['Switch'] = {
  switch: style(
    applyThemeVars<SwitchState>(switchStateVars, [
      {
        vars: assignPartialVars(
          { color: switchColorVars, space: switchSpaceVars },
          {
            color: {
              border: genericColorVars.neutral.v05,
              background: genericColorVars.neutral.v10,
              indicator: genericColorVars.neutral.v03,
            },
            space: {
              diameter: '12px',
              gutter: sizeVars.v02,
              gap: sizeVars.v04,
              travel: sizeVars.v04,
            },
          },
        ),
      },
      {
        query: { isHovered: true },
        vars: assignPartialVars(switchColorVars, {
          background: genericColorVars.neutral.v07,
          border: genericColorVars.neutral.v01,
          indicator: genericColorVars.neutral.v01,
        }),
      },
      {
        query: { isSelected: true },
        vars: assignPartialVars(switchColorVars, {
          border: genericColorVars.highlight.primary.v3,
          indicator: genericColorVars.highlight.primary.v3,
        }),
      },
      {
        query: { isSelected: true, isHovered: true },
        vars: assignPartialVars(switchColorVars, {
          background: genericColorVars.highlight.primary.v5,
        }),
      },
      {
        query: { isDisabled: true },
        vars: assignPartialVars(switchColorVars, {
          background: genericColorVars.neutral.v07,
          border: 'transparent',
          color: genericColorVars.neutral.v05,
          indicator: genericColorVars.neutral.v05,
        }),
      },
    ]),
  ),
};
