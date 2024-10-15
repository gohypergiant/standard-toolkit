import {
  createContainer,
  createThemeContract,
  fallbackVar,
  globalStyle,
  style,
} from '@vanilla-extract/css';
import { layers } from '../../styles';
import type { IconClassNames } from './types';

export const iconContainer = createContainer();

export const iconColorVars = createThemeContract({
  color: '',
  fill: '',
  stroke: '',
});

export const iconSpaceVars = createThemeContract({
  width: '',
  height: '',
});

export const iconStateVars = createThemeContract({
  color: '',
  fill: '',
  size: '',
  stroke: '',
});

export const iconClassNames: IconClassNames = {
  container: style({
    '@layer': {
      [layers.components.l1]: {
        containerName: iconContainer,
        display: 'contents',
      },
    },
  }),
  icon: style({
    '@layer': {
      [layers.components.l1]: {
        width: fallbackVar(iconSpaceVars.width, 'auto'),
        height: fallbackVar(iconSpaceVars.height, iconSpaceVars.width, 'auto'),
        color: fallbackVar(iconStateVars.color, iconColorVars.color, 'inherit'),
        fill: fallbackVar(iconStateVars.fill, iconColorVars.fill, 'none'),
        stroke: fallbackVar(iconStateVars.stroke, iconColorVars.stroke, 'none'),
        overflow: 'hidden',
      },
    },
  }),
};

globalStyle(`${iconClassNames.icon} > svg`, {
  '@layer': {
    [layers.components.l1]: {
      width: '100%',
      height: '100%',
    },
  },
});
