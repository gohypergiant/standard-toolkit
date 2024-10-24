import {
  createContainer,
  createThemeContract,
  fallbackVar,
  style,
} from '@vanilla-extract/css';
import { label, layers } from '../../styles';
import type { NumberFieldClassNames } from './types';

export const numberFieldContainer = createContainer();

export const numberFieldColorVars = createThemeContract({
  description: {
    color: '',
  },
  error: {
    color: '',
  },
});

export const numberFieldSpaceVars = createThemeContract({
  group: {
    gap: '',
    x: '',
    y: '',
  },
  numberField: {
    gap: '',
  },
});

export const numberFieldStateVars = createThemeContract({
  size: '',
  isDisabled: '',
  isInvalid: '',
  isReadOnly: '',
  isRequired: '',
});

export const numberFieldClassNames: NumberFieldClassNames = {
  container: style({
    '@layer': {
      [layers.components.l1]: {
        containerName: numberFieldContainer,
      },
    },
  }),
  numberField: style({
    '@layer': {
      [layers.components.l1]: {
        alignItems: 'flex-start',
        display: 'flex',
        flexDirection: 'column',
        gap: numberFieldSpaceVars.numberField.gap,
      },
    },
  }),
  description: style({
    '@layer': {
      [layers.components.l1]: {
        color: numberFieldColorVars.description.color,
      },
    },
  }),
  error: style({
    '@layer': {
      [layers.components.l1]: {
        color: numberFieldColorVars.error.color,
      },
    },
  }),
  group: style({
    '@layer': {
      [layers.components.l1]: {
        display: 'flex',
        gap: numberFieldSpaceVars.group.gap,
        padding: `${fallbackVar(numberFieldSpaceVars.group.y, '0')} ${fallbackVar(numberFieldSpaceVars.group.x, '0')}`,
      },
    },
  }),
  label: style([label]),
};
