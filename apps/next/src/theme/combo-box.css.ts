import { style } from '@vanilla-extract/css';
import {
  applyThemeVars,
  assignPartialVars,
  comboBoxColorVars,
  comboBoxSpaceVars,
  comboBoxStateVars,
  genericColorVars,
  inputColorVars,
  inputStateVars,
  semanticColorVars,
  sizeVars,
  type ComboBoxState,
  type InputState,
  type ThemeContext,
} from '@accelint/design-system/vanilla';

export const ComboBox: ThemeContext['ComboBox'] = {
  group: style(
    applyThemeVars<ComboBoxState>(comboBoxStateVars, [
      {
        query: { size: 'sm' },
        vars: assignPartialVars(comboBoxSpaceVars, {
          x: sizeVars.v03,
          y: sizeVars.v02,
        }),
      },
      {
        query: { size: 'lg' },
        vars: assignPartialVars(comboBoxSpaceVars, {
          x: sizeVars.v04,
          y: sizeVars.v03,
        }),
      },
    ]),
  ),
  label: style(
    applyThemeVars<{ comboBox: ComboBoxState; input: InputState }>(
      { comboBox: comboBoxStateVars, input: inputStateVars },
      [
        {
          query: { comboBox: { isDisabled: true } },
          vars: assignPartialVars(inputColorVars, {
            color: semanticColorVars.foreground.interactive.disabled,
          }),
        },
      ],
    ),
  ),
  description: style(
    applyThemeVars<ComboBoxState>(comboBoxStateVars, [
      {
        vars: assignPartialVars(comboBoxColorVars, {
          description: {
            color: genericColorVars.neutral.v03,
          },
        }),
      },
      {
        query: { isDisabled: true },
        vars: assignPartialVars(comboBoxColorVars, {
          description: {
            color: semanticColorVars.foreground.interactive.disabled,
          },
        }),
      },
    ]),
  ),
  error: style(
    applyThemeVars<ComboBoxState>(comboBoxStateVars, [
      {
        vars: assignPartialVars(comboBoxColorVars, {
          error: {
            color: semanticColorVars.border.serious,
          },
        }),
      },
    ]),
  ),
};
