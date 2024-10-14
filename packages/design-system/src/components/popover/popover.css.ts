import {
  createContainer,
  createThemeContract,
  fallbackVar,
  style,
} from '@vanilla-extract/css';
import { layers, radiusVars, surfaces } from '../../styles';
import type { PopoverClassNames } from './types';

export const popoverContainer = createContainer();

export const popoverColorVars = createThemeContract({
  content: {
    color: '',
  },
});

export const popoverSpaceVars = createThemeContract({
  width: '',
  x: '',
  y: '',
  gap: {
    default: '',
    header: {
      after: '',
    },
    content: {
      before: '',
    },
    footer: {
      before: '',
    },
  },
});

export const popoverStateVars = createThemeContract({
  hasHeader: '',
  placement: '',
  isEntering: '',
  isExiting: '',
});

const header = style({
  '@layer': {
    [layers.components.l1]: {
      marginBottom: `calc(${popoverSpaceVars.gap.header.after} - ${popoverSpaceVars.gap.default})`,
    },
  },
});

const content = style({
  '@layer': {
    [layers.components.l1]: {
      color: popoverColorVars.content.color,
    },
  },
});

export const popoverClassNames: PopoverClassNames = {
  popover: {
    container: style({
      '@layer': {
        [layers.components.l1]: {
          containerName: popoverContainer,
          display: 'block',
        },
      },
    }),
    popover: style([
      surfaces.raised.proud,
      {
        '@layer': {
          [layers.components.l1]: {
            width: fallbackVar(popoverSpaceVars.width, '300px'),
            display: 'flex',
            flexDirection: 'column',
            gap: popoverSpaceVars.gap.default,
            padding: `${fallbackVar(popoverSpaceVars.y, '0')} ${fallbackVar(popoverSpaceVars.x, '0')}`,
            borderRadius: radiusVars.md,
          },
        },
      },
    ]),
  },
  header,
  content,
  footer: style({
    '@layer': {
      [layers.components.l1]: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: `calc(${popoverSpaceVars.gap.footer.before} - ${popoverSpaceVars.gap.default})`,
      },
    },
  }),
};
