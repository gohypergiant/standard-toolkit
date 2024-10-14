import {
  createContainer,
  createThemeContract,
  fallbackVar,
  style,
} from '@vanilla-extract/css';
import { focusOutlineStyle, label, layers, radiusVars } from '../../styles';
import { inputColorVars } from '../input';
import type { ComboBoxClassNames } from './types';

export const comboBoxContainer = createContainer();

export const comboBoxColorVars = createThemeContract({
  description: {
    color: '',
  },
  error: {
    color: '',
  },
});

export const comboBoxSpaceVars = createThemeContract({
  x: '',
  y: '',
});

export const comboBoxStateVars = createThemeContract({
  size: '',
  isDisabled: '',
  isInvalid: '',
  isOpen: '',
  isRequired: '',
});

export const comboBoxClassNames: ComboBoxClassNames = {
  container: style({
    '@layer': {
      [layers.components.l1]: {
        containerName: comboBoxContainer,
        display: 'contents',
      },
    },
  }),
  comboBox: style({
    '@layer': {
      [layers.components.l1]: {
        width: 'fit-content',
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
  group: style({
    '@layer': {
      [layers.components.l1]: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        padding: `${fallbackVar(comboBoxSpaceVars.y, '0')} ${fallbackVar(comboBoxSpaceVars.x, '0')}`,
      },
    },
  }),
  input: {
    sizer: style({
      '@layer': {
        [layers.components.l2]: {
          '::before': {
            content: '',
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            display: 'block',
            border: `1px solid ${fallbackVar(inputColorVars.border, 'transparent')}`,
            borderRadius: radiusVars.md,
            background: inputColorVars.background,
            color: inputColorVars.color,
          },
          selectors: {
            '&:has(:focus-visible)::before': focusOutlineStyle,
          },
        },
      },
    }),
    input: style({
      '@layer': {
        [layers.components.l2]: {
          position: 'relative',
          padding: 0,
          border: 'none',
          background: 'none',
          selectors: {
            '&::-webkit-search-cancel-button, &::-webkit-search-decoration': {
              // biome-ignore lint/style/useNamingConvention: intentional
              WebkitAppearance: 'none',
            },
            '&:focus-visible': {
              outline: 'none',
            },
          },
        },
      },
    }),
  },
  toggle: {
    button: style({
      '@layer': {
        [layers.components.l2]: {
          position: 'relative',
          padding: 0,
          background: 'none',
        },
      },
    }),
  },
  description: style({
    '@layer': {
      [layers.components.l1]: {
        color: comboBoxColorVars.description.color,
      },
    },
  }),
  error: style({
    '@layer': {
      [layers.components.l1]: {
        color: comboBoxColorVars.error.color,
      },
    },
  }),
};
