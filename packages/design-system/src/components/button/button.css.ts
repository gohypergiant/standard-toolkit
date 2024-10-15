import {
  createContainer,
  createThemeContract,
  fallbackVar,
  style,
} from '@vanilla-extract/css';
import { layers, radiusVars } from '../../styles';
import { containerQueries } from '../../utils';
import type { ButtonClassNames, ButtonState } from './types';

export const buttonContainer = createContainer();

export const buttonColorVars = createThemeContract({
  // Mapped
  nonSolidColor: '',
  bareBackground: '',
  hollowBorder: '',
  solidBackground: '',
  solidColor: '',

  // Overrides
  background: '',
  border: '',
  color: '',
});

export const buttonSpaceVars = createThemeContract({
  gap: '',
  minWidth: '',
  width: '',
  x: '',
  y: '',
});

export const buttonStateVars = createThemeContract({
  color: '',
  size: '',
  variant: '',
  isCurrent: '',
  isDisabled: '',
  isFocused: '',
  isFocusVisible: '',
  isHovered: '',
  isPending: '',
  isPressed: '',
  isSelected: '',
});

export const buttonClassNames: ButtonClassNames = {
  container: style({
    '@layer': {
      [layers.components.l1]: {
        containerName: buttonContainer,
        width: fallbackVar(buttonSpaceVars.width, 'fit-content'),
        display: 'block',
        background: 'none',
        padding: 0,
        border: 0,
        textDecoration: 'none',
        color: 'currentcolor',
      },
    },
  }),
  button: style({
    '@layer': {
      [layers.components.l1]: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: buttonSpaceVars.gap,
        minWidth: fallbackVar(buttonSpaceVars.minWidth, 'auto'),
        width: fallbackVar(buttonSpaceVars.width, 'fit-content'),
        padding: `${fallbackVar(buttonSpaceVars.y, '0')} ${fallbackVar(buttonSpaceVars.x, '0')}`,
        border: `1px solid ${fallbackVar(buttonColorVars.border, 'transparent')}`,
        borderRadius: radiusVars.md,
        background: fallbackVar(
          buttonColorVars.background,
          buttonColorVars.bareBackground,
          'none',
        ),
        fontWeight: 700,
        color: fallbackVar(
          buttonColorVars.color,
          buttonColorVars.nonSolidColor,
        ),
        cursor: 'pointer',
        '@container': containerQueries<ButtonState>(
          buttonStateVars,
          {
            query: { variant: ['icon', 'floating'] },
            minWidth: 'auto',
          },
          {
            query: { variant: 'floating' },
            borderRadius: radiusVars.round,
          },
          {
            query: { variant: ['floating', 'hollow'] },
            borderColor: fallbackVar(
              buttonColorVars.border,
              buttonColorVars.hollowBorder,
            ),
            background: fallbackVar(buttonColorVars.background, 'transparent'),
          },
          {
            query: { variant: 'solid' },
            background: fallbackVar(
              buttonColorVars.background,
              buttonColorVars.solidBackground,
            ),
            color: fallbackVar(
              buttonColorVars.color,
              buttonColorVars.solidColor,
            ),
          },
          {
            query: { isDisabled: true },
            cursor: 'not-allowed',
          },
        ),
      },
    },
  }),
};
