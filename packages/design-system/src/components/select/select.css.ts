import {
  createContainer,
  createThemeContract,
  fallbackVar,
  style,
} from '@vanilla-extract/css';
import { label, layers, typographyVars } from '../../styles';
import { inputColorVars } from '../input';
import type { SelectClassNames } from './types';

export const selectContainer = createContainer();

export const selectColorVars = createThemeContract({
  description: {
    color: '',
  },
  error: {
    color: '',
  },
});

export const selectSpaceVars = createThemeContract({
  width: '',
  x: '',
  y: '',
});

export const selectStateVars = createThemeContract({
  size: '',
  isDisabled: '',
  isInvalid: '',
  isOpen: '',
  isRequired: '',
  isFocused: '',
  isFocusVisible: '',
});

export const selectClassNames: SelectClassNames = {
  container: style({
    '@layer': {
      [layers.components.l1]: {
        containerName: selectContainer,
        display: 'contents',
      },
    },
  }),
  select: style({
    '@layer': {
      [layers.components.l1]: {
        width: fallbackVar(selectSpaceVars.width, 'fit-content'),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      },
    },
  }),
  label: style([
    label,
    {
      '@layer': {
        [layers.components.l1]: {
          color: inputColorVars.color,
        },
      },
    },
  ]),
  toggle: {
    button: style({
      '@layer': {
        [layers.components.l2]: {
          fontFamily: typographyVars.mono,
          justifyContent: 'space-between',
        },
      },
    }),
  },
  description: style({
    '@layer': {
      [layers.components.l1]: {
        color: selectColorVars.description.color,
      },
    },
  }),
  error: style({
    '@layer': {
      [layers.components.l1]: {
        color: selectColorVars.error.color,
      },
    },
  }),
  value: style({
    '@layer': {
      [layers.components.l1]: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },
    },
  }),
};
