import {
  createContainer,
  createThemeContract,
  style,
} from '@vanilla-extract/css';
import { label, layers } from '../../styles';
import { dateFieldColorVars } from '../date-field';
import type { TimeFieldClassNames } from './types';

export const timeFieldContainer = createContainer();

export const timeFieldSpaceVars = createThemeContract({
  x: '',
  y: '',
  gap: '',
  minWidth: '',
  width: '',
  maxWidth: '',
});

export const timeFieldColorVars = createThemeContract({
  border: '',
});

export const timeFieldStateVars = createThemeContract({
  size: '',
  isDisabled: '',
  isFocused: '',
  isHovered: '',
  isInvalid: '',
  isReadOnly: '',
  isRequired: '',
});

export const timeFieldClassNames: TimeFieldClassNames = {
  container: style({
    '@layer': {
      [layers.components.l1]: {
        containerName: timeFieldContainer,
      },
    },
  }),
  timeField: style({
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
