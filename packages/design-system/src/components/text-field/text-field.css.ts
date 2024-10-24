import {
  createContainer,
  createThemeContract,
  style,
} from '@vanilla-extract/css';
import { label, layers } from '../../styles';
import type { TextFieldClassNames } from './types';

export const textFieldContainer = createContainer();

export const textFieldColorVars = createThemeContract({
  description: {
    color: '',
  },
  error: {
    color: '',
  },
});

export const textFieldSpaceVars = createThemeContract({
  gap: '',
});

export const textFieldStateVars = createThemeContract({
  size: '',
  isDisabled: '',
  isInvalid: '',
  isReadOnly: '',
  isRequired: '',
});

export const textFieldClassNames: TextFieldClassNames = {
  container: style({
    '@layer': {
      [layers.components.l1]: {
        containerName: textFieldContainer,
      },
    },
  }),
  textField: style({
    '@layer': {
      [layers.components.l1]: {
        alignItems: 'flex-start',
        display: 'flex',
        flexDirection: 'column',
        gap: textFieldSpaceVars.gap,
      },
    },
  }),
  label: style([label]),
  description: style({
    '@layer': {
      [layers.components.l1]: {
        color: textFieldColorVars.description.color,
      },
    },
  }),
  error: style({
    '@layer': {
      [layers.components.l1]: {
        color: textFieldColorVars.error.color,
      },
    },
  }),
};
