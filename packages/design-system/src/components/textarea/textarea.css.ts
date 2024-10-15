import {
  createContainer,
  createThemeContract,
  fallbackVar,
  style,
} from '@vanilla-extract/css';
import { layers, radiusVars, typographyVars } from '../../styles';
import { containerQueries } from '../../utils';
import type { TextAreaClassNames, TextAreaState } from './types';

export const textAreaContainer = createContainer();

export const textAreaColorVars = createThemeContract({
  background: '',
  border: '',
  color: '',
});

export const textAreaSpaceVars = createThemeContract({
  minWidth: '',
  width: '',
  maxWidth: '',
  minHeight: '',
  height: '',
  maxHeight: '',
  x: '',
  y: '',
});

export const textAreaStateVars = createThemeContract({
  resize: '',
  size: '',
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

export const textAreaClassNames: TextAreaClassNames = {
  container: style({
    '@layer': {
      [layers.components.l1]: {
        containerName: textAreaContainer,
        display: 'contents',
      },
    },
  }),
  textarea: style({
    '@layer': {
      [layers.components.l1]: {
        minWidth: fallbackVar(textAreaSpaceVars.minWidth, 'auto'),
        width: fallbackVar(textAreaSpaceVars.width, '100%'),
        maxWidth: fallbackVar(textAreaSpaceVars.maxWidth, '100%'),
        minHeight: fallbackVar(textAreaSpaceVars.minHeight, 'auto'),
        height: fallbackVar(textAreaSpaceVars.height, 'auto'),
        maxHeight: fallbackVar(textAreaSpaceVars.maxHeight, 'none'),
        display: 'block',
        padding: `${fallbackVar(textAreaSpaceVars.y, '0')} ${fallbackVar(textAreaSpaceVars.x, '0')}`,
        border: `1px solid ${fallbackVar(textAreaColorVars.border, 'transparent')}`,
        borderRadius: radiusVars.md,
        background: textAreaColorVars.background,
        fontFamily: typographyVars.mono,
        color: textAreaColorVars.color,
        overflow: 'auto',
        resize: textAreaStateVars.resize,
        selectors: {
          '&[contenteditable]:empty::before': {
            content: 'attr(data-placeholder)',
          },
        },
        '@container': containerQueries<TextAreaState>(textAreaStateVars, {
          query: { isDisabled: true },
          cursor: 'not-allowed',
        }),
      },
    },
  }),
};
