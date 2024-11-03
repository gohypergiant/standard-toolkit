import {
  createContainer,
  createThemeContract,
  fallbackVar,
  style,
} from '@vanilla-extract/css';
import { layers, radiusVars } from '../../styles';
import type { DateInputClassNames } from './types';

export const dateInputContainer = createContainer();
export const dateSegmentsContainer = createContainer();

export const dateInputStateVars = createThemeContract({
  isHovered: '',
  isFocusWithin: '',
  isFocusVisible: '',
  isDisabled: '',
  isInvalid: '',
});

export const dateSegmentStateVars = createThemeContract({
  isHovered: '',
  isFocusWithin: '',
  isFocusVisible: '',
  isDisabled: '',
  isInvalid: '',
});

export const dateInputSpaceVars = createThemeContract({
  x: '',
  y: '',
  gap: '',
  minWidth: '',
  width: '',
  maxWidth: '',
});

export const dateInputColorVars = createThemeContract({
  border: '',
  description: {
    color: '',
  },
  error: {
    color: '',
  },
});

export const dateInputClassNames: DateInputClassNames = {
  dateInput: {
    container: style({
      '@layer': {
        [layers.components.l1]: {
          containerName: dateInputContainer,
        },
      },
    }),
    dateInput: style({
      '@layer': {
        [layers.components.l1]: {
          position: 'relative',
          display: 'flex',
          padding: `${fallbackVar(dateInputSpaceVars.y, '0')} ${fallbackVar(dateInputSpaceVars.x, '0')}`,
          border: `1px solid ${fallbackVar(dateInputColorVars.border, 'transparent')}`,
          borderRadius: radiusVars.sm,
          minWidth: fallbackVar(dateInputSpaceVars.minWidth, 'auto'),
          width: fallbackVar(dateInputSpaceVars.width, 'fit-content'),
          maxWidth: fallbackVar(dateInputSpaceVars.maxWidth, '100%'),
        },
      },
    }),
  },
  segments: {
    container: style({
      '@layer': {
        [layers.components.l1]: {
          containerName: dateSegmentsContainer,
        },
      },
    }),
    segments: style({
      '@layer': {
        [layers.components.l1]: {
          display: 'flex',
        },
      },
    }),
  },
};
