import {
  createContainer,
  createThemeContract,
  fallbackVar,
  style,
} from '@vanilla-extract/css';
import { layers, surfaces } from '../../styles';
import { containerQueries } from '../../utils';
import type {
  DrawerClassNames,
  DrawerDialogState,
  DrawerState,
} from './types';

export const drawerContainer = createContainer();

export const drawerAnimationVars = createThemeContract({
  delay: '',
  duration: '',
  easing: '',
});

export const drawerColorVars = createThemeContract({
  background: '',
  color: '',
});

export const drawerSpaceVars = createThemeContract({
  drawer: {
    width: '',
    gap: '',
    x: '',
    y: '',
  },
  list: {
    top: '',
    translateY: '',
  },
});

export const drawerStateVars = createThemeContract({
  anchor: '',
  layoutShift: '',
  isChild: '',
  isOpen: '',
});

export const drawerDialogStateVars = createThemeContract({
  isChild: '',
});

export const drawerClassNames: DrawerClassNames = {
  container: style({
    '@layer': {
      [layers.components.l1]: {
        containerName: drawerContainer,
        display: 'contents',
      },
    },
  }),
  tabs: {
    tabs: style({
      '@layer': {
        [layers.components.l2]: {
          height: '100%',
          display: 'block',
          position: 'relative',
        },
      },
    }),
    list: {
      list: style([
        surfaces.default.proud,
        {
          '@layer': {
            [layers.components.l2]: {
              position: 'absolute',
              top: drawerSpaceVars.list.top,
              transform: `translateY(${fallbackVar(drawerSpaceVars.list.translateY, '0')})`,
              '@container': containerQueries<DrawerState>(
                drawerStateVars,
                {
                  query: { anchor: 'left' },
                  left: '100%',
                },
                {
                  query: { anchor: 'right' },
                  right: '100%',
                },
                {
                  query: { layoutShift: false },
                  transition: `transform ${fallbackVar(drawerAnimationVars.duration, '0ms')} ${fallbackVar(drawerAnimationVars.easing, 'linear')} ${fallbackVar(drawerAnimationVars.delay, '0ms')}`,
                },
                {
                  query: { anchor: 'left', layoutShift: false, isOpen: true },
                  transform: `translateX(${drawerSpaceVars.drawer.width}) translateY(${fallbackVar(drawerSpaceVars.list.translateY, '0')})`,
                },
                {
                  query: { anchor: 'right', layoutShift: false, isOpen: true },
                  transform: `translateX(calc(${drawerSpaceVars.drawer.width} * -1)) translateY(${fallbackVar(drawerSpaceVars.list.translateY, '0')})`,
                },
              ),
            },
          },
        },
      ]),
    },
  },
  dialog: {
    container: style({
      '@layer': {
        [layers.components.l1]: {
          height: '100%',
          '@container': containerQueries<DrawerState>(
            drawerStateVars,
            {
              query: { layoutShift: false },
              width: drawerSpaceVars.drawer.width,
              position: 'absolute',
              transition: `transform ${fallbackVar(drawerAnimationVars.duration, '0ms')} ${fallbackVar(drawerAnimationVars.easing, 'linear')} ${fallbackVar(drawerAnimationVars.delay, '0ms')}`,
              overflow: 'hidden',
              pointerEvents: 'none',
            },
            {
              query: { anchor: 'left', layoutShift: false },
              left: 0,
            },
            {
              query: { anchor: 'right', layoutShift: false },
              right: 0,
            },
            {
              query: { layoutShift: true },
              width: 0,
              overflow: 'hidden',
              transition: `width ${fallbackVar(drawerAnimationVars.duration, '0ms')} ${fallbackVar(drawerAnimationVars.easing, 'linear')} ${fallbackVar(drawerAnimationVars.delay, '0ms')}`,
            },
            {
              query: { layoutShift: true, isOpen: true },
              width: drawerSpaceVars.drawer.width,
            },
          ),
        },
      },
    }),
    dialog: style([
      surfaces.default.proud,
      {
        '@layer': {
          [layers.components.l1]: {
            width: drawerSpaceVars.drawer.width,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: drawerSpaceVars.drawer.gap,
            padding: `${fallbackVar(drawerSpaceVars.drawer.y, '0')} ${fallbackVar(drawerSpaceVars.drawer.x, '0')}`,

            '@container': containerQueries<DrawerState>(
              drawerStateVars,
              {
                query: { layoutShift: false },
                transition: `transform ${fallbackVar(drawerAnimationVars.duration, '0ms')} ${fallbackVar(drawerAnimationVars.easing, 'linear')} ${fallbackVar(drawerAnimationVars.delay, '0ms')}`,
                pointerEvents: 'auto',
              },
              {
                query: { anchor: 'left', layoutShift: false, isOpen: false },
                transform: 'translateX(-100%)',
              },
              {
                query: { anchor: 'right', layoutShift: false, isOpen: false },
                transform: 'translateX(100%)',
              },
            ),
          },
        },
      },
    ]),
  },
  header: {
    header: style({
      '@layer': {
        [layers.components.l1]: {
          display: 'grid',
          gridTemplateAreas: '"back title close"',
          gridTemplateColumns: 'auto 1fr auto',
          gap: drawerSpaceVars.drawer.gap,
          alignItems: 'center',
        },
      },
    }),
    back: {
      container: style({
        '@layer': {
          [layers.components.l2]: {
            gridArea: 'back',
          },
        },
      }),
    },
    title: style({
      '@layer': {
        [layers.components.l1]: {
          marginBottom: 0,
          '@container': containerQueries<DrawerDialogState>(
            drawerDialogStateVars,
            {
              query: { isChild: false },
              gridArea: 'back title',
            },
            {
              query: { isChild: true },
              gridArea: 'title',
              textAlign: 'center',
            },
          ),
        },
      },
    }),
    close: {
      container: style({
        '@layer': {
          [layers.components.l2]: {
            gridArea: 'close',
          },
        },
      }),
    },
  },
  content: style({
    '@layer': {
      [layers.components.l1]: {
        flex: 1,
      },
    },
  }),
  footer: style({
    '@layer': {
      [layers.components.l1]: {
        display: 'flex',
        justifyContent: 'flex-end',
      },
    },
  }),
};
