import {
  createContainer,
  createThemeContract,
  style,
} from '@vanilla-extract/css';
import { label, layers } from '../../styles';
import type { DateFieldClassNames } from './types';

export const dateFieldContainer = createContainer();

export const dateFieldSpaceVars = createThemeContract({
  x: '',
  y: '',
  gap: '',
  minWidth: '',
  width: '',
  maxWidth: '',
});

export const dateFieldColorVars = createThemeContract({
  border: '',
  description: {
    color: '',
  },
  error: {
    color: '',
  },
});

export const dateFieldStateVars = createThemeContract({
  size: '',
  isDisabled: '',
  isFocused: '',
  isHovered: '',
  isInvalid: '',
  isReadOnly: '',
  isRequired: '',
});

export const dateFieldClassNames: DateFieldClassNames = {
  container: style({
    '@layer': {
      [layers.components.l1]: {
        containerName: dateFieldContainer,
      },
    },
  }),
  dateField: style({
    '@layer': {
      [layers.components.l1]: {
        width: 'fit-content',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      },
    },
  }),
  label: style([label]),
  description: style({
    '@layer': {
      [layers.components.l1]: {
        color: dateFieldColorVars.description.color,
      },
    },
  }),
  error: style({
    '@layer': {
      [layers.components.l1]: {
        color: dateFieldColorVars.error.color,
      },
    },
  }),
};
