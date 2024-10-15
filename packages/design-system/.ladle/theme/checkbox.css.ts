import { style } from '@vanilla-extract/css';
import {
  type CheckboxState,
  type ThemeContext,
  type CheckboxGroupState,
  applyThemeVars,
  assignPartialVars,
  genericColorVars,
  checkboxColorVars,
  checkboxStateVars,
  checkboxSpaceVars,
  sizeVars,
  checkboxGroupStateVars,
  semanticColorVars,
} from '../../src';

export const Checkbox: ThemeContext['Checkbox'] = {
  group: {
    group: style(
      applyThemeVars<CheckboxGroupState>(checkboxGroupStateVars, [
        {
          vars: assignPartialVars(checkboxSpaceVars, {
            elementGap: sizeVars.v04,
          }),
        },
      ])
    ),
  },
  checkbox: {
    checkbox: style(
      applyThemeVars<CheckboxState>(checkboxStateVars, [
        {
          vars: assignPartialVars(
            { color: checkboxColorVars, space: checkboxSpaceVars },
            {
              color: {
                border: genericColorVars.neutral.v03,
                background: genericColorVars.neutral.v10,
                color: genericColorVars.neutral.v01,
                indicator: genericColorVars.neutral.v10,
              },
              space: {
                dimension: '16px',
                gap: sizeVars.v04,
              },
            }
          ),
        },
        {
          query: {
            operator: 'or',
            isHovered: true,
            isPressed: true,
            isFocused: true,
          },
          vars: assignPartialVars(checkboxColorVars, {
            border: genericColorVars.neutral.v01,
          }),
        },
        {
          query: {
            operator: 'or',
            isSelected: true,
            isIndeterminate: true,
          },
          vars: assignPartialVars(checkboxColorVars, {
            border: genericColorVars.highlight.primary.v3,
            background: genericColorVars.highlight.primary.v3,
          }),
        },
        {
          query: {
            isInvalid: true,
          },
          vars: assignPartialVars(checkboxColorVars, {
            border: semanticColorVars.border.serious,
          }),
        },
        {
          query: { isDisabled: true },
          vars: assignPartialVars(checkboxColorVars, {
            border: genericColorVars.neutral.v06,
            color: genericColorVars.neutral.v06,
          }),
        },
        {
          query: {
            operator: 'and',
            groups: [
              { operator: 'or', isSelected: true, isIndeterminate: true },
              { isDisabled: true },
            ],
          },
          vars: assignPartialVars(checkboxColorVars, {
            background: genericColorVars.neutral.v06,
          }),
        },
      ])
    ),
  },
};
