import { style } from '@vanilla-extract/css';
import {
  applyThemeVars,
  assignPartialVars,
  buttonColorVars,
  buttonSpaceVars,
  genericColorVars,
  inputColorVars,
  inputStateVars,
  selectColorVars,
  selectStateVars,
  semanticColorVars,
  sizeVars,
  type InputState,
  type SelectState,
  type ThemeContext,
} from '../../src';

export const Select: ThemeContext['Select'] = {
  toggle: {
    button: style(
      applyThemeVars<SelectState>(selectStateVars, [
        {
          query: { size: 'sm' },
          vars: assignPartialVars(buttonSpaceVars, {
            x: sizeVars.v03,
            y: sizeVars.v02,
          }),
        },
        {
          query: { size: 'lg' },
          vars: assignPartialVars(buttonSpaceVars, {
            x: sizeVars.v04,
            y: sizeVars.v03,
          }),
        },
        {
          query: { isInvalid: true },
          vars: assignPartialVars(buttonColorVars, {
            border: semanticColorVars.border.serious,
          }),
        },
      ])
    ),
  },
  label: style(
    applyThemeVars<{ select: SelectState; input: InputState }>(
      { select: selectStateVars, input: inputStateVars },
      [
        {
          query: { select: { isDisabled: true } },
          vars: assignPartialVars(inputColorVars, {
            color: semanticColorVars.foreground.interactive.disabled,
          }),
        },
      ]
    )
  ),
  description: style(
    applyThemeVars<SelectState>(selectStateVars, [
      {
        vars: assignPartialVars(selectColorVars, {
          description: {
            color: genericColorVars.neutral.v03,
          },
        }),
      },
      {
        query: { isDisabled: true },
        vars: assignPartialVars(selectColorVars, {
          description: {
            color: semanticColorVars.foreground.interactive.disabled,
          },
        }),
      },
    ])
  ),
  error: style(
    applyThemeVars<SelectState>(selectStateVars, [
      {
        vars: assignPartialVars(selectColorVars, {
          error: {
            color: semanticColorVars.border.serious,
          },
        }),
      },
    ])
  ),
};
