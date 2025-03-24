/*
 * Copyright 2025 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {
  createContainer,
  createThemeContract,
  fallbackVar,
  style,
} from '@vanilla-extract/css';
import { layers, surfaces } from '../../styles';
import { containerQueries } from '../../utils';
import type { DrawerClassNames, DrawerDialogState, DrawerState } from './types';

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
        overflowY: 'auto',
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
