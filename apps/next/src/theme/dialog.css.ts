import { style } from '@vanilla-extract/css';
import {
  type DialogState,
  type ThemeContext,
  applyThemeVars,
  assignPartialVars,
  dialogColorVars,
  dialogSpaceVars,
  dialogStateVars,
  genericColorVars,
  sizeVars,
} from '@accelint/design-system/vanilla';

export const Dialog: ThemeContext['Dialog'] = {
  container: style(
    applyThemeVars<DialogState>(dialogStateVars, [
      {
        vars: assignPartialVars(dialogColorVars, {
          overlay: `rgb(from ${genericColorVars.neutral.v10} r g b / 0.4)`,
        }),
      },
    ]),
  ),
  dialog: style(
    applyThemeVars<DialogState>(dialogStateVars, [
      {
        query: {
          size: 'sm',
        },
        vars: assignPartialVars(dialogSpaceVars, {
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
      {
        query: {
          size: 'lg',
        },
        vars: assignPartialVars(dialogSpaceVars, {
          width: '320px',
          x: sizeVars.v07,
          y: sizeVars.v08,
          gap: {
            default: sizeVars.v06,
            header: {
              after: sizeVars.v06,
            },
            footer: {
              before: sizeVars.v09,
            },
          },
        }),
      },
    ]),
  ),
  content: style(
    applyThemeVars<DialogState>(dialogStateVars, [
      {
        query: { hasHeader: true },
        vars: assignPartialVars(dialogColorVars, {
          content: { color: genericColorVars.neutral.v03 },
        }),
      },
    ]),
  ),
};
