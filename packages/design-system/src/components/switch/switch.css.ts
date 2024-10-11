import {
  createContainer,
  createThemeContract,
  fallbackVar,
  style,
} from '@vanilla-extract/css';
import { label, layers, radiusVars } from '../../styles';
import { containerQueries } from '../../utils';
import type { SwitchClassNames, SwitchState } from './types';

export const switchContainer = createContainer();

export const switchColorVars = createThemeContract({
  border: '',
  background: '',
  color: '',
  indicator: '',
});

export const switchSpaceVars = createThemeContract({
  diameter: '',
  gutter: '',
  gap: '',
  travel: '',
});

export const switchStateVars = createThemeContract({
  alignInput: '',
  isDisabled: '',
  isFocused: '',
  isFocusVisible: '',
  isHovered: '',
  isPressed: '',
  isReadOnly: '',
  isSelected: '',
});

export const switchClassNames: SwitchClassNames = {
  container: style({
    '@layer': {
      [layers.components.l1]: {
        containerName: switchContainer,
        width: 'fit-content',
        display: 'block',
      },
    },
  }),
  switch: style({
    '@layer': {
      [layers.components.l1]: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: switchSpaceVars.gap,
        color: switchColorVars.color,
        '@container': containerQueries<SwitchState>(
          switchStateVars,
          {
            query: { alignInput: 'start' },
            flexDirection: 'row-reverse',
          },
          {
            query: { alignInput: 'end' },
            flexDirection: 'row',
          },
          {
            query: { isReadOnly: false },
            cursor: 'pointer',
          },
          {
            query: { isDisabled: true },
            cursor: 'not-allowed',
          },
        ),
      },
    },
  }),
  label: style([label]),
  indicator: style({
    '@layer': {
      [layers.components.l1]: {
        display: 'flex',
        alignItems: 'center',
        padding: switchSpaceVars.gutter,
        border: `1px solid ${fallbackVar(switchColorVars.border, 'transparent')}`,
        borderRadius: radiusVars.round,
        background: switchColorVars.background,
        '::before': {
          content: '',
          display: 'block',
          width: switchSpaceVars.diameter,
          height: switchSpaceVars.diameter,
          borderRadius: radiusVars.round,
          margin: `0 ${switchSpaceVars.travel}`,
          background: switchColorVars.indicator,
        },
        '@container': containerQueries<SwitchState>(
          switchStateVars,
          {
            query: { isSelected: false },
            '::before': {
              transform: `translateX(calc(${switchSpaceVars.travel} * -1))`,
            },
          },
          {
            query: { isSelected: true },
            '::before': {
              transform: `translateX(${switchSpaceVars.travel})`,
            },
          },
        ),
      },
    },
  }),
};
