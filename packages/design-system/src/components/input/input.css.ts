import {
  createContainer,
  createThemeContract,
  fallbackVar,
  style,
} from '@vanilla-extract/css';
import { layers, radiusVars, typographyVars } from '../../styles';
import { containerQueries } from '../../utils';
import type { InputClassNames, InputState } from './types';

export const inputContainer = createContainer();

export const inputColorVars = createThemeContract({
  background: '',
  border: '',
  color: '',
});

export const inputSpaceVars = createThemeContract({
  minWidth: '',
  width: '',
  maxWidth: '',
  x: '',
  y: '',
});

export const inputStateVars = createThemeContract({
  length: '',
  size: '',
  type: '',
  isDisabled: '',
  isEmpty: '',
  isFocused: '',
  isFocusVisible: '',
  isHovered: '',
  isInvalid: '',
  isPlaceholder: '',
  isReadOnly: '',
  isRequired: '',
});

export const inputClassNames: InputClassNames = {
  container: style({
    '@layer': {
      [layers.components.l1]: {
        containerName: inputContainer,
        display: 'contents',
      },
    },
  }),
  /**
   * A sizer is necessary to override the default behavior of inputs
   * Browsers adhere to the size attribute and ignore the min-width
   * CSS which makes creating very small inputs impossible
   */
  sizer: style({
    '@layer': {
      [layers.components.l1]: {
        minWidth: fallbackVar(inputSpaceVars.minWidth, 'auto'),
        width: fallbackVar(inputSpaceVars.width, '100%'),
        maxWidth: fallbackVar(inputSpaceVars.maxWidth, '100%'),
      },
    },
  }),
  input: style({
    '@layer': {
      [layers.components.l1]: {
        width: '100%',
        padding: `${fallbackVar(inputSpaceVars.y, '0')} ${fallbackVar(inputSpaceVars.x, '0')}`,
        border: `1px solid ${fallbackVar(inputColorVars.border, 'transparent')}`,
        borderRadius: radiusVars.md,
        background: inputColorVars.background,
        fontFamily: typographyVars.mono,
        color: inputColorVars.color,
        '::-webkit-inner-spin-button': {
          display: 'none',
        },
        '@container': containerQueries<InputState>(inputStateVars, {
          query: { isDisabled: true },
          cursor: 'not-allowed',
        }),
      },
    },
  }),
};
