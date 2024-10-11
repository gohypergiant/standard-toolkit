import {
  createContainer,
  createThemeContract,
  fallbackVar,
  style,
} from '@vanilla-extract/css';
import { layers } from '../../styles';
import { containerQueries } from '../../utils';
import type {
  PickerItemState,
  PickerClassNames,
  PickerState,
} from './types';

export const pickerContainers = {
  list: createContainer(),
  item: createContainer(),
};

export const pickerSpaceVars = createThemeContract({
  gap: '',
});

export const pickerStateVars = createThemeContract({
  columns: '',
  layout: '',
  orientation: '',
  isEmpty: '',
  isFocused: '',
  isFocusVisible: '',
});

export const pickerItemColorVars = createThemeContract({
  background: '',
  border: '',
  color: '',
});

export const pickerItemStateVars = createThemeContract({
  selectionMode: '',
  selectionBehavior: '',
  isDisabled: '',
  isFocused: '',
  isFocusVisible: '',
  isHovered: '',
  isPressed: '',
  isSelected: '',
});

export const pickerClassNames: PickerClassNames = {
  list: {
    container: style({
      '@layer': {
        [layers.components.l1]: {
          containerName: pickerContainers.list,
          display: 'contents',
        },
      },
    }),
    list: style({
      '@layer': {
        [layers.components.l1]: {
          gap: pickerSpaceVars.gap,
          '@container': containerQueries<PickerState>(
            pickerStateVars,
            {
              query: { layout: 'grid' },
              display: 'grid',
              gridTemplateColumns: `repeat(${fallbackVar(pickerStateVars.columns, '1')}, min-content)`,
            },
            {
              query: { layout: 'stack', orientation: 'horizontal' },
              display: 'flex',
              flexDirection: 'row',
            },
            {
              query: { layout: 'stack', orientation: 'vertical' },
              display: 'flex',
              flexDirection: 'column',
            },
          ),
        },
      },
    }),
  },
  item: {
    container: style({
      '@layer': {
        [layers.components.l1]: {
          containerName: pickerContainers.item,
          display: 'contents',
        },
      },
    }),
    item: style({
      '@layer': {
        [layers.components.l1]: {
          border: `1px solid ${fallbackVar(pickerItemColorVars.border, 'transparent')}`,
          background: pickerItemColorVars.background,
          color: pickerItemColorVars.color,
          '@container': containerQueries<PickerItemState>(
            pickerItemStateVars,
            {
              query: { selectionMode: ['single', 'multiple'] },
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
  },
};
