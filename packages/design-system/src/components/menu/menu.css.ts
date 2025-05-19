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
import { layers } from '../../styles/layers.css';
import { surfaces } from '../../styles/surfaces.css';
import { radiusVars, sizeVars, zIndexVars } from '../../styles/theme.css';
import { containerQueries } from '../../utils/css';
import type { MenuClassNames, MenuItemState } from './types';

export const menuContainers = {
  menu: createContainer(),
  list: createContainer(),
  item: createContainer(),
};

export const menuStateVars = createThemeContract({
  placement: '',
  size: '',
  isExiting: '',
  isEntering: '',
});

export const menuItemStateVars = createThemeContract({
  selectionMode: '',
  selectionBehavior: '',
  size: '',
  hasDescription: '',
  hasSubmenu: '',
  isOpen: '',
  isDisabled: '',
  isHovered: '',
  isPressed: '',
  isSelected: '',
  isFocused: '',
  isFocusVisible: '',
});

export const menuColorVars = createThemeContract({
  list: {
    background: '',
    border: '',
    color: '',
  },
  header: {
    background: '',
    border: '',
    color: '',
  },
  separator: '',
  item: {
    background: '',
    border: '',
    color: '',
  },
  label: '',
  description: '',
});

export const menuSpaceVars = createThemeContract({
  menu: {
    minWidth: '',
    x: '',
    y: '',
  },
  list: {
    x: '',
    y: '',
  },
  section: {
    x: '',
    y: '',
  },
  header: {
    x: '',
    y: '',
  },
  separator: {
    x: '',
    y: '',
  },
  item: {
    x: '',
    y: '',
    gap: '',
  },
});

export const menuClassNames: MenuClassNames = {
  menu: {
    container: style({
      '@layer': {
        [layers.components.l1]: {
          containerName: menuContainers.menu,
          display: 'block',
          zIndex: `${zIndexVars.popover} !important`, // Need to override inline style set by React Aria
        },
      },
    }),
    menu: style([
      surfaces.overlay.proud,
      {
        '@layer': {
          [layers.components.l1]: {
            minWidth: fallbackVar(
              menuSpaceVars.menu.minWidth,
              'var(--trigger-width)', // Provided by React Aria Menu: https://react-spectrum.adobe.com/react-aria/Menu.html
            ),
            padding: `${fallbackVar(menuSpaceVars.menu.y, '0')} ${fallbackVar(menuSpaceVars.menu.x, '0')}`,
            borderRadius: radiusVars.sm,
          },
        },
      },
    ]),
  },
  list: {
    container: style({
      '@layer': {
        [layers.components.l1]: {
          containerName: menuContainers.list,
          display: 'block',
        },
      },
    }),
    list: style({
      '@layer': {
        [layers.components.l2]: {
          display: 'flex',
          flexDirection: 'column',
          background: menuColorVars.list.background,
          padding: `${fallbackVar(menuSpaceVars.list.y, sizeVars.v03)} ${fallbackVar(menuSpaceVars.list.x, '0')}`,
          border: `1px solid ${fallbackVar(menuColorVars.list.border, 'transparent')}`,
          borderRadius: radiusVars.sm,
        },
      },
    }),
    section: style({
      '@layer': {
        [layers.components.l1]: {
          padding: `${fallbackVar(menuSpaceVars.section.y, '0')} ${fallbackVar(menuSpaceVars.section.x, '0')}`,
        },
      },
    }),
    header: style({
      '@layer': {
        [layers.components.l1]: {
          padding: `${fallbackVar(menuSpaceVars.header.y, menuSpaceVars.item.y, '0')} ${fallbackVar(menuSpaceVars.header.x, menuSpaceVars.item.x, '0')}`,
          border: '1px solid transparent',
          background: menuColorVars.header.background,
          color: menuColorVars.header.color,
        },
      },
    }),
    separator: style({
      '@layer': {
        [layers.components.l1]: {
          height: 1,
          margin: `${fallbackVar(menuSpaceVars.separator.y, '0')} ${fallbackVar(menuSpaceVars.separator.x, '0')}`,
          background: menuColorVars.separator,
        },
      },
    }),
  },
  item: {
    container: style({
      '@layer': {
        [layers.components.l1]: {
          containerName: menuContainers.item,
        },
      },
    }),
    item: style({
      '@layer': {
        [layers.components.l1]: {
          display: 'grid',
          gridTemplateAreas:
            '"icon label space action" "icon description space action"',
          gridTemplateColumns: 'auto auto 1fr auto',
          gridTemplateRows: 'auto auto',
          alignItems: 'center',
          gap: menuSpaceVars.item.gap,
          padding: `${fallbackVar(menuSpaceVars.item.y, '0')} ${fallbackVar(menuSpaceVars.item.x, '0')}`,
          border: `1px solid ${fallbackVar(menuColorVars.item.border, 'transparent')}`,
          background: menuColorVars.item.background,
          color: menuColorVars.item.color,
          cursor: 'pointer',
          '@container': containerQueries<MenuItemState>(menuItemStateVars, {
            query: { isDisabled: true },
            cursor: 'not-allowed',
          }),
        },
      },
    }),
    icon: {
      icon: style({
        '@layer': {
          [layers.components.l2]: {
            gridArea: 'icon',
          },
        },
      }),
    },
    label: style({
      '@layer': {
        [layers.components.l1]: {
          gridArea: 'label',
          color: menuColorVars.label,
          '@container': containerQueries<MenuItemState>(menuItemStateVars, {
            query: { hasDescription: false },
            gridRowStart: 'label',
            gridRowEnd: 'description',
          }),
        },
      },
    }),
    description: style({
      '@layer': {
        [layers.components.l1]: {
          gridArea: 'description',
          color: fallbackVar(menuColorVars.description, menuColorVars.label),
        },
      },
    }),
    more: {
      icon: style({
        '@layer': {
          [layers.components.l2]: {
            gridArea: 'action',
          },
        },
      }),
    },
    shortcut: style({
      '@layer': {
        [layers.components.l1]: {
          gridArea: 'action',
        },
      },
    }),
  },
};
