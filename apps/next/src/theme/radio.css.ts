import { style } from '@vanilla-extract/css';
import {
  applyThemeVars,
  assignPartialVars,
  genericColorVars,
  sizeVars,
  type ThemeContext,
  type RadioGroupState,
  type RadioState,
  radioStateVars,
  radioColorVars,
  radioSpaceVars,
  radioGroupStateVars,
  semanticColorVars,
} from '@accelint/design-system/vanilla';

export const Radio: ThemeContext['Radio'] = {
  group: {
    group: style(
      applyThemeVars<RadioGroupState>(radioGroupStateVars, [
        {
          vars: assignPartialVars(radioSpaceVars, {
            elementGap: sizeVars.v04,
          }),
        },
      ]),
    ),
  },
  radio: {
    radio: style(
      applyThemeVars<RadioState>(radioStateVars, [
        {
          vars: assignPartialVars(
            { color: radioColorVars, space: radioSpaceVars },
            {
              color: {
                border: genericColorVars.neutral.v05,
              },
              space: {
                diameter: '16px',
                gap: sizeVars.v04,
              },
            },
          ),
        },
        {
          query: { isHovered: true },
          vars: assignPartialVars(radioColorVars, {
            border: genericColorVars.neutral.v01,
          }),
        },
        {
          query: { isSelected: true },
          vars: assignPartialVars(radioColorVars, {
            border: semanticColorVars.background.highlight.bold,
            background: semanticColorVars.background.highlight.bold,
          }),
        },
        {
          query: {
            isInvalid: true,
          },
          vars: assignPartialVars(radioColorVars, {
            border: semanticColorVars.border.serious,
          }),
        },
        {
          query: { isDisabled: true },
          vars: assignPartialVars(radioColorVars, {
            border: genericColorVars.neutral.v06,
            color: genericColorVars.neutral.v06,
          }),
        },
        {
          query: { isDisabled: true, isSelected: true },
          vars: assignPartialVars(radioColorVars, {
            border: genericColorVars.neutral.v06,
            color: genericColorVars.neutral.v06,
            background: genericColorVars.neutral.v06,
          }),
        },
      ]),
    ),
  },
};
