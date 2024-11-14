import { style } from '@vanilla-extract/css';
import {
  type TextAreaState,
  type ThemeContext,
  applyThemeVars,
  assignPartialVars,
  genericColorVars,
  semanticColorVars,
  sizeVars,
  textAreaColorVars,
  textAreaSpaceVars,
  textAreaStateVars,
} from '@accelint/design-system/vanilla';

export const TextArea: ThemeContext['TextArea'] = {
  textarea: style(
    applyThemeVars<TextAreaState>(textAreaStateVars, [
      {
        vars: assignPartialVars(
          { color: textAreaColorVars, space: textAreaSpaceVars },
          {
            color: {
              background: genericColorVars.neutral.v08,
              border: semanticColorVars.border.interactive.default,
            },
            space: {
              maxWidth: '400px',
            },
          },
        ),
      },
      {
        query: { size: 'sm' },
        vars: assignPartialVars(textAreaSpaceVars, {
          x: sizeVars.v03,
          y: sizeVars.v02,
        }),
      },
      {
        query: { size: 'lg' },
        vars: assignPartialVars(textAreaSpaceVars, {
          x: sizeVars.v04,
          y: sizeVars.v03,
        }),
      },
      {
        query: { isPlaceholder: true },
        vars: assignPartialVars(textAreaColorVars, {
          color: genericColorVars.neutral.v03,
        }),
      },
      {
        query: { isEmpty: false },
        vars: assignPartialVars(textAreaColorVars, {
          color: semanticColorVars.foreground.interactive.primary.bold,
        }),
      },
      {
        query: { isHovered: true },
        vars: assignPartialVars(textAreaColorVars, {
          border: semanticColorVars.border.interactive.hover,
        }),
      },
      {
        query: { isFocused: true },
        vars: assignPartialVars(textAreaColorVars, {
          border: semanticColorVars.border.interactive.highlight,
        }),
      },
      {
        query: { isInvalid: true },
        vars: assignPartialVars(textAreaColorVars, {
          border: semanticColorVars.border.serious,
        }),
      },
      {
        query: { isDisabled: true },
        vars: assignPartialVars(textAreaColorVars, {
          background: semanticColorVars.background.interactive.disabled,
          border: 'transparent',
          color: semanticColorVars.foreground.interactive.disabled,
        }),
      },
    ]),
  ),
};
