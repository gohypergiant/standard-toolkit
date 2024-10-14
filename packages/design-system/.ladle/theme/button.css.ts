import { style } from '@vanilla-extract/css';
import {
  type ButtonState,
  type ThemeContext,
  applyThemeVars,
  assignPartialVars,
  buttonColorVars,
  buttonSpaceVars,
  buttonStateVars,
  genericColorVars,
  sizeVars,
} from '../../src';

export const Button: ThemeContext['Button'] = {
  button: style(
    applyThemeVars<ButtonState>(buttonStateVars, [
      {
        query: { size: 'xs' },
        vars: assignPartialVars(buttonSpaceVars, {
          x: sizeVars.v05,
          y: sizeVars.v03,
        }),
      },
      {
        query: { size: 'sm' },
        vars: assignPartialVars(buttonSpaceVars, {
          x: sizeVars.v05,
          y: sizeVars.v03,
        }),
      },
      {
        query: { size: 'md' },
        vars: assignPartialVars(buttonSpaceVars, {
          minWidth: '80px',
          x: sizeVars.v06,
          y: sizeVars.v04,
        }),
      },
      {
        query: { size: 'lg' },
        vars: assignPartialVars(buttonSpaceVars, {
          minWidth: '96px',
          x: sizeVars.v06,
          y: sizeVars.v04,
        }),
      },
      {
        query: { size: 'xl' },
        vars: assignPartialVars(buttonSpaceVars, {
          minWidth: '112px',
          x: sizeVars.v07,
          y: sizeVars.v05,
        }),
      },
      {
        query: { variant: ['icon', 'floating'] },
        vars: assignPartialVars(buttonSpaceVars, {
          y: buttonSpaceVars.x,
        }),
      },
      {
        query: { size: ['xs', 'sm'], variant: ['icon', 'floating'] },
        vars: assignPartialVars(buttonSpaceVars, {
          x: sizeVars.v02,
        }),
      },
      {
        query: { size: 'md', variant: ['icon', 'floating'] },
        vars: assignPartialVars(buttonSpaceVars, {
          x: sizeVars.v03,
        }),
      },
      {
        query: { size: ['lg', 'xl'], variant: ['icon', 'floating'] },
        vars: assignPartialVars(buttonSpaceVars, {
          x: sizeVars.v04,
        }),
      },
      {
        query: {
          color: ['primary', 'secondary', 'tertiary'],
        },
        vars: assignPartialVars(buttonColorVars, {
          nonSolidColor: genericColorVars.neutral.v02,
          hollowBorder: genericColorVars.neutral.v07,
          solidBackground: genericColorVars.neutral.v02,
          solidColor: genericColorVars.neutral.v09,
        }),
      },
      {
        query: {
          operator: 'and',
          groups: [
            {
              color: ['primary', 'secondary', 'tertiary'],
            },
            {
              operator: 'or',
              isHovered: true,
              isPressed: true,
            },
          ],
        },
        vars: assignPartialVars(buttonColorVars, {
          nonSolidColor: genericColorVars.neutral.v01,
          bareBackground: genericColorVars.neutral.v07,
          hollowBorder: genericColorVars.neutral.v01,
          solidBackground: genericColorVars.neutral.v01,
          solidColor: genericColorVars.neutral.v10,
        }),
      },
      {
        query: {
          color: ['primary', 'secondary', 'tertiary'],
          isSelected: true,
        },
        vars: assignPartialVars(buttonColorVars, {
          hollowBorder: genericColorVars.neutral.v01,
          solidColor: genericColorVars.neutral.v10,
        }),
      },
      {
        query: {
          color: 'primary',
          isSelected: true,
        },
        vars: assignPartialVars(buttonColorVars, {
          nonSolidColor: genericColorVars.highlight.primary.v3,
          solidBackground: genericColorVars.highlight.primary.v3,
        }),
      },
      {
        query: {
          color: 'secondary',
          isSelected: true,
        },
        vars: assignPartialVars(buttonColorVars, {
          nonSolidColor: genericColorVars.highlight.secondary.v3,
          solidBackground: genericColorVars.highlight.secondary.v3,
        }),
      },
      {
        query: {
          color: 'tertiary',
          isSelected: true,
        },
        vars: assignPartialVars(buttonColorVars, {
          nonSolidColor: genericColorVars.highlight.tertiary.v3,
          solidBackground: genericColorVars.highlight.tertiary.v3,
        }),
      },
      {
        query: {
          color: 'serious',
        },
        vars: assignPartialVars(buttonColorVars, {
          nonSolidColor: genericColorVars.condition.serious.v3,
          hollowBorder: genericColorVars.condition.serious.v3,
          solidBackground: genericColorVars.condition.serious.v3,
          solidColor: genericColorVars.neutral.v08,
        }),
      },
      {
        query: {
          operator: 'and',
          groups: [
            {
              color: 'serious',
            },
            {
              operator: 'or',
              isHovered: true,
              isPressed: true,
            },
          ],
        },
        vars: assignPartialVars(buttonColorVars, {
          nonSolidColor: genericColorVars.condition.serious.v3,
          bareBackground: genericColorVars.condition.serious.v5,
          hollowBorder: genericColorVars.condition.serious.v4,
          solidBackground: genericColorVars.condition.serious.v4,
          solidColor: genericColorVars.neutral.v09,
        }),
      },
      {
        query: {
          color: 'critical',
        },
        vars: assignPartialVars(buttonColorVars, {
          nonSolidColor: genericColorVars.condition.critical.v3,
          hollowBorder: genericColorVars.condition.critical.v3,
          solidBackground: genericColorVars.condition.critical.v3,
          solidColor: genericColorVars.neutral.v02,
        }),
      },
      {
        query: {
          operator: 'and',
          groups: [
            {
              color: 'critical',
            },
            {
              operator: 'or',
              isHovered: true,
              isPressed: true,
            },
          ],
        },
        vars: assignPartialVars(buttonColorVars, {
          nonSolidColor: genericColorVars.condition.critical.v3,
          bareBackground: genericColorVars.condition.critical.v5,
          hollowBorder: genericColorVars.condition.critical.v4,
          solidBackground: genericColorVars.condition.critical.v4,
          solidColor: genericColorVars.neutral.v01,
        }),
      },
      {
        query: { isDisabled: true },
        vars: assignPartialVars(buttonColorVars, {
          nonSolidColor: genericColorVars.neutral.v05,
          hollowBorder: genericColorVars.neutral.v05,
          solidBackground: genericColorVars.neutral.v05,
          solidColor: genericColorVars.neutral.v07,
        }),
      },
      {
        query: { variant: 'floating', isSelected: true },
        vars: assignPartialVars(buttonColorVars, {
          border: 'currentcolor',
        }),
      },
      {
        query: {
          variant: ['floating', 'solid'],
          isDisabled: true,
        },
        vars: assignPartialVars(buttonColorVars, {
          background: genericColorVars.neutral.v07,
          border: 'transparent',
          color: genericColorVars.neutral.v05,
        }),
      },
    ])
  ),
};
