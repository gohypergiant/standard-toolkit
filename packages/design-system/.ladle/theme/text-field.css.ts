import { style } from '@vanilla-extract/css';
import {
  type InputState,
  type TextFieldState,
  type ThemeContext,
  applyThemeVars,
  assignPartialVars,
  genericColorVars,
  inputColorVars,
  inputStateVars,
  semanticColorVars,
  textFieldColorVars,
  textFieldStateVars,
} from '../../src';

export const TextField: ThemeContext['TextField'] = {
  label: style(
    applyThemeVars<{ textField: TextFieldState; input: InputState }>(
      { textField: textFieldStateVars, input: inputStateVars },
      [
        {
          query: { textField: { isDisabled: true } },
          vars: assignPartialVars(inputColorVars, {
            color: semanticColorVars.foreground.interactive.disabled,
          }),
        },
      ],
    ),
  ),
  description: style(
    applyThemeVars<TextFieldState>(textFieldStateVars, [
      {
        vars: assignPartialVars(textFieldColorVars, {
          description: {
            color: genericColorVars.neutral.v03,
          },
        }),
      },
      {
        query: { isDisabled: true },
        vars: assignPartialVars(textFieldColorVars, {
          description: {
            color: semanticColorVars.foreground.interactive.disabled,
          },
        }),
      },
    ]),
  ),
  error: style(
    applyThemeVars<TextFieldState>(textFieldStateVars, [
      {
        vars: assignPartialVars(textFieldColorVars, {
          error: {
            color: semanticColorVars.border.serious,
          },
        }),
      },
    ]),
  ),
};
