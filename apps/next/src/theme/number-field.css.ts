import { style } from '@vanilla-extract/css';
import {
  type InputState,
  type NumberFieldState,
  type ThemeContext,
  applyThemeVars,
  assignPartialVars,
  genericColorVars,
  inputColorVars,
  inputSpaceVars,
  inputStateVars,
  numberFieldColorVars,
  numberFieldSpaceVars,
  numberFieldStateVars,
  semanticColorVars,
  sizeVars,
} from '@accelint/design-system/vanilla';

export const NumberField: ThemeContext['NumberField'] = {
  description: style(
    applyThemeVars<NumberFieldState>(numberFieldStateVars, [
      {
        vars: assignPartialVars(numberFieldColorVars, {
          description: {
            color: genericColorVars.neutral.v03,
          },
        }),
      },
      {
        query: { isDisabled: true },
        vars: assignPartialVars(numberFieldColorVars, {
          description: {
            color: semanticColorVars.foreground.interactive.disabled,
          },
        }),
      },
    ]),
  ),
  error: style(
    applyThemeVars<NumberFieldState>(numberFieldStateVars, [
      {
        vars: assignPartialVars(numberFieldColorVars, {
          error: {
            color: semanticColorVars.border.serious,
          },
        }),
      },
    ]),
  ),
  group: style(
    applyThemeVars<NumberFieldState>(numberFieldStateVars, [
      {
        vars: assignPartialVars(numberFieldSpaceVars, {
          group: {
            gap: sizeVars.v03,
          },
        }),
      },
      {
        query: { size: 'sm' },
        vars: assignPartialVars(numberFieldSpaceVars, {
          group: {
            x: sizeVars.v03,
            y: sizeVars.v02,
          },
        }),
      },
      {
        query: { size: 'lg' },
        vars: assignPartialVars(numberFieldSpaceVars, {
          group: {
            x: sizeVars.v04,
            y: sizeVars.v03,
          },
        }),
      },
    ]),
  ),
  input: {
    sizer: style(
      applyThemeVars<InputState>(inputStateVars, [
        {
          vars: assignPartialVars(inputSpaceVars, {
            minWidth: '50px',
          }),
        },
      ]),
    ),
  },
  label: style(
    applyThemeVars<{ numberField: NumberFieldState; input: InputState }>(
      { numberField: numberFieldStateVars, input: inputStateVars },
      [
        {
          query: { numberField: { isDisabled: true } },
          vars: assignPartialVars(inputColorVars, {
            color: semanticColorVars.foreground.interactive.disabled,
          }),
        },
      ],
    ),
  ),
};
