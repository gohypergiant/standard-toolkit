import {
  createContainer,
  createThemeContract,
  fallbackVar,
  style,
} from '@vanilla-extract/css';
import { layers, label, radiusVars } from '../../styles';
import { containerQueries } from '../../utils';
import type {
  CheckboxGroupState,
  CheckboxClassNames,
  CheckboxState,
} from './types';

export const checkboxContainer = createContainer();

export const checkboxGroupContainer = createContainer();

export const checkboxColorVars = createThemeContract({
  border: '',
  background: '',
  color: '',
  indicator: '',
});

export const checkboxSpaceVars = createThemeContract({
  dimension: '',
  gap: '',
  elementGap: '',
});

export const checkboxStateVars = createThemeContract({
  alignInput: '',
  isDisabled: '',
  isFocused: '',
  isFocusVisible: '',
  isHovered: '',
  isIndeterminate: '',
  isInvalid: '',
  isPressed: '',
  isReadOnly: '',
  isRequired: '',
  isSelected: '',
});

export const checkboxGroupStateVars = createThemeContract({
  orientation: '',
  isDisabled: '',
  isReadOnly: '',
  isRequired: '',
  isInvalid: '',
});

export const checkboxClassNames: CheckboxClassNames = {
  checkbox: {
    container: style({
      '@layer': {
        [layers.components.l1]: {
          containerName: checkboxContainer,
          display: 'block',
          width: 'fit-content',
        },
      },
    }),
    checkbox: style({
      '@layer': {
        [layers.components.l1]: {
          display: 'flex',
          alignItems: 'center',
          gap: checkboxSpaceVars.gap,
          color: checkboxColorVars.color,
          '@container': containerQueries<CheckboxState>(
            checkboxStateVars,
            {
              query: { alignInput: 'start' },
              flexDirection: 'row-reverse',
            },
            {
              query: { alignInput: 'end' },
              flexDirection: 'row',
            },
            {
              query: { isReadOnly: false },
              cursor: 'pointer',
            },
            {
              query: { isDisabled: true },
              cursor: 'not-allowed',
            },
          ),
        },
      },
    }),
    icon: {
      container: style({
        '@layer': {
          [layers.components.l2]: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: checkboxSpaceVars.dimension,
            height: checkboxSpaceVars.dimension,
            color: fallbackVar(checkboxColorVars.indicator, 'currentcolor'),
            border: `1px solid ${fallbackVar(checkboxColorVars.border, 'transparent')}`,
            borderRadius: radiusVars.sm,
            background: fallbackVar(checkboxColorVars.background, 'none'),
          },
        },
      }),
    },
    label: style([
      label,
      {
        '@layer': {
          [layers.components.l1]: {
            color: checkboxColorVars.color,
          },
        },
      },
    ]),
  },
  group: {
    container: style({
      '@layer': {
        [layers.components.l1]: {
          containerName: checkboxGroupContainer,
          display: 'contents',
        },
      },
    }),
    group: style({
      '@layer': {
        [layers.components.l1]: {
          display: 'flex',
          flexDirection: 'column',
          gap: fallbackVar(checkboxSpaceVars.elementGap, checkboxSpaceVars.gap),
          '@container': containerQueries<CheckboxGroupState>(
            checkboxGroupStateVars,
            {
              query: { orientation: 'horizontal' },
              flexDirection: 'row',
            },
            {
              query: { orientation: 'vertical' },
              flexDirection: 'column',
            },
          ),
        },
      },
    }),
    label: style([
      label,
      {
        '@layer': {
          [layers.components.l1]: {
            color: checkboxColorVars.color,
          },
        },
      },
    ]),
  },
};
