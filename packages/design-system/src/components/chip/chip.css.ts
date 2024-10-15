import {
  createContainer,
  createThemeContract,
  fallbackVar,
  style,
} from '@vanilla-extract/css';
import { layers, radiusVars } from '../../styles';
import { containerQueries } from '../../utils';
import type { ChipClassNames, ChipState } from './types';

export const chipContainer = createContainer();

export const chipColorVars = createThemeContract({
  background: '',
  border: '',
  color: '',
});

export const chipSpaceVars = createThemeContract({
  list: {
    gap: '',
  },
  chip: {
    gap: '',
    x: '',
    y: '',
  },
});

export const chipStateVars = createThemeContract({
  color: '',
  size: '',
  allowsRemoving: '',
  selectionBehavior: '',
  selectionMode: '',
  isDisabled: '',
  isFocused: '',
  isFocusVisible: '',
  isHovered: '',
  isPressed: '',
  isSelected: '',
});

export const chipClassNames: ChipClassNames = {
  list: style({
    '@layer': {
      [layers.components.l1]: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: chipSpaceVars.list.gap,
      },
    },
  }),
  container: style({
    '@layer': {
      [layers.components.l1]: {
        containerName: chipContainer,
        display: 'contents',
      },
    },
  }),
  chip: style({
    '@layer': {
      [layers.components.l1]: {
        width: 'fit-content',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: `1px solid ${fallbackVar(chipColorVars.border, 'transparent')}`,
        borderRadius: radiusVars.round,
        background: fallbackVar(chipColorVars.background, 'none'),
        color: fallbackVar(chipColorVars.color, 'currentcolor'),
        overflow: 'hidden',
      },
    },
  }),
  label: style({
    '@layer': {
      [layers.components.l1]: {
        display: 'flex',
        gap: chipSpaceVars.chip.gap,
        padding: `${chipSpaceVars.chip.y} ${chipSpaceVars.chip.x}`,
        border: 'none',
        background: 'none',
        color: 'currentcolor',
        '@container': containerQueries<ChipState>(
          chipStateVars,
          {
            query: { allowsRemoving: true },
            paddingRight: chipSpaceVars.chip.y,
          },
          {
            query: { selectionMode: ['single', 'multiple'] },
            cursor: 'pointer',
          },
          {
            query: {
              isDisabled: true,
            },
            cursor: 'not-allowed',
          },
        ),
      },
    },
  }),
  remove: style({
    '@layer': {
      [layers.components.l1]: {
        padding: chipSpaceVars.chip.y,
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        color: 'currentcolor',
        '@container': containerQueries<ChipState>(
          chipStateVars,
          {
            query: { isDisabled: true },
            cursor: 'not-allowed',
          },
          {
            query: { operator: 'or', isFocused: true, isFocusVisible: true },
            outline: 'none',
          },
        ),
      },
    },
  }),
};
