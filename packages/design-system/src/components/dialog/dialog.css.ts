import {
  createContainer,
  createThemeContract,
  fallbackVar,
  style,
} from '@vanilla-extract/css';
import { layers, radiusVars, surfaces, zIndexVars } from '../../styles';
import { containerQueries } from '../../utils';
import type { DialogClassNames, DialogState } from './types';

export const dialogContainer = createContainer();

export const dialogColorVars = createThemeContract({
  overlay: '',
  content: {
    color: '',
  },
});

export const dialogSpaceVars = createThemeContract({
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

export const dialogStateVars = createThemeContract({
  hasHeader: '',
  size: '',
  isEntering: '',
  isExiting: '',
  isGlobal: '',
  isOpen: '',
});

const header = style({
  '@layer': {
    [layers.components.l1]: {
      marginBottom: `calc(${dialogSpaceVars.gap.header.after} - ${dialogSpaceVars.gap.default})`,
    },
  },
});

const content = style({
  '@layer': {
    [layers.components.l1]: {
      color: dialogColorVars.content.color,
    },
  },
});

export const dialogClassNames: DialogClassNames = {
  portal: style({
    '@layer': {
      [layers.components.l1]: {
        display: 'contents',
      },
    },
  }),
  container: style({
    '@layer': {
      [layers.components.l1]: {
        containerName: dialogContainer,
        display: 'contents',
        '::before': {
          content: '',
          width: '100%',
          height: 'var(--visual-viewport-height)', // Provided by React Aria Modal Overlay: https://react-spectrum.adobe.com/react-aria/Modal.html#modaloverlay
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: zIndexVars.dialog,
          background: dialogColorVars.overlay,
        },
      },
    },
  }),
  modal: style({
    position: 'fixed',
    top: '50%',
    left: '50%',
    zIndex: zIndexVars.dialog,
    transform: 'translate(-50%, -50%)',
    '@container': containerQueries<DialogState>(dialogStateVars, {
      query: { isGlobal: false },
      position: 'absolute',
    }),
  }),
  dialog: style([
    surfaces.raised.proud,
    {
      '@layer': {
        [layers.components.l1]: {
          width: fallbackVar(dialogSpaceVars.width, '300px'),
          display: 'flex',
          flexDirection: 'column',
          gap: dialogSpaceVars.gap.default,
          padding: `${fallbackVar(dialogSpaceVars.y, '0')} ${fallbackVar(dialogSpaceVars.x, '0')}`,
          borderRadius: radiusVars.md,
        },
      },
    },
  ]),
  header,
  content,
  footer: style({
    '@layer': {
      [layers.components.l1]: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: `calc(${dialogSpaceVars.gap.footer.before} - ${dialogSpaceVars.gap.default})`,
      },
    },
  }),
};
