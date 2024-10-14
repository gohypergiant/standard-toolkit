import {
  createContainer,
  createThemeContract,
  fallbackVar,
  style,
} from '@vanilla-extract/css';
import { layers, radiusVars, surfaces } from '../../styles';
import { containerQueries } from '../../utils';
import type { OptionsClassNames, OptionsItemState } from './types';

export const optionsContainers = {
  options: createContainer(),
  list: createContainer(),
  item: createContainer(),
};

export const optionsStateVars = createThemeContract({
  size: '',
  isEntering: '',
  isExiting: '',
  placement: '',
});

export const optionsListStateVars = createThemeContract({
  size: '',
  isEmpty: '',
  isFocused: '',
  isFocusVisible: '',
});

export const optionsItemStateVars = createThemeContract({
  selectionBehavior: '',
  selectionMode: '',
  size: '',
  hasDescription: '',
  isDisabled: '',
  isHovered: '',
  isPressed: '',
  isSelected: '',
  isFocused: '',
  isFocusVisible: '',
});

export const optionsColorVars = createThemeContract({
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

export const optionsSpaceVars = createThemeContract({
  options: {
    minWidth: '',
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

export const optionsClassNames: OptionsClassNames = {
  options: {
    container: style({
      '@layer': {
        [layers.components.l1]: {
          containerName: optionsContainers.options,
          display: 'block',
        },
      },
    }),
    options: style([
      surfaces.overlay.proud,
      {
        '@layer': {
          [layers.components.l1]: {
            minWidth: fallbackVar(
              optionsSpaceVars.options.minWidth,
              'var(--trigger-width)', // Provided by React Aria Popover: https://react-spectrum.adobe.com/react-aria/Select.html
            ),
            padding: `${fallbackVar(optionsSpaceVars.options.y, '0')} ${fallbackVar(optionsSpaceVars.options.x, '0')}`,
          },
        },
      },
    ]),
  },
  list: {
    container: style({
      '@layer': {
        [layers.components.l1]: {
          containerName: optionsContainers.list,
          display: 'contents',
        },
      },
    }),
    list: style({
      '@layer': {
        [layers.components.l1]: {
          display: 'flex',
          flexDirection: 'column',
          background: optionsColorVars.list.background,
          border: `1px solid ${fallbackVar(optionsColorVars.list.border, 'transparent')}`,
          borderRadius: radiusVars.sm,
        },
      },
    }),
    section: style({
      '@layer': {
        [layers.components.l1]: {
          padding: `${fallbackVar(optionsSpaceVars.section.y, '0')} ${fallbackVar(optionsSpaceVars.section.x, '0')}`,
        },
      },
    }),
    header: style({
      '@layer': {
        [layers.components.l1]: {
          padding: `${fallbackVar(optionsSpaceVars.header.y, optionsSpaceVars.item.y, '0')} ${fallbackVar(optionsSpaceVars.header.x, optionsSpaceVars.item.x, '0')}`,
          border: '1px solid transparent',
          background: optionsColorVars.header.background,
          color: optionsColorVars.header.color,
        },
      },
    }),
    separator: style({
      '@layer': {
        [layers.components.l1]: {
          height: 1,
          margin: `${fallbackVar(optionsSpaceVars.separator.y, '0')} ${fallbackVar(optionsSpaceVars.separator.x, '0')}`,
          background: optionsColorVars.separator,
        },
      },
    }),
  },
  item: {
    container: style({
      '@layer': {
        [layers.components.l1]: {
          containerName: optionsContainers.item,
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
          gap: optionsSpaceVars.item.gap,
          padding: `${fallbackVar(optionsSpaceVars.item.y, '0')} ${fallbackVar(optionsSpaceVars.item.x, '0')}`,
          border: `1px solid ${fallbackVar(optionsColorVars.item.border, 'transparent')}`,
          background: optionsColorVars.item.background,
          color: optionsColorVars.item.color,
          cursor: 'pointer',
          '@container': containerQueries<OptionsItemState>(
            optionsItemStateVars,
            {
              query: { isDisabled: true },
              cursor: 'not-allowed',
            },
          ),
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
          color: optionsColorVars.label,
          '@container': containerQueries<OptionsItemState>(
            optionsItemStateVars,
            {
              query: { hasDescription: false },
              gridRowStart: 'label',
              gridRowEnd: 'description',
            },
          ),
        },
      },
    }),
    description: style({
      '@layer': {
        [layers.components.l1]: {
          gridArea: 'description',
          color: fallbackVar(
            optionsColorVars.description,
            optionsColorVars.label,
          ),
        },
      },
    }),
    shortcut: style({
      '@layer': {
        [layers.components.l1]: {
          gridArea: 'action',
        },
      },
    }),
  },
};
